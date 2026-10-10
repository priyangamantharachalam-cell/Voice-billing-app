/* ---------------- constants ---------------- */
const LANGS = [{code:'ta-IN',label:'Tamil'},{code:'en-IN',label:'English'},{code:'en-IN',label:'Tanglish'},{code:'hi-IN',label:'Hindi'},{code:'kn-IN',label:'Kannada'}];
const LANG_NAME = {'ta-IN':'ta','en-IN':'en','hi-IN':'hi','kn-IN':'kn'};
let currentLang = 'ta-IN';
let lastBillLang = 'en';

const NUM_WORDS = {
  oru:1, onnu:1, rendu:2, irandu:2, moonu:3, moondru:3, naalu:4, naangu:4, anju:5, ainthu:5,
  aaru:6, ezhu:7, ettu:8, onbathu:9, pathu:10,
  ek:1, do:2, teen:3, char:4, paanch:5, che:6, saat:7, aath:8, nau:9, das:10,
  ondu:1, eradu:2, mooru:3, naalku:4, aidu:5, aidhu:5, elu:7, entu:8, ombattu:9, hattu:10,
  one:1, two:2, three:3, four:4, five:5, six:6, seven:7, eight:8, nine:9, ten:10,
  half:0.5, arai:0.5, ardha:0.5, quarter:0.25, kaal:0.25, mukkal:0.75,
  // Tamil script (what ta-IN speech recognition actually returns)
  'ஒரு':1, 'ஒன்று':1, 'ரெண்டு':2, 'இரண்டு':2, 'மூன்று':3, 'நான்கு':4, 'நாலு':4, 'ஐந்து':5,
  'ஆறு':6, 'ஏழு':7, 'எட்டு':8, 'ஒன்பது':9, 'பத்து':10, 'அரை':0.5, 'கால்':0.25, 'முக்கால்':0.75,
  // Hindi (Devanagari)
  'एक':1, 'दो':2, 'तीन':3, 'चार':4, 'पांच':5, 'छह':6, 'सात':7, 'आठ':8, 'नौ':9, 'दस':10, 'आधा':0.5, 'चौथाई':0.25,
  // Kannada script
  'ಒಂದು':1, 'ಎರಡು':2, 'ಮೂರು':3, 'ನಾಲ್ಕು':4, 'ಐದು':5, 'ಆರು':6, 'ಏಳು':7, 'ಎಂಟು':8, 'ಒಂಬತ್ತು':9, 'ಹತ್ತು':10, 'ಅರ್ಧ':0.5
};
// unit word -> {base, factor}. Canonical base codes: kilogram, gram, litre, millilitre, piece, dozen, bundle, bunch, packet, box, bottle, tin, bag
const UNIT_INFO = {
  kilogram:{base:'kilogram',factor:1}, kilograms:{base:'kilogram',factor:1}, kilo:{base:'kilogram',factor:1}, kilos:{base:'kilogram',factor:1}, kg:{base:'kilogram',factor:1}, kgs:{base:'kilogram',factor:1},
  gram:{base:'kilogram',factor:0.001}, grams:{base:'kilogram',factor:0.001}, gm:{base:'kilogram',factor:0.001}, gms:{base:'kilogram',factor:0.001}, g:{base:'kilogram',factor:0.001},
  litre:{base:'litre',factor:1}, litres:{base:'litre',factor:1}, liter:{base:'litre',factor:1}, liters:{base:'litre',factor:1}, l:{base:'litre',factor:1},
  millilitre:{base:'litre',factor:0.001}, milliliter:{base:'litre',factor:0.001}, ml:{base:'litre',factor:0.001},
  piece:{base:'piece',factor:1}, pieces:{base:'piece',factor:1}, pc:{base:'piece',factor:1}, pcs:{base:'piece',factor:1},
  dozen:{base:'piece',factor:12}, dozens:{base:'piece',factor:12},
  bundle:{base:'bundle',factor:1}, bundles:{base:'bundle',factor:1},
  bunch:{base:'bunch',factor:1}, bunches:{base:'bunch',factor:1},
  packet:{base:'packet',factor:1}, packets:{base:'packet',factor:1},
  box:{base:'box',factor:1}, boxes:{base:'box',factor:1},
  bottle:{base:'bottle',factor:1}, bottles:{base:'bottle',factor:1},
  tin:{base:'tin',factor:1}, tins:{base:'tin',factor:1},
  bag:{base:'bag',factor:1}, bags:{base:'bag',factor:1},
  can:{base:'can',factor:1}, cans:{base:'can',factor:1},
  sack:{base:'sack',factor:1}, sacks:{base:'sack',factor:1},
  // Tamil script units
  'கிலோ':{base:'kilogram',factor:1}, 'கிராம்':{base:'kilogram',factor:0.001}, 'லிட்டர்':{base:'litre',factor:1}, 'மில்லி':{base:'litre',factor:0.001},
  'பீஸ்':{base:'piece',factor:1}, 'துண்டு':{base:'piece',factor:1}, 'டசன்':{base:'piece',factor:12},
  'கட்டு':{base:'bundle',factor:1}, 'கொத்து':{base:'bunch',factor:1}, 'பாக்கெட்':{base:'packet',factor:1},
  'பெட்டி':{base:'box',factor:1}, 'பாட்டில்':{base:'bottle',factor:1}, 'டின்':{base:'tin',factor:1}, 'பை':{base:'bag',factor:1},
  'டப்பா':{base:'can',factor:1}, 'சிப்பம்':{base:'sack',factor:1},
  // Hindi units
  'किलो':{base:'kilogram',factor:1}, 'ग्राम':{base:'kilogram',factor:0.001}, 'लीटर':{base:'litre',factor:1}, 'मिली':{base:'litre',factor:0.001},
  'पीस':{base:'piece',factor:1}, 'दर्जन':{base:'piece',factor:12}, 'बंडल':{base:'bundle',factor:1}, 'गुच्छा':{base:'bunch',factor:1},
  'पैकेट':{base:'packet',factor:1}, 'बॉक्स':{base:'box',factor:1}, 'बोतल':{base:'bottle',factor:1}, 'टिन':{base:'tin',factor:1}, 'बैग':{base:'bag',factor:1},
  // Kannada units
  'ಕಿಲೋ':{base:'kilogram',factor:1}, 'ಗ್ರಾಂ':{base:'kilogram',factor:0.001}, 'ಲೀಟರ್':{base:'litre',factor:1}, 'ಮಿಲಿ':{base:'litre',factor:0.001},
  'ಪೀಸ್':{base:'piece',factor:1}, 'ಡಜನ್':{base:'piece',factor:12}, 'ಕಟ್ಟು':{base:'bundle',factor:1}, 'ಗೊಂಚಲು':{base:'bunch',factor:1},
  'ಪ್ಯಾಕೆಟ್':{base:'packet',factor:1}, 'ಬಾಕ್ಸ್':{base:'box',factor:1}, 'ಬಾಟಲಿ':{base:'bottle',factor:1}, 'ಟಿನ್':{base:'tin',factor:1}, 'ಚೀಲ':{base:'bag',factor:1}
};
const SUBUNIT_CONFIG = {
  kilogram:{minorLabel:'g', minorUnit:'gram', minorStep:50, minorMax:950, minorPerMajor:1000, majorStep:0.25},
  litre:{minorLabel:'ml', minorUnit:'millilitre', minorStep:50, minorMax:950, minorPerMajor:1000, majorStep:0.25},
  dozen:{minorLabel:'pc', minorUnit:'piece', minorStep:1, minorMax:11, minorPerMajor:12, majorStep:1}
};

function loadJSON(key, fallback){ try{ const v=localStorage.getItem(key); return v?JSON.parse(v):fallback; }catch(e){ return fallback; } }
function saveJSON(key, val){ try{ localStorage.setItem(key, JSON.stringify(val)); }catch(e){} }
function toast(msg){ const t=document.getElementById('toast'); t.textContent=msg; t.classList.add('show'); setTimeout(()=>t.classList.remove('show'),1800); }
function money(n){ return '₹' + Math.round(n||0).toLocaleString('en-IN'); }
function fmtQty(q){ return (Math.round(q*100)/100).toString(); }

