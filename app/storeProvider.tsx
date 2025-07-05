'use client'
import { store } from '@/lib/store'
import { Provider } from 'react-redux'

export default function StoreProvider({children} : { children: React.ReactNode }) : any {
  return <Provider store={store}>
    {children}
  </Provider>
}
