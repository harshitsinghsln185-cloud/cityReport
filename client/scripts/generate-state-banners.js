import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const outputDir = path.resolve(__dirname, '../public/states');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// 36 States and UTs with their specific landmark, region, and visual elements
const statesData = [
  { slug: 'karnataka', name: 'Karnataka', capital: 'Bengaluru', landmark: 'Vidhana Soudha & Hampi', theme: 'navy-gold', icon: 'dome' },
  { slug: 'tamil-nadu', name: 'Tamil Nadu', capital: 'Chennai', landmark: 'Meenakshi Temple & Shore Temple', theme: 'terracotta-gold', icon: 'gopuram' },
  { slug: 'telangana', name: 'Telangana', capital: 'Hyderabad', landmark: 'Charminar & Golconda Fort', theme: 'navy-gold', icon: 'charminar' },
  { slug: 'andhra-pradesh', name: 'Andhra Pradesh', capital: 'Amaravati', landmark: 'Tirumala Hills & Eastern Ghats', theme: 'emerald-gold', icon: 'temple' },
  { slug: 'kerala', name: 'Kerala', capital: 'Thiruvananthapuram', landmark: 'Alleppey Backwaters & Western Ghats', theme: 'emerald-teal', icon: 'boat' },
  { slug: 'maharashtra', name: 'Maharashtra', capital: 'Mumbai', landmark: 'Gateway of India & Sahyadri Range', theme: 'navy-gold', icon: 'gateway' },
  { slug: 'gujarat', name: 'Gujarat', capital: 'Gandhinagar', landmark: 'Statue of Unity & Sabarmati Riverfront', theme: 'gold-terracotta', icon: 'monument' },
  { slug: 'goa', name: 'Goa', capital: 'Panaji', landmark: 'Basilica of Bom Jesus & Arabian Coastline', theme: 'coastal-blue', icon: 'church' },
  { slug: 'uttar-pradesh', name: 'Uttar Pradesh', capital: 'Lucknow', landmark: 'Taj Mahal & Varanasi Ghats', theme: 'navy-gold', icon: 'taj' },
  { slug: 'rajasthan', name: 'Rajasthan', capital: 'Jaipur', landmark: 'Hawa Mahal & Amber Fort', theme: 'desert-gold', icon: 'fort' },
  { slug: 'punjab', name: 'Punjab', capital: 'Chandigarh', landmark: 'Golden Temple Sanctum', theme: 'gold-navy', icon: 'golden-temple' },
  { slug: 'haryana', name: 'Haryana', capital: 'Chandigarh', landmark: 'Surajkund & Urban Tech Corridors', theme: 'navy-slate', icon: 'skyline' },
  { slug: 'himachal-pradesh', name: 'Himachal Pradesh', capital: 'Shimla', landmark: 'Himalayan Ridge & Pine Valleys', theme: 'himalaya-blue', icon: 'mountains' },
  { slug: 'uttarakhand', name: 'Uttarakhand', capital: 'Dehradun', landmark: 'Rishikesh Laxman Jhula & Garhwal Peaks', theme: 'himalaya-teal', icon: 'bridge-mountains' },
  { slug: 'west-bengal', name: 'West Bengal', capital: 'Kolkata', landmark: 'Howrah Bridge & Victoria Memorial', theme: 'navy-gold', icon: 'howrah' },
  { slug: 'bihar', name: 'Bihar', capital: 'Patna', landmark: 'Mahabodhi Temple Spire, Bodh Gaya', theme: 'terracotta-gold', icon: 'spire' },
  { slug: 'odisha', name: 'Odisha', capital: 'Bhubaneswar', landmark: 'Konark Sun Temple Chariot Wheel', theme: 'gold-navy', icon: 'wheel' },
  { slug: 'jharkhand', name: 'Jharkhand', capital: 'Ranchi', landmark: 'Hundru Falls & Chota Nagpur Hills', theme: 'emerald-slate', icon: 'waterfall' },
  { slug: 'madhya-pradesh', name: 'Madhya Pradesh', capital: 'Bhopal', landmark: 'Sanchi Stupa Torana & Gwalior Fort', theme: 'gold-terracotta', icon: 'stupa' },
  { slug: 'chhattisgarh', name: 'Chhattisgarh', capital: 'Raipur', landmark: 'Chitrakote Horseshoe Falls & Sal Forests', theme: 'emerald-teal', icon: 'waterfall' },
  { slug: 'assam', name: 'Assam', capital: 'Dispur', landmark: 'Kaziranga Plains & Brahmaputra River', theme: 'emerald-gold', icon: 'river' },
  { slug: 'arunachal-pradesh', name: 'Arunachal Pradesh', capital: 'Itanagar', landmark: 'Tawang Monastery & Sela Pass', theme: 'himalaya-blue', icon: 'monastery' },
  { slug: 'manipur', name: 'Manipur', capital: 'Imphal', landmark: 'Loktak Lake & Floating Phumdis', theme: 'lake-blue', icon: 'lake' },
  { slug: 'meghalaya', name: 'Meghalaya', capital: 'Shillong', landmark: 'Living Root Bridges & Cherrapunji Cascades', theme: 'emerald-mist', icon: 'root-bridge' },
  { slug: 'mizoram', name: 'Mizoram', capital: 'Aizawl', landmark: 'Phawngpui Blue Mountain Ridges', theme: 'emerald-blue', icon: 'hills' },
  { slug: 'nagaland', name: 'Nagaland', capital: 'Kohima', landmark: 'Hornbill Kisama Heritage & Dzukou Valley', theme: 'terracotta-navy', icon: 'tribal' },
  { slug: 'tripura', name: 'Tripura', capital: 'Agartala', landmark: 'Ujjayanta Palace & Neermahal Water Palace', theme: 'navy-gold', icon: 'palace' },
  { slug: 'sikkim', name: 'Sikkim', capital: 'Gangtok', landmark: 'Mount Kanchenjunga & Rumtek Monastery', theme: 'himalaya-snow', icon: 'snow-peaks' },
  { slug: 'delhi', name: 'Delhi', capital: 'New Delhi', landmark: 'India Gate & National Secretariat', theme: 'navy-gold', icon: 'india-gate' },
  { slug: 'chandigarh', name: 'Chandigarh', capital: 'Chandigarh', landmark: 'Le Corbusier Open Hand Monument', theme: 'navy-slate', icon: 'open-hand' },
  { slug: 'jammu-and-kashmir', name: 'Jammu and Kashmir', capital: 'Srinagar / Jammu', landmark: 'Dal Lake Shikara & Pir Panjal Range', theme: 'himalaya-blue', icon: 'shikara' },
  { slug: 'ladakh', name: 'Ladakh', capital: 'Leh', landmark: 'Pangong Tso & High-Altitude Passes', theme: 'tibetan-blue', icon: 'mountain-pass' },
  { slug: 'puducherry', name: 'Puducherry', capital: 'Puducherry', landmark: 'French Quarter Promenade & Beach', theme: 'coastal-gold', icon: 'promenade' },
  { slug: 'andaman-and-nicobar-islands', name: 'Andaman and Nicobar Islands', capital: 'Port Blair', landmark: 'Cellular Jail & Radhanagar Coral Coast', theme: 'coral-teal', icon: 'islands' },
  { slug: 'dadra-and-nagar-haveli-and-daman-and-diu', name: 'Dadra and Nagar Haveli and Daman and Diu', capital: 'Daman', landmark: 'Historic Diu Fort & Coastal Ramparts', theme: 'coastal-navy', icon: 'sea-fort' },
  { slug: 'lakshadweep', name: 'Lakshadweep', capital: 'Kavaratti', landmark: 'Agatti Coral Lagoon & Turquoise Atolls', theme: 'lagoon-cyan', icon: 'atoll' },
];

