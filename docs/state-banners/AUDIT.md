# State Banners Audit

Audit date: 2026-10-30
Branch: state-banners

## 1. Slug and Data Cross-Check

All 36 Indian States and Union Territories were audited across `client/src/data/statesData.ts` and `client/src/data/landmarks.ts`. Every slug exists in both files with complete symmetry (36 of 36 matched).

Every entry in `landmarks.ts` currently references `/states/<slug>.svg`, and all 36 corresponding SVG files exist in `client/public/states/`.

### Complete Inventory of 36 States and Union Territories

| # | Slug | Name | Type | Zone | Capital | Districts | Area | Population | Headline Landmark | Current Banner URL |
|---|---|---|---|---|---|---|---|---|---|---|
| 1 | `karnataka` | Karnataka | State | South | Bengaluru | 31 | 191,791 km² | 67.6 Million | Vidhana Soudha & Hampi | `/states/karnataka.svg` |
| 2 | `tamil-nadu` | Tamil Nadu | State | South | Chennai | 38 | 130,058 km² | 76.8 Million | Meenakshi Temple & Shore Temple | `/states/tamil-nadu.svg` |
| 3 | `telangana` | Telangana | State | South | Hyderabad | 33 | 112,077 km² | 38.0 Million | Charminar & Golconda Fort | `/states/telangana.svg` |
| 4 | `andhra-pradesh` | Andhra Pradesh | State | South | Amaravati | 26 | 162,968 km² | 53.9 Million | Tirumala Hills & Eastern Ghats | `/states/andhra-pradesh.svg` |
| 5 | `kerala` | Kerala | State | South | Thiruvananthapuram | 14 | 38,863 km² | 35.8 Million | Alleppey Backwaters & Western Ghats | `/states/kerala.svg` |
| 6 | `maharashtra` | Maharashtra | State | West | Mumbai | 36 | 307,713 km² | 126.4 Million | Gateway of India & Sahyadri Range | `/states/maharashtra.svg` |
| 7 | `gujarat` | Gujarat | State | West | Gandhinagar | 33 | 196,024 km² | 70.4 Million | Statue of Unity & Sabarmati Riverfront | `/states/gujarat.svg` |
| 8 | `goa` | Goa | State | West | Panaji | 2 | 3,702 km² | 1.58 Million | Basilica of Bom Jesus & Arabian Coastline | `/states/goa.svg` |
| 9 | `uttar-pradesh` | Uttar Pradesh | State | North | Lucknow | 75 | 240,928 km² | 241.0 Million | Taj Mahal & Varanasi Ghats | `/states/uttar-pradesh.svg` |
| 10 | `rajasthan` | Rajasthan | State | North | Jaipur | 50 | 342,239 km² | 81.0 Million | Hawa Mahal & Amber Fort | `/states/rajasthan.svg` |
| 11 | `punjab` | Punjab | State | North | Chandigarh | 23 | 50,362 km² | 30.5 Million | Golden Temple Sanctum | `/states/punjab.svg` |
| 12 | `haryana` | Haryana | State | North | Chandigarh | 22 | 44,212 km² | 28.9 Million | Surajkund & Urban Tech Corridors | `/states/haryana.svg` |
| 13 | `himachal-pradesh` | Himachal Pradesh | State | North | Shimla | 12 | 55,673 km² | 7.5 Million | Himalayan Ridge & Pine Valleys | `/states/himachal-pradesh.svg` |
| 14 | `uttarakhand` | Uttarakhand | State | North | Dehradun | 13 | 53,483 km² | 11.5 Million | Rishikesh Laxman Jhula & Garhwal Peaks | `/states/uttarakhand.svg` |
| 15 | `west-bengal` | West Bengal | State | East | Kolkata | 23 | 88,752 km² | 99.1 Million | Howrah Bridge & Victoria Memorial | `/states/west-bengal.svg` |
| 16 | `bihar` | Bihar | State | East | Patna | 38 | 94,163 km² | 128.5 Million | Mahabodhi Temple Spire, Bodh Gaya | `/states/bihar.svg` |
| 17 | `odisha` | Odisha | State | East | Bhubaneswar | 30 | 155,707 km² | 47.0 Million | Konark Sun Temple Chariot Wheel | `/states/odisha.svg` |
| 18 | `jharkhand` | Jharkhand | State | East | Ranchi | 24 | 79,714 km² | 39.5 Million | Hundru Falls & Chota Nagpur Hills | `/states/jharkhand.svg` |
| 19 | `madhya-pradesh` | Madhya Pradesh | State | Central | Bhopal | 55 | 308,245 km² | 86.5 Million | Sanchi Stupa Torana & Gwalior Fort | `/states/madhya-pradesh.svg` |
| 20 | `chhattisgarh` | Chhattisgarh | State | Central | Raipur | 33 | 135,192 km² | 30.1 Million | Chitrakote Horseshoe Falls & Sal Forests | `/states/chhattisgarh.svg` |
| 21 | `assam` | Assam | State | Northeast | Dispur | 35 | 78,438 km² | 36.5 Million | Kaziranga Plains & Brahmaputra River | `/states/assam.svg` |
| 22 | `arunachal-pradesh` | Arunachal Pradesh | State | Northeast | Itanagar | 26 | 83,743 km² | 1.57 Million | Tawang Monastery & Sela Pass | `/states/arunachal-pradesh.svg` |
| 23 | `manipur` | Manipur | State | Northeast | Imphal | 16 | 22,327 km² | 3.2 Million | Loktak Lake & Floating Phumdis | `/states/manipur.svg` |
| 24 | `meghalaya` | Meghalaya | State | Northeast | Shillong | 12 | 22,429 km² | 3.3 Million | Living Root Bridges & Cherrapunji Cascades | `/states/meghalaya.svg` |
| 25 | `mizoram` | Mizoram | State | Northeast | Aizawl | 11 | 21,081 km² | 1.25 Million | Phawngpui Blue Mountain Ridges | `/states/mizoram.svg` |
| 26 | `nagaland` | Nagaland | State | Northeast | Kohima | 16 | 16,579 km² | 2.25 Million | Hornbill Kisama Heritage & Dzukou Valley | `/states/nagaland.svg` |
| 27 | `tripura` | Tripura | State | Northeast | Agartala | 8 | 10,491 km² | 4.15 Million | Ujjayanta Palace & Neermahal Water Palace | `/states/tripura.svg` |
| 28 | `sikkim` | Sikkim | State | Northeast | Gangtok | 6 | 7,096 km² | 690,000 | Mount Kanchenjunga & Rumtek Monastery | `/states/sikkim.svg` |
| 29 | `delhi` | Delhi (NCT) | Union Territory | North | New Delhi | 11 | 1,484 km² | 33.0 Million | India Gate & National Secretariat | `/states/delhi.svg` |
| 30 | `chandigarh` | Chandigarh | Union Territory | North | Chandigarh | 1 | 114 km² | 1.2 Million | Le Corbusier Open Hand Monument | `/states/chandigarh.svg` |
| 31 | `jammu-and-kashmir` | Jammu and Kashmir | Union Territory | North | Srinagar / Jammu | 20 | 42,241 km² | 13.6 Million | Dal Lake Shikara & Pir Panjal Range | `/states/jammu-and-kashmir.svg` |
| 32 | `ladakh` | Ladakh | Union Territory | North | Leh | 2 | 59,146 km² | 300,000 | Pangong Tso & High-Altitude Passes | `/states/ladakh.svg` |
| 33 | `puducherry` | Puducherry | Union Territory | South | Puducherry | 4 | 492 km² | 1.45 Million | French Quarter Promenade & Beach | `/states/puducherry.svg` |
| 34 | `andaman-and-nicobar-islands` | Andaman and Nicobar Islands | Union Territory | South | Port Blair | 3 | 8,249 km² | 400,000 | Cellular Jail & Radhanagar Coral Coast | `/states/andaman-and-nicobar-islands.svg` |
| 35 | `dadra-and-nagar-haveli-and-daman-and-diu` | Dadra and Nagar Haveli and Daman and Diu | Union Territory | West | Daman | 3 | 603 km² | 615,000 | Historic Diu Fort & Coastal Ramparts | `/states/dadra-and-nagar-haveli-and-daman-and-diu.svg` |
| 36 | `lakshadweep` | Lakshadweep | Union Territory | South | Kavaratti | 1 | 32.62 km² | 65,000 | Agatti Coral Lagoon & Turquoise Atolls | `/states/lakshadweep.svg` |

