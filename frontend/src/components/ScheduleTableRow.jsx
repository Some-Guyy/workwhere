const ScheduleTableRow = ({details, index}) => {

  return (
    <>
        <tr className="hover">
            <th>{index+1}</th>
            <td>{details.startDate}</td>
            <td>{details.startTime._seconds}</td>
            <td>{details.status}</td>
        </tr>
    </>
  )
}

export default ScheduleTableRow