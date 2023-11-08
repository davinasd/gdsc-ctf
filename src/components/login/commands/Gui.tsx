import { useContext } from "react";
import _ from "lodash";
import { termContext } from "../Terminal";
import React from "react";

const Gui: React.FC = () => {
  const { history, rerender } = useContext(termContext);

  /* ===== get current command ===== */
  const currentCommand = _.split(history[0], " ");

  /* ===== check current command makes redirect ===== */
  if (rerender && currentCommand[0] === "gui") {
    window.open("gdsc", "_blank");
  }

  return <span></span>;
};

export default Gui;
