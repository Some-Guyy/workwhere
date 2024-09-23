import Spinner from "../components/Spinner";
import { useState, useEffect } from 'react';

const Stats = ({loading, data}) => {

    let noOfWfhDays = 0;
    let noOfPendingReq = 0;
    let noOfLeaves = 0;
    console.log(data);

    async function countDays() {
        for (const d of data) {
            if(d.status == "approved"){
                noOfWfhDays++;
            }else if (d.status == "pending"){
                noOfPendingReq++;
            }else{
                noOfLeaves++;
            }
        }
    };

    countDays();
    
    return (
        <div className='flex justify-center'>
            <div className="stats shadow">
                <div className="stat">
                    <div className="stat-title">Total WFH days taken</div>
                    <div className="stat-value text-primary">{loading ? <Spinner loading={loading} /> : (
                        <>
                            {noOfWfhDays} days
                        </>
                    )} 
                    </div>
                    <div className="stat-desc mt-1">Next WFH day on 1 Jan 2024</div>
                </div>

                <div className="stat">
                    <div className="stat-title">Total leaves taken</div>
                    <div className="stat-value text-secondary">{loading ? <Spinner loading={loading} /> : (
                        <>
                            {noOfLeaves} days
                        </>
                    )} 
                    </div>
                    <div className="stat-desc mt-1">Next leave on 2 Jan 2024</div>
                </div>

                <div className="stat">
                    <div className="stat-title">Total pending requests</div>
                    <div className="stat-value">{loading ? <Spinner loading={loading} /> : (
                        <>
                            {noOfPendingReq} 
                        </>
                    )} 
                    </div>
                    <div className="stat-desc mt-1">Requests</div>
                </div>
            </div>
        
        </div>
  )
}

export default Stats