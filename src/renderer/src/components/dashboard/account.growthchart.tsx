import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { Box, Paper, Typography } from "@mui/material";
import { format, subDays, subMonths, subYears, startOfDay } from "date-fns";
import toast from "react-hot-toast";
import { DateRange } from "react-date-range";
import classNames from "classnames";
import { FaRegCalendarAlt } from "react-icons/fa";
import { LegendItem } from "./TradeSummery";
import moment from "moment";
import { formatNumber } from "@renderer/utils/helper";
import axios from "@renderer/config/axios";
import { API_URL } from "@renderer/utils/constant";
import LoadingScreen from "@renderer/shared/LoadingScreen";
import GrowthDown from "@renderer/assets/images/growth-down.svg";
import GrowthIcon from "@renderer/assets/images/growth-icon.svg";
import GrowthNormal from "@renderer/assets/images/growth-normal.svg";

// Calculate date ranges based on period
// const STATIC_DATA = [
//   {
//     date: "2025-11-04",
//     formattedDate: "Nov 04",
//     balance: 10000,
//     equity: 9974.98,
//     growthPct: 0,
//     equityGrowthPct: 0,
//     profit: 0,
//   },
//   {
//     date: "2025-11-05",
//     formattedDate: "Nov 05",
//     balance: 9909.04,
//     equity: 9912.91,
//     growthPct: -0.91,
//     equityGrowthPct: -0.62,
//     profit: 0,
//   },
// ];
const getDateRange = (period: any) => {
  const today = new Date();
  let start: any;

  switch (period) {
    case "1W":
      start = subDays(today, 7);
      break;
    case "1M":
      start = subMonths(today, 1);
      break;
    case "3M":
      start = subMonths(today, 3);
      break;
    case "1Y":
      start = subYears(today, 1);
      break;
    default:
      return { start: null, end: null };
  }
  return { start: startOfDay(start), end: today };
};

// Helper function to calculate optimal chart width based on data points
const getChartWidth = (dataLength, period) => {
  const minWidth = 800; // Minimum chart width
  let pointSpacing;

  // More generous spacing for better readability
  if (period === "1Y") {
    pointSpacing = 25; // Increased from 15
  } else if (period === "3M") {
    pointSpacing = 35; // Increased from 20
  } else {
    pointSpacing = 45; // Increased from 25
  }

  return Math.max(minWidth, dataLength * pointSpacing);
};

// Helper function to determine if chart should be scrollable
// const shouldBeScrollable = (period, dataLength, isCustom, customDateRange) => {
//     // Always scroll for 1Y
//     if (period === '1Y') return true;

//     // Always scroll for 3M
//     if (period === '3M') return true;

//     // For custom filters, check if range is more than 2 months
//     if (isCustom && customDateRange[0].startDate && customDateRange[0].endDate) {
//         const start = new Date(customDateRange[0].startDate);
//         const end = new Date(customDateRange[0].endDate);
//         const diffTime = Math.abs(end - start);
//         const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
//         return diffDays > 60; // More than 2 months (60 days)
//     }

//     // Never scroll for 1W and 1M
//     return false;
// };

// Helper function to format X-axis labels based on period and data length
const getXAxisProps = (period, dataLength) => {
  let interval = 0;
  let tickFormatter = (value) => value;
  let angle = 0;
  let textAnchor = "middle";

  if (period === "1Y") {
    // For yearly data, show every 12th point (roughly monthly)
    interval = Math.floor(dataLength / 20) || 12;
    angle = -45;
    textAnchor = "end";
  } else if (period === "3M") {
    // For 3 months, show every 6th point
    interval = Math.floor(dataLength / 15) || 6;
  } else if (period === "1M") {
    // For 1 month, show every 2nd point
    interval = Math.floor(dataLength / 12) || 2;
  } else {
    // For 1 week, show all points
    interval = 0;
  }

  return {
    interval,
    tickFormatter,
    angle,
    textAnchor,
    height: angle !== 0 ? 70 : 50, // More height for rotated labels
  };
};

