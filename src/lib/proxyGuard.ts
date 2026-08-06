/**
 * משמר ההטמעות של הפרוקסי המחוזי (RULES 9.4–9.5, ממצא ביקורת 03/08/2026):
 * שכתובי הטקסט בצד השרת תופסים רק כתובות שמופיעות סטטית ב-HTML/CSS/JS.
 * כל כתובת שנבנית בזמן ריצה — fetch של pdf.js, next/script, תמונות שנטענות
 * מ-JS, ניווטי ה-router, srcset דינמי — בורחת מקידומת הפרוקסי אל שורש
 * האתר המארח ומחזירה 404 (כך נשברו הפנורמה, reveal.js ומצגת ה-PDF של
 * zaviyot בתוך החוברת). הסקריפט הזה מוזרק ראשון ל-<head> של כל דף מוגש,
 * ומיישר בזמן ריצה כל כתובת יחסית-שורש חזרה אל הפרוקסי — רשת ביטחון
 * שתופסת גם מה ששכתוב טקסט לעולם לא יכיר.
 *
 * בנוסף הוא מטביע חותם (window.__EM_PROXY__) שמאפשר לחוברת להבחין בין
 * הדף האמיתי לבין דף שגיאה של סביבה שאינה מריצה את הפונקציה (למשל שרת
 * הקבצים הסטטי של סוללת הבדיקות על פורט 4321).
 */
export function guardScript(base: string): string {
  // base בלי לוכסן סופי: '/api/em/zaviyot'
  const js = [
    `var B=${JSON.stringify(base)};`,
    'window.__EM_PROXY__=1;',
    // כתובת יחסית-שורש שאינה כבר תחת הפרוקסי → מקבלת את הקידומת
    'var fix=function(u){if(typeof u!=="string"||!u)return u;if(u.charCodeAt(0)===47&&u.charCodeAt(1)!==47&&u.indexOf(B+"/")!==0&&u!==B)return B+u;return u;};',
    // כתובת מוחלטת של המקור הנוכחי (same-origin) — מיושרת דרך ה-pathname
    'var abs=function(u){try{var x=new URL(u,location.href);if(x.origin===location.origin)return x.origin+fix(x.pathname)+x.search+x.hash;}catch(e){}return u;};',
    'var fs=function(v){return typeof v==="string"?fix(v):v;};',
    // srcset הוא רשימה מופרדת בפסיקים — כל מקור עובר דרך fix (אידמפוטנטי:
    // ערך שכבר יושר, למשל מ-"/_next/" ששוכתב בטקסט ה-chunk, לא מוכפל)
    'var fixset=function(v){return typeof v==="string"?v.replace(/(^|,\\s*)(\\/[^\\s,]*)/g,function(m,a,u){return a+fix(u);}):v;};',
    'var fixcss=function(v){return typeof v==="string"?v.replace(/url\\((["\']?)(\\/[^)"\']*)/g,function(m,q,u){return "url("+q+fix(u);}):v;};',
    // fetch — כולל pdf.js, בקשות ה-RSC של Next והסתעפויות דינמיות
    'var F=window.fetch;if(F)window.fetch=function(i,o){try{if(typeof i==="string")i=abs(fix(i));else if(typeof Request!=="undefined"&&i instanceof Request){var n=abs(i.url);if(n!==i.url)i=new Request(n,i);}else if(typeof URL!=="undefined"&&i instanceof URL)i=abs(i.href);}catch(e){}return F.call(this,i,o);};',
    'var XO=XMLHttpRequest.prototype.open;XMLHttpRequest.prototype.open=function(m,u){try{arguments[1]=abs(fix(u));}catch(e){}return XO.apply(this,arguments);};',
    // כותבי מאפיינים על אבות-הטיפוס — תופסים כל השמה מ-JS, כולל hydration של React
    'var pt=function(C,p,f){try{if(!C)return;var d=Object.getOwnPropertyDescriptor(C.prototype,p);if(!d||!d.set)return;Object.defineProperty(C.prototype,p,{configurable:true,get:d.get,set:function(v){d.set.call(this,f(v));}});}catch(e){}};',
    'pt(window.HTMLScriptElement,"src",fs);pt(window.HTMLImageElement,"src",fs);pt(window.HTMLImageElement,"srcset",fixset);',
    'pt(window.HTMLSourceElement,"src",fs);pt(window.HTMLSourceElement,"srcset",fixset);',
    'pt(window.HTMLVideoElement,"src",fs);pt(window.HTMLVideoElement,"poster",fs);pt(window.HTMLAudioElement,"src",fs);',
    'pt(window.HTMLIFrameElement,"src",fs);pt(window.HTMLLinkElement,"href",fs);pt(window.HTMLAnchorElement,"href",fs);',
    'pt(window.HTMLEmbedElement,"src",fs);pt(window.HTMLObjectElement,"data",fs);',
    'var SA=Element.prototype.setAttribute;Element.prototype.setAttribute=function(n,v){try{var l=String(n).toLowerCase();if(typeof v==="string"){if(l==="src"||l==="href"||l==="poster"||l==="action"||l==="data-src")v=fix(v);else if(l==="srcset"||l==="imagesrcset")v=fixset(v);else if(l==="style")v=fixcss(v);}}catch(e){}return SA.call(this,n,v);};',
    // משתני CSS מותאמים (--jpan-src של הפנורמה) נכתבים ב-setProperty בעת hydration
    'try{var SP=CSSStyleDeclaration.prototype.setProperty;CSSStyleDeclaration.prototype.setProperty=function(n,v,p){return SP.call(this,n,fixcss(v),p);};}catch(e){}',
    // ה-router של Next דוחף נתיבים עירומים — בלי היישור הזה כל ניווט פנימי שובר את המסגרת
    'var HP=history.pushState,HR=history.replaceState;history.pushState=function(s,t,u){return HP.call(this,s,t,u==null?u:abs(fix(String(u))));};history.replaceState=function(s,t,u){return HR.call(this,s,t,u==null?u:abs(fix(String(u))));};',
    'if(window.Worker){var W=window.Worker;var WP=function(u,o){return new W(typeof u==="string"?fix(u):u,o);};WP.prototype=W.prototype;window.Worker=WP;}',
    'if(navigator.sendBeacon){var SB=navigator.sendBeacon.bind(navigator);navigator.sendBeacon=function(u,d){return SB(typeof u==="string"?fix(u):u,d);};}',
  ].join('');
  return `<script data-em-guard>(function(){${js}})();</scr` + `ipt>`;
}

