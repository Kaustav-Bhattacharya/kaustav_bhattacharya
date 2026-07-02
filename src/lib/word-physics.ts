import type Matter from "matter-js";

export type WordMeta = { text: string; className?: string };

type PendingEntry = { kind: "pending"; el: HTMLElement; meta: WordMeta };

type ActiveEntry = {
  kind: "active";
  body: Matter.Body;
  meta: WordMeta;
  placeholderEl: HTMLElement;
  overlayEl: HTMLSpanElement | null;
  spawn: { x: number; y: number } | null;
};

type Entry = PendingEntry | ActiveEntry;

const WALL_THICKNESS = 80;
const FLOOR_MARGIN = 24;

let M: typeof Matter | null = null;
let matterLoading: Promise<typeof Matter> | null = null;

function loadMatter() {
  if (M) return Promise.resolve(M);
  if (!matterLoading) {
    matterLoading = import("matter-js").then((mod) => {
      M = mod.default;
      return M;
    });
  }
  return matterLoading;
}

let engine: Matter.Engine | null = null;
let floor: Matter.Body | null = null;
let leftWall: Matter.Body | null = null;
let rightWall: Matter.Body | null = null;
let overlayContainer: HTMLDivElement | null = null;
let rafId: number | null = null;
let initialized = false;
let reducedMotion = false;
let nextId = 0;
const entries = new Map<number, Entry>();
let lastPointer: { x: number; y: number; t: number } | null = null;

function docWidth() {
  return Math.max(document.documentElement.scrollWidth, window.innerWidth);
}

function floorPositionY() {
  const footer = document.querySelector("footer");
  if (footer) {
    return footer.getBoundingClientRect().top + window.scrollY - FLOOR_MARGIN;
  }
  return document.documentElement.scrollHeight - FLOOR_MARGIN;
}

function repositionBounds() {
  if (!engine || !M) return;
  const width = docWidth();
  const floorY = floorPositionY();
  if (!floor) {
    floor = M.Bodies.rectangle(
      width / 2,
      floorY,
      width + WALL_THICKNESS * 4,
      WALL_THICKNESS,
      { isStatic: true }
    );
    leftWall = M.Bodies.rectangle(
      -WALL_THICKNESS / 2,
      floorY / 2,
      WALL_THICKNESS,
      floorY * 2,
      { isStatic: true }
    );
    rightWall = M.Bodies.rectangle(
      width + WALL_THICKNESS / 2,
      floorY / 2,
      WALL_THICKNESS,
      floorY * 2,
      { isStatic: true }
    );
    M.Composite.add(engine.world, [floor, leftWall, rightWall]);
  } else {
    M.Body.setPosition(floor, { x: width / 2, y: floorY });
    M.Body.setPosition(leftWall!, { x: -WALL_THICKNESS / 2, y: floorY / 2 });
    M.Body.setPosition(rightWall!, { x: width + WALL_THICKNESS / 2, y: floorY / 2 });
  }
}

function ensureEngine() {
  if (engine) return engine;
  if (!M) return null;
  engine = M.Engine.create();
  engine.gravity.y = 1.1;
  startLoop();
  repositionBounds();
  return engine;
}

function syncOverlays() {
  entries.forEach((entry) => {
    if (entry.kind !== "active" || entry.body.isStatic || !entry.overlayEl || !entry.spawn) return;
    const { x, y } = entry.body.position;
    if (!Number.isFinite(x) || !Number.isFinite(y)) {
      console.error("[word-physics] non-finite body position, resetting", entry.meta);
      if (M) {
        M.Body.setPosition(entry.body, entry.spawn);
        M.Body.setVelocity(entry.body, { x: 0, y: 0 });
        M.Body.setAngularVelocity(entry.body, 0);
      }
      return;
    }
    const dx = x - entry.spawn.x;
    const dy = y - entry.spawn.y;
    entry.overlayEl.style.transform = `translate(${dx}px, ${dy}px) rotate(${entry.body.angle}rad)`;
  });
}

function startLoop() {
  if (rafId !== null) return;
  let lastTime = performance.now();
  const tick = (time: number) => {
    try {
      const delta = Math.min(time - lastTime, 32);
      lastTime = time;
      if (engine && M) M.Engine.update(engine, delta);
      syncOverlays();
    } catch (err) {
      console.error("[word-physics] tick failed", err);
    }
    rafId = requestAnimationFrame(tick);
  };
  rafId = requestAnimationFrame(tick);
}

function spawnOverlay(entry: ActiveEntry) {
  if (!overlayContainer || entry.overlayEl) return;
  const bounds = entry.body.bounds;
  const width = bounds.max.x - bounds.min.x;
  const height = bounds.max.y - bounds.min.y;
  const span = document.createElement("span");
  span.textContent = entry.meta.text;
  if (entry.meta.className) span.className = entry.meta.className;
  span.style.position = "absolute";
  span.style.left = `${entry.body.position.x - width / 2}px`;
  span.style.top = `${entry.body.position.y - height / 2}px`;
  span.style.willChange = "transform";
  overlayContainer.appendChild(span);
  entry.overlayEl = span;
  entry.spawn = { x: entry.body.position.x, y: entry.body.position.y };
  entry.placeholderEl.style.visibility = "hidden";
}

