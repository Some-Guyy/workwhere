import { useEffect, useState } from "react";
import { DayPicker } from "react-day-picker";
import "./React_Calander_Styles/Calender.css";
import ModalApply from "./ModalApply";


const CalendarApplication = ({data}) => {
    
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

        for (const d of data) {
            let seconds = d.startDate._seconds;
            let newDate = convert_to_date_for_calander(seconds);
            
            if (d.status === "approved") {
                    tempWfhDays.push(newDate);
                } else if (d.status === "leave") {
                    tempLeaveDays.push(newDate);
                } else if (d.status === "pending") {
                    tempPendingDays.push(newDate);
                }
          }

          setWfhDays(tempWfhDays);
          setLeaveDays(tempLeaveDays);
          setPendingDays(tempPendingDays);

      };

      countDays();
    }, [data]);

    // const DayMouseEventHandler = (day, modifiers) => {
    //     const newValue = [...value];
    //     if (modifiers.selected) {
    //       const index = value.findIndex((d) => isSameDay(day, d));
    //       newValue.splice(index, 1);
    //     } else {
    //       newValue.push(day);
    //     }
    //     setValue(newValue);
    //   };
    
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
                className="justify-center"
                ></DayPicker>

                <div className="flex justify-center mt-5">
                    <button className="btn btn-outline btn-sm" onClick={() => setMonth(today)}>
                    Go to Today
                    </button>
                    <button onClick={resetApplicationDates} className="ml-5 btn btn-outline btn-sm">
                        Reset Selection
                    </button>
                    <ModalApply selectedDates={selected}/>
                </div>

            </div>

            <div className="basis-1/5"></div>
        </div>
        <div className="w-9/12 m-auto mb-10 divider" />
    </>
  )
}

export default CalendarApplication