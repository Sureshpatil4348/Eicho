import React from "react";
import { IoSearch } from "react-icons/io5";
import { Tab, TabList, TabPanel, Tabs } from "react-tabs";
import Graph4 from "@renderer/assets/images/graph-4.png";

const TradeHistoryComponent: React.FunctionComponent = () => {
  return (
    <div className="strategies_sec">
      <div className="head">
        <h3>Trade History</h3>
        <p>Advanced Trade Filtering and Performance Analysis</p>
      </div>
      <Tabs>
        <div className="strategi_menu">
          <div className="left">
            <TabList>
              <Tab>Trade Analysis</Tab>
              <Tab>Daily P&L</Tab>
              <Tab>Strategy Analysis</Tab>
              <Tab>Pair Statistic</Tab>
            </TabList>
          </div>
          <div className="right">
            <div className="add_button">
              {/* <button type='button' onClick={() => createHandler()}>
                <FaPlus />
                Add Strategy
              </button> */}
            </div>
          </div>
        </div>
        <TabPanel>
          <div className="trade_analysis_sec">
            <div className="head">
              <h3>Trade View Options</h3>
              <p>Select How you want to view and filter trades</p>
            </div>
            <div className="col-md-12 trade_analysis_wrap">
              <div className="small_part form-group">
                <label>View Type</label>
                <div className="field">
                  <select className="form-control">
                    <option>Mean Reversal Alpha</option>
                  </select>
                </div>
              </div>
              <div className="small_part form-group">
                <label>Strategy Pair</label>
                <div className="field">
                  <select className="form-control">
                    <option>GBPUSD</option>
                  </select>
                </div>
              </div>
              <div className="small_part form-group">
                <label>Additional Filters</label>
                <div className="field">
                  <input
                    type="date"
                    className="form-control"
                    placeholder="Date Range"
                  />
                </div>
              </div>
              <div className="w-full form-group">
                <div className="field">
                  <div className="search">
                    <button type="button">
                      <IoSearch />
                    </button>
                    <input
                      type="search"
                      className="form-control"
                      placeholder="Search Trades by ID, Pair, Strategy...."
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="trade_analysis_sec">
            <div className="head">
              <h3>Mean Reversal Alpha - USD</h3>
              <p>
                Showing 1 Trades <span>Mean Reversal Alpha</span>{" "}
                <span>GBPUSD</span>
              </p>
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
        </TabPanel>
        <TabPanel>
          <div className="trade_analysis_sec">
            <div className="head">
              <h3>Mean Reversal Alpha - USD</h3>
              <p>
                Showing 1 Trades <span>Mean Reversal Alpha</span>{" "}
                <span>GBPUSD</span>
              </p>
            </div>
            <div className="graph">
              <img src={Graph4} alt="" />
            </div>
            <div className="daily_pl">
              <div className="dashboard_perfomance">
                <div className="dashboard_perfomance_itmes">
                  <div className="bottom">
                    <h4 className="green">+$1417</h4>
                    <ul>
                      <li>
                        <span>Total P&L(6 days)</span>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="dashboard_perfomance_itmes">
                  <div className="bottom">
                    <h4>+$236</h4>
                    <ul>
                      <li>
                        <span>Average Daily (P&L)</span>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="dashboard_perfomance_itmes">
                  <div className="bottom">
                    <h4>65</h4>
                    <ul>
                      <li>
                        <span>Total Trades</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </TabPanel>
        <TabPanel>
          <div className="tabs_inside_boxs trade_analysis_sec">
            <div className="head">
              <h3>Mean Reversal Alpha - USD</h3>
              <p>
                Showing 1 Trades <span>Mean Reversal Alpha</span>{" "}
                <span>GBPUSD</span>
              </p>
            </div>
            <div className="trade_strategy">
              <div className="dashboard_perfomance">
                <div className="dashboard_perfomance_itmes">
                  <div className="top">
                    <div className="left">
                      <h4>Trend Following Pro</h4>
                    </div>
                  </div>
                  <div className="bottom">
                    <ul>
                      <li>
                        <h5>65</h5>
                        <p>Total Trades</p>
                      </li>
                      <li>
                        <h5>68%</h5>
                        <p>Win Rate</p>
                      </li>
                      <li>
                        <h5>$27.28</h5>
                        <p>Avg per Trade</p>
                      </li>
                      <li className="green">
                        <h5>+$1250</h5>
                        <p>P&L %</p>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="dashboard_perfomance_itmes">
                  <div className="top">
                    <div className="left">
                      <h4>Mean Reversion Alpha</h4>
                    </div>
                  </div>
                  <div className="bottom">
                    <ul>
                      <li>
                        <h5>45</h5>
                        <p>Total Trades</p>
                      </li>
                      <li>
                        <h5>68%</h5>
                        <p>Win Rate</p>
                      </li>
                      <li>
                        <h5>$27.28</h5>
                        <p>Avg per Trade</p>
                      </li>
                      <li className="green">
                        <h5>+$1250</h5>
                        <p>P&L %</p>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="dashboard_perfomance_itmes">
                  <div className="top">
                    <div className="left">
                      <h4>Scalping Bot</h4>
                    </div>
                  </div>
                  <div className="bottom">
                    <ul>
                      <li>
                        <h5>65</h5>
                        <p>Total Trades</p>
                      </li>
                      <li>
                        <h5>68%</h5>
                        <p>Win Rate</p>
                      </li>
                      <li>
                        <h5>$27.28</h5>
                        <p>Avg per Trade</p>
                      </li>
                      <li className="green">
                        <h5>+$1250</h5>
                        <p>P&L %</p>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="dashboard_perfomance_itmes">
                  <div className="top">
                    <div className="left">
                      <h4>Breakout Hunter</h4>
                    </div>
                  </div>
                  <div className="bottom">
                    <ul>
                      <li>
                        <h5>45</h5>
                        <p>Total Trades</p>
                      </li>
                      <li>
                        <h5>68%</h5>
                        <p>Win Rate</p>
                      </li>
                      <li>
                        <h5>$27.28</h5>
                        <p>Avg per Trade</p>
                      </li>
                      <li className="green">
                        <h5>+$1250</h5>
                        <p>P&L %</p>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </TabPanel>
      </Tabs>
    </div>
  );
};

export default TradeHistoryComponent;
