import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { COLORS } from "../../../shared/data/chartData";

export default function UpcomingCoursesCard() {
  const courses = [
    {
      title: "Design Factors",
      date: "03 5/30/2025",
      time: "9:00-11:00 AM",
      icon: "🎨",
    },
    {
      title: "Voice Artist",
      date: "13 5 Oct 2025",
      time: "03:00-04:00 PM",
      icon: "🎤",
    },
  ];

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
          Upcoming Courses
        </Typography>
        <Typography
          variant="caption"
          sx={{ color: "#7c4dff", cursor: "pointer" }}
        >
          ⋮
        </Typography>
      </Box>

      {courses.map((course, index) => (
        <Box
          key={index}
          sx={{
            display: "flex",
            gap: 2,
            mb: 2,
            pb: 2,
            borderBottom:
              index < courses.length - 1 ? "1px solid #2a2a3e" : "none",
          }}
        >
          <Avatar
            sx={{
              backgroundColor: "#2a2a3e",
              width: 50,
              height: 50,
              fontSize: "1.5rem",
            }}
          >
            {course.icon}
          </Avatar>
          <Box sx={{ flex: 1 }}>
            <Typography
              variant="body2"
              sx={{ fontWeight: "bold", color: "#fff" }}
            >
              {course.title}
            </Typography>
            <Typography variant="caption" sx={{ color: "#aaa" }}>
              {course.date}
            </Typography>
            <Box
              sx={{ display: "flex", alignItems: "center", gap: 0.5, mt: 0.5 }}
            >
              <AccessTimeIcon sx={{ fontSize: 14, color: "#aaa" }} />
              <Typography variant="caption" sx={{ color: "#aaa" }}>
                {course.time}
              </Typography>
            </Box>
          </Box>
        </Box>
      ))}
    </Paper>
  );
}
