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
    expected={
      'ze':('5212500','110402','106019000','000','000001','nao'),
      'tina':('4399199','070202','101054000','200','200046','sim'),
      'bene':('2542000','141302','101075000','000','000001','nao')
    }[merchant]
    for key,value in zip(['cnae','ctn','nbs','cst','classTrib','issWithheld'],expected):
        page.locator('#'+key).select_option(value)
    page.locator('#reviewed').check()

def run():
    class WithDemo(Handler):
        def do_GET(self):
            if self.path=='/demo.html':
                body=(ROOT/'dist/vila-do-ed-demonstracao.html').read_bytes()
                self.send_response(200);self.send_header('Content-Type','text/html;charset=utf-8');self.send_header('Content-Length',str(len(body)));self.end_headers();self.wfile.write(body)
            else: super().do_GET()
    server=http.server.ThreadingHTTPServer(('127.0.0.1',0),functools.partial(WithDemo,directory=str(ROOT/'dist/site')))
    threading.Thread(target=server.serve_forever,daemon=True).start()
    url=f'http://127.0.0.1:{server.server_port}'
    checks=[];errors=[];external=[]
    try:
        with sync_playwright() as p:
            browser=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox'])
            def context(**kwargs):
                ctx=browser.new_context(**kwargs)
                ctx.on('page',lambda page:page.on('pageerror',lambda e:errors.append(str(e))))
                ctx.route('**/*',lambda route:route.continue_() if route.request.url.startswith(url) or route.request.url.startswith('data:') else (external.append(route.request.url),route.abort()))
                return ctx
            ctx=context(viewport={'width':1440,'height':1000},reduced_motion='reduce')
            page=ctx.new_page();page.goto(url);page.screenshot(path=str(RESULTS/'desktop-opening.png'),full_page=True)
            choose(page,'ze')
            assert page.locator('#recipient').input_value()=='Associação da Praça'
            assert page.locator('#amount').input_value()=='250,00'
            assert page.locator('#description').get_attribute('readonly') is not None
            assert page.locator('#ctn').is_disabled() and page.locator('#nbs').is_disabled()
            assert page.locator('#cnae option').count()==4
            page.get_by_role('button',name='Emitir nota simulada').click()
            assert page.locator('[aria-invalid="true"]').count()>=6
            fill(page,'ze')
            page.locator('#ctn').select_option('110401');assert page.locator('#nbs').input_value()==''
            assert page.locator('#nbs option[value="106019000"]').count()==0
            page.locator('#nbs').select_option('106029000')
            page.locator('#cnae').select_option('5211799')
            assert page.locator('#ctn').input_value()=='' and page.locator('#nbs').is_disabled()
            assert page.locator('#amount').input_value()=='250,00'
            fill(page,'ze');page.locator('#nbs').select_option('106011000');page.locator('#reviewed').check()
            page.get_by_role('button',name='Conferir nota').click();assert page.locator('#nbs').get_attribute('aria-invalid')=='true'
            assert page.locator('#cnae').input_value()=='5212500'
            fill(page,'ze');page.locator('#amount').fill('251,00');assert not page.locator('#reviewed').is_checked()
            page.locator('#reviewed').check();page.get_by_role('button',name='Conferir nota').click()
            assert page.locator('#amount').get_attribute('aria-invalid')=='true'
            page.locator('#amount').fill('250,00');fill(page,'ze')
            page.locator('#issWithheld').select_option('sim');page.locator('#reviewed').check()
            page.get_by_role('button',name='Conferir nota').click();assert page.locator('#issWithheld').get_attribute('aria-invalid')=='true'
            fill(page,'ze');page.get_by_role('button',name='Conferir nota').click();assert 'Tudo certo' in page.locator('#validation').inner_text()
            page.evaluate('document.activeElement.blur();window.scrollTo(0,0)');page.screenshot(path=str(RESULTS/'desktop-form.png'),full_page=True)
            page.evaluate("document.querySelector('#invoice').requestSubmit();document.querySelector('main').dispatchEvent(new Event('submit',{bubbles:true,cancelable:true}))")
            assert page.get_by_role('heading',name='Nota emitida!',exact=True).is_visible()
            assert '250,00' in page.locator('.receipt .total-row').inner_text()
            assert '11.04.02' in page.locator('.classification-summary').inner_text()
            state=page.evaluate("JSON.parse(localStorage.getItem('vila-ed-demo-v1'))")
            assert state['v']==2 and state['completed'] and state['contributions']==1 and state['first']['merchant']=='ze'
            page.screenshot(path=str(RESULTS/'desktop-receipt.png'),full_page=True)
            page.reload();assert page.get_by_role('heading',name='Nota emitida!',exact=True).is_visible()
            page.get_by_role('button',name='Ajudar outro empresário').click();page.locator('[data-merchant="tina"]').click();fill(page,'tina')
            page.locator('#cst').select_option('000');assert page.locator('#classTrib').input_value()==''
            assert page.locator('#classTrib option[value="200046"]').count()==0
            fill(page,'tina');page.locator('#classTrib').select_option('200045');page.locator('#reviewed').check()
            page.get_by_role('button',name='Conferir nota').click();assert page.locator('#classTrib').get_attribute('aria-invalid')=='true'
            fill(page,'tina');page.get_by_role('button',name='Emitir nota simulada').click()
            state=page.evaluate("JSON.parse(localStorage.getItem('vila-ed-demo-v1'))")
            assert state['contributions']==1 and state['first']['merchant']=='ze'
            checks+=['desktop: client/description/value prefilled; only relevant CNAEs; locked CTN/NBS unlocked in cascade; upstream changes reset dependents', 'wrong CTN, NBS, price and ISS retention rejected without erasing work; corrected service emitted at R$ 250,00', 'IBS/CBS classified separately; wrong reduced/urban rehabilitation class rejected; repeated submit and optional route preserve first contribution']
            mobile=context(viewport={'width':390,'height':844},is_mobile=True,has_touch=True,reduced_motion='reduce')
            mp=mobile.new_page();mp.goto(url);choose(mp,'tina')
            assert mp.evaluate('document.documentElement.scrollWidth<=innerWidth')
            mp.locator('#amount').scroll_into_view_if_needed();mp.get_by_role('link',name='Consultar solicitação').click()
            assert mp.locator('#order-mobile').bounding_box()['y']<100
            fill(mp,'tina');mp.screenshot(path=str(RESULTS/'mobile-form.png'),full_page=True)
            mp.get_by_role('button',name='Emitir nota simulada').click()
            assert '1.800,00' in mp.locator('.receipt .total-row').inner_text()
            assert 'Sim — responsabilidade do tomador' in mp.locator('.classification-summary').inner_text()
            assert mp.evaluate('document.documentElement.scrollWidth<=innerWidth')
            checks+=['mobile 390px: request available during input, no horizontal page overflow; Tina issued at R$ 1.800,00 with ISS retention']
            lp=ctx.new_page();lp.goto(url+'/lms.html');frame=lp.frames[1]
            assert lp.evaluate("data['cmi.core.lesson_status']")=='incomplete'
            choose(frame,'bene');fill(frame,'bene');frame.locator('#amount').fill('440,00');lp.wait_for_timeout(450)
            lp.reload();frame=lp.frames[1];assert frame.locator('#amount').input_value()=='440,00';assert frame.locator('#ctn').input_value()=='141302'
            frame.locator('#amount').fill('450,00');fill(frame,'bene');lp.evaluate("window.fail='commit'")
            frame.get_by_role('button',name='Emitir nota simulada').click();assert 'Falha no registro Moodle' in frame.locator('#sync').inner_text()
            lp.evaluate("window.fail=''");frame.get_by_role('button',name='Tentar salvar novamente').click();assert frame.locator('#sync').inner_text()==''
            data=lp.evaluate('data');assert data['cmi.core.lesson_status']=='passed' and data['cmi.core.score.raw']=='100'
            assert data['cmi.core.score.min']=='0' and data['cmi.core.score.max']=='100'
            assert 0<len(data['cmi.suspend_data'].encode())<=4096
            assert '450,00' in frame.locator('.receipt .total-row').inner_text()
            lp.reload();frame=lp.frames[1];assert lp.evaluate("data['cmi.core.lesson_status']")=='passed'
            frame.get_by_role('button',name='Ajudar outro empresário').click();frame.locator('[data-merchant="ze"]').click()
            assert lp.evaluate("data['cmi.core.lesson_status']")=='passed'
            fill(frame,'ze');frame.get_by_role('button',name='Emitir nota simulada').click();frame.get_by_role('button',name='Concluir atividade').click()
            assert lp.evaluate("calls.filter(x=>x[0]==='finish').length")==1
            assert 'nota 100' in frame.locator('main').inner_text()
            saved=json.loads(lp.evaluate("data['cmi.suspend_data']"));assert saved['contributions']==1 and saved['first']['merchant']=='bene'
            checks+=['SCORM iframe: partial dependent selections resume; valid Bené service passes 100/min0/max100; suspend <=4096 bytes; commit failure retry; approved reentry; finish once']
            old=context(viewport={'width':1280,'height':900})
            old.add_init_script("if(location.protocol==='http:'){localStorage.setItem('vila-ed-demo-v1',JSON.stringify({v:1,completed:true,contributions:1,first:{merchant:'ze'}}))}")
            op=old.new_page();op.goto(url);assert 'conclusão da versão anterior' in op.locator('main').inner_text();assert 'Conclusão preservada' in op.locator('#achievement').inner_text()
            checks+=['migration from merchandise v1 preserves an already completed contribution without treating the old invoice as a new service invoice']
            standalone=context(viewport={'width':1280,'height':900});fp=standalone.new_page();fp.goto(url+'/demo.html')
            assert fp.locator('.hero-art img').evaluate('img=>img.complete && img.naturalWidth>0')
            fp.locator('[data-action="choose"]').focus();fp.keyboard.press('Enter');fp.locator('[data-merchant="bene"]').focus();fp.keyboard.press('Enter');fill(fp,'bene')
            for control in fp.locator('input,select,textarea').all(): assert control.evaluate('el=>!!el.labels?.length')
            fp.locator('#amount').focus();reached=set()
            for _ in range(20):reached.add(fp.evaluate('document.activeElement.id'));fp.keyboard.press('Tab')
            assert {'amount','cnae','ctn','nbs','issWithheld','cst','classTrib','reviewed'}<=reached
            fp.get_by_role('button',name='Emitir nota simulada').click();assert fp.get_by_role('heading',name='Nota emitida!',exact=True).is_visible()
            checks+=['single-file HTML includes classification data, styling and art; keyboard reaches all fields; all controls labeled; full standalone service issue succeeds']
            assert not errors,errors;assert not external,external
            browser.close()
        report={'version':2,'passed':checks,'browser_errors':errors,'external_requests':external,'real_moodle_tested':False,'official_classifications_verified':False}
        (RESULTS/'browser-report.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n');print(json.dumps(report,ensure_ascii=False,indent=2))
    finally:server.shutdown();server.server_close()

if __name__=='__main__':run()
