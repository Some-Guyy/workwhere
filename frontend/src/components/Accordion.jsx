import AccordionRow from "./AccordionRow";

const Accordion = ({loading, data, yourSchedule, activeSchedule}) => {
    const wfhData = [];
    const pendingData = [];
    const leaveData = [];

    const nameOfOtherStaffs = [];
    

    async function filterData() {
        let nameOfWFH = [];

        // console.log(data)
        if(activeSchedule=="Your Schedule"){
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
            for (const d of data.teamMembers) {
                // console.log(d);
                if(!nameOfWFH.includes(d.Staff_ID)){
                    nameOfOtherStaffs.push(d);
                }else{
                    continue;
                }
            }
        }else if(activeSchedule=="Your Overall Schedule"){
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
            {yourSchedule ? 
            <>
                <AccordionRow rowName={"Work From Home Dates"} loading={loading} data={wfhData} activeSchedule={activeSchedule} isWFODate={false}/>
                <AccordionRow rowName={"Leave Dates"} loading={loading} data={leaveData} activeSchedule={activeSchedule} isWFODate={false}/>
                <AccordionRow rowName={"Pending Requests"} loading={loading} data={pendingData} activeSchedule={activeSchedule} isWFODate={false}/>
            </>
             : 
            <>
                <AccordionRow rowName={"Work From Home Dates"} loading={loading} data={wfhData} activeSchedule={activeSchedule} isWFODate={false}/>
                <AccordionRow rowName={"Work From Office Dates"} loading={loading} data={nameOfOtherStaffs} activeSchedule={activeSchedule} isWFODate={true}/>
                {/* <AccordionRow rowName={"Leave Dates"} loading={loading} data={leaveData}/> */}
            </>}
        </div>
  )
}

export default Accordion