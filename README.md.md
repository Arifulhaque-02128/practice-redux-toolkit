# Redux Toolkit with Next.js 15.3.5

Learn Redux Toolkit implementation with Next.js, featuring state management, API calls, and localStorage integration.

## Installation

```bash
npm install @reduxjs/toolkit react-redux
```

## Setup

### 1. Configure Store (`lib/store.ts`)

```typescript
import { configureStore } from "@reduxjs/toolkit";
import EmployeeReducer from "./features/handlingEmployee";
import CounterReducer from "./features/handleCounter";
import UserReducer from "./features/handleUsers";

export const store = configureStore({
  reducer: {
    employeeData: EmployeeReducer,
    counterData: CounterReducer,
    userData: UserReducer
  }
});
```

### 2. Create Store Provider (`app/storeProvider.tsx`)

```typescript
'use client'
import { store } from '@/lib/store'
import { Provider } from 'react-redux'

export default function StoreProvider({children}: {children: React.ReactNode}) {
  return <Provider store={store}>{children}</Provider>
}
```

### 3. Wrap Layout (`app/layout.tsx`)

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

### API Usage

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
│   ├── counter/page.tsx      # Counter component
│   ├── users/page.tsx        # API users component
│   ├── layout.tsx            # Root layout with provider
│   ├── page.tsx              # Home page
│   └── storeProvider.tsx     # Redux provider
├── components/
│   ├── addEmployee/
│   └── showEmployee/
├── lib/
│   ├── features/
│   │   ├── handleCounter.js
│   │   ├── handleUsers.js
│   │   └── handlingEmployee.js
│   └── store.ts
```

## Key Concepts

- **Store**: Central state container
- **Slice**: Feature-based state logic
- **Actions**: State change triggers
- **Reducers**: State update functions
- **useSelector**: Read state from store
- **useDispatch**: Send actions to store
- **createAsyncThunk**: Handle async operations
- **localStorage**: Persist state data

## Running the Project

```bash
npm run dev
```

Navigate to:
- `/` - Employee management
- `/counter` - Counter functionality  
- `/users` - API data fetching