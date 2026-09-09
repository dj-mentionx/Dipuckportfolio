"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef, type RefObject } from "react";
import {
  BackSide,
  BufferAttribute,
  BufferGeometry,
  Group,
  InstancedMesh,
  Line,
  LineBasicMaterial,
  Mesh,
  Object3D,
  Vector3,
} from "three";
import { GLOBE_NODES, ORBIT_PATHS, ORBITING_ARTEFACTS, type GlobeNodeId } from "@/lib/archive";
import { contourPositions, fibonacciPoints, greatCircle, latLngToVector } from "./math";

export type ProjectedMark = {
  id: string;
  x: number;
  y: number;
  z: number;
  kind: "node" | "artefact";
};

type SceneProps = {
  rotation: { x: number; y: number };
  focus: GlobeNodeId | null;
  hover: GlobeNodeId | null;
  dense: boolean;
  dissolving: boolean;
  onProject: (marks: ProjectedMark[]) => void;
};

const dummy = new Object3D();
const scratch = new Vector3();

function Contours({ radius, simplified }: { radius: number; simplified: boolean }) {
  const geometry = useMemo(() => {
    const geo = new BufferGeometry();
    geo.setAttribute(
      "position",
      new BufferAttribute(contourPositions(radius, simplified ? 12 : 20, simplified ? 8 : 12, simplified ? 40 : 64), 3),
    );
    return geo;
  }, [radius, simplified]);

  useEffect(() => () => geometry.dispose(), [geometry]);

  return (
    <lineSegments geometry={geometry}>
      <lineBasicMaterial color="#f5f2ec" transparent opacity={0.16} />
    </lineSegments>
  );
}

function DataField({ radius, count }: { radius: number; count: number }) {
  const mesh = useRef<InstancedMesh>(null);
  const points = useMemo(() => fibonacciPoints(count, radius * 1.012), [count, radius]);

  useEffect(() => {
    if (!mesh.current) return;
    for (let i = 0; i < count; i += 1) {
      dummy.position.set(points[i * 3], points[i * 3 + 1], points[i * 3 + 2]);
      dummy.scale.setScalar(i % 17 === 0 ? 1.6 : 0.7);
      dummy.updateMatrix();
      mesh.current.setMatrixAt(i, dummy.matrix);
    }
    mesh.current.instanceMatrix.needsUpdate = true;
  }, [count, points]);

  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, count]}>
      <sphereGeometry args={[0.006, 5, 5]} />
      <meshBasicMaterial color="#f5f2ec" transparent opacity={0.42} />
    </instancedMesh>
  );
}

function Pulses({ radius }: { radius: number }) {
  const mesh = useRef<InstancedMesh>(null);
  const seeds = useMemo(
    () =>
      [0.12, 0.37, 0.58, 0.71, 0.88].map((t, i) => ({
        lat: -40 + ((i * 37) % 90),
        lng: -160 + i * 68,
        phase: t,
      })),
    [],
  );

  useFrame(({ clock }) => {
    if (!mesh.current) return;
    const time = clock.elapsedTime;
    seeds.forEach((seed, index) => {
      latLngToVector(seed.lat, seed.lng, radius * 1.03, scratch);
      const wave = (Math.sin(time * 1.4 + seed.phase * 8) + 1) / 2;
      dummy.position.copy(scratch);
      dummy.scale.setScalar(0.4 + wave * 2.1);
      dummy.updateMatrix();
      mesh.current!.setMatrixAt(index, dummy.matrix);
    });
    mesh.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, seeds.length]}>
      <sphereGeometry args={[0.018, 10, 10]} />
      <meshBasicMaterial color="#ff2a1a" transparent opacity={0.85} />
    </instancedMesh>
  );
}

function Routes({ radius }: { radius: number }) {
  const lines = useMemo(() => {
    const material = new LineBasicMaterial({ color: "#ff2a1a", transparent: true, opacity: 0.28 });
    return ORBIT_PATHS.map((path) => {
      const from = GLOBE_NODES.find((node) => node.id === path.from)!;
      const to = GLOBE_NODES.find((node) => node.id === path.to)!;
      const geo = new BufferGeometry();
      geo.setAttribute(
        "position",
        new BufferAttribute(greatCircle([from.lat, from.lng], [to.lat, to.lng], radius * 1.08), 3),
      );
      return new Line(geo, material);
    });
  }, [radius]);

  useEffect(
    () => () => {
      lines.forEach((line) => {
        line.geometry.dispose();
        (line.material as LineBasicMaterial).dispose();
      });
    },
    [lines],
  );

  return (
    <group>
      {lines.map((line, index) => (
        <primitive key={ORBIT_PATHS[index].name} object={line} />
      ))}
    </group>
  );
}

function Atmosphere() {
  return (
    <mesh scale={1.16}>
      <sphereGeometry args={[1, 48, 48]} />
      <meshBasicMaterial color="#ff2a1a" transparent opacity={0.055} side={BackSide} />
    </mesh>
  );
}

