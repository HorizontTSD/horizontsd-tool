import { useEffect, useRef } from "react";
import katex from "katex";
import "katex/dist/katex.min.css";

const LatexEquation = ({ equation }: { equation: string }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current && equation) {
      try {
        katex.render(equation, containerRef.current, {
          throwOnError: false,
          displayMode: true,
        });
      } catch (e) {
        console.error("KaTeX rendering error:", e);
      }
    }
  }, [equation]);

  return <div ref={containerRef} />;
};

export default LatexEquation;
