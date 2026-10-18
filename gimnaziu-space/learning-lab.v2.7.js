/* Gimnaziu Space 2.7 learning-lab add-ons: local missions, mistake sheets, coverage audit. */
(function(){
'use strict';
var DATA=window.GS_DATA||{}, SUBJECTS=DATA.SUBJECTS||[], QUESTIONS=DATA.QUIZ||[];
var root=function(){return document.querySelector('#view')};
var lang=function(){return document.documentElement.lang==='en'?'en':'ro'};
var tr=function(ro,en){return lang()==='en'?en:ro};
var esc=function(v){return String(v==null?'':v).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})};
var pick=function(v){return typeof v==='string'?v:(v&&v[lang()])||(v&&v.ro)||''};
var state=function(){return window.GS&&window.GS.state?window.GS.state():{}};
function mission(){
 var s=state(), recent=(s.mistakes||[]).filter(function(m){return m&&m.s&&m.g}).slice(-20).reverse();
 if(recent.length){var m=recent[0],sub=SUBJECTS.find(function(x){return x.id===m.s});return {s:m.s,g:Number(m.g),label:sub?pick(sub):m.s,mode:'errors',detail:tr('Începe cu o greșeală recentă și exersează încă 5 întrebări din materia ei.','Start from a recent mistake, then practise 5 more questions in that subject.')}} 
 var weak=Object.entries(s.mastery||{}).filter(function(x){return x[1]&&(Number(x[1].pct)<80||Number(x[1].total)<3)}).sort(function(a,b){return (Number(a[1].pct)||0)-(Number(b[1].pct)||0)});
 if(weak.length){var p=weak[0][0].split('|'),g=Number(p[0])||7,id=p[1]||'mat',sub=SUBJECTS.find(function(x){return x.id===id});return {s:id,g:g,label:sub?pick(sub):id,mode:'adaptive',detail:tr('Am ales o zonă din harta ta de competențe care merită exersată.','I picked an area from your skills map that could use practice.')}} 
 var quiz=s.quiz||{},w=SUBJECTS.map(function(x){return {x:x,v:quiz[x.id]||{ok:0,bad:0}}}).filter(function(y){return y.v.ok+y.v.bad>0}).sort(function(a,b){return a.v.ok/Math.max(1,a.v.ok+a.v.bad)-b.v.ok/Math.max(1,b.v.ok+b.v.bad)})[0],sub=w?w.x:SUBJECTS[0];
 return {s:sub?sub.id:'mat',g:Number(s.grade)||7,label:sub?pick(sub):tr('Matematică','Mathematics'),mode:'adaptive',detail:tr('Fă un set scurt; progresul tău va ajuta la recomandări mai precise.','Try a short set; your progress will help make more precise suggestions.')}
}
function printMistakes(){
 var list=(state().mistakes||[]).filter(function(m){return m&&m.q}).slice(-20).reverse();
 if(!list.length){alert(tr('Nu ai încă greșeli salvate pentru recapitulare.','There are no saved mistakes to review yet.'));return}
 var rows=list.map(function(m){return '<li><strong>'+esc(pick(m.q))+'</strong><p>'+esc(tr('Răspunsul ales: ','Your answer: '))+esc(pick(m.chosen))+'</p><p>'+esc(tr('Răspunsul corect: ','Correct answer: '))+esc(pick(m.correct))+'</p><p><strong>'+esc(tr('Explicație: ','Explanation: '))+'</strong>'+esc(pick(m.x))+'</p><div class="write"></div></li>'}).join('');
 var w=window.open('','_blank');if(!w){alert(tr('Permite fereastra de printare pentru a crea fișa.','Allow the print window to create the worksheet.'));return}
 var title=tr('Fișă de recapitulare din greșelile mele','Review sheet from my mistakes'),now=new Intl.DateTimeFormat(lang()==='en'?'en-GB':'ro-RO',{dateStyle:'long'}).format(new Date());
 w.document.write('<!doctype html><html lang="'+lang()+'"><meta charset="utf-8"><title>'+esc(title)+'</title><style>body{font:16px system-ui;max-width:850px;margin:2rem auto;color:#111;line-height:1.55}h1{font-size:24px}li{margin:1.5rem 0;break-inside:avoid;border-bottom:1px solid #bbb;padding-bottom:1rem}.write{height:2rem;border-bottom:1px solid #bbb;margin-top:.5rem}@media print{body{margin:1cm}}</style><h1>'+esc(title)+'</h1><p>Gimnaziu Space · '+esc(now)+'</p><p>'+esc(tr('Încearcă din nou fiecare item înainte să citești explicația.','Try each item again before reading the explanation.'))+'</p><ol>'+rows+'</ol><script>window.onload=function(){window.print()}<\/script></html>');
 w.document.close()
}
function missionCard(){
 var m=mission(),n=(state().mistakes||[]).length,href='#quiz?mode='+m.mode+'&s='+encodeURIComponent(m.s)+'&g='+m.g+'&n=5';
 return '<section class="card stack" aria-labelledby="learning-lab-title" data-learning-lab><div><p class="eyebrow">'+esc(tr('Misiune scurtă · 5 întrebări','Short mission · 5 questions'))+'</p><h2 id="learning-lab-title">'+esc(tr('Următorul pas recomandat','Your next suggested step'))+'</h2><p>'+esc(tr('Materia sugerată: ','Suggested subject: '))+'<strong>'+esc(m.label)+'</strong></p><p class="muted">'+esc(m.detail)+'</p></div><div class="row"><a class="btn primary" href="'+href+'">'+esc(tr('Începe misiunea','Start mission'))+' →</a><button type="button" class="btn" data-print-mistakes '+(n?'':'disabled')+'>'+esc(tr('Fișă din greșelile mele','Mistake review sheet'))+'</button><a class="btn" href="#coverage">'+esc(tr('Vezi acoperirea băncii','View question-bank coverage'))+'</a></div><p class="small muted">'+esc(tr('Recomandarea folosește doar progresul salvat pe dispozitiv.','This suggestion uses only progress saved on this device.'))+'</p></section>'
}
function coveragePage(el){
 var grades=[5,6,7,8], rows=SUBJECTS.map(function(s){var cells=grades.map(function(g){var n=QUESTIONS.filter(function(q){return q.s===s.id&&q.g===g}).length;return '<td>'+(n?'<a class="coverage-link" href="#quiz?s='+encodeURIComponent(s.id)+'&g='+g+'" aria-label="'+esc(pick(s))+', '+esc(tr('clasa','grade'))+' '+g+': '+n+' '+esc(tr('întrebări','questions'))+'">'+n+'</a>':'<span aria-label="'+esc(tr('Nu există întrebări în banca actuală','No questions in current bank'))+'">—</span>')+'</td>'}).join('');return '<tr><th scope="row">'+esc(pick(s))+'</th>'+cells+'</tr>'}).join('');
 var total=QUESTIONS.length,covered=SUBJECTS.reduce(function(n,s){return n+grades.filter(function(g){return QUESTIONS.some(function(q){return q.s===s.id&&q.g===g})}).length},0);
 el.innerHTML='<header class="view-head"><p class="eyebrow">'+esc(tr('Audit de conținut','Content coverage'))+'</p><h1 tabindex="-1">'+esc(tr('Acoperirea băncii de întrebări','Question-bank coverage'))+'</h1><p class="lede">'+esc(tr('Vezi câte întrebări sunt disponibile în aplicație pentru fiecare materie și clasă. Numărul arată banca actuală, nu acoperirea oficială sau completă a programei.','See how many questions are available in the app for each subject and grade. Counts describe the current question bank, not official or complete syllabus coverage.'))+'</p></header><section class="card stack"><p><strong>'+total+'</strong> '+esc(tr('întrebări în bancă ·','questions in the bank ·'))+' <strong>'+covered+'</strong> '+esc(tr('combinații materie/clasă cu cel puțin o întrebare','subject/grade combinations with at least one question'))+'</p><div class="table-wrap"><table><caption>'+esc(tr('Întrebări disponibile pe materie și clasă','Available questions by subject and grade'))+'</caption><thead><tr><th scope="col">'+esc(tr('Materia','Subject'))+'</th>'+grades.map(function(g){return '<th scope="col">'+g+'</th>'}).join('')+'</tr></thead><tbody>'+rows+'</tbody></table></div><p class="hint">'+esc(tr('Selectează un număr pentru a deschide quizul filtrat. O celulă goală înseamnă că banca actuală nu are itemi etichetați pentru acea combinație.','Select a number to open a filtered quiz. An empty cell means the current bank has no items tagged for that combination.'))+'</p><div class="row"><a class="btn primary" href="#quiz">'+esc(tr('Deschide quizul','Open quiz'))+'</a><a class="btn" href="#despre">'+esc(tr('Vezi sursele și limitele','See sources and limitations'))+'</a></div></section>';
 var h=el.querySelector('h1');document.title=(h?h.textContent:'Coverage')+' · Gimnaziu Space';document.querySelectorAll('[data-nav]').forEach(function(a){a.removeAttribute('aria-current')});if(h)h.focus({preventScroll:true})
}
function enhance(){
 var el=root();if(!el)return;
 if(location.hash.split('?')[0]==='#coverage'){coveragePage(el);return}
 var home=location.hash===''||location.hash==='#acasa'||location.hash.indexOf('#acasa?')===0;
 if(home&&!el.querySelector('[data-learning-lab]')){var hero=el.querySelector('.hero');if(hero)hero.insertAdjacentHTML('afterend',missionCard());else el.insertAdjacentHTML('beforeend',missionCard())}
 if((location.hash==='#progres'||location.hash.indexOf('#progres?')===0)&&!el.querySelector('[data-mistake-sheet]')){
  var cards=el.querySelectorAll('.card.stack'),target=cards.length?cards[cards.length-1]:el,box=document.createElement('section');box.className='card stack';box.dataset.mistakeSheet='';
  box.innerHTML='<h2>'+esc(tr('Recapitulare din greșeli','Review your mistakes'))+'</h2><p class="muted">'+esc(tr('Transformă întrebările greșite într-o fișă tipăribilă cu răspunsuri corecte și explicații.','Turn missed questions into a printable sheet with correct answers and explanations.'))+'</p><button type="button" class="btn" data-print-mistakes '+((state().mistakes||[]).length?'':'disabled')+'>'+esc(tr('Creează fișa de recapitulare','Create review sheet'))+'</button>';target.parentNode.insertBefore(box,target)
 }
}
document.addEventListener('click',function(e){if(e.target.closest('[data-print-mistakes]'))printMistakes();if(e.target.closest('[data-set-lang]'))setTimeout(enhance,20)});
window.addEventListener('hashchange',function(){setTimeout(enhance,0)});
var view=root(),queued=false;if(view){new MutationObserver(function(){if(!queued){queued=true;requestAnimationFrame(function(){queued=false;enhance()})}}).observe(view,{childList:true,subtree:true})}
enhance()
})();