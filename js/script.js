/* ===== SETTINGS: change the WhatsApp number here (international format, no + or spaces) ===== */
const WA_NUMBER='250780288517';
const EMAIL='keypower.e@gmail.com';   /* only used as a fallback if the key below is empty */
const W3F_KEY='a9b81857-4139-49c3-b90b-96455b7ac4ed';   /* paste your free Web3Forms access key between the quotes (see instructions) */
document.querySelectorAll('[data-wa]').forEach(a=>{a.href='https://wa.me/'+WA_NUMBER+(a.classList.contains('wa')?'?text='+encodeURIComponent('Hello Keypower Engineering, I\u2019d like to make an enquiry.'):'')});

/* Sticky nav tightens on scroll */
const nav=document.getElementById('nav');
const toTop=document.querySelector('.totop');
const onScroll=()=>{nav.classList.toggle('scrolled',window.scrollY>40);if(toTop)toTop.classList.toggle('show',window.scrollY>700)};
onScroll();addEventListener('scroll',onScroll,{passive:true});

/* Mobile menu */
const burger=document.getElementById('burger'),menu=document.getElementById('menu');
const setMenu=o=>{menu.classList.toggle('open',o);burger.setAttribute('aria-expanded',o);burger.setAttribute('aria-label',o?'Close menu':'Open menu')};
burger.addEventListener('click',()=>setMenu(!menu.classList.contains('open')));
menu.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>setMenu(false)));
addEventListener('keydown',e=>{if(e.key==='Escape')setMenu(false)});

/* Projects: filter */
const chips=document.querySelectorAll('.fchip'),items=document.querySelectorAll('#projGrid > li');
chips.forEach(c=>c.addEventListener('click',()=>{
  chips.forEach(x=>x.setAttribute('aria-pressed',x===c));
  const f=c.dataset.filter;
  items.forEach(li=>{li.hidden=!(f==='all'||li.dataset.cat===f)});
}));

/* Contact: quote form. "Send message" emails our inbox through Web3Forms (no server needed); the WhatsApp button opens a ready message */
const sendBtn=document.getElementById('sendBtn'),statusEl=document.getElementById('formStatus');
const setStatus=(m,cls)=>{if(statusEl){statusEl.textContent=m;statusEl.className='status '+(cls||'')}else if(m){alert(m)}};
document.getElementById('quoteForm').addEventListener('submit',async e=>{
  e.preventDefault();
  const f=e.target,via=e.submitter&&e.submitter.dataset.via;
  const name=document.getElementById('qName').value.trim(),phone=document.getElementById('qPhone').value.trim(),
        email=document.getElementById('qEmail').value.trim(),svc=document.getElementById('qService').value,
        msg=document.getElementById('qMsg').value.trim();
  const text=`Hello Keypower Engineering,\n\nMy name is ${name}.\nService: ${svc}\n${phone?'Phone: '+phone+'\n':''}${email?'Email: '+email+'\n':''}\nProject details:\n${msg}`;
  if(via==='wa'){
    window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(text)}`,'_blank','noopener');
    return;
  }
  const hp=f.querySelector('.hp');
  if(hp&&hp.checked)return;                                       /* spam trap */
  if(!phone&&!email){setStatus('Please add a phone number or an email so we can reply.','err');return}
  if(!W3F_KEY){                                                   /* fallback until the key is added */
    location.href=`mailto:${EMAIL}?subject=${encodeURIComponent('Quote request: '+svc)}&body=${encodeURIComponent(text)}`;
    return;
  }
  if(sendBtn){sendBtn.disabled=true;sendBtn.textContent='Sending...'}
  setStatus('');
  try{
    const body={access_key:W3F_KEY,subject:'Website quote request: '+svc,from_name:'Keypower website',name,phone,service:svc,message:msg};
    if(email)body.email=email;
    const r=await fetch('https://api.web3forms.com/submit',{method:'POST',headers:{'Content-Type':'application/json',Accept:'application/json'},body:JSON.stringify(body)});
    const d=await r.json();
    if(r.ok&&d.success){setStatus('Thank you! Your message has been sent. We will get back to you soon.','ok');f.reset()}
    else throw new Error(d.message||'failed');
  }catch(err){
    setStatus('Sorry, your message could not be sent. Please use WhatsApp or call +250 788 657 197.','err');
  }finally{
    if(sendBtn){sendBtn.disabled=false;sendBtn.textContent='Send message'}
  }
});

/* Day / night switch (remembers the visitor's choice) */
const themeBtn=document.getElementById('themeBtn');
if(themeBtn){
  const applyTheme=t=>{
    document.documentElement.dataset.theme=t;
    themeBtn.setAttribute('aria-label',t==='dark'?'Switch to light mode':'Switch to dark mode');
  };
  applyTheme(document.documentElement.dataset.theme==='dark'?'dark':'light');
  themeBtn.addEventListener('click',()=>{
    const t=document.documentElement.dataset.theme==='dark'?'light':'dark';
    applyTheme(t);
    try{localStorage.setItem('theme',t)}catch(e){}
  });
}