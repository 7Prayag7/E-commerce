import React, { useState } from 'react'
import './CSS/LoginSignup.css';

const LoginSignup = () => {
  const [state, setState] = useState("Login");
  const [formData,setFormData] = useState({
    "username": "",
    "password": "",
    "email": ""
  })

  const changeHandler = (evt)=>{
    setFormData({
      ...formData, [evt.target.name]: evt.target.value
    })
  }
  const login = async()=>{
    console.log("login executed",formData);
    let responseData;
    await fetch('http://localhost:4000/login', {
      method: 'POST',
      headers: {
        accept: 'application/form',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData) ,
    }).then((response)=>response.json()).then((data)=> responseData=data)
    if(responseData.success){
      localStorage.setItem('auth-token', responseData.token);
      window.location.replace("/");
    }
    else{
      alert(responseData.errors)
    }
  }
  const signup = async()=>{
    console.log("sign up executed" ,formData);    
    let responseData;
    await fetch('http://localhost:4000/signup', {
      method: 'POST',
      headers: {
        accept: 'application/form',
        'Content-Type': 'application/json', //application/form likha tha json kiya h meine
      },
      body: JSON.stringify(formData) ,
    }).then((response)=>response.json()).then((data)=> responseData=data)
    if(responseData.success){
      localStorage.setItem('auth-token', responseData.token);
      window.location.replace("/");
    }
    else{
      alert(responseData.errors)
    }
  }

  return (
    <div className='loginsignup'>
      <div className="loginsignup-container">
        <h1>{state}</h1>
        <div className="loginsignup-fields">
          {state ==="Sign Up" ? <input type='text' name='username' value={formData.username} onChange={(changeHandler)} placeholder='Your Name'/> : <></>}
          <input type='email' name='email' value={formData.email} onChange={changeHandler} placeholder='Email Address'/>
          <input type='password' name='password' value={formData.password} onChange={changeHandler} placeholder='Password'/>
        </div>
        <button onClick={()=> {state==="Login"? login() : signup()}}>Continue</button>
        {state === "Sign Up" 
        ? <p className="loginsignup-login">Already have an account<span onClick={()=>{ setState("Logib ")}}>Login here</span></p> 
        : <p className="loginsignup-login">Create an account<span onClick={()=>{ setState("Sign Up")}}>Click here</span></p> }
        <div className="loginsignup-agree">
          <input type='checkbox' name='' id=''/>
          <p>By continuing, I agree to the terms of use and privacy
          </p>
        </div>
      </div>
    </div>
  )
}

export default LoginSignup
