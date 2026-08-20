import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { COLORS } from "../../../shared/data/chartData";

export default function ClassScheduleCard() {
  const weekDays = ["Sat", "Sun", "Mon", "Tue", "Wed", "Thu", "Fri"];
  const days = Array.from({ length: 31 }, (_, i) => i + 1);

  // بعض الأيام المحددة
  const scheduledDays = [3, 5, 10, 12, 15, 18, 20, 22, 25, 27, 29];

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
          Class Schedule
        </Typography>
        <Typography variant="caption" sx={{ color: "#aaa" }}>
          August 2024
        </Typography>
      </Box>

      {/* أيام الأسبوع */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(7, 1fr)",
          gap: 1,
          mb: 2,
        }}
      >
        {weekDays.map((day) => (
          <Typography
            key={day}
            variant="caption"
            sx={{
              textAlign: "center",
              color: "#aaa",
              fontWeight: "bold",
              mb: 1,
            }}
          >
            {day}
          </Typography>
        ))}
      </Box>

      {/* الأيام */}
      <Box
        sx={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 1 }}
      >
        {days.map((day) => (
          <Box
            key={day}
            sx={{
              aspectRatio: "1",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "8px",
              backgroundColor: scheduledDays.includes(day)
                ? COLORS.primary
                : "#2a2a3e",
              color: scheduledDays.includes(day) ? "#000" : "#666",
              fontSize: "0.85rem",
              fontWeight: "bold",
              cursor: "pointer",
              transition: "all 0.3s",
              "&:hover": {
                backgroundColor: scheduledDays.includes(day)
                  ? COLORS.secondary
                  : "#333",
                transform: "scale(1.1)",
              },
            }}
          >
            {day}
          </Box>
        ))}
      </Box>
    </Paper>
  );
}
