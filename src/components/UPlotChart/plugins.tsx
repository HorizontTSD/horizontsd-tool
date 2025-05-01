// https://jsdoc.app/#block-tags
import uPlot, { Plugin, Options } from 'uplot';
import { Quadtree, pointWithin } from "./lib/Quadtree"
import placement from './lib/placement';
import { createPopper } from '@popperjs/core';

/**
 * demos/lib/distr.js
 */
export const SPACE_BETWEEN = 1;
export const SPACE_AROUND = 2;
export const SPACE_EVENLY = 3;
export function roundDec(val, dec) {
    return Math.round(val * (dec = 10 ** dec)) / dec;
}

const coord = (i, offs, iwid, gap) => roundDec(offs + i * (iwid + gap), 6);

export function distr(numItems, sizeFactor, justify, onlyIdx, each) {
    let space = 1 - sizeFactor;

    let gap = (
        justify == SPACE_BETWEEN ? space / (numItems - 1) :
            justify == SPACE_AROUND ? space / (numItems) :
                justify == SPACE_EVENLY ? space / (numItems + 1) : 0
    );

    if (isNaN(gap) || gap == Infinity)
        gap = 0;

    let offs = (
        justify == SPACE_BETWEEN ? 0 :
            justify == SPACE_AROUND ? gap / 2 :
                justify == SPACE_EVENLY ? gap : 0
    );

    let iwid = sizeFactor / numItems;
    let _iwid = roundDec(iwid, 6);

    if (onlyIdx == null) {
        for (let i = 0; i < numItems; i++)
            each(i, coord(i, offs, iwid, gap), _iwid);
    }
    else
        each(onlyIdx, coord(onlyIdx, offs, iwid, gap), _iwid);
}

export function annotationsPlugin(opts) {
    const { types, xMarks } = opts;
    function placeMark(uPlot, mark, opts) {
        let markEl = document.createElement('div');
        markEl.classList.add('u-mark-x');
        let leftCss = Math.round(uPlot.valToPos(mark.from, 'x'));
        let widthCss = mark.to > mark.from ? Math.round(uPlot.valToPos(mark.to, 'x')) - leftCss : 0;
        Object.assign(markEl.style, {
            left: `${leftCss}px`,
            width: `${widthCss}px`,
            borderLeft: `${opts.width}px ${opts.dash ? 'dashed' : 'solid'} ${opts.stroke}`,
            borderRight: mark.to > mark.from
                ? `${opts.width}px ${opts.dash ? 'dashed' : 'solid'} ${opts.stroke}`
                : null,
            background: opts.fill,
        });
        let labelEl = document.createElement('div');
        labelEl.classList.add('u-mark-x-label');
        labelEl.textContent = mark.label;
        labelEl.title = mark.descr;
        Object.assign(labelEl.style, {
            border: `${opts.width}px ${opts.dash ? 'dashed' : 'solid'} ${opts.stroke}`,
            top: opts.align == 'top' ? 0 : '',
            bottom: opts.align == 'btm' ? 0 : '',
            background: opts.fill,
        });
        markEl.appendChild(labelEl);
        uPlot.over.appendChild(markEl);
    }
    return {
        hooks: {
            drawClear: [
                (uPlot) => {
                    for (let el of uPlot.over.querySelectorAll('.u-mark-x')) {
                        el.remove();
                    }
                    xMarks.forEach(mark => {
                        let o = opts.types[mark.type];
                        if (
                            mark.from >= uPlot.scales.x.min &&
                            mark.from <= uPlot.scales.x.max
                            ||
                            mark.to >= uPlot.scales.x.min &&
                            mark.to <= uPlot.scales.x.max
                            ||
                            mark.from <= uPlot.scales.x.min &&
                            mark.to >= uPlot.scales.x.max
                        ) {
                            placeMark(uPlot, mark, o);
                        }
                    });
                }
            ],
        },
    };
}


/**
 * demos/axis-indicators.html
 */
