"""Functional tests against the actual packaged SCO in Chromium, without a real LMS."""
import functools
import http.server
import json
from pathlib import Path
import threading
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[1]
RESULTS = ROOT / 'test-results'
RESULTS.mkdir(exist_ok=True)
HARNESS = '''<!doctype html><html lang="pt-BR"><title>SCORM test harness</title><script>
const data=JSON.parse(sessionStorage.getItem('lms-data')||'{}');window.data=data;window.calls=[];window.fail='';let error='0';
const persist=()=>sessionStorage.setItem('lms-data',JSON.stringify(data));
window.API={
 LMSInitialize(){calls.push(['initialize']);error='0';return 'true'},
 LMSGetLastError(){return error},
 LMSGetValue(k){error='0';if(k==='cmi.core.entry')return data['cmi.suspend_data']?'resume':'ab-initio';return data[k]||''},
 LMSSetValue(k,v){calls.push([k,v]);error=fail===k?'101':'0';if(error!=='0')return 'false';data[k]=v;return 'true'},
 LMSCommit(){calls.push(['commit']);error=fail==='commit'?'101':'0';if(error!=='0')return 'false';persist();return 'true'},
 LMSFinish(){calls.push(['finish']);error='0';persist();return 'true'}
};</script><iframe title="Atividade" src="/index.html" style="width:100%;height:95vh;border:0"></iframe></html>'''

class Handler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        if self.path == '/lms.html':
            body=HARNESS.encode(); self.send_response(200);self.send_header('Content-Type','text/html;charset=utf-8');self.send_header('Content-Length',str(len(body)));self.end_headers();self.wfile.write(body)
        else:
            super().do_GET()
    def log_message(self, *args):
        pass

def choose(page, merchant):
    page.get_by_role('button', name='Escolher empresário').click()
    assert page.locator('.merchant-card').count()==3
    page.locator(f'[data-merchant="{merchant}"]').click()

def fill(page, merchant):
    if merchant=='bene':
        for key,value in [('cnae','1622699'),('ctn','141301'),('nbs','101075000'),('issWithheld','nao')]:page.locator('#'+key).select_option(value)
    else:
        products={'ze':['concreto','tabua'],'tina':['concreto']}[merchant]
        for i,product in enumerate(products):page.locator(f'#product-{i}').select_option(product)
    page.locator('#reviewed').check()

def assert_no_reform_questions(page):
    assert page.locator('#cst,#classTrib').count()==0
    assert page.get_by_role('heading',name='Classificação de IBS e CBS').count()==0

