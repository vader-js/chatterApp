import { onAuthStateChanged } from 'firebase/auth';
import { PropsWithChildren, useEffect, useState } from 'react'
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
        onAuthStateChanged(auth, (authUser) => {
          if (authUser) {
            const {email, uid} = authUser;
            setUserAuth(true)
            dispatch(setUser({email,uid}))
          } else {
            setUserAuth(false);
            navigate('/');
          }
        });
    
        // return () => unsubscribe();
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
