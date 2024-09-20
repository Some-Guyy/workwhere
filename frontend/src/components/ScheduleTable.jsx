const ScheduleTable = () => {
  return (
    <div className="flex justify-center w-11/12">
        <div className=" m-4 overflow-x-auto">
            <table className="table table-pin-rows overflow-x-auto">
                <thead>
                    <tr>
                        <th>S/N</th>
                        <th>Date</th>
                        <th>Time</th>
                        <th>Approved By</th>
                    </tr>
                </thead>
                <tbody>
                <tr className="hover">
                    <th>1</th>
                    <td>Cy Ganderton</td>
                    <td>Quality Control Specialist</td>
                    <td>Littel, Schaden and Vandervort</td>
                </tr>
                </tbody>
            </table>
        </div>
    </div>
  )
}

export default ScheduleTable