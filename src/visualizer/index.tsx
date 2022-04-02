import React, { createRef, useEffect } from "react"
import { useAudioAnalyser } from "../utils/AudioAnalyser"

export interface Props {
    color?: "black" | "white"
    width?: number | string
    height?: number | string
    lineWidth?: number
}

const AudioVisualiser = ({ width = "auto", height = "auto", color = "white", lineWidth = 2 }: Props): JSX.Element => {
    const canvasRef = createRef<HTMLCanvasElement>()
    const { analyser } = useAudioAnalyser()

    useEffect(() => {
        if (!analyser) {
            return
        }

        let raf: number

        const data = new Uint8Array(analyser.frequencyBinCount)

        const draw = () => {
            raf = requestAnimationFrame(draw)
            analyser.getByteTimeDomainData(data)
            const canvas = canvasRef.current
            if (canvas) {
                const { height, width } = canvas
                const context = canvas.getContext("2d")
                let x = 0
                const sliceWidth = (width * 0.25) / data.length

                if (context) {
                    context.lineWidth = lineWidth
                    context.strokeStyle = color === "white" ? "#fff" : "#000"
                    context.clearRect(0, 0, width, height)

                    context.beginPath()
                    context.moveTo(0, height / 2)
                    for (const item of data) {
                        const y = (item / 255.0) * height
                        context.lineTo(x, y)
                        x += sliceWidth
                    }
                    context.lineTo(x, height / 2)
                    context.stroke()
                }
            }
        }
        draw()

        return () => {
            cancelAnimationFrame(raf)
        }
    }, [canvasRef, analyser])

    return <React.Fragment>{analyser ? <canvas width={width} height={height} ref={canvasRef} /> : null}</React.Fragment>
}

export default AudioVisualiser