const AccountGrowthChart = forwardRef((ref: any) => {
  const [growthData, setGrowthData]: any = useState({});
  const [loading, setLoading] = useState(false);
  const [chartData, setChartData]: any = useState([]);
  const [selectedPeriod, setSelectedPeriod] = useState("1w");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [customFilter, setCustomFilter]: any = useState(null);
  const [dateRange, setDateRange] = useState([
    {
      startDate: undefined,
      endDate: undefined,
      key: "selection",
    },
  ]);

  // Initial load
  useEffect(() => {

    const { start, end } = getDateRange("1W");
    setSelectedPeriod("1W");
    if (start && end) {
      fetchGrowthData(start, end);
    }
  }, []);

  useImperativeHandle(ref, () => ({
    refetch: () => {
      const { start, end } = getDateRange("1W");
      start && end && fetchGrowthData(start, end);
    },
  }));

  // Fetch account growth data
  const fetchGrowthData = async (startDate: any, endDate: any) => {
    const params = new URLSearchParams();
    setLoading(true);
    params.append("from_date", format(startDate, "yyyy-MM-dd"));
    params.append("to_date", format(endDate, "yyyy-MM-dd"));
    // params.append("period", selectedPeriod);
    const queryParams = `?${params.toString()}`;

    axios
      .get(API_URL.GET_ACCOUNT_GROWTH + queryParams)
      .then((res) => {

        if (res) {
          setGrowthData(res?.data);
          // Process data for chart
          const history = res?.data?.chart_data || [];
          // If no valid data, create a single point at 0
          if (history.length === 0) {
            const { end } = getDateRange(selectedPeriod);
            const processedData: any = [
              {
                date: format(end || new Date(), "yyyy-MM-dd"),
                formattedDate: format(end || new Date(), "MMM dd"),
                balance: 0,
                equity: 0,
                growthPct: 0,
                equityGrowthPct: 0,
                profit: 0,
              },
            ];
            setChartData(processedData);
            setLoading(false);
            return;
          }

          // Use the growth percentages provided by the backend directly
          const processedData = history.map((item: any) => {
            const itemDate = new Date(item?.date);

            // Different formatting based on period
            let formattedDate;
            if (selectedPeriod === "1Y" || customFilter) {
              // For yearly view, show month and day
              formattedDate = format(itemDate, "MMM dd");
            } else {
              formattedDate = format(itemDate, "MMM dd");
            }

            return {
              date: item?.date,
              formattedDate,
              balance: parseFloat(item?.averageBalance) || 0,
              equity: parseFloat(item?.averageEquity) || 0,
              growthPct: parseFloat(item?.balanceGrowthPct) || 0,
              equityGrowthPct: parseFloat(item?.equityGrowthPct) || 0,
              profit: parseFloat(item?.profit || 0),
            };
          });
          setLoading(false);

          setChartData(processedData);
        }
      })
      .catch((err) => {
        if (err.response) {
          toast.error(err.response.data.message);
        } else {
          toast.error(err.message);
        }
      });
  };

  // Handle period selection
  const handlePeriodSelect = (period) => {
    setSelectedPeriod(period);
    if (customFilter) {
      setDateRange([
        {
          startDate: undefined,
          endDate: undefined,
          key: "selection",
        },
      ]);
    }
    setCustomFilter(false);
    const { start, end } = getDateRange(period);
    if (start && end) {
      fetchGrowthData(start, end);
    }
  };

  // Custom tooltip for chart
  const CustomTooltip = ({ active, payload }: any) => {
    // console.log(payload, "payload");
    if (active && payload && payload.length) {
      const balanceData = payload.find((p) => p.dataKey === "growthPct");
      const equityData = payload.find((p) => p.dataKey === "equityGrowthPct");

      return (
        <Paper
          elevation={3}
          sx={{
            p: 2,
            border: 1,
            borderColor: "grey.200",
            bgcolor: "background.paper",
          }}
        >
          <Typography
            variant="body2"
            color="text.secondary"
            fontWeight="medium"
          >
            {`Date: ${moment(payload?.[0]?.payload?.date).format(
              "MMM DD, YYYY"
            )}`}
          </Typography>
          {balanceData && (
            <Typography variant="body2" color="text.secondary">
              {`Balance: $${balanceData.payload?.balance?.toLocaleString()}`}
            </Typography>
          )}
          {equityData && (
            <Typography variant="body2" color="text.secondary">
              {`Equity: $${equityData.payload?.equity?.toLocaleString()}`}
            </Typography>
          )}
        </Paper>
      );
    }
    return null;
  };

  const calculateSummaryStats = () => {
    const totalGrowthPct = growthData?.totalGrowthPct || 0;
    const sharpeRatio = growthData?.sharpeRatio || 0;
    const totalDeposit = formatNumber(
      growthData?.totalDeposit || 0,
      "currency"
    );
    const totalWithdraw = formatNumber(
      growthData?.totalWithdraw || 0,
      "currency"
    );

    return {
      totalGrowthPct: parseFloat(totalGrowthPct).toFixed(2),
      sharpeRatio: parseFloat(sharpeRatio).toFixed(2),
      totalDeposit: totalDeposit,
      totalWithdraw: totalWithdraw,
    };
  };

  const stats = calculateSummaryStats();

  const handleDateRangeChange = (ranges) => {
    const { startDate, endDate } = ranges.selection;
    setDateRange([
      {
        startDate: startDate || undefined,
        endDate: endDate || undefined,
        key: "selection",
      },
    ]);
  };

  const handleCancelFilter = () => {
    setShowDatePicker(false);
    setCustomFilter(false);
    setDateRange([
      {
        startDate: undefined,
        endDate: undefined,
        key: "selection",
      },
    ]);
    setSelectedPeriod("1W");
    const { start, end } = getDateRange("1W");
    fetchGrowthData(start, end);
  };

  const applyDateFilter = () => {
    if (!dateRange[0].startDate || !dateRange[0].endDate) {
      toast.error("Please select both start and end dates");
      return;
    }
    setShowDatePicker(false);
    setCustomFilter(true);
    setSelectedPeriod("");
    fetchGrowthData(dateRange[0].startDate, dateRange[0].endDate);
  };

  const getYAxisDomain = () => {
    if (chartData.length === 0) return [-10, 10];

    const allGrowthValues = chartData.flatMap((item) => [
      item.growthPct || 0,
      item.equityGrowthPct || 0,
    ]);

    const minValue = Math.min(...allGrowthValues);
    const maxValue = Math.max(...allGrowthValues);

    const padding = Math.max(1, Math.abs(maxValue - minValue) * 0.1);

    return [Math.floor(minValue - padding), Math.ceil(maxValue + padding)];
  };

  // Get chart configuration based on current period and data
  const chartWidth = getChartWidth(chartData.length, selectedPeriod);
  const xAxisProps = getXAxisProps(selectedPeriod, chartData.length);
  const isScrollableChart = chartData.length > 30 || selectedPeriod === "1Y";

  return (
    <>
      {loading && <LoadingScreen />}
      <div className="head">
        <div className="left">
          <h4>Account Growth</h4>
          <p>Percentage growth from initial deposit</p>
        </div>
        <div className="right">
          {["1W", "1M", "3M", "1Y"].map((period) => (
            <button
              key={period}
              onClick={() => handlePeriodSelect(period)}
              className={
                selectedPeriod === period && !customFilter ? "active" : ""
              }
            >
              {period}
            </button>
          ))}
          <div className="custom_datepicker_main">
            <button
              className={classNames("date_filter_btn form-control", {
                active: customFilter,
              })}
              onClick={() => setShowDatePicker(!showDatePicker)}
            >
              <FaRegCalendarAlt />
              {dateRange[0].startDate
                ? format(dateRange[0].startDate, "MMM dd, yyyy")
                : "Start Date"}{" "}
              -{" "}
              {dateRange[0].endDate
                ? format(dateRange[0].endDate, "MMM dd, yyyy")
                : "End Date"}
            </button>
            {showDatePicker && (
              <div className="date_range_picker custom_datepicker">
                <DateRange
                  editableDateInputs={true}
                  onChange={handleDateRangeChange}
                  moveRangeOnFirstSelection={false}
                  ranges={dateRange}
                />
                <div className="date_range_actions">
                  <button
                    className="calendar_button calendar_button_border"
                    onClick={handleCancelFilter}
                  >
                    Cancel
                  </button>
                  <button className="calendar_button" onClick={applyDateFilter}>
                    Apply
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="graph">
        <Box
          sx={{
            height: 450,
            width: "100%",
            // Enable horizontal scrolling for large datasets
            overflowX: isScrollableChart ? "auto" : "visible",
            msOverflowStyle: "-ms-autohiding-scrollbar",
            "&::-webkit-scrollbar": { display: "none" },
            scrollbarWidth: "none", // Firefox
            // msOverflowStyle: 'none',
            overflowY: "hidden",
          }}
        >
          {chartData.length > 0 ? (
            <ResponsiveContainer
              width={isScrollableChart ? chartWidth : "100%"}
              height="100%"
            >
              <LineChart
                data={chartData}
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  // bottom: xAxisProps.height
                  bottom: 20,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis
                  dataKey="formattedDate"
                  tick={{ fontSize: 12 }}
                  stroke="#666"
                  interval={xAxisProps.interval}
                  angle={xAxisProps.angle}
                  textAnchor={xAxisProps.textAnchor}
                  height={xAxisProps.height}
                  tickFormatter={xAxisProps.tickFormatter}
                />
                <YAxis
                  tick={{ fontSize: 12 }}
                  stroke="#666"
                  domain={getYAxisDomain()}
                  tickFormatter={(value) => `${value.toFixed(2)}%`}
                />
                <Tooltip content={<CustomTooltip />} />
                <ReferenceLine
                  y={0}
                  stroke="#666"
                  strokeDasharray="2 2"
                  label={{
                    value: "0%",
                    position: "left",
                    offset: 10,
                    fontSize: 13,
                  }}
                />

                {/* Balance Growth Line (Blue) */}
                <Line
                  type="monotone"
                  dataKey="growthPct"
                  stroke="#050FD4"
                  strokeWidth={2}
                  dot={{ fill: "#050FD4", strokeWidth: 2, r: 4 }}
                  activeDot={{
                    r: 6,
                    stroke: "#050FD4",
                    strokeWidth: 2,
                    fill: "white",
                  }}
                  name="Balance Growth"
                  connectNulls={false}
                />

                {/* Equity Growth Line (Green) */}
                <Line
                  type="monotone"
                  dataKey="equityGrowthPct"
                  stroke="#1FCF43"
                  strokeWidth={2}
                  dot={{ fill: "#1FCF43", strokeWidth: 2, r: 4 }}
                  activeDot={{
                    r: 6,
                    stroke: "#1FCF43",
                    strokeWidth: 2,
                    fill: "white",
                  }}
                  name="Equity Growth"
                  connectNulls={false}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <Box
              sx={{
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "text.secondary",
              }}
            >
              <Typography variant="h6">
                No data available for the selected period
              </Typography>
            </Box>
          )}
        </Box>

        {/* Show scrolling hint for large datasets */}
        {/* {isScrollableChart && chartData.length > 0 && (
                    <Box sx={{
                        textAlign: 'center',
                        mt: 1,
                        color: 'text.secondary',
                        fontSize: '0.875rem'
                    }}>
                        Scroll horizontally to view all points
                    </Box>
                )} */}

        <div className="graph_button_sec">
          <ul>
            <li
              className={
                stats.totalGrowthPct.split("").includes("-") ? "red" : "green"
              }
            >
              <div className="arrow">
                {stats.totalGrowthPct.split("").includes("-") ? (
                  <img src={GrowthDown} alt="arrow-down" />
                ) : (
                  <img src={GrowthIcon} alt="arrow-up" />
                )}
              </div>
              <span>Total Growth in %</span>
              <b>:</b>
              <b>{stats.totalGrowthPct}%</b>
            </li>
            <li
              className={
                stats.sharpeRatio.split("").includes("-") ? "red" : "green"
              }
            >
              <div className="arrow">
                {stats.sharpeRatio.split("").includes("-") ? (
                  <img src={GrowthDown} alt="arrow-down" />
                ) : (
                  <img src={GrowthIcon} alt="arrow-up" />
                )}
              </div>
              <span>Sharpe Ratio</span>
              <b>:</b>
              <b>{stats.sharpeRatio}</b>
            </li>
            <li className="black">
              <div className="arrow">
                <img src={GrowthNormal} alt="arrow-up-normal" />
              </div>
              <span>Total Deposit</span>
              <b>:</b>
              <b>{growthData?.initial_deposit}</b>
            </li>
            <li
              className={
                stats.totalWithdraw.split("").includes("-") ? "red" : "green"
              }
            >
              <div className="arrow">
                {stats.totalWithdraw.split("").includes("-") ? (
                  <img src={GrowthDown} alt="arrow-down" />
                ) : (
                  <img src={GrowthIcon} alt="arrow-up" />
                )}
              </div>
              <span>Total Withdraw</span>
              <b>:</b>
              <b>{stats.totalWithdraw}</b>
            </li>
          </ul>
        </div>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 2,
            p: 1,
            borderRadius: 1,
            mt: 2,
            mb: 1,
          }}
        >
          <LegendItem color="#1FCF43" label="Equity Growth" />
          <LegendItem color="#050FD4" label="Balance Growth" />
        </Box>
      </div>
    </>
  );
});

AccountGrowthChart.displayName = "AccountGrowthChart";
export default AccountGrowthChart;
