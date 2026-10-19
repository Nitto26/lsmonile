const fs = require('fs');
const path = require('path');

const targetDir = path.join(__dirname, '..', 'public', 'images', 'products');
const heroDir = path.join(__dirname, '..', 'public', 'images', 'hero');

if (!fs.existsSync(targetDir)) fs.mkdirSync(targetDir, { recursive: true });
if (!fs.existsSync(heroDir)) fs.mkdirSync(heroDir, { recursive: true });

function svgWrapper(content, width = 400, height = 400) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}" fill="none">
    ${content}
  </svg>`;
}

// 1. iPhone 15 Front/Back (Figma exact blue phone with rounded chassis and pill island)
const iphoneSvg = svgWrapper(`
  <defs>
    <linearGradient id="phoneBody" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#1E3A8A" />
      <stop offset="100%" stop-color="#0F172A" />
    </linearGradient>
    <linearGradient id="screenGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#3B82F6" />
      <stop offset="100%" stop-color="#1D4ED8" />
    </linearGradient>
    <filter id="phoneShadow" x="-10%" y="-10%" width="120%" height="130%" filterUnits="userSpaceOnUse">
      <feDropShadow dx="0" dy="12" stdDeviation="16" flood-color="#1E3A8A" flood-opacity="0.25" />
    </filter>
  </defs>
  <!-- Main Phone Body -->
  <rect x="110" y="40" width="180" height="320" rx="36" fill="url(#phoneBody)" filter="url(#phoneShadow)" stroke="#3B82F6" stroke-width="2" />
  <!-- Inner Screen -->
  <rect x="118" y="48" width="164" height="304" rx="30" fill="url(#screenGrad)" />
  <!-- Dynamic Island -->
  <rect x="168" y="58" width="64" height="14" rx="7" fill="#0F172A" />
  <circle cx="218" cy="65" r="3" fill="#1E293B" />
  <!-- Wallpaper Graphic -->
  <circle cx="200" cy="200" r="60" fill="#60A5FA" opacity="0.3" />
  <circle cx="200" cy="200" r="40" fill="#93C5FD" opacity="0.4" />
  <!-- Home Indicator bar -->
  <rect x="165" y="340" width="70" height="4" rx="2" fill="#FFFFFF" opacity="0.8" />
`);

const iphoneFrontSvg = iphoneSvg;

const iphoneBackSvg = svgWrapper(`
  <defs>
    <linearGradient id="backGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#1E40AF" />
      <stop offset="100%" stop-color="#172554" />
    </linearGradient>
    <filter id="backShadow" x="-10%" y="-10%" width="120%" height="130%" filterUnits="userSpaceOnUse">
      <feDropShadow dx="0" dy="12" stdDeviation="16" flood-color="#1E3A8A" flood-opacity="0.25" />
    </filter>
  </defs>
  <rect x="110" y="40" width="180" height="320" rx="36" fill="url(#backGrad)" filter="url(#backShadow)" stroke="#60A5FA" stroke-width="1.5" />
  <!-- Camera Island -->
  <rect x="125" y="55" width="75" height="75" rx="20" fill="#0F172A" opacity="0.9" />
  <!-- Top Lens -->
  <circle cx="150" cy="80" r="14" fill="#1E293B" stroke="#60A5FA" stroke-width="2" />
  <circle cx="150" cy="80" r="8" fill="#090D16" />
  <!-- Bottom Lens -->
  <circle cx="175" cy="105" r="14" fill="#1E293B" stroke="#60A5FA" stroke-width="2" />
  <circle cx="175" cy="105" r="8" fill="#090D16" />
  <!-- Flash & Mic -->
  <circle cx="180" cy="72" r="4" fill="#FDE047" />
  <circle cx="145" cy="112" r="2.5" fill="#334155" />
  <!-- Apple Logo Outline -->
  <circle cx="200" cy="200" r="14" fill="#60A5FA" opacity="0.2" />
