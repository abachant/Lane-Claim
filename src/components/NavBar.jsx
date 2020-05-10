import React from 'react';

function NavBar() {
  return (
    <nav className="navbar navbar-dark bg-dark">
        <div className="navbar-brand">Lane Claim</div>
        <div>
            <button className="btn">about</button>
            <button className="btn btn-success" type="button">Submit New Claim</button>
        </div>
    </nav>
  );
}

export default NavBar;
