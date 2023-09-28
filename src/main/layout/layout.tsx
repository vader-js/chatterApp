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
import { setUser, setUserRef } from "../../app/authSlice"
import { useDispatch } from "react-redux"


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
    }
  }
  type userState = {
    user: User
  }

  
  const {user} = useSelector((state: userState) => state.user )

  //if Login was used, get full user details from firestore
  const getUserCollectionRef = collection(db, 'users')
  
  useEffect(() => {
    if (!auth.currentUser && !sessionStorage.getItem("user")) {
      navigate("/auth")
    }
  },[auth])

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
      dispatch(setUser(...currentUser))}
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
             
            <div className="profile" >
              <span className="notification">
                <Notification size="21"/>
              </span>
                <ProfileCircle size="40"/>
                <span className="profileName">Hi, {displayName? displayName : null}</span>
            </div>
            
            </div>
            <article className="layoutContent">
                <Outlet/>
            </article>
        </section>
        <section className="layoutRight">
          
        </section>
    </motion.main>
  )
}
