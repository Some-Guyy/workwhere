import ScheduleTable from "./ScheduleTable";
import Spinner from "../components/Spinner";
import { useState, useEffect } from 'react';
import AccordionRow from "./AccordionRow";

const Accordion = ({loading, data}) => {
    const wfhData = [];
    const pendingData = [];
    const leaveData = [];

    async function filterData() {
        for (const d of data) {
            // console.log(d);
            if(d.status == "approved"){
                wfhData.push(d);
            }else if (d.status == "pending"){
                pendingData.push(d);
            }else{
                leaveData.push(d);
            }
        }
    }; 
    
    filterData();
    
    return (
        <div>
            <AccordionRow rowName={"Work From Home Dates"} loading={loading} data={wfhData}/>
            <AccordionRow rowName={"Leave Dates"} loading={loading} data={leaveData}/>
            <AccordionRow rowName={"Pending Requests"} loading={loading} data={pendingData}/>
        </div>
  )
}

export default Accordion