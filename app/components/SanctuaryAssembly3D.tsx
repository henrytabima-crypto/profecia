"use client";

/* eslint-disable react/no-unknown-property -- React Three Fiber elements use Three.js props. */

import { OrbitControls, useGLTF, useTexture } from "@react-three/drei";
import { Canvas, type ThreeEvent, useFrame, useThree } from "@react-three/fiber";
import {
  type ComponentRef,
  type ReactNode,
  type RefObject,
  Suspense,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Box3,
  Group,
  InstancedMesh,
  MathUtils,
  type Material,
  Matrix4,
  Mesh,
  MirroredRepeatWrapping,
  PerspectiveCamera,
  Quaternion,
  SRGBColorSpace,
  Vector3,
} from "three";
import {
  sanctuaryEnvironmentModels,
  sanctuaryItemAssembly,
  sanctuaryStations,
  type SanctuaryStationId,
} from "../data/sanctuary";
import AssetErrorBoundary from "./three/AssetErrorBoundary";

type SanctuaryAssembly3DProps = {
  activeIndex: number | null;
  focusRequest: number;
  onSelect: (index: number) => void;
};

type SelectableProps = {
  active: boolean;
  children: ReactNode;
  onSelect: () => void;
  position?: readonly [number, number, number];
  rotationY?: number;
};

type FocusSpec = {
  target: [number, number, number];
  radius: number;
};

type PreparedModel = {
  materials: Material[];
  model: Group;
  size: Vector3;
};

const FALLBACK_FOCUS: Record<SanctuaryStationId, FocusSpec> = {
  entrance: { target: [0, 0.31, 5.72], radius: 1.3 },
  altar: { target: [0, 0.27, 2.65], radius: 0.48 },
  laver: { target: [0, 0.22, 0.55], radius: 0.32 },
  table: { target: [0.31, 0.23, -2.72], radius: 0.34 },
  lampstand: { target: [-0.31, 0.27, -2.72], radius: 0.34 },
  incense: { target: [0, 0.2, -3.72], radius: 0.28 },
  ark: { target: [0, 0.25, -4.62], radius: 0.38 },
};

const TABERNACLE_WIDTH = 2;
const OVERVIEW_CAMERA_POSITION = [8.8, 7.4, 11.5] as const;
const OVERVIEW_CAMERA_TARGET = [0, 0.15, 0.35] as const;

function Selectable({ active, children, onSelect, position, rotationY = 0 }: SelectableProps) {
  const [hovered, setHovered] = useState(false);

  useEffect(() => () => {
    document.body.style.cursor = "";
  }, []);

  return (
    <group
      position={position ? [...position] : undefined}
      rotation={[0, rotationY, 0]}
      scale={active || hovered ? 1.035 : 1}
      onClick={(event: ThreeEvent<MouseEvent>) => {
        event.stopPropagation();
        if (event.delta > 4) return;
        onSelect();
      }}
      onPointerOver={(event) => {
        event.stopPropagation();
        setHovered(true);
        document.body.style.cursor = "pointer";
      }}
      onPointerOut={() => {
        setHovered(false);
        document.body.style.cursor = "";
      }}
    >
      {children}
    </group>
  );
}

function prepareModel(scene: Group, longestHorizontalAxis: "x" | "z", castShadow = true): PreparedModel {
  const root = new Group();
  const model = scene.clone(true);
  const materials: Material[] = [];

  model.traverse((child) => {
    if (!(child instanceof Mesh)) return;
    child.castShadow = castShadow;
    child.receiveShadow = true;
    if (Array.isArray(child.material)) {
      child.material = child.material.map((material) => {
        const clone = material.clone();
        materials.push(clone);
        return clone;
      });
    } else {
      const clone = child.material.clone();
      materials.push(clone);
      child.material = clone;
    }
  });

  root.add(model);
  root.updateMatrixWorld(true);
  const initialSize = new Box3().setFromObject(root).getSize(new Vector3());
  const shouldRotate = longestHorizontalAxis === "x"
    ? initialSize.z > initialSize.x
    : initialSize.x > initialSize.z;
  if (shouldRotate) model.rotation.y = Math.PI / 2;

  root.updateMatrixWorld(true);
  const orientedBounds = new Box3().setFromObject(root);
  const center = orientedBounds.getCenter(new Vector3());
  model.position.add(new Vector3(-center.x, -orientedBounds.min.y, -center.z));
  root.updateMatrixWorld(true);

  return {
    materials,
    model: root,
    size: new Box3().setFromObject(root).getSize(new Vector3()),
  };
}

