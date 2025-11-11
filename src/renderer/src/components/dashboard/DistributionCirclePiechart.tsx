import { Paper, Typography } from "@mui/material";
import { currencyColors, formatNumber, sessionColors } from "@renderer/utils/helper";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

const CustomTooltip = ({ active, payload, label }: any) => {
  // console.log(payload, "payload");
  return (
    <Paper
      elevation={3}
      sx={{
        p: 2,
        border: 1,
        borderColor: "grey.200",
        bgcolor: "background.paper",
      }}
    >
      <Typography variant="body2" color="text.secondary" fontWeight="medium">
        {`No. of Trades: ${payload?.[0]?.payload?.tradeCount}`}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {`Profit: ${formatNumber(payload?.[0]?.payload?.profit, "currency")}`}
      </Typography>
    </Paper>
  );
};

export default function DistributionCirclePiechart(props) {
  const { data, type } = props;
  console.log(data, "data");
  const CustomPieChart = ({ data, colors, dataKey = "tradeCount" }) => (
    <ResponsiveContainer width="100%" height={280}>
      <PieChart width={400} height={400}>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={60}
          labelLine={false}
          outerRadius={120}
          paddingAngle={2}
          dataKey={dataKey}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
      </PieChart>
    </ResponsiveContainer>
  );

  return (
    <CustomPieChart
      data={data}
      colors={type === "currency" ? currencyColors : sessionColors}
    />
  );
}