export function axisIndicsPlugin(axes) {
    let axesEls = Array(axes.length);
    let indicsEls = axesEls.slice();
    let guidesEls = axesEls.slice();
    let valuesEls = axesEls.slice();

    const initHook = u => {
        axesEls = [...u.root.querySelectorAll('.u-axis')];

        axesEls.forEach((s, idx) => {
            const axis = axes[idx];

            // eh, this is a bit hand-wavy since we're avoiding read-back of uPlot instance internals
            // and the passed-in axes opts are partial (not fully initialized with their defaults)
            const ori = idx == 0 ? 0 : 1;
            const coord = ori == 0 ? 'x' : 'y';

            const indic = indicsEls[idx] = document.createElement('div');
            indic.classList.add('u-indic-' + coord);
            indic.style.backgroundColor = axis.stroke;

            const value = valuesEls[idx] = document.createTextNode('');
            indic.appendChild(value);

            if (ori == 1) {
                const line = guidesEls[idx] = document.createElement('div');
                line.classList.add('u-indic-line');
                line.style.borderColor = axis.stroke;
                indic.appendChild(line);
            }

            axesEls[idx].appendChild(indic);
        });
    };

    const setLegendHook = u => {
        u.series.forEach((s, seriesIdx) => {
            const el = indicsEls[seriesIdx];
            const valIdx = u.cursor.idxs[seriesIdx];

            if (valIdx != null) {
                const val = u.data[seriesIdx][valIdx];

                if (val != null) {
                    valuesEls[seriesIdx].nodeValue = val;

                    const pos = u.valToPos(val, s.scale);
                    const ori = seriesIdx == 0 ? 0 : 1;

                    el.style.display = 'block';
                    el.style.transform = ori == 0 ?
                        `translateX(-50%) translateX(${pos}px)` :
                        `translateY(-50%) translateY(${pos}px)`;

                    return;
                }
            }

            el.style.display = 'none';
        });
    };

    return {
        opts: (u, opts) => uPlot.assign({}, opts, {
            cursor: {
                y: false,
            },
        }),
        hooks: {
            init: initHook,
            setLegend: setLegendHook,
        },
    };
};

/**
 * demos/stack.js
 */
export function stack(data, omit) {
    let data2 = [];
    let bands = [];
    let d0Len = data[0].length;
    let accum = Array(d0Len);

    for (let i = 0; i < d0Len; i++)
        accum[i] = 0;

    for (let i = 1; i < data.length; i++)
        data2.push(omit(i) ? data[i] : data[i].map((v, i) => (accum[i] += +v)));

    for (let i = 1; i < data.length; i++)
        !omit(i) && bands.push({
            series: [
                data.findIndex((s, j) => j > i && !omit(j)),
                i,
            ],
        });

    bands = bands.filter(b => b.series[1] > -1);

    return {
        data: [data[0]].concat(data2),
        bands,
    };
}

export function getOpts(title, series) {
    return {
        scales: {
            x: {
                time: false,
            },
        },
        series
    };
}

export function getStackedOpts(title, series, data, interp) {
    let opts = getOpts(title, series);

    let interped = interp ? interp(data) : data;

    let stacked = stack(interped, i => false);
    opts.bands = stacked.bands;

    opts.cursor = opts.cursor || {};
    opts.cursor.dataIdx = (u, seriesIdx, closestIdx, xValue) => {
        return data[seriesIdx][closestIdx] == null ? null : closestIdx;
    };

    opts.series.forEach(s => {
        s.value = (u, v, si, i) => data[si][i];

        s.points = s.points || {};

        // scan raw unstacked data to return only real points
        s.points.filter = (u, seriesIdx, show, gaps) => {
            if (show) {
                let pts = [];
                data[seriesIdx].forEach((v, i) => {
                    v != null && pts.push(i);
                });
                return pts;
            }
        }
    });

    // force 0 to be the sum minimum this instead of the bottom series
    opts.scales.y = {
        range: (u, min, max) => {
            let minMax = uPlot.rangeNum(0, max, 0.1, true);
            return [0, minMax[1]];
        }
    };

    // restack on toggle
    opts.hooks = {
        setSeries: [
            (u, i) => {
                let stacked = stack(data, i => !u.series[i].show);
                u.delBand(null);
                stacked.bands.forEach(b => u.addBand(b));
                u.setData(stacked.data);
            }
        ],
    };

    return { opts, data: stacked.data };
}

