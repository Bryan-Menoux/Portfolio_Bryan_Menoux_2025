import React, { useEffect, useRef } from "react";
import * as THREE from "three";

const ParticleBlob = () => {
  const containerRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const particlesRef = useRef(null);
  const clockRef = useRef(new THREE.Clock());
  const noiseTimeRef = useRef(0);
  const noiseAmplitudeRef = useRef(1);
  const targetNoiseAmplitudeRef = useRef(1);
  const animationIdRef = useRef(null);
  const smoothDeltaRef = useRef(0);
  const mousePositionRef = useRef({ x: 0, y: 0 });
  const isHoveringRef = useRef(false);

  const generateParticles = () => {
    const particleCount = 8000;
    const radius = 15;

    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    const colorPalette = [
      { r: 0.2, g: 0.4, b: 1.0 },
      { r: 0.4, g: 0.6, b: 1.0 },
      { r: 0.6, g: 0.3, b: 1.0 },
      { r: 0.8, g: 0.2, b: 1.0 },
      { r: 0.3, g: 0.1, b: 0.8 },
    ];

    const simpleNoise = (x, y, z) => {
      const n = Math.sin(x * 12.9898 + y * 78.233 + z * 45.164) * 43758.5453;
      return n - Math.floor(n);
    };

    for (let i = 0; i < particleCount; i++) {
      const phi = Math.acos(-1 + (2 * i) / particleCount);
      const theta = Math.sqrt(particleCount * Math.PI) * phi;

      let x = Math.cos(theta) * Math.sin(phi) * radius;
      let y = Math.sin(theta) * Math.sin(phi) * radius;
      let z = Math.cos(phi) * radius;

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;

      const yNormalized = (y + radius) / (2 * radius);

      const noiseAmount = Math.sin(yNormalized * Math.PI) * 0.4;
      const randomVariation =
        (simpleNoise(x * 0.5, y * 0.5, z * 0.5) - 0.5) * noiseAmount;
      const smoothY = Math.max(0, Math.min(1, yNormalized + randomVariation));

      let r, g, b;

      r = 255 / 255 + smoothY * (43 / 255 - 255 / 255);
      g = 111 / 255 + smoothY * (163 / 255 - 111 / 255);
      b = 224 / 255 + smoothY * (255 / 255 - 224 / 255);

      colors[i * 3] = r;
      colors[i * 3 + 1] = g;
      colors[i * 3 + 2] = b;
    }

    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    const vertexShader = `
      attribute vec3 color;
      varying vec3 vColor;
      varying float vDepth;

      uniform float uTime;
      uniform float uNoiseAmplitude;
      uniform vec2 uMousePos;
      uniform bool uIsHovering;

      
      float hash(vec3 p) {
        return fract(sin(dot(p, vec3(12.9898, 78.233, 45.164))) * 43758.5453);
      }

      float noise3D(vec3 p) {
        vec3 pi = floor(p);
        vec3 pf = fract(p);
        vec3 u = pf * pf * (3.0 - 2.0 * pf);
        
        float n000 = hash(pi + vec3(0.0, 0.0, 0.0));
        float n100 = hash(pi + vec3(1.0, 0.0, 0.0));
        float n010 = hash(pi + vec3(0.0, 1.0, 0.0));
        float n110 = hash(pi + vec3(1.0, 1.0, 0.0));
        float n001 = hash(pi + vec3(0.0, 0.0, 1.0));
        float n101 = hash(pi + vec3(1.0, 0.0, 1.0));
        float n011 = hash(pi + vec3(0.0, 1.0, 1.0));
        float n111 = hash(pi + vec3(1.0, 1.0, 1.0));
        
        float nx00 = mix(n000, n100, u.x);
        float nx10 = mix(n010, n110, u.x);
        float nx01 = mix(n001, n101, u.x);
        float nx11 = mix(n011, n111, u.x);
        float nxy0 = mix(nx00, nx10, u.y);
        float nxy1 = mix(nx01, nx11, u.y);
        return mix(nxy0, nxy1, u.z);
      }

      
      float fbm(vec3 p) {
        float value = 0.0;
        float amplitude = 1.0;
        float frequency = 1.0;
        float maxValue = 0.0;
        
        for(int i = 0; i < 5; i++) {
          value += amplitude * (noise3D(p * frequency) - 0.5) * 2.0;
          maxValue += amplitude;
          amplitude *= 0.5;
          frequency *= 2.0;
        }
        return value / maxValue;
      }

      void main() {
        vec3 pos = position;
        vec3 direction = normalize(pos);
        float originalLength = length(pos);
        
        float noise1 = fbm(direction * 3.0 + vec3(uTime * 0.3));
        float noise2 = fbm(direction * 1.5 + vec3(10.0) + vec3(uTime * 0.2));
        float noise3 = sin(uTime * 0.8) * cos(direction.x * 5.0 + uTime) * 0.5;
        
        float combinedNoise = noise1 * 0.6 + noise2 * 0.3 + noise3 * 0.1;
        
        float displacement = combinedNoise * 2.5 * uNoiseAmplitude;
        
        displacement += sin(uTime * 1.2 + length(direction) * 3.0) * 0.6 * uNoiseAmplitude;
        
        if (uIsHovering) {
          
          vec4 screenPos = projectionMatrix * (modelViewMatrix * vec4(pos, 1.0));
          vec2 ndcPos = screenPos.xy / screenPos.w;
          vec2 screenCoord = ndcPos * 0.5 + 0.5; 
          
          float distFromMouse = distance(screenCoord, uMousePos);
          
          float proximity = max(0.0, 1.0 - (distFromMouse * 3.33));
          
          float randomDeform = sin(direction.x * 7.5 + direction.y * 3.2 + uTime * 2.5) * 0.5 + 0.5;
          randomDeform += cos(direction.z * 4.8 + uTime * 1.8) * 0.5;
          
          displacement += randomDeform * proximity * 2.2 * uNoiseAmplitude;
        }
        
        pos = direction * (originalLength + displacement);
        
        vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
        gl_Position = projectionMatrix * mvPosition;
        
        gl_PointSize = 5.0 * (30.0 / -mvPosition.z);
        
        vColor = color;
        vDepth = -mvPosition.z;
      }
    `;
    const fragmentShader = `
      varying vec3 vColor;
      varying float vDepth;

      void main() {
        
        vec2 cxy = 2.0 * gl_PointCoord - 1.0;
        float r = dot(cxy, cxy);
        
        if (r > 1.0) {
          discard;
        }
        
        float alpha = exp(-r * 3.0);
        
        float brightness = mix(0.6, 1.2, 1.0 / (1.0 + vDepth * 0.02));
        
        gl_FragColor = vec4(vColor * brightness, alpha);
      }
    `;

    const material = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uNoiseAmplitude: { value: 1.0 },
        uMousePos: { value: new THREE.Vector2(0, 0) },
        uIsHovering: { value: false },
      },
      vertexShader,
      fragmentShader,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const particles = new THREE.Points(geometry, material);

    return particles;
  };

  useEffect(() => {
    if (!containerRef.current) return;

    const scene = new THREE.Scene();
    scene.background = null;
    sceneRef.current = scene;

    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.z = 35;
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const particles = generateParticles();
    particlesRef.current = particles;
    scene.add(particles);

    const handleMouseEnter = () => {
      targetNoiseAmplitudeRef.current = 1.5;
      isHoveringRef.current = true;
    };

    const handleMouseLeave = () => {
      targetNoiseAmplitudeRef.current = 1.0;
      isHoveringRef.current = false;
    };

    const handleMouseMove = (event) => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width;
      const y = 1.0 - (event.clientY - rect.top) / rect.height;

      mousePositionRef.current = { x, y };
    };

    containerRef.current.addEventListener("mouseenter", handleMouseEnter);
    containerRef.current.addEventListener("mouseleave", handleMouseLeave);
    containerRef.current.addEventListener("mousemove", handleMouseMove);

    const checkInitialMousePosition = (event) => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const mouseX = event.clientX;
      const mouseY = event.clientY;

      if (
        mouseX >= rect.left &&
        mouseX <= rect.right &&
        mouseY >= rect.top &&
        mouseY <= rect.bottom
      ) {
        handleMouseEnter();
        handleMouseMove(event);
      }
    };

    document.addEventListener("mousemove", checkInitialMousePosition, {
      once: true,
    });

    const animate = () => {
      animationIdRef.current = requestAnimationFrame(animate);

      let rawDeltaTime = clockRef.current.getDelta();

      rawDeltaTime = Math.min(rawDeltaTime, 0.1);

      smoothDeltaRef.current =
        smoothDeltaRef.current * 0.9 + rawDeltaTime * 0.1;

      noiseTimeRef.current += smoothDeltaRef.current * 2.0;

      noiseAmplitudeRef.current +=
        (targetNoiseAmplitudeRef.current - noiseAmplitudeRef.current) * 0.08;

      const material = particles.material;
      material.uniforms.uTime.value = noiseTimeRef.current;
      material.uniforms.uNoiseAmplitude.value = noiseAmplitudeRef.current;
      material.uniforms.uMousePos.value.set(
        mousePositionRef.current.x,
        mousePositionRef.current.y
      );
      material.uniforms.uIsHovering.value = isHoveringRef.current;

      particles.rotation.x += 0.0008 * (smoothDeltaRef.current / 0.016);
      particles.rotation.y += 0.0012 * (smoothDeltaRef.current / 0.016);
      particles.rotation.z += 0.0006 * (smoothDeltaRef.current / 0.016);

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      const newWidth = containerRef.current?.clientWidth || width;
      const newHeight = containerRef.current?.clientHeight || height;

      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      containerRef.current?.removeEventListener("mouseenter", handleMouseEnter);
      containerRef.current?.removeEventListener("mouseleave", handleMouseLeave);
      containerRef.current?.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mousemove", checkInitialMousePosition);

      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }

      if (
        containerRef.current &&
        renderer.domElement.parentNode === containerRef.current
      ) {
        containerRef.current.removeChild(renderer.domElement);
      }

      particles.geometry.dispose();
      particles.material.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        width: "100%",
        height: "100vh",
        overflow: "hidden",
        cursor: "auto",
      }}
    />
  );
};

export default ParticleBlob;
