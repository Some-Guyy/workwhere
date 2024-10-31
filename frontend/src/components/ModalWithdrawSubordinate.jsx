import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { IoMdClose } from "react-icons/io";
import { PiWarningDiamondFill } from "react-icons/pi";

const ModalWithdrawSubordinate = ({details, date, type, withdrawSubordinate}) => {
    // console.log(setSuccessfulWithdrawalSubordinate)

    const [successfulWithdrawalSubordinate, setSuccessfulWithdrawalSubordinate] = useState(null);
    const [reason, setReason] = useState(""); // State to store the reason input
    const [errorMessage, setErrorMessage] = useState(null); // Error message for missing reason in rejection


    const navigate = useNavigate(); // Use navigate hook

    // Navigate to the Home Page when successfulWithdrawalSubordinate becomes true
    useEffect(() => {
        if (successfulWithdrawalSubordinate === true) {
            // Wait a moment and then navigate to a different page
            setTimeout(() => {
                navigate('/home', {
                    state: { successfulWithdrawalSubordinate: true }, // Send successfulWithdrawalSubordinate state
                });
            }, 2000); // 2-second delay

        }
    }, [successfulWithdrawalSubordinate, navigate]);

    // console.log(date);
    // Handle form submission(withdraw the WFH request)
    const handleWithdraw = (event) => {
        event.preventDefault();

        // Validate that a reason is provided if the request is rejected
        if (reason.trim() === "") {
            setErrorMessage("Please provide a reason for rejecting the request.");
            return;
        }

        // Process formData here (send it to an API, or display it, etc.)
        const formData = {
            staffId: details.staffId,
            reportingFirstName: details.reportingFirstName,
            reportingLastName: details.reportingLastName,
            reportingId: details.reportingId,
            date: `${date.split("/")[2]}-${date.split("/")[1]}-${date.split("/")[0]}`
        }
            
        withdrawSubordinate(formData);
        console.log(formData);
        setSuccessfulWithdrawalSubordinate(true);
        console.log("Withdrawal simulation")
        // console.log(successfulWithdrawalSubordinate)
        

    };

  return (
    <>
        <button className="btn btn-primary btn-xs rounded-full" onClick={()=>document.getElementById('withdraw_modal').showModal()}>Actions</button>
        <dialog id="withdraw_modal" className="modal">
        <div className="modal-box">
            <h3 className="font-bold text-lg">Do you want to withdraw your subordinate's WFH arrangement?</h3>

            {/* Details of application to be withdrawed */}
            <div>
                <form onSubmit={handleWithdraw}>
                    <div className="border-2 border-primary rounded-lg p-5 mb-3">
                        <span className="font-bold text-2xl">Arrangement Date: {date}</span><br />
                        <span className="font-bold text-2xl">Arrangement Type: {type}</span>
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

                    <button type="submit" className="btn btn-block btn-neutral mt-5">Withdraw your subordinate's application</button>
                </form>
            </div>
            <p className="py-4">Press ESC key or click outside to close</p>
        </div>
        <form method="dialog" className="modal-backdrop">
          {/* alert for unsuccessful withdrawal */}
          {successfulWithdrawalSubordinate == false && (
              <div role="alert" className="alert alert-error fixed top-0 left-0 w-full z-50">
                  <div className="flex items-center">
                      <div className="flex items-center">
                          <PiWarningDiamondFill size={25}/>
                          <span className="mx-2">Error approving/reject arrangement</span>
                      </div>
                      <div className="absolute top-4 right-7">
                          {/* Right side: Close icon */}
                          <IoMdClose size={30} onClick={() => setSuccessfulWithdrawalSubordinate(null)}/>
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

export default ModalWithdrawSubordinate