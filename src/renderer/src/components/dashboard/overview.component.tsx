import React from 'react'
import { Link } from 'react-router-dom'
import Graph from "@renderer/assets/images/graph.png";

const OverviewComponent: React.FunctionComponent = () => {
  return (
    <React.Fragment>
      <div className="tabs_inside_boxs">
        <div className="head">
          <div className="left">
            <h4>Account Growth</h4>
            <p>Percentage growth from initial deposit</p>
          </div>
          <div className="right">
            <button>1W</button>
            <button className='active'>1M</button>
            <button>3M</button>
            <button>1Y</button>
          </div>
        </div>
        <div className='graph'>
          <img src={Graph} alt='' />
        </div>
      </div>
      <div className="tabs_inside_boxs">
        <div className="head">
          <div className="left">
            <h4>Strategy Performance</h4>
            <p>Performance metrics and comparison of different strategies</p>
          </div>
        </div>
        <div className="dashboard_perfomance">
          <div className="dashboard_perfomance_itmes">
            <div className="top">
              <div className="left">
                <h4>Trend Following Pro</h4>
              </div>
              <div className="right">
                <div className="round"></div>
              </div>
            </div>
            <div className="bottom">
              <ul>
                <li>
                  <h5>24</h5>
                  <p>Trades:</p>
                </li>
                <li>
                  <h5>68%</h5>
                  <p>Trades:</p>
                </li>
                <li>
                  <h5>25%</h5>
                  <p>Allocation:</p>
                </li>
                <li className='green'>
                  <h5>$2847.50</h5>
                  <p>+3.2%</p>
                </li>
                <li className='pairs'>
                  <p>Pairs:</p>
                  <span>EURUSD</span>
                  <span>GBPUSD</span>
                  <span>XAUUSD</span>
                </li>
              </ul>
              <div className="progress_bar">
                <div className="bar" style={{ width: "60%" }}>
                </div>
              </div>
            </div>
          </div>
          <div className="dashboard_perfomance_itmes">
            <div className="top">
              <div className="left">
                <h4>Trend Following Pro</h4>
              </div>
              <div className="right">
                <div className="round yellow"></div>
              </div>
            </div>
            <div className="bottom">
              <ul>
                <li>
                  <h5>24</h5>
                  <p>Trades:</p>
                </li>
                <li>
                  <h5>68%</h5>
                  <p>Trades:</p>
                </li>
                <li>
                  <h5>25%</h5>
                  <p>Allocation:</p>
                </li>
                <li className='green'>
                  <h5>$2847.50</h5>
                  <p>+3.2%</p>
                </li>
                <li className='pairs'>
                  <p>Pairs:</p>
                  <span>EURUSD</span>
                  <span>GBPUSD</span>
                  <span>XAUUSD</span>
                </li>
              </ul>
              <div className="progress_bar">
                <div className="bar" style={{ width: "60%" }}>
                </div>
              </div>
            </div>
          </div>
          <div className="dashboard_perfomance_itmes">
            <div className="top">
              <div className="left">
                <h4>Trend Following Pro</h4>
              </div>
              <div className="right">
                <div className="round yellow"></div>
              </div>
            </div>
            <div className="bottom">
              <ul>
                <li>
                  <h5>24</h5>
                  <p>Trades:</p>
                </li>
                <li>
                  <h5>68%</h5>
                  <p>Trades:</p>
                </li>
                <li>
                  <h5>25%</h5>
                  <p>Allocation:</p>
                </li>
                <li className='green'>
                  <h5>$2847.50</h5>
                  <p>+3.2%</p>
                </li>
                <li className='pairs'>
                  <p>Pairs:</p>
                  <span>EURUSD</span>
                  <span>GBPUSD</span>
                  <span>XAUUSD</span>
                </li>
              </ul>
              <div className="progress_bar">
                <div className="bar" style={{ width: "60%" }}>
                </div>
              </div>
            </div>
          </div>
          <div className="dashboard_perfomance_itmes">
            <div className="top">
              <div className="left">
                <h4>Trend Following Pro</h4>
              </div>
              <div className="right">
                <div className="round"></div>
              </div>
            </div>
            <div className="bottom">
              <ul>
                <li>
                  <h5>24</h5>
                  <p>Trades:</p>
                </li>
                <li>
                  <h5>68%</h5>
                  <p>Trades:</p>
                </li>
                <li>
                  <h5>25%</h5>
                  <p>Allocation:</p>
                </li>
                <li className='green'>
                  <h5>$2847.50</h5>
                  <p>+3.2%</p>
                </li>
                <li className='pairs'>
                  <p>Pairs:</p>
                  <span>EURUSD</span>
                  <span>GBPUSD</span>
                  <span>XAUUSD</span>
                </li>
              </ul>
              <div className="progress_bar">
                <div className="bar" style={{ width: "60%" }}>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="tabs_inside_boxs">
        <div className="head">
          <div className="left">
            <h4>Live Trades</h4>
            <p>Performance metrics and comparison of different strategies</p>
          </div>
        </div>
        <div className="live_trades">
          <div className="live_trade_items">
            <ul>
              <li>
                <h5>EURUSD</h5>
                <p>Trend Following Pro</p>
              </li>
              <li>
                <h6>Size: 0.5</h6>
                <p>Entry: 1.0835</p>
              </li>
              <li>
                <h6>1.0847</h6>
                <p>14:23:45</p>
              </li>
              <li>
                <div className="price_button">
                  <h3>+$60.00</h3>
                  <Link to="/" className='buy'>Buy</Link>
                </div>
              </li>
            </ul>
          </div>
          <div className="live_trade_items">
            <ul>
              <li>
                <h5>EURUSD</h5>
                <p>Trend Following Pro</p>
              </li>
              <li>
                <h6>Size: 0.5</h6>
                <p>Entry: 1.0835</p>
              </li>
              <li>
                <h6>1.0847</h6>
                <p>14:23:45</p>
              </li>
              <li>
                <div className="price_button">
                  <h3>+$60.00</h3>
                  <Link to="/" className='buy'>Buy</Link>
                </div>
              </li>
            </ul>
          </div>
          <div className="live_trade_items">
            <ul>
              <li>
                <h5>EURUSD</h5>
                <p>Trend Following Pro</p>
              </li>
              <li>
                <h6>Size: 0.5</h6>
                <p>Entry: 1.0835</p>
              </li>
              <li>
                <h6>1.0847</h6>
                <p>14:23:45</p>
              </li>
              <li>
                <div className="price_button">
                  <h3>+$60.00</h3>
                  <Link to="/" className='buy sell'>Buy</Link>
                </div>
              </li>
            </ul>
          </div>
          <div className="live_trade_items">
            <ul>
              <li>
                <h5>EURUSD</h5>
                <p>Trend Following Pro</p>
              </li>
              <li>
                <h6>Size: 0.5</h6>
                <p>Entry: 1.0835</p>
              </li>
              <li>
                <h6>1.0847</h6>
                <p>14:23:45</p>
              </li>
              <li>
                <div className="price_button">
                  <h3>+$60.00</h3>
                  <Link to="/" className='buy'>Buy</Link>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </React.Fragment>
  )
}

export default OverviewComponent
