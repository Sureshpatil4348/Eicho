// import { Box, Typography } from "@mui/material";
// import { formatNumber } from "@renderer/utils/helper";
import React, { useEffect, useRef } from "react";
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { getCookie } from "@renderer/utils/cookies";
import AccountGrowthChart from "@renderer/components/dashboard/account.growthchart";
import TradeSummary from "@renderer/components/dashboard/TradeSummery";
import ProfitLossAnalysis from "@renderer/components/dashboard/ProfitLossAnalysis";
import TradeTable from "@renderer/components/dashboard/TradeTable.component";
import DistributionCirclePiechart from "@renderer/components/dashboard/DistributionCirclePiechart";
import TradingMeter from "@renderer/components/dashboard/TradingMeter";
import toast from "react-hot-toast";
import { API_URL } from "@renderer/utils/constant";
import axios from "@renderer/config/axios";

const OverviewComponent: React.FunctionComponent = () => {
  const refs = useRef({});

  const [livetrades, setLivetrades]: any = React.useState([]);
  const [tradingscore, setTradingscore]: any = React.useState({});
  const [currency, setCurrencyDistribution]: any = React.useState([]);
  const [tradeSeason, setTradeSeason]: any = React.useState([]);
  const [advanceStatistics, setAdvanceStatistics]: any = React.useState([]);
  let payloadSocket = "40/live";

  const registerRef = (name: any) => {
    return (instance) => {
      refs.current[name] = instance;
    };
  };

  console.log("livetrades", livetrades);

  // const data = [
  //   {
  //     period: "Week 1",
  //     equity: 2400,
  //     balance: 2400,
  //   },
  //   {
  //     period: "Week 2",
  //     equity: 3000,
  //     balance: 1398,
  //   },
  //   {
  //     period: "Week 3",
  //     equity: 2000,
  //     balance: 9800,
  //   },
  //   {
  //     period: "Week 4",
  //     equity: 2780,
  //     balance: 3908,
  //   },
  // ];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  // const CustomTooltip = (props: any): React.ReactNode | null => {
  //   if (props && props.active && props.payload && props.payload.length) {
  //     const data = props.payload[0].payload;

  //     return (
  //       <Box
  //         bgcolor={"#fff"}
  //         p={"10px 14px"}
  //         borderRadius={2}
  //         boxShadow={"0px 4px 12px rgba(0,0,0,0.1)"}
  //         fontFamily={"sans-serif"}
  //       >
  //         <Typography
  //           sx={{ margin: 0, fontSize: 13, fontWeight: 600, color: "#222" }}
  //         >
  //           Period : {data.period}
  //         </Typography>
  //         <Typography sx={{ margin: 0, fontSize: 13, color: "#1FCF43" }}>
  //           Equity : {formatNumber(data.equity, "currency")}
  //         </Typography>
  //         <Typography sx={{ margin: 0, fontSize: 13, color: "#050FD4" }}>
  //           Balance : {formatNumber(data.balance, "currency")}
  //         </Typography>
  //       </Box>
  //     );
  //   }

  //   return null;
  // };

  const connectToCreatorSocketLister = () => {
    const token = getCookie("auth-token");

    return new Promise((resolve) => {
      const socketConnection = new WebSocket(
        `ws://20.83.157.24:8000/socket.io/?EIO=4&transport=websocket&token=${token}`
      );
      socketConnection.addEventListener("open", () => {
        // const payload = { "act": "40/live" };
        socketConnection.send(payloadSocket);
        // dispatch({ type: CREATOR_SOCKET.CREATOR_SOCKET_SUCCESS, payload: { [response.email]: socketConnection } })
      });
      // socketConnection.addEventListener("close", () => {
      //   connectToCreatorSocketLister()
      //   const creatorReconnectSection = setTimeout(() => {
      //       clearTimeout(creatorReconnectSection);
      //   }, 1000);
      // })
      // updateCreatorsCount(response, socketConnection, dispatch)
      updateCreatorsCount(socketConnection);
      resolve(socketConnection);
    });
  };
  const updateCreatorsCount = (socket: any) => {
    socket.addEventListener("message", (message: any) => {
      // const creatorDetails = data
      // const creatorDispatch = dispatch

      if (message.data) {
        const message_data = JSON.parse(message.data.replace("42/live,", ""));
        console.log("message", message_data);
        if (message_data[1]) {
          setLivetrades(message_data[1]?.live_trades);
        }
      }
    });
  };
  const fetchGrowthData = async () => {
    axios
      .get(API_URL.ADVANCE_STATICS)
      .then((res) => {
        if (res.data?.success) {
          setAdvanceStatistics(res.data?.statistics);
        }
      })
      .catch((err) => {
        if (err.response) {
          toast.error(err.response.data.message);
        } else {
          toast.error(err.message);
        }
      });
  };
  const currencyDistribution = async () => {
    axios
      .get(API_URL.CURRENCY_DISTRIBUTION_DASHBOARD)
      .then((res) => {
        if (res.data?.success) {
          setCurrencyDistribution(res.data?.currency_pairs);
        }
      })
      .catch((err) => {
        if (err.response) {
          toast.error(err.response.data.message);
        } else {
          toast.error(err.message);
        }
      });
  };
  const TradeSeasonAnalisis = async () => {
    axios
      .get(API_URL.TRADE_SEASON_ANALYSIS_DASHBOARD)
      .then((res) => {
        if (res.data?.success) {
          setTradeSeason(res.data?.sessions);
        }
      })
      .catch((err) => {
        if (err.response) {
          toast.error(err.response.data.message);
        } else {
          toast.error(err.message);
        }
      });
  };
  const getTradingScore = async () => {
    axios
      .get(API_URL.TRADING_SCORE_GET)
      .then((res) => {
        if (res.data) {
          setTradingscore(res.data);
        }
      })
      .catch((err) => {
        if (err.response) {
          toast.error(err.response.data.message);
        } else {
          toast.error(err.message);
        }
      });
  };
  useEffect(() => {
    fetchGrowthData();
    currencyDistribution();
    TradeSeasonAnalisis();
    getTradingScore();
    connectToCreatorSocketLister();
  }, []);
  return (
    <React.Fragment>
      {/* <div className="tabs_inside_boxs">
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
          <div className="graph_button_sec">
            <ul>
              <li className='green'>
                <div className="arrow">
                  <img src={UpArrowGreen} alt='' />
                  <UpArrowGreen />
                </div>
                <span>Total Growth in %</span>
                <b>:</b>
                <b>51%</b>
              </li>
              <li className='green'>
                <div className="arrow">
                  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 22 22" fill="none">
                    <g clip-path="url(#clip0_485_547)">
                      <path d="M14.0189 11.7663L11.3145 9.06125V16.0083C11.3145 16.3706 11.0205 16.6646 10.6582 16.6646C10.296 16.6646 10.002 16.3706 10.002 16.0083V9.06125L7.29755 11.7656C7.04095 12.0222 6.62555 12.0222 6.36961 11.7656C6.11301 11.5091 6.11301 11.0936 6.36961 10.8377L10.082 7.12533C10.2395 6.96783 10.4548 6.91928 10.6589 6.95538C10.8623 6.91928 11.0782 6.96849 11.2357 7.12533L14.9481 10.8377C15.2047 11.0943 15.2047 11.5097 14.9481 11.7656C14.6909 12.0222 14.2755 12.0222 14.0189 11.7663ZM10.6582 21.9146C4.8596 21.9146 0.158203 17.2138 0.158203 11.4145C0.158203 5.61526 4.8596 0.914549 10.6582 0.914549C16.4568 0.914549 21.1582 5.61594 21.1582 11.4145C21.1582 17.2132 16.4575 21.9146 10.6582 21.9146ZM10.6582 2.22705C5.58406 2.22705 1.4707 6.34041 1.4707 11.4145C1.4707 16.4887 5.58406 20.6021 10.6582 20.6021C15.7323 20.6021 19.8457 16.4887 19.8457 11.4145C19.8457 6.34041 15.7323 2.22705 10.6582 2.22705Z" fill="#1FCF43" />
                    </g>
                    <defs>
                      <clipPath id="clip0_485_547">
                        <rect width="21" height="21" fill="white" transform="matrix(1 0 0 -1 0.158203 21.9146)" />
                      </clipPath>
                    </defs>
                  </svg>
                </div>
                <span>Sharpe Ratio</span>
                <b>:</b>
                <b>51%</b>
              </li>
              <li className='black'>
                <div className="arrow">
                  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 22 22" fill="none">
                    <g clip-path="url(#clip0_481_220)">
                      <path d="M14.8138 11.7663L12.1094 9.06125V16.0083C12.1094 16.3706 11.8154 16.6646 11.4531 16.6646C11.0909 16.6646 10.7969 16.3706 10.7969 16.0083V9.06125L8.09247 11.7656C7.83588 12.0222 7.42047 12.0222 7.16453 11.7656C6.90793 11.5091 6.90793 11.0936 7.16453 10.8377L10.8769 7.12533C11.0344 6.96783 11.2497 6.91928 11.4538 6.95538C11.6573 6.91928 11.8732 6.96849 12.0307 7.12533L15.7431 10.8377C15.9997 11.0943 15.9997 11.5097 15.7431 11.7656C15.4858 12.0222 15.0704 12.0222 14.8138 11.7663ZM11.4531 21.9146C5.65452 21.9146 0.953125 17.2138 0.953125 11.4145C0.953125 5.61526 5.65452 0.914549 11.4531 0.914549C17.2517 0.914549 21.9531 5.61594 21.9531 11.4145C21.9531 17.2132 17.2524 21.9146 11.4531 21.9146ZM11.4531 2.22705C6.37898 2.22705 2.26563 6.34041 2.26563 11.4145C2.26563 16.4887 6.37898 20.6021 11.4531 20.6021C16.5273 20.6021 20.6406 16.4887 20.6406 11.4145C20.6406 6.34041 16.5273 2.22705 11.4531 2.22705Z" fill="black" />
                    </g>
                    <defs>
                      <clipPath id="clip0_481_220">
                        <rect width="21" height="21" fill="white" transform="matrix(1 0 0 -1 0.953125 21.9146)" />
                      </clipPath>
                    </defs>
                  </svg>
                </div>
                <span>Total Deposit</span>
                <b>:</b>
                <b>$15000.00</b>
              </li>
              <li className='red'>
                <div className="arrow">
                  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 22 22" fill="none">
                    <g clip-path="url(#clip0_481_208)">
                      <path d="M14.7962 11.0628L12.0918 13.7679V6.8208C12.0918 6.45855 11.7978 6.16455 11.4355 6.16455C11.0733 6.16455 10.7793 6.45855 10.7793 6.8208V13.7679L8.0749 11.0635C7.8183 10.8069 7.4029 10.8069 7.14695 11.0635C6.89035 11.3201 6.89035 11.7355 7.14695 11.9914L10.8594 15.7038C11.0169 15.8613 11.2321 15.9098 11.4362 15.8737C11.6397 15.9098 11.8556 15.8606 12.0131 15.7038L15.7255 11.9914C15.9821 11.7348 15.9821 11.3194 15.7255 11.0635C15.4682 10.8069 15.0528 10.8069 14.7962 11.0628ZM11.4355 0.914551C5.63694 0.914551 0.935547 5.61526 0.935547 11.4146C0.935547 17.2138 5.63694 21.9146 11.4355 21.9146C17.2342 21.9146 21.9355 17.2132 21.9355 11.4146C21.9355 5.61594 17.2348 0.914551 11.4355 0.914551ZM11.4355 20.6021C6.3614 20.6021 2.24805 16.4887 2.24805 11.4146C2.24805 6.34041 6.3614 2.22705 11.4355 2.22705C16.5097 2.22705 20.623 6.34041 20.623 11.4146C20.623 16.4887 16.5097 20.6021 11.4355 20.6021Z" fill="#EC4449" />
                    </g>
                    <defs>
                      <clipPath id="clip0_481_208">
                        <rect width="21" height="21" fill="white" transform="translate(0.935547 0.914551)" />
                      </clipPath>
                    </defs>
                  </svg>
                </div>
                <span>Total Withdraw</span>
                <b>:</b>
                <b>$5000.000</b>
              </li>
            </ul>
          </div>
        </div>
      </div> */}
      {/* <div className="tabs_inside_boxs">
        <div className="head">
          <div className="left">
            <h4>Strategy Performance</h4>
            <p>Performance metrics and comparison of different strategies</p>
          </div>
        </div>
        <div className="dashboard_perfomance">
          {
            loading ? <LoadingComponent /> : strategies?.map((strategy) => (
              <div className="dashboard_perfomance_itmes" key={strategy.id}>
                <div className="top">
                  <div className="left">
                    <h4>{strategy.name}</h4>
                  </div>
                  <div className="right">
                    <div className="round"></div>
                  </div>
                </div>
                <div className="bottom">
                  <ul>
                    <li>
                      <h5>{strategy?.total_trades}</h5>
                      <p>Trades:</p>
                    </li>

                    <li>
                      <h5>{strategy?.capital_allocation?.allocation_percentage}%</h5>
                      <p>Allocation:</p>
                    </li>
                    <li className='green'>
                      <h5>$ 00.0</h5>
                      <p>+00.0%</p>
                    </li>
                    <li className='pairs'>
                      <p>Pairs:</p>
                      {
                        strategy.recommended_pairs?.map((pair: any) => <span>{pair?.pair_name}</span>)
                      }
                    </li>
                  </ul>
                  <div className="progress_bar">
                    <div className="bar" style={{ width: "0%" }}>
                    </div>
                  </div>
                </div>
              </div>
            ))
          }
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
          {
            livetrades?.length > 0 ?
              livetrades?.map((trade: any) => (
                <div className="live_trade_items" key={trade.id}>
                  <ul>
                    <li>
                      <h5>{trade?.pair}</h5>
                      <p>{trade?.strategy}</p>
                    </li>
                    <li>
                      <h6>Size: {trade?.size}</h6>
                      <p>Entry: {trade?.entry_price}</p>
                    </li>
                    <li>
                      <h6>{trade?.current_price}</h6>
                      <p>{trade?.timestamp}</p>
                    </li>
                    <li>
                      <div className="price_button">
                        <h3>$ {trade?.pnl}</h3>
                        <Link to="/" className='buy'>{trade?.action}</Link>
                      </div>
                    </li>
                  </ul>
                </div>
              )) : <span>No Live Trades</span>
          }

        </div>
      </div> */}

      <div className="tabs_inside_boxs">
        <AccountGrowthChart ref={registerRef("growthChart")} />
      </div>
      <div className="tabs_inside_boxs">
        <div className="head">
          <div className="left">
            <h4>Advanced Statistics</h4>
          </div>
        </div>
        <div className="advance_statics_wrap">
          <div className="advance_statics_box">
            <ul>
              <li>
                <span>Trades</span>
                <span>{advanceStatistics?.totalTrades}</span>
              </li>
              <li>
                <span>Buy Trades Win % & Number</span>
                <span>
                  {advanceStatistics?.buy?.winRate}% (
                  {advanceStatistics?.buy?.winCount})
                </span>
              </li>
              <li>
                <span>Sell Trades Win % & Number</span>
                <span>
                  {advanceStatistics?.sell?.winRate}% (
                  {advanceStatistics?.sell?.winCount})
                </span>
              </li>
              <li>
                <span>Total Win/Loss in % and Number</span>
                <span>
                  {advanceStatistics?.overall?.winRate}% (
                  {advanceStatistics?.overall?.winCount})
                </span>
              </li>
              <li>
                <span>Avg. Loss</span>
                <span>${advanceStatistics?.avgLoss}</span>
              </li>
              <li>
                <span>Avg. Profit</span>
                <span>${advanceStatistics?.avgProfit}</span>
              </li>
            </ul>
          </div>
          <div className="advance_statics_box">
            <ul>
              <li>
                <span>Total Lot Size Traded</span>
                <span>{advanceStatistics?.totalLots}</span>
              </li>
              <li>
                <span>Total Commission</span>
                <span>${advanceStatistics?.totalLots}</span>
              </li>
              <li>
                <span>Total Swap</span>
                <span>${advanceStatistics?.totalCommission}</span>
              </li>
              <li>
                <span>Avg. Trade Duration</span>
                <span>{advanceStatistics?.avgDuration}</span>
              </li>
              <li>
                <span>Profit Factor</span>
                <span>{advanceStatistics?.profitFactor}</span>
              </li>
              <li>
                <span>Risk of Liquidization </span>
                <span>{advanceStatistics?.riskOfLiquidation}% </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
      {/* <div className="tabs_inside_boxs" id='trading-score-meter'>
        <div className="head">
          <div className="left">
            <h4>My Trading Score</h4>
          </div>
        </div>
        <div className="score_prgoress_bar">
          <TradingMeter score={tradingscore?.score || 0} />
        </div>
      </div> */}
      <div className="analysis_wrap">
        <div className="analysis_item_box">
          <div className="tabs_inside_boxs">
            <div className="head">
              <div className="left">
                <h4>Currency Distribution</h4>
              </div>
            </div>
            <div className="analysis_item_list">
              <div className="left">
                <DistributionCirclePiechart
                  data={
                    currency?.length > 0
                      ? currency?.map((item: any) => ({
                          currency: item?.currency_pair,
                          profit: item?.profit,
                          tradeCount: item?.trade_count,
                        }))
                      : []
                  }
                  type="currency"
                />
              </div>
              <div className="right">
                <div className="analysis_table">
                  <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                      <TableHead>
                        <TableRow>
                          <TableCell>Currency</TableCell>
                          <TableCell>Profit</TableCell>
                          <TableCell>No. of Trades</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {currency?.map((item: any, index: number) => (
                          <TableRow
                            sx={{
                              "&:last-child td, &:last-child th": {
                                border: 0,
                              },
                            }}
                          >
                            <TableCell scope="row" key={index}>
                              <div className="d-flex">
                                <Box
                                  width={16}
                                  height={16}
                                  borderRadius={"100%"}
                                  sx={{ backgroundColor: item?.color }}
                                ></Box>
                                {item.currency_pair}
                              </div>
                            </TableCell>
                            <TableCell>
                              <span className="green">${item?.profit}</span>
                            </TableCell>
                            <TableCell>
                              <span className="gray">
                                {item?.trade_count} Trades
                              </span>
                            </TableCell>
                          </TableRow>
                        ))}

                        {/* <TableRow
                          sx={{
                            "&:last-child td, &:last-child th": {
                              border: 0,
                            },
                          }}
                        >
                          <TableCell scope="row">
                            <div className="d-flex">
                              <Box
                                width={16}
                                height={16}
                                borderRadius={"100%"}
                                sx={{ backgroundColor: "#8C5CF4" }}
                              ></Box>
                              GBP / USD
                            </div>
                          </TableCell>
                          <TableCell>
                            <span className="green">$1250.00</span>
                          </TableCell>
                          <TableCell>
                            <span className="gray">45 Trades</span>
                          </TableCell>
                        </TableRow>
                        <TableRow
                          sx={{
                            "&:last-child td, &:last-child th": {
                              border: 0,
                            },
                          }}
                        >
                          <TableCell scope="row">
                            <div className="d-flex">
                              <Box
                                width={16}
                                height={16}
                                borderRadius={"100%"}
                                sx={{ backgroundColor: "#EF4445" }}
                              ></Box>
                              USD / JPY
                            </div>
                          </TableCell>
                          <TableCell>
                            <span className="green">$1250.00</span>
                          </TableCell>
                          <TableCell>
                            <span className="gray">45 Trades</span>
                          </TableCell>
                        </TableRow>
                        <TableRow
                          sx={{
                            "&:last-child td, &:last-child th": {
                              border: 0,
                            },
                          }}
                        >
                          <TableCell scope="row">
                            <div className="d-flex">
                              <Box
                                width={16}
                                height={16}
                                borderRadius={"100%"}
                                sx={{ backgroundColor: "#F49F0B" }}
                              ></Box>
                              AUD / USD
                            </div>
                          </TableCell>
                          <TableCell>
                            <span className="green">$1250.00</span>
                          </TableCell>
                          <TableCell>
                            <span className="gray">45 Trades</span>
                          </TableCell>
                        </TableRow>
                        <TableRow
                          sx={{
                            "&:last-child td, &:last-child th": {
                              border: 0,
                            },
                          }}
                        >
                          <TableCell scope="row">
                            <div className="d-flex">
                              <Box
                                width={16}
                                height={16}
                                borderRadius={"100%"}
                                sx={{ backgroundColor: "#3D82F6" }}
                              ></Box>
                              GBP / JPY
                            </div>
                          </TableCell>
                          <TableCell>
                            <span className="green">$1250.00</span>
                          </TableCell>
                          <TableCell>
                            <span className="gray">45 Trades</span>
                          </TableCell>
                        </TableRow> */}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="analysis_item_box">
          <div className="tabs_inside_boxs">
            <div className="head">
              <div className="left">
                <h4>Trade Season Analysis</h4>
              </div>
            </div>
            <div className="analysis_item_list">
              <div className="left">
                <DistributionCirclePiechart
                  data={
                    tradeSeason?.length > 0
                      ? currency?.map((item: any) => ({
                          currency: item?.session,
                          profit: item?.profit,
                          tradeCount: item?.trade_count,
                        }))
                      : []
                  }
                  type="season"
                />
              </div>
              <div className="right">
                <div className="analysis_table">
                  <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                      <TableHead>
                        <TableRow>
                          <TableCell>Session</TableCell>
                          <TableCell>Profit</TableCell>
                          <TableCell>No. of Trades</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {tradeSeason?.map((item: any, index: number) => (
                          <TableRow
                            sx={{
                              "&:last-child td, &:last-child th": {
                                border: 0,
                              },
                            }}
                          >
                            <TableCell scope="row" key={index}>
                              <div className="d-flex">
                                <Box
                                  width={16}
                                  height={16}
                                  borderRadius={"100%"}
                                  sx={{ backgroundColor: item?.color }}
                                ></Box>
                                {item.session}
                              </div>
                            </TableCell>
                            <TableCell>
                              <span className="green">${item?.profit}</span>
                            </TableCell>
                            <TableCell>
                              <span className="gray">
                                {item?.trade_count} Trades
                              </span>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="analysis_wrap">
        <TradeSummary ref={registerRef("tradeSummary")} />
        <ProfitLossAnalysis ref={registerRef("profitLoss")} />
      </div>
      <TradeTable ref={registerRef("tradeTable")} />
    </React.Fragment>
  );
};

export default OverviewComponent;
