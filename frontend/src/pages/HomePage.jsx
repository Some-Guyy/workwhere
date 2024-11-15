import { useState, useEffect} from "react";
import ViewScheduleSection from "../components/ViewScheduleSection";
import Hero from "../components/Hero";
import { useLocation } from 'react-router-dom';
import { IoMdClose } from "react-icons/io";
import { GrStatusGood } from "react-icons/gr";
// Note that everytime we change the filter for date or department, we refetch from backend
// the caches are for between the filter buttons

const HomePage = ({}) => {

    const [loading, setLoading] = useState(true); // used to show loading sign

    const[showedData, setShowedData] = useState(null); // data to be passed to the yourScheduleComponent
    const[personalData, setPersonalData] = useState(null); // cache between button filters for personal schedule
    const[teamData, setTeamData] = useState(null); // cache between button filters for team schedule
    const[overallData, setOverallData] = useState(null); // cache between button filters for overall schedule

    // const today = new Date().toLocaleDateString().split("/"); // todays date
    const date = new Date();
    const today = [(date.getMonth()+1).toString(), date.getDate().toString(), date.getFullYear().toString()];
    const [selectedDate, setSelectedDate] = useState(`${today[1]}/${today[0]}/${today[2]}`);

    const [loginEmployeeId, setLoginEmployeeId] = useState(null); // to be changed based on logins initial fetch for users employee id
    const [teamOrOverall, setTeamOrOverall] = useState(null);
    const [selectedDepartment, setSelectedDepartment] = useState("Sales"); // to be changed based on logins initial fetch for users department
    const [dateTriggered, setDateTriggered] = useState(false); // Separate state to track when date is being fetched
    const [departmentTriggered, setDepartmentTriggered] = useState(false); // Separate state to track when department is being fetched
    const [userRole, setUserRole] = useState(null); // used to hold employee's role

    const location = useLocation();
    const [successfulApplication, setSuccessfulApplication]  = useState(location.state?.successfulApplication || {});
    const [successfulCancellation, setSuccessfulCancellation]  = useState(location.state?.successfulCancellation || {});
    const [successfulWithdrawal, setSuccessfulWithdrawal] = useState(location.state?.successfulWithdrawal || {});
    const [successfulWithdrawalSubordinate, setSuccessfulWithdrawalSubordinate] = useState(location.state?.successfulWithdrawalSubordinate || {});
    const [successfulApprovalRejection, setSuccessfulApprovalRejection] = useState(location.state?.successfulApprovalRejection || {});
    const [successfulApprovalRejectionWithdrawal, setSuccessfulApprovalRejectionWithdrawal] = useState(location.state?.successfulApprovalRejectionWithdrawal || {}); // this is to show whether approval/rejection successful or not for withdrawal



    // Fetch the role from localStorage when the component mounts
    useEffect(() => {
      const localStoreaged = localStorage.getItem('state');
      const storedRole = JSON.parse(localStoreaged).role;
      if (storedRole) {
        setTeamOrOverall(storedRole);
        setUserRole(storedRole);
        setLoginEmployeeId(JSON.parse(localStoreaged).staffId);
        // console.log(localStoreaged);
      }
      else{
        // navigate("/");
      }
    }, []);
    
    // initial loading will fetch personal schedule
    useEffect(() => {
      if(!showedData && userRole) {
        fetchPersonalData();
      }
    }, [userRole]);
    
    // changes in date sets team cache to null
    useEffect(() => {
      if(userRole ==2 || userRole ==3){
        setTeamData(null);
        setDateTriggered(true);
      }else if(userRole==1){
        setOverallData(null);
        setDateTriggered(true);
      }
    }, [selectedDate]);

    // changes in department sets department cache to null
    useEffect(() => {
      if(userRole==1){
        setOverallData(null);
        setDepartmentTriggered(true);
      }
    }, [selectedDepartment]);

    // run when changes in dept
    useEffect(() => {
      if (departmentTriggered && userRole == 1) {
        const selectedDay = selectedDate.split("/");
        const selectedDateFetchTeamData = selectedDay[1];
        const selectedMonthFetchTeamData = selectedDay[0];
        const selectedYearFetchTeamData = selectedDay[2];
  
        const formattedDate = `${selectedYearFetchTeamData}-${selectedDateFetchTeamData}-${selectedMonthFetchTeamData}`;
  
        fetchOverallData(selectedDepartment, formattedDate); // Fetch team data only after the cache is reset
        setDepartmentTriggered(false); // Reset trigger
      }
    }, [departmentTriggered]);

    // run when changes in date
    useEffect(() => {
      if (dateTriggered && (userRole == 2 || userRole == 3)) {
        const selectedDay = selectedDate.split("/");
        const selectedDateFetchTeamData = selectedDay[1];
        const selectedMonthFetchTeamData = selectedDay[0];
        const selectedYearFetchTeamData = selectedDay[2];

        const formattedDate = `${selectedYearFetchTeamData}-${selectedDateFetchTeamData}-${selectedMonthFetchTeamData}`;
        fetchTeamData(loginEmployeeId, formattedDate);
        setDateTriggered(false); // Reset trigger
      }else if (dateTriggered && userRole == 1){
        const selectedDay = selectedDate.split("/");
        const selectedDateFetchTeamData = selectedDay[1];
        const selectedMonthFetchTeamData = selectedDay[0];
        const selectedYearFetchTeamData = selectedDay[2];

        const formattedDate = `${selectedYearFetchTeamData}-${selectedDateFetchTeamData}-${selectedMonthFetchTeamData}`;
        fetchOverallData(selectedDepartment, formattedDate);
        setDateTriggered(false); // Reset trigger
      }
    }, [dateTriggered]);

    // local storage for persons personal schedule
    useEffect(()=>{
      localStorage.setItem('personalSchedule', JSON.stringify(personalData));
    },[personalData])


    // function to fetch personal schedule
    const fetchPersonalData = async (employeeId=loginEmployeeId) => {
      
      const apiUrl = `${import.meta.env.VITE_BACKEND_HOST}:${import.meta.env.VITE_BACKEND_PORT}/working-arrangements/${employeeId}`;      

      if(!personalData) {

        setLoading(true);

        try{
          const res = await fetch(apiUrl);
          const data = await res.json();
          // const data = deta
          setPersonalData(data);
          setLoading(false);
          setShowedData(data);
          console.log(data)

        } catch(error) {
            console.log("Error fetching personal data", error);

        } finally {
            console.log("We fetched the personal data");
        }
      } else{
        setShowedData(personalData);
      }

      
    };
    
    // function to fetch team schedule based on a date
    const fetchTeamData = async (employeeId=loginEmployeeId, chosenDate=null) => {

      if (chosenDate==null){
        const selectedDt = today[1];
        const selectedMonth = today[0];
        const selectedYear = today[2];

        chosenDate = `${selectedYear}-${selectedMonth}-${selectedDt}`;
        // console.log(chosenDate);
      }

      const apiUrl = `${import.meta.env.VITE_BACKEND_HOST}:${import.meta.env.VITE_BACKEND_PORT}/working-arrangements/team/${employeeId}/${chosenDate}`;

      console.log(`Fetching for ${employeeId} ${chosenDate}`);
      // console.log(teamData);

          if(!teamData) {
            // console.log("no team data")
            setLoading(true);

            try{
              const res = await fetch(apiUrl);
              const data = await res.json();
              // const data = deta
              setTeamData(data);
              setLoading(false);
              setShowedData(data);
              console.log(data)
    
            } catch(error) {
                console.log("Error fetching team data", error);
      
            } finally {
                console.log("We fetched the team data");
            }

          }else{
            // console.log("Using cached team data")
            setShowedData(teamData);
          }
    };

    // function to fetch overall schedule based on a date and department
    const fetchOverallData = async (department=selectedDepartment, chosenDate=null) => {
     
      if (chosenDate==null){
        const selectedDt = today[1];
        const selectedMonth = today[0];
        const selectedYear = today[2];

        chosenDate = `${selectedYear}-${selectedMonth}-${selectedDt}`;
      }

      const apiUrl =  `${import.meta.env.VITE_BACKEND_HOST}:${import.meta.env.VITE_BACKEND_PORT}/working-arrangements/department/${department}/${chosenDate}`;

      console.log(`Fetching for ${department} ${chosenDate}`);
      
      if(!overallData) {

        setLoading(true);

        try{
          const res = await fetch(apiUrl);
          const data = await res.json();
          // const data = deta;
          console.log(data)
        
          setOverallData(data);
          setLoading(false);
          setShowedData(data);


        } catch(error) {
            console.log("Error fetching overall data", error);
  
        } finally {
            console.log("We fetched the overall data");
        }

      }else{
        // console.log("We used cached overall data");
        setShowedData(overallData);
      }
    };

  

  return (
    <div className="w-full">
        <Hero loading={loading} data={personalData}/>
        {/* <Hero loading={loading} data={overallData}/> */}
        <ViewScheduleSection 
        loading={loading} 
        data={showedData} 
        fetchPersonal={fetchPersonalData} 
        fetchTeam={fetchTeamData} 
        fetchOverall={fetchOverallData}
        selectedDate={selectedDate} 
        setSelectedDate={setSelectedDate} 
        selectedDepartment={selectedDepartment} 
        setSelectedDepartment={setSelectedDepartment}
        setTeamOrOverall={setTeamOrOverall}
        />

        {/* alert for successful wfh */}
        {successfulApplication == true && (
            <div role="alert" className="alert alert-success fixed top-0 left-0 w-full z-50">
                <div className="flex items-center">
                    <div className="flex items-center">
                        <GrStatusGood size={25}/>
                        <span className="mx-2">Successfully created arrangement</span>
                    </div>
                    <div className="absolute top-4 right-7
                    ">
                        {/* Right side: Close icon */}
                        <IoMdClose size={30} onClick={() => setSuccessfulApplication(null)}/>
                    </div>
                </div>
            </div>
        )}

        {/* alert for successful withdrawl */}
        {successfulWithdrawal == true && (
            <div role="alert" className="alert alert-success fixed top-0 left-0 w-full z-50">
                <div className="flex items-center">
                    <div className="flex items-center">
                        <GrStatusGood size={25}/>
                        <span className="mx-2">Successfully withdraw arrangement</span>
                    </div>
                    <div className="absolute top-4 right-7
                    ">
                        {/* Right side: Close icon */}
                        <IoMdClose size={30} onClick={() => setSuccessfulWithdrawal(null)}/>
                    </div>
                </div>
            </div>
        )}

        {/* alert for successful wfh approval and rejection */}
        {successfulApprovalRejection == true && (
            <div role="alert" className="alert alert-success fixed top-0 left-0 w-full z-50">
                <div className="flex items-center">
                    <div className="flex items-center">
                        <GrStatusGood size={25}/>
                        <span className="mx-2">Successfully Approved/Reject arrangement</span>
                    </div>
                    <div className="absolute top-4 right-7
                    ">
                        {/* Right side: Close icon */}
                        <IoMdClose size={30} onClick={() => setSuccessfulApprovalRejection(null)}/>
                    </div>
                </div>
            </div>
        )}

        {/* alert for successful wfh WITHDRAWAL approval and rejection */}
        {successfulApprovalRejectionWithdrawal == true && (
            <div role="alert" className="alert alert-success fixed top-0 left-0 w-full z-50">
                <div className="flex items-center">
                    <div className="flex items-center">
                        <GrStatusGood size={25}/>
                        <span className="mx-2">Successfully Approved/Reject withdrawal request</span>
                    </div>
                    <div className="absolute top-4 right-7
                    ">
                        {/* Right side: Close icon */}
                        <IoMdClose size={30} onClick={() => setSuccessfulApprovalRejectionWithdrawal(null)}/>
                    </div>
                </div>
            </div>
        )}

        {/* alert for successful cancel */}
        {successfulCancellation == true && (
            <div role="alert" className="alert alert-success fixed top-0 left-0 w-full z-50">
                <div className="flex items-center">
                    <div className="flex items-center">
                        <GrStatusGood size={25}/>
                        <span className="mx-2">Successfully cancelled arrangement</span>
                    </div>
                    <div className="absolute top-4 right-7">
                        {/* Right side: Close icon */}
                        <IoMdClose size={30} onClick={() => setSuccessfulCancellation(null)}/>
                    </div>
                </div>
            </div>
        )}

        {/* alert for successful withdrawal */}
        {successfulWithdrawalSubordinate == true && (
            <div role="alert" className="alert alert-success fixed top-0 left-0 w-full z-50">
                <div className="flex items-center">
                    <div className="flex items-center">
                        <GrStatusGood size={25}/>
                        <span className="mx-2">Successfully Approved/Reject withdrawal request</span>
                    </div>
                    <div className="absolute top-4 right-7">
                        {/* Right side: Close icon */}
                        <IoMdClose size={30} onClick={() => setSuccessfulWithdrawalSubordinate(null)}/>
                    </div>
                </div>
            </div>
        )}
        
    </div>
  )
}

export default HomePage