import React from "react";
import ReactDOM from "react-dom";
import FlowchartBuilder from "./builder/FlowchartBuilder";

/**
 * The primary app window. This is the highest-level React element
 * which gets appended to the DOM on initialization.
 */
export default class AppWindow extends React.Component<any, any> {

    /**
     * Attach an AppWindow to the DOM's app host (i.e. "the place where the magic happens")
     */
    static attach() : void {
        ReactDOM.render(<AppWindow/>, document.getElementById("tmAppHost"));
    }

    /**
     * Renders the app window.
     *
     * @returns The rendered app window.
     */
    render() : JSX.Element {
        return <FlowchartBuilder />;
    }

}