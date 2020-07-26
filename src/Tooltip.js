import React from "react";
import MarkdownRender from "./MarkdownRender";
import ReactTooltip from "react-tooltip";

const Tooltip = ({ source, id }) => {
  return (
    <ReactTooltip place="bottom" effect="solid" id={id}>
      <MarkdownRender source={source} />
    </ReactTooltip>
  );
};

export default Tooltip;
