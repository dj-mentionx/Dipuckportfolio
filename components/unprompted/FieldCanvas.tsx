"use client";

import { useEffect, useRef } from "react";

type FieldCanvasProps = {
  energy: number;
  mention: number;
  voices: [number, number, number, number];
};

const VERT = `
attribute vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

const FRAG = `
precision highp float;
uniform vec2 uResolution;
uniform float uTime;
uniform vec2 uMouse;
uniform float uEnergy;
uniform float uMention;
uniform vec4 uVoices;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  float a = hash(i);
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
}

float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  mat2 m = mat2(1.6, 1.2, -1.2, 1.6);
  for (int i = 0; i < 5; i++) {
    v += a * noise(p);
    p = m * p;
    a *= 0.5;
  }
  return v;
}

void main() {
  vec2 uv = gl_FragCoord.xy / uResolution.xy;
  vec2 p = (gl_FragCoord.xy - 0.5 * uResolution) / min(uResolution.x, uResolution.y);
  float t = uTime * 0.07;

  vec2 q = vec2(fbm(p + t), fbm(p + vec2(5.2, 1.3) - t * 0.8));
  vec2 r = vec2(
    fbm(p + 1.4 * q + vec2(1.7, 9.2) + t * 0.25),
    fbm(p + 1.4 * q + vec2(8.3, 2.8) - t * 0.18)
  );
  float f = fbm(p + r);

  float filaments = pow(abs(sin(f * 11.0 + t * 1.8)), 16.0);
  float haze = smoothstep(0.2, 0.85, f) * 0.22;

  vec2 m = (uMouse - 0.5) * vec2(uResolution.x / uResolution.y, 1.0);
  float d = length(p - m);
  float caustic = exp(-d * 3.2) * (0.22 + uEnergy * 1.05);

  vec3 gpt = vec3(0.93, 0.91, 0.86);
  vec3 claude = vec3(0.80, 0.64, 0.38);
  vec3 gemini = vec3(0.52 + 0.22 * sin(uTime * 0.4), 0.56, 0.98);
  vec3 ppx = vec3(0.52, 0.70, 0.76);

  vec3 wash =
    gpt * uVoices.x * smoothstep(0.15, 0.9, uv.x * (1.0 - uv.y)) +
    claude * uVoices.y * smoothstep(0.15, 0.9, (1.0 - uv.x) * (1.0 - uv.y)) +
    gemini * uVoices.z * smoothstep(0.15, 0.9, uv.x * uv.y) +
    ppx * uVoices.w * smoothstep(0.15, 0.9, (1.0 - uv.x) * uv.y);

  vec3 base = vec3(0.012, 0.013, 0.018);
  vec3 col = base;
  col += haze * vec3(0.07, 0.09, 0.13);
  col += filaments * vec3(0.62, 0.70, 0.86) * (0.18 + uEnergy * 0.55);
  col += wash * (0.12 + filaments * 0.75);
  col += caustic * mix(vec3(0.65, 0.78, 1.0), vec3(1.0, 0.32, 0.18), uMention);
  col += uMention * filaments * vec3(1.0, 0.26, 0.16) * 0.55;

  float letter = smoothstep(0.0, 0.04, uv.y) * smoothstep(1.0, 0.96, uv.y);
  float vig = smoothstep(1.2, 0.28, length((uv - 0.5) * vec2(1.15, 1.35)));
  col *= vig * mix(0.55, 1.0, letter);

  gl_FragColor = vec4(col, 1.0);
}
`;

function compile(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type);
  if (!shader) throw new Error("shader");
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    throw new Error(gl.getShaderInfoLog(shader) || "compile");
  }
  return shader;
}

export function FieldCanvas({ energy, mention, voices }: FieldCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const energyRef = useRef(energy);
  const mentionRef = useRef(mention);
  const voicesRef = useRef(voices);
  const mouseRef = useRef({ x: 0.5, y: 0.5 });

  energyRef.current = energy;
  mentionRef.current = mention;
  voicesRef.current = voices;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl", { antialias: false, alpha: false });
    if (!gl) return;

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, compile(gl, gl.VERTEX_SHADER, VERT));
    gl.attachShader(program, compile(gl, gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(program);
    gl.useProgram(program);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(program, "position");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    const uResolution = gl.getUniformLocation(program, "uResolution");
    const uTime = gl.getUniformLocation(program, "uTime");
    const uMouse = gl.getUniformLocation(program, "uMouse");
    const uEnergy = gl.getUniformLocation(program, "uEnergy");
    const uMention = gl.getUniformLocation(program, "uMention");
    const uVoices = gl.getUniformLocation(program, "uVoices");

    let raf = 0;
    const start = performance.now();

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.75);
      const w = window.innerWidth;
      const h = window.innerHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      gl.viewport(0, 0, canvas.width, canvas.height);
    };

    const onMove = (event: PointerEvent) => {
      mouseRef.current = {
        x: event.clientX / window.innerWidth,
        y: 1 - event.clientY / window.innerHeight,
      };
    };

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onMove, { passive: true });

    const frame = (now: number) => {
      gl.uniform2f(uResolution, canvas.width, canvas.height);
      gl.uniform1f(uTime, (now - start) / 1000);
      gl.uniform2f(uMouse, mouseRef.current.x, mouseRef.current.y);
      gl.uniform1f(uEnergy, energyRef.current);
      gl.uniform1f(uMention, mentionRef.current);
      const v = voicesRef.current;
      gl.uniform4f(uVoices, v[0], v[1], v[2], v[3]);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
    };
  }, []);

  return <canvas ref={canvasRef} className="pointer-events-none fixed inset-0 z-0 h-full w-full" />;
}
