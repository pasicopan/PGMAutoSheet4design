

var Pcauto = (function() {
  var slice=[].slice, d=document,
  ADJ_OPS={append: 'beforeEnd', prepend: 'afterBegin', before: 'beforeBegin', after: 'afterEnd'},
  e, k, css, un;

  // fix for iOS 3.2
  if(String.prototype.trim === un)
    String.prototype.trim = function(){ return this.replace(/^\s+/, '').replace(/\s+$/, '') };

  function $$(el, selector){ return slice.call(el.querySelectorAll(selector)) }
  function classRE(name){ return new RegExp("(^|\\s)"+name+"(\\s|$)") }
  function compact(array){ return array.filter(function(el){ return el !== un && el !== null }) }
  function uniq(array)    { return array.filter(function(item,index,array){ return array.indexOf(item) == index }) }
  function Z(dom, _){ this.dom = dom || []; this.selector = _ || '' }
  Z.prototype = $.fn;

  function $(_, context){
    return _ == document ? new Z : (context !== un) ? $(context).find(_) : new Z(compact(_ instanceof Z ? _.dom : (_ instanceof Array ? _ : (_ instanceof Element ? [_] : $$(d, _)))), _);
  }
  
  $.extend = function(target, src){ for(k in src) target[k] = src[k] }
  camelize = function(str){ return str.replace(/-+(.)?/g, function(match, chr){ return chr ? chr.toUpperCase() : '' }) }
  $.loadJS = function( id, fileUrl, callback ){ 
    var scriptTag = document.getElementById( id ); 
    var oHead = document.getElementsByTagName('HEAD').item(0); 
    var oScript= document.createElement("script"); 
    oScript.onload = function(){				
     if(typeof callback === "function"){
      callback();
    }
  };
  if ( scriptTag  ) oHead.removeChild( scriptTag  ); 
  oScript.id = id; 
  oScript.type = "text/javascript"; 
  oScript.src=fileUrl ; 
  oHead.appendChild( oScript); 
} 
function filtered(nodes, selector){
  return selector === undefined ? $(nodes) : $(slice.call(nodes)).filter(selector);
}
$.fn = {
  ready: function(callback){ 
    document.addEventListener('DOMContentLoaded', callback, false); return this;
  },
  compact: function(){ this.dom=compact(this.dom); return this },
  get: function(idx){ return idx === un ? this.dom : this.dom[idx] },
  remove: function(){
    return this.each(function(el){ el.parentNode.removeChild(el) });
  },
  each: function(callback){ this.dom.forEach(callback); return this },
  filter: function(selector){
    return $(this.dom.filter(function(el){ return $$(el.parentNode, selector).indexOf(el)>=0; }));
  },
  add: function(selector,context){
    return $(uniq(this.concat($(selector,context))))
  },
  is: function(selector){ 
    return this.dom.length>0 && $(this.dom[0]).filter(selector).dom.length>0;
  },
  first: function(callback){ this.dom=compact([this.dom[0]]); return this },
  find: function(selector){
    return $(this.dom.map(function(el){ return $$(el, selector) }).reduce(function(a,b){ return a.concat(b) }, []));
  },
  closest: function(selector){
    var el = this.dom[0].parentNode, nodes = $$(d, selector);
    while(el && nodes.indexOf(el)<0) el = el.parentNode;
    return $(el && !(el===d) ? el : []);
  },
  pluck: function(property){ return this.dom.map(function(el){ return el[property] }) },
  show: function(){ return this.css('display', 'block') },
  hide: function(){ return this.css('display', 'none') },
  parent: function(selector){
    return filtered(uniq(this.pluck('parentNode')), selector);
  },
  prev: function(){ return $(this.pluck('previousElementSibling')) },
  next: function(){ return $(this.pluck('nextElementSibling')) },
  siblings: function(selector){
    return filtered(this.dom.map(function(el,b,c,d){
      return slice.call(el.parentNode.children).filter(function(child){ return child!==el });
    })[0], selector);
  },
  html: function(html){
    return html === un ? 
    (this.dom.length>0 ? this.dom[0].innerHTML : null) : 
    this.each(function(el){ el.innerHTML = html });
  },
  attr: function(name,value){
    return (typeof name == 'string' && value === un) ? 
    (this.dom.length>0 ? this.dom[0].getAttribute(name) || undefined : null) :
    this.each(function(el){
      if (typeof name == 'object') for(k in name) el.setAttribute(k, name[k])
        else el.setAttribute(name,value);
    });
  },
  data: function(name, value){
    if(value){
      return this.attr('data-' + name, value);
    }else{
      return this.attr('data-' + name);
    }
  },
  offset: function(){
    var obj = this.dom[0].getBoundingClientRect();
    return { left: obj.left+d.body.scrollLeft, top: obj.top+d.body.scrollTop, width: obj.width, height: obj.height };
  },
  css: function(prop, value){
    if(value === un && typeof prop == 'string') return this.dom[0].style[camelize(prop)] || window.getComputedStyle(this.dom[0], null).getPropertyValue(camelize(prop));
    css=""; for(k in prop) css += k+':'+prop[k]+';';
    if(typeof prop == 'string') css = prop+":"+value;
    return  this.each(function(el) { el.style.cssText += ';' + css });
  },
  index: function(el){
    return this.dom.indexOf($(el).get(0));
  },
  bind: function(event, callback, isPreventDefault){
    if(/swipe/.test(event)){
      return this.live(event, callback, isPreventDefault||{isPreventDefault:true});
    }
    return this.each(function(el){
      event.split(/\s/).forEach(function(event){ el.addEventListener(event, callback, false); });
    });
  },
  unbind: function(event, callback){
    return this.each(function(el){
      event.split(/\s/).forEach(function(event){ el.removeEventListener(event, callback, false); });
    });
  },
  delegate: function(selector, a_sevent, callback, a_isPreventDefault){
    return this.each(function(el){
      el.addEventListener(a_sevent, function(event){
        var target = event.target, nodes = $$(el, selector);
        while(target && nodes.indexOf(target)<0) target = target.parentNode;
        if(target && !(target===el) && !(target===d)) {
          if($(target).hasDataStr( a_sevent, "swipeDirection" ))  {
            function PreventDefault(e){
              // console.log("PreventDefault",a_isPreventDefault.isPreventDefault)
              if(!a_isPreventDefault.isPreventDefault) return false;
              e.preventDefault();
              e.stopPropagation();
            }
            function Touchend(e){
              document.removeEventListener("touchmove",PreventDefault,false);
              document.removeEventListener("touchend",Touchend,false);
            }
            document.addEventListener("touchmove",PreventDefault,false)
            document.addEventListener("touchend",Touchend,false)
          }
          callback(target, event);
        }
      }, false);
    });
  },
  live: function(event, callback, isPreventDefault){
    this.addDataStr(event, "swipeDirection");
    $(d.body).delegate(this.selector, event, callback, isPreventDefault); return this;
  },
  toggle: function(name){
    return this.each(function(el){
      if( $(el).hasClass(name) ){
       el.className = el.className.replace(classRE(name), ' ').trim(); 
     }else{
      $(el).addClass(name);}
    });
  },
  hasClass: function(name){
    return classRE(name).test(this.dom[0].className);
  },
  hasDataStr: function(name,str){
    return classRE(name).test(this.data(str));
  },
  addClass: function(name){
    return this.each(function(el){ !$(el).hasClass(name) && (el.className += (el.className ? ' ' : '') + name) });
  },
  addDataStr: function(name,str){
    return this.each(function(el){ var data_str = $(el).data(str);!$(el).hasDataStr(name,str) && ($(el).data(str,(data_str ? (data_str+' ') : '') + name))  });
  },
  removeClass: function(name){
    return this.each(function(el){ el.className = el.className.replace(classRE(name), ' ').trim() });
  },
  trigger: function(event){
    return this.each(function(el){ var e; el.dispatchEvent(e = d.createEvent('Events'), e.initEvent(event, true, false)) });
  },

},

['width','height'].forEach(function(m){ $.fn[m] = function(){ return this.offset()[m] }});

for(k in ADJ_OPS)
  $.fn[k] = (function(op){
    return function(html){ return this.each(function(el){
      el['insertAdjacent' + (html instanceof Element ? 'Element' : 'HTML')](op,html)
    })};
  })(ADJ_OPS[k]);

  Z.prototype = $.fn;

  return $;
})();

