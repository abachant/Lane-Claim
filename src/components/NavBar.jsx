import React, {useState} from 'react';
import About from './About';
import NewClaim from './NewClaim';

function NavBar() {
  const [showAboutModal, setAboutModal] = useState(false);
  const [showUploadModal, setUploadModal] = useState(false);
  const [showConfirmationModal, setConfirmationModal] = useState(false);
  const [showSuccessModal, setSuccessModal] = useState(false);

  const toggleAboutModal = (value) => setAboutModal(value);
  const toggleUploadModal = (value) => setUploadModal(value);
  const toggleConfirmationModal = (value) => setConfirmationModal(value);
  const toggleSuccessModal = (value) => setSuccessModal(value);

  // const [activeModals, setActiveModals] = useState({"upload-modal": false, "confirmation-modal": false, "success-modal": false})

  // const toggleModal = (x) => {setUploadModal(x)};
  // const foo = (modal, value) => {
  //     const s = {...activeModals};
  //     s[modal] = value;
  //     setActiveModals(s);
  // }

  return (
    <nav className="navbar navbar-dark bg-dark">
        <div className="navbar-brand">Lane Claim</div>
        <div>
            <About
              showAboutModal={showAboutModal}
              toggleAboutModal={toggleAboutModal}
              toggleUploadModal={toggleUploadModal}
            />
            <NewClaim 
              showUploadModal={showUploadModal}
              showConfirmationModal={showConfirmationModal}
              showSuccessModal={showSuccessModal}
              toggleUploadModal={toggleUploadModal}
              toggleConfirmationModal={toggleConfirmationModal}
              toggleSuccessModal={toggleSuccessModal}
            />
        </div>
    </nav>
  );
}

export default NavBar;
