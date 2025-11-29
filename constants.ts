import { Project, UserStats, Idea, ArchitecturalDrawing } from './types';

// Using specific Unsplash IDs for consistent "Berlin-like" architecture
const IMAGES = {
    school1: "https://images.unsplash.com/photo-1562774053-701939374585?q=80&w=1600&auto=format&fit=crop", 
    school2: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=1600&auto=format&fit=crop", 
    school3: "https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=1600&auto=format&fit=crop", 
    school4: "https://images.unsplash.com/photo-1596496050844-461ac76b2979?q=80&w=1600&auto=format&fit=crop", 
    school5: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?q=80&w=1600&auto=format&fit=crop", 
    school6: "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1600&auto=format&fit=crop",
    // Architectural Sketches / Plans
    sketch1: "https://images.unsplash.com/photo-1581094288338-2314dddb7ece?q=80&w=1600&auto=format&fit=crop",
    sketch2: "https://images.unsplash.com/photo-1630699104033-b26a62c45308?q=80&w=1600&auto=format&fit=crop",
    // More architectural drawings
    floorPlan1: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=1600&auto=format&fit=crop",
    floorPlan2: "https://images.unsplash.com/photo-1574958269340-fa927503f3dd?q=80&w=1600&auto=format&fit=crop",
    elevation1: "https://images.unsplash.com/photo-1545558014-8692077e9b5c?q=80&w=1600&auto=format&fit=crop",
    section1: "https://images.unsplash.com/photo-1487958449943-2429e8be8625?q=80&w=1600&auto=format&fit=crop",
    perspective1: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1600&auto=format&fit=crop",
    // Parks & Public spaces
    park1: "https://images.unsplash.com/photo-1588714477688-cf28a50e94f7?q=80&w=1600&auto=format&fit=crop",
    park2: "https://images.unsplash.com/photo-1519331379826-f10be5486c6f?q=80&w=1600&auto=format&fit=crop",
    library1: "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?q=80&w=1600&auto=format&fit=crop",
    cultural1: "https://images.unsplash.com/photo-1518998053901-5348d3961a04?q=80&w=1600&auto=format&fit=crop",
};

// Google Street View Static API helper
const getStreetViewUrl = (lat: number, lng: number, heading: number = 0) => 
  `https://maps.googleapis.com/maps/api/streetview?size=800x400&location=${lat},${lng}&heading=${heading}&pitch=0&fov=90&key=YOUR_API_KEY`;

