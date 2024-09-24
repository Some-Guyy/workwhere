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

    useEffect(() => {
        async function countDays() {
            let wfhDays = 0;
            let pendingReq = 0;
            let leaves = 0;
            let tempWfhDay = null;
            let tempLeaveDay = null;
            
            for (const d of data) {
                if(d.status === "approved"){
                    if(tempWfhDay == null){
                        tempWfhDay = d.startDate;
                        setGotWfh(true);
                    } else if(tempWfhDay < d.startDate){
                        tempWfhDay = d.startDate;
                    }
                    wfhDays++;
                } else if (d.status === "leave"){
                    if(tempLeaveDay == null){
                        tempLeaveDay = d.startDate;
                        setGotLeave(true);
                    } else if(tempLeaveDay < d.startDate){
                        tempLeaveDay = d.startDate;
                    }
                    leaves++;
                } else if (d.status === "pending"){
                    pendingReq++;
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