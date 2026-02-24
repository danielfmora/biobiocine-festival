import { db, auth } from './firebase-config.js';
import { doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

// Guardar orden de columnas
export async function guardarOrdenColumnas(orden) {
  const user = auth.currentUser;
  if (!user) return;
  const ref = doc(db, 'userSettings', user.uid);
  await setDoc(ref, { columnOrder: orden }, { merge: true });
}

// Obtener orden de columnas
export async function obtenerOrdenColumnas() {
  const user = auth.currentUser;
  if (!user) return null;
  const ref = doc(db, 'userSettings', user.uid);
  const snap = await getDoc(ref);
  if (snap.exists()) {
    return snap.data().columnOrder;
  } else {
    return null; // primera vez, sin preferencias
  }
}