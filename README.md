# Redux Toolkit with Next.js 15.3.5

Learn Redux Toolkit implementation with Next.js, featuring state management, API calls, localStorage integration, and RTK Query/Mutation for efficient API handling.

## Installation

```bash
npm install @reduxjs/toolkit react-redux
```

## Setup

### 1. Configure Store (`lib/store.ts`)
This is where you configure the Redux store by combining all your reducers and middleware. The store is the central place where all your application state is stored.

```typescript
import { configureStore } from "@reduxjs/toolkit";
import EmployeeReducer from "./features/handlingEmployee";
import CounterReducer from "./features/handleCounter";
import UserReducer from "./features/handleUsers";
import baseApi from "./features/api/handleApi";
import logger from "./middlewares/logger";

export const store = configureStore({
  reducer: {
    employeeData: EmployeeReducer,
    counterData: CounterReducer,
    userData: UserReducer,
    [baseApi.reducerPath]: baseApi.reducer, // RTK Query reducer
  },
  middleware: (getDefaultMiddleware) => 
    getDefaultMiddleware().concat(logger, baseApi.middleware), // Custom logger and RTK Query middleware
});
```

### 2. Create Store Provider (`app/storeProvider.tsx`)
This component wraps your app with the Redux Provider, making the store available to all components in your application.

```typescript
'use client'
import { store } from '@/lib/store'
import { Provider } from 'react-redux'

export default function StoreProvider({children}: {children: React.ReactNode}) {
  return <Provider store={store}>{children}</Provider>
}
```

### 3. Wrap Layout (`app/layout.tsx`)
Here you wrap your entire application with the StoreProvider to make Redux state available throughout your app.

```typescript
import StoreProvider from "./storeProvider";

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <body>
        <StoreProvider>{children}</StoreProvider>
      </body>
    </html>
  );
}
```

## Creating Slices

### Basic Slice (`lib/features/handleCounter.js`)

```javascript
const { createSlice } = require("@reduxjs/toolkit");

const initialState = { count: 0 };

const CounterSlice = createSlice({
    name: "Counter",
    initialState,
    reducers: {
        countIncrement: (state) => {
            state.count += 1;
        },
        countDecrement: (state) => {
            state.count = Math.max(0, state.count - 1);
        },
        setCount: (state, action) => {
            state.count = parseInt(action.payload);
        }
    }
});

export const {countIncrement, countDecrement, setCount} = CounterSlice.actions;
export default CounterSlice.reducer;
```

### CRUD Slice (`lib/features/handlingEmployee.js`)

```javascript
import { createSlice, nanoid } from "@reduxjs/toolkit";

const initialState = { employees: [] };

const EmployeeSlice = createSlice({
    name: "Handle Employee",
    initialState,
    reducers: {
        addEmployee: (state, action) => {
            state.employees.push({
                employeeName: action.payload,
                id: nanoid()
            });
        },
        removeEmployee: (state, action) => {
            state.employees = state.employees.filter(em => em.id !== action.payload);
        },
        updateEmployee: (state, action) => {
            const {empId, empName} = action.payload;
            const employee = state.employees.find(em => em.id === empId);
            if (employee) employee.employeeName = empName;
        },
        setEmployees: (state, action) => {
            state.employees = action.payload;
        }
    }
});

export const {addEmployee, removeEmployee, updateEmployee, setEmployees} = EmployeeSlice.actions;
export default EmployeeSlice.reducer;
```

## API Calls with createAsyncThunk

### API Slice (`lib/features/handleUsers.js`)

```javascript
const { createSlice, createAsyncThunk } = require("@reduxjs/toolkit");

const initialState = {
    users: [],
    isLoading: false,
    error: null,
};

export const apiUsers = createAsyncThunk("apiusers", async () => {
    const response = await fetch("https://jsonplaceholder.typicode.com/users");
    return response.json();
});

const userSlice = createSlice({
    name: "Api User",
    initialState,
    extraReducers: (builder) => {
        builder
            .addCase(apiUsers.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(apiUsers.fulfilled, (state, action) => {
                state.isLoading = false;
                state.users = action.payload;
            })
            .addCase(apiUsers.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error;
            });
    }
});

export default userSlice.reducer;
```

