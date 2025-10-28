import React, { useEffect, useState } from "react";
import { Button, TextField, MenuItem, Tabs, Tab, FormControlLabel, Switch } from "@mui/material";
import axios from "@renderer/config/axios";
import { API_URL } from "@renderer/utils/constant";
import toast from "react-hot-toast";
import { LoadingComponent } from "@renderer/shared/LoadingScreen";
import { Accordion, AccordionItem } from "@szhsin/react-accordion";
import { FaChevronDown } from "react-icons/fa6";

const TIMEFRAMES = ["1M", "5M", "15M", "30M", "1H", "4H", "1D"];

const ConfigUpdateModal: React.FC<{
  closeModal: () => void;
  strategy_id: string;
}> = ({ closeModal, strategy_id }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [pairConfigs, setPairConfigs] = useState<any[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [fetchLoading, setFetchLoading] = useState(false);

  // ✅ Capital Allocation States
  const [totalFund, setTotalFund] = useState(0); // Example total fund
  const [allocations, setAllocations] = useState<
    { name: string; percentage: number; amount: number, isActive: true }[]
  >([]);

  // Fetch existing configs
  const getConfigData = async () => {
    setFetchLoading(true);
    try {
      const res = await axios.get(API_URL.GET_CONFIG_DATA(strategy_id));
      if (res.data.config_data) {
        setPairConfigs(res.data.config_data);
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || err.message);
    } finally {
      setFetchLoading(false);
    }
  };
  const getAllocationData = async () => {
    setFetchLoading(true);
    try {
      const res = await axios.get(
        API_URL.GET_SINGLE_ALLOCATION_DATA(strategy_id)
      );
      if (res.data) {
        // initialize allocations
        const initAlloc = res.data.key_pairs?.map((p: any, i: number) => ({
          name: p?.pair_id || `Pair ${i + 1}`,
          percentage: Number(p?.percentage) || 0,
          amount: Number(p?.amount) || 0,
          isActive: p?.isActive ?? true, // default to true if not provided
        }));
        setAllocations(initAlloc || []);
        setTotalFund(Number(res.data.strategy_allocated_amount) || 0);
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || err.message);
    } finally {
      setFetchLoading(false);
    }
  };
  // ✅ Save key pairs separately
  const handleSaveKeyPairs = async () => {
    const payload = {
      key_pairs: allocations.map((a) => ({
        pair_id: a.name,
        amount: a.amount,
      })),
    };

    if (!payload.key_pairs.length) {
      toast.error("No key pairs to save");
      return;
    }

    setIsLoading(true);
    try {
      const res = await axios.post(
        API_URL.GET_SINGLE_ALLOCATION_DATA(strategy_id),
        payload
      );
      toast.success(res.data.message || "Key pairs saved successfully");
    } catch (err: any) {
      toast.error(err.response?.data?.message || err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddPair = () => {
    const newConfig = {
      lot_size: "",
      percentage_threshold: "",
      magic_number: "",
      zscore_threshold_buy: "",
      zscore_threshold_sell: "",
      take_profit_percent: "",
      stop_loss_percent: "",
      max_grid_trades: "",
      grid_spacing_percent: "",
      lookback_period: "",
      ma_period: "",
      max_drawdown_percent: "",
      timeframe: "",
      symbol: "",
      take_profit: "",
      use_take_profit_percent: false,
      use_grid_trading: false,
      use_grid_percent: false,
      zscore_wait_candles: "",
    };
    setPairConfigs((prev) => [...prev, newConfig]);
    setActiveIndex(pairConfigs.length);

    // ✅ Add corresponding allocation entry
    setAllocations((prev) => [
      ...prev,
      { name: `Pair ${pairConfigs.length + 1}`, percentage: 0, amount: 0, isActive: true },
    ]);
  };

  // ✅ Handle allocation field change
  const handleAllocationChange = (
    index: number,
    field: 'percentage' | 'name' | 'isActive',
    value: any
  ) => {
    setAllocations((prev) => {
      const updated = [...prev];
      const item = { ...updated[index] };

      if (field === 'percentage') {
        // coerce to number
        const perc = Number(value) || 0;
        item.percentage = perc;
        item.amount = Number(((perc / 100) * Number(totalFund || 0)).toFixed(2));
      } else if (field === 'name') {
        item.name = String(value);
      } else if (field === 'isActive') {
        item.isActive = value;
      }

      updated[index] = item;
      return updated;
    });
  };



  const totalAllocated = allocations.reduce(
    (sum, a) => sum + (Number(a.percentage) || 0),
    0
  );

  // Handle config field updates
  const handleFieldChange = (index: number, field: string, value: any) => {
    const updated = [...pairConfigs];
    updated[index][field] = value;
    setPairConfigs(updated);
  };
  // ✅ Remove pair and corresponding allocation
  const handleRemovePair = (index: number) => {
    setAllocations((prev) => prev.filter((_, i) => i !== index));
    setPairConfigs((prev) => prev.filter((_, i) => i !== index));

    // Adjust active index if needed
    setActiveIndex((prev) => (index === prev ? 0 : prev > index ? prev - 1 : prev));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (totalAllocated > 100) {
      toast.error("Total allocation percentage cannot exceed 100%");
      return;
    }
    setIsLoading(true);
    try {
      // const payload = { configs: pairConfigs, allocations };
      const res = await axios.post(
        API_URL.GET_CONFIG_DATA(strategy_id),
        pairConfigs
      );
      toast.success(res.data.message);
      closeModal();
    } catch (err: any) {
      toast.error(err.response?.data?.message || err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (strategy_id) {
      getConfigData();
      getAllocationData();
    }
  }, [strategy_id]);

  const currentConfig = pairConfigs[activeIndex];

  if (fetchLoading) return <LoadingComponent />;
  return (
    <div className="custom_modal_form">
      <form onSubmit={handleSubmit}>
        <div style={{ margin: "1rem 0" }}>
          <Button
            variant="outlined"
            onClick={handleAddPair}
            sx={{
              p: "10px 15px",
              display: "flex",
              justifyContent: "center",
              alignItems: "flex-end",
              gap: "10px",
              color: "#FFF",
              textAlign: "center",
              fontSize: "14px",
              fontStyle: "normal",
              fontWeight: 500,
              lineHeight: "normal",
              borderRadius: "70px",
              background: "#33CB33",
              border: "none",
              m: "0 0 0 auto",
            }}
          >
            + Add Pair
          </Button>
        </div>
        <div className="accordian">
          <Accordion>
            <AccordionItem
              header={
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    justifyContent: "space-between",
                  }}
                >
                  <span>Capital Allocation</span>
                  <FaChevronDown size={18} />
                </div>
              }
            >
              <div style={{ marginBottom: 20 }}>
                <h4>Capital Allocation</h4>
                <div style={{ marginBottom: 10 }}>
                  <TextField
                    type="number"
                    label=" Total Remaining Fund ($)"
                    value={totalFund}
                    onChange={(e) => setTotalFund(Number(e.target.value))}
                    fullWidth
                    disabled
                  />
                </div>

                {allocations.map((a, i) => (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      gap: 10,
                      alignItems: "center",
                      marginBottom: 10,
                    }}
                  >
                    <TextField
                      label="Key Pair Name"
                      value={a.name}
                      onChange={(e) =>
                        handleAllocationChange(i, "name", e.target.value)
                      }
                      style={{ width: 150 }}
                    />
                    <TextField
                      label="Percentage (%)"
                      type="number"
                      value={a.percentage}
                      onChange={(e) =>
                        handleAllocationChange(i, "percentage", e.target.value)
                      }
                      style={{ width: 150 }}
                    />
                    <TextField
                      label="Amount ($)"
                      value={a.amount}
                      InputProps={{ readOnly: true }}
                      style={{ width: 150 }}
                    />
                    {/* ✅ Toggle Switch */}
                    <FormControlLabel
                      control={
                        <Switch
                          checked={a.isActive}
                          onChange={(e) =>
                            handleAllocationChange(i, "isActive", e.target.checked)
                          }
                          color="primary"
                        />
                      }
                      label={a.isActive ? "On" : "Off"}
                      labelPlacement="top"
                    />

                    {/* ❌ Remove Button */}
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={() => handleRemovePair(i)}
                      sx={{
                        height: 55,
                        borderRadius: "50px",
                        fontWeight: 500,
                        textTransform: "none",
                      }}
                    >
                      Remove
                    </Button>
                  </div>
                ))}

                <div style={{ textAlign: "right", fontWeight: "bold", marginBottom: 10 }}>
                  Total Allocated: {isFinite(Number(totalAllocated)) ? Number(totalAllocated).toFixed(2) : "0.00"}%
                </div>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    gap: 10,
                  }}
                >
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={handleSaveKeyPairs}
                    disabled={isLoading}
                    sx={{
                      p: "10px 15px",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "flex-end",
                      gap: "10px",
                      color: "#FFF",
                      textAlign: "center",
                      fontSize: "14px",
                      fontStyle: "normal",
                      fontWeight: 500,
                      lineHeight: "normal",
                      borderRadius: "70px",
                      background: "#33CB33",
                      border: "none",
                      m: "auto",
                    }}
                  >
                    {isLoading ? "Saving..." : "Save Key Pairs"}
                  </Button>
                </div>
              </div>
            </AccordionItem>

            <AccordionItem
              header={
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    justifyContent: "space-between",
                  }}
                >
                  <span>Configuration</span>
                  <FaChevronDown size={18} />
                </div>
              }
            >
              <Tabs
                value={activeIndex}
                onChange={(e, val) => {
                  setActiveIndex(val);
                  console.log(e);
                }}
                variant="scrollable"
                scrollButtons="auto"
              >
                {pairConfigs.map((pair, i) => (
                  <Tab key={i} label={pair?.symbol || `Pair ${i + 1}`} />
                ))}
              </Tabs>
              {currentConfig && (
                <div className="pair-config">
                  {Object.entries(currentConfig).map(([key, value]) => (
                    <div key={key} style={{ marginTop: 10 }}>
                      {key === "config_id" ? null : (
                        <>
                          <label style={{ textTransform: "capitalize" }}>
                            {key.replace(/_/g, " ")}
                          </label>
                          {key === "timeframe" ? (
                            <TextField
                              select
                              fullWidth
                              value={value}
                              onChange={(e) =>
                                handleFieldChange(
                                  activeIndex,
                                  key,
                                  e.target.value
                                )
                              }
                            >
                              <MenuItem value="">Select timeframe</MenuItem>
                              {TIMEFRAMES.map((t) => (
                                <MenuItem key={t} value={t}>
                                  {t}
                                </MenuItem>
                              ))}
                            </TextField>
                          ) : typeof value === "boolean" ? (
                            <div
                              style={{ display: "flex", alignItems: "center" }}
                            >
                              <input
                                type="checkbox"
                                checked={value}
                                onChange={(e) =>
                                  handleFieldChange(
                                    activeIndex,
                                    key,
                                    e.target.checked
                                  )
                                }
                              />
                              <span style={{ marginLeft: 8 }}>Enable</span>
                            </div>
                          ) : (
                            <TextField
                              fullWidth
                              value={value}
                              onChange={(e) =>
                                handleFieldChange(
                                  activeIndex,
                                  key,
                                  e.target.value
                                )
                              }
                              placeholder={`Enter ${key.replace(/_/g, " ")}`}
                            />
                          )}
                        </>
                      )}
                    </div>
                  ))}
                </div>
              )}

              <div
                className="text-center"
                style={{ marginTop: 20, paddingBottom: 5 }}
              >
                <Button
                  variant="contained"
                  color="primary"
                  type="submit"
                  disabled={isLoading}
                  sx={{
                    p: "10px 15px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "flex-end",
                    gap: "10px",
                    color: "#FFF",
                    textAlign: "center",
                    fontSize: "14px",
                    fontStyle: "normal",
                    fontWeight: 500,
                    lineHeight: "normal",
                    borderRadius: "70px",
                    background: "#33CB33",
                    border: "none",
                    m: "auto",
                  }}
                >
                  {isLoading ? "Saving..." : "Save Configuration"}
                </Button>
              </div>
            </AccordionItem>
          </Accordion>
        </div>
        {/* 🔹 Capital Allocation Section */}
        {/* 🔹 Capital Allocation Section */}

        {/* Pair Config Tabs */}

        {/* Active Config Form */}
      </form>
    </div>
  );
};

export default ConfigUpdateModal;
