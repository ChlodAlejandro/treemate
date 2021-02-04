import React from "react";
import FlowchartBuilderToolbox from "./FlowchartBuilderToolbox";
import FlowchartBuilderCanvas from "./FlowchartBuilderCanvas";

const DefaultFlowchartBuilderContext : {
    toolboxOpen: boolean
} = {
    toolboxOpen: true
};

type FlowchartBuilderContext = typeof DefaultFlowchartBuilderContext;

export default class FlowchartBuilder extends React.Component<any, any> {

    static Context = React.createContext<FlowchartBuilderContext>(DefaultFlowchartBuilderContext);

    render() : JSX.Element {
        return <FlowchartBuilder.Context.Provider value={DefaultFlowchartBuilderContext}>
            <FlowchartBuilderToolbox />
            <FlowchartBuilderCanvas />
        </FlowchartBuilder.Context.Provider>;
    }

}