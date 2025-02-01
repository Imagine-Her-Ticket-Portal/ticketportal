import React from "react";
import "./footer.css";
import fb from "../../assets/fb.svg"
import instagram from "../../assets/insta.svg"
import linkedin from "../../assets/linkedin.svg"
import twitter from "../../assets/twitter.svg"
import youtube from "../../assets/youtube.svg"
import imagineher from "../../assets/Imagine-Her-Logo- White.svg"

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-brand">
        <img src={imagineher} alt="Imagine-her"/>
          <p>From last-mile to marketplace</p>
          <div className="footer-social">
            <p>Follow Us:</p>
            <div className="social-icons">
            <a href="#" target="_blank"><img src={instagram} alt="instagram"/></a>
                <a href="#" target="_blank"><img src={fb} alt="facebook"/></a>
                <a href="#" target="_blank"><img src={twitter} alt="twitter"/></a>
                <a href="#" target="_blank"><img src={linkedin} alt="linkedin"/></a>
                <a href="#" target="_blank"><img src={youtube} alt="youtube"/></a>
            </div>
          </div>
        </div>

        <div className="footer-links">
          <h3>Navigations</h3>
          <ul>
            <li>Reports & financial</li>
            <li>Work with us</li>
            <li>Donate</li>
            <li>Join Us</li>
            <li>Contact Us</li>
          </ul>
        </div>

        <div className="footer-contact">
          <h3>Contact Us</h3>
          <p>+256 200903228</p>
          <p>info@i-her.org</p>
          <p>Uganda Block 266, Plot 800</p>
          <p>Kingsway Seguku Katale-Wakiso P.O Box 28648 Kampala</p>
          <p>California (Mailing Address)</p>
          <p>16830 Ventura Blvd., Suite 360 Encino, CA 91436</p>
        </div>

        <div className="footer-newsletter">
          <h3>Join Our Newsletter</h3>
          <form>
            <input type="email" placeholder="Enter your email" />
            <button type="submit">Submit</button>
          </form>
        </div>
      </div>
      <div className="footer-bottom">
        <p>Copyright © 2024 Imagine Her. All rights reserved.</p>
        <div>
          <a href="#">Privacy Policy</a> | <a href="#">Terms & Conditions</a>
        </div>
      </div>
    </footer>

    

  );
};

export default Footer;
