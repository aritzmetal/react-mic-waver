## About

It detects the user voice and renders a oscillating wave.
It provides the wave component and also a simple MediaStream context for simple usage.

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

The `MediaStreamProvider` and also the `useMediaStream` hook come with the `AudioVisualiser` default export as a little controller that works out of the box if you don't need a complex custom implementation of the stream context. The stream generated is passed as a parameter to the `AudioVisualiser` component to generate the analyzer over it and render the wave.

#### Wrapper Element 
```tsx
...
import { 
  MediaStreamProvider, 
  } from "react-mic-waver"
...

  <MediaStreamProvider video={false} audio={true}>
        <Component />
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
  const { stream, start, stop } = useMediaStream();

  const toggleMic = () => stream ? stop() : start()

  ...

  return (
    ...
      <div style={{width: "300px", height: "200px", background: "#fff"}}>
       <button className="App-btn" onClick={toggleMic}>
          {stream ? 'Close Microphone' : "Open Microphone"}
        </button>
        <AudioVisualiser stream={stream} onRender={() => console.log("Render!")} style={{background: "red"}}/>
      </div>
    ...
  );
};

```

### Props

|   Props   |     Type      | Default |                  Description                   |
|:---------:|:-------------:|:-------:|:----------------------------------------------:|
|  stream   |  MediaStream  |    -    |               stream to analyze                |
|   color   |    string     | "black" |           color of the rendered wave           |
|   width   | number/string | "auto"  |            width of the wave canvas            |
|  height   | number/string | "auto"  |           height of the wave canvas            |
| lineWidth |    number     |    2    |           width of the rendered wave           |
| onRender  |  () => void   |    -    |   callback that fires when wave is rendered    |
|   style   | CSSProperties |    -    | extra styles applied to the canvas of the wave |