`);

const iphoneSideSvg = svgWrapper(`
  <rect x="185" y="40" width="30" height="320" rx="15" fill="#1E3A8A" stroke="#3B82F6" stroke-width="2" />
  <rect x="180" y="90" width="5" height="24" rx="2" fill="#60A5FA" />
  <rect x="180" y="125" width="5" height="35" rx="2" fill="#60A5FA" />
  <rect x="180" y="170" width="5" height="35" rx="2" fill="#60A5FA" />
  <rect x="215" y="130" width="5" height="50" rx="2" fill="#60A5FA" />
`);

const iphoneCameraSvg = svgWrapper(`
  <rect x="80" y="80" width="240" height="240" rx="48" fill="#0F172A" stroke="#3B82F6" stroke-width="3" />
  <circle cx="150" cy="150" r="42" fill="#1E293B" stroke="#60A5FA" stroke-width="5" />
  <circle cx="150" cy="150" r="24" fill="#030712" />
  <circle cx="140" cy="140" r="6" fill="#38BDF8" opacity="0.6" />
  <circle cx="250" cy="250" r="42" fill="#1E293B" stroke="#60A5FA" stroke-width="5" />
  <circle cx="250" cy="250" r="24" fill="#030712" />
  <circle cx="240" cy="240" r="6" fill="#38BDF8" opacity="0.6" />
  <circle cx="250" cy="130" r="14" fill="#FDE047" />
  <circle cx="140" cy="260" r="8" fill="#334155" />
`);

// 2. Samsung S24
const samsungS24Svg = svgWrapper(`
  <defs>
    <linearGradient id="samBody" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#1E3A8A" />
      <stop offset="100%" stop-color="#0284C7" />
    </linearGradient>
  </defs>
  <rect x="110" y="35" width="180" height="330" rx="28" fill="#0F172A" stroke="#38BDF8" stroke-width="2" />
  <rect x="118" y="43" width="164" height="314" rx="22" fill="url(#samBody)" />
  <circle cx="200" cy="55" r="4" fill="#0F172A" />
  <circle cx="200" cy="200" r="55" fill="#38BDF8" opacity="0.3" />
  <path d="M150 200 L250 200" stroke="#E0F2FE" stroke-width="3" opacity="0.7" />
  <rect x="170" y="346" width="60" height="3" rx="1.5" fill="#FFFFFF" opacity="0.8" />
`);

const samsungBackSvg = svgWrapper(`
  <rect x="110" y="35" width="180" height="330" rx="28" fill="#1E293B" stroke="#64748B" stroke-width="2" />
  <circle cx="145" cy="75" r="14" fill="#0F172A" stroke="#94A3B8" stroke-width="3" />
  <circle cx="145" cy="120" r="14" fill="#0F172A" stroke="#94A3B8" stroke-width="3" />
  <circle cx="145" cy="165" r="14" fill="#0F172A" stroke="#94A3B8" stroke-width="3" />
  <circle cx="180" cy="85" r="5" fill="#FACC15" />
  <text x="200" y="320" text-anchor="middle" fill="#94A3B8" font-family="sans-serif" font-size="12" font-weight="bold" letter-spacing="3">SAMSUNG</text>
`);

// 3. Headphones (Sony WH-CH720N) matching Figma icon
const headphonesSvg = svgWrapper(`
  <defs>
    <filter id="headphoneShadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="8" stdDeviation="12" flood-color="#000000" flood-opacity="0.15" />
    </filter>
  </defs>
  <!-- Headband arch -->
  <path d="M100 220 C100 110, 300 110, 300 220" fill="none" stroke="#0F172A" stroke-width="24" stroke-linecap="round" filter="url(#headphoneShadow)" />
  <!-- Left Ear Cup -->
  <rect x="80" y="195" width="46" height="85" rx="23" fill="#1E293B" stroke="#334155" stroke-width="3" />
  <rect x="94" y="210" width="18" height="55" rx="9" fill="#0F172A" />
  <!-- Right Ear Cup -->
  <rect x="274" y="195" width="46" height="85" rx="23" fill="#1E293B" stroke="#334155" stroke-width="3" />
  <rect x="288" y="210" width="18" height="55" rx="9" fill="#0F172A" />
  <!-- Accent highlight -->
  <path d="M140 125 C175 110, 225 110, 260 125" fill="none" stroke="#38BDF8" stroke-width="3" opacity="0.6" />
