/* eslint-disable @next/next/no-img-element */
"use client";
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
// import AnalysisComponent from "@renderer/components/dashboard/analysis.component";
import CapitalAllocationComponent from "@renderer/components/dashboard/capital-allocation.component";
// import MarketComponent from "@renderer/components/dashboard/market.component";
import OverviewComponent from "@renderer/components/dashboard/overview.component";
// import RulesComponent from "@renderer/components/dashboard/rules.component";
import StrategiesComponent from "@renderer/components/dashboard/strategies.component";
import TradeHistoryComponent from "@renderer/components/dashboard/trade-history.component";
import React, { useRef } from "react";
import { Tab, TabList, TabPanel, Tabs } from "react-tabs";
import { AuthState } from "@renderer/context/auth.context";
import { API_URL } from "@renderer/utils/constant";
import toast from "react-hot-toast";
import axios from "@renderer/config/axios";
import AccountGrowthChart from "@renderer/components/dashboard/account.growthchart";
import TradeSummary from "@renderer/components/dashboard/TradeSummery";
import ProfitLossAnalysis from "@renderer/components/dashboard/ProfitLossAnalysis";
import TradeTable from "@renderer/components/dashboard/TradeTable.component";
import DistributionCirclePiechart from "@renderer/components/dashboard/DistributionCirclePiechart";
import TradingMeter from "@renderer/components/dashboard/TradingMeter";

const tabList = [
  {
    label: "Overview",
    component: <OverviewComponent />,
  },
  {
    label: "Strategies",
    component: <StrategiesComponent />,
  },
  {
    label: "Capital Allocation",
    component: <CapitalAllocationComponent />,
  },
  {
    label: "Trade History",
    component: <TradeHistoryComponent />,
  },
  // {
  //   label: "Rules",
  //   component: <RulesComponent />,
  // },
  // {
  //   label: "Market",
  //   component: <MarketComponent />,
  // },
  // {
  //   label: "Analysis",
  //   component: <AnalysisComponent />,
  // },
];

