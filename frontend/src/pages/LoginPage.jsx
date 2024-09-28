import React from 'react'
import {useState,useEffect} from "react"
import { useNavigate } from 'react-router-dom'
import LoginGraphic from "../assets/images/LoginGraphic.png" 

const LoginPage = () => {
    const[EmployeeId,setEmployeeId] = useState('')
    const[Password,setPassword] = useState('')
    const[EmployeeInfo, setEmployeeInfo] = useState(null);

    const navigate = useNavigate()


    useEffect(()=>{
        if(EmployeeInfo)
        navigate('../',{state:EmployeeInfo})
    },[EmployeeInfo])

    const fetchEmployeeinfo = async () => {
        const apiUrl =  "http://localhost:3030/working-arrangements/team/190024"
{
            setEmployeeInfo(EmployeeId);
            console.log(EmployeeInfo)
              setLoading(true);
  
              try{
                const res = await fetch(apiUrl);
                const data = await res.json();
              
                setEmployeeInfo(data);
                setLoading(false); 
      
              } catch(error) {
                  console.log("Error fetching team data", error);
        
              } finally {
                  console.log("We fetched EmployeeInfo");
              }
  
            }
      };

    const submitForm = (e)=>{
        e.preventDefault()
        const Employee ={
            EmployeeId,
            Password,
        };
        setEmployeeInfo({role:EmployeeId});     
        // EmployeeInfo(Employee);

    }   

  return (
    
    <div className="relative flex flex-col justify-center min-h-screen bg-white">    
        <div className="outline outline-1 outline-slate-200 rounded-md shadow-md mx-10">
            <div className='flex flex-col sm:flex-row'>
                
                {/* The left box/image */}
                <div className='relative hidden sm:block sm:w-2/3 bg-slate-400 p-10 glass'>
                    <img
                    className="object-cover w-full h-full pt-2"
                    src={LoginGraphic}
                    alt="React Jobs"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <p className="text-slate-200 text-4xl font-bold text-center px-10">
                            Your companion to arranging your work from home.
                        </p>
                    </div>
                </div>
                
                {/* The right box/forms */}
                <div className='sm:w-1/3 my-auto p-5 py-10 m-5'>
                    {/* The headers */}
                    <h1 className="text-3xl lg:text-7xl text-center text-secondary font-bold hover:animate-pulse">
                        Workwhere
                    </h1>
                    <p className='text-slate-500 text-xs text-center mb-10'>
                        Work anywhere
                    </p>
                    
                    {/* The form */}
                    <form onSubmit={submitForm} className="mt-6">
                        <div className="mb-2">
                            <label
                                htmlFor="EmployeeId"
                                className="block text-sm font-semibold text-gray-800"
                            >
                                EmployeeId
                            </label>
                            <input
                                type="EmployeeId"
                                value={EmployeeId}
                                onChange={(e)=>setEmployeeId(e.target.value)}
                                className="block w-full px-4 py-2 mt-2 text-primary bg-white border rounded-md focus:border-slate-500 focus:ring-slate-300 focus:outline-none focus:ring focus:ring-opacity-40"
                            />
                        </div>
                        <div className="mb-2">
                            <label
                                htmlFor="password"
                                className="block text-sm font-semibold text-gray-800"
                            >
                                Password
                            </label>
                            <input
                                type="password"
                                value={Password}
                                onChange={(e)=>setPassword(e.target.value)}
                                className="block w-full px-4 py-2 mt-2 bg-white border rounded-md focus:border-slate-500 focus:ring-slate-300
                                focus:outline-none focus:ring focus:ring-opacity-40"
                            />
                        </div>
                        <a
                            href="#"
                            className="text-xs text-slate-900 hover:underline"
                        >
                            Forget Password?
                        </a>
                        <div className="mt-6">
                            <button className="w-full px-4 py-2 tracking-wide text-black transition-colors duration-200 transform bg-slate-400 rounded-md hover:bg-slate-600 focus:outline-none focus:bg-slate-600">
                                Login
                            </button>
                        </div>
                    </form>
                </div>

            </div>
            
        </div>
</div>
  )
}

export default LoginPage