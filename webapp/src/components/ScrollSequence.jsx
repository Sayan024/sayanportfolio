import React, { useRef, useEffect, useState } from 'react';
import { useScroll, useTransform, useMotionValueEvent } from 'framer-motion';
import './ScrollSequence.css';

const ScrollSequence = ({ children }) => {
  const wrapperRef = useRef(null);
  const canvasRef = useRef(null);
  const imagesRef = useRef([]);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  
  const frameCount = 51;
  
  // Create a scroll listener on the wrapper
  const { scrollYProgress } = useScroll({
    target: wrapperRef,
    offset: ["start start", "end end"]
  });

  // Preload images
  useEffect(() => {
    const loadedImages = [];
    let loadedCount = 0;

    for (let i = 1; i <= frameCount; i++) {
      const img = new Image();
      // Format number to 3 digits (e.g., 001, 002)
      const numStr = i.toString().padStart(3, '0');
      img.src = `/sequence/ezgif-frame-${numStr}.jpg`;
      img.onload = () => {
        loadedCount++;
        // If all images loaded, trigger initial draw
        if (loadedCount === frameCount) {
          imagesRef.current = loadedImages;
          setImagesLoaded(true);
          drawFrame(1, loadedImages);
        }
      };
      loadedImages.push(img);
    }
  }, []);

  // Map scroll progress (0-1) to frame index (0-50)
  const currentFrame = useTransform(scrollYProgress, [0, 1], [0, frameCount - 1]);

  // Update canvas when frame changes
  useMotionValueEvent(currentFrame, "change", (latest) => {
    if (imagesRef.current.length === frameCount) {
      drawFrame(Math.round(latest) + 1, imagesRef.current);
    }
  });

  const drawFrame = (frameIndex, imgArray = imagesRef.current) => {
    if (!canvasRef.current || !imgArray[frameIndex - 1]) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Set canvas dimensions to window innerHeight/Width
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const img = imgArray[frameIndex - 1];
    
    // Draw image covering the entire canvas (like object-fit: cover)
    const scale = Math.max(canvas.width / img.width, canvas.height / img.height);
    const x = (canvas.width / 2) - (img.width / 2) * scale;
    const y = (canvas.height / 2) - (img.height / 2) * scale;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // Draw with slight opacity so it acts as a background
    ctx.globalAlpha = 0.4;
    ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
  };

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (imagesRef.current.length === frameCount) {
        drawFrame(Math.round(currentFrame.get()) + 1);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [imagesLoaded, currentFrame]);

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
