const ScheduleTableHeader = ({details}) => {
  return (
        <tr>
            <th>{details.no}</th>
            <th>{details.staffName}</th>
            <th>{details.date}</th>
            <th>{details.time}</th>
            <th>{details.approvedBy}</th>
        </tr>
    )
}

export default ScheduleTableHeader