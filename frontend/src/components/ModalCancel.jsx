const ModalCancel = () => {
    return (
      <>
          <button className="btn btn-primary btn-xs rounded-full" onClick={()=>document.getElementById('cancel_modal').showModal()}>Actions</button>
          <dialog id="cancel_modal" className="modal">
          <div className="modal-box">
              <h3 className="font-bold text-lg">Do you want to cancel your pending WFH arrangement?</h3>
              <p className="py-4">Press ESC key or click outside to close</p>
          </div>
          <form method="dialog" className="modal-backdrop">
              <button>close</button>
          </form>
          </dialog>
      </>
    )
  }
  
  export default ModalCancel