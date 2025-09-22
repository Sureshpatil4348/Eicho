import React, { useEffect } from "react";
import { Tab, TabList, TabPanel, Tabs } from "react-tabs";
import { MdEdit } from "react-icons/md";
import { useAppSelector } from "@renderer/services/hook";
import { LoadingComponent } from "@renderer/shared/LoadingScreen";
import { AuthState } from "@renderer/context/auth.context";

const CapitalAllocationComponent: React.FunctionComponent = () => {
  const { strategies, loading } = useAppSelector((state) => state.strategies);
  const [selectedStratigy, setSelectedStratigy]: any = React.useState(null);
  const { userDetails } = AuthState();

  useEffect(() => {
    if (strategies && strategies.length > 0) {
      setSelectedStratigy(strategies[0])
    }
  }, [strategies])
  return (
    <>
      <div className="strategies_sec capital_allocation_sec">
        <div className="head">
          <h3>Capital Allocation</h3>
          <p>Monitor and control your trading strategies</p>
        </div>
        <Tabs>
          <div className="strategi_menu">
            <div className="left">
              <TabList>
                <Tab>$ {userDetails?.mt5_status?.account_balance} Balance</Tab>
                <Tab>Balance + Com</Tab>
                <Tab>Fixed Amount</Tab>
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
            <div className="capital_box_wrap">
              <div className="strategies_managment">
                {loading ? (
                  <LoadingComponent />
                ) : (
                  strategies?.map((strategy) => (
                    <div
                      key={strategy?.strategy_id}
                      className={`strategies_managment_item ${selectedStratigy?.strategy_id == strategy?.strategy_id ? "active" : ""}`}
                      onClick={() => setSelectedStratigy(strategy)}
                    >
                      <div className="up">
                        <div className="top">
                          <div className="left">
                            <div className="one">
                              <div className="round"></div>
                              <h5>{strategy.name}</h5>
                              <span className="connected">Connected</span>
                              <div className="edit_icon">
                                <button type="button">
                                  <MdEdit />
                                </button>
                              </div>
                            </div>
                            <div className="short_content">
                              {/* <p>Market Condition: {strategy.type} | Timeframe: {strategy.timeframe} | Risk: {strategy.risk_reward_ratio_target}</p> */}
                              <p>{strategy?.description}</p>
                              <p>
                                TimeFrame:{" "}
                                {strategy.recommended_timeframes
                                  ?.map((timeframe) => timeframe)
                                  .join(", ")}
                              </p>
                              <p>Type: {strategy.type}</p>
                            </div>
                          </div>
                        </div>
                        <div className="middle">
                          <ul>
                            <li>
                              <h3 className="green">$ {strategy?.capital_allocation?.allocated_capital}</h3>
                              <span>Amount</span>
                            </li>

                            <li>
                              <h3>{strategy?.capital_allocation?.allocation_percentage}%</h3>
                              <span>Allocation</span>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="strategy_analysis_wrap">
              {
                selectedStratigy?.recommended_pairs?.map((pair: any, index: number) => (
                  <div className="strategy_analysis_item_box" key={index}>
                    <div className="strategy_analysis_item">
                      <div className="top">
                        <div className="left">
                          <h4>{pair?.pair_name}</h4>
                        </div>
                        <div className="right">
                          <div className="edit_icon">
                            <button type="button">
                              <MdEdit />
                            </button>
                          </div>
                        </div>
                      </div>
                      <div className="bottom">
                        <ul>
                          <li>
                            <h5>{pair?.amount}</h5>
                            <p>Amount</p>
                          </li>

                          <li>
                            <h5>{pair?.allocation}</h5>
                            <p>Allocation</p>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                ))
              }


            </div>
          </TabPanel>
          <TabPanel></TabPanel>
          <TabPanel></TabPanel>
        </Tabs>
      </div>

      {/* <div className="tabs_inside_boxs">
        <div className="capital_box_wrap capital_instrument_sec">
          <div className="left">
            <div className="head">
              <h4>Instrument Allocation</h4>
              <p>Capital Distribution & Performance Pactrice</p>
            </div>
            <div className="graph">
              <img src={Graph3} alt="" />
              <div className="graph_list">
                <ul>
                  <li>
                    <h5>EURUSD</h5>
                    <div className="gl_right">
                      <span>30% allocation</span>
                      <span>4 strategies</span>
                    </div>
                  </li>
                  <li>
                    <h5>GBBUSD</h5>
                    <div className="gl_right">
                      <span>30% allocation</span>
                      <span>4 strategies</span>
                    </div>
                  </li>
                  <li>
                    <h5>USDJPY</h5>
                    <div className="gl_right">
                      <span>30% allocation</span>
                      <span>4 strategies</span>
                    </div>
                  </li>
                  <li>
                    <h5>XAUUSD</h5>
                    <div className="gl_right">
                      <span>30% allocation</span>
                      <span>4 strategies</span>
                    </div>
                  </li>
                  <li>
                    <h5>USDCHF</h5>
                    <div className="gl_right">
                      <span>30% allocation</span>
                      <span>4 strategies</span>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="right">
            <div className="head">
              <h3>Strategy Allocation Requirment</h3>
            </div>
            <div className="dashboard_perfomance">
              <div className="dashboard_perfomance_itmes">
                <div className="top">
                  <div className="left">
                    <h4>EURUSD</h4>
                  </div>
                </div>
                <div className="bottom">
                  <ul>
                    <li>
                      <h5>$75000(30%)</h5>
                      <p>Capital</p>
                    </li>
                    <li>
                      <h5>+$3812.50</h5>
                      <p>Profit</p>
                    </li>
                    <li>
                      <h5>4</h5>
                      <p>Strategy</p>
                    </li>
                    <li>
                      <h5>5%</h5>
                      <p>Return</p>
                    </li>
                    <li className="green">
                      <h5>+5.7%</h5>
                      <p>P&L %</p>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="dashboard_perfomance_itmes">
                <div className="top">
                  <div className="left">
                    <h4>GBPUSD</h4>
                  </div>
                </div>
                <div className="bottom">
                  <ul>
                    <li>
                      <h5>$75000(30%)</h5>
                      <p>Capital</p>
                    </li>
                    <li>
                      <h5>+$3812.50</h5>
                      <p>Profit</p>
                    </li>
                    <li>
                      <h5>4</h5>
                      <p>Strategy</p>
                    </li>
                    <li>
                      <h5>5%</h5>
                      <p>Return</p>
                    </li>
                    <li className="green">
                      <h5>+5.7%</h5>
                      <p>P&L %</p>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="dashboard_perfomance_itmes">
                <div className="top">
                  <div className="left">
                    <h4>USDJPY</h4>
                  </div>
                </div>
                <div className="bottom">
                  <ul>
                    <li>
                      <h5>$75000(30%)</h5>
                      <p>Capital</p>
                    </li>
                    <li>
                      <h5>+$3812.50</h5>
                      <p>Profit</p>
                    </li>
                    <li>
                      <h5>4</h5>
                      <p>Strategy</p>
                    </li>
                    <li>
                      <h5>5%</h5>
                      <p>Return</p>
                    </li>
                    <li className="green">
                      <h5>+5.7%</h5>
                      <p>P&L %</p>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="dashboard_perfomance_itmes">
                <div className="top">
                  <div className="left">
                    <h4>XAUUSD</h4>
                  </div>
                </div>
                <div className="bottom">
                  <ul>
                    <li>
                      <h5>$75000(30%)</h5>
                      <p>Capital</p>
                    </li>
                    <li>
                      <h5>+$3812.50</h5>
                      <p>Profit</p>
                    </li>
                    <li>
                      <h5>4</h5>
                      <p>Strategy</p>
                    </li>
                    <li>
                      <h5>5%</h5>
                      <p>Return</p>
                    </li>
                    <li className="green">
                      <h5>+5.7%</h5>
                      <p>P&L %</p>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="dashboard_perfomance_itmes">
                <div className="top">
                  <div className="left">
                    <h4>USDCHF</h4>
                  </div>
                </div>
                <div className="bottom">
                  <ul>
                    <li>
                      <h5>$75000(30%)</h5>
                      <p>Capital</p>
                    </li>
                    <li>
                      <h5>+$3812.50</h5>
                      <p>Profit</p>
                    </li>
                    <li>
                      <h5>4</h5>
                      <p>Strategy</p>
                    </li>
                    <li>
                      <h5>5%</h5>
                      <p>Return</p>
                    </li>
                    <li className="green">
                      <h5>+5.7%</h5>
                      <p>P&L %</p>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="tabs_inside_boxs">
        <div className="capital_risk_matrix">
          <div className="head">
            <div className="left">
              <h4>Risk Matrix</h4>
              <p>Risk Assessment & Monitoring</p>
            </div>
          </div>

          <div className="dashboard_perfomance">
            <div className="dashboard_perfomance_itmes">
              <div className="bottom">
                <h4 className="green">-8.5%</h4>
                <ul>
                  <li>
                    <span>Max Stop (Max DD)</span>
                    <h6>Highest Drawdown Experienced</h6>
                  </li>
                </ul>
              </div>
            </div>
            <div className="dashboard_perfomance_itmes">
              <div className="bottom">
                <h4 className="green">87%</h4>
                <ul>
                  <li>
                    <span>Max Capital Exposure</span>
                    <h6>Max Capital at Risk</h6>
                  </li>
                </ul>
              </div>
            </div>
            <div className="dashboard_perfomance_itmes">
              <div className="bottom">
                <h4 className="green">12/100</h4>
                <ul>
                  <li>
                    <span>Risk of Liquidation Score</span>
                    <h6>Low Risk Score</h6>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div> */}
    </>
  );
};

export default CapitalAllocationComponent;