function useModelOpacity(materials: Material[], opacity: number) {
  const invalidate = useThree((state) => state.invalidate);
  useEffect(() => {
    materials.forEach((material) => {
      const wasTransparent = material.transparent;
      material.opacity = opacity;
      material.transparent = opacity < 0.995;
      material.depthWrite = opacity >= 0.5;
      if (material.transparent !== wasTransparent) material.needsUpdate = true;
    });
    invalidate();
  }, [invalidate, materials, opacity]);

  useEffect(() => () => {
    materials.forEach((material) => material.dispose());
  }, [materials]);
}

function CourtyardGround() {
  const sourceTexture = useTexture("/textures/sanctuary-dirt-v1.webp");
  const { gl, invalidate } = useThree();
  const texture = useMemo(() => {
    const configured = sourceTexture.clone();
    configured.wrapS = MirroredRepeatWrapping;
    configured.wrapT = MirroredRepeatWrapping;
    configured.repeat.set(2.6, 5.1);
    configured.colorSpace = SRGBColorSpace;
    configured.anisotropy = Math.min(gl.capabilities.getMaxAnisotropy(), 8);
    configured.needsUpdate = true;
    return configured;
  }, [gl, sourceTexture]);

  useEffect(() => {
    invalidate();
    return () => texture.dispose();
  }, [invalidate, texture]);

  return (
    <mesh position={[0, -0.08, 0]} receiveShadow>
      <boxGeometry args={[6.05, 0.14, 11.8]} />
      <meshStandardMaterial color="#9a876c" map={texture} metalness={0} roughness={0.98} />
    </mesh>
  );
}

function CourtyardGroundFallback() {
  return (
    <mesh position={[0, -0.08, 0]} receiveShadow>
      <boxGeometry args={[6.05, 0.14, 11.8]} />
      <meshStandardMaterial color="#8d7655" roughness={0.98} />
    </mesh>
  );
}

type PanelSpec = {
  key: string;
  length: number;
  position: [number, number, number];
  rotationY: number;
};

function courtyardPanelSpecs(): PanelSpec[] {
  const specs: PanelSpec[] = [];
  const addSpan = (key: string, x1: number, z1: number, x2: number, z2: number) => {
    const dx = x2 - x1;
    const dz = z2 - z1;
    specs.push({
      key,
      length: Math.hypot(dx, dz),
      position: [(x1 + x2) / 2, 0, (z1 + z2) / 2],
      rotationY: Math.atan2(-dz, dx),
    });
  };

  const longZ = [
    -5.75,
    ...Array.from({ length: 19 }, (_, index) => -5.75 + (index + 1) * (11.5 / 20)),
    5.75,
  ];
  [
    { x: -2.875, positions: [...longZ].reverse() },
    { x: 2.875, positions: longZ },
  ].forEach(({ x, positions }) => {
    positions.slice(0, -1).forEach((z, index) => addSpan(`long-${x}-${index}`, x, z, x, positions[index + 1]));
  });

  const westX = Array.from({ length: 11 }, (_, index) => -2.875 + index * (5.75 / 10));
  westX.slice(0, -1).forEach((x, index) => addSpan(`west-${index}`, x, -5.75, westX[index + 1], -5.75));

  const eastLeft = [-1.15, -1.725, -2.3, -2.875];
  const eastRight = [2.875, 2.3, 1.725, 1.15];
  [eastLeft, eastRight].forEach((positions, side) => {
    positions.slice(0, -1).forEach((x, index) => addSpan(`east-${side}-${index}`, x, 5.75, positions[index + 1], 5.75));
  });

  return specs;
}

