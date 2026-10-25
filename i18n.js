/* ════════════════════════════════════════════════════════════════
   i18n.js · Idioma de la web: castellano (es) o valenciano (va).

   · El idioma se elige con el botón ES/VAL de la cabecera, con ?lang=va
     o ?lang=es en la dirección, o según el idioma del navegador.
   · Cada página carga, solo en valenciano, su diccionario
     i18n/<pagina>.va.js, que rellena VA.ui (frase en castellano → frase
     en valenciano), VA.html (bloques con data-i18n) y sus datos propios.
   · tr('texto {n}', {n:3}) devuelve el texto en el idioma activo.
   · trDOM(raíz) traduce los textos fijos del HTML.
   Se carga en <head> con: <script src="i18n.js" data-pagina="index"></script>
   ════════════════════════════════════════════════════════════════ */
(function(){
  var L=null, p=null;
  try{ p=new URLSearchParams(location.search).get('lang'); }catch(e){}
  if(p==='va'||p==='es'){ L=p; try{ localStorage.setItem('idioma',p); }catch(e){} }
  if(!L){ try{ L=localStorage.getItem('idioma'); }catch(e){} }
  if(L!=='va'&&L!=='es') L=/^(ca|va)\b/i.test(navigator.language||'')?'va':'es';
  window.LANG=L;
  document.documentElement.lang = L==='va' ? 'ca-ES-valencia' : 'es';
  window.VA={ui:{
    'Cambiar a modo claro':'Canviar al mode clar', 'Cambiar a modo oscuro':'Canviar al mode fosc'
  }, html:{}};

  var me=document.currentScript, pagina=me&&me.getAttribute('data-pagina');
  if(L==='va'&&pagina) document.write('<script src="i18n/'+pagina+'.va.js"><\/script>');

  function rellena(s,v){ return v ? String(s).replace(/\{(\w+)\}/g,function(m,k){ return v[k]!=null?v[k]:m; }) : s; }
  window.tr=function(s,v){
    var r=s;
    if(L==='va'){
      var x=VA.ui[s];
      if(x!=null) r=x; else if(window.I18N_DEBUG&&s&&/[a-záéíóúñ]/i.test(s)) (window.I18N_FALTAN=window.I18N_FALTAN||{})[s]=1;
    }
    return rellena(r,v);
  };

  var ATRS=['placeholder','title','aria-label','alt'];
  function clave(t){ return t.replace(/\s+/g,' ').trim(); }
  window.trDOM=function(raiz){
    if(L!=='va'||!raiz) return;
    raiz.querySelectorAll('[data-i18n]').forEach(function(el){
      var h=VA.html[el.getAttribute('data-i18n')]; if(h!=null) el.innerHTML=h;
    });
    var w=document.createTreeWalker(raiz, NodeFilter.SHOW_TEXT, {acceptNode:function(n){
      var p=n.parentNode; if(!p) return 2;
      var tag=p.nodeName; if(tag==='SCRIPT'||tag==='STYLE'||tag==='TEXTAREA') return 2;
      if(p.closest&&p.closest('[data-i18n]')) return 2;
      return /\S/.test(n.nodeValue)?1:2;
    }});
    var nodos=[], n; while((n=w.nextNode())) nodos.push(n);
    nodos.forEach(function(n){
      var k=clave(n.nodeValue), x=VA.ui[k];
      if(x!=null){ var m=n.nodeValue.match(/^(\s*)[\s\S]*?(\s*)$/); n.nodeValue=m[1]+x+m[2]; }
      else if(window.I18N_DEBUG&&/[a-záéíóúñ]{3}/i.test(k)) (window.I18N_FALTAN=window.I18N_FALTAN||{})[k]=1;
    });
    raiz.querySelectorAll('['+ATRS.join('],[')+']').forEach(function(el){
      ATRS.forEach(function(a){ var v=el.getAttribute(a); if(v){ var x=VA.ui[clave(v)]; if(x!=null) el.setAttribute(a,x); } });
    });
    if(raiz===document.body||raiz===document.documentElement){
      var t=VA.ui[clave(document.title)]; if(t!=null) document.title=t;
      var md=document.querySelector('meta[name="description"]');
      if(md){ var d=VA.ui[clave(md.content)]; if(d!=null) md.content=d; }
    }
  };

  /* Fechas: «11 oct 2026» / «11 oct. 2026» */
  var MESES={es:['ene','feb','mar','abr','may','jun','jul','ago','sept','oct','nov','dic'],
             va:['gen.','febr.','març','abr.','maig','juny','jul.','ag.','set.','oct.','nov.','des.']};
  window.fechaIdioma=function(iso){
    var f=String(iso||'').split('-'); if(f.length<3) return '';
    return (+f[2])+' '+MESES[L][+f[1]-1]+' '+f[0];
  };

  /* Enlace en el idioma actual (para compartir) */
  window.urlIdioma=function(url){
    if(L!=='va') return url;
    var u=new URL(url, location.href); u.searchParams.set('lang','va'); return u.href;
  };

  /* Botón ES / VAL en la cabecera */
  function boton(){
    var h=document.querySelector('header'); if(!h||h.querySelector('.lang-btn')) return;
    var b=document.createElement('button');
    b.type='button'; b.className='lang-btn';
    b.textContent = L==='va' ? 'ES' : 'VAL';
    var t = L==='va' ? 'Ver en castellano' : 'Veure en valencià';
    b.title=t; b.setAttribute('aria-label',t); b.setAttribute('lang', L==='va'?'es':'ca-ES-valencia');
    b.addEventListener('click',function(){
      var nuevo = L==='va' ? 'es' : 'va';
      try{ localStorage.setItem('idioma',nuevo); }catch(e){}
      var u=new URL(location.href); u.searchParams.delete('lang');
      history.replaceState(null,'',u.pathname+u.search+u.hash);
      location.reload();
    });
    h.appendChild(b);
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',boton); else boton();
})();
