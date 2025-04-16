import React, { useEffect, useState } from "react";
import * as THREE from "three";
import { Canvas, useThree } from "@react-three/fiber";
import { TextureLoader } from "three";
import { OrbitControls, Html } from "@react-three/drei";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
import { useAuth } from "../Context/authhandler";
import { Nav } from "../Widgets/nav";
import { color } from "three/tsl";

function Panorama({ scenes, currentSceneIndex }) {
  const texture = React.useMemo(() => {
    if (!scenes.length || !scenes[currentSceneIndex]) return null;
    const loader = new TextureLoader();
    const tex = loader.load(
      `http://localhost:8080/${scenes[currentSceneIndex].currentPanorama}`
    );
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(-1, 1);
    return tex;
  }, [currentSceneIndex, scenes]);

  const geometry = React.useMemo(
    () => new THREE.SphereGeometry(500, 60, 40),
    []
  );

  if (!texture) return null;

  return (
    <mesh>
      <primitive object={geometry} />
      <meshBasicMaterial map={texture} side={THREE.BackSide} />
    </mesh>
  );
}

function NavigationArrows({ arrows, setCurrentSceneIndex }) {
  const [arrowModel, setArrowModel] = useState(null);

  useEffect(() => {
    const loader = new FBXLoader();
    loader.load("Arrow.fbx", (model) => {
      model.traverse((child) => {
        if (child.isMesh) {
          // child.material.color.set(0x16fc94);
          child.material.emissive.set(0x16fc94);
          child.material.emissiveIntensity = 1;

          child.material.transparent = true;
          child.material.opacity = 0.9;
        }
      });
      model.scale.set(0.2, 0.2, 0.2);
      model.position.z -= 100;
      setArrowModel(model);
    });
  }, []);

  const handleArrowClick = React.useCallback(
    (e, sceneIndex) => {
      e.stopPropagation();
      setCurrentSceneIndex(sceneIndex);
    },
    [setCurrentSceneIndex]
  );

  if (!arrowModel) return null;

  return (
    <group>
      {arrows.map((arrow, index) => {
        //reused from a previous project worked on
        const position = arrow.position;
        const clonedArrow = arrowModel.clone();
        clonedArrow.traverse((child) => {
          if (child.isMesh) {
            child.material = child.material.clone();
          }
        });

        return (
          <primitive
            key={index}
            object={clonedArrow}
            position={[position[0], -200, position[2]]}
            rotation={[0, Math.atan2(position[0], position[2]) + Math.PI, 0]}
            onClick={(e) => handleArrowClick(e, arrow.panorama)}
            onPointerDown={(e) => e.stopPropagation()}
            onPointerUp={(e) => {
              e.stopPropagation();
              handleArrowClick(e, arrow.panorama);
            }}
            onPointerOver={(e) => {
              e.stopPropagation();
              document.body.style.cursor = "pointer";
              clonedArrow.traverse((child) => {
                if (child.isMesh) {
                  child.material.emissiveIntensity = 1;
                  child.material.emissive.setHex(0x66ccff);
                }
              });
            }}
            onPointerOut={(e) => {
              e.stopPropagation();
              document.body.style.cursor = "default";
              clonedArrow.traverse((child) => {
                if (child.isMesh) {
                  // child.material.color.set(0xff0000);
                  child.material.emissive.set(0x16fc94);
                  child.material.emissiveIntensity = 1;
                }
              });
            }}
          />
        );
      })}
    </group>
  );
}

