import { useState, useEffect} from "react";
import ViewScheduleSection from "../components/ViewScheduleSection";
import { useLocation } from "react-router-dom";
import Hero from "../components/Hero";

// Note that everytime we change the filter for date or department, we refetch from backend
// the caches are for between the filter buttons

const HomePage = () => {

  const [loading, setLoading] = useState(true); 

  const[showedData, setShowedData] = useState(null); // data to be passed to the yourScheduleComponent
  const[personalData, setPersonalData] = useState(null); // cache between button filters for personal schedule
  const[teamData, setTeamData] = useState(null); // cache between button filters for team schedule
  const[overallData, setOverallData] = useState(null); // cache between button filters for overall schedule

  const today = new Date().toLocaleDateString().split("/"); // todays date
  const [selectedDate, setSelectedDate] = useState(`${today[1]}/${today[0]}/${today[2]}`); // state for the selected date

  const loginEmployeeId = 151408; // to be changed based on logins initial fetch for users employee id
  const location = useLocation();
  const loginRole = location.state.role;
  const[teamOrOverall, setTeamOrOverall] = useState(loginRole);
  const [selectedDepartment, setSelectedDepartment] = useState("Solutioning"); // to be changed based on logins initial fetch for users department


  
    // initial loading will fetch personal schedule
    useEffect(() => {
      if(!showedData) {
        fetchPersonalData();
      }
    }, [showedData]);

    // any changes to the selected date causes a refetch of the team data
    // useEffect(() => {
    //   const selectedDay = selectedDate.split("/");
    //   const selectedDateFetchTeamData = selectedDay[1];
    //   const selectedMonthFetchTeamData = selectedDay[0];
    //   const selectedYearFetchTeamData = selectedDay[2];

    //   const formattedDate = `${selectedYearFetchTeamData}-${selectedDateFetchTeamData}-${selectedMonthFetchTeamData}`;

    //   if(loginRole==2){
    //     setTeamData(null);
    //     fetchTeamData(loginEmployeeId, formattedDate);
    //   }
      
      
    // }, [selectedDate]);

    // function to fetch personal schedule
    const fetchPersonalData = async (employeeId=150233) => {
      
      const apiUrl = `http://localhost:3000/working-arrangements/${employeeId}`;      

      if(!personalData) {

        setLoading(true);

        try{
          const res = await fetch(apiUrl);
          const data = await res.json();
          setPersonalData(data);
          setLoading(false);
          setShowedData(data);
          // console.log(data)

        } catch(error) {
            console.log("Error fetching personal data", error);

        } finally {
            console.log("We fetched the personal data");
        }
      } else{
        setShowedData(personalData);
      }

      
    };
    
    // function to fetch team schedule based on a date
    const fetchTeamData = async (employeeId=loginEmployeeId, chosenDate=null) => {

      if (chosenDate==null){
        const selectedDt = today[1];
        const selectedMonth = today[0];
        const selectedYear = today[2];

        chosenDate = `${selectedYear}-${selectedMonth}-${selectedDt}`;
        // console.log(chosenDate);
      }

      const apiUrl = `http://localhost:3000/working-arrangements/manager/${employeeId}/${chosenDate}`;

      // console.log(`Fetching for ${employeeId} ${chosenDate}`);
      // console.log(teamData);

          if(!teamData) {

            setLoading(true);

            try{
              const res = await fetch(apiUrl);
              const data = await res.json();
            
              setTeamData(data);
              setLoading(false);
              setShowedData(data);
              // console.log(data)
    
            } catch(error) {
                console.log("Error fetching team data", error);
      
            } finally {
                console.log("We fetched the team data");
            }

          }else{
            // console.log("Using cached team data")
            setShowedData(teamData);
          }
    };

    // function to fetch overall schedule based on a date and department
    const fetchOverallData = async (department=selectedDepartment, chosenDate=null) => {
     
      if (chosenDate==null){
        const selectedDt = today[1];
        const selectedMonth = today[0];
        const selectedYear = today[2];

        chosenDate = `${selectedYear}-${selectedMonth}-${selectedDt}`;
        // console.log(chosenDate);
      }

      const apiUrl =  `http://localhost:3000/working-arrangements/department/${department}/${chosenDate}`;

      console.log(`Fetching for ${department} ${chosenDate}`);
      
      if(!overallData) {

        setLoading(true);

        try{
          const res = await fetch(apiUrl);
          const data = await res.json();
          console.log(data)
        
          setOverallData(data);
          setLoading(false);
          setShowedData(data);


        } catch(error) {
            console.log("Error fetching overall data", error);
  
        } finally {
            console.log("We fetched the overall data");
        }

      }else{
        // console.log("We used cached overall data");
        setShowedData(overallData);
      }
    };

  

  return (
    <div className="w-full">
        <Hero loading={loading} data={personalData}/>
        {/* <Hero loading={loading} data={overallData}/> */}
        <ViewScheduleSection 
        loading={loading} 
        data={showedData} 
        fetchPersonal={fetchPersonalData} 
        fetchTeam={fetchTeamData} 
        fetchOverall={fetchOverallData}
        selectedDate={selectedDate} 
        setSelectedDate={setSelectedDate} 
        selectedDepartment={selectedDepartment} 
        setSelectedDepartment={setSelectedDepartment}
        teamOrOverall={teamOrOverall}
        setTeamOrOverall={setTeamOrOverall}
        employeeId={loginEmployeeId}
        setTeamCacheData={setTeamData}
        setOverallCacheData={setOverallData}
        />
        
    </div>
  )
}

export default HomePage