/**
 * פס הגלילה הזהוב של הסביבות המוטמעות (RULES 5.23, 9.1, הוראת יניב
 * 05/08/2026): רוחב מוכפל — 120px — בכל ההטמעות שעוברות דרך הפרוקסי
 * המחוזי, כדי שכולן יהיו זהות. מקור יחיד לשתי נקודות ההזרקה.
 */
export const GOLD_SCROLLBAR =
  '<style>::-webkit-scrollbar{width:120px;height:120px}' +
  '::-webkit-scrollbar-track{background:#f5f1e8}' +
  '::-webkit-scrollbar-thumb{background:linear-gradient(180deg,#d4af5c,#b08d3e 45%,#77602a);' +
  'border-radius:60px;border:20px solid #f5f1e8}' +
  '::-webkit-scrollbar-thumb:hover{background:linear-gradient(180deg,#b08d3e,#77602a)}' +
  'html{scrollbar-color:#b08d3e #f5f1e8;scrollbar-width:auto}</style>';

/** הזרקת פס הגלילה הזהוב לתוך <head> של המסמך המוטמע. */
export function injectGoldScrollbar(html: string): string {
  return html.includes('</head>')
    ? html.replace('</head>', GOLD_SCROLLBAR + '</head>')
    : GOLD_SCROLLBAR + html;
}

/** הזרקת המשמר מיד אחרי פתיחת <head> — לפני כל סקריפט של האפליקציה. */
export function injectGuard(html: string, base: string): string {
  const guard = guardScript(base);
  const head = /<head(\s[^>]*)?>/i.exec(html);
  if (head) return html.replace(head[0], head[0] + guard);
  return guard + html;
}
