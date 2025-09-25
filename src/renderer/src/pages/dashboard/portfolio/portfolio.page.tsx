import React, { useEffect, useState } from "react";
import Money from "@renderer/assets/images/money.png";
// import { RxDotsVertical } from "react-icons/rx";
// import { TbEdit } from "react-icons/tb";
// import { TbTrash } from "react-icons/tb";
// import Menu from "@mui/material/Menu";
// import MenuItem from "@mui/material/MenuItem";
import { useAppSelector } from "@renderer/services/hook";
import { getCookie } from "@renderer/utils/cookies";

const PortfolioPage: React.FunctionComponent = () => {
  const { strategies } = useAppSelector(state => state.strategies)
  const [positions, setPositions]: any = useState([])
  const [dashboardData, setDashboardData]: any = useState(null)
  // const [anchorEl, setAnchorEl] = React.useState(null);
  // const open = Boolean(anchorEl);
  // const handleClick = (event) => {
  //   setAnchorEl(event.currentTarget);
  // };
  // const handleClose = () => {
  //   setAnchorEl(null);
  // };

  const connectToCreatorSocketLister = () => {
    const token = getCookie('auth-token')

    return new Promise((resolve) => {
      const socketConnection = new WebSocket(`ws://20.83.157.24:8000/socket.io/?EIO=4&transport=websocket&token=${token}`)
      socketConnection.addEventListener("open", () => {
        // const payload = { "act": "40/live" };
        socketConnection.send('40/live');
        // dispatch({ type: CREATOR_SOCKET.CREATOR_SOCKET_SUCCESS, payload: { [response.email]: socketConnection } })
      });
      // socketConnection.addEventListener("close", () => {
      //   connectToCreatorSocketLister()
      //   const creatorReconnectSection = setTimeout(() => {
      //       clearTimeout(creatorReconnectSection);
      //   }, 1000);
      // })
      // updateCreatorsCount(response, socketConnection, dispatch)
      updateCreatorsCount(socketConnection)
      resolve(socketConnection)
    })
  }
  const updateCreatorsCount = (socket: any) => {
    socket.addEventListener("message", (message: any) => {
      // const creatorDetails = data
      // const creatorDispatch = dispatch

      if (message.data) {
        const message_data = JSON.parse(message.data.replace('42/live,', ''))
        console.log('message', message_data)
        if (message_data[1]) {
          setPositions(message_data[1]?.positions)
          setDashboardData(message_data[1]?.dashboard)
        }
      }
    })
  }
  useEffect(() => {
    connectToCreatorSocketLister()
  }, []);
  return (
    <div className="dashboard_main_body">
      <div className="dashboard_container dashboard_main_body_container">
        <div className="dashboard_main_sec">
          <div className="dashboard_heading">
            <h2>Dashboard</h2>
          </div>
          <div className="portofolio_top">
            <div className="dashboard_widget">
              <div className="dashboard_widget_item green_box">
                <div className="dashboard_widget_item_box">
                  <div className="dashboard_widget_item_box_left">
                    <span>Live P/L</span>
                    <h3 className="green">$ {dashboardData?.live_pnl}</h3>
                    <p>Today's performance</p>
                  </div>
                  <div className="dashboard_widget_item_box_right">
                    <img src={Money} alt="" />
                  </div>
                </div>
              </div>
              <div className="dashboard_widget_item">
                <div className="dashboard_widget_item_box">
                  <div className="dashboard_widget_item_box_left">
                    <span>Balance</span>
                    <h3>{dashboardData?.balance}</h3>
                    <p>Total account value</p>
                  </div>
                </div>
              </div>
              <div className="dashboard_widget_item">
                <div className="dashboard_widget_item_box">
                  <div className="dashboard_widget_item_box_left">
                    <span>Equity</span>
                    <h3 className="green">{dashboardData?.equity}</h3>
                    <p>Account equity ratio</p>
                  </div>
                </div>
              </div>
              <div className="dashboard_widget_item">
                <div className="dashboard_widget_item_box">
                  <div className="dashboard_widget_item_box_left">
                    <span>Active Strategies</span>
                    <h3>{strategies?.length}</h3>
                    <p>Running strategies</p>
                  </div>
                </div>
              </div>
              <div className="dashboard_widget_item">
                <div className="dashboard_widget_item_box">
                  <div className="dashboard_widget_item_box_left">
                    <span>Profit Last Month</span>
                    <h3 className="green">{dashboardData?.profit_last_month}</h3>
                    <p>Monthly performance</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="dashboard_tabs_sec">
            <div className="strategies_sec">
              <div className="head">
                <h3>Open Positions</h3>
              </div>
              <div className="tabs_inside_boxs">
                <div className="head">
                  <h3>All Open Positions</h3>
                </div>
                <div className="custom_table">
                  <table>
                    <thead>
                      <tr>
                        <th>Pair</th>
                        <th>Position</th>
                        <th>Entry Price</th>
                        <th>Current Price</th>
                        <th>P/L</th>
                        <th>Risk %</th>
                        <th className="text-center">Status</th>
                        {/* <th>Action</th> */}
                      </tr>
                    </thead>
                    <tbody>
                      {
                        positions?.length > 0 ?
                          positions?.map((item: any, index: number) => {
                            return (
                              <tr key={index}>
                                <td data-th="Pair">{item?.pair}</td>
                                <td data-th="Position">
                                  <div className="action buy">Buy</div>
                                </td>
                                <td data-th="Entry Price"> {item?.entry_price}</td>
                                <td data-th="Current Price"> {item?.current_price}</td>
                                <td data-th="P/L">{item?.pnl}</td>
                                <td data-th="Risk %"> {item?.risk_pct}</td>
                                <td data-th="Status">
                                  <div className="status open">
                                    <span>{item?.status}</span>
                                  </div>
                                </td>
                                {/* <td data-th="Action">
                                  <button
                                    type="button"
                                    className="action_button"
                                    id="basic-button"
                                    aria-controls={open ? "basic-menu" : undefined}
                                    aria-haspopup="true"
                                    aria-expanded={open ? "true" : undefined}
                                    onClick={handleClick}
                                  >
                                    <RxDotsVertical />
                                  </button>

                                  <Menu
                                    id="basic-menu"
                                    anchorEl={anchorEl}
                                    open={open}
                                    onClose={handleClose}
                                    anchorOrigin={{
                                      vertical: "bottom",
                                      horizontal: "right",
                                    }}
                                    transformOrigin={{
                                      vertical: "top",
                                      horizontal: "right",
                                    }}
                                  >
                                    <MenuItem
                                      onClick={handleClose}
                                      sx={{
                                        color: "#0052B4",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "start",
                                        gap: "6px",
                                      }}
                                    >
                                      <TbEdit /> Edit
                                    </MenuItem>
                                    <MenuItem
                                      onClick={handleClose}
                                      sx={{
                                        color: "#D80027",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "start",
                                        gap: "6px",
                                      }}
                                    >
                                      <TbTrash /> Delete
                                    </MenuItem>
                                  </Menu>
                                </td> */}
                              </tr>
                            )
                          }) : <tr><td>No positions</td></tr>
                      }


                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PortfolioPage;
