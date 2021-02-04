import React from "react";
import FlowchartBuilderCanvas, { FlowchartBuilderCanvasContext } from "./FlowchartBuilderCanvas";

/**
 * The FlowchartBlockTransform handles the flowchart's transforms, i.e.
 * its width, height, flowchart X-coordinate, and flowchart Y-coordinate.
 */
class FlowchartBlockTransform {

    /** The width of the block. */
    private _width: number;
    /** The height of the block. */
    private _height: number;
    /** The flowchart X-coordinate of the block. */
    private _x: number;
    /** The flowchart Y-coordinate of the block. */
    private _y: number;

    /** @returns The width of the block. */
    get width() : number { return this._width; }
    /** @returns The height of the block. */
    get height() : number { return this._height; }
    /** @returns The flowchart X-coordinate of the block. */
    get x() : number { return this._x; }
    /** @returns The flowchart Y-coordinate of the block. */
    get y() : number { return this._y; }

    /**
     * Creates a new FlowchartBlock. This must be initialized with a width,
     * height, flowchart X-coordinate, and flowchart Y-coordinate.
     *
     * @param properties The initial values of the block.
     * @param properties.width The width of the block (in units).
     * @param properties.height The height of the block (in units).
     * @param properties.x The X-coordinate of the block within the canvas.
     * @param properties.y The Y-coordinate of the block within the canvas.
     */
    constructor(properties : {
        width: FlowchartBlockTransform["_width"],
        height: FlowchartBlockTransform["_height"],
        x: FlowchartBlockTransform["_x"],
        y: FlowchartBlockTransform["_y"]
    }) {
        global.Object.assign(this, {
            _width: properties.width,
            _height: properties.height,
            _x: properties.x,
            _y: properties.y
        });
    }

    /**
     * Set the width of the block. This function can be chained.
     *
     * @param value The new width in units.
     * @returns The modified FlowchartBlock.
     */
    setWidth(value : number) : FlowchartBlockTransform {
        this._width = value;
        return this;
    }

    /**
     * Set the height of the block. This function can be chained.
     *
     * @param value The new height in units.
     * @returns The modified FlowchartBlock.
     */
    setHeight(value : number) : FlowchartBlockTransform {
        this._height = value;
        return this;
    }

    /**
     * Set the X-coordinate of this block within the canvas.
     *
     * @param value The new X-coordinate of the block.
     * @returns The modified FlowchartBlock.
     */
    setX(value : number) : FlowchartBlockTransform {
        this._x = value;
        return this;
    }

    /**
     * Set the Y-coordinate of this block within the canvas.
     *
     * @param value The new Y-coordinate of the block.
     * @returns The modified FlowchartBlock.
     */
    setY(value : number) : FlowchartBlockTransform {
        this._y = value;
        return this;
    }

}

/**
 * Handles the {@link FlowchartBlock}'s movement and sizing.
 */
class FlowchartBlockTransformHandler {

    /** Whether or not the block is currently being dragged. */
    dragging : boolean = false;
    /** @returns The flowchart block's transform class. */
    get transform() : FlowchartBlockTransform {
        return this.block.state.transform;
    }
    /** @returns The flowchart block's canvas. */
    get canvas(): FlowchartBuilderCanvas {
        return this.block.canvas;
    }

    /**
     * Creates a new FlowchartBlockTransformHandler
     *
     * @param block The block to handle.
     */
    constructor(private block : FlowchartBlock) {
        const { element: blockElement } = block;

        blockElement.addEventListener("mousedown", (event) => {
            if (event.target === blockElement)
                this.dragging = true;
        });
        blockElement.addEventListener("tm_fb_canvas:mouseup", () => {
            this.dragging = false;
        });
        blockElement.addEventListener("tm_fb_canvas:mousemove", (event : MouseEvent) => {
            if (this.dragging) {
                const canvasRect = this.canvas.canvasElement.getBoundingClientRect();

                const mouseRelativeX = event.clientX - canvasRect.left;
                const mouseRelativeY = event.clientY - canvasRect.top;

                const actualPosition = this.canvas.translatePosition(mouseRelativeX, mouseRelativeY);

                if (actualPosition.x !== this.transform.x || actualPosition.y !== this.transform.y) {
                    this.updateLocation(actualPosition.x, actualPosition.y);
                }
            }
        });

    }

    /**
     * Updates the location of the block based on its transforms.
     *
     * @param newX The new X-coordinate of the block within the canvas.
     * @param newY The new Y-coordinate of the block within the canvas.
     */
    updateLocation(newX? : number, newY? : number) : void {
        if (newX != null || newY != null) {
            this.block.setState({
                transform: this.transform
                    .setX(newX ?? this.transform.x)
                    .setY(newY ?? this.transform.y)
            });
        }

        const blockElement = this.block.element;

        const {
            x: actualX,
            y: actualY
        } = this.canvas.translateCoordinates(
            this.transform.x,
            this.transform.y
        );

        blockElement.style.top = `${actualY}px`;
        blockElement.style.left = `${actualX}px`;

        blockElement.setAttribute("data-x", `${this.transform.x}`);
        blockElement.setAttribute("data-y", `${this.transform.y}`);
    }

}

/**
 * A FlowchartBlock is a block inside of the {@link FlowchartBuilderCanvas}. Together
 * with connections, they form the only components of a canvas.
 */
export default class FlowchartBlock extends React.Component<any, {
    transform: FlowchartBlockTransform;
}> {

    /** The block tracking ID. Used exclusively for element tracking. */
    trackingId : number;
    /** The canvas that this block is a part of. */
    canvas : FlowchartBuilderCanvas;
    /** The movement handler responsible for this block. */
    movementHandler : FlowchartBlockTransformHandler;
    /** The rendered block element. */
    element : HTMLElement;

    /**
     * Creates a new FlowchartBlock
     *
     * @param props JSX properties.
     */
    constructor(props : Record<string, any>) {
        super(props);
        this.state = {
            transform: new FlowchartBlockTransform({
                width: 1,
                height: 1,
                x: 0,
                y: 0
            })
        };
    }

    /**
     * Callback run whenever the FlowchartBlock is appended to the DOM.
     */
    componentDidMount() : void {
        this.element = document.querySelector(`#tmFBBlock__${this.trackingId}`);
        this.movementHandler = new FlowchartBlockTransformHandler(this);
    }

    /**
     * Renders the flowchart block.
     *
     * @returns The rendered block.
     */
    render(): JSX.Element {
        this.trackingId = Math.floor(Math.random() * 10000000);
        return <FlowchartBuilderCanvasContext.Consumer>{
            context => {
                this.canvas = context;

                const { x: top, y: left } = context.translateCoordinates(
                    this.state.transform.x,
                    this.state.transform.y
                );

                return <div
                    id={`tmFBBlock__${this.trackingId}`}
                    data-width={this.state.transform.width}
                    data-height={this.state.transform.height}
                    data-x={this.state.transform.x}
                    data-y={this.state.transform.y}
                    style={{
                        position: "relative",
                        width: this.state.transform.width * 100,
                        height: this.state.transform.height * 100,
                        top: `${top}px`,
                        left: `${left}px`,
                        backgroundColor: "red"
                    }}
                >
                    {this.props.children}
                </div>;
            }
        }</FlowchartBuilderCanvasContext.Consumer>;
    }

}