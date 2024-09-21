const Stats = () => {
  return (
    <div className='flex justify-center'>
        <div className="stats shadow">
            <div className="stat">
                <div className="stat-title">Total WFH days taken</div>
                <div className="stat-value text-primary">1 Days</div>
                <div className="stat-desc">Next WFH day on 1 Jan 2024</div>
            </div>

            <div className="stat">
                <div className="stat-title">Total leaves taken</div>
                <div className="stat-value text-secondary">10 Days</div>
                <div className="stat-desc">Next leave on 2 Jan 2024</div>
            </div>

            <div className="stat">
                <div className="stat-title">Total pending requests</div>
                <div className="stat-value">4</div>
                <div className="stat-desc">Requests</div>
            </div>
        </div>
    
    </div>
  )
}

export default Stats