import { useState, useEffect} from "react";
import ViewScheduleSection from "../components/ViewScheduleSection";
import Hero from "../components/Hero";
import { useNavigate } from 'react-router-dom'
// Note that everytime we change the filter for date or department, we refetch from backend
// the caches are for between the filter buttons

const HomePage = () => {

    const [loading, setLoading] = useState(true); // used to show loading sign

    const[showedData, setShowedData] = useState(null); // data to be passed to the yourScheduleComponent
    const[personalData, setPersonalData] = useState(null); // cache between button filters for personal schedule
    const[teamData, setTeamData] = useState(null); // cache between button filters for team schedule
    const[overallData, setOverallData] = useState(null); // cache between button filters for overall schedule

    const today = new Date().toLocaleDateString().split("/"); // todays date
    const [selectedDate, setSelectedDate] = useState(`${today[1]}/${today[0]}/${today[2]}`);


    const loginEmployeeId = 190019; // to be changed based on logins initial fetch for users employee id
    const [teamOrOverall, setTeamOrOverall] = useState(null);
    const [selectedDepartment, setSelectedDepartment] = useState("Sales"); // to be changed based on logins initial fetch for users department
    const [dateTriggered, setDateTriggered] = useState(false); // Separate state to track when date is being fetched
    const [departmentTriggered, setDepartmentTriggered] = useState(false); // Separate state to track when department is being fetched
    const [userRole, setUserRole] = useState(null); // used to hold employee's role

    // Fetch the role from localStorage when the component mounts
    useEffect(() => {
      const localStoreaged = localStorage.getItem('state');
      const storedRole = JSON.parse(localStoreaged).role;
      if (storedRole) {
        setTeamOrOverall(storedRole);
        setUserRole(storedRole);
      }
      else{
        const navigate = useNavigate();
        navigate("/login")
      }
    }, []);
    
    // initial loading will fetch personal schedule
    useEffect(() => {
      if(!showedData && userRole) {
        fetchPersonalData();
      }
    }, [userRole]);
    
    // changes in date sets team cache to null
    useEffect(() => {
      if(userRole ==2 || userRole ==3){
        setTeamData(null);
        setDateTriggered(true);
      }else if(userRole==1){
        setOverallData(null);
        setDateTriggered(true);
      }
    }, [selectedDate]);

    // changes in department sets department cache to null
    useEffect(() => {
      if(userRole==1){
        setOverallData(null);
        setDepartmentTriggered(true);
      }
    }, [selectedDepartment]);

    // run when changes in dept
    useEffect(() => {
      if (departmentTriggered && userRole == 1) {
        const selectedDay = selectedDate.split("/");
        const selectedDateFetchTeamData = selectedDay[1];
        const selectedMonthFetchTeamData = selectedDay[0];
        const selectedYearFetchTeamData = selectedDay[2];
  
        const formattedDate = `${selectedYearFetchTeamData}-${selectedDateFetchTeamData}-${selectedMonthFetchTeamData}`;
  
        fetchOverallData(selectedDepartment, formattedDate); // Fetch team data only after the cache is reset
        setDepartmentTriggered(false); // Reset trigger
      }
    }, [departmentTriggered]);

    // run when changes in date
    useEffect(() => {
      if (dateTriggered && (userRole == 2 || userRole == 3)) {
        const selectedDay = selectedDate.split("/");
        const selectedDateFetchTeamData = selectedDay[1];
        const selectedMonthFetchTeamData = selectedDay[0];
        const selectedYearFetchTeamData = selectedDay[2];

        const formattedDate = `${selectedYearFetchTeamData}-${selectedDateFetchTeamData}-${selectedMonthFetchTeamData}`;
        fetchTeamData(loginEmployeeId, formattedDate);
        setDateTriggered(false); // Reset trigger
      }else if (dateTriggered && userRole == 1){
        const selectedDay = selectedDate.split("/");
        const selectedDateFetchTeamData = selectedDay[1];
        const selectedMonthFetchTeamData = selectedDay[0];
        const selectedYearFetchTeamData = selectedDay[2];

        const formattedDate = `${selectedYearFetchTeamData}-${selectedDateFetchTeamData}-${selectedMonthFetchTeamData}`;
        fetchOverallData(selectedDepartment, formattedDate);
        setDateTriggered(false); // Reset trigger
      }
    }, [dateTriggered]);

    // local storage for persons personal schedule
    useEffect(()=>{
      localStorage.setItem('personalSchedule', JSON.stringify(personalData));
    },[personalData])

    // temp data for testing
    const deta = [{
      startDate: {
        _seconds: 1727326858
      },
      status: "approved",
      time: "AM",
      Approved_FName: "Ryan",
      Approved_LName: "Ng"
    }, {
      startDate: {
        _seconds: 1727326858
      },
      status: "pending",
      time: "AM",
      Approved_FName: "Ryan",
      Approved_LName: "Ng"
    }] 

    // function to fetch personal schedule
    const fetchPersonalData = async (employeeId=190019) => {
      
      const apiUrl = `http://localhost:3000/working-arrangements/${employeeId}`;      

      if(!personalData) {

        setLoading(true);

        try{
          const res = await fetch(apiUrl);
          const data = await res.json();
          // const data = deta
          setPersonalData(data);
          setLoading(false);
          setShowedData(data);
          console.log(data)

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

      const apiUrl = `http://localhost:3000/working-arrangements/team/${employeeId}/${chosenDate}`;

      console.log(`Fetching for ${employeeId} ${chosenDate}`);
      // console.log(teamData);

          if(!teamData) {
            // console.log("no team data")
            setLoading(true);

            try{
              const res = await fetch(apiUrl);
              const data = await res.json();
              // const data = deta
              setTeamData(data);
              setLoading(false);
              setShowedData(data);
              console.log(data)
    
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
      }

      const apiUrl =  `http://localhost:3000/working-arrangements/department/${department}/${chosenDate}`;

      console.log(`Fetching for ${department} ${chosenDate}`);
      
      if(!overallData) {

        setLoading(true);

        try{
          const res = await fetch(apiUrl);
          const data = await res.json();
          // const data = deta;
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
        setTeamOrOverall={setTeamOrOverall}
        />
        
    </div>
  )
}

export default HomePage