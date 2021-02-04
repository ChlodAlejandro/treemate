import React from "react";

import "./style/flowchart_builder_canvas.css";
import FlowchartBlock from "./FlowchartBlock";

class FlowchartBuilderCanvasPositionHandler {

    dragging : boolean = false;
    scale : number = 1;
    previousMouseX: number = 0;
    previousMouseY: number = 0;
    currentX: number;
    currentY: number;

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

    updateLocation(newX? : number, newY? : number) : void {
        if (newX != null) this.currentX = newX;
        if (newY != null) this.currentY = newY;

        const canvasElement = this.canvas.canvasElement;

        canvasElement.style.top = `${this.currentY}px`;
        canvasElement.style.left = `${this.currentX}px`;

        canvasElement.setAttribute("data-x", `${-1 * this.currentX}`);
        canvasElement.setAttribute("data-y", `${-1 * this.currentY}`);
    }

    changeScale(scale : number) : void {
        const canvasElement = this.canvas.canvasElement;

        this.scale = scale;
        canvasElement.style.setProperty("--tm-fb-scale", `${scale}`);
    }

}

export const FlowchartBuilderCanvasContext = React.createContext<FlowchartBuilderCanvas>(null);

export default class FlowchartBuilderCanvas extends React.Component<any, {
    blocks: JSX.Element[]
}> {

    canvasContainerElement : HTMLElement;
    canvasElement : HTMLElement;
    positionHandler : FlowchartBuilderCanvasPositionHandler;

    constructor(props : Record<string, any>) {
        super(props);
        this.state = {
            blocks: [] // Load blocks from data.
        };
    }

    componentDidMount() : void {
        /* Canvas size is 50000px (check CSS) */
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
            blocks: [...this.state.blocks, <FlowchartBlock key={this.state.blocks.length}/>]
        });
    }

    render(): JSX.Element {
        return <FlowchartBuilderCanvasContext.Provider value={this}>
            <div id="tmFBCanvasContainer">
                <div id="tmFBCanvas">
                    { ...this.state.blocks }
                    <div style={{
                        backgroundColor: "blue",
                        width: "100px",
                        height: "100px",
                        position: "relative",
                        top: "10px",
                        left: "10px"
                    }} />
                </div>
            </div>
        </FlowchartBuilderCanvasContext.Provider>;
    }

    translateCoordinates(x : number, y : number) : { x: number, y: number } {
        return {
            x: (this.canvasElement.clientWidth / 2) + (Math.floor(x) * 100),
            y: (this.canvasElement.clientHeight / 2) + (Math.floor(y) * 100)
        };
    }

    translatePosition(x : number, y: number) : { x: number, y: number } {
        return {
            x: Math.floor(x / 100) - (this.canvasElement.clientWidth / 2 / 100),
            y: Math.floor(y / 100) - (this.canvasElement.clientHeight / 2 / 100)
        };
    }

}