export type StateType = 'State' | 'Union Territory';
export type RegionType = 'North' | 'South' | 'East' | 'West' | 'Central' | 'Northeast';

export interface CivicPriority {
  title: string;
  description: string;
  urgency: 'Critical' | 'High' | 'Medium' | 'Low';
  category: string;
}

export interface StateFaq {
  question: string;
  answer: string;
}

export interface StateStats {
  activeResolvers: number;
  resolvedIssues: number;
  avgResponseHours: number;
  satisfactionRate: number;
}

export interface StateActivity {
  id: string;
  hazard: string;
  locality: string;
  timeAgo: string;
  status: string;
  amount: string;
}

export interface StateData {
  name: string;
  slug: string;
  type: StateType;
  capital: string;
  region: RegionType;
  population: string;
  area: string;
  districtsCount: number;
  heroBlurb: string;
  civicPriorities: CivicPriority[];
  stats: StateStats;
  faqs: StateFaq[];
  recentActivity: StateActivity[];
}

export const STATES_DATA: StateData[] = [
  // --- SOUTH (5 States) ---
  {
    name: 'Karnataka',
    slug: 'karnataka',
    type: 'State',
    capital: 'Bengaluru',
    region: 'South',
    population: '67.6 Million',
    area: '191,791 km²',
    districtsCount: 31,
    heroBlurb:
      'Coordinating rapid civic hazard remediation across BBMP wards, Silicon Corridor tech parks, and tier-2 district headquarters with verified photo proof.',
    civicPriorities: [
      {
        title: 'Arterial Road Pothole Sealing',
        description: 'Rapid asphalt resurfacing along ORR, Indiranagar, Whitefield, and Mysore Road freight corridors.',
        urgency: 'Critical',
        category: 'Road Resurfacing',
      },
      {
        title: 'Stormwater Culvert Unblocking',
        description: 'Pre-monsoon desilting and culvert reconstruction across Raja Kaluve feeder channels to prevent urban flash flooding.',
        urgency: 'High',
        category: 'Drainage Remediation',
      },
      {
        title: 'High-Density Street Lighting',
        description: 'Replacing defunct sodium vapor fixtures with intelligent LED units along peripheral ring roads.',
        urgency: 'Medium',
        category: 'Street Lighting',
      },
    ],
    stats: { activeResolvers: 248, resolvedIssues: 3840, avgResponseHours: 24, satisfactionRate: 98.7 },
    faqs: [
      {
        question: 'How fast are BBMP pothole reports dispatched to verified contractors in Bengaluru?',
        answer: 'Hazard coordinates logged in Bengaluru are matched to vetted ward contractors within 4 hours, with typical physical patching completed in 24-48 hours.',
      },
      {
        question: 'Does Crowd Report cover tier-2 cities like Mysuru, Hubballi, and Mangaluru?',
        answer: 'Yes, certified contractor networks are active across all 31 districts of Karnataka, including coastal and northern municipal corporations.',
      },
      {
        question: 'Can Apartment Resident Associations (RWAs) sponsor public road repairs in Karnataka?',
        answer: 'Yes, RWAs can fund local civic repairs via the 50% escrow gate, receiving an official municipal photo-proof audit and tax invoice on completion.',
      },
    ],
    recentActivity: [
      { id: 'KA-101', hazard: 'Deep asphalt pothole patch', locality: '100ft Rd, Indiranagar, Bengaluru', timeAgo: '2h ago', status: 'Photo Verified', amount: '₹14,500' },
      { id: 'KA-102', hazard: 'Collapsed drain grate replaced', locality: 'Jayalakshmipuram, Mysuru', timeAgo: '5h ago', status: 'Closed & Paid', amount: '₹6,200' },
      { id: 'KA-103', hazard: 'High-mast LED light repair', locality: 'Kadri Hills, Mangaluru', timeAgo: '8h ago', status: 'Advance Escrowed', amount: '₹4,800' },
    ],
  },
  {
    name: 'Tamil Nadu',
    slug: 'tamil-nadu',
    type: 'State',
    capital: 'Chennai',
    region: 'South',
    population: '76.8 Million',
    area: '130,058 km²',
    districtsCount: 38,
    heroBlurb:
      'Empowering residents across GCC zones, Coimbatore industrial belts, and Madurai historic quarters with transparent escrow-backed public repairs.',
    civicPriorities: [
      {
        title: 'Coastal Storm Drain Desilting',
        description: 'Clearing tidal storm drains and micro-canals across North Chennai and OMR coastal stretches before northeast monsoon swells.',
        urgency: 'Critical',
        category: 'Drainage Remediation',
      },
      {
        title: 'Water Pipe Rupture Remediation',
        description: 'Immediate restoration of pressurized Metrowater main line fissures to prevent potable water loss.',
        urgency: 'High',
        category: 'Water Infrastructure',
      },
      {
        title: 'Pedestrian Walkway Obstruction Removal',
        description: 'Repairing broken granite bollards and collapsed paver blocks along high-footfall metro feeder walkways.',
        urgency: 'Medium',
        category: 'Walkways & Pavements',
      },
    ],
    stats: { activeResolvers: 215, resolvedIssues: 3210, avgResponseHours: 26, satisfactionRate: 98.2 },
    faqs: [
      {
        question: 'How are Chennai monsoon waterlogging complaints prioritized?',
        answer: 'Drainage hazards reported with standing water over 6 inches are flagged as Critical, triggering emergency mobile dewatering units within 2 hours.',
      },
      {
        question: 'Are contractors certified under GCC (Greater Chennai Corporation) standards?',
        answer: 'All registered Tamil Nadu resolvers undergo verification of municipal contractor licenses and worker insurance before dispatch.',
      },
      {
        question: 'Is bilingual support available for Tamil Nadu public reports?',
        answer: 'Yes, public tracking codes, SMS alerts, and inspector receipts are accessible in both Tamil and English.',
      },
    ],
    recentActivity: [
      { id: 'TN-201', hazard: 'Replaced broken stormwater chamber lid', locality: 'T. Nagar, Chennai', timeAgo: '3h ago', status: 'Photo Verified', amount: '₹7,400' },
      { id: 'TN-202', hazard: 'Water supply line rupture seal', locality: 'Gandhipuram, Coimbatore', timeAgo: '6h ago', status: 'Inspector Approved', amount: '₹11,200' },
      { id: 'TN-203', hazard: 'Pedestrian walkway curb repair', locality: 'KK Nagar, Madurai', timeAgo: '9h ago', status: 'Closed & Paid', amount: '₹5,500' },
    ],
  },
  {
    name: 'Telangana',
    slug: 'telangana',
    type: 'State',
    capital: 'Hyderabad',
    region: 'South',
    population: '38.0 Million',
    area: '112,077 km²',
    districtsCount: 33,
    heroBlurb:
      'Facilitating fast, photo-verified civic resolutions across GHMC tech zones, Secunderabad cantonment roads, and expanding tier-2 municipalities.',
    civicPriorities: [
      {
        title: 'Open Manhole Securing',
        description: 'Replacing damaged or missing ductile iron manhole lids on cyber corridor flyovers and residential bylanes.',
        urgency: 'Critical',
        category: 'Public Safety',
      },
      {
        title: 'Overhead Electrical Cable Bundling',
        description: 'Removing dangling telecommunication cables and reinforcing sagging secondary distribution wires.',
        urgency: 'High',
        category: 'Electrical Safety',
      },
      {
        title: 'Lake Buffer Zone Waste Clearance',
        description: 'Removing illegal municipal debris dumping along waterbody shorelines in Durgam Cheruvu and Musi river basins.',
        urgency: 'Medium',
        category: 'Waste Clearance',
      },
    ],
    stats: { activeResolvers: 165, resolvedIssues: 2450, avgResponseHours: 22, satisfactionRate: 99.1 },
    faqs: [
      {
        question: 'How quickly are open manhole emergencies handled in Hyderabad?',
        answer: 'Open manholes trigger immediate automated alerts to municipal response teams and nearest certified resolvers, requiring temporary safety barricades within 60 minutes.',
      },
      {
        question: 'Does Crowd Report operate in Warangal and Nizamabad?',
        answer: 'Yes, resolver networks are active across all 33 Telangana districts with full geo-tagging support.',
      },
      {
        question: 'How are commercial and residential rate quotes determined?',
        answer: 'Rates follow the standard Telangana PWD SOR tables without arbitrary locality markups.',
      },
    ],
    recentActivity: [
      { id: 'TG-301', hazard: 'Cast-iron manhole cover installation', locality: 'HITEC City, Hyderabad', timeAgo: '1h ago', status: 'Photo Verified', amount: '₹8,600' },
      { id: 'TG-302', hazard: 'Dangling power cable bundling', locality: 'Hanamkonda, Warangal', timeAgo: '4h ago', status: 'Closed & Paid', amount: '₹3,900' },
      { id: 'TG-303', hazard: 'Construction debris removal from buffer', locality: 'Kompally, Medchal', timeAgo: '10h ago', status: 'Inspector Approved', amount: '₹9,400' },
    ],
  },
  {
    name: 'Andhra Pradesh',
    slug: 'andhra-pradesh',
    type: 'State',
    capital: 'Amaravati',
    region: 'South',
    population: '53.9 Million',
    area: '162,968 km²',
    districtsCount: 26,
    heroBlurb:
      'Connecting coastal ports, canal towns, and upland districts to certified local problem solvers with escrow-guaranteed quality.',
    civicPriorities: [
      {
        title: 'Canal Bank Soil Erosion Restabilization',
        description: 'Reinforcing vulnerable earthen irrigation bunds and road embankments in the Godavari-Krishna delta.',
        urgency: 'High',
        category: 'Civil Infrastructure',
      },
      {
        title: 'Cyclone Drainage Sump Restoration',
        description: 'Maintaining and clearing electrical backup pumps for storm sumps in Visakhapatnam coastal wards.',
        urgency: 'Critical',
        category: 'Drainage Remediation',
      },
      {
        title: 'Public Streetlight Pole Replacement',
        description: 'Replacing salt-corroded metallic streetlight columns with marine-grade composite poles.',
        urgency: 'Medium',
        category: 'Street Lighting',
      },
    ],
    stats: { activeResolvers: 140, resolvedIssues: 1980, avgResponseHours: 28, satisfactionRate: 97.9 },
    faqs: [
      {
        question: 'How are coastal infrastructure hazards managed during cyclone season in Andhra Pradesh?',
        answer: 'Emergency standby teams in Visakhapatnam, Kakinada, and Machilipatnam operate on 12-hour surge SLAs during meteorological warning windows.',
      },
      {
        question: 'Can gram panchayat residents file civic tickets?',
        answer: 'Yes, any citizen across all 26 districts can pinpoint rural road issues or broken water overhead points with GPS coordinates.',
      },
      {
        question: 'What payment modes are accepted for AP civic repair escrow?',
        answer: 'UPI, Net Banking, and corporate bank transfer are supported with instantaneous paise-exact escrow receipting.',
      },
    ],
    recentActivity: [
      { id: 'AP-401', hazard: 'Marine-grade pole electrical repair', locality: 'Beach Road, Visakhapatnam', timeAgo: '4h ago', status: 'Photo Verified', amount: '₹6,800' },
      { id: 'AP-402', hazard: 'Irrigation embankment stone pitch repair', locality: 'Bhimavaram, West Godavari', timeAgo: '7h ago', status: 'Inspector Approved', amount: '₹18,500' },
      { id: 'AP-403', hazard: 'Marketplace drainage clearance', locality: 'Governorpet, Vijayawada', timeAgo: '12h ago', status: 'Closed & Paid', amount: '₹4,200' },
    ],
  },
  {
    name: 'Kerala',
    slug: 'kerala',
    type: 'State',
    capital: 'Thiruvananthapuram',
    region: 'South',
    population: '35.8 Million',
    area: '38,863 km²',
    districtsCount: 14,
    heroBlurb:
      'Ensuring high civic environmental standards across coastal towns, midland plantations, and highland road corridors with verifiable photo documentation.',
    civicPriorities: [
      {
        title: 'Highland Hill Road Culvert Clearing',
        description: 'Preventing monsoon mudslides through rapid desilting of Western Ghats roadside runoff channels.',
        urgency: 'Critical',
        category: 'Disaster Prevention',
      },
      {
        title: 'Backwater Solid Waste Interception',
        description: 'Deploying floating barrier booms and rapid waste collection in Alappuzha and Kochi coastal canals.',
        urgency: 'High',
        category: 'Waste Clearance',
      },
      {
        title: 'Pedestrian Footbridge Structural Maintenance',
        description: 'Refurbishing rusted handrails and non-slip decking on municipal pedestrian footbridges.',
        urgency: 'Medium',
        category: 'Civil Infrastructure',
      },
    ],
    stats: { activeResolvers: 125, resolvedIssues: 1890, avgResponseHours: 20, satisfactionRate: 99.4 },
    faqs: [
      {
        question: 'How are monsoon landslide warnings linked to road repairs in Idukki and Wayanad?',
        answer: 'Hill district road hazard reports are cross-checked with State Disaster Management alerts to mobilize heavy machinery within 3 hours.',
      },
      {
        question: 'Are backwater canal contractors vetted for ecological compliance?',
        answer: 'Yes, resolvers operating in coastal regulation zones adhere to Kerala Pollution Control Board disposal standards.',
      },
      {
        question: 'Can panchayats access community audit dashboards?',
        answer: 'Panchayat officials have dedicated transparency logins to view Before/After photo records across their local wards.',
      },
    ],
    recentActivity: [
      { id: 'KL-501', hazard: 'Hillside runoff channel clearing', locality: 'Munnar Ghat Road, Idukki', timeAgo: '2h ago', status: 'Photo Verified', amount: '₹12,400' },
      { id: 'KL-502', hazard: 'Canal waste barrier debris clearing', locality: 'Panampilly Nagar, Kochi', timeAgo: '5h ago', status: 'Closed & Paid', amount: '₹7,800' },
      { id: 'KL-503', hazard: 'Broken handrail welding on footbridge', locality: 'East Fort, Thiruvananthapuram', timeAgo: '11h ago', status: 'Inspector Approved', amount: '₹5,100' },
    ],
  },

  // --- WEST (3 States) ---
  {
    name: 'Maharashtra',
    slug: 'maharashtra',
    type: 'State',
    capital: 'Mumbai',
    region: 'West',
    population: '126.4 Million',
    area: '307,713 km²',
    districtsCount: 36,
    heroBlurb:
      'High-velocity civic hazard resolution across BMC wards, Pune IT belts, Nagpur industrial zones, and Konkan coastal highways.',
    civicPriorities: [
      {
        title: 'Monsoon Flooding Manhole Desilting',
        description: 'Deep mechanical desilting of high-capacity storm outfalls across Dadar, Hindmata, and Milan subway catchments.',
        urgency: 'Critical',
        category: 'Drainage Remediation',
      },
      {
        title: 'Industrial Heavy-Vehicle Pothole Resurfacing',
        description: 'Mastic asphalt patching on high-traffic freight corridors in Bhiwandi, JNPT, and Chakan MIDC.',
        urgency: 'Critical',
        category: 'Road Resurfacing',
      },
      {
        title: 'Exposed Electrical Transformer Safeguarding',
        description: 'Installing non-conductive perimeter fencing around roadside power transformers in residential areas.',
        urgency: 'High',
        category: 'Electrical Safety',
      },
    ],
    stats: { activeResolvers: 320, resolvedIssues: 4620, avgResponseHours: 21, satisfactionRate: 98.5 },
    faqs: [
      {
        question: 'How does Crowd Report operate during Mumbai monsoon red alerts?',
        answer: 'During red alerts, emergency water pump and drain clearance work orders are dispatched with priority 2-hour SLAs backed by pre-authorized municipal contingency funds.',
      },
      {
        question: 'Are contractors certified under BMC or PMC standards?',
        answer: 'Yes, contractors hold verified trade registrations with municipal corporations and maintain valid PWD contractor classifications.',
      },
      {
        question: 'How do Mumbai commercial housing societies report boundary road hazards?',
        answer: 'Housing societies can report external approach road damage directly on our map and fund repairs using the 50% escrow guarantee.',
      },
    ],
    recentActivity: [
      { id: 'MH-601', hazard: 'Emergency storm culvert unblocking', locality: 'Hindmata, Dadar, Mumbai', timeAgo: '1h ago', status: 'Photo Verified', amount: '₹18,200' },
      { id: 'MH-602', hazard: 'High-density asphalt road patch', locality: 'Hinjewadi Phase 1, Pune', timeAgo: '4h ago', status: 'Closed & Paid', amount: '₹16,400' },
      { id: 'MH-603', hazard: 'Transformer perimeter safety gate', locality: 'Dharampeth, Nagpur', timeAgo: '7h ago', status: 'Inspector Approved', amount: '₹8,900' },
    ],
  },
  {
    name: 'Gujarat',
    slug: 'gujarat',
    type: 'State',
    capital: 'Gandhinagar',
    region: 'West',
    population: '70.4 Million',
    area: '196,024 km²',
    districtsCount: 33,
    heroBlurb:
      'Powering civic infrastructure excellence across AMC Ahmedabad, Surat diamond corridors, Vadodara chemical zones, and Rajkot engineering hubs.',
    civicPriorities: [
      {
        title: 'BRTS Corridor Barrier Maintenance',
        description: 'Replacing damaged safety crash barriers and signal sensors along Bus Rapid Transit corridors.',
        urgency: 'High',
        category: 'Traffic Infrastructure',
      },
      {
        title: 'Industrial Effluent Pipe Leakage Response',
        description: 'Emergency containment and pipeline sealing for municipal wastewater junctions near industrial estates.',
        urgency: 'Critical',
        category: 'Water Infrastructure',
      },
      {
        title: 'Solar High-Mast Pole Maintenance',
        description: 'Cleaning PV arrays and replacing faulty inverters on public square lighting infrastructure.',
        urgency: 'Medium',
        category: 'Street Lighting',
      },
    ],
    stats: { activeResolvers: 195, resolvedIssues: 2890, avgResponseHours: 23, satisfactionRate: 98.9 },
    faqs: [
      {
        question: 'How are industrial hazard reports verified in Gujarat GIDC estates?',
        answer: 'Effluent and toxic hazard reports require specialized certified hazmat contractors and include air/water quality sensor checks before sign-off.',
      },
      {
        question: 'Can municipal councillors inspect contractor submissions in real time?',
        answer: 'Yes, local corporators and ward inspectors receive portal access to all live tickets in their jurisdiction.',
      },
      {
        question: 'What is the average resolution time for street lighting tickets in Ahmedabad?',
        answer: 'Public streetlight outages in Ahmedabad are resolved within an average of 18 hours.',
      },
    ],
    recentActivity: [
      { id: 'GJ-701', hazard: 'BRTS dedicated lane barrier repair', locality: 'Shivranjani, Ahmedabad', timeAgo: '3h ago', status: 'Photo Verified', amount: '₹9,800' },
      { id: 'GJ-702', hazard: 'Water distribution line valve replacement', locality: 'Adajan, Surat', timeAgo: '6h ago', status: 'Closed & Paid', amount: '₹14,100' },
      { id: 'GJ-703', hazard: 'Solar streetlight battery bank servicing', locality: 'Alkapuri, Vadodara', timeAgo: '9h ago', status: 'Inspector Approved', amount: '₹6,400' },
    ],
  },
  {
    name: 'Goa',
    slug: 'goa',
    type: 'State',
    capital: 'Panaji',
    region: 'West',
    population: '1.58 Million',
    area: '3,702 km²',
    districtsCount: 2,
    heroBlurb:
      'Preserving pristine coastal village charm, historic Latin quarters, and beach access corridors with rapid community-backed civic maintenance.',
    civicPriorities: [
      {
        title: 'Beach Promenade Paver Restabilization',
        description: 'Repairing sea-eroded pedestrian pathways and promenade railings along tourist-heavy coastal promenades.',
        urgency: 'High',
        category: 'Walkways & Pavements',
      },
      {
        title: 'Monsoon Tree Branch Pruning & Cable Clearance',
        description: 'Clearing dangerously leaning coconut and banyan limbs away from overhead power lines.',
        urgency: 'Critical',
        category: 'Public Safety',
      },
      {
        title: 'Heritage Street Fixture Restoration',
        description: 'Maintaining cast-iron vintage streetlights in Fontainhas and historic church squares.',
        urgency: 'Medium',
        category: 'Street Lighting',
      },
    ],
    stats: { activeResolvers: 48, resolvedIssues: 740, avgResponseHours: 19, satisfactionRate: 99.2 },
    faqs: [
      {
        question: 'How quickly are coastal fallen tree hazards handled after coastal squalls?',
        answer: 'Emergency chain-saw and electrical isolation teams respond within 90 minutes of weather-related hazard logging.',
      },
      {
        question: 'Does Crowd Report cover both North Goa and South Goa districts?',
        answer: 'Yes, full coverage is available from Pernem to Canacona across both municipal councils and village panchayats.',
      },
      {
        question: 'Can boutique hotels and local businesses sponsor beach access path repairs?',
        answer: 'Yes, private entities can fund municipal public path restorations through our compliant escrow platform.',
      },
    ],
    recentActivity: [
      { id: 'GA-801', hazard: 'Heritage lantern restoration', locality: 'Fontainhas, Panaji', timeAgo: '2h ago', status: 'Photo Verified', amount: '₹4,800' },
      { id: 'GA-802', hazard: 'Overhead line tree limb pruning', locality: 'Calangute Main Road, North Goa', timeAgo: '5h ago', status: 'Closed & Paid', amount: '₹3,500' },
      { id: 'GA-803', hazard: 'Pedestrian boardwalk plank replacement', locality: 'Colva Beach, South Goa', timeAgo: '8h ago', status: 'Inspector Approved', amount: '₹6,200' },
    ],
  },

  // --- NORTH (6 States) ---
  {
    name: 'Uttar Pradesh',
    slug: 'uttar-pradesh',
    type: 'State',
    capital: 'Lucknow',
    region: 'North',
    population: '241.0 Million',
    area: '240,928 km²',
    districtsCount: 75,
    heroBlurb:
      'Massive scale civic coordination across Lucknow heritage boulevards, Noida IT hubs, Kanpur industrial belts, and Varanasi ghat corridors.',
    civicPriorities: [
      {
        title: 'Heavy Traffic Highway Pothole Repair',
        description: 'Industrial cold-mix asphalt patching on expressways and commercial arterial connectors.',
        urgency: 'Critical',
        category: 'Road Resurfacing',
      },
      {
        title: 'Public Sanitation Drain Unclogging',
        description: 'Clearing silted masonry drains in high-density urban old city markets.',
        urgency: 'High',
        category: 'Drainage Remediation',
      },
      {
        title: 'Rural Electrification Pole Straightening',
        description: 'Securing leaning tension poles and re-anchoring guy-wires across peri-urban roadways.',
        urgency: 'Medium',
        category: 'Electrical Safety',
      },
    ],
    stats: { activeResolvers: 380, resolvedIssues: 5410, avgResponseHours: 30, satisfactionRate: 97.4 },
    faqs: [
      {
        question: 'How does Crowd Report manage contractor dispatch across 75 districts in UP?',
        answer: 'The system uses GPS radius clustering (within 25 km) to match tickets to localized Nagar Nigam registered contractors.',
      },
      {
        question: 'Can residents track repairs on religious pilgrimage corridors in Varanasi or Ayodhya?',
        answer: 'Yes, special heritage and pilgrimage zones have dedicated inspection workflows with photo-proof archival.',
      },
      {
        question: 'Are quotes verified against the official UP PWD schedule of rates?',
        answer: 'All quotes adhere to UP PWD standard rate schedules with integer-paise precision and no arbitrary markups.',
      },
    ],
    recentActivity: [
      { id: 'UP-901', hazard: 'Highway connector pothole patching', locality: 'Gomti Nagar Extension, Lucknow', timeAgo: '2h ago', status: 'Photo Verified', amount: '₹16,500' },
      { id: 'UP-902', hazard: 'Market sewer line desilting', locality: 'Civil Lines, Kanpur', timeAgo: '6h ago', status: 'Closed & Paid', amount: '₹9,800' },
      { id: 'UP-903', hazard: 'Roadside high-voltage transformer barrier', locality: 'Sector 62, Noida', timeAgo: '10h ago', status: 'Inspector Approved', amount: '₹8,200' },
    ],
  },
  {
    name: 'Rajasthan',
    slug: 'rajasthan',
    type: 'State',
    capital: 'Jaipur',
    region: 'North',
    population: '81.0 Million',
    area: '342,239 km²',
    districtsCount: 50,
    heroBlurb:
      'Resolving civic hazards across Jaipur heritage zones, Jodhpur desert corridors, Udaipur tourist lakes, and Kota coaching avenues.',
    civicPriorities: [
      {
        title: 'Desert Sand Ingress Highway Clearing',
        description: 'Removing windblown sand drifts and repairing guard rails on western state highways.',
        urgency: 'High',
        category: 'Road Resurfacing',
      },
      {
        title: 'Potable Water Pipeline Burst Repair',
        description: 'Rapid repair of major water transfer conduits in arid and semi-arid urban centers.',
        urgency: 'Critical',
        category: 'Water Infrastructure',
      },
      {
        title: 'Heritage Facade Streetlight Wiring',
        description: 'Concealed conduit repair on heritage pink sandstone street facade illumination.',
        urgency: 'Medium',
        category: 'Street Lighting',
      },
    ],
    stats: { activeResolvers: 175, resolvedIssues: 2640, avgResponseHours: 27, satisfactionRate: 98.1 },
    faqs: [
      {
        question: 'How are water pipeline leaks prioritized in water-scarce zones like Jodhpur and Bikaner?',
        answer: 'Potable water pipeline ruptures receive Critical triage, triggering certified repair crews within 2 hours to avoid critical wastage.',
      },
      {
        question: 'Does Crowd Report support the new administrative districts created in Rajasthan?',
        answer: 'Yes, all 50 updated administrative districts are fully mapped into our geo-dispatch directory.',
      },
      {
        question: 'Are heritage conservation guidelines enforced during Jaipur Old City street repairs?',
        answer: 'Yes, contractors working within heritage boundaries must use approved materials that preserve architectural integrity.',
      },
    ],
    recentActivity: [
      { id: 'RJ-1001', hazard: 'Water trunk main crack welded', locality: 'Vaishali Nagar, Jaipur', timeAgo: '3h ago', status: 'Photo Verified', amount: '₹13,400' },
      { id: 'RJ-1002', hazard: 'Heritage street lamp rewiring', locality: 'Ghanta Ghar, Jodhpur', timeAgo: '7h ago', status: 'Closed & Paid', amount: '₹4,900' },
      { id: 'RJ-1003', hazard: 'Sand drift clearance on highway shoulder', locality: 'Barmer Bypass, Western Corridor', timeAgo: '11h ago', status: 'Inspector Approved', amount: '₹11,000' },
    ],
  },
  {
    name: 'Punjab',
    slug: 'punjab',
    type: 'State',
    capital: 'Chandigarh',
    region: 'North',
    population: '30.5 Million',
    area: '50,362 km²',
    districtsCount: 23,
    heroBlurb:
      'Upgrading civic infrastructure across Ludhiana industrial corridors, Amritsar heritage approaches, and Jalandhar sports manufacturing zones.',
    civicPriorities: [
      {
        title: 'Industrial Estate Drainage Overflow',
        description: 'Mechanical clearing of factory effluent runoff drains in Focal Point Ludhiana.',
        urgency: 'Critical',
        category: 'Drainage Remediation',
      },
      {
        title: 'Agricultural Freight Road Resurfacing',
        description: 'Repairing heavy-load agricultural produce transport roads connecting grain mandis.',
        urgency: 'High',
        category: 'Road Resurfacing',
      },
      {
        title: 'Overhead Street Lighting Upgrades',
        description: 'Replacing non-functional lighting poles on national highway service roads.',
        urgency: 'Medium',
        category: 'Street Lighting',
      },
    ],
    stats: { activeResolvers: 110, resolvedIssues: 1670, avgResponseHours: 24, satisfactionRate: 98.3 },
    faqs: [
      {
        question: 'How are mandi approach roads repaired during harvest seasons?',
        answer: 'Prior to wheat and paddy procurement seasons, mandi access roads have expedited 24-hour turnaround commitments.',
      },
      {
        question: 'Are contractors certified under Punjab Municipal Act regulations?',
        answer: 'Yes, all active resolvers hold valid municipal contractor verification and commercial liability coverage.',
      },
      {
        question: 'Is Punjabi language tracking available for citizen queries?',
        answer: 'Yes, automated SMS updates and receipt summaries can be generated in Punjabi.',
      },
    ],
    recentActivity: [
      { id: 'PB-1101', hazard: 'Focal Point industrial drain unblocking', locality: 'Focal Point Phase V, Ludhiana', timeAgo: '4h ago', status: 'Photo Verified', amount: '₹12,800' },
      { id: 'PB-1102', hazard: 'Grain market approach road resurfacing', locality: 'Mandi Road, Khanna', timeAgo: '8h ago', status: 'Closed & Paid', amount: '₹18,200' },
      { id: 'PB-1103', hazard: 'Heritage corridor streetlamp replacement', locality: 'Heritage Walk, Amritsar', timeAgo: '12h ago', status: 'Inspector Approved', amount: '₹5,400' },
    ],
  },
  {
    name: 'Haryana',
    slug: 'haryana',
    type: 'State',
    capital: 'Chandigarh',
    region: 'North',
    population: '28.9 Million',
    area: '44,212 km²',
    districtsCount: 22,
    heroBlurb:
      'Fast-track civic resolutions across Gurugram cyber parks, Faridabad manufacturing belts, and Panipat industrial zones.',
    civicPriorities: [
      {
        title: 'Cyber City Expressway Pothole Patching',
        description: 'Rapid nighttime mastic asphalt resurfacing on high-speed flyovers and Golf Course Road.',
        urgency: 'Critical',
        category: 'Road Resurfacing',
      },
      {
        title: 'Monsoon Underpass Waterlogging Prevention',
        description: 'Installing and servicing high-output submersible drainage pumps in vulnerable underpasses.',
        urgency: 'Critical',
        category: 'Drainage Remediation',
      },
      {
        title: 'Open Construction Dust Barrier Enforcement',
        description: 'Installing civic safety netting and clearing uncontained roadside construction dust piles.',
        urgency: 'Medium',
        category: 'Public Safety',
      },
    ],
    stats: { activeResolvers: 145, resolvedIssues: 2190, avgResponseHours: 20, satisfactionRate: 99.0 },
    faqs: [
      {
        question: 'How quickly are Gurugram expressway pothole complaints resolved?',
        answer: 'Major arterial road hazards logged in Gurugram are scheduled for overnight repair within 12-24 hours to prevent commute disruptions.',
      },
      {
        question: 'Can corporate parks or RWAs book group remediation work in Faridabad?',
        answer: 'Yes, commercial complexes can trigger multi-hazard work orders under escrow with single-invoice GST settlement.',
      },
      {
        question: 'Who verifies the Before and After photo proof in Haryana?',
        answer: 'Municipal engineers from MCG, MCF, or HSVP review photos and coordinate timestamps before releasing final escrow funds.',
      },
    ],
    recentActivity: [
      { id: 'HR-1201', hazard: 'Golf Course Extension road pothole repair', locality: 'Sector 56, Gurugram', timeAgo: '2h ago', status: 'Photo Verified', amount: '₹15,400' },
      { id: 'HR-1202', hazard: 'Submersible underpass pump servicing', locality: 'Neelam Flyover, Faridabad', timeAgo: '5h ago', status: 'Closed & Paid', amount: '₹8,900' },
      { id: 'HR-1203', hazard: 'Commercial dust barrier installation', locality: 'IMT Manesar', timeAgo: '9h ago', status: 'Inspector Approved', amount: '₹7,200' },
    ],
  },
  {
    name: 'Himachal Pradesh',
    slug: 'himachal-pradesh',
    type: 'State',
    capital: 'Shimla',
    region: 'North',
    population: '7.5 Million',
    area: '55,673 km²',
    districtsCount: 12,
    heroBlurb:
      'Mountain infrastructure protection across Shimla ridge slopes, Manali tourist corridors, and Dharamshala valley roads.',
    civicPriorities: [
      {
        title: 'Hill Road Landslide Debris Clearing',
        description: 'Clearing loose rockfall and installing wire-mesh retaining gabions along cliffside curves.',
        urgency: 'Critical',
        category: 'Civil Infrastructure',
      },
      {
        title: 'Sub-Zero Water Pipeline Insulation',
        description: 'Replacing frozen or burst potable water piping with insulated HDPE piping.',
        urgency: 'High',
        category: 'Water Infrastructure',
      },
      {
        title: 'Timber Footbridge Walkway Repair',
        description: 'Replacing rotted timber floorboards and reinforcing anti-slip wire mesh on walking paths.',
        urgency: 'Medium',
        category: 'Walkways & Pavements',
      },
    ],
    stats: { activeResolvers: 65, resolvedIssues: 920, avgResponseHours: 22, satisfactionRate: 99.3 },
    faqs: [
      {
        question: 'How are emergency rockfalls and landslides prioritized in Himachal?',
        answer: 'Road blockages on state and national highways trigger immediate dispatch of earthmovers within 60 minutes.',
      },
      {
        question: 'Are winter freezing issues handled in high-altitude zones like Spiti and Kinnaur?',
        answer: 'Specialized thermal insulation contractors are deployed to prevent chronic pipeline freezing.',
      },
      {
        question: 'Can remote village residents report hazards without high-speed internet?',
        answer: 'Yes, reports can be filed offline in our mobile app and automatically synchronize when network connectivity resumes.',
      },
    ],
    recentActivity: [
      { id: 'HP-1301', hazard: 'Rockfall gabion barrier installation', locality: 'Kalka-Shimla Highway, Solan', timeAgo: '3h ago', status: 'Photo Verified', amount: '₹22,000' },
      { id: 'HP-1302', hazard: 'Insulated pipeline burst repair', locality: 'Mall Road, Shimla', timeAgo: '6h ago', status: 'Closed & Paid', amount: '₹9,400' },
      { id: 'HP-1303', hazard: 'Wooden footbridge rail reinforcement', locality: 'Old Manali, Kullu', timeAgo: '10h ago', status: 'Inspector Approved', amount: '₹6,100' },
    ],
  },
  {
    name: 'Uttarakhand',
    slug: 'uttarakhand',
    type: 'State',
    capital: 'Dehradun',
    region: 'North',
    population: '11.5 Million',
    area: '53,483 km²',
    districtsCount: 13,
    heroBlurb:
      'Protecting Char Dham pilgrimage routes, Dehradun residential valleys, and Haridwar riverfront ghats with responsive civic repair.',
    civicPriorities: [
      {
        title: 'Pilgrimage Route Slope Stabilization',
        description: 'Restoring retaining walls and concrete parapets along mountain road shoulders.',
        urgency: 'Critical',
        category: 'Civil Infrastructure',
      },
      {
        title: 'Riverfront Ghat Paver Restoration',
        description: 'Repairing flood-damaged non-slip sandstone steps and safety chains along Ganga ghats.',
        urgency: 'High',
        category: 'Walkways & Pavements',
      },
      {
        title: 'Urban Valley Drainage Clearing',
        description: 'Preventing flash flood overflows in Dehradun seasonal seasonal rivulets (Rispana and Bindal).',
        urgency: 'Medium',
        category: 'Drainage Remediation',
      },
    ],
    stats: { activeResolvers: 80, resolvedIssues: 1140, avgResponseHours: 25, satisfactionRate: 98.8 },
    faqs: [
      {
        question: 'How are road hazards handled along the Char Dham highway during monsoon?',
        answer: 'Pilgrimage highways maintain dedicated standby road-clearing teams with 24/7 monitoring and direct disaster portal integration.',
      },
      {
        question: 'Does Crowd Report cover high-altitude border districts like Chamoli and Pithoragarh?',
        answer: 'Yes, certified local contractors are onboarded across all 13 hill districts of Uttarakhand.',
      },
      {
        question: 'How is environmental compliance monitored in sensitive Himalayan zones?',
        answer: 'All contractors must dispose of construction rubble in designated municipal dump sites outside forest boundaries.',
      },
    ],
    recentActivity: [
      { id: 'UK-1401', hazard: 'Retaining parapet wall rebuilding', locality: 'Rishikesh-Badrinath Hwy, Chamoli', timeAgo: '4h ago', status: 'Photo Verified', amount: '₹26,500' },
      { id: 'UK-1402', hazard: 'Ganga ghat safety chain replacement', locality: 'Har Ki Pauri, Haridwar', timeAgo: '7h ago', status: 'Closed & Paid', amount: '₹5,800' },
      { id: 'UK-1403', hazard: 'Seasonal rivulet storm drain cleaning', locality: 'Rajpur Road, Dehradun', timeAgo: '11h ago', status: 'Inspector Approved', amount: '₹8,200' },
    ],
  },

  // --- EAST (4 States) ---
  {
    name: 'West Bengal',
    slug: 'west-bengal',
    type: 'State',
    capital: 'Kolkata',
    region: 'East',
    population: '99.1 Million',
    area: '88,752 km²',
    districtsCount: 23,
    heroBlurb:
      'Serving historic KMC Kolkata neighborhoods, Salt Lake tech zones, Siliguri transit corridors, and Sundarban coastal embankments.',
    civicPriorities: [
      {
        title: 'Tram Line Asphalt Pothole Sealing',
        description: 'Resurfacing worn road sections adjacent to legacy street tram tracks in Central and North Kolkata.',
        urgency: 'Critical',
        category: 'Road Resurfacing',
      },
      {
        title: 'Heritage Streetlight Cable Rewiring',
        description: 'Restoring antique cast-iron street lamps in colonial precincts and park promenades.',
        urgency: 'Medium',
        category: 'Street Lighting',
      },
      {
        title: 'Tidal Sluice Gate Drainage Desilting',
        description: 'Mechanical clearing of silted lock-gates in East Kolkata wetlands and canal outfalls.',
        urgency: 'High',
        category: 'Drainage Remediation',
      },
    ],
    stats: { activeResolvers: 230, resolvedIssues: 3340, avgResponseHours: 25, satisfactionRate: 97.8 },
    faqs: [
      {
        question: 'How are road repairs managed around active tram tracks in Kolkata?',
        answer: 'Contractors use specialized cold-mix and rubberized asphalt compounds formulated to bond cleanly against steel tram tracks.',
      },
      {
        question: 'Are KMC and KMDA ward boundaries integrated into ticket dispatch?',
        answer: 'Yes, tickets auto-assign to the precise borough and ward jurisdiction with municipal engineer notification.',
      },
      {
        question: 'Can residents in North Bengal (Siliguri, Darjeeling, Jalpaiguri) report issues?',
        answer: 'Yes, full coverage is active across all 23 districts from the Himalayas to the Bay of Bengal.',
      },
    ],
    recentActivity: [
      { id: 'WB-1501', hazard: 'Tram-line adjacent road resurfacing', locality: 'College Street, Kolkata', timeAgo: '2h ago', status: 'Photo Verified', amount: '₹14,200' },
      { id: 'WB-1502', hazard: 'Canal sluice gate silt clearing', locality: 'Salt Lake Sector V, Kolkata', timeAgo: '6h ago', status: 'Closed & Paid', amount: '₹9,600' },
      { id: 'WB-1503', hazard: 'Tea garden approach road culvert repair', locality: 'Sevoke Road, Siliguri', timeAgo: '9h ago', status: 'Inspector Approved', amount: '₹18,000' },
    ],
  },
  {
    name: 'Bihar',
    slug: 'bihar',
    type: 'State',
    capital: 'Patna',
    region: 'East',
    population: '128.5 Million',
    area: '94,163 km²',
    districtsCount: 38,
    heroBlurb:
      'Empowering citizen accountability across Patna riverfront wards, Gaya heritage routes, Muzaffarpur commercial hubs, and Bhagalpur silk districts.',
    civicPriorities: [
      {
        title: 'Monsoon Flood Drain Channeling',
        description: 'Dredging urban drainage networks across Patna to avoid recurring monsoon waterlogging.',
        urgency: 'Critical',
        category: 'Drainage Remediation',
      },
      {
        title: 'Inter-District Highway Pothole Repair',
        description: 'Heavy vehicle asphalt patching along agricultural produce transport routes.',
        urgency: 'High',
        category: 'Road Resurfacing',
      },
      {
        title: 'Public Hand-Pump & Borewell Restoration',
        description: 'Replacing cracked seals and concrete aprons around municipal drinking water hand pumps.',
        urgency: 'Medium',
        category: 'Water Infrastructure',
      },
    ],
    stats: { activeResolvers: 190, resolvedIssues: 2750, avgResponseHours: 29, satisfactionRate: 97.2 },
    faqs: [
      {
        question: 'How are drinking water hand-pump repairs handled in rural Bihar?',
        answer: 'Hand-pump repair requests are routed to certified local mechanics who carry replacement brass valves and certified chlorination kits.',
      },
      {
        question: 'Does Crowd Report provide status updates via SMS in Bihar?',
        answer: 'Yes, citizens receive SMS notifications in Hindi at every milestone from assignment to completion.',
      },
      {
        question: 'Can panchayat development funds be tracked through the platform?',
        answer: 'Public projects funded through civic escrow show complete itemized labor and material receipts.',
      },
    ],
    recentActivity: [
      { id: 'BR-1601', hazard: 'Silt dredging on urban outfall', locality: 'Boring Road, Patna', timeAgo: '3h ago', status: 'Photo Verified', amount: '₹11,500' },
      { id: 'BR-1602', hazard: 'Community handpump cylinder overhaul', locality: 'Bodh Gaya, Gaya', timeAgo: '7h ago', status: 'Closed & Paid', amount: '₹3,200' },
      { id: 'BR-1603', hazard: 'Freight highway road shoulder patch', locality: 'Maripur, Muzaffarpur', timeAgo: '11h ago', status: 'Inspector Approved', amount: '₹15,800' },
    ],
  },
  {
    name: 'Odisha',
    slug: 'odisha',
    type: 'State',
    capital: 'Bhubaneswar',
    region: 'East',
    population: '47.0 Million',
    area: '155,707 km²',
    districtsCount: 30,
    heroBlurb:
      'Supporting smart city infrastructure in Bhubaneswar, coastal cyclone-resilience in Puri, and mining road stability in Rourkela.',
    civicPriorities: [
      {
        title: 'Cyclone-Resilient Electrical Cable Re-anchoring',
        description: 'Replacing fragile overhead lines with underground ducts and storm-proof aerial bunched cables.',
        urgency: 'Critical',
        category: 'Electrical Safety',
      },
      {
        title: 'Coastal Storm Surfacing & Drain Clearing',
        description: 'Maintaining unobstructed drainage channels in Puri, Paradeep, and Gopalpur ports.',
        urgency: 'High',
        category: 'Drainage Remediation',
      },
      {
        title: 'Smart City Solar Streetlight Maintenance',
        description: 'Servicing central LED controllers and photovoltaic panels in Bhubaneswar and Cuttack.',
        urgency: 'Medium',
        category: 'Street Lighting',
      },
    ],
    stats: { activeResolvers: 135, resolvedIssues: 1980, avgResponseHours: 24, satisfactionRate: 98.6 },
    faqs: [
      {
        question: 'How does Odisha handle pre-cyclone preventive civic maintenance?',
        answer: 'Before forecasted storm events, emergency work orders trigger tree trimming and drain opening across coastal blocks.',
      },
      {
        question: 'Are Bhubaneswar Smart City sensors integrated with Crowd Report?',
        answer: 'Yes, public open sensor feeds for waterlogging and traffic light faults automatically log tickets in our system.',
      },
      {
        question: 'Is Odia language support provided for state tickets?',
        answer: 'Yes, SMS alerts, citizen notifications, and contractor briefs are available in Odia.',
      },
    ],
    recentActivity: [
      { id: 'OD-1701', hazard: 'Underground conduit power repair', locality: 'Saheed Nagar, Bhubaneswar', timeAgo: '3h ago', status: 'Photo Verified', amount: '₹8,400' },
      { id: 'OD-1702', hazard: 'Grand Road storm culvert clearing', locality: 'Bada Danda, Puri', timeAgo: '6h ago', status: 'Closed & Paid', amount: '₹7,100' },
      { id: 'OD-1703', hazard: 'Industrial corridor streetlight overhaul', locality: 'Civil Township, Rourkela', timeAgo: '10h ago', status: 'Inspector Approved', amount: '₹5,900' },
    ],
  },
  {
    name: 'Jharkhand',
    slug: 'jharkhand',
    type: 'State',
    capital: 'Ranchi',
    region: 'East',
    population: '39.5 Million',
    area: '79,714 km²',
    districtsCount: 24,
    heroBlurb:
      'Coordinating road, bridge, and environmental safety across Ranchi plateau avenues, Jamshedpur industrial sectors, and Dhanbad mining towns.',
    civicPriorities: [
      {
        title: 'Mining Corridor Heavy Freight Potholes',
        description: 'Reinforced concrete and asphalt resurfacing on roads subject to high-tonnage coal and mineral transport.',
        urgency: 'Critical',
        category: 'Road Resurfacing',
      },
      {
        title: 'Plateau Stormwater Runoff Culverts',
        description: 'Constructing stone-pitched masonry culverts along hill slopes to prevent road washouts.',
        urgency: 'High',
        category: 'Civil Infrastructure',
      },
      {
        title: 'Industrial Township Street Lighting',
        description: 'Replacing damaged high-mast lamps in Jamshedpur and Bokaro residential zones.',
        urgency: 'Medium',
        category: 'Street Lighting',
      },
    ],
    stats: { activeResolvers: 95, resolvedIssues: 1420, avgResponseHours: 27, satisfactionRate: 97.6 },
    faqs: [
      {
        question: 'How are high-wear mining roads repaired in Dhanbad and Bokaro?',
        answer: 'Contractors use reinforced concrete pavements and high-density aggregate mixes engineered for 40-tonne axle loads.',
      },
      {
        question: 'Does Crowd Report coordinate with JUSCO/Tata Steel Utilities in Jamshedpur?',
        answer: 'Yes, tickets in managed industrial townships interface with designated private utility service teams.',
      },
      {
        question: 'Are rural tribal block issues handled across Jharkhand?',
        answer: 'Yes, geo-location mapping allows reporters to pinpoint issues on state highways across all 24 districts.',
      },
    ],
    recentActivity: [
      { id: 'JH-1801', hazard: 'Heavy-tonnage road asphalt patch', locality: 'Main Road, Dhanbad', timeAgo: '4h ago', status: 'Photo Verified', amount: '₹19,500' },
      { id: 'JH-1802', hazard: 'Plateau culvert retaining wall repair', locality: 'Kanke Road, Ranchi', timeAgo: '8h ago', status: 'Closed & Paid', amount: '₹13,200' },
      { id: 'JH-1803', hazard: 'Township streetlamp electrical servicing', locality: 'Bistupur, Jamshedpur', timeAgo: '12h ago', status: 'Inspector Approved', amount: '₹4,800' },
    ],
  },

  // --- CENTRAL (2 States) ---
  {
    name: 'Madhya Pradesh',
    slug: 'madhya-pradesh',
    type: 'State',
    capital: 'Bhopal',
    region: 'Central',
    population: '86.5 Million',
    area: '308,245 km²',
    districtsCount: 55,
    heroBlurb:
      'Upholding Indore national cleanliness benchmarks, Bhopal lake protection standards, and Jabalpur-Gwalior civic maintenance.',
    civicPriorities: [
      {
        title: 'Zero-Waste Municipal Litter Containment',
        description: 'Rapid removal and sanitation remediation of accidental roadside waste accumulation in tier-1 cities.',
        urgency: 'Critical',
        category: 'Waste Clearance',
      },
      {
        title: 'Lake Catchment Drainage Sump Maintenance',
        description: 'Preventing raw sewage inflow into Upper Lake Bhopal via rapid valve and pipe remediation.',
        urgency: 'High',
        category: 'Water Infrastructure',
      },
      {
        title: 'Heritage Gwalior Street Fixture Care',
        description: 'Preserving decorative street lamps and sandstone bollards in historical districts.',
        urgency: 'Medium',
        category: 'Street Lighting',
      },
    ],
    stats: { activeResolvers: 210, resolvedIssues: 3120, avgResponseHours: 21, satisfactionRate: 99.2 },
    faqs: [
      {
        question: 'Why does Madhya Pradesh have the highest satisfaction ratings for cleanliness issues?',
        answer: 'Rapid integration with Indore Smart City sanitation protocols ensures litter reports are cleared within an average of 4 hours.',
      },
      {
        question: 'Are lake buffer zone regulations enforced in Bhopal?',
        answer: 'Yes, reports near Bhopal Upper and Lower Lakes trigger priority ecological inspection before contractor clearance.',
      },
      {
        question: 'How do citizens in Gwalior and Ujjain track civic quotes?',
        answer: 'Citizens can inspect itemized quotes with full tax breakdown and 50% escrow guarantee directly in the app.',
      },
    ],
    recentActivity: [
      { id: 'MP-1901', hazard: 'Roadside commercial waste rapid clearance', locality: 'Chhappan Dukan, Indore', timeAgo: '1h ago', status: 'Photo Verified', amount: '₹3,200' },
      { id: 'MP-1902', hazard: 'Sewage diversion pipe repair near lake', locality: 'VIP Road, Bhopal', timeAgo: '4h ago', status: 'Closed & Paid', amount: '₹14,500' },
      { id: 'MP-1903', hazard: 'Heritage decorative lamp bracket repair', locality: 'Lashkar, Gwalior', timeAgo: '8h ago', status: 'Inspector Approved', amount: '₹5,200' },
    ],
  },
  {
    name: 'Chhattisgarh',
    slug: 'chhattisgarh',
    type: 'State',
    capital: 'Raipur',
    region: 'Central',
    population: '30.1 Million',
    area: '135,192 km²',
    districtsCount: 33,
    heroBlurb:
      'Delivering civic reliability across Nava Raipur smart corridors, Bhilai steel city sectors, and Bilaspur rail logistics hubs.',
    civicPriorities: [
      {
        title: 'Heavy Industrial Access Road Maintenance',
        description: 'Repairing rutted asphalt and cracked cement concrete slabs along steel plant feeder roads.',
        urgency: 'High',
        category: 'Road Resurfacing',
      },
      {
        title: 'Monsoon Overflow Culvert Cleaning',
        description: 'Dredging agricultural drainage culverts along state highway junctions.',
        urgency: 'Medium',
        category: 'Drainage Remediation',
      },
      {
        title: 'Public Borewell Submersible Pump Replacement',
        description: 'Restoring drinking water supply in peri-urban wards through rapid pump rewiring.',
        urgency: 'Critical',
        category: 'Water Infrastructure',
      },
    ],
    stats: { activeResolvers: 85, resolvedIssues: 1210, avgResponseHours: 26, satisfactionRate: 98.0 },
    faqs: [
      {
        question: 'Does Crowd Report operate in Nava Raipur Smart City?',
        answer: 'Yes, modern underground duct and sensor infrastructure in Nava Raipur is fully mapped for quick contractor dispatch.',
      },
      {
        question: 'How are drinking water emergencies prioritized in rural blocks?',
        answer: 'Dry borewell and broken handpump reports are categorized as Critical, dispatching pump technicians within 12 hours.',
      },
      {
        question: 'What contractors are eligible to work on Bhilai industrial perimeter roads?',
        answer: 'Only contractors holding factory safety certifications and industrial insurance are assigned to plant feeder roads.',
      },
    ],
    recentActivity: [
      { id: 'CG-2001', hazard: 'Drinking water borewell motor replacement', locality: 'Telibandha, Raipur', timeAgo: '3h ago', status: 'Photo Verified', amount: '₹8,500' },
      { id: 'CG-2002', hazard: 'Industrial feeder road concrete slab repair', locality: 'Sector 6, Bhilai', timeAgo: '7h ago', status: 'Closed & Paid', amount: '₹21,000' },
      { id: 'CG-2003', hazard: 'Highway stormwater culvert desilting', locality: 'Vyapar Vihar, Bilaspur', timeAgo: '11h ago', status: 'Inspector Approved', amount: '₹6,400' },
    ],
  },

  // --- NORTHEAST (8 States) ---
  {
    name: 'Assam',
    slug: 'assam',
    type: 'State',
    capital: 'Dispur',
    region: 'Northeast',
    population: '36.5 Million',
    area: '78,438 km²',
    districtsCount: 35,
    heroBlurb:
      'Safeguarding Brahmaputra riverfront communities, Guwahati hillsides, and Dibrugarh oil corridors with responsive public maintenance.',
    civicPriorities: [
      {
        title: 'Brahmaputra Flood Embankment Erosion Armor',
        description: 'Deploying geo-synthetic sand bags and boulder pitching along vulnerable river embankment stretches.',
        urgency: 'Critical',
        category: 'Civil Infrastructure',
      },
      {
        title: 'Hillside Drainage Flash Flood Clearing',
        description: 'Clearing silted hillside drains in Guwahati (Zoo Road, Bharalu river basin) to prevent urban flash flooding.',
        urgency: 'Critical',
        category: 'Drainage Remediation',
      },
      {
        title: 'Highway Fog High-Visibility Signage',
        description: 'Installing reflective solar studs and repainting road lane markers for winter highway safety.',
        urgency: 'Medium',
        category: 'Traffic Infrastructure',
      },
    ],
    stats: { activeResolvers: 115, resolvedIssues: 1640, avgResponseHours: 24, satisfactionRate: 98.4 },
    faqs: [
      {
        question: 'How are flood emergency repairs handled during Assam monsoon floods?',
        answer: 'Embankment leaks and compromised floodwalls are prioritized in our system with emergency notification to district disaster authorities.',
      },
      {
        question: 'Does Crowd Report support tickets in Assamese and Bengali?',
        answer: 'Yes, multilingual ticket logging and automated SMS updates are provided in Assamese, Bengali, and English.',
      },
      {
        question: 'Are tea garden approach roads covered under our contractor network?',
        answer: 'Yes, local contractors are onboarded across Dibrugarh, Tinsukia, and Jorhat tea belts.',
      },
    ],
    recentActivity: [
      { id: 'AS-2101', hazard: 'Bharalu river feeder drain desilting', locality: 'GS Road, Guwahati', timeAgo: '2h ago', status: 'Photo Verified', amount: '₹9,800' },
      { id: 'AS-2102', hazard: 'Riverbank boulder rip-rap repair', locality: 'Brahmaputra Bank, Dibrugarh', timeAgo: '6h ago', status: 'Closed & Paid', amount: '₹24,000' },
      { id: 'AS-2103', hazard: 'Highway solar reflective stud installation', locality: 'Jorhat Bypass', timeAgo: '10h ago', status: 'Inspector Approved', amount: '₹5,200' },
    ],
  },
  {
    name: 'Arunachal Pradesh',
    slug: 'arunachal-pradesh',
    type: 'State',
    capital: 'Itanagar',
    region: 'Northeast',
    population: '1.57 Million',
    area: '83,743 km²',
    districtsCount: 26,
    heroBlurb:
      'Maintaining critical frontier connectivity across eastern Himalayan passes, Itanagar valley roads, and remote valley river crossings.',
    civicPriorities: [
      {
        title: 'Himalayan Landslide Road Clearance',
        description: 'Deploying heavy machinery to clear rockfall on vital border highway arteries.',
        urgency: 'Critical',
        category: 'Civil Infrastructure',
      },
      {
        title: 'Bailey Bridge Timber Deck Replacement',
        description: 'Restoring worn structural timber decking on mountain river crossings.',
        urgency: 'High',
        category: 'Civil Infrastructure',
      },
      {
        title: 'Solar Village Micro-Grid Street Lighting',
        description: 'Repairing remote solar street lighting poles and battery backup modules.',
        urgency: 'Medium',
        category: 'Street Lighting',
      },
    ],
    stats: { activeResolvers: 35, resolvedIssues: 410, avgResponseHours: 28, satisfactionRate: 98.9 },
    faqs: [
      {
        question: 'How are remote mountain road landslides handled in Arunachal?',
        answer: 'Emergency tickets dispatch designated road clearing contractors equipped with track loaders and rock breakers within 2 hours.',
      },
      {
        question: 'Does the system work in areas with low mobile connectivity?',
        answer: 'Yes, the mobile app caches photo proof with timestamp and geo-location offline, syncing as soon as satellite or tower data connects.',
      },
      {
        question: 'Can village councils (Gaon Burahs) verify completed work?',
        answer: 'Yes, traditional village heads can review physical proof before signing off on public escrow releases.',
      },
    ],
    recentActivity: [
      { id: 'AR-2201', hazard: 'Rockfall clearing on mountain pass', locality: 'Bhalukpong-Bomdila Hwy, West Kameng', timeAgo: '4h ago', status: 'Photo Verified', amount: '₹31,000' },
      { id: 'AR-2202', hazard: 'Bailey bridge timber plank replacement', locality: 'Papum Pare Crossing, Itanagar', timeAgo: '8h ago', status: 'Closed & Paid', amount: '₹16,500' },
      { id: 'AR-2203', hazard: 'Solar village streetlight servicing', locality: 'Ziro Valley, Lower Subansiri', timeAgo: '12h ago', status: 'Inspector Approved', amount: '₹4,900' },
    ],
  },
  {
    name: 'Manipur',
    slug: 'manipur',
    type: 'State',
    capital: 'Imphal',
    region: 'Northeast',
    population: '3.2 Million',
    area: '22,327 km²',
    districtsCount: 16,
    heroBlurb:
      'Serving civic remediation across Imphal valley avenues, Loktak Lake shores, and essential highway transit corridors.',
    civicPriorities: [
      {
        title: 'National Highway Lifeline Pothole Repair',
        description: 'Maintaining smooth transit on NH-2 and NH-37 lifeline corridors for essential goods.',
        urgency: 'Critical',
        category: 'Road Resurfacing',
      },
      {
        title: 'Loktak Lake Perimeter Sanitation',
        description: 'Clearing solid waste and preventing runoff contamination near wetland habitats.',
        urgency: 'High',
        category: 'Waste Clearance',
      },
      {
        title: 'Municipal Market Electric Meter Safety',
        description: 'Insulating exposed distribution boards in traditional Ima Keithel markets.',
        urgency: 'Medium',
        category: 'Electrical Safety',
      },
    ],
    stats: { activeResolvers: 42, resolvedIssues: 530, avgResponseHours: 26, satisfactionRate: 97.5 },
    faqs: [
      {
        question: 'How are essential supply highway repairs expedited in Manipur?',
        answer: 'NH-2 and NH-37 road defects receive high-priority contractor assignment with rapid escrow disbursement upon inspection.',
      },
      {
        question: 'Are market vendor associations involved in Imphal municipal tickets?',
        answer: 'Yes, women market leaders at Ima Keithel can log and verify safety and sanitation tickets directly.',
      },
      {
        question: 'Does the platform support Meitei Mayek script?',
        answer: 'Yes, interface notifications and ticket summaries support Meitei Mayek rendering.',
      },
    ],
    recentActivity: [
      { id: 'MN-2301', hazard: 'Lifeline highway asphalt patch', locality: 'NH-2 Kangpokpi-Imphal Stretch', timeAgo: '3h ago', status: 'Photo Verified', amount: '₹17,800' },
      { id: 'MN-2302', hazard: 'Marketplace electric distribution box seal', locality: 'Ima Keithel, Imphal', timeAgo: '7h ago', status: 'Closed & Paid', amount: '₹4,200' },
      { id: 'MN-2303', hazard: 'Wetland drainage barrier maintenance', locality: 'Sendra, Loktak Lake', timeAgo: '11h ago', status: 'Inspector Approved', amount: '₹8,500' },
    ],
  },
  {
    name: 'Meghalaya',
    slug: 'meghalaya',
    type: 'State',
    capital: 'Shillong',
    region: 'Northeast',
    population: '3.3 Million',
    area: '22,429 km²',
    districtsCount: 12,
    heroBlurb:
      'Protecting rain-drenched hill roads, scenic gorges, and Shillong urban neighborhoods from erosion and drainage blockages.',
    civicPriorities: [
      {
        title: 'High-Rainfall Erosion Barrier Construction',
        description: 'Reinforcing roadside channels in the Cherrapunji and Mawsynram high-precipitation belts.',
        urgency: 'Critical',
        category: 'Civil Infrastructure',
      },
      {
        title: 'Shillong Pine Forest Road Lighting',
        description: 'Installing moisture-resistant fog-penetrating LED fixtures along misty ridge roads.',
        urgency: 'Medium',
        category: 'Street Lighting',
      },
      {
        title: 'Stream Water Pipeline Anti-Rust Maintenance',
        description: 'Replacing corroded steel pipes with food-grade plastic piping in hill settlements.',
        urgency: 'High',
        category: 'Water Infrastructure',
      },
    ],
    stats: { activeResolvers: 45, resolvedIssues: 580, avgResponseHours: 23, satisfactionRate: 98.7 },
    faqs: [
      {
        question: 'How do materials withstand the intense monsoon rainfall in Meghalaya?',
        answer: 'All roadway and drainage repairs use polymer-modified binders and marine epoxy coatings tested for extreme humidity.',
      },
      {
        question: 'Does Crowd Report cover both Khasi and Garo hill regions?',
        answer: 'Yes, certified local contractors are active in East Khasi Hills, West Garo Hills, and Jaintia Hills.',
      },
      {
        question: 'How are traditional village durbars engaged in the verification process?',
        answer: 'Local Dorbar Shnong village councils receive verification copies of Before/After photographic records.',
      },
    ],
    recentActivity: [
      { id: 'ML-2401', hazard: 'High-rainfall channel stone lining', locality: 'Mawkdok Bridge Road, Sohra', timeAgo: '3h ago', status: 'Photo Verified', amount: '₹19,200' },
      { id: 'ML-2402', hazard: 'Moisture-proof LED street fixture overhaul', locality: 'Laitumkhrah, Shillong', timeAgo: '6h ago', status: 'Closed & Paid', amount: '₹5,600' },
      { id: 'ML-2403', hazard: 'Springwater conduit pipeline seal', locality: 'Araimile, Tura', timeAgo: '10h ago', status: 'Inspector Approved', amount: '₹7,400' },
    ],
  },
  {
    name: 'Mizoram',
    slug: 'mizoram',
    type: 'State',
    capital: 'Aizawl',
    region: 'Northeast',
    population: '1.25 Million',
    area: '21,081 km²',
    districtsCount: 11,
    heroBlurb:
      'Community-led civic excellence across ridge-top Aizawl streets, mountain passes, and border trading routes.',
    civicPriorities: [
      {
        title: 'Steep Gradient Road Step Maintenance',
        description: 'Restoring public concrete walking staircases connecting vertical neighborhoods in Aizawl.',
        urgency: 'Critical',
        category: 'Walkways & Pavements',
      },
      {
        title: 'Monsoon Silt Retaining Wall Repair',
        description: 'Rebuilding stone retaining walls on vulnerable slope cuts to prevent foundation subsidence.',
        urgency: 'High',
        category: 'Civil Infrastructure',
      },
      {
        title: 'Rainwater Harvesting Tank Sanitation',
        description: 'Cleaning and sealing public community gravity rainwater reservoirs.',
        urgency: 'Medium',
        category: 'Water Infrastructure',
      },
    ],
    stats: { activeResolvers: 32, resolvedIssues: 420, avgResponseHours: 20, satisfactionRate: 99.5 },
    faqs: [
      {
        question: 'How are vertical pedestrian staircases maintained in Aizawl?',
        answer: 'Because of steep ridge topography, public stairs serve as primary commute arteries and receive priority safety inspections.',
      },
      {
        question: 'Is the Young Mizo Association (YMA) involved in community verification?',
        answer: 'Yes, local YMA branch coordinators assist in validating verified completion of public civic works.',
      },
      {
        question: 'Are quotes calculated in accordance with Mizoram PWD standards?',
        answer: 'Yes, all tariffs follow the official Mizoram Schedule of Rates with terrain carriage differentials included transparently.',
      },
    ],
    recentActivity: [
      { id: 'MZ-2501', hazard: 'Cliffside pedestrian staircase rail weld', locality: 'Bawngkawn, Aizawl', timeAgo: '2h ago', status: 'Photo Verified', amount: '₹4,900' },
      { id: 'MZ-2502', hazard: 'Slope retaining wall re-mortar', locality: 'Zarkawt, Aizawl', timeAgo: '5h ago', status: 'Closed & Paid', amount: '₹14,500' },
      { id: 'MZ-2503', hazard: 'Public rainwater cistern filtration clean', locality: 'Bazar Veng, Lunglei', timeAgo: '9h ago', status: 'Inspector Approved', amount: '₹3,800' },
    ],
  },
  {
    name: 'Nagaland',
    slug: 'nagaland',
    type: 'State',
    capital: 'Kohima',
    region: 'Northeast',
    population: '2.25 Million',
    area: '16,579 km²',
    districtsCount: 16,
    heroBlurb:
      'Restoring road connectivity and civic facilities across Kohima hill slopes, Dimapur commercial plains, and tribal district hubs.',
    civicPriorities: [
      {
        title: 'Monsoon Mudslide Highway Clearance',
        description: 'Clearing earth slips and reinforcing drainage channels along Kohima-Dimapur highway.',
        urgency: 'Critical',
        category: 'Road Resurfacing',
      },
      {
        title: 'Urban Water Distribution Tank Maintenance',
        description: 'Repairing community spring water storage reservoirs and overhead pipe distribution lines.',
        urgency: 'High',
        category: 'Water Infrastructure',
      },
      {
        title: 'Township Solar Street Lighting Maintenance',
        description: 'Replacing non-functional solar panels and deep-cycle batteries in hill town centers.',
        urgency: 'Medium',
        category: 'Street Lighting',
      },
    ],
    stats: { activeResolvers: 38, resolvedIssues: 490, avgResponseHours: 25, satisfactionRate: 98.2 },
    faqs: [
      {
        question: 'How are Kohima-Dimapur highway blockages cleared during rainstorms?',
        answer: 'Highway emergency work orders deploy local excavator and tipper truck contractors on 3-hour mobilization SLAs.',
      },
      {
        question: 'Does Crowd Report interface with tribal village councils?',
        answer: 'Yes, local village development boards have portal verification access to inspect proof before funds disburse.',
      },
      {
        question: 'What is the escrow guarantee for Nagaland civic projects?',
        answer: 'The 50% advance remains securely held in escrow until photographic proof is validated by municipal engineers.',
      },
    ],
    recentActivity: [
      { id: 'NL-2601', hazard: 'Mountain highway slip clearance', locality: 'Zubza Stretch, Kohima-Dimapur Hwy', timeAgo: '3h ago', status: 'Photo Verified', amount: '₹21,500' },
      { id: 'NL-2602', hazard: 'Community water reservoir crack seal', locality: 'Midland, Dimapur', timeAgo: '7h ago', status: 'Closed & Paid', amount: '₹6,400' },
      { id: 'NL-2603', hazard: 'Solar street fixture battery servicing', locality: 'High School Colony, Kohima', timeAgo: '11h ago', status: 'Inspector Approved', amount: '₹5,100' },
    ],
  },
  {
    name: 'Tripura',
    slug: 'tripura',
    type: 'State',
    capital: 'Agartala',
    region: 'Northeast',
    population: '4.15 Million',
    area: '10,491 km²',
    districtsCount: 8,
    heroBlurb:
      'Ensuring smart urban drainage, clean border corridors, and reliable infrastructure across Agartala and expanding district towns.',
    civicPriorities: [
      {
        title: 'Howrah River Basin Sluice Gate Maintenance',
        description: 'Clearing municipal floodgate channels in Agartala to prevent trans-boundary river flooding.',
        urgency: 'Critical',
        category: 'Drainage Remediation',
      },
      {
        title: 'Border Highway Pothole Patching',
        description: 'Heavy vehicle asphalt maintenance along trade and transit routes connecting integrated checkposts.',
        urgency: 'High',
        category: 'Road Resurfacing',
      },
      {
        title: 'Solar Photovoltaic Public Lighting',
        description: 'Servicing community lighting in tribal autonomous district council areas.',
        urgency: 'Medium',
        category: 'Street Lighting',
      },
    ],
    stats: { activeResolvers: 46, resolvedIssues: 620, avgResponseHours: 22, satisfactionRate: 98.4 },
    faqs: [
      {
        question: 'How is urban waterlogging handled in low-lying areas of Agartala?',
        answer: 'High-volume mobile pump contractors are dispatched on 90-minute SLAs when river gauges indicate high water.',
      },
      {
        question: 'Does Crowd Report cover the Tripura Tribal Areas Autonomous District Council (TTAADC)?',
        answer: 'Yes, full coverage extends to autonomous council hills and rural sub-divisions across all 8 districts.',
      },
      {
        question: 'Is Bengali language communication supported in Tripura?',
        answer: 'Yes, citizen updates, contractor work orders, and SMS notifications are provided in Bengali and English.',
      },
    ],
    recentActivity: [
      { id: 'TR-2701', hazard: 'Howrah river sluice gate desilting', locality: 'Battala, Agartala', timeAgo: '2h ago', status: 'Photo Verified', amount: '₹8,900' },
      { id: 'TR-2702', hazard: 'Border checkpost road asphalt repair', locality: 'Akhaura Road, West Tripura', timeAgo: '5h ago', status: 'Closed & Paid', amount: '₹13,200' },
      { id: 'TR-2703', hazard: 'TTAADC village solar light repair', locality: 'Khowai Town', timeAgo: '9h ago', status: 'Inspector Approved', amount: '₹4,700' },
    ],
  },
  {
    name: 'Sikkim',
    slug: 'sikkim',
    type: 'State',
    capital: 'Gangtok',
    region: 'Northeast',
    population: '690,000',
    area: '7,096 km²',
    districtsCount: 6,
    heroBlurb:
      'Upholding 100% organic environmental standards and steep mountain road safety in Gangtok, Namchi, and high Himalayan passes.',
    civicPriorities: [
      {
        title: 'NH-10 Himalayan Road Slope Stabilization',
        description: 'Fast-track clearance of Teesta river gorge rockfalls and retaining wall reconstruction.',
        urgency: 'Critical',
        category: 'Civil Infrastructure',
      },
      {
        title: 'Eco-Friendly Pedestrian Promenade Maintenance',
        description: 'Restoring cobblestone pavers and biodegradable waste receptacles on Gangtok MG Marg.',
        urgency: 'Medium',
        category: 'Walkways & Pavements',
      },
      {
        title: 'Sub-Zero Springwater Line Insulation',
        description: 'Preventing frozen gravity water supply blockages in alpine high-altitude settlements.',
        urgency: 'High',
        category: 'Water Infrastructure',
      },
    ],
    stats: { activeResolvers: 28, resolvedIssues: 380, avgResponseHours: 18, satisfactionRate: 99.6 },
    faqs: [
      {
        question: 'How are landslides on NH-10 (Sikkim lifeline) prioritized?',
        answer: 'Blockages on NH-10 trigger emergency multi-agency work orders with mechanical excavators dispatched within 30 minutes.',
      },
      {
        question: 'Are eco-friendly and organic waste standards enforced in Sikkim?',
        answer: 'Yes, all waste contractors must comply with Sikkim organic disposal laws; no single-use plastics or toxic sealants are permitted.',
      },
      {
        question: 'How do citizens in North Sikkim report high-altitude civic issues?',
        answer: 'Reports logged in Chungthang, Lachen, or Lachung connect to certified border area contractors.',
      },
    ],
    recentActivity: [
      { id: 'SK-2801', hazard: 'Teesta gorge slope mesh stabilization', locality: 'Rangpo-Singtam Stretch, NH-10', timeAgo: '2h ago', status: 'Photo Verified', amount: '₹28,500' },
      { id: 'SK-2802', hazard: 'MG Marg cobblestone path restoration', locality: 'MG Marg, Gangtok', timeAgo: '5h ago', status: 'Closed & Paid', amount: '₹5,400' },
      { id: 'SK-2803', hazard: 'Alpine springwater pipe insulation', locality: 'Ravangla, Namchi District', timeAgo: '8h ago', status: 'Inspector Approved', amount: '₹7,200' },
    ],
  },

  // --- 8 UNION TERRITORIES ---
  {
    name: 'Delhi (NCT)',
    slug: 'delhi',
    type: 'Union Territory',
    capital: 'New Delhi',
    region: 'North',
    population: '33.0 Million',
    area: '1,484 km²',
    districtsCount: 11,
    heroBlurb:
      'High-speed urban hazard remediation across MCD zones, NDMC diplomatic enclaves, and trans-Yamuna high-density neighborhoods.',
    civicPriorities: [
      {
        title: 'Ring Road High-Speed Asphalt Pothole Repair',
        description: 'Rapid nighttime mastic resurfacing on Inner and Outer Ring Roads and DND flyway.',
        urgency: 'Critical',
        category: 'Road Resurfacing',
      },
      {
        title: 'Monsoon Underpass Pumping & Desilting',
        description: 'Deploying high-discharge mobile pumps at Minto Bridge, Pul Prahladpur, and Zakhira underpasses.',
        urgency: 'Critical',
        category: 'Drainage Remediation',
      },
      {
        title: 'Winter Anti-Smog Water Mist Sprinkling',
        description: 'Servicing roadside anti-smog mist cannon stations and sweeping unpaved dust shoulders.',
        urgency: 'High',
        category: 'Public Safety',
      },
    ],
    stats: { activeResolvers: 290, resolvedIssues: 4190, avgResponseHours: 16, satisfactionRate: 98.7 },
    faqs: [
      {
        question: 'How fast are critical potholes repaired on Delhi arterial roads?',
        answer: 'Potholes logged on PWD and MCD arterial roads are scheduled for overnight hot-mix or mastic repair within 12-24 hours.',
      },
      {
        question: 'How does Crowd Report handle jurisdiction between MCD, NDMC, and DDA?',
        answer: 'Our GIS mapping automatically tags the responsible land-owning agency and routes tickets to accredited contractors authorized for that zone.',
      },
      {
        question: 'Can RWAs in South Delhi or Dwarka sponsor neighborhood park lighting repairs?',
        answer: 'Yes, registered RWAs can fund community repairs directly through our 50% escrow platform with tax invoices.',
      },
    ],
    recentActivity: [
      { id: 'DL-2901', hazard: 'Minto Bridge underpass pump servicing', locality: 'Connaught Place Outskirts, New Delhi', timeAgo: '1h ago', status: 'Photo Verified', amount: '₹14,800' },
      { id: 'DL-2902', hazard: 'Ring Road flyover joint pothole sealing', locality: 'Lajpat Nagar Flyover, South Delhi', timeAgo: '4h ago', status: 'Closed & Paid', amount: '₹17,200' },
      { id: 'DL-2903', hazard: 'Public park LED high-mast repair', locality: 'Sector 11, Dwarka', timeAgo: '7h ago', status: 'Inspector Approved', amount: '₹6,500' },
    ],
  },
  {
    name: 'Chandigarh',
    slug: 'chandigarh',
    type: 'Union Territory',
    capital: 'Chandigarh',
    region: 'North',
    population: '1.2 Million',
    area: '114 km²',
    districtsCount: 1,
    heroBlurb:
      'Preserving Le Corbusier grid planning standards, sector cycling tracks, and tree canopy avenues with precision maintenance.',
    civicPriorities: [
      {
        title: 'Sector Dedicated Cycle Track Paving',
        description: 'Resurfacing smooth red-oxide bicycle tracks and trimming encroaching hedge growth across sectors.',
        urgency: 'Medium',
        category: 'Walkways & Pavements',
      },
      {
        title: 'Storm Drainage Gutter Silt Removal',
        description: 'Mechanical suction clearing of curb-level storm grates along V3 and V4 sectoral avenues.',
        urgency: 'High',
        category: 'Drainage Remediation',
      },
      {
        title: 'Heritage Cast-Iron Sector Signage Restoration',
        description: 'Refurbishing Le Corbusier style sectoral indicator posts and reflective street markers.',
        urgency: 'Low',
        category: 'Public Safety',
      },
    ],
    stats: { activeResolvers: 55, resolvedIssues: 890, avgResponseHours: 14, satisfactionRate: 99.4 },
    faqs: [
      {
        question: 'Why does Chandigarh have the fastest response time in the country?',
        answer: 'Its compact 114 km² grid layout and dedicated municipal sector contractors allow responders to reach any reported hazard in under 2 hours.',
      },
      {
        question: 'Are heritage architectural guidelines respected for street repairs in Chandigarh?',
        answer: 'Yes, all street curb and signage work follows Chandigarh Heritage Conservation Committee guidelines.',
      },
      {
        question: 'Can residents report broken tree branches threatening vehicles?',
        answer: 'Yes, horticulture emergency teams respond to fallen or cracked limb tickets within 3 hours.',
      },
    ],
    recentActivity: [
      { id: 'CH-3001', hazard: 'Sector cycle track red-oxide resurfacing', locality: 'Sector 17-18 Dividing Road', timeAgo: '2h ago', status: 'Photo Verified', amount: '₹6,400' },
      { id: 'CH-3002', hazard: 'Avenue stormwater grate silt vacuum', locality: 'Sector 35-B, Chandigarh', timeAgo: '5h ago', status: 'Closed & Paid', amount: '₹4,100' },
      { id: 'CH-3003', hazard: 'Heritage roundabout signpost paint', locality: 'Sukhna Lake Approach Roundabout', timeAgo: '8h ago', status: 'Inspector Approved', amount: '₹2,800' },
    ],
  },
  {
    name: 'Jammu and Kashmir',
    slug: 'jammu-and-kashmir',
    type: 'Union Territory',
    capital: 'Srinagar / Jammu',
    region: 'North',
    population: '13.6 Million',
    area: '42,241 km²',
    districtsCount: 20,
    heroBlurb:
      'Safeguarding snow-bound mountain highways, Dal Lake urban canals, and Jammu plains commercial avenues with rapid response crews.',
    civicPriorities: [
      {
        title: 'Winter Snowpack & Ice Clearance',
        description: 'Deploying snowplows and de-icing salt spreaders on vital mountain passes and Srinagar city arteries.',
        urgency: 'Critical',
        category: 'Civil Infrastructure',
      },
      {
        title: 'Dal Lake Urban Canal Silt Clearance',
        description: 'De-weeding and mechanical desilting of water channels flowing into Dal and Nigeen lakes.',
        urgency: 'High',
        category: 'Drainage Remediation',
      },
      {
        title: 'Cold-Climate Freeze-Resistant Pipe Repair',
        description: 'Replacing burst potable water pipes during winter sub-zero temperature dips.',
        urgency: 'Critical',
        category: 'Water Infrastructure',
      },
    ],
    stats: { activeResolvers: 90, resolvedIssues: 1280, avgResponseHours: 23, satisfactionRate: 98.5 },
    faqs: [
      {
        question: 'How are winter freeze emergencies handled in Srinagar and Gulmarg?',
        answer: 'Specialized thermal repair crews are equipped with portable generators and insulated HDPE piping on 2-hour alert.',
      },
      {
        question: 'Does Crowd Report cover both Jammu and Kashmir divisions?',
        answer: 'Yes, all 20 districts across both Jammu and Kashmir divisions have accredited local contractor networks.',
      },
      {
        question: 'Can tourists report road or public facility issues?',
        answer: 'Yes, any visitor can use the mobile-friendly web app to report broken guardrails or sanitation issues without app download.',
      },
    ],
    recentActivity: [
      { id: 'JK-3101', hazard: 'Sub-zero frozen pipe replacement', locality: 'Lal Chowk, Srinagar', timeAgo: '3h ago', status: 'Photo Verified', amount: '₹8,200' },
      { id: 'JK-3102', hazard: 'De-icing salt spread on flyover slope', locality: 'Bikram Chowk Flyover, Jammu', timeAgo: '6h ago', status: 'Closed & Paid', amount: '₹5,500' },
      { id: 'JK-3103', hazard: 'Dal Lake feeder canal weed removal', locality: 'Boulevard Road, Srinagar', timeAgo: '9h ago', status: 'Inspector Approved', amount: '₹9,800' },
    ],
  },
  {
    name: 'Ladakh',
    slug: 'ladakh',
    type: 'Union Territory',
    capital: 'Leh',
    region: 'North',
    population: '300,000',
    area: '59,146 km²',
    districtsCount: 2,
    heroBlurb:
      'Supporting high-altitude desert resilience across Leh valley, Nubra sand dunes, and Kargil mountain trade passes.',
    civicPriorities: [
      {
        title: 'High-Altitude Pass Snow Clearing',
        description: 'Deploying heavy rotary snowblowers on Khardung La and Chang La high passes.',
        urgency: 'Critical',
        category: 'Civil Infrastructure',
      },
      {
        title: 'Solar Thermal Streetlight Battery Overhaul',
        description: 'Maintaining insulated lithium-iron-phosphate battery packs operating at -25°C.',
        urgency: 'Medium',
        category: 'Street Lighting',
      },
      {
        title: 'Glacial Melt Irrigation Channel Shoring',
        description: 'Reinforcing stone-lined traditional gravity canals (yuras) against scree collapse.',
        urgency: 'High',
        category: 'Water Infrastructure',
      },
    ],
    stats: { activeResolvers: 22, resolvedIssues: 290, avgResponseHours: 20, satisfactionRate: 99.6 },
    faqs: [
      {
        question: 'How do repair materials function in extreme -30°C winter temperatures in Ladakh?',
        answer: 'All cold-season repairs utilize freeze-thaw resistant polymer concretes and pre-insulated poly-piping designed for arctic conditions.',
      },
      {
        question: 'Does Crowd Report cover both Leh and Kargil districts?',
        answer: 'Yes, local contractors in both Leh and Kargil maintain off-grid repair capabilities.',
      },
      {
        question: 'Can solar power outages be reported in remote villages?',
        answer: 'Yes, community solar station faults can be logged with GPS coordinates and verified by village sarpanches.',
      },
    ],
    recentActivity: [
      { id: 'LA-3201', hazard: 'Rotary snow clearance on mountain pass', locality: 'Khardung La Approach, Leh', timeAgo: '3h ago', status: 'Photo Verified', amount: '₹28,000' },
      { id: 'LA-3202', hazard: 'Glacial melt yura stone repair', locality: 'Diskit, Nubra Valley', timeAgo: '7h ago', status: 'Closed & Paid', amount: '₹12,400' },
      { id: 'LA-3203', hazard: 'Sub-zero solar battery replacement', locality: 'Main Bazaar, Kargil', timeAgo: '11h ago', status: 'Inspector Approved', amount: '₹7,800' },
    ],
  },
  {
    name: 'Puducherry',
    slug: 'puducherry',
    type: 'Union Territory',
    capital: 'Puducherry',
    region: 'South',
    population: '1.45 Million',
    area: '492 km²',
    districtsCount: 4,
    heroBlurb:
      'Preserving French colonial heritage promenades, Auroville green approaches, and coastal canals in Puducherry, Karaikal, Mahe, and Yanam.',
    civicPriorities: [
      {
        title: 'Goubert Avenue Promenade Seawall Maintenance',
        description: 'Restoring interlocking granite blocks and safety railings along White Town promenade.',
        urgency: 'High',
        category: 'Civil Infrastructure',
      },
      {
        title: 'French Heritage Street Signage Care',
        description: 'Restoring blue-and-white enameled bilingual street name plates and wrought iron lamp brackets.',
        urgency: 'Low',
        category: 'Public Safety',
      },
      {
        title: 'Grand Canal Tidal Silt Drainage',
        description: 'Clearing the urban Grand Canal to ensure free flow into the Bay of Bengal.',
        urgency: 'Medium',
        category: 'Drainage Remediation',
      },
    ],
    stats: { activeResolvers: 35, resolvedIssues: 540, avgResponseHours: 18, satisfactionRate: 99.1 },
    faqs: [
      {
        question: 'How are heritage French Quarter repairs regulated in Puducherry?',
        answer: 'Repairs in White Town follow INTACH and State Town Planning heritage guidelines to preserve historic aesthetics.',
      },
      {
        question: 'Are outlying enclaves like Karaikal, Mahe, and Yanam covered?',
        answer: 'Yes, accredited resolvers operate across all 4 geographically separated enclaves of the Union Territory.',
      },
      {
        question: 'What is the average response time for promenade railing repairs?',
        answer: 'Beach promenade safety hazards are addressed within 24 hours of reporting.',
      },
    ],
    recentActivity: [
      { id: 'PY-3301', hazard: 'Promenade granite seawall paver leveling', locality: 'Goubert Avenue, White Town', timeAgo: '2h ago', status: 'Photo Verified', amount: '₹6,800' },
      { id: 'PY-3302', hazard: 'Grand Canal urban desilting', locality: 'Rue Suffren Outfall, Puducherry', timeAgo: '5h ago', status: 'Closed & Paid', amount: '₹8,200' },
      { id: 'PY-3303', hazard: 'French blue enameled signpost restoration', locality: 'Rue Dumas, White Town', timeAgo: '8h ago', status: 'Inspector Approved', amount: '₹3,400' },
    ],
  },
  {
    name: 'Andaman and Nicobar Islands',
    slug: 'andaman-and-nicobar-islands',
    type: 'Union Territory',
    capital: 'Port Blair',
    region: 'South',
    population: '400,000',
    area: '8,249 km²',
    districtsCount: 3,
    heroBlurb:
      'Maintaining resilient island logistics, marine-grade lighting, and jetty approach safety across Port Blair, Havelock, and Nicobar.',
    civicPriorities: [
      {
        title: 'Jetty Approach Road Marine Concrete Patching',
        description: 'Resurfacing salt-water degraded concrete roads connecting inter-island ferry jetties.',
        urgency: 'Critical',
        category: 'Road Resurfacing',
      },
      {
        title: 'Corrosion-Resistant Harbor Street Lighting',
        description: 'Servicing stainless steel marine-grade LED fixtures along coastal wharf corridors.',
        urgency: 'Medium',
        category: 'Street Lighting',
      },
      {
        title: 'Island Torrent Drainage Clearing',
        description: 'Clearing steep runoff nullahs across Port Blair during tropical monsoon cloudbursts.',
        urgency: 'High',
        category: 'Drainage Remediation',
      },
    ],
    stats: { activeResolvers: 24, resolvedIssues: 320, avgResponseHours: 24, satisfactionRate: 98.8 },
    faqs: [
      {
        question: 'How do island logistics affect material supply for repairs in Port Blair?',
        answer: 'Contractors maintain certified stockpiles of marine-grade cement and anti-corrosive fasteners locally to avoid mainland shipping delays.',
      },
      {
        question: 'Can tourists report hazards on Havelock (Swaraj Dweep) and Neil (Shaheed Dweep)?',
        answer: 'Yes, ferry terminal and beach road tickets are actively routed to local island contractors.',
      },
      {
        question: 'Are environmental protection protocols observed near coral reefs?',
        answer: 'Yes, zero runoff into coral zones is mandated with strict sedimentation traps on all coastal jobs.',
      },
    ],
    recentActivity: [
      { id: 'AN-3401', hazard: 'Marine concrete ferry jetty patch', locality: 'Phoenix Bay Jetty, Port Blair', timeAgo: '4h ago', status: 'Photo Verified', amount: '₹14,500' },
      { id: 'AN-3402', hazard: 'Corrosion-proof wharf streetlight service', locality: 'Aberdeen Bazaar, Port Blair', timeAgo: '7h ago', status: 'Closed & Paid', amount: '₹5,800' },
      { id: 'AN-3403', hazard: 'Island nullah storm clearance', locality: 'Havelock Island Ferry Road', timeAgo: '11h ago', status: 'Inspector Approved', amount: '₹8,400' },
    ],
  },
  {
    name: 'Dadra and Nagar Haveli and Daman and Diu',
    slug: 'dadra-and-nagar-haveli-and-daman-and-diu',
    type: 'Union Territory',
    capital: 'Daman',
    region: 'West',
    population: '615,000',
    area: '603 km²',
    districtsCount: 3,
    heroBlurb:
      'Coordinating industrial zone maintenance in Silvassa, coastal fort promenades in Daman, and seaside access roads in Diu.',
    civicPriorities: [
      {
        title: 'Industrial Heavy Truck Road Potholes',
        description: 'Resurfacing industrial approach routes in Silvassa manufacturing estates.',
        urgency: 'High',
        category: 'Road Resurfacing',
      },
      {
        title: 'Coastal Fort Promenade Railing Maintenance',
        description: 'Refurbishing sea-spray corroded railings near Moti Daman and Diu Forts.',
        urgency: 'Medium',
        category: 'Civil Infrastructure',
      },
      {
        title: 'Beach Coastal Drainage Silt Clearing',
        description: 'Clearing ocean outfalls along Devka and Nagoa beaches.',
        urgency: 'Medium',
        category: 'Drainage Remediation',
      },
    ],
    stats: { activeResolvers: 28, resolvedIssues: 390, avgResponseHours: 21, satisfactionRate: 98.6 },
    faqs: [
      {
        question: 'Does Crowd Report cover all three regions of the merged Union Territory?',
        answer: 'Yes, accredited resolvers operate across Dadra & Nagar Haveli (Silvassa), Daman, and Diu.',
      },
      {
        question: 'Can manufacturing units in Silvassa sponsor external access road repairs?',
        answer: 'Yes, industrial units can fund external public road repairs through the 50% escrow guarantee with full GST tax invoicing.',
      },
      {
        question: 'How are coastal fort heritage repairs supervised in Daman and Diu?',
        answer: 'Public works adjacent to Portuguese heritage walls are inspected in consultation with the local tourism and archaeology departments.',
      },
    ],
    recentActivity: [
      { id: 'DN-3501', hazard: 'Industrial estate access road patch', locality: 'Piparia Industrial Estate, Silvassa', timeAgo: '3h ago', status: 'Photo Verified', amount: '₹12,400' },
      { id: 'DN-3502', hazard: 'Coastal fort seawall railing repair', locality: 'Moti Daman Fort Promenade', timeAgo: '6h ago', status: 'Closed & Paid', amount: '₹7,100' },
      { id: 'DN-3503', hazard: 'Beach access storm culvert clear', locality: 'Nagoa Beach Road, Diu', timeAgo: '10h ago', status: 'Inspector Approved', amount: '₹5,200' },
    ],
  },
  {
    name: 'Lakshadweep',
    slug: 'lakshadweep',
    type: 'Union Territory',
    capital: 'Kavaratti',
    region: 'South',
    population: '65,000',
    area: '32.62 km²',
    districtsCount: 1,
    heroBlurb:
      'Eco-sensitive coral atoll civic stewardship across Kavaratti, Agatti, Minicoy, and Andrott with zero-pollution standards.',
    civicPriorities: [
      {
        title: 'Atoll Concrete Jetty Footway Repair',
        description: 'Repairing sea-washed concrete footways and boat landing steps on coral lagoon shores.',
        urgency: 'Critical',
        category: 'Walkways & Pavements',
      },
      {
        title: 'Solar Desalination Water Line Servicing',
        description: 'Restoring pipe connections from low-temperature thermal desalination plants to community taps.',
        urgency: 'Critical',
        category: 'Water Infrastructure',
      },
      {
        title: 'Lagoon Barrier Litter Interception',
        description: 'Removing floating plastic debris before it enters fragile coral reef ecosystems.',
        urgency: 'High',
        category: 'Waste Clearance',
      },
    ],
    stats: { activeResolvers: 16, resolvedIssues: 190, avgResponseHours: 16, satisfactionRate: 99.7 },
    faqs: [
      {
        question: 'How are coral reefs protected during public works in Lakshadweep?',
        answer: 'All public works prohibit chemical sealants or non-biodegradable runoffs; jobs are audited by island ecology officers.',
      },
      {
        question: 'How do islanders report drinking water tap defects?',
        answer: 'Desalination community tap faults are logged as Critical, dispatching local island plumbers within 4 hours.',
      },
      {
        question: 'Are all inhabited islands of Lakshadweep covered?',
        answer: 'Yes, local resolver coverage is active across all 10 inhabited islands including Agatti, Kavaratti, and Minicoy.',
      },
    ],
    recentActivity: [
      { id: 'LD-3601', hazard: 'Jetty landing concrete steps resurfacing', locality: 'Main Jetty, Kavaratti', timeAgo: '2h ago', status: 'Photo Verified', amount: '₹7,500' },
      { id: 'LD-3602', hazard: 'Community desalination tap pipeline seal', locality: 'Airport Road, Agatti', timeAgo: '5h ago', status: 'Closed & Paid', amount: '₹3,900' },
      { id: 'LD-3603', hazard: 'Lagoon edge barrier debris removal', locality: 'Village Shore, Minicoy', timeAgo: '9h ago', status: 'Inspector Approved', amount: '₹4,200' },
    ],
  },
];

export const getAllStates = (): StateData[] => STATES_DATA;

export const getStateBySlug = (slug: string): StateData | undefined => {
  return STATES_DATA.find((s) => s.slug.toLowerCase() === slug.toLowerCase());
};

export const getStatesByRegion = (region: RegionType): StateData[] => {
  return STATES_DATA.filter((s) => s.region === region);
};

export const getStatesByType = (type: StateType): StateData[] => {
  return STATES_DATA.filter((s) => s.type === type);
};
