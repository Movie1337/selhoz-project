document.querySelectorAll('.menu li').forEach(li=>{
  li.addEventListener('click', ()=>{
    document.querySelectorAll('.menu li').forEach(x=>x.classList.remove('active'));
    li.classList.add('active');
    const sec = li.dataset.section;
    document.querySelectorAll('.section').forEach(s=>s.classList.remove('visible'));
    document.getElementById(sec).classList.add('visible');
  });
});

// default show home
document.getElementById('home').classList.add('visible');

// Auth modal behavior (mock)
const overlay = document.getElementById('overlay');
const loginModal = document.getElementById('loginModal');
const registerModal = document.getElementById('registerModal');
const authArea = document.getElementById('authArea');

function showModal(modal){ overlay.style.display='block'; modal.style.display='block'; }
function closeModals(){ overlay.style.display='none'; loginModal.style.display='none'; registerModal.style.display='none'; }

document.getElementById('btnShowLogin').addEventListener('click', ()=>{ showModal(loginModal); });
document.getElementById('btnShowRegister').addEventListener('click', ()=>{ showModal(registerModal); });
document.getElementById('loginCancel').addEventListener('click', closeModals);
document.getElementById('regCancel').addEventListener('click', closeModals);
overlay.addEventListener('click', closeModals);

function setUserMock(user){
  localStorage.setItem('mockUser', JSON.stringify(user));
  renderAuth();
}

function logoutMock(){ localStorage.removeItem('mockUser'); renderAuth(); }

function renderAuth(){
  const raw = localStorage.getItem('mockUser');
  authArea.innerHTML = '';
  if (!raw){
    const l = document.createElement('button'); l.id='btnShowLogin'; l.className='auth-btn'; l.textContent='Login';
    const r = document.createElement('button'); r.id='btnShowRegister'; r.className='auth-btn outline'; r.textContent='Register';
    authArea.appendChild(l); authArea.appendChild(r);
    l.addEventListener('click', ()=>showModal(loginModal));
    r.addEventListener('click', ()=>showModal(registerModal));
  } else {
    const user = JSON.parse(raw);
    const badge = document.createElement('div'); badge.className='user-badge';
    badge.innerHTML = `<div><strong>${user.name}</strong></div>`;
    const dd = document.createElement('div'); dd.style.marginLeft='8px';
    const out = document.createElement('button'); out.textContent='Logout'; out.className='auth-btn outline'; out.addEventListener('click', logoutMock);
    authArea.appendChild(badge); authArea.appendChild(out);
  }
}

document.getElementById('loginSubmit').addEventListener('click', ()=>{
  const email = document.getElementById('loginEmailMock').value || 'farmer@example.com';
  const name = email.split('@')[0];
  setUserMock({ name, email, role: 'farmer' });
  closeModals();
});

document.getElementById('regSubmit').addEventListener('click', ()=>{
  const name = document.getElementById('regNameMock').value || 'New User';
  const email = document.getElementById('regEmailMock').value || 'user@example.com';
  const role = document.getElementById('regRoleMock').value || 'farmer';
  setUserMock({ name, email, role });
  closeModals();
});

renderAuth();
