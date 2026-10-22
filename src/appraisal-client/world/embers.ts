import { AdditiveBlending, BufferAttribute, BufferGeometry, PerspectiveCamera, Points, Scene, ShaderMaterial, WebGLRenderer } from 'three';

/*
 * The only WebGL left: embers drifting up through the hall in true depth. One small point cloud on a
 * transparent canvas, no post-processing, device pixel ratio 1, capped at 30 fps on slow machines and
 * stopped while the tab is hidden or the player prefers reduced motion.
 */
export function createEmbers(canvas: HTMLCanvasElement) {
  const still = window.matchMedia('(prefers-reduced-motion: reduce)');
  const renderer = new WebGLRenderer({ canvas, alpha: true, antialias: false, powerPreference: 'low-power' });
  renderer.setPixelRatio(1);
  renderer.setClearColor(0x000000, 0);
  const scene = new Scene();
  const camera = new PerspectiveCamera(55, 1, .1, 100);
  camera.position.set(0, 0, 10);

  const count = window.innerWidth < 720 ? 90 : 180;
  const positions = new Float32Array(count * 3);
  const seeds = new Float32Array(count);
  let seed = 7;
  const random = () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296; };
  for (let i = 0; i < count; i++) {
    positions[i * 3] = (random() - .5) * 26;
    positions[i * 3 + 1] = (random() - .5) * 16;
    positions[i * 3 + 2] = -random() * 22 + 4;
    seeds[i] = random();
  }
  const geometry = new BufferGeometry();
  geometry.setAttribute('position', new BufferAttribute(positions, 3));
  geometry.setAttribute('aSeed', new BufferAttribute(seeds, 1));
  const uniforms = { uTime: { value: 0 }, uScale: { value: 1 }, uHot: { value: 0 } };
  const material = new ShaderMaterial({
    transparent: true, depthWrite: false, blending: AdditiveBlending, uniforms,
    vertexShader: `uniform float uTime,uScale;attribute float aSeed;varying float vSeed;varying float vFade;
      void main(){vec3 p=position;p.y=mod(p.y+8.+uTime*(.25+aSeed*.55),16.)-8.;p.x+=sin(uTime*.4+aSeed*40.)*.6;
        vec4 mv=modelViewMatrix*vec4(p,1.);gl_Position=projectionMatrix*mv;vSeed=aSeed;
        vFade=smoothstep(-8.,-5.,p.y)*smoothstep(8.,4.,p.y);gl_PointSize=(1.4+aSeed*2.8)*uScale*(10./-mv.z);}`,
    fragmentShader: `uniform float uTime,uHot;varying float vSeed;varying float vFade;
      void main(){float a=smoothstep(.5,0.,length(gl_PointCoord-.5));
        vec3 c=mix(vec3(1.,.62,.28),vec3(.5,1.,.85),step(.82,vSeed));c=mix(c,vec3(1.,.3,.18),uHot);
        gl_FragColor=vec4(c,a*vFade*(.4+.6*sin(uTime*3.+vSeed*60.)));}`,
  });
  scene.add(new Points(geometry, material));

  const resize = () => {
    renderer.setSize(window.innerWidth, window.innerHeight, false);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    uniforms.uScale.value = window.innerHeight / 900;
  };
  window.addEventListener('resize', resize);
  resize();

  let frame = 0, last = performance.now(), lastRender = last, frameMs = 16.7, slow = false, running = true;
  const loop = (now: number) => {
    if (!running) return;
    frame = requestAnimationFrame(loop);
    const gap = now - last;
    last = now;
    if (document.hidden) { lastRender = now; return; }
    if (gap < 250) frameMs += (gap - frameMs) * .05;
    if (frameMs > 24) slow = true;
    if (slow && now - lastRender < 32) return;
    uniforms.uTime.value += Math.min((now - lastRender) / 1000, .05);
    lastRender = now;
    renderer.render(scene, camera);
  };
  const start = () => {
    cancelAnimationFrame(frame);
    if (still.matches) { renderer.clear(); return; }
    last = lastRender = performance.now();
    frame = requestAnimationFrame(loop);
  };
  still.addEventListener('change', start);
  start();

  return {
    heat(hot: boolean) { uniforms.uHot.value = hot ? 1 : 0; },
    dispose() {
      running = false;
      cancelAnimationFrame(frame);
      still.removeEventListener('change', start);
      window.removeEventListener('resize', resize);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    },
  };
}
