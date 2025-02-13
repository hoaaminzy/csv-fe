import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  periodCourses: [],
};

const scheduleSlice = createSlice({
  name: "schedule",
  initialState,
  reducers: {
    setPeriodCourses: (state, action) => {
      state.periodCourses = action.payload;
    },
  },
});

export const { setPeriodCourses } = scheduleSlice.actions;
export default scheduleSlice.reducer;
