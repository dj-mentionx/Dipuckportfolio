"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef, type RefObject } from "react";
import {
  AdditiveBlending,
  BackSide,
  BufferAttribute,
  BufferGeometry,
  Color,
  DoubleSide,
  Group,
  Line,
  LineBasicMaterial,
  LineSegments,
  Mesh,
  Points,
  PointsMaterial,
  ShaderMaterial,
  Vector3,
} from "three";
import { GLOBE_NODES, ORBIT_PATHS, ORBITING_ARTEFACTS, type GlobeNodeId } from "@/lib/archive";
import { fibonacciPoints, greatCircle, latLngToVector, ringPositions, topoPositions } from "./math";

export type ProjectedMark = {
  id: string;
  x: number;
  y: number;
  z: number;
  kind: "node" | "artefact";
};

export type Pointer = { x: number; y: number };

type SceneProps = {
  rotation: { x: number; y: number };
  focus: GlobeNodeId | null;
  hover: GlobeNodeId | null;
  dense: boolean;
  dissolving: boolean;
  pointer: Pointer;
  onProject: (marks: ProjectedMark[]) => void;
};

const scratch = new Vector3();

const BODY = {
  uniforms: { uTime: { value: 0 } },
  vertexShader: `
    varying vec3 vN;
    varying vec3 vV;
    void main() {
      vN = normalize(normalMatrix * normal);
      vec4 mv = modelViewMatrix * vec4(position, 1.0);
      vV = normalize(-mv.xyz);
      gl_Position = projectionMatrix * mv;
    }
  `,
  fragmentShader: `
    varying vec3 vN;
    varying vec3 vV;
    uniform float uTime;
    void main() {
      float f = pow(1.0 - abs(dot(vN, vV)), 2.05);
      float scan = 0.05 * sin(vN.y * 22.0 + uTime * 0.55);
      vec3 ink = vec3(0.09, 0.075, 0.07);
      vec3 rim = vec3(1.0, 0.24, 0.14);
      vec3 metal = vec3(0.38, 0.34, 0.3);
      vec3 col = mix(ink, metal, f * 0.7);
      col = mix(col, rim, f * 0.88 + scan);
      gl_FragColor = vec4(col, 0.96);
    }
  `,
};

function Body() {
  const mat = useMemo(
    () =>
      new ShaderMaterial({
        uniforms: { uTime: { value: 0 } },
        vertexShader: BODY.vertexShader,
        fragmentShader: BODY.fragmentShader,
        transparent: true,
      }),
    [],
  );

  useFrame(({ clock }) => {
    mat.uniforms.uTime.value = clock.elapsedTime;
  });

  useEffect(() => () => mat.dispose(), [mat]);

  return (
    <group>
      <mesh>
        <sphereGeometry args={[0.965, 64, 64]} />
        <meshBasicMaterial color="#171311" />
      </mesh>
      <mesh material={mat}>
        <sphereGeometry args={[0.982, 64, 64]} />
      </mesh>
    </group>
  );
}

function Core() {
  const inner = useRef<Mesh>(null);
  useFrame(({ clock }) => {
    if (!inner.current) return;
    const s = 1 + Math.sin(clock.elapsedTime * 1.3) * 0.08;
    inner.current.scale.setScalar(s);
  });
  return (
    <group>
      <mesh ref={inner}>
        <sphereGeometry args={[0.2, 24, 24]} />
        <meshBasicMaterial color="#ff2a1a" />
      </mesh>
      <mesh>
        <sphereGeometry args={[0.38, 24, 24]} />
        <meshBasicMaterial color="#ff2a1a" transparent opacity={0.16} blending={AdditiveBlending} depthWrite={false} />
      </mesh>
    </group>
  );
}

function PointCloud({
  count,
  radius,
  size,
  color,
  opacity,
}: {
  count: number;
  radius: number;
  size: number;
  color: string;
  opacity: number;
}) {
  const object = useMemo(() => {
    const geo = new BufferGeometry();
    geo.setAttribute("position", new BufferAttribute(fibonacciPoints(count, radius), 3));
    const mat = new PointsMaterial({
      color: new Color(color),
      size,
      sizeAttenuation: true,
      transparent: true,
      opacity,
      depthWrite: false,
      blending: AdditiveBlending,
    });
    return new Points(geo, mat);
  }, [color, count, opacity, radius, size]);

  useEffect(
    () => () => {
      object.geometry.dispose();
      (object.material as PointsMaterial).dispose();
    },
    [object],
  );

  return <primitive object={object} />;
}

