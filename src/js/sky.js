(function(){
  var PHASES=[
    {s:0.0,key:'深夜',en:'Late night',p:{skyTop:'oklch(0.13 0.03 265)',skyBot:'oklch(0.20 0.04 270)',ink:'oklch(0.91 0.02 275)',muted:'oklch(0.66 0.025 270)',faint:'oklch(0.52 0.02 270)',line:'oklch(0.30 0.02 270)',accent:'oklch(0.82 0.05 90)',cel:'oklch(0.93 0.03 95)',glow:'oklch(0.88 0.05 95 / 0.35)',stars:0.85}},
    {s:3.0,key:'凌晨',en:'Pre-dawn',p:{skyTop:'oklch(0.20 0.05 285)',skyBot:'oklch(0.37 0.07 305)',ink:'oklch(0.90 0.02 290)',muted:'oklch(0.70 0.03 290)',faint:'oklch(0.56 0.025 290)',line:'oklch(0.36 0.03 290)',accent:'oklch(0.80 0.07 330)',cel:'oklch(0.90 0.03 300)',glow:'oklch(0.85 0.06 320 / 0.30)',stars:0.5}},
    {s:5.0,key:'清晨',en:'Daybreak',p:{skyTop:'oklch(0.70 0.07 250)',skyBot:'oklch(0.86 0.09 45)',ink:'oklch(0.32 0.03 45)',muted:'oklch(0.46 0.03 45)',faint:'oklch(0.56 0.03 45)',line:'oklch(0.78 0.04 55)',accent:'oklch(0.60 0.14 35)',cel:'oklch(0.86 0.11 55)',glow:'oklch(0.84 0.13 50 / 0.50)',stars:0}},
    {s:7.0,key:'早晨',en:'Morning',p:{skyTop:'oklch(0.80 0.09 235)',skyBot:'oklch(0.94 0.05 225)',ink:'oklch(0.28 0.03 240)',muted:'oklch(0.44 0.03 240)',faint:'oklch(0.56 0.03 240)',line:'oklch(0.86 0.04 230)',accent:'oklch(0.58 0.13 50)',cel:'oklch(0.91 0.10 85)',glow:'oklch(0.90 0.12 85 / 0.50)',stars:0}},
    {s:10.0,key:'中午',en:'Noon',p:{skyTop:'oklch(0.87 0.06 230)',skyBot:'oklch(0.97 0.02 120)',ink:'oklch(0.26 0.02 250)',muted:'oklch(0.44 0.02 250)',faint:'oklch(0.56 0.02 250)',line:'oklch(0.89 0.03 230)',accent:'oklch(0.60 0.13 60)',cel:'oklch(0.98 0.05 95)',glow:'oklch(0.96 0.09 95 / 0.60)',stars:0}},
    {s:14.0,key:'下午',en:'Afternoon',p:{skyTop:'oklch(0.82 0.08 215)',skyBot:'oklch(0.93 0.09 80)',ink:'oklch(0.27 0.025 245)',muted:'oklch(0.45 0.025 245)',faint:'oklch(0.57 0.025 245)',line:'oklch(0.86 0.05 90)',accent:'oklch(0.57 0.14 55)',cel:'oklch(0.86 0.12 70)',glow:'oklch(0.84 0.14 65 / 0.55)',stars:0}},
    {s:17.0,key:'傍晚',en:'Dusk',p:{skyTop:'oklch(0.58 0.10 55)',skyBot:'oklch(0.80 0.13 50)',ink:'oklch(0.25 0.03 40)',muted:'oklch(0.38 0.04 40)',faint:'oklch(0.48 0.04 40)',line:'oklch(0.68 0.06 50)',accent:'oklch(0.46 0.16 32)',cel:'oklch(0.76 0.15 45)',glow:'oklch(0.74 0.16 40 / 0.60)',stars:0}},
    {s:18.5,key:'黄昏·晚霞',en:'Sunset',p:{skyTop:'oklch(0.34 0.10 295)',skyBot:'oklch(0.60 0.17 38)',ink:'oklch(0.96 0.02 60)',muted:'oklch(0.84 0.04 55)',faint:'oklch(0.72 0.04 50)',line:'oklch(0.54 0.08 40)',accent:'oklch(0.90 0.11 65)',cel:'oklch(0.72 0.17 40)',glow:'oklch(0.72 0.18 40 / 0.60)',stars:0.12}},
    {s:19.5,key:'晚上',en:'Night',p:{skyTop:'oklch(0.20 0.05 270)',skyBot:'oklch(0.31 0.06 265)',ink:'oklch(0.92 0.02 275)',muted:'oklch(0.70 0.025 270)',faint:'oklch(0.55 0.02 270)',line:'oklch(0.34 0.03 270)',accent:'oklch(0.83 0.05 90)',cel:'oklch(0.92 0.03 95)',glow:'oklch(0.88 0.05 95 / 0.40)',stars:0.6}},
    {s:22.0,key:'深夜',en:'Late night',p:{skyTop:'oklch(0.13 0.03 265)',skyBot:'oklch(0.20 0.04 270)',ink:'oklch(0.91 0.02 275)',muted:'oklch(0.66 0.025 270)',faint:'oklch(0.52 0.02 270)',line:'oklch(0.30 0.02 270)',accent:'oklch(0.82 0.05 90)',cel:'oklch(0.93 0.03 95)',glow:'oklch(0.88 0.05 95 / 0.35)',stars:0.85}}
  ];
  function mulberry32(a){return function(){a|=0;a=a+0x6D2B79F5|0;var t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};}
  function curDate(){var u=new URLSearchParams(location.search);if(u.has('d')){var p=u.get('d').split('-');return new Date(+p[0],(+p[1])-1,+p[2],12,0,0);}return new Date();}
  function buildStars(){var box=document.getElementById('stars');if(!box)return;var d=curDate();var seed=d.getFullYear()*10000+(d.getMonth()+1)*100+d.getDate();var rnd=mulberry32(seed);var n=58+Math.floor(rnd()*22);box.innerHTML='';for(var i=0;i<n;i++){var el=document.createElement('i');el.className='star';var x=(rnd()*100).toFixed(2);var y=(rnd()*56).toFixed(2);var s=(1+rnd()*1.5).toFixed(2);var o=(0.35+rnd()*0.6).toFixed(2);var dl=(rnd()*6).toFixed(2);var du=(2.6+rnd()*3.6).toFixed(2);el.style.cssText='left:'+x+'%;top:'+y+'%;width:'+s+'px;height:'+s+'px;opacity:'+o+';animation-delay:'+dl+'s;animation-duration:'+du+'s';box.appendChild(el);}}
  function moonPhase(date){var ref=Date.UTC(2000,0,6,18,14);var syn=29.530588853;var days=(date.getTime()-ref)/86400000;var p=(((days/syn)%1)+1)%1;var f=(1-Math.cos(2*Math.PI*p))/2;f=Math.max(0.10,f);var dir=p<0.5?1:-1;return{f:f,dir:dir};}
  function applyMoon(cel){var mp=moonPhase(curDate());var cx=(41+mp.dir*mp.f*82).toFixed(1);var m='radial-gradient(41px at '+cx+'px 41px, transparent 0 40px, #000 41px)';cel.style.webkitMask=m;cel.style.mask=m;}
  function phaseFor(h){var r=PHASES[0];for(var i=0;i<PHASES.length;i++){if(h>=PHASES[i].s)r=PHASES[i];}return r;}
  function setVars(p){var r=document.documentElement.style;r.setProperty('--sky-top',p.skyTop);r.setProperty('--sky-bot',p.skyBot);r.setProperty('--ink',p.ink);r.setProperty('--muted',p.muted);r.setProperty('--faint',p.faint);r.setProperty('--line',p.line);r.setProperty('--accent',p.accent);r.setProperty('--cel',p.cel);r.setProperty('--cel-glow',p.glow);r.setProperty('--stars',p.stars);}
  function place(h){var cel=document.getElementById('cel');if(!cel)return;var frac,night;if(h>=5&&h<19){frac=(h-5)/14;night=false;}else{frac=((h-19+24)%24)/10;night=true;}var H=(window.innerWidth<=480?440:520);var x=6+frac*88;var topPx=((76-Math.sin(frac*Math.PI)*62)/100)*H;cel.style.left=x+'%';cel.style.top=topPx.toFixed(1)+'px';if(night){cel.className='cel moon';applyMoon(cel);}else{cel.className='cel sun';cel.style.webkitMask='none';cel.style.mask='none';}}
  function apply(h){var ph=phaseFor(h);setVars(ph.p);place(h);var lab=document.getElementById('phaseLab');if(lab)lab.textContent=ph.key+' · '+ph.en;}
  function hourNow(){var u=new URLSearchParams(location.search);if(u.has('t'))return parseFloat(u.get('t'));var d=new Date();return d.getHours()+d.getMinutes()/60;}
  var parallaxBound=false;
  function parallaxTick(){
    var y=window.scrollY||window.pageYOffset||0;
    var stars=document.getElementById('stars');
    var field=document.querySelector('.skyfield');
    if(stars)stars.style.transform='translate3d(0,'+(y*-0.10).toFixed(1)+'px,0)';
    if(field)field.style.transform='translate3d(0,'+(y*-0.24).toFixed(1)+'px,0)';
  }
  function setupParallax(){
    parallaxTick();
    if(parallaxBound)return;parallaxBound=true;
    var scheduled=false;
    window.addEventListener('scroll',function(){if(scheduled)return;scheduled=true;requestAnimationFrame(function(){parallaxTick();scheduled=false;});},{passive:true});
    window.addEventListener('resize',parallaxTick,{passive:true});
  }
  var timer=null;
  window.initSky=function(){buildStars();apply(hourNow());setupParallax();if(!timer){timer=setInterval(function(){apply(hourNow());},60000);}};
})();
