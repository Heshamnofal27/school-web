import { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { alpha, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TablePagination from "@mui/material/TablePagination";
import Paper from "@mui/material/Paper";
import Chip from "@mui/material/Chip";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Link from "@mui/material/Link";
import Avatar from "@mui/material/Avatar";
import Divider from "@mui/material/Divider";
import SearchIcon from "@mui/icons-material/Search";
import VisibilityIcon from "@mui/icons-material/Visibility";
import NoteAddIcon from "@mui/icons-material/NoteAdd";
import GavelIcon from "@mui/icons-material/Gavel";
import SchoolIcon from "@mui/icons-material/School";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CloseIcon from "@mui/icons-material/Close";
import WarningIcon from "@mui/icons-material/Warning";
import BlockIcon from "@mui/icons-material/Block";
import { fetchStudentsByClass, addBehavior, addPenalty } from "../supervisionSlice";

const behaviorDot = (color) => ({
  width: 10,
  height: 10,
  borderRadius: "50%",
  bgcolor: `${color}.main`,
  boxShadow: (t) => `0 0 0 3px ${alpha(t.palette[color].main, 0.2)}`,
  flexShrink: 0,
});

const getBehaviorStatus = (student) => {
  const negCount = student.behaviors?.filter((b) => b.type === "negative").length || 0;
  const posCount = student.behaviors?.filter((b) => b.type === "positive").length || 0;
  const penaltyCount = student.penalties?.length || 0;
  if (negCount > 0 || penaltyCount > 0) return "needsAttention";
  if (posCount >= 3) return "excellent";
  return "good";
};

const statusMeta = {
  excellent: { color: "success", icon: <CheckCircleIcon fontSize="inherit" />, glow: alpha("#15803D", 0.25) },
  good: { color: "info", icon: null, glow: alpha("#0369A1", 0.15) },
  needsAttention: { color: "error", icon: <WarningIcon fontSize="inherit" />, glow: alpha("#B91C1C", 0.25) },
};

export default function StudentList() {
  const { classId } = useParams();
  const { t, i18n } = useTranslation();
  const theme = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { students, loading, error } = useSelector((s) => s.supervision);
  const loc = (item) => item ? (i18n.language === "en" && item.nameEn ? item.nameEn : item.name) : "";
  const authUser = useSelector((s) => s.auth.user);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  /* ── Note Dialog ── */
  const [noteDialogOpen, setNoteDialogOpen] = useState(false);
  const [noteStudent, setNoteStudent] = useState(null);
  const [noteType, setNoteType] = useState("positive");
  const [noteDesc, setNoteDesc] = useState("");
  const [noteSubmitting, setNoteSubmitting] = useState(false);

  /* ── Decision Dialog ── */
  const [decisionDialogOpen, setDecisionDialogOpen] = useState(false);
  const [decisionStudent, setDecisionStudent] = useState(null);
  const [decisionType, setDecisionType] = useState("warning");
  const [decisionDesc, setDecisionDesc] = useState("");
  const [decisionSubmitting, setDecisionSubmitting] = useState(false);

  /* ── Card Detail Dialogs ── */
  const [studentsDetailOpen, setStudentsDetailOpen] = useState(false);
  const [excellentDetailOpen, setExcellentDetailOpen] = useState(false);
  const [attentionDetailOpen, setAttentionDetailOpen] = useState(false);
  const [academicDetailOpen, setAcademicDetailOpen] = useState(false);

  /* ── Snackbar ── */
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  useEffect(() => { if (classId) dispatch(fetchStudentsByClass(classId)); }, [dispatch, classId]);

  const filtered = useMemo(() => {
    if (!search) return students;
    const q = search.toLowerCase();
    return students.filter((s) => (s.name || "").toLowerCase().includes(q) || (s.id || "").toLowerCase().includes(q));
  }, [students, search]);

  const paginated = useMemo(() => filtered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage), [filtered, page, rowsPerPage]);

  const classInfo = students[0] || {};

  /* ── Stats ── */
  const stats = useMemo(() => {
    const total = students.length;
    const excellent = students.filter((s) => getBehaviorStatus(s) === "excellent").length;
    const needsAttention = students.filter((s) => getBehaviorStatus(s) === "needsAttention").length;
    const avgRate = total ? Math.round(students.reduce((sum, s) => sum + (s.academicAverage || 0), 0) / total) : 0;
    return { total, excellent, needsAttention, avgRate };
  }, [students]);

  /* ── Handlers ── */
  const openNoteDialog = (student) => { setNoteStudent(student); setNoteType("positive"); setNoteDesc(""); setNoteDialogOpen(true); };
  const openDecisionDialog = (student) => { setDecisionStudent(student); setDecisionType("warning"); setDecisionDesc(""); setDecisionDialogOpen(true); };

  const handleAddNote = async () => {
    if (!noteDesc.trim()) return;
    setNoteSubmitting(true);
    const supId = authUser?.supervisorId || "s9";
    await dispatch(addBehavior({ studentId: noteStudent.id, type: noteType, description: noteDesc, recordedBy: supId }));
    setNoteSubmitting(false);
    setNoteDialogOpen(false);
    setSnackbar({ open: true, message: t("supervision.students.noteAdded"), severity: "success" });
    dispatch(fetchStudentsByClass(classId));
  };

  const handleAddDecision = async () => {
    if (!decisionDesc.trim()) return;
    setDecisionSubmitting(true);
    const supId = authUser?.supervisorId || "s9";
    await dispatch(addPenalty({ studentId: decisionStudent.id, type: decisionType, reason: decisionDesc, recordedBy: supId }));
    setDecisionSubmitting(false);
    setDecisionDialogOpen(false);
    setSnackbar({ open: true, message: t("supervision.students.decisionAdded"), severity: "success" });
    dispatch(fetchStudentsByClass(classId));
  };

  const glass = {
    paper: {
      background: alpha(theme.palette.background.paper, 0.3),
      backdropFilter: "blur(24px)",
      border: "2px solid",
      borderColor: alpha(theme.palette.primary.main, 0.5),
      borderRadius: 3,
    },
    dialog: {
      borderRadius: 3,
      background: alpha(theme.palette.background.paper, 0.95),
      backdropFilter: "blur(24px)",
    },
  };

  if (loading && !students.length) return <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}><CircularProgress /></Box>;
  if (error && !students.length) return <Alert severity="error">{error}</Alert>;

  return (
    <Box>
      {/* ─── Breadcrumbs ─── */}
      <Breadcrumbs sx={{ mb: 2 }}>
        <Link underline="hover" color="inherit" sx={{ cursor: "pointer" }} onClick={() => navigate("/supervisor/dashboard")}>
          {t("supervision.dashboard.title")}
        </Link>
        <Typography color="text.primary">{i18n.language === "en" && classInfo.classNameEn ? classInfo.classNameEn : classInfo.className || t("supervision.students.title")}</Typography>
      </Breadcrumbs>

      {/* ─── Class Header ─── */}
      <Paper sx={{ ...glass.paper, mb: 3 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2.5, p: 3 }}>
          <Avatar sx={{ bgcolor: alpha(theme.palette.primary.main, 0.12), color: "primary.main", width: 60, height: 60 }}>
            <SchoolIcon sx={{ fontSize: 30 }} />
          </Avatar>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h5" fontWeight="bold">{i18n.language === "en" && classInfo.classNameEn ? classInfo.classNameEn : classInfo.className || t("supervision.students.title")}</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.3 }}>
              {i18n.language === "en" && classInfo.gradeNameEn ? classInfo.gradeNameEn : classInfo.gradeName} — {students.length} {t("supervision.dashboard.student")}
            </Typography>
          </Box>
          <Chip label={i18n.language === "en" && classInfo.classNameEn ? classInfo.classNameEn : classInfo.className || classId} color="primary" variant="outlined" sx={{ fontWeight: 600, px: 1 }} />
        </Box>
      </Paper>

      {/* ─── Stats Strip ─── */}
      <Box sx={{ display: "flex", gap: 2, mb: 3, flexWrap: "wrap" }}>
        <Paper sx={{ ...glass.paper, flex: 1, minWidth: 140, p: 2, cursor: "pointer", transition: "0.2s", "&:hover": { transform: "translateY(-2px)" } }} onClick={() => setStudentsDetailOpen(true)}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Avatar sx={{ bgcolor: alpha(theme.palette.primary.main, 0.1), color: "primary.main", width: 40, height: 40 }}>
              <PeopleAltIcon sx={{ fontSize: 20 }} />
            </Avatar>
            <Box>
              <Typography variant="h5" fontWeight="bold" sx={{ lineHeight: 1.2 }}>{stats.total}</Typography>
              <Typography variant="caption" color="text.secondary">{t("supervision.dashboard.totalStudents")}</Typography>
            </Box>
          </Box>
        </Paper>
        <Paper sx={{ ...glass.paper, flex: 1, minWidth: 140, p: 2, cursor: "pointer", transition: "0.2s", "&:hover": { transform: "translateY(-2px)" } }} onClick={() => setExcellentDetailOpen(true)}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Avatar sx={{ bgcolor: alpha("#15803D", 0.12), color: "success.main", width: 40, height: 40 }}>
              <CheckCircleIcon sx={{ fontSize: 20 }} />
            </Avatar>
            <Box>
              <Typography variant="h5" fontWeight="bold" sx={{ lineHeight: 1.2, color: "success.main" }}>{stats.excellent}</Typography>
              <Typography variant="caption" color="text.secondary">{t("supervision.students.statusExcellent")}</Typography>
            </Box>
          </Box>
        </Paper>
        <Paper sx={{ ...glass.paper, flex: 1, minWidth: 140, p: 2, cursor: "pointer", transition: "0.2s", "&:hover": { transform: "translateY(-2px)" } }} onClick={() => setAttentionDetailOpen(true)}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Avatar sx={{ bgcolor: alpha(theme.palette.error.main, 0.12), color: "error.main", width: 40, height: 40 }}>
              <BlockIcon sx={{ fontSize: 20 }} />
            </Avatar>
            <Box>
              <Typography variant="h5" fontWeight="bold" sx={{ lineHeight: 1.2, color: "error.main" }}>{stats.needsAttention}</Typography>
              <Typography variant="caption" color="text.secondary">{t("supervision.students.statusNeedsAttention")}</Typography>
            </Box>
          </Box>
        </Paper>
        <Paper sx={{ ...glass.paper, flex: 1, minWidth: 140, p: 2, cursor: "pointer", transition: "0.2s", "&:hover": { transform: "translateY(-2px)" } }} onClick={() => setAcademicDetailOpen(true)}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Avatar sx={{ bgcolor: alpha(theme.palette.warning.main, 0.12), color: "warning.main", width: 40, height: 40 }}>
              <SchoolIcon sx={{ fontSize: 20 }} />
            </Avatar>
            <Box>
              <Typography variant="h5" fontWeight="bold" sx={{ lineHeight: 1.2 }}>{stats.avgRate}%</Typography>
              <Typography variant="caption" color="text.secondary">{t("supervision.student.academic")}</Typography>
            </Box>
          </Box>
        </Paper>
      </Box>

      {/* ─── Search ─── */}
      <TextField
        size="small"
        placeholder={t("supervision.students.search")}
        value={search}
        onChange={(e) => { setSearch(e.target.value); setPage(0); }}
        sx={{ mb: 2.5, width: { xs: "100%", sm: 360 } }}
        slotProps={{ input: { startAdornment: <InputAdornment position="start"><SearchIcon /></InputAdornment> } }}
      />

      {/* ─── Table ─── */}
      <TableContainer component={Paper} sx={{ ...glass.paper, overflow: "hidden" }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 700, width: 50, fontSize: "0.8rem", color: "text.secondary", borderBottom: (t) => `2px solid ${alpha(t.palette.divider, 0.6)}` }}>#</TableCell>
              <TableCell sx={{ fontWeight: 700, fontSize: "0.8rem", color: "text.secondary", borderBottom: (t) => `2px solid ${alpha(t.palette.divider, 0.6)}` }}>{t("supervision.students.name")}</TableCell>
              <TableCell sx={{ fontWeight: 700, fontSize: "0.8rem", color: "text.secondary", borderBottom: (t) => `2px solid ${alpha(t.palette.divider, 0.6)}` }} align="center">{t("supervision.student.academic")}</TableCell>
              <TableCell sx={{ fontWeight: 700, fontSize: "0.8rem", color: "text.secondary", borderBottom: (t) => `2px solid ${alpha(t.palette.divider, 0.6)}` }} align="center">{t("supervision.student.behavior")}</TableCell>
              <TableCell sx={{ fontWeight: 700, fontSize: "0.8rem", color: "text.secondary", borderBottom: (t) => `2px solid ${alpha(t.palette.divider, 0.6)}` }} align="center">{t("supervision.students.actions")}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginated.map((s, idx) => {
              const status = getBehaviorStatus(s);
              const meta = statusMeta[status];
              const avg = s.academicAverage;
              return (
                <TableRow
                  key={s.id}
                  hover
                  sx={{
                    "&:hover": { bgcolor: alpha(theme.palette.action.hover, 0.25) },
                    "&:last-child td": { borderBottom: "none" },
                    transition: "0.15s",
                  }}
                >
                  <TableCell>
                    <Typography variant="body2" color="text.disabled" sx={{ fontWeight: 500 }}>
                      {page * rowsPerPage + idx + 1}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                      <Avatar sx={{ width: 34, height: 34, fontSize: 13, bgcolor: alpha(theme.palette.primary.main, 0.12), color: "primary.main", fontWeight: 700 }}>
                        {s.name.charAt(0)}
                      </Avatar>
                      <Box>
                        <Typography variant="body2" fontWeight={600} sx={{ lineHeight: 1.3 }}>{s.name}</Typography>
                        <Typography variant="caption" color="text.disabled" sx={{ fontSize: "0.7rem" }}>{s.id}</Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell align="center">
                    {avg != null ? (
                      <Box sx={{ position: "relative", display: "inline-flex", alignItems: "center", gap: 0.5 }}>
                        <Box
                          sx={{
                            width: 40,
                            height: 40,
                            borderRadius: "50%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            bgcolor: alpha(
                              avg >= 75 ? theme.palette.success.main : avg >= 50 ? theme.palette.warning.main : theme.palette.error.main,
                              0.12,
                            ),
                            border: "2px solid",
                            borderColor:
                              avg >= 75 ? alpha(theme.palette.success.main, 0.5) : avg >= 50 ? alpha(theme.palette.warning.main, 0.5) : alpha(theme.palette.error.main, 0.5),
                          }}
                        >
                          <Typography
                            variant="caption"
                            fontWeight={700}
                            sx={{
                              color: avg >= 75 ? "success.main" : avg >= 50 ? "warning.main" : "error.main",
                              fontSize: "0.7rem",
                            }}
                          >
                            {avg}
                          </Typography>
                        </Box>
                        <Typography variant="caption" sx={{ color: "text.disabled", fontSize: "0.65rem" }}>%</Typography>
                      </Box>
                    ) : (
                      <Typography variant="caption" color="text.disabled">—</Typography>
                    )}
                  </TableCell>
                  <TableCell align="center">
                    <Box sx={{ display: "flex", justifyContent: "center" }}>
                      <Box
                        sx={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 0.75,
                          px: 1.25,
                          py: 0.4,
                          borderRadius: 20,
                          bgcolor: alpha(meta.glow, 0.15),
                          border: "1px solid",
                          borderColor: alpha(meta.glow, 0.3),
                        }}
                      >
                        <Box sx={behaviorDot(statusMeta[status].color)} />
                        <Typography
                          variant="caption"
                          fontWeight={600}
                          sx={{ color: `${meta.color}.main`, fontSize: "0.72rem" }}
                        >
                          {t(
                            status === "excellent"
                              ? "supervision.students.statusExcellent"
                              : status === "good"
                                ? "supervision.students.statusGood"
                                : "supervision.students.statusNeedsAttention",
                          )}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell align="center">
                    <Box sx={{ display: "flex", justifyContent: "center", gap: 0.25 }}>
                      <Tooltip title={t("supervision.students.viewProfile")}>
                        <IconButton
                          size="small"
                          onClick={() => navigate(`/supervisor/student/${s.id}`)}
                          sx={{
                            color: "primary.main",
                            bgcolor: alpha(theme.palette.primary.main, 0.08),
                            "&:hover": { bgcolor: alpha(theme.palette.primary.main, 0.18) },
                            width: 34,
                            height: 34,
                          }}
                        >
                          <VisibilityIcon sx={{ fontSize: 18 }} />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title={t("supervision.students.addNote")}>
                        <IconButton
                          size="small"
                          onClick={() => openNoteDialog(s)}
                          sx={{
                            color: "warning.main",
                            bgcolor: alpha(theme.palette.warning.main, 0.08),
                            "&:hover": { bgcolor: alpha(theme.palette.warning.main, 0.18) },
                            width: 34,
                            height: 34,
                          }}
                        >
                          <NoteAddIcon sx={{ fontSize: 18 }} />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title={t("supervision.students.adminDecision")}>
                        <IconButton
                          size="small"
                          onClick={() => openDecisionDialog(s)}
                          sx={{
                            color: "error.main",
                            bgcolor: alpha(theme.palette.error.main, 0.08),
                            "&:hover": { bgcolor: alpha(theme.palette.error.main, 0.18) },
                            width: 34,
                            height: 34,
                          }}
                        >
                          <GavelIcon sx={{ fontSize: 18 }} />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
        <Divider />
        <TablePagination
          component="div"
          count={filtered.length}
          page={page}
          onPageChange={(_, p) => setPage(p)}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(e) => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0); }}
          labelRowsPerPage={t("common.rowsPerPage")}
          sx={{ "& .MuiTablePagination-toolbar": { minHeight: 52 } }}
        />
      </TableContainer>

      {filtered.length === 0 && !loading && (
        <Alert severity="info" sx={{ mt: 2 }}>{t("supervision.student.noData")}</Alert>
      )}

      {/* ─── Add Note Dialog ─── */}
      <Dialog open={noteDialogOpen} onClose={() => setNoteDialogOpen(false)} maxWidth="sm" fullWidth
        PaperProps={{ sx: glass.dialog }}>
        <DialogTitle sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Avatar sx={{ bgcolor: alpha(theme.palette.warning.main, 0.12), color: "warning.main", width: 40, height: 40 }}>
            <NoteAddIcon />
          </Avatar>
          <Box>
            <Typography variant="h6" fontWeight="bold">{t("supervision.students.noteDialogTitle")}</Typography>
            <Typography variant="caption" color="text.secondary">{noteStudent?.name}</Typography>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Select size="small" value={noteType} onChange={(e) => setNoteType(e.target.value)} fullWidth sx={{ mb: 2 }}>
            <MenuItem value="positive">{t("supervision.student.positive")}</MenuItem>
            <MenuItem value="negative">{t("supervision.student.negative")}</MenuItem>
            <MenuItem value="warning">{t("supervision.student.warning")}</MenuItem>
          </Select>
          <TextField size="small" multiline rows={3} fullWidth
            value={noteDesc} onChange={(e) => setNoteDesc(e.target.value)}
            placeholder={t("supervision.student.description")}
          />
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 0 }}>
          <Button onClick={() => setNoteDialogOpen(false)} sx={{ color: "text.secondary" }}>{t("common.cancel")}</Button>
          <Button variant="contained" color="warning" onClick={handleAddNote} disabled={noteSubmitting || !noteDesc.trim()}>
            {noteSubmitting ? t("common.saving") : t("common.add")}
          </Button>
        </DialogActions>
      </Dialog>

      {/* ─── Admin Decision Dialog ─── */}
      <Dialog open={decisionDialogOpen} onClose={() => setDecisionDialogOpen(false)} maxWidth="sm" fullWidth
        PaperProps={{ sx: glass.dialog }}>
        <DialogTitle sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Avatar sx={{ bgcolor: alpha(theme.palette.error.main, 0.12), color: "error.main", width: 40, height: 40 }}>
            <GavelIcon />
          </Avatar>
          <Box>
            <Typography variant="h6" fontWeight="bold">{t("supervision.students.decisionDialogTitle")}</Typography>
            <Typography variant="caption" color="text.secondary">{decisionStudent?.name}</Typography>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Select size="small" value={decisionType} onChange={(e) => setDecisionType(e.target.value)} fullWidth sx={{ mb: 2 }}>
            <MenuItem value="warning">{t("supervision.students.decisionWarning")}</MenuItem>
            <MenuItem value="transfer">{t("supervision.students.decisionTransfer")}</MenuItem>
            <MenuItem value="meeting">{t("supervision.students.decisionMeeting")}</MenuItem>
          </Select>
          <TextField size="small" multiline rows={3} fullWidth
            value={decisionDesc} onChange={(e) => setDecisionDesc(e.target.value)}
            placeholder={t("supervision.students.decisionNotePlaceholder")}
          />
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 0 }}>
          <Button onClick={() => setDecisionDialogOpen(false)} sx={{ color: "text.secondary" }}>{t("common.cancel")}</Button>
          <Button variant="contained" color="error" onClick={handleAddDecision} disabled={decisionSubmitting || !decisionDesc.trim()}>
            {decisionSubmitting ? t("common.saving") : t("common.add")}
          </Button>
        </DialogActions>
      </Dialog>

      {/* ─── Students Detail Dialog ─── */}
      <Dialog open={studentsDetailOpen} onClose={() => setStudentsDetailOpen(false)} maxWidth="sm" fullWidth
        PaperProps={{ sx: glass.dialog }}>
        <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <PeopleAltIcon color="primary" />
            {t("supervision.dashboard.totalStudents")} ({stats.total})
          </Box>
          <IconButton onClick={() => setStudentsDetailOpen(false)} size="small"><CloseIcon /></IconButton>
        </DialogTitle>
        <DialogContent>
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600 }}>#</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>{t("supervision.students.name")}</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>{t("supervision.students.id")}</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>{t("supervision.student.academic")}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {students.map((s, i) => (
                  <TableRow key={s.id} hover>
                    <TableCell>{i + 1}</TableCell>
                    <TableCell>{s.name}</TableCell>
                    <TableCell><Typography variant="caption">{s.id}</Typography></TableCell>
                    <TableCell>
                      <Chip label={s.academicAverage ?? "-"} size="small"
                        color={s.academicAverage >= 75 ? "success" : s.academicAverage >= 50 ? "warning" : "error"} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
      </Dialog>

      {/* ─── Excellent Students Detail Dialog ─── */}
      <Dialog open={excellentDetailOpen} onClose={() => setExcellentDetailOpen(false)} maxWidth="sm" fullWidth
        PaperProps={{ sx: glass.dialog }}>
        <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <CheckCircleIcon color="success" />
            {t("supervision.students.statusExcellent")} ({stats.excellent})
          </Box>
          <IconButton onClick={() => setExcellentDetailOpen(false)} size="small"><CloseIcon /></IconButton>
        </DialogTitle>
        <DialogContent>
          {students.filter((s) => getBehaviorStatus(s) === "excellent").length > 0 ? (
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 600 }}>#</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>{t("supervision.students.name")}</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>{t("supervision.student.academic")}</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>{t("supervision.student.behavior")}</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {students.filter((s) => getBehaviorStatus(s) === "excellent").map((s, i) => {
                    const lastEval = s.evaluations?.[s.evaluations.length - 1];
                    return (
                      <TableRow key={s.id} hover>
                        <TableCell>{i + 1}</TableCell>
                        <TableCell>
                          <Typography variant="body2" fontWeight={600}>{s.name}</Typography>
                          <Typography variant="caption" color="text.disabled">{s.id}</Typography>
                        </TableCell>
                        <TableCell>
                          <Chip label={s.academicAverage ?? "-"} size="small" color="success" />
                        </TableCell>
                        <TableCell>
                          <Chip label={lastEval?.behavior ?? "-"} size="small" color="success" />
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Typography variant="body2" color="text.secondary">{t("supervision.student.noData")}</Typography>
          )}
        </DialogContent>
      </Dialog>

      {/* ─── Needs Attention Detail Dialog ─── */}
      <Dialog open={attentionDetailOpen} onClose={() => setAttentionDetailOpen(false)} maxWidth="sm" fullWidth
        PaperProps={{ sx: glass.dialog }}>
        <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <BlockIcon color="error" />
            {t("supervision.students.statusNeedsAttention")} ({stats.needsAttention})
          </Box>
          <IconButton onClick={() => setAttentionDetailOpen(false)} size="small"><CloseIcon /></IconButton>
        </DialogTitle>
        <DialogContent>
          {students.filter((s) => getBehaviorStatus(s) === "needsAttention").length > 0 ? (
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 600 }}>#</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>{t("supervision.students.name")}</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>{t("supervision.student.behaviors")}</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>{t("supervision.student.penalties")}</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {students.filter((s) => getBehaviorStatus(s) === "needsAttention").map((s, i) => (
                    <TableRow key={s.id} hover>
                      <TableCell>{i + 1}</TableCell>
                      <TableCell>
                        <Typography variant="body2" fontWeight={600}>{s.name}</Typography>
                        <Typography variant="caption" color="text.disabled">{s.id}</Typography>
                      </TableCell>
                      <TableCell>
                        <Chip label={s.behaviors?.length ?? 0} size="small"
                          color={s.behaviors?.filter((b) => b.type === "negative").length > 0 ? "error" : "warning"} />
                      </TableCell>
                      <TableCell>
                        <Chip label={s.penalties?.length ?? 0} size="small"
                          color={s.penalties?.length > 0 ? "error" : "default"} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Typography variant="body2" color="text.secondary">{t("supervision.student.noData")}</Typography>
          )}
        </DialogContent>
      </Dialog>

      {/* ─── Academic Average Detail Dialog ─── */}
      <Dialog open={academicDetailOpen} onClose={() => setAcademicDetailOpen(false)} maxWidth="sm" fullWidth
        PaperProps={{ sx: glass.dialog }}>
        <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <SchoolIcon color="warning" />
            {t("supervision.student.academic")} — {stats.avgRate}%
          </Box>
          <IconButton onClick={() => setAcademicDetailOpen(false)} size="small"><CloseIcon /></IconButton>
        </DialogTitle>
        <DialogContent>
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600 }}>{t("supervision.student.range")}</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>{t("supervision.dashboard.student")}</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>{t("supervision.dashboard.percentage")}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {(() => {
                  const high = students.filter((s) => s.academicAverage >= 75).length;
                  const mid = students.filter((s) => s.academicAverage >= 50 && s.academicAverage < 75).length;
                  const low = students.filter((s) => s.academicAverage != null && s.academicAverage < 50).length;
                  const none = students.filter((s) => s.academicAverage == null).length;
                  const total = students.length || 1;
                  return (
                    <>
                      <TableRow hover>
                        <TableCell><Chip label="≥ 75%" size="small" color="success" variant="outlined" /></TableCell>
                        <TableCell>{high}</TableCell>
                        <TableCell>{Math.round((high / total) * 100)}%</TableCell>
                      </TableRow>
                      <TableRow hover>
                        <TableCell><Chip label="50 – 74%" size="small" color="warning" variant="outlined" /></TableCell>
                        <TableCell>{mid}</TableCell>
                        <TableCell>{Math.round((mid / total) * 100)}%</TableCell>
                      </TableRow>
                      <TableRow hover>
                        <TableCell><Chip label="< 50%" size="small" color="error" variant="outlined" /></TableCell>
                        <TableCell>{low}</TableCell>
                        <TableCell>{Math.round((low / total) * 100)}%</TableCell>
                      </TableRow>
                      <TableRow hover>
                        <TableCell><Chip label={t("supervision.student.noData")} size="small" variant="outlined" /></TableCell>
                        <TableCell>{none}</TableCell>
                        <TableCell>{Math.round((none / total) * 100)}%</TableCell>
                      </TableRow>
                    </>
                  );
                })()}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
      </Dialog>

      {/* ─── Snackbar ─── */}
      <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}>
        <Alert severity={snackbar.severity} variant="filled" sx={{ borderRadius: 2 }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