function Topography({ dense }: { dense: boolean }) {
  const object = useMemo(() => {
    const geo = new BufferGeometry();
    geo.setAttribute("position", new BufferAttribute(topoPositions(1.002, dense), 3));
    const mat = new LineBasicMaterial({ color: "#efe8de", transparent: true, opacity: 0.42 });
    return new LineSegments(geo, mat);
  }, [dense]);

  useEffect(
    () => () => {
      object.geometry.dispose();
      (object.material as LineBasicMaterial).dispose();
    },
    [object],
  );

  return <primitive object={object} />;
}

function Rings() {
  const rings = useMemo(() => {
    const specs = [
      { r: 1.16, x: 0.42, z: 0.1, c: "#ff2a1a", o: 0.5 },
      { r: 1.28, x: -0.22, z: 0.28, c: "#f5f2ec", o: 0.22 },
      { r: 1.4, x: 0.14, z: -0.34, c: "#ff2a1a", o: 0.22 },
    ];
    return specs.map((spec) => {
      const geo = new BufferGeometry();
      geo.setAttribute("position", new BufferAttribute(ringPositions(spec.r, spec.x, spec.z), 3));
      const mat = new LineBasicMaterial({ color: spec.c, transparent: true, opacity: spec.o });
      return new Line(geo, mat);
    });
  }, []);

  useEffect(
    () => () => {
      rings.forEach((line) => {
        line.geometry.dispose();
        (line.material as LineBasicMaterial).dispose();
      });
    },
    [rings],
  );

  return (
    <group>
      {rings.map((line, index) => (
        <primitive key={index} object={line} />
      ))}
    </group>
  );
}

