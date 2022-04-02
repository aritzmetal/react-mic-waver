import React, { createContext, useContext, useEffect, useState, useCallback } from "react"
import { useMediaStream } from "./MediaStream"

interface InputAudioContextValue {
    audioCtx: AudioContext | undefined
    source: AudioNode | undefined
}

const InputAudioContext = createContext<InputAudioContextValue>({
    audioCtx: undefined,
    source: undefined,
})

export const useInputAudio = (): InputAudioContextValue => useContext(InputAudioContext)

export interface Props {
    children: React.ReactNode
}

export const InputAudioProvider = ({ children }: Props): JSX.Element => {
    const [context, setContext] = useState<AudioContext>()
    const [source, setSource] = useState<MediaStreamAudioSourceNode>()
    const { stream } = useMediaStream()

    const stop = useCallback(async () => {
        try {
            if (context) {
                await context.close()
                setContext(undefined)
            }
            if (source) {
                source.disconnect()
                setSource(undefined)
            }
        } catch (error: any) {
            console.error(error.name, error.message)
        }
    }, [context, source])

    useEffect(() => {
        if (stream) {
            const audioCtx = new AudioContext()
            setSource(audioCtx.createMediaStreamSource(stream))
            setContext(audioCtx)
        }
    }, [stream])

    useEffect(() => {
        if (!stream) {
            stop()
        }

        return () => {
            stop()
        }
    }, [stream, stop])

    return <InputAudioContext.Provider value={{ audioCtx: context, source }}>{children}</InputAudioContext.Provider>
}

export default InputAudioProvider
