import * as api from './firebase-config.js';
import promptpayQr from 'https://esm.sh/promptpay-qr';

/* --- LOGIN & LOGOUT SYSTEM (SECURE) --- */
const loginContainer = document.getElementById('login-container');
const appContainer = document.getElementById('app-container');
const passwordInput = document.getElementById('login-password');
const btnLogin = document.getElementById('btn-login');
const btnLogout = document.getElementById('btn-logout');
const togglePasswordBtn = document.getElementById('toggle-password');
const toggleIcon = document.getElementById('toggle-icon');

// เช็คสถานะเมื่อเปิดแอป
if (localStorage.getItem('isLoggedIn') === 'true') {
  loginContainer.classList.add('hidden');
  loginContainer.classList.remove('flex');
  appContainer.classList.remove('hidden');
  appContainer.classList.add('flex');
}

// เปิด-ปิดการมองเห็นรหัสผ่าน
togglePasswordBtn.addEventListener('click', () => {
  if (passwordInput.type === 'password') {
    passwordInput.type = 'text';
    toggleIcon.textContent = 'visibility';
  } else {
    passwordInput.type = 'password';
    toggleIcon.textContent = 'visibility_off';
  }
});

// ตรวจสอบการล็อกอิน
const handleLogin = () => {
  // ใช้ .trim() เพื่อตัดเว้นวรรคซ้ายขวาทิ้ง ป้องกันการเผลอเคาะสเปซบาร์
  const userInput = passwordInput.value.trim(); 
  
  // btoa() คือฟังก์ชันแปลงข้อความของเบราว์เซอร์
  if (btoa(userInput) === "MTkxNTEy") { 
    localStorage.setItem('isLoggedIn', 'true'); 
    passwordInput.value = ''; 
    loginContainer.classList.add('hidden');
    loginContainer.classList.remove('flex');
    appContainer.classList.remove('hidden');
    appContainer.classList.add('flex');
    if (typeof showToast === 'function') showToast('✅ เข้าสู่ระบบสำเร็จ');
  } else {
    if (typeof showToast === 'function') showToast('❌ รหัสผ่านไม่ถูกต้อง', 'error');
    passwordInput.value = '';
    passwordInput.focus();
  }
};

btnLogin.addEventListener('click', handleLogin);
passwordInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') handleLogin();
});

// ออกจากระบบ
btnLogout.addEventListener('click', () => {
  localStorage.removeItem('isLoggedIn');
  appContainer.classList.remove('flex');
  appContainer.classList.add('hidden');
  loginContainer.classList.remove('hidden');
  loginContainer.classList.add('flex');
  
  passwordInput.type = 'password';
  toggleIcon.textContent = 'visibility_off';
  if (typeof showToast === 'function') showToast('ออกจากระบบเรียบร้อย');
});

// ⚠️ ใส่เบอร์พร้อมเพย์ (ไม่ต้องมีขีด)
const MY_PROMPTPAY_ID = "0964032659"; 

/* --- STATE & CONFIG --- */
const baseCategories = ["เมนูกาแฟ", "เมนูชา", "เมนูนม", "เมนูโซดา"];

const DEFAULT_MENU = {
  categories: baseCategories,
  items: [
    { id: 101, name: "เอสเพรสโซ่", price: 50, category: "เมนูกาแฟ" },
    { id: 102, name: "อเมริกาโน่", price: 45, category: "เมนูกาแฟ" },
    { id: 103, name: "ลาเต้", price: 50, category: "เมนูกาแฟ" },
    { id: 104, name: "คาปูชิโน่", price: 50, category: "เมนูกาแฟ" },
    { id: 105, name: "มอคค่า", price: 50, category: "เมนูกาแฟ" },
    { id: 106, name: "คาราเมลมัคคิอาโต้", price: 50, category: "เมนูกาแฟ" },
    { id: 107, name: "อเมริกาโน่น้ำส้ม", price: 50, category: "เมนูกาแฟ" },
    { id: 108, name: "อเมริกาโน่น้ำผึ้ง", price: 50, category: "เมนูกาแฟ" },
    { id: 109, name: "เนสกาแฟ", price: 25, category: "เมนูกาแฟ" },
    { id: 201, name: "ชาดำเย็น", price: 25, category: "เมนูชา" },
    { id: 202, name: "ชามะนาว", price: 25, category: "เมนูชา" },
    { id: 203, name: "ชาไทย", price: 25, category: "เมนูชา" },
    { id: 204, name: "ชาเขียว", price: 25, category: "เมนูชา" },
    { id: 205, name: "ชาพีช", price: 50, category: "เมนูชา" },
    { id: 206, name: "ชาไต้หวัน", price: 25, category: "เมนูชา" },
    { id: 301, name: "นมสด", price: 25, category: "เมนูนม" },
    { id: 302, name: "นมชมพู", price: 25, category: "เมนูนม" },
    { id: 303, name: "โอวัลติน", price: 25, category: "เมนูนม" },
    { id: 304, name: "โอวัลตินภูเขาไฟ", price: 45, category: "เมนูนม" },
    { id: 305, name: "โกโก้", price: 25, category: "เมนูนม" },
    { id: 306, name: "โกโก้มิ้นต์", price: 25, category: "เมนูนม" },
    { id: 307, name: "เผือก", price: 25, category: "เมนูนม" },
    { id: 308, name: "แคนตาลูป", price: 25, category: "เมนูนม" },
    { id: 309, name: "นมสดน้ำผึ้ง", price: 25, category: "เมนูนม" },
    { id: 310, name: "นมสดคาราเมล", price: 25, category: "เมนูนม" },
    { id: 311, name: "นมสดโอริโอ้", price: 25, category: "เมนูนม" },
    { id: 312, name: "นมสดบราวน์ชูก้าร์", price: 25, category: "เมนูนม" },
    { id: 313, name: "นมสดสตรอเบอร์รี่", price: 25, category: "เมนูนม" },
    { id: 314, name: "นมสดบลูเบอร์รี่", price: 25, category: "เมนูนม" },
    { id: 315, name: "นมสดมิ้นต์", price: 25, category: "เมนูนม" },
    { id: 401, name: "แดงมะนาวโซดา", price: 25, category: "เมนูโซดา" },
    { id: 402, name: "แดงโซดา", price: 25, category: "เมนูโซดา" },
    { id: 403, name: "น้ำผึ้งมะนาวโซดา", price: 25, category: "เมนูโซดา" },
    { id: 404, name: "มะนาวโซดา", price: 25, category: "เมนูโซดา" },
    { id: 405, name: "บลูฮาวายโซดา", price: 25, category: "เมนูโซดา" },
    { id: 406, name: "ลิ้นจี่โซดา", price: 25, category: "เมนูโซดา" },
    { id: 407, name: "สตรอเบอร์รี่โซดา", price: 25, category: "เมนูโซดา" },
    { id: 408, name: "พีชโซดา", price: 25, category: "เมนูโซดา" },
    { id: 409, name: "แอปเปิ้ลโซดา", price: 25, category: "เมนูโซดา" },
    { id: 410, name: "บลูเบอร์รี่โซดา", price: 25, category: "เมนูโซดา" },
    { id: 411, name: "เสาวรสโซดา", price: 25, category: "เมนูโซดา" },
  ],
  toppings: [
    { id: 1, name: "ไข่มุก", price: 0 },
    { id: 2, name: "วิปครีม", price: 10 },
    { id: 3, name: "ครีมชีส", price: 20 },
    { id: 4, name: "ชีสขุด", price: 20 },
    { id: 5, name: "ช็อคโกแลตขุด", price: 20 },
    { id: 6, name: "บุกบราวชูก้าร์", price: 15 },
    { id: 7, name: "ปั่น", price: 10 },
  ]
};

