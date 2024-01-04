// import React from 'react'
import { Outlet, NavLink} from "react-router-dom"
import "./auth.css"
import authImage from "../assets/images/auth.jpg"

export default function Auth() {
    interface style{
        // backgroundColor: string
        borderBottom: string
    }
    const activeStyle: style = {
        // backgroundColor: "#543EE0",
        borderBottom: "5px solid #543EE0",
    }

  return (
    <main className="authContainer">
        <section className="authimage">
            <img src={authImage} alt="" className="authimage_img"/>
            <div className="imagetext">
                <h1><sup>vader </sup>CHATTER</h1>
                <p>Unleash the power of words, connect with like-minded readers and writers</p>
            </div>
        </section>
        <section className="authdetails">
            <article className="authentication">
                <div className="authHead">
                    <NavLink to={"/auth"} className="register"
                    style={({isActive})=> (isActive? activeStyle: undefined)}end>Register</NavLink>
                    <NavLink to={"/auth/login"} className="Login"
                    style={({isActive})=> (isActive? activeStyle: undefined)}>Login</NavLink>
                </div>
                <div className="authbody">
                <Outlet/>
                </div>
            </article>
        </section>
    </main>
  )
}
