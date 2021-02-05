import React, { Fragment } from "react";
import FlowchartBuilderCanvas, { FlowchartBuilderCanvasContext } from "./FlowchartBuilderCanvas";
import {
    BlockSide,
    TM_FB_BLOCK_DEFAULT_HEIGHT, TM_FB_BLOCK_DEFAULT_WIDTH,
    TM_FB_BLOCK_DEFAULT_X,
    TM_FB_BLOCK_DEFAULT_Y,
    TM_FB_CANVAS_UNIT
} from "../../Constants";
import FlowchartBlockPort, {FlowchartBlockPortProps} from "./FlowchartBlockPort";

type FlowchartBlockElement = HTMLElement & { FlowchartBlock : FlowchartBlock };

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

    /** @returns Whether or not the block is currently being dragged. */
    get dragging() : boolean {
        return this.block.state.dragging;
    }
    /** @param dragging Whether or not the block is currently being dragged. */
    set dragging(dragging : boolean) {
        this.block.setState({
            dragging: dragging
        });
    }
    /** @returns The flowchart block's transform class. */
    get transform() : FlowchartBlockTransform {
        return this.block.state.transform;
    }
    /** @returns The flowchart block's canvas. */
    get canvas(): FlowchartBuilderCanvas {
        return this.block.canvas;
    }

    /** The click's X position relative to the top-left corner of the block in units. */
    clickRelativeX : number;
    /** The click's Y position relative to the top-left corner of the block in units. */
    clickRelativeY : number;

    /**
     * Creates a new FlowchartBlockTransformHandler
     *
     * @param block The block to handle.
     */
    constructor(private block : FlowchartBlock) {
        const { element: blockElement } = block;

        blockElement.addEventListener("mousedown", (event) => {
            if (event.target === blockElement) {
                this.dragging = true;

                // Store starting click-relative values, or else the box's top-left corner
                // will jump to the mouse's position immediately.
                const blockRect = blockElement.getBoundingClientRect();
                this.clickRelativeX = Math.floor((event.clientX - blockRect.left) / 25);
                this.clickRelativeY = Math.floor((event.clientY - blockRect.top) / 25);
            }
        });
        blockElement.addEventListener("tm_fb_canvas:mouseup", () => {
            this.dragging = false;
            block.setState(block.state);
        });
        blockElement.addEventListener("tm_fb_canvas:mousemove", (event : MouseEvent) => {
            if (this.dragging) {
                const canvasRect = this.canvas.canvasElement.getBoundingClientRect();

                const mouseRelativeX = event.clientX - canvasRect.left;
                const mouseRelativeY = event.clientY - canvasRect.top;

                const mouseTargetPosition = this.canvas.translatePosition(mouseRelativeX, mouseRelativeY);
                const actualPosition = {
                    x: mouseTargetPosition.x - this.clickRelativeX,
                    y: mouseTargetPosition.y - this.clickRelativeY
                };

                if (actualPosition.x !== this.transform.x || actualPosition.y !== this.transform.y) {
                    this.updateLocation(
                        actualPosition.x,
                        actualPosition.y
                    );
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
export default class FlowchartBlock extends React.Component<
    Partial<Pick<FlowchartBlockTransform, "width" | "height" | "x" | "y">>,
    {
        transform: FlowchartBlockTransform;
        ports: FlowchartBlockPortProps[];
        dragging: boolean;
    }
> {

    /** The block tracking ID. Used exclusively for element tracking. */
    trackingId : number = Math.floor(Math.random() * 10000000);
    /** The canvas that this block is a part of. */
    canvas : FlowchartBuilderCanvas;
    /** The movement handler responsible for this block. */
    transformHandler : FlowchartBlockTransformHandler;
    /** The rendered block element. */
    element : FlowchartBlockElement;

    /** @returns The width of the block in pixels */
    get actualWidth() : number {
        return this.state.transform.width * TM_FB_CANVAS_UNIT;
    }
    /** @returns The height of the block in pixels */
    get actualHeight() : number {
        return this.state.transform.height * TM_FB_CANVAS_UNIT;
    }

    /**
     * Generates the default ports for a block (1 inlet at the top middle,
     * 1 outlet at the bottom middle).
     *
     * @param block The flowchart block to create ports for.
     * @returns The ports of the given block.
     */
    static generateDefaultPorts(block : FlowchartBlock) : FlowchartBlockPortProps[] {
        return [
            {
                block: block,
                direction: "in",
                side: BlockSide.Top,
                sidePosition: Math.floor(block.state.transform.width / 2),
                children: <Fragment>In</Fragment>
            },
            {
                block: block,
                direction: "out",
                side: BlockSide.Bottom,
                sidePosition: Math.floor(block.state.transform.width / 2),
                children: <Fragment>Out</Fragment>
            }
        ];
    }

    /**
     * Creates a new FlowchartBlock
     *
     * @param props JSX properties.
     */
    constructor(props : Partial<
        Pick<FlowchartBlockTransform, "width" | "height" | "x" | "y"> & {
            ports: FlowchartBlockPortProps[]
        }
    >) {
        super(props);

        this.state = {
            // TODO Load from data
            transform: new FlowchartBlockTransform({
                width: props.width ?? TM_FB_BLOCK_DEFAULT_WIDTH,
                height: props.height ?? TM_FB_BLOCK_DEFAULT_HEIGHT,
                x: props.x ?? TM_FB_BLOCK_DEFAULT_X,
                y: props.y ?? TM_FB_BLOCK_DEFAULT_Y
            }),
            ports: props.ports ?? [],
            dragging: false
        };

        this.state = {
            ...this.state,
            ports: FlowchartBlock.generateDefaultPorts(this)
        };
    }

    /**
     * Callback run whenever the FlowchartBlock is appended to the DOM.
     */
    componentDidMount() : void {
        this.element = document.querySelector(`#tmFBBlock__${this.trackingId}`);
        this.transformHandler = new FlowchartBlockTransformHandler(this);

        this.trackingId = null;
        this.element.removeAttribute("id");
        this.element.FlowchartBlock = this;
    }

    /**
     * Renders the flowchart block.
     *
     * @returns The rendered block.
     */
    render(): JSX.Element {
        return <FlowchartBuilderCanvasContext.Consumer>{
            context => {
                this.canvas = context;

                const { x: top, y: left } = context.translateCoordinates(
                    this.state.transform.x,
                    this.state.transform.y
                );

                return <div
                    id={this.trackingId && `tmFBBlock__${this.trackingId}`}
                    data-width={this.state.transform.width}
                    data-height={this.state.transform.height}
                    data-x={this.state.transform.x}
                    data-y={this.state.transform.y}
                    className="tm-fb-block"
                    style={{
                        width: this.state.transform.width * TM_FB_CANVAS_UNIT,
                        height: this.state.transform.height * TM_FB_CANVAS_UNIT,
                        top: `${top}px`,
                        left: `${left}px`,
                        cursor: (this.state.dragging) ? "move" : "initial"
                    }}
                >
                    {this.renderPorts()}
                    <div>{this.props.children}</div>
                </div>;
            }
        }</FlowchartBuilderCanvasContext.Consumer>;
    }

    /**
     * Renders the ports of the block.
     *
     * @returns A fragment containing position-absolute ports.
     */
    renderPorts() : JSX.Element {
        return <Fragment>
            {this.state.ports.map((portProps, index) => <FlowchartBlockPort
                key={index}
                direction={portProps.direction}
                side={portProps.side}
                sidePosition={portProps.sidePosition}
                block={portProps.block}
                color={portProps.color && portProps.color}
            >
                {portProps.children}
            </FlowchartBlockPort>)}
        </Fragment>;
    }

}