import ScheduleTableRow from "./ScheduleTableRow"
import ScheduleTableHeader from "./ScheduleTableHeader"

const ScheduleTable = () => {
    const headerDetails = {
        no: "S/N",
        date: "Date",
        time: "Time",
        approvedBy: "Approved By"
    }

    const rowDetails = {
        no: "1",
        date: "12/01/2024",
        time: "10.00am-12.00pm",
        approvedBy: "Lee John"
    }
  return (
    <div className="flex justify-center w-11/12">
        <div className=" m-4 overflow-x-auto">
            <table className="table table-pin-rows overflow-x-auto">
                <thead>
                    <ScheduleTableHeader details={headerDetails}/>
                </thead>
                <tbody>
                    <ScheduleTableRow details={rowDetails} />
                    <ScheduleTableRow details={rowDetails} />
                </tbody>
            </table>
        </div>
    </div>
  )
}

export default ScheduleTable