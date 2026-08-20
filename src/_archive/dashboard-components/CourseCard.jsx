import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import LinearProgress from "@mui/material/LinearProgress";
import { COLORS } from "../../../shared/data/chartData";

export default function CourseCard({
  title,
  progress,
  lessons,
  gradient,
}) {
  return (
    <Paper
      sx={{
        p: 3,
        borderRadius: "16px",
        background:
          gradient ||
          `linear-gradient(135deg, ${COLORS.primary}20, ${COLORS.secondary}20)`,
        border: `1px solid ${COLORS.primary}40`,
        color: "#fff",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: -20,
          right: -20,
          width: 100,
          height: 100,
          borderRadius: "50%",
          backgroundColor: COLORS.primary,
          opacity: 0.1,
        }}
      />

      <Box sx={{ position: "relative", zIndex: 1 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            mb: 2,
          }}
        >
          <Box>
            <Typography
              variant="body2"
              sx={{ color: "#aaa", fontSize: "0.75rem" }}
            >
              DESIGN
            </Typography>
            <Typography
              variant="h6"
              sx={{ fontWeight: "bold", color: "#fff", mt: 0.5 }}
            >
              {title}
            </Typography>
          </Box>
          <Box
            sx={{
              backgroundColor: COLORS.primary,
              color: "#000",
              px: 1.5,
              py: 0.5,
              borderRadius: "8px",
              fontWeight: "bold",
              fontSize: "0.85rem",
            }}
          >
            {progress}%
          </Box>
        </Box>

        <Box sx={{ mb: 1 }}>
          <LinearProgress
            variant="determinate"
            value={progress}
            sx={{
              height: 6,
              borderRadius: "3px",
              backgroundColor: "#2a2a3e",
              "& .MuiLinearProgress-bar": {
                backgroundColor: COLORS.primary,
              },
            }}
          />
        </Box>

        <Typography variant="caption" sx={{ color: "#aaa" }}>
          {lessons} Lessons Watched
        </Typography>
      </Box>
    </Paper>
  );
}
