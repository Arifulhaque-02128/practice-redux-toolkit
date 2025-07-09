import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseApi = createApi({
    reducerPath : "baseApi",
    baseQuery : fetchBaseQuery({
        baseUrl : "https://jsonplaceholder.typicode.com"
    }),
    endpoints : (builder) => ({

        // getPosts --> a reducer, will be called using hook userGetPostsQuery()
        //builder.query --> used to fetch or get data from api or url
        getPosts : builder.query({
            
            query : (endPath) => `${endPath}`
        }),

        getPostById : builder.query({
            query : (endPath) => `${endPath}`
        }),

        // builder.mutation --> mutation in RTK, is used for POST, PUT (update) and DELETE request
        // in mutation query needs --> 
        // url endpath (the url to where it will be posted), 
        // method (POST || PUT || DELETE) and 
        // body (the data which will be posted)

        postComment : builder.mutation({
            query : ({endPath, body}) => {
                // console.log("BODY :::", body);
                return {
                url : `${endPath}`,
                method : "POST",
                body : {
                    title : body.title,
                    id : body.id,
                    comment : body.comment,
                    body : body.body,
                    userId : body.userId
                }
            }},
        })
        
    })
});

export const { useGetPostsQuery, useGetPostByIdQuery, usePostCommentMutation } = baseApi;  // baseApi (created by redux's createApi()) is providing this hook to get data by query.
export default baseApi;