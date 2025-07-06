'use client'
import { countDecrement, countIncrement, setCount } from '@/lib/features/handleCounter';
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

const Counter = () => {

  const count = useSelector((data : any) => data.counterData.count);
  const dispatch = useDispatch();

  useEffect(() => {
    const savedCount = localStorage.getItem("count");
    if (count !== null) {
        dispatch(setCount(savedCount));
    }
  }, [dispatch]);

  useEffect(() => {
    localStorage.setItem("count", count.toString());
  }, [count]);
  
  

  return (
    <div className='flex flex-col h-50 justify-center items-center space-y-6'>
        <h1 className='text-2xl font-bold'>Counter</h1>
        <div className='space-x-4'>
            <button
                className='bg-blue-600 hover:bg-blue-700 transition duration-300 text-white font-bold rounded-md px-4 py-2'
                onClick={() => dispatch(countIncrement(1))}
            >
                INCREMENT
            </button>

            <span className='font-bold text-2xl'>{count}</span>

            <button 
                className='bg-blue-600 hover:bg-blue-700 transition duration-300 text-white font-bold rounded-md px-4 py-2'
                onClick={() => dispatch(countDecrement(1))}
            >
                DECREMENT
            </button>
        </div>
    </div>
  )
}

export default Counter