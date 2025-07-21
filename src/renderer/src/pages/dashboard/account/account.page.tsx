import React from 'react'
import { Link } from 'react-router-dom'

const PortfolioPage: React.FunctionComponent = () => {
  return (
    <>
      <div className="account_main_sec">
        <div className="account_main_box">
          <div className="account_top">
            <div className="account_image_wrap">
              <div className="account_image">

              </div>
              <div className='upload_image'>

              </div>
            </div>
            <div className="account_details">
              <h3>John Simmons</h3>
              <ul>
                <li>
                  <span>(316) 555-0116</span>
                </li>
                <li>
                  <span>jackson.graham@example.com</span>
                </li>
              </ul>
            </div>
          </div>
          <div className="account_bottom">
            <div className="list_wrap">
              <div className="list">
                <Link to="/">
                  <div className="left">
                    <div className="icon">

                    </div>
                    <span>My Profile</span>
                  </div>
                  <div className="right">

                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default PortfolioPage
