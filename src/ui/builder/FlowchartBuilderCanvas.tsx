import React from "react";

import "./style/flowchart_builder_canvas.css";
import FlowchartBlock from "./FlowchartBlock";
import {TM_FB_CANVAS_HEIGHT, TM_FB_CANVAS_UNIT, TM_FB_CANVAS_WIDTH} from "../../Constants";

/**
 * The handler for the canvas position. This class is responsible for
 * handling dragging within the canvas and scaling of the canvas.
 */
class FlowchartBuilderCanvasPositionHandler {

    /** Whether or not the canvas is currently being dragged. */
    dragging : boolean = false;
    /** The scale of the canvas. */
    scale : number = 1;
    /** The previous X position of the mouse. This is used for mouse movement tracking. */
    previousMouseX: number = 0;
    /** The previous Y position of the mouse. This is used for mouse movement tracking. */
    previousMouseY: number = 0;
    /** The current X of the canvas (i.e. CSS `left` value, indicating displacement). */
    currentX: number;
    /** The current Y of the canvas (i.e. CSS `top` value, indicating displacement). */
    currentY: number;

    /**
     * Creates a new FlowchartBuilderCanvasPositionHandler.
     *
     * @param canvas The source {@link FlowchartBuilderCanvas}.
     */
    constructor(private canvas : FlowchartBuilderCanvas) {

        const { canvasElement } = canvas;

        this.currentX = 0;
        this.currentY = 0;

        canvasElement.addEventListener("mousedown", (event : MouseEvent) => {
            if (event.target === canvasElement) {
                this.dragging = true;
                this.previousMouseX = event.clientX;
                this.previousMouseY = event.clientY;
            }
        });
        canvasElement.addEventListener("mouseup", (event) => {
            this.dragging = false;

            canvasElement.childNodes.forEach(async (child) => {
                child.dispatchEvent(new MouseEvent("tm_fb_canvas:mouseup", event));
            });
        });
        canvasElement.addEventListener("mousemove", (event : MouseEvent) => {
            if (this.dragging) {
                const deltaX = event.clientX - this.previousMouseX;
                const deltaY = event.clientY - this.previousMouseY;

                if (deltaY > window.innerHeight * 2 || deltaX > window.innerWidth * 2)
                    // Two screens in a split-tick is not normal. Block.
                    return;

                this.currentX += deltaX;
                this.currentY += deltaY;

                this.updateLocation();

                this.previousMouseX = event.clientX;
                this.previousMouseY = event.clientY;
            }

            canvasElement.childNodes.forEach(async (child) => {
                child.dispatchEvent(new MouseEvent("tm_fb_canvas:mousemove", event));
            });
        });

        this.updateLocation();
    }

    /**
     * Updates the location of the canvas. This also modifies meta-attributes.
     *
     * @param newX The new X-position of the canvas (in pixels).
     * @param newY The new Y-position of the canvas (in pixels).
     */
    updateLocation(newX? : number, newY? : number) : void {
        if (newX != null) this.currentX = newX;
        if (newY != null) this.currentY = newY;

        const canvasElement = this.canvas.canvasElement;

        canvasElement.style.top = `${this.currentY}px`;
        canvasElement.style.left = `${this.currentX}px`;

        canvasElement.setAttribute("data-x", `${-1 * this.currentX}`);
        canvasElement.setAttribute("data-y", `${-1 * this.currentY}`);
    }

    /**
     * Changes the scale of the canvas.
     *
     * @param scale The new scale of the canvas.
     */
    changeScale(scale : number) : void {
        const canvasElement = this.canvas.canvasElement;

        this.scale = scale;
        canvasElement.style.setProperty("--tm-fb-scale", `${scale}`);
    }

}

export const FlowchartBuilderCanvasContext = React.createContext<FlowchartBuilderCanvas>(null);

