import { forwardRef, useEffect, useImperativeHandle, useReducer } from "react";
import {
  Button,
  Chip,
  Grid,
  Pagination,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";

import toast from "react-hot-toast";
import classNames from "classnames";
import moment from "moment";
import {
  calculateDuration,
  dealTypeMap,
  formatNumber,
  getPaginationRangeText,
  getTradeTypeClass,
  Reducer,
} from "@renderer/utils/helper";
import { TableLoadingComponent } from "@renderer/shared/LoadingScreen";
import { API_URL } from "@renderer/utils/constant";
import axios from "@renderer/config/axios";

const initialState = {
  loading: false,
  history: [],
  page: 1,
  limit: 10,
  total: 0,
  type: "history", // "history" or "trade"
  live: [],
};

/**
 * TradeTable component displays live trades and trading history in a tabular format
 * It uses forwardRef to allow parent components to access its methods
 */
const TradeTable = forwardRef((props, ref) => {
  console.log("props", props);
  const [state, dispatch] = useReducer(Reducer, initialState, () => ({
    ...initialState,
  }));

  useEffect(() => {
    fetchTradeHistory(state.page, state.limit, state.type);
  }, [state.type, state.page, state.limit]);

  useImperativeHandle(ref, () => ({
    refetch: () => {
      fetchTradeHistory(state.page, state.limit, state.type);
    },
  }));

  const fetchTradeHistory = (page: any, limit: any, type: string) => {
    dispatch({ type: "SET_STATE", payload: { key: "loading", value: true } });
    const params = new URLSearchParams();
    params.append("page", page);
    params.append("limit", limit);
    const queryString = `?${params.toString()}`;

    console.log("type", type);
    if (type === "trade") {
      dispatch({
        type: "SET_STATE",
        payload: { key: "loading", value: false },
      });
      dispatch({
        type: "MULTISET_STATE",
        multiPayload: [
          { key: "live", value: [] },
          { key: "page", value: page },
          { key: "total", value: 0 },
        ],
      });
      // Api.getLiveTrades(queryString)
      //   .then((res) => {
      //     if (res && res?.status === 200) {
      //       console.log(res, "res");
      //       if (res?.data?.warning) {
      //         toast.success(res?.data?.message, { id: "warning" });
      //         return;
      //       }
      //       dispatch({
      //         type: "MULTISET_STATE",
      //         multiPayload: [
      //           { key: "live", value: res?.data?.data || [] },
      //           { key: "page", value: page },
      //           { key: "total", value: res?.data?.pagination?.total || 0 },
      //         ],
      //       });
      //     }
      //   })
      //   .catch((err) => {
      //     toast.error(
      //       err?.response?.data?.message || "Error fetching live trades",
      //       { id: "trade_history_error" }
      //     );
      //   })
      //   .finally(() => {
      //     dispatch({
      //       type: "SET_STATE",
      //       payload: { key: "loading", value: false },
      //     });
      //   });
      return;
    }

    // Fetch trade history
    axios
      .get(API_URL.TRADE_HISTORY_DASHBOARD + queryString)
      .then((res) => {
        dispatch({
          type: "MULTISET_STATE",
          multiPayload: [
            { key: "history", value: res?.data?.trades || [] },
            { key: "page", value: page },
            { key: "total", value: res?.data?.pagination?.total_pages || 0 },
          ],
        });
        dispatch({
          type: "SET_STATE",
          payload: { key: "loading", value: false },
        });
      })
      .catch((err) => {
        if (err.response) {
          toast.error(err.response.data.message);
          dispatch({
            type: "SET_STATE",
            payload: { key: "loading", value: true },
          });
        } else {
          toast.error(err.message);
          dispatch({
            type: "SET_STATE",
            payload: { key: "loading", value: true },
          });
        }
      });
  };

  const handlePageChange = (_, value) => {
    dispatch({ type: "SET_STATE", payload: { key: "page", value } });
    fetchTradeHistory(value, state.limit, state.type);
  };

  const handleShift = (type) => {
    if (type === state.type) return;
    dispatch({
      type: "MULTISET_STATE",
      multiPayload: [
        { key: "type", value: type },
        { key: "page", value: 1 },
        { key: "total", value: 0 },
      ],
    });
    fetchTradeHistory(1, state.limit, type);
  };

  // Function to render table rows based on trade type
  const renderTableRows = () => {
    if (state.type === "trade") {
      // Render live trades
      return state.live?.length > 0 ? (
        state.live.map((item: any, index: number) => (
          <TableRow
            key={index}
            sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
          >
            <TableCell data-th="Trade ID" scope="row">
              <span className="gray">{item?.trade_id || "--"}</span>
            </TableCell>

            <TableCell data-th="Open Date">
              <span className="gray">
                {moment(item?.openTime).format("MMM DD, YYYY [at] h:mm A")}
              </span>
            </TableCell>

            <TableCell data-th="Symbol">{item?.symbol}</TableCell>

            <TableCell data-th="Buy/Sell" className="price_button">
              {/* <Chip
                className={getLiveTypeClass(item?.type)}
                label={positionTypeMap[item?.type] || item?.buy_sell || "--"}
              /> */}
            </TableCell>

            <TableCell data-th="Open Price">
              {item.openPrice ? formatNumber(item.openPrice, "currency") : "--"}
            </TableCell>

            <TableCell data-th="Net Profit">
              <span
                className={
                  item?.net_profit >= 0 ? "text-success" : "text-danger"
                }
              >
                {formatNumber(item?.net_profit || 0, "currency")}
              </span>
            </TableCell>

            <TableCell data-th="Duration">--</TableCell>

            <TableCell data-th="Gain">
              {item?.gain ? formatNumber(item?.gain || 0, "currency") : "--"}
            </TableCell>

            <TableCell data-th="Commissions">
              {formatNumber(item?.commission || 0, "currency") ?? "--"}
            </TableCell>

            <TableCell data-th="Swap">{item.swap ?? "--"}</TableCell>
          </TableRow>
        ))
      ) : (
        <TableRow>
          <TableCell colSpan={10} align="center">
            No Live Trades Found
          </TableCell>
        </TableRow>
      );
    } else {
      // Render historical trades
      return state.history?.length > 0 ? (
        state.history.map((item: any, index) => (
          <TableRow
            key={index}
            sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
          >
            <TableCell data-th="Trade ID" scope="row">
              <span className="gray">{item?.trade_id}</span>
            </TableCell>

            <TableCell data-th="Open Date">
              <span className="gray">
                {moment(item?.open_date).format("MMM DD, YYYY [at] h:mm A")}
              </span>
            </TableCell>

            <TableCell data-th="Close Date">
              <span className="gray">
                {moment(item?.close_date).format("MMM DD, YYYY [at] h:mm A")}
              </span>
            </TableCell>

            <TableCell data-th="Symbol">{item?.symbol}</TableCell>

            <TableCell data-th="Buy/Sell" className="price_button">
              <Chip
                className={getTradeTypeClass(item?.buy_sell)}
                label={dealTypeMap[item?.type] || item?.buy_sell}
              />
            </TableCell>
            <TableCell data-th="Open Price">
              {item?.open_price && parseFloat(item?.open_price).toFixed(2)}
            </TableCell>
            <TableCell data-th="Close Price">
              {item?.close_price && parseFloat(item?.close_price).toFixed(2)}
            </TableCell>
            <TableCell data-th="Pips">
              {item?.pips ? parseFloat(item?.pips)?.toFixed(2) : "--"}
            </TableCell>

            <TableCell data-th="Net Profit">
              <span
                className={
                  item?.net_profit >= 0 ? "text-success" : "text-danger"
                }
              >
                {formatNumber(item?.net_profit, "currency")}
              </span>
            </TableCell>

            <TableCell data-th="Duration">
              {calculateDuration(item?.open_date, item?.close_date)}
            </TableCell>

            <TableCell data-th="Gain">
              {item?.gain ? `${parseFloat(item?.gain).toFixed(2)}%` : "--"}
            </TableCell>
            <TableCell data-th="Commissions">
              {formatNumber(item?.commissions, "currency") ?? "--"}
            </TableCell>
            <TableCell data-th="Swap">
              {item?.swap ? formatNumber(item?.swap, "currency") : "--"}
            </TableCell>
          </TableRow>
        ))
      ) : (
        <TableRow>
          <TableCell colSpan={13} align="center">
            No Trade History Found
          </TableCell>
        </TableRow>
      );
    }
  };
  // console.log(state, "state for trade table", state.history);

  return (
    <div className="tabs_inside_boxs">
      <div className="head">
        <div className="left">
          <h4>All Trades</h4>
        </div>
        <div className="right">
          <Button
            className={classNames(`green_btn link_button`, {
              active: state.type === "trade",
            })}
            onClick={() => handleShift("trade")}
            // variant="outlined"
            sx={{
              width: "auto !important",
            }}
          >
            Live Trade
          </Button>
          <Button
            className={classNames(`link_button`, {
              active: state.type === "history",
              white_text: state.type === "history",
            })}
            onClick={() => handleShift("history")}
            // variant="contained"
            sx={{
              width: "auto !important",
            }}
          >
            Trading History
          </Button>
        </div>
      </div>
      <div className="all_trade_table">
        <div className="custom_table">
          <TableContainer component={Paper} sx={{ maxHeight: 440 }}>
            <Table
              stickyHeader
              sx={{ md: "minWidth: 650" }}
              aria-label="trade table"
            >
              <TableHead>
                <TableRow>
                  <TableCell>Trade ID</TableCell>
                  <TableCell>Open Date</TableCell>
                  {state.type === "history" && (
                    <TableCell>Close Date</TableCell>
                  )}
                  <TableCell>Symbol</TableCell>
                  <TableCell>Buy/Sell</TableCell>
                  <TableCell>Open Price</TableCell>
                  {state.type === "history" && (
                    <TableCell>Close Price</TableCell>
                  )}
                  {state.type === "history" && <TableCell>Pips</TableCell>}
                  <TableCell>Net Profit</TableCell>
                  <TableCell>Duration</TableCell>
                  <TableCell>Gain</TableCell>
                  <TableCell>Commissions</TableCell>
                  <TableCell>Swap</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {state.loading ? (
                  <TableLoadingComponent
                    rowsNum={10}
                    colsNum={state.type === "history" ? 13 : 10}
                  />
                ) : (
                  renderTableRows()
                )}
              </TableBody>
            </Table>
          </TableContainer>

          {state.total > state.limit && (
            <Grid
              className="pagination_block"
              container
              justifyContent={"space-between"}
              alignItems={"center"}
              marginTop={"20px"}
              sx={{ p: 2 }}
            >
              <Grid>
                <Typography variant="body2">
                  {getPaginationRangeText(state)}
                </Typography>
              </Grid>
              <Grid>
                <Pagination
                  count={Math.ceil(state.total / state.limit)}
                  page={state.page}
                  onChange={handlePageChange}
                  color="primary"
                  shape="rounded"
                />
              </Grid>
            </Grid>
          )}
        </div>
      </div>
    </div>
  );
});
TradeTable.displayName = "TradeTable";
export default TradeTable;
