import { Avatar, Box, Menu, MenuItem } from '@mui/material'
import PopupState, { bindMenu, bindTrigger } from 'material-ui-popup-state'
import React from 'react'
import { MdKeyboardArrowDown } from 'react-icons/md'
import { Link } from 'react-router-dom'
import Logo from "@renderer/assets/images/logo.svg";
import Notification from "@renderer/assets/images/notification-icon.svg";
import { useAppDispatch } from '@renderer/services/hook'
import { UserLogoutAction } from '@renderer/services/actions/auth.action'
import { AuthState } from '@renderer/context/auth.context'

const HeaderComponent: React.FunctionComponent = () => {
  const dispatch = useAppDispatch()

  const { userDetails } = AuthState()

  return (
    <header className='dashboard_header'>
      <div className="dashboard_container">
        <div className="logo">
          <Link to="/">
            <img src={Logo} alt="" />
          </Link>
        </div>
        <div className="right_header">
          <div className="notification">
            <Link to="/">
              <img src={Notification} alt="Notification" />
            </Link>
          </div>
          <PopupState variant="popover" popupId="demo-popup-menu">
            {
              (popupState) => (
                <>
                  <figure className="userInfo"  {...bindTrigger(popupState)}>
                    <div className="icon-container">
                      <Avatar sx={{ width: 39, height: 39, backgroundColor: '#E9EFEF', color: '#008080', textTransform: 'uppercase', fontSize: 15 }}>{userDetails?.first_name?.charAt(0)}{userDetails?.last_name?.charAt(0)}</Avatar>
                    </div>
                    <figcaption>{userDetails?.first_name} {userDetails?.last_name}</figcaption>
                    <button type='button' className="down-arow">
                      <MdKeyboardArrowDown />
                    </button>
                  </figure>
                  <Menu {...bindMenu(popupState)} className='theme-menu-dropdown-s2' anchorOrigin={{ vertical: 'bottom', horizontal: 'right', }} transformOrigin={{ vertical: 'top', horizontal: 'right', }}>
                    <MenuItem onClick={() => UserLogoutAction(dispatch)}>
                      <Box className="text-container">Logout</Box>
                    </MenuItem>
                  </Menu>
                </>
              )
            }
          </PopupState>
        </div>
      </div>
    </header>
  )
}

export default HeaderComponent