function Highlights({ highlights }) {
  const handleHighlightClick = React.useCallback(
    (e, index) => {
      e.stopPropagation();
      console.log(`Clicked highlight ${index}: ${highlights[index].label}`);
    },
    [highlights]
  );

  return (
    <group>
      {highlights.map((highlight, index) => {
        const position = highlight.position;

        return (
          <group
            key={index}
            position={[position[0], position[1], position[2]]}
            onClick={(e) => handleHighlightClick(e, index)}
          >
            <mesh>
              <sphereGeometry args={[5, 16, 16]} />
              <meshStandardMaterial
                color={highlight.color || 0xffff00}
                emissive={highlight.color || 0xffff00}
                emissiveIntensity={0.5}
                transparent={true}
                opacity={0.7}
              />
            </mesh>
            {highlight.label && (
              <Html position={[0, 10, 0]} center>
                <div className="bg-black bg-opacity-70 text-white px-2 py-1 rounded text-sm whitespace-nowrap">
                  {highlight.label}
                </div>
              </Html>
            )}
          </group>
        );
      })}
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
  const { isLoggedIn, authChecked, user } = useAuth();
  const [scenes, setScenes] = useState([]);
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0);
  const [placementMode, setPlacementMode] = useState(false);
  const [highlightMode, setHighlightMode] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showHighlightModal, setShowHighlightModal] = useState(false);
  const [selectedPosition, setSelectedPosition] = useState(null);
  const [selectedSceneIndex, setSelectedSceneIndex] = useState(0);
  const [highlightLabel, setHighlightLabel] = useState("");
  const [highlightColor, setHighlightColor] = useState("#ffff00");
  const [importText, setImportText] = useState("");
  const [panoramas, setPanoramas] = useState([]);
  const [controlsExpanded, setControlsExpanded] = useState(false);

  useEffect(() => {
    console.log(user);
    fetch("http://localhost:8080/api/getAllScenes")
      .then((res) => res.json())
      .then((data) => {
        if (data.scenes && data.scenes.length > 0) {
          const parsedScenes = data.scenes.map((scene) => ({
            ...scene,
            arrows: scene.arrows.map((arrow) => ({
              ...arrow,
              position:
                typeof arrow.position === "string"
                  ? JSON.parse(arrow.position.replace(/\\/g, ""))
                  : arrow.position,
            })),
            highlights: scene.highlights.map((highlight) => ({
              ...highlight,
              position:
                typeof highlight.position === "string"
                  ? JSON.parse(highlight.position.replace(/\\/g, ""))
                  : highlight.position,
            })),
          }));
          console.log(parsedScenes);
          setScenes(parsedScenes);
        }
      })
      .catch((error) => {
        console.error("Error fetching scenes:", error);
      });
  }, []);

  useEffect(() => {
    fetch("http://localhost:8080/api/getImages")
      .then((res) => res.json())
      .then((data) => {
        setPanoramas(data);
      })
      .catch((error) => {
        console.error("Error fetching scenes:", error);
      });
  }, []);

  const currentScene = scenes[currentSceneIndex] || {
    currentPanorama: "",
    arrows: [],
    highlights: [],
  };

  const handleCanvasClick = React.useCallback(
    (event, camera) => {
      if (!placementMode && !highlightMode) return;

      const x = (event.offsetX / window.innerWidth) * 2 - 1;
      const y = -(event.offsetY / window.innerHeight) * 2 + 1;

      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera({ x, y }, camera);

      const sphereRadius = 400;
      const direction = raycaster.ray.direction;
      const position = direction.multiplyScalar(sphereRadius);

      setSelectedPosition({ x: position.x, y: position.y, z: position.z });

      if (placementMode) {
        setShowModal(true);
      } else if (highlightMode) {
        setShowHighlightModal(true);
      }
    },
    [placementMode, highlightMode]
  );

  const saveScene = React.useCallback((sceneData) => {
    console.log("Sending scene data:", sceneData);
    fetch("http://localhost:8080/api/saveScene", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "includde",
      body: JSON.stringify(sceneData),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Scene saved:", data);
      })
      .catch((error) => {
        console.error("Error saving scene:", error);
      });
  }, []);

  const addArrow = React.useCallback(() => {
    if (!selectedPosition) return;

    const newArrows = [
      ...currentScene.arrows,
      {
        position: [selectedPosition.x, selectedPosition.y, selectedPosition.z],
        panorama: selectedSceneIndex,
      },
    ];

    const updatedScenes = [...scenes];
    updatedScenes[currentSceneIndex] = {
      ...updatedScenes[currentSceneIndex],
      arrows: newArrows,
    };
    setScenes(updatedScenes);
    setShowModal(false);
    saveScene({
      currentPanorama: currentSceneIndex,
      arrows: newArrows,
      highlights: updatedScenes[currentSceneIndex].highlights,
    });
  }, [
    selectedPosition,
    selectedSceneIndex,
    currentSceneIndex,
    scenes,
    currentScene,
    saveScene,
  ]);

  const addHighlight = React.useCallback(() => {
    if (!selectedPosition) return;

    const newHighlights = [
      ...currentScene.highlights,
      {
        position: [selectedPosition.x, selectedPosition.y, selectedPosition.z],
        label: highlightLabel,
        color: new THREE.Color(highlightColor).getHex(),
      },
    ];

    const updatedScenes = [...scenes];
    updatedScenes[currentSceneIndex] = {
      ...updatedScenes[currentSceneIndex],
      highlights: newHighlights,
    };
    setScenes(updatedScenes);
    setShowHighlightModal(false);
    setHighlightLabel("");
    saveScene({
      currentPanorama: currentSceneIndex,
      arrows: updatedScenes[currentSceneIndex].arrows,
      highlights: newHighlights,
    });
  }, [
    selectedPosition,
    highlightLabel,
    highlightColor,
    currentSceneIndex,
    scenes,
    currentScene,
    saveScene,
  ]);

  const clearArrows = React.useCallback(() => {
    const updatedScenes = [...scenes];
    updatedScenes[currentSceneIndex].arrows = [];
    setScenes(updatedScenes);
    saveScene(updatedScenes[currentSceneIndex]);
  }, [scenes, currentSceneIndex, saveScene]);

  const clearHighlights = React.useCallback(() => {
    const updatedScenes = [...scenes];
    updatedScenes[currentSceneIndex].highlights = [];
    setScenes(updatedScenes);
    saveScene(updatedScenes[currentSceneIndex]);
  }, [scenes, currentSceneIndex, saveScene]);

  useEffect(() => {
    if (placementMode) setHighlightMode(false);
    if (highlightMode) setPlacementMode(false);
  }, [placementMode, highlightMode]);

  return (
    <div className="relative w-full h-screen">
      {console.log(currentScene.arrows)}
      <Nav></Nav>
      <Canvas>
        <OrbitControls enableZoom={false} enablePan={false} rotateSpeed={1} />
        <CameraHandler onSceneClick={handleCanvasClick} />
        <Panorama scenes={scenes} currentSceneIndex={currentSceneIndex} />
        <NavigationArrows
          arrows={currentScene.arrows}
          setCurrentSceneIndex={setCurrentSceneIndex}
        />
        <Highlights highlights={currentScene.highlights} />
      </Canvas>
      {user?.role == 1 ||
        (user?.role == 0 && (
          <div className="absolute bottom-5 left-[90%] transform -translate-x-1/2">
            {!controlsExpanded ? (
              <button
                onClick={() => setControlsExpanded(true)}
                className="bg-black text-amber-600 w-[64px] h-[64px] rounded-full text-4xl flex items-center justify-center"
              >
                +
              </button>
            ) : (
              <div className="bg-white p-4 rounded-lg shadow-lg">
                <div className="flex flex-row gap-2 mb-4 flex-wrap justify-center">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setPlacementMode(!placementMode);
                      if (placementMode) setHighlightMode(false);
                    }}
                    className={`${
                      placementMode ? "bg-blue-700" : "bg-blue-500"
                    } text-white px-4 py-2 rounded-lg shadow-md text-sm`}
                  >
                    {placementMode ? "Disable Arrow Placement" : "Place Arrows"}
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setHighlightMode(!highlightMode);
                      if (highlightMode) setPlacementMode(false);
                    }}
                    className={`${
                      highlightMode ? "bg-yellow-600" : "bg-yellow-500"
                    } text-white px-4 py-2 rounded-lg shadow-md text-sm`}
                  >
                    {highlightMode ? "Disable Highlighting" : "Add Highlights"}
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}

      {showModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
          onClick={() => setShowModal(false)}
        >
          <div
            className="bg-white p-6 rounded-lg shadow-xl w-[90%] h-[90%] overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl sm:text-2xl mb-4">Select Panorama</h2>

            <div className="flex-1 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-4">
              {scenes.map((key, index) => (
                <div
                  key={index}
                  onClick={() => setSelectedSceneIndex(index)}
                  className={`border p-2 rounded-lg cursor-pointer hover:bg-gray-100 ${
                    selectedSceneIndex === index ? "bg-gray-200" : ""
                  }`}
                >
                  <img
                    src={"http://localhost:8080/" + key.currentPanorama}
                    alt={`Panorama ${index + 1}`}
                    className="w-full h-48 object-cover rounded mb-2"
                  />
                  <span className="block text-center font-medium">
                    Panorama {index + 1}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex justify-between gap-4">
              <button
                onClick={() => setShowModal(false)}
                className="bg-gray-500 text-white px-6 py-3 rounded-lg text-base flex-1"
              >
                Cancel
              </button>
              <button
                onClick={addArrow}
                className="bg-blue-500 text-white px-6 py-3 rounded-lg text-base flex-1"
              >
                Add Arrow
              </button>
            </div>
          </div>
        </div>
      )}

      {showHighlightModal && (
        <div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-4 shadow-lg rounded-lg w-[90%] sm:w-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <h2 className="text-lg sm:text-xl mb-4">Add Highlight</h2>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">
              Highlight Label
            </label>
            <input
              type="text"
              value={highlightLabel}
              onChange={(e) => setHighlightLabel(e.target.value)}
              className="border p-2 w-full text-sm sm:text-base"
              placeholder="Enter label text (optional)"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">
              Highlight Color
            </label>
            <input
              type="color"
              value={highlightColor}
              onChange={(e) => setHighlightColor(e.target.value)}
              className="border p-1 w-full"
            />
          </div>
          <div className="flex justify-between gap-2">
            <button
              onClick={() => setShowHighlightModal(false)}
              className="bg-gray-500 text-white px-4 py-2 rounded-lg text-sm sm:text-base flex-1"
            >
              Cancel
            </button>
            <button
              onClick={addHighlight}
              className="bg-yellow-500 text-white px-4 py-2 rounded-lg text-sm sm:text-base flex-1"
            >
              Add Highlight
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Tour;