export function stack2(series) {
    // for uplot data
    let data = Array(series.length);
    let bands = [];

    let dataLen = series[0].values.length;

    let zeroArr = Array(dataLen).fill(0);

    let stackGroups = new Map();
    let seriesStackKeys = Array(series.length);

    series.forEach((s, si) => {
        let vals = s.values.slice();

        // apply negY
        if (s.negY) {
            for (let i = 0; i < vals.length; i++) {
                if (vals[i] != null)
                    vals[i] *= -1;
            }
        }

        if (s.stacking.mode != 'none') {
            let hasPos = vals.some(v => v > 0);
            // derive stacking key
            let stackKey = seriesStackKeys[si] = s.stacking.mode + s.scaleKey + s.stacking.group + (hasPos ? '+' : '-');
            let group = stackGroups.get(stackKey);

            // initialize stacking group
            if (group == null) {
                group = {
                    series: [],
                    acc: zeroArr.slice(),
                    dir: hasPos ? -1 : 1,
                };
                stackGroups.set(stackKey, group);
            }

            // push for bands gen
            group.series.unshift(si);

            let stacked = data[si] = Array(dataLen);
            let { acc } = group;

            for (let i = 0; i < dataLen; i++) {
                let v = vals[i];

                if (v != null)
                    stacked[i] = (acc[i] += v);
                else
                    stacked[i] = v; // we may want to coerce to 0 here
            }
        }
        else
            data[si] = vals;
    });

    // re-compute by percent
    series.forEach((s, si) => {
        if (s.stacking.mode == 'percent') {
            let group = stackGroups.get(seriesStackKeys[si]);
            let { acc } = group;

            // re-negatify percent
            let sign = group.dir * -1;

            let stacked = data[si];

            for (let i = 0; i < dataLen; i++) {
                let v = stacked[i];

                if (v != null)
                    stacked[i] = sign * (v / acc[i]);
            }
        }
    });

    // generate bands between adjacent group series
    stackGroups.forEach(group => {
        let { series, dir } = group;
        let lastIdx = series.length - 1;

        series.forEach((si, i) => {
            if (i != lastIdx) {
                let nextIdx = series[i + 1];
                bands.push({
                    // since we're not passing x series[0] for stacking, real idxs are actually +1
                    series: [si + 1, nextIdx + 1],
                    dir,
                });
            }
        });
    });

    return {
        data,
        bands,
    };
}

/**
 * demos/grouped-bars.js
 */
