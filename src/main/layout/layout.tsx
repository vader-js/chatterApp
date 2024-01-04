// import React from 'react'
import { useEffect, useState} from "react"
import Sidebar from "./sidebar/sidebar"
import { Outlet, useNavigate } from "react-router-dom"
import { auth } from "../firebase/firebaseConfig"
import { ProfileCircle, Notification, SearchNormal1 } from "iconsax-react"
import {motion} from 'framer-motion'
import "./layout.css"
import { useSelector } from "react-redux/es/hooks/useSelector"
import { db } from "../firebase/firebaseConfig"
import { collection, getDocs, query, where} from "firebase/firestore"
import { setUser, setUserProfileImage, setUserRef } from "../../app/authSlice"
import { useDispatch } from "react-redux"
import { onAuthStateChanged } from "firebase/auth"
import {  useDownloadProfileImage } from "../Helpers/hooks"
import Socials from "./socials"


export default function Layout() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [currentUser, setCurrentUser]= useState<any>([])
  const [displayName, setDisplayName] = useState('')
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
      console.log(currentUser)
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
            <article className="layoutContent">
                <Outlet/>
            </article>
              <section className="layoutRight">
          <Socials/>
        </section>
            </section>
           
      
      
        </section>
    </motion.main>
  )
}
