import { MdMapsHomeWork } from "react-icons/md";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useState,useEffect, useRef } from "react";

const Navbar = () => {
  const [EmployeeRole,setEmployeeRole] = useState(null)
  const [EmployeePosition,setEmployeePosition] = useState(null)
  const [EmployeeName, setEmployeeName] = useState(null);
  const [EmployeeId, setEmployeeId] = useState(null)
  const [notificationData, setNotificationData] = useState(null)
  const navigate = useNavigate();
  const location = useLocation();
  const drawerCheckboxRef = useRef(null);
  let unseenNotifications = [];
  
  // extract users role to conditionally render links
  useEffect(()=>{
      // fetchNotificationData()
      const data = JSON.parse(localStorage.getItem('state'));
      // console.log(data)
      setEmployeeName(data.staffFirstName);
      setEmployeeRole(data.role)
      setEmployeePosition(data.Position)
      setEmployeeId(data.staffId)
  },[])

  useEffect(()=>{
    if(notificationData!= null){
      unseenNotifications = notificationData.filter(notifiction => notifiction.status == unseen)
    }
},[notificationData])



  const fetchNotificationData = async () =>{
    const apiUrl = ``;
    try{
      const res = await fetch(apiUrl);
      const data = await res.json();
      setNotificationData(data)
    }
    catch(error){
      console.log("Error fetching notification data")
    }

  }

  const updateNotifictionStatus = async (notificationId) => {
    unseenNotifications = unseenNotifications.filter(notifiction => notifiction.Id != notificationId)
    const apiUrl = ``
    try{
      const res = await fetch(apiUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body:"",
      });
    }
    catch(error){
      console.log("Error updating notification data")
    }



  }


  // Close the drawer when navigating to another page
  useEffect(() => {
    if (drawerCheckboxRef.current) {
      drawerCheckboxRef.current.checked = false; // uncheck the drawer checkbox
    }
  }, [location]);

  // logout logic which clears local storage when logged out
  const logout = () => {
    localStorage.clear();
    navigate("/");
  }

  return (
    <>
      <div className="drawer">
        <input id="my-drawer-3" type="checkbox" className="drawer-toggle" ref={drawerCheckboxRef}/>
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
            <div className="flex lg:block">
              <ul className="menu menu-horizontal">
                {/* Navbar menu content here */}
                <li>
                <div className="dropdown dropdown-bottom dropdown-end mr-4">
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
                      <span className="badge badge-xs badge-error indicator-item"></span>
                    </div>
                  </button>
                  <ul className="dropdown-content menu p-2 text-sm shadow bg-gray-600 rounded-box w-80 z-10 max-h-60 overflow-y-auto flex flex-col flex-nowrap">
                    {notificationData != null ? 
                      notificationData.map((l,k)=>{
                        return <li key={l.Id}className="relative p-4 whitespace-normal hover:bg-gray-500" onMouseLeave={updateNotifictionStatus}>
                          {l in unseenNotifications ? <span className="absolute right-0 badge badge-xs badge-error indicator-item mt-2 mr-2"></span>:null}
                        </li>
                      })
                    
                  :<li className="relative p-4 whitespace-normal">no notification</li>}
                    <li className="relative p-4 whitespace-normal hover:bg-gray-500" onMouseLeave={updateNotifictionStatus}>
                    <span className="absolute right-0 badge badge-xs badge-error indicator-item mt-2 mr-2"></span>
                    your WFH arrangement on 24/10/2001 has been rejected reason:no
                    </li>
                    <div className="divider mt-0 mb-0"></div>
                    <li className=" p-4 whitespace-normal">
                      your WFH arrangement on 24/10/2001 has been rejected reason:no
                    </li>
                    <div className="divider mt-0 mb-0"></div>
                    <li className=" p-4 whitespace-normal">
                      your WFH arrangement on 24/10/2001 has been rejected reason:no
                    </li>
                    <div className="divider mt-0 mb-0"></div>
                    <li className=" p-2 whitespace-normal">
                      your WFH arrangement on 24/10/2001 has been rejected reason:no
                    </li>
                    <div className="divider mt-0 mb-0"></div>
                    <li className=" p-2 whitespace-normal">
                      your WFH arrangement on 24/10/2001 has been rejected reason:no
                    </li>
                    <div className="divider mt-0 mb-0"></div>
                    <li className=" p-2 whitespace-normal">
                      your WFH arrangement on 24/10/2001 has been rejected reason:no
                    </li>
                    <div className="divider mt-0 mb-0"></div>
                    <li className=" p-2 whitespace-normal">
                      your WFH arrangement on 24/10/2001 has been rejected reason:no
                    </li>
                    <div className="divider mt-0 mb-0"></div>
                    <li className=" p-2 whitespace-normal">
                      your WFH arrangement on 24/10/2001 has been rejected reason:no
                    </li>
                    <div className="divider mt-0 mb-0"></div>
                    <li className=" p-2 whitespace-normal">
                      your WFH arrangement on 24/10/2001 has been rejected reason:no
                    </li>
                    <div className="divider mt-0 mb-0"></div>
                    <li className=" p-2 whitespace-normal">
                      your WFH arrangement on 24/10/2001 has been rejected reason:no
                    </li>
                    <div className="divider mt-0 mb-0"></div>


                  </ul>
                </div>
                </li>
              </ul>
            </div>
          </div>
          {/* Page content here */}
          
        </div>
        <div className="drawer-side z-10">
          <label htmlFor="my-drawer-3" aria-label="close sidebar" className="drawer-overlay"></label>
          <div className="flex flex-col min-h-full w-80 bg-base-200 p-4">
            <ul className="menu flex-grow">
              {/* Sidebar content here */}
              
              <li>
                <strong className="text-3xl mb-5 ">
                Hi {EmployeeName}!
                </strong>
              </li>

              <li>
                <NavLink
                  to="/home"
                  className={({ isActive }) =>
                    isActive ? "active text-primary" : ""
                  }
                >
                  View Schedule
                </NavLink>
              </li>

              <li>
                <NavLink
                  to="/my"
                  className={({ isActive }) =>
                    isActive ? "active text-primary" : ""
                  }
                >
                  Manage My Applications
                </NavLink>
              </li>
              
              <li>
              {EmployeeRole == 2 || EmployeePosition == "HR Team"? null:
                <NavLink
                    to="/other"
                    className={({ isActive }) =>
                      isActive ? "active text-primary" : ""
                    }
                  >
                    Manage Other's Applications
                  </NavLink>              
              }
              </li>

            </ul>

            <button className="btn btn-primary" onClick={logout}>Logout</button>
          </div>
        </div>
      </div>
    
    </>
  )
}

export default Navbar