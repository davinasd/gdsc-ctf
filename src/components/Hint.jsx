import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";

const Hint = () => {
  const [hint1, setHint1] = useState("");
  const [hint2, setHint2] = useState("");
  const [hint3, setHint3] = useState("");
  const { team_id, question_id } = useParams();
  const [alertMessage, setAlertMessage] = useState("");

  const fetchHint = async (hintNumber) => {
    try {
      const response = await fetch(
        `https://bci0y87s7k.execute-api.ap-south-1.amazonaws.com/api/admin/giveHints/${team_id}/${question_id}/${hintNumber}`
      );

      if (response.status === 200) {
        const data = await response.json();
        switch (hintNumber) {
          case 1:
            setHint1(data.message);
            break;
          case 2:
            setHint2(data.message);
            break;
          case 3:
            setHint3(data.message);
            break;
          default:
            break;
        }
      } 
      if(response.status ===400)
      {const data = await response.json();
        setAlertMessage(data.message);
      }
    } catch (error) {
      alert(error.response.data.message);
    }
  };

  return (
    <>
      <div className="max-w-sm mx-auto p-4 bg-gray-100 rounded shadow-lg">
        
        <div className="text-3xl font-bold mb-4">
          Hints WILL ONLY BE SHOWN ONCE 
        </div>
        <div className="space-y-4">
          <div className="bg-gray-200 p-4">
            <button
              onClick={() => fetchHint(1)}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Get Hint 1 -5 points
            </button>
            <div>{hint1}</div>
          </div>
          <div className="bg-gray-200 p-4">
            <button
              onClick={() => fetchHint(2)}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Get Hint 2 -7 points
            </button>
            <div>{hint2}</div>
          </div>
          <div className="bg-gray-200 p-4">
            <button
              onClick={() => fetchHint(3)}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Get Hint 3 -10 points
            </button>
            <div>{hint3}</div>
          </div>
        </div>
        {alertMessage !== "" && (
          <div className="fixed px-3 py-7">
            <div className="bg-red-500 text-white px-4 py-2 rounded">
              {alertMessage}
            </div>
          </div>
        )}
      </div>

      <div className="fixed bottom-4 right-4">
        <Link
          to="/user"
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700"
          style={{ textDecoration: "none" }}
        >
          Back to Home
        </Link>
      </div>
    </>
  );
};

export default Hint;
