import { useEffect, useState } from "react";
import Accordion from "../components/Accordion";
import CalendarApplication from "../components/CalendarApplication";

const MyApplicationsPage = () => {

    const[personalData, setPersonalData] = useState(null);
    const[loading, setLoading] = useState(true);
    const[isManageOwnApplication, setIsManageOwnApplication] = useState(true);

    // function to addWFH
    // function to addWFH
    const addWFH = async (newArrangement) => {
      try {
        const res = await fetch('http://localhost:3000/request', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newArrangement),
        });

        // Optional: Handle the response
        if (!res.ok) {
          throw new Error(`Failed to add WFH arrangement: ${res.status} ${res.statusText}`);
        }

        // If the request was successful
        console.log("WFH arrangement added successfully!");

        return res.json(); // Or res.text(), depending on the expected response type
      } catch (error) {
        // Handle the error here
        console.error("Error adding WFH arrangement:", error.message);
        // You can add further error handling (e.g., displaying a message to the user)
      }
    };


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
        <CalendarApplication data={personalData} addWFH={addWFH}/>
        <Accordion loading={loading} data={personalData} yourSchedule={true} activeSchedule={"Your Schedule"} isManageOwnApplication={isManageOwnApplication}/>
    </div>
  )
}

export default MyApplicationsPage