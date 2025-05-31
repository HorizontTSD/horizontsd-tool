import uPlot from "uplot"

interface WheelZoomPluginOptions {
    factor?: number
}

export function wheelZoomPlugin(opts: WheelZoomPluginOptions = {}) {
    const factor = opts.factor || 0.75
    let xMin: number, xMax: number, yMin: number, yMax: number, xRange: number, yRange: number

    function clamp(nRange: number, nMin: number, nMax: number, fRange: number, fMin: number, fMax: number) {
        if (nRange > fRange) {
            nMin = fMin
            nMax = fMax
        } else if (nMin < fMin) {
            nMin = fMin
            nMax = fMin + nRange
        } else if (nMax > fMax) {
            nMax = fMax
            nMin = fMax - nRange
        }

        return [nMin, nMax]
    }

    return {
        hooks: {
            ready: (self: uPlot) => {
                xMin = self.scales.x.min!
                xMax = self.scales.x.max!
                yMin = self.scales.y.min!
                yMax = self.scales.y.max!

                xRange = xMax - xMin
                yRange = yMax - yMin

                const over = self.over
                const rect = over.getBoundingClientRect()

                // wheel drag pan
                over.addEventListener("mousedown", (e: MouseEvent) => {
                    if (e.button === 1) {
                        // middle mouse button
                        e.preventDefault()

                        const left0 = e.clientX
                        const scXMin0 = self.scales.x.min!
                        const scXMax0 = self.scales.x.max!
                        const xUnitsPerPx = self.posToVal(1, "x") - self.posToVal(0, "x")

                        function onmove(e: MouseEvent) {
                            e.preventDefault()
                            const left1 = e.clientX
                            const dx = xUnitsPerPx * (left1 - left0)

                            self.setScale("x", {
                                min: scXMin0 - dx,
                                max: scXMax0 - dx,
                            })
                        }

                        function onup() {
                            document.removeEventListener("mousemove", onmove)
                            document.removeEventListener("mouseup", onup)
                        }

                        document.addEventListener("mousemove", onmove)
                        document.addEventListener("mouseup", onup)
                    }
                })

                // wheel scroll zoom
                over.addEventListener("wheel", (e: WheelEvent) => {
                    e.preventDefault()

                    const { left, top } = self.cursor
                    if (left === undefined || top === undefined) return

                    const leftPct = left / rect.width
                    const btmPct = 1 - top / rect.height
                    const xVal = self.posToVal(left, "x")
                    const yVal = self.posToVal(top, "y")
                    const oxRange = self.scales.x.max! - self.scales.x.min!
                    const oyRange = self.scales.y.max! - self.scales.y.min!

                    const nxRange = e.deltaY < 0 ? oxRange * factor : oxRange / factor
                    let nxMin = xVal - leftPct * nxRange
                    let nxMax = nxMin + nxRange
                    ;[nxMin, nxMax] = clamp(nxRange, nxMin, nxMax, xRange, xMin, xMax)

                    const nyRange = e.deltaY < 0 ? oyRange * factor : oyRange / factor
                    let nyMin = yVal - btmPct * nyRange
                    let nyMax = nyMin + nyRange
                    ;[nyMin, nyMax] = clamp(nyRange, nyMin, nyMax, yRange, yMin, yMax)

                    self.batch(() => {
                        self.setScale("x", {
                            min: nxMin,
                            max: nxMax,
                        })

                        self.setScale("y", {
                            min: nyMin,
                            max: nyMax,
                        })
                    })
                })
            },
        },
    }
}
