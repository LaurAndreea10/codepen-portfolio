// Grădina Curioasă — pictograme la fel pe orice dispozitiv: emoji-urile decorative mari devin imagini Twemoji locale.
// Twemoji © Twitter/X și colaboratorii, grafică sub licența CC-BY 4.0 (https://github.com/jdecked/twemoji).
(()=>{
const SEL='.match-item:not(.silhouette):not(.clock),.fest-item,.fest-day-icon,.advent-orn,.fest-opt,.fest-cell,.party-item-icon,.party-placed,.craft-big,.craft-card-icon,.craft-head-icon,.craft-tool-icon,.quick-icon,.daily-icon,.bia-idea-icon,.garden-nav .ni,.fruit>span,.craft-show,.round-stars,.pair-tool,.craft-scene .craft-big';
const RE=/(?:[#*0-9]\u{FE0F}?\u{20E3}|[\u{1F1E6}-\u{1F1FF}]{2}|\p{Extended_Pictographic}[\u{FE0F}\u{1F3FB}-\u{1F3FF}]?(?:\u{200D}\p{Extended_Pictographic}[\u{FE0F}\u{1F3FB}-\u{1F3FF}]?)*)/gu;
const code=e=>{const cps=[...e].map(c=>c.codePointAt(0).toString(16));return (cps.includes('200d')?cps:cps.filter(c=>c!=='fe0f')).join('-')};
const off=()=>document.body.classList.contains('native-emoji');
function swap(el){if(off())return;for(const n of [...el.childNodes]){if(n.nodeType!==3||!RE.test(n.data)){RE.lastIndex=0;continue}RE.lastIndex=0;const f=document.createDocumentFragment();let last=0;n.data.replace(RE,(m,...a)=>{const i=a[a.length-2];if(i>last)f.append(n.data.slice(last,i));const img=document.createElement('img');img.className='tw';img.alt=m;img.draggable=false;img.decoding='async';img.src=`emoji/${code(m)}.svg`;img.onerror=()=>img.replaceWith(m);f.append(img);last=i+m.length;return m});if(last<n.data.length)f.append(n.data.slice(last));n.replaceWith(f)}}
function scan(root){if(root.nodeType!==1)return;if(root.matches?.(SEL))swap(root);root.querySelectorAll?.(SEL).forEach(swap)}
const app=document.getElementById('app')||document.body;
new MutationObserver(ms=>{for(const m of ms){if(m.type==='childList'){if(m.target.nodeType===1&&m.target.matches?.(SEL))swap(m.target);m.addedNodes.forEach(scan)}}}).observe(app,{childList:true,subtree:true});
scan(app);window.gardenEmoji={scan};
})();
