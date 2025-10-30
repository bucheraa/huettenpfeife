const DEFAULT_EVENTS = [
  {
    title: 'Sommerlicher Hüttenabend',
    date: '2024-07-12',
    time: '19:00',
    location: 'Berggasthaus Sonnenblick',
    description: 'Gemütlicher Austausch mit regionalen Spezialitäten und Musik.'
  },
  {
    title: 'Wanderung zum Sonnenaufgang',
    date: '2024-08-03',
    time: '05:30',
    location: 'Treffpunkt Parkplatz Talstation',
    description: 'Gemeinsame Tour zur Hochalm mit Frühstück auf der Hütte.'
  },
  {
    title: 'Stammtisch Spezial: Handwerkskunst',
    date: '2024-09-18',
    time: '19:30',
    location: 'Kulturstube Hüttenpfeife',
    description: 'Vortrag und Austausch zur traditionellen Holzschnitzerei.'
  }
];

const STORAGE_KEY = 'huettenpfeifeCustomEvents';

function getDateValue(dateString) {
  if (!dateString) return Number.POSITIVE_INFINITY;
  return new Date(dateString + 'T00:00:00').getTime();
}

const EventsStore = {
  getDefaultEvents() {
    return [...DEFAULT_EVENTS];
  },
  getCustomEvents() {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (!stored) return [];
      const events = JSON.parse(stored);
      return Array.isArray(events) ? events : [];
    } catch (error) {
      console.warn('Konnte gespeicherte Events nicht laden:', error);
      return [];
    }
  },
  saveCustomEvents(events) {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
  },
  addCustomEvent(event) {
    const events = EventsStore.getCustomEvents();
    events.push(event);
    EventsStore.saveCustomEvents(events);
    return events;
  },
  getAllEvents() {
    const events = [...EventsStore.getDefaultEvents(), ...EventsStore.getCustomEvents()];
    return events.sort((a, b) => getDateValue(a.date) - getDateValue(b.date));
  }
};

export default EventsStore;
