import Calender from "./Calender";

const Hero = () => {
  return (
    <div className="mt-14">
        <div className="hero bg-base-200 min-h-screen">
            <div className="hero-content flex-col lg:flex-row-reverse">
                <div className="text-center lg:text-left lg:ml-5">
                    <h1 className="text-5xl font-bold">Hi Ryan!</h1>
                    <p className="py-6">
                        You have 2 more days of WFH this month, your next WFH is on 2nd October 2024. You  have 10 requests not approved yet.
                    </p>
                </div>

                <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">
                    <Calender />
                </div>

            </div>
        </div>
    </div>
  )
}

export default Hero