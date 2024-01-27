import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import Auth from './auth/auth.tsx'
import Register from './auth/register.tsx'
import Login from './auth/login.tsx'
import Layout from './main/layout/layout.tsx'
import { Provider } from 'react-redux'
import {store, persistor} from './app/store.ts'
import { PersistGate } from 'redux-persist/integration/react';
import './index.css'
import {
  createBrowserRouter,
  RouterProvider,
  redirect
} from "react-router-dom";
import Feed from './main/feed/feed.tsx'
import {auth} from './main/firebase/firebaseConfig.ts'
import Animate from './assets/component/animate.tsx'
import FullFeed from './main/feed/fullFeed.tsx'
import Bookmarks from './main/bookmarks/bookmarks.tsx'
import Authentication from './auth/Authentication.tsx'
import Account from './main/account/account.tsx'
import NewFeed from './main/feed/newFeed.tsx'
import Draft from './main/drafts/draft.tsx'

const router = createBrowserRouter(
  [
{
  path: "/",
  element: <Animate name="Animate">
    <App />
  </Animate>,
  // loader: () => {
  //   if(auth.currentUser){
  //     return redirect('/home')
  //   }
  //   return null
  // }
},
{
  path: "/auth",
  element: <Animate name='Animate'><Auth /></Animate>,
  loader: () => {
    if(auth.currentUser){
      return redirect("/home")
    }
    return null
  },
  children: [
    { 
      index: true,
      element: <Animate name='Animate'><Register /></Animate>,
    },
    {
      path: "/auth/login",
      element: <Animate name='Animate'><Login /></Animate>,
    }
  ],

},
{
  path: "/home",
  element: <Authentication name='authenticate'><Animate name='Animate'><Layout/></Animate></Authentication>,
  children: [
    {
      index: true,
      element: <Animate name='Animate'><Feed /></Animate>,
    },
    {
      path: "/home/feed/:id",
      element: <FullFeed/>
    },
    {
      path: "/home/bookmarks",
      element: <Bookmarks />
    },
    {
      path: "/home/teamblogs",
      element: <div>Blogs</div>
    },
    {
      path: "/home/drafts",
      element: <Draft />
    },
    {
      path: "/home/analytics",
      element: <div>Analytics</div>
    },
    {
      path: "/home/account",
      element: <Account/>
    },
    {
      path: "/home/notifications",
      element: <div>Notifications</div>
    },
    {
      path: '/home/newfeed',
      element: <NewFeed/>
    }
  ]
}
]
)

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
      <RouterProvider router={router}/>
      </PersistGate>
    </Provider>
   
  </React.StrictMode>,
)
