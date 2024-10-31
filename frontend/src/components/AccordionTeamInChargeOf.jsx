import AccordionRow from "./AccordionRow";


const AccordionTeamInChargeOf = ({loading, data, pendingData, approveRejectWFH, successfulApprovalRejectionWithdrawal, setSuccessfulApprovalRejectionWithdrawal, approveRejectWithdrawal, withdrawSubordinate}) => {
    const wfhData = [];
    const pendingDataForAccordion = [];
    const leaveData = [];
    var headCount = 0
    const nameOfOtherStaffs = [];
    const activeSchedule = "Your team in charge of";
    const isPending = true;

    async function filterData() {
        
        let nameOfWFH = [];

        // your staff working arrangements
        if (data != null){
            for (const d of data.workingArrangements) {
                // console.log(d);
                if(d.status == "approved"){
                    wfhData.push(d);
                    nameOfWFH.push(d.staffId);
                }else{
                    continue;
                }
            }

            // team members name
            headCount = data.inChargeOf.length
            for (const d of data.inChargeOf) {
                // console.log(d);
                if(!nameOfWFH.includes(d.staffId)){
                    nameOfOtherStaffs.push(d);
                }else{
                    continue;
                }
            }
        }
        // console.log(pendingData);
        if (pendingData != null){
            for (const d of pendingData.workingArrangements) {
                // console.log(d);
                if (d.status == "pending" || d.status === "pendingWithdrawal"){
                    pendingDataForAccordion.push(d);
                }
            }
            // console.log(pendingDataForAccordion)

        }        
    }; 
    
    filterData();
  return (
    <div className="">
        <AccordionRow rowName={"Work From Home Dates"} loading={loading} data={wfhData} headCount={headCount} activeSchedule={activeSchedule} isWFODate={false} withdrawSubordinate={withdrawSubordinate}/>
        <AccordionRow rowName={"Work From Office Dates"} loading={loading} data={nameOfOtherStaffs} headCount={headCount} activeSchedule={activeSchedule} isWFODate={true}/>
        <AccordionRow rowName={"Pending Requests"} loading={loading} data={pendingDataForAccordion} activeSchedule={activeSchedule} headCount={headCount} isWFODate={false} isPending={isPending} approveRejectWFH={approveRejectWFH} successfulApprovalRejectionWithdrawal={successfulApprovalRejectionWithdrawal} setSuccessfulApprovalRejectionWithdrawal={setSuccessfulApprovalRejectionWithdrawal} approveRejectWithdrawal={approveRejectWithdrawal}/>
    </div>
  )
}

export default AccordionTeamInChargeOf