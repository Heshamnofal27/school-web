import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { alpha, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Chip from "@mui/material/Chip";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import Avatar from "@mui/material/Avatar";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import IconButton from "@mui/material/IconButton";
import Divider from "@mui/material/Divider";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import SchoolIcon from "@mui/icons-material/School";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import CloseIcon from "@mui/icons-material/Close";
import { fetchSupervisorDashboard } from "../supervisionSlice";

const glassCard = (theme) => ({
  background: alpha(theme.palette.background.paper, 0.3),
  backdropFilter: "blur(24px)",
  border: "2px solid",
  borderColor: alpha(theme.palette.primary.main, 0.5),
  borderRadius: 3,
  height: "100%",
  display: "flex",
  flexDirection: "column",
  transition: "0.25s",
  cursor: "pointer",
  "&:hover": { transform: "translateY(-3px)", boxShadow: 6, borderColor: "primary.main" },
});

const glassCardContent = {
  display: "flex",
  flexDirection: "column",
  flexGrow: 1,
  p: 2.5,
  "&:last-child": { pb: 2.5 },
};

const gradientStatCard = (theme, color) => ({
  ...glassCard(theme),
  background: `linear-gradient(135deg, ${alpha(theme.palette[color].main, 0.12)}, ${alpha(theme.palette[color].light, 0.05)})`,
  borderColor: alpha(theme.palette[color].main, 0.5),
  "&:hover": { transform: "translateY(-3px)", boxShadow: 6, borderColor: `${theme.palette[color].main}` },
});

function DetailRow({ icon, label, value, color }) {
  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, py: 0.75 }}>
      <Box sx={{ color: color || "primary.main", display: "flex", alignItems: "center" }}>{icon}</Box>
      <Typography variant="body2" sx={{ flexGrow: 1 }}>{label}</Typography>
      <Typography variant="body2" sx={{ fontWeight: 700 }}>{value}</Typography>
    </Box>
  );
}

