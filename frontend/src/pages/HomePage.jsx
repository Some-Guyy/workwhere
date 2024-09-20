import Accordion from "../components/Accordion"
import Calender from "../components/Calender"

const HomePage = () => {
  return (
    <>
        <Calender />
        <div className="">
          <div className="font-bold text-4xl mt-10 ml-5 text-center">
            Work From Home
          </div>
          <Accordion />
        </div>
        <hr className="my-10 w-9/12 m-auto" />
    </>
  )
}

export default HomePage