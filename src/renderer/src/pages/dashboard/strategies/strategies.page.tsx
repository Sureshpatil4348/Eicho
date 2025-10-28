import React, { useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import SAnalysis1 from "@renderer/assets/images/s-analysis-1.svg";
import SAnalysis2 from "@renderer/assets/images/s-analysis-2.svg";
import SAnalysis3 from "@renderer/assets/images/s-analysis-3.svg";
import ArrowButton from "@renderer/assets/images/arrow-button.png";
import { Button, Chip } from "@mui/material";
// import Graph from '@renderer/assets/images/graph-2.png';
// import { FaPlus } from 'react-icons/fa6';
// import { openModal } from '@renderer/services/actions/modal.action';
// import MODAL_TYPE from '@renderer/config/modal';
import { IoMdArrowBack } from "react-icons/io";
import { useAppSelector } from "@renderer/services/hook";
import toast from "react-hot-toast";
import axios from "@renderer/config/axios";
import { API_URL } from "@renderer/utils/constant";
import { AuthState } from "@renderer/context/auth.context";
import moment from "moment-timezone";

const StrategiesPage: React.FunctionComponent = () => {
  // const dispatch = useAppDispatch()
  const { userDetails } = AuthState();
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id") ?? "";
  const { strategies } = useAppSelector((state) => state.strategies);
  const stratigyDetails: any =
    strategies?.find((item: any) => item?.strategy_id == id) || null;

  const [isLoading, setIsLoading] = React.useState(false);
  const [tradingHistory, setTradingHistory] = React.useState([]);
  const router = useNavigate();
  // const createHandler = (): void => {
  //   openModal({ body: MODAL_TYPE.CAPITAL_ALLOCATION, title: 'Capital Allocation', description: '', size: 'md', strategy_id: id }, dispatch)
  // }

  const getTradingHistory = (): void => {
    setIsLoading(true);
    axios
      .get(API_URL.GET_KEY_PAIRTRADING_HISTORY(id, userDetails?.id))
      .then((res) => {
        setIsLoading(false);
        setTradingHistory(res.data.trades);
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
  useEffect(() => {
    getTradingHistory();
  }, []);
  return (
    <div className="dashboard_main_body">
      <div className="dashboard_container dashboard_main_body_container">
        <div className="dashboard_main_sec">
          <div className="dashboard_heading">
            <div className="back_button">
              <button onClick={() => router(-1)}>
                {" "}
                <IoMdArrowBack /> <span>Back</span>
              </button>
            </div>
          </div>

          <div className="dashboard_tabs_sec">
            <div className="strategies_sec">
              <div className="head">
                <h3>{stratigyDetails?.description}</h3>
              </div>
              <Tabs>
                <div className="strategi_menu">
                  <div className="left">
                    <TabList>
                      <Tab>Strategy Analysis</Tab>
                      <Tab>Trade History</Tab>
                      {/* <Tab>Capital Allocation & All</Tab> */}
                      <Tab>All The Pair Running</Tab>
                    </TabList>
                  </div>
                  {/* <div className="right">
                    <div className="add_button">
                      <button type='button' onClick={createHandler} >
                        <FaPlus />
                        Add Capital
                      </button>
                    </div>
                  </div> */}
                </div>
                <TabPanel>
                  <div className="short_text">
                    <p>
                      Comprehensive strategy analysis and performance metrics
                    </p>
                  </div>
                  <div className="dashboard_widget">
                    <div className="dashboard_widget_item">
                      <div className="dashboard_widget_item_box">
                        <div className="dashboard_widget_item_box_left">
                          <span>Performance</span>
                          <h3 className="green">+12.05%</h3>
                          <p>This Month</p>
                        </div>
                        <div className="dashboard_widget_item_box_right">
                          <img src={SAnalysis1} alt="" />
                        </div>
                      </div>
                    </div>
                    <div className="dashboard_widget_item">
                      <div className="dashboard_widget_item_box">
                        <div className="dashboard_widget_item_box_left">
                          <span>Total Trades</span>
                          <h3 className="green">
                            {stratigyDetails?.total_trades}
                          </h3>
                          <p>Last 30 Days</p>
                        </div>
                        <div className="dashboard_widget_item_box_right">
                          <img src={SAnalysis2} alt="" />
                        </div>
                      </div>
                    </div>
                    <div className="dashboard_widget_item">
                      <div className="dashboard_widget_item_box">
                        <div className="dashboard_widget_item_box_left">
                          <span>Win Rate</span>
                          <h3>{stratigyDetails?.win_rate} %</h3>
                          <div className="progress_bar">
                            <div
                              className="bar"
                              style={{ width: `${stratigyDetails?.win_rate}%` }}
                            ></div>
                          </div>
                        </div>
                        <div className="dashboard_widget_item_box_right">
                          <img src={SAnalysis3} alt="" />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="strategy_analysis_wrap">
                    <div className="strategy_analysis_item_box">
                      <div className="strategy_analysis_item">
                        <div className="top">
                          <div className="left">
                            <h4>Strategy Configuration</h4>
                          </div>
                        </div>
                        <div className="bottom">
                          <ul>
                            <li>
                              <h5>Trending</h5>
                              <p>Market Condition</p>
                            </li>
                            <li>
                              <h5>H1</h5>
                              <p>Timeframe</p>
                            </li>
                            <li>
                              <h5>
                                <Chip label="Medium" />
                              </h5>
                              <p>Risk Level</p>
                            </li>
                            <li>
                              <h5>25%</h5>
                              <p>Capital Allocation</p>
                            </li>
                            <li>
                              <h5>2 min ago</h5>
                              <p>Last Signal</p>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                    <div className="strategy_analysis_item_box">
                      <div className="strategy_analysis_item">
                        <div className="top">
                          <div className="left">
                            <h4>Recent Performance</h4>
                          </div>
                        </div>
                        <div className="bottom">
                          <ul>
                            <li>
                              <h5 className="green">+0.85%</h5>
                              <p>Today</p>
                            </li>
                            <li>
                              <h5 className="green">+3.2%</h5>
                              <p>This Week</p>
                            </li>
                            <li>
                              <h5 className="green">+12.5%</h5>
                              <p>This Month</p>
                            </li>
                            <li>
                              <h5 className="green">+31.3%</h5>
                              <p>All Time</p>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabPanel>
                <TabPanel>
                  <div className="tabs_inside_boxs">
                    <div className="head">
                      <div className="left">
                        <h4>Trade History</h4>
                        <p>Last 10 trades executed by this strategy</p>
                      </div>
                    </div>
                    <div className="live_trades">
                      {isLoading && (
                        <div className="text-center">Loading...</div>
                      )}
                      {!isLoading && tradingHistory?.length > 0 ? (
                        tradingHistory?.map((item: any, index: number) => (
                          <div className="journal_box_wrap" key={index}>
                            <div className="live_trade_items">
                              <ul>
                                <li>
                                  <h5>{item?.symbol}</h5>
                                  <p>
                                    at{" "}
                                    {moment(item?.entry_time).format("hh:mm A")}
                                  </p>
                                </li>
                                <li>
                                  <h6>{item?.entry_price}</h6>
                                  <p>Entry</p>
                                </li>
                                <li>
                                  <h6>{item?.exit_price}</h6>
                                  <p>Exit</p>
                                </li>
                                <li>
                                  <div className="price_button">
                                    <h3>$ {item?.profit_loss}</h3>
                                    <Link
                                      to="/"
                                      className={
                                        item?.action === "SELL"
                                          ? "buy sell"
                                          : "buy"
                                      }
                                    >
                                      {item?.action}
                                    </Link>
                                  </div>
                                </li>
                              </ul>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center">No Data Found</div>
                      )}

                      {/* <div className="live_trade_items">
                        <ul>
                          <li>
                            <h5>EURUSD</h5>
                            <p>at 10:30 AM</p>
                          </li>
                          <li>
                            <h6>1.085</h6>
                            <p>Entry</p>
                          </li>
                          <li>
                            <h6>1.0875</h6>
                            <p>Exit</p>
                          </li>
                          <li>
                            <div className="price_button">
                              <h3>+$180.00</h3>
                              <Link to="/" className='buy'>Buy</Link>
                            </div>
                          </li>
                        </ul>
                      </div>
                      <div className="live_trade_items">
                        <ul>
                          <li>
                            <h5>EURUSD</h5>
                            <p>at 10:30 AM</p>
                          </li>
                          <li>
                            <h6>1.085</h6>
                            <p>Entry</p>
                          </li>
                          <li>
                            <h6>1.0875</h6>
                            <p>Exit</p>
                          </li>
                          <li>
                            <div className="price_button">
                              <h3>-$250.00</h3>
                              <Link to="/" className='buy sell'>Sell</Link>
                            </div>
                          </li>
                        </ul>
                      </div>
                      <div className="live_trade_items">
                        <ul>
                          <li>
                            <h5>EURUSD</h5>
                            <p>at 10:30 AM</p>
                          </li>
                          <li>
                            <h6>1.085</h6>
                            <p>Entry</p>
                          </li>
                          <li>
                            <h6>1.0875</h6>
                            <p>Exit</p>
                          </li>
                          <li>
                            <div className="price_button">
                              <h3>+$150.00</h3>
                              <Link to="/" className='buy'>Buy</Link>
                            </div>
                          </li>
                        </ul>
                      </div> */}
                    </div>
                  </div>
                </TabPanel>
                {/* <TabPanel>
                  <div className="tabs_inside_boxs">
                    <div className="head">
                      <div className="left">
                        <h4>Capital Allocation(All)</h4>
                        <p>Capital Distribution & Performance Pactrice</p>
                      </div>
                    </div>
                    <div className="capital_box_wrap">
                      <div className="left">
                        <img src={Graph} alt='' />
                      </div>
                      <div className="right">
                        <div className="head">
                          <h3>Strategy Allocation Requirment</h3>
                        </div>
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
                                  <h5>25%($62,500)</h5>
                                  <p>Capital</p>
                                </li>
                                <li>
                                  <h5>+$7812.50</h5>
                                  <p>Profit</p>
                                </li>
                                <li className='green'>
                                  <h5>+12.5%</h5>
                                  <p>P&L %</p>
                                </li>
                                <li>
                                  <h5>-3.2%</h5>
                                  <p>Max DD:</p>
                                </li>
                                <li>
                                  <h5>$1050</h5>
                                  <p>Max DD $</p>
                                </li>
                              </ul>
                            </div>
                          </div>
                          <div className="dashboard_perfomance_itmes">
                            <div className="top">
                              <div className="left">
                                <h4>Trend Following Pro</h4>
                              </div>
                            </div>
                            <div className="bottom">
                              <ul>
                                <li>
                                  <h5>25%($62,500)</h5>
                                  <p>Capital</p>
                                </li>
                                <li>
                                  <h5>+$7812.50</h5>
                                  <p>Profit</p>
                                </li>
                                <li className='green'>
                                  <h5>+12.5%</h5>
                                  <p>P&L %</p>
                                </li>
                                <li>
                                  <h5>-3.2%</h5>
                                  <p>Max DD:</p>
                                </li>
                                <li>
                                  <h5>$1050</h5>
                                  <p>Max DD $</p>
                                </li>
                              </ul>
                            </div>
                          </div>
                          <div className="dashboard_perfomance_itmes">
                            <div className="top">
                              <div className="left">
                                <h4>Trend Following Pro</h4>
                              </div>
                            </div>
                            <div className="bottom">
                              <ul>
                                <li>
                                  <h5>25%($62,500)</h5>
                                  <p>Capital</p>
                                </li>
                                <li>
                                  <h5>+$7812.50</h5>
                                  <p>Profit</p>
                                </li>
                                <li className='green'>
                                  <h5>+12.5%</h5>
                                  <p>P&L %</p>
                                </li>
                                <li>
                                  <h5>-3.2%</h5>
                                  <p>Max DD:</p>
                                </li>
                                <li>
                                  <h5>$1050</h5>
                                  <p>Max DD $</p>
                                </li>
                              </ul>
                            </div>
                          </div>
                          <div className="dashboard_perfomance_itmes">
                            <div className="top">
                              <div className="left">
                                <h4>Trend Following Pro</h4>
                              </div>
                            </div>
                            <div className="bottom">
                              <ul>
                                <li>
                                  <h5>25%($62,500)</h5>
                                  <p>Capital</p>
                                </li>
                                <li>
                                  <h5>+$7812.50</h5>
                                  <p>Profit</p>
                                </li>
                                <li className='red'>
                                  <h5>+12.5%</h5>
                                  <p>P&L %</p>
                                </li>
                                <li>
                                  <h5>-3.2%</h5>
                                  <p>Max DD:</p>
                                </li>
                                <li>
                                  <h5>$1050</h5>
                                  <p>Max DD $</p>
                                </li>
                              </ul>
                            </div>
                          </div>
                          <div className="dashboard_perfomance_itmes">
                            <div className="top">
                              <div className="left">
                                <h4>Trend Following Pro</h4>
                              </div>
                            </div>
                            <div className="bottom">
                              <ul>
                                <li>
                                  <h5>25%($62,500)</h5>
                                  <p>Capital</p>
                                </li>
                                <li>
                                  <h5>+$7812.50</h5>
                                  <p>Profit</p>
                                </li>
                                <li className='green'>
                                  <h5>+12.5%</h5>
                                  <p>P&L %</p>
                                </li>
                                <li>
                                  <h5>-3.2%</h5>
                                  <p>Max DD:</p>
                                </li>
                                <li>
                                  <h5>$1050</h5>
                                  <p>Max DD $</p>
                                </li>
                              </ul>
                            </div>
                          </div>
                          <div className="dashboard_perfomance_itmes">
                            <div className="top">
                              <div className="left">
                                <h4>Trend Following Pro</h4>
                              </div>
                            </div>
                            <div className="bottom">
                              <ul>
                                <li>
                                  <h5>25%($62,500)</h5>
                                  <p>Capital</p>
                                </li>
                                <li>
                                  <h5>+$7812.50</h5>
                                  <p>Profit</p>
                                </li>
                                <li className='green'>
                                  <h5>+12.5%</h5>
                                  <p>P&L %</p>
                                </li>
                                <li>
                                  <h5>-3.2%</h5>
                                  <p>Max DD:</p>
                                </li>
                                <li>
                                  <h5>$1050</h5>
                                  <p>Max DD $</p>
                                </li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabPanel> */}
                <TabPanel>
                  <div className="tabs_inside_boxs">
                    <div className="live_trades">
                      <div className="journal_box_wrap show">
                        <div className="live_trade_items">
                          <div className="top_journal">
                            <div className="left"></div>
                            <div className="right">
                              <h6>Update</h6>
                              <button type="button">
                                <img src={ArrowButton} alt="" />
                              </button>
                            </div>
                          </div>
                          <ul>
                            <li>
                              <h5>EURUSD</h5>
                              <p>at 10:30 AM</p>
                            </li>
                            <li>
                              <h6>1.085</h6>
                              <p>Entry</p>
                            </li>
                            <li>
                              <h6>1.0875</h6>
                              <p>Exit</p>
                            </li>
                            <li>
                              <div className="price_button">
                                <h3>+$180.00</h3>
                                <Link to="/" className="buy">
                                  Buy
                                </Link>
                              </div>
                            </li>
                          </ul>
                        </div>
                        <div className="journal_content_box">
                          <div className="list">
                            <p>Open Date</p>
                            <span>Oct 13, 2025 at 4:27 PM</span>
                          </div>
                          <div className="list">
                            <p>Close Date</p>
                            <span>Oct 13, 2025 at 6:42 PM</span>
                          </div>

                          <div className="list">
                            <p>Net Profit</p>
                            <span>$0.00</span>
                          </div>
                          <div className="list">
                            <p>Duration</p>
                            <span>2 hr 15 min 12 sec</span>
                          </div>
                          <div className="list">
                            <p>Gain</p>
                            <span>-0.02%</span>
                          </div>
                          <div className="list">
                            <p>Commissions</p>
                            <span>$0.00</span>
                          </div>
                          <div className="list">
                            <p>Swap</p>
                            <span>$0.00</span>
                          </div>

                          <div className="list">
                            <p>Comments</p>
                            <span>Test trade sougata 13-10-25 2</span>
                          </div>
                        </div>
                      </div>
                      <div className="journal_box_wrap">
                        <div className="live_trade_items">
                          <div className="top_journal">
                            <div className="left"></div>
                            <div className="right">
                              <h6>Update</h6>
                              <button type="button">
                                <img src={ArrowButton} alt="" />
                              </button>
                            </div>
                          </div>
                          <ul>
                            <li>
                              <h5>EURUSD</h5>
                              <p>at 10:30 AM</p>
                            </li>
                            <li>
                              <h6>1.085</h6>
                              <p>Entry</p>
                            </li>
                            <li>
                              <h6>1.0875</h6>
                              <p>Exit</p>
                            </li>
                            <li>
                              <div className="price_button">
                                <h3>+$180.00</h3>
                                <Link to="/" className="buy">
                                  Buy
                                </Link>
                              </div>
                            </li>
                          </ul>
                        </div>
                        <div className="journal_content_box">
                          <div className="list">
                            <p>Open Date</p>
                            <span>Oct 13, 2025 at 4:27 PM</span>
                          </div>
                          <div className="list">
                            <p>Close Date</p>
                            <span>Oct 13, 2025 at 6:42 PM</span>
                          </div>

                          <div className="list">
                            <p>Net Profit</p>
                            <span>$0.00</span>
                          </div>
                          <div className="list">
                            <p>Duration</p>
                            <span>2 hr 15 min 12 sec</span>
                          </div>
                          <div className="list">
                            <p>Gain</p>
                            <span>-0.02%</span>
                          </div>
                          <div className="list">
                            <p>Commissions</p>
                            <span>$0.00</span>
                          </div>
                          <div className="list">
                            <p>Swap</p>
                            <span>$0.00</span>
                          </div>

                          <div className="list">
                            <p>Comments</p>
                            <span>Test trade sougata 13-10-25 2</span>
                          </div>
                        </div>
                      </div>
                      <div className="journal_box_wrap">
                        <div className="live_trade_items">
                          <div className="top_journal">
                            <div className="left"></div>
                            <div className="right">
                              <h6>Update</h6>
                              <button type="button">
                                <img src={ArrowButton} alt="" />
                              </button>
                            </div>
                          </div>
                          <ul>
                            <li>
                              <h5>EURUSD</h5>
                              <p>at 10:30 AM</p>
                            </li>
                            <li>
                              <h6>1.085</h6>
                              <p>Entry</p>
                            </li>
                            <li>
                              <h6>1.0875</h6>
                              <p>Exit</p>
                            </li>
                            <li>
                              <div className="price_button">
                                <h3>+$180.00</h3>
                                <Link to="/" className="buy">
                                  Buy
                                </Link>
                              </div>
                            </li>
                          </ul>
                        </div>
                        <div className="journal_content_box">
                          <div className="list">
                            <p>Open Date</p>
                            <span>Oct 13, 2025 at 4:27 PM</span>
                          </div>
                          <div className="list">
                            <p>Close Date</p>
                            <span>Oct 13, 2025 at 6:42 PM</span>
                          </div>

                          <div className="list">
                            <p>Net Profit</p>
                            <span>$0.00</span>
                          </div>
                          <div className="list">
                            <p>Duration</p>
                            <span>2 hr 15 min 12 sec</span>
                          </div>
                          <div className="list">
                            <p>Gain</p>
                            <span>-0.02%</span>
                          </div>
                          <div className="list">
                            <p>Commissions</p>
                            <span>$0.00</span>
                          </div>
                          <div className="list">
                            <p>Swap</p>
                            <span>$0.00</span>
                          </div>

                          <div className="list">
                            <p>Comments</p>
                            <span>Test trade sougata 13-10-25 2</span>
                          </div>
                        </div>
                      </div>
                      <div className="journal_box_wrap">
                        <div className="live_trade_items">
                          <div className="top_journal">
                            <div className="left"></div>
                            <div className="right">
                              <h6>Update</h6>
                              <button type="button">
                                <img src={ArrowButton} alt="" />
                              </button>
                            </div>
                          </div>
                          <ul>
                            <li>
                              <h5>EURUSD</h5>
                              <p>at 10:30 AM</p>
                            </li>
                            <li>
                              <h6>1.085</h6>
                              <p>Entry</p>
                            </li>
                            <li>
                              <h6>1.0875</h6>
                              <p>Exit</p>
                            </li>
                            <li>
                              <div className="price_button">
                                <h3>+$180.00</h3>
                                <Link to="/" className="buy">
                                  Buy
                                </Link>
                              </div>
                            </li>
                          </ul>
                        </div>
                        <div className="journal_content_box">
                          <div className="list">
                            <p>Open Date</p>
                            <span>Oct 13, 2025 at 4:27 PM</span>
                          </div>
                          <div className="list">
                            <p>Close Date</p>
                            <span>Oct 13, 2025 at 6:42 PM</span>
                          </div>

                          <div className="list">
                            <p>Net Profit</p>
                            <span>$0.00</span>
                          </div>
                          <div className="list">
                            <p>Duration</p>
                            <span>2 hr 15 min 12 sec</span>
                          </div>
                          <div className="list">
                            <p>Gain</p>
                            <span>-0.02%</span>
                          </div>
                          <div className="list">
                            <p>Commissions</p>
                            <span>$0.00</span>
                          </div>
                          <div className="list">
                            <p>Swap</p>
                            <span>$0.00</span>
                          </div>

                          <div className="list">
                            <p>Comments</p>
                            <span>Test trade sougata 13-10-25 2</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* <div className="strategy_analysis_wrap">
                    {stratigyDetails?.recommended_pairs?.map(
                      (item: any, index: number) => (
                        <div className="strategy_analysis_item_box" key={index}>
                          <div className="strategy_analysis_item">
                            <div className="top">
                              <div className="left">
                                <h4>{item?.pair_name}</h4>
                              </div>
                              <div className="right">
                                <div className='button'>
                                  <Link to='/'>View Details</Link>
                                </div>
                              </div>
                            </div>
                            <div className="bottom">
                              <ul>
                                <li>
                                  <h5>{item?.trades}</h5>
                                  <p>Trades</p>
                                </li>
                                <li>
                                  <h5>{item?.win_rate}%</h5>
                                  <p>Win Rate</p>
                                </li>
                                <li>
                                  <h5>{item?.profit}%</h5>
                                  <p>Profit</p>
                                </li>
                                <li>
                                  <h5>{item?.allocation}</h5>
                                  <p>Allocation</p>
                                </li>
                                <li>
                                  <div className="active_trade">
                                    <Link to="/">Details</Link>
                                  </div>
                                </li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      )
                    )}
                  </div> */}
                </TabPanel>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StrategiesPage;