export function seriesBarsPlugin(opts) {
    let pxRatio;
    let font;

    let { ignore = [] } = opts;

    let radius = opts.radius ?? 0;

    function setPxRatio() {
        pxRatio = devicePixelRatio;
        font = Math.round(10 * pxRatio) + "px Arial";
    }

    setPxRatio();

    window.addEventListener('dppxchange', setPxRatio);

    const ori = opts.ori;
    const dir = opts.dir;
    const stacked = opts.stacked;

    const groupWidth = 0.9;
    const groupDistr = SPACE_BETWEEN;

    const barWidth = 1;
    const barDistr = SPACE_BETWEEN;

    function distrTwo(groupCount, barCount, barSpread = true, _groupWidth = groupWidth) {
        let out = Array.from({ length: barCount }, () => ({
            offs: Array(groupCount).fill(0),
            size: Array(groupCount).fill(0),
        }));

        distr(groupCount, _groupWidth, groupDistr, null, (groupIdx, groupOffPct, groupDimPct) => {
            distr(barCount, barWidth, barDistr, null, (barIdx, barOffPct, barDimPct) => {
                out[barIdx].offs[groupIdx] = groupOffPct + (barSpread ? (groupDimPct * barOffPct) : 0);
                out[barIdx].size[groupIdx] = groupDimPct * (barSpread ? barDimPct : 1);
            });
        });

        return out;
    }

    let barsPctLayout;
    let barsColors;

    let barsBuilder = uPlot.paths.bars({
        radius,
        disp: {
            x0: {
                unit: 2,
                //	discr: false, (unary, discrete, continuous)
                values: (u, seriesIdx, idx0, idx1) => barsPctLayout[seriesIdx].offs,
            },
            size: {
                unit: 2,
                //	discr: true,
                values: (u, seriesIdx, idx0, idx1) => barsPctLayout[seriesIdx].size,
            },
            ...opts.disp,
            /*
                // e.g. variable size via scale (will compute offsets from known values)
                x1: {
                    units: 1,
                    values: (u, seriesIdx, idx0, idx1) => bucketEnds[idx],
                },
            */
        },
        each: (u, seriesIdx, dataIdx, lft, top, wid, hgt) => {
            // we get back raw canvas coords (included axes & padding). translate to the plotting area origin
            lft -= u.bbox.left;
            top -= u.bbox.top;
            qt.add({ x: lft, y: top, w: wid, h: hgt, sidx: seriesIdx, didx: dataIdx });
        },
    });

    function drawPoints(u, sidx, i0, i1) {
        u.ctx.save();

        u.ctx.font = font;
        u.ctx.fillStyle = "black";

        uPlot.orient(u, sidx, (series, dataX, dataY, scaleX, scaleY, valToPosX, valToPosY, xOff, yOff, xDim, yDim, moveTo, lineTo, rect) => {
            const _dir = dir * (ori == 0 ? 1 : -1);

            const wid = Math.round(barsPctLayout[sidx].size[0] * xDim);

            barsPctLayout[sidx].offs.forEach((offs, ix) => {
                if (dataY[ix] != null) {
                    let x0 = xDim * offs;
                    let lft = Math.round(xOff + (_dir == 1 ? x0 : xDim - x0 - wid));
                    let barWid = Math.round(wid);

                    let yPos = valToPosY(dataY[ix], scaleY, yDim, yOff);

                    let x = ori == 0 ? Math.round(lft + barWid / 2) : Math.round(yPos);
                    let y = ori == 0 ? Math.round(yPos) : Math.round(lft + barWid / 2);

                    u.ctx.textAlign = ori == 0 ? "center" : dataY[ix] >= 0 ? "left" : "right";
                    u.ctx.textBaseline = ori == 1 ? "middle" : dataY[ix] >= 0 ? "bottom" : "top";

                    u.ctx.fillText(dataY[ix], x, y);
                }
            });
        });

        u.ctx.restore();
    }

    function range(u, dataMin, dataMax) {
        let [min, max] = uPlot.rangeNum(0, dataMax, 0.05, true);
        return [0, max];
    }

    let qt;

    return {
        hooks: {
            init: u => {
                for (let el of u.root.querySelectorAll('.u-cursor-pt'))
                    el.style.borderRadius = 'unset';
            },
            drawClear: u => {
                qt = qt || new Quadtree(0, 0, u.bbox.width, u.bbox.height);

                qt.clear();

                // force-clear the path cache to cause drawBars() to rebuild new quadtree
                u.series.forEach(s => {
                    s._paths = null;
                });

                barsPctLayout = [null].concat(distrTwo(u.data[0].length, u.series.length - 1 - ignore.length, !stacked, groupWidth));

                // TODOL only do on setData, not every redraw
                if (opts.disp?.fill != null) {
                    barsColors = [null];

                    for (let i = 1; i < u.data.length; i++) {
                        barsColors.push({
                            fill: opts.disp.fill.values(u, i),
                            stroke: opts.disp.stroke.values(u, i),
                        });
                    }
                }
            },
        },
        opts: (u, opts) => {
            const yScaleOpts = {
                range,
                ori: ori == 0 ? 1 : 0,
            };

            // hovered
            let hRect;

            uPlot.assign(opts, {
                select: { show: false },
                cursor: {
                    x: false,
                    y: false,
                    dataIdx: (u, seriesIdx) => {
                        if (seriesIdx == 1) {
                            hRect = null;

                            let cx = u.cursor.left * pxRatio;
                            let cy = u.cursor.top * pxRatio;

                            qt.get(cx, cy, 1, 1, o => {
                                if (pointWithin(cx, cy, o.x, o.y, o.x + o.w, o.y + o.h))
                                    hRect = o;
                            });
                        }

                        return hRect && seriesIdx == hRect.sidx ? hRect.didx : null;
                    },
                    points: {
                        fill: "rgba(255,255,255, 0.3)",
                        bbox: (u, seriesIdx) => {
                            let isHovered = hRect && seriesIdx == hRect.sidx;

                            return {
                                left: isHovered ? hRect.x / pxRatio : -10,
                                top: isHovered ? hRect.y / pxRatio : -10,
                                width: isHovered ? hRect.w / pxRatio : 0,
                                height: isHovered ? hRect.h / pxRatio : 0,
                            };
                        }
                    }
                },
                scales: {
                    x: {
                        time: false,
                        distr: 2,
                        ori,
                        dir,
                        //	auto: true,
                        range: (u, min, max) => {
                            min = 0;
                            max = Math.max(1, u.data[0].length - 1);

                            let pctOffset = 0;

                            distr(u.data[0].length, groupWidth, groupDistr, 0, (di, lftPct, widPct) => {
                                pctOffset = lftPct + widPct / 2;
                            });

                            let rn = max - min;

                            if (pctOffset == 0.5)
                                min -= rn;
                            else {
                                let upScale = 1 / (1 - pctOffset * 2);
                                let offset = (upScale * rn - rn) / 2;

                                min -= offset;
                                max += offset;
                            }

                            return [min, max];
                        }
                    },
                    rend: yScaleOpts,
                    size: yScaleOpts,
                    mem: yScaleOpts,
                    inter: yScaleOpts,
                    toggle: yScaleOpts,
                }
            });

            if (ori == 1) {
                opts.padding = [0, null, 0, null];
            }

            uPlot.assign(opts.axes[0], {
                splits: (u, axisIdx) => {
                    const _dir = dir * (ori == 0 ? 1 : -1);
                    let splits = u._data[0].slice();
                    return _dir == 1 ? splits : splits.reverse();
                },
                values: u => u.data[0],
                gap: 15,
                size: ori == 0 ? 40 : 150,
                labelSize: 20,
                grid: { show: false },
                ticks: { show: false },

                side: ori == 0 ? 2 : 3,
            });

            opts.series.forEach((s, i) => {
                if (i > 0 && !ignore.includes(i)) {
                    uPlot.assign(s, {
                        //	pxAlign: false,
                        //	stroke: "rgba(255,0,0,0.5)",
                        paths: barsBuilder,
                        points: {
                            show: drawPoints
                        }
                    });
                }
            });
        }
    };
}

