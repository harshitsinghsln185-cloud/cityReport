import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const OUT_DIR = path.resolve('client/public/screenshots');
fs.mkdirSync(OUT_DIR, { recursive: true });

const logoLightSvg = fs.readFileSync('client/src/assets/logo/logo.svg');
const logoWhiteSvg = fs.readFileSync('client/src/assets/logo/logo-white.svg');

// Render logo marks at exact responsive heights
const renderMark = async (svg, height) => {
  return await sharp(svg)
    .resize({ height: Math.round(height), fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();
};

async function renderScreens() {
  const viewports = [
    { name: '360px', width: 360, height: 240, isMobile: true, isUltraMobile: true },
    { name: '768px', width: 768, height: 260, isTablet: true },
    { name: '1280px', width: 1280, height: 280, isDesktop: true },
    { name: '1536px', width: 1536, height: 300, isWide: true }
  ];

  // 1. NAVBAR PREVIEWS AT 360, 768, 1280, 1536
  for (const vp of viewports) {
    const isUltraMobile = vp.width <= 360;
    const markHeight = 34; // --logo-h-md
    const markPng = await renderMark(logoLightSvg, markHeight);
    const markMeta = await sharp(markPng).metadata();

    const textSvg = Buffer.from(`
      <svg width="220" height="40" xmlns="http://www.w3.org/2000/svg">
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,600&amp;display=swap');
          .c { font-family: 'Fraunces', Georgia, serif; font-size: ${isUltraMobile ? '18px' : '22px'}; font-weight: 600; fill: #0A1F44; }
          .r { font-family: 'Fraunces', Georgia, serif; font-size: ${isUltraMobile ? '18px' : '22px'}; font-weight: 600; fill: #E8A33D; }
        </style>
        <text x="0" y="${isUltraMobile ? '26' : '28'}"><tspan class="c">Crowd </tspan><tspan class="r">Report</tspan></text>
      </svg>
    `);
    const textPng = await sharp(textSvg).png().toBuffer();

    const composites = [
      { input: markPng, left: 16, top: 15 }
    ];

    if (!isUltraMobile) {
      composites.push({ input: textPng, left: 16 + (markMeta.width || 28) + 8, top: 15 });
    }

    const navSvgOverlay = Buffer.from(`
      <svg width="${vp.width}" height="${vp.height}" xmlns="http://www.w3.org/2000/svg">
        <style>
          .link { font-family: -apple-system, sans-serif; font-size: 14px; font-weight: 500; fill: #5B6577; }
          .badge { font-family: monospace; font-size: 11px; font-weight: 600; fill: #0A1F44; }
          .title { font-family: -apple-system, sans-serif; font-size: 12px; font-weight: 600; fill: #8A6A1F; }
        </style>
        <!-- Top Banner Header -->
        <line x1="0" y1="64" x2="${vp.width}" y2="64" stroke="#E7E2D6" stroke-width="1"/>
        <rect x="0" y="0" width="${vp.width}" height="64" fill="#FFFFFF" fill-opacity="0.95"/>
        
        <!-- Right side actions -->
        ${vp.width >= 768 ? `
          <text x="${vp.width - 450}" y="38" class="link">Public Services</text>
          <text x="${vp.width - 330}" y="38" class="link">States &amp; UTs</text>
          <text x="${vp.width - 210}" y="38" class="link">Track Status</text>
          <rect x="${vp.width - 110}" y="14" width="94" height="36" rx="8" fill="#E8A33D"/>
          <text x="${vp.width - 98}" y="37" font-family="-apple-system, sans-serif" font-size="13px" font-weight="700" fill="#0A1F44">Report</text>
        ` : `
          <rect x="${vp.width - 48}" y="18" width="28" height="28" rx="6" fill="#F1EEE6"/>
          <path d="M ${vp.width - 42} 26 L ${vp.width - 26} 26 M ${vp.width - 42} 32 L ${vp.width - 26} 32 M ${vp.width - 42} 38 L ${vp.width - 26} 38" stroke="#0A1F44" stroke-width="2"/>
        `}

        <!-- Page Content Mockup preview below navbar -->
        <rect x="16" y="88" width="${Math.min(300, vp.width - 32)}" height="16" rx="4" fill="#EBF1FA"/>
        <text x="20" y="100" class="badge">VIEWPORT: ${vp.width}px &#8226; RESPONSIVE NAVBAR</text>
        <rect x="16" y="120" width="${Math.min(500, vp.width - 32)}" height="28" rx="6" fill="#0A1F44" fill-opacity="0.08"/>
      </svg>
    `);

    await sharp({
      create: {
        width: vp.width,
        height: vp.height,
        channels: 4,
        background: { r: 250, g: 248, b: 243, alpha: 1 } // Soft Ivory
      }
    })
      .composite([
        { input: Buffer.from(`<svg width="${vp.width}" height="64"><rect width="${vp.width}" height="64" fill="#FFFFFF"/></svg>`), left: 0, top: 0 },
        ...composites,
        { input: navSvgOverlay, left: 0, top: 0 }
      ])
      .png()
      .toFile(path.join(OUT_DIR, `navbar-${vp.name}.png`));

    console.log(`✓ Rendered Navbar at ${vp.name}`);
  }

  // 2. FOOTER PREVIEW (Dark Navy #06132B with logo-white.svg)
  for (const vp of [viewports[0], viewports[2]]) {
    const markHeight = 34;
    const markWhitePng = await renderMark(logoWhiteSvg, markHeight);
    const markMeta = await sharp(markWhitePng).metadata();

    const footerTextSvg = Buffer.from(`
      <svg width="${vp.width}" height="200" xmlns="http://www.w3.org/2000/svg">
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,600&amp;display=swap');
          .fc { font-family: 'Fraunces', Georgia, serif; font-size: 22px; font-weight: 600; fill: #FFFFFF; }
          .fr { font-family: 'Fraunces', Georgia, serif; font-size: 22px; font-weight: 600; fill: #E8A33D; }
          .fsub { font-family: -apple-system, sans-serif; font-size: 11px; font-weight: 600; fill: #E8A33D; letter-spacing: 1.5px; }
          .fbody { font-family: -apple-system, sans-serif; font-size: 13px; fill: #94A3B8; }
        </style>
        <text x="60" y="40"><tspan class="fc">Crowd </tspan><tspan class="fr">Report</tspan></text>
        <text x="60" y="58" class="fsub">CIVIC INFRASTRUCTURE</text>
        <text x="24" y="95" class="fbody">India's unified civic infrastructure accountability network.</text>
        <text x="24" y="120" class="fbody">Milestone payments &#8226; Geotagged photo proof &#8226; 48h SLA</text>
      </svg>
    `);

    await sharp({
      create: {
        width: vp.width,
        height: 200,
        channels: 4,
        background: { r: 6, g: 19, b: 43, alpha: 1 } // Dark Navy #06132B
      }
    })
      .composite([
        { input: markWhitePng, left: 24, top: 24 },
        { input: footerTextSvg, left: 0, top: 0 }
      ])
      .png()
      .toFile(path.join(OUT_DIR, `footer-${vp.name}.png`));

    console.log(`✓ Rendered Footer at ${vp.name}`);
  }

  // 3. AUTH PREVIEW (Login card at 768px & 360px)
  for (const vp of [viewports[0], viewports[2]]) {
    const markHeight = 34;
    const markPng = await renderMark(logoLightSvg, markHeight);
    const markMeta = await sharp(markPng).metadata();

    const authCardSvg = Buffer.from(`
      <svg width="${vp.width}" height="380" xmlns="http://www.w3.org/2000/svg">
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,600&amp;display=swap');
          .ac { font-family: 'Fraunces', Georgia, serif; font-size: 22px; font-weight: 600; fill: #0A1F44; }
          .ar { font-family: 'Fraunces', Georgia, serif; font-size: 22px; font-weight: 600; fill: #E8A33D; }
          .h1 { font-family: -apple-system, sans-serif; font-size: 20px; font-weight: 800; fill: #101828; }
          .lbl { font-family: -apple-system, sans-serif; font-size: 13px; font-weight: 600; fill: #334155; }
        </style>
        <rect x="${vp.width / 2 - 160}" y="30" width="320" height="320" rx="16" fill="#FFFFFF" stroke="#E7E2D6" stroke-width="1"/>
        <text x="${vp.width / 2 - 70}" y="82"><tspan class="ac">Crowd </tspan><tspan class="ar">Report</tspan></text>
        <text x="${vp.width / 2 - 130}" y="125" class="h1">Sign in to Citizen Portal</text>
        <text x="${vp.width / 2 - 130}" y="160" class="lbl">Email Address</text>
        <rect x="${vp.width / 2 - 130}" y="170" width="260" height="40" rx="8" fill="#F8FAFC" stroke="#CBD5E1"/>
        <text x="${vp.width / 2 - 130}" y="235" class="lbl">Password</text>
        <rect x="${vp.width / 2 - 130}" y="245" width="260" height="40" rx="8" fill="#F8FAFC" stroke="#CBD5E1"/>
        <rect x="${vp.width / 2 - 130}" y="300" width="260" height="42" rx="8" fill="#E8A33D"/>
        <text x="${vp.width / 2 - 25}" y="326" font-family="-apple-system, sans-serif" font-size="14px" font-weight="700" fill="#0A1F44">Sign In</text>
      </svg>
    `);

    await sharp({
      create: {
        width: vp.width,
        height: 380,
        channels: 4,
        background: { r: 250, g: 248, b: 243, alpha: 1 }
      }
    })
      .composite([
        { input: authCardSvg, left: 0, top: 0 },
        { input: markPng, left: Math.round(vp.width / 2 - 110), top: 58 }
      ])
      .png()
      .toFile(path.join(OUT_DIR, `auth-login-${vp.name}.png`));

    console.log(`✓ Rendered Auth Login at ${vp.name}`);
  }

  // 4. DASHBOARD SIDEBAR (Admin Navy Sidebar & User White Sidebar)
  const markSmallNavy = await renderMark(logoWhiteSvg, 28); // --logo-h-sm
  const markSmallLight = await renderMark(logoLightSvg, 28);

  const dashSvg = Buffer.from(`
    <svg width="600" height="180" xmlns="http://www.w3.org/2000/svg">
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,600&amp;display=swap');
        .tc { font-family: 'Fraunces', Georgia, serif; font-size: 18px; font-weight: 600; fill: #FFFFFF; }
        .tr { font-family: 'Fraunces', Georgia, serif; font-size: 18px; font-weight: 600; fill: #E8A33D; }
        .tsub { font-family: -apple-system, sans-serif; font-size: 10px; font-weight: 600; fill: #94A3B8; }
        .lc { font-family: 'Fraunces', Georgia, serif; font-size: 18px; font-weight: 600; fill: #0A1F44; }
        .lr { font-family: 'Fraunces', Georgia, serif; font-size: 18px; font-weight: 600; fill: #E8A33D; }
        .lsub { font-family: -apple-system, sans-serif; font-size: 10px; font-weight: 600; fill: #5B6577; }
      </style>
      <!-- Admin Dark Sidebar Header -->
      <rect x="20" y="20" width="260" height="140" rx="12" fill="#0F1123" stroke="#1E2342"/>
      <text x="66" y="55"><tspan class="tc">Crowd </tspan><tspan class="tr">Report</tspan></text>
      <text x="66" y="70" class="tsub">MUNICIPAL SECRETARIAT</text>
      <rect x="36" y="95" width="228" height="32" rx="8" fill="#0A1F44"/>
      <text x="50" y="115" font-family="-apple-system, sans-serif" font-size="12px" fill="#FFFFFF">Executive Overview</text>

      <!-- User/Resolver Light Sidebar Header -->
      <rect x="320" y="20" width="260" height="140" rx="12" fill="#FFFFFF" stroke="#E7E2D6"/>
      <text x="366" y="55"><tspan class="lc">Crowd </tspan><tspan class="lr">Report</tspan></text>
      <text x="366" y="70" class="lsub">CITIZEN PORTAL</text>
      <rect x="336" y="95" width="228" height="32" rx="8" fill="#EBF1FA"/>
      <text x="350" y="115" font-family="-apple-system, sans-serif" font-size="12px" fill="#0A1F44">My Grievance Tickets</text>
    </svg>
  `);

  await sharp({
    create: {
      width: 600,
      height: 180,
      channels: 4,
      background: { r: 245, g: 247, b: 250, alpha: 1 }
    }
  })
    .composite([
      { input: dashSvg, left: 0, top: 0 },
      { input: markSmallNavy, left: 36, top: 40 },
      { input: markSmallLight, left: 336, top: 40 }
    ])
    .png()
    .toFile(path.join(OUT_DIR, 'dashboards-sidebar.png'));

  console.log('✓ Rendered Dashboards sidebars');
}

renderScreens().catch(console.error);
