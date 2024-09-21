import ScheduleTable from "./ScheduleTable";
import Spinner from "../components/Spinner";
import { useState, useEffect } from 'react';

const Accordion = () => {
    const [loading, setLoading] = useState(false); 

    return (
        <div>
            <div className="flex">
                <div className="collapse collapse-arrow ">
                    <input type="radio" name="my-accordion-2" defaultChecked />
                    <div className="collapse-title text-xl font-medium">Work From Home Dates</div>
                    <div className="collapse-content">
                    {loading ? <Spinner loading={loading} /> : (
                        <ScheduleTable />
                    )}    
                    </div>
                </div>
            </div>

            <div className="flex">
                <div className="collapse collapse-arrow ">
                    <input type="radio" name="my-accordion-2" />
                    <div className="collapse-title text-xl font-medium">Leave Dates</div>
                    <div className="collapse-content">
                    {loading ? <Spinner loading={loading} /> : (
                        <ScheduleTable />
                    )}
                    </div>
                </div>
            </div>

            <div className="flex">
                <div className="collapse collapse-arrow ">
                    <input type="radio" name="my-accordion-2" />
                    <div className="collapse-title text-xl font-medium">Pending Requests</div>
                    <div className="collapse-content">
                    {loading ? <Spinner loading={loading} /> : (
                        <ScheduleTable />
                    )}
                    </div>
                </div>
            </div>

        </div>
  )
}

export default Accordion