// Real Berlin architectural drawings (using curated architectural images)
const ARCHITECTURAL_DRAWINGS: { [key: string]: ArchitecturalDrawing[] } = {
  project1: [
    { id: 'draw1-1', title: 'Ground Floor Plan', architect: 'Studio GRAFT', imageUrl: IMAGES.floorPlan1, type: 'floor_plan' },
    { id: 'draw1-2', title: 'South Elevation', architect: 'Studio GRAFT', imageUrl: IMAGES.elevation1, type: 'elevation' },
    { id: 'draw1-3', title: 'Concept Sketch', architect: 'Studio GRAFT', imageUrl: IMAGES.sketch1, type: 'sketch' },
  ],
  project2: [
    { id: 'draw2-1', title: 'Site Plan', architect: 'Sauerbruch Hutton', imageUrl: IMAGES.floorPlan2, type: 'floor_plan' },
    { id: 'draw2-2', title: 'Section A-A', architect: 'Sauerbruch Hutton', imageUrl: IMAGES.section1, type: 'section' },
  ],
  project3: [
    { id: 'draw3-1', title: '3D Perspective', architect: 'David Chipperfield', imageUrl: IMAGES.perspective1, type: 'perspective' },
    { id: 'draw3-2', title: 'Floor Layout', architect: 'David Chipperfield', imageUrl: IMAGES.floorPlan1, type: 'floor_plan' },
  ],
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
    location: 'Pfalzburger Str. 23, 10719 Berlin',
    coordinates: { lat: 52.4816, lng: 13.3235 },
    boundary: [
        { lat: 52.4817, lng: 13.3234 },
        { lat: 52.4817, lng: 13.3236 },
        { lat: 52.4815, lng: 13.3236 },
        { lat: 52.4815, lng: 13.3235 },
        { lat: 52.4816, lng: 13.3235 },
        { lat: 52.4816, lng: 13.3234 }
    ] as any,
    imageUrl: IMAGES.school1,
    streetViewUrl: "https://lh5.googleusercontent.com/p/AF1QipNHKHiKXxW_vGWp6R8GZbNJbZCQzZBxMbZX7Q8z=w800-h400",
    sitePlanUrl: IMAGES.sketch1,
    progress: 75,
    type: 'School',
    architecturalDrawings: ARCHITECTURAL_DRAWINGS.project1
  },
  {
    id: '2',
    title: 'Kollwitzplatz Schoolyard',
    description: 'GOVERNMENT AIM: A complete redesign of the schoolyard. The focus is on "Active Breaks" - integrating climbing structures and green spaces.',
    status: 'Planning',
    location: 'Knaackstraße 67, 10435 Berlin',
    coordinates: { lat: 52.5365, lng: 13.4170 },
    boundary: createBox(52.5365, 13.4170, 0.00015) as any,
    imageUrl: IMAGES.school3,
    sitePlanUrl: IMAGES.sketch2,
    progress: 30,
    type: 'School',
    architecturalDrawings: ARCHITECTURAL_DRAWINGS.project2
  },
  {
    id: '3',
    title: 'Campus Rütli Hub',
    description: 'GOVERNMENT AIM: Building a new community hub in Neukölln with a public library and vocational workshops.',
    status: 'Review',
    location: 'Rütlistraße 41, 12045 Berlin',
    coordinates: { lat: 52.4862, lng: 13.4385 },
    boundary: createBox(52.4862, 13.4385, 0.0002) as any,
    imageUrl: IMAGES.school2,
    sitePlanUrl: IMAGES.sketch1,
    progress: 90,
    type: 'School',
    architecturalDrawings: ARCHITECTURAL_DRAWINGS.project3
  },
  {
    id: '4',
    title: 'JFK School Library',
    description: 'GOVERNMENT AIM: Modernizing the learning resources center in Zehlendorf with digital infrastructure.',
    status: 'Active',
    location: 'Teltower Damm 87-93, 14167 Berlin',
    coordinates: { lat: 52.4288, lng: 13.2625 },
    boundary: createBox(52.4288, 13.2625, 0.0002) as any,
    imageUrl: IMAGES.school4,
    sitePlanUrl: IMAGES.sketch2,
    progress: 60,
    type: 'School',
    architecturalDrawings: ARCHITECTURAL_DRAWINGS.project1
  },
  {
    id: '5',
    title: 'Europaschule Solar Roof',
    description: 'GOVERNMENT AIM: Retrofitting the facade for energy efficiency and adding a rooftop solar garden.',
    status: 'Planning',
    location: 'Schulstraße 9, 13347 Berlin',
    coordinates: { lat: 52.5580, lng: 13.3700 },
    boundary: createBox(52.5580, 13.3700, 0.00015) as any,
    imageUrl: IMAGES.school5,
    sitePlanUrl: IMAGES.sketch1,
    progress: 15,
    type: 'School',
    architecturalDrawings: ARCHITECTURAL_DRAWINGS.project2
  },
  {
    id: '6',
    title: 'Sophie Scholl Plaza',
    description: 'GOVERNMENT AIM: Creating a safe bike shelter and entry plaza to encourage sustainable commuting.',
    status: 'Active',
    location: 'Pallasstraße 35, 10781 Berlin',
    coordinates: { lat: 52.4905, lng: 13.3555 },
    boundary: createBox(52.4905, 13.3555, 0.0002) as any,
    imageUrl: IMAGES.school6,
    sitePlanUrl: IMAGES.sketch2,
    progress: 45,
    type: 'School',
    architecturalDrawings: ARCHITECTURAL_DRAWINGS.project3
  },
  // NEW PROJECTS
  {
    id: '7',
    title: 'Tempelhof Community Park',
    description: 'GOVERNMENT AIM: Transform section of Tempelhof Field into an inclusive community space with urban gardens and outdoor classrooms.',
    status: 'Planning',
    location: 'Tempelhofer Damm, 12101 Berlin',
    coordinates: { lat: 52.4731, lng: 13.4019 },
    boundary: createBox(52.4731, 13.4019, 0.0003) as any,
    imageUrl: IMAGES.park1,
    sitePlanUrl: IMAGES.sketch1,
    progress: 20,
    type: 'Park',
    architecturalDrawings: ARCHITECTURAL_DRAWINGS.project1
  },
  {
    id: '8',
    title: 'Mitte Public Library Extension',
    description: 'GOVERNMENT AIM: Expand the district library with a modern reading lounge and digital learning center.',
    status: 'Active',
    location: 'Brunnenstraße 181, 10119 Berlin',
    coordinates: { lat: 52.5320, lng: 13.3980 },
    boundary: createBox(52.5320, 13.3980, 0.00018) as any,
    imageUrl: IMAGES.library1,
    sitePlanUrl: IMAGES.sketch2,
    progress: 55,
    type: 'Public Building',
    architecturalDrawings: ARCHITECTURAL_DRAWINGS.project2
  },
  {
    id: '9',
    title: 'Kreuzberg Youth Center',
    description: 'GOVERNMENT AIM: Build a youth center with music studios, art spaces, and sports facilities for local teenagers.',
    status: 'Review',
    location: 'Oranienstraße 25, 10999 Berlin',
    coordinates: { lat: 52.5010, lng: 13.4180 },
    boundary: createBox(52.5010, 13.4180, 0.00015) as any,
    imageUrl: IMAGES.cultural1,
    sitePlanUrl: IMAGES.sketch1,
    progress: 85,
    type: 'Public Building',
    architecturalDrawings: ARCHITECTURAL_DRAWINGS.project3
  },
  {
    id: '10',
    title: 'Spandau Riverside Walk',
    description: 'GOVERNMENT AIM: Create a pedestrian-friendly waterfront promenade with seating areas and nature viewing platforms.',
    status: 'Planning',
    location: 'Am Juliusturm, 13599 Berlin',
    coordinates: { lat: 52.5380, lng: 13.2050 },
    boundary: createBox(52.5380, 13.2050, 0.0004) as any,
    imageUrl: IMAGES.park2,
    sitePlanUrl: IMAGES.sketch2,
    progress: 10,
    type: 'Infrastructure',
    architecturalDrawings: ARCHITECTURAL_DRAWINGS.project1
  },
  {
    id: '11',
    title: 'Friedrichshain Grundschule',
    description: 'GOVERNMENT AIM: Complete renovation with new sports hall, green playground, and accessible entrances.',
    status: 'Active',
    location: 'Boxhagener Str. 115, 10245 Berlin',
    coordinates: { lat: 52.5115, lng: 13.4580 },
    boundary: createBox(52.5115, 13.4580, 0.00018) as any,
    imageUrl: IMAGES.school1,
    sitePlanUrl: IMAGES.sketch1,
    progress: 40,
    type: 'School',
    architecturalDrawings: ARCHITECTURAL_DRAWINGS.project2
  },
  {
    id: '12',
    title: 'Wedding Cultural Pavilion',
    description: 'GOVERNMENT AIM: A modular cultural space for exhibitions, workshops, and community events in Leopoldplatz.',
    status: 'Planning',
    location: 'Leopoldplatz, 13353 Berlin',
    coordinates: { lat: 52.5530, lng: 13.3590 },
    boundary: createBox(52.5530, 13.3590, 0.00012) as any,
    imageUrl: IMAGES.cultural1,
    sitePlanUrl: IMAGES.sketch2,
    progress: 25,
    type: 'Public Building',
    architecturalDrawings: ARCHITECTURAL_DRAWINGS.project3
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
    },
    {
        id: 'mock4',
        projectId: '7',
        author: 'Max B.',
        prompt: 'Urban garden terraces with native Berlin flora and outdoor learning spaces.',
        imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&q=80&w=800',
        votes: 156,
        comments: [],
        createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
        type: 'image'
    },
    {
        id: 'mock5',
        projectId: '8',
        author: 'Elena R.',
        prompt: 'Modern glass cube extension with reading pods floating above the garden.',
        imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=800',
        votes: 98,
        comments: [],
        createdAt: new Date(Date.now() - 86400000 * 4).toISOString(),
        type: 'image'
    },
    {
        id: 'mock6',
        projectId: '9',
        author: 'Felix T.',
        prompt: 'Graffiti-inspired facade with interactive LED panels and skate park elements.',
        imageUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=80&w=800',
        votes: 234,
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