import { useState } from "react";
import { DayPicker } from "react-day-picker";
import "./React_Calander_Styles/Calender.css";


const Calender = ({data}) => {

    const [selected, setSelected] = useState(false);
    const today = new Date();
    const [month, setMonth] = useState();

    const currentDate = parseInt(today.toLocaleDateString().split("/")[1]);
    const currentMonth = parseInt(today.toLocaleDateString().split("/")[0])-1;
    const currentYear = parseInt(today.toLocaleDateString().split("/")[2]);

    // console.log(currentDate,currentMonth,currentYear)

    console.log(data);
    const wfhDays = [
      // new Date(2024, 8, 25),
    ];
    const leaveDays = [
    ];
    const pendingDays = [
    ];


    async function countDays() {
        for (const d of data) {
            let startDate = d.startDate.split("/");
            let month = parseInt(startDate[1]);
            let date = parseInt(startDate[0]); 
            let year = parseInt(startDate[2]);
            wfhDays.push(new Date(year, month-1, date));
            if(d.status == "approved"){
              wfhDays.push(new Date(year, month-1, date));
            }else if(d.status == "leave"){
              leaveDays.push(new Date(year, month-1, date));
            }else if(d.status == "pending"){
              pendingDays.push(new Date(year, month-1, date));
            }
        }
    };

    countDays();
    

    // setSelected(wfhDays);

  return (
    <>
      <div className="mt-10 w-9/12 m-auto divider" />
        <div className="flex">
          <div className="basis-1/5 "></div>
            <div className="basis-3/5 m-5 p-5 ">
                <DayPicker
                mode="single"
                selected={selected}
                // onSelect={setSelected}
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
                // footer={
                //     selected ? `Selected: ${selected.toLocaleDateString()}` : "Pick a day."
                    
                // }
                // className="wfhDays"
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