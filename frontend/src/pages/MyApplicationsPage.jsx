import { useEffect, useState } from "react";
import Accordion from "../components/Accordion";
import CalendarApplication from "../components/CalendarApplication";

const MyApplicationsPage = () => {

    const[personalData, setPersonalData] = useState(null);
    const[loading, setLoading] = useState(true);
    const[isManageOwnApplication, setIsManageOwnApplication] = useState(true);
    const[isForCancel, setIsForCancel] = useState(true);
    const [successfulApplication, setSuccessfulApplication] = useState(null);
    const [successfulCancellation, setSuccessfulCancellation] = useState(null);
    
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
    
        // Check if the response is OK
        if (!res.ok) {
          throw new Error(`Failed to add WFH arrangement: ${res.status} ${res.statusText}`);
        }else{
          // Successful response
          console.log("WFH arrangement added successfully!");
          setSuccessfulApplication(true);  // Update the state to indicate success
          return await res.json();          // Ensure we return a parsed response
        }
        

    
      } catch (error) {
        // Error handling, set the failure state
        console.error("Error adding WFH arrangement:", error.message);
        setSuccessfulApplication(false);  // Ensure state is set to false on failure
      }
    };
    
    // function to cancel WFH
    const cancelWFH = async (arrangement) => {
      try {
        const res = await fetch('http://localhost:3000/working-arrangements', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(arrangement),
        });
    
        // Check if the response is OK
        if (!res.ok) {
          throw new Error(`Failed to add WFH arrangement: ${res.status} ${res.statusText}`);
        }else{
          // Successful response
          console.log("WFH arrangement cancelled successfully!");
          setSuccessfulCancellation(true);  // Update the state to indicate success
          return await res.json();          // Ensure we return a parsed response
        }
    
      } catch (error) {
        // Error handling, set the failure state
        console.error("Error cancelling WFH arrangement:", error.message);
        setSuccessfulCancellation(false);  // Ensure state is set to false on failure
      }
    };


    // Fetch the role and personal schedule from localStorage when the component mounts
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
    <div className="my-40">
        <CalendarApplication data={personalData} addWFH={addWFH} successfulApplication={successfulApplication} setSuccessfulApplication={setSuccessfulApplication} />
        <Accordion loading={loading} data={personalData} yourSchedule={true} activeSchedule={"Your Schedule"} isManageOwnApplication={isManageOwnApplication} successfulCancellation={successfulCancellation} setSuccessfulCancellation={setSuccessfulCancellation} isForCancel={isForCancel} cancelWFH={cancelWFH}/>
    </div>
  )
}

export default MyApplicationsPage