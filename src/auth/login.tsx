import React, {useState} from 'react'
import {signInWithEmailAndPassword} from "firebase/auth"
import {auth} from '../main/firebase/firebaseConfig'
import { useDispatch } from 'react-redux'
import { setUser } from '../app/authSlice'
import { useNavigate } from 'react-router-dom'
import {notification } from 'antd';


export default function Login() {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [userLogIn, setUserLogIn] = useState({
        email: "",
        pword: "",
    })
    const handleInputs = (e: React.FormEvent<HTMLInputElement>)=>{
        e.preventDefault();
        let inputs = {[e.currentTarget.name]: e.currentTarget.value}
        setUserLogIn({
            ...userLogIn,
            ...inputs
        })
    }
  
    const handleLogIn = async (e: React.MouseEvent<HTMLElement>)=>{
        e.preventDefault();
       await signInWithEmailAndPassword(auth, userLogIn.email, userLogIn.pword)
        .then((result)=> {
            const {user:{email, uid}} = result;
            
            dispatch(setUser({email, uid}));
            notification.success({
                message: 'Success',
                description: 'User logged in successfully',
            });
         navigate("/home");
        })
        .catch((error)=> {
            console.log({error})
            notification.error({
                message: 'Error',
                description: `${error?.code}`,
            });
        })
    }
  return (
    <main className="loginContainer">
        <h1 className="loginHead">
            Welcome Back
        </h1>
        <form action="" className="loginForm">
            <div className="loginEmail">
                <label htmlFor="email" className="emaillabel">Email address</label>
                <input type="email" name="email" id="" value={userLogIn.email}  onChange={(e)=> handleInputs(e)}/>
            </div>
            <div className="loginPassword">
                <label htmlFor="pword" className="passwordlabel">Password</label>
                <input type="password" name="pword" id="pword" value={userLogIn.pword} onChange={(e)=> handleInputs(e)} />
            </div>
            <input type="submit" value="Log in" onClick={(e)=> handleLogIn(e)}/>
        </form>
    </main>
  )
}
