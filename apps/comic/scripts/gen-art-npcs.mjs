// Vector portraits for the two expansion merchants, same 1122×1402 frame as the painted six.
import { mkdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
const out = resolve('src/appraisal-client/public/art');
mkdirSync(out, { recursive: true });

const counter = (wood1, wood2) => `<rect x="0" y="1230" width="1122" height="172" fill="url(#plank)"/><rect x="0" y="1222" width="1122" height="16" fill="${wood1}"/><g stroke="${wood2}" stroke-width="2" opacity=".55"><path d="M0 1290 H1122 M0 1346 H1122"/><path d="M200 1238 V1402 M520 1238 V1402 M840 1238 V1402" opacity=".6"/></g>`;
const rnd = (seed) => { let s = seed; return () => (s = (s * 16807) % 2147483647) / 2147483647; };

// ---- Deep Sea Monster (cthulhu-like) ----
const tentacles = (() => {
  const paths = [
    'M470 650 C 380 760 400 860 330 960 C 290 1020 330 1090 400 1060',
    'M505 676 C 460 800 500 900 440 1010 C 410 1070 450 1130 520 1100',
    'M545 690 C 540 820 580 930 540 1050 C 520 1110 560 1160 620 1130',
    'M580 690 C 600 820 560 930 610 1050 C 630 1110 600 1170 670 1150',
    'M618 676 C 670 800 640 900 700 1010 C 730 1070 700 1130 770 1100',
    'M652 650 C 740 760 720 860 790 960 C 830 1020 790 1090 720 1060',
  ];
  return paths.map((d, i) => `<g><path d="${d}" fill="none" stroke="#10241f" stroke-width="${58 - i % 2 * 4}" stroke-linecap="round"/><path d="${d}" fill="none" stroke="url(#skin2)" stroke-width="${46 - i % 2 * 4}" stroke-linecap="round"/><path d="${d}" fill="none" stroke="#c7f0d8" stroke-opacity=".55" stroke-width="9" stroke-linecap="round" stroke-dasharray="0 24"/><path d="${d}" fill="none" stroke="#fff" stroke-opacity=".12" stroke-width="10" stroke-linecap="round" transform="translate(-9 -4)"/></g>`).join('');
})();
const bubbles = (() => { const r = rnd(7); return Array.from({ length: 46 }, () => `<circle cx="${(r() * 1122).toFixed(0)}" cy="${(r() * 1100).toFixed(0)}" r="${(3 + r() * 12).toFixed(1)}" fill="none" stroke="#9fe8ee" stroke-opacity="${(.12 + r() * .3).toFixed(2)}" stroke-width="2"/>`).join(''); })();
const dots = (() => { const r = rnd(11); return Array.from({ length: 34 }, () => { const a = r() * Math.PI * 2, d = 60 + r() * 220; return `<circle cx="${(561 + Math.cos(a) * d * 1.05).toFixed(0)}" cy="${(480 + Math.sin(a) * d * .95).toFixed(0)}" r="${(2 + r() * 4).toFixed(1)}" fill="#6ff0e6" opacity="${(.4 + r() * .5).toFixed(2)}"/>`; }).join(''); })();
const deepsea = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1122 1402" width="1122" height="1402" role="img"><title>อสูรใต้ทะเลลึก</title><defs>
<linearGradient id="sea" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0b3a4a"/><stop offset=".55" stop-color="#05202c"/><stop offset="1" stop-color="#010a10"/></linearGradient>
<radialGradient id="skin" cx=".4" cy=".3" r=".9"><stop offset="0" stop-color="#7fae96"/><stop offset=".5" stop-color="#3d6e5d"/><stop offset="1" stop-color="#16322c"/></radialGradient>
<linearGradient id="skin2" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#7fb69c"/><stop offset="1" stop-color="#2a5446"/></linearGradient>
<radialGradient id="eye" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#fff9a8"/><stop offset=".5" stop-color="#d6e83a"/><stop offset="1" stop-color="#3c5a10"/></radialGradient>
<linearGradient id="plank" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#4a3a2c"/><stop offset="1" stop-color="#1c140e"/></linearGradient>
<linearGradient id="ray" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8fe8f0" stop-opacity=".28"/><stop offset="1" stop-color="#8fe8f0" stop-opacity="0"/></linearGradient>
<filter id="glow" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="9" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
<filter id="blur"><feGaussianBlur stdDeviation="18"/></filter></defs>
<rect width="1122" height="1402" fill="url(#sea)"/>
<g fill="url(#ray)"><polygon points="180,0 330,0 520,900 260,900"/><polygon points="520,0 640,0 760,1000 560,1000"/><polygon points="800,0 900,0 1060,880 880,880"/></g>${bubbles}
<g fill="#0a1a1c" stroke="#06100f" stroke-width="3"><path d="M120 760 Q60 520 150 300 Q190 460 260 520 Q250 640 330 760Z"/><path d="M1002 760 Q1062 520 972 300 Q932 460 862 520 Q872 640 792 760Z"/></g>
<g stroke="#2b5d55" stroke-width="2" opacity=".6" fill="none"><path d="M150 300 L240 640 M150 300 L200 560 M972 300 L882 640 M972 300 L922 560"/></g>
<path d="M60 1240 Q80 900 250 800 Q400 740 561 760 Q720 740 872 800 Q1042 900 1062 1240Z" fill="url(#skin)" stroke="#0e221e" stroke-width="4"/>
<g fill="#0f2a25" opacity=".55">${(() => { const r = rnd(5); return Array.from({ length: 80 }, () => `<ellipse cx="${(130 + r() * 860).toFixed(0)}" cy="${(850 + r() * 330).toFixed(0)}" rx="${(8 + r() * 10).toFixed(0)}" ry="${(6 + r() * 7).toFixed(0)}"/>`).join(''); })()}</g>
<ellipse cx="561" cy="500" rx="262" ry="318" fill="url(#skin)" stroke="#0e221e" stroke-width="5"/>
<path d="M330 330 Q561 200 792 330" fill="none" stroke="#264a40" stroke-width="10" opacity=".7"/><path d="M350 270 Q561 150 772 270" fill="none" stroke="#264a40" stroke-width="8" opacity=".5"/><path d="M400 215 Q561 120 722 215" fill="none" stroke="#264a40" stroke-width="6" opacity=".4"/>
<g fill="#cfd8c2" stroke="#7d8a70" stroke-width="2" opacity=".85">${[[330, 360, 18], [372, 300, 14], [790, 380, 20], [750, 290, 13], [300, 520, 12], [828, 540, 15], [600, 190, 11]].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}"/><circle cx="${x}" cy="${y}" r="${r * .5}" fill="#8a9680"/>`).join('')}</g>${dots}
<path d="M330 470 Q420 410 500 470" fill="none" stroke="#12302a" stroke-width="22" stroke-linecap="round"/><path d="M792 470 Q702 410 622 470" fill="none" stroke="#12302a" stroke-width="22" stroke-linecap="round"/>
<g filter="url(#glow)"><ellipse cx="438" cy="520" rx="68" ry="56" fill="#0a1512"/><ellipse cx="684" cy="520" rx="68" ry="56" fill="#0a1512"/><ellipse cx="438" cy="520" rx="52" ry="42" fill="url(#eye)"/><ellipse cx="684" cy="520" rx="52" ry="42" fill="url(#eye)"/></g>
<ellipse cx="438" cy="520" rx="9" ry="38" fill="#0a0f06"/><ellipse cx="684" cy="520" rx="9" ry="38" fill="#0a0f06"/><circle cx="420" cy="500" r="9" fill="#fff" opacity=".8"/><circle cx="666" cy="500" r="9" fill="#fff" opacity=".8"/>
<path d="M530 600 Q561 560 592 600 Q580 640 561 640 Q542 640 530 600Z" fill="#12302a"/><ellipse cx="548" cy="606" rx="6" ry="10" fill="#050d0b"/><ellipse cx="574" cy="606" rx="6" ry="10" fill="#050d0b"/>
<path d="M420 640 Q561 720 702 640 Q690 700 561 726 Q432 700 420 640Z" fill="#12302a"/>${tentacles}
<g stroke="#9fe8d0" stroke-width="3" opacity=".5" fill="none"><path d="M330 600 Q380 640 440 660 M792 600 Q742 640 682 660"/></g>
<ellipse cx="780" cy="1186" rx="62" ry="62" fill="#8fe8f0" opacity=".25" filter="url(#blur)"/><circle cx="780" cy="1186" r="38" fill="#dff6ff" stroke="#8fe8f0" stroke-width="3" filter="url(#glow)"/><ellipse cx="768" cy="1172" rx="12" ry="7" fill="#fff" transform="rotate(-30 768 1172)"/>
<g transform="translate(180 1150)"><path d="M0 70 Q0 10 60 10 Q120 10 120 70 Z" fill="#3a2a22" stroke="#1c1410" stroke-width="3"/><path d="M20 70 Q30 30 60 28 Q90 30 100 70" fill="none" stroke="#6a5444" stroke-width="3"/></g>
${counter('#5a4636', '#1c140e')}</svg>\n`;

// ---- The Swarm (humanoid × insect) ----
const wingVeins = (x, y, flip) => `<g transform="translate(${x} ${y}) scale(${flip} 1)"><path d="M0 0 Q-180 -240 -330 -90 Q-380 60 -150 130 Q-40 140 0 60Z" fill="#e8c27a" fill-opacity=".16" stroke="#e8c27a" stroke-opacity=".5" stroke-width="3"/><g stroke="#e8c27a" stroke-opacity=".4" stroke-width="2" fill="none"><path d="M0 20 Q-120 -40 -300 -70"/><path d="M0 40 Q-140 10 -330 0"/><path d="M0 55 Q-130 70 -300 90"/><path d="M-120 -30 L-150 110 M-210 -50 L-230 100"/></g></g>`;
const hexPattern = `<pattern id="facet" width="22" height="19" patternUnits="userSpaceOnUse" patternTransform="rotate(0)"><polygon points="11,1 20,6 20,15 11,20 2,15 2,6" fill="none" stroke="#3a0d06" stroke-width="2" opacity=".85"/></pattern>`;
const swarmCloud = (() => { const r = rnd(23); return Array.from({ length: 70 }, () => { const x = 60 + r() * 1000, y = 120 + r() * 700, s = 6 + r() * 10; return `<g transform="translate(${x.toFixed(0)} ${y.toFixed(0)}) rotate(${(r() * 360).toFixed(0)})" opacity="${(.25 + r() * .5).toFixed(2)}"><ellipse cx="0" cy="0" rx="${s}" ry="${s * .45}" fill="#1c1208"/><ellipse cx="${-s * .5}" cy="${-s * .7}" rx="${s * .6}" ry="${s * .22}" fill="#e8c27a" opacity=".55"/><ellipse cx="${-s * .5}" cy="${s * .7}" rx="${s * .6}" ry="${s * .22}" fill="#e8c27a" opacity=".55"/></g>`; }).join(''); })();
const hiveBg = (() => { const cells = []; for (let r = 0; r < 14; r++) for (let c = 0; c < 10; c++) { const x = c * 126 + (r % 2) * 63, y = r * 110; cells.push(`<polygon points="${[0, 1, 2, 3, 4, 5].map(i => `${(x + Math.cos(Math.PI / 3 * i + Math.PI / 6) * 62).toFixed(0)},${(y + Math.sin(Math.PI / 3 * i + Math.PI / 6) * 62).toFixed(0)}`).join(' ')}" fill="none" stroke="#c88a1e" stroke-opacity=".13" stroke-width="3"/>`); } return cells.join(''); })();
const antenna = (flip) => `<g transform="translate(${561 + flip * 70} 330) scale(${flip} 1)"><path d="M0 0 C 40 -140 140 -240 250 -250" fill="none" stroke="#1b1008" stroke-width="12" stroke-linecap="round"/><path d="M0 0 C 40 -140 140 -240 250 -250" fill="none" stroke="#6a4a22" stroke-width="5" stroke-linecap="round" stroke-dasharray="26 8"/><circle cx="256" cy="-251" r="16" fill="#e8a02a" stroke="#1b1008" stroke-width="3"/></g>`;
const swarm = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1122 1402" width="1122" height="1402" role="img"><title>The Swarm ฝูงมนุษย์แมลง</title><defs>${hexPattern}
<radialGradient id="hive" cx=".5" cy=".4" r=".85"><stop offset="0" stop-color="#6a4412"/><stop offset=".55" stop-color="#2b1a0a"/><stop offset="1" stop-color="#0c0703"/></radialGradient>
<linearGradient id="chitin" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#7a5a34"/><stop offset=".4" stop-color="#3a2512"/><stop offset="1" stop-color="#120a05"/></linearGradient>
<radialGradient id="head" cx=".4" cy=".3" r=".9"><stop offset="0" stop-color="#8a6a40"/><stop offset=".5" stop-color="#3e2813"/><stop offset="1" stop-color="#150c05"/></radialGradient>
<radialGradient id="eyeS" cx=".35" cy=".3" r=".8"><stop offset="0" stop-color="#ffd27a"/><stop offset=".45" stop-color="#d9531a"/><stop offset="1" stop-color="#5a1308"/></radialGradient>
<linearGradient id="plank" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5a4128"/><stop offset="1" stop-color="#1c140e"/></linearGradient>
<filter id="glow" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="8" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>
<rect width="1122" height="1402" fill="url(#hive)"/>${hiveBg}${swarmCloud}
${wingVeins(430, 760, 1)}${wingVeins(692, 760, -1)}
<path d="M110 1240 Q130 920 300 830 Q430 770 561 790 Q692 770 822 830 Q992 920 1012 1240Z" fill="url(#chitin)" stroke="#0c0703" stroke-width="4"/>
<g fill="url(#chitin)" stroke="#0c0703" stroke-width="4"><path d="M170 880 Q170 790 290 770 Q360 820 350 900 Q260 930 170 880Z"/><path d="M952 880 Q952 790 832 770 Q762 820 772 900 Q862 930 952 880Z"/></g>
<g fill="none" stroke="#b8863a" stroke-opacity=".5" stroke-width="3"><path d="M190 870 Q260 900 340 880 M200 840 Q270 860 330 850 M932 870 Q862 900 782 880 M922 840 Q852 860 792 850"/><path d="M430 920 L430 1220 M561 900 L561 1220 M692 920 L692 1220" opacity=".4"/></g>
<g fill="#0c0703" opacity=".5"><path d="M400 900 Q561 960 722 900 L722 940 Q561 1000 400 940Z"/><path d="M420 980 Q561 1040 702 980 L702 1020 Q561 1080 420 1020Z"/></g>
<rect x="510" y="690" width="102" height="130" rx="30" fill="url(#chitin)" stroke="#0c0703" stroke-width="4"/><g stroke="#b8863a" stroke-opacity=".5" stroke-width="3"><path d="M512 730 H610 M512 770 H610"/></g>
${antenna(-1)}${antenna(1)}
<path d="M561 190 C 700 190 800 330 780 500 C 765 640 680 740 561 760 C 442 740 357 640 342 500 C 322 330 422 190 561 190Z" fill="url(#head)" stroke="#0c0703" stroke-width="5"/>
<path d="M440 230 Q561 170 682 230" fill="none" stroke="#c9a15c" stroke-opacity=".5" stroke-width="6"/><path d="M561 190 L561 330" stroke="#c9a15c" stroke-opacity=".35" stroke-width="5"/>
<g filter="url(#glow)"><ellipse cx="432" cy="470" rx="112" ry="140" transform="rotate(-14 432 470)" fill="url(#eyeS)" stroke="#2a0c06" stroke-width="5"/><ellipse cx="690" cy="470" rx="112" ry="140" transform="rotate(14 690 470)" fill="url(#eyeS)" stroke="#2a0c06" stroke-width="5"/></g>
<ellipse cx="432" cy="470" rx="112" ry="140" transform="rotate(-14 432 470)" fill="url(#facet)"/><ellipse cx="690" cy="470" rx="112" ry="140" transform="rotate(14 690 470)" fill="url(#facet)"/>
<ellipse cx="392" cy="410" rx="30" ry="46" fill="#fff" opacity=".35" transform="rotate(-30 392 410)"/><ellipse cx="650" cy="410" rx="30" ry="46" fill="#fff" opacity=".35" transform="rotate(30 650 410)"/>
<path d="M526 520 Q561 490 596 520 L586 600 Q561 620 536 600Z" fill="#241608" stroke="#0c0703" stroke-width="3"/><ellipse cx="548" cy="590" rx="6" ry="8" fill="#050301"/><ellipse cx="574" cy="590" rx="6" ry="8" fill="#050301"/>
<path d="M470 650 Q561 700 652 650 Q640 720 561 740 Q482 720 470 650Z" fill="#241608" stroke="#0c0703" stroke-width="3"/><path d="M505 690 Q561 712 617 690" fill="none" stroke="#9a2b14" stroke-width="5" stroke-linecap="round"/>
<g fill="url(#chitin)" stroke="#0c0703" stroke-width="4"><path d="M470 640 Q420 690 440 770 Q470 740 500 700Z"/><path d="M652 640 Q702 690 682 770 Q652 740 622 700Z"/></g><path d="M440 770 Q456 730 480 708" fill="none" stroke="#d9a35a" stroke-opacity=".5" stroke-width="3"/><path d="M682 770 Q666 730 642 708" fill="none" stroke="#d9a35a" stroke-opacity=".5" stroke-width="3"/>
<g fill="url(#chitin)" stroke="#0c0703" stroke-width="4"><path d="M170 1000 Q120 1090 210 1180 L280 1160 Q250 1080 280 1000Z"/><path d="M952 1000 Q1002 1090 912 1180 L842 1160 Q872 1080 842 1000Z"/></g>
<g stroke="#0c0703" stroke-width="3" fill="#1c1208"><path d="M300 960 Q240 1040 280 1140 L330 1130 Q310 1060 350 990Z"/><path d="M822 960 Q882 1040 842 1130 L792 1120 Q812 1050 772 990Z"/></g>
<g transform="translate(380 1120)"><polygon points="0,-60 52,-30 52,30 0,60 -52,30 -52,-30" fill="#e0a52a" stroke="#6a4510" stroke-width="4"/><polygon points="0,-34 30,-17 30,17 0,34 -30,17 -30,-17" fill="#ffd36b" opacity=".85"/></g>
<g transform="translate(740 1130)"><ellipse cx="0" cy="0" rx="44" ry="30" fill="#f4ead0" stroke="#8a7a52" stroke-width="3"/><circle cx="-12" cy="-4" r="4" fill="#2a1f10"/><circle cx="12" cy="-4" r="4" fill="#2a1f10"/></g>
${counter('#6a4a2c', '#1c140e')}</svg>\n`;

writeFileSync(resolve(out, 'npc-deepsea.svg'), deepsea);
writeFileSync(resolve(out, 'npc-swarm.svg'), swarm);
console.log('wrote npc-deepsea.svg, npc-swarm.svg');
