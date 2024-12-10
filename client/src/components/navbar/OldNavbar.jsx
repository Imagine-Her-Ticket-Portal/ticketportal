<div className="Navbar">
        <div className="navigation web">
          <div>
            <div className="links web" onClick={handleClickHome}>
              Home
            </div>
            <div className="bar web"></div>
          </div>
          <div className="links web" onClick={handleClickServices}>
            Services
          </div>
          {isAuthenticated ? (
            <div className="links web" onClick={handleClickTicketHistory}>
              Ticket History
            </div>
          ) : (
            <div className="links web" onClick={handleClickStories}>
              Impact
            </div>
          )}
        </div>
        <img className="company-logo" src={logo} alt="company-logo" onClick={handleLogo}/>
        {isAuthenticated ? (
          <>
            <div className="navigation profile-design" onClick={handleProfile}>
              <div className="email">{user.name}</div>
              <img src={profile} alt="profile-pic" className="profile" />
            </div>
          </>
        ) : (
          <>
            <div className="navigation">
              <Login styleName="links" />
              <div className="button" onClick={openSignup}>
                SignUp
              </div>
            </div>
          </>
        )}
        <div
          className="mobile-menu-icon"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <FontAwesomeIcon icon={faBars} size="2x" />
        </div>
      </div>
      {mobileMenuOpen && (
        <div className="mobile-dropdown">
          <div className="links" onClick={handleClickHome}>
            Home
          </div>
          <div className="links" onClick={handleClickServices}>
            Services
          </div>
          {isAuthenticated ? (
            <div className="links" onClick={handleClickTicketHistory}>
              Ticket History
            </div>
          ) : (
            <div className="links" onClick={handleClickStories}>
              Impact
            </div>
          )}
          {isAuthenticated ? (
            <>
              <div className="links" onClick={handleProfile}>
                Profile
              </div>
              <Otp notsignin={true} />
              {user && !user.verified && (
                <div className="links" onClick={openOtp}>
                  Verify Email
                </div>
              )}
            </>
          ) : (
            <>
              <div className="links" onClick={openLoginModal}>
                Login
              </div>
              <div className="links" onClick={openSignup}>
                SignUp
              </div>
            </>
          )}
        </div>
      )}