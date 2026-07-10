(function(){
  function isDebugMode(){
    var u=new URLSearchParams(location.search);
    return u.get('mode')==='debug';
  }
  function pad(n){return String(n).padStart(2,'0');}
  function fmtHour(h){
    var hh=Math.floor(h);
    var mm=Math.round((h-hh)*60);
    if(mm>=60){mm-=60;hh=(hh+1)%24;}
    return pad(hh)+':'+pad(mm);
  }
  function todayStr(){
    var d=new Date();
    return d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDate();
  }
  function toInputDate(dStr){
    var p=dStr.split('-');
    return p[0]+'-'+pad(+p[1])+'-'+pad(+p[2]);
  }
  function setUrlParam(key,value){
    var url=new URL(location.href);
    url.searchParams.set(key,value);
    history.replaceState(null,'',url);
  }

  function buildPanel(){
    var params=new URLSearchParams(location.search);
    var now=new Date();
    var initialHour=params.has('t')?parseFloat(params.get('t')):(now.getHours()+now.getMinutes()/60);
    var initialDate=params.has('d')?params.get('d'):todayStr();

    var panel=document.createElement('div');
    panel.id='debugPanel';
    panel.innerHTML=
      '<div class="dbg-row">'+
        '<span class="dbg-label">\uD83D\uDD50 \u65F6\u95F4\u8C03\u8BD5</span>'+
        '<span class="dbg-time" id="dbgTimeLabel">'+fmtHour(initialHour)+'</span>'+
      '</div>'+
      '<input id="dbgHourSlider" type="range" min="0" max="23.98" step="0.05" value="'+initialHour+'">'+
      '<div class="dbg-row">'+
        '<input id="dbgDateInput" type="date" value="'+toInputDate(initialDate)+'">'+
        '<button id="dbgReset" type="button">\u91CD\u7F6E\u4E3A\u5F53\u524D\u65F6\u95F4</button>'+
      '</div>';
    document.body.appendChild(panel);

    var slider=panel.querySelector('#dbgHourSlider');
    var label=panel.querySelector('#dbgTimeLabel');
    var dateInput=panel.querySelector('#dbgDateInput');
    var resetBtn=panel.querySelector('#dbgReset');

    slider.addEventListener('input',function(){
      var h=parseFloat(slider.value);
      label.textContent=fmtHour(h);
      setUrlParam('t',h.toFixed(2));
      if(window.SkyDebug)window.SkyDebug.setHour(h);
    });

    dateInput.addEventListener('change',function(){
      if(!dateInput.value)return;
      var parts=dateInput.value.split('-');
      var dStr=parseInt(parts[0],10)+'-'+parseInt(parts[1],10)+'-'+parseInt(parts[2],10);
      setUrlParam('d',dStr);
      if(window.SkyDebug)window.SkyDebug.setDate(dStr);
    });

    resetBtn.addEventListener('click',function(){
      var url=new URL(location.href);
      url.searchParams.delete('t');
      url.searchParams.delete('d');
      history.replaceState(null,'',url);
      if(window.SkyDebug)window.SkyDebug.clear();
      var n=new Date();
      var h=n.getHours()+n.getMinutes()/60;
      slider.value=h;
      label.textContent=fmtHour(h);
      dateInput.value=n.getFullYear()+'-'+pad(n.getMonth()+1)+'-'+pad(n.getDate());
    });

    if(window.SkyDebug){
      if(params.has('d'))window.SkyDebug.setDate(initialDate);
      if(params.has('t'))window.SkyDebug.setHour(initialHour);
    }
  }

  window.initDebug=function(){
    if(!isDebugMode())return;
    if(document.getElementById('debugPanel'))return;
    buildPanel();
  };
})();
