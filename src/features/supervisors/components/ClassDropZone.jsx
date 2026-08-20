import { useDroppable } from "@dnd-kit/core";
import { alpha } from "@mui/material/styles";
import { useTranslation } from "react-i18next";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Avatar from "@mui/material/Avatar";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import CloseIcon from "@mui/icons-material/Close";
import GroupsIcon from "@mui/icons-material/Groups";

export default function ClassDropZone({
  classItem,
  assignments,
  supervisors,
  onRemove,
  isOver,
}) {
  const { t, i18n } = useTranslation();
  const loc = (item) => item ? (i18n.language === "en" && item.nameEn ? item.nameEn : item.name) : "";

  const { setNodeRef } = useDroppable({
    id: classItem.id,
    data: { classItem },
  });

  const assigned = assignments
    .filter((a) => a.classId === classItem.id)
    .map((a) => ({
      ...a,
      supervisor: supervisors.find((s) => s.id === a.supervisorId),
    }));

  return (
    <Box
      ref={setNodeRef}
      sx={{
        borderRadius: 2,
        border: (t) =>
          isOver
            ? `2px dashed ${t.palette.primary.main}`
            : `2px solid ${(t) => alpha(t.palette.divider, 0.5)}`,
        bgcolor: (t) =>
          isOver ? alpha(t.palette.primary.main, 0.06) : "transparent",
        p: 1.5,
        minHeight: 100,
        transition: "all 0.2s",
        display: "flex",
        flexDirection: "column",
        gap: 1,
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <GroupsIcon sx={{ fontSize: 18, color: "text.secondary" }} />
        <Typography variant="subtitle2" sx={{ fontWeight: 700, flexGrow: 1 }}>
          {loc(classItem)}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {classItem.studentCount} {t("supervisors.students")}
        </Typography>
      </Box>

      {assigned.length === 0 && (
        <Typography
          variant="caption"
          color="text.disabled"
          sx={{ py: 2, textAlign: "center" }}
        >
          {t("supervisors.dropHint")}
        </Typography>
      )}

      {assigned.map((a) => (
        <Box
          key={a.id}
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 0.5,
            bgcolor: (t) =>
              a.isPrimary
                ? alpha(t.palette.primary.main, 0.08)
                : alpha(t.palette.common.black, 0.03),
            borderRadius: 1.5,
            px: 1,
            py: 0.5,
          }}
        >
          <Avatar
            sx={{
              width: 24,
              height: 24,
              bgcolor: (t) => alpha(t.palette.primary.main, 0.15),
            }}
          >
            <AssignmentIndIcon
              sx={{ fontSize: 14, color: "primary.main" }}
            />
          </Avatar>
          <Typography variant="body2" sx={{ flexGrow: 1, fontWeight: 500 }}>
            {a.supervisor?.name || t("supervisors.unknownSupervisor")}
          </Typography>

          <Tooltip title={t("supervisors.removeSupervisor")}>
            <IconButton
              size="small"
              onClick={() => onRemove(a.id)}
              sx={{ p: 0.3 }}
            >
              <CloseIcon sx={{ fontSize: 14 }} />
            </IconButton>
          </Tooltip>
        </Box>
      ))}
    </Box>
  );
}
