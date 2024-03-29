// import React from 'react'
import { FtxToken, Bookmark, People, MessageText1, Activity, TrendUp, Notification, User } from "iconsax-react"
import { NavLink, useNavigate } from "react-router-dom"
import {signOut} from "firebase/auth"
import {auth} from '../../firebase/firebaseConfig'
import {removeUser} from "../../../app/authSlice" 
import { useDispatch } from "react-redux"
import "./sidebar.css"
import { Popconfirm } from "antd"
import { persistor } from "../../../app/store"
// import { TiCancelOutline } from "react-icons/ti";

export default function Sidebar() {

  const dispatch = useDispatch();
  const navigate = useNavigate()

  interface style{
    color: string
}
const active: style = {
    color: "#543EE0",
}

const handleSignOut= async ()=>{
  await signOut(auth);
  dispatch(removeUser());
  persistor.purge();
  navigate('/')
}
const confirm = async ()=>{
 await handleSignOut();
}
// const sidebar_close =  ()=>{
//   const sidebarRef = document.getElementById('responsive_sidebar');
//   if (sidebarRef) {
//     sidebarRef.classList.remove('sidebarVisible');
//   }
// }
  return (
    <main className="sidebarContainer">
        <div className="sidebarHead">
            <h1><sup>vader</sup> Chatter</h1>
           {/* <span className="sidebar_cancel" onClick={sidebar_close}><TiCancelOutline size='22' /></span> */}
        </div>
        <p className="sidebarPar">
          Overview
        </p>
        
        <ul className="sidebarBody">
            <li className="sidebarText">
              <NavLink to="/home"
              className="sideLink"
              style={({isActive}) => (isActive? active: undefined)}
              end>
              <span><FtxToken size={20}/></span> Feed
              </NavLink>
              </li>
              <li className="sidebarText">
              <NavLink to="/home/bookmarks"
              className="sideLink"
              style={({isActive}) => (isActive? active: undefined)}>
              <span><Bookmark size={20}/></span> Bookmarks
              </NavLink>
              </li>
              <li className="sidebarText">
              <NavLink to="/home/teamblogs"
              className="sideLink"
              style={({isActive}) => (isActive? active: undefined)}>
              <span><People size={20}/></span> Team blogs
              </NavLink>
              </li>
              <li className="sidebarText">
              <NavLink to="/home/drafts"
              className="sideLink"
              style={({isActive}) => (isActive? active: undefined)}>
              <span><MessageText1 size={20}/></span> Drafts
              </NavLink>
              </li>
              <li className="sidebarText">
              <NavLink to="/home/analytics"
              className="sideLink"
              style={({isActive}) => (isActive? active: undefined)}>
              <span><Activity size={20}/></span> Analytics
              </NavLink>
              </li>
        </ul>
        <p className="sidebarPar trend">
          Trending Tags <span className="trendIcon"> <TrendUp size="20"/></span>
        </p>
        <ul className="trending">
          <li className="trendText">
            Programming
          </li>
          <li className="trendText">
            Data Science
          </li>
          <li className="trendText">
            Technology
          </li>
          <li className="trendText">
            Machine Learning
          </li>
          <li className="trendText">
            Politics
          </li>
          <li className="trendText all">
            see all
          </li>
        </ul>
        
        <p className="sidebarPar">
          Personal
        </p>
        <ul className="sidebarBody personal">
        <li className="sidebarText">
              <NavLink to={"/home/account"}
              className="sideLink"
              style={({isActive}) => (isActive? active: undefined)}>
              <span><User size="20"/></span> Account
              </NavLink>
              </li>
              <li className="sidebarText">
              <NavLink to={"/home/notifications"}
              className="sideLink"
              style={({isActive}) => (isActive? active: undefined)}>
              <span><Notification size={20}/></span> Notification
              </NavLink>
              </li>
              <li className="sidebarText log">
              <Popconfirm
        placement="top"
        title="Log out?"
        description='Are you sure you want to log out'
        onConfirm={async()=> await confirm()}
        okText="Yes"
        cancelText="No"
      >
              Log out
              </Popconfirm>
              </li>
              
        </ul>
        
    </main>
  )
}
