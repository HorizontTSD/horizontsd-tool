import uPlot from 'uplot';

export function middleDragPlugin() {
  let isDragging = false;
  let startX = 0;
  let startY = 0;
  let startMin = 0;
  let startMax = 0;

  return {
    hooks: {
      init: (self: uPlot) => {
        const over = self.over;

        over.addEventListener('mousedown', (e: MouseEvent) => {
          if (e.button === 1) { // Middle mouse button
            isDragging = true;
            startX = e.clientX;
            startY = e.clientY;
            startMin = self.scales.x.min || 0;
            startMax = self.scales.x.max || 0;
            over.style.cursor = 'grabbing';
            e.preventDefault();
          }
        });

        over.addEventListener('mousemove', (e: MouseEvent) => {
          if (isDragging) {
            const dx = e.clientX - startX;
            const scale = self.scales.x;
            const range = startMax - startMin;
            const pixelsPerUnit = self.bbox.width / range;
            const unitsMoved = dx / pixelsPerUnit;

            self.setScale('x', {
              min: startMin - unitsMoved,
              max: startMax - unitsMoved
            });

            e.preventDefault();
          }
        });

        over.addEventListener('mouseup', (e: MouseEvent) => {
          if (e.button === 1) {
            isDragging = false;
            over.style.cursor = '';
            e.preventDefault();
          }
        });

        over.addEventListener('mouseleave', () => {
          if (isDragging) {
            isDragging = false;
            over.style.cursor = '';
          }
        });

        // Prevent default middle-click behavior (scrolling)
        over.addEventListener('auxclick', (e: MouseEvent) => {
          if (e.button === 1) {
            e.preventDefault();
          }
        });
      }
    }
  };
} 