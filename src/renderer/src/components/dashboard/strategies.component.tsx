import { FormControlLabel } from '@mui/material'
import React, { useEffect } from 'react'
import { IoPauseOutline, IoSettingsOutline } from 'react-icons/io5'
import { Link } from 'react-router-dom'
import { IOSSwitch } from '../switch/switch.component'
import { Tab, TabList, TabPanel, Tabs } from 'react-tabs'
// import { FaPlus } from "react-icons/fa6";
// import { openModal } from '@renderer/services/actions/modal.action'
import { useAppDispatch, useAppSelector } from '@renderer/services/hook'
// import MODAL_TYPE from '@renderer/config/modal'
import { GetStrategiesAction } from '@renderer/services/actions/strategies.action'
import { LoadingComponent } from '@renderer/shared/LoadingScreen'
import { AuthState } from '@renderer/context/auth.context'


const StrategiesComponent: React.FunctionComponent = () => {
  const { userDetails } = AuthState();

  const { strategies, loading } = useAppSelector(state => state.strategies)

  const dispatch = useAppDispatch()

  // const createHandler = (): void => {
  //   openModal({ body: MODAL_TYPE.CREATE_STRATEGY, title: 'Create New Forex Strategy', description: 'Define your custom trading strategy to track its performance and consistency.' }, dispatch)
  // }

  useEffect(() => {
    GetStrategiesAction(userDetails?.id, dispatch)
  }, [dispatch])

  return (
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
              {/* <button type='button' onClick={() => createHandler()}>
                <FaPlus />
                Add Strategy
              </button> */}
            </div>
          </div>
        </div>
        <TabPanel>
          <div className="strategies_managment">
            {
              loading ? <LoadingComponent /> : strategies?.map((strategy) => (
                <div key={strategy.id} className="strategies_managment_item">
                  <div className="up">
                    <div className="top">
                      <div className="left">
                        <div className="one">
                          <div className="round"></div>
                          <h5>{strategy.name}</h5>
                          <span className='connected'>Connected</span>
                        </div>
                        <div className="short_content">
                          {/* <p>Market Condition: {strategy.type} | Timeframe: {strategy.timeframe} | Risk: {strategy.risk_reward_ratio_target}</p> */}
                          <p>{strategy?.description}</p>
                          <p>TimeFrame: {strategy.recommended_timeframes?.map((timeframe) => timeframe).join(', ')}</p>
                          <p>Type: {strategy.type}</p>
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
                          <h3 className='green'>+00.0%</h3>
                          <span>Performance</span>
                        </li>
                        <li>
                          <h3>{strategy.total_trades}</h3>
                          <span>Trades</span>
                        </li>
                        <li>
                          <h3>0 %</h3>
                          <span>Win Rate</span>
                          <div className="progress_bar">
                            <div className="bar" style={{ width: "68%" }}>
                            </div>
                          </div>
                        </li>
                        <li>
                          <h3>{strategy?.capital_allocation?.allocation_percentage} %</h3>
                          <span>Allocation</span>
                          <p>Last signal: 2 min ago</p>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div className="bottom">
                    <div className="left">
                      <h6>Trading Pairs:</h6>
                      <span>{strategy.recommended_pairs?.map((pair: any) => pair?.pair_name).join(', ')}</span>
                    </div>
                    <div className="right">
                      <div className="button">
                        <Link to={`/dashboard/strategies?id=${strategy?.strategy_id}`}>View Details</Link>
                      </div>
                      <div className="pause">
                        <IoPauseOutline />
                      </div>
                    </div>
                  </div>
                </div>
              ))
            }
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
