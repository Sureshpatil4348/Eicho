import React from 'react'
import { NavLink } from 'react-router-dom'
import { DashboardIcon } from '@renderer/assets/svg/DashboardIcon';
import { PortfolioIcon } from '@renderer/assets/svg/PortfolioIcon';
// import { OrderIcon } from '@renderer/assets/svg/OrderIcon';
// import { FundsIcon } from '@renderer/assets/svg/FundsIcon';
import { SettingsIcon } from '@renderer/assets/svg/SettingsIcon';
// import { AccountIcon } from '@renderer/assets/svg/AccountIcon';

const SidebarComponent: React.FunctionComponent = () => {

  const routes = [
    {
      path: '/dashboard',
      icon: DashboardIcon,
      label: 'Dashboard'
    },
    {
      path: '/dashboard/portfolio',
      icon: PortfolioIcon,
      label: 'Portfolio'
    },
    // {
    //   path: '/dashboard/orders',
    //   icon: OrderIcon,
    //   label: 'Orders'
    // },
    // {
    //   path: '/dashboard/funds',
    //   icon: FundsIcon,
    //   label: 'Funds'
    // },
    {
      path: '/dashboard/account',
      icon: SettingsIcon,
      label: 'Settings'
    },
    // {
    //   path: '/dashboard/account',
    //   icon: AccountIcon,
    //   label: 'Account'
    // }
  ]


  return (
    <div className="dashboard_sidebar">
      <ul>
        {
          routes.map(({ icon: SvgIcon, label, path }) => (
            <li key={path}>
              <NavLink className={({ isActive }) => isActive ? 'active' : ''} to={path} end={path == '/dashboard'}>
                <div className="icon">
                  <SvgIcon sx={{ width: 20, height: 20 }} color='inherit' />
                </div>
                <span>{label}</span>
              </NavLink>
            </li>
          ))
        }
      </ul>
    </div>
  )
}

export default SidebarComponent