/**
 * demos/box-whisker.html
 */
export function box_whisker__columnHighlightPlugin({ className, style = { backgroundColor: "rgba(51,204,255,0.3)" } } = {}) {
    let underEl, overEl, highlightEl, currIdx;

    function init(u) {
        underEl = u.under;
        overEl = u.over;

        highlightEl = document.createElement("div");

        className && highlightEl.classList.add(className);

        uPlot.assign(highlightEl.style, {
            pointerEvents: "none",
            display: "none",
            position: "absolute",
            left: 0,
            top: 0,
            height: "100%",
            ...style
        });

        underEl.appendChild(highlightEl);

        // show/hide highlight on enter/exit
        overEl.addEventListener("mouseenter", () => { highlightEl.style.display = null; });
        overEl.addEventListener("mouseleave", () => { highlightEl.style.display = "none"; });
    }

    function update(u) {
        if (currIdx !== u.cursor.idx) {
            currIdx = u.cursor.idx;

            const dx = u.scales.x.max - u.scales.x.min;
            const width = (u.bbox.width / dx) / devicePixelRatio;
            const left = u.valToPos(currIdx, "x") - width / 2;

            highlightEl.style.transform = "translateX(" + Math.round(left) + "px)";
            highlightEl.style.width = Math.round(width) + "px";
        }
    }

    return {
        opts: (u, opts) => {
            uPlot.assign(opts, {
                cursor: {
                    x: false,
                    y: false,
                }
            });
        },
        hooks: {
            init: init,
            setCursor: update,
        }
    };
}

export function box_whisker__legendAsTooltipPlugin({ className, style = { backgroundColor: "rgba(255, 249, 196, 0.92)", color: "black" } } = {}) {
    let legendEl;

    function init(u, opts) {
        legendEl = u.root.querySelector(".u-legend");

        legendEl.classList.remove("u-inline");
        className && legendEl.classList.add(className);

        uPlot.assign(legendEl.style, {
            textAlign: "left",
            pointerEvents: "none",
            display: "none",
            position: "absolute",
            left: 0,
            top: 0,
            zIndex: 100,
            boxShadow: "2px 2px 10px rgba(0,0,0,0.5)",
            ...style
        });

        // hide series color markers
        const idents = legendEl.querySelectorAll(".u-marker");

        for (let i = 0; i < idents.length; i++)
            idents[i].style.display = "none";

        const overEl = u.over;
        overEl.style.overflow = "visible";

        // move legend into plot bounds
        overEl.appendChild(legendEl);

        // show/hide tooltip on enter/exit
        overEl.addEventListener("mouseenter", () => { legendEl.style.display = null; });
        overEl.addEventListener("mouseleave", () => { legendEl.style.display = "none"; });

        // let tooltip exit plot
        //	overEl.style.overflow = "visible";
    }

    function update(u) {
        const { left, top } = u.cursor;
        legendEl.style.transform = "translate(" + left + "px, " + top + "px)";
    }

    return {
        hooks: {
            init: init,
            setCursor: update,
        }
    };
}