function CourtyardPanels({ opacity }: { opacity: number }) {
  const { scene } = useGLTF(sanctuaryEnvironmentModels.courtyardPanel);
  const prepared = useMemo(() => prepareModel(scene, "x", false), [scene]);
  useModelOpacity(prepared.materials, opacity);
  const instancesRef = useRef<InstancedMesh>(null);
  const sourceMesh = useMemo(() => {
    let result: Mesh | null = null;
    prepared.model.updateMatrixWorld(true);
    prepared.model.traverse((child) => {
      if (!result && child instanceof Mesh) result = child;
    });
    if (!result) throw new Error("El módulo del atrio no contiene una malla utilizable.");
    return result as Mesh;
  }, [prepared.model]);
  const modules = useMemo(() => courtyardPanelSpecs().map((spec) => ({
    ...spec,
    scale: [
      spec.length / Math.max(prepared.size.x, 0.001),
      0.64 / Math.max(prepared.size.y, 0.001),
      0.085 / Math.max(prepared.size.z, 0.001),
    ] as [number, number, number],
  })), [prepared.size]);

  useLayoutEffect(() => {
    const instances = instancesRef.current;
    if (!instances) return;
    const moduleMatrix = new Matrix4();
    const finalMatrix = new Matrix4();
    const quaternion = new Quaternion();
    const up = new Vector3(0, 1, 0);

    modules.forEach((module, index) => {
      quaternion.setFromAxisAngle(up, module.rotationY);
      moduleMatrix.compose(
        new Vector3(...module.position),
        quaternion,
        new Vector3(...module.scale),
      );
      finalMatrix.multiplyMatrices(moduleMatrix, sourceMesh.matrixWorld);
      instances.setMatrixAt(index, finalMatrix);
    });
    instances.instanceMatrix.needsUpdate = true;
    instances.computeBoundingBox();
    instances.computeBoundingSphere();
  }, [modules, sourceMesh]);

  return (
    <instancedMesh
      ref={instancesRef}
      args={[sourceMesh.geometry, sourceMesh.material, modules.length]}
      castShadow={false}
      receiveShadow
      visible={opacity > 0.01}
    />
  );
}

function CourtyardPanelsFallback() {
  return (
    <group>
      <mesh position={[0, 0.3, -5.73]}><boxGeometry args={[5.75, 0.5, 0.035]} /><meshStandardMaterial color="#d8d0bb" roughness={0.9} /></mesh>
      {[-2.86, 2.86].map((x) => <mesh key={x} position={[x, 0.3, 0]}><boxGeometry args={[0.035, 0.5, 11.5]} /><meshStandardMaterial color="#d8d0bb" roughness={0.9} /></mesh>)}
      {[-2.0125, 2.0125].map((x) => <mesh key={x} position={[x, 0.3, 5.73]}><boxGeometry args={[1.725, 0.5, 0.035]} /><meshStandardMaterial color="#d8d0bb" roughness={0.9} /></mesh>)}
    </group>
  );
}

function EntranceGate({ active, onSelect, opacity }: { active: boolean; onSelect: () => void; opacity: number }) {
  const { scene } = useGLTF(sanctuaryEnvironmentModels.entranceGate);
  const prepared = useMemo(() => prepareModel(scene, "x"), [scene]);
  useModelOpacity(prepared.materials, opacity);
  const scale = useMemo(() => [
    2.3 / Math.max(prepared.size.x, 0.001),
    0.64 / Math.max(prepared.size.y, 0.001),
    0.12 / Math.max(prepared.size.z, 0.001),
  ] as [number, number, number], [prepared.size]);

  return (
    <group visible={opacity > 0.01}>
      <Selectable active={active} position={[0, 0, 5.72]} onSelect={onSelect}>
        <primitive object={prepared.model} scale={scale} />
        <mesh position={[0, 0.32, 0]}>
          <boxGeometry args={[2.4, 0.68, 0.2]} />
          <meshBasicMaterial color="#e4c98e" depthWrite={false} opacity={active ? 0.08 : 0.001} transparent wireframe={active} />
        </mesh>
      </Selectable>
    </group>
  );
}

function EntranceGateFallback({ active, onSelect }: { active: boolean; onSelect: () => void }) {
  const colors = ["#d8d0bb", "#244f78", "#6e3e75", "#9b3f45", "#d8d0bb"];
  return (
    <Selectable active={active} position={[0, 0, 5.72]} onSelect={onSelect}>
      {colors.map((color, index) => <mesh key={color + index} position={[-0.92 + index * 0.46, 0.31, 0]}><boxGeometry args={[0.47, 0.5, 0.028]} /><meshStandardMaterial color={color} roughness={0.86} /></mesh>)}
    </Selectable>
  );
}

