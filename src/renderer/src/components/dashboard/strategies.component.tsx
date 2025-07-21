import { FormControlLabel } from '@mui/material'
import React from 'react'
import { IoPauseOutline, IoSettingsOutline } from 'react-icons/io5'
import { Link } from 'react-router-dom'
import { IOSSwitch } from '../switch/switch.component'
import { Tab, TabList, TabPanel, Tabs } from 'react-tabs'

const StrategiesComponent: React.FunctionComponent = () => {
  return (
    <div className="strategies_sec">
      <div className="head">
        <h3>Strategy Management</h3>
        <p>Monitor and control your trading strategies</p>
      </div>
      <Tabs>
        <div className="strategi_menu">
          <TabList>
            <Tab>Active Strategies</Tab>
            <Tab>Configuration</Tab>
            <Tab>Performance Analysis</Tab>
          </TabList>
        </div>
        <TabPanel>
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
                      <FormControlLabel control={<IOSSwitch sx={{ m: 1 }} defaultChecked />} label="" />
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
                      <Link to="/">
                        <IoSettingsOutline />
                      </Link>
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
        </TabPanel>
        <TabPanel>

        </TabPanel>
        <TabPanel>

        </TabPanel>
      </Tabs>
    </div>
  )
}

export default StrategiesComponent
