import AccordionRow from "./AccordionRow";

const Accordion = ({loading, data, yourSchedule}) => {
    const wfhData = [];
    const pendingData = [];
    const leaveData = [];

    async function filterData() {
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
    }; 
    
    filterData();
    
    return (
        <div className="">
            {yourSchedule ? 
            <>
                <AccordionRow rowName={"Work From Home Dates"} loading={loading} data={wfhData}/>
                <AccordionRow rowName={"Leave Dates"} loading={loading} data={leaveData}/>
                <AccordionRow rowName={"Pending Requests"} loading={loading} data={pendingData}/>
            </>
             : 
            <>
                <AccordionRow rowName={"Work From Home Dates"} loading={loading} data={wfhData}/>
                <AccordionRow rowName={"Work From Office Dates"} loading={loading} data={wfhData}/>
                {/* <AccordionRow rowName={"Leave Dates"} loading={loading} data={leaveData}/> */}
            </>}
        </div>
  )
}

export default Accordion