import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { useTheme, alpha } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import SchoolIcon from "@mui/icons-material/School";
import NotesIcon from "@mui/icons-material/Notes";
import SendIcon from "@mui/icons-material/Send";
import RefreshIcon from "@mui/icons-material/Refresh";
import { glassSx } from "../../../shared/utils/glassSx";
import { fetchSupervisorDashboard, fetchMeetings, createMeeting } from "../supervisionSlice";

export default function MeetingsManager() {
  const { t, i18n } = useTranslation();
  const loc = (item) => item ? (i18n.language === "en" && item.nameEn ? item.nameEn : item.name) : "";
  const theme = useTheme();
  const dispatch = useDispatch();
  const { supervisor, meetings, loading } = useSelector((s) => s.supervision);
  const authUser = useSelector((s) => s.auth.user);

  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [location, setLocation] = useState("");
  const [notes, setNotes] = useState("");
  const [targetClasses, setTargetClasses] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [snack, setSnack] = useState({ open: false, message: "", severity: "success" });

  useEffect(() => {
    if (authUser?.id) dispatch(fetchSupervisorDashboard(authUser.id));
    dispatch(fetchMeetings());
  }, [dispatch, authUser?.id]);

  const classes = supervisor?.classes || [];
  const myMeetings = meetings.filter((m) => classes.some((c) => c.id === m.classId));

  const handleSubmit = async () => {
    if (!title.trim() || !date || !time || targetClasses.length === 0) return;
    setSubmitting(true);
    for (const classId of targetClasses) {
      const cls = classes.find((c) => c.id === classId);
      await dispatch(createMeeting({
        meeting: {
          title: `${title} - ${loc(cls)}`,
          classId,
          date,
          time,
          location: location.trim() || "قاعة الاجتماعات",
          notes: notes.trim(),
        },
        createdBy: authUser?.supervisorId || "s9",
      }));
    }
    setSubmitting(false);
    setTitle("");
    setDate("");
    setTime("");
    setLocation("");
    setNotes("");
    setTargetClasses([]);
    setSnack({ open: true, message: t("supervision.meetings.successMessage"), severity: "success" });
    dispatch(fetchMeetings());
  };

  const statusColor = (status) => {
    switch (status) {
      case "planned": return "info";
      case "held": return "success";
      case "cancelled": return "error";
      default: return "default";
    }
  };

  const statusLabel = (status) => {
    switch (status) {
      case "planned": return t("supervision.meetings.planned");
      case "held": return t("supervision.meetings.held");
      case "cancelled": return t("supervision.meetings.cancelled");
      default: return status;
    }
  };

  return (
    <Box>
      {/* ─── Header ─── */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
        <Avatar sx={{ bgcolor: alpha(theme.palette.info.main, 0.12), color: "info.main", width: 48, height: 48 }}>
          <GroupAddIcon />
        </Avatar>
        <Box>
          <Typography variant="h5" fontWeight="bold">{t("supervision.meetings.title")}</Typography>
          <Typography variant="body2" color="text.secondary">{t("supervision.meetings.subtitle")}</Typography>
        </Box>
      </Box>

      <Grid container spacing={2.5}>
        {/* ─── Create Meeting Form ─── */}
        <Grid size={{ xs: 12, md: 5 }}>
          <Paper sx={{ ...glassSx(theme), borderRadius: 3, p: 2.5 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
              <CalendarMonthIcon color="info" />
              <Typography variant="subtitle1" fontWeight="bold">{t("supervision.meetings.createTitle")}</Typography>
            </Box>
            <Divider sx={{ mb: 2 }} />

            <Grid container spacing={2}>
              <Grid size={{ xs: 12 }}>
                <TextField size="small" fullWidth label={t("supervision.meetings.meetingTitle")}
                  value={title} onChange={(e) => setTitle(e.target.value)}
                  placeholder={t("supervision.meetings.meetingTitlePlaceholder")} />
              </Grid>
              <Grid size={{ xs: 6 }}>
                <TextField size="small" fullWidth label={t("supervision.meetings.date")} type="date"
                  value={date} onChange={(e) => setDate(e.target.value)}
                  slotProps={{ inputLabel: { shrink: true } }} />
              </Grid>
              <Grid size={{ xs: 6 }}>
                <TextField size="small" fullWidth label={t("supervision.meetings.time")} type="time"
                  value={time} onChange={(e) => setTime(e.target.value)}
                  slotProps={{ inputLabel: { shrink: true } }} />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <TextField size="small" fullWidth label={t("supervision.meetings.location")}
                  value={location} onChange={(e) => setLocation(e.target.value)}
                  placeholder={t("supervision.meetings.locationPlaceholder")} />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <FormControl size="small" fullWidth>
                  <InputLabel>{t("supervision.meetings.targetClasses")}</InputLabel>
                  <Select
                    multiple
                    value={targetClasses}
                    label={t("supervision.meetings.targetClasses")}
                    onChange={(e) => setTargetClasses(e.target.value)}
                    renderValue={(selected) => selected.map((id) => loc(classes.find((c) => c.id === id))).join("، ")}
                  >
                    {classes.map((cls) => (
                      <MenuItem key={cls.id} value={cls.id}>
                        {loc(cls)} — {cls.studentCount} {t("supervision.dashboard.student")}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid size={{ xs: 12 }}>
                <TextField size="small" fullWidth label={t("supervision.meetings.notes")} multiline rows={2}
                  value={notes} onChange={(e) => setNotes(e.target.value)}
                  placeholder={t("supervision.meetings.notesPlaceholder")} />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <Button variant="contained" color="info" fullWidth
                  startIcon={<SendIcon />}
                  onClick={handleSubmit}
                  disabled={submitting || !title.trim() || !date || !time || targetClasses.length === 0}
                  sx={{ borderRadius: 2, fontWeight: 700, py: 1.2 }}>
                  {submitting ? t("supervision.meetings.sending") : t("supervision.meetings.send")}
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* ─── Meetings List ─── */}
        <Grid size={{ xs: 12, md: 7 }}>
          <Paper sx={{ ...glassSx(theme), borderRadius: 3, p: 2.5 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
              <GroupAddIcon color="primary" />
              <Typography variant="subtitle1" fontWeight="bold" sx={{ flexGrow: 1 }}>
                {t("supervision.meetings.currentMeetings")}
              </Typography>
              <Chip label={myMeetings.length} size="small" color="primary" />
              <Tooltip title={t("supervision.meetings.refresh")}>
                <IconButton size="small" onClick={() => dispatch(fetchMeetings())}>
                  <RefreshIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>
            <Divider sx={{ mb: 2 }} />

            {loading && (
              <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
                <CircularProgress size={32} />
              </Box>
            )}

            {!loading && myMeetings.length > 0 ? (
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 600 }}>{t("supervision.meetings.titleCol")}</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>{t("supervision.meetings.classCol")}</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>{t("supervision.meetings.dateCol")}</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>{t("supervision.meetings.timeCol")}</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>{t("supervision.meetings.locationCol")}</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>{t("supervision.meetings.statusCol")}</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {myMeetings.map((m) => {
                      const cls = classes.find((c) => c.id === m.classId);
                      return (
                        <TableRow key={m.id} hover>
                          <TableCell>
                            <Typography variant="body2" fontWeight={600}>{i18n.language === "en" && m.titleEn ? m.titleEn : m.title}</Typography>
                            {(i18n.language === "en" && m.notesEn ? m.notesEn : m.notes) && (
                              <Typography variant="caption" color="text.secondary" sx={{ display: "block" }}>
                                {i18n.language === "en" && m.notesEn ? m.notesEn : m.notes}
                              </Typography>
                            )}
                          </TableCell>
                          <TableCell>{loc(cls) || m.classId}</TableCell>
                          <TableCell>{m.date}</TableCell>
                          <TableCell>{m.time}</TableCell>
                          <TableCell>{i18n.language === "en" && m.locationEn ? m.locationEn : m.location}</TableCell>
                          <TableCell>
                            <Chip size="small" color={statusColor(m.status)} label={statusLabel(m.status)} />
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : !loading && (
              <Alert severity="info" sx={{ borderRadius: 2 }}>
                {t("supervision.meetings.noMeetings")}
              </Alert>
            )}
          </Paper>
        </Grid>
      </Grid>

      {/* ─── Snackbar ─── */}
      <Snackbar open={snack.open} autoHideDuration={4000} onClose={() => setSnack((s) => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}>
        <Alert severity={snack.severity} variant="filled" sx={{ borderRadius: 2 }}>{snack.message}</Alert>
      </Snackbar>
    </Box>
  );
}
