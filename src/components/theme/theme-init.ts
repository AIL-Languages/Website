/** Inline script: aplica tema antes del paint para evitar flash. */
export function themeInitScript() {
  return `(function(){try{var k='ail-theme';var s=localStorage.getItem(k);var t=(s==='light'||s==='dark')?s:(window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light');var r=document.documentElement;r.classList.toggle('dark',t==='dark');r.setAttribute('data-theme',t);r.style.colorScheme=t;}catch(e){}})();`;
}
