import React from 'react'
import Email from "@renderer/assets/images/email-white.svg";
import Call from "@renderer/assets/images/call-white.svg";
import { Link } from 'react-router-dom';

const ProfilePage: React.FunctionComponent = () => {
  return (
    <div className='dashboard_main_body'>
      <div className="dashboard_container dashboard_main_body_container">
        <div className="account_main_sec">
          <div className="profile_main_box help_main_box">
            <div className='head'>
              <h4>Help & Support</h4>
              <p>If you have any question feel free to contact us</p>
            </div>
            <div className="help_box">
              <ul>
                <li>
                  <Link to="mailto:debra.holt@example.com">
                    <div className="icon">
                      <img src={Email} alt='' />
                    </div>
                    <span>debra.holt@example.com</span>
                  </Link>
                </li>
                <li>
                  <Link to="tel:(702) 555-0122">
                    <div className="icon">
                      <img src={Call} alt='' />
                    </div>
                    <span>(702) 555-0122</span>
                  </Link>
                </li>
              </ul>
            </div>
            <div className="profile_form">
              <form>
                <div className="form-group">
                  <label>Full Name</label>
                  <div className="field">
                    <input className="form-control" type="text" />
                  </div>
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <div className="field">
                    <input className="form-control" type="email" />
                  </div>
                </div>
                <div className="form-group">
                  <label>Title</label>
                  <div className="field">
                    <input className="form-control" type="text" />
                  </div>
                </div>
                <div className="form-group">
                  <label>Description</label>
                  <div className="field">
                    <textarea className="form-control"></textarea>
                  </div>
                </div>
                <div className="form-group text-center">
                  <button type="button" className="login">
                    Submit Details
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfilePage
