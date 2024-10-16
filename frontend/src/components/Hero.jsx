import { useState, useEffect } from "react";
import Calender from "./Calender";
import Stats from "./Stats";

const Hero = ({loading, data}) => {
    const [EmployeeName, setEmployeeName] = useState(null);

    // extract users role to conditionally render links
    useEffect(()=>{
        const data = JSON.parse(localStorage.getItem('state'));
        console.log(data)
        setEmployeeName(data.Staff_FName);
    },[])


  return (
    <div className="mt-20">
        <div className="bg-primary min-h-screen glass w-full min-w-[490px]">
            <div className="flex flex-col lg:flex-row-reverse items-center w-full">
                <div className="text-center lg:text-left lg:ml-5 text-base-100 w-full p-4">
                    <div className="glass p-4 w-full">
                        <h1 className="text-5xl font-bold">Hi {EmployeeName}!</h1>
                        <p className="py-6">
                            You can view your schedule below or visit manage my applications to make WFH applications!
                        </p>
                        
                        <p>

                        </p>
                        
                    </div>
                    <div className="glass my-4 p-4">
                        <Stats loading={loading} data={data}/>
                    </div>
                </div>

                <div className="card bg-base-300 w-full max-w-sm shrink-0 shadow-2xl m-5">
                    <Calender data={data}/>
                </div>

            </div>
        </div>
    </div>
  )
}

export default Hero