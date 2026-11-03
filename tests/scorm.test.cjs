const {test} = require('node:test');
const assert = require('node:assert/strict');
const {Bridge, discover, sessionTime} = require('../app/scorm.js');
function mock(initial = {}) {
  const values = {'cmi.core.lesson_status':'not attempted', 'cmi.core.entry':'ab-initio', ...initial}, calls = [];
  let code = '0';
  const api = { fail: '', calls, values,
    LMSInitialize: () => 'true', LMSGetLastError: () => code,
    LMSGetValue(k) { code = this.fail === k ? '101' : '0'; return values[k] || ''; },
    LMSSetValue(k,v) { calls.push([k,v]); code = this.fail === k ? '101' : '0'; if (code !== '0') return 'false'; values[k] = v; return 'true'; },
    LMSCommit() { calls.push(['commit']); code = this.fail === 'commit' ? '101' : '0'; return code === '0' ? 'true' : 'false'; },
    LMSFinish() { calls.push(['finish']); return 'true'; }
  };
  const win = {API:api}; win.parent = win; return {win, api};
}
const state = complete => ({v:1,step:'form',merchant:'ze',completed:complete,contributions:complete?1:0});
test('new attempt starts incomplete, emission passes 100 and does not downgrade', () => {
  const {win,api} = mock(); const b = new Bridge(win); b.init();
  assert.equal(api.values['cmi.core.lesson_status'],'incomplete');
  assert.ok(b.save(state(true))); assert.equal(api.values['cmi.core.score.raw'],'100');
  b.save(state(false)); assert.equal(api.values['cmi.core.lesson_status'],'passed');
  assert.equal(api.values['cmi.core.score.min'],'0'); assert.equal(api.values['cmi.core.score.max'],'100');
});
test('resume, passed reentry, suspend data and location are retained', () => {
  const saved = {...state(true),step:'receipt'};
  const {win,api} = mock({'cmi.core.entry':'resume','cmi.core.lesson_status':'passed','cmi.suspend_data':JSON.stringify(saved)});
  const b = new Bridge(win); assert.deepEqual(b.init(),saved); b.save(saved);
  assert.equal(api.values['cmi.core.lesson_location'],'receipt:ze');
  assert.equal(api.values['cmi.core.lesson_status'],'passed');
});
test('ab-initio ignores stale previous attempt data', () => {
  const {win} = mock({'cmi.suspend_data':'{"completed":true}'}); assert.equal(new Bridge(win).init(),null);
});
test('API discovery tolerates inaccessible parent, supports opener and bounded loops', () => {
  const {win,api} = mock(); assert.equal(discover({parent:win}),api);
  const blocked = {get API(){throw new Error('cross origin')},get parent(){throw new Error('cross origin')},opener:win};
  assert.equal(discover(blocked),api);
  const a={},b={}; a.parent=b;b.parent=a;assert.equal(discover(a),null);
});
test('commit failure is visible, retry works, finish is idempotent', () => {
  const {win,api} = mock(); const b = new Bridge(win); b.init(); api.fail = 'commit';
  assert.equal(b.save(state(true)),false); assert.match(b.error,/Moodle/); api.fail='';
  assert.equal(b.finish(state(true)),true); assert.equal(b.finish(state(true)),true);
  assert.equal(api.calls.filter(x=>x[0]==='finish').length,1);
});
test('failed status read never overwrites an existing LMS approval', () => {
  const {win,api} = mock({'cmi.core.lesson_status':'passed'}); api.fail='cmi.core.lesson_status';
  const b = new Bridge(win); b.init(); assert.equal(b.save(state(false)),false);
  assert.equal(api.values['cmi.core.lesson_status'],'passed'); assert.equal(api.calls.length,0);
});
test('data limit is enforced in bytes and session time is SCORM formatted', () => {
  const {win} = mock(); let time=0; const b = new Bridge(win,()=>time); b.init();
  assert.equal(b.save({text:'á'.repeat(2100)}),false);
  time=3723450;b.save(state(false));assert.equal(win.API.values['cmi.core.session_time'],'0001:02:03.45');
  assert.equal(sessionTime(0),'0000:00:00.00');
});
test('demo storage is separate from a failed LMS connection', () => {
  const storage = new Map(),win={localStorage:{getItem:k=>storage.get(k),setItem:(k,v)=>storage.set(k,v)}};win.parent=win;
  const b=new Bridge(win);assert.equal(b.mode,'demo');b.init();b.save(state(true));
  assert.deepEqual(new Bridge(win).init(),state(true));
  const lms=mock();lms.api.LMSInitialize=()=> 'false';lms.win.localStorage=win.localStorage;
  const broken=new Bridge(lms.win);broken.init();assert.equal(broken.mode,'lms');assert.equal(broken.save(state(true)),false);
});
