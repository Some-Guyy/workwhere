import ModalWithdraw from "./ModalWithdraw";
import ModalCancel from "./ModalCancel";
import ModalApproveReject from "./ModalApproveReject";
import ModalAttachment from "./ModalAttachment";

const ScheduleTableRow = ({details, modalKey, index, activeSchedule, isWFODate, isPending, isManageOwnApplication, successfulCancellation, setSuccessfulCancellation, isForCancel, cancelWFH, successfulApprovalRejection, setSuccessfulApprovalRejection, approveRejectWFH}) => {
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

  // console.log(activeSchedule)

  const modalId = `modal-${index}`; // Unique modal ID for each row
  const modalIdImage = `modalImage-${index}`

  return (
    <>
    {activeSchedule == "Your Schedule" && isPending == true && isForCancel == true? 
      <>
        <tr className="hover">
            <th>{index+1}</th>
            <td>{convert_to_date(details.startDate._seconds)}</td>
            <td>{details.time}</td>
            {details.attachment == null ? <td>No attachments</td>:
            <td><ModalAttachment modalId={modalIdImage} file={details.attachment}/></td>
            }
            <td><ModalCancel date={convert_to_date(details.startDate._seconds)} type={details.time} successfulCancellation={successfulCancellation} setSuccessfulCancellation={setSuccessfulCancellation} cancelWFH={cancelWFH}/></td>
        </tr>
      </>
      : activeSchedule == "Your Schedule" && isPending == true? 
      <>
        <tr className="hover">
            <th>{index+1}</th>
            <td>{convert_to_date(details.startDate._seconds)}</td>
            <td>{details.time}</td>
            {details.attachment == null ? <td>No attachments</td>:
            <td><ModalAttachment modalId={modalIdImage} file={details.attachment}/></td>
            }
        </tr>
      </>
      : activeSchedule == "Your Schedule" && isManageOwnApplication == true? 
      <>
        <tr className="hover">
            <th>{index+1}</th>
            <td>{convert_to_date(details.startDate._seconds)}</td>
            <td>{details.time}</td>
            <td>{details.Approved_FName} {details.Approved_LName}</td>
            <td><ModalWithdraw /></td>
        </tr>
      </>
      : activeSchedule == "Your Schedule"? 
      <>
        <tr className="hover">
            <th>{index+1}</th>
            <td>{convert_to_date(details.startDate._seconds)}</td>
            <td>{details.time}</td>
            <td>{details.Approved_FName} {details.Approved_LName}</td>
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
            <td>{details.Approved_FName} {details.Approved_LName}</td>
        </tr>
      </>
      : activeSchedule == "Your Overall Schedule" && isWFODate == true? 
      <>
        <tr className="hover">
            <th>{index+1}</th>
            <td>{details.Staff_FName} {details.Staff_LName}</td>
        </tr>
      </>
      : activeSchedule == "Your Overall Schedule" && isPending == true? 
      <>
        <tr className="hover">
            <th>{index+1}</th>
            <td>{details.Staff_FName} {details.Staff_LName}</td>
            <td>{convert_to_date(details.startDate._seconds)}</td>
            <td>{details.time}</td>
        </tr>
      </>
      : activeSchedule == "Your Overall Schedule" ? 
      <>
        <tr className="hover">
            <th>{index+1}</th>
            <td>{details.Staff_FName} {details.Staff_LName}</td>
            <td>{convert_to_date(details.startDate._seconds)}</td>
            <td>{details.time}</td>
            <td>{details.Approved_FName} {details.Approved_LName}</td>
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
            {details.attachment == null ? <td>No attachments</td>:
            <td><ModalAttachment modalId={modalIdImage} file={details.attachment}/></td>
              }
            <td><ModalApproveReject 
              modalId={modalId}
              date={convert_to_date(details.startDate._seconds)} 
              type={details.time} 
              StaffID={details.Staff_ID}
              staffName={`${details.Staff_FName} ${details.Staff_LName}`} 
              successfulApprovalRejection={successfulApprovalRejection}
              setSuccessfulApprovalRejection={setSuccessfulApprovalRejection}
              approveRejectWFH={approveRejectWFH} 
            /></td>
        </tr>
      </>
      : activeSchedule == "Your team in charge of" ? 
      <>
        <tr className="hover">
            <th>{index+1}</th>
            <td>{details.Staff_FName} {details.Staff_LName}</td>
            <td>{convert_to_date(details.startDate._seconds)}</td>
            <td>{details.time}</td>
            <td>{details.Approved_FName} {details.Approved_LName}</td>
        </tr>
      </>
      : "A"
    }
    </>
    
  )
}

export default ScheduleTableRow