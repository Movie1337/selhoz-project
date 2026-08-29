let token = null;

async function api(path, opts={}){
  const headers = opts.headers || {};
  if (token) headers['Authorization'] = 'Bearer ' + token;
  const res = await fetch('/api' + path, { ...opts, headers });
  return res.json();
}

document.getElementById('btnRegister').addEventListener('click', async ()=>{
  const name = document.getElementById('regName').value;
  const email = document.getElementById('regEmail').value;
  const password = document.getElementById('regPass').value;
  const role = document.getElementById('regRole').value;
  const r = await api('/register', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ name, email, password, role }) });
  if (r.token){ token = r.token; onLogin(r.user); }
  else alert(r.error || 'Register failed');
});

document.getElementById('btnLogin').addEventListener('click', async ()=>{
  const email = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPass').value;
  const r = await api('/login', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ email, password }) });
  if (r.token){ token = r.token; onLogin(r.user); }
  else alert(r.error || 'Login failed');
});

function onLogin(user){
  document.getElementById('createAd').style.display = 'block';
}

document.getElementById('btnCreateAd').addEventListener('click', async ()=>{
  const ad = {
    title: document.getElementById('adTitle').value,
    type: document.getElementById('adType').value,
    crop: document.getElementById('adCrop').value,
    variety: document.getElementById('adVariety').value,
    volume: document.getElementById('adVolume').value,
    region: document.getElementById('adRegion').value,
    price: parseFloat(document.getElementById('adPrice').value) || null,
    deliveryTime: document.getElementById('adDelivery').value,
    specs: document.getElementById('adSpecs').value
  };
  const r = await api('/ads', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(ad) });
  if (r.id) { loadAds(); } else alert(r.error || 'Failed');
});

async function loadAds(){
  const r = await api('/ads');
  const cont = document.getElementById('ads');
  cont.innerHTML = '';
  for (const a of r){
    const el = document.createElement('div'); el.className = 'ad';
    el.innerHTML = `<strong>${a.title}</strong><div>${a.type} • ${a.crop} ${a.variety}</div><div>${a.volume} • ${a.region}</div><div>Price: ${a.price || '-'} • ${a.deliveryTime}</div>`;
    cont.appendChild(el);
  }
}

loadAds();