/* ---------------- store profile ---------------- */
let store = loadJSON('rv_store', {name:'Green Mart', vendor:'Mohan Kumar', addr:'123, Market Street, Coimbatore - 641001, Tamil Nadu', gst:'33ABCDE1234F1Z5', phone:'+91 98765 43210', photo:'', qrPhoto:''});
function applyStoreToUI(){
  document.getElementById('shopNameTop').textContent = store.name;
  document.getElementById('vendorNameInput').value = store.vendor;
  document.getElementById('storeNameInput').value = store.name;
  document.getElementById('storeAddrInput').value = store.addr;
  document.getElementById('storeGstInput').value = store.gst;
  document.getElementById('storePhoneInput').value = store.phone;
  document.getElementById('billShopName').textContent = store.name;
  document.getElementById('billAddr').textContent = store.addr;
  document.getElementById('billGstLine').textContent = 'GSTIN: ' + store.gst;
  [document.getElementById('shopMarkTop'), document.getElementById('storePhotoPreview'), document.getElementById('receiptPhoto')].forEach(el=>{
    if(!el) return;
    if(store.photo){ el.style.backgroundImage = `url(${store.photo})`; el.textContent=''; }
    else { el.style.backgroundImage='none'; el.textContent='🏬'; }
  });
  const qrImg = document.getElementById('qrPreviewImg'), qrEmpty = document.getElementById('qrPreviewEmpty');
  if(qrImg && qrEmpty){
    if(store.qrPhoto){ qrImg.src = store.qrPhoto; qrImg.style.display='inline-block'; qrEmpty.style.display='none'; }
    else { qrImg.style.display='none'; qrEmpty.style.display='block'; }
  }
}
document.getElementById('storePhotoBtn').addEventListener('click', ()=> document.getElementById('storePhotoInput').click());
document.getElementById('storePhotoInput').addEventListener('change', e=>{
  const file = e.target.files[0]; if(!file) return;
  const reader = new FileReader();
  reader.onload = ev=>{ store.photo = ev.target.result; document.getElementById('storePhotoPreview').style.backgroundImage = `url(${store.photo})`; document.getElementById('storePhotoPreview').textContent=''; };
  reader.readAsDataURL(file);
});
document.getElementById('qrPhotoBtn').addEventListener('click', ()=> document.getElementById('qrPhotoInput').click());
document.getElementById('qrPhotoInput').addEventListener('change', e=>{
  const file = e.target.files[0]; if(!file) return;
  const reader = new FileReader();
  reader.onload = ev=>{
    store.qrPhoto = ev.target.result; saveJSON('rv_store', store);
    document.getElementById('qrPreviewImg').src = store.qrPhoto;
    document.getElementById('qrPreviewImg').style.display='inline-block';
    document.getElementById('qrPreviewEmpty').style.display='none';
    toast('UPI QR saved');
  };
  reader.readAsDataURL(file);
});
document.getElementById('saveStoreBtn').addEventListener('click', ()=>{
  store.vendor = document.getElementById('vendorNameInput').value.trim();
  store.name = document.getElementById('storeNameInput').value.trim() || 'My Store';
  store.addr = document.getElementById('storeAddrInput').value.trim();
  store.gst = document.getElementById('storeGstInput').value.trim();
  store.phone = document.getElementById('storePhoneInput').value.trim();
  saveJSON('rv_store', store); applyStoreToUI(); toast('Saved'); switchView('home');
});

/* ---------------- products ---------------- */
let products = loadJSON('rv_products_v2', [
  {id:1,name:'Sugar',brand:'',category:'sugar',unit:'kilogram',costPerUnit:42,sellPrice:50,gst:5,stock:20,tanglish:'sarkarai, sakkarai',ta:'சர்க்கரை',hi:'चीनी',kn:'ಸಕ್ಕರೆ'},
  {id:2,name:'Rice Bag',brand:'',category:'rice',unit:'piece',costPerUnit:600,sellPrice:680,gst:5,stock:10,tanglish:'arisi',ta:'அரிசி',hi:'चावल',kn:'ಅಕ್ಕಿ'},
  {id:3,name:'Salt',brand:'',category:'salt',unit:'kilogram',costPerUnit:15,sellPrice:20,gst:0,stock:15,tanglish:'uppu',ta:'உப்பு',hi:'नमक',kn:'ಉಪ್ಪು'},
  {id:4,name:'Tomato',brand:'',category:'tomato',unit:'kilogram',costPerUnit:28,sellPrice:40,gst:0,stock:18,tanglish:'thakkali, thakkaali',ta:'தக்காளி',hi:'टमाटर',kn:'ಟೊಮ್ಯಾಟೊ'},
  {id:5,name:'Onion',brand:'',category:'onion',unit:'kilogram',costPerUnit:25,sellPrice:35,gst:0,stock:25,tanglish:'vengaayam, vengayam',ta:'வெங்காயம்',hi:'प्याज',kn:'ಈರುಳ್ಳಿ'},
  {id:6,name:'Milk',brand:'',category:'milk',unit:'litre',costPerUnit:38,sellPrice:45,gst:0,stock:20,tanglish:'paal',ta:'பால்',hi:'दूध',kn:'ಹಾಲು'},
  {id:7,name:'Vimbar Soap',brand:'Vimbar',category:'soap',unit:'piece',costPerUnit:20,sellPrice:30,gst:12,stock:24,tanglish:'saopu, soap',ta:'சோப்பு',hi:'साबुन',kn:'ಸಾಬೂನು'},
  {id:8,name:'Mango',brand:'',category:'mango',unit:'kilogram',costPerUnit:60,sellPrice:80,gst:0,stock:15,tanglish:'maampalam, mangai, mampalam',ta:'மாம்பழம், மாங்காய்',hi:'आम',kn:'ಮಾವಿನಹಣ್ಣು'}
]);
function saveProducts(){ saveJSON('rv_products_v2', products); }
function lowStockThreshold(p){ return ['kilogram','gram','litre','millilitre'].includes(p.unit) ? 3 : 5; }
function stockStatus(p){ if(p.stock<=0) return 'out'; if(p.stock<=lowStockThreshold(p)) return 'low'; return 'ok'; }

