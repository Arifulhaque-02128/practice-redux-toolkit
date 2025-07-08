'use client'
import { useGetPostByIdQuery, usePostCommentMutation } from '@/lib/features/api/handleApi';
import { useParams } from 'next/navigation';
import React, { useState } from 'react'

const Post = () => {
  const params = useParams();
  const id = params?.id;

  const {data : post, isLoading, isError} = useGetPostByIdQuery(`/posts/${id}`);
  const [commentValue, setCommentValue] = useState('');

   const [postComment, {data : postData}] = usePostCommentMutation();

  const handleComment = (e : React.FormEvent<HTMLFormElement>) => {

    console.log("POST ::::: ", {endPath : `/posts`, body : {...post, comment : commentValue}});
    postComment({endPath : `/posts`, body : {...post, comment : commentValue}});

    e.preventDefault();
    setCommentValue("");
  }

  console.log("POST DATA :::: ", postData);

  return (

    !isError ? 
    <div className='flex flex-col gap-6'>

      <div className='flex flex-col bg-gray-100 rounded-md px-6 py-2 space-y-4 mx-4 mt-12 max-w-2xl justify-self-center'>
          <h1 className='text-center text-2xl font-bold'> {post?.title} </h1>
          <p> {post?.body} </p>
      </div>

      <div className='flex flex-col gap-2 max-w-2xl justify-self-center mx-4 mt-12'>
        <h1 className='font-bold'>Comment</h1>
        <form onSubmit={handleComment} className='bg-gray-100 flex flex-col rounded-md gap-2 px-6 py-4'>
          <textarea name="comment" id="comment" 
            className='w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition duration-200 bg-white resize-none'
            placeholder='Write your comment here...'
            onChange={(e) => setCommentValue(e.target.value)}
            value={commentValue}
          /> 
          <button type="submit" 
            className='bg-blue-600 hover:bg-blue-800 transition duration-300 rounded-md text-white font-bold w-24 px-4 py-2'
          >
            POST
          </button>
        </form>
      </div>

    </div>
    :
    <p className='text-center text-2xl font-bold my-12'>{"Something went wrong...."}</p>
  )
}

export default Post;