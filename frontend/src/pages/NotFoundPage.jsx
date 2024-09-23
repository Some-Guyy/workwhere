import { Link } from 'react-router-dom';
import { FaExclamationTriangle } from 'react-icons/fa';

const NotFoundPage = () => {
  return (
    <section className="text-center flex flex-col justify-center items-center h-96 mt-5">
      <FaExclamationTriangle className='text-yellow-400 text-6xl mb-4 hover:animate-spin' />
      <h1 className="text-6xl font-bold mb-4">404 Not Found</h1>
      <p className="text-xl mb-5">This page does not exist</p>
      <Link
        to="/"
        className="text-white bg-slate-900 hover:bg-slate-400 rounded-md px-3 py-2 mt-8"
        >Go Back
      </Link>
    </section>
  )
}

export default NotFoundPage