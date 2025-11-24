import React from 'react'
import ProfileIcon from "@renderer/assets/images/profile-icon.svg";
import EmailIcon from "@renderer/assets/images/email-icon-2.svg";
import CallIcon from "@renderer/assets/images/call-icon.svg";
import { AuthState } from '@renderer/context/auth.context';
import { UserLogoutAction } from '@renderer/services/actions/auth.action';
import { useAppDispatch } from '@renderer/services/hook';

const ProfilePage: React.FunctionComponent = () => {

  const dispatch = useAppDispatch()
  const { userDetails } = AuthState()

  return (
    <div className='dashboard_main_body'>
      <div className="dashboard_container dashboard_main_body_container">
        <div className="account_main_sec">
          <div className="profile_main_box">
            <div className='head'>
              <h4>Update Profile</h4>
              <p>Please Your Personal Details</p>
            </div>
            <div className="profile_form">
              <form>
                <div className="form-group">
                  <label>Email</label>
                  <div className="field">
                    <div className="icon">
                      <img src={ProfileIcon} alt="" />
                    </div>
                    <input className="form-control" type="text" placeholder={userDetails?.email} />
                  </div>
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <div className="field">
                    <div className="icon">
                      <img src={EmailIcon} alt="" />
                    </div>
                    <input className="form-control" type="email" placeholder={userDetails?.email} />
                  </div>
                </div>
                <div className="form-group">
                  <label>Phone Number</label>
                  <div className="field">
                    <div className="icon">
                      <img src={CallIcon} alt="" />
                    </div>
                    <input className="form-control" type="tel" placeholder={userDetails?.username} />
                  </div>
                </div>
                <div className="form-group text-center">
                  <button type="button" className="login" onClick={() => UserLogoutAction(dispatch)}>
                    Logout
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
