import React, {
  createContext,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import _ from "lodash";
import Output from "./Output";
import TermInfo from "./TermInfo";
import {
  CmdNotFound,
  Empty,
  Form,
  Hints,
  Input,
  MobileBr,
  MobileSpan,
  Wrapper,
} from "./styles/Terminal.styled";
import { argTab } from "./utils/funcs";

type Command = {
  cmd: string;
  desc: string;
  tab: number;
}[];
import { useDispatch } from "react-redux";
import { authActions } from "../../store/auth-slice";
import { useNavigate } from "react-router-dom"; 
export const commands: Command = [
  { cmd: "about", desc: "about ", tab: 8 },
  { cmd: "clear", desc: "clear the terminal", tab: 8 },
  { cmd: "echo", desc: "print out anything", tab: 9 },
  { cmd: "email", desc: "send an email to me", tab: 8 },
  { cmd: "gui", desc: "go to my portfolio in GUI", tab: 10 },
  { cmd: "help", desc: "check available commands", tab: 9 },
  { cmd: "pwd", desc: "print current working directory", tab: 10 },
  { cmd: "socials", desc: "check out my social accounts", tab: 6 },
  { cmd: "themes", desc: "check available themes", tab: 7 },
  { cmd: "welcome", desc: "display hero section", tab: 6 },
  { cmd: "whoami", desc: "about current user", tab: 7 },
  { cmd: "login", desc: "login", tab: 7 },

];

type Term = {
  arg: string[];
  history: string[];
  rerender: boolean;
  index: number;
  clearHistory?: () => void;
};

export const termContext = createContext<Term>({
  arg: [],
  history: [],
  rerender: false,
  index: 0,
});


const Terminal = () => {

  const handleLoginCommand = async (input: string) => {
    // Regular expression to match the login command format
    const loginRegex = /^login -u (\S+) -p (\S+)$/;
    const match = input.match(loginRegex);
  
    if (match) {
      const [, emailAddress, password] = match;
      const payload = { emailAddress, password };
  
      try {
        const response = await fetch('https://bci0y87s7k.execute-api.ap-south-1.amazonaws.com/api/admin/login', { 
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });
  
        if (!response.ok) {
          const data = await response.json();
          alert(data.message)
          throw new Error(`HTTP error! status: ${response.status}`);
        }
  
        const data = await response.json();
        dispatch(authActions.login({ team_id: data.team_id }));
        navigate("/user"); // Navigate to /user on successful login
        console.log('Login successful:', data);
      } catch (error) {
        console.error('Error during login:', error);
      }
    }
  };
  const dispatch = useDispatch();
  const navigate = useNavigate(); 
  const containerRef = useRef(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [inputVal, setInputVal] = useState("");
  const [cmdHistory, setCmdHistory] = useState<string[]>(["welcome"]);
  const [rerender, setRerender] = useState(false);
  const [hints, setHints] = useState<string[]>([]);
  const [pointer, setPointer] = useState(-1);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setRerender(false);
      setInputVal(e.target.value);
      

    },
    [inputVal]
  );

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setCmdHistory([inputVal, ...cmdHistory]);
    setInputVal("");
    setRerender(true);
    setHints([]);
    setPointer(-1);
    handleLoginCommand(inputVal);

  };

  const clearHistory = () => {
    setCmdHistory([]);
    setHints([]);
  };

  // focus on input when terminal is clicked
  const handleDivClick = () => {
    inputRef.current && inputRef.current.focus();
  };
  useEffect(() => {
    document.addEventListener("click", handleDivClick);
    return () => {
      document.removeEventListener("click", handleDivClick);
    };
  }, [containerRef]);

  // Keyboard Press
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    setRerender(false);
    const ctrlI = e.ctrlKey && e.key.toLowerCase() === "i";
    const ctrlL = e.ctrlKey && e.key.toLowerCase() === "l";

    // if Tab or Ctrl + I
    if (e.key === "Tab" || ctrlI) {
      e.preventDefault();
      if (!inputVal) return;

      let hintsCmds: string[] = [];
      commands.forEach(({ cmd }) => {
        if (_.startsWith(cmd, inputVal)) {
          hintsCmds = [...hintsCmds, cmd];
        }
      });

      const returnedHints = argTab(inputVal, setInputVal, setHints, hintsCmds);
      hintsCmds = returnedHints ? [...hintsCmds, ...returnedHints] : hintsCmds;

      // if there are many command to autocomplete
      if (hintsCmds.length > 1) {
        setHints(hintsCmds);
      }
      // if only one command to autocomplete
      else if (hintsCmds.length === 1) {
        const currentCmd = _.split(inputVal, " ");
        setInputVal(
          currentCmd.length !== 1
            ? `${currentCmd[0]} ${currentCmd[1]} ${hintsCmds[0]}`
            : hintsCmds[0]
        );

        setHints([]);
      }
    }

    // if Ctrl + L
    if (ctrlL) {
      clearHistory();
    }

    // Go previous cmd
    if (e.key === "ArrowUp") {
      if (pointer >= cmdHistory.length) return;

      if (pointer + 1 === cmdHistory.length) return;

      setInputVal(cmdHistory[pointer + 1]);
      setPointer(prevState => prevState + 1);
      inputRef?.current?.blur();
    }

    // Go next cmd
    if (e.key === "ArrowDown") {
      if (pointer < 0) return;

      if (pointer === 0) {
        setInputVal("");
        setPointer(-1);
        return;
      }

      setInputVal(cmdHistory[pointer - 1]);
      setPointer(prevState => prevState - 1);
      inputRef?.current?.blur();
    }
  };

  // For caret position at the end
  useEffect(() => {
    const timer = setTimeout(() => {
      inputRef?.current?.focus();
    }, 1);
    return () => clearTimeout(timer);
  }, [inputRef, inputVal, pointer]);

  return (
    <Wrapper data-testid="terminal-wrapper" ref={containerRef}>
      {hints.length > 1 && (
        <div>
          {hints.map(hCmd => (
            <Hints key={hCmd}>{hCmd}</Hints>
          ))}
        </div>
      )}
      <Form onSubmit={handleSubmit}>
        <label htmlFor="terminal-input">
          <TermInfo /> <MobileBr />
          <MobileSpan>&#62;</MobileSpan>
        </label>
        <Input
          title="terminal-input"
          type="text"
          id="terminal-input"
          autoComplete="off"
          spellCheck="false"
          autoFocus
          autoCapitalize="off"
          ref={inputRef}
          value={inputVal}
          onKeyDown={handleKeyDown}
          onChange={handleChange}
        />
      </Form>

      {cmdHistory.map((cmdH, index) => {
        const commandArray = _.split(_.trim(cmdH), " ");
        const validCommand = _.find(commands, { cmd: commandArray[0] });
        const contextValue = {
          arg: _.drop(commandArray),
          history: cmdHistory,
          rerender,
          index,
          clearHistory,
        };
        return (
          <div key={_.uniqueId(`${cmdH}_`)}>
            <div>
              <TermInfo />
              <MobileBr />
              <MobileSpan>&#62;</MobileSpan>
              <span data-testid="input-command">{cmdH}</span>
            </div>
            {validCommand ? (
              <termContext.Provider value={contextValue}>
                <Output index={index} cmd={commandArray[0]} />
              </termContext.Provider>
            ) : cmdH === "" ? (
              <Empty />
            ) : (
              <CmdNotFound data-testid={`not-found-${index}`}>
                command not found: {cmdH}
              </CmdNotFound>
            )}
          </div>
        );
      })}
    </Wrapper>
  );
};

export default Terminal;
