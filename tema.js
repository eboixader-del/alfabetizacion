/* tema.js · Botón para cambiar entre modo claro y oscuro.
   Sin elección guardada, sigue la preferencia del sistema. */
(function(){
  var KEY='tema', root=document.documentElement;
  var mq=window.matchMedia?matchMedia('(prefers-color-scheme: dark)'):null;
  function guardado(){ try{ return localStorage.getItem(KEY); }catch(e){ return null; } }
  function aplicar(oscuro){
    root.dataset.theme=oscuro?'dark':'light';
    if(btn){
      btn.textContent=oscuro?'☀️':'🌙';
      var t=oscuro?'Cambiar a modo claro':'Cambiar a modo oscuro';
      btn.setAttribute('aria-label',t); btn.title=t;
    }
  }
  var btn=null, header=document.querySelector('header');
  if(header){
    btn=document.createElement('button');
    btn.type='button'; btn.className='theme-btn';
    header.appendChild(btn);
    btn.addEventListener('click',function(){
      var oscuro=root.dataset.theme!=='dark';
      try{ localStorage.setItem(KEY, oscuro?'oscuro':'claro'); }catch(e){}
      aplicar(oscuro);
    });
  }
  var g=guardado();
  aplicar(g ? g==='oscuro' : !!(mq&&mq.matches));
  if(mq){
    var cambio=function(e){ if(!guardado()) aplicar(e.matches); };
    if(mq.addEventListener) mq.addEventListener('change',cambio); else if(mq.addListener) mq.addListener(cambio);
  }
})();
