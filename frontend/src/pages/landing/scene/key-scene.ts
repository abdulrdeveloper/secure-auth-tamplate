import {
  ACESFilmicToneMapping,
  BoxGeometry,
  BufferGeometry,
  Color,
  CylinderGeometry,
  EdgesGeometry,
  Group,
  Line,
  LineBasicMaterial,
  LineSegments,
  Mesh,
  MeshBasicMaterial,
  MeshStandardMaterial,
  PerspectiveCamera,
  PMREMGenerator,
  QuadraticBezierCurve3,
  Scene,
  SphereGeometry,
  TorusGeometry,
  Vector3,
  WebGLRenderer,
} from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";

// The hero scene: the Clavis key in the middle, apps on a ring around it,
// and a token travelling from the key to each app. When a token arrives,
// the app's outline lights up.

const BRASS = 0xc9a15a;
const APP_COUNT = 6;
const RING_RADIUS = 3;
const TOKEN_SPEED = 0.22; // trips per second
const MAX_PIXEL_RATIO = 1.5;

type AppNode = {
  mesh: Mesh;
  edges: LineBasicMaterial;
  curve: QuadraticBezierCurve3;
  token: Mesh;
  offset: number;
  lastT: number;
  flash: number;
};

export type KeyScene = { dispose: () => void };

function buildKey(material: MeshStandardMaterial): Group {
  const key = new Group();

  const bow = new Mesh(new TorusGeometry(0.85, 0.2, 32, 96), material);
  bow.position.y = 1.2;

  const collar = new Mesh(new TorusGeometry(0.24, 0.07, 16, 48), material);
  collar.rotation.x = Math.PI / 2;
  collar.position.y = 0.2;

  const shaft = new Mesh(new CylinderGeometry(0.15, 0.15, 2.6, 32), material);
  shaft.position.y = -0.95;

  const toothLong = new Mesh(new BoxGeometry(0.55, 0.2, 0.2), material);
  toothLong.position.set(0.32, -2.05, 0);

  const toothShort = new Mesh(new BoxGeometry(0.38, 0.18, 0.2), material);
  toothShort.position.set(0.24, -1.6, 0);

  key.add(bow, collar, shaft, toothLong, toothShort);
  key.position.y = 0.3;
  key.scale.setScalar(0.78);
  return key;
}

function buildApps(system: Group): AppNode[] {
  const boxGeometry = new BoxGeometry(0.62, 0.62, 0.62);
  const edgeGeometry = new EdgesGeometry(boxGeometry);
  const tokenGeometry = new SphereGeometry(0.07, 16, 16);
  const bodyMaterial = new MeshStandardMaterial({ color: 0x18181b, metalness: 0.3, roughness: 0.45 });
  const tokenMaterial = new MeshBasicMaterial({ color: BRASS });
  const pathMaterial = new LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.14 });

  const ringPoints = Array.from({ length: 129 }, (_, i) => {
    const a = (i / 128) * Math.PI * 2;
    return new Vector3(Math.cos(a) * RING_RADIUS, Math.sin(a) * RING_RADIUS, 0);
  });
  const ringMaterial = new LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.07 });
  system.add(new Line(new BufferGeometry().setFromPoints(ringPoints), ringMaterial));

  return Array.from({ length: APP_COUNT }, (_, i) => {
    // Six apps at 0°, 60°, ... keep the top and bottom of the ring clear,
    // so no app sits behind or in front of the key.
    const angle = (i / APP_COUNT) * Math.PI * 2;
    const position = new Vector3(Math.cos(angle) * RING_RADIUS, Math.sin(angle) * RING_RADIUS, 0);

    const mesh = new Mesh(boxGeometry, bodyMaterial);
    mesh.position.copy(position);
    const edges = new LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.3 });
    mesh.add(new LineSegments(edgeGeometry, edges));

    const control = position.clone().multiplyScalar(0.5).add(new Vector3(0, 0, 1.6));
    const curve = new QuadraticBezierCurve3(new Vector3(0, 0, 0), control, position);
    system.add(new Line(new BufferGeometry().setFromPoints(curve.getPoints(64)), pathMaterial));

    const token = new Mesh(tokenGeometry, tokenMaterial);
    system.add(mesh, token);

    return { mesh, edges, curve, token, offset: i / APP_COUNT, lastT: 0, flash: 0 };
  });
}

