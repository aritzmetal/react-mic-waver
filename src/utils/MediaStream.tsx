import React, { createContext, useCallback, useContext, useState, useEffect } from "react"

interface MediaStreamContextValue {
    stream: MediaStream | undefined
    start: () => void
    stop: () => void
}

const MediaStreamContext = createContext<MediaStreamContextValue>({
    stream: undefined,
    start: () => undefined,
    stop: () => undefined,
})

export const useMediaStream = (): MediaStreamContextValue => useContext(MediaStreamContext)

export interface Props {
    audio: boolean
    video: boolean
    children: React.ReactNode | JSX.Element
}
export const MediaStreamProvider = ({ children, audio, video }: Props): JSX.Element => {
    const [stream, setStream] = useState<MediaStream>()

    useEffect(() => {
        return () => {
            if (stream) {
                stream.getTracks().forEach((track) => track.stop())
            }
        }
    }, [stream])

    const start = useCallback(async () => {
        const mediaStream = await navigator.mediaDevices.getUserMedia({ audio, video })
        setStream(mediaStream)
    }, [audio, video])

    const stop = useCallback(() => {
        if (stream) {
            stream.getTracks().forEach((track) => track.stop())
            setStream(undefined)
        }
    }, [stream])

    return <MediaStreamContext.Provider value={{ stream, start, stop }}>{children}</MediaStreamContext.Provider>
}

export default MediaStreamProvider
