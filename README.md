## About

It detects the user voice and renders a oscillating wave.
It provides the wave component and also the contexts which picks the data from.

### Instalation

`npm`

```sh
  npm install --save react-mic-waver
```

`yarn`

```sh
  yarn add react-mic-waver
```

### Example


#### Wrapper Element 
```tsx
...
import { 
  MediaStreamProvider, 
  InputAudioProvider, 
  AudioAnalyserProvider 
  } from "react-mic-wave"
...

  <MediaStreamProvider video={false} audio={true}>
    <InputAudioProvider>
      <AudioAnalyserProvider>
        <Component />
      </AudioAnalyserProvider>
    </InputAudioProvider>
  </MediaStreamProvider>
...
```

#### Component 

```tsx
...
import AudioVisualiser, { useMediaStream } from "react-mic-waver";
...

export const Component = () => {

  ...
  const { start } = useMediaStream();

  useEffect(() => {
    start();
  }, [])
  ...

  return (
    ...
      <div className="container">
        <AudioVisualiser/>
      </div>
    ...
  );
};

```

### Props

|   Props   |     Type      | Default |        Description         |
|:---------:|:-------------:|:-------:|:--------------------------:|
|   color   |    string     | "white" | color of the rendered wave |
|   width   | number/string | "auto"  |  width of the wave canvas  |
|  height   | number/string | "auto"  | height of the wave canvas  |
| lineWidth |    number     |    2    | width of the rendered wave |