`);

// 4. boAt Airdopes (Earbuds in charging case)
const airdopesSvg = svgWrapper(`
  <defs>
    <linearGradient id="caseGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#F8FAFC" />
      <stop offset="100%" stop-color="#E2E8F0" />
    </linearGradient>
  </defs>
  <!-- Charging Case -->
  <rect x="120" y="110" width="160" height="180" rx="55" fill="url(#caseGrad)" stroke="#CBD5E1" stroke-width="3" />
  <line x1="120" y1="180" x2="280" y2="180" stroke="#94A3B8" stroke-width="2" />
  <circle cx="200" cy="210" r="5" fill="#3B82F6" />
  <!-- Earbuds silhouettes -->
  <path d="M160 80 Q160 110 160 140" stroke="#0F172A" stroke-width="12" stroke-linecap="round" />
  <circle cx="160" cy="75" r="14" fill="#0F172A" />
  <path d="M240 80 Q240 110 240 140" stroke="#0F172A" stroke-width="12" stroke-linecap="round" />
  <circle cx="240" cy="75" r="14" fill="#0F172A" />
`);

// 5. Smart Watch (Noise ColorFit Pro 5)
const watchSvg = svgWrapper(`
  <!-- Straps -->
  <rect x="160" y="30" width="80" height="110" rx="12" fill="#1E293B" />
  <rect x="160" y="260" width="80" height="110" rx="12" fill="#1E293B" />
  <!-- Watch Body -->
  <rect x="125" y="115" width="150" height="170" rx="36" fill="#0F172A" stroke="#38BDF8" stroke-width="3" />
  <rect x="135" y="125" width="130" height="150" rx="28" fill="#1E3A8A" />
  <!-- Crown Button -->
  <rect x="276" y="165" width="10" height="28" rx="5" fill="#94A3B8" />
  <!-- Screen Elements -->
  <text x="200" y="185" text-anchor="middle" fill="#FFFFFF" font-family="sans-serif" font-size="28" font-weight="bold">10:45</text>
  <text x="200" y="215" text-anchor="middle" fill="#38BDF8" font-family="sans-serif" font-size="12" font-weight="600">8,420 STEPS</text>
  <circle cx="170" cy="245" r="6" fill="#EF4444" />
  <text x="200" y="250" text-anchor="middle" fill="#F8FAFC" font-family="sans-serif" font-size="12">78 BPM</text>
`);

// 6. 20W Charger
const chargerSvg = svgWrapper(`
  <defs>
    <filter id="chargerGlow">
      <feDropShadow dx="0" dy="10" stdDeviation="14" flood-color="#000000" flood-opacity="0.1" />
    </filter>
  </defs>
  <!-- Pins -->
  <rect x="160" y="60" width="16" height="50" rx="8" fill="#94A3B8" />
  <rect x="224" y="60" width="16" height="50" rx="8" fill="#94A3B8" />
  <!-- Charger Block -->
  <rect x="120" y="100" width="160" height="180" rx="32" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="3" filter="url(#chargerGlow)" />
  <!-- Type-C port on bottom -->
  <rect x="175" y="240" width="50" height="16" rx="8" fill="#0F172A" stroke="#94A3B8" stroke-width="1.5" />
  <text x="200" y="180" text-anchor="middle" fill="#64748B" font-family="sans-serif" font-size="14" font-weight="bold">20W PD</text>
