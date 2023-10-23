import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { incrementHintCount } from "../store/question-slice";
import axios from "axios";

function Hint() {
  const { team_id, question_id } = useParams();
  let hintNumber = useSelector(
    (state) => state.question.questionHints[question_id] || 0
  );
  const dispatch = useDispatch();
  const [hintInfo, setHintInfo] = useState(null);

  const showHint = () => {
    if (hintNumber <= 3) {
      // Make the API call to get the hint
      axios
        .get(
          `https://bci0y87s7k.execute-api.ap-south-1.amazonaws.com/api/admin/giveHints/${team_id}/${question_id}/${hintNumber}`
        )
        .then((response) => {
          if (response.status === 200) {
            // If the response is successful and has the clue property
            setHintInfo(response.data.clue);
            dispatch(incrementHintCount(question_id)); // Increment the hint count in the Redux store
          } else {
            // Show the entire response message for non-200 responses
            console.log(response.data.message);
            alert(response.data.message);
          }
        })
        .catch((error) => {
          
           alert(error.response.data.message);
           
          
        });
    } else {
      alert("Maximum hints reached (3)!");
    }
  };

  const buttonStyle =
    "text-white font-bold bg-blue-500 rounded-full py-2 px-4 hover:bg-blue-700";

  return (
    <div className="container mx-auto mt-10 text-center">
      <h1 className="text-2xl font-bold mb-4">
        ****** THIS HINT WILL ONLY BE SHOWN ONCE - PLEASE NOTE IT DOWN ******
      </h1>
      {hintNumber <= 3 && (
        <button
          onClick={() => dispatch(incrementHintCount(question_id))}
          className={buttonStyle}
        >
          HINT NUMBER {hintNumber}
        </button>
      )}
      {hintInfo ? (
        <div className="mt-6">
          <h2 className="text-xl font-semibold">Hint Information</h2>
          <p className="text-gray-800">{hintInfo}</p>
        </div>
      ) : (
        <div className="mt-6">
          {hintNumber <= 3 ? (
            <button onClick={showHint} className={buttonStyle}>
              SHOW HINT NUMBER {hintNumber}
            </button>
          ) : (
            <p className="text-red-500 font-bold">Maximum hints reached (3)!</p>
          )}
        </div>
      )}
    </div>
  );
}

export default Hint;
