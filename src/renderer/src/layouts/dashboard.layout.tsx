import HeaderComponent from '@renderer/components/header/header.component'
import SidebarComponent from '@renderer/components/sidebar/sidebar.component'
import React from 'react'
import { Outlet } from 'react-router-dom'

const DashboardLayout: React.FunctionComponent = () => {
  return (
    <>
      <HeaderComponent />
      <div className="dashboard_layout">
        <SidebarComponent />
        <div className="main_content_area">
          <Outlet />
        </div>
      </div>
    </>
  )
}

export default DashboardLayout
