import React from "react";
import { User, WebsiteName, Wrapper } from "./styles/TerminalInfo.styled";

const TermInfo = () => {
  return (
    <Wrapper>
      <User>visitor</User>@<WebsiteName>terminal.gdsc.dev</WebsiteName>:~$
    </Wrapper>
  );
};

export default TermInfo;
