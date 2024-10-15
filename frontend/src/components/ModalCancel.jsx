import { useState, useEffect } from "react";
import { IoMdClose } from "react-icons/io";
import { PiWarningDiamondFill } from "react-icons/pi";
import { GrStatusGood } from "react-icons/gr";

const ModalCancel = ({date, type, successfulCancellation, setSuccessfulCancellation, cancelWFH}) => {

    const [userDetails, setUserDetails] = useState(null); // State to store user details


    // Used to fetch user details
    useEffect(() => {
      const localStoreaged = localStorage.getItem('state');
      const userDetailsFromStorage = JSON.parse(localStoreaged);
      setUserDetails(userDetailsFromStorage);
    }, []);

    // console.log(date);
    // Handle form submission(cancel the WFH request)
    const handleCancel = (event) => {
        event.preventDefault();
        // Process formData here (send it to an API, or display it, etc.)
        const formData = {
            Staff_ID: userDetails.Staff_ID,
            startDate: `${date.split("/")[2]}-${date.split("/")[1]}-${date.split("/")[0]}`
        }
            
        cancelWFH(formData);
        console.log(formData);
        setSuccessfulCancellation(true);
        console.log("cancelled simulation")
        console.log(successfulCancellation)

    };


    return (
      <>
            <button className="btn btn-primary btn-xs rounded-full" onClick={()=>document.getElementById('cancel_modal').showModal()}>Actions</button>
            <dialog id="cancel_modal" className="modal">
            <div className="modal-box">
                <h3 className="font-bold text-lg">Do you want to cancel your pending WFH arrangement?</h3><br/>
                
                {/* Details of application to be cancelled */}
                <div>
                    <form onSubmit={handleCancel}>
                        <div className="border-2 border-primary rounded-lg p-5 mb-3">
                            <span className="font-bold text-2xl">Arrangement Date: {date}</span><br />
                            <span className="font-bold text-2xl">Arrangement Type: {type}</span>
                        </div>
                        <button type="submit" className="btn btn-block btn-neutral mt-5">Cancel your application</button>
                    </form>
                </div>
                <p className="py-4">Press ESC key or click outside to close</p>
            </div>
            <form method="dialog" className="modal-backdrop">
                {/* alert for successful cancel */}
                {successfulCancellation == true && (
                        <div role="alert" className="alert alert-success fixed top-0 left-0 w-full z-50">
                            <div className="flex items-center">
                                <div className="flex items-center">
                                    <GrStatusGood size={25}/>
                                    <span className="mx-2">Successfully cancelled arrangement</span>
                                </div>
                                <div className="absolute top-4 right-7">
                                    {/* Right side: Close icon */}
                                    <IoMdClose size={30} onClick={() => setSuccessfulCancellation(null)}/>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* alert for unsuccessful cancel */}
                    {successfulCancellation == false && (
                        <div role="alert" className="alert alert-error fixed top-0 left-0 w-full z-50">
                            <div className="flex items-center">
                                <div className="flex items-center">
                                    <PiWarningDiamondFill size={25}/>
                                    <span className="mx-2">Error cancelling arrangement</span>
                                </div>
                                <div className="absolute top-4 right-7">
                                    {/* Right side: Close icon */}
                                    <IoMdClose size={30} onClick={() => setSuccessfulCancellation(null)}/>
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
  
  export default ModalCancel