import { DayPicker } from "react-day-picker";
import { useState, useEffect  } from "react";

const DateFilterTeamInChargeOf = ({setSelectedDate, setTeamInChargeOfData, employeeId, selectedDate, fetchTeamInChargeOf}) => {

  const [selected, setSelected] = useState(null);
  const today = new Date();
  const [month, setMonth] = useState();

  const currentDate = parseInt(today.toLocaleDateString().split("/")[1]);
  const currentMonth = parseInt(today.toLocaleDateString().split("/")[0])-1;
  const currentYear = parseInt(today.toLocaleDateString().split("/")[2]);

  // Separate state to track when team data is being fetched
  const [fetchTriggered, setFetchTriggered] = useState(false);

  const handleSelect = (date) => {
    setSelected(date); // Update the selected date state
    if (date) {
      const selectedDay = date.toLocaleDateString().split("/");
      const selectedDate = parseInt(selectedDay[1]);
      const selectedMonth = parseInt(selectedDay[0]);
      const selectedYear = parseInt(selectedDay[2]);

      const formattedDate = `${selectedYear}-${selectedMonth}-${selectedDate}`;
      const formattedDateForView = `${selectedDate}/${selectedMonth}/${selectedYear}`;

      // setOriginalDate(formattedDateForView);
      setSelectedDate(formattedDateForView);

      // If team, fetch team but set teamData to null, if overall fetch overall
      // setTeamInChargeOfData(null);
      // setFetchTriggered(true);
      
    } else {
      // If no date is selected, set it to null
      // setOriginalDate(null); 
      setSelectedDate(null);
    }
  };

  // Effect to fetch data after team cache is reset. Basically need to check if the cache is reset before you fetch team.
  // useEffect(() => {
  //   if (fetchTriggered && selected) {
  //     const selectedDay = selected.toLocaleDateString().split("/");
  //     const selectedDate = parseInt(selectedDay[1]);
  //     const selectedMonth = parseInt(selectedDay[0]);
  //     const selectedYear = parseInt(selectedDay[2]);
  //     const formattedDate = `${selectedYear}-${selectedMonth}-${selectedDate}`;

  //     fetchTeamInChargeOf(employeeId, formattedDate); // Fetch team data only after the cache is reset
  //     setFetchTriggered(false); // Reset trigger
  //   }
  // }, [fetchTriggered, selected, employeeId]);


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