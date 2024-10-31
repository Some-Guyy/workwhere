import { useEffect, useState } from "react";
import { DayPicker } from "react-day-picker";
import "./React_Calander_Styles/Calender.css";
import ModalApply from "./ModalApply";


const CalendarApplication = ({data, addWFH, successfulApplication, setSuccessfulApplication}) => {
    
    const [selected, setSelected] = useState([]);
    const today = new Date();
    const [month, setMonth] = useState();

    // todays date
    const currentDate = parseInt(today.toLocaleDateString().split("/")[1]);
    const currentMonth = parseInt(today.toLocaleDateString().split("/")[0])-1;
    const currentYear = parseInt(today.toLocaleDateString().split("/")[2]);

    // console.log(currentDate,currentMonth,currentYear)
    // console.log(data);

    // holds state to populate calander with colour
    const [wfhDays, setWfhDays] = useState([]);
    const [leaveDays, setLeaveDays] = useState([]);
    const [pendingDays, setPendingDays] = useState([]);
    const [unselectableDays, setUnselectableDays] = useState([]);
    const [disabledDays, setdisabledDays] = useState([]);

    // convert seconds to date
    const convert_to_date_for_calander = (seconds) => {
      const milliseconds = seconds * 1000;

      // Create a new Date object with the milliseconds
      const date = new Date(milliseconds);
      
      // Extract the day, month, and year
      // const day = date.getDate();
      // const month = date.getMonth() + 1; // getMonth() is zero-based
      // const year = date.getFullYear();
      return date;
      // return new Date(year, month, date)
    };

    // function to put colour based on current calendar
    useEffect(() => {
      async function countDays() {
        const tempWfhDays = [];
        const tempLeaveDays = [];
        const tempPendingDays = [];
        const tempUnselectableDays = [];
        const disabled = new Date(today);
        if(disabled.getDay() == 5){
          disabled.setDate(today.getDate() + 4)
        }
        else if(disabled.getDay() == 6){
          disabled.setDate(today.getDate() + 3)
        }
        else{
          disabled.setDate(today.getDate() + 2);
        }
        setdisabledDays(disabled)
        
        if(data != null){
        for (const d of data) {
            let seconds = d.date._seconds;
            let newDate = convert_to_date_for_calander(seconds);
            
            if (d.status === "approved") {
                    tempWfhDays.push(newDate);
                    tempUnselectableDays.push(newDate);
                } else if (d.status === "leave") {
                    tempLeaveDays.push(newDate);
                } else if (d.status === "pending" || d.status === "pendingWithdrawal") {
                    tempPendingDays.push(newDate);
                    tempUnselectableDays.push(newDate);
                }
          }

          setWfhDays(tempWfhDays);
          setLeaveDays(tempLeaveDays);
          setPendingDays(tempPendingDays);
          setUnselectableDays(tempUnselectableDays);
      };
    }

      countDays();
    }, [data]);
    
    const resetApplicationDates= () => {setSelected([])};
    // console.log(selected);
    // setSelected(wfhDays);
  return (
    <>
      <div className="mt-10 w-9/12 m-auto divider" />
        <div className="flex">
          <div className="basis-1/5 "></div>
            <div className="basis-3/5 m-5 p-5">
                <DayPicker
                mode="multiple"
                selected={selected}
                onSelect={setSelected}
                month={month} 
                onMonthChange={setMonth}
                captionLayout="dropdown"
                defaultMonth={new Date(currentYear, currentMonth)}
                startMonth={new Date(currentYear-1, currentMonth)}
                endMonth={new Date(currentYear+1, currentMonth)}
                modifiers={{
                  wfhDays: wfhDays,
                  leaveDays: leaveDays,
                  pendingDays: pendingDays
                }}
                
                modifiersClassNames={{
                  wfhDays: "wfhDays",
                  pendingDays: "pendingDays",
                  leaveDays: "leaveDays"
                }}
                disabled={[
                  ...unselectableDays,
                  { before: disabledDays }     
                ]}
                className="justify-center"
                ></DayPicker>

                <div className="flex justify-center mt-5">
                    <button className="btn btn-outline btn-sm" onClick={() => setMonth(today)}>
                    Go to Today
                    </button>
                    <button onClick={resetApplicationDates} className="ml-5 btn btn-outline btn-sm">
                        Reset Selection
                    </button>
                    <ModalApply selectedDates={selected} wfhDays={wfhDays} addWFH={addWFH} successfulApplication={successfulApplication} setSuccessfulApplication={setSuccessfulApplication}/>
                </div>
                
            </div>

            <div className="basis-1/5"></div>
        </div>
        <div className="w-9/12 m-auto mb-10 divider" />
    </>
  )
}

export default CalendarApplication