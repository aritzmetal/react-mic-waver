import React, { useEffect } from "react";
import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import Waver, { useMediaStream, MediaStreamProvider } from "../src/index";

type Props = Parameters<typeof Waver>[0];

describe("Masonry", () => {
  let wrapper: { baseElement: Element | Element[] };

  beforeEach(() => {
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: jest.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(), // Deprecated
        removeListener: jest.fn(), // Deprecated
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      })),
    });
  });

  const FunctionalComponent = (props: Partial<Props>) => {
    const { stream, start } = useMediaStream();

    useEffect(() => {
      start();
    }, []);

    return (
      <div className="App">
        <Waver {...props} stream={stream} />
      </div>
    );
  };

  const props: Partial<Props> = {};

  const mountWrapper = (extraProps?: Partial<Props>) => {
    if (extraProps) {
      wrapper = render(
        <MediaStreamProvider audio={true} video={false}>
          <FunctionalComponent {...props} {...extraProps} />
        </MediaStreamProvider>,
        {}
      );
    } else {
      wrapper = render(
        <MediaStreamProvider audio={true} video={false}>
          <FunctionalComponent {...props} />
        </MediaStreamProvider>
      );
    }
  };

  const mockConnect = jest.fn();
  const mockCreateMediaStreamSource = jest.fn();
  const mockcreateMediaElementSource = jest.fn(() => {
    return {
      connect: mockConnect,
    };
  });
  const mockgetByteFrequencyData = jest.fn();
  const mockcreateAnalyser = jest.fn(() => {
    return {
      connect: mockConnect,
      frequencyBinCount: [0, 1, 2],
      getByteFrequencyData: mockgetByteFrequencyData,
    };
  });
  const mockcreateOscillator = jest.fn(() => {
    return {
      channelCount: 2,
    };
  });
  const mockChannelSplitterConnect = jest.fn((n) => n);
  const mockcreateChannelSplitter = jest.fn(() => {
    return {
      connect: mockChannelSplitterConnect,
    };
  });
  const mockaudioContext = jest.fn(() => {
    return {
      createAnalyser: mockcreateAnalyser,
      createMediaElementSource: mockcreateMediaElementSource,
      createOscillator: mockcreateOscillator,
      createChannelSplitter: mockcreateChannelSplitter,
      createMediaStreamSource: mockCreateMediaStreamSource,
    };
  });

  beforeEach(() => {
    window.AudioContext = mockaudioContext as any;
  });

  test("Should render", async () => {
    const mockMediaDevices = {
      getUserMedia: jest
        .fn()
        .mockResolvedValueOnce({ getTracks: () => [{ stop: jest.fn() }] }),
    };
    Object.defineProperty(window.navigator, "mediaDevices", {
      writable: true,
      value: mockMediaDevices,
    });

    mountWrapper();

    await waitFor(() => {
      expect(mockCreateMediaStreamSource).toHaveBeenCalled();
    });

    expect(wrapper.baseElement).toMatchSnapshot("basic");
  });
});
