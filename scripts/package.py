"""Build a dependency-free single-SCO SCORM 1.2 package and verify contents."""
from pathlib import Path
import base64
import hashlib
import json
import shutil
import zipfile
import xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parents[1]
APP = ROOT / 'app'
DIST = ROOT / 'dist'
NS = 'http://www.imsproject.org/xsd/imscp_rootv1p1p2'
ADL = 'http://www.adlnet.org/xsd/adlcp_rootv1p2'
ET.register_namespace('', NS)
ET.register_namespace('adlcp', ADL)

def tag(name):
    return f'{{{NS}}}{name}'

def build():
    DIST.mkdir(exist_ok=True)
    # Downloadable standalone demo: all runtime assets embedded in one HTML file.
    image_uri = 'data:image/png;base64,' + base64.b64encode((APP / 'assets/vila.png').read_bytes()).decode('ascii')
    css = (APP / 'styles.css').read_text().replace("url('./assets/vila.png')", "url('" + image_uri + "')")
    html = (APP / 'index.html').read_text().replace('<link rel="stylesheet" href="./styles.css">', '<style>' + css + '</style>')
    scripts = []
    for name in ['config.js', 'rules.js', 'scorm.js', 'app.js']:
        html = html.replace(f'<script src="./{name}" defer></script>', '')
        js = (APP / name).read_text()
        if name == 'app.js':
            js = js.replace('./assets/vila.png', image_uri)
        assert '</script' not in js.lower()
        scripts.append('<script>' + js + '</script>')
    html = html.replace('</body>', '\n'.join(scripts) + '\n</body>')
    demo = DIST / 'vila-do-ed-demonstracao.html'
    demo.write_text('\n'.join(line.rstrip() for line in html.splitlines()) + '\n', encoding='utf-8')
    site = DIST / 'site'
    if site.exists():
        shutil.rmtree(site)
    shutil.copytree(APP, site)
    files = sorted(p.relative_to(site).as_posix() for p in site.rglob('*') if p.is_file())
    manifest = ET.Element(tag('manifest'), {'identifier': 'VILA_ED_2026', 'version': '1.0'})
    metadata = ET.SubElement(manifest, tag('metadata'))
    ET.SubElement(metadata, tag('schema')).text = 'ADL SCORM'
    ET.SubElement(metadata, tag('schemaversion')).text = '1.2'
    orgs = ET.SubElement(manifest, tag('organizations'), {'default': 'ORG_VILA'})
    org = ET.SubElement(orgs, tag('organization'), {'identifier': 'ORG_VILA'})
    ET.SubElement(org, tag('title')).text = 'Vila do ED — Semana Tributária 2026'
    item = ET.SubElement(org, tag('item'), {'identifier': 'ITEM_VILA', 'identifierref': 'SCO_VILA', 'isvisible': 'true'})
    ET.SubElement(item, tag('title')).text = 'Emissão educacional de notas fiscais'
    resources = ET.SubElement(manifest, tag('resources'))
    resource = ET.SubElement(resources, tag('resource'), {'identifier': 'SCO_VILA', 'type': 'webcontent', f'{{{ADL}}}scormtype': 'sco', 'href': 'index.html'})
    for name in files:
        ET.SubElement(resource, tag('file'), {'href': name})
    ET.indent(manifest)
    ET.ElementTree(manifest).write(site / 'imsmanifest.xml', encoding='utf-8', xml_declaration=True)
    archive = DIST / 'vila-do-ed-scorm12.zip'
    with zipfile.ZipFile(archive, 'w', zipfile.ZIP_DEFLATED) as z:
        for p in sorted(site.rglob('*')):
            if p.is_file():
                info = zipfile.ZipInfo(p.relative_to(site).as_posix(), (2026, 11, 3, 0, 0, 0))
                info.compress_type = zipfile.ZIP_DEFLATED
                info.external_attr = 0o644 << 16
                z.writestr(info, p.read_bytes())
    report = verify(archive)
    report['sha256'] = hashlib.sha256(archive.read_bytes()).hexdigest()
    (DIST / 'package-verification.json').write_text(json.dumps(report, ensure_ascii=False, indent=2) + '\n')
    # Separate hand-off archive: editable sources, docs, runtime ZIP and available evidence.
    source_files = [ROOT / name for name in ['README.md', 'package.json', '.gitignore']]
    for folder in ['app', 'scripts', 'tests', 'docs', 'test-results']:
        source_files.extend(p for p in (ROOT / folder).rglob('*') if p.is_file() and '__pycache__' not in p.parts)
    source_files += [archive, demo, DIST / 'package-verification.json']
    with zipfile.ZipFile(DIST / 'vila-do-ed-projeto.zip', 'w', zipfile.ZIP_DEFLATED) as z:
        for p in sorted(source_files):
            info = zipfile.ZipInfo('vila-do-ed/' + p.relative_to(ROOT).as_posix(), (2026, 11, 3, 0, 0, 0))
            info.compress_type = zipfile.ZIP_DEFLATED
            info.external_attr = 0o644 << 16
            z.writestr(info, p.read_bytes())
    print(json.dumps(report, ensure_ascii=False, indent=2))

def verify(archive):
    with zipfile.ZipFile(archive) as z:
        assert z.testzip() is None, 'ZIP CRC failure'
        names = set(z.namelist())
        assert 'imsmanifest.xml' in names
        assert all(not x.startswith('/') and '..' not in x.split('/') for x in names)
        root = ET.fromstring(z.read('imsmanifest.xml'))
        assert root.tag == tag('manifest')
        assert root.find(tag('metadata')).find(tag('schemaversion')).text == '1.2'
        resources = root.find(tag('resources')).findall(tag('resource'))
        assert len(resources) == 1
        resource = resources[0]
        assert resource.attrib[f'{{{ADL}}}scormtype'] == 'sco'
        assert resource.attrib['href'] == 'index.html'
        declared = {x.attrib['href'] for x in resource.findall(tag('file'))}
        assert declared == names - {'imsmanifest.xml'}, 'Incomplete manifest file list'
        assert resource.attrib['href'] in declared
        orgs = root.find(tag('organizations'))
        org = orgs.find(tag('organization'))
        assert orgs.attrib['default'] == org.attrib['identifier']
        assert org.find(tag('item')).attrib['identifierref'] == resource.attrib['identifier']
        for name in names:
            if name.endswith(('.html', '.css', '.js')):
                text = z.read(name).decode('utf-8')
                assert 'https://' not in text and 'http://' not in text, f'External runtime dependency in {name}'
        return {'archive': archive.name, 'files': len(names), 'single_sco': True, 'entry': 'index.html', 'manifest_references_complete': True, 'crc_valid': True, 'external_runtime_urls': 0}

if __name__ == '__main__':
    build()
