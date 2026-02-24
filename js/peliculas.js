import { db, storage, auth } from './firebase-config.js';
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc, query, orderBy } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";
import { ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-storage.js";
import { obtenerOrdenColumnas, guardarOrdenColumnas } from './settings.js';

// Campos fijos de una película (todos compartidos)
const CAMPOS = ['titulo', 'director', 'pais', 'año', 'duracion', 'sinopsis', 'imagenUrl'];

let peliculas = [];
let ordenActual = [...CAMPOS]; // orden por defecto

// Cargar lista de películas desde Firestore
export async function cargarPeliculas() {
  const q = query(collection(db, 'peliculas'), orderBy('titulo'));
  const snapshot = await getDocs(q);
  peliculas = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  // Aplicar orden guardado
  const ordenGuardado = await obtenerOrdenColumnas();
  if (ordenGuardado) {
    ordenActual = ordenGuardado;
  }
  renderTabla();
}

// Renderizar tabla con orden actual
function renderTabla() {
  const tbody = document.getElementById('tabla-peliculas');
  if (!tbody) return;
  tbody.innerHTML = '';
  peliculas.forEach(p => {
    const tr = document.createElement('tr');
    // Recorrer las columnas en el orden actual
    ordenActual.forEach(campo => {
      const td = document.createElement('td');
      if (campo === 'imagenUrl' && p[campo]) {
        const img = document.createElement('img');
        img.src = p[campo];
        img.style.width = '50px';
        td.appendChild(img);
      } else {
        td.textContent = p[campo] || '';
      }
      tr.appendChild(td);
    });
    // Añadir botones de editar/eliminar
    const tdAcciones = document.createElement('td');
    tdAcciones.innerHTML = `<button onclick="editarPelicula('${p.id}')">✏️</button>
                            <button onclick="eliminarPelicula('${p.id}')">🗑️</button>`;
    tr.appendChild(tdAcciones);
    tbody.appendChild(tr);
  });
}

// Añadir película (desde formulario)
export async function agregarPelicula(formData, imagenFile) {
  let imagenUrl = '';
  if (imagenFile) {
    const storageRef = ref(storage, 'posters/' + Date.now() + '_' + imagenFile.name);
    await uploadBytes(storageRef, imagenFile);
    imagenUrl = await getDownloadURL(storageRef);
  }
  const nueva = {
    titulo: formData.titulo,
    director: formData.director,
    pais: formData.pais,
    año: parseInt(formData.año),
    duracion: parseInt(formData.duracion),
    sinopsis: formData.sinopsis,
    imagenUrl: imagenUrl
  };
  await addDoc(collection(db, 'peliculas'), nueva);
  cargarPeliculas(); // recargar
}

// Eliminar
window.eliminarPelicula = async (id) => {
  if (confirm('¿Eliminar película?')) {
    await deleteDoc(doc(db, 'peliculas', id));
    cargarPeliculas();
  }
}

// Editar (cargar datos en formulario)
window.editarPelicula = async (id) => {
  const peli = peliculas.find(p => p.id === id);
  if (!peli) return;
  // Rellenar formulario (asumiendo que existe un modal o formulario en index.html)
  document.getElementById('edit-id').value = id;
  document.getElementById('edit-titulo').value = peli.titulo || '';
  document.getElementById('edit-director').value = peli.director || '';
  document.getElementById('edit-pais').value = peli.pais || '';
  document.getElementById('edit-año').value = peli.año || '';
  document.getElementById('edit-duracion').value = peli.duracion || '';
  document.getElementById('edit-sinopsis').value = peli.sinopsis || '';
  // Mostrar modal (puedes usar display:block)
  document.getElementById('modal-editar').style.display = 'block';
}

// Guardar cambios edición
window.guardarEdicion = async () => {
  const id = document.getElementById('edit-id').value;
  const datos = {
    titulo: document.getElementById('edit-titulo').value,
    director: document.getElementById('edit-director').value,
    pais: document.getElementById('edit-pais').value,
    año: parseInt(document.getElementById('edit-año').value),
    duracion: parseInt(document.getElementById('edit-duracion').value),
    sinopsis: document.getElementById('edit-sinopsis').value
  };
  await updateDoc(doc(db, 'peliculas', id), datos);
  document.getElementById('modal-editar').style.display = 'none';
  cargarPeliculas();
}

// Cambiar orden de columnas (desde interfaz de configuración)
export async function cambiarOrden(nuevoOrden) {
  ordenActual = nuevoOrden;
  await guardarOrdenColumnas(nuevoOrden);
  renderTabla();
}

// Inicializar listeners al cargar la página
if (document.getElementById('tabla-peliculas')) {
  cargarPeliculas();
}