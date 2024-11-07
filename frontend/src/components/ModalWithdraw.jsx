import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { IoMdClose } from "react-icons/io";
import { PiWarningDiamondFill } from "react-icons/pi";

const ModalWithdraw = ({modalId, details, date, type, withdrawalWFH}) => {
    // console.log(setSuccessfulWithdrawal)

    const [successfulWithdrawal, setSuccessfulWithdrawal] = useState(null);
    const [reason, setReason] = useState(""); // State to store the reason input
    const [errorMessage, setErrorMessage] = useState(null); // Error message for missing reason in rejection



    const navigate = useNavigate(); // Use navigate hook

    // Navigate to the Home Page when successfulWithdrawal becomes true
    useEffect(() => {
        if (successfulWithdrawal === true) {
            // Wait a moment and then navigate to a different page
            setTimeout(() => {
                navigate('/home', {
                    state: { successfulWithdrawal: true }, // Send successfulWithdrawal state
                });
            }, 2000); // 2-second delay

        }
    }, [successfulWithdrawal, navigate]);

    // console.log(date);
    // Handle form submission(withdraw the WFH request)
    const handleWithdraw = (event) => {
        event.preventDefault();

        // Validate that a reason is provided if the request is rejected
        if (reason.trim() === "") {
            setErrorMessage("Please provide a reason");
            return;
        }

        // Process formData here (send it to an API, or display it, etc.)
        const formData = {
            staffId: details.staffId,
            staffFirstName: details.staffFirstName,
            staffLastName: details.staffLastName,
            reportingId: details.reportingId,
            date: `${date.split("/")[2]}-${date.split("/")[1]}-${date.split("/")[0]}`,
            reason: reason
        }
            
        withdrawalWFH(formData);
        console.log(formData);
        setSuccessfulWithdrawal(true);
        console.log("Withdrawal simulation")
        // console.log(successfulWithdrawal)
        

    };

  return (
    <>
        <button className="btn btn-primary btn-xs rounded-full" onClick={()=>document.getElementById(modalId).showModal()}>Actions</button>
        <dialog id={modalId} className="modal">
        <div className="modal-box">
            <h3 className="font-bold text-lg">Do you want to withdraw your WFH arrangement?</h3>

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
                            //   required 
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

                    <button type="submit" className="btn btn-block btn-neutral mt-5">Withdraw your application</button>
                </form>
            </div>
            <p className="py-4">Press ESC key or click outside to close</p>
        </div>
        <form method="dialog" className="modal-backdrop">
          {/* alert for unsuccessful withdrawal */}
          {successfulWithdrawal == false && (
              <div role="alert" className="alert alert-error fixed top-0 left-0 w-full z-50">
                  <div className="flex items-center">
                      <div className="flex items-center">
                          <PiWarningDiamondFill size={25}/>
                          <span className="mx-2">Error withdrawing arrangement</span>
                      </div>
                      <div className="absolute top-4 right-7">
                          {/* Right side: Close icon */}
                          <IoMdClose size={30} onClick={() => setSuccessfulWithdrawal(null)}/>
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

export default ModalWithdraw