function knockEntry(entry: ActiveEntry, vx: number, vy: number) {
  if (!M) return;
  if (entry.body.isStatic) {
    M.Body.setStatic(entry.body, false);
    M.Body.setVelocity(entry.body, { x: vx, y: vy });
    M.Body.setAngularVelocity(entry.body, (Math.random() - 0.5) * 0.3);
    spawnOverlay(entry);
  } else {
    M.Body.setVelocity(entry.body, {
      x: entry.body.velocity.x + vx * 0.6,
      y: entry.body.velocity.y + vy * 0.6,
    });
  }
}

function activateEntry(id: number, pending: PendingEntry): Matter.Body | null {
  if (!M) return null;
  const engine = ensureEngine();
  if (!engine) return null;
  const rect = pending.el.getBoundingClientRect();
  const x = rect.left + window.scrollX + rect.width / 2;
  const y = rect.top + window.scrollY + rect.height / 2;
  const body = M.Bodies.rectangle(
    x,
    y,
    Math.max(rect.width, 4),
    Math.max(rect.height, 4),
    { friction: 0.4, restitution: 0.2 }
  );
  // born dynamic then flipped static so Matter snapshots real mass/inertia
  // into body._original — required for setStatic(false) to restore them later
  M.Body.setStatic(body, true);
  M.Composite.add(engine.world, body);
  const active: ActiveEntry = {
    kind: "active",
    body,
    meta: pending.meta,
    placeholderEl: pending.el,
    overlayEl: null,
    spawn: null,
  };
  entries.set(id, active);
  return body;
}

function hitTest(x: number, y: number, vx: number, vy: number) {
  entries.forEach((entry, id) => {
    if (entry.kind === "pending") {
      if (!M) return;
      const rect = entry.el.getBoundingClientRect();
      const left = rect.left + window.scrollX;
      const top = rect.top + window.scrollY;
      const right = left + rect.width;
      const bottom = top + rect.height;
      if (x >= left && x <= right && y >= top && y <= bottom) {
        const body = activateEntry(id, entry);
        if (body) {
          const active = entries.get(id);
          if (active && active.kind === "active") knockEntry(active, vx, vy);
        }
      }
      return;
    }
    const b = entry.body.bounds;
    if (x >= b.min.x && x <= b.max.x && y >= b.min.y && y <= b.max.y) {
      knockEntry(entry, vx, vy);
    }
  });
}

const MAX_LAUNCH_SPEED = 24;

function clampSpeed(vx: number, vy: number, max: number) {
  const speed = Math.hypot(vx, vy);
  if (speed <= max) return { x: vx, y: vy };
  const scale = max / speed;
  return { x: vx * scale, y: vy * scale };
}

function onPointerMove(e: PointerEvent) {
  if (e.pointerType !== "mouse") return;
  const x = e.clientX + window.scrollX;
  const y = e.clientY + window.scrollY;
  const now = performance.now();
  const prev = lastPointer;
  lastPointer = { x, y, t: now };
  if (!prev) return;
  const dt = Math.max(now - prev.t, 1);
  const vx = ((x - prev.x) / dt) * 9;
  const vy = ((y - prev.y) / dt) * 9;
  if (Math.hypot(vx, vy) < 1.2) return;
  const knock = clampSpeed(vx, vy - 1, MAX_LAUNCH_SPEED);
  hitTest(x, y, knock.x, knock.y);
}

function onTouchStart(e: TouchEvent) {
  const touch = e.touches[0];
  if (!touch) return;
  const x = touch.clientX + window.scrollX;
  const y = touch.clientY + window.scrollY;
  hitTest(x, y, (Math.random() - 0.5) * 8, -6);
}

export function setOverlayElement(el: HTMLDivElement | null) {
  overlayContainer = el;
}

export function init() {
  if (initialized || typeof window === "undefined") return;
  initialized = true;
  reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reducedMotion) return;
  window.addEventListener("pointermove", onPointerMove);
  window.addEventListener("touchstart", onTouchStart, { passive: true });
  window.addEventListener("resize", repositionBounds);
  loadMatter();
}

export function registerWord(el: HTMLElement, meta: WordMeta): number {
  init();
  if (reducedMotion) return -1;
  const id = nextId++;
  entries.set(id, { kind: "pending", el, meta });
  return id;
}

export function unregisterWord(id: number) {
  const entry = entries.get(id);
  if (!entry) return;
  if (entry.kind === "active") {
    if (engine && M) M.Composite.remove(engine.world, entry.body);
    entry.overlayEl?.remove();
  }
  entries.delete(id);
}
