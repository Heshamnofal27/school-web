import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { COLORS } from "../../../shared/data/chartData";

export default function TimeSpendingChart({ data }) {
  return (
    <Paper
      sx={{
        p: 3,
        borderRadius: "16px",
        backgroundColor: "#1a1a2e",
        border: "1px solid #2a2a3e",
        color: "#fff",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: "bold", color: "#fff" }}>
          Time Spending
        </Typography>
        <Typography
          variant="caption"
          sx={{
            backgroundColor: "#2a2a3e",
            px: 2,
            py: 1,
            borderRadius: "8px",
            color: "#aaa",
          }}
        >
          March
        </Typography>
      </Box>

      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#2a2a3e" />
          <XAxis dataKey="month" stroke="#666" />
          <YAxis stroke="#666" />
          <Tooltip
            contentStyle={{
              backgroundColor: "#2a2a3e",
              border: "1px solid #444",
              borderRadius: "8px",
              color: "#fff",
            }}
          />
          <Line
            type="monotone"
            dataKey="spent"
            stroke={COLORS.primary}
            dot={{ fill: COLORS.primary, r: 5 }}
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </Paper>
  );
}
