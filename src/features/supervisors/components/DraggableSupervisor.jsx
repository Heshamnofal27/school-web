import { useDraggable } from "@dnd-kit/core";
import { alpha } from "@mui/material/styles";
import Chip from "@mui/material/Chip";
import Avatar from "@mui/material/Avatar";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";

export default function DraggableSupervisor({ supervisor }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({ id: supervisor.id, data: { supervisor } });

  const style = transform
    ? {
        transform: `translate(${transform.x}px, ${transform.y}px)`,
        opacity: isDragging ? 0.5 : 1,
        zIndex: isDragging ? 9999 : "auto",
        cursor: "grab",
      }
    : { cursor: "grab" };

  return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes}>
      <Chip
        avatar={
          <Avatar sx={{ bgcolor: (t) => alpha(t.palette.primary.main, 0.2) }}>
            <AssignmentIndIcon
              sx={{ fontSize: 16, color: "primary.main" }}
            />
          </Avatar>
        }
        label={supervisor.name}
        variant="outlined"
        size="medium"
        sx={{
          width: "100%",
          justifyContent: "flex-start",
          px: 0.5,
          borderColor: (t) => alpha(t.palette.primary.main, 0.4),
          "& .MuiChip-label": { fontWeight: 500, fontSize: "0.8rem" },
          transition: "box-shadow 0.2s",
          "&:hover": {
            boxShadow: (t) =>
              `0 2px 12px ${alpha(t.palette.primary.main, 0.2)}`,
          },
        }}
      />
    </div>
  );
}
