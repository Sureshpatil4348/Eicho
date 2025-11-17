import {
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from "react";
import { Box, Typography, CircularProgress } from "@mui/material";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  isSameMonth,
} from "date-fns";
import { formatNumber } from "@renderer/utils/helper";
import toast from "react-hot-toast";
import axios from "@renderer/config/axios";
import { API_URL } from "@renderer/utils/constant";

// const STATIC_DATA = [
//   {
//     "date": "2025-11-01",
//     "profit": 0,
//     "tradeCount": 0,
//     "color": "#e4e4e4"
//   },
//   {
//     "date": "2025-11-02",
//     "profit": 0,
//     "tradeCount": 0,
//     "color": "#e4e4e4"
//   },
// ]
const CalendarDay = ({ day, data, date, isCurrentMonth = true }) => {
  console.log('date', date)
  // Find the day data in the API response
  const dayData = data.find((item: any) => {
    const itemDay = parseInt(format(new Date(item.date), "d"));
    return itemDay === parseInt(day) && isCurrentMonth;
  });

  const hasData = dayData && dayData.tradeCount > 0;
  const dayColor = dayData?.color || "#fff";
  const isProfit = dayData?.profit > 0;

  return (
    <Box
      sx={{
        width: "calc(14.285% - 1px)",
        height: 55,
        border: "1px solid #BCBCBC",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        alignItems: "flex-start",
        backgroundColor: dayColor,
        color: hasData ? (isProfit ? "#fff" : "#fff") : "#f00",
        fontSize: "12px",
        fontWeight: hasData ? "bold" : "normal",
        opacity: isCurrentMonth ? 1 : 0.3,
        cursor: "pointer",
        padding: "4px 4px",
        borderRadius: "2px",
        "&:hover": {
          backgroundColor: dayColor,
          opacity: hasData ? 0.9 : 0.5,
        },
      }}
    >
      <Typography
        variant="body2"
        sx={{ fontSize: "11px", color: hasData ? "#113463" : "#333" }}
      >
        {day}
      </Typography>
      {hasData && (
        <>
          <Typography
            variant="body2"
            sx={{ fontSize: "10px", color: "#113463" }}
          >
            {formatNumber(dayData.profit, "currency")}
          </Typography>
          <Typography
            variant="body2"
            sx={{ fontSize: "9px", color: "#113463" }}
          >
            {dayData.tradeCount} trades
          </Typography>
        </>
      )}
    </Box>
  );
};

export const LegendItem = ({ color, label }) => (
  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
    <Box
      sx={{
        width: 12,
        height: 12,
        backgroundColor: color,
        borderRadius: 0.5,
      }}
    />
    <Typography variant="caption" sx={{ fontSize: "10px", color: "#666" }}>
      {label}
    </Typography>
  </Box>
);

const generateCalendarDays = (date: any) => {
  const monthStart = startOfMonth(date);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });

  const rows: any = [];
  let days: any = [];
  let day = startDate;

  while (day <= endDate) {
    for (let i = 0; i < 7; i++) {
      const dayNumber = format(day, "d");
      days.push({
        date: new Date(day),
        day: dayNumber,
        isCurrentMonth: isSameMonth(day, monthStart),
      });
      day = addDays(day, 1);
    }
    rows.push(days);
    days = [];
  }

  return rows;
};

const daysOfWeek = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

