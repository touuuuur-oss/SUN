
const pages=['表紙','1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月'];
const state=pages.map((name,i)=>({name,image:'',zoom:100,x:50,y:50}));
let current=0;
const uploadList=document.getElementById('uploadList'),pageSelect=document.getElementById('pageSelect'),sheetStage=document.getElementById('sheetStage'),titleInput=document.getElementById('titleInput'),qty=document.getElementById('qty'),price=document.getElementById('price'),zoomRange=document.getElementById('zoomRange'),xRange=document.getElementById('xRange'),yRange=document.getElementById('yRange');
pages.forEach((p,i)=>{uploadList.innerHTML+=`<div class="uploadItem"><label>${p}写真</label><input type="file" accept="image/*" onchange="loadImage(event,${i})"></div>`;pageSelect.innerHTML+=`<option value="${i}">${p}</option>`;});
function placeholder(i){const imgs=['https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1000&auto=format&fit=crop','https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=1000&auto=format&fit=crop','https://images.unsplash.com/photo-1528164344705-47542687000d?q=80&w=1000&auto=format&fit=crop'];return imgs[i%imgs.length];}
function loadImage(e,index){const file=e.target.files[0];if(!file)return;const reader=new FileReader();reader.onload=ev=>{state[index].image=ev.target.result;if(index===0)current=0;render();};reader.readAsDataURL(file);}
function bgStyle(item,i){const img=item.image||placeholder(i);return `background-image:url('${img}');background-size:${item.zoom}%;background-position:${item.x}% ${item.y}%`;}
function calendarGrid(){let html='';const wd=['日','月','火','水','木','金','土'];wd.forEach((w,i)=>html+=`<div class="day ${i===0?'sun':i===6?'sat':''}"><b>${w}</b></div>`);for(let i=1;i<=35;i++)html+=`<div class="day">${i<=31?i:''}</div>`;return html;}
function renderCover(){let thumbs='';for(let i=1;i<=12;i++)thumbs+=`<div class="coverThumb" style="${bgStyle(state[i],i)}"></div>`;return `<div class="sheet coverSheet"><div class="coverTitle">${titleInput.value||'ORIGINAL CALENDAR'}</div><div class="coverSub">沖縄旧暦入りオリジナルカレンダー 2026</div><div class="coverGrid">${thumbs}</div></div>`;}
function renderMonth(){const item=state[current];return `<div class="sheet"><div class="photoBox" style="${bgStyle(item,current)}"></div><div class="calendarArea"><div class="monthName">${item.name}</div><div class="week">${calendarGrid()}</div></div></div>`;}
function render(){pageSelect.value=current;document.getElementById('previewTitle').textContent=current===0?'表紙プレビュー':`${pages[current]}プレビュー`;document.getElementById('previewHint').textContent=current===0?'表紙は12ヶ月分の写真を一覧表示します。':'上半分が写真、下半分が旧暦入りカレンダーの想定です。';document.getElementById('pageLabel').textContent=`${pages[current]} / 13`;sheetStage.innerHTML=current===0?renderCover():renderMonth();zoomRange.value=state[current].zoom;xRange.value=state[current].x;yRange.value=state[current].y;}
pageSelect.addEventListener('change',()=>{current=Number(pageSelect.value);render();});document.getElementById('prevBtn').addEventListener('click',()=>{current=(current+12)%13;render();});document.getElementById('nextBtn').addEventListener('click',()=>{current=(current+1)%13;render();});
[zoomRange,xRange,yRange].forEach(el=>el.addEventListener('input',()=>{state[current].zoom=Number(zoomRange.value);state[current].x=Number(xRange.value);state[current].y=Number(yRange.value);render();}));
document.getElementById('resetAdjust').addEventListener('click',()=>{state[current].zoom=100;state[current].x=50;state[current].y=50;render();});
titleInput.addEventListener('input',render);
qty.addEventListener('change',()=>{const q=Number(qty.value);let p=3980;if(q===3)p=9980;if(q===5)p=15800;if(q===10)p=29800;price.textContent='¥'+p.toLocaleString();});
document.getElementById('approveBtn').addEventListener('click',()=>{location.href='order.html';});
render();
