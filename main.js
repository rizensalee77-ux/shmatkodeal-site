(function(){
const D=window.I18N,$=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const root=document.documentElement;root.classList.add('js');
const map={uk:'ua',en:'en',ru:'ru'};let lang;
try{lang=localStorage.getItem('lang')}catch(e){}
if(!D[lang])lang=map[(navigator.language||'').slice(0,2).toLowerCase()]||'ua';
const t=k=>D[lang][k]||k;
const esc=s=>String(s==null?'':s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const L=v=>typeof v==='string'?v:(v&&(v[lang]||v.en))||'';
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.12});
const watch=()=>$$('.rv:not(.in)').forEach(e=>io.observe(e));
const SV=[{k:'audit',n:'s1',d:'s1d',l:['s1a','s1b','s1c'],v:'Instagram Audit'},{k:'smm',n:'s2',d:'s2d',l:['s2a','s2b','s2c'],v:'SMM & Content'},{k:'web',n:'s3',d:'s3d',l:['s3a','s3b','s3c'],v:'Website Development'}];
function pick(v){const s=$('#svc');s.value=v}
function renderCat(){const C=window.CATALOG||{};
 $('#cat').innerHTML=SV.map((s,i)=>{const c=C[s.k]||{},p=L(c.price);
  const ph=c.photo?`<img src="${esc(c.photo)}" alt="${esc(t(s.n))}" loading="lazy" decoding="async">`:`<span class="mono" aria-hidden="true">0${i+1}</span>`;
  return `<article class="cd rv"><div class="ph${c.photo?'':' ab'}">${ph}</div><div class="cb"><h3>${t(s.n)}</h3><p>${t(s.d)}</p><ul>${s.l.map(x=>`<li>${t(x)}</li>`).join('')}</ul><div class="cf"><div class="pr"><small>${t('pr_l')}</small><b>${p?esc(p):t('pr_n')}</b></div><a class="btn sm" href="#contact" data-order="${s.v}">${t('order')}</a></div></div></article>`}).join('');
 $$('#cat [data-order]').forEach(a=>a.onclick=()=>pick(a.dataset.order));watch()}
function renderTrust(){const T=window.TRUST||{},S=window.SITE||{},o=[];
 if((T.stats||[]).length)o.push(`<div class="stats">${T.stats.map(s=>`<div class="st"><b>${esc(L(s.value))}</b><span>${esc(L(s.label))}</span></div>`).join('')}</div>`);
 if((T.reviews||[]).length)o.push(`<div class="rws">${T.reviews.map(r=>`<figure class="rw"><blockquote>${esc(L(r.text))}</blockquote><figcaption>${esc(r.author)}${r.role?' · '+esc(L(r.role)):''}</figcaption></figure>`).join('')}</div>`);
 const ch=[];if(S.telegram)ch.push(`<a class="chip" href="https://t.me/${esc(S.telegram.replace('@',''))}" target="_blank" rel="noopener">Telegram</a>`);if(S.instagram)ch.push(`<a class="chip" href="https://instagram.com/${esc(S.instagram.replace('@',''))}" target="_blank" rel="noopener">Instagram</a>`);
 if(ch.length)o.push(`<div class="chips2">${ch.join('')}</div>`);
 $('#tr_x').innerHTML=o.join('');}
function renderContacts(){const S=window.SITE||{},h=[],u=x=>esc(x.replace('@',''));
 if(S.telegram)h.push(`<a href="https://t.me/${u(S.telegram)}" target="_blank" rel="noopener">Telegram — @${u(S.telegram)}</a>`);
 if(S.instagram)h.push(`<a href="https://instagram.com/${u(S.instagram)}" target="_blank" rel="noopener">Instagram — @${u(S.instagram)}</a>`);
 if(S.phone){const d=S.phone.replace(/\D/g,''),i=d.startsWith('0')?'38'+d:d;h.push(`<a href="tel:+${i}">${esc(S.phone)}</a>`)}
 if(S.email)h.push(`<a href="mailto:${esc(S.email)}">${esc(S.email)}</a>`);
 const H=S.hours;$('#cl').innerHTML=h.join('')+(H?`<p class="hrs"><small>${t('hrs_l')}</small>${t('wd')} ${esc(H.weekdays)} · ${t('we')} ${esc(H.weekend)}</p>`:'');
 const a=$('#h2nd'),f=S.telegram?['https://t.me/'+S.telegram.replace('@',''),'Telegram']:S.instagram?['https://instagram.com/'+S.instagram.replace('@',''),'Instagram']:null;
 if(f){a.href=f[0];a.target='_blank';a.rel='noopener';a.removeAttribute('data-i');a.textContent=f[1]}else{a.href='#services';a.removeAttribute('target');a.dataset.i='h_sec';a.textContent=t('h_sec')}}
function apply(l){lang=l;try{localStorage.setItem('lang',l)}catch(e){}
 root.lang=l==='ua'?'uk':l;const md=$('meta[name=description]'),og=$('meta[property="og:description"]');if(md)md.content=t('meta_d');if(og)og.content=t('meta_d');
 $$('[data-i]').forEach(e=>e.textContent=t(e.dataset.i));
 $$('.lang button').forEach(b=>{b.classList.toggle('on',b.dataset.l===l);b.setAttribute('aria-pressed',b.dataset.l===l)});
 $('#svc option[value=""]').textContent=t('f_sel');renderCat();renderTrust();renderContacts();
 $('#mt').innerHTML=[1,2].map(()=>['s1','s2','s3','s1','s2','s3'].map(k=>`<span>${t(k)}</span>`).join('')).join('');}
$$('.lang button').forEach(b=>b.onclick=()=>apply(b.dataset.l));
const nav=$('header nav'),bg=$('#burger');
function menu(o){nav.classList.toggle('open',o);bg.setAttribute('aria-expanded',o);document.body.style.overflow=o?'hidden':''}
bg.onclick=()=>menu(!nav.classList.contains('open'));
$$('header nav a').forEach(a=>a.onclick=()=>menu(false));
addEventListener('keydown',e=>{if(e.key==='Escape')menu(false)});
addEventListener('resize',()=>{if(innerWidth>960)menu(false)});
// форма
const f=$('#f'),st=$('#st'),loadT=Date.now(),E=f.elements;
const digits=v=>v.replace(/\D/g,'').length;
const okc=v=>{v=v.trim();return /^@?[A-Za-z][A-Za-z0-9_]{4,31}$/.test(v)||/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)||(/^[+\d][\d\s().-]{5,}$/.test(v)&&digits(v)>=7&&digits(v)<=15)};
const rules={name:v=>v.trim().length>=2,contact:okc,service:v=>!!v,message:v=>v.trim().length>=10};
const emap={name:'e_name',contact:'e_ct',service:'e_srv',message:'e_msg'};
function show(c,k){st.className=c;st.textContent=t(k)}
let busy=false;
f.onsubmit=async e=>{e.preventDefault();if(busy)return;let first=null;
 for(const k in rules){const el=E[k],bad=!rules[k](el.value);el.classList.toggle('bad',bad);el.setAttribute('aria-invalid',bad);el.setAttribute('aria-describedby','e_'+k);$('#e_'+k).textContent=bad?t(emap[k]):'';if(bad&&!first)first=el}
 if(first){show('no','er_invalid');first.focus();return}
 let last=0;try{last=+localStorage.getItem('last')||0}catch(x){}
 if(Date.now()-last<30000){show('no','er_wait');return}
 const btn=f.querySelector('button');busy=true;btn.disabled=true;show('ok','sending');
 try{const r=await fetch('/api/lead',{method:'POST',headers:{'Content-Type':'application/json'},
  body:JSON.stringify({name:E.name.value,contact:E.contact.value,service:E.service.value,budget:E.budget.value,deadline:E.deadline.value,message:E.message.value,website:E.website.value,t:loadT,lang})});
  const j=await r.json().catch(()=>({}));
  if(r.ok&&j.ok){try{localStorage.setItem('last',Date.now())}catch(x){}f.reset();show('ok','ok')}
  else show('no','er_'+(['invalid','rate','fast','not_configured'].includes(j.code)?j.code:'x'));
 }catch(x){show('no','er_x')}finally{busy=false;btn.disabled=false}};
// тема
const meta=$('meta[name=theme-color]'),sync=()=>meta&&meta.setAttribute('content',root.dataset.theme==='dark'?'#0a0a0b':'#f6f5f2');sync();
$('#th').onclick=()=>{const n=root.dataset.theme==='dark'?'light':'dark';root.dataset.theme=n;try{localStorage.setItem('theme',n)}catch(e){}sync()};
if(matchMedia('(pointer:fine)').matches){const hr=$('.hero');hr.addEventListener('pointermove',e=>{const r=hr.getBoundingClientRect();hr.style.setProperty('--mx',e.clientX-r.left+'px');hr.style.setProperty('--my',e.clientY-r.top+'px')})}
new IntersectionObserver(([e])=>$('.hero').classList.toggle('off',!e.isIntersecting)).observe($('.hero'));
const hd=$('header'),sc=()=>hd.classList.toggle('sc',scrollY>10);sc();addEventListener('scroll',sc,{passive:true});
apply(lang);watch();})();