function matchesSearch(p){
  const q = normText(document.getElementById('prodSearchInput').value).toLowerCase();
  if(!q) return true;
  return allVariants(p).some(v=>v.includes(q));
}
function renderProducts(){
  const list = products.filter(matchesSearch);
  document.getElementById('prodList').innerHTML = list.map(p=>{
    const st = stockStatus(p);
    return `<div class="row"><div class="list-item"><div class="pic-sm">${getProductIcon(p)}</div><div><div class="name">${p.name}${p.ta?' <span style="color:var(--pri);">('+firstAlias(p.ta)+')</span>':''}${p.brand?' <span class="meta">'+p.brand+'</span>':''}</div>
      <div class="meta">₹${p.sellPrice}/${p.unit} · GST ${p.gst}% · <span class="tag ${st}">${st==='ok'?'In stock':st==='low'?'Low':'Out'} ${fmtQty(p.stock)} ${p.unit}</span></div></div></div>
      <button class="btn-ghost del-prod" data-id="${p.id}">✕</button></div>`;
  }).join('') || '<div class="empty">No products match your search.</div>';
  document.querySelectorAll('.del-prod').forEach(b=> b.addEventListener('click', e=>{ products = products.filter(x=>x.id != e.target.dataset.id); saveProducts(); renderProducts(); renderUpdatePane(); }));
}
document.getElementById('prodSearchInput').addEventListener('input', ()=>{ renderProducts(); renderUpdatePane(); });
function renderUpdatePane(){
  const list = products.filter(matchesSearch);
  document.getElementById('prodUpdateList').innerHTML = list.map(p=>`
    <div class="card" style="padding:12px;margin-bottom:8px;">
      <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px;">
        <div class="pic-lg" style="width:34px;height:34px;font-size:16px;">${getProductIcon(p)}</div>
        <div><div class="name">${p.name}${p.brand?' <span class="meta">('+p.brand+')</span>':''}</div>
        <div class="meta">Current stock: ${fmtQty(p.stock)} ${p.unit}</div></div>
      </div>
      <div class="receipt-meta" style="text-align:left;margin-bottom:4px;">Add new stock (adds to current stock, not replaces it)</div>
      <div style="margin-bottom:6px;"><input type="number" class="restock-qty" data-id="${p.id}" placeholder="Qty e.g. 20" style="width:100%;padding:7px;border-radius:8px;border:1px solid var(--line);background:var(--bg);color:var(--ink);"></div>
      <div style="margin-bottom:6px;"><input type="number" class="restock-cost" data-id="${p.id}" placeholder="Cost ₹ (optional)" style="width:100%;padding:7px;border-radius:8px;border:1px solid var(--line);background:var(--bg);color:var(--ink);"></div>
      <button class="btn btn-primary restock-btn" data-id="${p.id}" style="margin-bottom:10px;">Add stock</button>
      <div style="margin-bottom:6px;"><label style="font-size:11px;color:var(--sub);">Selling price ₹/${p.unit}</label><input type="number" class="upd-inp" data-id="${p.id}" data-field="sellPrice" value="${p.sellPrice}" style="width:100%;padding:7px;border-radius:8px;border:1px solid var(--line);background:var(--bg);color:var(--ink);"></div>
      <div><label style="font-size:11px;color:var(--sub);">GST %</label><input type="number" class="upd-inp" data-id="${p.id}" data-field="gst" value="${p.gst}" style="width:100%;padding:7px;border-radius:8px;border:1px solid var(--line);background:var(--bg);color:var(--ink);"></div>
    </div>`).join('') || '<div class="empty">No products match your search.</div>';
  document.querySelectorAll('.upd-inp').forEach(inp=> inp.addEventListener('change', e=>{
    const p = products.find(x=>x.id==e.target.dataset.id); if(!p) return;
    p[e.target.dataset.field] = parseFloat(e.target.value)||0;
    saveProducts(); renderProducts(); toast('Updated');
  }));
  document.querySelectorAll('.restock-btn').forEach(btn=> btn.addEventListener('click', e=>{
    const p = products.find(x=>x.id==e.target.dataset.id); if(!p) return;
    const qtyInp = document.querySelector(`.restock-qty[data-id="${p.id}"]`);
    const costInp = document.querySelector(`.restock-cost[data-id="${p.id}"]`);
    const addQty = parseFloat(qtyInp.value);
    const addCost = parseFloat(costInp.value) || 0;
    if(!addQty || addQty<=0){ toast('Enter a quantity to add'); return; }
    const oldStock = p.stock || 0;
    if(addCost>0){
      const oldTotalCost = oldStock * (p.costPerUnit||0);
      p.costPerUnit = (oldTotalCost + addCost) / (oldStock + addQty);
      p.costTotal = (p.costTotal||0) + addCost;
    }
    p.stock = oldStock + addQty;
    p.costQty = (p.costQty||0) + addQty;
    saveProducts();
    qtyInp.value=''; costInp.value='';
    renderProducts(); renderUpdatePane(); renderStockHub();
    toast(`Stock updated: ${fmtQty(oldStock)} + ${fmtQty(addQty)} = ${fmtQty(p.stock)} ${p.unit}`);
  }));
}
let pendingNewPhoto = '';
document.getElementById('newPhotoBtn').addEventListener('click', ()=> document.getElementById('newPhotoInput').click());
function setNewPhotoFromFile(file){
  if(!file) return;
  const reader = new FileReader();
  reader.onload = ev=>{ pendingNewPhoto = ev.target.result; document.getElementById('newPhotoPreview').innerHTML = `<img src="${pendingNewPhoto}" style="width:100%;height:100%;object-fit:cover;border-radius:50%;">`; };
  reader.readAsDataURL(file);
}
document.getElementById('newPhotoInput').addEventListener('change', e=> setNewPhotoFromFile(e.target.files[0]));
document.addEventListener('paste', e=>{
  const addPane = document.getElementById('prodAddPane');
  if(!addPane || addPane.style.display==='none') return;
  const items = (e.clipboardData || window.clipboardData).items;
  for(const item of items){
    if(item.type.indexOf('image')===0){
      setNewPhotoFromFile(item.getAsFile());
      toast('Image pasted');
      e.preventDefault();
      break;
    }
  }
});
document.getElementById('addProductBtn').addEventListener('click', ()=>{
  const name = document.getElementById('newName').value.trim();
  const costQty = parseFloat(document.getElementById('newCostQty').value);
  const costTotal = parseFloat(document.getElementById('newCostTotal').value);
  const sellPrice = parseFloat(document.getElementById('newSellPrice').value);
  if(!name || !sellPrice){ toast('Enter name and selling price'); return; }
  const costPerUnit = (costQty>0 && costTotal>0) ? costTotal/costQty : sellPrice*0.75;
  products.push({id:Date.now(), name, brand:document.getElementById('newBrand').value.trim(),
    category:name.toLowerCase(), unit:document.getElementById('newUnit').value,
    costPerUnit, costQty: costQty>0?costQty:0, costTotal: costTotal>0?costTotal:0,
    sellPrice, gst:parseFloat(document.getElementById('newGst').value)||0,
    stock: costQty>0?costQty:0, photo: pendingNewPhoto, tanglish:document.getElementById('newTanglish').value.trim(),
    ta:document.getElementById('newTa').value.trim(),
    hi:document.getElementById('newHi').value.trim(), kn:document.getElementById('newKn').value.trim()});
  saveProducts();
  ['newName','newBrand','newCostQty','newCostTotal','newSellPrice','newTanglish','newTa','newHi','newKn'].forEach(id=>document.getElementById(id).value='');
  pendingNewPhoto=''; document.getElementById('newPhotoPreview').innerHTML='🛒';
  renderProducts(); renderUpdatePane(); toast('Product added'); switchTab('prodTabs','all');
});

/* ---------------- generic tabs ---------------- */
function switchTab(groupId, tab){
  document.getElementById(groupId).querySelectorAll('button').forEach(b=> b.classList.toggle('active', b.dataset.tab===tab));
  if(groupId==='prodTabs'){ document.getElementById('prodAllPane').style.display = tab==='all'?'block':'none'; document.getElementById('prodAddPane').style.display = tab==='add'?'block':'none'; document.getElementById('prodUpdatePane').style.display = tab==='update'?'block':'none'; if(tab==='update') renderUpdatePane(); }
  if(groupId==='reportTabs'){ document.getElementById('dailyReportPane').style.display = tab==='daily'?'block':'none'; document.getElementById('weeklyReportPane').style.display = tab==='weekly'?'block':'none'; }
  if(groupId==='stockTabs'){ renderStockTable(tab); }
}
['prodTabs','reportTabs','stockTabs'].forEach(gid=>{
  document.getElementById(gid).querySelectorAll('button').forEach(btn=> btn.addEventListener('click', ()=> switchTab(gid, btn.dataset.tab)));
});

