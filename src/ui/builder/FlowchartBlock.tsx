import React from "react";
import FlowchartBuilderCanvas, { FlowchartBuilderCanvasContext } from "./FlowchartBuilderCanvas";

class FlowchartBlockTransform {

    private _width: number;
    private _height: number;
    private _x: number;
    private _y: number;

    get width() : number { return this._width; }
    get height() : number { return this._height; }
    get x() : number { return this._x; }
    get y() : number { return this._y; }

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

    setWidth(value : number) : FlowchartBlockTransform {
        this._width = value;
        return this;
    }

    setHeight(value : number) : FlowchartBlockTransform {
        this._height = value;
        return this;
    }

    setX(value : number) : FlowchartBlockTransform {
        this._x = value;
        return this;
    }

    setY(value : number) : FlowchartBlockTransform {
        this._y = value;
        return this;
    }

}

class FlowchartBlockMovementHandler {

    dragging : boolean = false;
    get transform() : FlowchartBlockTransform {
        return this.block.state.transform;
    }
    get canvas(): FlowchartBuilderCanvas {
        return this.block.canvas;
    }

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

export default class FlowchartBlock extends React.Component<any, {
    transform: FlowchartBlockTransform;
}> {

    trackingId : number;
    canvas : FlowchartBuilderCanvas;
    movementHandler : FlowchartBlockMovementHandler;
    element : HTMLElement;

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

    componentDidMount() : void {
        this.element = document.querySelector(`#tmFBBlock__${this.trackingId}`);
        this.movementHandler = new FlowchartBlockMovementHandler(this);
    }

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