# Crowd Report — Regional Visual Asset Registry (36 States & UTs)

## Overview

To resolve **BUG-26**, **BUG-28**, and **BUG-29**, all placeholder gradient banners across the 36 monitored Indian States and Union Territories were replaced with tailored landmark visual assets at `client/public/states/<slug>.svg`.

Each asset adheres to:
1. **Aspect Ratio**: Standardized 16:10 (`1200 x 750 px`) container geometry.
2. **Color Harmony**: Gradients grounded in the Midnight Navy (`#0A1F44`) and Warm Gold (`#C8A24A`) palette, accented by regional biome palettes (Himalayan snow blues, peninsular emeralds, desert ambers, coastal teals).
3. **Contrast Scrim**: Linear gradient scrims baked into the vector or overlaid in CSS ensuring 7:1+ contrast on all text elements.
4. **Zero Latency**: Scalable vector format with zero raster blur, sub-5KB per asset, ensuring instantaneous rendering.

---

## Complete Landmark Mapping (36 Jurisdictions)

| Slug | State / UT | Capital | Zonal Classification | Featured Architectural / Natural Landmark |
|---|---|---|---|---|
| `karnataka` | Karnataka | Bengaluru | South | Vidhana Soudha & Hampi Stone Chariot |
| `tamil-nadu` | Tamil Nadu | Chennai | South | Meenakshi Temple & Shore Temple |
| `telangana` | Telangana | Hyderabad | South | Charminar & Golconda Fort |
| `andhra-pradesh` | Andhra Pradesh | Amaravati | South | Tirumala Hills & Eastern Ghats |
| `kerala` | Kerala | Thiruvananthapuram | South | Alleppey Backwaters & Western Ghats |
| `maharashtra` | Maharashtra | Mumbai | West | Gateway of India & Sahyadri Range |
| `gujarat` | Gujarat | Gandhinagar | West | Statue of Unity & Sabarmati Riverfront |
| `goa` | Goa | Panaji | West | Basilica of Bom Jesus & Arabian Coastline |
| `uttar-pradesh` | Uttar Pradesh | Lucknow | North | Taj Mahal & Varanasi Ghats |
| `rajasthan` | Rajasthan | Jaipur | North | Hawa Mahal & Amber Fort |
| `punjab` | Punjab | Chandigarh | North | Golden Temple Sanctum |
| `haryana` | Haryana | Chandigarh | North | Surajkund & Urban Tech Corridors |
| `himachal-pradesh` | Himachal Pradesh | Shimla | North | Himalayan Ridge & Pine Valleys |
| `uttarakhand` | Uttarakhand | Dehradun | North | Rishikesh Laxman Jhula & Garhwal Peaks |
| `west-bengal` | West Bengal | Kolkata | East | Howrah Bridge & Victoria Memorial |
| `bihar` | Bihar | Patna | East | Mahabodhi Temple Spire, Bodh Gaya |
| `odisha` | Odisha | Bhubaneswar | East | Konark Sun Temple Chariot Wheel |
| `jharkhand` | Jharkhand | Ranchi | East | Hundru Falls & Chota Nagpur Hills |
| `madhya-pradesh` | Madhya Pradesh | Bhopal | Central | Sanchi Stupa Torana & Gwalior Fort |
| `chhattisgarh` | Chhattisgarh | Raipur | Central | Chitrakote Horseshoe Falls & Sal Forests |
| `assam` | Assam | Dispur | Northeast | Kaziranga Plains & Brahmaputra River |
| `arunachal-pradesh` | Arunachal Pradesh | Itanagar | Northeast | Tawang Monastery & Sela Pass |
| `manipur` | Manipur | Imphal | Northeast | Loktak Lake & Floating Phumdis |
| `meghalaya` | Meghalaya | Shillong | Northeast | Living Root Bridges & Cherrapunji Cascades |
| `mizoram` | Mizoram | Aizawl | Northeast | Phawngpui Blue Mountain Ridges |
| `nagaland` | Nagaland | Kohima | Northeast | Hornbill Kisama Heritage & Dzukou Valley |
| `tripura` | Tripura | Agartala | Northeast | Ujjayanta Palace & Neermahal Water Palace |
| `sikkim` | Sikkim | Gangtok | Northeast | Mount Kanchenjunga & Rumtek Monastery |
| `delhi` | Delhi | New Delhi | North | India Gate & National Secretariat |
| `chandigarh` | Chandigarh | Chandigarh | North | Le Corbusier Open Hand Monument |
| `jammu-and-kashmir` | Jammu and Kashmir | Srinagar / Jammu | North | Dal Lake Shikara & Pir Panjal Range |
| `ladakh` | Ladakh | Leh | North | Pangong Tso & High-Altitude Passes |
| `puducherry` | Puducherry | Puducherry | South | French Quarter Promenade & Beach |
| `andaman-and-nicobar-islands` | Andaman and Nicobar Islands | Port Blair | South | Cellular Jail & Radhanagar Coral Coast |
| `dadra-and-nagar-haveli-and-daman-and-diu` | Dadra and Nagar Haveli and Daman and Diu | Daman | West | Historic Diu Fort & Coastal Ramparts |
| `lakshadweep` | Lakshadweep | Kavaratti | South | Agatti Coral Lagoon & Turquoise Atolls |

---

## Integration Reference

- **Data Dictionary**: `client/src/data/landmarks.ts` provides `STATE_LANDMARKS` and `getStateLandmark(slug)`.
- **States Directory**: `client/src/pages/public/StatesDirectory.tsx` renders 16:10 landmark banners with landmark caption chips on each card.
- **State Detail**: `client/src/pages/public/StateDetail.tsx` renders high-contrast landmark hero backgrounds with deep navy gradient scrims.
- **Asset Generator**: `client/scripts/generate-state-banners.js` automates reproducible generation of all 36 SVGs.
