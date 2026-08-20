import { useEffect, useState, useMemo, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { alpha } from "@mui/material/styles";
import { useTranslation } from "react-i18next";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import CircularProgress from "@mui/material/CircularProgress";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Chip from "@mui/material/Chip";
import Checkbox from "@mui/material/Checkbox";
import ListSubheader from "@mui/material/ListSubheader";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import SchoolIcon from "@mui/icons-material/School";
import HistoryIcon from "@mui/icons-material/History";
import PeopleIcon from "@mui/icons-material/People";

import {
  fetchAllStudents,
  fetchAllClasses,
  fetchAllGrades,
  transferStudents,
  fetchTransferHistory,
  clearError,
  clearSuccess,
} from "../studentsSlice";

export default function TransferStudents({ embedded = false }) {
  const { t, i18n } = useTranslation();
  const loc = (item) => item ? (i18n.language === "en" && item.nameEn ? item.nameEn : item.name) : "";
  const dispatch = useDispatch();
  const { students, classes, grades, history, loading, error, success } = useSelector((state) => state.students);

  const [fromClassId, setFromClassId] = useState("");
  const [toClassId, setToClassId] = useState("");
  const [selectedIds, setSelectedIds] = useState([]);

  useEffect(() => {
    dispatch(fetchAllStudents());
    dispatch(fetchAllClasses());
    dispatch(fetchAllGrades());
    dispatch(fetchTransferHistory());
  }, [dispatch]);

  const classesByGrade = useMemo(() => {
    const map = {};
    grades.forEach((g) => { map[g.id] = []; });
    classes.forEach((c) => { if (map[c.gradeId]) map[c.gradeId].push(c); });
    return map;
  }, [grades, classes]);

  const studentsInFromClass = useMemo(() => {
    if (!fromClassId) return [];
    return students.filter((s) => s.classId === fromClassId);
  }, [students, fromClassId]);

  const availableToClasses = useMemo(() => {
    if (!fromClassId) return [];
    const gradeId = classes.find((c) => c.id === fromClassId)?.gradeId;
    return classes.filter((c) => c.gradeId === gradeId && c.id !== fromClassId);
  }, [classes, fromClassId]);

  const handleSelectAll = useCallback((checked) => {
    if (checked) setSelectedIds(studentsInFromClass.map((s) => s.id));
    else setSelectedIds([]);
  }, [studentsInFromClass]);

  const handleToggleStudent = useCallback((id) => {
    setSelectedIds((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);
  }, []);

  const handleTransfer = useCallback(() => {
    if (!selectedIds.length || !toClassId) return;
    dispatch(transferStudents({ studentIds: selectedIds, fromClassId, toClassId }))
      .unwrap()
      .then(() => setSelectedIds([]))
      .catch(() => {});
  }, [dispatch, selectedIds, fromClassId, toClassId]);

  const glassCard = (th) => ({
    borderRadius: 3,
    border: `2px solid ${alpha(th.palette.primary.main, 0.5)}`,
    bgcolor: alpha(th.palette.background.paper, 0.3),
    backdropFilter: "blur(24px)",
    height: "100%",
  });

  const isSameGrade = fromClassId && toClassId
    ? classes.find((c) => c.id === fromClassId)?.gradeId === classes.find((c) => c.id === toClassId)?.gradeId
    : true;

  const notice = error
    ? { message: error, severity: "error" }
    : success
      ? { message: success, severity: "success" }
      : null;

  const handleCloseNotice = () => {
    if (error) dispatch(clearError());
    if (success) dispatch(clearSuccess());
  };

  const content = (
    <>
      <Snackbar open={Boolean(notice)} autoHideDuration={3000} onClose={handleCloseNotice} anchorOrigin={{ vertical: "top", horizontal: "center" }}>
        <Alert severity={notice?.severity || "success"} onClose={handleCloseNotice} variant="filled">{notice?.message}</Alert>
      </Snackbar>

      <Box sx={{ mb: 3, display: "flex", alignItems: "center", gap: 1.5 }}>
        <SwapHorizIcon color="primary" sx={{ fontSize: 32 }} />
        <Box>
          <Typography variant={embedded ? "h6" : "h5"} sx={{ fontWeight: 800 }}>
            {t("students.transferTitle")}
          </Typography>
          {embedded && (
            <Typography variant="body2" color="text.secondary">
              {t("students.transferSubtitle")}
            </Typography>
          )}
        </Box>
      </Box>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 8 }}>
          <Card sx={(th) => ({ ...glassCard(th), p: 2.5 })}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
              <SchoolIcon color="primary" />
              <Typography variant="subtitle1" sx={{ fontWeight: 700, flexGrow: 1 }}>{t("students.selectSourceClass")}</Typography>
            </Box>

            <Grid container spacing={2} sx={{ mb: 2 }}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <FormControl fullWidth size="small">
                  <InputLabel>{t("students.sourceClass")}</InputLabel>
                  <Select value={fromClassId} label={t("students.sourceClass")} onChange={(e) => { setFromClassId(e.target.value); setToClassId(""); setSelectedIds([]); }}>
                    {grades.map((g) => [
                      <ListSubheader key={g.id} sx={{ fontWeight: 700, bgcolor: "transparent", lineHeight: "32px", fontSize: "0.8rem", color: "primary.main" }}>{loc(g)}</ListSubheader>,
                      ...classesByGrade[g.id]?.map((c) => (
                        <MenuItem key={c.id} value={c.id} sx={{ pr: 3 }}>{loc(c)} ({students.filter((s) => s.classId === c.id).length} {t("students.studentCount")})</MenuItem>
                      )) || [],
                    ])}
                  </Select>
                </FormControl>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <FormControl fullWidth size="small" disabled={!fromClassId || availableToClasses.length === 0}>
                  <InputLabel>{t("students.destinationClass")}</InputLabel>
                  <Select value={toClassId} label={t("students.destinationClass")} onChange={(e) => setToClassId(e.target.value)}>
                    {grades.map((g) => [
                      <ListSubheader key={g.id} sx={{ fontWeight: 700, bgcolor: "transparent", lineHeight: "32px", fontSize: "0.8rem", color: "primary.main" }}>{loc(g)}</ListSubheader>,
                      ...(classesByGrade[g.id]?.filter((c) => c.id !== fromClassId).map((c) => (
                        <MenuItem key={c.id} value={c.id} sx={{ pr: 3 }}>{loc(c)} ({students.filter((s) => s.classId === c.id).length} {t("students.studentCount")})</MenuItem>
                      )) || []),
                    ])}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>

            {fromClassId && (
              <>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1.5, mt: 2 }}>
                  <PeopleIcon color="primary" fontSize="small" />
                  <Typography variant="body2" sx={{ fontWeight: 600, flexGrow: 1 }}>
                    {t("students.studentsList")} — {studentsInFromClass.length} {t("students.studentCount")}
                  </Typography>
                  <Chip label={t("students.selectAll")} size="small" clickable color={selectedIds.length === studentsInFromClass.length && studentsInFromClass.length > 0 ? "primary" : "default"} variant={selectedIds.length === studentsInFromClass.length && studentsInFromClass.length > 0 ? "filled" : "outlined"} onClick={() => handleSelectAll(selectedIds.length !== studentsInFromClass.length)} sx={{ fontWeight: 600 }} />
                  <Chip label={`${selectedIds.length} ${t("students.selected")}`} size="small" color="primary" variant="outlined" sx={{ fontWeight: 600 }} />
                </Box>

                <TableContainer component={Paper} elevation={0} sx={(th) => ({ borderRadius: 2, border: `1px solid ${alpha(th.palette.divider, 0.3)}`, bgcolor: "transparent", maxHeight: 320 })}>
                  <Table size="small" stickyHeader>
                    <TableHead>
                      <TableRow>
                        <TableCell padding="checkbox" sx={{ bgcolor: (th) => alpha(th.palette.background.paper, 0.5) }}>
                          <Checkbox size="small" checked={selectedIds.length === studentsInFromClass.length && studentsInFromClass.length > 0} indeterminate={selectedIds.length > 0 && selectedIds.length < studentsInFromClass.length} onChange={(e) => handleSelectAll(e.target.checked)} />
                        </TableCell>
                        <TableCell sx={{ bgcolor: (th) => alpha(th.palette.background.paper, 0.5), fontWeight: 600, fontSize: "0.8rem" }}>{t("common.name")}</TableCell>
                        <TableCell sx={{ bgcolor: (th) => alpha(th.palette.background.paper, 0.5), fontWeight: 600, fontSize: "0.8rem" }}>{t("common.email")}</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {studentsInFromClass.map((s) => (
                        <TableRow key={s.id} hover selected={selectedIds.includes(s.id)} sx={{ cursor: "pointer" }} onClick={() => handleToggleStudent(s.id)}>
                          <TableCell padding="checkbox"><Checkbox size="small" checked={selectedIds.includes(s.id)} /></TableCell>
                          <TableCell><Typography variant="body2" sx={{ fontWeight: 500 }}>{s.name}</Typography></TableCell>
                          <TableCell><Typography variant="caption" color="textSecondary">{s.email}</Typography></TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>

                <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
                  <Button
                    variant="contained"
                    size="large"
                    startIcon={<SwapHorizIcon />}
                    disabled={!selectedIds.length || !toClassId || !isSameGrade}
                    onClick={handleTransfer}
                    sx={{ borderRadius: 2, py: 1.2, px: 4, fontWeight: 700 }}
                  >
                    {t("students.transferButton")} ({selectedIds.length})
                  </Button>
                </Box>
                {!isSameGrade && toClassId && (
                  <Typography variant="caption" color="error" sx={{ display: "block", textAlign: "right", mt: 1 }}>
                    {t("students.sameGradeError")}
                  </Typography>
                )}
              </>
            )}
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={(th) => ({ ...glassCard(th), p: 2.5, overflow: "auto", maxHeight: 600 })}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
              <HistoryIcon color="primary" />
              <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>{t("students.transferHistory")}</Typography>
            </Box>
            {history.length === 0 ? (
              <Typography variant="body2" color="text.disabled" sx={{ textAlign: "center", py: 4 }}>
                {t("students.noHistory")}
              </Typography>
            ) : (
              history.slice(0, 20).map((h) => (
                <Box key={h.id} sx={{ mb: 1.5, p: 1.5, borderRadius: 2, border: (th) => `1px solid ${alpha(th.palette.divider, 0.3)}` }}>
                  <Typography variant="caption" color="textSecondary" sx={{ display: "block", mb: 0.5 }}>
                    {new Date(h.timestamp).toLocaleDateString(i18n.language === "en" ? "en-US" : "ar-SA", { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600, fontSize: "0.8rem" }}>
                    {i18n.language === "en" && h.fromClassNameEn ? h.fromClassNameEn : h.fromClassName} → {i18n.language === "en" && h.toClassNameEn ? h.toClassNameEn : h.toClassName}
                  </Typography>
                  <Typography variant="caption" color="textSecondary">{h.studentIds.length} {t("students.studentCount")}</Typography>
                </Box>
              ))
            )}
          </Card>
        </Grid>
      </Grid>

      {loading && (
        <Box sx={{ position: "fixed", inset: 0, display: "flex", justifyContent: "center", alignItems: "center", bgcolor: "rgba(0,0,0,0.1)", zIndex: 1300 }}>
          <CircularProgress />
        </Box>
      )}
    </>
  );

  if (embedded) {
    return <Box sx={{ py: 1 }}>{content}</Box>;
  }

  return (
    <Container maxWidth="xl" sx={{ py: 2 }}>
      {content}
    </Container>
  );
}
