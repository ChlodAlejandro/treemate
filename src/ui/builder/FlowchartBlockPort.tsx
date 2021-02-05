import {Color} from "../../Verbosity";
import React from "react";
import FlowchartBlock from "./FlowchartBlock";
import {BlockSide, TM_FB_CANVAS_UNIT, TM_FB_PORT_SIZE} from "../../Constants";
import numToHex from "../../util/numToHex";

export type FlowchartBlockPortProps = Pick<FlowchartBlockPort,
    "direction" | "sidePosition" | "side" | "block"
> & Partial<Pick<FlowchartBlockPort,
    "color"
>> & {
    children: JSX.Element
};

/**
 * A FlowchartBlockPort represents a port on a {@link FlowchartBlock}.
 *
 * Ports are the connection points for connections. They can either be
 * inlets or outlets, and can either accept one or more connections.
 */
export default class FlowchartBlockPort extends React.Component<FlowchartBlockPortProps, any> {

    /** The direction of the port (`in` indicates that it accepts a connection, `out` for otherwise.) */
    direction: "in" | "out";
    /** The color of this port. */
    color: Color;
    /**
     * The position of this port along the side of the block. For the
     * left and right sides, this represents how "far down" the port is.
     * For top and bottom sides, this represents how much the port is to
     * the right.
     *
     * For a block of size 6 x 4 (which allows for 7 x 5 ports), the leftmost
     * position for the top and bottoms sides is `0`, and the rightmost
     * is `6`. The topmost position for the left and right sides is `0`,
     * and the bottommost position is `4`.
     */
    sidePosition: number;
    /** The side that this port belongs to. */
    side: BlockSide;
    /** The block that this port belongs to. */
    block: FlowchartBlock;

    /**
     * Creates a new FlowchartBlockPort
     *
     * @param props The properties to initialize the port with.
     */
    constructor(props : FlowchartBlockPortProps) {
        super(props);
        global.Object.assign(this, props);
    }

    /**
     * Renders the block port.
     *
     * @returns The rendered block port.
     */
    render() : JSX.Element {
        const { relativeX, relativeY } = this.calculatePosition();

        return <div
            className="tm-fb-port"
            style={{
                backgroundColor: this.color ? `#${numToHex(this.color)}` : undefined,
                width: `${TM_FB_PORT_SIZE}px`,
                height: `${TM_FB_PORT_SIZE}px`,
                top: `${relativeY}px`,
                left: `${relativeX}px`
            }}
        >
            {this.props.children}
        </div>;
    }

    /**
     * Calculates the absolute position of the port relative to the
     * block.
     *
     * @returns The position relative to the block in pixels.
     */
    calculatePosition() : { relativeX: number, relativeY: number } {
        let relativeX : number;
        let relativeY : number;

        if (this.side === BlockSide.Top) {
            relativeY = 0;
            relativeX = this.sidePosition * TM_FB_CANVAS_UNIT;
        } else if (this.side === BlockSide.Bottom) {
            relativeY = this.block.actualHeight;
            relativeX = this.sidePosition * TM_FB_CANVAS_UNIT;
        } else if (this.side === BlockSide.Left) {
            relativeX = 0;
            relativeY = this.sidePosition * TM_FB_CANVAS_UNIT;
        } else if (this.side === BlockSide.Right) {
            relativeX = this.block.actualWidth;
            relativeY = this.sidePosition * TM_FB_CANVAS_UNIT;
        }

        return {
            relativeX: relativeX,
            relativeY: relativeY
        };
    }

}