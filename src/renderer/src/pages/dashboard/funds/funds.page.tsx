import React from "react";
import Money from "@renderer/assets/images/money.png";
import { RxDotsVertical } from "react-icons/rx";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { useAppSelector } from "@renderer/services/hook";

const FundsPage: React.FunctionComponent = () => {
  const { accountstatus } = useAppSelector((state) => state.accountstatus);
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
            <h2>Funds</h2>
          </div>
          <div className="portofolio_top funds_top">
            <div className="dashboard_widget">
              <div className="dashboard_widget_item green_box">
                <div className="dashboard_widget_item_box">
                  <div className="dashboard_widget_item_box_left">
                    <span>Available Fund</span>
                    <h3 className="green">$125,847.5</h3>
                  </div>
                  <div className="dashboard_widget_item_box_right">
                    <img src={Money} alt="" />
                  </div>
                </div>
              </div>
              <div className="dashboard_widget_item">
                <div className="dashboard_widget_item_box">
                  <div className="dashboard_widget_item_box_left">
                    <span>Total Deposited Fund</span>
                    <h3>$200,847.5</h3>
                  </div>
                </div>
              </div>
              <div className="dashboard_widget_item">
                <div className="dashboard_widget_item_box">
                  <div className="dashboard_widget_item_box_left">
                    <span>Equity Fund</span>
                    <h3>$125,847.5</h3>
                  </div>
                </div>
              </div>
              <div className="dashboard_widget_item">
                <div className="dashboard_widget_item_box">
                  <div className="dashboard_widget_item_box_left">
                    <span>Withdrawal Fund</span>
                    <h3>$125,847.5</h3>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="dashboard_tabs_sec">
            <div className="strategies_sec">
              <div className="tabs_inside_boxs">
                <div className="head">
                  <div className="left">
                    <h3>Transaction History</h3>
                  </div>
                  <div className="right">
                    <div className="form-group">
                      <input
                        type="date"
                        placeholder="Start Date - End Date"
                        className="form-control"
                      />
                    </div>
                    <div className="form-group">
                      <select className="form-control">
                        <option>Transaction Type</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className="custom_table">
                  <table>
                    <thead>
                      <tr>
                        <th>Transaction ID</th>
                        <th>Date & Time</th>
                        <th>Type</th>
                        <th>Amount (USD)</th>
                        <th>Method</th>
                        <th className="text-center">Status</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td data-th="Transaction ID">TXN1234567890</td>
                        <td data-th="Date & Time">21 Jul 2025 10:14</td>
                        <td data-th="Type"> Deposit</td>
                        <td data-th="Amount (USD)"> $1,000.00</td>
                        <td data-th="Method">Bank Transfer</td>
                        <td data-th="Status">
                          <div className="status open">
                            <span>Completed</span>
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
                            <MenuItem onClick={handleClose}>
                              Deposit Money
                            </MenuItem>
                            <MenuItem onClick={handleClose}>
                              Withdraw Money
                            </MenuItem>
                          </Menu>
                        </td>
                      </tr>
                      <tr>
                        <td data-th="Transaction ID">TXN1234567890</td>
                        <td data-th="Date & Time">21 Jul 2025 10:14</td>
                        <td data-th="Type"> Deposit</td>
                        <td data-th="Amount (USD)"> $1,000.00</td>
                        <td data-th="Method">Bank Transfer</td>
                        <td data-th="Status">
                          <div className="status open">
                            <span>Completed</span>
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
                            <MenuItem onClick={handleClose}>
                              Deposit Money
                            </MenuItem>
                            <MenuItem onClick={handleClose}>
                              Withdraw Money
                            </MenuItem>
                          </Menu>
                        </td>
                      </tr>
                      <tr>
                        <td data-th="Transaction ID">TXN1234567890</td>
                        <td data-th="Date & Time">21 Jul 2025 10:14</td>
                        <td data-th="Type"> Deposit</td>
                        <td data-th="Amount (USD)"> $1,000.00</td>
                        <td data-th="Method">Bank Transfer</td>
                        <td data-th="Status">
                          <div className="status open">
                            <span>Completed</span>
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
                            <MenuItem onClick={handleClose}>
                              Deposit Money
                            </MenuItem>
                            <MenuItem onClick={handleClose}>
                              Withdraw Money
                            </MenuItem>
                          </Menu>
                        </td>
                      </tr>
                      <tr>
                        <td data-th="Transaction ID">TXN1234567890</td>
                        <td data-th="Date & Time">21 Jul 2025 10:14</td>
                        <td data-th="Type"> Deposit</td>
                        <td data-th="Amount (USD)"> $1,000.00</td>
                        <td data-th="Method">Bank Transfer</td>
                        <td data-th="Status">
                          <div className="status open">
                            <span>Completed</span>
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
                            <MenuItem onClick={handleClose}>
                              Deposit Money
                            </MenuItem>
                            <MenuItem onClick={handleClose}>
                              Withdraw Money
                            </MenuItem>
                          </Menu>
                        </td>
                      </tr>

                      <tr>
                        <td data-th="Transaction ID">TXN1234567890</td>
                        <td data-th="Date & Time">21 Jul 2025 10:14</td>
                        <td data-th="Type"> Deposit</td>
                        <td data-th="Amount (USD)"> $1,000.00</td>
                        <td data-th="Method">Bank Transfer</td>
                        <td data-th="Status">
                          <div className="status open">
                            <span>Completed</span>
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
                            <MenuItem onClick={handleClose}>
                              Deposit Money
                            </MenuItem>
                            <MenuItem onClick={handleClose}>
                              Withdraw Money
                            </MenuItem>
                          </Menu>
                        </td>
                      </tr>
                      <tr>
                        <td data-th="Transaction ID">TXN1234567890</td>
                        <td data-th="Date & Time">21 Jul 2025 10:14</td>
                        <td data-th="Type"> Deposit</td>
                        <td data-th="Amount (USD)"> $1,000.00</td>
                        <td data-th="Method">Bank Transfer</td>
                        <td data-th="Status">
                          <div className="status open">
                            <span>Completed</span>
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
                            <MenuItem onClick={handleClose}>
                              Deposit Money
                            </MenuItem>
                            <MenuItem onClick={handleClose}>
                              Withdraw Money
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

export default FundsPage;
