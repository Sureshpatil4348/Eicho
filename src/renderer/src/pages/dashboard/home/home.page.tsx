/* eslint-disable @next/next/no-img-element */
"use client";
import {
  Avatar,
  Box,
  Button,
  Chip,
  FormControlLabel,
  Grid,
  IconButton,
  ImageList,
  ImageListItem,
  Menu,
  MenuItem,
  Paper,
  Select,
  Slide,
  styled,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import AnalysisComponent from "@renderer/components/dashboard/analysis.component";
import CapitalAllocationComponent from "@renderer/components/dashboard/capital-allocation.component";
import MarketComponent from "@renderer/components/dashboard/market.component";
import OverviewComponent from "@renderer/components/dashboard/overview.component";
import RulesComponent from "@renderer/components/dashboard/rules.component";
import StrategiesComponent from "@renderer/components/dashboard/strategies.component";
import TradeHistoryComponent from "@renderer/components/dashboard/trade-history.component";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Tab, TabList, TabPanel, Tabs } from "react-tabs";
import DistributionCirclePiechart from "@renderer/components/dashboard/DistributionCirclePiechart";
import TradeSummary from "@renderer/components/dashboard/TradeSummery";
import ProfitLossAnalysis from "@renderer/components/dashboard/ProfitLossAnalysis";
import TradeTable from "@renderer/components/dashboard/TradeTable.component";

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
  {
    label: "Rules",
    component: <RulesComponent />,
  },
  {
    label: "Market",
    component: <MarketComponent />,
  },
  {
    label: "Analysis",
    component: <AnalysisComponent />,
  },
];

