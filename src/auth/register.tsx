// import React from 'react'
import { useState} from 'react'
import google from "../assets/images/google.png"
import "./auth.css"
import { auth, provider} from "../main/firebase/firebaseConfig"
import {signInWithPopup} from 'firebase/auth'
import {createUserWithEmailAndPassword} from 'firebase/auth'
import { useNavigate } from "react-router-dom"
import { useDispatch } from "react-redux"
import { setUser, setUserRef } from "../app/authSlice"
import { db } from '../main/firebase/firebaseConfig'
import { collection, addDoc } from 'firebase/firestore'
import { Button, notification } from 'antd'
import { MdOutlineVisibility, MdOutlineVisibilityOff } from "react-icons/md";


export default function Register() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
   
    // create database for users in firestore
    const userCollectionRef = collection(db, "users")
    // console.log(user);
    const [errorMessage, setErrorMessage] = useState("")
    const [userProfile, setUserProfile] = useState({
        fName: "",
        lName: "",
        title: "",
        email: "",
        password: "",
        Cpassword: "",
    })
    const [p_type, set_p_type] = useState({
        pword: false,
        c_pword: false,
    })
    const [loading, setloading] = useState(false)

    const handleShowPassword = ()=>{

        set_p_type((prev)=>({
            ...prev,
            pword: !p_type.pword
        }))
    }
    const handleShowCPassword = ()=>{

        set_p_type((prev)=>({
            ...prev,
            c_pword: !p_type.c_pword
        }))
    }

    const handleProfile = (e: React.FormEvent<HTMLInputElement>) => {
        e.preventDefault();
        let inputs = {[e.currentTarget.name]: e.currentTarget.value}
        setUserProfile({
            ...userProfile,
            ...inputs
        })
    }
    const handleSelect = (e: React.FormEvent<HTMLSelectElement>) => {
        e.preventDefault();
        let select = {[e.currentTarget.name]: e.currentTarget.value}
        setUserProfile({
            ...userProfile,
            ...select
        })
    }
    
    const handleSubmit = async (e: React.MouseEvent<HTMLElement>)=> {
        e.preventDefault();
        setloading(true);
        if(userProfile.password !== userProfile.Cpassword){
            setErrorMessage("passwords do not match")
        }else{
          await createUserWithEmailAndPassword(auth, userProfile.email, userProfile.password)
            .then((result)=> {
                const {user:{ email, uid}, } = result
                const fullName = userProfile.fName + " " + userProfile.lName
                const title = userProfile.title
                dispatch(setUser({fullName, email, uid, title}))
    
                const createUser = async ()=>{
                  let userRef =  await addDoc(userCollectionRef, {
                        fullName,
                        email,
                        uid,
                        title
                    })
                  const userRefId = userRef.id
                  console.log({userRefId})
                  dispatch(setUserRef(userRefId))
                  return userRef
                }
                createUser();
                setloading(false);
                notification.success({
                    message: 'Success',
                    description: 'Account created successfully',
                });
             setTimeout(() => {
                navigate("/home");
             }, 4000);
             setloading(false);
            }
            )
            .catch((error)=> {
                switch (error.code) {
                    case "auth/email-already-in-use":
                        setErrorMessage("Email already in use");
                        notification.error({
                            message: 'Error',
                            description: "Email already in use",
                        });
                        break;
                    case "auth/invalid-email":
                        setErrorMessage( "Invalid email");
                        notification.error({
                            message: 'Error',
                            description: "Invalid email",
                        });
                        break;
                    case "auth/weak-password":
                        setErrorMessage( "Weak password");
                        notification.error({
                            message: 'Error',
                            description: "Weak password",
                        });
                        break;
                    case 'auth/operation-not-allowed':
                        setErrorMessage( "Operation not allowed")
                        notification.error({
                            message: 'Error',
                            description: "Operation not allowed",
                        });
                        break
                    default:
                        setErrorMessage( "Something went wrong");
                        notification.error({
                            message: 'Error',
                            description: "Something went wrong",
                        });
                        break;
                }
                setloading(false);
                return
            })
        }
    }


    const signInWithGoogle = ()=>{
        signInWithPopup(auth, provider).then((result)=> {
            const {user:{ displayName:name, email, uid}, } = result
            dispatch(setUser({name, email, uid}))
            navigate("/home")
        })
    }
  return (
    <main className="registerContainer">
        <h1 className="registerHead">Register as a  Writer/Reader</h1>
        <form action="" className="registerForm">
            <div className="registerName">
                <div className="first">
                <label htmlFor="fName"> First name</label>
                <input type="text" placeholder="John" id="fName" name="fName" required value={userProfile.fName} onChange={(e)=> handleProfile(e)}/></div>
                <div className="last">
                <label htmlFor="fName"> Last name</label>
                <input type="text" placeholder="Doe" id="lName" name="lName" required value={userProfile.lName} onChange={(e)=> handleProfile(e)}/></div>
            </div>
            <div className="selector">
            <label htmlFor="title" >You are joining as?</label>
            <select name="title" id="" value={userProfile.title} onChange={(e)=> handleSelect(e)} required>
                <option value="Select">Select title</option>
                <option value="Writer">Writer</option>
                <option value="Reader">Reader</option>
            </select>
            </div>
            <div className="email">
                <label htmlFor="email" className="emaillabel">Email address</label>
                <input type="email" name="email" id="email" required value={userProfile.email} onChange={(e)=> handleProfile(e)}/>
            </div>
            <div className="password">
                <label htmlFor="password">Password</label>
                <span className='password_toggle'>
                <input type={p_type.pword? 'text': 'password'} name="password" id="password" required value={userProfile.password} onChange={(e)=> handleProfile(e)}/>
                <span className='password_vis_toggle' onClick={handleShowPassword}>{p_type.pword? <MdOutlineVisibility />: <MdOutlineVisibilityOff />}</span>
                </span>
                {/* <div className="checkpassword_register">
            <input type="checkbox" name="pword" id="pword_check" checked={p_type.pword} onChange={(e)=> handleShowPassword(e)} />
            <label htmlFor="pword" className="pword_pcheck"> show password</label> 
            </div> */}
            </div>
            <div className="Cpassword">
                <label htmlFor="Cpassword">Confirm password</label>
                <span className='Cpassword_toggle'>
                <input type={p_type.c_pword? 'text': 'password'} name="Cpassword" id="Cpassword" required value={userProfile.Cpassword} onChange={(e)=> handleProfile(e)}/>
                <span className='Cpassword_vis_toggle' onClick={handleShowCPassword}>{p_type.c_pword? <MdOutlineVisibility />: <MdOutlineVisibilityOff />}</span>
                </span>
            </div>
            <Button loading={loading} onClick={(e)=> handleSubmit(e)} className='register_button'>
            Create account
        </Button>
        </form>
        <button className="googleRegister" onClick={() => signInWithGoogle()}>
            <span><img src={google} alt="google" /></span>
            Sign Up with Google
        </button>
    </main>
  )
}
