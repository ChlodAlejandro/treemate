import React from "react";
import ReactDOM from "react-dom";
import FlowchartBuilder from "./builder/FlowchartBuilder";

export default class AppWindow extends React.Component<any, any> {

    static attach() : void {
        ReactDOM.render(<AppWindow/>, document.getElementById("tmAppHost"));
    }

    render() : JSX.Element {
        return <FlowchartBuilder />;
    }

}