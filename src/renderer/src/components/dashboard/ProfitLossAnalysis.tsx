import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useState,
} from "react";
import { useSelector } from "react-redux";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { Box, CircularProgress, Typography } from "@mui/material";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  ReferenceLine,
  Tooltip,
  Cell,
} from "recharts";
import toast from "react-hot-toast";
import { formatNumber } from "@renderer/utils/helper";
import { AuthState } from "@renderer/context/auth.context";
import axios from "@renderer/config/axios";
import { API_URL } from "@renderer/utils/constant";

const STATIC_DATA = [
  {
    "name": "JAN",
    "profit": 1000,
    "monthIndex": 0
  },
  {
    "name": "FEB",
    "profit": 200,
    "monthIndex": 1
  },
]
// Enhanced Custom tooltip component with better styling
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const value = payload[0].value;
    const isPositive = value >= 0;

    return (
      <div
        className="custom-tooltip"
        style={{
          backgroundColor: "#ffffff",
          padding: "16px 20px",
          border: "none",
          borderRadius: "12px",
          boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
          fontSize: "14px",
          fontFamily:
            '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          fontWeight: "500",
          minWidth: "120px",
        }}
      >
        <p
          className="label"
          style={{
            margin: "0 0 8px 0",
            fontWeight: "600",
            color: "#374151",
            fontSize: "13px",
            letterSpacing: "0.5px",
          }}
        >
          {label}
        </p>
        <p
          className="intro"
          style={{
            margin: 0,
            color: isPositive ? "#059669" : "#DC2626",
            fontWeight: "700",
            fontSize: "16px",
            letterSpacing: "-0.025em",
          }}
        >
          {formatNumber(value, "currency")}
        </p>
      </div>
    );
  }

  return null;
};

