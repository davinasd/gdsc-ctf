import React from "react";
import {
  AboutWrapper,
  HighlightAlt,
  HighlightSpan,
} from "../styles/About.styled";

const About: React.FC = () => {
  return (
    <AboutWrapper data-testid="about">
      <p>
        To Login<HighlightSpan></HighlightSpan>!
      </p>
      <p>
       
      </p>
      <p>
       Enter login -u [username] -p [password] to login
      </p>
    </AboutWrapper>
  );
};

export default About;