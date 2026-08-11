import { useRef, useEffect } from 'react';
import { useScroll } from 'framer-motion';
import './ScrollSequence.css';

const ScrollSequence = ({ children }) => {
  const wrapperRef = useRef(null);
  const canvasRef = useRef(null);
  const imageRef = useRef(null);

  // Create a scroll listener on the wrapper (kept so this stays a scroll-linked section)
  useScroll({
    target: wrapperRef,
    offset: ["start start", "end end"]
  });

  const drawImage = () => {
    const canvas = canvasRef.current;
    const img = imageRef.current;
    if (!canvas || !img || !img.complete) return;

    const ctx = canvas.getContext('2d');

    // Set canvas dimensions to window innerHeight/Width
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Draw image covering the entire canvas (like object-fit: cover)
    const scale = Math.max(canvas.width / img.width, canvas.height / img.height);
    const x = (canvas.width / 2) - (img.width / 2) * scale;
    const y = (canvas.height / 2) - (img.height / 2) * scale;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // Draw with slight opacity so it acts as a background
    ctx.globalAlpha = 0.4;
    ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
  };

  // Preload the background image
  useEffect(() => {
    const img = new Image();
    img.src = '/career-bg.jpg';
    img.onload = () => {
      imageRef.current = img;
      drawImage();
    };
  }, []);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => drawImage();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="scroll-sequence-wrapper" ref={wrapperRef}>
      <div className="canvas-wrapper">
        <div className="canvas-container">
          <canvas ref={canvasRef} />
          {/* A gradient overlay to blend the canvas with the dark theme */}
          <div className="canvas-overlay"></div>
        </div>
      </div>
      
      <div className="sequence-content">
        {children}
      </div>
    </div>
  );
};

export default ScrollSequence;
