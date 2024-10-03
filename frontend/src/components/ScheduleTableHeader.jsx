const ScheduleTableHeader = ({activeSchedule, isWFODate}) => {
  return (
        <>
            {activeSchedule == "Your Schedule" ?
                <>
                <tr>
                    <th>S/N</th>
                    <th>Date</th>
                    <th>Type</th>
                    <th>Approved By</th>
                </tr>
                </>
                : activeSchedule == "Your Team Schedule" && isWFODate == true? 
                <>
                <tr>
                    <th>S/N</th>
                    <th>Staff Name</th>
                </tr>
                </>
                : activeSchedule == "Your Team Schedule" ? 
                <>
                <tr>
                    <th>S/N</th>
                    <th>Staff Name</th>
                    <th>Date</th>
                    <th>Type</th>
                    <th>Approved By</th>
                </tr>
                </>
                : activeSchedule == "Your Overall Schedule" && isWFODate == true? 
                <>
                <tr>
                    <th>S/N</th>
                    <th>Staff Name</th>
                </tr>
                </>
                : activeSchedule == "Your Overall Schedule" ? 
                <>
                <tr>
                    <th>S/N</th>
                    <th>Staff Name</th>
                    <th>Date</th>
                    <th>Type</th>
                    <th>Approved By</th>
                </tr>
                </>
                : activeSchedule == "Your team in charge of" &&  isWFODate == true? 
                <>
                <tr>
                    <th>S/N</th>
                    <th>Staff Name</th>
                </tr>
                </>
                : activeSchedule == "Your team in charge of"? 
                <>
                <tr>
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