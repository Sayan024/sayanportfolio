import React, { Suspense, lazy, useEffect, useRef, useState } from 'react';
import HeroPipeline from './HeroPipeline';
import './LakehouseScene.css';

// three.js is loaded on demand so it never delays the first paint
const LakehouseScene = lazy(() => import('./LakehouseScene'));

// The 3D scene needs a desktop-sized hero, WebGL, and a visitor who hasn't asked for reduced motion
const canRender3D = () => {
  if (!window.matchMedia('(min-width: 993px)').matches) return false;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false;
  try {
    const canvas = document.createElement('canvas');
    return Boolean(canvas.getContext('webgl2') || canvas.getContext('webgl'));
  } catch {
    return false;
  }
};

// Falls back to the 2D pipeline if the 3D scene fails to load or crashes
class SceneErrorBoundary extends React.Component {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

const Hero3D = () => {
  const [enabled] = useState(canRender3D);
  const [inView, setInView] = useState(true);
  const wrapperRef = useRef(null);

  // Stop rendering while the hero is scrolled out of view
  useEffect(() => {
    if (!enabled || !wrapperRef.current) return;
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting));
    observer.observe(wrapperRef.current);
    return () => observer.disconnect();
  }, [enabled]);

  if (!enabled) return <HeroPipeline />;

  return (
    <SceneErrorBoundary fallback={<HeroPipeline />}>
      <div className="hero3d-wrapper" ref={wrapperRef}>
        <Suspense fallback={null}>
          <LakehouseScene active={inView} />
        </Suspense>
      </div>
    </SceneErrorBoundary>
  );
};

export default Hero3D;
