!function(e,t){"object"==typeof exports&&"undefined"!=typeof module?module.exports=t():"function"==typeof define&&define.amd?define(t):e.EventDispatcher=t()}(this,function(){"use strict";var e,t,s=(function(e,t){Object.defineProperty(t,"__esModule",{value:!0});const s=(e=>(t,s)=>Boolean(t&&e.call(t,s)))(Object.prototype.hasOwnProperty);t.hasOwn=s,t.default=s}(e={exports:{}},e.exports),e.exports),i=(t=s)&&t.__esModule&&Object.prototype.hasOwnProperty.call(t,"default")?t.default:t;s.hasOwn;class n{constructor(e,t=null){this.type=e,this.data=t,this.defaultPrevented=!1}toJSON(){return{type:this.type,data:this.data}}isDefaultPrevented(){return this.defaultPrevented}preventDefault(){this.defaultPrevented=!0}}class r{constructor(e,t,s){this.index=-1,this.immediatelyStopped=!1,this.stopImmediatePropagation=(()=>{this.immediatelyStopped=!0}),this.listeners=e,this.onStopped=t,this.onComplete=s}run(e,t){let s;const{listeners:i}=this;for(this.augmentEvent(e),this.index=0;this.index<i.length&&!this.immediatelyStopped;this.index++)(s=i[this.index]).call(t,e);this.clearEvent(e),this.onComplete(this)}augmentEvent(e){const t=e;t.stopPropagation=this.onStopped,t.stopImmediatePropagation=this.stopImmediatePropagation}clearEvent(e){const t=e;delete t.stopPropagation,delete t.stopImmediatePropagation}listenerRemoved(e,t){e===this.listeners&&t<=this.index&&this.index--}}class o{constructor(){this._listeners={},this._runners=[],this.removeRunner=(e=>{this._runners.splice(this._runners.indexOf(e),1)})}createList(e,t){const s=parseInt(t,10),n=this.getPrioritiesByKey(e),r=String(s);let o;return i(n,r)?o=n[r]:(o=[],n[r]=o),o}getPrioritiesByKey(e){let t;return i(this._listeners,e)?t=this._listeners[e]:(t={},this._listeners[e]=t),t}add(e,t,s){const i=this.createList(e,s);i.indexOf(t)<0&&i.push(t)}has(e){let t,s=!1;const n=this.getPrioritiesByKey(e);if(n)for(t in n)if(i(n,t)){s=!0;break}return s}remove(e,t){const s=this.getPrioritiesByKey(e);if(s){const e=Object.getOwnPropertyNames(s),{length:i}=e;for(let n=0;n<i;n++){const i=e[n],r=s[i],o=r.indexOf(t);o>=0&&(r.splice(o,1),r.length||delete s[i],this._runners.forEach(e=>{e.listenerRemoved(r,o)}))}}}removeAll(e){delete this._listeners[e]}createRunner(e,t){const s=new r(e,t,this.removeRunner);return this._runners.push(s),s}call(e,t){const s=this.getPrioritiesByKey(e.type);let i=!1;const n=()=>{i=!0};if(s){const r=Object.getOwnPropertyNames(s).sort((e,t)=>e-t),{length:o}=r;for(let l=0;l<o&&!i;l++){const i=s[r[l]];if(i){const s=this.createRunner(i,n);if(s.run(e,t),s.immediatelyStopped)break}}}}}class l{constructor(e=null,t=!1){t||this.initialize(e)}initialize(e=null){this._eventPreprocessor=e,this._listeners=new o}addEventListener(e,t,s=0){this._listeners.add(e,t,-s||0)}hasEventListener(e){return this._listeners.has(e)}removeEventListener(e,t){this._listeners.remove(e,t)}removeAllEventListeners(e){this._listeners.removeAll(e)}dispatchEvent(e,t){let s=l.getEvent(e,t);this._eventPreprocessor&&(s=this._eventPreprocessor.call(this,s)),this._listeners.call(s)}static isObject(e){return"object"==typeof e&&null!==e}static getEvent(e,t){let s=e;return l.isObject(e)||(s=new l.Event(String(e),t)),s}static create(e){return new l(e)}}l.Event=n;var a=Object.freeze({Event:n,default:l}),h=a&&l||a;return h.default||h});
//# sourceMappingURL=event-dispatcher.direct.js.map
