import { useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { AdditiveBlending, CanvasTexture, Color, CylinderGeometry, MathUtils, Vector3 } from 'three';

// Vertical extent of the particle flow, in world units
const TOP_Y = 2.75;
const BOTTOM_Y = -2.6;

const LAYERS = [
  { key: 'bronze', y: 1.25, color: '#cd7f32', label: 'Bronze', note: 'Raw' },
  { key: 'silver', y: 0, color: '#cbd5e1', label: 'Silver', note: 'Cleaned' },
  { key: 'gold', y: -1.25, color: '#fbbf24', label: 'Gold', note: 'Curated' }
];

const LABELS = [
  { y: TOP_Y - 0.6, color: '#94a3b8', title: 'Sources', note: 'SQL · APIs' },
  ...LAYERS.map((layer) => ({ y: layer.y, color: layer.color, title: layer.label, note: layer.note })),
  { y: BOTTOM_Y + 0.3, color: '#fbbf24', title: 'Insights', note: 'Power BI' }
];

const PARTICLE_COUNT = 900;
const PLATFORM_RADIUS = 1.55;
const GRID_SIZE = 7;
const GRID_SPACING = 0.26;

// Raw source data arrives in mixed, muted colours before the layers unify it
const SOURCE_COLORS = ['#64748b', '#38bdf8', '#a78bfa', '#f472b6', '#34d399'].map((c) => new Color(c));
const LAYER_COLORS = LAYERS.map((layer) => new Color(layer.color));

const createDotTexture = () => {
  const size = 64;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  gradient.addColorStop(0, 'rgba(255,255,255,1)');
  gradient.addColorStop(0.4, 'rgba(255,255,255,0.6)');
  gradient.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);
  return new CanvasTexture(canvas);
};

// Fixed per-particle randomness: where it starts, how fast it falls, and its slot in the ordered grid
const SEEDS = Array.from({ length: PARTICLE_COUNT }, (_, i) => {
  const angle = Math.random() * Math.PI * 2;
  const radius = 0.25 + Math.sqrt(Math.random()) * 1.6;
  return {
    offset: Math.random(),
    speed: 0.035 + Math.random() * 0.03,
    chaosX: Math.cos(angle) * radius,
    chaosZ: Math.sin(angle) * radius,
    gridX: ((i % GRID_SIZE) - (GRID_SIZE - 1) / 2) * GRID_SPACING,
    gridZ: ((Math.floor(i / GRID_SIZE) % GRID_SIZE) - (GRID_SIZE - 1) / 2) * GRID_SPACING,
    phase: Math.random() * Math.PI * 2,
    source: SOURCE_COLORS[i % SOURCE_COLORS.length]
  };
});

const scratch = new Color();

// Particles start scattered and are pulled into an ordered grid as they pass Bronze -> Silver -> Gold
const DataParticles = () => {
  const pointsRef = useRef(null);

  const { positions, colors, texture } = useMemo(
    () => ({
      positions: new Float32Array(PARTICLE_COUNT * 3),
      colors: new Float32Array(PARTICLE_COUNT * 3),
      texture: createDotTexture()
    }),
    []
  );

  useFrame(({ clock }) => {
    const time = clock.elapsedTime;
    const [bronze, silver, gold] = LAYERS;
    const geometry = pointsRef.current.geometry;
    const positions = geometry.attributes.position.array;
    const colors = geometry.attributes.color.array;

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const seed = SEEDS[i];
      const progress = (seed.offset + time * seed.speed) % 1;
      const y = TOP_Y - progress * (TOP_Y - BOTTOM_Y);

      // 0 = chaotic raw data above Bronze, 1 = fully ordered at Gold and below
      const ordered = 1 - MathUtils.smoothstep(y, gold.y, bronze.y);
      const wobble = (1 - ordered) * 0.22;

      positions[i * 3] = MathUtils.lerp(seed.chaosX, seed.gridX, ordered) + Math.sin(time * 0.9 + seed.phase) * wobble;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = MathUtils.lerp(seed.chaosZ, seed.gridZ, ordered) + Math.cos(time * 0.7 + seed.phase) * wobble;

      if (y > bronze.y) {
        scratch.copy(seed.source).lerp(LAYER_COLORS[0], 1 - MathUtils.smoothstep(y, bronze.y, bronze.y + 0.9));
      } else if (y > silver.y) {
        scratch.copy(LAYER_COLORS[0]).lerp(LAYER_COLORS[1], 1 - MathUtils.smoothstep(y, silver.y, bronze.y));
      } else {
        scratch.copy(LAYER_COLORS[1]).lerp(LAYER_COLORS[2], 1 - MathUtils.smoothstep(y, gold.y, silver.y));
      }

      // Additive blending: dimming the colour fades the particle in at the top and out at the bottom
      const fade = Math.min(MathUtils.smoothstep(progress, 0, 0.08), 1 - MathUtils.smoothstep(progress, 0.9, 1));
      colors[i * 3] = scratch.r * fade;
      colors[i * 3 + 1] = scratch.g * fade;
      colors[i * 3 + 2] = scratch.b * fade;
    }

    geometry.attributes.position.needsUpdate = true;
    geometry.attributes.color.needsUpdate = true;
  });

  return (
    <points ref={pointsRef} frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.15}
        map={texture}
        vertexColors
        transparent
        depthWrite={false}
        blending={AdditiveBlending}
        sizeAttenuation
      />
    </points>
  );
};

