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

function setupJoinForm() {
  const form = document.querySelector('.join-form');
  if (!form) return;

  form.addEventListener('submit', event => {
    event.preventDefault();

    const formData = new FormData(form);
    const name = formData.get('name');

    form.reset();

    const message = document.createElement('p');
    message.className = 'success-message';
    message.textContent = name
      ? `${name}, vielen Dank für dein Interesse! Wir melden uns in Kürze.`
      : 'Vielen Dank für dein Interesse! Wir melden uns in Kürze.';

    const existingMessage = form.parentElement?.querySelector('.success-message');
    if (existingMessage) {
      existingMessage.replaceWith(message);
    } else {
      form.insertAdjacentElement('afterend', message);
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  renderUpcomingEvents();
  setupJoinForm();
});
