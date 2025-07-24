import React from 'react'
import { Link } from 'react-router-dom';
import { FaAngleRight } from "react-icons/fa6";
import Account from "@renderer/assets/images/john.png";
import CameraIcon from "@renderer/assets/images/camera-icon.svg";
import CallIcon from "@renderer/assets/images/call-icon.svg";
import EmailIcon from "@renderer/assets/images/email-icon-2.svg";
import ProfileIcon from "@renderer/assets/images/profile-icon.svg";
import PasswordIcon from "@renderer/assets/images/password-icon-2.svg";
import ChartIcon from "@renderer/assets/images/chart-icon.svg";
import TransactionIcon from "@renderer/assets/images/transaction-icon.svg";
import SettingsIcon from "@renderer/assets/images/settings-icon.svg";
import HelpIcon from "@renderer/assets/images/help-icon.svg";



const AccountPage: React.FunctionComponent = () => {
  return (
    <>
      <div className='dashboard_main_body'>
        <div className="dashboard_container dashboard_main_body_container">
          <div className="account_main_sec">
            <div className="account_main_box">
              <div className="account_top">
                <div className="account_image_wrap">
                  <div className="account_image">
                    <img src={Account} />
                  </div>
                  <div className='upload_image'>
                    <img src={CameraIcon} />
                  </div>
                </div>
                <div className="account_details">
                  <h3>John Simmons</h3>
                  <ul>
                    <li>
                      <img src={CallIcon} />
                      <span>(316) 555-0116</span>
                    </li>
                    <li>
                      <img src={EmailIcon} />
                      <span>jackson.graham@example.com</span>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="account_bottom">
                <div className="list_wrap">
                  <div className="list">
                    <Link to="/dashboard/account/profile">
                      <div className="left">
                        <div className="icon">
                          <img src={ProfileIcon} />
                        </div>
                        <span>My Profile</span>
                      </div>
                      <div className="right">
                        <div className="icon">
                          <FaAngleRight />
                        </div>
                      </div>
                    </Link>
                  </div>
                  <div className="list">
                    <Link to="/dashboard/account/change-password">
                      <div className="left">
                        <div className="icon">
                          <img src={PasswordIcon} />
                        </div>
                        <span>Change Password</span>
                      </div>
                      <div className="right">
                        <div className="icon">
                          <FaAngleRight />
                        </div>
                      </div>
                    </Link>
                  </div>
                  <div className="list">
                    <Link to="/">
                      <div className="left">
                        <div className="icon">
                          <img src={ChartIcon} />
                        </div>
                        <span>Chart Settings</span>
                      </div>
                      <div className="right">
                        <div className="icon">
                          <FaAngleRight />
                        </div>
                      </div>
                    </Link>
                  </div>
                  <div className="list">
                    <Link to="/">
                      <div className="left">
                        <div className="icon">
                          <img src={TransactionIcon} />
                        </div>
                        <span>Transactions</span>
                      </div>
                      <div className="right">
                        <div className="icon">
                          <FaAngleRight />
                        </div>
                      </div>
                    </Link>
                  </div>
                  <div className="list">
                    <Link to="/">
                      <div className="left">
                        <div className="icon">
                          <img src={SettingsIcon} />
                        </div>
                        <span>Settings</span>
                      </div>
                      <div className="right">
                        <div className="icon">
                          <FaAngleRight />
                        </div>
                      </div>
                    </Link>
                  </div>
                  <div className="list">
                    <Link to="/dashboard/account/help">
                      <div className="left">
                        <div className="icon">
                          <img src={HelpIcon} />
                        </div>
                        <span>Help</span>
                      </div>
                      <div className="right">
                        <div className="icon">
                          <FaAngleRight />
                        </div>
                      </div>
                    </Link>
                  </div>
                </div>
                <div className="logout_button">
                  <button type='button'>Logout</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default AccountPage
