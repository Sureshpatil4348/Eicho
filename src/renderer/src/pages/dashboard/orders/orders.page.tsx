import React from "react";

const OrdersPage: React.FunctionComponent = () => {


  return (
    <div className="dashboard_main_body">
      <div className="dashboard_container dashboard_main_body_container">
        <div className="dashboard_main_sec">
          {/* <div className="dashboard_heading">
            <h2>Dashboard</h2>
          </div> */}
          {/* <div className="portofolio_top">
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
          </div> */}
          <div className="dashboard_tabs_sec">
            <div className="strategies_sec">
              <div className="tabs_inside_boxs">
                <div className="head">
                  <div className="left">
                    <h3>Orders</h3>
                  </div>
                  <div className="right">
                    <div className="form-group">
                      <select className="form-control">
                        <option>Select Pair</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <select className="form-control">
                        <option>Select Action</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <select className="form-control">
                        <option>Strategy</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className="custom_table">
                  <table>
                    <thead>
                      <tr>
                        <th>Trade ID</th>
                        <th>Time</th>
                        <th>Strategy</th>
                        <th>Pair</th>
                        <th>Action</th>
                        <th>Size</th>
                        <th>Entry</th>
                        <th>Exit</th>
                        <th>P&L</th>
                        <th>Duration</th>
                        <th className="text-center">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td data-th="Trade ID">TXN-001</td>
                        <td data-th="Time"> 09:30:15</td>
                        <td data-th="Strategy"> Mean Reversal Alpha</td>
                        <td data-th="Pair"> GBPUSD</td>
                        <td data-th="Action">
                          <div className="action buy">BUY</div>
                        </td>
                        <td data-th="Size"> 0.5 lots</td>
                        <td data-th="Entry"> 1.085</td>
                        <td data-th="Exit"> 1.0895</td>
                        <td data-th="P&L"> $+225</td>
                        <td data-th="Duration">2h 15m </td>
                        <td data-th="Status">
                          <div className="status">
                            <span>clossed</span>
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td data-th="Trade ID">TXN-001</td>
                        <td data-th="Time"> 09:30:15</td>
                        <td data-th="Strategy"> Mean Reversal Alpha</td>
                        <td data-th="Pair"> GBPUSD</td>
                        <td data-th="Action">
                          <div className="action sell">SELL</div>
                        </td>
                        <td data-th="Size"> 0.5 lots</td>
                        <td data-th="Entry"> 1.085</td>
                        <td data-th="Exit"> 1.0895</td>
                        <td data-th="P&L"> $+225</td>
                        <td data-th="Duration">2h 15m </td>
                        <td data-th="Status">
                          <div className="status">
                            <span>clossed</span>
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td data-th="Trade ID">TXN-001</td>
                        <td data-th="Time"> 09:30:15</td>
                        <td data-th="Strategy"> Mean Reversal Alpha</td>
                        <td data-th="Pair"> GBPUSD</td>
                        <td data-th="Action">
                          <div className="action buy">BUY</div>
                        </td>
                        <td data-th="Size"> 0.5 lots</td>
                        <td data-th="Entry"> 1.085</td>
                        <td data-th="Exit"> 1.0895</td>
                        <td data-th="P&L"> $+225</td>
                        <td data-th="Duration">2h 15m </td>
                        <td data-th="Status">
                          <div className="status">
                            <span>clossed</span>
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td data-th="Trade ID">TXN-001</td>
                        <td data-th="Time"> 09:30:15</td>
                        <td data-th="Strategy"> Mean Reversal Alpha</td>
                        <td data-th="Pair"> GBPUSD</td>
                        <td data-th="Action">
                          <div className="action sell">SELL</div>
                        </td>
                        <td data-th="Size"> 0.5 lots</td>
                        <td data-th="Entry"> 1.085</td>
                        <td data-th="Exit"> 1.0895</td>
                        <td data-th="P&L"> $+225</td>
                        <td data-th="Duration">2h 15m </td>
                        <td data-th="Status">
                          <div className="status">
                            <span>clossed</span>
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td data-th="Trade ID">TXN-001</td>
                        <td data-th="Time"> 09:30:15</td>
                        <td data-th="Strategy"> Mean Reversal Alpha</td>
                        <td data-th="Pair"> GBPUSD</td>
                        <td data-th="Action">
                          <div className="action buy">BUY</div>
                        </td>
                        <td data-th="Size"> 0.5 lots</td>
                        <td data-th="Entry"> 1.085</td>
                        <td data-th="Exit"> 1.0895</td>
                        <td data-th="P&L"> $+225</td>
                        <td data-th="Duration">2h 15m </td>
                        <td data-th="Status">
                          <div className="status">
                            <span>clossed</span>
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td data-th="Trade ID">TXN-001</td>
                        <td data-th="Time"> 09:30:15</td>
                        <td data-th="Strategy"> Mean Reversal Alpha</td>
                        <td data-th="Pair"> GBPUSD</td>
                        <td data-th="Action">
                          <div className="action sell">SELL</div>
                        </td>
                        <td data-th="Size"> 0.5 lots</td>
                        <td data-th="Entry"> 1.085</td>
                        <td data-th="Exit"> 1.0895</td>
                        <td data-th="P&L"> $+225</td>
                        <td data-th="Duration">2h 15m </td>
                        <td data-th="Status">
                          <div className="status">
                            <span>clossed</span>
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td data-th="Trade ID">TXN-001</td>
                        <td data-th="Time"> 09:30:15</td>
                        <td data-th="Strategy"> Mean Reversal Alpha</td>
                        <td data-th="Pair"> GBPUSD</td>
                        <td data-th="Action">
                          <div className="action buy">BUY</div>
                        </td>
                        <td data-th="Size"> 0.5 lots</td>
                        <td data-th="Entry"> 1.085</td>
                        <td data-th="Exit"> 1.0895</td>
                        <td data-th="P&L"> $+225</td>
                        <td data-th="Duration">2h 15m </td>
                        <td data-th="Status">
                          <div className="status">
                            <span>clossed</span>
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td data-th="Trade ID">TXN-001</td>
                        <td data-th="Time"> 09:30:15</td>
                        <td data-th="Strategy"> Mean Reversal Alpha</td>
                        <td data-th="Pair"> GBPUSD</td>
                        <td data-th="Action">
                          <div className="action sell">SELL</div>
                        </td>
                        <td data-th="Size"> 0.5 lots</td>
                        <td data-th="Entry"> 1.085</td>
                        <td data-th="Exit"> 1.0895</td>
                        <td data-th="P&L"> $+225</td>
                        <td data-th="Duration">2h 15m </td>
                        <td data-th="Status">
                          <div className="status">
                            <span>clossed</span>
                          </div>
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

export default OrdersPage;
