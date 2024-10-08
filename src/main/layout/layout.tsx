// import React from 'react'
import { useEffect, useState} from "react"
import Sidebar from "./sidebar/sidebar"
import { Outlet, useNavigate } from "react-router-dom"

import { ProfileCircle, Notification, SearchNormal1 } from "iconsax-react"
import {motion} from 'framer-motion'
import "./layout.css"
import { useSelector } from "react-redux/es/hooks/useSelector"
import { db } from "../firebase/firebaseConfig"
import { collection, getDocs, query, where} from "firebase/firestore"
import { setUser, setUserProfileImage, setUserRef } from "../../app/authSlice"
import { useDispatch } from "react-redux"

import {  useDownloadProfileImage } from "../Helpers/hooks"
import Socials from "./socials"
import { ImPlus } from "react-icons/im";
import { getAuth, signOut } from "firebase/auth";


export default function Layout() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [currentUser, setCurrentUser]= useState<any>([])
  const [displayName, setDisplayName] = useState('')
  // const sidebar_ref = useRef()
  type User = {
    user: {
      fullName: string,
      email: string,
      titles?: string
      displayPicture?: string,
      token?: string,
      uid: string,
      profileImage?: string
      headerImage?: string
      userRef?: string,
      page_no?: number,
    }
  }
  type userState = {
    reducer: {
      user: User
    }  
  }

  
  const {user} = useSelector((state: userState) => state.reducer.user )
  

  //if Login was used, get full user details from firestore
  const getUserCollectionRef = collection(db, 'users')

        // download profile image
const {downloadProfileImage} = useDownloadProfileImage();
const INACTIVITY_TIMEOUT: number = 1800000; // e.g., 30 minutes = 1800000 milliseconds
let inactivityTimer: ReturnType<typeof setTimeout>;
const auth = getAuth();

function resetInactivityTimer(): void {
  clearTimeout(inactivityTimer);

  inactivityTimer = setTimeout(() => {
    signOut(auth);
  },INACTIVITY_TIMEOUT) 
}

// List of events that reset the timer
const activityEvents: string[] = ['mousemove', 'keydown', 'click', 'scroll', 'touchstart'];
// Add event listeners to reset the inactivity timer
// Add event listeners to reset the inactivity timer
activityEvents.forEach((event: string) => {
  document.addEventListener(event, resetInactivityTimer);
});

// Ensure that `resetInactivityTimer` runs when the component mounts
useEffect(() => {
  resetInactivityTimer();
}, []);

  useEffect(() => {
    if (!user.fullName){
      const findUserInDatabase = async ()=>{
        const userRef = await getDocs(getUserCollectionRef);
        setCurrentUser(userRef.docs.map((doc)=> ({...doc.data()}))
        .filter((userId)=>  userId.uid === user.uid));
    }
    findUserInDatabase();
    }
  },[user])

  useEffect(() => {
    if (currentUser.length === 1){
      const {fullName, email, uid, title, bio, profession} = currentUser[0]
      dispatch(setUser({fullName, email, uid, title, bio, profession}))}
  },[currentUser]);

  useEffect(()=>{
    if(user){
      const userRef = async()=>{
        const q = query(getUserCollectionRef, where('fullName', '==', user.fullName));
        const querySnapShot = await getDocs(q)
        if (!querySnapShot.empty){
            querySnapShot.forEach((docs)=>{
                dispatch(setUserRef(docs.id)) 
            })
        }
      }
      userRef();
    }
  },[user])
 
  useEffect(() => {
    if (user.fullName){
      setDisplayName(user?.fullName?.split(' ')[0])
    }
  },[user])

  useEffect(() =>{
    const fetchData = async () => {
      if(user.userRef){
        const profile_image = await downloadProfileImage(user.userRef);
        if (profile_image) {
          dispatch(setUserProfileImage(profile_image))
        }
      }
      }
      fetchData();
  },[ user.userRef])
  const sidebar_open = () => {
    const sidebarRef = document.getElementById('responsive_sidebar');
    if (sidebarRef) {
      sidebarRef.classList.toggle('sidebarVisible');
      const option_icon = document.getElementById('option_icon');
      if (option_icon) {
        option_icon.classList.toggle('option_clicked');
      }
    }
  }

  return (
    <motion.main 
    initial={{opacity: 0}}
    animate={{opacity: 1}}
    transition={{duration: 1, delay: 0.5}}
    exit={{opacity: 0}}
    className="layoutContainer">
        <section className="sidebar">
            <Sidebar/>
        </section>
        <section className="layoutBody">
            <div className="layoutHead">
              <div className="search">
                <div className="searchGroup">
                <input type="text" name="" id="" placeholder="search vader-chatter"/>
            <span className="searchIcon">
                <SearchNormal1 size="21"/>
            </span>
                </div>
             
              </div>
             
            <div className="layout_profile" >
              <span className="notification">
                <Notification size="21"/>
              </span>
              <span className="layout_profile_desc">
              <span onClick={()=> navigate('/home/account')}>

              {user.profileImage ? <img src={user.profileImage} alt="" className="layout_profile_image" /> : <ProfileCircle size="40"/>}
              </span>
                
                <span className="profileName">Hi, {displayName? displayName : null}</span>
              </span>
            </div>
            
            </div>
            <section className="layout_main">
              {/* <span className="option" onClick={sidebar_open} id="option_icon"><ImPlus color='white' size='20'/></span> */}
              <div className="responsive_sidebar" id='responsive_sidebar'>
                <Sidebar/>
              </div>
            <article className="layoutContent">
                <Outlet/>
            </article>
              <section className="layoutRight">
          <Socials/>
          
        </section>

            </section>
           
      
      
        </section>
        <span className="option" onClick={sidebar_open} id="option_icon"><ImPlus color='white' size='20'/></span>
    </motion.main>
  )
}