export default function DashboardPage() {
  const { userDetails } = AuthState();
  const refs = useRef({});

  const [dashboardData, setDashboardData]: any = React.useState(null);
  const registerRef = (name: any) => {
    return (instance) => {
      refs.current[name] = instance;
    };
  };
  const getDashboardData = (): void => {
    axios.get(API_URL.GET_DASHBOARD_HISTORY(userDetails?.id)).then((res) => {
      setDashboardData(res.data.trading_performance)
    }).catch((err) => {
      if (err.response) {
        toast.error(err.response.data.message)
      } else {
        toast.error(err.message)
      }
    })
  }
  React.useEffect(() => {
    getDashboardData()
  }, [])

  // const percentage = Math.min((750 / 800) * 100, 100);

  return (
    <>
      <div className="main_content_area">
        <div className="child_contentarea">
          {/* <div className="main_title">
            <h4 className="fontweight_400">Dashboard</h4>
          </div> */}
          <div className="advance_widget_wrap">
            {/* <div className="advance_widget_wrap_box_item">
              <div className="left">
                <h4>AI Insights</h4>
                <ul>
                  <li>EUR/USD - Consolidation Breakout Expected</li>
                  <li>USD/JPY - Overbought Zone Alert</li>
                  <li>GBP/USD - Upside Momentum Building</li>
                  <li>AUD/USD - Reversal Signs Emerging</li>
                </ul>
              </div>
              <div className="right">
                <div className="image">
                  <img src="/images/advance-icon-1.png" alt="" />
                </div>
              </div>
            </div>
            <div
              className="advance_widget_wrap_box_item advance_widget_wrap_box_item_2"
              style={{
                backgroundImage: "url('/images/advance-icon-2-bg.png')",
              }}
            >
              <div className="left">
                <h3>Trading Score</h3>
                <p>What is Your Trading Score Checkout For Free</p>
                <div className="button">
                  <Link href="/">Check Trading Score</Link>
                </div>
              </div>
              <div className="right">
                <img src="/images/trending-score.png" alt="" />
              </div>
            </div> */}
            <div className="dashboard_widget">
              <div className="dashboard_widget_item">
                <div className="dashboard_widget_item_box">
                  <div className="dashboard_widget_item_box_left">
                    <span>Today P&L</span>
                    <h3 className='green'>$ {dashboardData?.daily_profit_loss}</h3>
                    <p>Balance : ${userDetails?.mt5_status?.account_balance}</p>
                  </div>
                </div>
              </div>
              <div className="dashboard_widget_item">
                <div className="dashboard_widget_item_box">
                  <div className="dashboard_widget_item_box_left">
                    <span>Net Profit</span>
                    <h3 className='green'>{dashboardData?.total_profit_percentage}%</h3>
                    <p>Net Profit : ${dashboardData?.total_profit_loss}</p>
                  </div>
                </div>
              </div>
              <div className="dashboard_widget_item">
                <div className="dashboard_widget_item_box">
                  <div className="dashboard_widget_item_box_left">
                    <span>Win Rate</span>
                    <h3>{dashboardData?.win_rate}%</h3>
                    <p>Success Percentage</p>
                  </div>
                </div>
              </div>
              <div className="dashboard_widget_item">
                <div className="dashboard_widget_item_box">
                  <div className="dashboard_widget_item_box_left">
                    <span>Max Drawdown</span>
                    <h3 className='red'>{dashboardData?.maximum_drawdown_percentage}%</h3>
                    <p>Max DD : <span className='red'>-${dashboardData?.maximum_drawdown}</span></p>
                  </div>
                </div>
              </div>
              <div className="dashboard_widget_item">
                <div className="dashboard_widget_item_box">
                  <div className="dashboard_widget_item_box_left">
                    <span>Rules Broken</span>
                    <h3>0</h3>
                    <p>No. of Times Rules are Broken</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="dashboard_tabs_sec">
              <Tabs>
                <TabList>
                  {tabList.map((item) => (
                    <Tab key={item.label}>{item.label}</Tab>
                  ))}
                </TabList>

                {tabList.map((item) => (
                  <TabPanel key={item.label}>{item.component}</TabPanel>
                ))}
              </Tabs>
            </div>

            <div className="tabs_inside_boxs">
              <AccountGrowthChart ref={registerRef('growthChart')} />
            </div>
            <div className="tabs_inside_boxs">
              <div className="head">
                <div className="left">
                  <h4>Advanced Statistics</h4>
                </div>
              </div>
              <div className="advance_statics_wrap">
                <div className="advance_statics_box">
                  <ul>
                    <li>
                      <span>Trades</span>
                      <span>103</span>
                    </li>
                    <li>
                      <span>Buy Trades Win % & Number</span>
                      <span>56% (43)</span>
                    </li>
                    <li>
                      <span>Sell Trades Win % & Number</span>
                      <span>46% (63)</span>
                    </li>
                    <li>
                      <span>Total Win/Loss in % and Number</span>
                      <span>89% (54)</span>
                    </li>
                    <li>
                      <span>Avg. Loss</span>
                      <span>-$243</span>
                    </li>
                    <li>
                      <span>Avg. Profit</span>
                      <span>$512</span>
                    </li>
                  </ul>
                </div>
                <div className="advance_statics_box">
                  <ul>
                    <li>
                      <span>Trades</span>
                      <span>103</span>
                    </li>
                    <li>
                      <span>Buy Trades Win % & Number</span>
                      <span>56% (43)</span>
                    </li>
                    <li>
                      <span>Sell Trades Win % & Number</span>
                      <span>46% (63)</span>
                    </li>
                    <li>
                      <span>Total Win/Loss in % and Number</span>
                      <span>89% (54)</span>
                    </li>
                    <li>
                      <span>Avg. Loss</span>
                      <span>-$243</span>
                    </li>
                    <li>
                      <span>Avg. Profit</span>
                      <span>$512</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="tabs_inside_boxs" id='trading-score-meter'>
              <div className="head">
                <div className="left">
                  <h4>My Trading Score</h4>
                </div>
              </div>
              <div className="score_prgoress_bar">
                <TradingMeter score={510} />
              </div>
            </div>
            <div className="analysis_wrap">
              <div className="analysis_item_box">
                <div className="tabs_inside_boxs">
                  <div className="head">
                    <div className="left">
                      <h4>Currency Distribution</h4>
                    </div>
                  </div>
                  <div className="analysis_item_list">
                    <div className="left">
                      <DistributionCirclePiechart
                        data={[
                          {
                            "currency": "GBPNZD",
                            "profit": -85.14,
                            "tradeCount": 3
                          },
                          {
                            "currency": "AUDCAD",
                            "profit": 133.23,
                            "tradeCount": 1
                          },
                          {
                            "currency": "XAUUSD",
                            "profit": -467.62,
                            "tradeCount": 3
                          }
                        ]}
                        type="currency"
                      />
                    </div>
                    <div className="right">
                      <div className="analysis_table">
                        <TableContainer component={Paper}>
                          <Table
                            sx={{ minWidth: 650 }}
                            aria-label="simple table"
                          >
                            <TableHead>
                              <TableRow>
                                <TableCell>Currency</TableCell>
                                <TableCell>Profit</TableCell>
                                <TableCell>No. of Trades</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              <TableRow
                                sx={{
                                  "&:last-child td, &:last-child th": {
                                    border: 0,
                                  },
                                }}
                              >
                                <TableCell scope="row">
                                  <div className="d-flex align-items-center">
                                    <Box
                                      width={16}
                                      height={16}
                                      borderRadius={"100%"}
                                      sx={{ backgroundColor: "#05D4C0" }}
                                    ></Box>
                                    EUR / USD
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <span className="green">$1250.00</span>
                                </TableCell>
                                <TableCell>
                                  <span className="gray">45 Trades</span>
                                </TableCell>
                              </TableRow>
                              <TableRow
                                sx={{
                                  "&:last-child td, &:last-child th": {
                                    border: 0,
                                  },
                                }}
                              >
                                <TableCell scope="row">
                                  <div className="d-flex">
                                    <Box
                                      width={16}
                                      height={16}
                                      borderRadius={"100%"}
                                      sx={{ backgroundColor: "#8C5CF4" }}
                                    ></Box>
                                    GBP / USD
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <span className="green">$1250.00</span>
                                </TableCell>
                                <TableCell>
                                  <span className="gray">45 Trades</span>
                                </TableCell>
                              </TableRow>
                              <TableRow
                                sx={{
                                  "&:last-child td, &:last-child th": {
                                    border: 0,
                                  },
                                }}
                              >
                                <TableCell scope="row">
                                  <div className="d-flex">
                                    <Box
                                      width={16}
                                      height={16}
                                      borderRadius={"100%"}
                                      sx={{ backgroundColor: "#EF4445" }}
                                    ></Box>
                                    USD / JPY
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <span className="green">$1250.00</span>
                                </TableCell>
                                <TableCell>
                                  <span className="gray">45 Trades</span>
                                </TableCell>
                              </TableRow>
                              <TableRow
                                sx={{
                                  "&:last-child td, &:last-child th": {
                                    border: 0,
                                  },
                                }}
                              >
                                <TableCell scope="row">
                                  <div className="d-flex">
                                    <Box
                                      width={16}
                                      height={16}
                                      borderRadius={"100%"}
                                      sx={{ backgroundColor: "#F49F0B" }}
                                    ></Box>
                                    AUD / USD
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <span className="green">$1250.00</span>
                                </TableCell>
                                <TableCell>
                                  <span className="gray">45 Trades</span>
                                </TableCell>
                              </TableRow>
                              <TableRow
                                sx={{
                                  "&:last-child td, &:last-child th": {
                                    border: 0,
                                  },
                                }}
                              >
                                <TableCell scope="row">
                                  <div className="d-flex">
                                    <Box
                                      width={16}
                                      height={16}
                                      borderRadius={"100%"}
                                      sx={{ backgroundColor: "#3D82F6" }}
                                    ></Box>
                                    GBP / JPY
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <span className="green">$1250.00</span>
                                </TableCell>
                                <TableCell>
                                  <span className="gray">45 Trades</span>
                                </TableCell>
                              </TableRow>
                            </TableBody>
                          </Table>
                        </TableContainer>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="analysis_item_box">
                <div className="tabs_inside_boxs">
                  <div className="head">
                    <div className="left">
                      <h4>Trade Season Analysis</h4>
                    </div>
                  </div>
                  <div className="analysis_item_list">
                    <div className="left">
                      <DistributionCirclePiechart data={[
                        {
                          "currency": "GBPNZD",
                          "profit": -85.14,
                          "tradeCount": 3
                        },
                        {
                          "currency": "AUDCAD",
                          "profit": 133.23,
                          "tradeCount": 1
                        },
                        {
                          "currency": "XAUUSD",
                          "profit": -467.62,
                          "tradeCount": 3
                        }
                      ]} type="season" />
                    </div>
                    <div className="right">
                      <div className="analysis_table">
                        <TableContainer component={Paper}>
                          <Table
                            sx={{ minWidth: 650 }}
                            aria-label="simple table"
                          >
                            <TableHead>
                              <TableRow>
                                <TableCell>Session</TableCell>
                                <TableCell>Profit</TableCell>
                                <TableCell>No. of Trades</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              <TableRow
                                sx={{
                                  "&:last-child td, &:last-child th": {
                                    border: 0,
                                  },
                                }}
                              >
                                <TableCell scope="row">
                                  <div className="d-flex">
                                    <Box
                                      width={16}
                                      height={16}
                                      borderRadius={"100%"}
                                      sx={{ backgroundColor: "#050FD4" }}
                                    ></Box>
                                    London
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <span className="green">$1250.00</span>
                                </TableCell>
                                <TableCell>
                                  <span className="gray">45 Trades</span>
                                </TableCell>
                              </TableRow>
                              <TableRow
                                sx={{
                                  "&:last-child td, &:last-child th": {
                                    border: 0,
                                  },
                                }}
                              >
                                <TableCell scope="row">
                                  <div className="d-flex">
                                    <Box
                                      width={16}
                                      height={16}
                                      borderRadius={"100%"}
                                      sx={{ backgroundColor: "#5CABF4" }}
                                    ></Box>
                                    New York
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <span className="green">$1250.00</span>
                                </TableCell>
                                <TableCell>
                                  <span className="gray">45 Trades</span>
                                </TableCell>
                              </TableRow>
                              <TableRow
                                sx={{
                                  "&:last-child td, &:last-child th": {
                                    border: 0,
                                  },
                                }}
                              >
                                <TableCell scope="row">
                                  <div className="d-flex">
                                    <Box
                                      width={16}
                                      height={16}
                                      borderRadius={"100%"}
                                      sx={{ backgroundColor: "#D8A240" }}
                                    ></Box>
                                    Tokyo
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <span className="green">$1250.00</span>
                                </TableCell>
                                <TableCell>
                                  <span className="gray">45 Trades</span>
                                </TableCell>
                              </TableRow>
                              <TableRow
                                sx={{
                                  "&:last-child td, &:last-child th": {
                                    border: 0,
                                  },
                                }}
                              >
                                <TableCell scope="row">
                                  <div className="d-flex">
                                    <Box
                                      width={16}
                                      height={16}
                                      borderRadius={"100%"}
                                      sx={{ backgroundColor: "#F40B70" }}
                                    ></Box>
                                    Sydney
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <span className="green">$1250.00</span>
                                </TableCell>
                                <TableCell>
                                  <span className="gray">45 Trades</span>
                                </TableCell>
                              </TableRow>
                              <TableRow
                                sx={{
                                  "&:last-child td, &:last-child th": {
                                    border: 0,
                                  },
                                }}
                              >
                                <TableCell scope="row">
                                  <div className="d-flex">
                                    <Box
                                      width={16}
                                      height={16}
                                      borderRadius={"100%"}
                                      sx={{ backgroundColor: "#05D7C2" }}
                                    ></Box>
                                    Overlap
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <span className="green">$1250.00</span>
                                </TableCell>
                                <TableCell>
                                  <span className="gray">45 Trades</span>
                                </TableCell>
                              </TableRow>
                            </TableBody>
                          </Table>
                        </TableContainer>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="analysis_wrap">
              <TradeSummary ref={registerRef("tradeSummary")} />
              <ProfitLossAnalysis ref={registerRef("profitLoss")} />
            </div>
            <TradeTable ref={registerRef("tradeTable")} />
          </div>
        </div>
      </div>
    </>
  );
}
