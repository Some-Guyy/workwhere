const ModalAttachment = ({modalId,file}) => {
    return(
    <>
        <button className="btn btn-primary btn-xs rounded-full" onClick={()=>document.getElementById(modalId).showModal()}>View</button>
        <dialog id={modalId} className="modal">
        <div className="modal-box flex items-center justify-center"> {/* Centering content */}
                    <img
                        src={file} // Set the image source
                        className="max-w-full max-h-full object-contain" // Tailwind classes to avoid cropping
                    />
        </div>
        <form method="dialog" className="modal-backdrop">
            <button>close</button>
        </form>
        </dialog>
    </>
    )
}

export default ModalAttachment