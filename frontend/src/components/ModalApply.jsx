import { useState, useEffect } from "react";
import { IoMdClose } from "react-icons/io";
import { CiWarning } from "react-icons/ci";
import { PiWarningDiamondFill } from "react-icons/pi";
import { GrStatusGood } from "react-icons/gr";

const ModalApply = ({selectedDates, wfhDays, addWFH, successfulApplication, setSuccessfulApplication}) => {
    const [moreThanTwo, setMoreThanTwo] = useState(false);
    const [showMoreThanTwoAlert, setShowMoreThanTwoAlert] = useState(false);
    
    
    const [dates, setDates] = useState([]); // State to store form data for each date
    
    const [userDetails, setUserDetails] = useState(null); // State to store user details


    // Used to fetch user details
    useEffect(() => {
      const localStoreaged = localStorage.getItem('state');
      const userDetailsFromStorage = JSON.parse(localStoreaged);
      setUserDetails(userDetailsFromStorage);
    }, []);


    // shows modal if more than 2 dates and show warning as well
    const checkMoreThanTwoAndShowModal = () => {
        document.getElementById('apply_modal').showModal();

        if(wfhDays.length >= 2){
            setMoreThanTwo(true);
            setShowMoreThanTwoAlert(true);
        }else{
            let totalTentativeWFHDays = selectedDates.length + wfhDays.length;
            if (totalTentativeWFHDays >= 2) {
                setMoreThanTwo(true);
                setShowMoreThanTwoAlert(true);
            }else{
                setMoreThanTwo(false);
                setShowMoreThanTwoAlert(false);
            }
        }  
    };

    // Handle form input changes
    const handleInputChange = (index, field, value) => {
        const updatedDates = [...dates];
        updatedDates[index][field] = value;
        setDates(updatedDates);
    };

    // Update dates state whenever selectedDates changes
    useEffect(() => {
        setDates(selectedDates.map((d) => ({
            date: `${d.toLocaleDateString().split("/")[2]}-${d.toLocaleDateString().split("/")[0]}-${d.toLocaleDateString().split("/")[1]}` ,
            time: "am",
            reason: "",
            // file: null
        })));
    }, [selectedDates]);

    // Handle form submission
    const handleSubmit = (event) => {
        event.preventDefault();
        // Process formData here (send it to an API, or display it, etc.)
        const formData = {
            Staff_ID: userDetails.Staff_ID,
            Staff_FName: userDetails.Staff_FName, 
            Staff_LName: userDetails.Staff_LName, 
            dates
        }
            
        addWFH(formData)
        console.log(formData);
        // console.log(successfulApplication);

    };

    return (
      <>
          <button className="btn btn-outline btn-sm ml-5" onClick={checkMoreThanTwoAndShowModal}>Apply</button>
          <dialog id="apply_modal" className="modal">
          <div className="modal-box">
                <h3 className="font-bold text-lg">Do you want to apply for WFH arrangement?</h3><br/>
                
                {/* Alert for 2 or more WFH days */}
                {moreThanTwo ? <p>Note that you will have 2 or more WFH days</p> : <></>}<br/>
                
                {/* Conditional rendering of whether selected dates */}
                {selectedDates.length > 0 ? 
                <p>You selected the following dates</p>
                :
                <p>You did not select any dates.</p>}
                <br/>
                
                {/* Mapping of the dates */}
                <div>
                    <form onSubmit={handleSubmit}>
                    {selectedDates.map((d, index) => (
                        <div className="border-2 border-primary rounded-lg p-5 mb-3" key={index}>
                            <span className="font-bold text-2xl">Arrangement {index+1}: </span>
                            <span className="font-bold text-2xl">{`${d.toLocaleDateString().split("/")[1]}/${d.toLocaleDateString().split("/")[0]}/${d.toLocaleDateString().split("/")[2]}` }</span>
                            <br/>

                            {/* Check if dates[index] exists before accessing its properties */}
                            {dates[index] && (
                              <>
                                {/* Type data */}
                                <label className="input input-bordered flex items-center gap-2 my-2">Type  
                                    <select 
                                        required 
                                        className="ml-2 select select-bordered w-full"
                                        value={dates[index].time} // Binding to state
                                        onChange={(e) => handleInputChange(index, "time", e.target.value)} // Update state
                                    >
                                        <option value="am">Am</option>
                                        <option value="pm">Pm</option>
                                        <option value="fullday">Fullday</option>
                                    </select>
                                </label>

                                {/* Reasoning data */}
                                <label className="input input-bordered flex items-center gap-2">
                                    Reason
                                    <input 
                                        required 
                                        type="text" 
                                        className="grow" 
                                        placeholder="Input your reasoning"
                                        value={dates[index].reason} // Binding to state
                                        onChange={(e) => handleInputChange(index, "reason", e.target.value)} // Update state
                                    />
                                </label>

                                {/* File Input */}
                                <input 
                                    type="file" 
                                    className="file-input file-input-bordered w-full mt-2" 
                                    onChange={(e) => handleInputChange(index, "file", e.target.files[0])} // Update state
                                />
                              </>
                            )}
                            <br></br>
                        </div>
                    ))}
                        {selectedDates.length > 0 ? 
                        <button type="submit" className="btn btn-block btn-neutral mt-10">Submit your application</button>
                        :
                        <></>}
                        
                    </form>
                </div>
                
                <p className="py-4">Press ESC key or click outside to close</p>
                </div>
                <form method="dialog" className="modal-backdrop">
                    {/* warning for more than 2 wfh popup */}
                    {showMoreThanTwoAlert && (
                        <div role="alert" className="alert alert-warning fixed top-0 left-0 w-full z-50">
                            <div className="flex items-center">
                                <div className="flex items-center">
                                    <CiWarning size={25}/>
                                    <span className="mx-2">You will have 2 or more WFH days.</span>
                                </div>
                                <div className="absolute top-4 right-7">
                                    {/* Right side: Close icon */}
                                    <IoMdClose size={30} onClick={() => setShowMoreThanTwoAlert(false)}/>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* warning for successful wfh */}
                    {successfulApplication == true && (
                        <div role="alert" className="alert alert-success fixed top-0 left-0 w-full z-50">
                            <div className="flex items-center">
                                <div className="flex items-center">
                                    <GrStatusGood size={25}/>
                                    <span className="mx-2">Successfully created arrangement</span>
                                </div>
                                <div className="absolute top-4 right-7">
                                    {/* Right side: Close icon */}
                                    <IoMdClose size={30} onClick={() => setSuccessfulApplication(null)}/>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* warning for successful wfh */}
                    {successfulApplication == false && (
                        <div role="alert" className="alert alert-error fixed top-0 left-0 w-full z-50">
                            <div className="flex items-center">
                                <div className="flex items-center">
                                    <PiWarningDiamondFill size={25}/>
                                    <span className="mx-2">Error creating arrangement</span>
                                </div>
                                <div className="absolute top-4 right-7">
                                    {/* Right side: Close icon */}
                                    <IoMdClose size={30} onClick={() => setSuccessfulApplication(null)}/>
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

export default ModalApply;