/**
 * The FlowchartBuilderCanvas holds every single flowchart block and connection.
 * It consists of a container which takes up the size of the viewport and the
 * actual canvas which is set to a high value (usually 50,000 pixels wide and high).
 *
 * The builder canvas is moved by changing the relative position of the
 * actual canvas, thus creating the illusion of movement. In reality, the canvas
 * is displaced using CSS. This allows the canvas to be "scrollable" without making
 * the container element a scrollable container.
 */
export default class FlowchartBuilderCanvas extends React.Component<any, {
    blocks: JSX.Element[]
}> {

    /** The container element of the canvas. */
    canvasContainerElement : HTMLElement;
    /** The actual canvas element. */
    canvasElement : HTMLElement;
    /** The handler for the canvas position. */
    positionHandler : FlowchartBuilderCanvasPositionHandler;

    /**
     * Creates a new FlowchartBuilderCanvas
     *
     * @param props JSX properties.
     */
    constructor(props : Record<string, any>) {
        super(props);
        this.state = {
            blocks: [] // Load blocks from data.
        };
    }

    /**
     * Callback run whenever the FlowchartBuilderCanvas is appended to the DOM.
     */
    componentDidMount() : void {
        this.canvasContainerElement = document.querySelector("#tmFBCanvasContainer");
        this.canvasElement = document.querySelector("#tmFBCanvas");
        this.positionHandler = new FlowchartBuilderCanvasPositionHandler(this);

        this.canvasContainerElement.addEventListener("click", (event) => {
            if (event.target === this.canvasContainerElement) {
                if (confirm("You seem to have clicked out of bounds. Return?")) {
                    this.positionHandler.updateLocation(0, 0);
                }
            }
        });

        this.setState({
            blocks: [
                ...this.state.blocks,
                <FlowchartBlock key={this.state.blocks.length}/>,
                <FlowchartBlock
                    key={this.state.blocks.length + 1}
                    width={12}
                    x={6}
                    y={11}
                />
            ]
        });
    }

    /**
     * Renders the flowchart builder.
     *
     * @returns The rendered builder.
     */
    render(): JSX.Element {
        return <FlowchartBuilderCanvasContext.Provider value={this}>
            <div id="tmFBCanvasContainer">
                <div
                    id="tmFBCanvas"
                    style={{
                        width: TM_FB_CANVAS_WIDTH,
                        height: TM_FB_CANVAS_HEIGHT
                    }}
                >
                    { ...this.state.blocks }
                </div>
            </div>
        </FlowchartBuilderCanvasContext.Provider>;
    }

    /**
     * Converts flowchart coordinates into relative coordinates.
     *
     * For a given canvas of size 50,000 pixels for both width and
     * height, the coordinate limit is +-250.
     *
     * The returned value can be used in the `top` and `left` CSS values.
     *
     * @param x The x-coordinate in the canvas.
     * @param y The y-coordinate in the canvas.
     * @returns The coordinates relative to the element's top-left corner in pixels.
     */
    translateCoordinates(x : number, y : number) : { x: number, y: number } {
        return {
            x: (this.canvasElement.clientWidth / 2) + (Math.floor(x) * TM_FB_CANVAS_UNIT),
            y: (this.canvasElement.clientHeight / 2) + (Math.floor(y) * TM_FB_CANVAS_UNIT)
        };
    }


    /**
     * Converts relative coordinates into flowchart coordinates.
     *
     * For a given canvas of size 500 units for both width and height, this value
     * goes from 0 to 50,000 (with 25,000 being the center).
     *
     * The returned value can be used in data serialization and {@link FlowchartBlock} transforms.
     *
     * @param x The x-coordinate in the canvas.
     * @param y The y-coordinate in the canvas.
     * @returns The flowchart coordinates of the given relative coordinates.
     */
    translatePosition(x : number, y: number) : { x: number, y: number } {
        return {
            x: Math.floor(x / TM_FB_CANVAS_UNIT) - (this.canvasElement.clientWidth / 2 / TM_FB_CANVAS_UNIT),
            y: Math.floor(y / TM_FB_CANVAS_UNIT) - (this.canvasElement.clientHeight / 2 / TM_FB_CANVAS_UNIT)
        };
    }

}