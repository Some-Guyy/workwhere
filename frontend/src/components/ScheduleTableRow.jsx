import ModalWithdraw from "./ModalWithdraw";
import ModalCancel from "./ModalCancel";
import ModalApproveReject from "./ModalApproveReject";
import ModalAttachment from "./ModalAttachment";
import ModalApproveRejectWithdraw from "./ModalApproveRejectWithdraw";
import ModalWithdrawSubordinate from "./ModalWithdrawSubordinate";

const ScheduleTableRow = ({details, modalKey, index, activeSchedule, isWFODate, isPending, isManageOwnApplication, successfulCancellation, setSuccessfulCancellation, isForCancel, cancelWFH, approveRejectWFH, successfulWithdrawal, setSuccessfulWithdrawal, withdrawalWFH, successfulApprovalRejectionWithdrawal, setSuccessfulApprovalRejectionWithdrawal, approveRejectWithdrawal, withdrawSubordinate}) => {
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
  // console.log(details)

  const modalId = `modal-${index}`; // Unique modal ID for each row
  const modalIdImage = `modalImage-${index}`

  let tableRow;
  if (activeSchedule==="Your Schedule" && isPending===true && isForCancel==true){
    tableRow =(
      <tr className="hover">
            <th>{index+1}</th>
            <td>{convert_to_date(details.date._seconds)}</td>
            <td>{details.time}</td>
            {details.status == "pendingWithdraw" ? <td>Pending Withdrawal</td>:
            <td>Pending WFH Request</td>
            }
            {details.attachment == null ? <td>No attachments</td>:
            <td><ModalAttachment modalId={modalIdImage} file={details.attachment}/></td>
            }
            <td><ModalCancel date={convert_to_date(details.date._seconds)} type={details.time} successfulCancellation={successfulCancellation} setSuccessfulCancellation={setSuccessfulCancellation} cancelWFH={cancelWFH}/></td>
      </tr>
    );
  }else if (activeSchedule == "Your Schedule" && isPending == true){
    tableRow =(
      <tr className="hover">
            <th>{index+1}</th>
            <td>{convert_to_date(details.date._seconds)}</td>
            <td>{details.time}</td>
            {details.status == "pendingWithdraw" ? <td>Pending Withdrawal</td>:
            <td>Pending WFH Request</td>
            }
            {details.attachment == null ? <td>No attachments</td>:
            <td><ModalAttachment modalId={modalIdImage} file={details.attachment}/></td>
            }
      </tr>
    );
  }else if (activeSchedule == "Your Schedule" && isManageOwnApplication == true){
    tableRow =(
      <tr className="hover">
            <th>{index+1}</th>
            <td>{convert_to_date(details.date._seconds)}</td>
            <td>{details.time}</td>
            <td>{details.reportingFirstName} {details.reportingLastName}</td>
            <td><ModalWithdraw details={details} date={convert_to_date(details.date._seconds)} type={details.time} withdrawalWFH={withdrawalWFH}/></td>
      </tr>
    );
  }else if (activeSchedule == "Your Schedule"){
    tableRow =(
      <tr className="hover">
            <th>{index+1}</th>
            <td>{convert_to_date(details.date._seconds)}</td>
            <td>{details.time}</td>
            <td>{details.reportingFirstName} {details.reportingLastName}</td>
      </tr>
    );
  }else if (activeSchedule == "Your Team Schedule" && isWFODate == true){
    tableRow =(
      <tr className="hover">
            <th>{index+1}</th>
            <td>{details.staffFirstName} {details.staffLastName}</td>
      </tr>
    );
  }else if (activeSchedule == "Your Team Schedule"){
    tableRow =(
      <tr className="hover">
            <th>{index+1}</th>
            <td>{details.staffFirstName} {details.staffLastName}</td>
            <td>{convert_to_date(details.date._seconds)}</td>
            <td>{details.time}</td>
            <td>{details.reportingFirstName} {details.reportingLastName}</td>
      </tr>
    );
  }else if (activeSchedule == "Your Overall Schedule" && isWFODate == true){
    tableRow =(
      <tr className="hover">
            <th>{index+1}</th>
            <td>{details.staffFirstName} {details.staffLastName}</td>
      </tr>
    );
  }else if (activeSchedule == "Your Overall Schedule" && isPending == true){
    tableRow =(
      <tr className="hover">
            <th>{index+1}</th>
            <td>{details.staffFirstName} {details.staffLastName}</td>
            <td>{convert_to_date(details.date._seconds)}</td>
            <td>{details.time}</td>
            {details.status == "pendingWithdraw" ? <td>Pending Withdrawal</td>:
            <td>Pending WFH Request</td>
            }
        </tr>
    );
  }else if (activeSchedule == "Your Overall Schedule"){
    tableRow =(
      <tr className="hover">
            <th>{index+1}</th>
            <td>{details.staffFirstName} {details.staffLastName}</td>
            <td>{convert_to_date(details.date._seconds)}</td>
            <td>{details.time}</td>
            <td>{details.reportingFirstName} {details.reportingLastName}</td>
      </tr>
    );
  }else if (activeSchedule == "Your team in charge of" && isWFODate == true){
    tableRow =(
      <tr className="hover">
            <th>{index+1}</th>
            <td>{details.staffFirstName} {details.staffLastName}</td>
      </tr>
    );
  }else if (activeSchedule == "Your team in charge of" && isPending == true){
    tableRow =(
      <tr className="hover">
            <th>{index+1}</th>
            <td>{details.staffFirstName} {details.staffLastName}</td>
            <td>{convert_to_date(details.date._seconds)}</td>
            <td>{details.time}</td>
            {details.status == "pendingWithdraw" ? <td>Pending Withdrawal</td>:
            <td>Pending WFH Request</td>
            }
            {details.attachment == null ? <td>No attachments</td>:
            <td><ModalAttachment modalId={modalIdImage} file={details.attachment}/></td>
              }
            {details.status == "pendingWithdraw" ? 
            <td><ModalApproveRejectWithdraw 
            reasonForWithdraw={details.reason}
            modalId={modalId}
            date={convert_to_date(details.date._seconds)} 
            type={details.time} 
            StaffID={details.staffId}
            staffName={`${details.staffFirstName} ${details.staffLastName}`} 
            successfulApprovalRejectionWithdrawal={successfulApprovalRejectionWithdrawal} setSuccessfulApprovalRejectionWithdrawal={setSuccessfulApprovalRejectionWithdrawal} 
            approveRejectWithdrawal={approveRejectWithdrawal}
            /></td>
            :
            <td><ModalApproveReject 
              modalId={modalId}
              date={convert_to_date(details.date._seconds)} 
              type={details.time} 
              StaffID={details.staffId}
              staffName={`${details.staffFirstName} ${details.staffLastName}`} 
              approveRejectWFH={approveRejectWFH} 
            /></td>
          }
        </tr>
    );
  }else if (activeSchedule == "Your team in charge of"){
    tableRow =(
      <tr className="hover">
            <th>{index+1}</th>
            <td>{details.staffFirstName} {details.staffLastName}</td>
            <td>{convert_to_date(details.date._seconds)}</td>
            <td>{details.time}</td>
            <td>{details.reportingFirstName} {details.reportingLastName}</td>
            <td><ModalWithdrawSubordinate 
              modalId={modalId}
              details={details}
              date={convert_to_date(details.date._seconds)} 
              type={details.time} 
              withdrawSubordinate={withdrawSubordinate} 
            /></td>
        </tr>
    );
  }

  return (
    <>{tableRow}</>
  )
}

export default ScheduleTableRow