/* ---------------- navigation ---------------- */
function switchView(v){
  document.querySelectorAll('.view').forEach(s=>s.classList.remove('active'));
  document.getElementById('view-'+v).classList.add('active');
  document.querySelectorAll('nav button').forEach(b=> b.classList.toggle('active', b.dataset.view===v));
  if(v==='home') renderHomeSummary();
  if(v==='voice') renderItemsList();
  if(v==='manualadd'){ renderMenuGrid(); renderManualCart(); }
  if(v==='products'){ renderProducts(); renderUpdatePane(); }
  if(v==='allbills') renderAllBills();
  if(v==='stockhub') renderStockHub();
  if(v==='stockdetails') renderStockTable('current');
  if(v==='reports'){ document.getElementById('dailyDateInput').value = todayStr(); document.getElementById('weeklyDateInput').value = todayStr(); renderDailyReport(); renderWeeklyReport(); }
  if(v==='credit') renderKadanList();
}
document.querySelectorAll('nav button').forEach(btn=> btn.addEventListener('click', ()=> switchView(btn.dataset.view)));
document.querySelectorAll('.back').forEach(btn=> btn.addEventListener('click', ()=> switchView(btn.dataset.back)));
document.getElementById('settingsBtn').addEventListener('click', ()=> switchView('settings'));
document.getElementById('goVoiceBtn').addEventListener('click', ()=> switchView('voice'));
document.getElementById('quickVoice').addEventListener('click', ()=> switchView('voice'));
document.getElementById('quickBills').addEventListener('click', ()=> switchView('allbills'));
document.getElementById('quickReport').addEventListener('click', ()=>{ switchView('reports'); switchTab('reportTabs','daily'); });
document.getElementById('openStockDetails').addEventListener('click', ()=> switchView('stockdetails'));
document.getElementById('openReports').addEventListener('click', ()=> switchView('reports'));
document.getElementById('viewAllBillsBtn').addEventListener('click', ()=> switchView('allbills'));
document.getElementById('newBillBtn').addEventListener('click', ()=> switchView('voice'));

/* ---------------- language chips ---------------- */
const langRow = document.getElementById('langRow');
const kadanLangRow = document.getElementById('kadanLangRow');
function buildLangChips(row){
  LANGS.forEach(l=>{
    const chip = document.createElement('button');
    chip.className = 'lang-chip' + (l.code===currentLang && l.label===(currentLang==='en-IN'?'English':l.label)?' active':'');
    chip.textContent = l.label;
    chip.dataset.code = l.code; chip.dataset.label = l.label;
    chip.addEventListener('click', ()=>{
      currentLang = l.code; currentLangLabel = l.label;
      [langRow, kadanLangRow].forEach(r=> r.querySelectorAll('.lang-chip').forEach(c=> c.classList.toggle('active', c.dataset.label===l.label)));
    });
    row.appendChild(chip);
  });
}
let currentLangLabel = 'Tamil';
buildLangChips(langRow);
buildLangChips(kadanLangRow);
langRow.querySelector('.lang-chip').classList.add('active');
kadanLangRow.querySelector('.lang-chip').classList.add('active');

/* ---------------- voice parsing ---------------- */
const micBtn = document.getElementById('micBtn');
const transcriptBox = document.getElementById('transcriptBox');
const listeningLabel = document.getElementById('listeningLabel');
let recognizer = null; let currentItems = [];
const SR = window.SpeechRecognition || window.webkitSpeechRecognition;

micBtn.addEventListener('click', ()=>{
  if(!SR){ toast('Voice not supported here — add items manually'); return; }
  if(recognizer){ recognizer.stop(); return; }
  recognizer = new SR(); recognizer.lang = currentLang; recognizer.interimResults=false; recognizer.maxAlternatives=1;
  recognizer.onstart = ()=>{ micBtn.classList.add('listening'); listeningLabel.textContent='Listening…'; };
  recognizer.onresult = e=>{ const said=e.results[0][0].transcript; transcriptBox.textContent='"'+said+'"'; lastBillLang = LANG_NAME[currentLang]||'en'; parseTranscriptToItems(said); };
  recognizer.onerror = (e)=>{
    if(e.error==='not-allowed' || e.error==='service-not-allowed') toast('Mic permission blocked — allow microphone access in browser settings');
    else if(e.error==='language-not-supported') toast('This browser can\'t recognize that language — try typing the order below');
    else if(e.error==='no-speech') toast('Did not hear anything, try again');
    else toast('Could not hear clearly — try typing the order below');
  };
  recognizer.onend = ()=>{ micBtn.classList.remove('listening'); listeningLabel.textContent='Tap to speak'; recognizer=null; };
  recognizer.start();
});
function normText(s){ return (s||'').toString().normalize('NFC').trim(); }
function stripPunct(s){ return normText(s).replace(/^[.,!?;:।؛…]+|[.,!?;:।؛…]+$/g,''); }
function wordToNumber(w){
  w = normText(w);
  if(NUM_WORDS[w]!=null) return NUM_WORDS[w];
  const frac = w.match(/^(\d+)\/(\d+)$/);
  if(frac){ const den = parseInt(frac[2]); return den ? parseInt(frac[1])/den : null; }
  const n = parseFloat(w); return isNaN(n)?null:n;
}
document.getElementById('typedOrderBtn').addEventListener('click', ()=>{
  const text = document.getElementById('typedOrderInput').value.trim();
  if(!text){ toast('Type an order first'); return; }
  transcriptBox.textContent = '"'+text+'"';
  lastBillLang = LANG_NAME[currentLang]||'ta';
  parseTranscriptToItems(text);
  document.getElementById('typedOrderInput').value='';
});

function allVariants(p){
  return [p.name, p.brand, p.ta, p.hi, p.kn, p.tanglish]
    .filter(Boolean)
    .flatMap(s=> normText(s).toLowerCase().split(',').map(x=>x.trim()))
    .filter(Boolean);
}
function lev(a,b){
  if(a===b) return 0; const al=a.length, bl=b.length;
  if(!al) return bl; if(!bl) return al;
  let prev = Array.from({length:bl+1},(_,i)=>i);
  for(let i=1;i<=al;i++){
    const cur=[i];
    for(let j=1;j<=bl;j++) cur[j]=Math.min(prev[j]+1, cur[j-1]+1, prev[j-1]+(a[i-1]===b[j-1]?0:1));
    prev=cur;
  }
  return prev[bl];
}
function findProduct(nameGuessRaw){
  const nameGuess = normText(nameGuessRaw).toLowerCase();
  if(!nameGuess) return null;
  // tier 1: exact / substring match against every stored alias (name, brand, Tamil, Tanglish, Hindi, Kannada — comma-separated variants allowed)
  const matches = [];
  for(const p of products){
    for(const v of allVariants(p)){
      if(v===nameGuess || nameGuess.includes(v) || v.includes(nameGuess)){ if(!matches.includes(p)) matches.push(p); break; }
    }
  }
  if(matches.length===1) return matches[0];
  if(matches.length>1) return resolveAmbiguous(nameGuess, matches);
  // tier 2: fuzzy match — tolerates mispronunciation / STT variance / regional slang spellings
  let best=null, bestDist=Infinity;
  for(const p of products){
    for(const v of allVariants(p)){
      const d = lev(nameGuess, v); const maxLen = Math.max(nameGuess.length, v.length);
      const threshold = Math.max(1, Math.floor(maxLen*0.34));
      if(d<=threshold && d<bestDist){ bestDist=d; best=p; }
    }
  }
  return best;
}
function resolveAmbiguous(nameGuess, matches){
  const listStr = matches.map((m,i)=>`${i+1}. ${m.name}${m.brand?' ('+m.brand+')':''} — ₹${m.sellPrice}/${m.unit}`).join('\n');
  const ans = prompt(`"${nameGuess}" ku pala products irukku, edhu venum? Number podunga:\n${listStr}`);
  const idx = parseInt(ans)-1;
  return (idx>=0 && idx<matches.length) ? matches[idx] : matches[0];
}
function findByCategory(nameGuess){
  nameGuess = normText(nameGuess).toLowerCase();
  return products.filter(p => p.category && (normText(p.category).toLowerCase().includes(nameGuess) || nameGuess.includes(normText(p.category).toLowerCase())));
}
function firstAlias(str){ return str ? normText(str).split(',')[0].trim() : ''; }
function detectScript(text){
  if(/[\u0B80-\u0BFF]/.test(text)) return 'ta';
  if(/[\u0900-\u097F]/.test(text)) return 'hi';
  if(/[\u0C80-\u0CFF]/.test(text)) return 'kn';
  return 'en';
}
function displayNameFor(product, langKey){
  if(langKey==='ta' && product.ta) return firstAlias(product.ta);
  if(langKey==='hi' && product.hi) return firstAlias(product.hi);
  if(langKey==='kn' && product.kn) return firstAlias(product.kn);
  return product.name;
}
const ICONS = {
  tomato:'🍅', onion:'🧅', potato:'🥔', mango:'🥭', banana:'🍌', apple:'🍎', milk:'🥛',
  rice:'🍚', ricebag:'🍚', sugar:'🧂', salt:'🧂', soap:'🧼', oil:'🫒', chilli:'🌶️', greenchilli:'🌶️',
  ginger:'🫚', curryleaves:'🌿', egg:'🥚', bread:'🍞', biscuit:'🍪', tea:'🍵', coffee:'☕',
  idly:'⚪', poori:'🟡', vada:'🍩', dosa:'🫓', masaladosa:'🫓', podidosa:'🫓', puttu:'🍚', coconut:'🥥',
  carrot:'🥕', beans:'🫘', brinjal:'🍆', cabbage:'🥬', grapes:'🍇', lemon:'🍋', orange:'🍊', watermelon:'🍉'
};
function getProductIcon(p){
  if(p.photo) return `<img src="${p.photo}" style="width:100%;height:100%;object-fit:cover;border-radius:inherit;">`;
  const key = normText(p.category||p.name).toLowerCase().replace(/\s+/g,'');
  return ICONS[key] || '🛒';
}
const STOPWORDS = ['and','aprom','மற்றும்','மேலும்','aur','mattum','போட்டு','venum','kudunga',
  'rupee','rupees','roobai','roobaai','paisa',
  'ரூபாய்','ரூபாய்கள்','ரூபாய்கள்','பைசா',
  'रुपया','रुपये','पैसा',
  'ರೂಪಾಯಿ','ರೂಪಾಯಿಗಳು','ಪೈಸೆ'].map(w=>normText(w).toLowerCase());
