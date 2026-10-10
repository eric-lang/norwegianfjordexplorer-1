export const categories = [
  { id: 'tromso', label: 'Tromsø' },
  { id: 'lofoten', label: 'Lofoten & Vesterålen' },
  { id: 'special', label: 'Special Cruises' },
  { id: 'charter', label: 'Charter' },
] as const;

// Draft category variations share the six card layouts and source photographs.
// Listed prices are reference values from Figma, not live booking quotes.
const cards = [
  { image: 'fjord-breakfast', alt: 'Breakfast beside the fjord aboard the explorer vessel', detail: '3 nights aboard', price: '1,250 NOK', euro: '€115' },
  { image: 'onboard-breakfast', alt: 'A freshly prepared breakfast with a view over the water', detail: 'Bed & breakfast', price: '1,250 NOK', euro: '€115' },
  { image: 'ship-at-night', alt: 'The illuminated explorer vessel moored at night', detail: '17:30 – 21:00', price: '1,250 NOK', euro: '€115' },
  { image: 'island-cruise', alt: 'A coastal boat cruising past a Norwegian island village', detail: 'An evening on the water', price: '1,250 NOK', euro: '€115' },
  { image: 'tromso-evening', alt: 'The classic explorer vessel alongside the waterfront after dark', detail: '09:00 – 12:00', price: '490 NOK', euro: '€45' },
  { image: 'explorer-ship', alt: 'The bow of the explorer vessel reflected in calm harbour water', detail: '09:30 – 14:30', price: '2,290 NOK', euro: '€210' },
];

const copy = {
  tromso: [
    ['Your fjordside stay in Tromsø', 'Wake up on the water, settle into life aboard, and explore the Arctic capital at your own pace.'],
    ['Arctic bed & breakfast', 'A cosy berth, breakfast with a view, and a relaxed start to your day in northern Norway.'],
    ['Northern lights & dinner cruise', 'Share a warm Arctic dinner as the city lights give way to the dark skies of the fjord.'],
    ['An evening dinner on the fjord', 'Slow down over locally inspired food and watch the coastline unfold from the dining room.'],
    ['Ersfjord in the blue hour', 'Discover a quieter side of the Arctic, framed by steep mountains and soft northern light.'],
    ['King crab cruise & lunch', 'Make a day of the fjord, hear stories from the crew, and enjoy a memorable king crab lunch.'],
  ],
  lofoten: [
    ['Lofoten Islander Package (3 nights)', 'Make the vessel your island base, with unhurried mornings and adventures on the doorstep.'],
    ['Svolvær bed & breakfast', 'Stay close to the harbour and begin each day with breakfast aboard our classic explorer.'],
    ['An Arctic evening in Vesterålen', 'Sail beneath big northern skies and linger over dinner as the islands slip into dusk.'],
    ['Svolvær to Henningsvær', 'Trade the road for the water and discover the fishing villages from a different perspective.'],
    ['A morning among the islands', 'Let the crew introduce you to sheltered harbours, mountain views, and life along the coast.'],
    ['A taste of the Lofoten coast', 'Bring together island scenery, time on the water, and a freshly prepared meal aboard.'],
  ],
  special: [
    ['A slow Arctic escape', 'A few days to switch off, enjoy the rhythm of the sea, and discover something unexpected.'],
    ['Breakfast beyond the harbour', 'Start your adventure with fresh food, good company, and the best seat beside the window.'],
    ['Under the northern lights', 'A warm vessel, a shared dinner, and a night looking towards the Arctic sky.'],
    ['Chasing the midnight sun', 'Spend a bright northern evening on deck as the coastline glows in the summer light.'],
    ['Polar stories on the fjord', 'Hear the stories of this coastline from the people who call it home.'],
    ['The king crab experience', 'A closer look at an Arctic favourite, with a cruise and a generous lunch to remember.'],
  ],
  charter: [
    ['Your own Arctic expedition', 'Bring your people, choose your pace, and plan a journey shaped around your group.'],
    ['A private stay on the water', 'Make the vessel your shared retreat, with comfortable berths and breakfast aboard.'],
    ['Dinner with a different view', 'Celebrate together over locally inspired food in the warmth of our onboard dining room.'],
    ['Islands, bikes & adventure', 'Build a coastal adventure around the places you want to explore and the activities you love.'],
    ['A gathering on the fjord', 'Bring colleagues or friends together for an occasion that goes beyond the everyday.'],
    ['Your coast. Your itinerary.', 'Talk with our team about a private cruise through Tromsø, Senja, Vesterålen, or Lofoten.'],
  ],
} satisfies Record<(typeof categories)[number]['id'], string[][]>;

export const experiences = categories.map((category) => ({
  ...category,
  cards: cards.map((card, index) => ({
    ...card,
    title: copy[category.id][index][0],
    description: copy[category.id][index][1],
    detail: category.id === 'charter' ? 'Designed around your group' : card.detail,
    price: category.id === 'charter' ? null : card.price,
    euro: category.id === 'charter' ? null : card.euro,
  })),
}));
