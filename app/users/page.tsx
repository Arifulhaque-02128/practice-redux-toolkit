'use client'
import { apiUsers } from '@/lib/features/handleUsers';
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

const Users = () => {

  const dispatch = useDispatch();
  const userData = useSelector((state : any) => state.userData.users);
  const isLoading = useSelector((state : any) => state.userData.isLoading);
  const errMsg = useSelector((state : any) => state.userData.error);

  useEffect(() => {
    dispatch<any>(apiUsers()) ;
  }, [dispatch]);

  console.log(userData);
  
  return (
    <div className='flex flex-col justify-center items-center bg-gray-100 space-x-4 space-y-6 m-2 rounded-md py-8 w-full'>
        <h1 className='text-2xl font-bold text-teal-800'>OUR USERS</h1>
        <div className='flex flex-col space-x-2 space-y-2'>
            {
                isLoading && <div>Loading....</div>
            }
            {
                errMsg && <div>{errMsg}</div>
            }

            {
                userData && 
                        <div className='grid grid-cols-3 text-xl font-bold gap-24 border-b w-full border-gray-400 p-2 border-t'>
                            <span>Name</span>
                            <span>Phone</span>
                            <span>Website</span>
                        </div>
            }
            
            {

                userData && userData.map((user : any) => 

                    <div key={user.id} className='grid grid-cols-3 text-xl font-medium gap-24 border-b w-full border-gray-400 p-2'>
                        <span>{user.name}</span>
                        <span>{user.phone}</span>
                        <span className='text-blue-600 underline cursor-pointer text-sm'>{user.website}</span>
                    </div>
                )
            }
        </div>
    </div>
  )
}

export default Users