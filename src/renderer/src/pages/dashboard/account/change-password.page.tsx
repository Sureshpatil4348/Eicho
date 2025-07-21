import React from 'react'
import ProfileIcon from "@renderer/assets/images/profile-icon.svg";
import PasswordIcon from "@renderer/assets/images/password-icon-2.svg";



const ProfilePage: React.FunctionComponent = () => {
    return (
        <>
            <div className='dashboard_main_body'>
                <div className="dashboard_container dashboard_main_body_container">
                    <div className="account_main_sec">
                        <div className="profile_main_box">
                            <div className='head'>
                                <h4>Change Password</h4>
                                <p>Change Your Password by Entering a New Password</p>
                            </div>
                            <div className="profile_form">
                                <form>
                                    <div className="form-group">
                                        <label>New Password</label>
                                        <div className="field">
                                            <div className="icon">
                                                <img src={PasswordIcon} alt="" />
                                            </div>
                                            <input className="form-control" type="password" placeholder='************' />
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label>Confirm Password</label>
                                        <div className="field">
                                            <div className="icon">
                                                <img src={PasswordIcon} alt="" />
                                            </div>
                                            <input className="form-control" type="password" placeholder='************' />
                                        </div>
                                    </div>
                                    <div className="form-group text-center">
                                        <button type="button" className="login">
                                            Update Password
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ProfilePage
