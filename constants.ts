import { Project, UserStats, Idea } from './types';

// Using specific Unsplash IDs for consistent "Berlin-like" architecture
const IMAGES = {
    school1: "https://images.unsplash.com/photo-1562774053-701939374585?q=80&w=1600&auto=format&fit=crop", 
    school2: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=1600&auto=format&fit=crop", 
    school3: "https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=1600&auto=format&fit=crop", 
    school4: "https://images.unsplash.com/photo-1596496050844-461ac76b2979?q=80&w=1600&auto=format&fit=crop", 
    school5: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?q=80&w=1600&auto=format&fit=crop", 
    school6: "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1600&auto=format&fit=crop",
    // Architectural Sketches / Plans
    sketch1: "https://images.unsplash.com/photo-1581094288338-2314dddb7ece?q=80&w=1600&auto=format&fit=crop", // Hand drawn plan
    sketch2: "https://images.unsplash.com/photo-1630699104033-b26a62c45308?q=80&w=1600&auto=format&fit=crop", // Sketch
};

// Helper for Google Maps Polygon path (Lat/Lng objects)
// Reduced scale factor significantly for realistic building footprints
const createBox = (lat: number, lng: number, size: number) => [
    { lat: lat + (size * 0.5), lng: lng - (size * 0.8) },
    { lat: lat + (size * 0.5), lng: lng + (size * 0.8) },
    { lat: lat - (size * 0.5), lng: lng + (size * 0.8) },
    { lat: lat - (size * 0.5), lng: lng - (size * 0.8) }
];

export const DESIGN_PRESETS = [
  { id: 'eco', label: '🌿 Eco-Sustainable', prompt: 'biophilic design, vertical gardens, sustainable timber, solar glass' },
  { id: 'playful', label: '🎈 Playful', prompt: 'colorful, rounded shapes, rubberized safety ground, interactive elements' },
  { id: 'mario', label: '🍄 Super Mario', prompt: 'nintendo style, warp pipes, question blocks, bright primary colors, fun architecture' },
  { id: 'anime', label: '⛩️ Anime Style', prompt: 'studio ghibli art style, lush detailed backgrounds, soft lighting, hand-painted aesthetic' },
  { id: 'dbz', label: '🔥 Dragon Ball', prompt: 'capsule corp architecture, futuristic domes, sleek rounded buildings, high tech' },
  { id: 'cyber', label: '🤖 Cyberpunk', prompt: 'neon lights, metallic surfaces, night time, futuristic berlin, high contrast' },
  { id: 'lego', label: '🧱 Lego', prompt: 'built entirely from lego bricks, vibrant, blocky texture, plastic rendering' },
  { id: 'bauhaus', label: '📐 Bauhaus', prompt: 'minimalist, functional, geometric shapes, concrete and glass, berlin classic' }
];

