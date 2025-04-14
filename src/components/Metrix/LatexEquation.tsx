import { useEffect } from "react";
import katex from "katex";
import "katex/dist/katex.min.css";

const LatexEquation = ({ equation }: { equation: string }) => {
  useEffect(() => {
    const element = document.getElementById(equation);
    if (element) {
      katex.render(equation, element, {
        throwOnError: false,
      });
    }
  }, [equation]);

  return <span id={equation}></span>;
};

export default LatexEquation;
