const KEY="aditya_photography_photos_v1";
const LIKEKEY="aditya_likes_v1", SAVEKEY="aditya_saves_v1";
const demo=[
 {id:"demo1",title:"Welcome to Aditya Photography",caption:"Your photography journey starts here.",tags:"welcome, photography",date:new Date().toISOString(),src:"data:image/svg+xml;charset=UTF-8,"+encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="800"><rect width="100%" height="100%" fill="#111827"/><text x="50%" y="48%" dominant-baseline="middle" text-anchor="middle" fill="white" font-size="58" font-family="Arial">Aditya Photography</text><text x="50%" y="58%" dominant-baseline="middle" text-anchor="middle" fill="#9ca3af" font-size="28" font-family="Arial">Upload your first photo from Admin</text></svg>`)}
];
function photos(){let x=JSON.parse(localStorage.getItem(KEY)||"null");return x||demo}
function savePhotos(x){localStorage.setItem(KEY,JSON.stringify(x))}
function likes(){return JSON.parse(localStorage.getItem(LIKEKEY)||"[]")}
function saves(){return JSON.parse(localStorage.getItem(SAVEKEY)||"[]")}
function toggle(arr,key,id){arr=arr||[];arr=arr.includes(id)?arr.filter(x=>x!==id):[...arr,id];localStorage.setItem(key,JSON.stringify(arr));return arr}
function esc(s=""){return s.replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}
function card(p){
 const l=likes().includes(p.id),s=saves().includes(p.id);
 return `<article class="card"><a href="photo.html?id=${encodeURIComponent(p.id)}"><img src="${p.src}" alt="${esc(p.title)}" loading="lazy"></a><div class="card-body"><h3>${esc(p.title)}</h3><p>${esc(p.caption||"")}</p><div class="actions"><button class="${l?"active":""}" onclick="likePhoto('${p.id}')">♥ ${l?"Liked":"Like"}</button><button class="${s?"active":""}" onclick="savePhoto('${p.id}')">▣ ${s?"Saved":"Save"}</button><button onclick="sharePhoto('${p.id}')">↗ Share</button></div></div></article>`
}
function renderGallery(list=photos()){
 const q=(document.getElementById("search")?.value||"").toLowerCase().trim();
 const filtered=list.filter(p=>(p.title+" "+p.caption+" "+p.tags).toLowerCase().includes(q)).sort((a,b)=>new Date(b.date)-new Date(a.date));
 const g=document.getElementById("gallery"); if(!g)return;
 g.innerHTML=filtered.map(card).join("");
 document.getElementById("count").textContent=filtered.length+" photo"+(filtered.length===1?"":"s");
 document.getElementById("empty").classList.toggle("hidden",filtered.length>0);
}
function likePhoto(id){toggle(likes(),LIKEKEY,id);renderGallery()}
function savePhoto(id){toggle(saves(),SAVEKEY,id);renderGallery()}
async function sharePhoto(id){const url=new URL("photo.html?id="+encodeURIComponent(id),location.href).href;if(navigator.share)await navigator.share({title:"Aditya Photography",url});else{await navigator.clipboard?.writeText(url);alert("Photo link copied!")}}
function initHome(){document.getElementById("search")?.addEventListener("input",()=>renderGallery());renderGallery()}
function initPhoto(){const id=new URLSearchParams(location.search).get("id"),p=photos().find(x=>x.id===id),box=document.getElementById("photo");if(!p){box.innerHTML="<p>Photo not found.</p>";return}document.title=p.title+" — Aditya Photography";box.innerHTML=`<article class="photo-detail"><img src="${p.src}" alt="${esc(p.title)}"><div class="photo-info"><h1>${esc(p.title)}</h1><p>${esc(p.caption||"")}</p><p class="muted">${new Date(p.date).toLocaleDateString()}</p><p>${esc(p.tags||"")}</p><div class="actions"><button onclick="likePhoto('${p.id}');initPhoto()">♥ ${likes().includes(p.id)?"Liked":"Like"}</button><button onclick="savePhoto('${p.id}');initPhoto()">▣ ${saves().includes(p.id)?"Saved":"Save"}</button><button onclick="sharePhoto('${p.id}')">↗ Share</button></div></div></article>`}
function initAdmin(){
 const logged=sessionStorage.getItem("aditya_admin")==="1";
 document.getElementById("loginPanel").classList.toggle("hidden",logged);
 document.getElementById("uploadPanel").classList.toggle("hidden",!logged);
 if(logged)renderAdmin();
 document.getElementById("loginForm")?.addEventListener("submit",e=>{e.preventDefault();if(username.value==="aditya"&&password.value==="change-me"){sessionStorage.setItem("aditya_admin","1");location.reload()}else alert("Wrong login")});
 document.getElementById("logout")?.addEventListener("click",()=>{sessionStorage.removeItem("aditya_admin");location.reload()});
 document.getElementById("uploadForm")?.addEventListener("submit",async e=>{e.preventDefault();const f=file.files[0];if(!f)return;const reader=new FileReader();reader.onload=()=>{const arr=photos().filter(x=>!x.id.startsWith("demo"));arr.push({id:crypto.randomUUID(),title:title.value.trim(),caption:caption.value.trim(),tags:tags.value.trim(),date:new Date().toISOString(),src:reader.result});savePhotos(arr);e.target.reset();renderAdmin();alert("Photo published!")};reader.readAsDataURL(f)});
}
function renderAdmin(){const box=document.getElementById("adminList");if(!box)return;box.innerHTML="<h2>Your Photos</h2>"+photos().filter(x=>!x.id.startsWith("demo")).map(p=>`<div class="admin-photo"><img src="${p.src}"><div><b>${esc(p.title)}</b><div class="muted">${new Date(p.date).toLocaleDateString()}</div></div><button class="danger" onclick="deletePhoto('${p.id}')">Delete</button></div>`).join("")}
function deletePhoto(id){if(confirm("Delete this photo?")){savePhotos(photos().filter(p=>p.id!==id));renderAdmin()}}
document.getElementById("year")&&(document.getElementById("year").textContent=new Date().getFullYear());
if(document.getElementById("gallery"))initHome();
if(document.getElementById("photo"))initPhoto();
if(document.getElementById("loginPanel"))initAdmin();
