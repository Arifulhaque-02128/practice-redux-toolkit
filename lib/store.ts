import { configureStore } from "@reduxjs/toolkit";
import EmployeeReducer from "./features/handlingEmployee";
import CounterReducer from "./features/handleCounter";
import UserReducer from "./features/handleUsers";
import baseApi from "./features/api/handleApi";
import logger from "./middlewires/logger";

export const store = configureStore({
  reducer : {
    employeeData : EmployeeReducer, 
    counterData : CounterReducer, 
    userData : UserReducer,
    [baseApi.reducerPath]: baseApi.reducer,
  },

  // here, two middleware is used
  // logger --> custom middleware, created by me
  // middleware : (getDefaultMiddleware) => getDefaultMiddleware().concat(logger)


  // baseApi --> middleware to handle api calling to fetch data from remote url.
  middleware : (getDefaultMiddleware) => getDefaultMiddleware().concat(logger, baseApi.middleware),
  // baseApi (created by redux's createApi()), will provide us this middleware too.

});


