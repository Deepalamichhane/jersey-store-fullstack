import React from 'react';
import { BsSearch } from 'react-icons/bs';
import { BiCart } from 'react-icons/bi';
import logo from '../assets/public/logo.png';
import { Link } from 'react-router-dom';

function Navbar() {
  return (

    <>
    <div className="d-none d-lg-flex ms-auto align-items-center text-white " style={{ backgroundColor: '#ff8200', padding: '10px 20px' }}>
          <ul className="list-unstyled d-flex gap-4 m-0 justify-content-end"> 
            <li><Link to="#" className="text-decoration-none text-white">SAVE MORE ON APP</Link></li>
            <li><Link to="/Becomeseller" className="text-decoration-none text-white">BECOME A SELLER</Link></li>
            <li><Link to="#" className="text-decoration-none text-white">HELP & SUPPORT</Link></li>
            <li><Link to="#" className="text-decoration-none text-white">LOGIN</Link></li>
            <li><Link to="#" className="text-decoration-none text-white">SIGN UP</Link></li>
            <li><Link to="#" className="text-decoration-none text-white">भाषा अनुवाद</Link></li>
          </ul>
      </div>


    <nav className="navbar" style={{ backgroundColor: '#ff8200' }}>
      <div className="container-fluid d-flex align-items-center py-2">
        {/* Logo */}
        <Link className="navbar-brand me-4" to="/home">
          <img src={logo} alt="Daraz Logo" style={{ width: '100px', height: 'auto' }} />
        </Link>
        
        {/* Search Bar */}
        <form className="d-flex flex-grow-1 mx-4">
          <div className="input-group">
            <input
              className="form-control rounded-start"
              type="search"
              placeholder="Search in Daraz"
              aria-label="Search"
              style={{ border: 'none' }}
            />
            <button className="btn btn-light rounded-end" type="submit" style={{ backgroundColor: '#ff8200', border: '1px solid #fff' }}>
              <BsSearch size={20} color="#fff" />
            </button>
          </div>
        </form>

        
        
        {/* Cart Icon */}
        <Link className="text-white ms-4" to="#">
          <BiCart size={30} />
        </Link>
      </div>
    </nav>
    </>
  );
}

export default Navbar;