function getThemeGradients(theme) {
  switch (theme) {
    case 'himalaya-blue':
    case 'himalaya-teal':
    case 'himalaya-snow':
    case 'tibetan-blue':
      return {
        bgTop: '#07162E',
        bgBottom: '#0A1F44',
        accent: '#38BDF8',
        gold: '#C8A24A',
        mountain: '#1E293B',
      };
    case 'emerald-teal':
    case 'emerald-gold':
    case 'emerald-mist':
    case 'emerald-blue':
    case 'emerald-slate':
      return {
        bgTop: '#061D15',
        bgBottom: '#0A1F44',
        accent: '#10B981',
        gold: '#C8A24A',
        mountain: '#0E392B',
      };
    case 'desert-gold':
    case 'terracotta-gold':
    case 'gold-terracotta':
    case 'terracotta-navy':
      return {
        bgTop: '#231408',
        bgBottom: '#0A1F44',
        accent: '#F59E0B',
        gold: '#C8A24A',
        mountain: '#3D220F',
      };
    case 'coastal-blue':
    case 'coastal-gold':
    case 'coral-teal':
    case 'lagoon-cyan':
    case 'lake-blue':
      return {
        bgTop: '#051E28',
        bgBottom: '#0A1F44',
        accent: '#06B6D4',
        gold: '#C8A24A',
        mountain: '#0F3846',
      };
    default:
      return {
        bgTop: '#06132B',
        bgBottom: '#0A1F44',
        accent: '#818CF8',
        gold: '#C8A24A',
        mountain: '#12306A',
      };
  }
}

