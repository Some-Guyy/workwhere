import ModalWithdraw from "./ModalWithdraw";


const ScheduleTableRow = ({details, index, activeSchedule, isWFODate, isPending, isManageOwnApplication}) => {
  // convert seconds to date
  const convert_to_date = (seconds) => {
    const milliseconds = seconds * 1000;

    // Create a new Date object with the milliseconds
    const date = new Date(milliseconds);

    // Extract the day, month, and year
    const day = date.getDate();
    const month = date.getMonth() + 1; // getMonth() is zero-based
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  };

  // console.log(details)
  // console.log(activeSchedule)

  return (
    <>
    {activeSchedule == "Your Schedule" && isManageOwnApplication == true?
      <>
        <tr className="hover">
            <th>{index+1}</th>
            <td>{convert_to_date(details.startDate._seconds)}</td>
            <td>{details.time}</td>
            {/* <td>{details.Approved_Fname} {details.Approved_Lname}</td> */}
            <td><ModalWithdraw /></td>
        </tr>
      </>
      : activeSchedule == "Your Schedule"? 
      <>
        <tr className="hover">
            <th>{index+1}</th>
            <td>{convert_to_date(details.startDate._seconds)}</td>
            <td>{details.time}</td>
            <td>{details.Approved_Fname} {details.Approved_Lname}</td>
        </tr>
      </>
      : activeSchedule == "Your Team Schedule" && isWFODate == true? 
      <>
        <tr className="hover">
            <th>{index+1}</th>
            <td>{details.Staff_FName} {details.Staff_LName}</td>
        </tr>
      </>
      : activeSchedule == "Your Team Schedule" ? 
      <>
        <tr className="hover">
            <th>{index+1}</th>
            <td>{details.Staff_FName} {details.Staff_LName}</td>
            <td>{convert_to_date(details.startDate._seconds)}</td>
            <td>{details.time}</td>
            <td>{details.Approved_Fname} {details.Approved_Lname}</td>
        </tr>
      </>
      : activeSchedule == "Your Overall Schedule" && isWFODate == true? 
      <>
        <tr className="hover">
            <th>{index+1}</th>
            <td>{details.Staff_FName} {details.Staff_LName}</td>
        </tr>
      </>
      : activeSchedule == "Your Overall Schedule" ? 
      <>
        <tr className="hover">
            <th>{index+1}</th>
            <td>{details.Staff_FName} {details.Staff_LName}</td>
            <td>{convert_to_date(details.startDate._seconds)}</td>
            <td>{details.time}</td>
            <td>{details.Approved_Fname} {details.Approved_Lname}</td>
        </tr>
      </>
      : activeSchedule == "Your team in charge of" && isWFODate == true? 
      <>
        <tr className="hover">
            <th>{index+1}</th>
            <td>{details.Staff_FName} {details.Staff_LName}</td>
        </tr>
      </>
      : activeSchedule == "Your team in charge of" && isPending == true? 
      <>
        <tr className="hover">
            <th>{index+1}</th>
            <td>{details.Staff_FName} {details.Staff_LName}</td>
            <td>{convert_to_date(details.startDate._seconds)}</td>
            <td>{details.time}</td>
            <td>{details.Approved_Fname} {details.Approved_Lname}</td>
            <td>Button to do actions</td>
        </tr>
      </>
      : activeSchedule == "Your team in charge of" ? 
      <>
        <tr className="hover">
            <th>{index+1}</th>
            <td>{details.Staff_FName} {details.Staff_LName}</td>
            <td>{convert_to_date(details.startDate._seconds)}</td>
            <td>{details.time}</td>
            <td>{details.Approved_Fname} {details.Approved_Lname}</td>
        </tr>
      </>
      : "A"
    }
    </>
    
  )
}

export default ScheduleTableRow