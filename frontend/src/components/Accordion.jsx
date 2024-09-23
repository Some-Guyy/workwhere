import ScheduleTable from "./ScheduleTable";
import Spinner from "../components/Spinner";
import { useState, useEffect } from 'react';
import AccordionRow from "./AccordionRow";

const Accordion = () => {
    const [loading, setLoading] = useState(true); 
    const fetchWFH = async () => {
        try{
            ;
        } catch(error) {
            console.log("Error fetching data", error);
        } finally {
            setLoading(false);
        }
    };
    
    useEffect(() => {
        fetchWFH();
    }, []);
    
    return (
        <div>
            <AccordionRow rowName={"Work From Home Dates"} loading={loading}/>
            <AccordionRow rowName={"Leave Dates"} loading={loading}/>
            <AccordionRow rowName={"Pending Requests"} loading={loading}/>
        </div>
  )
}

export default Accordion