const ProfitLossAnalysis = forwardRef((props, ref) => {
  const { userDetails }: any = AuthState();

  const [selectedDate, setSelectedDate]: any = useState(new Date());
  const [plData, setPlData] = useState([]);
  const [loading, setLoading] = useState(false);

  const monthNames = [
    "JAN",
    "FEB",
    "MAR",
    "APR",
    "MAY",
    "JUN",
    "JUL",
    "AUG",
    "SEP",
    "OCT",
    "NOV",
    "DEC",
  ];

  const transformDataForChart = (rawData: any) => {
    // Create an array for all 12 months with zero values
    const allMonths = monthNames.map((month, index) => ({
      name: month,
      profit: 0,
      monthIndex: index,
    }));

    // Fill in the actual data
    rawData.forEach((item: any) => {
      const monthDate = new Date(item.month);
      const monthIndex = monthDate.getMonth();
      if (monthIndex >= 0 && monthIndex < 12) {
        allMonths[monthIndex].profit = Number(item.profit) || 0;
      }
    });

    return allMonths;
  };

  // Enhanced custom bar shape with better rounded corners and gradients
  const RoundedBar = (props) => {
    const { fill, x, y, width, height } = props;
    if (height === 0) return null;

    const isPositive = height >= 0;
    const radius = Math.min(6, width / 4); // Dynamic radius based on bar width

    let path = "";

    if (isPositive) {
      // Positive bars - rounded top corners
      path = `
      M${x},${y + height}
      L${x},${y + radius}
      Q${x},${y} ${x + radius},${y}
      L${x + width - radius},${y}
      Q${x + width},${y} ${x + width},${y + radius}
      L${x + width},${y + height}
      Z
    `;
    } else {
      // Negative bars - rounded bottom corners
      path = `
    M${x},${y}
    L${x},${y + height + radius}
    Q${x},${y + height} ${x + radius},${y + height}
    L${x + width - radius},${y + height}
    Q${x + width},${y + height} ${x + width},${y + height + radius}
    L${x + width},${y}
    Z
  `;
    }

    return (
      <g>
        {/* Add subtle gradient effect */}
        <defs>
          <linearGradient
            id={`gradient-${isPositive ? "positive" : "negative"}`}
            x1="0"
            y1="0"
            x2="0"
            y2="1"
          >
            <stop offset="0%" stopColor={fill} stopOpacity="0.9" />
            <stop offset="100%" stopColor={fill} stopOpacity="0.7" />
          </linearGradient>
        </defs>
        <path
          d={path}
          fill={`url(#gradient-${isPositive ? "positive" : "negative"})`}
          style={{
            filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.1))",
          }}
        />
      </g>
    );
  };

  const getPlData = (date: any) => {
    if (!userDetails?.tradingAccount?.[0]?.metaApiId) return;

    setLoading(true);
    axios.get(API_URL.GET_TRADING_HISTORY(userDetails?.id)).then((res) => {

      setPlData(res.data.trades)
    }).catch((err) => {
      if (err.response) {
        toast.error(err.response.data.message)
      } else {
        toast.error(err.message)
      }

    })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    // getPlData(selectedDate);
  }, [userDetails]);

  useImperativeHandle(ref, () => ({
    refetch: () => {
      // getPlData(selectedDate);
    },
  }));

  const chartData = useMemo(
    () => transformDataForChart(plData),
    [plData, selectedDate]
  );

  // Improved Y-axis domain calculation with minimum bar height consideration
  const yAxisDomain = useMemo(() => {
    if (!chartData.length) return [-10000, 10000];

    const nonZeroValues = chartData.map((d) => d.profit).filter((v) => v !== 0);
    if (nonZeroValues.length === 0) return [-1000, 1000];

    const minValue = Math.min(...nonZeroValues);
    const maxValue = Math.max(...nonZeroValues);

    const chartHeight = 400;
    const minVisibleHeight = Math.max(maxValue * 0.02, 100);

    let adjustedMin = minValue;
    let adjustedMax = maxValue;

    if (minValue < 0 && maxValue > 0) {
      adjustedMin = Math.min(minValue, -minVisibleHeight);
      adjustedMax = Math.max(maxValue, minVisibleHeight);
    } else if (minValue >= 0) {
      adjustedMin = 0;
      adjustedMax = Math.max(maxValue, minVisibleHeight);
    } else {
      adjustedMin = Math.min(minValue, -minVisibleHeight);
      adjustedMax = 0;
    }

    const padding =
      Math.max(Math.abs(adjustedMax), Math.abs(adjustedMin)) * 0.1;

    return [adjustedMin - padding, adjustedMax + padding];
  }, [chartData]);

  // Enhanced tick formatter with better formatting
  const formatYAxisTick = (value) => {
    if (value === 0) return "$0";

    const absValue = Math.abs(value);

    if (absValue >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`;
    } else if (absValue >= 1000) {
      return `$${(value / 1000).toFixed(1)}K`;
    } else if (absValue >= 100) {
      return `$${value.toFixed(0)}`;
    } else if (absValue >= 10) {
      return `$${value.toFixed(1)}`;
    } else {
      return `$${value.toFixed(2)}`;
    }
  };

  return (
    <div
      className="analysis_item_box"
      style={{
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      }}
    >
      <div className="tabs_inside_boxs">
        <div className="head">
          <div className="left">
            <h4>P/L Analysis</h4>
          </div>
          <div className="right">
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                views={["year"]}
                value={selectedDate}
                onChange={(newDate) => {
                  setSelectedDate(newDate);
                  getPlData(newDate);
                }}
                format="yyyy"
                slotProps={{
                  textField: {
                    size: "small",
                    variant: "outlined",
                    sx: {
                      minWidth: 120,
                      "& .MuiOutlinedInput-root": {
                        backgroundColor: "#4CAF50",
                        color: "white",
                        borderRadius: "8px",
                        "& fieldset": { borderColor: "#4CAF50" },
                        "&:hover fieldset": { borderColor: "#4CAF50" },
                        "&.Mui-focused fieldset": { borderColor: "#4CAF50" },
                      },
                    },
                  },
                }}
              />
            </LocalizationProvider>
          </div>
        </div>
        <div className="analysis_item_list">
          <Box sx={{ height: 500, width: "100%" }}>
            {loading ? (
              <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                height="100%"
              >
                <div style={{ textAlign: "center" }}>
                  <CircularProgress
                    size={40}
                    sx={{ color: "#059669", marginBottom: "16px" }}
                  />
                  <Typography
                    variant="body2"
                    sx={{
                      color: "#6B7280",
                      fontFamily:
                        '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                      fontWeight: "500",
                    }}
                  >
                    Loading P/L data...
                  </Typography>
                </div>
              </Box>
            ) : STATIC_DATA.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={STATIC_DATA}
                  margin={{
                    top: 20,
                    right: 30,
                    left: 50,
                    bottom: 20,
                  }}
                  style={{
                    fontFamily:
                      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                  }}
                >
                  {/* <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#E5E7EB"
                    strokeOpacity={0.6}
                  /> */}
                  <XAxis
                    dataKey="name"
                    tick={{
                      fill: "#6B7280",
                      fontSize: 12,
                      fontWeight: "600",
                      fontFamily:
                        '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                    }}
                    axisLine={{ stroke: "#D1D5DB", strokeWidth: 1 }}
                    tickLine={{ stroke: "#D1D5DB" }}
                  />
                  <YAxis
                    tickFormatter={formatYAxisTick}
                    domain={yAxisDomain}
                    tickCount={8}
                    tick={{
                      fill: "#6B7280",
                      fontSize: 11,
                      fontWeight: "500",
                      fontFamily:
                        '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                    }}
                    axisLine={{ stroke: "#D1D5DB", strokeWidth: 1 }}
                    tickLine={{ stroke: "#D1D5DB" }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <ReferenceLine
                    y={0}
                    stroke="#374151"
                    strokeWidth={2}
                    strokeDasharray="none"
                    opacity={0.8}
                  />
                  <Bar
                    dataKey="profit"
                    name="Profit/Loss"
                    fill="#8884d8"
                    shape={<RoundedBar />}
                    maxBarSize={60}
                  >
                    {chartData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={
                          entry.profit > 0
                            ? "#10B981" // Emerald-500
                            : entry.profit < 0
                              ? "#EF4444" // Red-500
                              : "transparent"
                        }
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "100%",
                  flexDirection: "column",
                  gap: 2,
                }}
              >
                <div
                  style={{
                    width: "80px",
                    height: "80px",
                    borderRadius: "50%",
                    backgroundColor: "#F3F4F6",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: "16px",
                  }}
                >
                  <svg
                    width="32"
                    height="32"
                    fill="#9CA3AF"
                    viewBox="0 0 24 24"
                  >
                    <path d="M9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4zm2.5 2.5h-15v-15h15v15zm-16.5-16.5v18h18V2H2z" />
                  </svg>
                </div>
                <Typography
                  variant="h6"
                  sx={{
                    color: "#9CA3AF",
                    fontFamily:
                      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                    fontWeight: "600",
                    fontSize: "16px",
                  }}
                >
                  No Data Available
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: "#D1D5DB",
                    fontFamily:
                      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                    fontSize: "14px",
                  }}
                >
                  Try selecting a different year
                </Typography>
              </Box>
            )}
          </Box>
        </div>
      </div>
    </div>
  );
});

ProfitLossAnalysis.displayName = "ProfitLossAnalysis";
export default ProfitLossAnalysis;