let menuConfig = DEFAULT_MENU;
let activeCategory = baseCategories[0];
let cart = [];
let chartInstance = null;
let currentHistTab = 'sales';
let dashMode = 'day';
let dashSelectedDate = new Date().toLocaleDateString('en-CA');
let cachedDashData = null;
let undoTimeout = null;
let expenseDrafts = [{ id: Date.now(), name: '', amount: '' }]; 
let currentLastDoc = null; 

const formatTHB = (num) => (num || 0).toLocaleString('th-TH');
const getTodayStr = () => new Date().toLocaleDateString('en-CA');

window.addEventListener('online', () => document.getElementById('offline-badge').classList.add('hidden'));
window.addEventListener('offline', () => document.getElementById('offline-badge').classList.remove('hidden'));

/* --- TOAST SYSTEM --- */
const showToast = (message, type = 'success', undoCallback = null) => {
  const container = document.getElementById('toast-container');
  const toast = document.createElement('div');
  const bg = type === 'error' ? 'bg-red-600' : 'bg-gray-800';
  toast.className = `${bg} text-white px-4 py-3 rounded-xl shadow-lg flex items-center gap-3 pointer-events-auto transform transition-all duration-300 translate-y-[-20px] opacity-0`;
  
  let content = `<span>${message}</span>`;
  if (undoCallback) {
    content += `<button class="text-yellow-300 font-bold ml-4 border-l border-gray-600 pl-3 active:opacity-50">Undo (5s)</button>`;
  }
  toast.innerHTML = content;
  container.appendChild(toast);
  
  setTimeout(() => { toast.classList.remove('translate-y-[-20px]', 'opacity-0'); }, 10);

  if (undoCallback) {
    const btn = toast.querySelector('button');
    btn.onclick = () => { clearTimeout(undoTimeout); undoCallback(); toast.remove(); };
    undoTimeout = setTimeout(() => { if (toast.parentNode) toast.remove(); }, 5000);
  } else {
    setTimeout(() => { toast.classList.add('opacity-0'); setTimeout(() => toast.remove(), 300); }, 3000);
  }
};

/* --- TAB NAVIGATION --- */
const switchTab = (target) => {
  document.querySelectorAll('.tab-content').forEach(el => el.classList.add('hidden'));
  document.getElementById(`tab-${target}`).classList.remove('hidden');
  
  const titles = { 
    pos: '<img src="logo.jpg" class="w-14 h-14 rounded-full object-cover border border-gray-200 shadow-sm"> ร่ำรวยชา', 
    expenses: '📉 ต้นทุน', 
    dashboard: '📊 สรุป', 
    history: '🕒 ประวัติ', 
    settings: '⚙️ ตั้งค่า' 
  };
  
  document.getElementById('header-title').innerHTML = titles[target];
  
  document.querySelectorAll('.nav-btn').forEach(btn => {
    const isActive = btn.dataset.target === target;
    btn.classList.toggle('text-green-600', isActive);
    btn.classList.toggle('text-gray-400', !isActive);
  });

  if (target === 'pos') renderPOS();
  if (target === 'expenses') renderExpenses(); 
  if (target === 'dashboard') loadDashboard();
  if (target === 'history') loadHistory();
  if (target === 'settings') renderSettings();
};
document.querySelectorAll('.nav-btn').forEach(btn => btn.onclick = () => switchTab(btn.dataset.target));