export default function SupervisionDashboard() {
  const { t, i18n } = useTranslation();
  const loc = (item) => item ? (i18n.language === "en" && item.nameEn ? item.nameEn : item.name) : "";
  const theme = useTheme();
  const dispatch = useDispatch();
  const { supervisor, stats, loading, error } = useSelector((s) => s.supervision);
  const authUser = useSelector((state) => state.auth.user);
  const [studentsDialogOpen, setStudentsDialogOpen] = useState(false);
  const [attendanceDialogOpen, setAttendanceDialogOpen] = useState(false);

  useEffect(() => {
    if (authUser?.id) dispatch(fetchSupervisorDashboard(authUser.id));
  }, [dispatch, authUser?.id]);

  if (loading) return <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}><CircularProgress /></Box>;
  if (error) return <Alert severity="error">{error}</Alert>;
  if (!supervisor) return null;

  const classes = supervisor.classes || [];

  return (
    <Box>
      {/* ─── Header ─── */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
        <Avatar sx={{ bgcolor: alpha(theme.palette.primary.main, 0.15), color: "primary.main", width: 52, height: 52 }}>
          <SchoolIcon />
        </Avatar>
        <Box>
          <Typography variant="h5" fontWeight="bold">{t("supervision.dashboard.title")}</Typography>
          <Typography variant="body2" color="text.secondary">
            {t("supervision.dashboard.welcome", { name: supervisor.name })} — {t("supervision.dashboard.today")} {new Date().toLocaleDateString(i18n.language === "en" ? "en-US" : "ar-SA")}
          </Typography>
        </Box>
      </Box>

      {/* ─── Stats Cards ─── */}
      {stats && (
        <Grid container spacing={2.5} sx={{ mb: 3.5 }}>
          <Grid size={{ xs: 6, md: 3 }} sx={{ display: "flex" }}>
            <Card sx={gradientStatCard(theme, "primary")} onClick={() => setStudentsDialogOpen(true)}>
              <CardContent sx={glassCardContent}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2, flexGrow: 1 }}>
                  <Avatar sx={{ bgcolor: alpha(theme.palette.primary.main, 0.15), color: "primary.main", width: 56, height: 56 }}>
                    <PeopleAltIcon sx={{ fontSize: 28 }} />
                  </Avatar>
                  <Box>
                    <Typography variant="h3" fontWeight="bold" sx={{ lineHeight: 1, fontSize: { xs: "1.8rem", md: "2rem" } }}>{stats.totalStudents}</Typography>
                    <Typography variant="body2" color="text.secondary">{t("supervision.dashboard.totalStudents")}</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 6, md: 3 }} sx={{ display: "flex" }}>
            <Card sx={gradientStatCard(theme, "success")} onClick={() => setAttendanceDialogOpen(true)}>
              <CardContent sx={glassCardContent}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2, flexGrow: 1 }}>
                  <Avatar sx={{ bgcolor: alpha(theme.palette.success.main, 0.15), color: "success.main", width: 56, height: 56 }}>
                    <CalendarMonthIcon sx={{ fontSize: 28 }} />
                  </Avatar>
                  <Box>
                    <Typography variant="h3" fontWeight="bold" sx={{ lineHeight: 1, fontSize: { xs: "1.8rem", md: "2rem" } }}>{stats.attendanceRate}%</Typography>
                    <Typography variant="body2" color="text.secondary">{t("supervision.dashboard.attendanceRate")}</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

        </Grid>
      )}

      {/* ─── Students Detail Dialog ─── */}
      <Dialog open={studentsDialogOpen} onClose={() => setStudentsDialogOpen(false)} maxWidth="sm" fullWidth
        PaperProps={{ sx: { borderRadius: 3, background: alpha(theme.palette.background.paper, 0.95), backdropFilter: "blur(24px)" } }}>
        <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <PeopleAltIcon color="primary" />
            {t("supervision.dashboard.totalStudents")}
          </Box>
          <IconButton onClick={() => setStudentsDialogOpen(false)} size="small"><CloseIcon /></IconButton>
        </DialogTitle>
        <DialogContent>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>{t("common.class")}</TableCell>
                  <TableCell align="center">{t("supervision.dashboard.student")}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {classes.map((cls) => (
                  <TableRow key={cls.id}>
                    <TableCell>{loc(cls)}</TableCell>
                    <TableCell align="center"><strong>{cls.studentCount}</strong></TableCell>
                  </TableRow>
                ))}
                <TableRow sx={{ "& td": { fontWeight: "bold", borderBottom: "none" } }}>
                  <TableCell>{t("common.total")}</TableCell>
                  <TableCell align="center">{stats?.totalStudents}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
      </Dialog>

      {/* ─── Attendance Detail Dialog ─── */}
      <Dialog open={attendanceDialogOpen} onClose={() => setAttendanceDialogOpen(false)} maxWidth="sm" fullWidth
        PaperProps={{ sx: { borderRadius: 3, background: alpha(theme.palette.background.paper, 0.95), backdropFilter: "blur(24px)" } }}>
        <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <CalendarMonthIcon color="success" />
            {t("supervision.dashboard.attendanceRate")}
          </Box>
          <IconButton onClick={() => setAttendanceDialogOpen(false)} size="small"><CloseIcon /></IconButton>
        </DialogTitle>
        <DialogContent>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>{t("common.class")}</TableCell>
                  <TableCell align="center">{t("supervision.dashboard.present")}</TableCell>
                  <TableCell align="center">{t("supervision.dashboard.absent")}</TableCell>
                  <TableCell align="center">{t("supervision.dashboard.late")}</TableCell>
                  <TableCell align="center">{t("supervision.dashboard.attendanceRate")}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {classes.map((cls) => (
                  <TableRow key={cls.id}>
                    <TableCell>{loc(cls)}</TableCell>
                    <TableCell align="center">{cls.attendance?.present ?? "-"}</TableCell>
                    <TableCell align="center">{cls.attendance?.absent ?? "-"}</TableCell>
                    <TableCell align="center">{cls.attendance?.late ?? "-"}</TableCell>
                    <TableCell align="center">
                      <Chip label={`${cls.rate}%`} size="small"
                        color={cls.rate >= 80 ? "success" : cls.rate >= 60 ? "warning" : "error"} />
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow sx={{ "& td": { fontWeight: "bold", borderBottom: "none" } }}>
                  <TableCell>{t("common.total")}</TableCell>
                  <TableCell align="center">{stats?.attendancePresent}</TableCell>
                  <TableCell align="center">{stats?.attendanceAbsent}</TableCell>
                  <TableCell align="center">{stats?.attendanceLate}</TableCell>
                  <TableCell align="center"><Chip label={`${stats?.attendanceRate}%`} size="small" color={stats?.attendanceRate >= 80 ? "success" : stats?.attendanceRate >= 60 ? "warning" : "error"} /></TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
      </Dialog>

    </Box>
  );
}
