import * as XLSX from "https://cdn.sheetjs.com/xlsx-0.19.2/package/dist/xlsx.full.min.js";
import { collection, addDoc } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";
import { db } from './firebase-config.js';
import { cargarPeliculas } from './peliculas.js';

// Leer archivo Excel y subir a Firestore
window.importarExcel = async function(event) {
  const file = event.target.files[0];
  const data = await file.arrayBuffer();
  const workbook = XLSX.read(data);
  const hoja = workbook.Sheets[workbook.SheetNames[0]];
  const filas = XLSX.utils.sheet_to_json(hoja);

  for (const fila of filas) {
    // Mapear columnas del Excel a los campos esperados
    const pelicula = {
      titulo: fila['Título'] || fila['titulo'] || '',
      director: fila['Director'] || fila['director'] || '',
      pais: fila['País'] || fila['pais'] || '',
      año: parseInt(fila['Año'] || fila['año']) || 0,
      duracion: parseInt(fila['Duración'] || fila['duracion']) || 0,
      sinopsis: fila['Sinopsis'] || fila['sinopsis'] || '',
      imagenUrl: fila['Imagen'] || fila['imagenUrl'] || ''
    };
    await addDoc(collection(db, 'peliculas'), pelicula);
  }
  alert('Importación completada');
  cargarPeliculas();
}

// Exportar a Excel
window.exportarExcel = function() {
  import('./peliculas.js').then(module => {
    const peliculas = module.peliculas; // necesitas exportar la variable peliculas desde peliculas.js
    // Convertir a hoja de cálculo
    const worksheet = XLSX.utils.json_to_sheet(peliculas.map(p => {
      const { id, ...rest } = p; // quitar el id
      return rest;
    }));
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Películas");
    XLSX.writeFile(workbook, "peliculas_festival.xlsx");
  });
}