export const INITIAL_PROJECTS: Project[] = [
  {
    id: '1',
    title: 'Nelson Mandela School Extension',
    description: 'GOVERNMENT AIM: To expand the bilingual campus in Charlottenburg with a sustainable annex. The goal is to create flexible learning spaces.',
    status: 'Active',
    location: 'Pfalzburger Str., Berlin',
    // Realistic coordinates for Nelson Mandela School
    coordinates: { lat: 52.4816, lng: 13.3235 },
    // Realistic building footprint shape (L-shapeish) - Much tighter to the coordinate
    boundary: [
        { lat: 52.4817, lng: 13.3234 },
        { lat: 52.4817, lng: 13.3236 },
        { lat: 52.4815, lng: 13.3236 },
        { lat: 52.4815, lng: 13.3235 },
        { lat: 52.4816, lng: 13.3235 },
        { lat: 52.4816, lng: 13.3234 }
    ] as any, // Cast for Google Maps typing compatibility if needed
    imageUrl: IMAGES.school1,
    sitePlanUrl: IMAGES.sketch1,
    progress: 75,
    type: 'School'
  },
  {
    id: '2',
    title: 'Kollwitzplatz Schoolyard',
    description: 'GOVERNMENT AIM: A complete redesign of the schoolyard. The focus is on "Active Breaks" - integrating climbing structures.',
    status: 'Planning',
    location: 'Knaackstraße, Berlin',
    coordinates: { lat: 52.5365, lng: 13.4170 },
    boundary: createBox(52.5365, 13.4170, 0.00015) as any, // significantly smaller
    imageUrl: IMAGES.school3,
    sitePlanUrl: IMAGES.sketch2,
    progress: 30,
    type: 'School'
  },
  {
    id: '3',
    title: 'Campus Rütli Hub',
    description: 'GOVERNMENT AIM: Building a new community hub in Neukölln with a public library and vocational workshops.',
    status: 'Review',
    location: 'Rütli-Straße, Berlin',
    coordinates: { lat: 52.4862, lng: 13.4385 },
    boundary: createBox(52.4862, 13.4385, 0.0002) as any,
    imageUrl: IMAGES.school2,
    sitePlanUrl: IMAGES.sketch1,
    progress: 90,
    type: 'School'
  },
  {
    id: '4',
    title: 'JFK School Library',
    description: 'GOVERNMENT AIM: Modernizing the learning resources center in Zehlendorf.',
    status: 'Active',
    location: 'Teltower Damm, Berlin',
    coordinates: { lat: 52.4288, lng: 13.2625 },
    boundary: createBox(52.4288, 13.2625, 0.0002) as any,
    imageUrl: IMAGES.school4,
    sitePlanUrl: IMAGES.sketch2,
    progress: 60,
    type: 'School'
  },
  {
    id: '5',
    title: 'Europaschule Solar Roof',
    description: 'GOVERNMENT AIM: Retrofitting the facade for energy efficiency and adding a rooftop solar garden.',
    status: 'Planning',
    location: 'Schulstraße, Berlin',
    coordinates: { lat: 52.5180, lng: 13.4800 },
    boundary: createBox(52.5180, 13.4800, 0.00015) as any,
    imageUrl: IMAGES.school5,
    sitePlanUrl: IMAGES.sketch1,
    progress: 15,
    type: 'School'
  },
  {
    id: '6',
    title: 'Sophie Scholl Plaza',
    description: 'GOVERNMENT AIM: Creating a safe bike shelter and entry plaza to encourage sustainable commuting.',
    status: 'Active',
    location: 'Pallasstraße, Berlin',
    coordinates: { lat: 52.4905, lng: 13.3555 },
    boundary: createBox(52.4905, 13.3555, 0.0002) as any,
    imageUrl: IMAGES.school6,
    sitePlanUrl: IMAGES.sketch2,
    progress: 45,
    type: 'School'
  }
];

export const INITIAL_USER_STATS: UserStats = {
  rank: 'City Architect',
  points: 350,
  submissions: 12,
  votesReceived: 89,
  achievements: ['Berlin Builder', 'School Hero']
};

export const MOCK_EXISTING_IDEAS: Idea[] = [
    {
        id: 'mock1',
        projectId: '1',
        author: 'Anna S.',
        prompt: 'A glass walkway connecting the old building with the new annex, surrounded by cherry blossom trees.',
        imageUrl: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?auto=format&fit=crop&q=80&w=800',
        votes: 124,
        comments: [],
        createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
        type: 'image'
    },
    {
        id: 'mock2',
        projectId: '1',
        author: 'Lukas M.',
        prompt: 'Wooden facade with vertical gardens to match the park environment.',
        imageUrl: 'https://images.unsplash.com/photo-1511818966892-d7d671e672a2?auto=format&fit=crop&q=80&w=800',
        votes: 89,
        comments: [],
        createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
        type: 'image'
    },
    {
        id: 'mock3',
        projectId: '2',
        author: 'Sophie K.',
        prompt: 'Colorful rubber ground for safety with abstract climbing shapes.',
        imageUrl: 'https://images.unsplash.com/photo-1522008342704-6b265b543028?auto=format&fit=crop&q=80&w=800',
        votes: 45,
        comments: [],
        createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
        type: 'image'
    }
];

export const SAMPLE_COMMENTS = [
  "More trees for the playground please!",
  "Can we make the roof accessible for students?",
  "This fits the Berlin vibe perfectly.",
  "I like the safety features near the street."
];