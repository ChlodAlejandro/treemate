import React from "react";
import FlowchartBuilderToolbox from "./FlowchartBuilderToolbox";
import FlowchartBuilderCanvas from "./FlowchartBuilderCanvas";

const DefaultFlowchartBuilderContext : {
    toolboxOpen: boolean
} = {
    toolboxOpen: true
};

type FlowchartBuilderContext = typeof DefaultFlowchartBuilderContext;

/**
 * The FlowchartBuilder is the primary window responsible for holding the
 * flowchart toolbox (side panel) and the flowchart canvas itself.
 */
export default class FlowchartBuilder extends React.Component<any, any> {

    /**
     * Context for the {@link FlowchartBuilder}.
     */
    static Context = React.createContext<FlowchartBuilderContext>(DefaultFlowchartBuilderContext);

    /**
     * Renders the flowchart builder.
     *
     * @returns The rendered builder.
     */
    render() : JSX.Element {
        return <FlowchartBuilder.Context.Provider value={DefaultFlowchartBuilderContext}>
            <FlowchartBuilderToolbox />
            <FlowchartBuilderCanvas />
        </FlowchartBuilder.Context.Provider>;
    }

}