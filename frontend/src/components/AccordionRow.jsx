import ScheduleTable from "./ScheduleTable";
import Spinner from "../components/Spinner";
import React from 'react'

const AccordionRow = ({rowName, loading, data, activeSchedule, isWFODate, isPending}) => {
  return (
    <div className="flex">
        <div className="collapse collapse-arrow ">
            <input type="radio" name="my-accordion-2"/>
            <div className="collapse-title text-xl font-medium">{rowName}</div>
            <div className="collapse-content">
            {loading ? <Spinner loading={loading} /> : (
                <ScheduleTable data={data} activeSchedule={activeSchedule} isWFODate={isWFODate} isPending={isPending}/>
            )}    
            </div>
        </div>
    </div>
  )
}

export default AccordionRow