/* eslint-disable @next/next/no-img-element */
"use client";
// import AnalysisComponent from "@renderer/components/dashboard/analysis.component";
import CapitalAllocationComponent from "@renderer/components/dashboard/capital-allocation.component";
// import MarketComponent from "@renderer/components/dashboard/market.component";
import OverviewComponent from "@renderer/components/dashboard/overview.component";
// import RulesComponent from "@renderer/components/dashboard/rules.component";
import StrategiesComponent from "@renderer/components/dashboard/strategies.component";
import TradeHistoryComponent from "@renderer/components/dashboard/trade-history.component";
import React from "react";
import { Tab, TabList, TabPanel, Tabs } from "react-tabs";
import { AuthState } from "@renderer/context/auth.context";
import { API_URL } from "@renderer/utils/constant";
import toast from "react-hot-toast";
import axios from "@renderer/config/axios";
import { IoMdArrowBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";

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

export default function StrategyDetails() {
  const { userDetails } = AuthState();
  const router = useNavigate();

  const [dashboardData, setDashboardData]: any = React.useState(null);

  const getDashboardData = (): void => {
    axios
      .get(API_URL.GET_DASHBOARD_HISTORY(userDetails?.id))
      .then((res) => {
        setDashboardData(res.data.trading_performance);
      })
      .catch((err) => {
        if (err.response) {
          toast.error(err.response.data.message);
        } else {
          toast.error(err.message);
        }
      });
  };
  React.useEffect(() => {
    getDashboardData();
  }, []);

  // const percentage = Math.min((750 / 800) * 100, 100);

  return (
    <>
      <div className="child_contentarea">
        {/* <div className="main_title">
            <h4 className="fontweight_400">Dashboard</h4>
          </div> */}
        <div className="dashboard_heading">
          <div className="back_button">
            <button onClick={() => router(-1)}>
              {" "}
              <IoMdArrowBack /> <span>Back</span>
            </button>
          </div>
          <div className="head">
            <h3>
              Mean-reversion strategy with grid trading for gold and forex pairs
            </h3>
          </div>
        </div>
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
                  <h3 className="green">
                    $ {dashboardData?.daily_profit_loss}
                  </h3>
                  <p>Balance : ${userDetails?.mt5_status?.account_balance}</p>
                </div>
              </div>
            </div>
            <div className="dashboard_widget_item">
              <div className="dashboard_widget_item_box">
                <div className="dashboard_widget_item_box_left">
                  <span>Net Profit</span>
                  <h3 className="green">
                    {dashboardData?.total_profit_percentage}%
                  </h3>
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
                  <h3 className="red">
                    {dashboardData?.maximum_drawdown_percentage}%
                  </h3>
                  <p>
                    Max DD :{" "}
                    <span className="red">
                      -${dashboardData?.maximum_drawdown}
                    </span>
                  </p>
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
        </div>
      </div>
    </>
  );
}
