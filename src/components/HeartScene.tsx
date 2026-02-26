import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { HEART_REGIONS } from './heartData';

interface HeartSceneProps {
    selectedRegion: string | null;
    onSelectRegion: (id: string | null) => void;
    onHoverRegion: (id: string | null, screenX: number, screenY: number) => void;
    onLoaded: () => void;
    onLabelPositions: (positions: Array<{ id: string; name: string; x: number; y: number }>) => void;
    xrayMode: boolean;
}

const HeartScene: React.FC<HeartSceneProps> = ({
    selectedRegion,
    onSelectRegion,
    onHoverRegion,
    onLoaded,
    onLabelPositions,
    xrayMode,
}) => {
    const mountRef = useRef<HTMLDivElement>(null);
    const selectedRef = useRef<string | null>(selectedRegion);
    const onSelectRef = useRef(onSelectRegion);
    const onHoverRef = useRef(onHoverRegion);
    const onLabelRef = useRef(onLabelPositions);
    const xrayRef = useRef(xrayMode);

    useEffect(() => { selectedRef.current = selectedRegion; }, [selectedRegion]);
    useEffect(() => { onSelectRef.current = onSelectRegion; }, [onSelectRegion]);
    useEffect(() => { onHoverRef.current = onHoverRegion; }, [onHoverRegion]);
    useEffect(() => { onLabelRef.current = onLabelPositions; }, [onLabelPositions]);
    useEffect(() => { xrayRef.current = xrayMode; }, [xrayMode]);

    useEffect(() => {
        const mount = mountRef.current!;
        const W = () => mount.clientWidth;
        const H = () => mount.clientHeight;

        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.setSize(W(), H());
        // @ts-ignore
        renderer.outputColorSpace = THREE.SRGBColorSpace;
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.1;

        mount.appendChild(renderer.domElement);

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(45, W() / H(), 0.1, 100);
        camera.position.set(0, 0, 8.5);

        const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
        scene.add(ambientLight);

        const keyLight = new THREE.DirectionalLight(0xfffaeb, 2.5);
        keyLight.position.set(-6, 8, 8);
        scene.add(keyLight);

        const fillLight = new THREE.DirectionalLight(0xbbeeff, 1.8);
        fillLight.position.set(6, 2, 4);
        scene.add(fillLight);

        const rimLight = new THREE.DirectionalLight(0xffffff, 2.5);
        rimLight.position.set(2, 6, -8);
        scene.add(rimLight);

        const heartGroup = new THREE.Group();
        scene.add(heartGroup);

        // Load Real 3D Heart Model
        const loader = new GLTFLoader();
        let loadedModel: THREE.Group | null = null;
        loader.load(
            '/models/heart.glb',
            (gltf) => {
                const model = gltf.scene;
                // Center and scale the model
                model.scale.set(3.0, 3.0, 3.0);
                model.position.set(0, -1.0, 0);

                // Enhance materials
                model.traverse((child) => {
                    if ((child as THREE.Mesh).isMesh) {
                        const mesh = child as THREE.Mesh;
                        if (mesh.material) {
                            const mat = mesh.material as THREE.MeshStandardMaterial;
                            mat.roughness = 0.3;
                            mat.metalness = 0.1;
                        }
                    }
                });

                heartGroup.add(model);
                loadedModel = model;
                onLoaded();
            },
            undefined,
            (error) => {
                console.error('Error loading heart model. Ensure /models/heart.glb exists in public folder.', error);
                onLoaded();
            }
        );



        // Animate heartbeat via simple scale pulsing
        let pulseTime = 0;

        const raycaster = new THREE.Raycaster();
        const getMouseNDC = (clientX: number, clientY: number) => {
            const rect = mount.getBoundingClientRect();
            return new THREE.Vector2(
                ((clientX - rect.left) / rect.width) * 2 - 1,
                -((clientY - rect.top) / rect.height) * 2 + 1,
            );
        };

        let isDragging = false;
        let lastX = 0, lastY = 0;
        let rotY = 0, rotX = 0.08;
        let velY = 0, velX = 0;
        let zoom = mount.clientWidth < 768 ? 14 : 8.5;

        const onPointerDown = (e: PointerEvent) => {
            isDragging = true;
            lastX = e.clientX;
            lastY = e.clientY;
            velY = 0; velX = 0;
            mount.setPointerCapture(e.pointerId);
        };

        const onPointerMove = (e: PointerEvent) => {
            if (isDragging) {
                const dx = e.clientX - lastX;
                const dy = e.clientY - lastY;
                velY = dx * 0.005;
                velX = dy * 0.005;
                rotY += velY;
                rotX += velX;
                rotX = Math.max(-1.4, Math.min(1.4, rotX));
                lastX = e.clientX;
                lastY = e.clientY;
            } else {
                onHoverRef.current(null, 0, 0);
                mount.style.cursor = isDragging ? 'grabbing' : 'grab';
            }
        };

        const onPointerUp = (e: PointerEvent) => {
            if (!isDragging) return;
            isDragging = false;
            mount.releasePointerCapture(e.pointerId);
        };

        const onClick = (e: MouseEvent) => {
            if (Math.abs(e.clientX - lastX) > 5 || Math.abs(e.clientY - lastY) > 5) return;
            const ndc = getMouseNDC(e.clientX, e.clientY);
            raycaster.setFromCamera(ndc, camera);

            // Debug mapping!
            if (loadedModel) {
                const modelHits = raycaster.intersectObject(loadedModel, true);
                if (modelHits.length > 0) {
                    const localPoint = heartGroup.worldToLocal(modelHits[0].point.clone());
                    console.log(`MAPPED COORDINATE: [${localPoint.x.toFixed(3)}, ${localPoint.y.toFixed(3)}, ${localPoint.z.toFixed(3)}]`);
                    const d = document.createElement('div');
                    d.className = 'debug-coord';
                    d.innerText = `[${localPoint.x.toFixed(2)}, ${localPoint.y.toFixed(2)}, ${localPoint.z.toFixed(2)}]`;
                    d.style.position = 'absolute';
                    d.style.top = '10px';
                    d.style.left = '10px';
                    d.style.background = 'black';
                    d.style.color = 'lime';
                    d.style.zIndex = '9999';
                    d.style.padding = '5px';
                    document.body.appendChild(d);
                }
            }
        };

        const onWheel = (e: WheelEvent) => {
            e.preventDefault();
            zoom += e.deltaY * 0.01;
            zoom = Math.max(3.5, Math.min(25, zoom));
        };

        mount.addEventListener('pointerdown', onPointerDown);
        mount.addEventListener('pointermove', onPointerMove);
        mount.addEventListener('pointerup', onPointerUp);
        mount.addEventListener('click', onClick);
        mount.addEventListener('wheel', onWheel, { passive: false });
        mount.addEventListener('contextmenu', e => e.preventDefault());

        const onResize = () => {
            if (!mountRef.current) return;
            camera.aspect = W() / H();
            camera.updateProjectionMatrix();
            renderer.setSize(W(), H());
        };
        window.addEventListener('resize', onResize);

        let animId = 0;
        const animate = (ts: number) => {
            animId = requestAnimationFrame(animate);

            if (!isDragging && !selectedRef.current) {
                rotY += 0.0015;
            }

            if (!isDragging) {
                velX *= 0.94;
                velY *= 0.94;
                rotY += velY;
                rotX += velX;
            }

            heartGroup.rotation.y += (rotY - heartGroup.rotation.y) * 0.1;
            heartGroup.rotation.x += (rotX - heartGroup.rotation.x) * 0.1;
            camera.position.z += (zoom - camera.position.z) * 0.1;

            // Heartbeat pulse animation
            pulseTime += 0.05;
            const pulseScale = 1.0 + Math.sin(pulseTime) * 0.03 * Math.max(0, Math.sin(pulseTime * 2));
            heartGroup.scale.set(pulseScale, pulseScale, pulseScale);

            // Update procedural solid heart meshes
            if (loadedModel) {
                loadedModel.traverse((child) => {
                    if ((child as THREE.Mesh).isMesh) {
                        const mesh = child as THREE.Mesh;
                        if (mesh.material) {
                            const mat = mesh.material as THREE.Material;
                            let targetSolidOpacity = xrayRef.current ? 0.2 : 1.0;
                            if (mat instanceof THREE.MeshStandardMaterial || mat instanceof THREE.MeshPhysicalMaterial) {
                                mat.transparent = true;
                                mat.opacity += (targetSolidOpacity - mat.opacity) * 0.1;
                                mat.depthWrite = mat.opacity > 0.95;
                            }
                        }
                    }
                });
            }



            const labels: Array<{ id: string; name: string; x: number; y: number }> = [];
            const vec = new THREE.Vector3();
            HEART_REGIONS.forEach(region => {
                vec.set(...region.position);
                vec.multiplyScalar(pulseScale); // adjust for heartbeat scale
                vec.applyMatrix4(heartGroup.matrixWorld);

                const isFront = vec.z < camera.position.z - 0.5;
                if (isFront) {
                    vec.project(camera);
                    if (vec.x > -0.9 && vec.x < 0.9 && vec.y > -0.9 && vec.y < 0.9) {
                        const x = (vec.x * .5 + .5) * W();
                        const y = (-(vec.y * .5) + .5) * H();
                        if (selectedRef.current === region.id || xrayRef.current || !selectedRef.current) {
                            labels.push({ id: region.id, name: region.name, x, y });
                        }
                    }
                }
            });
            onLabelRef.current(labels);

            renderer.render(scene, camera);
        };

        animId = requestAnimationFrame(animate);

        return () => {
            cancelAnimationFrame(animId);
            window.removeEventListener('resize', onResize);
            if (mountRef.current) {
                mount.removeEventListener('pointerdown', onPointerDown);
                mount.removeEventListener('pointermove', onPointerMove);
                mount.removeEventListener('pointerup', onPointerUp);
                mount.removeEventListener('click', onClick);
                mount.removeEventListener('wheel', onWheel);
            }
            renderer.dispose();
            try {
                if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
            } catch (e) { }
        };
    }, []);

    return <div ref={mountRef} className="w-full h-full" />;
};

export default HeartScene;
