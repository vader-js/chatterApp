import React, {useState} from 'react'
import {signInWithEmailAndPassword} from "firebase/auth"
import {auth} from '../main/firebase/firebaseConfig'
import { useDispatch, useSelector } from 'react-redux'
import { setUser, validateUser } from '../app/authSlice'
import { useNavigate } from 'react-router-dom'
import {Button, notification } from 'antd';



export default function Login() {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [loading, setloading] = useState(false);
    const [p_type, set_p_type] = useState(false);

    const {
        user: {
         error_message
        },
      } = useSelector((state: any) => state.reducer.user);

    const [userLogIn, setUserLogIn] = useState({
        email: "",
        pword: "",
    })
    const handleInputs = (e: React.FormEvent<HTMLInputElement>)=>{
        e.preventDefault();
        dispatch(validateUser({email:'', password: ''}))
        let inputs = {[e.currentTarget.name]: e.currentTarget.value}
        setUserLogIn({
            ...userLogIn,
            ...inputs
        })
    }
    // const isPasswordStrong = (password: any) => {
    //     // Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character
    //     const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    
    //     return passwordRegex.test(password);
    // };
  
    const handleLogIn = async (e: React.MouseEvent<HTMLElement>)=>{
        e.preventDefault();
        setloading(true);
        if(!userLogIn.email || !userLogIn.pword){
                dispatch(validateUser({email: userLogIn.email? '': 'please provide email', password: userLogIn.pword? '': 'please provide password'}))  
                setloading(false);
                return ;
        }
        // if (!isPasswordStrong(userLogIn.pword)) {
        //     // Handle case where password does not meet the strength requirements
        //     dispatch(validateUser({password:'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.'}))  
        //     setloading(false);
        //     return;
        // }
      
            await signInWithEmailAndPassword(auth, userLogIn.email, userLogIn.pword)
             .then((result)=> {
                 const {user:{email, uid}} = result;
                 
                 dispatch(setUser({email, uid}));
                 setloading(false);
                 notification.success({
                     message: 'Success',
                     description: 'User logged in successfully',
                 });
              setTimeout(() => {
                 navigate("/home");
              }, 4000);
             })
             .catch((error)=> {
                 setloading(false)
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
                <label htmlFor="email" className="emaillabel">Email address <span>&#42;</span> <span className="validate_message">{error_message?.email? error_message.email : ''}</span></label>
                <input type="email" name="email" id="" value={userLogIn.email}  onChange={(e)=> handleInputs(e)}/>
            </div>
            <div className="loginPassword">
                <label htmlFor="pword" className="passwordlabel">Password <span>&#42;</span><span className="validate_message">{error_message?.password? error_message.password : ''}</span></label>
                <input type={p_type ? 'text' : 'password'} name="pword" id="pword" value={userLogIn.pword} onChange={(e)=> handleInputs(e)} />
               
            </div>
            <div className="checkpassword">
            <input type="checkbox" name="pcheck" id="pcheck" checked={p_type} onChange={()=> set_p_type(!p_type)} />
            <label htmlFor="pcheck" className="passwordcheck"> show password</label> 
            </div>
            {/* <input type="submit" value="Log in" onClick={(e)=> handleLogIn(e)}/> */}
            <Button loading={loading} onClick={(e)=> handleLogIn(e)} className='login_button'>
            Log in
        </Button>
        </form>
    </main>
  )
}