function generateSvg(state) {
  const t = getThemeGradients(state.theme);

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 675" width="1200" height="675" fill="none">
  <defs>
    <!-- Sky Atmosphere Gradient -->
    <linearGradient id="skyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="${t.bgTop}" />
      <stop offset="65%" stop-color="${t.bgBottom}" />
      <stop offset="100%" stop-color="#0A1F44" />
    </linearGradient>

    <!-- Ambient Glow -->
    <radialGradient id="sunGlow" cx="50%" cy="40%" r="55%">
      <stop offset="0%" stop-color="${t.gold}" stop-opacity="0.25" />
      <stop offset="100%" stop-color="#0A1F44" stop-opacity="0" />
    </radialGradient>

    <!-- Dark Scrim for Pristine Text Readability -->
    <linearGradient id="readabilityScrim" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#0A1F44" stop-opacity="0.3" />
      <stop offset="50%" stop-color="#0A1F44" stop-opacity="0.75" />
      <stop offset="100%" stop-color="#0A1F44" stop-opacity="0.96" />
    </linearGradient>

    <!-- Structural Grid Pattern -->
    <pattern id="archGrid" width="60" height="60" patternUnits="userSpaceOnUse">
      <path d="M 60 0 L 0 0 0 60" fill="none" stroke="${t.gold}" stroke-width="0.75" stroke-opacity="0.12" />
    </pattern>
  </defs>

  <!-- Sky Canvas -->
  <rect width="1200" height="675" fill="url(#skyGrad)" />
  <rect width="1200" height="675" fill="url(#sunGlow)" />
  <rect width="1200" height="675" fill="url(#archGrid)" />

  <!-- Background Mountain / Horizon Silhouette -->
  <path d="M0 480 Q 250 420 500 460 T 1000 440 T 1200 470 L 1200 675 L 0 675 Z" fill="${t.mountain}" fill-opacity="0.6" />
  <path d="M0 520 Q 300 470 650 510 T 1200 500 L 1200 675 L 0 675 Z" fill="#0A1F44" fill-opacity="0.8" />

  <!-- Architectural Landmark Vector Silhouette (Center Foreground) -->
  <g transform="translate(600, 360)" text-anchor="middle">
    <!-- Base Platform -->
    <rect x="-240" y="80" width="480" height="12" rx="4" fill="${t.gold}" fill-opacity="0.5" />
    <rect x="-280" y="92" width="560" height="8" rx="2" fill="#0A1F44" />

    <!-- Landmark Silhouette Pillars & Grand Arch -->
    <path d="M-120 80 L-120 0 Q 0 -60 120 0 L 120 80 Z" fill="${t.mountain}" fill-opacity="0.85" />
    <path d="M-60 80 L-60 20 Q 0 -10 60 20 L 60 80 Z" fill="#06132B" />

    <!-- Iconic Central Finial / Dome Dome -->
    <circle cx="0" cy="-60" r="32" fill="${t.gold}" fill-opacity="0.7" />
    <polygon points="0,-110 -12,-60 12,-60" fill="${t.gold}" />

    <!-- Flanking Spires / Minarets -->
    <rect x="-190" y="-40" width="16" height="120" rx="3" fill="${t.mountain}" />
    <polygon points="-182,-70 -192,-40 -172,-40" fill="${t.gold}" fill-opacity="0.8" />

    <rect x="174" y="-40" width="16" height="120" rx="3" fill="${t.mountain}" />
    <polygon points="182,-70 172,-40 192,-40" fill="${t.gold}" fill-opacity="0.8" />
  </g>

  <!-- Star / Light Particles -->
  <circle cx="280" cy="140" r="2" fill="#FAF8F3" fill-opacity="0.6" />
  <circle cx="850" cy="110" r="2" fill="#FAF8F3" fill-opacity="0.6" />
  <circle cx="980" cy="190" r="2.5" fill="${t.gold}" fill-opacity="0.8" />
  <circle cx="150" cy="220" r="1.5" fill="#FAF8F3" fill-opacity="0.4" />
  <circle cx="420" cy="90" r="2" fill="${t.gold}" fill-opacity="0.7" />

  <!-- Overlay Readability Scrim (Ensures text placed over the hero is 100% readable) -->
  <rect width="1200" height="675" fill="url(#readabilityScrim)" />

  <!-- Landmark Meta Watermark in Bottom-Right -->
  <g transform="translate(1160, 635)" text-anchor="end">
    <text font-family="'Manrope Variable', sans-serif" font-size="12" font-weight="600" fill="#94A3B8" letter-spacing="0.5">
      Civic Landmark: <tspan fill="${t.gold}">${state.landmark}</tspan>
    </text>
    <text y="-18" font-family="'Fraunces Variable', Georgia, serif" font-size="16" font-weight="700" fill="#FAF8F3">
      ${state.name} • ${state.capital}
    </text>
  </g>
</svg>
`;
}

let generatedCount = 0;
for (const state of statesData) {
  const filePath = path.join(outputDir, `${state.slug}.svg`);
  fs.writeFileSync(filePath, generateSvg(state), 'utf-8');
  generatedCount++;
}

console.log(`[state-banners] Successfully generated ${generatedCount} cinematic state landmark SVGs in client/public/states/`);
