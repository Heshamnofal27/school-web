import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  Tooltip,
} from "recharts";
import { COLORS } from "../../../shared/data/chartData";

export default function ProgressChart({ data }) {
  const CHART_COLORS = [COLORS.primary, COLORS.success];

  return (
    <Paper
      sx={{
        p: 3,
        borderRadius: "16px",
        backgroundColor: "#1a1a2e",
        border: "1px solid #2a2a3e",
        color: "#fff",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Typography
        variant="h6"
        sx={{ fontWeight: "bold", color: "#fff", mb: 2 }}
      >
        Your Progress
      </Typography>
      <Typography variant="caption" sx={{ color: "#aaa", mb: 2 }}>
        Your total course progress here
      </Typography>

      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={80}
            outerRadius={120}
            paddingAngle={5}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={CHART_COLORS[index]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: "#2a2a3e",
              border: "1px solid #444",
              borderRadius: "8px",
              color: "#fff",
            }}
          />
          <Legend wrapperStyle={{ paddingTop: "20px", color: "#aaa" }} />
        </PieChart>
      </ResponsiveContainer>

      <Box sx={{ textAlign: "center", mt: 2 }}>
        <Typography
          variant="h4"
          sx={{
            fontWeight: "bold",
            background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.secondary})`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Total Achievement
        </Typography>
      </Box>
    </Paper>
  );
}
