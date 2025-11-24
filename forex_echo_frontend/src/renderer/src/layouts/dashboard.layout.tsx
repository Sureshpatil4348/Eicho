import HeaderComponent from '@renderer/components/header/header.component'
import SidebarComponent from '@renderer/components/sidebar/sidebar.component'
import React from 'react'
import { Outlet } from 'react-router-dom'
import ModalLayout from './modal.layout'

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
      <ModalLayout />
    </>
  )
}

export default DashboardLayout
