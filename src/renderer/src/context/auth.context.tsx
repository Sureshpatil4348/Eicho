import axios from "@renderer/config/axios";
import { useAppSelector } from "@renderer/services/hook";
import LoadingScreen from "@renderer/shared/LoadingScreen";
import { AUTH_CONTEXT, USER_DETAILS } from "@renderer/types/auth.type";
import { API_URL } from "@renderer/utils/constant";
import { setCookie } from "@renderer/utils/cookies";
import React, { createContext, FunctionComponent, useContext, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";

const AuthContext = createContext<AUTH_CONTEXT>({
  isAuthorized: false,
  userDetails: null,
  setUserDetails: (): void => { },
  setIsAuthorized: (): void => { },
  getUserDetails: (): Promise<void> => Promise.resolve(),
  liveTrades: [],
  dashboardData: null,
  positions: [],
  setLiveTrades: (): void => { },
  setDashboardData: (): void => { },
  setPositions: (): void => { },

})

const AuthProvider: FunctionComponent<{ children: React.ReactElement }> = ({ children }) => {

  const [isAuthorized, setIsAuthorized] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isInitialized, setIsInitialized] = useState<boolean>(false)
  const [userDetails, setUserDetails] = useState<USER_DETAILS | null>(null)
  const [liveTrades, setLiveTrades] = useState<any>([])
  const [dashboardData, setDashboardData] = useState<any>(null)
  const [positions, setPositions] = useState<any>(null)
  const getUserDetails = async (): Promise<void> => {
    try {
      setIsLoading(true);
      const response = await axios.get(API_URL.GET_USER_DETAILS);
      setUserDetails(response.data?.data);
      setCookie('sessionId', response.data?.data?.session_id)
      setIsAuthorized(true);
    } catch (error) {
      console.log('Error fetching user details:', error)
      setUserDetails(null);
      setIsAuthorized(false);
    } finally {
      setIsInitialized(true);
      setIsLoading(false);
    }
  };

  const { token, message, error, isLogout } = useAppSelector((state) => state?.authorization)

  // const connectToCreatorSocketLister = () => {

  //   return new Promise((resolve) => {
  //     const socketConnection = new WebSocket(`ws://20.83.157.24:8000/socket.io/?EIO=4&transport=websocket&token=${token}`)
  //     socketConnection.addEventListener("open", () => {
  //       socketConnection.send('40/live');
  //     });
  //     // socketConnection.addEventListener("close", () => {
  //     //   connectToCreatorSocketLister()
  //     //   const creatorReconnectSection = setTimeout(() => {
  //     //       clearTimeout(creatorReconnectSection);
  //     //   }, 1000);
  //     // })
  //     updateCreatorsCount(socketConnection)
  //     resolve(socketConnection)
  //   })
  // }
  // const updateCreatorsCount = (socket: any) => {
  //   socket.addEventListener("message", (message: any) => {
  //     // const creatorDetails = data
  //     // const creatorDispatch = dispatch

  //     if (message.data) {
  //       const message_data = JSON.parse(JSON.stringify(message?.data?.replace('42/live,', '')))
  //       console.log('message', message_data[1]?.live_trades)
  //       if (message_data[1]) {
  //         setLiveTrades(message_data[1]?.live_trades)
  //         setDashboardData(message_data[1]?.dashboard)
  //         setPositions(message_data[1]?.positions)
  //       }
  //     }
  //   })
  // }
  useEffect(() => {
    if (error && message) toast.error(message);
    if (isLogout && message) toast.success(message);

    if (isLogout) {
      setIsAuthorized(false);
      setUserDetails(null);
    }
  }, [error, isLogout, message]);

  useEffect(() => {
    if (token) {
      getUserDetails();
      // connectToCreatorSocketLister();
    } else {
      setIsInitialized(true);
      setIsAuthorized(false);
      setUserDetails(null);
      setLiveTrades([]);
      setDashboardData(null);
      setPositions([]);
    }
  }, [token]);

  const contextValue = useMemo(() => ({ isAuthorized, userDetails, setUserDetails, setIsAuthorized, getUserDetails, liveTrades, dashboardData, positions, setLiveTrades, setDashboardData, setPositions }), [isAuthorized, userDetails]);

  if (!isInitialized) return <LoadingScreen />;

  return (
    <AuthContext.Provider value={contextValue}>
      {isLoading && <LoadingScreen />}
      {children}
    </AuthContext.Provider>
  )
}

export default AuthProvider

export const AuthState = (): AUTH_CONTEXT => useContext(AuthContext)
