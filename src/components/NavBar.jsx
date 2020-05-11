import React from 'react';
import About from './About';
import NewClaim from './NewClaim';

function NavBar() {
  return (
    <nav className="navbar navbar-dark bg-dark">
        <div className="navbar-brand">Lane Claim</div>
        <div>
            <About />
            <NewClaim />
        </div>
    </nav>
  );
}

export default NavBar;
