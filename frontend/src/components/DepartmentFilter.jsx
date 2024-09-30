import { useState, useEffect } from "react";

const DepartmentFilter = ({selectedDepartment, setSelectedDepartment, fetchOverall, selectedDate, setOverallCacheData}) => {
  // Using state to manage the selected option
  
  // Separate state to track when team data is being fetched
  const [fetchTriggered, setFetchTriggered] = useState(false);

  // Handle change event for the select element
  const handleChange = (e) => {
    const department = e.target.value;
    setSelectedDepartment(department);
    // fetchOverall(); // add params for date and department
    // console.log("You selected " + department + selectedDate);

    // When fetched, set overallCache to null
    setOverallCacheData(null);
    setFetchTriggered(true);
  };

  // Effect to fetch data after team cache is reset. Basically need to check if the cache is reset before you fetch team.
  useEffect(() => {
    if (fetchTriggered) {
      const selectedDay = selectedDate.split("/");
      const selectedDateFetchTeamData = selectedDay[1];
      const selectedMonthFetchTeamData = selectedDay[0];
      const selectedYearFetchTeamData = selectedDay[2];

      const formattedDate = `${selectedYearFetchTeamData}-${selectedDateFetchTeamData}-${selectedMonthFetchTeamData}`;

      fetchOverall(selectedDepartment, formattedDate); // Fetch team data only after the cache is reset
      setFetchTriggered(false); // Reset trigger
    }
  }, [fetchTriggered]);

  return (
    <div className="flex">
      <select
        className="select select-secondary my-4 px-32 mx-auto text-center"
        value={selectedDepartment}
        onChange={handleChange}
      >
        <option disabled value="">
          Select Department
        </option>
        <option>Sales</option>
        <option>Consultancy</option>
        <option>Solutioning</option>
        <option>Engineering</option>
        <option>HR</option>
        <option>Finance</option>
        <option>IT</option>
        <option>CEO</option>
      </select>
    </div>
  );
};

export default DepartmentFilter;
