import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

const FilterButtonsSection = ({
    setYourSchedule,
    setYourTeamSchedule,
    setYourOverallSchedule,
    resetAllStates,
    setActiveSchedule,
    yourSchedule,
    yourTeamSchedule,
    yourOverallSchedule,
    fetchPersonal,
    fetchTeam,
    fetchOverall,
    setTeamOrOverall
}) => {

    const [EmployeeRole,setEmployeeRole] = useState(null)
    useEffect(()=>{
        const storedRole = JSON.parse(localStorage.getItem('state')).role;
        if (storedRole) {
            setEmployeeRole(storedRole);
        }
        
    },[])

  return (
    <div className="text-center mb-5">
        <button onClick={ () => {
            resetAllStates(); 
            setYourSchedule(true);
            setActiveSchedule("Your Schedule");
            fetchPersonal();
            }} className ={yourSchedule ? "btn btn-outline btn-primary m-2 btn-active" : "btn btn-outline btn-primary m-2"}>
            Your Schedule
        </button>
        {EmployeeRole == 2 || EmployeeRole == 3?
        <button onClick={ () => {
            resetAllStates(); 
            setYourTeamSchedule(true);
            setActiveSchedule("Your Team Schedule");
            setTeamOrOverall("team");
            fetchTeam();
            }} className ={yourTeamSchedule ? "btn btn-outline btn-primary m-2 btn-active" : "btn btn-outline btn-primary m-2"}>
            Your Team Schedule
        </button>
        :null}
        <>
        {EmployeeRole == 1  ?
        <button onClick={ () => {
            resetAllStates(); 
            setYourOverallSchedule(true);                        
            setActiveSchedule("Your Overall Schedule");
            setTeamOrOverall("overall");
            fetchOverall();
            }} className ={yourOverallSchedule ? "btn btn-outline btn-primary m-2 btn-active" : "btn btn-outline btn-primary m-2"}>
            Your Overall Schedule
        </button>
        : null}
        </>
    </div>
  )
}

export default FilterButtonsSection