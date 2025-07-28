import React, { useState } from "react";
import { Link } from "react-router-dom";
import Logo from "@renderer/assets/images/logo.svg";
import Email from "@renderer/assets/images/email-icon.svg";
import Password from "@renderer/assets/images/password-icon.svg";
import * as Yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button } from "@mui/material";
import { useAppDispatch, useAppSelector } from "@renderer/services/hook";
import { AuthLoginType } from "@renderer/types/auth.type";
import { UserLoginAction } from "@renderer/services/actions/auth.action";
import { IoEyeOffOutline, IoEyeOutline } from "react-icons/io5";

const LoginPage: React.FunctionComponent = () => {
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const dispatch = useAppDispatch();

  const { loading } = useAppSelector(state => state.authorization)

  const formSchema: Yup.ObjectSchema<AuthLoginType> = Yup.object().shape({
    username: Yup.string().email("Invalid email").required("Email is required"),
    password: Yup.string().min(8, "Password must be at least 8 characters").required("Password is required"),
  });

  const { register, handleSubmit, formState: { errors } } = useForm<AuthLoginType>({
    resolver: yupResolver(formSchema),
    mode: "onSubmit",
  });

  const onSubmit = (data: AuthLoginType): void => {
    UserLoginAction(data, dispatch);
  }

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
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="form-group">
              <label>Email</label>
              <div className="field">
                <div className="icon">
                  <img src={Email} alt="" />
                </div>
                <input className="form-control" type="text" {...register("username")} />
              </div>
              {errors.username && <p className="error">{errors.username.message}</p>}
            </div>
            <div className="form-group">
              <label>Password</label>
              <div className="field">
                <div className="icon">
                  <img src={Password} alt="" />
                </div>
                <div className="eye" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <IoEyeOffOutline /> : <IoEyeOutline />}
                </div>
                <input className="form-control" type={showPassword ? "text" : "password"} {...register("password")} />
              </div>
              {errors.password && <p className="error">{errors.password.message}</p>}
            </div>
            <div className="form-group forgot_password">
              <Link to="/forgot-password">Forgot Password</Link>
            </div>
            <div className="form-group text-center">
              <Button type="submit" loading={loading} className="login">
                Login
              </Button>
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
