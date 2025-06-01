/* eslint-disable */
import uPlot, { Options, AlignedData } from "uplot"

interface TooltipPluginOptions {
    cursorMemo?: {
        set: (left: number, top: number) => void
        get: () => { left: number; top: number }
    }
}

export function tooltipPlugin(opts: TooltipPluginOptions = {}) {
    let cursortt: HTMLDivElement
    let seriestt: (HTMLDivElement | undefined)[]

    function init(self: uPlot, opts: Options, data: AlignedData) {
        const over = self.over

        // Create cursor tooltip
        const tt = (cursortt = document.createElement("div"))
        tt.className = "uplot-tooltip"
        tt.style.cssText = `
      pointer-events: none;
      position: absolute;
      background: rgba(0,0,0,0.7);
      color: white;
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 12px;
      z-index: 100;
    `
        over.appendChild(tt)

        // Create series tooltips
        seriestt = opts.series.map((s, i) => {
            if (i === 0) return

            const tt = document.createElement("div")
            tt.className = "uplot-series-tooltip"
            tt.style.cssText = `
        pointer-events: none;
        position: absolute;
        background: rgba(0,0,0,0.7);
        color: ${s.stroke || "white"};
        padding: 4px 8px;
        border-radius: 4px;
        font-size: 12px;
        z-index: 100;
      `
            over.appendChild(tt)
            return tt
        })

        function hideTips() {
            cursortt.style.display = "none"
            seriestt.forEach((tt, i) => {
                if (i === 0 || !tt) return
                tt.style.display = "none"
            })
        }

        function showTips() {
            cursortt.style.display = ""
            seriestt.forEach((tt, i) => {
                if (i === 0 || !tt) return
                const s = self.series[i]
                tt.style.display = s.show ? "" : "none"
            })
        }

        over.addEventListener("mouseleave", () => {
            if (!self.cursor.lock) {
                hideTips()
            }
        })

        over.addEventListener("mouseenter", () => {
            showTips()
        })

        if (self.cursor.left && self.cursor.left < 0) {
            hideTips()
        } else {
            showTips()
        }
    }

    function setCursor(self: uPlot) {
        const { left, top, idx } = self.cursor

        if (left !== undefined && top !== undefined) {
            opts?.cursorMemo?.set(left, top)
        }

        if (left === undefined || top === undefined || idx === undefined || idx === null) return

        // Update cursor tooltip
        cursortt.style.left = left + "px"
        cursortt.style.top = top + "px"
        cursortt.textContent = `(${self.posToVal(left, "x").toFixed(2)}, ${self.posToVal(top, "y").toFixed(2)})`

        // Update series tooltips
        const tooltipHeight = 30 // Approximate height of each tooltip
        const tooltipMargin = 5 // Margin between tooltips
        let lastTop = top // Start from cursor position

        seriestt.forEach((tt, i) => {
            if (i === 0 || !tt) return

            const s = self.series[i]
            if (s.show && idx >= 0) {
                const xVal = self.data[0][idx]
                const yVal = self.data[i][idx]

                if (xVal === undefined || xVal === null || yVal === undefined || yVal === null) return

                tt.textContent = `${s.label || `Series ${i}`}: ${yVal.toFixed(2)}`

                // Calculate vertical position to stack tooltips
                const yPos = Math.round(self.valToPos(yVal, s.scale || "y"))
                const xPos = Math.round(self.valToPos(xVal, "x"))

                // Position tooltip to the right of the cursor
                tt.style.left = xPos + 10 + "px"

                // Stack tooltips vertically, starting from cursor position
                tt.style.top = lastTop + "px"
                lastTop += tooltipHeight + tooltipMargin

                // Show tooltip
                tt.style.display = "block"
            } else {
                // Hide tooltip if series is not shown
                tt.style.display = "none"
            }
        })
    }

    return {
        hooks: {
            init,
            setCursor,
        },
    }
}
