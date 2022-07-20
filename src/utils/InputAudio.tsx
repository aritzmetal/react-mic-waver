import { useEffect, useState, useCallback } from "react";

export const useInputAudio = (stream: MediaStream | undefined) => {
  const [context, setContext] = useState<AudioContext | undefined>();
  const [source, setSource] = useState<
    MediaStreamAudioSourceNode | undefined
  >();

  const stop = useCallback(async () => {
    if (context && context.state !== "closed") {
      await context.close();
      setContext(undefined);
    }

    if (source) {
      source.disconnect();
      setSource(undefined);
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
  }, [stream, stop]);

  return { audioCtx: context, source };
};

export default useInputAudio;
