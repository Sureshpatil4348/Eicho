import React from 'react'
import { Link } from 'react-router-dom'
import DashboardMenu from "@renderer/assets/images/dashboard-menu.svg";
import PortfolioMenu from "@renderer/assets/images/portfolio-menu.svg";
import OrderMenu from "@renderer/assets/images/order-menu.svg";
import FundsMenu from "@renderer/assets/images/funds-menu.svg";
import SettingsMenu from "@renderer/assets/images/settings-menu.svg";
import AccountMenu from "@renderer/assets/images/account-menu.svg";

const SidebarComponent: React.FunctionComponent = () => {
  return (
    <div className="dashboard_sidebar">
      <ul>
        <li className='active'>
          <Link to=''>
            <div className="icon">
              <img src={DashboardMenu} />
            </div>
            <span>Dashboard</span>
          </Link>
        </li>
        <li>
          <Link to=''>
            <div className="icon">
              <img src={PortfolioMenu} />
            </div>
            <span>Portfolio</span>
          </Link>
        </li>
        <li>
          <Link to=''>
            <div className="icon">
              <img src={OrderMenu} />
            </div>
            <span>Orders</span>
          </Link>
        </li>
        <li>
          <Link to=''>
            <div className="icon">
              <img src={FundsMenu} />
            </div>
            <span>Funds</span>
          </Link>
        </li>
        <li>
          <Link to=''>
            <div className="icon">
              <img src={SettingsMenu} />
            </div>
            <span>Settings</span>
          </Link>
        </li>
        <li>
          <Link to=''>
            <div className="icon">
              <img src={AccountMenu} />
            </div>
            <span>Account</span>
          </Link>
        </li>
      </ul>
    </div>
  )
}

export default SidebarComponent
