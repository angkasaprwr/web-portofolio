import { useEffect, useRef, useState } from 'react';
import { useInView } from 'framer-motion';

export default function AnimatedCounter({ value, suffix = '', duration = 1.6, className = '' }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const [display, setDisplay] = useState(0);
  const numeric = parseInt(String(value).replace(/\D/g, ''), 10) || 0;
  const prefix = String(value).match(/^\D+/)?.[0] || '';
  const endSuffix = suffix || String(value).replace(/[\d\s]/g, '').replace(prefix, '') || '';

  useEffect(() => {
    if (!inView) return undefined;
    let start;
    let frame;
    const step = (ts) => {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / (duration * 1000), 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.floor(eased * numeric));
      if (progress < 1) frame = requestAnimationFrame(step);
    };
    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [inView, numeric, duration]);

  return (
    <span ref={ref} className={className}>
      {prefix}
      {display}
      {endSuffix}
    </span>
  );
}
