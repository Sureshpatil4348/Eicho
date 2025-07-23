import React from "react";
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

const LoginPage: React.FunctionComponent = () => {

  const dispatch = useAppDispatch();

  const { loading: isLoading } = useAppSelector(state => state.authorization)

  const formSchema: Yup.ObjectSchema<AuthLoginType> = Yup.object().shape({
    userName: Yup.string().email("Invalid email").required("Email is required"),
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
                <input className="form-control" type="email" {...register("userName")} />
              </div>
              {errors.userName && <p className="error">{errors.userName.message}</p>}
            </div>
            <div className="form-group">
              <label>Password</label>
              <div className="field">
                <div className="icon">
                  <img src={Password} alt="" />
                </div>
                <input className="form-control" type="password" {...register("password")} />
              </div>
              {errors.password && <p className="error">{errors.password.message}</p>}
            </div>
            <div className="form-group forgot_password">
              <Link to="#">Forgot Password</Link>
            </div>
            <div className="form-group text-center">
              <Button type="submit" loading={isLoading} className="login">
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