export function boxesPlugin({ gap = 2, shadowColor = "#000000", bearishColor = "#e54245", bullishColor = "#4ab650", bodyWidthFactor = 0.7, shadowWidth = 2, bodyOutline = 1 } = {}) {

    function drawBoxes(u) {
        u.ctx.save();

        const offset = (shadowWidth % 2) / 2;

        u.ctx.translate(offset, offset);

        for (let i = u.scales.x.min; i <= u.scales.x.max; i++) {
            let med = u.data[1][i];
            let q1 = u.data[2][i];
            let q3 = u.data[3][i];
            let min = u.data[4][i];
            let max = u.data[5][i];
            let outs = u.data[6][i];

            let timeAsX = u.valToPos(i, "x", true);
            let lowAsY = u.valToPos(min, "y", true);
            let highAsY = u.valToPos(max, "y", true);
            let openAsY = u.valToPos(q1, "y", true);
            let closeAsY = u.valToPos(q3, "y", true);
            let medAsY = u.valToPos(med, "y", true);

            // shadow rect
            let shadowHeight = Math.max(highAsY, lowAsY) - Math.min(highAsY, lowAsY);
            let shadowX = timeAsX;
            let shadowY = Math.min(highAsY, lowAsY);

            u.ctx.beginPath();
            u.ctx.setLineDash([4, 4]);
            u.ctx.lineWidth = shadowWidth;
            u.ctx.strokeStyle = shadowColor;
            u.ctx.moveTo(
                Math.round(shadowX),
                Math.round(shadowY),
            );
            u.ctx.lineTo(
                Math.round(shadowX),
                Math.round(shadowY + shadowHeight),
            );
            u.ctx.stroke();

            // body rect
            let columnWidth = u.bbox.width / (u.scales.x.max - u.scales.x.min);
            let bodyWidth = Math.round(bodyWidthFactor * (columnWidth - gap));
            let bodyHeight = Math.max(closeAsY, openAsY) - Math.min(closeAsY, openAsY);
            let bodyX = timeAsX - (bodyWidth / 2);
            let bodyY = Math.min(closeAsY, openAsY);
            let bodyColor = "#eee";

            u.ctx.fillStyle = shadowColor;
            u.ctx.fillRect(
                Math.round(bodyX),
                Math.round(bodyY),
                Math.round(bodyWidth),
                Math.round(bodyHeight),
            );

            u.ctx.fillStyle = bodyColor;
            u.ctx.fillRect(
                Math.round(bodyX + bodyOutline),
                Math.round(bodyY + bodyOutline),
                Math.round(bodyWidth - bodyOutline * 2),
                Math.round(bodyHeight - bodyOutline * 2),
            );

            u.ctx.fillStyle = "#000";
            u.ctx.fillRect(
                Math.round(bodyX),
                Math.round(medAsY - 1),
                Math.round(bodyWidth),
                Math.round(2),
            );

            // hz min/max whiskers
            u.ctx.beginPath();
            u.ctx.setLineDash([]);
            u.ctx.lineWidth = shadowWidth;
            u.ctx.strokeStyle = shadowColor;
            u.ctx.moveTo(
                Math.round(bodyX),
                Math.round(highAsY),
            );
            u.ctx.lineTo(
                Math.round(bodyX + bodyWidth),
                Math.round(highAsY),
            );
            u.ctx.moveTo(
                Math.round(bodyX),
                Math.round(lowAsY),
            );
            u.ctx.lineTo(
                Math.round(bodyX + bodyWidth),
                Math.round(lowAsY),
            );
            u.ctx.stroke();

            for (let j = 0; j < outs.length; j++) {
                let cy = u.valToPos(outs[j], "y", true);
                u.ctx.fillRect(timeAsX - 4, cy - 4, 8, 8);
            }
        }

        u.ctx.translate(-offset, -offset);
        u.ctx.restore();
    }
    return {
        opts: (u, opts) => {
            uPlot.assign(opts, {
                cursor: {
                    points: {
                        show: false,
                    }
                },
                scales: {
                    y: {
                        range: (u, dataMin, dataMax) => {
                            // TODO: only scan values in x idx0...idx1 range
                            let outsMin = Math.min(...u.data[6].map(outs => outs.at(0) ?? Infinity));
                            let outsMax = Math.max(...u.data[6].map(outs => outs.at(-1) ?? -Infinity));

                            return uPlot.rangeNum(Math.min(dataMin, outsMin), Math.max(dataMax, outsMax), 0.1, true);
                        }
                    }
                }
            });

            opts.series.forEach(series => {
                series.paths = () => null;
                series.points = { show: false };
            });
        },
        hooks: {
            draw: drawBoxes,
        }
    };
}

/**
 * demos/candlestick-ohlc.html
 */

