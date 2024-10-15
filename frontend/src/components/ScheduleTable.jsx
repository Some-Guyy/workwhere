import ScheduleTableRow from "./ScheduleTableRow"
import ScheduleTableHeader from "./ScheduleTableHeader"
import {useState,useEffect} from "react"

const ScheduleTable = ({data, headCount, activeSchedule, isWFODate, isPending, isManageOwnApplication, successfulCancellation, setSuccessfulCancellation, isForCancel, cancelWFH, successfulApprovalRejection, setSuccessfulApprovalRejection, approveRejectWFH}) => {
    const [First, setFirst] = useState(0); 
    const [Second, setSecond] = useState(10); 
    const dataLength = data.length

    const ShowNext = ()=>{
        if (First + 10 < dataLength){
            setFirst(First+10)
        }
        if (Second + 10 < dataLength){
            setSecond(Second + 10)
        }
        else{
            setSecond(dataLength)
        }
    }
    const ShowPrevious = () =>{
        if (First - 10 >= 0){
            setFirst(First-10)
        }
        if (Second%10 == 0 && Second >= 20){
            setSecond(Second - 10)
        }
        else if (Second%10 != 0){
            setSecond(Second - (Second%10))
        }
    }
        

    // console.log(data)
  return (

    <>{data.length<1 ? 
        <div className="flex justify-center w-11/12">
            No data found here
        </div> 

        : (

        <div className="flex justify-center w-11/12">
            <div className=" m-4 overflow-x-auto">
             {activeSchedule != 'Your Schedule' && isPending == null?   
            <span className="font-semibold text-lg text-black-500">HeadCount: {dataLength}/{headCount}</span>
             :null}
                <table className="table table-pin-rows overflow-x-auto">
                    <thead>
                        <ScheduleTableHeader activeSchedule={activeSchedule} isWFODate={isWFODate} isManageOwnApplication={isManageOwnApplication} isPending={isPending}/>
                    </thead>
                    <tbody>
                        {data.slice(First,Second).map((d, index) => (
                            <ScheduleTableRow key={index} modalKey={index} details={d} index={index+First} activeSchedule={activeSchedule} isWFODate={isWFODate} isPending={isPending} isManageOwnApplication={isManageOwnApplication} successfulCancellation={successfulCancellation} setSuccessfulCancellation={setSuccessfulCancellation} isForCancel={isForCancel} cancelWFH={cancelWFH} successfulApprovalRejection={successfulApprovalRejection} setSuccessfulApprovalRejection={setSuccessfulApprovalRejection} approveRejectWFH={approveRejectWFH}/>
                        ))}
                    </tbody>
                </table>
            {data.length > 10?
            <div className="flex justify-between w-full mt-4 mb-4">
                {/* Left-aligned button */}
                {First > 0 ?
                <button onClick={ShowPrevious} className="btn btn-sm">Previous</button>
                :null}
                {/* Right-aligned button */}
                {Second < data.length?
                <div className="flex justify-end w-full">
                    <button onClick={ShowNext} className="btn btn-sm">Next</button>
                </div>
                :null
                }   
            </div>
            :null}
            </div>
        </div>
    )}
    </>
  )
}

export default ScheduleTable