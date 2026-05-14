const pages = ['表紙','1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月'];
const state = pages.map((name, i) => ({ name, image:'', zoom:100, x:50, y:50, done:false }));
let current = 0;

const stepList = document.getElementById('stepList');
const sheetHolder = document.getElementById('sheetHolder');
const titleInput = document.getElementById('titleInput');
const fileInput = document.getElementById('fileInput');
const zoom = document.getElementById('zoom');
const xPos = document.getElementById('xPos');
const yPos = document.getElementById('yPos');

pages.forEach((p, i) => {
  const el = document.createElement('button');
  el.className = 'step';
  el.textContent = p;
  el.onclick = () => go(i);
  stepList.appendChild(el);
});

function placeholder(i){
  const imgs = [
    'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1528164344705-47542687000d?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?q=80&w=1200&auto=format&fit=crop'
  ];
  return imgs[i % imgs.length];
}

function imageStyle(item, i){
  const src = item.image || placeholder(i);
  return `background-image:url('${src}');background-size:${item.zoom}%;background-position:${item.x}% ${item.y}%`;
}

function go(i){
  state[current].done = true;
  current = i;
  render();
  document.getElementById('editor').scrollIntoView({behavior:'smooth', block:'start'});
}

function calendarGrid(){
  const w = ['日','月','火','水','木','金','土'];
  let html = '';
  w.forEach((d, i) => html += `<div class="day ${i===0?'sun':i===6?'sat':''}"><b>${d}</b></div>`);
  for(let i=1;i<=35;i++){
    html += `<div class="day">${i<=31 ? i : ''}</div>`;
  }
  return html;
}

function renderCover(){
  let thumbs = '';
  for(let i=1;i<=12;i++){
    thumbs += `<div class="coverThumb" style="${imageStyle(state[i], i)}"></div>`;
  }
  return `<div class="printSheet coverSheet">
    <div class="coverTitle">${titleInput.value || 'ORIGINAL CALENDAR'}</div>
    <div class="coverSub">沖縄旧暦入りオリジナルカレンダー 2026</div>
    <div class="coverGrid">${thumbs}</div>
  </div>`;
}

function renderMonth(){
  const item = state[current];
  return `<div class="printSheet monthSheet">
    <div class="photoArea" style="${imageStyle(item, current)}"></div>
    <div class="calendarArea">
      <div class="monthName">${item.name}</div>
      <div class="calGrid">${calendarGrid()}</div>
    </div>
  </div>`;
}

function renderMini(index){
  if(index < 0 || index >= pages.length) return '';
  const item = state[index];
  if(index === 0){
    return `<div style="padding:8px;font-weight:900;text-align:center">${titleInput.value}</div>`;
  }
  return `<div style="height:48%;${imageStyle(item,index)};background-repeat:no-repeat"></div>
          <div style="padding:8px;font-weight:900">${item.name}</div>`;
}

function render(){
  document.querySelectorAll('.step').forEach((el, i) => {
    el.classList.toggle('active', i === current);
    el.classList.toggle('done', state[i].done);
  });

  document.getElementById('editTitle').textContent = current === 0 ? '表紙を編集' : `${pages[current]}を編集`;
  document.getElementById('editDesc').textContent = current === 0 ? '表紙は12ヶ月分の写真が並びます。' : '写真をアップし、白フチ内で位置調整してください。';
  document.getElementById('previewTitle').textContent = current === 0 ? '表紙プレビュー' : `${pages[current]}プレビュー`;
  document.getElementById('previewNote').textContent = current === 0 ? '12ヶ月分の写真を一覧表示します。' : 'A3縦型の仕上がり比率に近いプレビューです。';

  sheetHolder.innerHTML = current === 0 ? renderCover() : renderMonth();
  zoom.value = state[current].zoom;
  xPos.value = state[current].x;
  yPos.value = state[current].y;

  if(document.getElementById('prevMini')){
    document.getElementById('prevMini').innerHTML = renderMini(current - 1);
    document.getElementById('nextMini').innerHTML = renderMini(current + 1);
  }
}

fileInput.addEventListener('change', e => {
  const file = e.target.files[0];
  if(!file) return;

  const warn = document.getElementById('qualityWarning');
  if(file.size < 1000000) warn.classList.remove('hidden');
  else warn.classList.add('hidden');

  const reader = new FileReader();
  reader.onload = ev => {
    state[current].image = ev.target.result;
    state[current].done = true;
    render();
  };
  reader.readAsDataURL(file);
});

[zoom, xPos, yPos].forEach(el => {
  el.addEventListener('input', () => {
    state[current].zoom = Number(zoom.value);
    state[current].x = Number(xPos.value);
    state[current].y = Number(yPos.value);
    state[current].done = true;
    render();
  });
});

document.getElementById('resetBtn').addEventListener('click', () => {
  state[current].zoom = 100;
  state[current].x = 50;
  state[current].y = 50;
  render();
});

document.getElementById('prevBtn').addEventListener('click', () => {
  state[current].done = true;
  current = Math.max(0, current - 1);
  render();
  document.getElementById('editor').scrollIntoView({behavior:'smooth', block:'start'});
});

document.getElementById('nextBtn').addEventListener('click', () => {
  state[current].done = true;
  current = Math.min(pages.length - 1, current + 1);
  render();
  document.getElementById('editor').scrollIntoView({behavior:'smooth', block:'start'});
});

titleInput.addEventListener('input', render);

document.getElementById('qty').addEventListener('change', e => {
  const q = Number(e.target.value);
  let p = 3980;
  if(q === 3) p = 9980;
  if(q === 5) p = 15800;
  if(q === 10) p = 29800;
  document.getElementById('price').textContent = '¥' + p.toLocaleString();
});

function approve(){
  location.href = 'order.html';
}
document.getElementById('approveBtnTop').addEventListener('click', approve);
document.getElementById('approveBtnBottom').addEventListener('click', approve);

render();
