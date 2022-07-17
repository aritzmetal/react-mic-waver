import React, { useEffect, useState, useCallback } from "react";
import { useMediaStream } from "./MediaStream";

export const useInputAudio = () => {
  const [context, setContext] = useState<AudioContext>();
  const [source, setSource] = useState<MediaStreamAudioSourceNode>();
  const { stream } = useMediaStream();

  const stop = useCallback(async () => {
    try {
      if (context) {
        await context.close();
        setContext(undefined);
      }
      if (source) {
        source.disconnect();
        setSource(undefined);
      }
    } catch (error: any) {
      console.error(error.name, error.message);
    }
  }, [context, source]);

  useEffect(() => {
    if (stream) {
      const audioCtx = new AudioContext();
      setSource(audioCtx.createMediaStreamSource(stream));
      setContext(audioCtx);
    }
  }, [stream]);

  useEffect(() => {
    if (!stream) {
      stop();
    }

    return () => {
      stop();
    };
  }, [stream, stop]);

  return { audioCtx: context, source };
};

export default useInputAudio;
