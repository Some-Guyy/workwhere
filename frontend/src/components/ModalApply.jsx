import { useState } from "react";
import { IoMdClose } from "react-icons/io";
import { CiWarning } from "react-icons/ci";

const ModalApply = ({selectedDates, wfhDays}) => {
    const [moreThanTwo, setMoreThanTwo] = useState(false);
    const [showMoreThanTwoAlert, setShowMoreThanTwoAlert] = useState(false)
    
    const checkMoreThanTwoAndShowModal = () => {
        // Opens up the modal
        document.getElementById('apply_modal').showModal();

        // checks if more than 2 days
        if(wfhDays.length >= 2){
            setMoreThanTwo(true);
            setShowMoreThanTwoAlert(true);
        }else{
            let totalTentativeWFHDays = selectedDates.length + wfhDays.length;
            if (totalTentativeWFHDays >= 2) {
                setMoreThanTwo(true);
                setShowMoreThanTwoAlert(true);
                // alert();
            }else{
                setMoreThanTwo(false);
                setShowMoreThanTwoAlert(false);
            }
        }  
        };

    return (
      <>
          <button className="btn btn-outline btn-sm ml-5" onClick={checkMoreThanTwoAndShowModal}>Apply</button>
          <dialog id="apply_modal" className="modal">
          <div className="modal-box">
                <h3 className="font-bold text-lg">Do you want to apply for WFH arrangement?</h3><br/>
                {/* Alert for 2 or more WFH days */}
                {moreThanTwo ? 
                <p>Not that you will have 2 or more WFH days</p>
                :
                <></>}<br/>
                
                {/* Conditional rendering of whether selected dates */}
                {selectedDates.length > 0 ? 
                <p>You selected the following dates</p>
                :
                <p>You did not select any dates.</p>}
                <br/>
                
                {/* mapping of the dates */}
                <div>
                    <form>
                    {selectedDates.map((d, index) => (
                        <div className="border-2 border-primary rounded-lg p-5 mb-3" key={index}>
                            <span className="font-bold text-2xl">Arrangement {index+1}: </span>
                            <span className="font-bold text-2xl">{`${d.toLocaleDateString().split("/")[1]}/${d.toLocaleDateString().split("/")[0]}/${d.toLocaleDateString().split("/")[2]}` }</span>
                            <br/>

                            <select className="select select-bordered w-full my-2">
                                <option disabled selected>Select WFH Type</option>
                                <option>AM</option>
                                <option>PM</option>
                                <option>Fullday</option>
                            </select>

                            <label className="input input-bordered flex items-center gap-2">
                                Reason
                                <input type="text" className="grow" placeholder="Input your reasoning" />
                            </label>

                            <input type="file" className="file-input file-input-bordered w-full mt-2" />

                            <br></br>
                        </div>
                    ))}
                        {selectedDates.length > 0  ? 
                        <button className="btn btn-block btn-neutral mt-10">Submit your application</button>
                        :
                        <></>}
                        
                    </form>
                </div>
                
                <p className="py-4">Press ESC key or click outside to close</p>
          </div>
            <form method="dialog" className="modal-backdrop">
                {/* Alert popup */}
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
                <button>close</button>
            </form>
          </dialog>
      </>
    )
  }
  
  export default ModalApply