`);

// 7. Fast Charging Cable
const cableSvg = svgWrapper(`
  <path d="M80 320 C80 180, 320 320, 320 180 C320 80, 200 80, 200 150" fill="none" stroke="#2563EB" stroke-width="12" stroke-linecap="round" />
  <path d="M80 320 C80 180, 320 320, 320 180 C320 80, 200 80, 200 150" fill="none" stroke="#93C5FD" stroke-width="4" stroke-linecap="round" stroke-dasharray="10 10" />
  <!-- Metal Connector Left -->
  <rect x="65" y="310" width="30" height="45" rx="6" fill="#1E293B" stroke="#60A5FA" stroke-width="2" />
  <rect x="73" y="355" width="14" height="20" rx="3" fill="#94A3B8" />
  <!-- Metal Connector Right -->
  <rect x="185" y="130" width="30" height="45" rx="6" fill="#1E293B" stroke="#60A5FA" stroke-width="2" transform="rotate(-30 200 150)" />
`);

// 8. OnePlus 12R
const oneplusSvg = svgWrapper(`
  <rect x="110" y="35" width="180" height="330" rx="30" fill="#0F172A" stroke="#60A5FA" stroke-width="2" />
  <rect x="118" y="43" width="164" height="314" rx="24" fill="#1E293B" />
  <!-- Circular Deco Camera -->
  <circle cx="200" cy="140" r="50" fill="#0F172A" stroke="#3B82F6" stroke-width="3" />
  <circle cx="185" cy="130" r="14" fill="#1E293B" />
  <circle cx="215" cy="130" r="14" fill="#1E293B" />
  <circle cx="200" cy="160" r="12" fill="#1E293B" />
  <text x="200" y="270" text-anchor="middle" fill="#EF4444" font-family="sans-serif" font-size="20" font-weight="900">1+</text>
`);

// 9. iPad Air
const ipadSvg = svgWrapper(`
  <rect x="80" y="50" width="240" height="300" rx="24" fill="#0F172A" stroke="#38BDF8" stroke-width="2" />
  <rect x="90" y="60" width="220" height="280" rx="16" fill="#1E3A8A" />
  <circle cx="200" cy="200" r="60" fill="#38BDF8" opacity="0.3" />
  <rect x="180" y="330" width="40" height="3" rx="1.5" fill="#FFFFFF" />
`);

// 10. Power Bank
const powerbankSvg = svgWrapper(`
  <rect x="120" y="80" width="160" height="240" rx="20" fill="#1E293B" stroke="#3B82F6" stroke-width="2" />
  <rect x="140" y="100" width="120" height="40" rx="8" fill="#0F172A" />
  <circle cx="160" cy="120" r="4" fill="#10B981" />
  <circle cx="180" cy="120" r="4" fill="#10B981" />
  <circle cx="200" cy="120" r="4" fill="#10B981" />
  <circle cx="220" cy="120" r="4" fill="#10B981" />
  <text x="200" y="230" text-anchor="middle" fill="#FFFFFF" font-family="sans-serif" font-size="18" font-weight="bold">20,000</text>
  <text x="200" y="255" text-anchor="middle" fill="#60A5FA" font-family="sans-serif" font-size="12">mAh Fast Charge</text>
