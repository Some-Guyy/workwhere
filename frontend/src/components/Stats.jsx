import Spinner from "../components/Spinner";
import { useState, useEffect } from 'react';

const Stats = ({loading, data}) => {

    const [noOfWfhDays, setNoOfWfhDays] = useState(0);
    const [noOfPendingReq, setNoOfPendingReq] = useState(0);
    const [noOfLeaves, setNoOfLeaves] = useState(0);
    const [wfhDay, setWfhDay] = useState(null);
    const [leaveDay, setLeaveDay] = useState(null);
    const [gotWfh, setGotWfh] = useState(false);
    const [gotLeave, setGotLeave] = useState(false);

    // console.log(data);

    const convert_to_date = (seconds) => {
        const milliseconds = seconds * 1000;
    
        // Create a new Date object with the milliseconds
        const date = new Date(milliseconds);
    
        // Extract the day, month, and year
        const day = date.getDate();
        const month = date.getMonth() + 1; // getMonth() is zero-based
        const year = date.getFullYear();
    
        return `${day}/${month}/${year}`;
    };
    

    useEffect(() => {
        async function countDays() {
            let wfhDays = 0;
            let pendingReq = 0;
            let leaves = 0;
            let tempWfhDay = null;
            let tempLeaveDay = null;
            if (data!=null){
            for (const d of data) {
                if(d.status === "approved"){
                    if(tempWfhDay == null){
                        tempWfhDay = convert_to_date(d.date._seconds);
                        setGotWfh(true);
                    } else if(tempWfhDay < convert_to_date(d.date._seconds)){
                        tempWfhDay = convert_to_date(d.date._seconds);
                    }
                    wfhDays++;
                } else if (d.status === "leave"){
                    if(tempLeaveDay == null){
                        tempLeaveDay = convert_to_date(d.date._seconds);
                        setGotLeave(true);
                    } else if(tempLeaveDay < convert_to_date(d.date._seconds)){
                        tempLeaveDay = convert_to_date(d.date._seconds);
                    }
                    leaves++;
                } else if (d.status === "pending"){
                    pendingReq++;
                }
            }
        }

            setNoOfWfhDays(wfhDays);
            setNoOfPendingReq(pendingReq);
            setNoOfLeaves(leaves);
            setWfhDay(tempWfhDay);
            setLeaveDay(tempLeaveDay);
        }

        countDays();
    }, [data]); // Depend on data to re-run when data changes
    
    return (
        <div className='flex justify-center'>
            <div className="stats shadow">
                <div className="stat">
                    <div className="stat-title">Total WFH days taken</div>
                    <div className="stat-value text-primary">{loading ? <Spinner loading={loading} /> : (
                        <div className="text-green-500">
                            {noOfWfhDays} days
                        </div>
                    )} 
                    </div>
                    <div className="stat-desc mt-1">
                        {gotWfh ? (<>Next WFH day on {wfhDay}</>) : (<>No upcoming WFH</>)}
                        
                    </div>
                </div>

                <div className="stat">
                    <div className="stat-title">Total leaves taken</div>
                    <div className="stat-value text-secondary">{loading ? <Spinner loading={loading} /> : (
                        <div className="text-blue-600">
                            {noOfLeaves} days
                        </div>
                    )} 
                    </div>
                    <div className="stat-desc mt-1">
                        {gotLeave ? (<>Next leave on {leaveDay}</>) : <>No upcoming leaves</>}
                    </div>
                </div>

                <div className="stat">
                    <div className="stat-title">Total pending requests</div>
                    <div className="stat-value">{loading ? <Spinner loading={loading} /> : (
                        <div className="text-yellow-400 text-center">
                            {noOfPendingReq} 
                        </div>
                    )} 
                    </div>
                    <div className="stat-desc mt-1 text-center">Requests</div>
                </div>
            </div>
        
        </div>
  )
}

export default Stats