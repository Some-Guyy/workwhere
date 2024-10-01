const DepartmentFilter = ({selectedDepartment, setSelectedDepartment}) => {
  
  // Handle change event for the select element
  const handleChange = (e) => {
    const department = e.target.value;
    setSelectedDepartment(department);
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
