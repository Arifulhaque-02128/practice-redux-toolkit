'use client'
import { useGetPostsQuery } from '@/lib/features/api/handleApi';
import { useParams } from 'next/navigation';
import React from 'react'

const Post = () => {
  const params = useParams();
  const id = params?.id;

  const {data : post, isLoading, isError} = useGetPostsQuery(`/posts/${id}`);

  return (

    !isError ? 
    <div className='flex flex-col bg-gray-100 rounded-md px-6 py-2 space-y-4 mx-4 mt-12 max-w-2xl justify-self-center'>
        <h1 className='text-center text-2xl font-bold'> {post.title} </h1>
        <p> {post.body} </p>
    </div>
    :
    <p className='text-center text-2xl font-bold my-12'>{"Something went wrong...."}</p>
  )
}

export default Post;