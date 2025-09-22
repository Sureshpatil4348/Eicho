import React, { useState } from "react";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import axios from "@renderer/config/axios";
import { API_URL } from "@renderer/utils/constant";
import toast from "react-hot-toast";
import { Button } from "@mui/material";
import { Mt5payload } from "@renderer/services/constants/account.constants";
import MODAL_TYPE from "@renderer/config/modal";
import { openModal } from "@renderer/services/actions/modal.action";
import { useAppDispatch } from "@renderer/services/hook";
import { AxiosResponse } from "axios";
import { AuthState } from "@renderer/context/auth.context";

const ConnectWallet: React.FunctionComponent<{ closeModal: () => void }> = ({
    closeModal,
}) => {
    const { getUserDetails } = AuthState();
    const [isLoading, setIsLoading] = useState(false);
    const dispatch: any = useAppDispatch();
    const formSchema: Yup.ObjectSchema<any> = Yup.object().shape({
        login: Yup.string().required("Login id is required"),
        password: Yup.string().required("Password is required"),
        server: Yup.string().required("Server is required"),
    });

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<Mt5payload>({ resolver: yupResolver(formSchema), mode: "all", defaultValues: { login: 10007176246, password: "-6TiNhUm", server: "MetaQuotes-Demo" } });

    const onSubmit = (data: Mt5payload): void => {
        setIsLoading(true);
        let payload = {
            login: Number(data.login),
            password: data.password,
            server: data.server,
        }
        axios
            .post(API_URL.CONNECT_MT5, payload)
            .then((res: AxiosResponse) => {
                if (res.data.success) {
                    toast.success(res.data.message);
                    closeModal();
                    reset();
                    setIsLoading(false);
                    openModal(
                        {
                            body: MODAL_TYPE.DEFAULT,
                            title: "MT5 Wallet Connected Successfully",
                            size: "md",
                        },
                        dispatch
                    );
                    getUserDetails();
                    // dispatch({ type: ACCOUNT_CONNECT.ACCOUNT_CONNECT_SUCCESS, payload: { message: res.data.message, data: res.data.status } });
                }
            })
            .catch((err) => {
                if (err.response) {
                    toast.error(err.response.data.message);
                } else {
                    toast.error(err.message);
                }
                setIsLoading(false);
            });
    };

    return (
        <div className="custom_modal_form">
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="row">
                    <div className="col-md-12">
                        <h4>Connect MT5 Wallets</h4>
                    </div>
                    <div className="col-md-12 form-group">
                        <label>Login Id</label>
                        <div className="field">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="login id.."
                                {...register("login")}
                            />
                        </div>
                        {errors.login && <p className="error">{errors.login.message}</p>}
                    </div>
                    <div className="col-md-12 form-group">
                        <label>Password</label>
                        <div className="field">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Password"
                                {...register("password")}
                            />
                        </div>
                        {errors.password && (
                            <p className="error">{errors.password.message}</p>
                        )}
                    </div>
                    <div className="col-md-12 form-group">
                        <label>Server</label>
                        <div className="field">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Server name"
                                {...register("server")}
                            />
                        </div>
                        {errors.server && <p className="error">{errors.server.message}</p>}
                    </div>
                    <div className="col-md-12 form-group text-center">
                        <Button
                            loading={isLoading}
                            disabled={isLoading}
                            type="submit"
                            className="save"
                        >
                            Connect
                        </Button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default ConnectWallet;
