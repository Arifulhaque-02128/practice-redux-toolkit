import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseApi = createApi({
    reducerPath : "baseApi",
    baseQuery : fetchBaseQuery({
        baseUrl : "https://jsonplaceholder.typicode.com"
    }),
    endpoints : (builder) => ({

        // getPosts --> a reducer, will be called using hook userGetPostsQuery()
        getPosts : builder.query({
            
            //builder.query --> used to fetch or get data from api or url
            query : (endPath) => `${endPath}`
        }),

        getPostById : builder.query({
            query : (endPath) => `${endPath}`
        }),
        
    })
});

export const { useGetPostsQuery } = baseApi;  // baseApi (created by redux's createApi()) is providing this hook to get data by query.
export default baseApi;