## RTK Query and RTK Mutation

### Setting up RTK Query API (`lib/features/api/handleApi.js`)
RTK Query provides a powerful data fetching and caching solution. It automatically generates hooks for your API endpoints.

```javascript
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseApi = createApi({
    reducerPath: "baseApi",
    baseQuery: fetchBaseQuery({
        baseUrl: "https://jsonplaceholder.typicode.com"
    }),
    endpoints: (builder) => ({
        // Query for getting all posts
        getPosts: builder.query({
            query: (endPath) => `${endPath}`
        }),
        
        // Query for getting a single post by ID
        getPostById: builder.query({
            query: (endPath) => `${endPath}`
        }),
        
        // Mutation for posting comments
        postComment: builder.mutation({
            query: ({endPath, body}) => ({
                url: `${endPath}`,
                method: "POST",
                body: {
                    title: body.title,
                    id: body.id,
                    comment: body.comment,
                    body: body.body,
                    userId: body.userId
                }
            })
        })
    })
});

export const { 
    useGetPostsQuery, 
    useGetPostByIdQuery, 
    usePostCommentMutation 
} = baseApi;
export default baseApi;
```

### Using RTK Query in Components

#### Fetching Posts (`app/posts/page.tsx`)

```typescript
'use client'
import { useGetPostsQuery } from '@/lib/features/api/handleApi'
import Link from 'next/link';

const Posts = () => {
    const { data: posts, isError, isLoading } = useGetPostsQuery('/posts');
    const selectedPosts = posts?.slice(0, 10);

    if (isLoading) return <div>Loading...</div>;
    if (isError) return <div>Error occurred</div>;

    return (
        <div className='flex flex-col space-y-4 p-8'>
            {selectedPosts?.map((post) => (
                <div key={post.id} className='bg-gray-100 rounded-md p-4'>
                    <h1 className='text-xl font-bold'>{post.title}</h1>
                    <p>{post.body}</p>
                    <Link href={`/posts/${post.id}`} className='bg-blue-600 text-white rounded-md p-2'>
                        Read More
                    </Link>
                </div>
            ))}
        </div>
    );
};

export default Posts;
```

#### Single Post with Mutation (`app/posts/[id]/page.tsx`)

```typescript
'use client'
import { useGetPostByIdQuery, usePostCommentMutation } from '@/lib/features/api/handleApi';
import { useParams } from 'next/navigation';
import React, { useState } from 'react';

const Post = () => {
    const params = useParams();
    const id = params?.id;
    const [commentValue, setCommentValue] = useState('');

    const { data: post, isLoading, isError } = useGetPostByIdQuery(`/posts/${id}`);
    const [postComment, { data: postData }] = usePostCommentMutation();

    const handleComment = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        postComment({
            endPath: `/posts`,
            body: { ...post, comment: commentValue }
        });
        setCommentValue("");
    };

    if (isLoading) return <div>Loading...</div>;
    if (isError) return <div>Something went wrong...</div>;

    return (
        <div className='flex flex-col gap-6'>
            <div className='bg-gray-100 rounded-md p-6'>
                <h1 className='text-2xl font-bold'>{post?.title}</h1>
                <p>{post?.body}</p>
            </div>
            
            <form onSubmit={handleComment} className='bg-gray-100 rounded-md p-6'>
                <textarea
                    value={commentValue}
                    onChange={(e) => setCommentValue(e.target.value)}
                    placeholder="Write your comment here..."
                    className='w-full p-3 border rounded-md'
                />
                <button type="submit" className='bg-blue-600 text-white rounded-md p-2'>
                    POST
                </button>
            </form>
        </div>
    );
};

export default Post;
```

## Using Redux in Components

### Basic Usage

```typescript
'use client'
import { useDispatch, useSelector } from 'react-redux'
import { countIncrement, countDecrement } from '@/lib/features/handleCounter'

const Counter = () => {
  const count = useSelector((state: any) => state.counterData.count);
  const dispatch = useDispatch();

  return (
    <div>
      <button onClick={() => dispatch(countIncrement())}>+</button>
      <span>{count}</span>
      <button onClick={() => dispatch(countDecrement())}>-</button>
    </div>
  );
};
```

