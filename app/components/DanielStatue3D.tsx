"use client";

/* eslint-disable react/no-unknown-property -- React Three Fiber elements use Three.js props. */

import { OrbitControls, useGLTF } from "@react-three/drei";
import { Canvas, type ThreeEvent } from "@react-three/fiber";
import { type ReactNode, Suspense, useCallback, useEffect, useMemo, useState } from "react";
import { Box3, Mesh, Vector3 } from "three";
import AssetErrorBoundary from "./three/AssetErrorBoundary";

const STATUE_MODEL_URL = "/models/daniel-statue-tripo-v31-v1.glb";
const BOULDER_MODEL_URL = "/models/daniel-boulder-tripo-v31-v1.glb";
const DEFAULT_CAMERA_POSITION: [number, number, number] = [3.4, 3.09, 9.33];
const DEFAULT_CAMERA_TARGET: [number, number, number] = [0, 0.35, 0];

type DanielStatue3DProps = {
  activeIndex: number;
  onSelect: (index: number) => void;
  guideIndex?: number | null;
  guided?: boolean;
  onAssetError?: () => void;
};

type SelectableGroupProps = {
  active: boolean;
  children: ReactNode;
  onSelect: () => void;
  position?: [number, number, number];
  rotation?: [number, number, number];
};

