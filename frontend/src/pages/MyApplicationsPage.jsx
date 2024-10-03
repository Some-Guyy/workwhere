import { useEffect, useState } from "react";
import Accordion from "../components/Accordion";
import CalendarApplication from "../components/CalendarApplication";

const MyApplicationsPage = () => {

    const[personalData, setPersonalData] = useState(null);
    const[loading, setLoading] = useState(true);
    const[isManageOwnApplication, setIsManageOwnApplication] = useState(true);

    // Fetch the role from localStorage when the component mounts
    useEffect(() => {
        const localStoreaged = localStorage.getItem('personalSchedule');
        const personalSchedule = JSON.parse(localStoreaged);
        console.log(personalSchedule)
        if (personalSchedule) {
            setPersonalData(personalSchedule);
            setLoading(false);
        }
    }, []);
    
  return (
    <div className="mt-40">
        <CalendarApplication data={personalData}/>
        <Accordion loading={loading} data={personalData} yourSchedule={true} activeSchedule={"Your Schedule"} isManageOwnApplication={isManageOwnApplication}/>
    </div>
  )
}

export default MyApplicationsPage