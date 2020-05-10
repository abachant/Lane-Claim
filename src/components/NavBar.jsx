import React from 'react';
import About from './About'

function NavBar() {
  return (
    <nav className="navbar navbar-dark bg-dark">
        <div className="navbar-brand">Lane Claim</div>
        <div>
            <About />
            <button className="btn btn-success" type="button">Submit New Claim</button>
        </div>
    </nav>
  );
}

export default NavBar;
