import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { useSelector, useDispatch } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import {motion} from "framer-motion"

import { authActions } from "../store/auth-slice";
import { setQuestionHints } from "../store/question-slice";
import axios from "axios";

const QuestionTable = () => {
  const dispatch = useDispatch();

  const team_id = useSelector((state) => state.auth.team_id);

  const [questions, setQuestions] = useState([]);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [answer, setAnswer] = useState("");

  const [hint1, setHint1] = useState("");
  const [hint2, setHint2] = useState("");
  const [hint3, setHint3] = useState("");

  const [alertMessage, setAlertMessage] = useState("");

  const fetchHint = async (hintNumber) => {
    try {
      const response = await fetch(
        `https://bci0y87s7k.execute-api.ap-south-1.amazonaws.com/api/admin/giveHints/${team_id}/${selectedQuestion.question_id}/${hintNumber}`
      );

      if (response.status === 200) {
        const data = await response.json();
        switch (hintNumber) {
          case 1:
            setHint1(data.clue);
            break;
          case 2:
            setHint2(data.clue);
            break;
          case 3:
            setHint3(data.clue);
            break;
          default:
            break;
        }
      }
      if (response.status === 400) {
        const data = await response.json();
        toast.error(data.message, {
          className: "text-white bg-black",
          style: {
            fontFamily: "Creepster",
          },
        });
      }
    } catch (error) {
      toast.error(error.response.data.message, {
        className: "text-white bg-black",
        style: {
          fontFamily: "Creepster",
        },
      });
    }
  };

  useEffect(() => {
    axios
      .get(
        "https://bci0y87s7k.execute-api.ap-south-1.amazonaws.com/api/admin/getAllQuestions"
      )
      .then((response) => {
        const questions = response.data;

        const newQuestionHints = {};
        questions.forEach((question) => {
          newQuestionHints[question.question_id] = 1;
        });

        dispatch(setQuestionHints(newQuestionHints));

        setQuestions(questions);
      })

      .catch((error) => {
        console.error("Error fetching data: ", error);
      });
  }, [dispatch]);

  const openModal = (question) => {
    setSelectedQuestion(question);
  };

  const closeModal = () => {
    setSelectedQuestion(null);
    setHint1("");
    setHint2("");
    setHint3("");
  };

  const submitAnswer = () => {
    if (!answer) {
      toast.error(
        "CAN NOT SUBMIT BLANK ANSWER",

        {
          className: "text-white bg-black",
          style: {
            fontFamily: "Creepster",
          },
        }
      );
      closeModal();
    } else {
      axios
        .post(
          "https://bci0y87s7k.execute-api.ap-south-1.amazonaws.com/api/admin/addQSolved",
          {
            question_id: selectedQuestion.question_id,
            team_id: team_id,
            answer: answer,
          }
        )
        .then((response) => {
          toast(response.message, {
            className: "text-white bg-black",
            style: {
              fontFamily: "Creepster",
            },
          });
          closeModal();

          setAnswer("");
        })
        .catch((error) => {
          toast.error(error.response.data.message || "An error occurred", {
            className: "text-white bg-black",
            style: {
              fontFamily: "Creepster",
            },
          });

          closeModal();
          setAnswer("");
        });
    }
  };

  return (
    <div className="container mx-auto p-4  text-white">
      <ToastContainer></ToastContainer>
      <h1
        className="text-5xl font-bold mb-4 text-white "
        style={{
          fontFamily: "Creepster",
        }}
      >
        Quests
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4">
        {questions.map((question, index) => (
          <div
            key={question._id}
            className=" border rounded-lg cursor-pointer hover:bg-orange-600 shadow-md bg-white bg-opacity-60
        text-black
        p-4
        text-2xl font-semibold leading-tight
      "
            onClick={() => openModal(question)}
          >
            <p
              className="font-bold text-primary-700 text-3xl"
              style={{
                fontFamily: "Creepster",
              }}
            >
              Question {index + 1}
            </p>
            <h2
              className="text-xl font-bold mb-2"
              style={{
                fontFamily: "Creepster",
              }}
            >
              {question.question}
            </h2>
            <div
              className="text-purple-800"
              style={{
                fontFamily: "Creepster",
              }}
            >
              Points: {question.points}
            </div>
          </div>
        ))}
      </div>

      {selectedQuestion && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-90">
        <div className="bg-purple-800 p-8 max-w-4xl max-h-4xl h-custom rounded-lg shadow-lg relative">
          <div className="h-full overflow-y-auto">
          <button
            className="absolute top-2 right-2 pl-10 cursor-pointer text-white font-bold text-xl"
            onClick={closeModal}
          >
            x
          </button>

          <div className="flex justify-between">
            <div>
              <h2
                className="text-3xl font-bold mb-2"
                style={{
                  fontFamily: "Creepster",
                }}
              >
                {selectedQuestion.question}
              </h2>
              <div
                className="text-3xl"
                style={{
                  fontFamily: "Creepster",
                }}
              >
                Tag :
              </div>
              <div
                className={`bg-orange-500 text-black px-2 py-1 rounded mb-2`}
                style={{ width: "auto", display: "inline-block" }}
              >
                {selectedQuestion.type}
              </div>
            </div>
            <div className="text-white-600 text-xl font-bold">
              <div
                className="text-3xl"
                style={{
                  fontFamily: "Creepster",
                }}
              >
                Points:
              </div>{" "}
              <div
                className="text-3xl"
                style={{
                  fontFamily: "Creepster",
                }}
              >
                {selectedQuestion.points}
              </div>{" "}
            </div>
          </div>

          <div className="mb-2 flex pb-10 pt-5">
            <div
              className="mb-2 flex flex-col w-1/2"
              style={{ borderRight: "1px solid #000" }}
            >
              <div className="mb-2">
                <div
                  className="text-3xl"
                  style={{
                    fontFamily: "Creepster",
                  }}
                >
                  CATCH PHRASE :
                </div>{" "}
                {selectedQuestion.catchPhrase}
              </div>
              <div className="pr-2">
                <div
                  className="text-3xl"
                  style={{
                    fontFamily: "Creepster",
                  }}
                >
                  DESCRIPTION :
                </div>{" "}
                <ReactMarkdown>{selectedQuestion.description}</ReactMarkdown>
              </div>
              <div
                className="text-3xl"
                style={{
                  fontFamily: "Creepster",
                }}
              >
                LINK :
              </div>{" "}
              <a
                href={selectedQuestion.link}
                style={{ textDecoration: "underline", color: "white" }}
              >
                {selectedQuestion.link}
              </a>
            </div>
            <div className="w-1/2" style={{ textAlign: "center" }}>
              <strong
                className="text-center text-orange-500 text-4xl flex w-full justify-center"
                style={{
                  fontFamily: "Creepster",
                }}
              >
                <motion.div
                  initial={{ y: 0 }}
                  animate={{
                    y: [-10, 10, -7, 7, -5, 5, -3, 3, 0],
                  }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    repeatType: "reverse",
                  }}
                >
                  🎃
                </motion.div>{" "}
                Hints{" "}
                <motion.div
                  initial={{ y: 0 }}
                  animate={{
                    y: [-10, 10, -7, 7, -5, 5, -3, 3, 0],
                  }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    repeatType: "reverse",
                  }}
                >
                  🎃
                </motion.div>
              </strong>
              <br />
              <strong
                className="text-center text-orange-500 text-4xl"
                style={{
                  fontFamily: "Creepster",
                }}
              >
                (PUMKINS WILL ONLY BE SHOWN ONCE)
              </strong>
              <div className="pt-2 pb-2 mr-3 ml-3 bg-black rounded shadow-lg">
                <div className="space-y-4">
                  <div className="bg-purple-800 mr-2 ml-2 p-2">
                    <button
                      onClick={() => fetchHint(1)}
                      className="bg-green-500 text-white px-2 py-2 rounded-full hover:bg-green-700 flex w-full justify-center gap-3 text-3xl"
                      style={{
                        fontFamily: "Creepster",
                      }}
                    >
                     
                        🎃
                      
                      <span>-5 points</span>
                    </button>
                    <div className="text-orange-500 ">{hint1}</div>
                  </div>
                  <div className="bg-purple-800 mr-2 ml-2 p-2">
                    <button
                      onClick={() => fetchHint(2)}
                      className="bg-green-500 text-white px-2 py-2 rounded-full hover:bg-green-700 flex w-full justify-center gap-3 text-3xl"
                      style={{
                        fontFamily: "Creepster",
                      }}
                    >
                    
                        🎃
                      
                        🎃
                      
                      <span>-7 points</span>
                    </button>
                    <div className="text-orange-500">{hint2}</div>
                  </div>
                  <div className="bg-purple-800 mr-2 ml-2 p-2">
                    <button
                      onClick={() => fetchHint(3)}
                      className="bg-green-500 text-white px-2 py-2 rounded-full hover:bg-green-700 flex w-full justify-center gap-3 text-2xl"
                      style={{
                        fontFamily: "Creepster",
                      }}
                    >
                     
                        🎃
                     
                        🎃
                   
                        🎃
                     
                      <span> -10 points</span>
                    </button>
                    <div className="text-orange-500">{hint3}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div
            className="flex items-center flex-row mb-4"
            style={{
              fontFamily: "Creepster",
            }}
          >
            <input
              type="text"
              id="answer"
              placeholder=" Enter Your 🍬 Candy Here"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              className="border rounded p-2 w-full mr-2 bg-black text-orange-500"
            />
            <button
              onClick={submitAnswer}
              className="bg-orange-500 text-black w-60 h-18 py-3 rounded-full hover:bg-orange-700 text-sm "
              style={{
                fontFamily: "Creepster",
              }}
            >
              🍬 Submit Candy 🍬
            </button>
          </div>
          </div>
        </div>
      </div>
    )}
  </div>
);
};

export default QuestionTable;