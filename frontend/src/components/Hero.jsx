import Calender from "./Calender";
import Stats from "./Stats";

const Hero = () => {
  return (
    <div className="mt-20">
        <div className="hero bg-primary min-h-screen glass">
            <div className="hero-content flex-col lg:flex-row-reverse">
                <div className="text-center lg:text-left lg:ml-5  text-base-100">
                    <div className="glass p-4">
                        <h1 className="text-5xl font-bold">Hi Ryan!</h1>
                        <p className="py-6">
                            You have 2 more days of WFH this month, your next WFH is on 2nd October 2024. You  have 10 requests not approved yet.
                        </p>
                    </div>
                    <div className="glass my-4 p-4">
                        <Stats />
                    </div>
                </div>

                <div className="card bg-base-300 w-full max-w-sm shrink-0 shadow-2xl">
                    <Calender />
                </div>

            </div>
        </div>
    </div>
  )
}

export default Hero