import { alpha } from "@mui/material/styles";

export function glassSx(theme, color = "primary") {
  return {
    background: alpha(theme.palette.background.paper, 0.3),
    backdropFilter: "blur(24px)",
    border: "2px solid",
    borderColor: alpha(theme.palette[color].main, 0.5),
    borderRadius: 3,
  };
}
