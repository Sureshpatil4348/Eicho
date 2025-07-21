import React from "react";
import { Link } from "react-router-dom";
import Logo from "@renderer/assets/images/logo.svg";
import Email from "@renderer/assets/images/email-icon.svg";
import Password from "@renderer/assets/images/password-icon.svg";

const LoginPage: React.FunctionComponent = () => {
  return (
      <div className="auth_page">
        <div className="before_login_sec">
          <div className="logo">
            <Link to="/">
              <img src={Logo} alt="Forex Logo" style={{ height: 50 }} />
            </Link>
          </div>
          <div className="wrap_box">
            <div className="head">
              <h2>Login</h2>
              <p>Login With Your Personal Details</p>
            </div>
            <form>
              <div className="form-group">
                <label>Email</label>
                <div className="field">
                  <div className="icon">
                    <img src={Email} alt="" />
                  </div>
                  <input className="form-control" type="email" />
                </div>
              </div>
              <div className="form-group">
                <label>Password</label>
                <div className="field">
                  <div className="icon">
                    <img src={Password} alt="" />
                  </div>
                  <input className="form-control" type="password" />
                </div>
              </div>
              <div className="form-group forgot_password">
                <Link to="#">Forgot Password</Link>
              </div>
              <div className="form-group text-center">
                <button type="button" className="login">
                  Login
                </button>
              </div>
            </form>
          </div>
          <div className="allready_account">
            <span>
              Don&apos;t Have an account? <Link to="#">Signup</Link>
            </span>
          </div>
        </div>
      </div>
  );
};

export default LoginPage;