// column-highlights the hovered x index
export function candlestick_ohlc__columnHighlightPlugin({ className, style = { backgroundColor: "rgba(51,204,255,0.3)" } } = {}) {
    let underEl, overEl, highlightEl, currIdx;

    function init(u) {
        underEl = u.under;
        overEl = u.over;

        highlightEl = document.createElement("div");

        className && highlightEl.classList.add(className);

        uPlot.assign(highlightEl.style, {
            pointerEvents: "none",
            display: "none",
            position: "absolute",
            left: 0,
            top: 0,
            height: "100%",
            ...style
        });

        underEl.appendChild(highlightEl);

        // show/hide highlight on enter/exit
        overEl.addEventListener("mouseenter", () => { highlightEl.style.display = null; });
        overEl.addEventListener("mouseleave", () => { highlightEl.style.display = "none"; });
    }

    function update(u) {
        if (currIdx !== u.cursor.idx) {
            currIdx = u.cursor.idx;

            let [iMin, iMax] = u.series[0].idxs;

            const dx = iMax - iMin;
            const width = (u.bbox.width / dx) / devicePixelRatio;
            const xVal = u.scales.x.distr == 2 ? currIdx : u.data[0][currIdx];
            const left = u.valToPos(xVal, "x") - width / 2;

            highlightEl.style.transform = "translateX(" + Math.round(left) + "px)";
            highlightEl.style.width = Math.round(width) + "px";
        }
    }

    return {
        opts: (u, opts) => {
            uPlot.assign(opts, {
                cursor: {
                    x: false,
                    y: false,
                }
            });
        },
        hooks: {
            init: init,
            setCursor: update,
        }
    };
}

// converts the legend into a simple tooltip
export function candlestick_ohlc__legendAsTooltipPlugin({ className, style = { backgroundColor: "rgba(255, 249, 196, 0.92)", color: "black" } } = {}) {
    let legendEl;

    function init(u, opts) {
        legendEl = u.root.querySelector(".u-legend");

        legendEl.classList.remove("u-inline");
        className && legendEl.classList.add(className);

        uPlot.assign(legendEl.style, {
            textAlign: "left",
            pointerEvents: "none",
            display: "none",
            position: "absolute",
            left: 0,
            top: 0,
            zIndex: 100,
            boxShadow: "2px 2px 10px rgba(0,0,0,0.5)",
            ...style
        });

        // hide series color markers
        const idents = legendEl.querySelectorAll(".u-marker");

        for (let i = 0; i < idents.length; i++)
            idents[i].style.display = "none";

        const overEl = u.over;
        overEl.style.overflow = "visible";

        // move legend into plot bounds
        overEl.appendChild(legendEl);

        // show/hide tooltip on enter/exit
        overEl.addEventListener("mouseenter", () => { legendEl.style.display = null; });
        overEl.addEventListener("mouseleave", () => { legendEl.style.display = "none"; });

        // let tooltip exit plot
        //	overEl.style.overflow = "visible";
    }

    function update(u) {
        const { left, top } = u.cursor;
        legendEl.style.transform = "translate(" + left + "px, " + top + "px)";
    }

    return {
        hooks: {
            init: init,
            setCursor: update,
        }
    };
}

