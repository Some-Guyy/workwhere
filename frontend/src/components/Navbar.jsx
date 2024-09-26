import { MdMapsHomeWork } from "react-icons/md";
import { Link } from "react-router-dom";
import { useState } from "react";

const Navbar = () => {
  
  return (
    <>
      <div className="drawer">
        <input id="my-drawer-3" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content flex flex-col">
          {/* Navbar */}
          <div className="navbar bg-neutral w-full text-primary-content fixed z-10">
            <div className="flex-none">
              <label htmlFor="my-drawer-3" aria-label="open sidebar" className="btn btn-square btn-ghost">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  className="inline-block h-6 w-6 stroke-current">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"></path>
                </svg>
              </label>
            </div>
            <div className="mx-2 flex-1 px-2 text-4xl font-bold">
              <MdMapsHomeWork />
              <span className="m-auto sm:mx-1">
                Workwhere
              </span>
            </div>
            <div className="flex-none lg:block">
              <ul className="menu menu-horizontal">
                {/* Navbar menu content here */}
                <li>
                  <button className="btn btn-ghost btn-circle animate-pulse">
                    <div className="indicator">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                      </svg>
                      <span className="badge badge-xs badge-error indicator-item">1</span>
                    </div>
                  </button>
                </li>
              </ul>
            </div>
          </div>
          {/* Page content here */}
          
        </div>
        <div className="drawer-side z-10">
          <label htmlFor="my-drawer-3" aria-label="close sidebar" className="drawer-overlay"></label>
          <ul className="menu bg-base-200 min-h-full w-80 p-4">
            {/* Sidebar content here */}
            <li><strong className="text-3xl mb-5 ">Hi Ryan!</strong></li>
            <li><Link to="/" className="active">View Schedule</Link></li>
            <li><Link to="/my">Manage My Applications</Link></li>
            <li><Link to="/other">Manage Other's Applications</Link></li>
          </ul>
        </div>
      </div>
    
    </>
  )
}

export default Navbar