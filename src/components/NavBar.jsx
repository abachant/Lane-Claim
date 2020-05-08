import React from 'react';

function NavBar() {
  return (
    <nav class="navbar navbar-dark bg-dark">
        <div class="navbar-brand">Lane Claim</div>
        <div>
            <a href="#" id="aboutButton">about</a>
            <button class="btn btn-success" type="button">Submit New Claim</button>
        </div>
    </nav>
  );
}

export default NavBar;
