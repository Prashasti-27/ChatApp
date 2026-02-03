import React, { useState } from 'react'
import assets from '../assets/assets'


const LoginPage = () => {

const [currState,setcurrState] =useState("Sign up")
const [fullName ,setfullName] =useState("")
const [email ,setEmail] =useState("")
const [password,setPassword] =useState("")
const  [bio, setBio] =useState("")
const  [isDataSubmitted, setIsDataSubmitted] =useState(false);


  const onSubmitHandler = (event) => {
    event.preventDefault();

    if(currState=== "Sign up" && !isDataSubmitted){
      setIsDataSubmitted(true)
      return;
    }
    
  }


  return (
    <div className='min-h-screen bg-cover items-center justify-center gap-80 px-12 sm-justify-evenly max-sm:flex-col backdrop-blur-2xl flex'>
      {/* ------left---------- */}
      <img src={assets.logo_big} alt="" className='w-[min(30vw,250px)]' />

      {/* --Right---- */}
      
      <form onSubmit={onSubmitHandler} className='border-6 bg-white/8 text-white border-gray-500 p-8 px-5 flex flex-col gap-6 rounded-lg shadow-lg w-[400px] max-w-full'>
        <h2 className='font-medium text-2xl flex justify-between items-center' >
          {currState} 
          { currState ==="Sign up" && isDataSubmitted && ( <img onClick={()=> setIsDataSubmitted(false)} src= {assets.arrow_icon} alt="back" className='w-5 cursor-pointer'/> )}
         
          </h2>

          {currState=== "Sign up" && !isDataSubmitted && (
          <input onChange={(e)=> setfullName(e.target.value)} value={fullName}
             type="text" className='p-2 border border-gray-500 rounded-md focus:outline-none ' placeholder='Full Name' required />
        )}
          
          {!isDataSubmitted && (
            <>
            <input onChange={(e)=> setEmail(e.target.value)} value={email}
            type="email" placeholder='Email address' required className='p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500' />

             <input onChange={(e)=> setPassword(e.target.value)} value={password}
            type="password" placeholder='Password' required className='p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500' />

            </>
          )}

         {
  currState === "Sign up" && isDataSubmitted && (
    <textarea
      onChange={(e) => setBio(e.target.value)}
      value={bio}
      rows={4}
      className="p-2 border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
      placeholder="provide a short bio......"
      required
    />
  )
}

          <button type='submit' className='py-3 bg-gradient-to-r from purple-400 to-violet-600 cursor-pointer'>
            {currState=== "Sign up" ? "Create Account" : "Login Now"}
          </button>

          <div  className='flex items-center gap-2 text-md text-gray-500 '>
          <input type="checkbox" name="" id="" />
          <p>Agree to the terms and conditions</p>
          </div>


            <div className='flex flex-col'>
              {currState === "Sign up" ? (
                <p className='text-sm text-gray-500'> Already have an account? 
                  <span onClick={() => {setcurrState("Login"); setIsDataSubmitted(false)}} className='font-medium text-violet-500 cursor-pointer'> Login here</span>
                </p> 
              ) : (
                <p className='text-sm text-gray-500'>Create an account 
                <span onClick={()=>  setcurrState("Sign up")} className='font-medium text-violet-500 cursor-pointer'>Click here</span></p>
              )}
            </div>
      </form>
      
    </div>
  )
}

export default LoginPage
