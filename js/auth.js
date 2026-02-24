import { auth } from './firebase-config.js';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";

// Registro
window.registrar = async function() {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  try {
    await createUserWithEmailAndPassword(auth, email, password);
    window.location.href = 'index.html'; // redirige a la página principal
  } catch (error) {
    alert('Error: ' + error.message);
  }
}

// Login
window.iniciarSesion = async function() {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  try {
    await signInWithEmailAndPassword(auth, email, password);
    window.location.href = 'index.html';
  } catch (error) {
    alert('Error: ' + error.message);
  }
}

// Cerrar sesión
window.cerrarSesion = async function() {
  await signOut(auth);
  window.location.href = 'login.html';
}