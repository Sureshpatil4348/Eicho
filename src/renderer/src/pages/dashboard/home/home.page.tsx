import * as React from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import OverviewComponent from '@renderer/components/dashboard/overview.component';
import StrategiesComponent from '@renderer/components/dashboard/strategies.component';
import MarketComponent from '@renderer/components/dashboard/market.component';
import CapitalAllocationComponent from '@renderer/components/dashboard/capital-allocation.component';
import TradeHistoryComponent from '@renderer/components/dashboard/trade-history.component';
import RulesComponent from '@renderer/components/dashboard/rules.component';
import AnalysisComponent from '@renderer/components/dashboard/analysis.component';

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
                <span>Today P&L</span>
                <h3 className='green'>+$2,450.00</h3>
                <p>Balance : $11450.00</p>
              </div>
            </div>
            <div className="dashboard_widget_item">
              <div className="dashboard_widget_item_box">
                <span>Net Profit</span>
                <h3 className='green'>12%</h3>
                <p>Net Profit : $4000.00</p>
              </div>
            </div>
            <div className="dashboard_widget_item">
              <div className="dashboard_widget_item_box">
                <span>Win Rate</span>
                <h3>68.5%</h3>
                <p>Success Percentage</p>
              </div>
            </div>
            <div className="dashboard_widget_item">
              <div className="dashboard_widget_item_box">
                <span>Max Drawdown</span>
                <h3 className='red'>10.5%</h3>
                <p>Max DD : <span className='red'>-$2013.00</span></p>
              </div>
            </div>
            <div className="dashboard_widget_item">
              <div className="dashboard_widget_item_box">
                <span>Rules Broken</span>
                <h3>55</h3>
                <p>No. of Times Rules are Broken</p>
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