'$' in window||(window.$=Pcauto);
(function($){

  var touch={};
  
  function parentIfText(node){
    return 'tagName' in node ? node : node.parentNode;
  }
  
  $(document).ready(function(){
    $(document.body).bind('touchstart', function(e){

      touch.target = parentIfText(e.touches[0].target);
      touch.el = $(touch.target)
      touch.according=false;
      touch.swipe=false;
      touch.x1 = e.touches[0].pageX;
      touch.y1 = e.touches[0].pageY;
    }).bind('touchmove', function(e){
      if(true===touch.swipe) {
        return false;
      }
      touch.swipe=true;
      touch.x2 = e.touches[0].pageX;
      touch.y2 = e.touches[0].pageY;
      touch.deltaX = touch.x2 - touch.x1,
      touch.deltaY = touch.y2 - touch.y1;
      
      function swipeDirection(x1, x2, y1, y2){
        var xDelta = Math.abs(x1 - x2), yDelta = Math.abs(y1 - y2)
        return xDelta >= yDelta ? (x1 - x2 > 0 ? 'Left' : 'Right') : (y1 - y2 > 0 ? 'Up' : 'Down')
      }
      var _sSwipeDirection = 'swipe' + swipeDirection(touch.x1, touch.x2, touch.y1, touch.y2);
      touch.el.trigger(_sSwipeDirection);
  }).bind('touchend', function(e){
    if(!touch.swipe){
      $(touch.target).trigger('tap')
      $(touch.target).trigger('click')
    } 
  touch = {};
}).bind('touchcancel', function(){ touch={} });
});

['swipe', 'tap','swipeLeft','swipeRight','swipeUp','swipeDown'].forEach(function(m){
  $.fn[m] = function(callback){ return this.bind(m, callback) }
  if( 'ontouchstart' in window){}else{ $.fn.tap = function(callback){ return this.bind("click", callback) }}

});
})(Pcauto);

