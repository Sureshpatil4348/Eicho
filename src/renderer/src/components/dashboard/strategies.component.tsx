import { FormControlLabel } from '@mui/material'
import React from 'react'
import { IoPauseOutline, IoSettingsOutline } from 'react-icons/io5'
import { Link } from 'react-router-dom'
import { IOSSwitch } from '../switch/switch.component'
import { Tab, TabList, TabPanel, Tabs } from 'react-tabs'
import { FaPlus } from "react-icons/fa6";
import ReactDOM from 'react-dom';
import Modal from 'react-modal';
import { AiOutlineClose } from "react-icons/ai";


const StrategiesComponent: React.FunctionComponent = () => {



  const [modalIsOpen, setIsOpen] = React.useState(false);

  function afterOpenModal() {
    // references are now sync'd and can be accessed.
    //subtitle.style.color = '#f00';
  }


  function openModal() {
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
  }

  return (
    <>
      <div className="strategies_sec">
        <div className="head">
          <h3>Strategy Management</h3>
          <p>Monitor and control your trading strategies</p>
        </div>
        <Tabs>
          <div className="strategi_menu">
            <div className="left">
              <TabList>
                <Tab>Active Strategies</Tab>
                <Tab>Configuration</Tab>
                <Tab>Performance Analysis</Tab>
              </TabList>
            </div>
            <div className="right">
              <div className="add_button">
                <button type='button' onClick={openModal} ><FaPlus /> Add Strategy</button>
              </div>
            </div>
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
                        <h3 className='green'>+12.5%</h3>
                        <span>Performance</span>
                      </li>
                      <li>
                        <h3>87</h3>
                        <span>Trades</span>
                      </li>
                      <li>
                        <h3>68%</h3>
                        <span>Win Rate</span>
                        <div className="progress_bar">
                          <div className="bar" style={{ width: "68%" }}>
                          </div>
                        </div>
                      </li>
                      <li>
                        <h3>25%</h3>
                        <span>Allocation</span>
                        <p>Last signal: 2 min ago</p>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="bottom">
                  <div className="left">
                    <h6>Trading Pairs:</h6>
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
                        <h3 className='green'>+12.5%</h3>
                        <span>Performance</span>
                      </li>
                      <li>
                        <h3>87</h3>
                        <span>Trades</span>
                      </li>
                      <li>
                        <h3>68%</h3>
                        <span>Win Rate</span>
                        <div className="progress_bar">
                          <div className="bar" style={{ width: "68%" }}>
                          </div>
                        </div>
                      </li>
                      <li>
                        <h3>25%</h3>
                        <span>Allocation</span>
                        <p>Last signal: 2 min ago</p>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="bottom">
                  <div className="left">
                    <h6>Trading Pairs:</h6>
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
                        <h3 className='green'>+12.5%</h3>
                        <span>Performance</span>
                      </li>
                      <li>
                        <h3>87</h3>
                        <span>Trades</span>
                      </li>
                      <li>
                        <h3>68%</h3>
                        <span>Win Rate</span>
                        <div className="progress_bar">
                          <div className="bar" style={{ width: "68%" }}>
                          </div>
                        </div>
                      </li>
                      <li>
                        <h3>25%</h3>
                        <span>Allocation</span>
                        <p>Last signal: 2 min ago</p>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="bottom">
                  <div className="left">
                    <h6>Trading Pairs:</h6>
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
                        <h3 className='green'>+12.5%</h3>
                        <span>Performance</span>
                      </li>
                      <li>
                        <h3>87</h3>
                        <span>Trades</span>
                      </li>
                      <li>
                        <h3>68%</h3>
                        <span>Win Rate</span>
                        <div className="progress_bar">
                          <div className="bar" style={{ width: "68%" }}>
                          </div>
                        </div>
                      </li>
                      <li>
                        <h3>25%</h3>
                        <span>Allocation</span>
                        <p>Last signal: 2 min ago</p>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="bottom">
                  <div className="left">
                    <h6>Trading Pairs:</h6>
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
                        <h3 className='green'>+12.5%</h3>
                        <span>Performance</span>
                      </li>
                      <li>
                        <h3>87</h3>
                        <span>Trades</span>
                      </li>
                      <li>
                        <h3>68%</h3>
                        <span>Win Rate</span>
                        <div className="progress_bar">
                          <div className="bar" style={{ width: "68%" }}>
                          </div>
                        </div>
                      </li>
                      <li>
                        <h3>25%</h3>
                        <span>Allocation</span>
                        <p>Last signal: 2 min ago</p>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="bottom">
                  <div className="left">
                    <h6>Trading Pairs:</h6>
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
                        <h3 className='green'>+12.5%</h3>
                        <span>Performance</span>
                      </li>
                      <li>
                        <h3>87</h3>
                        <span>Trades</span>
                      </li>
                      <li>
                        <h3>68%</h3>
                        <span>Win Rate</span>
                        <div className="progress_bar">
                          <div className="bar" style={{ width: "68%" }}>
                          </div>
                        </div>
                      </li>
                      <li>
                        <h3>25%</h3>
                        <span>Allocation</span>
                        <p>Last signal: 2 min ago</p>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="bottom">
                  <div className="left">
                    <h6>Trading Pairs:</h6>
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

      <Modal
        isOpen={modalIsOpen}
        onAfterOpen={afterOpenModal}
        onRequestClose={closeModal}
        contentLabel="Example Modal"
        className="custom_modal"
      >
        <div className='custom_modal_boxes'>
          <div className='main_boxes'>
            <div className="top">
              <h3>Create New Forex Strategy</h3>
              <p>Define your custom trading strategy to track its performance and consistency.</p>
              <button onClick={closeModal} className='close'><AiOutlineClose /></button>
            </div>
            <div className="custom_modal_form">
              <form>
                <div className="row">
                  <div className="col-md-12">
                    <h4>Basic Strategy Details</h4>
                  </div>
                  <div className="col-md-12 form-group">
                    <label>Strategy Name</label>
                    <div className="field">
                      <input type='text' className='form-control' placeholder='E.g. London Breakout' />
                    </div>
                  </div>
                  <div className="col-md-12 form-group">
                    <label>Strategy Type</label>
                    <div className="field">
                      <select className='form-control'>
                        <option>Breakout</option>
                      </select>
                    </div>
                  </div>
                  <div className="col-md-12 form-group">
                    <label>Timeframe</label>
                    <div className="field">
                      <input type='text' className='form-control' placeholder='M15' />
                    </div>
                  </div>
                  <div className="col-md-12 form-group">
                    <label>Preferred Pairs</label>
                    <div className="field">
                      <input type='text' className='form-control' placeholder='E.g. EUR/USD' />
                    </div>
                  </div>
                  <div className="col-md-12">
                    <h4>Technical Criteria</h4>
                  </div>
                  <div className="col-md-12 form-group">
                    <label>Entry Conditions</label>
                    <div className="field">
                      <input type='text' className='form-control' placeholder='' />
                    </div>
                  </div>
                  <div className="col-md-12 form-group">
                    <label>Exit Conditions</label>
                    <div className="field">
                      <input type='text' className='form-control' placeholder='' />
                    </div>
                  </div>
                  <div className="col-md-12 form-group">
                    <label>Indicators Used</label>
                    <div className="field">
                      <input type='text' className='form-control' placeholder='' />
                    </div>
                  </div>
                  <div className="col-md-12 form-group">
                    <label>Risk/Reward Ratio Target</label>
                    <div className="field">
                      <input type='text' className='form-control' placeholder='E.g. 2.0' />
                    </div>
                  </div>
                  <div className="col-md-12 form-group">
                    <label>Max Drawdown Tolerance (%)</label>
                    <div className="field">
                      <input type='text' className='form-control' placeholder='E.g. 5' />
                    </div>
                  </div>
                  <div className="col-md-12 form-group text-center">
                    <button type='button' className='save'>Save Strategy</button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </Modal>
    </>
  )
}

export default StrategiesComponent
