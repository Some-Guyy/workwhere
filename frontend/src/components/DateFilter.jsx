import { DayPicker } from "react-day-picker";
import { useState } from "react";

const DateFilter = ({setSelectedDate}) => {
  const [selected, setSelected] = useState(null);
  const today = new Date();
  const [month, setMonth] = useState();

  const currentDate = today.getDate();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();

  const handleSelect = (date) => {
    setSelected(date); // Update the selected date state
    if (date) {
      // const selectedDay = date.toLocaleDateString().split("/");
      // const selectedDate = parseInt(selectedDay[1]);
      // const selectedMonth = parseInt(selectedDay[0]);
      // const selectedYear = parseInt(selectedDay[2]);
      const selectedDate = date.getDate();
      const selectedMonth = date.getMonth()+1;
      const selectedYear = date.getFullYear();

      const formattedDateForView = `${selectedDate}/${selectedMonth}/${selectedYear}`;

      setSelectedDate(formattedDateForView);
      
    } else {
      // If no date is selected, set it to null
      setSelectedDate(null);
    }
  };

  return (
    <div className="dropdown flex">
        <div tabIndex={0} role="button" className="btn m-1 px-32 mx-auto justify-center">Please Select a Date</div>
            <div
                tabIndex={0}
                className="dropdown-content card card-compact bg-primary text-primary-content z-[10] p-2 shadow">
                <div className="card-body">
                  <h3 className="card-title">Please Select Date to View</h3>
                  <div>
                    <DayPicker 
                    mode="single"
                    selected={selected}
                    onSelect={handleSelect}
                    month={month} 
                    onMonthChange={setMonth}
                    // captionLayout="dropdown"
                    defaultMonth={new Date(currentYear, currentMonth)}
                    startMonth={new Date(currentYear-1, currentMonth)}
                    endMonth={new Date(currentYear+1, currentMonth)}
                    />
                  </div>
              </div>
        </div>
    </div>
  )
}

export default DateFilter