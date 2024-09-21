import Spinner from "../components/Spinner";
import { useState, useEffect } from 'react';

const Stats = () => {

    const [loading, setLoading] = useState(false); 
    
    return (
        <div className='flex justify-center'>
            <div className="stats shadow">
                <div className="stat">
                    <div className="stat-title">Total WFH days taken</div>
                    <div className="stat-value text-primary">{loading ? <Spinner loading={loading} /> : (
                        <>
                            1 days
                        </>
                    )} 
                    </div>
                    <div className="stat-desc">Next WFH day on 1 Jan 2024</div>
                </div>

                <div className="stat">
                    <div className="stat-title">Total leaves taken</div>
                    <div className="stat-value text-secondary">{loading ? <Spinner loading={loading} /> : (
                        <>
                            10 days
                        </>
                    )} 
                    </div>
                    <div className="stat-desc">Next leave on 2 Jan 2024</div>
                </div>

                <div className="stat">
                    <div className="stat-title">Total pending requests</div>
                    <div className="stat-value">{loading ? <Spinner loading={loading} /> : (
                        "4"
                    )} 
                    </div>
                    <div className="stat-desc">Requests</div>
                </div>
            </div>
        
        </div>
  )
}

export default Stats