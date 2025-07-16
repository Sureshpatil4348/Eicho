import { AuthState } from "@renderer/context/auth.context";
import { FunctionComponent } from "react";
import { Navigate, Outlet } from "react-router-dom";

export const AuthGuard: FunctionComponent = () => {
    const { isAuthorized } = AuthState()

    return isAuthorized ? <Navigate to={'/dashboard'} replace={true} /> : <Outlet />
}

export const DashboardGuard: FunctionComponent = () => {
    const { isAuthorized } = AuthState()

    return isAuthorized? <Outlet /> : <Navigate to={'/'} replace={true} />
}
