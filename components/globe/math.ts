import { Vector3 } from "three";

export function latLngToVector(lat: number, lng: number, radius: number, target = new Vector3()) {
  const phi = ((90 - lat) * Math.PI) / 180;
  const theta = ((lng + 180) * Math.PI) / 180;
  return target.set(
    -radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta),
  );
}

export function fibonacciPoints(count: number, radius: number) {
  const points = new Float32Array(count * 3);
  const golden = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < count; i += 1) {
    const y = 1 - (i / Math.max(count - 1, 1)) * 2;
    const r = Math.sqrt(Math.max(0, 1 - y * y));
    const theta = golden * i;
    points[i * 3] = Math.cos(theta) * r * radius;
    points[i * 3 + 1] = y * radius;
    points[i * 3 + 2] = Math.sin(theta) * r * radius;
  }
  return points;
}

export function contourPositions(radius: number, meridians = 18, parallels = 11, steps = 64) {
  const positions: number[] = [];

  for (let m = 0; m < meridians; m += 1) {
    const lng = (m / meridians) * 360 - 180;
    for (let i = 0; i < steps; i += 1) {
      const a = latLngToVector((i / steps) * 180 - 90, lng, radius);
      const b = latLngToVector(((i + 1) / steps) * 180 - 90, lng, radius);
      positions.push(a.x, a.y, a.z, b.x, b.y, b.z);
    }
  }

  for (let p = 1; p < parallels; p += 1) {
    const lat = (p / parallels) * 180 - 90;
    for (let i = 0; i < steps; i += 1) {
      const a = latLngToVector(lat, (i / steps) * 360 - 180, radius);
      const b = latLngToVector(lat, ((i + 1) / steps) * 360 - 180, radius);
      positions.push(a.x, a.y, a.z, b.x, b.y, b.z);
    }
  }

  return new Float32Array(positions);
}

export function greatCircle(from: [number, number], to: [number, number], radius: number, segments = 48) {
  const start = latLngToVector(from[0], from[1], 1);
  const end = latLngToVector(to[0], to[1], 1);
  const positions = new Float32Array((segments + 1) * 3);
  for (let i = 0; i <= segments; i += 1) {
    const t = i / segments;
    const point = new Vector3().copy(start).lerp(end, t).normalize().multiplyScalar(radius);
    positions[i * 3] = point.x;
    positions[i * 3 + 1] = point.y;
    positions[i * 3 + 2] = point.z;
  }
  return positions;
}

export function facingRotation(lat: number, lng: number) {
  return {
    x: Math.max(-0.85, Math.min(0.85, (-lat * Math.PI) / 220)),
    y: ((-lng - 90) * Math.PI) / 180,
  };
}

function hash(n: number) {
  const x = Math.sin(n * 127.1) * 43758.5453;
  return x - Math.floor(x);
}

export function topoPositions(radius: number, dense: boolean) {
  const positions: number[] = [];
  const bands = dense ? 28 : 16;
  const steps = dense ? 140 : 80;

  for (let b = 0; b < bands; b += 1) {
    const lat0 = (b / (bands - 1)) * 168 - 84;
    for (let i = 0; i < steps; i += 1) {
      const draw = (t: number) => {
        const lng = (t / steps) * 360 - 180;
        const n =
          Math.sin(lng * 0.045 + lat0 * 0.08) * 1.6 +
          Math.sin(lng * 0.13 + b * 1.7) * 0.8 +
          Math.sin(lng * 0.31 + lat0 * 0.2) * 0.4;
        if (hash(b * 50 + Math.floor(lng / 18)) < 0.18) return null;
        return latLngToVector(lat0 + n, lng, radius + n * 0.0018);
      };
      const a = draw(i);
      const c = draw(i + 1);
      if (a && c) positions.push(a.x, a.y, a.z, c.x, c.y, c.z);
    }
  }

  const meridians = dense ? 14 : 8;
  for (let m = 0; m < meridians; m += 1) {
    const lng0 = (m / meridians) * 360 - 180;
    for (let i = 0; i < 70; i += 1) {
      const latA = (i / 70) * 160 - 80;
      const latB = ((i + 1) / 70) * 160 - 80;
      const wobble = Math.sin(latA * 0.12 + m) * 6;
      const a = latLngToVector(latA, lng0 + wobble, radius);
      const b = latLngToVector(latB, lng0 + Math.sin(latB * 0.12 + m) * 6, radius);
      positions.push(a.x, a.y, a.z, b.x, b.y, b.z);
    }
  }

  return new Float32Array(positions);
}

export function ringPositions(radius: number, tiltX: number, tiltZ: number, segments = 128) {
  const positions = new Float32Array((segments + 1) * 3);
  for (let i = 0; i <= segments; i += 1) {
    const a = (i / segments) * Math.PI * 2;
    const p = new Vector3(Math.cos(a) * radius, 0, Math.sin(a) * radius);
    p.applyAxisAngle(new Vector3(1, 0, 0), tiltX);
    p.applyAxisAngle(new Vector3(0, 0, 1), tiltZ);
    positions[i * 3] = p.x;
    positions[i * 3 + 1] = p.y;
    positions[i * 3 + 2] = p.z;
  }
  return positions;
}
