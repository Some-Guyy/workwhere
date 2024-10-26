import DateFilterTeamInChargeOf from "../components/DateFilterTeamInChargeOf";
import AccordionTeamInChargeOf from "../components/AccordionTeamInChargeOf"
import { useState, useEffect } from "react";
import { IoMdClose } from "react-icons/io";
import { PiWarningDiamondFill } from "react-icons/pi";
import { GrStatusGood } from "react-icons/gr";

const ManageOthersApplicationPage = () => {

    const [teamInChargeOfData, setTeamInChargeOfData] = useState(null);
    const [teamInChargeOfDataPendingOnly, setTeamInChargeOfDataPendingOnly] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showedData, setShowedData] = useState(null); // this is for wfh dates and wfh office to be filtered in child component
    const [showedDataPendingOnly, setShowedDataPendingOnly] = useState(null); // this is for pending req only, dif from line above
    const [successfulApprovalRejection, setSuccessfulApprovalRejection] = useState(null); // this is to show whether approval/rejection successful or not
    const [showSuccessModal, setShowSuccessModal] = useState(null);

    const [loginEmployeeId, setLoginEmployeeId] = useState(null); // to be changed based on logins initial fetch for users employee id

    const today = new Date().toLocaleDateString().split("/"); // todays date
    
    const [selectedDate, setSelectedDate] = useState(`${today[1]}/${today[0]}/${today[2]}`); // state for the selected date
    const [dateTriggered, setDateTriggered] = useState(false); // date trigger

    const [userRole, setUserRole] = useState(null); // users role

    // Fetch the role from localStorage when the component mounts
    useEffect(() => {
      const localStoreaged = localStorage.getItem('state');
      const storedRole = JSON.parse(localStoreaged).Role;
      if (storedRole) {
        setUserRole(storedRole);
        setLoginEmployeeId(JSON.parse(localStoreaged).staffId);
      }
    }, []);
    
    // initial loading will fetch team in charge of schedule
    useEffect(() => {
        if(!teamInChargeOfData && userRole) {
          fetchTeamInChargeOf(loginEmployeeId, `${today[2]}-${today[0]}-${today[1]}`);
        }

        if(!teamInChargeOfDataPendingOnly && userRole) {
          fetchTeamInChargeOfPendingOnly(loginEmployeeId);
        }
      }, [userRole]);

    // changes in date sets cache to null
    useEffect(() => {
      if(userRole==1 || userRole == 3){
        setTeamInChargeOfData(null);
        setDateTriggered(true);
      }
    }, [selectedDate]);

    // run when changes in date
    useEffect(() => {
      if (dateTriggered && (userRole == 1 || userRole == 3)) {
        const selectedDay = selectedDate.split("/");
        const selectedDateFetchTeamData = selectedDay[1];
        const selectedMonthFetchTeamData = selectedDay[0];
        const selectedYearFetchTeamData = selectedDay[2];

        const formattedDate = `${selectedYearFetchTeamData}-${selectedDateFetchTeamData}-${selectedMonthFetchTeamData}`;
        fetchTeamInChargeOf(loginEmployeeId, formattedDate);
        setDateTriggered(false); // Reset trigger
      }
    }, [dateTriggered]);

    // temp data
    const deta = [{
        date: {
          _seconds: 1727326858
        },
        status: "approved",
        time: "AM",
        reportingFirstName: "Ryan",
        reportingLastName: "Ng"
    }] 

    // function to fetch team in charge of schedule
    const fetchTeamInChargeOf = async (employeeId=loginEmployeeId, chosenDate=null) => {
        if (chosenDate==null){
          const selectedDt = today[1];
          const selectedMonth = today[0];
          const selectedYear = today[2];

          chosenDate = `${selectedYear}-${selectedMonth}-${selectedDt}`;
          // console.log(chosenDate);
        }
        const apiUrl = `http://localhost:3000/working-arrangements/manager/${employeeId}/${chosenDate}`;      
  
        if(!teamInChargeOfData) {
  
          setLoading(true);
  
          try{
            const res = await fetch(apiUrl);
            const data = await res.json();
            console.log(`fetching for ${employeeId} on ${chosenDate} for team in charge of`)
            // const data = deta
            setTeamInChargeOfData(data);
            setLoading(false);
            setShowedData(data);
            console.log(data)
  
          } catch(error) {
              console.log("Error fetching team in charge of data", error);
  
          } finally {
              console.log("We fetched the team in charge of data");
          }
        } else{
          setShowedData(teamInChargeOfData);
        }
  
        
      };

    
    // function to fetch team in charge of schedule (FOR PENDING REQUEST, THIS DOESNT CHANGE WITH DATE)
    const fetchTeamInChargeOfPendingOnly = async (employeeId=loginEmployeeId) => {
      
      if (teamInChargeOfDataPendingOnly) {
        console.log("Using cached pending requests data");
        setShowedDataPendingOnly(teamInChargeOfDataPendingOnly); // Use the cached data
        return; // Exit early to avoid refetching
      }
    
      const apiUrl = `http://localhost:3000/working-arrangements/supervise/${employeeId}`;
    
      setLoading(true); // Start loading regardless of whether data exists or not
      try {
        const res = await fetch(apiUrl);
        const data = await res.json();
        console.log(`Fetching for ${employeeId} for team in charge of pending requests only`);
        // Cache the new data
        setTeamInChargeOfDataPendingOnly(data);
        setShowedDataPendingOnly(data); // Set the data for displaying
        setLoading(false); // Finish loading
      } catch (error) {
        console.log("Error fetching team in charge of data for pending requests", error);
        setLoading(false); // Finish loading even on error
      }
      
    };

    // changes in successful approval/reject
    useEffect(() => {
      if(successfulApprovalRejection == true){
        // Clear cache and refetch data after successful approval/rejection
        setTeamInChargeOfDataPendingOnly(null); // Clear cached data
        fetchTeamInChargeOfPendingOnly(loginEmployeeId); // Refetch
        setSuccessfulApprovalRejection(null); // Reset after handling
        setShowSuccessModal(true);
      }
    }, [successfulApprovalRejection]);
    
    // function to approve/reject wfh
    const approveRejectWFH = async (arrangement) => {
      try {
        const res = await fetch('http://localhost:3000/working-arrangements/manage', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(arrangement),
        });
    
        // Check if the response is OK
        if (!res.ok) {
          throw new Error(`Failed to approve/reject WFH arrangement: ${res.status} ${res.statusText}`);
        }else{
          // Successful response
          console.log("WFH arrangement approved/cancelled successfully!");
          setSuccessfulApprovalRejection(true);  // Update the state to indicate success
          return await res.json();          // Ensure we return a parsed response
        }
    
      } catch (error) {
        // Error handling, set the failure state
        console.error("Error approved/cancelled WFH arrangement:", error.message);
        setSuccessfulApprovalRejection(false);  // Ensure state is set to false on failure
      }
    };

    return (
        <div className="mt-40">
            <DateFilterTeamInChargeOf 
            setSelectedDate={setSelectedDate}
            fetchTeamInChargeOf={fetchTeamInChargeOf}setTeamInChargeOfData={setTeamInChargeOfData}
            employeeId={loginEmployeeId}
            selectedDate={selectedDate}
            />
            <AccordionTeamInChargeOf 
            loading={loading}
            data={showedData}
            pendingData={showedDataPendingOnly}
            successfulApprovalRejection={successfulApprovalRejection}
            setSuccessfulApprovalRejection={setSuccessfulApprovalRejection}
            approveRejectWFH={approveRejectWFH}
            />


            {/* alert for successful cancel */}
            {showSuccessModal == true && (
                <div role="alert" className="alert alert-success fixed top-0 left-0 w-full z-50">
                    <div className="flex items-center">
                        <div className="flex items-center">
                            <GrStatusGood size={25}/>
                            <span className="mx-2">Successfully Approved/Reject arrangement</span>
                        </div>
                        <div className="absolute top-4 right-7">
                            {/* Right side: Close icon */}
                            <IoMdClose size={30} onClick={() => setShowSuccessModal(null)}/>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default ManageOthersApplicationPage