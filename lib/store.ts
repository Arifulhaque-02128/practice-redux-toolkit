import { configureStore } from "@reduxjs/toolkit";
import EmployeeReducer from "./features/handlingEmployee";
import CounterReducer from "./features/handleCounter";
import UserReducer from "./features/handleUsers";

export const store = configureStore({
  reducer : {employeeData : EmployeeReducer, counterData : CounterReducer, userData : UserReducer}
});