function TabernacleEnvironment({ opacity }: { opacity: number }) {
  const { scene } = useGLTF(sanctuaryEnvironmentModels.tabernacleCutaway);
  const prepared = useMemo(() => prepareModel(scene, "z"), [scene]);
  useModelOpacity(prepared.materials, opacity);
  const scale = useMemo(() => [
    -TABERNACLE_WIDTH / Math.max(prepared.size.x, 0.001),
    1.15 / Math.max(prepared.size.y, 0.001),
    -3.45 / Math.max(prepared.size.z, 0.001),
  ] as [number, number, number], [prepared.size]);

  return <primitive object={prepared.model} position={[0, 0.008, -3.475]} scale={scale} />;
}

function TabernacleFallback() {
  return (
    <group>
      <mesh position={[-TABERNACLE_WIDTH / 2, 0.575, -3.475]}><boxGeometry args={[0.055, 1.15, 3.45]} /><meshStandardMaterial color="#b88c36" opacity={0.48} transparent /></mesh>
      <mesh position={[0, 0.575, -5.2]}><boxGeometry args={[TABERNACLE_WIDTH, 1.15, 0.06]} /><meshStandardMaterial color="#b88c36" roughness={0.45} /></mesh>
      <mesh position={[0, -0.04, -3.475]}><boxGeometry args={[TABERNACLE_WIDTH, 0.08, 3.45]} /><meshStandardMaterial color="#6e5e45" roughness={0.92} /></mesh>
    </group>
  );
}

type FurnishingConfig = (typeof sanctuaryItemAssembly)[number];

