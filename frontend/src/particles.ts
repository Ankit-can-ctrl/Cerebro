type Particle = {
  x: number;
  y: number;
  radius: number;
  velocityX: number;
  velocityY: number;
  life: number;
  hue: number;
};

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

export function startParticles(canvas: HTMLCanvasElement) {
  const context = canvas.getContext("2d");
  if (!context) return () => {};
  const ctx = context as CanvasRenderingContext2D;

  let devicePixelRatio = Math.max(1, window.devicePixelRatio || 1);

  const particles: Particle[] = [];

  const config = {
    countPerArea: 0.00012, // particles per pixel area
    minRadius: 0.6,
    maxRadius: 2.4,
    maxSpeed: 0.25,
    connectDistance: 110,
  };

  function resize() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    canvas.width = Math.floor(width * devicePixelRatio);
    canvas.height = Math.floor(height * devicePixelRatio);
    canvas.style.width = width + "px";
    canvas.style.height = height + "px";
    ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);

    const targetCount = Math.floor(width * height * config.countPerArea);
    while (particles.length < targetCount)
      particles.push(createParticle(width, height));
    while (particles.length > targetCount) particles.pop();
  }

  function createParticle(width: number, height: number): Particle {
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * config.maxSpeed + 0.03;
    return {
      x: Math.random() * width,
      y: Math.random() * height,
      radius:
        Math.random() * (config.maxRadius - config.minRadius) +
        config.minRadius,
      velocityX: Math.cos(angle) * speed,
      velocityY: Math.sin(angle) * speed,
      life: Math.random() * 1,
      hue: 215 + Math.random() * 40, // blue-indigo range
    };
  }

  function step(width: number, height: number) {
    ctx.clearRect(0, 0, width, height);

    // Draw connections first with very low alpha
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const a = particles[i];
        const b = particles[j];
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const dist = Math.hypot(dx, dy);
        if (dist < config.connectDistance) {
          const alpha = clamp(1 - dist / config.connectDistance, 0, 1) * 0.12;
          ctx.strokeStyle = `hsla(${(a.hue + b.hue) / 2}, 90%, 70%, ${alpha})`;
          ctx.lineWidth = 0.6;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    }

    // Draw particles
    for (const p of particles) {
      p.x += p.velocityX;
      p.y += p.velocityY;
      p.life += 0.0025;

      // gentle drift
      p.velocityX += Math.sin(p.life * 2) * 0.0015;
      p.velocityY += Math.cos(p.life * 2) * 0.0015;

      // wrap around edges for seamless motion
      if (p.x < -10) p.x = width + 10;
      if (p.x > width + 10) p.x = -10;
      if (p.y < -10) p.y = height + 10;
      if (p.y > height + 10) p.y = -10;

      ctx.beginPath();
      const alpha = 1; // full opacity per particle
      ctx.fillStyle = `hsla(${p.hue}, 90%, 70%, ${alpha})`;
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  let animationFrame = 0;
  function animate() {
    step(canvas.width / devicePixelRatio, canvas.height / devicePixelRatio);
    animationFrame = requestAnimationFrame(animate);
  }

  const onVisibility = () => {
    if (document.hidden) cancelAnimationFrame(animationFrame);
    else animationFrame = requestAnimationFrame(animate);
  };

  window.addEventListener("resize", resize);
  document.addEventListener("visibilitychange", onVisibility);

  resize();
  animationFrame = requestAnimationFrame(animate);

  return () => {
    cancelAnimationFrame(animationFrame);
    window.removeEventListener("resize", resize);
    document.removeEventListener("visibilitychange", onVisibility);
  };
}
