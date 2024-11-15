import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { IoMdClose } from "react-icons/io";
import { CiWarning } from "react-icons/ci";
import { PiWarningDiamondFill } from "react-icons/pi";
import { GrStatusGood } from "react-icons/gr";

const ModalApply = ({selectedDates, wfhDays, addWFH, successfulApplication, setSuccessfulApplication}) => {
    const [moreThanTwo, setMoreThanTwo] = useState(false);
    const [showMoreThanTwoAlert, setShowMoreThanTwoAlert] = useState(false);
    
    
    const [dates, setDates] = useState([]); // State to store form data for each date
    
    const [userDetails, setUserDetails] = useState(null); // State to store user details
    const navigate = useNavigate(); // Use navigate hook

    // Used to fetch user details
    useEffect(() => {
      const localStoreaged = localStorage.getItem('state');
      const userDetailsFromStorage = JSON.parse(localStoreaged);
      setUserDetails(userDetailsFromStorage);
    }, []);

    // Navigate to the Home Page when successfulApplication becomes true
    useEffect(() => {
        if (successfulApplication === true) {
            // Wait a moment and then navigate to a different page
            setTimeout(() => {
                navigate('/home', {
                    state: { successfulApplication: true }, // Send successfulApplication state
                });
            }, 2000); // 2-second delay

        }
    }, [successfulApplication, navigate]);

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
        if (value.type === 'image/jpg' || value.type === 'image/png' || value.type === 'image/jpeg') { // Check if it's a JPEG or PNG
            const reader = new FileReader();
            reader.onloadend = () => {
                value = reader.result; // Base64 string
                updatedDates[index][field] = value;
                setDates(updatedDates);
                
            }
            reader.readAsDataURL(value); // Read the file as a Data URL
        }
        else{
        updatedDates[index][field] = value;
        setDates(updatedDates);
        }
    };

    // Update dates state whenever selectedDates changes
    useEffect(() => {
        setDates(selectedDates.map((d) => ({
            date: `${d.getFullYear().toString()}-${(d.getMonth()+1).toString()}-${d.getDate().toString()}` ,
            time: "am",
            // reason: "",
            attachment: null
        })));
    }, [selectedDates]);

    // Handle form submission
    const handleSubmit = (event) => {
        event.preventDefault();
        // Process formData here (send it to an API, or display it, etc.)
        const formData = {
            staffId: userDetails.staffId,
            reportingId: userDetails.reportingId,
            staffFirstName: userDetails.staffFirstName, 
            staffLastName: userDetails.staffLastName, 
            dates
        }
        console.log(formData);    
        addWFH(formData);
        // console.log(formData);
        // console.log(successfulApplication);

    };

    return (
      <>
          <button className="btn btn-outline btn-sm ml-5" onClick={checkMoreThanTwoAndShowModal}>Apply</button>
          <dialog id="apply_modal" className="modal">
          <div className="modal-box max-h-[780px] mt-10">
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
                            <span className="font-bold text-2xl">{`${d.getDate().toString()}/${(d.getMonth()+1).toString()}/${d.getFullYear().toString()}` }</span>
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

                                {/* Reasoning data
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
                                </label> */}

                                {/* File Input */}
                                <input 
                                    type="file" 
                                    className="file-input file-input-bordered w-full mt-2"
                                    accept=".jpg, .png, .jpeg"  // Accept only JPG and PNG files 
                                    onChange={(e) => handleInputChange(index, "attachment", e.target.files[0])} // Update state
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

                    {/* alert for successful wfh */}
                    

                    {/* alert for unsuccessful wfh */}
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
