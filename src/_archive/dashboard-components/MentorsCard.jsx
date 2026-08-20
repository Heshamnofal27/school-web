import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import { COLORS } from "../../../shared/data/chartData";

export default function MentorsCard() {
  const mentors = [
    { name: "Arian Adil", specialty: "UI/UX Expert", avatar: "AA" },
    { name: "Bil Rihab", specialty: "Motion Expert", avatar: "BR" },
    { name: "Abdi Fahad", specialty: "Web Development", avatar: "AF" },
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
          Your Mentors
        </Typography>
        <Typography
          variant="caption"
          sx={{ color: "#7c4dff", cursor: "pointer" }}
        >
          ⋮
        </Typography>
      </Box>

      {mentors.map((mentor, index) => (
        <Box
          key={index}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: 2,
            pb: 2,
            borderBottom:
              index < mentors.length - 1 ? "1px solid #2a2a3e" : "none",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Avatar
              sx={{
                backgroundColor: COLORS.primary,
                color: "#fff",
                fontWeight: "bold",
                width: 40,
                height: 40,
              }}
            >
              {mentor.avatar}
            </Avatar>
            <Box>
              <Typography
                variant="body2"
                sx={{ fontWeight: "bold", color: "#fff" }}
              >
                {mentor.name}
              </Typography>
              <Typography variant="caption" sx={{ color: "#aaa" }}>
                {mentor.specialty}
              </Typography>
            </Box>
          </Box>
          <Button
            size="small"
            variant="outlined"
            sx={{
              borderColor: "#444",
              color: "#aaa",
              textTransform: "none",
              "&:hover": {
                borderColor: COLORS.primary,
                color: COLORS.primary,
              },
            }}
          >
            Follow
          </Button>
        </Box>
      ))}

      <Box sx={{ textAlign: "center", mt: 2 }}>
        <Button
          fullWidth
          size="small"
          sx={{
            color: "#7c4dff",
            textTransform: "none",
            "&:hover": { backgroundColor: "#2a2a3e" },
          }}
        >
          See All
        </Button>
      </Box>
    </Paper>
  );
}
