'use client'
import { addEmployee, setEmployees } from '@/lib/features/handlingEmployee';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';

export default function AddEmployee () {
  
  const [employeeName, setEmployeeName] = useState('');

  const dispatch = useDispatch();
  const employees = useSelector((state : any) => state.employeeData.employees);

  const dispatchEmployee = () => {
    dispatch(addEmployee(employeeName));
    setEmployeeName('');
  };

  useEffect(() => {
    const savedEmployees = localStorage.getItem("employee");
    if(savedEmployees) {
      dispatch(setEmployees(JSON.parse(savedEmployees)));
    }

  }, [dispatch]);

  useEffect(() => {
    localStorage.setItem("employee", JSON.stringify(employees));
  }, [employees]);


  return (
    <div className="flex flex-col items-center justify-center m-4 p-12 bg-gray-100" >
        <h1 className="text-2xl font-bold mb-6"> ADD EMPLOYEE </h1>
        <div className="flex flex-col items-center space-y-4">
            <input
            type="text"
            placeholder="Enter Employee"
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            onChange={(e) => setEmployeeName(e.target.value)}
            value={employeeName}
            />
            <button
            type="button"
            className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition duration-300"
            onClick={() => dispatchEmployee()}
            >
            Add Employee
            </button>
        </div>
    </div>
  )
}
