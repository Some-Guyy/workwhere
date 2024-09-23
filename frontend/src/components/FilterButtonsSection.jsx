const FilterButtonsSection = ({
    setYourSchedule,
    setYourTeamSchedule,
    setYourDepartmentSchedule,
    setYourOverallSchedule,
    resetAllStates,
    setActiveSchedule,
    yourSchedule,
    yourTeamSchedule,
    yourDepartmentSchedule,
    yourOverallSchedule,
}) => {
  return (
    <div className="text-center mb-5">
        <button onClick={ () => {
            resetAllStates(); 
            setYourSchedule(true);
            setActiveSchedule("Your Schedule");
            }} className ={yourSchedule ? "btn btn-outline btn-primary m-2 btn-active" : "btn btn-outline btn-primary m-2"}>
            Your Schedule
        </button>

        <button onClick={ () => {
            resetAllStates(); 
            setYourTeamSchedule(true);
            setActiveSchedule("Your Team Schedule");
            }} className ={yourTeamSchedule ? "btn btn-outline btn-primary m-2 btn-active" : "btn btn-outline btn-primary m-2"}>
            Your Team Schedule
        </button>

        <button onClick={ () => {
            resetAllStates(); 
            setYourDepartmentSchedule(true);
            setActiveSchedule("Your Department Schedule");
            }} className ={yourDepartmentSchedule ? "btn btn-outline btn-primary m-2 btn-active" : "btn btn-outline btn-primary m-2"}>
            Your Department Schedule
        </button>

        <button onClick={ () => {
            resetAllStates(); 
            setYourOverallSchedule(true);                        
            setActiveSchedule("Your Overall Schedule");
            }} className ={yourOverallSchedule ? "btn btn-outline btn-primary m-2 btn-active" : "btn btn-outline btn-primary m-2"}>
            Your Overall Schedule
        </button>
    </div>
  )
}

export default FilterButtonsSection