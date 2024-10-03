
const ModalApply = ({selectedDates}) => {

    // const compileSelectedDates = () => {
    // }
    
    // console.log(selectedDates)
    return (
      <>
          <button className="btn btn-outline btn-sm ml-5" onClick={()=>document.getElementById('apply_modal').showModal()}>Apply</button>
          <dialog id="apply_modal" className="modal">
          <div className="modal-box">
                <h3 className="font-bold text-lg">Do you want to apply for WFH arrangement?</h3><br/>
                {selectedDates.length > 0 ? <p>You selected the following dates</p>
                :
                <p>You did not select any dates.</p>}
                <br/>
                
                <p>
                    {selectedDates.map((d, index) => (
                        <>
                            <span>{index+1}. </span>
                            <span>{d.toLocaleDateString()}</span>
                            <br></br>
                        </>
                    ))}
                </p>
                
                <p className="py-4">Press ESC key or click outside to close</p>
          </div>
          <form method="dialog" className="modal-backdrop">
              <button>close</button>
          </form>
          </dialog>
      </>
    )
  }
  
  export default ModalApply