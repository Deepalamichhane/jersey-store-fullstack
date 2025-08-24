import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/public/logo.png';
import nflag from '../assets/public/n.png';

function Navbarb() {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container-fluid">
        {/* Navbar Brand (Logo) as a direct child */}
        <Link className="navbar-brand" to="/">
          <img src={logo} alt="Logo" width="30" height="24" />
        </Link>
        
        {/* Toggler button for mobile */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNavDropdown"
          aria-controls="navbarNavDropdown"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        
        {/* Navbar links and dropdowns */}
        <div className="collapse navbar-collapse" id="navbarNavDropdown">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item dropdown">
              <a
                className="nav-link dropdown-toggle"
                href="#"
                id="navbarDropdownMenuLink"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <img src={nflag}  alt="Nepal Flag" width="30" height="24" className="d-inline-block me-2" />
                Nepal
              </a>
              <ul className="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
                <li><Link className="dropdown-item" to="#">Action</Link></li>
                <li><Link className="dropdown-item" to="#">Another action</Link></li>
                <li><Link className="dropdown-item" to="#">Something else here</Link></li>
              </ul>
            </li>

            <li className="nav-item dropdown">
              <a
                className="nav-link dropdown-toggle"
                href="#"
                id="navbarDropdownMenuLink"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                English
              </a>
              <ul className="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
                <li><Link className="dropdown-item" to="#">Action</Link></li>
                <li><Link className="dropdown-item" to="#">Another action</Link></li>
                <li><Link className="dropdown-item" to="#">Something else here</Link></li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbarb;