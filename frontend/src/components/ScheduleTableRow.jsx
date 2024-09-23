const ScheduleTableRow = ({details, index}) => {

  return (
    <>
        <tr className="hover">
            <th>{index+1}</th>
            <td>{details.startDate}</td>
            <td>{details.startTime}</td>
            <td>{details.approvedBy}</td>
        </tr>
    </>
  )
}

export default ScheduleTableRow