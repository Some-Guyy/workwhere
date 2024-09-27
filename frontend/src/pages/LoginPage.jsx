import React from 'react'
import {useState,useEffect} from "react"
import { useNavigate } from 'react-router-dom'


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
    
    <div className="relative flex flex-col justify-center min-h-screen overflow-hidden">    
    <div className="w-full p-6 m-auto bg-white rounded-md shadow-md lg:max-w-xl">
        <h1 className="text-3xl font-semibold text-center text-purple-700 underline">
           Sign in
        </h1>
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
                    className="block w-full px-4 py-2 mt-2 text-purple-700 bg-white border rounded-md focus:border-purple-400 focus:ring-purple-300 focus:outline-none focus:ring focus:ring-opacity-40"
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
                    className="block w-full px-4 py-2 mt-2 text-purple-700 bg-white border rounded-md focus:border-purple-400 focus:ring-purple-300 focus:outline-none focus:ring focus:ring-opacity-40"
                />
            </div>
            <a
                href="#"
                className="text-xs text-purple-600 hover:underline"
            >
                Forget Password?
            </a>
            <div className="mt-6">
                <button className="w-full px-4 py-2 tracking-wide text-white transition-colors duration-200 transform bg-purple-700 rounded-md hover:bg-purple-600 focus:outline-none focus:bg-purple-600">
                    Login
                </button>
            </div>
        </form>
    </div>
</div>
  )
}

export default LoginPage