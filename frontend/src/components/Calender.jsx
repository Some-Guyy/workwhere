import { useState } from "react";
import { DayPicker } from "react-day-picker";
import "./React_Calander_Styles/Calender.css";


const Calender = () => {

    const [selected, setSelected] = useState(false);
    const today = new Date();
    const [month, setMonth] = useState();

    const currentDate = parseInt(today.toLocaleDateString().split("/")[1]);
    const currentMonth = parseInt(today.toLocaleDateString().split("/")[0])-1;
    const currentYear = parseInt(today.toLocaleDateString().split("/")[2]);

    console.log(currentDate,currentMonth,currentYear)

  return (
    <>
      <div className="mt-10 w-9/12 m-auto divider" />
        <div className="flex">
          <div className="basis-1/5 "></div>
            <div className="basis-3/5 m-5 p-5 ">
                <DayPicker
                mode="single"
                selected={selected}
                onSelect={setSelected}
                month={month} 
                onMonthChange={setMonth}
                captionLayout="dropdown"
                defaultMonth={new Date(currentYear, currentMonth)}
                startMonth={new Date(currentYear-1, currentMonth)}
                endMonth={new Date(currentYear+1, currentMonth)}
                // footer={
                //     selected ? `Selected: ${selected.toLocaleDateString()}` : "Pick a day."
                    
                // }
                // className="flex-wrap"
                ></DayPicker>
                <button className="btn btn-outline btn-sm" onClick={() => setMonth(today)}>Go to Today</button>
            </div>
            <div className="basis-1/5"></div>
        </div>
        <div className="w-9/12 m-auto mb-10 divider" />
    </>
  )
}

export default Calender