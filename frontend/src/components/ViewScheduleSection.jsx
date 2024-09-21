import Accordion from "./Accordion";
import { useEffect, useState } from "react";

const ViewScheduleSection = () => {

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
    <div className="">
        <div className="font-bold text-4xl mt-10 ml-5 text-center">
            {activeSchedule}
        </div>
        
        <div className="flex">
            <div className="basis-1/5 "></div>
            <div className="basis-3/5 my-5">
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
                        setYourOverallSchedule(true);                        setActiveSchedule("Your Overall Schedule");
                        }} className ={yourOverallSchedule ? "btn btn-outline btn-primary m-2 btn-active" : "btn btn-outline btn-primary m-2"}>
                        Your Overall Schedule
                    </button>
                </div>
                <Accordion />
            </div>

            <div className="basis-1/5 "></div>
        </div>

        <hr className="my-10 w-9/12 m-auto" />
    </div>
  )
}

export default ViewScheduleSection