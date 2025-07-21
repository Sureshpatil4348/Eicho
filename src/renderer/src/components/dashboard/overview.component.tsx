import React from 'react'
import { Link } from 'react-router-dom'
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

const OverviewComponent: React.FunctionComponent = () => {

  const data = [
    {
      period: 'Week 1',
      equity: 2400,
      balance: 2400,
    },
    {
      period: 'Week 2',
      equity: 3000,
      balance: 1398,
    },
    {
      period: 'Week 3',
      equity: 2000,
      balance: 9800,
    },
    {
      period: 'Week 4',
      equity: 2780,
      balance: 3908,
    },
  ];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const CustomTooltip = (props: any): React.ReactNode | null => {
    if (props && props.active && props.payload && props.payload.length) {
      const data = props.payload[0].payload;

      return (
        <div style={{ background: "#fff", padding: "10px 14px", borderRadius: 10, boxShadow: "0px 4px 12px rgba(0,0,0,0.1)", fontFamily: "sans-serif", }}>
          <p style={{ margin: 0, fontSize: 18, fontWeight: 600, color: "#222" }}>
            ₹{data.period}
          </p>
          <p style={{ margin: 0, fontSize: 13, color: "#888", marginTop: 2 }}>
            {data.balance}
          </p>
          <p style={{ margin: 0, fontSize: 13, color: "#888", marginTop: 2 }}>
            {data.equity}
          </p>
        </div>
      );
    }

    return null;
  };

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
          <ResponsiveContainer width="100%" height={600}>
            <LineChart width={500} height={300} data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5, }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="period" stroke='#CBC8EB' />
              <YAxis stroke='#CBC8EB' />
              <Tooltip content={<CustomTooltip />} wrapperStyle={{ outline: "none" }} />
              <Line type="monotone" dataKey="equity" stroke="#1FCF43" activeDot={{ r: 8 }} dot={{ fill: '#1FCF43', stroke: '#1FCF43', strokeWidth: 2 }} />
              <Line type="monotone" dataKey="balance" stroke="#050FD4" activeDot={{ r: 8 }} dot={{ fill: '#050FD4', stroke: '#050FD4', strokeWidth: 2 }} />
            </LineChart>
          </ResponsiveContainer>
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
