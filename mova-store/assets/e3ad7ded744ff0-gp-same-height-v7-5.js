!function(){"use strict";let e=["desktop","tablet","mobile"];function t(e,t,i){return t in e?Object.defineProperty(e,t,{value:i,enumerable:!0,configurable:!0,writable:!0}):e[t]=i,e}let i=()=>{window.removeEventListener("gp-global-loaded",i);class l extends GP.Component{generateGridRowArrayByDevice(e,t){var i,l,o,r,d,s;let n=null!==(o=this.rowPerCol)&&void 0!==o?o:0,v=0,a=Math.ceil((null!==(r=null===(i=this.querySelectorAll(`[id=${t}]`))||void 0===i?void 0:i.length)&&void 0!==r?r:0)/+(null!==(d=null===(l=this.slidesToShow)||void 0===l?void 0:l[e])&&void 0!==d?d:1));return Array.from(Array(null!==(s=this.colLength)&&void 0!==s?s:0)).map((t,i)=>{var l,o;return i>=+(null!==(o=null===(l=this.slidesToShow)||void 0===l?void 0:l[e])&&void 0!==o?o:1)*(v+1)&&++v,{gridRow:`${1+n*v}/${n+1+n*v}`,marginBottom:v+1<a?this.getPropertyByDevice(this.rowGap,e):void 0}})}getPropertyByDevice(e,t){var i,l,o;return"tablet"===t?null!==(i=null==e?void 0:e.tablet)&&void 0!==i?i:null==e?void 0:e.desktop:"mobile"===t&&null!==(o=null!==(l=null==e?void 0:e.mobile)&&void 0!==l?l:null==e?void 0:e.tablet)&&void 0!==o?o:null==e?void 0:e.desktop}injectCustomStyles(){let e=document.createElement("style");return e.textContent=`
      [style*="--gr:"] {
        grid-row: var(--gr)
      }
      @media only screen and (max-width: 1024px) {
        [style*="--gr-tablet:"] {
          grid-row: var(--gr-tablet)
        }
      }
      @media only screen and (max-width: 767px) {
        [style*="--gr-mobile:"] {
          grid-row: var(--gr-mobile)
        }
      }
    `,this.prepend(e),!1}constructor(){var i,l;super(),t(this,"rowPerCol",void 0),t(this,"colLength",void 0),t(this,"rowGap",void 0),t(this,"slidesToShow",void 0);let o=this.getState("targetUid");if(this.rowGap=this.getState("rowGap"),!o){this.style.visibility="visible";return}let r=document.querySelector(`[id=${o}]`);if(!r){this.style.visibility="visible";return}for(let t of(this.injectCustomStyles(),this.rowPerCol=null!==(l=null===(i=r.querySelectorAll(`[id=${o}] > div > *:not(script)`))||void 0===i?void 0:i.length)&&void 0!==l?l:0,this.colLength=this.childElementCount,this.slidesToShow=this.getState("slidesToShow"),e)){let e=this.generateGridRowArrayByDevice(t,o);this.querySelectorAll(`[id=${o}]`).forEach((i,l)=>{var o,r,d,s;i.setAttribute("style",`${i.getAttribute("style")}; --gr${"desktop"===t?"":`-${t}`}: ${null!==(d=null==e?void 0:null===(o=e[l])||void 0===o?void 0:o.gridRow)&&void 0!==d?d:""}`),i.style.setProperty(`--mb${"desktop"===t?"":`-${t}`}`,null!==(s=null==e?void 0:null===(r=e[l])||void 0===r?void 0:r.marginBottom)&&void 0!==s?s:"0")})}this.style.visibility="visible"}}customElements.get("gp-same-height")||customElements.define("gp-same-height",l)};"completed"===window.gpReadyState?i():window.addEventListener("gp-global-loaded",i)}();
