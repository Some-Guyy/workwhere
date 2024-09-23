import { useState, useEffect } from "react";
import ViewScheduleSection from "../components/ViewScheduleSection";
import Hero from "../components/Hero";



const HomePage = () => {
  const [loading, setLoading] = useState(true); 

  const[showedData, setShowedData] = useState(null);
  const[personalData, setPersonalData] = useState(null);
  const[teamData, setTeamData] = useState(null);
  const[overallData, setOverallData] = useState(null);


    useEffect(() => {
      if(!showedData) {
        fetchPersonalData();
      }
    }, [showedData]);

    // function to fetch personal schedule
    const fetchPersonalData = async () => {
      const apiUrl = "http://localhost:3030/working-arrangements/150233";
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

        } catch(error) {
            console.log("Error fetching personal data", error);

        } finally {
            console.log("We fetched the personal data");
        }
      } else{
        setShowedData(personalData);
      }

      
    };
    
    // function to fetch team schedule
    const fetchTeamData = async () => {
      const apiUrl =  "http://localhost:3030/working-arrangements/team/190024"

      
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

    // function to fetch overall schedule
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
        <ViewScheduleSection loading={loading} data={showedData} fetchPersonal={fetchPersonalData} fetchTeam={fetchTeamData} fetchOverall={fetchOverallData}/>
        
    </div>
  )
}

export default HomePage