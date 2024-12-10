import React from "react";
import "./footer.scss";
import logo from "../../assets/logonew.png";

function Footer() {
  return (
    <>
      <footer>
        <div className="container">
          <img className="footer-logo" src={logo} alt="company-logo"></img>
          <div className="company-description">
            <div>
              We are a non-profit working to accessibly<br></br>
              provide young vulnerable women and youth with<br></br>a robust
              innovation skillset and essential<br></br>
              resources to create susutainable social ventures<br></br>
              and social impact on Uganda
            </div>
            <div>
              Imagine Her is a registerd 501 {"("}c{")"}3 in the United<br></br>
              States {"("}#86-3998209{")"}. Imagine Her is a<br></br>
              registered non-profit in Uganda
            </div>
            <div className="icons"></div>
          </div>
          <div className="pages">
            <ul>
              <li>
                <a href="https://imagineher.org/about" target="_blank">About Us</a>
              </li>

              <li>
                <a href="https://imagineher.org/our-work" target="_blank">Our Work</a>
              </li>

              <li>
                <a href="https://imagineher.org/news" target="_blank">News</a>
              </li>

              <li>
                <a href="https://imagineher.org/contact-us" target="_blank">Contact</a>
              </li>

              <li>
                <a href="https://imagineher.org/careers" target="_blank">Careers</a>
              </li>
            </ul>
          </div>
          <div className="contacts">
            <p className="contact">Contact Us</p>
            <p className="info">
              <a href="mailto:info@i-her.org">info@i-her.org</a><br></br>
              Uganda<br></br>
              Block 266,Plot 800 Kingsway<br></br>
              Seguku Katale-Wakiso<br></br>
              P.O. Box 28648 Kampala<br></br>
              Office Line: +256 200903228
            </p>
            <p className="address">
              US Mailing Address: California 16830 Venture Blvd,<br></br>
              Suite 360 | Encino, CA 91436
            </p>
            <a href="https://imagineher.us7.list-manage.com/subscribe?u=f9bf0210faea3cdcbe5b1e495&id=8337b275e9" target='_blank'>
              <div className="btn-primary">Sign-Up for our Newsletter</div>
            </a>
          </div>
        </div>
      </footer>
      <div className="copyright">
        &copy; Copyright 2023 Imagine her is a nonprofit organization. All rights
        reserved.
      </div>
    </>
  );
}

export default Footer;
