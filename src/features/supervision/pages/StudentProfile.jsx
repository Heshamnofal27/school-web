import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Link from "@mui/material/Link";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Avatar from "@mui/material/Avatar";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ReportIcon from "@mui/icons-material/Report";
import DescriptionIcon from "@mui/icons-material/Description";
import PhoneInTalkIcon from "@mui/icons-material/PhoneInTalk";
import GavelIcon from "@mui/icons-material/Gavel";
import AddIcon from "@mui/icons-material/Add";
import SaveIcon from "@mui/icons-material/Save";
import CloseIcon from "@mui/icons-material/Close";
import {
  fetchStudentDetail, addBehavior, addPenalty, addParentContact,
  fetchStudentReports, saveStudentReport,
  clearStudentDetail,
} from "../supervisionSlice";
import { glassSx } from "../../../shared/utils/glassSx";

const glassCard = {
  borderRadius: 3,
  height: "100%",
  display: "flex",
  flexDirection: "column",
};

export default function StudentProfile() {
  const { studentId } = useParams();
  const { t, i18n } = useTranslation();
  const theme = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { studentDetail, reports, error } = useSelector((s) => s.supervision);
  const authUser = useSelector((s) => s.auth.user);
  const supId = authUser?.supervisorId || "s9";

  /* ── Behavior form ── */
  const [bType, setBType] = useState("positive");
  const [bDesc, setBDesc] = useState("");
  const [bLoading, setBLoading] = useState(false);

  /* ── Decision dialog ── */
  const [decDialog, setDecDialog] = useState({ open: false, action: "", title: "" });
  const [decReason, setDecReason] = useState("");

  /* ── Report form ── */
  const [rType, setRType] = useState("semester");
  const [rContent, setRContent] = useState("");
  const [rLoading, setRLoading] = useState(false);

  /* ── Snackbar ── */
  const [snack, setSnack] = useState({ open: false, message: "", severity: "success" });

  useEffect(() => {
    if (studentId) {
      dispatch(fetchStudentDetail(studentId));
      dispatch(fetchStudentReports(studentId));
    }
    return () => { dispatch(clearStudentDetail()); };
  }, [dispatch, studentId]);

  const s = studentDetail;

  const handleAddBehavior = async () => {
    if (!bDesc.trim()) return;
    setBLoading(true);
    await dispatch(addBehavior({ studentId, type: bType, description: bDesc, recordedBy: supId }));
    setBLoading(false);
    setBDesc("");
    setSnack({ open: true, message: t("supervision.student.noteAdded") || "تمت الإضافة", severity: "success" });
    dispatch(fetchStudentDetail(studentId));
  };

  const openDecisionDialog = (action, label) => {
    setDecDialog({ open: true, action, title: label });
    setDecReason("");
  };

  const handleDecision = async () => {
    if (!decReason.trim()) return;
    const { action } = decDialog;
    if (action === "summon") {
      await dispatch(addParentContact({ studentId, reason: decReason, type: "summons", notes: decReason, recordedBy: supId }));
    } else if (action === "penalty") {
      await dispatch(addPenalty({ studentId, type: "detention", reason: decReason, recordedBy: supId }));
    } else if (action === "warning") {
      await dispatch(addBehavior({ studentId, type: "warning", description: decReason, recordedBy: supId }));
    }
    setDecDialog({ open: false, action: "", title: "" });
    setDecReason("");
    setSnack({ open: true, message: t("supervision.student.decisionSaved"), severity: "success" });
    dispatch(fetchStudentDetail(studentId));
  };

  const handleSaveReport = async () => {
    if (!rContent.trim()) return;
    setRLoading(true);
    await dispatch(saveStudentReport({ studentId, type: rType, content: rContent, createdBy: supId }));
    setRLoading(false);
    setRContent("");
    setSnack({ open: true, message: t("supervision.student.reportSaved"), severity: "success" });
  };

  if (!s) {
    if (error) return <Alert severity="error">{error}</Alert>;
    return <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}><CircularProgress /></Box>;
  }

  const allPenalties = s.penalties || [];
  const allContacts = s.parentContacts || [];
  const recentBehaviors = (s.behaviors || []).slice(0, 5);
  const recentDecisions = [...allPenalties.map((p) => ({ ...p, decType: "penalty" })), ...allContacts.map((c) => ({ ...c, decType: "contact" }))]
    .sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5);

  const acaAvg = s.evaluations?.length ? Math.round(s.evaluations.reduce((sum, e) => sum + e.academic, 0) / s.evaluations.length) : null;

  return (
    <Box>
      <Breadcrumbs sx={{ mb: 2 }}>
        <Link underline="hover" color="inherit" sx={{ cursor: "pointer" }} onClick={() => navigate("/supervisor/dashboard")}>
          {t("supervision.dashboard.title")}
        </Link>
        <Link underline="hover" color="inherit" sx={{ cursor: "pointer" }} onClick={() => navigate(-1)}>
          {t("supervision.students.title")}
        </Link>
        <Typography color="text.primary">{s.name}</Typography>
      </Breadcrumbs>

      {/* ═══ Student Header ═══ */}
      <Paper sx={{ ...glassSx(theme), mb: 3 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2.5, p: 2.5, flexWrap: "wrap" }}>
          <Avatar sx={{ width: 60, height: 60, fontSize: 22, bgcolor: alpha(theme.palette.primary.main, 0.15), color: "primary.main" }}>
            {s.name?.charAt(0)}
          </Avatar>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h5" fontWeight="bold">{s.name}</Typography>
            <Typography variant="body2" color="text.secondary">{s.studentId}</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.3 }}>
              {i18n.language === "en" && s.gradeNameEn ? s.gradeNameEn : s.gradeName} — {i18n.language === "en" && s.classNameEn ? s.classNameEn : s.className}
            </Typography>
          </Box>
          <Box sx={{ display: "flex", gap: 1.5, flexWrap: "wrap" }}>
            <Chip icon={<CheckCircleIcon />} label={acaAvg != null ? `${t("supervision.student.academic")}: ${acaAvg}%` : t("supervision.student.noData")}
              color={acaAvg >= 75 ? "success" : acaAvg >= 50 ? "warning" : "error"} variant="outlined" />
            <Chip icon={<WarningAmberIcon />}
              label={`${t("supervision.student.behaviors")}: ${(s.behaviors || []).length}`} color="warning" variant="outlined" />
            <Chip icon={<GavelIcon />}
              label={`${t("supervision.student.penalties")}: ${allPenalties.length}`} color="error" variant="outlined" />
          </Box>
        </Box>
      </Paper>

      {/* ═══ 3-Section Layout ═══ */}
      <Grid container spacing={2.5}>
        {/* ─── 1. Behavior Log ─── */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper sx={{ ...glassSx(theme), ...glassCard, p: 2.5 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
              <WarningAmberIcon color="warning" />
              <Typography variant="subtitle1" fontWeight="bold">{t("supervision.student.behaviors")}</Typography>
            </Box>
            <Divider sx={{ mb: 2 }} />

            <Box sx={{ display: "flex", gap: 1.5, mb: 2, flexWrap: "wrap" }}>
              <Select size="small" value={bType} onChange={(e) => setBType(e.target.value)} sx={{ width: 130 }}>
                <MenuItem value="positive">{t("supervision.student.positive")}</MenuItem>
                <MenuItem value="negative">{t("supervision.student.negative")}</MenuItem>
                <MenuItem value="warning">{t("supervision.student.warning")}</MenuItem>
              </Select>
              <TextField size="small" value={bDesc} onChange={(e) => setBDesc(e.target.value)}
                placeholder={t("supervision.student.description")} sx={{ flexGrow: 1, minWidth: 180 }} />
              <Button variant="contained" color="warning" startIcon={<AddIcon />}
                onClick={handleAddBehavior} disabled={bLoading || !bDesc.trim()}>
                {t("common.add")}
              </Button>
            </Box>

            <Typography variant="caption" fontWeight="bold" color="text.secondary" sx={{ display: "block", mb: 1 }}>
              {t("supervision.overview.recentBehaviors")}
            </Typography>
            {recentBehaviors.length > 0 ? (
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 600 }}>{t("supervision.student.date")}</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>{t("supervision.student.type")}</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>{t("supervision.student.description")}</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {recentBehaviors.map((b) => (
                      <TableRow key={b.id}>
                        <TableCell><Typography variant="caption">{b.date}</Typography></TableCell>
                        <TableCell>
                          <Chip size="small"
                            color={b.type === "positive" ? "success" : b.type === "warning" ? "warning" : "error"}
                            label={t(`supervision.student.${b.type}`)} />
                        </TableCell>
                        <TableCell><Typography variant="body2">{b.description}</Typography></TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <Typography variant="body2" color="text.secondary">{t("supervision.overview.noBehaviors")}</Typography>
            )}
          </Paper>
        </Grid>

        {/* ─── 2. Admin Decisions ─── */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper sx={{ ...glassSx(theme), ...glassCard, p: 2.5 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
              <GavelIcon color="error" />
              <Typography variant="subtitle1" fontWeight="bold">{t("supervision.student.adminDecision")}</Typography>
            </Box>
            <Divider sx={{ mb: 2 }} />

            <Grid container spacing={1.5} sx={{ mb: 2.5 }}>
              <Grid size={{ xs: 12, sm: 4 }}>
                <Button fullWidth variant="outlined" color="warning"
                  onClick={() => openDecisionDialog("summon", t("supervision.student.decisionSummon"))}
                  startIcon={<PhoneInTalkIcon />}
                  slotProps={{ startIcon: { sx: { marginInlineEnd: 3 } } }}
                  sx={{ borderRadius: 2, py: 1.2, fontWeight: 600 }}>
                  {t("supervision.student.decisionSummon")}
                </Button>
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                <Button fullWidth variant="outlined" color="error"
                  onClick={() => openDecisionDialog("penalty", t("supervision.student.decisionPenalty"))}
                  startIcon={<GavelIcon />}
                  slotProps={{ startIcon: { sx: { marginInlineEnd: 3 } } }}
                  sx={{ borderRadius: 2, py: 1.2, fontWeight: 600 }}>
                  {t("supervision.student.decisionPenalty")}
                </Button>
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                <Button fullWidth variant="outlined" color="warning"
                  onClick={() => openDecisionDialog("warning", t("supervision.student.decisionWarning"))}
                  startIcon={<ReportIcon />}
                  slotProps={{ startIcon: { sx: { marginInlineEnd: 3 } } }}
                  sx={{ borderRadius: 2, py: 1.2, fontWeight: 600 }}>
                  {t("supervision.student.decisionWarning")}
                </Button>
              </Grid>
            </Grid>

            <Typography variant="caption" fontWeight="bold" color="text.secondary" sx={{ display: "block", mb: 1 }}>
              {t("supervision.overview.recentBehaviors")}
            </Typography>
            {recentDecisions.length > 0 ? (
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 600 }}>{t("supervision.student.date")}</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>{t("supervision.student.type")}</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>{t("supervision.student.reason")}</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>{t("supervision.student.status")}</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {recentDecisions.map((d) => (
                      <TableRow key={d.id}>
                        <TableCell><Typography variant="caption">{d.date}</Typography></TableCell>
                        <TableCell>
                          <Chip size="small"
                            color={d.decType === "penalty" ? "error" : "warning"}
                            label={d.decType === "penalty" ? t("supervision.student.penalties") : t("supervision.student.contacts")} />
                        </TableCell>
                        <TableCell><Typography variant="body2">{d.reason}</Typography></TableCell>
                        <TableCell>
                          <Chip size="small"
                            color={d.status === "done" || d.status === "executed" ? "success" : "warning"}
                            label={t(`supervision.student.${d.status === "executed" ? "done" : d.status}`)} />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <Typography variant="body2" color="text.secondary">{t("supervision.student.noData")}</Typography>
            )}
          </Paper>
        </Grid>

        {/* ─── 3. Performance Reports ─── */}
        <Grid size={{ xs: 12 }}>
          <Paper sx={{ ...glassSx(theme), borderRadius: 3 }}>
            <Box sx={{ p: 2.5 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                <DescriptionIcon color="primary" />
                <Typography variant="subtitle1" fontWeight="bold">{t("supervision.student.reportsTitle")}</Typography>
                <Typography variant="caption" color="text.secondary" sx={{ mr: "auto" }}>{t("supervision.student.reportsDesc")}</Typography>
              </Box>
              <Divider sx={{ mb: 2 }} />

              <Grid container spacing={2} sx={{ mb: 2 }}>
                <Grid size={{ xs: 12, sm: 3 }}>
                  <Select size="small" value={rType} onChange={(e) => setRType(e.target.value)} fullWidth>
                    <MenuItem value="semester">{t("supervision.student.reportSemester")}</MenuItem>
                    <MenuItem value="yearly">{t("supervision.student.reportYearly")}</MenuItem>
                  </Select>
                </Grid>
                <Grid size={{ xs: 12, sm: 9 }} sx={{ display: "flex", gap: 1.5 }}>
                  <TextField size="small" multiline rows={3} fullWidth value={rContent}
                    onChange={(e) => setRContent(e.target.value)}
                    placeholder={t("supervision.student.reportPlaceholder")} />
                </Grid>
              </Grid>
              <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
                <Button variant="contained" startIcon={<SaveIcon />}
                  onClick={handleSaveReport} disabled={rLoading || !rContent.trim()}>
                  {rLoading ? t("common.saving") : t("supervision.student.reportSave")}
                </Button>
              </Box>
            </Box>

            <Divider />
            <Box sx={{ p: 2.5 }}>
              <Typography variant="caption" fontWeight="bold" color="text.secondary" sx={{ display: "block", mb: 1.5 }}>
                {t("supervision.overview.recentEvals")}
              </Typography>
              {reports?.length > 0 ? (
                <Grid container spacing={1.5}>
                  {reports.map((r) => (
                    <Grid size={{ xs: 12, sm: 6, md: 4 }} key={r.id}>
                      <Paper sx={{ p: 1.5, borderRadius: 2, bgcolor: alpha(theme.palette.background.paper, 0.2),
                        border: "1px solid", borderColor: alpha(theme.palette.divider, 0.3) }}>
                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
                          <Chip size="small" icon={<DescriptionIcon />}
                            label={t(`supervision.student.report${r.type === "yearly" ? "Yearly" : "Semester"}`)}
                            color="primary" variant="outlined" />
                          <Typography variant="caption" color="text.disabled">{r.date}</Typography>
                        </Box>
                        <Typography variant="body2" sx={{ whiteSpace: "pre-wrap" }}>{r.content}</Typography>
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
              ) : (
                <Typography variant="body2" color="text.secondary">{t("supervision.student.noReports")}</Typography>
              )}
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* ─── Decision Dialog ─── */}
      <Dialog open={decDialog.open} onClose={() => setDecDialog({ open: false, action: "", title: "" })}
        maxWidth="sm" fullWidth
        PaperProps={{ sx: { borderRadius: 3, background: alpha(theme.palette.background.paper, 0.95), backdropFilter: "blur(24px)" } }}>
        <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <GavelIcon color="error" />
            <Typography variant="h6" fontWeight="bold">{decDialog.title} — {s.name}</Typography>
          </Box>
          <IconButton onClick={() => setDecDialog({ open: false, action: "", title: "" })} size="small"><CloseIcon /></IconButton>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {t("supervision.student.decisionContext")}
          </Typography>
          <TextField multiline rows={4} fullWidth size="small" value={decReason}
            onChange={(e) => setDecReason(e.target.value)}
            placeholder={t("supervision.student.decisionContext")} />
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 0 }}>
          <Button onClick={() => setDecDialog({ open: false, action: "", title: "" })}>{t("common.cancel")}</Button>
          <Button variant="contained" color="error" onClick={handleDecision} disabled={!decReason.trim()}>
            {t("common.add")}
          </Button>
        </DialogActions>
      </Dialog>

      {/* ─── Snackbar ─── */}
      <Snackbar open={snack.open} autoHideDuration={4000} onClose={() => setSnack((s) => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}>
        <Alert severity={snack.severity} variant="filled" sx={{ borderRadius: 2 }}>{snack.message}</Alert>
      </Snackbar>
    </Box>
  );
}
