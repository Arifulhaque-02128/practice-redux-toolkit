'use client'
import { useGetPostsQuery } from '@/lib/features/api/handleApi'
import Link from 'next/link';
import React from 'react'

const Posts = () => {

  const { data : posts, isError, isLoading } = useGetPostsQuery('/posts'); // it will return an object
  const selectedPosts = posts?.slice(0, 10);

  type Post = {
    "userId" : number,
    "id" : number,
    "title" : string,
    "body" : string,
  }

  return (
    <div className='flex flex-col space-y-4 p-8'>

        {
            selectedPosts?.map((post : Post) => (
                <div key={post.id} className='flex flex-col space-y-4 bg-gray-100 rounded-md p-4'>
                    <h1 className='text-xl font-bold text-center border-b pb-2'>{post.title}</h1>
                    <p>{post.body}</p>
                    <Link href={`/posts/${post.id}`} 
                        className='bg-blue-600 hover:bg-blue-700 transition duration-300 text-white rounded-md p-2 w-24'
                    > 
                        Read More 
                    </Link>
                </div>
            ))
        }

        {
            isError && <p className='text-xl font-bold text-center p-8'>Something went wrong...</p>
        }
        
    </div>
  )
}

export default Posts