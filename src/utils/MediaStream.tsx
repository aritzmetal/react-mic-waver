import React from "react";

interface MediaStreamContextValue {
  stream: MediaStream | undefined;
  start: () => void;
  stop: () => void;
}

const MediaStreamContext = React.createContext<MediaStreamContextValue>({
  stream: undefined,
  start: () => undefined,
  stop: () => undefined,
});

export const useMediaStream = (): MediaStreamContextValue =>
  React.useContext(MediaStreamContext);

export interface MediaStreamProps {
  audio: boolean;
  video: boolean;
  children?: React.ReactNode | JSX.Element;
}

export const MediaStreamProvider = ({
  audio,
  video,
  children,
}: MediaStreamProps): JSX.Element => {
  const [stream, setStream] = React.useState<MediaStream>();

  React.useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [stream]);

  const start = React.useCallback(async () => {
    const mediaStream = await navigator.mediaDevices.getUserMedia({
      audio,
      video,
    });
    setStream(mediaStream);
  }, [audio, video]);

  const stop = React.useCallback(() => {
    if (stream) {
      stream.getTracks().forEach((track) => track && track.stop());
      setStream(undefined);
    }
  }, [stream]);

  return (
    <MediaStreamContext.Provider value={{ stream, start, stop }}>
      {children}
    </MediaStreamContext.Provider>
  );
};

export default MediaStreamProvider;
