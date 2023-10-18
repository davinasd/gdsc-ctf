import React, { useState, useEffect } from "react";
import axios from "axios";

const QuestionTable = () => {
  const [questions, setQuestions] = useState([]);
  const [selectedQuestion, setSelectedQuestion] = useState(null);

  useEffect(() => {
    
    axios
      .get(
        "https://bci0y87s7k.execute-api.ap-south-1.amazonaws.com/api/admin/getAllQuestions"
      )
      .then((response) => {
        setQuestions(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data: ", error);
      });
  }, []);

  const openModal = (question) => {
    setSelectedQuestion(question);
  };

  const closeModal = () => {
    setSelectedQuestion(null);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Question Table</h1>
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        {questions.map((question, index) => (
          <div
            key={question._id}
            className="p-4 border rounded-lg cursor-pointer hover:bg-gray-100"
            onClick={() => openModal(question)}
          >
            <p className="font-bold">Question {index + 1}</p>
          </div>
        ))}
      </div>

      {selectedQuestion && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white p-8 max-w-md rounded-lg shadow-lg">
            <button
              className="float-right text-gray-500 hover:text-red-500"
              onClick={closeModal}
            >
              Close
            </button>
            <h2 className="text-xl font-bold mb-4 ">Question Details</h2>
            <p>
              <strong>Question:</strong> {selectedQuestion.question}
            </p>
            <p>
              <strong>Link: </strong>
              <a
                href={selectedQuestion.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500"
              >
                {selectedQuestion.link}
              </a>
            </p>

            <p>
              <strong>Points: </strong>
              {selectedQuestion.points}
            </p>
            <p>
              <strong>Hint:</strong> {selectedQuestion.hint}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuestionTable;