function FurnishingModel({
  config,
  active,
  onSelect,
  registerFocus,
}: {
  config: FurnishingConfig;
  active: boolean;
  onSelect: () => void;
  registerFocus: (id: SanctuaryStationId, focus: FocusSpec) => void;
}) {
  const { scene } = useGLTF(config.modelUrl);
  const normalized = useMemo(() => {
    const model = scene.clone(true);
    model.traverse((child) => {
      if (child instanceof Mesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
    model.updateMatrixWorld(true);

    const bounds = new Box3().setFromObject(model);
    const size = bounds.getSize(new Vector3());
    const center = bounds.getCenter(new Vector3());
    const scale = config.targetMax / Math.max(size.x, size.y, size.z, 0.001);
    const scaledSize = size.multiplyScalar(scale);
    const padding = config.id === "lampstand" ? 0.12 : 0.06;
    const hitSize = [
      Math.max(scaledSize.x + padding, 0.24),
      Math.max(scaledSize.y + padding, 0.26),
      Math.max(scaledSize.z + padding, 0.24),
    ] as [number, number, number];

    return {
      model,
      modelPosition: [-center.x * scale, -bounds.min.y * scale, -center.z * scale] as [number, number, number],
      modelScale: scale,
      hitCenter: [0, scaledSize.y / 2, 0] as [number, number, number],
      hitSize,
      haloRadius: Math.max(hitSize[0], hitSize[2]) * 0.42,
      focusRadius: Math.hypot(scaledSize.x, scaledSize.y, scaledSize.z) * 0.53,
    };
  }, [config.id, config.targetMax, scene]);

  useEffect(() => {
    registerFocus(config.id, {
      target: [config.position[0], normalized.hitCenter[1], config.position[2]],
      radius: normalized.focusRadius,
    });
  }, [config.id, config.position, normalized.focusRadius, normalized.hitCenter, registerFocus]);

  return (
    <Selectable active={active} position={config.position} rotationY={config.rotationY} onSelect={onSelect}>
      <primitive object={normalized.model} position={normalized.modelPosition} scale={normalized.modelScale} />
      <mesh position={normalized.hitCenter}>
        <boxGeometry args={normalized.hitSize} />
        <meshBasicMaterial color="#e4c98e" depthWrite={false} opacity={active ? 0.08 : 0.001} transparent wireframe={active} />
      </mesh>
      {active && <mesh position={[0, 0.025, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[normalized.haloRadius, normalized.haloRadius + 0.045, 36]} />
        <meshBasicMaterial color="#e4c98e" opacity={0.64} transparent />
      </mesh>}
    </Selectable>
  );
}

function FurnishingFallback({ config, active }: { config: FurnishingConfig; active: boolean }) {
  return (
    <group position={[...config.position]}>
      <mesh position={[0, 0.14, 0]}>
        <boxGeometry args={[0.26, 0.28, 0.26]} />
        <meshBasicMaterial color="#e4c98e" opacity={active ? 0.18 : 0.06} transparent wireframe />
      </mesh>
    </group>
  );
}

type CameraTween = {
  duration: number;
  fromPosition: Vector3;
  fromTarget: Vector3;
  startedAt: number;
  toPosition: Vector3;
  toTarget: Vector3;
};

function CameraFocusRig({
  activeId,
  focusRequest,
  focusRevision,
  registry,
}: {
  activeId: SanctuaryStationId | null;
  focusRequest: number;
  focusRevision: number;
  registry: RefObject<Map<SanctuaryStationId, FocusSpec>>;
}) {
  const controlsRef = useRef<ComponentRef<typeof OrbitControls>>(null);
  const tween = useRef<CameraTween | null>(null);
  const { camera, invalidate } = useThree();

  useEffect(() => {
    const controls = controlsRef.current;
    if (!controls) return;
    controls.target.set(...OVERVIEW_CAMERA_TARGET);
    controls.update();
    invalidate();
  }, [invalidate]);

  useEffect(() => {
    if (focusRequest === 0) return;
    const controls = controlsRef.current;
    if (!controls) return;

    let nextTarget: Vector3;
    let nextPosition: Vector3;

    if (activeId === null) {
      nextTarget = new Vector3(...OVERVIEW_CAMERA_TARGET);
      nextPosition = new Vector3(...OVERVIEW_CAMERA_POSITION);
    } else {
      const focus = registry.current.get(activeId) ?? FALLBACK_FOCUS[activeId];
      nextTarget = new Vector3(...focus.target);
      const direction = camera.position.clone().sub(controls.target);
      if (direction.lengthSq() < 0.0001) direction.set(1, 0.65, 1);
      direction.normalize();
      direction.y = Math.max(direction.y, 0.28);
      direction.normalize();

      const perspective = camera as PerspectiveCamera;
      const verticalFov = MathUtils.degToRad(perspective.fov);
      const horizontalFov = 2 * Math.atan(Math.tan(verticalFov / 2) * perspective.aspect);
      const limitingFov = Math.min(verticalFov, horizontalFov);
      const distance = MathUtils.clamp((focus.radius / Math.sin(limitingFov / 2)) * 1.35, 0.95, 8.2);
      nextPosition = nextTarget.clone().addScaledVector(direction, distance);
    }

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      tween.current = null;
      camera.position.copy(nextPosition);
      controls.target.copy(nextTarget);
      controls.update();
      invalidate();
      return;
    }

    tween.current = {
      duration: 760,
      fromPosition: camera.position.clone(),
      fromTarget: controls.target.clone(),
      startedAt: performance.now(),
      toPosition: nextPosition,
      toTarget: nextTarget,
    };
    invalidate();
  }, [activeId, camera, focusRequest, focusRevision, invalidate, registry]);

  useFrame(() => {
    const animation = tween.current;
    const controls = controlsRef.current;
    if (!animation || !controls) return;
    const linear = Math.min((performance.now() - animation.startedAt) / animation.duration, 1);
    const eased = linear < 0.5
      ? 4 * linear * linear * linear
      : 1 - Math.pow(-2 * linear + 2, 3) / 2;

    camera.position.lerpVectors(animation.fromPosition, animation.toPosition, eased);
    controls.target.lerpVectors(animation.fromTarget, animation.toTarget, eased);
    controls.update();

    if (linear < 1) {
      invalidate();
    } else {
      camera.position.copy(animation.toPosition);
      controls.target.copy(animation.toTarget);
      controls.update();
      tween.current = null;
    }
  });

  useEffect(() => () => {
    tween.current = null;
  }, []);

  return (
    <OrbitControls
      ref={controlsRef}
      enableDamping={false}
      enablePan={false}
      maxDistance={22}
      maxPolarAngle={Math.PI * 0.49}
      minDistance={0.58}
      minPolarAngle={Math.PI * 0.16}
      onStart={() => {
        tween.current = null;
        invalidate();
      }}
    />
  );
}

function stationIndex(id: SanctuaryStationId) {
  return sanctuaryStations.findIndex((station) => station.id === id);
}

function environmentOpacity(activeId: SanctuaryStationId | null) {
  if (activeId === null || activeId === "entrance") return { court: 1, gate: 1, tent: 1 };
  if (activeId === "altar" || activeId === "laver") return { court: 0.58, gate: 0.42, tent: 0.82 };
  if (activeId === "table" || activeId === "lampstand") return { court: 0, gate: 0, tent: 0.2 };
  if (activeId === "incense") return { court: 0, gate: 0, tent: 0.16 };
  return { court: 0, gate: 0, tent: 0.11 };
}

export default function SanctuaryAssembly3D({ activeIndex, focusRequest, onSelect }: SanctuaryAssembly3DProps) {
  const [assetFailed, setAssetFailed] = useState(false);
  const [focusRevisions, setFocusRevisions] = useState<Partial<Record<SanctuaryStationId, number>>>({});
  const activeId = activeIndex === null ? null : sanctuaryStations[activeIndex]?.id ?? null;
  const opacity = environmentOpacity(activeId);
  const focusRegistry = useRef(new Map<SanctuaryStationId, FocusSpec>(
    Object.entries(FALLBACK_FOCUS) as [SanctuaryStationId, FocusSpec][],
  ));
  const registerFocus = useCallback((id: SanctuaryStationId, focus: FocusSpec) => {
    focusRegistry.current.set(id, focus);
    setFocusRevisions((current) => ({ ...current, [id]: (current[id] ?? 0) + 1 }));
  }, []);

  return (
    <div className="three-scene-shell">
      <p className="visually-hidden">Reconstrucción tridimensional del santuario del desierto. El cerramiento, la entrada, la tienda recortada y seis muebles independientes forman una asamblea interactiva a escala.</p>
      <div className="three-canvas-frame" aria-hidden="true">
        <Canvas camera={{ position: [...OVERVIEW_CAMERA_POSITION], fov: 42, near: 0.1, far: 80 }} dpr={[1, 1.5]} frameloop="demand" gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }} onPointerMissed={() => document.body.style.cursor = ""} shadows>
          <ambientLight intensity={1.35} />
          <directionalLight position={[-4, 10, 7]} intensity={2.4} color="#fff1cf" castShadow />
          <directionalLight position={[7, 3, -6]} intensity={1.15} color="#6da4ad" />
          <pointLight position={[0, 3, -3]} intensity={0.82} color="#d8a64e" />
          <AssetErrorBoundary fallback={<CourtyardGroundFallback />} onError={() => setAssetFailed(true)}>
            <Suspense fallback={<CourtyardGroundFallback />}><CourtyardGround /></Suspense>
          </AssetErrorBoundary>
          <AssetErrorBoundary fallback={<CourtyardPanelsFallback />} onError={() => setAssetFailed(true)}>
            <Suspense fallback={<CourtyardPanelsFallback />}><CourtyardPanels opacity={opacity.court} /></Suspense>
          </AssetErrorBoundary>
          <AssetErrorBoundary fallback={<EntranceGateFallback active={activeId === "entrance"} onSelect={() => onSelect(stationIndex("entrance"))} />} onError={() => setAssetFailed(true)}>
            <Suspense fallback={<EntranceGateFallback active={activeId === "entrance"} onSelect={() => onSelect(stationIndex("entrance"))} />}>
              <EntranceGate active={activeId === "entrance"} opacity={opacity.gate} onSelect={() => onSelect(stationIndex("entrance"))} />
            </Suspense>
          </AssetErrorBoundary>
          <AssetErrorBoundary fallback={<TabernacleFallback />} onError={() => setAssetFailed(true)}>
            <Suspense fallback={<TabernacleFallback />}><TabernacleEnvironment opacity={opacity.tent} /></Suspense>
          </AssetErrorBoundary>
          {sanctuaryItemAssembly.map((config) => {
            const index = stationIndex(config.id);
            const active = activeId === config.id;
            return (
              <AssetErrorBoundary key={config.id} fallback={<FurnishingFallback config={config} active={active} />} onError={() => setAssetFailed(true)}>
                <Suspense fallback={<FurnishingFallback config={config} active={active} />}>
                  <FurnishingModel config={config} active={active} onSelect={() => onSelect(index)} registerFocus={registerFocus} />
                </Suspense>
              </AssetErrorBoundary>
            );
          })}
          <CameraFocusRig
            activeId={activeId}
            focusRequest={focusRequest}
            focusRevision={activeId ? focusRevisions[activeId] ?? 0 : 0}
            registry={focusRegistry}
          />
        </Canvas>
      </div>
      <div className="three-scene-hint" aria-hidden="true"><span>↔</span> Selecciona una pieza para enfocarla · vuelve a pulsarla para ver el conjunto</div>
      {assetFailed && <p className="three-asset-status" role="status">Un recurso de la escena no pudo cargarse. El resto de la reconstrucción sigue disponible.</p>}
    </div>
  );
}
