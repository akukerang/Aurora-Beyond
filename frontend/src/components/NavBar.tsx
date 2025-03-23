import { Link } from 'react-router-dom'

const Navbar = () => {
  return (
    <div className='flex justify-between bg-gray-800 px-16 py-4'>
      <Link to = "/">Actions</Link>
      <Link to = "/magic">Magic</Link>
      <Link to = "/equipment">Inventory</Link>
        <Link to = "/notes">Notes</Link>
    </div>
  )
}

export default Navbar