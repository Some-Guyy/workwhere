
const ScheduleTableRow = ({details}) => {
  return (
    <>
        <tr className="hover">
            <th>{details.no}</th>
            <td>{details.date}</td>
            <td>{details.time}</td>
            <td>{details.approvedBy}</td>
        </tr>
    </>
  )
}

export default ScheduleTableRow