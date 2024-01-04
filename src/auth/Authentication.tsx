import { onAuthStateChanged } from 'firebase/auth';
import React, { PropsWithChildren, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { auth } from '../main/firebase/firebaseConfig';
import { useDispatch } from 'react-redux';
import { setUser } from '../app/authSlice';

type AuthenticateProps ={
    name: "authenticate"
}

export default function Authentication({children}: PropsWithChildren<AuthenticateProps>) {
   
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [userAuth, setUserAuth]  = useState(false)
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (authUser) => {
          if (authUser) {
            const {email, uid} = authUser;
            setUserAuth(true)
            console.log({email, uid})
            dispatch(setUser({email,uid}))
            console.log({authUser})
          } else {
            setUserAuth(false);
            navigate('/');
          }
        });
    
        return () => unsubscribe();
      }, [userAuth, navigate]);
  return (
    <div>
        {
            userAuth ? children :
            null
        }
        
    </div>
  )
}