function parseTranscriptToItems(said){
  const tokens = normText(said).toLowerCase().split(/[,،]|\s+/).filter(Boolean).map(stripPunct).filter(w=>w && !STOPWORDS.includes(w));
  const segments = [];
  let cur = {qty:null, unit:null, words:[]};
  tokens.forEach(w=>{
    const n = wordToNumber(w);
    if(n!=null){
      if(cur.qty!=null && cur.words.length){ segments.push(cur); cur = {qty:n, unit:null, words:[]}; }
      else { cur.qty = n; }
      return;
    }
    if(UNIT_INFO[normText(w)]){ cur.unit = normText(w); return; }
    cur.words.push(w);
  });
  if(cur.words.length || cur.qty!=null) segments.push(cur);

  segments.forEach(seg=>{
    const qty = seg.qty!=null ? seg.qty : 1;
    const unitWord = seg.unit || 'kg';
    const nameGuess = seg.words.join(' ').trim();
    if(!nameGuess) return;
    let product = findProduct(nameGuess);
    if(!product){
      const catMatches = findByCategory(nameGuess);
      if(catMatches.length===1 && confirm(`"${nameGuess}" ku "${catMatches[0].name}${catMatches[0].brand?' ('+catMatches[0].brand+')':''}" (₹${catMatches[0].sellPrice}/${catMatches[0].unit}) add pannalama?`)){
        product = catMatches[0];
      }
    }
    if(product){
      const info = UNIT_INFO[unitWord] || {base:product.unit, factor:1};
      const qtyBase = (info.base===product.unit) ? qty*info.factor : qty;
      const dispName = displayNameFor(product, detectScript(nameGuess));
      currentItems.push({name:dispName, qtyBase, qtyDisplay:qty, unitLabel:unitWord, sellPrice:product.sellPrice, gst:product.gst, costPerUnit:product.costPerUnit, productId:product.id});
    } else {
      currentItems.push({name:nameGuess.replace(/\b\w/g,c=>c.toUpperCase()), qtyBase:qty, qtyDisplay:qty, unitLabel:unitWord, sellPrice:0, gst:0, costPerUnit:0, unmatched:true});
    }
  });
  renderItemsList();
}
function renderItemsList(){
  const list = document.getElementById('itemsList');
  document.getElementById('itemCount').textContent = currentItems.length;
  if(!currentItems.length){ list.innerHTML='<div class="empty">Say an order, or add an item manually.</div>'; document.getElementById('voiceTotal').textContent='₹0'; return; }
  let total=0;
  list.innerHTML = currentItems.map((it,idx)=>{
    const lineTotal = it.qtyBase*it.sellPrice; total += lineTotal;
    return `<div class="item-row"><div><div class="name">${it.name}${it.unmatched?' <span style="color:var(--danger);font-size:11px;">(new — set price)</span>':''}</div>
      <div class="meta">${fmtQty(it.qtyDisplay)} ${it.unitLabel} × ${money(it.sellPrice)}</div></div>
      <div style="display:flex;align-items:center;gap:6px;"><span class="amt">${money(lineTotal)}</span><button class="btn-ghost edit-item" data-idx="${idx}">✏️</button><button class="del" data-idx="${idx}">✕</button></div></div>`;
  }).join('');
  document.getElementById('voiceTotal').textContent = money(total);
  document.querySelectorAll('.del').forEach(b=> b.addEventListener('click', e=>{ currentItems.splice(e.target.dataset.idx,1); renderItemsList(); }));
  document.querySelectorAll('.edit-item').forEach(b=> b.addEventListener('click', e=>{
    const it = currentItems[e.target.dataset.idx]; if(!it) return;
    const newQty = prompt('Quantity ('+it.unitLabel+')?', it.qtyDisplay); if(newQty===null) return;
    const newPrice = prompt('Price per '+it.unitLabel+' (₹)?', it.sellPrice); if(newPrice===null) return;
    const q = parseFloat(newQty); if(!isNaN(q)){ const ratio = it.qtyDisplay? q/it.qtyDisplay : 1; it.qtyBase = it.qtyBase*ratio; it.qtyDisplay = q; }
    const pr = parseFloat(newPrice); if(!isNaN(pr)) it.sellPrice = pr;
    it.unmatched = false;
    renderItemsList();
  }));
}
document.getElementById('addManualBtn').addEventListener('click', ()=>{
  renderMenuGrid(); renderManualCart(); switchView('manualadd');
});
function currentDisplayLang(){ return LANG_NAME[currentLang] || 'en'; }
function addToCurrentItems(product, deltaQty){
  lastBillLang = currentDisplayLang();
  const existing = currentItems.find(it=>it.productId===product.id);
  if(existing){
    existing.qtyDisplay += deltaQty; existing.qtyBase += deltaQty;
    if(existing.qtyDisplay<=0){ currentItems = currentItems.filter(it=>it!==existing); }
  } else if(deltaQty>0){
    const dispName = displayNameFor(product, currentDisplayLang());
    currentItems.push({name: dispName, qtyBase:deltaQty, qtyDisplay:deltaQty, unitLabel:product.unit, sellPrice:product.sellPrice, gst:product.gst, costPerUnit:product.costPerUnit, productId:product.id});
  }
}
let pendingQty = {};
function renderMenuGrid(){
  document.getElementById('menuGrid').innerHTML = products.map(p=>{
    const inCart = currentItems.find(it=>it.productId===p.id);
    const qty = inCart ? fmtQty(inCart.qtyDisplay) : '';
    const cfg = SUBUNIT_CONFIG[p.unit];
    if(cfg){
      if(!pendingQty[p.id]) pendingQty[p.id] = {major:0, minor:0};
      const pend = pendingQty[p.id];
      return `<div class="menu-card special" data-id="${p.id}">${qty?'<span class="qtybadge">'+qty+'</span>':''}
        <div class="pic-lg">${getProductIcon(p)}</div>
        <div class="nm">${p.name}</div>
        <div class="pr">₹${p.sellPrice}/${p.unit}</div>
        <div class="subrow"><button class="mj-minus" data-id="${p.id}">−</button><span>${fmtQty(pend.major)} ${p.unit}</span><button class="mj-plus" data-id="${p.id}">+</button></div>
        <div class="subrow"><button class="mn-minus" data-id="${p.id}">−</button><span>${pend.minor} ${cfg.minorLabel}</span><button class="mn-plus" data-id="${p.id}">+</button></div>
        <button class="tile-add-btn" data-id="${p.id}">Add</button>
      </div>`;
    }
    return `<div class="menu-card" data-id="${p.id}">${qty?'<span class="qtybadge">'+qty+'</span>':''}
      <div class="pic-lg">${getProductIcon(p)}</div>
      <div class="nm">${p.name}</div>
      <div class="pr">₹${p.sellPrice}/${p.unit}</div>
    </div>`;
  }).join('') || '<div class="empty">No products yet — add some in Product Management.</div>';

  document.querySelectorAll('.menu-card:not(.special)').forEach(card=> card.addEventListener('click', ()=>{
    const p = products.find(x=>x.id==card.dataset.id); if(!p) return;
    addToCurrentItems(p, 1); renderMenuGrid(); renderManualCart();
  }));
  document.querySelectorAll('.mj-plus').forEach(b=> b.addEventListener('click', e=>{ e.stopPropagation(); const p=products.find(x=>x.id==e.target.dataset.id); const cfg=SUBUNIT_CONFIG[p.unit]; const pend=pendingQty[p.id]; pend.major = Math.round((pend.major+cfg.majorStep)*100)/100; renderMenuGrid(); }));
  document.querySelectorAll('.mj-minus').forEach(b=> b.addEventListener('click', e=>{ e.stopPropagation(); const p=products.find(x=>x.id==e.target.dataset.id); const cfg=SUBUNIT_CONFIG[p.unit]; const pend=pendingQty[p.id]; pend.major = Math.max(0, Math.round((pend.major-cfg.majorStep)*100)/100); renderMenuGrid(); }));
  document.querySelectorAll('.mn-plus').forEach(b=> b.addEventListener('click', e=>{ e.stopPropagation(); const p=products.find(x=>x.id==e.target.dataset.id); const cfg=SUBUNIT_CONFIG[p.unit]; const pend=pendingQty[p.id]; pend.minor += cfg.minorStep; if(pend.minor>cfg.minorMax){ pend.minor=0; pend.major=Math.round((pend.major+1)*100)/100; } renderMenuGrid(); }));
  document.querySelectorAll('.mn-minus').forEach(b=> b.addEventListener('click', e=>{ e.stopPropagation(); const p=products.find(x=>x.id==e.target.dataset.id); const cfg=SUBUNIT_CONFIG[p.unit]; const pend=pendingQty[p.id]; pend.minor = Math.max(0, pend.minor-cfg.minorStep); renderMenuGrid(); }));
  document.querySelectorAll('.tile-add-btn').forEach(b=> b.addEventListener('click', e=>{
    e.stopPropagation();
    const p = products.find(x=>x.id==e.target.dataset.id); if(!p) return;
    const cfg = SUBUNIT_CONFIG[p.unit]; const pend = pendingQty[p.id];
    const qty = Math.round((pend.major + pend.minor/cfg.minorPerMajor)*1000)/1000;
    if(qty<=0){ toast('Select a quantity first'); return; }
    addToCurrentItems(p, qty);
    pendingQty[p.id] = {major:0, minor:0};
    renderMenuGrid(); renderManualCart();
  }));
}
function renderManualCart(){
  document.getElementById('manualCount').textContent = currentItems.length;
  if(!currentItems.length){ document.getElementById('manualCartList').innerHTML = '<div class="empty">Tap a product above to add it.</div>'; document.getElementById('manualTotal').textContent='₹0'; return; }
  let total=0;
  document.getElementById('manualCartList').innerHTML = currentItems.map((it,idx)=>{
    total += it.qtyBase*it.sellPrice;
    return `<div class="cartrow"><div><div class="name">${it.name}</div><div class="meta">₹${it.sellPrice} each</div></div>
      <div class="qtyctrl"><button class="mcart-minus" data-idx="${idx}">−</button><span>${fmtQty(it.qtyDisplay)}</span><button class="mcart-plus" data-idx="${idx}">+</button></div>
      <div class="amt">${money(it.qtyBase*it.sellPrice)}</div></div>`;
  }).join('');
  document.getElementById('manualTotal').textContent = money(total);
  document.querySelectorAll('.mcart-plus').forEach(b=> b.addEventListener('click', e=>{ const p=products.find(x=>x.id===currentItems[e.target.dataset.idx].productId); if(p) addToCurrentItems(p,1); renderMenuGrid(); renderManualCart(); }));
  document.querySelectorAll('.mcart-minus').forEach(b=> b.addEventListener('click', e=>{ const p=products.find(x=>x.id===currentItems[e.target.dataset.idx].productId); if(p) addToCurrentItems(p,-1); renderMenuGrid(); renderManualCart(); }));
}
document.getElementById('manualGenerateBtn').addEventListener('click', ()=>{
  const bill = generateBillFromCurrentItems(); if(!bill) return;
  renderManualCart(); renderBill(bill, true); switchView('bill');
});

