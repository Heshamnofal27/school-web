import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { COLORS } from "../../../shared/data/chartData";

export default function AttendanceChart({ data }) {
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
          Attendance
        </Typography>
        <Box sx={{ display: "flex", gap: 1 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            <Box
              sx={{
                width: 12,
                height: 12,
                backgroundColor: "#999",
                borderRadius: "2px",
              }}
            />
            <Typography variant="caption" sx={{ color: "#aaa" }}>
              Low
            </Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            <Box
              sx={{
                width: 12,
                height: 12,
                backgroundColor: "#666",
                borderRadius: "2px",
              }}
            />
            <Typography variant="caption" sx={{ color: "#aaa" }}>
              High
            </Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            <Box
              sx={{
                width: 12,
                height: 12,
                backgroundColor: COLORS.primary,
                borderRadius: "2px",
              }}
            />
            <Typography variant="caption" sx={{ color: "#aaa" }}>
              Average
            </Typography>
          </Box>
        </Box>
      </Box>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
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
          <Bar dataKey="Low" fill="#999" />
          <Bar dataKey="High" fill="#666" />
          <Bar dataKey="Average" fill={COLORS.primary} />
        </BarChart>
      </ResponsiveContainer>
    </Paper>
  );
}
