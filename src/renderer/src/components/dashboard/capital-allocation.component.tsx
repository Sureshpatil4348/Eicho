import React, { useEffect } from "react";
import { Tab, TabList, TabPanel, Tabs } from "react-tabs";
import { useAppDispatch, useAppSelector } from "@renderer/services/hook";
import { LoadingComponent } from "@renderer/shared/LoadingScreen";
import { AuthState } from "@renderer/context/auth.context";
import { GetStrategiesAction } from "@renderer/services/actions/strategies.action";
import { Input } from "@mui/material";

const CapitalAllocationComponent: React.FunctionComponent = () => {
  const { strategies, loading } = useAppSelector((state) => state.strategies);
  const { userDetails } = AuthState();
  const dispatch = useAppDispatch();

  useEffect(() => {
    GetStrategiesAction(userDetails?.id, dispatch)
  }, [dispatch])
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
                      className={`strategies_managment_item active`}
                    // onClick={() => setSelectedStratigy(strategy)}
                    >
                      <div className="up">
                        <div className="top">
                          <div className="left">
                            <div className="one">
                              <div className="round"></div>
                              <h5>{strategy.name}</h5>
                              <label>Amount</label>
                              <Input
                                type="text"
                                placeholder="Amount"
                                className="from-control"
                                defaultValue={strategy?.capital_allocation?.allocated_capital}
                              />
                              <label>Percentage</label>
                              <Input
                                type="text"
                                placeholder="Percentage"
                                className="from-control"
                                defaultValue={strategy?.capital_allocation?.allocated_capital}
                              />
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

                        <div className="strategy_analysis_wrap">
                          {
                            strategy?.recommended_pairs?.map((pair: any, index: number) => (
                              <div className="strategy_analysis_item_box" key={index}>
                                <div className="strategy_analysis_item">
                                  <div className="top">
                                    <div className="left">
                                      <h4>{pair?.pair_name}</h4>
                                    </div>

                                    <label>Amount</label>
                                    <Input
                                      type="text"
                                      placeholder="Amount"
                                      className="from-control"
                                      defaultValue={strategy?.capital_allocation?.allocated_capital}
                                    />
                                    <label>Percentage</label>
                                    <Input
                                      type="text"
                                      placeholder="Percentage"
                                      className="from-control"
                                      defaultValue={strategy?.capital_allocation?.allocated_capital}
                                    />
                                  </div>

                                </div>
                              </div>
                            ))
                          }


                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </TabPanel>
          <TabPanel></TabPanel>
          <TabPanel></TabPanel>
        </Tabs>
      </div>


    </>
  );
};

export default CapitalAllocationComponent;
