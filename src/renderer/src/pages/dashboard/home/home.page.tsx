import * as React from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import OverviewComponent from '@renderer/components/dashboard/overview.component';
import StrategiesComponent from '@renderer/components/dashboard/strategies.component';
import MarketComponent from '@renderer/components/dashboard/market.component';
import CapitalAllocationComponent from '@renderer/components/dashboard/capital-allocation.component';
import TradeHistoryComponent from '@renderer/components/dashboard/trade-history.component';
import RulesComponent from '@renderer/components/dashboard/rules.component';
import AnalysisComponent from '@renderer/components/dashboard/analysis.component';
import { AuthState } from '@renderer/context/auth.context';
import { API_URL } from '@renderer/utils/constant';
import axios from '@renderer/config/axios';
import toast from 'react-hot-toast';
import { SocketConnect } from '@renderer/socket';

const HomePage: React.FunctionComponent = () => {

  const tabList = [
    {
      label: 'Overview',
      component: <OverviewComponent />
    },
    {
      label: 'Strategies',
      component: <StrategiesComponent />
    },
    {
      label: 'Capital Allocation',
      component: <CapitalAllocationComponent />
    },
    {
      label: 'Trade History',
      component: <TradeHistoryComponent />
    },
    {
      label: 'Rules',
      component: <RulesComponent />
    },
    {
      label: 'Market',
      component: <MarketComponent />
    },
    {
      label: 'Analysis',
      component: <AnalysisComponent />
    }
  ]
  const { userDetails } = AuthState();
  const [dashboardData, setDashboardData]: any = React.useState(null);
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
    SocketConnect()
    getDashboardData()
  }, [])
  return (
    <div className='dashboard_main_body'>
      <div className="dashboard_container dashboard_main_body_container">
        <div className="dashboard_main_sec">
          <div className="dashboard_heading">
            <h2>Dashboard</h2>
          </div>
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
                {
                  tabList.map((item) => (
                    <Tab key={item.label}>{item.label}</Tab>
                  ))
                }
              </TabList>

              {
                tabList.map((item) => (
                  <TabPanel key={item.label}>
                    {item.component}
                  </TabPanel>
                ))
              }
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HomePage
