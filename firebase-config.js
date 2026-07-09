import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { 
  getFirestore, doc, collection, writeBatch, increment, 
  serverTimestamp, getDoc, getDocs, query, where, orderBy, limit, documentId, startAfter, setDoc 
} from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyB2ZBM0JNqZkJEvagKMeZpuqU1ISDRb6dU",
  authDomain: "ramruaycha-pos.firebaseapp.com",
  projectId: "ramruaycha-pos",
  storageBucket: "ramruaycha-pos.firebasestorage.app",
  messagingSenderId: "911852964354",
  appId: "1:911852964354:web:9f5282fb49ce771987b51b",
  measurementId: "G-PSWSXE7CHM"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const getTodayStr = () => new Date().toLocaleDateString('en-CA'); 
const getMonthStr = (dateStr) => dateStr.substring(0, 7); 
const getYearStr = (dateStr) => dateStr.substring(0, 4); 

// =============================
// เขียนข้อมูล (Writes)
// =============================

export const addSale = async (cartItems, totalAmount, paymentMethod) => {
  const batch = writeBatch(db);
  const dateStr = getTodayStr();
  const monthStr = getMonthStr(dateStr);
  const yearStr = getYearStr(dateStr);
  
  const saleRef = doc(collection(db, 'sales'));
  const menuNames = cartItems.map(i => `${i.name}x${i.qty}`).join(', ');
  batch.set(saleRef, {
    date: dateStr, menuNames, totalAmount, paymentMethod, timestamp: serverTimestamp()
  });

  batch.set(doc(db, 'daily_cache', dateStr), { salesTotal: increment(totalAmount), salesCount: increment(1), lastUpdated: serverTimestamp() }, { merge: true });
  batch.set(doc(db, 'monthly_cache', monthStr), { salesTotal: increment(totalAmount), lastUpdated: serverTimestamp() }, { merge: true });
  batch.set(doc(db, 'yearly_cache', yearStr), { salesTotal: increment(totalAmount), lastUpdated: serverTimestamp() }, { merge: true }); 

  await batch.commit();
  return { id: saleRef.id, date: dateStr, amount: totalAmount };
};

export const deleteSale = async (docId, amount, dateStr) => {
  const batch = writeBatch(db);
  const monthStr = getMonthStr(dateStr);
  const yearStr = getYearStr(dateStr);

  batch.delete(doc(db, 'sales', docId));
  batch.set(doc(db, 'daily_cache', dateStr), { salesTotal: increment(-amount), salesCount: increment(-1) }, { merge: true });
  batch.set(doc(db, 'monthly_cache', monthStr), { salesTotal: increment(-amount) }, { merge: true });
  batch.set(doc(db, 'yearly_cache', yearStr), { salesTotal: increment(-amount) }, { merge: true }); 

  await batch.commit();
};

export const addMultipleExpenses = async (expensesArray) => {
  const batch = writeBatch(db);
  const dateStr = getTodayStr();
  const monthStr = getMonthStr(dateStr);
  const yearStr = getYearStr(dateStr);
  let totalAmount = 0;

  expensesArray.forEach(exp => {
    const expRef = doc(collection(db, 'expenses'));
    batch.set(expRef, { date: dateStr, item: exp.name, amount: exp.amount, timestamp: serverTimestamp() });
    totalAmount += exp.amount;
  });
  
  batch.set(doc(db, 'daily_cache', dateStr), { expensesTotal: increment(totalAmount) }, { merge: true });
  batch.set(doc(db, 'monthly_cache', monthStr), { expensesTotal: increment(totalAmount) }, { merge: true });
  batch.set(doc(db, 'yearly_cache', yearStr), { expensesTotal: increment(totalAmount) }, { merge: true }); 

  await batch.commit();
};

export const deleteExpense = async (docId, amount, dateStr) => {
  const batch = writeBatch(db);
  const monthStr = getMonthStr(dateStr);
  const yearStr = getYearStr(dateStr);

  batch.delete(doc(db, 'expenses', docId));
  batch.set(doc(db, 'daily_cache', dateStr), { expensesTotal: increment(-amount) }, { merge: true });
  batch.set(doc(db, 'monthly_cache', monthStr), { expensesTotal: increment(-amount) }, { merge: true });
  batch.set(doc(db, 'yearly_cache', yearStr), { expensesTotal: increment(-amount) }, { merge: true }); 

  await batch.commit();
};

// =============================
// อ่านข้อมูล (Reads)
// =============================

export const getDailySummary = async (dateStr) => {
  const snap = await getDoc(doc(db, 'daily_cache', dateStr));
  return snap.exists() ? snap.data() : { salesTotal: 0, expensesTotal: 0 };
};

export const getMonthlySummary = async (monthStr) => {
  const snap = await getDoc(doc(db, 'monthly_cache', monthStr));
  return snap.exists() ? snap.data() : { salesTotal: 0, expensesTotal: 0 };
};

export const getYearlySummary = async (yearStr) => {
  const snap = await getDoc(doc(db, 'yearly_cache', yearStr));
  return snap.exists() ? snap.data() : { salesTotal: 0, expensesTotal: 0 };
};