function SelectableGroup({ active, children, onSelect, position, rotation }: SelectableGroupProps) {
  const [hovered, setHovered] = useState(false);

  useEffect(() => () => {
    document.body.style.cursor = "";
  }, []);

  const handleClick = (event: ThreeEvent<MouseEvent>) => {
    event.stopPropagation();
    if (event.delta > 4) return;
    onSelect();
  };

  return (
    <group
      position={position}
      rotation={rotation}
      scale={active || hovered ? 1.035 : 1}
      onClick={handleClick}
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

function ReconstructionHitbox({
  active,
  highlighted,
  position,
  size,
  onSelect,
}: {
  active: boolean;
  highlighted: boolean;
  position: [number, number, number];
  size: [number, number, number];
  onSelect: () => void;
}) {
  return (
    <SelectableGroup active={active} position={position} onSelect={onSelect}>
      <SelectionWireframe active={active} highlighted={highlighted} size={size} />
    </SelectableGroup>
  );
}

function SelectionWireframe({
  active,
  highlighted = false,
  position,
  size,
}: {
  active: boolean;
  highlighted?: boolean;
  position?: [number, number, number];
  size: [number, number, number];
}) {
  return (
    <mesh position={position} renderOrder={highlighted ? 2 : 0}>
      <boxGeometry args={size} />
      <meshBasicMaterial
        color={highlighted ? "#ffe0a3" : "#e4c98e"}
        depthTest={!highlighted}
        depthWrite={false}
        opacity={highlighted ? 0.9 : active ? 0.14 : 0.001}
        transparent
        wireframe={active || highlighted}
      />
    </mesh>
  );
}

function StatueReconstruction({ activeIndex, guideIndex, onSelect }: Pick<DanielStatue3DProps, "activeIndex" | "guideIndex" | "onSelect">) {
  const { scene } = useGLTF(STATUE_MODEL_URL);
  const { scene: boulderScene } = useGLTF(BOULDER_MODEL_URL);
  const { model, modelPosition, modelScale } = useMemo(() => {
    const clone = scene.clone(true);
    // Tripo exports Y-up. Turn its +X front toward this scene's +Z camera.
    clone.rotation.y = -Math.PI / 2;
    clone.updateMatrixWorld(true);
    clone.traverse((child) => {
      if (child instanceof Mesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });

    const bounds = new Box3().setFromObject(clone);
    const size = bounds.getSize(new Vector3());
    const center = bounds.getCenter(new Vector3());
    const scale = 5.35 / Math.max(size.y, 0.001);

    return {
      model: clone,
      modelPosition: [
        -center.x * scale - 0.25,
        -2.42 - bounds.min.y * scale,
        -center.z * scale,
      ] as [number, number, number],
      modelScale: scale,
    };
  }, [scene]);
  const { boulderHitboxPosition, boulderHitboxSize, boulderModel, boulderPosition, boulderScale } = useMemo(() => {
    const clone = boulderScene.clone(true);
    clone.rotation.y = -0.38;
    clone.updateMatrixWorld(true);
    clone.traverse((child) => {
      if (child instanceof Mesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });

    const bounds = new Box3().setFromObject(clone);
    const size = bounds.getSize(new Vector3());
    const center = bounds.getCenter(new Vector3());
    const scale = 1.42 / Math.max(size.x, size.y, size.z, 0.001);
    const scaledSize = size.multiplyScalar(scale);

    return {
      boulderHitboxPosition: [0, scaledSize.y / 2, 0] as [number, number, number],
      boulderHitboxSize: [scaledSize.x + 0.1, scaledSize.y + 0.1, scaledSize.z + 0.1] as [number, number, number],
      boulderModel: clone,
      boulderPosition: [
        -center.x * scale,
        -bounds.min.y * scale,
        -center.z * scale,
      ] as [number, number, number],
      boulderScale: scale,
    };
  }, [boulderScene]);

  const zones = [
    { position: [-0.25, 2.55, 0], size: [1.15, 1.18, 1.1] },
    { position: [-0.25, 1.35, 0], size: [2.25, 1.2, 1.15] },
    { position: [-0.25, 0.18, 0], size: [1.55, 1.2, 1.05] },
    { position: [-0.25, -1.15, 0], size: [1.35, 1.55, 1] },
    { position: [-0.25, -2.13, 0.16], size: [1.65, 0.48, 1.25] },
  ] as const;

  return (
    <group>
      <primitive object={model} position={modelPosition} scale={modelScale} />
      {zones.map((zone, index) => (
        <ReconstructionHitbox
          active={activeIndex === index}
          highlighted={guideIndex === index}
          key={index}
          position={[...zone.position]}
          size={[...zone.size]}
          onSelect={() => onSelect(index)}
        />
      ))}
      <SelectableGroup active={activeIndex === 5} position={[2.15, -2.48, 0.18]} onSelect={() => onSelect(5)}>
        <primitive object={boulderModel} position={boulderPosition} scale={boulderScale} />
        {(activeIndex === 5 || guideIndex === 5) && (
          <SelectionWireframe
            active={activeIndex === 5}
            highlighted={guideIndex === 5}
            position={boulderHitboxPosition}
            size={boulderHitboxSize}
          />
        )}
      </SelectableGroup>
    </group>
  );
}

export default function DanielStatue3D({
  activeIndex,
  onSelect,
  guideIndex = null,
  guided = false,
  onAssetError,
}: DanielStatue3DProps) {
  const [assetFailed, setAssetFailed] = useState(false);
  const handleAssetError = useCallback(() => {
    setAssetFailed(true);
    onAssetError?.();
  }, [onAssetError]);

  return (
    <div className="three-scene-shell">
      <p className="visually-hidden">{guided ? "Reconstrucción tridimensional de la estatua de Daniel 2. También puedes usar las opciones del reto." : "Reconstrucción tridimensional de la estatua de Daniel 2. Usa los botones inferiores para seleccionar sus seis materiales."}</p>
      <div className="three-canvas-frame" aria-hidden="true">
        <AssetErrorBoundary fallback={null} onError={handleAssetError}>
          <Canvas
            camera={{ position: DEFAULT_CAMERA_POSITION, fov: 37, near: 0.1, far: 50 }}
            dpr={[1, 1.5]}
            frameloop="demand"
            gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
            fallback={<span>Usa las opciones para seleccionar un material.</span>}
            onPointerMissed={() => document.body.style.cursor = ""}
          >
            <ambientLight intensity={1.05} />
            <directionalLight position={[4, 7, 6]} intensity={2.2} color="#fff2d1" />
            <directionalLight position={[-5, 2, -4]} intensity={1.1} color="#5f9aaa" />
            <pointLight position={[0, -1, 4]} intensity={0.8} color="#d8aa58" />
            <AssetErrorBoundary fallback={null} onError={handleAssetError}>
              <Suspense fallback={null}>
                <StatueReconstruction activeIndex={activeIndex} guideIndex={guideIndex} onSelect={onSelect} />
              </Suspense>
            </AssetErrorBoundary>
            <mesh position={[0, -2.57, 0]} receiveShadow>
              <cylinderGeometry args={[3.35, 3.65, 0.12, 64]} />
              <meshStandardMaterial color="#102635" metalness={0.2} roughness={0.78} />
            </mesh>
            <mesh position={[0, -2.49, 0]} rotation={[-Math.PI / 2, 0, 0]}>
              <ringGeometry args={[2.7, 2.73, 64]} />
              <meshBasicMaterial color="#c7a967" transparent opacity={0.46} />
            </mesh>
            <OrbitControls
              enableDamping={false}
              enablePan={false}
              enableRotate={!guided}
              enableZoom={!guided}
              maxDistance={10.5}
              minDistance={5.6}
              minPolarAngle={Math.PI * 0.22}
              maxPolarAngle={Math.PI * 0.74}
              target={DEFAULT_CAMERA_TARGET}
            />
          </Canvas>
        </AssetErrorBoundary>
      </div>
      <div className="three-scene-hint" aria-hidden="true">
        <span>{guided ? "☝" : "↔"}</span>{" "}
        {guided ? "Selecciona una pieza de la estatua" : "Arrastra para girar · pellizca o usa la rueda para acercar"}
      </div>
      {assetFailed && !onAssetError && <p className="three-asset-status" role="status">No pudimos cargar la reconstrucción 3D. Recarga la página para intentarlo de nuevo.</p>}
    </div>
  );
}
