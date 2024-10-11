import AccordionRow from "./AccordionRow";

const Accordion = ({loading, data, yourSchedule, activeSchedule, isManageOwnApplication, successfulCancellation, setSuccessfulCancellation, isForCancel}) => {
    const wfhData = [];
    const pendingData = [];
    const leaveData = []; 
    var headCount = 0
    const nameOfOtherStaffs = [];
    

    async function filterData() {
        let nameOfWFH = [];

        // console.log(data)
        if(activeSchedule=="Your Schedule" && data != null){
            for (const d of data) {
                // console.log(d);
                if(d.status == "approved"){
                    wfhData.push(d);
                }else if (d.status == "pending"){
                    pendingData.push(d);
                }else{
                    leaveData.push(d);
                }
            }
        }else if(activeSchedule=="Your Team Schedule"){
            // working arrangements
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
            // headCount = data.teamMembers.length
            for (const d of data.teamMembers) {
                // console.log(d);
                if(!nameOfWFH.includes(d.Staff_ID)){
                    nameOfOtherStaffs.push(d);
                }else{
                    continue;
                }
            }
        }else if(activeSchedule=="Your Overall Schedule" && data.workingArrangements != null){
            // working arrangements
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

            // Department members name
            headCount = data.sameDepart.length
            for (const d of data.sameDepart) {
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
            {yourSchedule? 
            <>
                <AccordionRow rowName={"Work From Home Dates"} loading={loading} data={wfhData} headCount = {headCount} activeSchedule={activeSchedule} isWFODate={false} isManageOwnApplication={isManageOwnApplication}/>
                <AccordionRow rowName={"Leave Dates"} loading={loading} data={leaveData} headCount = {headCount} activeSchedule={activeSchedule} isWFODate={false} isManageOwnApplication={isManageOwnApplication}/>
                <AccordionRow rowName={"Pending Requests"} loading={loading} data={pendingData} headCount = {headCount} activeSchedule={activeSchedule} isWFODate={false} isManageOwnApplication={isManageOwnApplication} isPending={true} successfulCancellation={successfulCancellation} setSuccessfulCancellation={setSuccessfulCancellation} isForCancel={isForCancel} />
            </>
             : 
            <>
                <AccordionRow rowName={"Work From Home Dates"} loading={loading} data={wfhData} headCount = {headCount} activeSchedule={activeSchedule} isWFODate={false}/>
                <AccordionRow rowName={"Work From Office Dates"} loading={loading} data={nameOfOtherStaffs} headCount = {headCount} activeSchedule={activeSchedule} isWFODate={true}/>
                <AccordionRow rowName={"Pending Requests"} loading={loading} data={pendingData} headCount = {headCount} activeSchedule={activeSchedule} isWFODate={false} isManageOwnApplication={isManageOwnApplication} isPending={true} successfulCancellation={successfulCancellation} setSuccessfulCancellation={setSuccessfulCancellation} isForCancel={isForCancel} />

                {/* <AccordionRow rowName={"Leave Dates"} loading={loading} data={leaveData}/> */}
            </>}
        </div>
  )
}

export default Accordion