/* --- 1. POS LOGIC --- */
window.setActiveCategory = (cat) => {
  activeCategory = cat;
  renderPOS();
};

const renderPOS = () => {
  const catContainer = document.getElementById('pos-categories');
  const menusContainer = document.getElementById('pos-menus');
  const toppingsContainer = document.getElementById('pos-toppings');
  
  if (catContainer) {
    catContainer.innerHTML = menuConfig.categories.map(cat => `
      <button class="whitespace-nowrap px-4 py-2 rounded-xl text-sm font-bold transition border ${activeCategory === cat ? 'bg-gray-800 text-white border-gray-800 shadow-md' : 'bg-white text-gray-500 border-gray-200 active:bg-gray-50'}" onclick="setActiveCategory('${cat}')">
        ${cat}
      </button>
    `).join('');
  }

  const filteredItems = menuConfig.items.filter(m => m.category === activeCategory);
  
  menusContainer.innerHTML = filteredItems.map(m => `
    <button class="bg-white p-3 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-center items-center active:bg-gray-100 min-h-[70px]" onclick="addToCart(${m.id})">
      <div class="font-bold text-gray-700 text-sm">${m.name}</div>
      <div class="text-xs text-green-600 mt-1">${m.price} ฿</div>
    </button>
  `).join('');

  toppingsContainer.innerHTML = menuConfig.toppings.map(t => `
    <button class="bg-white px-3 py-2 rounded-full shadow-sm border border-gray-100 text-sm font-medium active:bg-gray-100" onclick="addTopping(${t.id})">
      ${t.name} (+${t.price})
    </button>
  `).join('');
  
  renderCart();
};

window.addToCart = (itemId) => {
  const item = menuConfig.items.find(i => i.id === itemId);
  const existing = cart.find(c => c.id === itemId && c.toppings.length === 0);
  if (existing) existing.qty++; else cart.push({ ...item, qty: 1, toppings: [], cartId: Date.now() });
  renderCart();
};

window.addTopping = (toppingId) => {
  if (cart.length === 0) return showToast('กรุณาเลือกเมนูก่อนเพิ่มท็อปปิ้ง', 'error');
  const topping = menuConfig.toppings.find(t => t.id === toppingId);
  cart[cart.length - 1].toppings.push(topping);
  renderCart();
};

window.removeFromCart = (cartId) => {
  cart = cart.filter(c => c.cartId !== cartId);
  renderCart();
};

const renderCart = () => {
  const container = document.getElementById('cart-items');
  let total = 0;
  container.innerHTML = cart.map(item => {
    const tNames = item.toppings.map(t => t.name).join(', ');
    const tPrice = item.toppings.reduce((s, t) => s + t.price, 0);
    const itemTotal = (item.price + tPrice) * item.qty;
    total += itemTotal;
    return `
      <div class="flex justify-between items-center bg-gray-50 p-2 rounded-lg border border-gray-100">
        <div class="flex-1">
          <div class="font-medium text-sm text-gray-800">${item.name} ${tNames ? `<span class="text-xs text-blue-500">(+${tNames})</span>` : ''}</div>
          <div class="text-xs text-gray-500">${item.price + tPrice}฿ x ${item.qty}</div>
        </div>
        <div class="font-bold mr-3 text-gray-700">${itemTotal}฿</div>
        <button onclick="removeFromCart(${item.cartId})" class="text-red-500 p-1 bg-white rounded shadow-sm border border-gray-200 active:scale-95"><span class="material-icons text-sm block">delete</span></button>
      </div>
    `;
  }).join('');
  
  document.getElementById('cart-total').innerText = `${formatTHB(total)} ฿`;
  const isEmpty = cart.length === 0;
  document.getElementById('btn-pay-cash').disabled = isEmpty;
  document.getElementById('btn-pay-transfer').disabled = isEmpty;
};

const generateOrderSummaryHTML = (cartItems) => {
  return cartItems.map(item => {
    const tNames = item.toppings.map(t => t.name).join(', ');
    const tPrice = item.toppings.reduce((s, t) => s + t.price, 0);
    const itemTotal = (item.price + tPrice) * item.qty;
    return `
      <div class="flex justify-between items-start border-b border-gray-200 last:border-0 py-1.5">
        <div class="text-left flex-1">
          <div class="font-bold text-gray-700">${item.qty} x ${item.name}</div>
          ${tNames ? `<div class="text-[10px] text-gray-500 mt-0.5">+${tNames}</div>` : ''}
        </div>
        <div class="font-bold text-gray-700 pl-2">${itemTotal} ฿</div>
      </div>
    `;
  }).join('');
};

const showTransferModal = (amount, cartItems) => {
  return new Promise((resolve) => {
    const modal = document.getElementById('transfer-modal');
    const box = document.getElementById('transfer-modal-box');
    const qrContainer = document.getElementById('promptpay-qrcode');
    const itemsContainer = document.getElementById('transfer-modal-items');
    
    // --- โค้ดที่เปลี่ยนใหม่: สร้าง QR ในเครื่องแทนการดึงรูป ---
    qrContainer.innerHTML = ""; 
    const payload = promptpayQr(MY_PROMPTPAY_ID, { amount: amount });
    new QRCode(qrContainer, {
      text: payload,
      width: 180,
      height: 180,
      colorDark: "#000000",
      colorLight: "#ffffff",
      correctLevel: QRCode.CorrectLevel.M
    });
    // ---------------------------------------------------

    document.getElementById('transfer-modal-amount').innerText = `${formatTHB(amount)} ฿`;
    
    itemsContainer.innerHTML = generateOrderSummaryHTML(cartItems);

    modal.classList.remove('hidden');
    modal.classList.add('flex');
    void modal.offsetWidth; 
    modal.classList.remove('opacity-0');
    box.classList.remove('scale-95');

    const close = (result) => {
      modal.classList.add('opacity-0');
      box.classList.add('scale-95');
      setTimeout(() => {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
        qrContainer.innerHTML = ""; 
        resolve(result);
      }, 200);
    };

    document.getElementById('btn-transfer-ok').onclick = () => close(true);
    document.getElementById('btn-transfer-cancel').onclick = () => close(false);
  });
};

