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
