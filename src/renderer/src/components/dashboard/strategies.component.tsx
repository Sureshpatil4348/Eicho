import { FormControlLabel } from '@mui/material'
import React, { useEffect } from 'react'
// import { IoPauseOutline, IoSettingsOutline } from 'react-icons/io5'
import { Link } from 'react-router-dom'
import { IOSSwitch } from '../switch/switch.component'
import { Tab, TabList, TabPanel, Tabs } from 'react-tabs'
// import { FaPlus } from "react-icons/fa6";
import { openModal } from '@renderer/services/actions/modal.action'
import { useAppDispatch, useAppSelector } from '@renderer/services/hook'
import MODAL_TYPE from '@renderer/config/modal'
import { GetStrategiesAction } from '@renderer/services/actions/strategies.action'
import { LoadingComponent } from '@renderer/shared/LoadingScreen'
import { AuthState } from '@renderer/context/auth.context'
import toast from 'react-hot-toast'
import axios from '@renderer/config/axios'
import { API_URL } from '@renderer/utils/constant'


const StrategiesComponent: React.FunctionComponent = () => {
  const { userDetails } = AuthState();

  const { strategies, loading } = useAppSelector(state => state.strategies)

  const dispatch = useAppDispatch()

  // const createHandler = (): void => {
  //   openModal({ body: MODAL_TYPE.CREATE_STRATEGY, title: 'Create New Forex Strategy', description: 'Define your custom trading strategy to track its performance and consistency.' }, dispatch)
  // }

  const configHandler = (id: any): void => {
    openModal({ body: MODAL_TYPE.CONFIG_MODAL, title: 'Update Configuration', description: '', strategy_id: id, size: 'xl' }, dispatch)
  }
  useEffect(() => {
    GetStrategiesAction(userDetails?.id, dispatch)
  }, [dispatch])

  const startTrade = (id: any, strategy: any): void => {
    // let config;
    // if (stratigy_name === "gold_buy_dip") {
    //   config = {
    //     "lot_size": 0.03,
    //     "percentage_threshold": 0.0001,
    //     "zscore_threshold_buy": -0.001,
    //     "zscore_threshold_sell": 0.001,
    //     "take_profit_percent": 0.1,
    //     "stop_loss_percent": 0.0,
    //     "max_grid_trades": 1,
    //     "grid_spacing_percent": 0.001,
    //     "lookback_period": 2,
    //     "ma_period": 2,
    //     "max_drawdown_percent": 50.0,
    //     "timeframe": "1M",
    //     "symbol": "XAUUSD",
    //     "take_profit": 10.0,
    //     "use_take_profit_percent": true,
    //     "use_grid_trading": true,
    //     "use_grid_percent": true,
    //     "zscore_wait_candles": 1
    //   }
    // } else if (stratigy_name === "rsi_pairs") {
    //   config = {
    //     "base_lot_size": 0.3,
    //     "symbol1": "EURUSD",
    //     "symbol2": "GBPUSD",
    //     "rsi_period": 7,
    //     "rsi_overbought": 62,
    //     "rsi_oversold": 35,
    //     "mode": "negative",
    //     "profit_target_usd": 25.0,
    //     "loss_limit_usd": 15.0,
    //     "max_time_minutes": 60,
    //     "hedge_atr_multiplier": 1.5,
    //     "atr_period": 7,
    //     "correlation_period": 20,
    //     "safety_min_lot": 0.01,
    //     "safety_max_lot": 1.0,
    //     "timeframe": "1M"
    //   }
    // } else {

    // }
    let payload = {
      "strategy_id": id,
      "config_id": strategy?.recommended_pairs?.map((pair: any) => pair?.config_id) || [],
    }
    axios.post(API_URL.TRADE_START, payload).then((res) => {
      if (res) {
        toast.success('Treading Started Successfully')
      }
    }).catch((err) => {
      if (err.response) {
        toast.error(err.response.data.message)
      } else {
        toast.error(err.message)
      }
    })
  }
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
              {/* <Tab>Configuration</Tab>
              <Tab>Performance Analysis</Tab> */}
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
              loading ? <LoadingComponent /> : strategies?.map((strategy: any) => (
                <div key={strategy.strategy_id} className="strategies_managment_item">
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
                          <FormControlLabel
                            value={strategy?.is_available}
                            onChange={(e: any) => {
                              if (e.target.checked) {
                                startTrade(strategy?.strategy_id, strategy)
                              }
                            }} control={<IOSSwitch sx={{ m: 1 }} defaultChecked />} label="" />
                        </div>
                        <div className="settings">
                          {/* <Link to="/"><IoSettingsOutline /></Link> */}
                        </div>
                      </div>
                    </div>
                    <div className="middle">
                      <ul>
                        {/* <li>
                          <h3 className='green'>+00.0%</h3>
                          <span>Performance</span>
                        </li> */}
                        <li>
                          <h3>{strategy.total_trades}</h3>
                          <span>Trades</span>
                        </li>
                        <li>
                          <h3>{strategy?.win_rate} %</h3>
                          <span>Win Rate</span>
                          <div className="progress_bar">
                            <div className="bar" style={{ width: strategy?.win_rate }}>
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
                        <button onClick={() => configHandler(strategy?.strategy_id)} >Configaration</button>
                      </div>
                      <div className="button">
                        <Link to={`/dashboard/strategies?id=${strategy?.strategy_id}`}>View Details</Link>
                      </div>
                      {/* <div className="pause">
                        <IoPauseOutline />
                      </div> */}
                    </div>
                  </div>
                </div>
              ))
            }
          </div>
        </TabPanel>
      </Tabs>
    </div>
  )
}

export default StrategiesComponent
