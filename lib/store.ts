import { configureStore } from "@reduxjs/toolkit";
import EmployeeReducer from "./features/handlingEmployee";
import CounterReducer from "./features/handleCounter";

export const store = configureStore({
  reducer : {employeeData : EmployeeReducer, counterData : CounterReducer}
});

