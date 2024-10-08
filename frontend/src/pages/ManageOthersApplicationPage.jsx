import DateFilterTeamInChargeOf from "../components/DateFilterTeamInChargeOf";
import AccordionTeamInChargeOf from "../components/AccordionTeamInChargeOf"
import { useState, useEffect } from "react";

const ManageOthersApplicationPage = () => {

    const [teamInChargeOfData, setTeamInChargeOfData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showedData, setShowedData] = useState(null);

    const loginEmployeeId = 150008; // to be changed based on logins initial fetch for users employee id

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
      }
    }, []);
    
    // initial loading will fetch team in charge of schedule
    useEffect(() => {
        if(!teamInChargeOfData && userRole) {
          fetchTeamInChargeOf(loginEmployeeId, `${today[2]}-${today[0]}-${today[1]}`);
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
        startDate: {
          _seconds: 1727326858
        },
        status: "approved",
        time: "AM",
        Approved_FName: "Ryan",
        Approved_LName: "Ng"
    }] 

    // function to fetch personal schedule
    const fetchTeamInChargeOf = async (employeeId, chosenDate=null) => {
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
            />
        </div>
    )
}

export default ManageOthersApplicationPage