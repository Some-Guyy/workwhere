import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { IoMdClose } from "react-icons/io";
import { PiWarningDiamondFill } from "react-icons/pi";

const ModalApproveRejectWithdraw = ({modalId, date, type, staffName, StaffID, successfulApprovalRejectionWithdrawal, setSuccessfulApprovalRejectionWithdrawal, approveRejectWithdrawal, reasonForWithdraw}) => {

    const [userDetails, setUserDetails] = useState(null); // State to store user details
    const navigate = useNavigate(); // Use navigate hook
    const [reason, setReason] = useState(""); // State to store the reason input
    const [acceptOrReject, setAcceptOrReject] = useState(""); // State to store whether accepted or rejected
    const [errorMessage, setErrorMessage] = useState(null); // Error message for missing reason in rejection

    // Used to fetch user details
    useEffect(() => {
      const localStoreaged = localStorage.getItem('state');
      const userDetailsFromStorage = JSON.parse(localStoreaged);
      setUserDetails(userDetailsFromStorage);
    }, []);

    // Refresh Page when successfulApprovalRejectionWithdrawal becomes true
    useEffect(() => {
      if (successfulApprovalRejectionWithdrawal === true) {
          // Wait a moment and then navigate to a different page
          setTimeout(() => {
              window.location.reload();
          }, 2000); // 2-second delay

      }
  }, [successfulApprovalRejectionWithdrawal, navigate]);

    // Handle form submission(approve/reject the WFH request)
    const handleApprovalRejection = (event) => {
        event.preventDefault();

        // Validate that a reason is provided if the request is rejected
        if (acceptOrReject === "rejected" && reason.trim() === "") {
          setErrorMessage("Please provide a reason for rejecting the request.");
          return;
      }
        
        const formData = {
            reportingId: userDetails.staffId,
            reportingFirstName: userDetails.staffFirstName,
            reportingLastName: userDetails.staffLastName,
            staffId: StaffID,
            status: acceptOrReject,
            reason: acceptOrReject === "approved" ? null : reason,
            date: `${date.split("/")[2]}-${date.split("/")[1]}-${date.split("/")[0]}`,
            purpose: "manageWithdraw"
        }
            
        approveRejectWithdrawal(formData);
        console.log(formData);
        setSuccessfulApprovalRejectionWithdrawal(true);
        setErrorMessage(null); // Clear any previous errors
        console.log("approved/reject simulation")

    };
    

    return (
      <>
            <button className="btn btn-primary btn-xs rounded-full" onClick={()=>document.getElementById(modalId).showModal()}>Actions</button>
            <dialog id={modalId} className="modal">
            <div className="modal-box">
                <h3 className="font-bold text-lg">Approve/Reject WFH arrangement withdrawal?</h3><br/>
                
                {/* Details of application to be approved/reject */}
                <div>
                    <form onSubmit={handleApprovalRejection}>
                        <div className="border-2 border-primary rounded-lg p-5 mb-3">
                            <span className="font-bold text-2xl">Arrangement Date: {date}</span><br />
                            <span className="font-bold text-2xl">Arrangement Type: {type}</span><br />
                            <span className="font-bold text-2xl">Staff name: {staffName}</span><br />
                            <span className="font-bold text-2xl">Reason for withdrawal: {reasonForWithdraw}</span><br />
                        </div>

                        {/* Reasoning data */}
                        <div className="border-2 border-primary rounded-lg p-5 mb-3 flex items-center">
                          <span className="font-bold text-2xl">Reason:</span>
                          <label className="input input-bordered flex items-center gap-2 mx-2 grow">
                            <input 
                              // required 
                              type="text" 
                              className="grow" 
                              placeholder="Input your reasoning"
                              value={reason} // Binding to state
                              onChange={(e) => setReason(e.target.value)} // Update state
                            />
                          </label>
                        </div>
                        
                        {/* Error message for missing reason */}
                        {errorMessage && <p className="text-red-600">{errorMessage}</p>}

                        <button type="submit" className="btn btn-block btn-neutral mt-5" onClick={() => setAcceptOrReject("approved")}>Approve request</button>
                        <button type="submit" className="btn btn-block btn-neutral mt-2" onClick={() => setAcceptOrReject("rejected")}>Reject request</button>
                    </form>
                </div>
                <p className="py-4">Press ESC key or click outside to close</p>
            </div>
            <form method="dialog" className="modal-backdrop">
                
                {/* alert for unsuccessful approve/reject */}
                {successfulApprovalRejectionWithdrawal == false && (
                    <div role="alert" className="alert alert-error fixed top-0 left-0 w-full z-50">
                        <div className="flex items-center">
                            <div className="flex items-center">
                                <PiWarningDiamondFill size={25}/>
                                <span className="mx-2">Error approved/reject arrangement</span>
                            </div>
                            <div className="absolute top-4 right-7">
                                {/* Right side: Close icon */}
                                <IoMdClose size={30} onClick={() => setSuccessfulApprovalRejectionWithdrawal(null)}/>
                            </div>
                        </div>
                    </div>
                )}
                <button>close</button>
            </form>
            </dialog>
      </>

      
    )
  }
  
  export default ModalApproveRejectWithdraw