const showCashModal = (amount, cartItems) => {
  return new Promise((resolve) => {
    const modal = document.getElementById('cash-modal');
    const box = document.getElementById('cash-modal-box');
    const inputReceived = document.getElementById('cash-received');
    const changeDisplay = document.getElementById('cash-change');
    const btnOk = document.getElementById('btn-cash-ok');
    const itemsContainer = document.getElementById('cash-modal-items');
    
    document.getElementById('cash-modal-total').innerText = `${formatTHB(amount)} ฿`;
    inputReceived.value = '';
    changeDisplay.innerText = '0 ฿';
    changeDisplay.classList.remove('text-red-500');
    changeDisplay.classList.add('text-green-700');
    btnOk.disabled = true;

    itemsContainer.innerHTML = generateOrderSummaryHTML(cartItems);

    modal.classList.remove('hidden');
    modal.classList.add('flex');
    void modal.offsetWidth; 
    modal.classList.remove('opacity-0');
    box.classList.remove('scale-95');
    
    setTimeout(() => inputReceived.focus(), 200);

    const calcChange = () => {
      const received = Number(inputReceived.value);
      const change = received - amount;
      
      if (received >= amount) {
        changeDisplay.innerText = `${formatTHB(change)} ฿`;
        changeDisplay.classList.remove('text-red-500');
        changeDisplay.classList.add('text-green-700');
        btnOk.disabled = false;
      } else {
        changeDisplay.innerText = 'รับเงินไม่ครบ!';
        changeDisplay.classList.remove('text-green-700');
        changeDisplay.classList.add('text-red-500');
        btnOk.disabled = true;
      }
    };

    inputReceived.oninput = calcChange;

    document.querySelectorAll('.btn-quick-cash').forEach(btn => {
      btn.onclick = (e) => {
        const val = e.target.dataset.val;
        if(val === 'exact') inputReceived.value = amount;
        else inputReceived.value = val;
        calcChange();
      };
    });

    const close = (result) => {
      modal.classList.add('opacity-0');
      box.classList.add('scale-95');
      setTimeout(() => {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
        resolve(result);
      }, 200);
    };

    btnOk.onclick = () => close(true);
    document.getElementById('btn-cash-cancel').onclick = () => close(false);
  });
};

const handleCheckout = async (method) => {
  if (cart.length === 0) return;
  if (!navigator.onLine) return showToast('ออฟไลน์! ไม่สามารถบันทึกได้', 'error');

  const total = cart.reduce((sum, item) => sum + ((item.price + item.toppings.reduce((s,t)=>s+t.price,0)) * item.qty), 0);
  
  if (method === 'transfer') {
    const isTransferConfirmed = await showTransferModal(total, cart);
    if (!isTransferConfirmed) return; 
  } else if (method === 'cash') {
    const isCashConfirmed = await showCashModal(total, cart);
    if (!isCashConfirmed) return;
  }

  const cartCopy = [...cart];
  cart = []; renderCart(); 
  
  document.getElementById('btn-pay-cash').disabled = true;
  document.getElementById('btn-pay-transfer').disabled = true;

  try {
    const savedSale = await api.addSale(cartCopy, total, method);
    sessionStorage.removeItem(`dash_cache_${getTodayStr()}_${dashMode}`); 
    
    const audio = document.getElementById('sound-success');
    if(audio) audio.play();
    
    showToast(`✅ รับเงิน ${formatTHB(total)} ฿ (${method === 'cash' ? 'เงินสด' : 'เงินโอน'})`, 'success', async () => {
      try {
        await api.deleteSale(savedSale.id, savedSale.amount, savedSale.date);
        sessionStorage.removeItem(`dash_cache_${getTodayStr()}_${dashMode}`);
        showToast('ยกเลิกบิลเรียบร้อย');
      } catch(e) { showToast('Undo ไม่สำเร็จ', 'error'); }
    });
  } catch (error) { showToast('เกิดข้อผิดพลาดในการบันทึก', 'error'); }
};

document.getElementById('btn-pay-cash').onclick = () => handleCheckout('cash');
document.getElementById('btn-pay-transfer').onclick = () => handleCheckout('transfer');

/* --- 2. EXPENSES LOGIC --- */
const renderExpenses = () => {
  const list = document.getElementById('expense-list');
  list.innerHTML = expenseDrafts.map((exp, i) => `
    <div class="flex gap-2 items-center expense-item" data-idx="${i}">
      <input type="text" class="flex-1 border p-2 rounded-lg exp-name-val outline-none focus:ring-2 focus:ring-red-200 text-sm" value="${exp.name}" placeholder="เช่น แก้ว, น้ำแข็ง">
      <input type="number" class="w-24 border p-2 rounded-lg text-center exp-amount-val outline-none focus:ring-2 focus:ring-red-200 text-sm" value="${exp.amount}" placeholder="0">
      <button class="text-red-500 p-2 bg-gray-50 rounded-lg active:bg-gray-100" onclick="removeExpenseRow(${i})"><span class="material-icons text-sm block">delete</span></button>
    </div>
  `).join('');
};

