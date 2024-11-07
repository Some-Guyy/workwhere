import { DayPicker } from "react-day-picker";
import { useState  } from "react";

const DateFilterTeamInChargeOf = ({setSelectedDate, selectedDate}) => {

  const [selected, setSelected] = useState(null);
  const today = new Date();
  const [month, setMonth] = useState();

  const currentDate = today.getDate();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();

  const handleSelect = (date) => {
    console.log(date)
    setSelected(date); // Update the selected date state
    if (date) {
      // const selectedDay = date.toLocaleDateString().split("/");
      // const selectedDate = parseInt(selectedDay[1]);
      // const selectedMonth = parseInt(selectedDay[0]);
      // const selectedYear = parseInt(selectedDay[2]);
      const selectedDate = date.getDate();
      const selectedMonth = date.getMonth()+1;
      const selectedYear = date.getFullYear();

      const formattedDate = `${selectedYear}-${selectedMonth}-${selectedDate}`;
      const formattedDateForView = `${selectedDate}/${selectedMonth}/${selectedYear}`;

      setSelectedDate(formattedDateForView);

    } else {
    }
  };

  return (
    <div>
        <div>

            <div className="font-bold text-4xl mt-10 ml-20 sm:ml-5 text-center">
                Your team in charge of schedule on {selectedDate}
            </div>

        </div>
        <div className="dropdown flex my-10">
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
    </div>
  )
}

export default DateFilterTeamInChargeOf