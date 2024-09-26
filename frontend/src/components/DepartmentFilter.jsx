
const DepartmentFilter = ({selectedDepartment, setSelectedDepartment, fetchOverall, selectedDate}) => {
  // Using state to manage the selected option
  

  // Handle change event for the select element
  const handleChange = (e) => {
    const department = e.target.value;
    setSelectedDepartment(department);
    // fetchOverall(); // add params for date and department
    console.log("You selected" + department + selectedDate);
  };

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
        <option>System Solutions</option>
        <option>Engineering Operation</option>
        <option>HR</option>
        <option>Finance</option>
        <option>IT</option>
      </select>
    </div>
  );
};

export default DepartmentFilter;