window.removeExpenseRow = (index) => {
  expenseDrafts.splice(index, 1);
  if (expenseDrafts.length === 0) expenseDrafts.push({ id: Date.now(), name: '', amount: '' }); 
  renderExpenses();
};

const syncExpenseDrafts = () => {
  expenseDrafts = Array.from(document.querySelectorAll('.expense-item')).map(el => ({
    id: Date.now() + Math.random(),
    name: el.querySelector('.exp-name-val').value,
    amount: el.querySelector('.exp-amount-val').value
  }));
};

document.getElementById('btn-add-expense-row').onclick = () => {
  syncExpenseDrafts(); 
  expenseDrafts.push({ id: Date.now(), name: '', amount: '' });
  renderExpenses();
};

document.getElementById('btn-save-expenses').onclick = async () => {
  syncExpenseDrafts();
  
  const validExpenses = expenseDrafts
    .map(e => ({ name: e.name.trim(), amount: Number(e.amount) }))
    .filter(e => e.name !== '' && e.amount > 0);

  if (validExpenses.length === 0) return showToast('กรุณากรอกข้อมูลให้ถูกต้องอย่างน้อย 1 รายการ', 'error');

  document.getElementById('btn-save-expenses').disabled = true;
  try {
    await api.addMultipleExpenses(validExpenses);
    sessionStorage.removeItem(`dash_cache_${getTodayStr()}_${dashMode}`); 
    showToast(`✅ บันทึกต้นทุน ${validExpenses.length} รายการแล้ว`);
    
    expenseDrafts = [{ id: Date.now(), name: '', amount: '' }];
    renderExpenses();
  } catch(e) { 
    showToast('Error!', 'error'); 
  }
  document.getElementById('btn-save-expenses').disabled = false;
};

/* --- 3. DASHBOARD LOGIC --- */
const dashDateInput = document.getElementById('dash-date');
dashDateInput.value = dashSelectedDate;

const updateDashNavStyle = () => {
  const btns = ['btn-dash-day', 'btn-dash-month', 'btn-dash-year'];
  btns.forEach(id => {
    const el = document.getElementById(id);
    el.className = "flex-1 py-1.5 text-sm rounded-lg text-gray-500 font-medium transition hover:bg-gray-50";
  });
  const activeBtn = document.getElementById(`btn-dash-${dashMode}`);
  activeBtn.className = "flex-1 py-1.5 text-sm rounded-lg bg-gray-800 text-white font-bold transition";
  document.getElementById('dash-date-picker-container').style.display = dashMode === 'day' ? 'flex' : 'none';
};

const loadDashboard = async (forceRefresh = false) => {
  updateDashNavStyle();
  const cacheKey = `dash_cache_${dashSelectedDate}_${dashMode}`;
  
  if (!forceRefresh && sessionStorage.getItem(cacheKey)) {
    cachedDashData = JSON.parse(sessionStorage.getItem(cacheKey));
    renderDashboardUI();
    return;
  }

  document.getElementById('dash-sales').innerText = '...';
  document.getElementById('dash-expenses').innerText = '...';
  document.getElementById('dash-profit').innerText = '...';

  try {
    let summary = { salesTotal: 0, expensesTotal: 0 };
    let chartData = { labels: [], sales: [], expenses: [], title: '' };

    if (dashMode === 'day') {
      summary = await api.getDailySummary(dashSelectedDate);
      const last7Days = Array.from({length: 7}, (_, i) => {
        const d = new Date(dashSelectedDate); d.setDate(d.getDate() - i);
        return d.toLocaleDateString('en-CA');
      }).reverse();
      
      const weeklyDataMap = await api.getWeeklyData(last7Days);
      chartData = {
        title: 'ย้อนหลัง 7 วัน',
        labels: last7Days.map(d => d.slice(5)), 
        sales: last7Days.map(d => weeklyDataMap[d]?.salesTotal || 0),
        expenses: last7Days.map(d => weeklyDataMap[d]?.expensesTotal || 0)
      };

    } else if (dashMode === 'month') {
      const currentMonthStr = dashSelectedDate.substring(0, 7); 
      const currentYearStr = dashSelectedDate.substring(0, 4); 
      summary = await api.getMonthlySummary(currentMonthStr);
      
      const yearlyDataMap = await api.getYearlyDataByMonth(currentYearStr);
      const mLabels = ["ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.", "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."];
      const sData = [], eData = [];
      for (let i = 1; i <= 12; i++) {
        const mStr = `${currentYearStr}-${String(i).padStart(2, '0')}`;
        sData.push(yearlyDataMap[mStr]?.salesTotal || 0);
        eData.push(yearlyDataMap[mStr]?.expensesTotal || 0);
      }
      chartData = { title: `สรุป 12 เดือน (ปี ${currentYearStr})`, labels: mLabels, sales: sData, expenses: eData };

    } else if (dashMode === 'year') {
      const currentYearStr = dashSelectedDate.substring(0, 4);
      summary = await api.getYearlySummary(currentYearStr);
      
      const currentY = parseInt(currentYearStr);
      const last5Years = [currentY-4, currentY-3, currentY-2, currentY-1, currentY].map(String);
      const multiYearMap = await api.getMultiYearData(last5Years);
      
      chartData = {
        title: 'ย้อนหลัง 5 ปี',
        labels: last5Years,
        sales: last5Years.map(y => multiYearMap[y]?.salesTotal || 0),
        expenses: last5Years.map(y => multiYearMap[y]?.expensesTotal || 0)
      };
    }

    cachedDashData = { summary, chartData };
    sessionStorage.setItem(cacheKey, JSON.stringify(cachedDashData));
    renderDashboardUI();
    
  } catch (e) { showToast('โหลดข้อมูลสรุปไม่สำเร็จ', 'error'); }
};

