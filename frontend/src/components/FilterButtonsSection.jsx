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

        <button onClick={ () => {
            resetAllStates(); 
            setYourTeamSchedule(true);
            setActiveSchedule("Your Team Schedule");
            setTeamOrOverall("team");
            fetchTeam();
            }} className ={yourTeamSchedule ? "btn btn-outline btn-primary m-2 btn-active" : "btn btn-outline btn-primary m-2"}>
            Your Team Schedule
        </button>

        <button onClick={ () => {
            resetAllStates(); 
            setYourOverallSchedule(true);                        
            setActiveSchedule("Your Overall Schedule");
            setTeamOrOverall("overall");
            fetchOverall();
            }} className ={yourOverallSchedule ? "btn btn-outline btn-primary m-2 btn-active" : "btn btn-outline btn-primary m-2"}>
            Your Overall Schedule
        </button>
    </div>
  )
}

export default FilterButtonsSection