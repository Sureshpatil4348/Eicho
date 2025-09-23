import React, { useEffect, useState } from "react";
import { Tab, TabList, TabPanel, Tabs } from "react-tabs";
import { useAppDispatch, useAppSelector } from "@renderer/services/hook";
import { LoadingComponent } from "@renderer/shared/LoadingScreen";
import { AuthState } from "@renderer/context/auth.context";
import { GetStrategiesAction } from "@renderer/services/actions/strategies.action";
import { Input, Button } from "@mui/material";

const CapitalAllocationComponent: React.FunctionComponent = () => {
  const { strategies, loading } = useAppSelector((state) => state.strategies);
  const { userDetails } = AuthState();
  const dispatch = useAppDispatch();

  const [formData, setFormData] = useState<any>({});

  useEffect(() => {
    GetStrategiesAction(userDetails?.id, dispatch);
  }, [dispatch]);

  // handle input change for strategy or pair
  const handleChange = (
    strategyId: number,
    field: string,
    value: string,
    pairId?: number
  ) => {
    setFormData((prev: any) => {
      const updated = { ...prev };

      if (!updated[strategyId]) {
        updated[strategyId] = {
          amount: "",
          percentage: "",
          key_pairs: {},
        };
      }

      if (pairId) {
        if (!updated[strategyId].key_pairs[pairId]) {
          updated[strategyId].key_pairs[pairId] = {
            amount: "",
            percentage: "",
          };
        }
        updated[strategyId].key_pairs[pairId][field] = value;
      } else {
        updated[strategyId][field] = value;
      }

      return updated;
    });
  };

  // submit handler
  const handleSubmit = () => {
    const payload = {
      stratigy: strategies?.map((strategy: any) => ({
        strategy_id: strategy?.strategy_id,
        amount: Number(formData[strategy?.strategy_id]?.amount || 0),
        percentage: Number(formData[strategy?.strategy_id]?.percentage || 0),
        key_pairs: strategy?.recommended_pairs?.map((pair: any) => ({
          pair_id: pair?.pair_name,
          amount: Number(
            formData[strategy?.strategy_id]?.key_pairs?.[pair?.pair_id]?.amount ||
            0
          ),
          percentage: Number(
            formData[strategy?.strategy_id]?.key_pairs?.[pair?.pair_id]
              ?.percentage || 0
          ),
        })),
      })),
    };

    console.log("🚀 Final Payload:", payload);
    // call API here with payload
  };

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
                  strategies?.map((strategy: any) => (
                    <div
                      key={strategy?.strategy_id}
                      className={`strategies_managment_item active`}
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
                                className="form-control"
                                defaultValue={
                                  strategy?.capital_allocation?.allocated_capital
                                }
                                onChange={(e) =>
                                  handleChange(
                                    strategy?.strategy_id,
                                    "amount",
                                    e.target.value
                                  )
                                }
                              />
                              <label>Percentage</label>
                              <Input
                                type="text"
                                placeholder="Percentage"
                                className="form-control"
                                defaultValue={
                                  strategy?.capital_allocation
                                    ?.allocation_percentage
                                }
                                onChange={(e) =>
                                  handleChange(
                                    strategy?.strategy_id,
                                    "percentage",
                                    e.target.value
                                  )
                                }
                              />
                            </div>
                          </div>
                        </div>
                        <div className="middle">
                          <ul>
                            <li>
                              <h3 className="green">
                                $ {strategy?.capital_allocation?.allocated_capital}
                              </h3>
                              <span>Amount</span>
                            </li>

                            <li>
                              <h3>
                                {strategy?.capital_allocation?.allocation_percentage}
                                %
                              </h3>
                              <span>Allocation</span>
                            </li>
                          </ul>
                        </div>

                        <div className="strategy_analysis_wrap">
                          {strategy?.recommended_pairs?.map(
                            (pair: any, index: number) => (
                              <div
                                className="strategy_analysis_item_box"
                                key={index}
                              >
                                <div className="strategy_analysis_item">
                                  <div className="top">
                                    <div className="left">
                                      <h4>{pair?.pair_name}</h4>
                                    </div>
                                  </div>
                                  <div className="bottom">
                                    <label>Amount</label>
                                    <Input
                                      type="text"
                                      placeholder="Amount"
                                      className="form-control"
                                      defaultValue={
                                        strategy?.capital_allocation
                                          ?.allocated_capital
                                      }
                                      onChange={(e) =>
                                        handleChange(
                                          strategy?.strategy_id,
                                          "amount",
                                          e.target.value,
                                          pair?.pair_id
                                        )
                                      }
                                    />
                                    <label>Percentage</label>
                                    <Input
                                      type="text"
                                      placeholder="Percentage"
                                      className="form-control"
                                      defaultValue={
                                        strategy?.capital_allocation
                                          ?.allocation_percentage
                                      }
                                      onChange={(e) =>
                                        handleChange(
                                          strategy?.strategy_id,
                                          "percentage",
                                          e.target.value,
                                          pair?.pair_id
                                        )
                                      }
                                    />
                                  </div>
                                </div>
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div style={{ marginTop: "20px" }}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSubmit}
                >
                  Submit
                </Button>
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