const renderDashboardUI = () => {
  if (!cachedDashData) return;
  const { summary, chartData } = cachedDashData;
  
  const labelS = document.getElementById('dash-label-sales');
  const labelE = document.getElementById('dash-label-expenses');
  if(dashMode === 'day') { labelS.innerText = 'ขาย (วันนี้)'; labelE.innerText = 'ทุน (วันนี้)'; }
  if(dashMode === 'month') { labelS.innerText = 'ขาย (เดือนนี้)'; labelE.innerText = 'ทุน (เดือนนี้)'; }
  if(dashMode === 'year') { labelS.innerText = 'ขาย (ปีนี้)'; labelE.innerText = 'ทุน (ปีนี้)'; }

  const s = summary.salesTotal || 0;
  const e = summary.expensesTotal || 0;
  document.getElementById('dash-sales').innerText = formatTHB(s) + '฿';
  document.getElementById('dash-expenses').innerText = formatTHB(e) + '฿';
  document.getElementById('dash-profit').innerText = formatTHB(s - e) + '฿';

  document.getElementById('chart-title').innerText = chartData.title;

  if (chartInstance) chartInstance.destroy();
  const ctx = document.getElementById('mainChart').getContext('2d');
  chartInstance = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: chartData.labels,
      datasets: [
        { label: 'ยอดขาย', data: chartData.sales, backgroundColor: '#22c55e', borderRadius: 4 },
        { label: 'ต้นทุน', data: chartData.expenses, backgroundColor: '#ef4444', borderRadius: 4 }
      ]
    },
    options: { responsive: true, scales: { y: { beginAtZero: true } }, plugins: { legend: { position: 'bottom' } } }
  });
};

document.getElementById('btn-dash-day').onclick = () => { dashMode = 'day'; loadDashboard(); };
document.getElementById('btn-dash-month').onclick = () => { dashMode = 'month'; loadDashboard(); };
document.getElementById('btn-dash-year').onclick = () => { dashMode = 'year'; loadDashboard(); };
document.getElementById('btn-refresh-dash').onclick = () => loadDashboard(true);

const showFixCacheModal = () => {
  return new Promise((resolve) => {
    const modal = document.getElementById('fix-cache-modal');
    const box = document.getElementById('fix-cache-modal-box');
    modal.classList.remove('hidden'); modal.classList.add('flex'); void modal.offsetWidth; 
    modal.classList.remove('opacity-0'); box.classList.remove('scale-95');
    
    const close = (result) => {
      modal.classList.add('opacity-0'); box.classList.add('scale-95');
      setTimeout(() => { modal.classList.add('hidden'); modal.classList.remove('flex'); resolve(result); }, 200);
    };
    
    document.getElementById('btn-fix-ok').onclick = () => close(true);
    document.getElementById('btn-fix-cancel').onclick = () => close(false);
  });
};

document.getElementById('btn-fix-cache').onclick = async () => {
  const isConfirmed = await showFixCacheModal();
  if (!isConfirmed) return;

  const btn = document.getElementById('btn-fix-cache');
  btn.innerHTML = '<span class="material-icons text-[12px] animate-spin">autorenew</span> กำลังซ่อม...';
  try {
    await api.recalculateDailyCache(dashSelectedDate);
    sessionStorage.removeItem(`dash_cache_${dashSelectedDate}_day`); 
    await loadDashboard(true);
    showToast('✅ ซ่อมแซมยอดรายวันเรียบร้อย');
  } catch(e) {
    showToast('เกิดข้อผิดพลาดในการซ่อมข้อมูล', 'error');
  }
  btn.innerHTML = '<span class="material-icons text-[12px]">build</span> ซ่อมยอด';
};

dashDateInput.addEventListener('change', (e) => { 
  dashSelectedDate = e.target.value; 
  loadDashboard(); 
});

/* --- 4. HISTORY LOGIC --- */
const historyDateInput = document.getElementById('history-date');
historyDateInput.value = getTodayStr(); 

const showConfirmModal = () => {
  return new Promise((resolve) => {
    const modal = document.getElementById('confirm-modal');
    const box = document.getElementById('confirm-modal-box');
    modal.classList.remove('hidden'); modal.classList.add('flex'); void modal.offsetWidth; 
    modal.classList.remove('opacity-0'); box.classList.remove('scale-95');
    const close = (result) => {
      modal.classList.add('opacity-0'); box.classList.add('scale-95');
      setTimeout(() => { modal.classList.add('hidden'); modal.classList.remove('flex'); resolve(result); }, 200);
    };
    document.getElementById('btn-confirm-ok').onclick = () => close(true);
    document.getElementById('btn-confirm-cancel').onclick = () => close(false);
  });
};

