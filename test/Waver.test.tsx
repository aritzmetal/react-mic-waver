import React, { useEffect } from "react"
import { render, screen } from "@testing-library/react"
import "@testing-library/jest-dom"
import Waver, { useMediaStream } from "../src/index"

type Props = Parameters<typeof Waver>[0]

describe("Masonry", () => {
    let wrapper: { baseElement: Element | Element[] }

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
        })
    })

    const FunctionalComponent = (props: Props) => {
        const { start } = useMediaStream()

        useEffect(() => {
            start()
        }, [])

        return (
            <div className="App">
                <Waver {...props} />
            </div>
        )
    }

    const props: Props = {}

    const mountWrapper = (extraProps?: Partial<Props>) => {
        if (extraProps) {
            wrapper = render(<FunctionalComponent {...props} {...extraProps} />, {})
        } else {
            wrapper = render(<FunctionalComponent {...props} />)
        }
    }
    test("Should render", () => {
        mountWrapper()
    })
})