function Dust({ count }: { count: number }) {
  const points = useMemo(() => fibonacciPoints(count, 3.4), [count]);
  const mesh = useRef<InstancedMesh>(null);

  useEffect(() => {
    if (!mesh.current) return;
    for (let i = 0; i < count; i += 1) {
      dummy.position.set(points[i * 3], points[i * 3 + 1], points[i * 3 + 2]);
      dummy.scale.setScalar(0.35);
      dummy.updateMatrix();
      mesh.current.setMatrixAt(i, dummy.matrix);
    }
    mesh.current.instanceMatrix.needsUpdate = true;
  }, [count, points]);

  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, count]}>
      <sphereGeometry args={[0.008, 4, 4]} />
      <meshBasicMaterial color="#f5f2ec" transparent opacity={0.18} />
    </instancedMesh>
  );
}

function Courier({ radius }: { radius: number }) {
  const ref = useRef<Mesh>(null);
  const path = useMemo(() => {
    const from = GLOBE_NODES.find((node) => node.id === "chennai")!;
    const to = GLOBE_NODES.find((node) => node.id === "berlin")!;
    const raw = greatCircle([from.lat, from.lng], [to.lat, to.lng], radius * 1.1, 96);
    const points: Vector3[] = [];
    for (let i = 0; i < raw.length; i += 3) {
      points.push(new Vector3(raw[i], raw[i + 1], raw[i + 2]));
    }
    return points;
  }, [radius]);

  useFrame(({ clock }) => {
    if (!ref.current || path.length < 2) return;
    const t = (clock.elapsedTime * 0.07) % 1;
    const index = t * (path.length - 1);
    const a = Math.floor(index);
    const b = Math.min(a + 1, path.length - 1);
    ref.current.position.lerpVectors(path[a], path[b], index - a);
  });

  return (
    <mesh ref={ref}>
      <sphereGeometry args={[0.02, 12, 12]} />
      <meshBasicMaterial color="#ff2a1a" />
    </mesh>
  );
}

function LocationNodes({ radius, hover, focus }: { radius: number; hover: GlobeNodeId | null; focus: GlobeNodeId | null }) {
  return (
    <group>
      {GLOBE_NODES.map((node) => {
        const position = latLngToVector(node.lat, node.lng, radius * 1.04);
        const active = hover === node.id || focus === node.id;
        return (
          <mesh key={node.id} position={position.toArray()}>
            <sphereGeometry args={[active ? 0.028 : 0.018, 12, 12]} />
            <meshBasicMaterial color="#ff2a1a" />
          </mesh>
        );
      })}
    </group>
  );
}

function Projector({
  group,
  onProject,
}: {
  group: RefObject<Group>;
  onProject: (marks: ProjectedMark[]) => void;
}) {
  const { camera, size } = useThree();

  useFrame(() => {
    if (!group.current) return;
    const marks: ProjectedMark[] = [];

    const project = (id: string, lat: number, lng: number, altitude: number, kind: ProjectedMark["kind"]) => {
      latLngToVector(lat, lng, altitude, scratch);
      scratch.applyMatrix4(group.current!.matrixWorld);
      const facing = scratch.clone().normalize().dot(camera.position.clone().normalize()) > 0.12;
      scratch.project(camera);
      marks.push({
        id,
        x: (scratch.x * 0.5 + 0.5) * size.width,
        y: (-scratch.y * 0.5 + 0.5) * size.height,
        z: facing ? scratch.z : 2,
        kind,
      });
    };

    GLOBE_NODES.forEach((node) => project(node.id, node.lat, node.lng, 1.12, "node"));
    ORBITING_ARTEFACTS.forEach((item) => project(item.id, item.lat, item.lng, item.altitude, "artefact"));
    onProject(marks);
  });

  return null;
}

function Scene({ rotation, focus, hover, dense, dissolving, onProject }: SceneProps) {
  const group = useRef<Group>(null);
  const radius = 1;

  useFrame(() => {
    if (!group.current) return;
    group.current.rotation.x += (rotation.x - group.current.rotation.x) * 0.075;
    group.current.rotation.y += (rotation.y - group.current.rotation.y) * 0.075;
    const scale = dissolving ? 0.78 : 1;
    group.current.scale.setScalar(group.current.scale.x + (scale - group.current.scale.x) * 0.07);
  });

  return (
    <>
      <color attach="background" args={["#080808"]} />
      <Dust count={dense ? 420 : 180} />
      <Atmosphere />
      <group ref={group}>
        <mesh>
          <sphereGeometry args={[radius * 0.97, 48, 48]} />
          <meshBasicMaterial color="#0a0a0a" transparent opacity={0.94} />
        </mesh>
        <Contours radius={radius} simplified={!dense} />
        <DataField radius={radius} count={dense ? 1600 : 780} />
        <Pulses radius={radius} />
        <Routes radius={radius} />
        <Courier radius={radius} />
        <LocationNodes radius={radius} hover={hover} focus={focus} />
      </group>
      <Projector group={group} onProject={onProject} />
    </>
  );
}

export function GlobeCanvas(props: SceneProps) {
  return (
    <Canvas
      dpr={[1, 1.25]}
      gl={{ antialias: true, alpha: true, powerPreference: "default", failIfMajorPerformanceCaveat: false }}
      camera={{ position: [0, 0.08, 2.72], fov: 42 }}
      onCreated={({ gl }) => {
        gl.setClearColor("#080808", 0);
      }}
    >
      <Scene {...props} />
    </Canvas>
  );
}
