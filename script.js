
const months=['表紙','1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月'];
const uploadList=document.getElementById('uploadList');
const previewGrid=document.getElementById('previewGrid');
const titleInput=document.getElementById('titleInput');
const qty=document.getElementById('qty');
const price=document.getElementById('price');

function grid(){let h='';for(let i=1;i<=35;i++){h+=`<div class='day'>${i<=31?i:''}</div>`;}return h;}

months.forEach((m,i)=>{
uploadList.innerHTML += `<div><label>${m}写真</label><input type='file' accept='image/*' onchange='previewImage(event,${i})'></div>`;
previewGrid.innerHTML += `<div class='sheet'><div class='photo ${i===0?'coverPhoto':''}' id='photo${i}' data-title='${titleInput.value}' style="background-image:url('https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=800&auto=format&fit=crop')"></div><div class='calendar'><div class='month'>${m}</div><div class='week'>${grid()}</div></div></div>`;
});

function previewImage(e,index){
const file=e.target.files[0];
if(!file) return;
const reader=new FileReader();
reader.onload=function(ev){
document.getElementById('photo'+index).style.backgroundImage=`url(${ev.target.result})`;
}
reader.readAsDataURL(file);
}

titleInput.addEventListener('input',()=>{
document.querySelector('.coverPhoto').dataset.title=titleInput.value;
});

qty.addEventListener('change',()=>{
const q=Number(qty.value);
let p=3980;
if(q===3)p=9980;
if(q===5)p=15800;
price.textContent='¥'+p.toLocaleString();
});
