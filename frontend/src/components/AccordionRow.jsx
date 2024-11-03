import ScheduleTable from "./ScheduleTable";
import Spinner from "../components/Spinner";
import React from 'react'

const AccordionRow = ({rowName, loading, data, headCount, activeSchedule, isWFODate, isPending, isManageOwnApplication, successfulCancellation, setSuccessfulCancellation, isForCancel, cancelWFH, approveRejectWFH, withdrawalWFH, successfulApprovalRejectionWithdrawal, setSuccessfulApprovalRejectionWithdrawal, approveRejectWithdrawal, withdrawSubordinate}) => {
  
  // console.log(typeof(cancelWFH));
  return (
    <div className="flex">
        <div className="collapse collapse-arrow ">
            <input type="radio" name="my-accordion-2"/>
            <div className="collapse-title text-xl font-medium">{rowName}</div>
            <div className="collapse-content">
            {loading ? <Spinner loading={loading} /> : (
                <ScheduleTable data={data} headCount={headCount} activeSchedule={activeSchedule} isWFODate={isWFODate} isPending={isPending} isManageOwnApplication={isManageOwnApplication} successfulCancellation={successfulCancellation} setSuccessfulCancellation={setSuccessfulCancellation} isForCancel={isForCancel} cancelWFH={cancelWFH} approveRejectWFH={approveRejectWFH} withdrawalWFH={withdrawalWFH} successfulApprovalRejectionWithdrawal={successfulApprovalRejectionWithdrawal} setSuccessfulApprovalRejectionWithdrawal={setSuccessfulApprovalRejectionWithdrawal} approveRejectWithdrawal={approveRejectWithdrawal} withdrawSubordinate={withdrawSubordinate}/>
            )}    
            </div>
        </div>
    </div>
  )
}

export default AccordionRow