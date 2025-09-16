import React from "react";
import Money from "@renderer/assets/images/money.png";
import { RxDotsVertical } from "react-icons/rx";
import { TbEdit } from "react-icons/tb";
import { TbTrash } from "react-icons/tb";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { useAppSelector } from "@renderer/services/hook";

const PortfolioPage: React.FunctionComponent = () => {
  const { accountstatus } = useAppSelector(state => state.accountstatus)
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

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
                    <h3 className="green">+$2.34%</h3>
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
                    <h3>${accountstatus?.account_balance}</h3>
                    <p>Total account value</p>
                  </div>
                </div>
              </div>
              <div className="dashboard_widget_item">
                <div className="dashboard_widget_item_box">
                  <div className="dashboard_widget_item_box_left">
                    <span>Equity</span>
                    <h3 className="green">98.7%</h3>
                    <p>Account equity ratio</p>
                  </div>
                </div>
              </div>
              <div className="dashboard_widget_item">
                <div className="dashboard_widget_item_box">
                  <div className="dashboard_widget_item_box_left">
                    <span>Active Strategies</span>
                    <h3>12</h3>
                    <p>Running strategies</p>
                  </div>
                </div>
              </div>
              <div className="dashboard_widget_item">
                <div className="dashboard_widget_item_box">
                  <div className="dashboard_widget_item_box_left">
                    <span>Profit Last Month</span>
                    <h3 className="green">+$2,847.5</h3>
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
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td data-th="Pair">GBPUSD</td>
                        <td data-th="Position">
                          <div className="action buy">Buy</div>
                        </td>
                        <td data-th="Entry Price"> 1.36280</td>
                        <td data-th="Current Price"> 1.56000</td>
                        <td data-th="P/L">0.1972</td>
                        <td data-th="Risk %"> 2%</td>
                        <td data-th="Status">
                          <div className="status open">
                            <span>open</span>
                          </div>
                        </td>
                        <td data-th="Action">
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
                        </td>
                      </tr>
                      <tr>
                        <td data-th="Pair">GBPUSD</td>
                        <td data-th="Position">
                          <div className="action buy">Buy</div>
                        </td>
                        <td data-th="Entry Price"> 1.36280</td>
                        <td data-th="Current Price"> 1.56000</td>
                        <td data-th="P/L">0.1972</td>
                        <td data-th="Risk %"> 2%</td>
                        <td data-th="Status">
                          <div className="status open">
                            <span>open</span>
                          </div>
                        </td>
                        <td data-th="Action">
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
                        </td>
                      </tr>
                      <tr>
                        <td data-th="Pair">GBPUSD</td>
                        <td data-th="Position">
                          <div className="action buy">Buy</div>
                        </td>
                        <td data-th="Entry Price"> 1.36280</td>
                        <td data-th="Current Price"> 1.56000</td>
                        <td data-th="P/L">0.1972</td>
                        <td data-th="Risk %"> 2%</td>
                        <td data-th="Status">
                          <div className="status open">
                            <span>open</span>
                          </div>
                        </td>
                        <td data-th="Action">
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
                        </td>
                      </tr>
                      <tr>
                        <td data-th="Pair">GBPUSD</td>
                        <td data-th="Position">
                          <div className="action buy">Buy</div>
                        </td>
                        <td data-th="Entry Price"> 1.36280</td>
                        <td data-th="Current Price"> 1.56000</td>
                        <td data-th="P/L">0.1972</td>
                        <td data-th="Risk %"> 2%</td>
                        <td data-th="Status">
                          <div className="status open">
                            <span>open</span>
                          </div>
                        </td>
                        <td data-th="Action">
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
                        </td>
                      </tr>
                      <tr>
                        <td data-th="Pair">GBPUSD</td>
                        <td data-th="Position">
                          <div className="action buy">Buy</div>
                        </td>
                        <td data-th="Entry Price"> 1.36280</td>
                        <td data-th="Current Price"> 1.56000</td>
                        <td data-th="P/L">0.1972</td>
                        <td data-th="Risk %"> 2%</td>
                        <td data-th="Status">
                          <div className="status open">
                            <span>open</span>
                          </div>
                        </td>
                        <td data-th="Action">
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
                        </td>
                      </tr>
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