const loadHistory = async (isLoadMore = false) => {
  const container = document.getElementById('history-list');
  const selectedDate = historyDateInput.value;
  if (!selectedDate) return;

  if (!isLoadMore) {
    container.innerHTML = '<div class="text-center text-gray-500 py-4"><span class="material-icons animate-spin">autorenew</span> กำลังโหลด...</div>';
    currentLastDoc = null; 
  }

  try {
    const summary = await api.getDailySummary(selectedDate);
    const sTotal = summary.salesTotal || 0;
    const eTotal = summary.expensesTotal || 0;
    
    document.getElementById('hist-summary-sales').innerText = formatTHB(sTotal);
    document.getElementById('hist-summary-expenses').innerText = formatTHB(eTotal);
    document.getElementById('hist-summary-profit').innerText = formatTHB(sTotal - eTotal);

    let result, data = [];
    if (currentHistTab === 'sales') {
      result = await api.getSalesByDate(selectedDate, currentLastDoc);
      data = result.data;
      currentLastDoc = result.lastVisible;

      const htmlStr = data.map(d => `
        <div class="bg-white p-3 rounded-xl shadow-sm flex justify-between items-center border border-gray-100 mb-3">
          <div>
            <div class="text-[10px] text-gray-400">${new Date(d.timestamp?.toDate()).toLocaleTimeString('th-TH')}</div>
            <div class="font-medium text-sm text-gray-700">${d.menuNames}</div>
            <div class="text-[10px] uppercase font-bold mt-1 ${d.paymentMethod === 'cash' ? 'text-green-500' : 'text-blue-500'}">${d.paymentMethod}</div>
          </div>
          <div class="flex items-center gap-3">
            <span class="font-bold text-green-600">+${formatTHB(d.totalAmount)}฿</span>
            <button onclick="deleteHistoryDoc('sales', '${d.id}', ${d.totalAmount}, '${d.date}')" class="text-red-400 p-1"><span class="material-icons text-sm block">delete</span></button>
          </div>
        </div>
      `).join('');
      
      if(!isLoadMore) container.innerHTML = htmlStr || '<div class="text-center text-gray-400 py-4">ไม่มีรายการขายในวันนี้</div>';
      else { document.getElementById('btn-load-more')?.remove(); container.innerHTML += htmlStr; }

    } else {
      result = await api.getExpensesByDate(selectedDate, currentLastDoc);
      data = result.data;
      currentLastDoc = result.lastVisible;

      const htmlStr = data.map(d => `
        <div class="bg-white p-3 rounded-xl shadow-sm flex justify-between items-center border border-gray-100 mb-3">
          <div>
            <div class="text-[10px] text-gray-400">${new Date(d.timestamp?.toDate()).toLocaleTimeString('th-TH')}</div>
            <div class="font-medium text-sm text-gray-700">${d.item}</div>
          </div>
          <div class="flex items-center gap-3">
            <span class="font-bold text-red-600">-${formatTHB(d.amount)}฿</span>
            <button onclick="deleteHistoryDoc('expenses', '${d.id}', ${d.amount}, '${d.date}')" class="text-red-400 p-1"><span class="material-icons text-sm block">delete</span></button>
          </div>
        </div>
      `).join('');

      if(!isLoadMore) container.innerHTML = htmlStr || '<div class="text-center text-gray-400 py-4">ไม่มีรายการต้นทุนในวันนี้</div>';
      else { document.getElementById('btn-load-more')?.remove(); container.innerHTML += htmlStr; }
    }

    if (data.length === 30) {
      container.innerHTML += `
        <button id="btn-load-more" onclick="loadMoreHistory()" class="w-full py-3 mt-2 bg-gray-100 text-gray-600 rounded-xl text-sm font-bold active:bg-gray-200">
          โหลดเพิ่มเติม...
        </button>
      `;
    }
  } catch (e) { 
    if(!isLoadMore) container.innerHTML = '<div class="text-red-500 text-center py-4">เกิดข้อผิดพลาดในการดึงข้อมูล</div>'; 
  }
};

window.loadMoreHistory = () => loadHistory(true);
historyDateInput.addEventListener('change', () => loadHistory(false));

window.deleteHistoryDoc = async (type, id, amount, date) => {
  const isConfirmed = await showConfirmModal();
  if (!isConfirmed) return;
  try {
    if(type === 'sales') await api.deleteSale(id, amount, date);
    else await api.deleteExpense(id, amount, date);
    
    sessionStorage.removeItem(`dash_cache_${getTodayStr()}_day`);
    sessionStorage.removeItem(`dash_cache_${getTodayStr()}_month`);
    sessionStorage.removeItem(`dash_cache_${getTodayStr()}_year`);
    
    loadHistory(false); 
    showToast('ลบรายการสำเร็จ');
  } catch(e) { showToast('ลบไม่สำเร็จ', 'error'); }
};

document.getElementById('hist-tab-sales').onclick = (e) => {
  currentHistTab = 'sales';
  e.target.className = 'flex-1 py-2 font-bold text-green-600 border-b-2 border-green-600';
  document.getElementById('hist-tab-expenses').className = 'flex-1 py-2 font-bold text-gray-400';
  loadHistory(false);
};
document.getElementById('hist-tab-expenses').onclick = (e) => {
  currentHistTab = 'expenses';
  e.target.className = 'flex-1 py-2 font-bold text-green-600 border-b-2 border-green-600';
  document.getElementById('hist-tab-sales').className = 'flex-1 py-2 font-bold text-gray-400';
  loadHistory(false);
};

