import { useEffect, useRef, useState } from 'react';

export default function CountUp({ value, className = '' }) {
  const [display, setDisplay] = useState(0);
  const frameRef = useRef(null);
  const startRef = useRef(null);
  const startValRef = useRef(0);

  useEffect(() => {
    cancelAnimationFrame(frameRef.current);
    startRef.current = null;
    startValRef.current = display;
    const target = value;
    const duration = 600;

    const animate = (ts) => {
      if (!startRef.current) startRef.current = ts;
      const progress = Math.min((ts - startRef.current) / duration, 1);
      // Ease out cubic
      const ease = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(startValRef.current + (target - startValRef.current) * ease));
      if (progress < 1) frameRef.current = requestAnimationFrame(animate);
    };
    frameRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameRef.current);
  }, [value]); // eslint-disable-line

  return <span className={className}>{display}</span>;
}
