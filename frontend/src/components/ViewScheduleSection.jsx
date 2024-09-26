import Accordion from "./Accordion";
import { useState } from "react";
import FilterButtonsSection from "./FilterButtonsSection";
import DateFilter from "./DateFilter";
import DepartmentFilter from "./DepartmentFilter";

const ViewScheduleSection = ({loading, data, fetchPersonal, fetchTeam, fetchOverall, selectedDate, setSelectedDate, selectedDepartment, setSelectedDepartment, teamOrOverall, setTeamOrOverall}) => {

    // const today = new Date().toLocaleDateString().split("/");

    // states for filter
    const [activeSchedule, setActiveSchedule] = useState("Your Schedule");
    const [yourSchedule, setYourSchedule] = useState(true);
    const [yourTeamSchedule, setYourTeamSchedule] = useState(false);
    const [yourOverallSchedule, setYourOverallSchedule] = useState(false);
    // const [selectedDate, setSelectedDate] = useState(`${today[1]}/${today[0]}/${today[2]}`);


    // Function to reset all states
    const resetAllStates = () => {
        setYourSchedule(false);
        setYourTeamSchedule(false);
        setYourOverallSchedule(false);
    };

  return (
    <div className="">
        
        {yourSchedule ? 
        <div className="font-bold text-4xl mt-10 ml-20 sm:ml-5 text-center">
        {activeSchedule}
        </div>
        :
        <div className="font-bold text-4xl mt-10 ml-20 sm:ml-5 text-center">
        {activeSchedule} on {selectedDate}
        </div>

        }
        
        <div className="flex">
            <div className="basis-1/5 "></div>
            <div className="basis-3/5 my-5">
                <FilterButtonsSection 
                setYourSchedule={setYourSchedule}
                setYourTeamSchedule={setYourTeamSchedule}
                setYourOverallSchedule={setYourOverallSchedule}
                resetAllStates={resetAllStates}
                setActiveSchedule={setActiveSchedule}
                yourSchedule={yourSchedule}
                yourTeamSchedule={yourTeamSchedule}
                yourOverallSchedule={yourOverallSchedule}
                fetchPersonal={fetchPersonal}
                fetchTeam={fetchTeam}
                fetchOverall={fetchOverall}
                setTeamOrOverall={setTeamOrOverall}
                />

                <div className="">
                {yourSchedule ? <></> : <DateFilter 
                setSelectedDate={setSelectedDate}
                selectedDepartment={selectedDepartment}
                fetchTeam={fetchTeam} 
                fetchOverall={fetchOverall}
                teamOrOverall={teamOrOverall}
                />}

                {yourOverallSchedule ? <DepartmentFilter setSelectedDepartment={setSelectedDepartment} selectedDepartment={selectedDepartment} 
                selectedDate={selectedDate}
                fetchOverall={fetchOverall} 
                /> : <></>}
                </div>
                
                
                <Accordion loading={loading} data={data} yourSchedule={yourSchedule}/>
            </div>

            <div className="basis-1/5 "></div>
        </div>

        <hr className="my-10 w-9/12 m-auto" />
    </div>
  )
}

export default ViewScheduleSection