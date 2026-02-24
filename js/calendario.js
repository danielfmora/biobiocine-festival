import { Calendar } from "https://cdn.jsdelivr.net/npm/fullcalendar@6.1.8/index.global.min.js";
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";
import { db } from './firebase-config.js';

let calendar;

export async function inicializarCalendario() {
  // Cargar películas para poder arrastrarlas
  const snapshot = await getDocs(collection(db, 'peliculas'));
  const peliculas = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  renderListaPeliculas(peliculas);

  // Configurar FullCalendar
  const calendarEl = document.getElementById('calendar');
  calendar = new Calendar(calendarEl, {
    initialView: 'timeGridWeek',
    initialDate: '2026-11-02', // fecha de inicio del festival
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay'
    },
    editable: true,
    droppable: true, // permite recibir elementos externos
    drop: function(info) {
      // Cuando se suelta un elemento externo en el calendario
      const peliculaId = info.draggedEl.dataset.id;
      // Crear un evento con la película
      calendar.addEvent({
        title: info.draggedEl.innerText,
        start: info.dateStr,
        allDay: true,
        extendedProps: { peliculaId }
      });
    },
    events: [] // aquí cargarías eventos guardados en una colección "programacion"
  });
  calendar.render();
}

function renderListaPeliculas(peliculas) {
  const container = document.getElementById('lista-peliculas-drag');
  container.innerHTML = '';
  peliculas.forEach(p => {
    const div = document.createElement('div');
    div.className = 'pelicula-drag';
    div.draggable = true;
    div.dataset.id = p.id;
    div.textContent = p.titulo;
    container.appendChild(div);
  });
}