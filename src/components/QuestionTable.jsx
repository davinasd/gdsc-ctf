import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { useSelector, useDispatch } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import Lottie from "lottie-react";
import { authActions } from "../store/auth-slice";
import { setQuestionHints } from "../store/question-slice";
import axios from "axios";
import ImgBg from "./../assets/ghost1.json";
import { motion } from "framer-motion";
const QuestionCard = ({ question, index, func: openModal }) => {
  const [hovered, setIsHovered] = useState(false);
  return (
    <motion.div
      onHoverStart={() => {
        setIsHovered(true);
      }}
      onHoverEnd={() => {
        setIsHovered(false);
      }}
      key={question._id}
      className="p-4 border rounded-lg cursor-pointer w-full hover:bg-primary shadow-md bg-gray-950 text-black text-2xl font-semibold leading-tight relative bg-opacity-40"
      onClick={() => openModal(question)}
    >
      {hovered && (
        <Lottie
          className="bg-opacity-0"
          animationData={ImgBg}
          loop={true}
          style={{
            position: "absolute",
            bottom: "-35%",
            right: "-12%",
            width: "100px",
            height: "100px",
            zIndex: 35,
          }}
        />
      )}
      <p
        className="font-bold text-primary-700 md:text-2xl text-xl flex gap-3 text-white tracking-widest font-primary"
       
      >
        Question <span className="md:text-2xl text-xl">{index + 1}</span>
      </p>
      <h2
        className="md:text-xl text-base font-bold mb-2  text-white tracking-wider font-primary"
       
      >
        {question.question}
      </h2>
      <div
        className="text-purple-700 bg-white py-2 px-3 rounded-full w-fit sm:text-lg text-sm font-primary tracking-wider border border-white backdrop-blur-lg  bg-white/10 "
       
      >
        Points: {question.points}
      </div>
    </motion.div>
  );
};
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
          className: "text-white font-primary bg-black",
         
        });
      }
    } catch (error) {
      toast.error(error.response.data.message, {
        className: "text-white font-primary bg-black",
        
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
          className: "text-white font-primary bg-black",
          
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
            className: "text-white font-primary bg-black",
            
          });
          closeModal();

          setAnswer("");
        })
        .catch((error) => {
          toast.error(error.response.data.message || "An error occurred", {
            className: "text-white font-primary bg-black",
            
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
        className="text-3xl font-bold mb-6 font-primary text-white  tracking-wider"
        
      >
        Quests
      </h1>

      <div className="grid sm:grid-cols-2 grid-cols-1 gap-4">
        {questions.map((question, index) => (
          <QuestionCard
            question={question}
            index={index}
            key={index.toString()}
            func={openModal}
          />
        ))}
      </div>

      {selectedQuestion && (
        <div
          className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black p-4 bg-opacity-90 z-30"
          onClick={closeModal}
        >
          <div
            className="bg-secondary py-2 w-6/7 px-4 rounded-lg shadow-lg relative z-50 h-screen sm:h-full no-scrollbar overflow-scroll sm:overflow-auto "
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-0 right-2 pl-10 cursor-pointer text-white font-bold text-xl m-2"
              onClick={closeModal}
            >
              x
            </button>

            <div className="flex justify-between w-full mt-6">
              <div>
                <h2
                  className="sm:text-3xl text-xl  font-primary font-bold mb-2 tracking-wider"
               
                >
                  {selectedQuestion.question}
                </h2>
                <div className="flex gap-3 items-center">
                  <div
                    className="sm:text-3xl  font-primary text-xl"
                    
                  >
                    Tag :
                  </div>
                  <div
                    className={`bg-primary px-2 border text-sm border-white py-1 font-primary text-white rounded-full `}
                   
                  >
                    {selectedQuestion.type}
                  </div>
                </div>
              </div>
              <div className="text-white-600 text-xl font-bold flex gap-3">
                <div
                  className="sm:text-3xl font-primary text-xl"
                  
                >
                  Points:
                </div>{" "}
                <div
                  className="sm:text-3xl font-primary text-xl"
                  
                >
                  {selectedQuestion.points}
                </div>{" "}
              </div>
            </div>

            <div className="mb-2  flex sm:flex-row flex-col pb-10 pt-5">
              <div
                className="mb-2 flex flex-col sm:w-1/2 sm:border-r border-b pb-10 sm:border-b-transparent"
                
              >
                <div className="mb-2">
                  <div
                    className="sm:text-3xl font-primary text-xl"
                    
                  >
                    CATCH PHRASE :
                  </div>{" "}
                  {selectedQuestion.catchPhrase}
                </div>
                <div className="pr-2">
                  <div
                    className="sm:text-3xl  font-primary text-xl"
                    
                  >
                    DESCRIPTION :
                  </div>{" "}
                  <ReactMarkdown>{selectedQuestion.description}</ReactMarkdown>
                </div>
                <div
                  className="sm:text-3xl font-primary text-xl"
                
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
              <div className="sm:w-1/2 mx-4 pt-1" style={{ textAlign: "center" }}>
                <div
                  className="text-center font-primary  text-primary sm:text-4xl text-2xl"
                 
                >
                  🎃 Hints 🎃
                </div>
                <br />
                <strong
                  className="text-center font-primary text-primary sm:text-4xl text-2xl"
                  
                >
                  (PUMPKINS WILL ONLY BE SHOWN ONCE)
                </strong>
                <div className="pt-2 pb-2 mr-3 ml-3  rounded ">
                  <div
                    className="pt-2 pb-2 mr-3 ml-3 bg-black rounded shadow-lg "
                    style={{ maxHeight: "300px", overflowY: "auto" }}
                  >
                    <div className="space-y-4">
                      <div className="bg-secondary  font-primary mr-2 ml-2 p-2">
                        <button
                          onClick={() => fetchHint(1)}
                          className="btn"
                          
                        >
                          🎃 -5 points
                        </button>
                        <div className="text-primary">{hint1}</div>
                      </div>
                      <div className="bg-secondary mr-2  font-primary ml-2 p-2">
                        <button
                          onClick={() => fetchHint(2)}
                          className="btn"
                         
                        >
                          🎃 🎃 -7 points
                        </button>
                        <div className="text-primary">{hint2}</div>
                      </div>
                      <div className="bg-secondary  font-primary mr-2 ml-2 p-2">
                        <button
                          onClick={() => fetchHint(3)}
                          className="btn"
                          
                        >
                          🎃 🎃 🎃 -10 points
                        </button>
                        <div className="text-primary">{hint3}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div
              className="flex sm:flex-row flex-col  items-center  font-primary mb-4"
             
            >
              <input
                type="text"
                id="answer"
                placeholder=" Enter Your 🍬 Candy Here"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                className="border rounded p-2 w-full mr-2 mb-4 sm:mb-0 bg-black text-primary font-primary"
              />
              <button
                onClick={submitAnswer}
                className="bg-primary text-black w-60 h-18 py-3 rounded-full hover:bg-orange-700 text-sm  font-primary"
               
              >
                🍬 Submit Candy 🍬
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuestionTable;
