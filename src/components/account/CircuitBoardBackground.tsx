import React, { useRef, useEffect, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Generate circuit paths
const createCircuitPaths = () => {
  const paths = [];
  for (let i = 0; i < 30; i++) {
    const pathPoints = [];
    const startX = Math.random() * 800 - 400; // Random start x
    const startY = Math.random() * 800 - 400; // Random start y

    let currentX = startX;
    let currentY = startY;

    // Create random zigzag path
    for (let j = 0; j < 10; j++) {
      currentX += Math.random() * 100 - 50;
      currentY += Math.random() * 100 - 50;
      pathPoints.push(new THREE.Vector3(currentX, currentY, 0));
    }

    paths.push(pathPoints);
  }
  return paths;
};

// Component for individual traces
const CircuitTrace = ({ points }: { points: THREE.Vector3[] }) => {
  const lineRef = useRef<THREE.Group>(null);

  useEffect(() => {
    // Create the geometry and material
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const material = new THREE.LineBasicMaterial({ color: 0x00ff00 });
    const line = new THREE.Line(geometry, material);
    if (lineRef.current) {
      lineRef.current.add(line);
    }
  }, [points]);

  return <group ref={lineRef} />;
};

// Glowing particles component
const GlowingParticles = () => {
  const pointsRef = useRef<THREE.Points>(null);

  useFrame(() => {
    if (pointsRef.current) {
      const position = pointsRef.current.geometry.attributes.position;
      if (position instanceof THREE.BufferAttribute) {
        const array = position.array as Float32Array;
        for (let i = 0; i < array.length; i += 3) {
          array[i] += (Math.random() - 0.5) * 2; // Random x movement
          array[i + 1] += (Math.random() - 0.5) * 2; // Random y movement
        }
        position.needsUpdate = true;
      }
    }
  });

  const particleMaterial = useMemo(() => {
    return new THREE.PointsMaterial({
      color: 0xffff00,
      size: 2,
      transparent: true,
      opacity: 0.8,
    });
  }, []);

  const particleGeometry = useMemo(() => {
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(150); // 50 particles
    for (let i = 0; i < positions.length; i += 3) {
      positions[i] = Math.random() * 800 - 400; // Random x
      positions[i + 1] = Math.random() * 800 - 400; // Random y
      positions[i + 2] = 0; // z
    }
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return geometry;
  }, []);

  return <points ref={pointsRef} geometry={particleGeometry} material={particleMaterial} />;
};

const CircuitBoardBackground: React.FC = () => {
  const traces = createCircuitPaths();

  return (
    <Canvas camera={{ position: [0, 0, 1000], fov: 75 }}>
      <color attach="background" args={['#000000']} />
      <ambientLight intensity={0.5} />

      {/* Render circuit traces */}
      {traces.map((points, index) => (
        <CircuitTrace key={index} points={points} />
      ))}

      {/* Glowing particles */}
      <GlowingParticles />
    </Canvas>
  );
};

export default CircuitBoardBackground;
