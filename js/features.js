// Нові функції поверх наявного сайту: модальні вікна (demo / audit / call / деталі послуги),
// екран успіху, кнопки копіювання, плавний FAQ. Використовує SD з main.js та наявний бекенд /api/lead.
(function(){
const SD=window.SD,$=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const t=k=>SD.t(k),esc=SD.esc,dlg=$('#md'),mb=$('#mb');
let view=null,lastK=null,busy=false;
const reduce=matchMedia('(prefers-reduced-motion:reduce)').matches;
const svcLabel=v=>({'Instagram Audit':t('s1'),'SMM & Content':t('s2'),'Website Development':t('s3'),'Free Demo':t('o_demo'),'Other':t('o_other')}[v]);
const min=n=>x=>x.trim().length>=n;
const F={
 demo:{title:'m_demo',btn:'b_demo',f:[['name','f_name','t','e_name',min(2)],['business','f_biz','t','e_biz',min(2)],['link','f_link','t','e_link',SD.okl],['service','f_dsrv','s','e_srv',x=>!!x],['message','f_dmsg','a','e_msg5',min(5)]]},
 audit:{title:'m_audit',btn:'b_audit',f:[['name','f_name','t','e_name',min(2)],['instagram','f_ig','t','e_ig',SD.okig],['site','f_site','t','e_site',x=>!x.trim()||SD.okl(x)],['niche','f_niche','t','e_niche',min(2)],['message','f_amsg','a','e_msg5',min(5)]]}
};
function open(v){view=v;render();if(!dlg.open){dlg.showModal();document.body.style.overflow='hidden'}mb.scrollTop=0}
function collect(){const o={};$$('#mb [name]').forEach(e=>o[e.name]=e.value);return o}
function field([n,l,ty,,],i){const lab=esc(t(l));let c;
 if(ty==='s')c=`<select name="${n}"><option value="">${esc(t('f_sel'))}</option>${['Website Development','Instagram Audit','SMM & Content','Other'].map(s=>`<option value="${s}">${esc(svcLabel(s))}</option>`).join('')}</select>`;
 else if(ty==='a')c=`<textarea name="${n}" rows="4" maxlength="2000"></textarea>`;
 else c=`<input name="${n}" maxlength="100" autocomplete="${n==='name'?'name':'off'}"${n==='link'||n==='instagram'||n==='site'?' inputmode="url" autocapitalize="off"':''}>`;
 return `<label><span>${lab}</span>${c}<span class="err" id="me_${n}"></span></label>`}
function head(a,b){return `<h3>${esc(t(a))}</h3>${b?`<p>${esc(t(b))}</p>`:''}`}
function detail(s){const c=(window.CATALOG||{})[s.k]||{},more=c.more||[];
 const ex={web:['demo','c_demo'],audit:['audit','c_audit'],smm:['call','c_call']}[s.k];
 return `<h3>${esc(t(s.n))}</h3><p>${esc(t('dt_'+s.k))}</p><h4>${esc(t('d_in'))}</h4><ul class="dl">${s.l.map(x=>`<li>${esc(t(x))}</li>`).join('')}${more.map(m=>`<li>${esc(SD.L(m))}</li>`).join('')}</ul><div class="acts2"><button class="btn" type="button" data-order="${s.v}">${esc(t('d_ord'))}</button><button class="btn o" type="button" data-open="${ex[0]}">${esc(t(ex[1]))}</button></div>`}
function render(){const v=view;if(!v)return;const prev=lastK===v.k?collect():{};lastK=v.k;
 $('.mx').setAttribute('aria-label',t('cl'));
 if(v.k==='call')mb.innerHTML=head('m_call','m_call_d')+'<div class="opts">'+['Website Development','Instagram Audit','SMM & Content','Free Demo','Other'].map(o=>`<button class="opt" type="button" data-pick="${o}">${esc(svcLabel(o))}</button>`).join('')+'</div>';
 else if(v.k==='detail')mb.innerHTML=detail(v.s);
 else if(v.k==='done')mb.innerHTML=`<div class="okv" role="status"><svg class="chk" viewBox="0 0 52 52" aria-hidden="true"><circle cx="26" cy="26" r="24"/><path d="M15 27l8 8 14-16"/></svg><h3>${esc(t('su_t'))}</h3><p>${esc(t('su_p'))}</p><small>${esc(t('su_s'))}</small><button class="btn o sm noar" type="button" data-close>${esc(t('cl'))}</button></div>`;
 else{const c=F[v.k];mb.innerHTML=`${head(c.title)}<form novalidate data-type="${v.k}">${c.f.map(field).join('')}<input class="hp" name="website" tabindex="-1" autocomplete="off" aria-hidden="true"><button class="btn" type="submit">${esc(t(c.btn))}</button><div class="stt" id="ms" role="status" aria-live="polite"></div></form>`;
  for(const k in prev){const e=mb.querySelector(`[name="${k}"]`);if(e)e.value=prev[k]}}}
function order(v){$('#svc').value=v;$('#contact').scrollIntoView({behavior:reduce?'auto':'smooth'});setTimeout(()=>$('#f [name=name]').focus({preventScroll:true}),reduce?0:700)}
document.addEventListener('click',e=>{const el=e.target.closest('[data-open],[data-pick],[data-order],[data-close],.mx,.cp,#cat .cd');if(!el)return;
 const inM=dlg.contains(el);
 if(el.classList.contains('cp'))return copy(el);
 if(el.dataset.open!==undefined)return open({k:el.dataset.open});
 if(el.dataset.pick){dlg.close();return el.dataset.pick==='Free Demo'?open({k:'demo'}):order(el.dataset.pick)}
 if(el.dataset.order&&inM){dlg.close();return order(el.dataset.order)}
 if(el.dataset.close!==undefined||el.classList.contains('mx'))return dlg.close();
 if(el.classList.contains('cd')&&!e.target.closest('a,button'))open({k:'detail',s:SD.SV[$$('#cat .cd').indexOf(el)]})});
document.addEventListener('keydown',e=>{if((e.key==='Enter'||e.key===' ')&&e.target.classList&&e.target.classList.contains('cd')){e.preventDefault();open({k:'detail',s:SD.SV[$$('#cat .cd').indexOf(e.target)]})}});
dlg.addEventListener('click',e=>{if(e.target===dlg)dlg.close()});
dlg.addEventListener('close',()=>{document.body.style.overflow='';view=null;lastK=null});
// відправка форм у модальному вікні → наявний бекенд /api/lead
dlg.addEventListener('submit',async e=>{e.preventDefault();if(busy)return;const f=e.target,type=f.dataset.type,c=F[type],st=$('#ms');let first=null;
 for(const [n,,,em,ok] of c.f){const el=f.elements[n],bad=!ok(el.value);el.classList.toggle('bad',bad);el.setAttribute('aria-invalid',bad);el.setAttribute('aria-describedby','me_'+n);$('#me_'+n).textContent=bad?t(em):'';if(bad&&!first)first=el}
 if(first){st.className='stt no';st.textContent=t('er_invalid');first.focus();return}
 const key='last_'+type;let last=0;try{last=+localStorage.getItem(key)||0}catch(x){}
 if(Date.now()-last<30000){st.className='stt no';st.textContent=t('er_wait');return}
 const btn=f.querySelector('button');busy=true;btn.disabled=true;st.className='stt ok';st.textContent=t('sending');
 const body={type,website:f.elements.website.value,t:SD.loadT,lang:SD.lang};c.f.forEach(([n])=>body[n]=f.elements[n].value);if(type==='audit')body.service='Instagram Audit';
 try{const r=await fetch('/api/lead',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});const j=await r.json().catch(()=>({}));
  if(r.ok&&j.ok){try{localStorage.setItem(key,Date.now())}catch(x){}open({k:'done'})}
  else{st.className='stt no';st.textContent=t('er_'+(['invalid','rate','fast','not_configured'].includes(j.code)?j.code:'x'))}
 }catch(x){st.className='stt no';st.textContent=t('er_x')}finally{busy=false;btn.disabled=false}});
SD.done=()=>open({k:'done'});
// копіювання контактів
function decorate(){$$('#cl > a').forEach(a=>{const h=a.getAttribute('href'),v=h.startsWith('tel:')?a.textContent.trim():h.startsWith('mailto:')?h.slice(7):'@'+h.split('/').pop();
 const w=document.createElement('div');w.className='cr';a.replaceWith(w);w.append(a);const b=document.createElement('button');b.type='button';b.className='cp';b.dataset.copy=v;b.textContent=t('cp');b.setAttribute('aria-label',t('cp')+': '+v);w.append(b)})}
async function copy(b){const v=b.dataset.copy;try{await navigator.clipboard.writeText(v)}catch(x){const a=document.createElement('textarea');a.value=v;a.style.cssText='position:fixed;opacity:0';document.body.append(a);a.select();try{document.execCommand('copy')}catch(y){}a.remove()}
 b.textContent=t('cpd');b.classList.add('on');setTimeout(()=>{b.textContent=t('cp');b.classList.remove('on')},1600)}
// картки послуг доступні з клавіатури
function tag(){$$('#cat .cd').forEach(c=>{c.tabIndex=0;c.setAttribute('aria-haspopup','dialog')})}
// FAQ: плавне відкриття/закриття
$$('details').forEach(d=>{const s=d.querySelector('summary');s.addEventListener('click',e=>{e.preventDefault();if(d._a)d._a.cancel();const h0=d.offsetHeight,op=d.open,dur=reduce?0:380,ease='cubic-bezier(.22,1,.36,1)';
 d.style.overflow='hidden';let h1;if(op)h1=s.offsetHeight;else{d.open=true;h1=d.offsetHeight}
 d._a=d.animate({height:[h0+'px',h1+'px']},{duration:dur,easing:ease});d._a.onfinish=()=>{if(op)d.open=false;d.style.overflow='';d._a=null};d._a.oncancel=()=>{d.style.overflow=''}})});
SD.hooks.push(()=>{decorate();tag();if(view)render()});decorate();tag();
})();
