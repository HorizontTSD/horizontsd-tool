// placement.ts
export type Placement =
  | 'top'
  | 'top-start'
  | 'top-end'
  | 'bottom'
  | 'bottom-start'
  | 'bottom-end'
  | 'right'
  | 'right-start'
  | 'right-end'
  | 'left'
  | 'left-start'
  | 'left-end';

interface PlacementOptions {
  placement?: Placement;
  flip?: boolean;
  cap?: boolean;
  bound?: boolean | HTMLElement;
}

const PROPS = {
  x: { start: 'left', Start: 'Left', end: 'right', End: 'Right', size: 'width', Size: 'Width' },
  y: { start: 'top', Start: 'Top', end: 'bottom', End: 'Bottom', size: 'height', Size: 'Height' }
};

export default function(
  anchor: HTMLElement,
  overlay: HTMLElement,
  options: PlacementOptions = {}
) {
  // Safe style reset
  if (overlay?.style) {
    overlay.style.position = 'absolute';
    overlay.style.maxWidth = '';
    overlay.style.maxHeight = '';
  } else {
    return; // Exit if overlay is invalid
  }

  const defaultPlacement = 'bottom-start';
  const [side = 'bottom', align = 'start'] = (options.placement || defaultPlacement).split('-');
  const axisSide = ['top', 'bottom'].includes(side) ? 'y' : 'x';
  const oppositeSide = side === PROPS[axisSide].start ? PROPS[axisSide].end : PROPS[axisSide].start;
  const axisAlign = axisSide === 'x' ? 'y' : 'x';

  // Safe bounding rect calculations
  const anchorRect = anchor?.getBoundingClientRect() || new DOMRect(0, 0, 0, 0);
  const boundEl = (typeof options.bound === 'object' ? options.bound : document.body);
  const boundRect = boundEl?.getBoundingClientRect() || new DOMRect(0, 0, window.innerWidth, window.innerHeight);
  const offsetParent = overlay.offsetParent || document.body;
  const offsetParentRect = offsetParent === document.body 
    ? new DOMRect(-window.pageXOffset, -window.pageYOffset, window.innerWidth, window.innerHeight) 
    : offsetParent.getBoundingClientRect();

  // Safe style calculations
  const offsetParentComputed = offsetParent ? getComputedStyle(offsetParent) : {
    borderTopWidth: '0px',
    borderLeftWidth: '0px'
  };
  const overlayComputed = overlay ? getComputedStyle(overlay) : {
    marginTop: '0px',
    marginBottom: '0px',
    marginLeft: '0px',
    marginRight: '0px',
    maxWidth: 'none'
  };

  // Flip logic (with null checks)
  if (options.flip !== false) {
    const room = (side: string) => Math.abs(anchorRect[side] - boundRect[side]);
    const roomThisSide = room(side);
    const overlaySize = overlay[`offset${PROPS[axisSide].Size}`];

    if (overlaySize > roomThisSide && room(oppositeSide) > roomThisSide) {
      [side, oppositeSide] = [oppositeSide, side];
    }
  }

  // Safe data attribute assignment
  if (overlay.dataset) {
    overlay.dataset.placement = `${side}-${align}`;
  }

  // Cap logic (with null checks)
  if (options.cap !== false) {
    const cap = (axis: 'x' | 'y', room: number) => {
      const intrinsicMaxSize = overlayComputed[`max${PROPS[axis].Size}`];
      const marginStart = parseInt(overlayComputed[`margin${PROPS[axis].Start}`]) || 0;
      const marginEnd = parseInt(overlayComputed[`margin${PROPS[axis].End}`]) || 0;
      
      room -= marginStart + marginEnd;
      
      if (intrinsicMaxSize === 'none' || room < (parseInt(intrinsicMaxSize) || 0)) {
        overlay.style[`max${PROPS[axis].Size}`] = `${room}px`;
      }
    };

    cap(axisSide, Math.abs(boundRect[side] - anchorRect[side]));
    cap(axisAlign, boundRect[PROPS[axisAlign].size]);
  }

  // Safe style assignments
  if (overlay.style) {
    // Side positioning
    overlay.style[side] = 'auto';
    overlay.style[oppositeSide] = `${(
      side === PROPS[axisSide].start
        ? offsetParentRect[PROPS[axisSide].end] - anchorRect[PROPS[axisSide].start]
        : anchorRect[PROPS[axisSide].end] - offsetParentRect[PROPS[axisSide].start]
    ) - (parseInt(offsetParentComputed[`border${PROPS[axisSide].Start}Width`]) || 0)}px`;

    // Align positioning
    const fromAlign = align === 'end' ? 'end' : 'start';
    const oppositeAlign = align === 'end' ? 'start' : 'end';
    const anchorAlign = anchorRect[axisAlign] - offsetParentRect[axisAlign];
    const anchorSize = anchorRect[PROPS[axisAlign].size];
    const overlaySize = overlay[`offset${PROPS[axisAlign].Size}`];

    let alignPos = align === 'end'
      ? offsetParentRect[PROPS[axisAlign].size] - anchorAlign - anchorSize
      : anchorAlign + (align !== 'start' ? anchorSize / 2 - overlaySize / 2 : 0);

    if (options.bound !== false) {
      const factor = align === 'end' ? -1 : 1;
      alignPos = Math.max(
        factor * (boundRect[PROPS[axisAlign][fromAlign]] - offsetParentRect[PROPS[axisAlign][fromAlign]]),
        Math.min(
          alignPos,
          factor * (boundRect[PROPS[axisAlign][oppositeAlign]] - offsetParentRect[PROPS[axisAlign][fromAlign]]) - overlaySize
        )
      );
    }

    overlay.style[PROPS[axisAlign][oppositeAlign]] = 'auto';
    overlay.style[PROPS[axisAlign][fromAlign]] = `${(
      alignPos - (parseInt(offsetParentComputed[`border${PROPS[axisAlign].Start}Width`]) || 0)
    )}px`;
  }
}