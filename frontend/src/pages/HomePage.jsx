import { useState, useEffect} from "react";
import ViewScheduleSection from "../components/ViewScheduleSection";
import Hero from "../components/Hero";



const HomePage = () => {

  const [loading, setLoading] = useState(true); 

  const[showedData, setShowedData] = useState(null);
  const[personalData, setPersonalData] = useState(null);
  const[teamData, setTeamData] = useState(null);
  const[overallData, setOverallData] = useState(null);

  const today = new Date().toLocaleDateString().split("/");
  const [selectedDate, setSelectedDate] = useState(`${today[1]}/${today[0]}/${today[2]}`);

  const[teamOrOverall, setTeamOrOverall] = useState("null");
  const [selectedDepartment, setSelectedDepartment] = useState("");

  
    // initial loading will fetch personal schedule
    useEffect(() => {
      if(!showedData) {
        fetchPersonalData();
      }
    }, [showedData]);

    // function to fetch personal schedule
    const fetchPersonalData = async (employeeId=150233) => {
      
      const apiUrl = `http://localhost:3030/working-arrangements/${employeeId}`;      
      // const apiUrl = "http://localhost:3030/working-arrangements";
      // const apiUrl =  "http://localhost:3030/working-arrangements/team/190024"

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
    const fetchTeamData = async (employeeId=190024, chosenDate=null) => {

      if (chosenDate==null){
        let date = new Date();
        date = date.toLocaleDateString().split("/");
        const selectedDate = parseInt(date[1]);
        const selectedMonth = parseInt(date[0]);
        const selectedYear = parseInt(date[2]);

        chosenDate = `${selectedYear}-${selectedMonth}-${selectedDate}`;
        // console.log(chosenDate);
      }

      const apiUrl =  `http://localhost:3030/working-arrangements/team/${employeeId}/${chosenDate}`;

      
          if(!teamData) {

            setLoading(true);

            try{
              const res = await fetch(apiUrl);
              const data = await res.json();
            
              setTeamData(data);
              setLoading(false);
              setShowedData(data);
    
    
            } catch(error) {
                console.log("Error fetching team data", error);
      
            } finally {
                console.log("We fetched the team data");
            }

          }else{
            setShowedData(teamData);
          }
    };

    // function to fetch overall schedule based on a date and department
    const fetchOverallData = async () => {
      const apiUrl =  "http://localhost:3030/working-arrangements"
      
          if(!overallData) {

            setLoading(true);

            try{
              const res = await fetch(apiUrl);
              const data = await res.json();
            
              setOverallData(data);
              setLoading(false);
              setShowedData(data);
    
    
            } catch(error) {
                console.log("Error fetching overall data", error);
      
            } finally {
                console.log("We fetched the overall data");
            }

          }else{
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
        />
        
    </div>
  )
}

export default HomePage