`);

// 11. Hero phones graphic (both front & back phone side-by-side with 30% off floating circle badge)
const heroPhonesSvg = svgWrapper(`
  <defs>
    <filter id="heroShadow" x="-10%" y="-10%" width="130%" height="130%">
      <feDropShadow dx="0" dy="16" stdDeviation="24" flood-color="#1E3A8A" flood-opacity="0.35" />
    </filter>
    <linearGradient id="heroBlue" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#2563EB" />
      <stop offset="100%" stop-color="#1D4ED8" />
    </linearGradient>
  </defs>
  
  <!-- Left Phone (Back View) -->
  <g transform="translate(60, 40)" filter="url(#heroShadow)">
    <rect x="0" y="0" width="160" height="290" rx="32" fill="#0F172A" stroke="#3B82F6" stroke-width="2" />
    <!-- Camera block -->
    <rect x="14" y="14" width="60" height="60" rx="16" fill="#1E293B" />
    <circle cx="34" cy="34" r="11" fill="#020617" stroke="#60A5FA" stroke-width="2" />
    <circle cx="54" cy="54" r="11" fill="#020617" stroke="#60A5FA" stroke-width="2" />
    <circle cx="56" cy="26" r="3" fill="#FACC15" />
  </g>

  <!-- Right Phone (Front View with glowing blue screen) -->
  <g transform="translate(190, 20)" filter="url(#heroShadow)">
    <rect x="0" y="0" width="165" height="310" rx="34" fill="#0B132B" stroke="#60A5FA" stroke-width="2.5" />
    <rect x="8" y="8" width="149" height="294" rx="28" fill="url(#heroBlue)" />
    <!-- Island -->
    <rect x="52" y="16" width="45" height="12" rx="6" fill="#0B132B" />
    <!-- Screen graphic circles -->
    <circle cx="82" cy="155" r="50" fill="#60A5FA" opacity="0.3" />
    <circle cx="82" cy="155" r="30" fill="#93C5FD" opacity="0.4" />
    <!-- Indicator -->
    <rect x="55" y="285" width="40" height="3" rx="1.5" fill="#FFFFFF" opacity="0.8" />
  </g>

  <!-- UP TO 30% OFF Circle Badge matching Figma Screen 1 -->
  <g transform="translate(370, 70)" filter="url(#heroShadow)">
    <circle cx="65" cy="65" r="65" fill="#1D4ED8" stroke="#60A5FA" stroke-width="2" />
    <text x="65" y="52" text-anchor="middle" fill="#FFFFFF" font-family="system-ui, -apple-system, sans-serif" font-size="14" font-weight="800" letter-spacing="1">UP TO</text>
    <text x="65" y="78" text-anchor="middle" fill="#FFFFFF" font-family="system-ui, -apple-system, sans-serif" font-size="28" font-weight="900">30%</text>
    <text x="65" y="98" text-anchor="middle" fill="#93C5FD" font-family="system-ui, -apple-system, sans-serif" font-size="14" font-weight="800" letter-spacing="2">OFF</text>
  </g>
`, 540, 380);

const files = {
  'iphone-15.svg': iphoneSvg,
  'iphone-15-front.svg': iphoneFrontSvg,
  'iphone-15-back.svg': iphoneBackSvg,
  'iphone-15-side.svg': iphoneSideSvg,
  'iphone-15-camera.svg': iphoneCameraSvg,
  'samsung-s24.svg': samsungS24Svg,
  'samsung-s24-back.svg': samsungBackSvg,
  'samsung-s24-side.svg': iphoneSideSvg,
  'samsung-s24-camera.svg': iphoneCameraSvg,
  'sony-headphones.svg': headphonesSvg,
  'sony-headphones-side.svg': headphonesSvg,
  'sony-headphones-folded.svg': headphonesSvg,
  'boat-airdopes.svg': airdopesSvg,
  'boat-airdopes-open.svg': airdopesSvg,
  'noise-watch.svg': watchSvg,
  'noise-watch-straps.svg': watchSvg,
  'charger-20w.svg': chargerSvg,
  'charging-cable.svg': cableSvg,
  'oneplus-12r.svg': oneplusSvg,
  'ipad-air.svg': ipadSvg,
  'powerbank.svg': powerbankSvg,
  'redmi-note-13.svg': samsungS24Svg,
  'vivo-v30.svg': samsungS24Svg,
};

for (const [name, content] of Object.entries(files)) {
  fs.writeFileSync(path.join(targetDir, name), content);
}

fs.writeFileSync(path.join(heroDir, 'hero-phones.svg'), heroPhonesSvg);
console.log('Successfully generated all product and hero SVG assets matching Figma!');
