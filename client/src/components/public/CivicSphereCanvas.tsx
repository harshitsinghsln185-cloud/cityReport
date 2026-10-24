import React, { useEffect, useRef } from 'react';

interface Point3D {
  x: number;
  y: number;
  z: number;
  baseRadius: number;
  color: string;
  pulsePhase: number;
  pulseSpeed: number;
}

export const CivicSphereCanvas: React.FC<{ className?: string }> = ({ className = '' }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let isVisible = true;
    let width = 0;
    let height = 0;
    let dpr = window.devicePixelRatio || 1;

    // Check prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Initialize 3D points on a sphere
    const numPoints = 50;
    const points: Point3D[] = [];
    const sphereRadius = 140;

    const colors = [
      '#7C3AED', // Royal Violet (New Hazard)
      '#4F46E5', // Deep Indigo (Assigned)
      '#D97706', // Warm Gold (Awaiting Quote / Advance)
      '#10B981', // Emerald (Remediated & Verified)
    ];

    // Fibonacci sphere distribution for uniform points
    const goldenRatio = (1 + Math.sqrt(5)) / 2;
    for (let i = 0; i < numPoints; i++) {
      const theta = 2 * Math.PI * i / goldenRatio;
      const phi = Math.acos(1 - 2 * (i + 0.5) / numPoints);

      points.push({
        x: sphereRadius * Math.sin(phi) * Math.cos(theta),
        y: sphereRadius * Math.sin(phi) * Math.sin(theta),
        z: sphereRadius * Math.cos(phi),
        baseRadius: Math.random() * 2 + 2.5,
        color: colors[i % colors.length],
        pulsePhase: Math.random() * Math.PI * 2,
        pulseSpeed: 0.03 + Math.random() * 0.02,
      });
    }

    let angleX = 0.2;
    let angleY = 0;
    let targetRotationSpeedY = 0.005;
    let currentRotationSpeedY = 0.005;
    let targetRotationSpeedX = 0.002;
    let currentRotationSpeedX = 0.002;

    const resize = () => {
      if (!containerRef.current || !canvas) return;
      const rect = containerRef.current.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      dpr = window.devicePixelRatio || 1;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
    };

    resize();
    window.addEventListener('resize', resize);

    // Mouse movement interaction
    const handleMouseMove = (e: MouseEvent) => {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const relX = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2);
      const relY = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2);
      targetRotationSpeedY = relX * 0.015;
      targetRotationSpeedX = -relY * 0.01;
    };

    const handleMouseLeave = () => {
      targetRotationSpeedY = 0.005;
      targetRotationSpeedX = 0.002;
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('mousemove', handleMouseMove);
      container.addEventListener('mouseleave', handleMouseLeave);
    }

    // Intersection Observer to stop loop when scrolled offscreen
    const observer = new IntersectionObserver(
      (entries) => {
        isVisible = entries[0].isIntersecting;
      },
      { threshold: 0.05 }
    );
    if (container) observer.observe(container);

    // Render loop
    let time = 0;
    const render = () => {
      if (!isVisible && !prefersReducedMotion) {
        animationFrameId = requestAnimationFrame(render);
        return;
      }

      ctx.clearRect(0, 0, width, height);

      // Center coords
      const centerX = width / 2;
      const centerY = height / 2;

      // Smooth rotation velocity interpolation
      currentRotationSpeedY += (targetRotationSpeedY - currentRotationSpeedY) * 0.05;
      currentRotationSpeedX += (targetRotationSpeedX - currentRotationSpeedX) * 0.05;

      if (!prefersReducedMotion) {
        angleY += currentRotationSpeedY;
        angleX += currentRotationSpeedX;
        time += 0.02;
      }

      const cosX = Math.cos(angleX);
      const sinX = Math.sin(angleX);
      const cosY = Math.cos(angleY);
      const sinY = Math.sin(angleY);

      // Project 3D points
      const projected = points.map((p) => {
        // Rotate around Y
        const x1 = p.x * cosY + p.z * sinY;
        const z1 = -p.x * sinY + p.z * cosY;

        // Rotate around X
        const y2 = p.y * cosX - z1 * sinX;
        const z2 = p.y * sinX + z1 * cosX;

        // Perspective projection
        const fov = 350;
        const scale = fov / (fov + z2 + 80);
        const projX = centerX + x1 * scale;
        const projY = centerY + y2 * scale;
        const alpha = Math.max(0.12, Math.min(1, (z2 + sphereRadius) / (2 * sphereRadius)));

        return {
          ...p,
          projX,
          projY,
          scale,
          z: z2,
          alpha,
        };
      });

      // Sort points back-to-front
      projected.sort((a, b) => a.z - b.z);

      // Draw connecting civic network arcs between nearby nodes
      ctx.lineWidth = 1;
      const maxDistance = 75;
      for (let i = 0; i < projected.length; i++) {
        for (let j = i + 1; j < projected.length; j++) {
          const p1 = projected[i];
          const p2 = projected[j];
          const dx = p1.projX - p2.projX;
          const dy = p1.projY - p2.projY;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < maxDistance) {
            const lineAlpha = (1 - dist / maxDistance) * 0.25 * Math.min(p1.alpha, p2.alpha);
            ctx.strokeStyle = `rgba(167, 139, 250, ${lineAlpha})`;
            ctx.beginPath();
            ctx.moveTo(p1.projX, p1.projY);
            ctx.lineTo(p2.projX, p2.projY);
            ctx.stroke();
          }
        }
      }

      // Draw glowing central wireframe ring
      ctx.save();
      ctx.beginPath();
      ctx.ellipse(centerX, centerY, sphereRadius * 0.95, sphereRadius * 0.35, angleY * 0.4, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(124, 58, 237, 0.15)';
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.restore();

      // Draw nodes
      for (const p of projected) {
        const pulse = Math.sin(time * 2 + p.pulsePhase) * 0.8;
        const radius = Math.max(1.5, p.baseRadius * p.scale + pulse);

        // Subtle outer glow for front-facing nodes
        if (p.alpha > 0.5) {
          ctx.beginPath();
          ctx.arc(p.projX, p.projY, radius * 2.2, 0, Math.PI * 2);
          ctx.fillStyle = p.color + '26'; // ~15% opacity hex
          ctx.fill();
        }

        // Core node dot
        ctx.beginPath();
        ctx.arc(p.projX, p.projY, radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.fill();
        ctx.globalAlpha = 1;
      }

      if (!prefersReducedMotion) {
        animationFrameId = requestAnimationFrame(render);
      }
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resize);
      if (container) {
        container.removeEventListener('mousemove', handleMouseMove);
        container.removeEventListener('mouseleave', handleMouseLeave);
        observer.disconnect();
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full flex items-center justify-center select-none ${className}`}
      aria-hidden="true"
    >
      <canvas ref={canvasRef} className="w-full h-full block" />
    </div>
  );
};

export default CivicSphereCanvas;
