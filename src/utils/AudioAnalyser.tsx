import { useEffect, useState } from "react";
import { useInputAudio } from "./InputAudio";

export const useAudioAnalyser = (stream: MediaStream | undefined) => {
  const [analyser, setAnalyser] = useState<AnalyserNode>();
  const { source } = useInputAudio(stream);

  useEffect(() => {
    if (source) {
      const analyserNode = source.context.createAnalyser();
      analyserNode.smoothingTimeConstant = 1;
      source.connect(analyserNode);
      setAnalyser(analyserNode);
    }
  }, [source]);

  useEffect(() => {
    if (analyser && source) {
      source.connect(analyser);
    }

    if (!source) {
      if (analyser) {
        analyser.disconnect();
        setAnalyser(undefined);
      }
    }

    return () => {
      if (analyser) {
        analyser.disconnect();
        setAnalyser(undefined);
      }
    };
  }, [analyser, source]);

  return analyser;
};

export default useAudioAnalyser;