/* ---------------- bills ---------------- */
let bills = loadJSON('rv_bills_v2', []);
let billCounter = loadJSON('rv_counter_v2', 1);
function generateBillFromCurrentItems(){
  if(!currentItems.length){ toast('Add at least one item'); return null; }
  let total=0, gstTotal=0, profit=0;
  currentItems.forEach(it=>{
    const lineTotal = it.qtyBase*it.sellPrice;
    const lineGst = lineTotal*(it.gst/100);
    total += lineTotal + lineGst; gstTotal += lineGst; profit += (it.sellPrice-it.costPerUnit)*it.qtyBase;
    if(it.productId){ const p = products.find(x=>x.id===it.productId); if(p) p.stock = Math.max(0, p.stock-it.qtyBase); }
  });
  saveProducts();
  const bill = {id:billCounter++, items:[...currentItems], total, gstTotal, profit, lang:lastBillLang, paymentMethod:null, dateISO:new Date().toISOString(), date:new Date().toLocaleString('en-IN',{day:'2-digit',month:'short',hour:'2-digit',minute:'2-digit'})};
  bills.unshift(bill); saveJSON('rv_bills_v2', bills); saveJSON('rv_counter_v2', billCounter);
  currentItems = [];
  return bill;
}
document.getElementById('confirmBillBtn').addEventListener('click', ()=>{
  const bill = generateBillFromCurrentItems(); if(!bill) return;
  renderItemsList(); renderBill(bill, true); switchView('bill');
});
const LABELS = {en:{bill:'Bill',total:'Total',gst:'GST'}, ta:{bill:'பில்',total:'மொத்தம்',gst:'ஜிஎஸ்டி'}, hi:{bill:'बिल',total:'कुल',gst:'जीएसटी'}, kn:{bill:'ಬಿಲ್',total:'ಒಟ್ಟು',gst:'ಜಿಎಸ್ಟಿ'}};
function renderBill(bill, isFresh){
  applyStoreToUI();
  const L = LABELS[bill.lang]||LABELS.en;
  document.getElementById('billMeta').textContent = `${L.bill} #${bill.id} · ${bill.date}`;
  document.getElementById('billItemsTable').innerHTML = bill.items.map(it=>{
    const lineAmt = it.qtyBase*it.sellPrice; const lineGst = lineAmt*(it.gst/100);
    return `<div class="receipt-item4"><span class="rname">${it.name}</span><span class="rqty">${fmtQty(it.qtyDisplay)}${it.unitLabel}</span><span class="rgst">${money(lineGst)}</span><span class="rprice">${money(lineAmt)}</span></div>`;
  }).join('');
  document.getElementById('billSubtotal').textContent = money(bill.total - bill.gstTotal);
  document.getElementById('billGstTotal').textContent = money(bill.gstTotal);
  document.getElementById('billTotalAmt').textContent = money(bill.total);
  window._currentBill = bill;
  const showChoice = !!isFresh && !bill.paymentMethod;
  document.getElementById('paymentChoiceCard').style.display = showChoice ? 'block' : 'none';
  document.getElementById('qrPayCard').style.display = 'none';
  document.getElementById('billActionsCard').style.display = showChoice ? 'none' : 'block';
}
document.getElementById('payCashBtn').addEventListener('click', ()=>{
  const bill = window._currentBill; if(!bill) return;
  bill.paymentMethod='cash'; saveJSON('rv_bills_v2', bills);
  document.getElementById('paymentChoiceCard').style.display='none';
  document.getElementById('billActionsCard').style.display='block';
});
document.getElementById('payQrBtn').addEventListener('click', ()=>{
  const bill = window._currentBill; if(!bill) return;
  document.getElementById('paymentChoiceCard').style.display='none';
  document.getElementById('qrPayCard').style.display='block';
  document.getElementById('qrPayAmt').textContent = money(bill.total);
  const img = document.getElementById('qrPayImg'), empty = document.getElementById('qrPayEmpty');
  if(store.qrPhoto){ img.src = store.qrPhoto; img.style.display='inline-block'; empty.style.display='none'; }
  else { img.style.display='none'; empty.style.display='block'; }
});
document.getElementById('qrCancelBtn').addEventListener('click', ()=>{
  document.getElementById('qrPayCard').style.display='none';
  document.getElementById('paymentChoiceCard').style.display='block';
});
document.getElementById('qrPaymentReceivedBtn').addEventListener('click', ()=>{
  const bill = window._currentBill; if(!bill) return;
  bill.paymentMethod='online'; saveJSON('rv_bills_v2', bills);
  document.getElementById('qrPayCard').style.display='none';
  document.getElementById('billActionsCard').style.display='block';
  toast('Payment marked received');
});
document.getElementById('shareWaBtn').addEventListener('click', ()=>{
  const bill = window._currentBill; if(!bill){ toast('Generate a bill first'); return; }
  const L = LABELS[bill.lang]||LABELS.en;
  let text = `${store.name} — ${L.bill} #${bill.id}\n`;
  bill.items.forEach(it=> text += `${it.name} — ${fmtQty(it.qtyDisplay)}${it.unitLabel} = ${money(it.qtyBase*it.sellPrice)}\n`);
  text += `Subtotal: ${money(bill.total-bill.gstTotal)}\n${L.gst}: ${money(bill.gstTotal)}\nGrand ${L.total}: ${money(bill.total)}`;
  window.open('https://wa.me/?text='+encodeURIComponent(text), '_blank');
});
document.getElementById('downloadPdfBtn').addEventListener('click', ()=> window.print());

