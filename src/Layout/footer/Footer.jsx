import React from 'react';
import './Footer.css';
import { FaFacebook, FaInstagram, FaOptinMonster, FaTiktok, FaTwitter, FaYoutube } from 'react-icons/fa';

const Footer = () => {
  return (
    <div>
      <div className="footer-container">
        <footer className='container'>
          <div className="footer-content">
            <div className="footer-left">
              <div className="available-platforms">
                <h3 className="platforms-title glow-text-green">Available Platforms (comming soon)</h3>
              </div>
              <div className="platform-icons">
                <ul>
                  <li>Roku</li>
                  <li>androidtv</li>
                  <li>iOS</li>
                  <li>VIZIO</li>
                  <li>android</li>
                  <li>tvOS</li>
                  <li>Google</li>
                  <li>firetv</li>
                  <li>SAMSUNG</li>
                </ul>
              </div>
              <div className="platform-links">
                <ul>
                  <li>Corp Home</li>
                  <li>About Us</li>
                  <li>Support & FAQ</li>
                  <li>Terms of Use</li>
                  <li>Privacy Policy</li>
                  <li>Press</li>
                  <li>Investors</li>
                  <li>Careers</li>
                  <li>Management</li>
                  <li>Cookie Policy</li>
                </ul>
              </div>
            </div>
            <div className="footer-right">
              <div className="footer-logo">
                <h2 className="cineverse-text">CineVerse</h2>
                <span className="cineverse-tagline">It's on.</span>
              </div>
              <div className="footer-social-icons">
                <ul>
                  <li><FaInstagram size={22}/></li>
                  <li><FaFacebook size={22}/></li>
                  <li><FaTwitter size={22}/></li>
                  <li><FaYoutube size={22}/></li>
                  <li><FaTiktok size={22}/></li>
                </ul>
              </div>
              <div className="footer-copyright">
                <p>&copy; 2025 <span>Cineverse</span>. All Rights Reserved</p>
              </div>
              <div className="footer-powered-by">
                <p>Powered by matchpoint</p>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}

export default Footer


// const Footerr = () => {
  //   return (
    //     <div>
    //       <footer className="site-footer">
    //         <div className="footer-content-wrapper">
    //           <div className="available-platforms">
    //             <h3 className="platforms-title">Available Platforms</h3>
    //             <div className="platform-icons">
    //               <a href="#" className="platform-link">Roku</a>
    //               <a href="#" className="platform-link">android</a>
    //               <a href="#" className="platform-link">iOS</a>
    //               <a href="#" className="platform-link">VIZIO</a>
    //               <a href="#" className="platform-link">androidtv</a>
    //               <a href="#" className="platform-link">tvOS</a>
    //               <a href="#" className="platform-link">Google TV</a>
    //               <a href="#" className="platform-link">firetv</a>
    //               <a href="#" className="platform-link">SAMSUNG</a>
    //             </div>
    //           </div>
    
    //           <div className="cineverse-info">
    //             {/* START: Changes here for CineVerse header */}
    //             <div className="cineverse-header">
    //                 <h2 className="cineverse-text">CineVerse</h2>
    //                 <span className="cineverse-tagline">It's on.</span>
    //             </div>
    //             {/* END: Changes here */}
    //             <div className="social-icons">
    //               <a href="#" className="social-link">Fb</a>
    //               <a href="#" className="social-link">Ig</a>
    //               <a href="#" className="social-link">X</a>
    //               <a href="#" className="social-link">Yt</a>
    //               <a href="#" className="social-link">Tk</a>
    //             </div>
    //             <p className="copyright">&copy; 2025 Cineverse. All Rights Reserved</p>
    //             <p className="powered-by">Powered by <span className="matchpoint-logo"></span>matchpoint</p>
    //           </div>
    //         </div>
    
    //         <div className="footer-links">
    //           <a href="#" className="footer-nav-link"> Home</a>
    //           <a href="#" className="footer-nav-link"> Us</a>
    //           <a href="#" className="footer-nav-link"> & FAQ</a>
    //           <a href="#" className="footer-nav-link"> of Use</a>
    //           <a href="#" className="footer-nav-link"> Policy</a>
    //           <a href="#" className="footer-nav-link"></a>
    //           <a href="#" className="footer-nav-link"></a>
    //           <a href="#" className="footer-nav-link"></a>
    //           <a href="#" className="footer-nav-link"></a>
    //           <a href="#" className="footer-nav-link"> Policy</a>
    //         </div>
    //       </footer>
    //     </div>
    //   );
    // };
    
    // export default Footerr;
    
    
    
    
    
    
     
    
    