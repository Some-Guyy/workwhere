import { useState, useEffect } from "react";
import ViewScheduleSection from "../components/ViewScheduleSection";
import Hero from "../components/Hero";



const HomePage = () => {
  const [loading, setLoading] = useState(true); 
  const[wfhData, setWfhData] = useState(null);

  function SimpleCacheComponent(){

    useEffect(() => {
      if(!wfhData) {
        fetchWFH();
      }
    }, [wfhData]);

    const fetchWFH = async () => {
      const apiUrl = "http://localhost:3000/working-arrangements/150233";
      try{
          // const res = await fetch(apiUrl);
          // const data = await res.json();
          const data = [
                {
                    "reason": "Take care of mom",
                    "requestCreated": {
                       "_seconds": 1727049600,
                       "_nanoseconds": 200000000
                    },
                    "employee_id": "150233",
                    "status": "approved",
                    "endDate": "28/09/2024",
                    "startDate": "27/09/2024",
                    "startTime": {
                      "_seconds": 1727312400,
                      "_nanoseconds": 112000000
                    },
                    "endTime": {
                      "_seconds": 1727427600,
                      "_nanoseconds": 940000000
                    }
                    
                },
                {
                  "reason": "no important meetings",
                  "requestCreated": {
                     "_seconds": 1727049600,
                     "_nanoseconds": 200000000
                  },
                  "employee_id": "150233",
                  "status": "pending",
                  "endDate": "27/09/2024",
                  "startDate": "26/09/2024",
                  "startTime": {
                    "_seconds": 1727312400,
                    "_nanoseconds": 112000000
                  },
                  "endTime": {
                    "_seconds": 1727427600,
                    "_nanoseconds": 940000000
                  }
                  
              }
            ]
          setWfhData(data);
          setLoading(false);


      } catch(error) {
          console.log("Error fetching data", error);

      } finally {
          console.log("We fetched the data");
      }
    };

  }

  SimpleCacheComponent();
  // console.log(wfhData);
    

  return (
    <div className="w-full">
        <Hero loading={loading} data={wfhData}/>
        <ViewScheduleSection loading={loading} data={wfhData}/>
        
    </div>
  )
}

export default HomePage