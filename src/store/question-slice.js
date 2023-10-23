// question-slice.js
import { createSlice } from "@reduxjs/toolkit";

const initialQuestionState = {
  questionHints: {},
};

const questionSlice = createSlice({
  name: "question",
  initialState: initialQuestionState,
  reducers: {
    setQuestionHints(state, action) {
      state.questionHints = action.payload;
    },
    incrementHintCount(state, action) {
      const questionId = action.payload;
      state.questionHints[questionId] += 1;
    },
  },
});

export const { setQuestionHints, incrementHintCount } = questionSlice.actions;
export default questionSlice;