export function createKeyScene(
  canvas: HTMLCanvasElement,
  container: HTMLElement,
  onReady: () => void,
): KeyScene {
  const renderer = new WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, MAX_PIXEL_RATIO));
  renderer.toneMapping = ACESFilmicToneMapping;

  const scene = new Scene();
  const pmrem = new PMREMGenerator(renderer);
  const environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.environment = environment;

  const camera = new PerspectiveCamera(35, 1, 0.1, 100);
  camera.position.set(0, 0, 12);

  const root = new Group();
  scene.add(root);

  const brass = new MeshStandardMaterial({ color: BRASS, metalness: 1, roughness: 0.32 });
  const key = buildKey(brass);
  root.add(key);

  const system = new Group();
  system.rotation.x = -1.05;
  root.add(system);
  const apps = buildApps(system);

  const white = new Color(0xffffff);
  const brassColor = new Color(BRASS);
  const pointer = { x: 0, y: 0 };
  let frame = 0;
  let running = false;
  let ready = false;
  const start = performance.now();

  function resize() {
    const { clientWidth: width, clientHeight: height } = container;
    if (!width || !height) return;
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  }

  function render() {
    const time = (performance.now() - start) / 1000;

    key.rotation.y = time * 0.45;
    root.rotation.y += (pointer.x * 0.35 - root.rotation.y) * 0.05;
    root.rotation.x += (pointer.y * 0.2 - root.rotation.x) * 0.05;

    for (const app of apps) {
      const t = (time * TOKEN_SPEED + app.offset) % 1;
      if (t < app.lastT) app.flash = 1;
      app.lastT = t;

      app.token.position.copy(app.curve.getPoint(t));
      app.token.scale.setScalar(Math.sin(t * Math.PI) * 0.8 + 0.2);

      app.flash *= 0.94;
      app.edges.color.copy(white).lerp(brassColor, app.flash);
      app.edges.opacity = 0.3 + app.flash * 0.7;
      app.mesh.scale.setScalar(1 + app.flash * 0.08);
      app.mesh.rotation.z = time * 0.2;
    }

    renderer.render(scene, camera);
    if (!ready) {
      ready = true;
      onReady();
    }
  }

  function loop() {
    render();
    frame = requestAnimationFrame(loop);
  }

  function setRunning(next: boolean) {
    if (next === running) return;
    running = next;
    if (running) frame = requestAnimationFrame(loop);
    else cancelAnimationFrame(frame);
  }

  let inView = true;
  const update = () => setRunning(inView && !document.hidden);

  const visibility = new IntersectionObserver(([entry]) => {
    inView = entry.isIntersecting;
    update();
  });
  visibility.observe(container);
  document.addEventListener("visibilitychange", update);

  const sizeObserver = new ResizeObserver(resize);
  sizeObserver.observe(container);

  function onPointerMove(event: PointerEvent) {
    pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
    pointer.y = (event.clientY / window.innerHeight) * 2 - 1;
  }
  window.addEventListener("pointermove", onPointerMove, { passive: true });

  resize();
  update();

  return {
    dispose() {
      setRunning(false);
      visibility.disconnect();
      sizeObserver.disconnect();
      document.removeEventListener("visibilitychange", update);
      window.removeEventListener("pointermove", onPointerMove);

      scene.traverse((object) => {
        if (object instanceof Mesh || object instanceof Line) {
          object.geometry.dispose();
          const materials = Array.isArray(object.material) ? object.material : [object.material];
          materials.forEach((material) => material.dispose());
        }
      });
      environment.dispose();
      pmrem.dispose();
      renderer.dispose();
    },
  };
}
