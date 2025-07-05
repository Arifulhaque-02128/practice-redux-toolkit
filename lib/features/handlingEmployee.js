import { createSlice, nanoid } from "@reduxjs/toolkit";


const initialState = {
    employees : [],
}


const EmployeeSlice = createSlice({
    name : "Handle Employee",
    initialState,
    reducers : {
        addEmployee : (state, action) => {
            const data = {
                employeeName : action.payload,
                id : nanoid()
            }

            state.employees.push(data);
        },

        removeEmployee : (state, action) => {
            const data = state.employees.filter((em) => em.id !== action.payload);
            state.employees = data;
        },

        updateEmployee : (state, action ) => {
            const data = state.employees.filter((em) => em.id !== action.payload.empId);
            state.employees = [...data, {employeeName : action.payload.empName, id : action.payload.empId}]
        }
    }
})

export const {addEmployee, removeEmployee, updateEmployee} = EmployeeSlice.actions;
export default EmployeeSlice.reducer;