## 2. Component Usage Audit

The banner image is referenced across client pages and components:

1. **State Detail Hero Section (`client/src/pages/public/StateDetail.tsx`)**:
   - Lines 198 to 209: The banner is currently rendered as a full-width background image with `className="w-full h-full object-cover opacity-35 object-center scale-105 filter blur-[0.5px]"`.
   - In Phase B5, this hero will be upgraded to a crisp `<picture>` element with responsive WebP/AVIF formats (1600 px desktop, 800 px mobile), high contrast left-aligned text overlay, and relaxed right-aligned visual treatment.

2. **Featured State Landmark Card (`client/src/pages/public/StateDetail.tsx`)**:
   - Lines 420 to 443: A dedicated showcase card rendering the state landmark in a 16:10 container (`<img src={landmarkInfo.bannerUrl} alt={landmarkInfo.landmark} ... />`).
   - In Phase B5, this card will consume the optimized 800 px WebP/AVIF image.

3. **States Directory Page (`client/src/pages/public/StatesDirectory.tsx`)**:
   - `StateCard` component renders regional state entries. Following the recent user refinement, cards use a compact typography and facts layout.
   - In Phase B5, directory cards can cleanly support an optional compact thumbnail or optimized picture element if desired.

## 3. Fact Verification

- **Capitals**: All 36 capitals align with official Government of India designations.
- **Districts**: Reorganized district counts reflect recent official state administrative notifications:
  - Andhra Pradesh: 26 districts (reorganized from 13)
  - Madhya Pradesh: 55 districts (including Mauganj, Maihar, Pandhurna)
  - Rajasthan: 50 districts
  - Karnataka: 31 districts (including Vijayanagara)
  - Tamil Nadu: 38 districts
  - Punjab: 23 districts (including Malerkotla)
  - Sikkim: 6 districts (including Pakyong and Soreng)
- **Territory Designations**: Exactly 28 States and 8 Union Territories.

## 4. Next Phase Readiness

- **Phase B1**: Add the structured `places` array (3 to 4 famous places per state), `bannerPrompt`, and `bannerAlt` to `landmarks.ts`.
- **Phase B2**: Generate the 36 photographic 16:9 landscape banners zone by zone.
- **Phase B3**: Build the interactive contact sheet and complete review gate before optimization.