const TradeSummary = forwardRef((props, ref) => {
  console.log(props, ref)
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [tradeData, setTradeData] = useState([]);
  const [loading, setLoading] = useState(false);


  const getTradeSummary = (selectedDate: any): void => {
    setLoading(true);
    axios.get(API_URL.GET_TRADE_SUMMARY + `?month=${format(selectedDate, "M")}&year=${format(selectedDate, "yyyy")}`).then((res) => {
      if (res.data) {
        setTradeData(res.data?.analysis)
        setLoading(false);
      }

    }).catch((err) => {
      if (err.response) {
        toast.error(err.response.data.message)
        setLoading(false);
      } else {
        toast.error(err.message)
      }
    })
  }
  useEffect(() => {
    getTradeSummary(selectedDate);
  }, []);

  useImperativeHandle(ref, () => ({
    refetch: () => {
      getTradeSummary(selectedDate);
    }
  }));
  const calendarDays = generateCalendarDays(selectedDate);

  return (
    <div className="analysis_item_box">
      <div className="tabs_inside_boxs">
        <div className="head">
          <div className="left">
            <h4>Trade Summary</h4>
          </div>
          <div className="right">
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                views={["year", "month"]}
                value={selectedDate}
                onChange={(newDate: any) => {
                  setSelectedDate(newDate);
                }}
                onAccept={(newDate: any) => {
                  // Only fetch data when both year and month are selected
                  if (newDate) {
                    getTradeSummary(newDate);
                  }
                }}
                format="MMM yyyy"
                slotProps={{
                  textField: {
                    size: "small",
                    fullWidth: true,
                  },
                }}
              />
            </LocalizationProvider>
          </div>
        </div>
        <div className="analysis_item_list">
          <Box sx={{ height: 400, width: "100%" }} className="trade_calendar">
            {loading && (
              <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
                <CircularProgress size={30} />
              </Box>
            )}

            {!loading && tradeData.length === 0 && (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "100%",
                }}
              >
                <Typography
                  textAlign={"center"}
                  variant="h6"
                  sx={{ color: "#666" }}
                >
                  No data found
                </Typography>
              </Box>
            )}

            {!loading && tradeData?.length > 0 && (
              <>
                {/* Calendar Header */}
                <Box sx={{ display: "flex", mb: 1 }}>
                  {daysOfWeek.map((day) => (
                    <Box
                      key={day}
                      sx={{
                        width: "10%",
                        maxWidth: "10%",
                        height: 30,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "12px",
                        fontWeight: "400",
                        color: "#000",
                      }}
                    >
                      {day}
                    </Box>
                  ))}
                </Box>

                {/* Calendar Grid */}
                <Box sx={{ mb: 3 }}>
                  {calendarDays.map((week: any, weekIndex: number) => (
                    <Box key={weekIndex} sx={{ display: "flex" }}>
                      {week.map((dayObj: any, dayIndex: number) => (
                        <CalendarDay
                          key={`${weekIndex}-${dayIndex}`}
                          day={dayObj.day}
                          date={dayObj.date}
                          data={tradeData}
                          isCurrentMonth={dayObj.isCurrentMonth}
                        />
                      ))}
                    </Box>
                  ))}
                </Box>

                {/* Legend */}
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    // flexWrap: 'wrap',
                    gap: 2,
                    p: 1,
                    // backgroundColor: '#f9f9f9',
                    borderRadius: 1,
                    mb: 2,
                  }}
                >
                  <LegendItem color="#E4E4E4" label="No Trades" />
                  <LegendItem color="#fe5a5a" label="Min Loss" />
                  <LegendItem color="#fe0605" label="Max Loss" />
                  <LegendItem color="#58ea58" label="Min Profit" />
                  <LegendItem color="#33CB33" label="Max Profit" />
                </Box>

                {/* Summary Statistics */}
                {/* <Box sx={{ p: 2, backgroundColor: '#f5f5f5', borderRadius: 1 }}>
                    <Typography variant="h6" sx={{ fontSize: '14px', fontWeight: 'bold', mb: 1 }}>
                        {format(selectedDate, 'MMMM yyyy')} Summary
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
                        <Box>
                            <Typography variant="body2" sx={{ fontSize: '12px', fontWeight: 'bold' }}>
                                Total Trades: 
                            </Typography>
                            <Typography variant="body2" sx={{ fontSize: '12px' }}>
                                {totalTrades}
                            </Typography>
                        </Box>
                        <Box>
                            <Typography variant="body2" sx={{ fontSize: '12px', fontWeight: 'bold' }}>
                                Profit/Loss: 
                            </Typography>
                            <Typography 
                                variant="body2" 
                                sx={{ 
                                    fontSize: '12px',
                                    color: totalProfit >= 0 ? 'green' : 'red'
                                }}
                            >
                                ${totalProfit.toFixed(2)}
                            </Typography>
                        </Box>
                        <Box>
                            <Typography variant="body2" sx={{ fontSize: '12px', fontWeight: 'bold' }}>
                                Trading Days: 
                            </Typography>
                            <Typography variant="body2" sx={{ fontSize: '12px' }}>
                                {tradingDays}
                            </Typography>
                        </Box>
                    </Box>
                </Box> */}
              </>
            )}
          </Box>
        </div>
      </div>
    </div>
  );
});
TradeSummary.displayName = "TradeSummary";
export default TradeSummary;
