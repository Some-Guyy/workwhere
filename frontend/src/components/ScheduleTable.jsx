import ScheduleTableRow from "./ScheduleTableRow"
import ScheduleTableHeader from "./ScheduleTableHeader"

const ScheduleTable = ({data, activeSchedule, isWFODate, isPending}) => {
    

    // console.log(data)
  return (

    <>{data.length<1 ? 
        <div className="flex justify-center w-11/12">
            No data found here
        </div> 

        : (

        <div className="flex justify-center w-11/12">
            <div className=" m-4 overflow-x-auto">
                <table className="table table-pin-rows overflow-x-auto">
                    <thead>
                        <ScheduleTableHeader activeSchedule={activeSchedule} isWFODate={isWFODate}/>
                    </thead>
                    <tbody>
                        {data.map((d, index) => (
                            <ScheduleTableRow key={index} details={d} index={index} activeSchedule={activeSchedule} isWFODate={isWFODate} isPending={isPending}></ScheduleTableRow>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )}
    </>
  )
}

export default ScheduleTable