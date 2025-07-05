'use client'
import { removeEmployee, updateEmployee } from '@/lib/features/handlingEmployee';
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

export default function ShowEmployee() {

  const employeeData = useSelector((data : any) => data.employeeData.employees);
  const [updateId, setUpdateId] = useState(null);
  const [newEmpName, setNewEmpName] = useState('');
  const dispatch = useDispatch();

  const dispatchRemoveEmployee = (employeeId : string) => {
    dispatch(removeEmployee(employeeId));
  }

  const dispatchUpdateEmployee = (empId : string) => {
    console.log("Employee Update : ", { empId, newEmpName });
    dispatch(updateEmployee({empName : newEmpName, empId : empId}));
    setNewEmpName('');
    setUpdateId(null);
  }

  return (
    <div>
        <h1 className="text-center font-bold text-2xl mt-6"> SHOW EMPLOYEE </h1>
        {
          employeeData && employeeData.map((emp : any, idx : number) => 

            <div key={idx} className='flex flex-row justify-start place-items-center p-4'>
              <h1 className="text-xl font-medium"> {emp.employeeName} </h1>

              {
                !(updateId === emp.id) &&
                  <button
                    type="button"
                    className="px-4 mx-6 bg-green-600 text-white font-light rounded-md hover:bg-green-700 transition duration-300 h-10" 
                    onClick={() => setUpdateId(emp.id)}
                  >
                    Update Employee
                  </button>

              }

              {
                (updateId === emp.id) && 
                <div className='flex flex-row justify-start place-items-center p-4'>

                  <input
                    type="text"
                    placeholder="Update Employee"
                    className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                    onChange={(e) => setNewEmpName(e.target.value)}
                    value={newEmpName}
                  />

                  <button
                    type="button"
                    className="px-4 mx-6 bg-green-600 text-white font-light rounded-md hover:bg-green-700 transition duration-300 h-10" 
                    onClick={() => dispatchUpdateEmployee(emp.id)}
                  >
                    Confirm
                  </button>

                </div>
              }

              {
                !(updateId === emp.id) &&
                  <button
                    type="button"
                    className="px-4 mx-6 bg-blue-600 text-white font-light rounded-md hover:bg-blue-700 transition duration-300 h-10" 
                    onClick={() => dispatchRemoveEmployee(emp.id)}
                  >
                    Remove Employee
                  </button>
              }

              
            </div>
          
          )
        }
    </div>
  )
}
