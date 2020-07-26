import React from "react";
import MarkdownRender from "./MarkdownRender";
import ReactTooltip from "react-tooltip";

const Tooltip = ({ source, id }) => {
  return (
    <ReactTooltip
      place="bottom"
      effect="solid"
      delayHide={1000}
      id={id}
      //   id="principalAndInterest"
      getContent={() => {
        return null;
      }}
    >
      <MarkdownRender source={source} />
      {/* <MarkdownRender source="$\de=\frac c d$" /> */}
    </ReactTooltip>
  );
};

export default Tooltip;
