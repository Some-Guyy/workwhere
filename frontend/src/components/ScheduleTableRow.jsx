const ScheduleTableRow = ({details, index}) => {

  return (
    <>
        <tr className="hover">
            <th>{index+1}</th>
            <td>{details.staff_ID}</td>
            {/* <td>{details.startDate}</td> */}
            <td>{details.time}</td>
            <td>{details.approvedBy}</td>
        </tr>
    </>
  )
}

export default ScheduleTableRow