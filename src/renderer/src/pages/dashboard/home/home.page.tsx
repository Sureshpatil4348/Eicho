import React from 'react'
import { Link } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import { FormControlLabel } from "@mui/material";
import Switch, { SwitchProps } from '@mui/material/Switch';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { IoPauseOutline, IoSettingsOutline } from "react-icons/io5";
import Graph from "@renderer/assets/images/graph.png";

const HomePage: React.FunctionComponent = () => {

  const IOSSwitch = styled((props: SwitchProps) => (
    <Switch focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />
  ))(({ theme }) => ({
    width: 50,
    height: 24,
    padding: 0,
    '& .MuiSwitch-switchBase': {
      padding: 0,
      margin: 2,
      transitionDuration: '300ms',
      '&.Mui-checked': {
        transform: 'translateX(28px)',
        color: '#fff',
        '& + .MuiSwitch-track': {
          backgroundColor: '#33CB33',
          opacity: 1,
          border: 0,
          ...theme.applyStyles('dark', {
            backgroundColor: '#33CB33',
          }),
        },
        '&.Mui-disabled + .MuiSwitch-track': {
          opacity: 0.5,
        },
      },
      '&.Mui-focusVisible .MuiSwitch-thumb': {
        color: '#33CB33',
        border: '6px solid #fff',
      },
      '&.Mui-disabled .MuiSwitch-thumb': {
        color: theme.palette.grey[100],
        ...theme.applyStyles('dark', {
          color: theme.palette.grey[600],
        }),
      },
      '&.Mui-disabled + .MuiSwitch-track': {
        opacity: 0.7,
        ...theme.applyStyles('dark', {
          opacity: 0.3,
        }),
      },
    },
    '& .MuiSwitch-thumb': {
      boxSizing: 'border-box',
      width: 18,
      height: 18,
    },
    '& .MuiSwitch-track': {
      borderRadius: 24 / 2,
      backgroundColor: '#E9E9EA',
      opacity: 1,
      transition: theme.transitions.create(['background-color'], {
        duration: 500,
      }),
      ...theme.applyStyles('dark', {
        backgroundColor: '#39393D',
      }),
    },
  }));

  return (
    <div className='dashboard_main_body'>
      <div className="dashboard_container dashboard_main_body_container">
        <div className="dashboard_main_sec">
          <div className="dashboard_heading">
            <h2>Dashboard</h2>
          </div>
          <div className="dashboard_widget">
            <div className="dashboard_widget_item">
              <div className="dashboard_widget_item_box">
                <span>Today P&L</span>
                <h3 className='green'>+$2,450.00</h3>
                <p>Balance : $11450.00</p>
              </div>
            </div>
            <div className="dashboard_widget_item">
              <div className="dashboard_widget_item_box">
                <span>Net Profit</span>
                <h3 className='green'>12%</h3>
                <p>Net Profit : $4000.00</p>
              </div>
            </div>
            <div className="dashboard_widget_item">
              <div className="dashboard_widget_item_box">
                <span>Win Rate</span>
                <h3>68.5%</h3>
                <p>Success Percentage</p>
              </div>
            </div>
            <div className="dashboard_widget_item">
              <div className="dashboard_widget_item_box">
                <span>Max Drawdown</span>
                <h3 className='red'>10.5%</h3>
                <p>Max DD : <span className='red'>-$2013.00</span></p>
              </div>
            </div>
            <div className="dashboard_widget_item">
              <div className="dashboard_widget_item_box">
                <span>Rules Broken</span>
                <h3>55</h3>
                <p>No. of Times Rules are Broken</p>
              </div>
            </div>
          </div>
          <div className="dashboard_tabs_sec">
            <Tabs>
              <TabList>
                <Tab>Overview</Tab>
                <Tab>Strategies</Tab>
                <Tab>Capital Allocation</Tab>
                <Tab>Trade History</Tab>
                <Tab>Rules</Tab>
                <Tab>Market</Tab>
                <Tab>Analysis</Tab>
              </TabList>

              <TabPanel>
                <div className="tabs_inside_boxs">
                  <div className="head">
                    <div className="left">
                      <h4>Account Growth</h4>
                      <p>Percentage growth from initial deposit</p>
                    </div>
                    <div className="right">
                      <button>1W</button>
                      <button className='active'>1M</button>
                      <button>3M</button>
                      <button>1Y</button>
                    </div>
                  </div>
                  <div className='graph'>
                    <img src={Graph} alt='' />
                  </div>
                </div>
                <div className="tabs_inside_boxs">
                  <div className="head">
                    <div className="left">
                      <h4>Strategy Performance</h4>
                      <p>Performance metrics and comparison of different strategies</p>
                    </div>
                  </div>
                  <div className="dashboard_perfomance">
                    <div className="dashboard_perfomance_itmes">
                      <div className="top">
                        <div className="left">
                          <h4>Trend Following Pro</h4>
                        </div>
                        <div className="right">
                          <div className="round"></div>
                        </div>
                      </div>
                      <div className="bottom">
                        <ul>
                          <li>
                            <h5>24</h5>
                            <p>Trades:</p>
                          </li>
                          <li>
                            <h5>68%</h5>
                            <p>Trades:</p>
                          </li>
                          <li>
                            <h5>25%</h5>
                            <p>Allocation:</p>
                          </li>
                          <li className='green'>
                            <h5>$2847.50</h5>
                            <p>+3.2%</p>
                          </li>
                          <li className='pairs'>
                            <p>Pairs:</p>
                            <span>EURUSD</span>
                            <span>GBPUSD</span>
                            <span>XAUUSD</span>
                          </li>
                        </ul>
                        <div className="progress_bar">
                          <div className="bar" style={{ width: "60%" }}>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="dashboard_perfomance_itmes">
                      <div className="top">
                        <div className="left">
                          <h4>Trend Following Pro</h4>
                        </div>
                        <div className="right">
                          <div className="round yellow"></div>
                        </div>
                      </div>
                      <div className="bottom">
                        <ul>
                          <li>
                            <h5>24</h5>
                            <p>Trades:</p>
                          </li>
                          <li>
                            <h5>68%</h5>
                            <p>Trades:</p>
                          </li>
                          <li>
                            <h5>25%</h5>
                            <p>Allocation:</p>
                          </li>
                          <li className='green'>
                            <h5>$2847.50</h5>
                            <p>+3.2%</p>
                          </li>
                          <li className='pairs'>
                            <p>Pairs:</p>
                            <span>EURUSD</span>
                            <span>GBPUSD</span>
                            <span>XAUUSD</span>
                          </li>
                        </ul>
                        <div className="progress_bar">
                          <div className="bar" style={{ width: "60%" }}>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="dashboard_perfomance_itmes">
                      <div className="top">
                        <div className="left">
                          <h4>Trend Following Pro</h4>
                        </div>
                        <div className="right">
                          <div className="round yellow"></div>
                        </div>
                      </div>
                      <div className="bottom">
                        <ul>
                          <li>
                            <h5>24</h5>
                            <p>Trades:</p>
                          </li>
                          <li>
                            <h5>68%</h5>
                            <p>Trades:</p>
                          </li>
                          <li>
                            <h5>25%</h5>
                            <p>Allocation:</p>
                          </li>
                          <li className='green'>
                            <h5>$2847.50</h5>
                            <p>+3.2%</p>
                          </li>
                          <li className='pairs'>
                            <p>Pairs:</p>
                            <span>EURUSD</span>
                            <span>GBPUSD</span>
                            <span>XAUUSD</span>
                          </li>
                        </ul>
                        <div className="progress_bar">
                          <div className="bar" style={{ width: "60%" }}>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="dashboard_perfomance_itmes">
                      <div className="top">
                        <div className="left">
                          <h4>Trend Following Pro</h4>
                        </div>
                        <div className="right">
                          <div className="round"></div>
                        </div>
                      </div>
                      <div className="bottom">
                        <ul>
                          <li>
                            <h5>24</h5>
                            <p>Trades:</p>
                          </li>
                          <li>
                            <h5>68%</h5>
                            <p>Trades:</p>
                          </li>
                          <li>
                            <h5>25%</h5>
                            <p>Allocation:</p>
                          </li>
                          <li className='green'>
                            <h5>$2847.50</h5>
                            <p>+3.2%</p>
                          </li>
                          <li className='pairs'>
                            <p>Pairs:</p>
                            <span>EURUSD</span>
                            <span>GBPUSD</span>
                            <span>XAUUSD</span>
                          </li>
                        </ul>
                        <div className="progress_bar">
                          <div className="bar" style={{ width: "60%" }}>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="tabs_inside_boxs">
                  <div className="head">
                    <div className="left">
                      <h4>Live Trades</h4>
                      <p>Performance metrics and comparison of different strategies</p>
                    </div>
                  </div>
                  <div className="live_trades">
                    <div className="live_trade_items">
                      <ul>
                        <li>
                          <h5>EURUSD</h5>
                          <p>Trend Following Pro</p>
                        </li>
                        <li>
                          <h6>Size: 0.5</h6>
                          <p>Entry: 1.0835</p>
                        </li>
                        <li>
                          <h6>1.0847</h6>
                          <p>14:23:45</p>
                        </li>
                        <li>
                          <div className="price_button">
                            <h3>+$60.00</h3>
                            <Link to="/" className='buy'>Buy</Link>
                          </div>
                        </li>
                      </ul>
                    </div>
                    <div className="live_trade_items">
                      <ul>
                        <li>
                          <h5>EURUSD</h5>
                          <p>Trend Following Pro</p>
                        </li>
                        <li>
                          <h6>Size: 0.5</h6>
                          <p>Entry: 1.0835</p>
                        </li>
                        <li>
                          <h6>1.0847</h6>
                          <p>14:23:45</p>
                        </li>
                        <li>
                          <div className="price_button">
                            <h3>+$60.00</h3>
                            <Link to="/" className='buy'>Buy</Link>
                          </div>
                        </li>
                      </ul>
                    </div>
                    <div className="live_trade_items">
                      <ul>
                        <li>
                          <h5>EURUSD</h5>
                          <p>Trend Following Pro</p>
                        </li>
                        <li>
                          <h6>Size: 0.5</h6>
                          <p>Entry: 1.0835</p>
                        </li>
                        <li>
                          <h6>1.0847</h6>
                          <p>14:23:45</p>
                        </li>
                        <li>
                          <div className="price_button">
                            <h3>+$60.00</h3>
                            <Link to="/" className='buy sell'>Buy</Link>
                          </div>
                        </li>
                      </ul>
                    </div>
                    <div className="live_trade_items">
                      <ul>
                        <li>
                          <h5>EURUSD</h5>
                          <p>Trend Following Pro</p>
                        </li>
                        <li>
                          <h6>Size: 0.5</h6>
                          <p>Entry: 1.0835</p>
                        </li>
                        <li>
                          <h6>1.0847</h6>
                          <p>14:23:45</p>
                        </li>
                        <li>
                          <div className="price_button">
                            <h3>+$60.00</h3>
                            <Link to="/" className='buy'>Buy</Link>
                          </div>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </TabPanel>
              <TabPanel>
                <div className="strategies_sec">
                  <div className="head">
                    <h3>Strategy Management</h3>
                    <p>Monitor and control your trading strategies</p>
                  </div>
                  <div className="strategi_menu">
                    <ul>
                      <li className='active'>
                        <Link to="">Active Strategies</Link>
                      </li>
                      <li>
                        <Link to="">Configuration</Link>
                      </li>
                      <li>
                        <Link to="">Performance Analysis</Link>
                      </li>
                    </ul>
                  </div>
                  <div className="strategies_managment">
                    <div className="strategies_managment_item">
                      <div className="up">
                        <div className="top">
                          <div className="left">
                            <div className="one">
                              <div className="round"></div>
                              <h5>Trend Following Pro</h5>
                              <span className='connected'>Connected</span>
                            </div>
                            <div className="short_content">
                              <p>Market Condition: trending | Timeframe: H1 | Risk: medium</p>
                            </div>
                          </div>
                          <div className="right">
                            <div className='switch_button'>
                              <FormControlLabel
                                control={<IOSSwitch sx={{ m: 1 }} defaultChecked />}
                                label=""
                              />
                            </div>
                            <div className="settings">
                              <Link to="/"><IoSettingsOutline /></Link>
                            </div>
                          </div>
                        </div>
                        <div className="middle">
                          <ul>
                            <li>
                              <span>Performance</span>
                              <h3>+12.5%</h3>
                            </li>
                            <li>
                              <span>Trades</span>
                              <h3>87</h3>
                            </li>
                            <li>
                              <span>Win Rate</span>
                              <h3>68%</h3>
                              <div className="progress_bar">
                                <div className="bar" style={{ width: "68%" }}>
                                </div>
                              </div>
                            </li>
                            <li>
                              <span>Allocation</span>
                              <h3>25%</h3>
                              <p>Last signal: 2 min ago</p>
                            </li>
                          </ul>
                        </div>
                      </div>
                      <div className="bottom">
                        <div className="left">
                          <h6>Trading Pairs</h6>
                          <span>EURUSD</span>
                          <span>GBPUSD</span>
                        </div>
                        <div className="right">
                          <div className="button">
                            <Link to="/">View Details</Link>
                          </div>
                          <div className="pause">
                            <IoPauseOutline />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="strategies_managment_item">
                      <div className="up">
                        <div className="top">
                          <div className="left">
                            <div className="one">
                              <div className="round"></div>
                              <h5>Trend Following Pro</h5>
                              <span className='connected'>Connected</span>
                            </div>
                            <div className="short_content">
                              <p>Market Condition: trending | Timeframe: H1 | Risk: medium</p>
                            </div>
                          </div>
                          <div className="right">
                            <div className='switch_button'>
                              <FormControlLabel
                                control={<IOSSwitch sx={{ m: 1 }} defaultChecked />}
                                label=""
                              />
                            </div>
                            <div className="settings">
                              <Link to="/"><IoSettingsOutline /></Link>
                            </div>
                          </div>
                        </div>
                        <div className="middle">
                          <ul>
                            <li>
                              <span>Performance</span>
                              <h3>+12.5%</h3>
                            </li>
                            <li>
                              <span>Trades</span>
                              <h3>87</h3>
                            </li>
                            <li>
                              <span>Win Rate</span>
                              <h3>68%</h3>
                              <div className="progress_bar">
                                <div className="bar" style={{ width: "68%" }}>
                                </div>
                              </div>
                            </li>
                            <li>
                              <span>Allocation</span>
                              <h3>25%</h3>
                              <p>Last signal: 2 min ago</p>
                            </li>
                          </ul>
                        </div>
                      </div>
                      <div className="bottom">
                        <div className="left">
                          <h6>Trading Pairs</h6>
                          <span>EURUSD</span>
                          <span>GBPUSD</span>
                        </div>
                        <div className="right">
                          <div className="button">
                            <Link to="/">View Details</Link>
                          </div>
                          <div className="pause">
                            <IoPauseOutline />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </TabPanel>
              <TabPanel>
                <h2>Capital Allocation</h2>
              </TabPanel>
              <TabPanel>
                <h2>Trade History</h2>
              </TabPanel>
              <TabPanel>
                <h2>Rules</h2>
              </TabPanel>
              <TabPanel>
                <h2>Market</h2>
              </TabPanel>
              <TabPanel>
                <h2>Analysis</h2>
              </TabPanel>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HomePage
