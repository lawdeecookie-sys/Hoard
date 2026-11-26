/* Hoard offline worker. ed2872ae27 is set by build.py; a new build = a new cache. */
const VER='hoard-ed2872ae27',FONTS='hoard-fonts',CORE=['./','./index.html','./manifest.webmanifest','./icon-192.png','./icon-512.png','./icon-maskable-512.png','./apple-touch-icon.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(VER).then(c=>c.addAll(CORE)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==VER&&k!==FONTS).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{const r=e.request;if(r.method!=='GET')return;const u=new URL(r.url);
 // fonts: keep forever once seen
 if(/fonts\.(googleapis|gstatic)\.com$/.test(u.hostname)){e.respondWith(caches.open(FONTS).then(c=>c.match(r).then(hit=>hit||fetch(r).then(res=>{if(res.ok||res.type==='opaque')c.put(r,res.clone());return res}).catch(()=>new Response('',{status:503})))));return}
 if(u.origin!==location.origin)return;
 // the game: play from the cache instantly, refresh it quietly for next launch
 const key=r.mode==='navigate'?'./index.html':r;
 e.respondWith(caches.open(VER).then(c=>c.match(key,{ignoreSearch:true}).then(hit=>{const net=fetch(r).then(res=>{if(res.ok)c.put(key,res.clone());return res}).catch(()=>hit);return hit||net})))});