export default function DashboardPage() {
  const IOSSwitch = styled((props) => (
    <Switch
      focusVisibleClassName=".Mui-focusVisible"
      disableRipple
      {...props}
    />
  ))(({ theme }) => ({
    width: 42,
    height: 26,
    padding: 0,
    "& .MuiSwitch-switchBase": {
      padding: 0,
      margin: 2,
      transitionDuration: "300ms",
      "&.Mui-checked": {
        transform: "translateX(16px)",
        color: "#fff",
        "& + .MuiSwitch-track": {
          backgroundColor: "#1FCF43",
          opacity: 1,
          border: 0,
          ...theme.applyStyles("dark", {
            backgroundColor: "#2ECA45",
          }),
        },
        "&.Mui-disabled + .MuiSwitch-track": {
          opacity: 0.5,
        },
      },
      "&.Mui-focusVisible .MuiSwitch-thumb": {
        color: "#33cf4d",
        border: "6px solid #fff",
      },
      "&.Mui-disabled .MuiSwitch-thumb": {
        color: theme.palette.grey[100],
        ...theme.applyStyles("dark", {
          color: theme.palette.grey[600],
        }),
      },
      "&.Mui-disabled + .MuiSwitch-track": {
        opacity: 0.7,
        ...theme.applyStyles("dark", {
          opacity: 0.3,
        }),
      },
    },
    "& .MuiSwitch-thumb": {
      boxSizing: "border-box",
      width: 22,
      height: 22,
    },
    "& .MuiSwitch-track": {
      borderRadius: 26 / 2,
      backgroundColor: "#E9E9EA",
      opacity: 1,
      transition: theme.transitions.create(["background-color"], {
        duration: 500,
      }),
      ...theme.applyStyles("dark", {
        backgroundColor: "#39393D",
      }),
    },
  }));

  const percentage = Math.min((750 / 800) * 100, 100);

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
                    <h3 className="green">+$2,450.00</h3>
                    <p>Balance : $11450.00</p>
                    <p>Equity : $1542.00</p>
                  </div>
                </div>
              </div>
              <div className="dashboard_widget_item">
                <div className="dashboard_widget_item_box">
                  <div className="dashboard_widget_item_box_left">
                    <span>Net Profit</span>
                    <h3 className="green">12%</h3>
                    <p>Net Profit : $4000.00</p>
                  </div>
                </div>
              </div>
              <div className="dashboard_widget_item">
                <div className="dashboard_widget_item_box">
                  <div className="dashboard_widget_item_box_left">
                    <span>Win Rate</span>
                    <h3>68.5%</h3>
                    <p>Success Percentage</p>
                  </div>
                </div>
              </div>
              <div className="dashboard_widget_item">
                <div className="dashboard_widget_item_box">
                  <div className="dashboard_widget_item_box_left">
                    <span>Max Drawdown</span>
                    <h3 className="red">10.5%</h3>
                    <p>
                      Max DD : <span className="red">-$2013.00</span>
                    </p>
                  </div>
                </div>
              </div>
              <div className="dashboard_widget_item">
                <div className="dashboard_widget_item_box">
                  <div className="dashboard_widget_item_box_left">
                    <span>Rules Broken</span>
                    <h3>55</h3>
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
              <div className="head">
                <div className="left">
                  <h4>Account Growth</h4>
                  <p>Percentage growth from initial deposit</p>
                </div>
                <div className="right">
                  <button>1W</button>
                  <button className="active">1M</button>
                  <button>3M</button>
                  <button>1Y</button>
                  <input
                    type="date"
                    className="form-control"
                    value="June 01 - June 29"
                  />
                </div>
              </div>
              <div className="graph">
                <img src="/images/graph.png" alt="" />
                <div className="graph_button_sec">
                  <ul>
                    <li className="green">
                      <div className="arrow">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="22"
                          height="22"
                          viewBox="0 0 22 22"
                          fill="none"
                        >
                          <g clip-path="url(#clip0_485_547)">
                            <path
                              d="M14.0189 11.7663L11.3145 9.06125V16.0083C11.3145 16.3706 11.0205 16.6646 10.6582 16.6646C10.296 16.6646 10.002 16.3706 10.002 16.0083V9.06125L7.29755 11.7656C7.04095 12.0222 6.62555 12.0222 6.36961 11.7656C6.11301 11.5091 6.11301 11.0936 6.36961 10.8377L10.082 7.12533C10.2395 6.96783 10.4548 6.91928 10.6589 6.95538C10.8623 6.91928 11.0782 6.96849 11.2357 7.12533L14.9481 10.8377C15.2047 11.0943 15.2047 11.5097 14.9481 11.7656C14.6909 12.0222 14.2755 12.0222 14.0189 11.7663ZM10.6582 21.9146C4.8596 21.9146 0.158203 17.2138 0.158203 11.4145C0.158203 5.61526 4.8596 0.914549 10.6582 0.914549C16.4568 0.914549 21.1582 5.61594 21.1582 11.4145C21.1582 17.2132 16.4575 21.9146 10.6582 21.9146ZM10.6582 2.22705C5.58406 2.22705 1.4707 6.34041 1.4707 11.4145C1.4707 16.4887 5.58406 20.6021 10.6582 20.6021C15.7323 20.6021 19.8457 16.4887 19.8457 11.4145C19.8457 6.34041 15.7323 2.22705 10.6582 2.22705Z"
                              fill="#1FCF43"
                            />
                          </g>
                          <defs>
                            <clipPath id="clip0_485_547">
                              <rect
                                width="21"
                                height="21"
                                fill="white"
                                transform="matrix(1 0 0 -1 0.158203 21.9146)"
                              />
                            </clipPath>
                          </defs>
                        </svg>
                      </div>
                      <span>Total Growth in %</span>
                      <b>:</b>
                      <b>51%</b>
                    </li>
                    <li className="green">
                      <div className="arrow">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="22"
                          height="22"
                          viewBox="0 0 22 22"
                          fill="none"
                        >
                          <g clip-path="url(#clip0_485_547)">
                            <path
                              d="M14.0189 11.7663L11.3145 9.06125V16.0083C11.3145 16.3706 11.0205 16.6646 10.6582 16.6646C10.296 16.6646 10.002 16.3706 10.002 16.0083V9.06125L7.29755 11.7656C7.04095 12.0222 6.62555 12.0222 6.36961 11.7656C6.11301 11.5091 6.11301 11.0936 6.36961 10.8377L10.082 7.12533C10.2395 6.96783 10.4548 6.91928 10.6589 6.95538C10.8623 6.91928 11.0782 6.96849 11.2357 7.12533L14.9481 10.8377C15.2047 11.0943 15.2047 11.5097 14.9481 11.7656C14.6909 12.0222 14.2755 12.0222 14.0189 11.7663ZM10.6582 21.9146C4.8596 21.9146 0.158203 17.2138 0.158203 11.4145C0.158203 5.61526 4.8596 0.914549 10.6582 0.914549C16.4568 0.914549 21.1582 5.61594 21.1582 11.4145C21.1582 17.2132 16.4575 21.9146 10.6582 21.9146ZM10.6582 2.22705C5.58406 2.22705 1.4707 6.34041 1.4707 11.4145C1.4707 16.4887 5.58406 20.6021 10.6582 20.6021C15.7323 20.6021 19.8457 16.4887 19.8457 11.4145C19.8457 6.34041 15.7323 2.22705 10.6582 2.22705Z"
                              fill="#1FCF43"
                            />
                          </g>
                          <defs>
                            <clipPath id="clip0_485_547">
                              <rect
                                width="21"
                                height="21"
                                fill="white"
                                transform="matrix(1 0 0 -1 0.158203 21.9146)"
                              />
                            </clipPath>
                          </defs>
                        </svg>
                      </div>
                      <span>Sharpe Ratio</span>
                      <b>:</b>
                      <b>51%</b>
                    </li>
                    <li className="black">
                      <div className="arrow">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="22"
                          height="22"
                          viewBox="0 0 22 22"
                          fill="none"
                        >
                          <g clip-path="url(#clip0_481_220)">
                            <path
                              d="M14.8138 11.7663L12.1094 9.06125V16.0083C12.1094 16.3706 11.8154 16.6646 11.4531 16.6646C11.0909 16.6646 10.7969 16.3706 10.7969 16.0083V9.06125L8.09247 11.7656C7.83588 12.0222 7.42047 12.0222 7.16453 11.7656C6.90793 11.5091 6.90793 11.0936 7.16453 10.8377L10.8769 7.12533C11.0344 6.96783 11.2497 6.91928 11.4538 6.95538C11.6573 6.91928 11.8732 6.96849 12.0307 7.12533L15.7431 10.8377C15.9997 11.0943 15.9997 11.5097 15.7431 11.7656C15.4858 12.0222 15.0704 12.0222 14.8138 11.7663ZM11.4531 21.9146C5.65452 21.9146 0.953125 17.2138 0.953125 11.4145C0.953125 5.61526 5.65452 0.914549 11.4531 0.914549C17.2517 0.914549 21.9531 5.61594 21.9531 11.4145C21.9531 17.2132 17.2524 21.9146 11.4531 21.9146ZM11.4531 2.22705C6.37898 2.22705 2.26563 6.34041 2.26563 11.4145C2.26563 16.4887 6.37898 20.6021 11.4531 20.6021C16.5273 20.6021 20.6406 16.4887 20.6406 11.4145C20.6406 6.34041 16.5273 2.22705 11.4531 2.22705Z"
                              fill="black"
                            />
                          </g>
                          <defs>
                            <clipPath id="clip0_481_220">
                              <rect
                                width="21"
                                height="21"
                                fill="white"
                                transform="matrix(1 0 0 -1 0.953125 21.9146)"
                              />
                            </clipPath>
                          </defs>
                        </svg>
                      </div>
                      <span>Total Deposit</span>
                      <b>:</b>
                      <b>$15000.00</b>
                    </li>
                    <li className="red">
                      <div className="arrow">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="22"
                          height="22"
                          viewBox="0 0 22 22"
                          fill="none"
                        >
                          <g clip-path="url(#clip0_481_208)">
                            <path
                              d="M14.7962 11.0628L12.0918 13.7679V6.8208C12.0918 6.45855 11.7978 6.16455 11.4355 6.16455C11.0733 6.16455 10.7793 6.45855 10.7793 6.8208V13.7679L8.0749 11.0635C7.8183 10.8069 7.4029 10.8069 7.14695 11.0635C6.89035 11.3201 6.89035 11.7355 7.14695 11.9914L10.8594 15.7038C11.0169 15.8613 11.2321 15.9098 11.4362 15.8737C11.6397 15.9098 11.8556 15.8606 12.0131 15.7038L15.7255 11.9914C15.9821 11.7348 15.9821 11.3194 15.7255 11.0635C15.4682 10.8069 15.0528 10.8069 14.7962 11.0628ZM11.4355 0.914551C5.63694 0.914551 0.935547 5.61526 0.935547 11.4146C0.935547 17.2138 5.63694 21.9146 11.4355 21.9146C17.2342 21.9146 21.9355 17.2132 21.9355 11.4146C21.9355 5.61594 17.2348 0.914551 11.4355 0.914551ZM11.4355 20.6021C6.3614 20.6021 2.24805 16.4887 2.24805 11.4146C2.24805 6.34041 6.3614 2.22705 11.4355 2.22705C16.5097 2.22705 20.623 6.34041 20.623 11.4146C20.623 16.4887 16.5097 20.6021 11.4355 20.6021Z"
                              fill="#EC4449"
                            />
                          </g>
                          <defs>
                            <clipPath id="clip0_481_208">
                              <rect
                                width="21"
                                height="21"
                                fill="white"
                                transform="translate(0.935547 0.914551)"
                              />
                            </clipPath>
                          </defs>
                        </svg>
                      </div>
                      <span>Total Withdraw</span>
                      <b>:</b>
                      <b>$5000.000</b>
                    </li>
                  </ul>
                </div>
              </div>
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
            <div className="tabs_inside_boxs">
              <div className="head">
                <div className="left">
                  <h4>My Trading Score</h4>
                </div>
                <div className="right">
                  <span style={{ fontWeight: 600, color: "limegreen" }}>
                    {750} / {800}
                  </span>
                </div>
              </div>
              <div className="score_prgoress_bar">
                <div className="progress">
                  <div
                    style={{
                      width: `${percentage}%`,
                      height: "100%",
                      background:
                        "linear-gradient(to right, red, orange, yellow, limegreen)",
                      transition: "width 0.4s ease",
                    }}
                  />
                </div>
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
                      {/* <DistributionCirclePiechart
                        data={state.currencyDistribution}
                        type="currency"
                      /> */}
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
                      <img src="/images/graph-3.png" alt="" />
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
              {/* <TradeSummary ref={registerRef("tradeSummary")} />
              <ProfitLossAnalysis ref={registerRef("profitLoss")} /> */}
            </div>
            {/* <TradeTable ref={registerRef("tradeTable")} /> */}
          </div>
        </div>
      </div>
    </>
  );
}
