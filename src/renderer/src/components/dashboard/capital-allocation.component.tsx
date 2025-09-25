import React, { useEffect, useState } from "react";
import { Tab, TabList, TabPanel, Tabs } from "react-tabs";
import { useAppDispatch, useAppSelector } from "@renderer/services/hook";
import { LoadingComponent } from "@renderer/shared/LoadingScreen";
import { AuthState } from "@renderer/context/auth.context";
import { GetStrategiesAction } from "@renderer/services/actions/strategies.action";
import { Button } from "@mui/material";
import toast from "react-hot-toast";
import { API_URL } from "@renderer/utils/constant";
import axios from "@renderer/config/axios";

const CapitalAllocationComponent: React.FunctionComponent = () => {
  const { strategies, loading } = useAppSelector((state) => state.strategies);
  const { userDetails } = AuthState();
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<any>({});

  useEffect(() => {
    GetStrategiesAction(userDetails?.id, dispatch);
  }, [dispatch]);

  // Prefill formData from API response
  useEffect(() => {
    if (strategies && strategies?.length > 0) {
      const initialData: any = {};
      strategies.forEach((strategy: any) => {
        initialData[strategy.strategy_id] = {
          amount: strategy?.capital_allocation?.allocated_capital || "",
          percentage: strategy?.capital_allocation?.allocation_percentage || "",
          key_pairs: {},
        };
        strategy?.recommended_pairs?.forEach((pair: any) => {
          initialData[strategy.strategy_id].key_pairs[pair.pair_name] = {
            amount: pair?.amount || "",
            percentage: pair?.allocation || "", // <- in your API, allocation is directly a string (not nested)
          };
        });
      });
      setFormData(initialData);
    }
  }, [strategies]);

  // handle input change
  const handleChange = (
    strategyId: number,
    field: string,
    value: string,
    pairId?: string
  ) => {
    setFormData((prev: any) => {
      const updated = { ...prev };

      if (!updated[strategyId]) {
        updated[strategyId] = { amount: "", percentage: "", key_pairs: {} };
      }

      // --- Case 1: Pair input changed ---
      if (pairId) {
        if (!updated[strategyId].key_pairs[pairId]) {
          updated[strategyId].key_pairs[pairId] = {
            amount: "",
            percentage: "",
          };
        }

        const strategyAmount = Number(updated[strategyId].amount || 0);

        if (field === "amount") {
          const amt = Number(value) || 0;
          updated[strategyId].key_pairs[pairId].amount = amt;
          updated[strategyId].key_pairs[pairId].percentage =
            strategyAmount > 0 ? ((amt / strategyAmount) * 100).toFixed(2) : 0;
        } else if (field === "percentage") {
          const perc = Number(value) || 0;
          updated[strategyId].key_pairs[pairId].percentage = perc;
          updated[strategyId].key_pairs[pairId].amount = (
            (perc / 100) *
            strategyAmount
          ).toFixed(2);
        }
      }
      // --- Case 2: Strategy input changed ---
      else {
        updated[strategyId][field] = value;

        const walletBalance = Number(
          userDetails?.mt5_status?.account_balance || 0
        );

        let strategyAmount = Number(updated[strategyId].amount || 0);
        let strategyPercentage = Number(updated[strategyId].percentage || 0);

        if (field === "amount") {
          // sync percentage from wallet balance
          strategyPercentage =
            walletBalance > 0
              ? Number(((Number(value) / walletBalance) * 100).toFixed(2))
              : 0;
          updated[strategyId].percentage = strategyPercentage;
        } else if (field === "percentage") {
          // sync amount from wallet balance
          strategyAmount = Number(
            ((Number(value) / 100) * walletBalance).toFixed(2)
          );
          updated[strategyId].amount = strategyAmount;
        }

        // --- redistribute pairs ---
        const pairs = updated[strategyId].key_pairs || {};
        const pairKeys = Object.keys(pairs);
        if (pairKeys.length > 0) {
          // use existing percentages if available, else divide equally
          const totalPerc = pairKeys.reduce(
            (sum, key) => sum + (Number(pairs[key].percentage) || 0),
            0
          );
          pairKeys.forEach((key) => {
            let perc = Number(pairs[key].percentage);
            if (!perc || totalPerc === 0) {
              perc = 100 / pairKeys.length;
            }
            pairs[key].percentage = perc.toFixed(2);
            pairs[key].amount = ((perc / 100) * strategyAmount).toFixed(2);
          });
        }
      }

      return updated;
    });
  };

  // submit handler with validation
  const handleSubmit = () => {
    const walletBalance = Number(userDetails?.mt5_status?.account_balance || 0);

    let totalAllocated = 0;
    let errors: string[] = [];

    const payload = {
      strategy: strategies?.map((strategy: any) => {
        const sData = formData[strategy.strategy_id] || {};
        const strategyAmount = Number(
          sData.amount || strategy.capital_allocation?.allocated_capital || 0
        );
        const strategyPercentage = Number(
          sData.percentage ||
            strategy.capital_allocation?.allocation_percentage ||
            0
        );
        totalAllocated += strategyAmount;

        // pairs validation
        let totalPairAmount = 0;
        let totalPairPercentage = 0;
        const key_pairs = strategy?.recommended_pairs?.map((pair: any) => {
          const pData =
            formData[strategy.strategy_id]?.key_pairs?.[pair.pair_name] || {};
          const pairAmount = Number(pData.amount || pair.amount || 0);
          const pairPercentage = Number(
            pData.percentage || pair.allocation || 0
          );

          totalPairAmount += pairAmount;
          totalPairPercentage += pairPercentage;

          return {
            pair_id: pair.pair_name,
            amount: pairAmount,
            percentage: pairPercentage,
          };
        });
        console.log(
          "totalPairAmount",
          totalPairAmount,
          strategyAmount,
          totalPairPercentage,
          strategyPercentage
        );
        if (totalPairAmount > strategyAmount) {
          errors.push(
            `Pairs total amount exceed strategy ${strategy.name} amount (${totalPairAmount} > ${strategyAmount})`
          );
        }
        if (totalPairPercentage > 100) {
          errors.push(
            `Pairs total percentage exceed strategy ${strategy.name} percentage (${totalPairPercentage} > ${strategyPercentage})`
          );
        }
        return {
          strategy_id: strategy.strategy_id,
          amount: strategyAmount,
          percentage: strategyPercentage,
          key_pairs,
        };
      }),
    };

    // strategy validation
    if (totalAllocated > walletBalance) {
      errors.push("Total allocated amount exceeds wallet balance.");
    }

    if (errors.length > 0) {
      // alert(errors.join("\n"));
      toast.error(errors.join("\n"));
      return;
    }
    setIsLoading(true);
    axios
      .post(API_URL.CAPITAL_ALOCATION, payload)
      .then((res) => {
        if (res) {
          toast.success("Alocation  Successfully");
          setIsLoading(false);
          GetStrategiesAction(userDetails?.id, dispatch);
        }
      })
      .catch((err) => {
        if (err.response) {
          toast.error(err.response.data.message);
        } else {
          toast.error(err.message);
        }
        setIsLoading(false);
      });
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
            <div className="tabs_inside_boxs capital_box_wrap">
              <div className="strategies_managment">
                {loading ? (
                  <LoadingComponent />
                ) : (
                  strategies?.map((strategy: any) => {
                    const sData = formData[strategy.strategy_id] || {};
                    return (
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
                              </div>
                            </div>
                            <div className="right">
                              <div className="middle">
                                <ul>
                                  <li>
                                    <h3>
                                      $
                                      {
                                        strategy?.capital_allocation
                                          ?.allocated_capital
                                      }
                                    </h3>
                                    <span>(Amount)</span>
                                  </li>
                                  <li>
                                    <h3>
                                      {
                                        strategy?.capital_allocation
                                          ?.allocation_percentage
                                      }
                                      %
                                    </h3>
                                    <span>(Allocation)</span>
                                  </li>
                                </ul>
                              </div>
                            </div>
                          </div>
                          <div className="strategy_capital_wrap">
                            <div className="capital_form">
                              <div className="form-group">
                                <label>Amount</label>
                                <div className="field">
                                  <input
                                    type="text"
                                    placeholder="Amount"
                                    className="form-control"
                                    value={sData.amount}
                                    onChange={(e) =>
                                      handleChange(
                                        strategy?.strategy_id,
                                        "amount",
                                        e.target.value
                                      )
                                    }
                                  />
                                  <span className="parcentage">$</span>
                                </div>
                              </div>
                              <div className="form-group">
                                <label>Percentage</label>
                                <div className="field">
                                  <input
                                    type="text"
                                    placeholder="Percentage"
                                    className="form-control"
                                    value={sData.percentage}
                                    onChange={(e) =>
                                      handleChange(
                                        strategy?.strategy_id,
                                        "percentage",
                                        e.target.value
                                      )
                                    }
                                  />
                                  <span className="parcentage">%</span>
                                </div>
                              </div>
                            </div>
                            <div className="strategy_analysis_wrap">
                              {strategy?.recommended_pairs?.map(
                                (pair: any, index: number) => {
                                  const pData =
                                    sData.key_pairs?.[pair.pair_name] || {};
                                  return (
                                    <div
                                      className="strategy_analysis_item_box"
                                      key={index}
                                    >
                                      <div className="capital_form">
                                        <div className="top">
                                          <h4>{pair?.pair_name}</h4>
                                        </div>
                                        <div className="form-group">
                                          <label>Amount</label>
                                          <div className="field">
                                            <input
                                              type="text"
                                              placeholder="Amount"
                                              className="form-control"
                                              value={pData.amount || ""}
                                              onChange={(e) =>
                                                handleChange(
                                                  strategy?.strategy_id,
                                                  "amount",
                                                  e.target.value,
                                                  pair?.pair_name
                                                )
                                              }
                                            />
                                            <span className="parcentage">
                                              $
                                            </span>
                                          </div>
                                        </div>
                                        <div className="form-group">
                                          <label>Percentage</label>
                                          <div className="field">
                                            <input
                                              type="text"
                                              placeholder="Percentage"
                                              className="form-control"
                                              value={pData.percentage || ""}
                                              onChange={(e) =>
                                                handleChange(
                                                  strategy?.strategy_id,
                                                  "percentage",
                                                  e.target.value,
                                                  pair?.pair_name
                                                )
                                              }
                                            />
                                            <span className="parcentage">
                                              %
                                            </span>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  );
                                }
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              <div className="button_wrap">
                <div className="gren_button">
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSubmit}
                    disabled={isLoading}
                  >
                    {isLoading ? "Saving..." : "Save"}
                  </Button>
                </div>
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
