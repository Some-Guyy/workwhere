import Accordion from "./Accordion"

const ViewScheduleSection = () => {
  return (
    <div className="">
        <div className="font-bold text-4xl mt-10 ml-5 mb-5 text-center">
            Your Schedule
        </div>

        <div className="flex">
            <div className="basis-1/5 "></div>

            <div className="basis-3/5">
                <div className="text-center">
                    <button className="btn btn-outline btn-info m-2">Your Schedule</button>
                    <button className="btn btn-outline btn-success m">Your Team Schedule</button>
                    <button className="btn btn-outline btn-warning m-2">Your Department Schedule</button>
                    <button className="btn btn-outline btn-error">Overall Scheule</button>
                </div>
                <Accordion />
            </div>

            <div className="basis-1/5 "></div>
        </div>

        <hr className="my-10 w-9/12 m-auto" />
    </div>
  )
}

export default ViewScheduleSection