/* --- 🌟 5. SETTINGS LOGIC --- */
const renderSettings = () => {
  const mList = document.getElementById('settings-menu-list');
  const tList = document.getElementById('settings-topping-list');

  mList.innerHTML = menuConfig.items.map((m, i) => `
    <div class="flex flex-col gap-2 p-3 bg-gray-50 rounded-xl config-item border border-gray-100" data-type="menu" data-idx="${i}">
      <div class="flex gap-2 items-center">
        <input type="text" class="flex-1 border p-2 rounded-lg name-val outline-none focus:ring-2 focus:ring-gray-200 text-sm bg-white" value="${m.name}" placeholder="ชื่อเมนู">
        <input type="number" class="w-20 border p-2 rounded-lg text-center price-val outline-none focus:ring-2 focus:ring-gray-200 text-sm bg-white" value="${m.price}" placeholder="ราคา">
        <button class="text-red-500 p-2 bg-white rounded-lg border border-gray-200 active:bg-gray-100" onclick="removeConfigRow('menu', ${i})"><span class="material-icons text-sm block">delete</span></button>
      </div>
      <div class="flex items-center gap-2">
        <span class="text-xs text-gray-500 font-bold ml-1">หมวดหมู่:</span>
        <select class="flex-1 border p-1.5 rounded-lg text-sm bg-white outline-none focus:ring-2 focus:ring-gray-200 cat-val">
          ${menuConfig.categories.map(cat => `<option value="${cat}" ${m.category === cat ? 'selected' : ''}>${cat}</option>`).join('')}
        </select>
      </div>
    </div>
  `).join('');

  tList.innerHTML = menuConfig.toppings.map((t, i) => `
    <div class="flex gap-2 items-center config-item" data-type="topping" data-idx="${i}">
      <input type="text" class="flex-1 border p-2 rounded-lg name-val outline-none focus:ring-2 focus:ring-gray-200 text-sm" value="${t.name}" placeholder="ชื่อท็อปปิ้ง">
      <input type="number" class="w-20 border p-2 rounded-lg text-center price-val outline-none focus:ring-2 focus:ring-gray-200 text-sm" value="${t.price}" placeholder="ราคา">
      <button class="text-red-500 p-2 bg-gray-50 rounded-lg active:bg-gray-100" onclick="removeConfigRow('topping', ${i})"><span class="material-icons text-sm block">delete</span></button>
    </div>
  `).join('');
};

window.removeConfigRow = (type, index) => {
  if(type === 'menu' && menuConfig.items.length <= 1) return showToast('ต้องมีเมนูอย่างน้อย 1 รายการ', 'error');
  menuConfig[type === 'menu' ? 'items' : 'toppings'].splice(index, 1);
  renderSettings();
};

document.getElementById('btn-add-menu').onclick = () => {
  menuConfig.items.push({ id: Date.now(), name: '', price: 0, category: menuConfig.categories[0] }); 
  renderSettings();
};
document.getElementById('btn-add-topping').onclick = () => {
  menuConfig.toppings.push({ id: Date.now(), name: '', price: 0 }); 
  renderSettings();
};

document.getElementById('btn-save-settings').onclick = async () => {
  const parseMenuRows = () => Array.from(document.querySelectorAll(`.config-item[data-type="menu"]`)).map(el => ({
    id: Date.now() + Math.random(),
    name: el.querySelector('.name-val').value,
    price: Number(el.querySelector('.price-val').value),
    category: el.querySelector('.cat-val').value
  }));

  const parseToppingRows = () => Array.from(document.querySelectorAll(`.config-item[data-type="topping"]`)).map(el => ({
    id: Date.now() + Math.random(),
    name: el.querySelector('.name-val').value,
    price: Number(el.querySelector('.price-val').value)
  }));
  
  menuConfig.items = parseMenuRows();
  menuConfig.toppings = parseToppingRows();
  
  localStorage.setItem('pos_menu_config_v3', JSON.stringify(menuConfig));
  
  try {
    await api.saveMenuConfig(menuConfig);
    showToast('💾 บันทึกการตั้งค่าขึ้น Cloud แล้ว');
  } catch(e) {
    showToast('บันทึกลงเครื่องแล้ว (แต่ Cloud ขัดข้อง)', 'error');
  }
  
  renderPOS(); 
};

const checkAndCleanOldData = async () => {
  const lastClean = localStorage.getItem('last_data_cleanup');
  const now = new Date();
  const thisMonth = now.toLocaleDateString('en-CA').substring(0, 7); // YYYY-MM

  // ถ้าเคยทำเดือนนี้แล้ว ข้ามไป
  if (lastClean === thisMonth) return;

  try {
    const deleted = await api.deleteDataOlderThan(4);
    localStorage.setItem('last_data_cleanup', thisMonth);
    if (deleted > 0) {
      showToast(`🗑️ ล้างข้อมูลเก่ากว่า 4 ปี (${deleted} รายการ)`);
    }
  } catch (e) {
    console.error('Auto cleanup failed:', e);
  }
};

const initApp = async () => {
  try {
    const cloudMenu = await api.getMenuConfig();
    if (cloudMenu) {
      menuConfig = cloudMenu;
      localStorage.setItem('pos_menu_config_v3', JSON.stringify(menuConfig));
    } else {
      const localMenu = localStorage.getItem('pos_menu_config_v3');
      if (localMenu) menuConfig = JSON.parse(localMenu);
    }
  } catch (e) {
    const localMenu = localStorage.getItem('pos_menu_config_v3');
    if (localMenu) menuConfig = JSON.parse(localMenu);
  }

  if (!menuConfig.categories) menuConfig.categories = baseCategories;
  menuConfig.items.forEach(item => {
    if (!item.category) item.category = "เมนูชา"; 
  });
  
  activeCategory = menuConfig.categories[0];
  renderPOS();
  checkAndCleanOldData();
};

initApp();