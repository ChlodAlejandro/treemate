import React from "react";
import FlowchartBuilder from "./FlowchartBuilder";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Divider from "@material-ui/core/Divider";
import Drawer from "@material-ui/core/Drawer";

/**
 * The FlowchartBuilderToolbox contains flowchart details and flowchart
 * blocks which can be edited or dragged onto the canvas (hopefully).
 */
export default class FlowchartBuilderToolbox extends React.Component<any, any> {

    /**
     * Renders the toolbox.
     *
     * @returns The rendered toolbox.
     */
    render() : JSX.Element {
        return <FlowchartBuilder.Context.Consumer>
            {
                context => <Drawer
                    variant="persistent"
                    anchor="right"
                    open={context.toolboxOpen}
                >
                {/*
                    <List>
                        {['Inbox', 'Starred', 'Send email', 'Drafts'].map((text, index) => (
                            <ListItem button key={text}>
                                <ListItemIcon>{index % 2 === 0 ? <InboxIcon /> : <MailIcon />}</ListItemIcon>
                                <ListItemText primary={text} />
                            </ListItem>
                        ))}
                    </List>
                    <Divider />
                    <List>
                        {['All mail', 'Trash', 'Spam'].map((text, index) => (
                            <ListItem button key={text}>
                                <ListItemIcon>{index % 2 === 0 ? <InboxIcon /> : <MailIcon />}</ListItemIcon>
                                <ListItemText primary={text} />
                            </ListItem>
                        ))}
                    </List>
                */}
                </Drawer>
            }
        </FlowchartBuilder.Context.Consumer>;
    }

}