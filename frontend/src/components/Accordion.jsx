import ScheduleTable from "./ScheduleTable";

const Accordion = () => {
  return (
    <div>
        <div className="text-center">
            Your Schedule/Your team schedule/Your department schedule
        </div>

        <div className="flex">
            <div className="basis-1/5 "></div>
                <div className="collapse collapse-arrow basis-3/5">
                    <input type="radio" name="my-accordion-2" defaultChecked />
                    <div className="collapse-title text-xl font-medium">Work From Home Dates</div>
                    <div className="collapse-content">
                        <ScheduleTable />
                    </div>
                </div>
            <div className="basis-1/5 "></div>
        </div>

        <div className="flex">
            <div className="basis-1/5 "></div>
                <div className="collapse collapse-arrow basis-3/5">
                    <input type="radio" name="my-accordion-2" />
                    <div className="collapse-title text-xl font-medium">Leave Dates</div>
                    <div className="collapse-content">
                        <ScheduleTable />
                    </div>
                </div>
            <div className="basis-1/5 "></div>
        </div>

        <div className="flex">
            <div className="basis-1/5 "></div>
                <div className="collapse collapse-arrow basis-3/5">
                    <input type="radio" name="my-accordion-2" />
                    <div className="collapse-title text-xl font-medium">Pending Requests</div>
                    <div className="collapse-content">
                        <ScheduleTable />
                    </div>
                </div>
            <div className="basis-1/5 "></div>
        </div>

    </div>
  )
}

export default Accordion