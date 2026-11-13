// 몽실이와 놀이터 service worker: 앱 파일을 미리 저장해 두고 인터넷 없이도 실행
const CACHE='mongsil-v1';
const FILES=["./", "index.html", "manifest.webmanifest", "icons/apple-touch-icon.png", "icons/icon-192.png", "icons/icon-512.png", "icons/maskable-512.png", "sprites/acorn3_blue.png", "sprites/acorn3_red.png", "sprites/acorn3_yellow.png", "sprites/apple.png", "sprites/barrel2.png", "sprites/barrel_blank.png", "sprites/basket_empty.png", "sprites/basket_full.png", "sprites/bear.png", "sprites/bear_happy.png", "sprites/bigrabbit.png", "sprites/candy_blue.png", "sprites/candy_green.png", "sprites/candy_orange.png", "sprites/candy_pink.png", "sprites/candy_purple.png", "sprites/candy_red.png", "sprites/candy_yellow.png", "sprites/chick1.png", "sprites/die.png", "sprites/f_bear.png", "sprites/f_circle.png", "sprites/f_diamond.png", "sprites/f_square.png", "sprites/f_tri.png", "sprites/grapes.png", "sprites/kid.png", "sprites/mole.png", "sprites/mole_burst.png", "sprites/mole_hurt.png", "sprites/mongsil.png", "sprites/nest.png", "sprites/owl.png", "sprites/owl_sit.png", "sprites/pear.png", "sprites/plum.png", "sprites/raven.png", "sprites/squirrel.png"];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
  const req=e.request;if(req.method!=='GET')return;
  const url=new URL(req.url);
  const isFont=url.hostname==='fonts.googleapis.com'||url.hostname==='fonts.gstatic.com';
  if(url.origin!==location.origin&&!isFont)return;
  e.respondWith(caches.match(req,{ignoreSearch:true}).then(hit=>hit||fetch(req).then(res=>{
    if(res&&(res.ok||res.type==='opaque')){const copy=res.clone();caches.open(CACHE).then(c=>c.put(req,copy))}
    return res}).catch(()=>caches.match('index.html'))))});