function renderAllBills(){
  document.getElementById('allBillsList').innerHTML = bills.length ? bills.map(b=>
    `<div class="row"><div><div class="name">Bill #${b.id}</div><div class="meta">${b.date} · ${b.items.length} items${b.paymentMethod?' · '+(b.paymentMethod==='cash'?'💵 Cash':'📱 Online'):''}</div></div>
      <div style="display:flex;align-items:center;gap:8px;"><span class="amt">${money(b.total)}</span><button class="btn-ghost view-bill-btn" data-id="${b.id}">View</button><button class="btn-ghost del-bill-btn" data-id="${b.id}" style="color:var(--danger);">✕</button></div></div>`).join('')
    : '<div class="empty">No bills yet.</div>';
  document.querySelectorAll('.view-bill-btn').forEach(btn=> btn.addEventListener('click', e=>{ const b=bills.find(x=>x.id==e.target.dataset.id); if(b){ renderBill(b, false); switchView('bill'); } }));
  document.querySelectorAll('.del-bill-btn').forEach(btn=> btn.addEventListener('click', e=>{
    if(!confirm('Delete Bill #'+e.target.dataset.id+'? This cannot be undone.')) return;
    bills = bills.filter(x=>x.id != e.target.dataset.id);
    saveJSON('rv_bills_v2', bills); renderAllBills(); toast('Bill deleted');
  }));
}
document.getElementById('clearBillsBtn').addEventListener('click', ()=>{
  if(!confirm('Clear all bill history? This cannot be undone.')) return;
  bills = []; saveJSON('rv_bills_v2', bills); renderAllBills(); toast('Bill history cleared');
});

/* ---------------- home summary ---------------- */
function todayStr(){ const d=new Date(); return d.toISOString().slice(0,10); }
function renderHomeSummary(){
  const today = todayStr();
  const todays = bills.filter(b=> b.dateISO.slice(0,10)===today);
  document.getElementById('sumSales').textContent = money(todays.reduce((s,b)=>s+b.total,0));
  document.getElementById('sumBills').textContent = todays.length;
  document.getElementById('sumProfit').textContent = money(todays.reduce((s,b)=>s+b.profit,0));
}

/* ---------------- stock hub / details ---------------- */
function renderStockHub(){
  document.getElementById('stTotalProducts').textContent = products.length;
  document.getElementById('stLowCount').textContent = products.filter(p=>stockStatus(p)==='low').length;
  document.getElementById('stOutCount').textContent = products.filter(p=>stockStatus(p)==='out').length;
  const low = products.filter(p=>stockStatus(p)!=='ok');
  document.getElementById('lowStockAlertList').innerHTML = low.length ? low.map(p=>
    `<div class="row"><span>${getProductIcon(p)} ${p.name}</span><span class="tag ${stockStatus(p)}">${fmtQty(p.stock)} ${p.unit} left</span></div>`).join('')
    : '<div class="empty">All stock levels healthy.</div>';
}
function renderStockTable(tab){
  const rows = products.filter(p=> tab==='current' ? true : stockStatus(p)===tab);
  document.getElementById('stockTableBody').innerHTML = rows.map(p=>
    `<tr><td style="width:30px;font-size:18px;">${getProductIcon(p)}</td><td>${p.name}</td><td>${fmtQty(p.stock)} ${p.unit} <span class="tag ${stockStatus(p)}">${stockStatus(p)==='ok'?'OK':stockStatus(p)==='low'?'Low':'Out'}</span></td></tr>`).join('')
    || '<tr><td colspan="3" class="empty">No products in this list.</td></tr>';
}

/* ---------------- reports ---------------- */
function renderProductWiseList(containerId, rows){
  const productSales = {};
  rows.forEach(b=> b.items.forEach(it=>{
    const key = it.name;
    if(!productSales[key]) productSales[key] = {qty:0, unit:it.unitLabel, productId:it.productId, amt:0};
    productSales[key].qty += it.qtyBase;
    productSales[key].amt += it.qtyBase*it.sellPrice;
  }));
  const entries = Object.entries(productSales);
  const totalAmt = entries.reduce((s,[,p])=>s+p.amt,0) || 1;
  entries.sort((a,b)=> b[1].amt - a[1].amt);
  document.getElementById(containerId).innerHTML = entries.length ? entries.map(([name,p])=>{
    const prod = p.productId ? products.find(x=>x.id===p.productId) : null;
    const icon = prod ? getProductIcon(prod) : '🛒';
    const pct = Math.round((p.amt/totalAmt)*100);
    return `<div class="row"><div style="display:flex;align-items:center;gap:8px;"><div class="pic-lg" style="width:30px;height:30px;font-size:15px;flex:none;">${icon}</div><div><div class="name">${name}</div><div class="meta">${fmtQty(p.qty)} ${p.unit}</div></div></div><span class="amt" style="color:var(--pri);">${pct}%</span></div>`;
  }).join('') : '<div class="empty">No sales in this period.</div>';
}
function renderDailyReport(){
  const date = document.getElementById('dailyDateInput').value || todayStr();
  const rows = bills.filter(b=> b.dateISO.slice(0,10)===date);
  document.getElementById('dTotalSales').textContent = money(rows.reduce((s,b)=>s+b.total,0));
  document.getElementById('dTotalBills').textContent = rows.length;
  document.getElementById('dProfit').textContent = money(rows.reduce((s,b)=>s+b.profit,0));
  renderProductWiseList('dailyProductWiseList', rows);
}
document.getElementById('dailyDateInput').addEventListener('change', renderDailyReport);

