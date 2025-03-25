import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { Canvas, useThree } from "@react-three/fiber";
import { TextureLoader } from "three";
import { OrbitControls } from "@react-three/drei";

function Panorama({ panoramas, currentPanorama }) {
  const texture = React.useMemo(() => {
    const loader = new TextureLoader();
    const tex = loader.load(panoramas[currentPanorama]);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(-1, 1);
    return tex;
  }, [currentPanorama, panoramas]);

  const geometry = React.useMemo(
    () => new THREE.SphereGeometry(500, 60, 40),
    []
  );

  return (
    <mesh>
      <primitive object={geometry} />
      <meshBasicMaterial map={texture} side={THREE.BackSide} />
    </mesh>
  );
}

function NavigationArrows({ arrows, setCurrentPanorama }) {
  const coneGeometry = React.useMemo(
    () => new THREE.ConeGeometry(30, 60, 4),
    []
  );

  const handleArrowClick = React.useCallback(
    (e, panoramaIndex) => {
      e.stopPropagation();
      setCurrentPanorama(panoramaIndex);
    },
    [setCurrentPanorama]
  );

  return (
    <group>
      {arrows.map((arrow, index) => (
        <mesh
          key={index}
          position={arrow.position}
          rotation={[0, Math.atan2(arrow.position[0], arrow.position[2]), 0]}
          onClick={(e) => handleArrowClick(e, arrow.panorama)}
          onPointerDown={(e) => {
            e.stopPropagation();
          }}
          onPointerUp={(e) => {
            e.stopPropagation();
            handleArrowClick(e, arrow.panorama);
          }}
          onPointerOver={(e) => {
            e.stopPropagation();
            document.body.style.cursor = "pointer";
          }}
          onPointerOut={(e) => {
            e.stopPropagation();
            document.body.style.cursor = "default";
          }}
        >
          <primitive object={coneGeometry} />
          <meshBasicMaterial color={arrow.color} />
        </mesh>
      ))}
    </group>
  );
}

function CameraHandler({ onSceneClick }) {
  const { camera } = useThree();

  useEffect(() => {
    const handleClick = (event) => {
      event.preventDefault();
      event.stopPropagation();
      const canvas = event.target;
      const rect = canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      onSceneClick({ offsetX: x, offsetY: y }, camera);
    };

    const canvas = document.querySelector("canvas");
    if (canvas) {
      canvas.addEventListener("click", handleClick);
      return () => canvas.removeEventListener("click", handleClick);
    }
  }, [onSceneClick, camera]);

  return null;
}

export function Tour() {
  const panoramas = ["/test_image.webp", "/panorama.jpg", "/test_image.webp"];
  const [currentPanorama, setCurrentPanorama] = useState(0);
  const [arrows, setArrows] = useState([]);
  const [placementMode, setPlacementMode] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedPosition, setSelectedPosition] = useState(null);
  const [selectedPanorama, setSelectedPanorama] = useState(0);
  const [importText, setImportText] = useState("");

  const handleCanvasClick = React.useCallback(
    (event, camera) => {
      if (!placementMode) return;

      const x = (event.offsetX / window.innerWidth) * 2 - 1;
      const y = -(event.offsetY / window.innerHeight) * 2 + 1;

      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera({ x, y }, camera);

      const sphereRadius = 500;
      const direction = raycaster.ray.direction;
      const position = direction.multiplyScalar(sphereRadius);

      setSelectedPosition({ x: position.x, y: position.y, z: position.z });
      setShowModal(true);
    },
    [placementMode]
  );

  const addArrow = React.useCallback(() => {
    if (!selectedPosition) return;

    setArrows((prevArrows) => [
      //this should only be used for debugging, the final product will include a 3d-model
      ...prevArrows,
      {
        position: [selectedPosition.x, selectedPosition.y, selectedPosition.z],
        panorama: selectedPanorama,
        color: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
      },
    ]);
    setShowModal(false);
  }, [selectedPosition, selectedPanorama]);

  const copyToClipboard = React.useCallback(() => {
    navigator.clipboard.writeText(JSON.stringify(arrows, null, 2));
    alert("Arrows copied to clipboard!");
  }, [arrows]);

  const importFromText = React.useCallback(() => {
    try {
      const data = JSON.parse(importText);
      setArrows(Array.isArray(data) ? data : []);
      alert("Arrows imported successfully!");
    } catch {
      alert("Invalid JSON format");
    }
  }, [importText]);

  const clearArrows = React.useCallback(() => setArrows([]), []);
  // const handlePanoramaChange = React.useCallback((index) => { artifact, keeping in case needed in the future
  //   setCurrentPanorama(index);
  // }, []);

  return (
    <div className="relative w-full h-screen">
      <Canvas>
        <OrbitControls enableZoom={false} enablePan={false} rotateSpeed={1} />
        <CameraHandler onSceneClick={handleCanvasClick} />
        <Panorama panoramas={panoramas} currentPanorama={currentPanorama} />
        <NavigationArrows
          arrows={arrows}
          setCurrentPanorama={setCurrentPanorama}
        />
      </Canvas>

      <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2 flex flex-row gap-2 w-auto px-4">
        <button
          onClick={(e) => {
            e.stopPropagation();
            setPlacementMode(!placementMode);
          }}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md text-sm"
        >
          {placementMode ? "Disable Placement" : "Enable Placement"}
        </button>
        <button
          onClick={copyToClipboard}
          className="bg-green-500 text-white px-4 py-2 rounded-lg shadow-md text-sm"
        >
          Copy Arrows
        </button>
        <button
          onClick={clearArrows}
          className="bg-red-500 text-white px-4 py-2 rounded-lg shadow-md text-sm"
        >
          Clear All
        </button>
      </div>

      <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 w-auto min-w-[300px] px-4">
        <textarea
          className="w-full bg-black text-white h-20 border rounded p-2 text-sm"
          placeholder="Paste navigation data here"
          value={importText}
          onChange={(e) => setImportText(e.target.value)}
        />
        <button
          onClick={(e) => {
            e.stopPropagation();
            importFromText();
          }}
          className="bg-black text-white px-4 py-2 rounded-lg shadow-md mt-2 w-full text-sm"
        >
          Import Arrows
        </button>
      </div>

      {showModal && (
        <div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-4 shadow-lg rounded-lg w-[90%] sm:w-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <h2 className="text-lg sm:text-xl mb-4">Select Panorama</h2>
          <select
            value={selectedPanorama}
            onChange={(e) => setSelectedPanorama(Number(e.target.value))}
            className="border p-2 w-full mb-4 text-sm sm:text-base"
          >
            {panoramas.map((_, index) => (
              <option key={index} value={index}>
                Panorama {index + 1}
              </option>
            ))}
          </select>
          <div className="flex justify-between gap-2">
            <button
              onClick={() => setShowModal(false)}
              className="bg-gray-500 text-white px-4 py-2 rounded-lg text-sm sm:text-base flex-1"
            >
              Cancel
            </button>
            <button
              onClick={addArrow}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg text-sm sm:text-base flex-1"
            >
              Add Arrow
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Tour;
