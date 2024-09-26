const DepartmentFilter = () => {
  return (
    <div className="flex">
        <select className="select select-secondary my-4 px-32 mx-auto text-center">
            <option disabled selected className="text-center">Select Department</option>
            <option className="text-center">Sales</option>
            <option className="text-center">Consultancy</option>
            <option className="text-center">System Solutions</option>
            <option className="text-center">Engineering Operation</option>
            <option className="text-center">HR</option>
            <option className="text-center">Finance</option>
            <option className="text-center">IT</option>
        </select>
    </div>
  )
}

export default DepartmentFilter;