### API Usage with createAsyncThunk

```typescript
'use client'
import { apiUsers } from '@/lib/features/handleUsers';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

const Users = () => {
  const dispatch = useDispatch();
  const {users, isLoading, error} = useSelector((state: any) => state.userData);

  useEffect(() => {
    dispatch(apiUsers() as any);
  }, [dispatch]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      {users.map((user: any) => (
        <div key={user.id}>
          <h3>{user.name}</h3>
          <p>{user.phone}</p>
        </div>
      ))}
    </div>
  );
};
```

## Custom Middleware

### Logger Middleware (`lib/middlewares/logger.js`)

```javascript
const logger = store => next => action => {
    const currentState = store.getState();
    console.log("Current State => ", currentState);
    console.log("Action => ", action);

    const result = next(action);

    console.log("Updated State => ", store.getState());

    return result;
};

export default logger;
```

## localStorage Integration

### Save and Load State

```typescript
'use client'
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setCount } from '@/lib/features/handleCounter';
import { setEmployees } from '@/lib/features/handlingEmployee';

const PersistentComponent = () => {
  const dispatch = useDispatch();
  const count = useSelector((state: any) => state.counterData.count);
  const employees = useSelector((state: any) => state.employeeData.employees);

  // Load from localStorage on mount
  useEffect(() => {
    const savedCount = localStorage.getItem("count");
    if (savedCount) dispatch(setCount(savedCount));

    const savedEmployees = localStorage.getItem("employee");
    if (savedEmployees) dispatch(setEmployees(JSON.parse(savedEmployees)));
  }, [dispatch]);

  // Save to localStorage on state change
  useEffect(() => {
    localStorage.setItem("count", count.toString());
  }, [count]);

  useEffect(() => {
    localStorage.setItem("employee", JSON.stringify(employees));
  }, [employees]);

  return <div>Persistent Component</div>;
};
```

## Project Structure

```
├── app/
│   ├── posts/
│   │   ├── [id]/page.tsx      # Single post with comments
│   │   └── page.tsx           # All posts listing
│   ├── counter/page.tsx       # Counter component
│   ├── users/page.tsx         # API users component
│   ├── layout.tsx             # Root layout with provider
│   ├── page.tsx               # Home page
│   └── storeProvider.tsx      # Redux provider
├── components/
│   ├── addEmployee/
│   └── showEmployee/
├── lib/
│   ├── features/
│   │   ├── api/
│   │   │   └── handleApi.js   # RTK Query API
│   │   ├── handleCounter.js
│   │   ├── handleUsers.js
│   │   └── handlingEmployee.js
│   ├── middlewares/
│   │   └── logger.js          # Custom middleware
│   └── store.ts
```

## Key Concepts

- **Store**: Central state container that holds all application state
- **Slice**: Feature-based state logic that contains reducers and actions
- **Actions**: Plain objects that represent state change triggers
- **Reducers**: Pure functions that specify how state changes in response to actions
- **useSelector**: Hook to read/access state from the store
- **useDispatch**: Hook to dispatch actions to the store
- **createAsyncThunk**: Handle asynchronous operations like API calls
- **RTK Query**: Powerful data fetching and caching solution
- **RTK Mutation**: Handle POST, PUT, DELETE operations
- **Middleware**: Functions that intercept and process actions
- **localStorage**: Browser storage for persisting state data

## RTK Query vs createAsyncThunk

| Feature | RTK Query | createAsyncThunk |
|---------|-----------|------------------|
| Caching | Built-in automatic caching | Manual caching required |
| Loading states | Auto-generated | Manual handling |
| Error handling | Built-in | Manual error handling |
| Refetching | Automatic refetching | Manual refetch logic |
| Best for | API-heavy applications | Simple async operations |

## Running the Project

```bash
npm run dev
```

Navigate to:
- `/` - Employee management
- `/counter` - Counter functionality  
- `/users` - API data fetching with createAsyncThunk
- `/posts` - Posts listing with RTK Query
- `/posts/[id]` - Single post with RTK Mutation