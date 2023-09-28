import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import Auth from './auth/auth.tsx'
import Register from './auth/register.tsx'
import Login from './auth/login.tsx'
import Layout from './main/layout/layout.tsx'
import { Provider } from 'react-redux'
import store from './app/store.ts'
import './index.css'
import {
  createBrowserRouter,
  RouterProvider,
  redirect
} from "react-router-dom";
import Feed from './main/feed/feed.tsx'
import {auth} from './main/firebase/firebaseConfig.ts'
import Animate from './assets/component/animate.tsx'

const router = createBrowserRouter(
  [
{
  path: "/",
  element: <Animate name="Animate">
    <App />
  </Animate>,
  loader: () => {
    if(auth.currentUser || sessionStorage.getItem('user')){
      return redirect('/home')
    }
    return null
  }
},
{
  path: "/auth",
  element: <Animate name='Animate'><Auth /></Animate>,
  loader: () => {
    if(auth.currentUser && sessionStorage.getItem("user")){
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
  element: <Animate name='Animate'><Layout/></Animate>,
  loader: ()=>{
    if(!auth.currentUser && !sessionStorage.getItem("user")){
      return redirect("/")
    }
    return null
  },
  children: [
    {
      index: true,
      element: <Animate name='Animate'><Feed /></Animate>,
    },
    {
      path: "/home/bookmarks",
      element: <div>Bookmarks</div>
    },
    {
      path: "/home/teamblogs",
      element: <div>Blogs</div>
    },
    {
      path: "/home/drafts",
      element: <div>Drafts</div>
    },
    {
      path: "/home/analytics",
      element: <div>Analytics</div>
    },
    {
      path: "/home/account",
      element: <div>Account</div>
    },
    {
      path: "/home/notifications",
      element: <div>Notifications</div>
    }
  ]
}
]
)

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Provider store={store}>
    <RouterProvider router={router}/>
    </Provider>
   
  </React.StrictMode>,
)
