const override = {
    display: 'flex',
    margin: '100px auto'
}

const Spinner = ({ loading }) => {
  return (
    <div className="flex">
        <span className="loading loading-spinner loading-lg mx-auto" loading={loading}></span>
    </div>
  )
}

export default Spinner