function Routes({ radius }: { radius: number }) {
  const lines = useMemo(() => {
    const material = new LineBasicMaterial({ color: "#ff2a1a", transparent: true, opacity: 0.42 });
    return ORBIT_PATHS.map((path) => {
      const from = GLOBE_NODES.find((node) => node.id === path.from)!;
      const to = GLOBE_NODES.find((node) => node.id === path.to)!;
      const geo = new BufferGeometry();
      geo.setAttribute(
        "position",
        new BufferAttribute(greatCircle([from.lat, from.lng], [to.lat, to.lng], radius * 1.06, 80), 3),
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

function Courier({ radius }: { radius: number }) {
  const head = useRef<Mesh>(null);
  const trail = useRef<Group>(null);
  const path = useMemo(() => {
    const from = GLOBE_NODES.find((node) => node.id === "chennai")!;
    const to = GLOBE_NODES.find((node) => node.id === "berlin")!;
    const raw = greatCircle([from.lat, from.lng], [to.lat, to.lng], radius * 1.08, 120);
    const points: Vector3[] = [];
    for (let i = 0; i < raw.length; i += 3) points.push(new Vector3(raw[i], raw[i + 1], raw[i + 2]));
    return points;
  }, [radius]);

  useFrame(({ clock }) => {
    if (!head.current || path.length < 8) return;
    const t = (clock.elapsedTime * 0.09) % 1;
    const at = (u: number) => {
      const index = ((u + 1) % 1) * (path.length - 1);
      const a = Math.floor(index);
      const b = Math.min(a + 1, path.length - 1);
      return new Vector3().lerpVectors(path[a], path[b], index - a);
    };
    head.current.position.copy(at(t));
    trail.current?.children.forEach((child, i) => {
      child.position.copy(at(t - (i + 1) * 0.018));
    });
  });

  return (
    <group>
      <mesh ref={head}>
        <sphereGeometry args={[0.028, 14, 14]} />
        <meshBasicMaterial color="#ff2a1a" />
      </mesh>
      <group ref={trail}>
        {Array.from({ length: 7 }, (_, i) => (
          <mesh key={i}>
            <sphereGeometry args={[0.014 - i * 0.0014, 8, 8]} />
            <meshBasicMaterial color="#ff2a1a" transparent opacity={0.55 - i * 0.06} blending={AdditiveBlending} depthWrite={false} />
          </mesh>
        ))}
      </group>
    </group>
  );
}

function Halo() {
  return (
    <group>
      <mesh scale={1.08}>
        <sphereGeometry args={[1, 48, 48]} />
        <meshBasicMaterial color="#ff2a1a" transparent opacity={0.14} side={BackSide} blending={AdditiveBlending} depthWrite={false} />
      </mesh>
      <mesh scale={1.22}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshBasicMaterial color="#ff2a1a" transparent opacity={0.08} side={BackSide} blending={AdditiveBlending} depthWrite={false} />
      </mesh>
      <mesh rotation={[Math.PI / 2.2, 0.2, 0.4]}>
        <ringGeometry args={[1.28, 1.31, 80]} />
        <meshBasicMaterial color="#f5f2ec" transparent opacity={0.12} side={DoubleSide} />
      </mesh>
    </group>
  );
}

function Pins({ hover, focus }: { hover: GlobeNodeId | null; focus: GlobeNodeId | null }) {
  return (
    <group>
      {GLOBE_NODES.map((node) => {
        const position = latLngToVector(node.lat, node.lng, 1.045);
        const on = hover === node.id || focus === node.id;
        return (
          <group key={node.id} position={position.toArray()}>
            <mesh>
              <sphereGeometry args={[on ? 0.034 : 0.02, 16, 16]} />
              <meshBasicMaterial color="#ff2a1a" />
            </mesh>
            <mesh>
              <sphereGeometry args={[on ? 0.07 : 0.045, 12, 12]} />
              <meshBasicMaterial color="#ff2a1a" transparent opacity={0.22} blending={AdditiveBlending} depthWrite={false} />
            </mesh>
          </group>
        );
      })}
      {ORBITING_ARTEFACTS.map((item) => {
        const position = latLngToVector(item.lat, item.lng, item.altitude);
        return (
          <mesh key={item.id} position={position.toArray()}>
            <octahedronGeometry args={[0.018, 0]} />
            <meshBasicMaterial color="#f5f2ec" transparent opacity={0.85} />
          </mesh>
        );
      })}
    </group>
  );
}

function CameraRig({ dissolving, pointer }: { dissolving: boolean; pointer: Pointer }) {
  useFrame(({ camera, clock }) => {
    const intro = Math.min(1, clock.elapsedTime / 2.1);
    const eased = 1 - (1 - intro) ** 3;
    const z = dissolving ? 2.15 : 3.15 - eased * 0.28;
    camera.position.x += (0.06 + pointer.x * 0.07 - camera.position.x) * 0.06;
    camera.position.y += (0.04 + pointer.y * 0.05 - camera.position.y) * 0.06;
    camera.position.z += (z - camera.position.z) * 0.06;
    camera.lookAt(0.2, 0, 0);
  });
  return null;
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
      const facing = scratch.clone().normalize().dot(camera.position.clone().normalize()) > 0.18;
      scratch.project(camera);
      marks.push({
        id,
        x: (scratch.x * 0.5 + 0.5) * size.width,
        y: (-scratch.y * 0.5 + 0.5) * size.height,
        z: facing ? scratch.z : 2,
        kind,
      });
    };
    GLOBE_NODES.forEach((node) => project(node.id, node.lat, node.lng, 1.14, "node"));
    ORBITING_ARTEFACTS.forEach((item) => project(item.id, item.lat, item.lng, item.altitude, "artefact"));
    onProject(marks);
  });

  return null;
}

function Scene({ rotation, focus, hover, dense, dissolving, pointer, onProject }: SceneProps) {
  const group = useRef<Group>(null);

  useFrame(() => {
    if (!group.current) return;
    group.current.rotation.x += (rotation.x - group.current.rotation.x) * 0.07;
    group.current.rotation.y += (rotation.y - group.current.rotation.y) * 0.07;
    const scale = dissolving ? 0.72 : 1;
    group.current.scale.setScalar(group.current.scale.x + (scale - group.current.scale.x) * 0.06);
  });

  return (
    <>
      <color attach="background" args={["#050505"]} />
      <CameraRig dissolving={dissolving} pointer={pointer} />
      <PointCloud count={dense ? 700 : 280} radius={5.2} size={0.01} color="#f5f2ec" opacity={0.22} />
      <group ref={group} position={[0.32, 0, 0]}>
        <Halo />
        <Body />
        <Core />
        <Topography dense={dense} />
        <PointCloud count={dense ? 1800 : 900} radius={1.02} size={0.014} color="#f5f2ec" opacity={0.7} />
        <Rings />
        <Routes radius={1} />
        <Courier radius={1} />
        <Pins hover={hover} focus={focus} />
      </group>
      <Projector group={group} onProject={onProject} />
    </>
  );
}

export function GlobeCanvas(props: SceneProps) {
  return (
    <Canvas
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: false, powerPreference: "high-performance", failIfMajorPerformanceCaveat: false }}
      camera={{ position: [0.06, 0.04, 3.05], fov: 36 }}
      onCreated={({ gl }) => {
        gl.setClearColor("#050505", 1);
      }}
    >
      <Scene {...props} />
    </Canvas>
  );
}
