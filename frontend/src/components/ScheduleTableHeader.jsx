const ScheduleTableHeader = ({activeSchedule, isWFODate, isManageOwnApplication, isPending}) => {
  return (
        <>
            {activeSchedule == "Your Schedule"  && isPending == true?
                <>
                <tr className="text-center">
                    <th>S/N</th>
                    <th>Date</th>
                    <th>Type</th>
                </tr>
                </>
                : activeSchedule == "Your Schedule" && isManageOwnApplication == true? 
                <>
                <tr className="text-center">
                    <th>S/N</th>
                    <th>Date</th>
                    <th>Type</th>
                    <th>Approved By</th>
                    {/* <th></th> */}
                </tr>
                </>
                : activeSchedule == "Your Schedule"? 
                <>
                <tr className="text-center">
                    <th>S/N</th>
                    <th>Date</th>
                    <th>Type</th>
                    <th>Approved By</th>
                </tr>
                </>
                : activeSchedule == "Your Team Schedule" && isWFODate == true? 
                <>
                <tr className="text-center">
                    <th>S/N</th>
                    <th>Staff Name</th>
                </tr>
                </>
                : activeSchedule == "Your Team Schedule" ? 
                <>
                <tr className="text-center">
                    <th>S/N</th>
                    <th>Staff Name</th>
                    <th>Date</th>
                    <th>Type</th>
                    <th>Approved By</th>
                </tr>
                </>
                : activeSchedule == "Your Overall Schedule" && isPending == true? 
                <>
                <tr className="text-center">
                    <th>S/N</th>
                    <th>Staff Name</th>
                    <th>Date</th>
                    <th>Type</th>
                </tr>
                </>
                : activeSchedule == "Your Overall Schedule" && isWFODate == true? 
                <>
                <tr className="text-center">
                    <th>S/N</th>
                    <th>Staff Name</th>
                </tr>
                </>
                : activeSchedule == "Your Overall Schedule" ? 
                <>
                <tr className="text-center">
                    <th>S/N</th>
                    <th>Staff Name</th>
                    <th>Date</th>
                    <th>Type</th>
                    <th>Approved By</th>
                </tr>
                </>
                : activeSchedule == "Your team in charge of" && isWFODate == true? 
                <>
                <tr className="text-center">
                    <th>S/N</th>
                    <th>Staff Name</th>
                </tr>
                </>
                : activeSchedule == "Your team in charge of" && isPending == true? 
                <>
                <tr className="text-center">
                    <th>S/N</th>
                    <th>Staff Name</th>
                    <th>Date</th>
                    <th>Type</th>
                </tr>
                </>
                : activeSchedule == "Your team in charge of"? 
                <>
                <tr className="text-center">
                    <th>S/N</th>
                    <th>Staff Name</th>
                    <th>Date</th>
                    <th>Type</th>
                    <th>Approved By</th>
                </tr>
                </>
                : "A"
            }
        </>
    )
}

export default ScheduleTableHeader