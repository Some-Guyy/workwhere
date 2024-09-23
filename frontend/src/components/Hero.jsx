import Calender from "./Calender";
import Stats from "./Stats";

const Hero = () => {
  return (
    <div className="mt-20">
        <div className="bg-primary min-h-screen glass w-full min-w-[450px]">
            <div className="flex flex-col lg:flex-row-reverse items-center w-full">
                <div className="text-center lg:text-left lg:ml-5 text-base-100 w-full p-4">
                    <div className="glass p-4 w-full">
                        <h1 className="text-5xl font-bold">Hi Ryan!</h1>
                        <p className="py-6">
                            You have 2 more days of WFH this month, your next WFH is on 2nd October 2024. You  have 10 requests not approved yet.
                        </p>
                        <p>
                            Click here to jump straight to your schedule.
                        </p>
                    </div>
                    <div className="glass my-4 p-4">
                        <Stats />
                    </div>
                </div>

                <div className="card bg-base-300 w-full max-w-sm shrink-0 shadow-2xl m-5">
                    <Calender />
                </div>

            </div>
        </div>
    </div>
  )
}

export default Hero