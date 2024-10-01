import AccordionRow from "./AccordionRow";


const AccordionTeamInChargeOf = ({loading, data}) => {
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
        <AccordionRow rowName={"Work From Home Dates"} loading={loading} data={wfhData}/>
        <AccordionRow rowName={"Work From Office Dates"} loading={loading} data={wfhData}/>
        <AccordionRow rowName={"Pending Requests"} loading={loading} data={pendingData}/>
    </div>
  )
}

export default AccordionTeamInChargeOf