function getWeekRange(d){
  const day = d.getDay(); const diffToMon = (day===0?-6:1-day);
  const mon = new Date(d); mon.setDate(d.getDate()+diffToMon); mon.setHours(0,0,0,0);
  const sun = new Date(mon); sun.setDate(mon.getDate()+6); sun.setHours(23,59,59,999);
  return {mon, sun};
}
function renderWeeklyReport(){
  const val = document.getElementById('weeklyDateInput').value || todayStr();
  const chosen = new Date(val+'T00:00:00');
  const {mon, sun} = getWeekRange(chosen);
  document.getElementById('weekRangeLabel').textContent = mon.toLocaleDateString('en-IN',{day:'2-digit',month:'short'}) + ' – ' + sun.toLocaleDateString('en-IN',{day:'2-digit',month:'short',year:'numeric'});
  const rows = bills.filter(b=>{ const t=new Date(b.dateISO); return t>=mon && t<=sun; });
  document.getElementById('wTotalSales').textContent = money(rows.reduce((s,b)=>s+b.total,0));
  document.getElementById('wTotalBills').textContent = rows.length;
  document.getElementById('wProfit').textContent = money(rows.reduce((s,b)=>s+b.profit,0));

  const dayTotals = [0,0,0,0,0,0,0]; const dayLabels=['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
  rows.forEach(b=>{ const t=new Date(b.dateISO); let idx=t.getDay(); idx = idx===0?6:idx-1; dayTotals[idx]+=b.total; });
  const max = Math.max(1, ...dayTotals);
  document.getElementById('weekBarChart').innerHTML = dayTotals.map((v,i)=>
    `<div class="col"><div class="b" style="height:${Math.max(3,(v/max)*80)}px;"></div><div class="lbl">${dayLabels[i]}</div></div>`).join('');

  renderProductWiseList('productWiseList', rows);
}
document.getElementById('weeklyDateInput').addEventListener('change', renderWeeklyReport);

/* ---------------- credit (kadan) ---------------- */
let kadans = loadJSON('rv_kadan', []);
document.getElementById('kadanMic').addEventListener('click', ()=>{
  if(!SR){ toast('Voice not supported here — type it manually'); return; }
  const rec = new SR(); rec.lang = currentLang; rec.interimResults=false;
  rec.onstart = ()=> toast('Listening…');
  rec.onresult = e=>{
    let said = normText(e.results[0][0].transcript);
    // pull out amount (digits, or a spoken number word)
    let amount = null;
    const digitMatch = said.match(/(\d+(\.\d+)?)/);
    if(digitMatch){ amount = parseFloat(digitMatch[1]); said = said.replace(digitMatch[1],' '); }
    // pull out a known product by matching against inventory aliases
    let matchedProduct = null;
    const tokens = said.toLowerCase().split(/\s+/).map(stripPunct).filter(Boolean);
    for(const t of tokens){ const p = findProduct(t); if(p){ matchedProduct = p; said = said.replace(new RegExp(t,'i'),' '); break; } }
    if(amount==null){ for(const t of tokens){ const n=wordToNumber(t); if(n!=null){ amount=n; said=said.replace(new RegExp(t,'i'),' '); break; } } }
    const leftover = said.replace(/[.,!?;:।؛…]+/g,' ').split(/\s+/).filter(Boolean).filter(w=>!STOPWORDS.includes(stripPunct(w).toLowerCase())).join(' ').trim();
    document.getElementById('kadanAmount').value = amount!=null ? amount : '';
    document.getElementById('kadanProduct').value = matchedProduct ? matchedProduct.name : '';
    document.getElementById('kadanName').value = leftover.replace(/\b\w/g,c=>c.toUpperCase());
    toast('Heard — check & save');
  };
  rec.onerror = ()=> toast('Could not hear clearly — try again or type manually');
  rec.start();
});
document.getElementById('kadanSaveBtn').addEventListener('click', ()=>{
  const name = document.getElementById('kadanName').value.trim();
  const amount = parseFloat(document.getElementById('kadanAmount').value);
  const productName = document.getElementById('kadanProduct').value.trim();
  if(!name || !amount){ toast('Enter customer name and amount'); return; }
  kadans.unshift({id:Date.now(), name, amount, product:productName, date:new Date().toLocaleString('en-IN',{day:'2-digit',month:'short',hour:'2-digit',minute:'2-digit'})});
  saveJSON('rv_kadan', kadans);
  document.getElementById('kadanName').value=''; document.getElementById('kadanAmount').value=''; document.getElementById('kadanProduct').value='';
  renderKadanList(); toast('Kadan saved');
});
function renderKadanList(){
  document.getElementById('kadanList').innerHTML = kadans.length ? kadans.map(k=>
    `<div class="row"><div><div class="name">${k.name}</div><div class="meta">${k.product||'-'} · ${k.date}</div></div>
      <div style="display:flex;align-items:center;gap:8px;">
        <span class="amt">${money(k.amount)}</span>
        <button class="btn-ghost kadan-edit" data-id="${k.id}">✏️</button>
        <button class="btn-ghost kadan-paid" data-id="${k.id}" style="color:var(--pri);">✓ Paid</button>
      </div></div>`).join('')
    : '<div class="empty">No kadan entries yet.</div>';
  document.querySelectorAll('.kadan-edit').forEach(b=> b.addEventListener('click', e=>{
    const k = kadans.find(x=>x.id==e.target.dataset.id); if(!k) return;
    const newName = prompt('Customer name?', k.name); if(newName===null) return;
    const newAmt = prompt('Amount ₹?', k.amount); if(newAmt===null) return;
    const newProd = prompt('Product?', k.product||''); if(newProd===null) return;
    k.name = newName.trim()||k.name; k.amount = parseFloat(newAmt)||k.amount; k.product = newProd.trim();
    saveJSON('rv_kadan', kadans); renderKadanList(); toast('Kadan updated');
  }));
  document.querySelectorAll('.kadan-paid').forEach(b=> b.addEventListener('click', e=>{
    if(!confirm('Customer kadan return pannaacha? Remove this entry?')) return;
    kadans = kadans.filter(x=>x.id != e.target.dataset.id);
    saveJSON('rv_kadan', kadans); renderKadanList(); toast('Kadan cleared');
  }));
}

/* ---------------- init ---------------- */
/* ---------------- backup / restore ---------------- */
document.getElementById('downloadBackupBtn').addEventListener('click', ()=>{
  const backup = {
    rv_store: localStorage.getItem('rv_store'),
    rv_products_v2: localStorage.getItem('rv_products_v2'),
    rv_bills_v2: localStorage.getItem('rv_bills_v2'),
    rv_counter_v2: localStorage.getItem('rv_counter_v2'),
    rv_kadan: localStorage.getItem('rv_kadan'),
    savedAt: new Date().toISOString()
  };
  const blob = new Blob([JSON.stringify(backup, null, 2)], {type:'application/json'});
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'retailvoice-backup-'+todayStr()+'.json';
  a.click();
  toast('Backup downloaded');
});
document.getElementById('restoreBackupBtn').addEventListener('click', ()=> document.getElementById('restoreBackupInput').click());
document.getElementById('restoreBackupInput').addEventListener('change', e=>{
  const file = e.target.files[0]; if(!file) return;
  const reader = new FileReader();
  reader.onload = ev=>{
    try{
      const data = JSON.parse(ev.target.result);
      if(!confirm('Restore this backup? It will replace all current data in this browser.')) return;
      ['rv_store','rv_products_v2','rv_bills_v2','rv_counter_v2','rv_kadan'].forEach(k=>{ if(data[k]!=null) localStorage.setItem(k, data[k]); });
      toast('Backup restored — reloading…');
      setTimeout(()=> location.reload(), 800);
    }catch(err){ toast('Could not read that backup file'); }
  };
  reader.readAsText(file);
});

applyStoreToUI(); renderHomeSummary(); renderProducts();
if(localStorage.getItem('rv_products_v2')===null){
  setTimeout(()=> toast('New/empty session detected — Settings → Restore Backup if you have one'), 600);
}
