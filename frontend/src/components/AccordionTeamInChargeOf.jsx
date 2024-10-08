import AccordionRow from "./AccordionRow";


const AccordionTeamInChargeOf = ({loading, data}) => {
    const wfhData = [];
    const pendingData = [];
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
                    nameOfWFH.push(d.Staff_ID);
                }else if (d.status == "pending"){
                    pendingData.push(d);
                }else{
                    leaveData.push(d);
                }
            }

            // team members name
            headCount = data.inChargeOf.length
            for (const d of data.inChargeOf) {
                // console.log(d);
                if(!nameOfWFH.includes(d.Staff_ID)){
                    nameOfOtherStaffs.push(d);
                }else{
                    continue;
                }
            }
        }
    }; 
    
    filterData();
  return (
    <div className="">
        <AccordionRow rowName={"Work From Home Dates"} loading={loading} data={wfhData} headCount={headCount} activeSchedule={activeSchedule} isWFODate={false}/>
        <AccordionRow rowName={"Work From Office Dates"} loading={loading} data={nameOfOtherStaffs} headCount={headCount} activeSchedule={activeSchedule} isWFODate={true}/>
        <AccordionRow rowName={"Pending Requests"} loading={loading} data={pendingData} activeSchedule={activeSchedule} headCount={headCount} isWFODate={false} isPending={isPending}/>
    </div>
  )
}

export default AccordionTeamInChargeOf