export const getWeeklyData = async (dateStrArray) => {
  if (dateStrArray.length === 0) return {};
  const q = query(collection(db, 'daily_cache'), where(documentId(), 'in', dateStrArray));
  const snap = await getDocs(q);
  const dataMap = {};
  snap.forEach(doc => { dataMap[doc.id] = doc.data(); });
  return dataMap;
};

export const getYearlyDataByMonth = async (yearStr) => {
  const q = query(collection(db, 'monthly_cache'), where(documentId(), '>=', `${yearStr}-01`), where(documentId(), '<=', `${yearStr}-12`));
  const snap = await getDocs(q);
  const dataMap = {};
  snap.forEach(doc => { dataMap[doc.id] = doc.data(); });
  return dataMap;
};

export const getMultiYearData = async (yearStrArray) => {
  if (yearStrArray.length === 0) return {};
  const q = query(collection(db, 'yearly_cache'), where(documentId(), 'in', yearStrArray));
  const snap = await getDocs(q);
  const dataMap = {};
  snap.forEach(doc => { dataMap[doc.id] = doc.data(); });
  return dataMap;
};

// 🌟 แก้ไข: ดึงประวัติการขายแบบ Pagination (จำกัด 30 รายการต่อรอบ)
export const getSalesByDate = async (dateStr, lastDoc = null) => {
  let q = query(collection(db, 'sales'), where("date", "==", dateStr), orderBy('timestamp', 'desc'), limit(30));
  if (lastDoc) {
    q = query(collection(db, 'sales'), where("date", "==", dateStr), orderBy('timestamp', 'desc'), startAfter(lastDoc), limit(30));
  }
  const snap = await getDocs(q);
  return {
    data: snap.docs.map(d => ({ id: d.id, ...d.data() })),
    lastVisible: snap.docs[snap.docs.length - 1]
  };
};

// 🌟 แก้ไข: ดึงประวัติต้นทุนแบบ Pagination
export const getExpensesByDate = async (dateStr, lastDoc = null) => {
  let q = query(collection(db, 'expenses'), where("date", "==", dateStr), orderBy('timestamp', 'desc'), limit(30));
  if (lastDoc) {
    q = query(collection(db, 'expenses'), where("date", "==", dateStr), orderBy('timestamp', 'desc'), startAfter(lastDoc), limit(30));
  }
  const snap = await getDocs(q);
  return {
    data: snap.docs.map(d => ({ id: d.id, ...d.data() })),
    lastVisible: snap.docs[snap.docs.length - 1]
  };
};

// =============================
// เมนูและการตั้งค่า (Settings & Maintenance)
// =============================

export const getMenuConfig = async () => {
  const snap = await getDoc(doc(db, 'settings', 'menuConfig'));
  return snap.exists() ? snap.data() : null;
};

export const saveMenuConfig = async (config) => {
  await setDoc(doc(db, 'settings', 'menuConfig'), config);
};

export const recalculateDailyCache = async (dateStr) => {
  const salesQ = query(collection(db, 'sales'), where("date", "==", dateStr));
  const salesSnap = await getDocs(salesQ);
  let totalSales = 0; let countSales = 0;
  salesSnap.forEach(doc => { totalSales += doc.data().totalAmount; countSales++; });

  const expQ = query(collection(db, 'expenses'), where("date", "==", dateStr));
  const expSnap = await getDocs(expQ);
  let totalExp = 0;
  expSnap.forEach(doc => { totalExp += doc.data().amount; });

  await setDoc(doc(db, 'daily_cache', dateStr), {
    salesTotal: totalSales, salesCount: countSales, expensesTotal: totalExp, lastUpdated: serverTimestamp()
  }, { merge: true });

  return { salesTotal: totalSales, expensesTotal: totalExp };
};

export const deleteDataOlderThan = async (years = 3) => {
  const cutoff = new Date();
  cutoff.setFullYear(cutoff.getFullYear() - years);
  const cutoffDateStr = cutoff.toLocaleDateString('en-CA');
  const cutoffMonthStr = cutoffDateStr.substring(0, 7);

  let deletedCount = 0;

  const deleteCollection = async (snap) => {
    let batch = writeBatch(db);
    let count = 0;
    for (const docSnap of snap.docs) {
      batch.delete(docSnap.ref);
      count++;
      deletedCount++;
      if (count >= 500) {
        await batch.commit();
        batch = writeBatch(db);
        count = 0;
      }
    }
    if (count > 0) await batch.commit();
  };

  // ลบ sales เก่า
  const salesSnap = await getDocs(
    query(collection(db, 'sales'), where('date', '<', cutoffDateStr))
  );
  await deleteCollection(salesSnap);

  // ลบ expenses เก่า
  const expSnap = await getDocs(
    query(collection(db, 'expenses'), where('date', '<', cutoffDateStr))
  );
  await deleteCollection(expSnap);

  // ลบ daily_cache เก่า
  const dailySnap = await getDocs(
    query(collection(db, 'daily_cache'), where(documentId(), '<', cutoffDateStr))
  );
  await deleteCollection(dailySnap);

  // ลบ monthly_cache เก่า
  const monthlySnap = await getDocs(
    query(collection(db, 'monthly_cache'), where(documentId(), '<', cutoffMonthStr))
  );
  await deleteCollection(monthlySnap);

  // yearly_cache ไม่ลบ เพราะใช้แสดงกราฟ 5 ปี

  return deletedCount;
};

export { db };