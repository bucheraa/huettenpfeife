import EventsStore from './events.js';

const monthLabel = document.getElementById('month-label');
const calendarGrid = document.querySelector('.calendar-grid');
const eventsList = document.querySelector('.event-list');
const eventForm = document.getElementById('event-form');

let currentDate = new Date();

const WEEKDAYS = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'];

function formatDateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function startOfMonth(date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function renderCalendar() {
  const start = startOfMonth(currentDate);
  const firstDayOfWeek = (start.getDay() + 6) % 7; // Monday as first day
  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();

  const prevMonthDays = firstDayOfWeek;
  const totalCells = Math.ceil((prevMonthDays + daysInMonth) / 7) * 7;

  const events = EventsStore.getAllEvents();
  calendarGrid.innerHTML = '';

  WEEKDAYS.forEach(label => {
    const dayName = document.createElement('div');
    dayName.className = 'day-name';
    dayName.textContent = label;
    calendarGrid.appendChild(dayName);
  });

  monthLabel.textContent = start.toLocaleDateString('de-DE', { month: 'long', year: 'numeric' });

  for (let cell = 0; cell < totalCells; cell++) {
    const dayElement = document.createElement('div');
    dayElement.className = 'day';
    const dayOffset = cell - prevMonthDays + 1;
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), dayOffset);

    const isCurrentMonth = date.getMonth() === currentDate.getMonth();
    if (!isCurrentMonth) {
      dayElement.classList.add('other-month');
    }

    const dateNumber = document.createElement('div');
    dateNumber.className = 'date-number';
    dateNumber.textContent = date.getDate();
    dayElement.appendChild(dateNumber);

    const dayEvents = events.filter(event => event.date === formatDateKey(date));
    dayEvents.slice(0, 3).forEach(() => {
      const dot = document.createElement('div');
      dot.className = 'event-dot';
      dayElement.appendChild(dot);
    });

    if (isCurrentMonth) {
      dayElement.addEventListener('click', () => highlightEvents(date));
      dayElement.tabIndex = 0;
      dayElement.setAttribute('role', 'button');
      dayElement.setAttribute('aria-label', `Events für den ${date.toLocaleDateString('de-DE')}`);
    }

    calendarGrid.appendChild(dayElement);
  }

  highlightEvents(currentDate);
}

function highlightEvents(date) {
  const events = EventsStore.getAllEvents().filter(event => event.date === formatDateKey(date));
  eventsList.innerHTML = '';

  if (events.length === 0) {
    eventsList.innerHTML = `<p>Keine Einträge für den ${date.toLocaleDateString('de-DE')}.</p>`;
    return;
  }

  events.forEach(event => {
    const item = document.createElement('article');
    item.className = 'event';
    item.innerHTML = `
      <strong>${event.title}</strong>
      <span>${event.time ? `${event.time} Uhr · ` : ''}${event.location || 'Ort folgt'}</span>
      ${event.description ? `<small>${event.description}</small>` : ''}
    `;
    eventsList.appendChild(item);
  });
}

function handleFormSubmit(event) {
  event.preventDefault();
  const formData = new FormData(event.target);
  const newEvent = {
    title: formData.get('title').trim(),
    date: formData.get('date'),
    time: formData.get('time'),
    location: formData.get('location').trim(),
    description: formData.get('description').trim()
  };

  if (!newEvent.title || !newEvent.date) {
    alert('Bitte gib mindestens einen Titel und ein Datum an.');
    return;
  }

  EventsStore.addCustomEvent(newEvent);
  event.target.reset();
  currentDate = new Date(newEvent.date + 'T00:00:00');
  renderCalendar();
  highlightEvents(new Date(newEvent.date + 'T00:00:00'));
}

document.getElementById('prev-month').addEventListener('click', () => {
  currentDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
  renderCalendar();
});

document.getElementById('next-month').addEventListener('click', () => {
  currentDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);
  renderCalendar();
});

if (eventForm) {
  eventForm.addEventListener('submit', handleFormSubmit);
}

renderCalendar();
