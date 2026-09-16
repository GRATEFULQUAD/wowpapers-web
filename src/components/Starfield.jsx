import { useEffect, useRef } from "react";

// Lightweight canvas starfield used as an ambient cosmic background.
// Static, low-cost render (no continuous animation loop) so it never
// distracts from the wallpapers.
export function Starfield() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let raf;

    function draw() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const { innerWidth: w, innerHeight: h } = window;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = w + "px";
      canvas.style.height = h + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);

      const starCount = Math.floor((w * h) / 9000);
      for (let i = 0; i < starCount; i++) {
        const x = Math.random() * w;
        const y = Math.random() * h;
        const r = Math.random() * 1.2 + 0.2;
        const alpha = Math.random() * 0.6 + 0.15;
        const hue = Math.random() > 0.85 ? "180, 255, 255" : "255, 255, 255";
        ctx.fillStyle = `rgba(${hue}, ${alpha})`;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    draw();
    const onResize = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(draw);
    };
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(raf);
    };
  }, []);

  return <canvas ref={canvasRef} className="starfield" aria-hidden="true" />;
}