const Platform = ({ layer, index }) => {
  const groupRef = useRef(null);

  const { outer, inner } = useMemo(
    () => ({
      outer: new CylinderGeometry(PLATFORM_RADIUS, PLATFORM_RADIUS, 0.05, 6),
      inner: new CylinderGeometry(PLATFORM_RADIUS * 0.62, PLATFORM_RADIUS * 0.62, 0.05, 6)
    }),
    []
  );

  useFrame((_, delta) => {
    groupRef.current.rotation.y += delta * 0.12 * (index % 2 ? -1 : 1);
  });

  return (
    <group ref={groupRef} position={[0, layer.y, 0]}>
      <mesh geometry={outer}>
        <meshBasicMaterial color={layer.color} transparent opacity={0.1} depthWrite={false} />
      </mesh>
      <lineSegments>
        <edgesGeometry args={[outer]} />
        <lineBasicMaterial color={layer.color} transparent opacity={0.95} />
      </lineSegments>
      <lineSegments>
        <edgesGeometry args={[inner]} />
        <lineBasicMaterial color={layer.color} transparent opacity={0.35} />
      </lineSegments>
    </group>
  );
};

const LABEL_X = 1.95;
const projected = new Vector3();

// Keeps the HTML labels (rendered outside the canvas) pinned to their 3D anchor points
const LabelAnchors = ({ labelRefs }) => {
  const anchorRefs = useRef([]);

  useFrame(({ camera, size }) => {
    anchorRefs.current.forEach((anchor, i) => {
      const element = labelRefs.current[i];
      if (!anchor || !element) return;
      anchor.getWorldPosition(projected).project(camera);
      const x = (projected.x * 0.5 + 0.5) * size.width;
      const y = (-projected.y * 0.5 + 0.5) * size.height;
      element.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0) translateY(-50%)`;
      element.style.opacity = 1;
    });
  });

  return LABELS.map((label, i) => (
    <object3D
      key={label.title}
      position={[LABEL_X, label.y, 0]}
      ref={(node) => {
        anchorRefs.current[i] = node;
      }}
    />
  ));
};

const Lakehouse = ({ labelRefs }) => {
  const tiltRef = useRef(null);

  // Ease the whole scene toward the pointer for a light parallax
  useFrame(({ pointer }, delta) => {
    const tilt = tiltRef.current;
    tilt.rotation.x = MathUtils.damp(tilt.rotation.x, 0.34 - pointer.y * 0.12, 3, delta);
    tilt.rotation.y = MathUtils.damp(tilt.rotation.y, pointer.x * 0.3, 3, delta);
  });

  return (
    <group ref={tiltRef} rotation={[0.34, 0, 0]} position={[-1.05, 0, 0]}>
      {LAYERS.map((layer, index) => (
        <Platform key={layer.key} layer={layer} index={index} />
      ))}
      <DataParticles />

      <LabelAnchors labelRefs={labelRefs} />
    </group>
  );
};

const LakehouseScene = ({ active = true }) => {
  const labelRefs = useRef([]);

  return (
    <>
      <Canvas
        className="lakehouse-canvas"
        camera={{ position: [0, 0.1, 10.5], fov: 36 }}
        dpr={[1, 1.75]}
        gl={{ antialias: true, alpha: true }}
        frameloop={active ? 'always' : 'never'}
      >
        <Lakehouse labelRefs={labelRefs} />
      </Canvas>
      <div className="lake-labels" aria-hidden="true">
        {LABELS.map((label, i) => (
          <div
            key={label.title}
            className="lake-label"
            style={{ '--lake-color': label.color }}
            ref={(node) => {
              labelRefs.current[i] = node;
            }}
          >
            <span className="lake-label-dot"></span>
            <span className="lake-label-title">{label.title}</span>
            <span className="lake-label-note">{label.note}</span>
          </div>
        ))}
      </div>
    </>
  );
};

export default LakehouseScene;
