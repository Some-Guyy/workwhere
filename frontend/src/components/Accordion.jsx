import ScheduleTable from "./ScheduleTable";

const Accordion = () => {
  return (
    <div>
        

        <div className="flex">
            <div className="collapse collapse-arrow ">
                <input type="radio" name="my-accordion-2" defaultChecked />
                <div className="collapse-title text-xl font-medium">Work From Home Dates</div>
                <div className="collapse-content">
                    <ScheduleTable />
                </div>
            </div>
        </div>

        <div className="flex">
            <div className="collapse collapse-arrow ">
                <input type="radio" name="my-accordion-2" />
                <div className="collapse-title text-xl font-medium">Leave Dates</div>
                <div className="collapse-content">
                    <ScheduleTable />
                </div>
            </div>
        </div>

        <div className="flex">
            <div className="collapse collapse-arrow ">
                <input type="radio" name="my-accordion-2" />
                <div className="collapse-title text-xl font-medium">Pending Requests</div>
                <div className="collapse-content">
                    <ScheduleTable />
                </div>
            </div>
        </div>

    </div>
  )
}

export default Accordion