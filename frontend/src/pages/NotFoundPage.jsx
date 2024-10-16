import { Link } from 'react-router-dom';
import NotFoundAnimation from "../assets/images/NotFound.mp4"

const NotFoundPage = () => {
  return (
    <section className="text-center flex flex-col justify-center items-center ">
      {/* <FaExclamationTriangle className='text-yellow-400 text-6xl mb-4 hover:animate-spin' /> */}

      <video
        className="object-cover max-w-96"
        src={NotFoundAnimation} // Replace this with the path to your video file
        autoPlay
        loop
        muted
        playsInline
      />

      <h1 className="text-6xl font-bold mb-4">404 Not Found</h1>
      <p className="text-xl mb-5">This page does not exist</p>
      
      <Link
        to="/home"
        className="text-white bg-slate-900 hover:bg-slate-400 rounded-md px-3 py-2 mt-8"
        >Go Back to Home Page
      </Link>
    </section>
  )
}

export default NotFoundPage