const ScheduleTableRow = ({details, index}) => {
  
  // convert seconds to date
  const convert_to_date = (seconds) => {
    const milliseconds = seconds * 1000;

    // Create a new Date object with the milliseconds
    const date = new Date(milliseconds);

    // Extract the day, month, and year
    const day = date.getDate();
    const month = date.getMonth() + 1; // getMonth() is zero-based
    const year = date.getFullYear();

    return `${day}-${month}-${year}`;
  };

  return (
    <>
        <tr className="hover">
            <th>{index+1}</th>
            <td>{convert_to_date(details.startDate._seconds)}</td>
            <td>{details.time}</td>
            <td>{details.Approved_FName} {details.Approved_LName}</td>
        </tr>
    </>
  )
}

export default ScheduleTableRow