// draws candlestick symbols (expects data in OHLC order)
export function candlestickPlugin({ gap = 2, shadowColor = "#000000", bearishColor = "#e54245", bullishColor = "#4ab650", bodyMaxWidth = 20, shadowWidth = 2, bodyOutline = 1 } = {}) {

    function drawCandles(u) {
        u.ctx.save();

        const offset = (shadowWidth % 2) / 2;

        u.ctx.translate(offset, offset);

        let [iMin, iMax] = u.series[0].idxs;

        let vol0AsY = u.valToPos(0, "vol", true);

        for (let i = iMin; i <= iMax; i++) {
            let xVal = u.scales.x.distr == 2 ? i : u.data[0][i];
            let open = u.data[1][i];
            let high = u.data[2][i];
            let low = u.data[3][i];
            let close = u.data[4][i];
            let vol = u.data[5][i];

            let timeAsX = u.valToPos(xVal, "x", true);
            let lowAsY = u.valToPos(low, "y", true);
            let highAsY = u.valToPos(high, "y", true);
            let openAsY = u.valToPos(open, "y", true);
            let closeAsY = u.valToPos(close, "y", true);
            let volAsY = u.valToPos(vol, "vol", true);


            // shadow rect
            let shadowHeight = Math.max(highAsY, lowAsY) - Math.min(highAsY, lowAsY);
            let shadowX = timeAsX - (shadowWidth / 2);
            let shadowY = Math.min(highAsY, lowAsY);

            u.ctx.fillStyle = shadowColor;
            u.ctx.fillRect(
                Math.round(shadowX),
                Math.round(shadowY),
                Math.round(shadowWidth),
                Math.round(shadowHeight),
            );

            // body rect
            let columnWidth = u.bbox.width / (iMax - iMin);
            let bodyWidth = Math.min(bodyMaxWidth, columnWidth - gap);
            let bodyHeight = Math.max(closeAsY, openAsY) - Math.min(closeAsY, openAsY);
            let bodyX = timeAsX - (bodyWidth / 2);
            let bodyY = Math.min(closeAsY, openAsY);
            let bodyColor = open > close ? bearishColor : bullishColor;

            u.ctx.fillStyle = shadowColor;
            u.ctx.fillRect(
                Math.round(bodyX),
                Math.round(bodyY),
                Math.round(bodyWidth),
                Math.round(bodyHeight),
            );

            u.ctx.fillStyle = bodyColor;
            u.ctx.fillRect(
                Math.round(bodyX + bodyOutline),
                Math.round(bodyY + bodyOutline),
                Math.round(bodyWidth - bodyOutline * 2),
                Math.round(bodyHeight - bodyOutline * 2),
            );

            // volume rect
            u.ctx.fillRect(
                Math.round(bodyX),
                Math.round(volAsY),
                Math.round(bodyWidth),
                Math.round(vol0AsY - volAsY),
            );
        }

        u.ctx.translate(-offset, -offset);

        u.ctx.restore();
    }

    return {
        opts: (u, opts) => {
            uPlot.assign(opts, {
                cursor: {
                    points: {
                        show: false,
                    }
                }
            });

            opts.series.forEach(series => {
                series.paths = () => null;
                series.points = { show: false };
            });
        },
        hooks: {
            draw: drawCandles,
        }
    };
}

/**
 * demos/cursor-tooltip.html
 */
export function tooltipPlugin(opts = {}) {
    let overlay: HTMLElement;
    let popperInstance: any;
    let uPlotInstance: any;

    // Create tooltip element
    overlay = document.createElement('div');
    overlay.className = 'uplot-tooltip';
    Object.assign(overlay.style, {
        position: 'absolute',
        display: 'none',
        background: 'rgba(0, 0, 0, 0.8)',
        color: 'white',
        padding: '4px 8px',
        borderRadius: '3px',
        fontSize: '12px',
        pointerEvents: 'none',
        zIndex: '1000'
    });
    document.body.appendChild(overlay);

    return {
        hooks: {
            init: (u) => {
                uPlotInstance = u;

                // Show/hide tooltip on mouse enter/leave
                u.over.addEventListener('mouseenter', () => {
                    overlay.style.display = 'block';
                });

                u.over.addEventListener('mouseleave', () => {
                    overlay.style.display = 'none';
                });
            },

            setCursor: (u) => {
                const { left, top, idx } = u.cursor;
                if (idx == null) return;

                // Update tooltip content
                const xVal = u.data[0][idx];
                const yVal = u.data[1][idx];
                overlay.textContent = `X: ${xVal}, Y: ${yVal}`;

                // Create a virtual anchor element at cursor position
                const virtualAnchor = {
                    getBoundingClientRect: () => {
                        const rect = u.over.getBoundingClientRect();
                        return {
                            width: 0,
                            height: 0,
                            top: rect.top + top,
                            right: rect.left + left,
                            bottom: rect.top + top,
                            left: rect.left + left,
                            x: rect.left + left,
                            y: rect.top + top
                        };
                    },
                    contextElement: u.over
                };

                // Initialize or update Popper
                if (!popperInstance) {
                    popperInstance = createPopper(virtualAnchor, overlay, {
                        placement: 'right-start',
                        modifiers: [
                            {
                                name: 'offset',
                                options: {
                                    offset: [20, 20]
                                }
                            },
                            {
                                name: 'preventOverflow',
                                options: {
                                    boundary: u.root
                                }
                            },
                            {
                                name: 'flip',
                                options: {
                                    boundary: u.root,
                                    padding: 10
                                }
                            }
                        ]
                    });
                } else {
                    popperInstance.state.elements.reference = virtualAnchor;
                    popperInstance.update();
                }
            },

            destroy: () => {
                if (popperInstance) {
                    popperInstance.destroy();
                }
                overlay.remove();
            }
        }
    };
}

/**
 * 
 */