def run():
    from PIL import Image
    # Check genuine transparency and margins around every complete cutout, without editing the image.
    image=Image.open(ROOT/'app/assets/personagens.png');assert image.mode=='RGBA' and image.size==(1536,1024)
    assert image.getpixel((0,0))[3]==0
    alpha=image.getchannel('A');pixels=alpha.load()
    for left,right in [(0,540),(540,1052),(1052,1536)]:
        points=[(x,y) for y in range(image.height) for x in range(left,right) if pixels[x,y]>16]
        assert min(x for x,y in points)>left+4 and max(x for x,y in points)<right-4
        assert min(y for x,y in points)>10 and max(y for x,y in points)<image.height-10
    class WithDemo(Handler):
        def do_GET(self):
            if self.path=='/demo.html':
                body=(ROOT/'dist/vila-do-ed-demonstracao.html').read_bytes();self.send_response(200);self.send_header('Content-Type','text/html;charset=utf-8');self.send_header('Content-Length',str(len(body)));self.end_headers();self.wfile.write(body)
            else:super().do_GET()
    server=http.server.ThreadingHTTPServer(('127.0.0.1',0),functools.partial(WithDemo,directory=str(ROOT/'dist/site')))
    threading.Thread(target=server.serve_forever,daemon=True).start();url=f'http://127.0.0.1:{server.server_port}'
    checks=[];errors=[];external=[]
    try:
        with sync_playwright() as p:
            browser=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox'])
            def context(**kwargs):
                ctx=browser.new_context(**kwargs);ctx.on('page',lambda page:page.on('pageerror',lambda e:errors.append(str(e))))
                ctx.route('**/*',lambda route:route.continue_() if route.request.url.startswith(url) or route.request.url.startswith('data:') else (external.append(route.request.url),route.abort()));return ctx
            ctx=context(viewport={'width':1440,'height':1000},reduced_motion='reduce');page=ctx.new_page();page.goto(url)
            assert 'Tina produz concreto' in page.locator('.hero-copy').inner_text()
            page.screenshot(path=str(RESULTS/'desktop-opening.png'),full_page=True)
            page.get_by_role('button',name='Escolher empresário').click();assert page.locator('.character-cutout').count()==3
            for index,actor in enumerate(['ze','tina','bene']):
                cutout=page.locator('.character-cutout').nth(index)
                assert cutout.locator('image').get_attribute('clip-path')==f'url(#character-clip-{actor})'
                assert cutout.locator('clipPath rect').get_attribute('width')==cutout.get_attribute('viewBox').split()[2]
            assert 'Indústria' in page.locator('.merchant-card').nth(1).inner_text()
            assert page.locator('.merchant-card').nth(2).get_by_role('img').get_attribute('aria-label')=='Bené Tronco, de corpo inteiro'
            page.screenshot(path=str(RESULTS/'character-selection.png'),full_page=True)
            page.locator('[data-merchant="ze"]').click();assert_no_reform_questions(page)
            assert page.locator('#ctn,#nbs,#issWithheld').count()==0
            assert page.locator('#cnae-reference').get_attribute('readonly') is not None
            assert '4744-0/99' in page.locator('#cnae-reference').input_value()
            assert page.locator('#product-0 option').count()==8
            assert page.locator('#recipient').input_value()=='Associação da Praça'
            page.get_by_role('button',name='Emitir nota simulada').click();assert page.locator('[aria-invalid="true"]').count()>=2
            fill(page,'ze');page.locator('#product-0').select_option('pocao');page.locator('#reviewed').check()
            page.get_by_role('button',name='Conferir nota').click();assert page.locator('#product-0').get_attribute('aria-invalid')=='true'
            assert page.locator('#product-1').input_value()=='tabua'
            fill(page,'ze');page.locator('#quantity-0').fill('3');assert not page.locator('#reviewed').is_checked()
            page.locator('#reviewed').check();page.get_by_role('button',name='Conferir nota').click();assert page.locator('#quantity-0').get_attribute('aria-invalid')=='true'
            page.locator('#quantity-0').fill('4');fill(page,'ze');page.get_by_role('button',name='Conferir nota').click();assert 'Tudo certo' in page.locator('#validation').inner_text()
            page.evaluate('document.activeElement.blur();window.scrollTo(0,0)');page.screenshot(path=str(RESULTS/'commerce-form.png'),full_page=True)
            page.evaluate("document.querySelector('#invoice').requestSubmit();document.querySelector('main').dispatchEvent(new Event('submit',{bubbles:true,cancelable:true}))")
            assert page.get_by_role('heading',name='Nota emitida!',exact=True).is_visible();assert '232,50' in page.locator('.receipt .total-row').inner_text()
            assert 'CTN' not in page.locator('.classification-summary').inner_text()
            state=page.evaluate("JSON.parse(localStorage.getItem('vila-ed-demo-v1'))");assert state['v']==3 and state['completed'] and state['contributions']==1 and state['first']['merchant']=='ze'
            page.screenshot(path=str(RESULTS/'desktop-receipt.png'),full_page=True);page.reload();assert page.get_by_role('heading',name='Nota emitida!',exact=True).is_visible()
            page.get_by_role('button',name='Ajudar outro empresário').click();page.locator('[data-merchant="tina"]').click();assert_no_reform_questions(page)
            assert page.locator('#ctn,#nbs,#issWithheld').count()==0
            assert 'Indústria' in page.locator('.issuer').inner_text() and '2330-3/05' in page.locator('#cnae-reference').input_value()
            assert page.locator('#product-0 option').count()==2
            assert '3 unidades de pedra e 6 segundos' in page.locator('.context').inner_text()
            fill(page,'tina');page.get_by_role('button',name='Emitir nota simulada').click();assert '228,00' in page.locator('.receipt .total-row').inner_text()
            state=page.evaluate("JSON.parse(localStorage.getItem('vila-ed-demo-v1'))");assert state['contributions']==1 and state['first']['merchant']=='ze'
            checks+=['transparent full-body selection: each character has complete margins and transparent surroundings; three SVG viewports display the isolated figures', 'Zé: seven-product catalog, fixed client, fictional item and wrong quantity rejected without losing other work; corrected sale R$ 232,50', 'Tina: factory production and own concrete sale, fixed industrial CNAE, only concrete, no CTN/NBS/ISS; sale R$ 228,00', 'no CST/cClassTrib questions on any route; one completed sale suffices; duplicate submit and optional exploration preserve first contribution']
            mobile=context(viewport={'width':390,'height':844},is_mobile=True,has_touch=True,reduced_motion='reduce');mp=mobile.new_page();mp.goto(url)
            mp.get_by_role('button',name='Escolher empresário').click();assert mp.locator('.portrait').nth(0).bounding_box()['height']>=280
            assert mp.evaluate('document.documentElement.scrollWidth<=innerWidth');mp.screenshot(path=str(RESULTS/'mobile-selection.png'),full_page=True)
            mp.locator('[data-merchant="bene"]').click();assert_no_reform_questions(mp)
            assert mp.locator('#ctn').is_disabled() and mp.locator('#nbs').is_disabled()
            assert 'madeira' in mp.locator('#description').input_value() and 'tábuas' in mp.locator('#description').input_value()
            assert '2 unidades de madeira' in mp.locator('.context').inner_text()
            mp.locator('#amount').scroll_into_view_if_needed();mp.get_by_role('link',name='Consultar pedido').click();assert mp.locator('#order-mobile').bounding_box()['y']<100
            fill(mp,'bene');mp.locator('#ctn').select_option('141302');assert mp.locator('#nbs').input_value()==''
            mp.locator('#nbs').select_option('101075000');mp.locator('#reviewed').check();mp.get_by_role('button',name='Conferir nota').click();assert mp.locator('#ctn').get_attribute('aria-invalid')=='true'
            fill(mp,'bene');mp.locator('#issWithheld').select_option('sim');mp.locator('#reviewed').check();mp.get_by_role('button',name='Conferir nota').click();assert mp.locator('#issWithheld').get_attribute('aria-invalid')=='true'
            fill(mp,'bene');mp.locator('#cnae').select_option('3329501');assert mp.locator('#ctn').input_value()=='' and mp.locator('#nbs').is_disabled();assert mp.locator('#amount').input_value()=='150,00'
            fill(mp,'bene');mp.screenshot(path=str(RESULTS/'mobile-form.png'),full_page=True);mp.get_by_role('button',name='Emitir nota simulada').click()
            assert '150,00' in mp.locator('.receipt .total-row').inner_text();assert '14.13.01' in mp.locator('.classification-summary').inner_text();assert 'ISS retido' in mp.locator('.classification-summary').inner_text()
            assert mp.evaluate('document.documentElement.scrollWidth<=innerWidth')
            checks+=['mobile: full-body cards without horizontal overflow; Bené wood-processing service only; CNAE/CTN/NBS dependencies, ISS decision and R$ 150,00 validated; request remains reachable']
            lp=ctx.new_page();lp.goto(url+'/lms.html');frame=lp.frames[1];assert lp.evaluate("data['cmi.core.lesson_status']")=='incomplete'
            choose(frame,'tina');fill(frame,'tina');frame.locator('#quantity-0').fill('7');lp.wait_for_timeout(450);lp.reload();frame=lp.frames[1]
            assert frame.locator('#quantity-0').input_value()=='7' and frame.locator('#product-0').input_value()=='concreto'
            frame.locator('#quantity-0').fill('8');fill(frame,'tina');lp.evaluate("window.fail='commit'");frame.get_by_role('button',name='Emitir nota simulada').click();assert 'Falha no registro Moodle' in frame.locator('#sync').inner_text()
            lp.evaluate("window.fail=''");frame.get_by_role('button',name='Tentar salvar novamente').click();assert frame.locator('#sync').inner_text()==''
            data=lp.evaluate('data');assert data['cmi.core.lesson_status']=='passed' and data['cmi.core.score.raw']=='100'
            assert data['cmi.core.score.min']=='0' and data['cmi.core.score.max']=='100';assert 0<len(data['cmi.suspend_data'].encode())<=4096
            lp.reload();frame=lp.frames[1];assert lp.evaluate("data['cmi.core.lesson_status']")=='passed'
            frame.get_by_role('button',name='Ajudar outro empresário').click();frame.locator('[data-merchant="bene"]').click();fill(frame,'bene');frame.get_by_role('button',name='Emitir nota simulada').click();frame.get_by_role('button',name='Concluir atividade').click()
            assert lp.evaluate("calls.filter(x=>x[0]==='finish').length")==1
            saved=json.loads(lp.evaluate("data['cmi.suspend_data']"));assert saved['contributions']==1 and saved['first']['merchant']=='tina'
            assert 'cst' not in saved['form'] and 'classTrib' not in saved['form']
            checks+=['SCORM iframe: industrial sale resumes partially; passed/100 and limits after validation; failed commit can retry; optional service preserves approval and one contribution; finish once; suspend <=4096 bytes']
            for version in [1,2]:
                old=context(viewport={'width':1280,'height':900});old.add_init_script("if(location.protocol==='http:'){localStorage.setItem('vila-ed-demo-v1',JSON.stringify({v:"+str(version)+",completed:true,contributions:1,first:{merchant:'ze'}}))}")
                op=old.new_page();op.goto(url);assert 'conclusão da versão anterior' in op.locator('main').inner_text();assert 'Conclusão preservada' in op.locator('#achievement').inner_text()
            checks+=['v1 and v2 approved attempts migrate to v3 without reusing an incompatible invoice or losing completion']
            single=context(viewport={'width':1280,'height':900});fp=single.new_page();fp.goto(url+'/demo.html');assert fp.locator('.hero-art img').evaluate('img=>img.complete && img.naturalWidth>0')
            fp.locator('[data-action="choose"]').focus();fp.keyboard.press('Enter');assert fp.locator('.character-cutout').count()==3
            assert fp.locator('.character-cutout image').nth(0).get_attribute('href').startswith('data:image/png;base64,')
            fp.locator('[data-merchant="bene"]').focus();fp.keyboard.press('Enter');fill(fp,'bene')
            for control in fp.locator('input,select,textarea').all():assert control.evaluate('el=>!!el.labels?.length')
            fp.locator('#amount').focus();reached=set()
            for _ in range(18):reached.add(fp.evaluate('document.activeElement.id'));fp.keyboard.press('Tab')
            assert {'amount','cnae','ctn','nbs','issWithheld','reviewed'}<=reached
            fp.get_by_role('button',name='Emitir nota simulada').click();assert fp.get_by_role('heading',name='Nota emitida!',exact=True).is_visible()
            checks+=['single HTML embeds both scene and transparent full-body assets; no external runtime requests; labeled controls and keyboard navigation; standalone service issue succeeds']
            assert not errors,errors;assert not external,external;browser.close()
        report={'version':3,'passed':checks,'browser_errors':errors,'external_requests':external,'real_moodle_tested':False,'official_classifications_verified':False}
        (RESULTS/'browser-report.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n');print(json.dumps(report,ensure_ascii=False,indent=2))
    finally:server.shutdown();server.server_close()

if __name__=='__main__':run()
