import Accordion from "./Accordion";
import { useState } from "react";
import FilterButtonsSection from "./FilterButtonsSection";

const ViewScheduleSection = ({loading, data, fetchPersonal, fetchTeam, fetchOverall}) => {

    // states for filter
    const [activeSchedule, setActiveSchedule] = useState("Your Schedule");
    const [yourSchedule, setYourSchedule] = useState(true);
    const [yourTeamSchedule, setYourTeamSchedule] = useState(false);
    const [yourDepartmentSchedule, setYourDepartmentSchedule] = useState(false);
    const [yourOverallSchedule, setYourOverallSchedule] = useState(false);

    // Function to reset all states
    const resetAllStates = () => {
        setYourSchedule(false);
        setYourTeamSchedule(false);
        setYourDepartmentSchedule(false);
        setYourOverallSchedule(false);
    };

  return (
    <div className="ml-5">
        <div className="font-bold text-4xl mt-10 ml-10 text-center">
            {activeSchedule}
        </div>
        
        <div className="flex">
            <div className="basis-1/5 "></div>
            <div className="basis-3/5 my-5">
                <FilterButtonsSection 
                setYourSchedule={setYourSchedule}
                setYourTeamSchedule={setYourTeamSchedule}
                setYourDepartmentSchedule={setYourDepartmentSchedule}
                setYourOverallSchedule={setYourOverallSchedule}
                resetAllStates={resetAllStates}
                setActiveSchedule={setActiveSchedule}
                yourSchedule={yourSchedule}
                yourTeamSchedule={yourTeamSchedule}
                yourDepartmentSchedule={yourDepartmentSchedule}
                yourOverallSchedule={yourOverallSchedule}
                fetchPersonal={fetchPersonal}
                fetchTeam={fetchTeam}
                fetchOverall={fetchOverall}
                />
                <Accordion loading={loading} data={data}/>
            </div>

            <div className="basis-1/5 "></div>
        </div>

        <hr className="my-10 w-9/12 m-auto" />
    </div>
  )
}

export default ViewScheduleSection