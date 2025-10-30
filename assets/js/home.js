import EventsStore from './events.js';

function renderUpcomingEvents() {
  const list = document.querySelector('.events-list');
  if (!list) return;

  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  const upcoming = EventsStore.getAllEvents().filter(event => {
    const eventDate = new Date((event.date || '') + 'T00:00:00');
    return !Number.isNaN(eventDate.getTime()) && eventDate >= startOfToday;
  });

  list.innerHTML = '';

  if (upcoming.length === 0) {
    list.innerHTML = '<p>Aktuell sind keine Termine geplant. Schau bald wieder vorbei!</p>';
    return;
  }

  upcoming.slice(0, 5).forEach(event => {
    const eventDate = new Date((event.date || '') + 'T00:00:00');
    const item = document.createElement('article');
    item.className = 'event';
    item.innerHTML = `
      <h3>${event.title}</h3>
      <time datetime="${event.date}">${eventDate.toLocaleDateString('de-DE', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}${event.time ? ` · ${event.time} Uhr` : ''}</time>
      <div class="meta">${event.location || 'Ort wird noch bekannt gegeben'}</div>
      ${event.description ? `<p>${event.description}</p>` : ''}
    `;
    list.appendChild(item);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  renderUpcomingEvents();
});
