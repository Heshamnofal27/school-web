import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
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
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import Avatar from "@mui/material/Avatar";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import MoneyOffIcon from "@mui/icons-material/MoneyOff";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import SaveIcon from "@mui/icons-material/Save";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import SchoolIcon from "@mui/icons-material/School";
import { glassSx } from "../../../shared/utils/glassSx";
import { fetchTuitionSettings, updateTuitionPlans, updateInstallmentPlans, clearError, clearSuccess } from "../accountingSlice";

const MONTHS = [
  { value: 1, label: "يناير", labelEn: "January" }, { value: 2, label: "فبراير", labelEn: "February" }, { value: 3, label: "مارس", labelEn: "March" },
  { value: 4, label: "أبريل", labelEn: "April" }, { value: 5, label: "مايو", labelEn: "May" }, { value: 6, label: "يونيو", labelEn: "June" },
  { value: 7, label: "يوليو", labelEn: "July" }, { value: 8, label: "أغسطس", labelEn: "August" }, { value: 9, label: "سبتمبر", labelEn: "September" },
  { value: 10, label: "أكتوبر", labelEn: "October" }, { value: 11, label: "نوفمبر", labelEn: "November" }, { value: 12, label: "ديسمبر", labelEn: "December" },
];

export default function TuitionSettings() {
  const { t, i18n } = useTranslation();
  const theme = useTheme();
  const dispatch = useDispatch();
  const { tuitionPlans, installmentPlans, loading, saving, error, success } = useSelector((s) => s.accounting);

  const [plans, setPlans] = useState([]);
  const [installments, setInstallments] = useState([]);
  const [selectedGrade, setSelectedGrade] = useState("");
  const [snack, setSnack] = useState({ open: false, message: "", severity: "success" });

  useEffect(() => {
    dispatch(fetchTuitionSettings());
  }, [dispatch]);

  useEffect(() => {
    if (tuitionPlans.length > 0) setTimeout(() => setPlans([...tuitionPlans]), 0);
    if (installmentPlans.length > 0) setTimeout(() => setInstallments([...installmentPlans]), 0);
  }, [tuitionPlans, installmentPlans]);

  useEffect(() => {
    if (success) {
      setTimeout(() => setSnack({ open: true, message: success, severity: "success" }), 0);
      dispatch(clearSuccess());
    }
  }, [success, dispatch]);

  useEffect(() => {
    if (error) {
      setTimeout(() => setSnack({ open: true, message: error, severity: "error" }), 0);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const handleTuitionChange = (gradeId, value) => {
    setPlans((prev) => prev.map((p) => p.gradeId === gradeId ? { ...p, tuition: Number(value) || 0 } : p));
  };

  const handleSaveTuition = () => {
    dispatch(updateTuitionPlans(plans));
  };

  const gradeInstallments = installments.filter((i) => i.gradeId === selectedGrade);
  const selectedPlan = plans.find((p) => p.gradeId === selectedGrade);

  const handleAddInstallment = () => {
    const nextOrder = gradeInstallments.length + 1;
    setInstallments((prev) => [
      ...prev,
      {
        id: `tmp_${Date.now()}`,
        gradeId: selectedGrade,
        label: `${t("accounting.tuition.installment")} ${nextOrder}`,
        labelEn: `Installment ${nextOrder}`,
        percentage: Math.round(100 / (gradeInstallments.length + 1)),
        dueDay: 1,
        dueMonth: 1,
        order: nextOrder,
      },
    ]);
  };

  const handleInstallmentChange = (id, field, value) => {
    setInstallments((prev) => prev.map((i) => i.id === id ? { ...i, [field]: value } : i));
  };

  const handleRemoveInstallment = (id) => {
    setInstallments((prev) => {
      const filtered = prev.filter((i) => i.id !== id);
      const gradeItems = filtered.filter((i) => i.gradeId === selectedGrade).map((i, idx) => ({ ...i, order: idx + 1, label: `${t("accounting.tuition.installment")} ${idx + 1}`, labelEn: `Installment ${idx + 1}` }));
      const otherItems = filtered.filter((i) => i.gradeId !== selectedGrade);
      return [...otherItems, ...gradeItems];
    });
  };

  const handleSaveInstallments = () => {
    dispatch(updateInstallmentPlans(installments));
  };

  const totalPercentage = gradeInstallments.reduce((s, i) => s + (Number(i.percentage) || 0), 0);

  const headerSx = {
    fontWeight: 700, fontSize: "0.75rem", color: "text.secondary",
    borderBottom: `2px solid ${alpha(theme.palette.divider, 0.5)}`,
  };

  const rowSx = (i) => ({
    "&:last-child td": { borderBottom: "none" },
    bgcolor: i % 2 !== 0 ? alpha(theme.palette.action.hover, 0.15) : "transparent",
    transition: "0.15s",
  });

  const scrollSx = {
    flexGrow: 1,
    maxHeight: 380,
    "&::-webkit-scrollbar": { width: 4 },
    "&::-webkit-scrollbar-thumb": { bgcolor: alpha(theme.palette.divider, 0.5), borderRadius: 2 },
  };

  if (loading && plans.length === 0) {
    return <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}><CircularProgress /></Box>;
  }

  return (
    <Box>
      {/* ─── Header ─── */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
        <Avatar sx={{ bgcolor: alpha(theme.palette.warning.main, 0.12), color: "warning.main", width: 48, height: 48 }}>
          <MoneyOffIcon />
        </Avatar>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 800, mb: 0.25 }}>
            {t("accounting.tuition.title")}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {t("accounting.tuition.subtitle")}
          </Typography>
        </Box>
      </Box>

      <Grid container spacing={2.5}>
        {/* ─── Left: Tuition per Grade ─── */}
        <Grid size={{ xs: 12, md: 5 }}>
          <Paper sx={{ ...glassSx(theme, "warning"), p: 2.5, display: "flex", flexDirection: "column" }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
              <SchoolIcon color="warning" />
              <Typography variant="subtitle1" fontWeight="bold" sx={{ flexGrow: 1 }}>
                {t("accounting.tuition.tuitionPerGrade")}
              </Typography>
              <Chip label={plans.length} size="small" color="warning" variant="outlined" />
            </Box>
            <Divider sx={{ mb: 2 }} />

            <TableContainer sx={scrollSx}>
              <Table size="small" stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell sx={headerSx}>{t("accounting.tuition.grade")}</TableCell>
                    <TableCell sx={headerSx} align="center">{t("accounting.tuition.tuition")}</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {plans.map((p, i) => (
                    <TableRow key={p.gradeId} hover sx={rowSx(i)}>
                      <TableCell>
                        <Typography variant="body2" fontWeight={600}>
                          {i18n.language === "en" && p.gradeNameEn ? p.gradeNameEn : p.gradeName}
                        </Typography>
                      </TableCell>
                      <TableCell align="center" sx={{ width: 160 }}>
                        <TextField
                          size="small"
                          type="number"
                          value={p.tuition}
                          onChange={(e) => handleTuitionChange(p.gradeId, e.target.value)}
                          slotProps={{ htmlInput: { min: 0, step: 100 } }}
                          sx={{ width: 140, "& input": { textAlign: "center", fontWeight: 600 } }}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
              <Button variant="contained" color="warning" startIcon={<SaveIcon />}
                onClick={handleSaveTuition} disabled={saving}
                sx={{ borderRadius: 2, fontWeight: 700, px: 3 }}>
                {saving ? t("accounting.tuition.saving") : t("accounting.tuition.saveTuition")}
              </Button>
            </Box>
          </Paper>
        </Grid>

        {/* ─── Right: Installment Scheduler ─── */}
        <Grid size={{ xs: 12, md: 7 }}>
          <Paper sx={{ ...glassSx(theme, "info"), p: 2.5, display: "flex", flexDirection: "column" }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
              <CalendarMonthIcon color="info" />
              <Typography variant="subtitle1" fontWeight="bold" sx={{ flexGrow: 1 }}>
                {t("accounting.tuition.scheduleTitle")}
              </Typography>
              {selectedGrade && (
                <Chip label={`${t("accounting.tuition.total")} ${totalPercentage}%`} size="small"
                  color={totalPercentage === 100 ? "success" : totalPercentage > 100 ? "error" : "warning"} />
              )}
            </Box>
            <Divider sx={{ mb: 2 }} />

            <FormControl size="small" sx={{ mb: 2, minWidth: 280 }}>
              <InputLabel>{t("accounting.tuition.selectGrade")}</InputLabel>
              <Select value={selectedGrade} label={t("accounting.tuition.selectGrade")}
                onChange={(e) => setSelectedGrade(e.target.value)}
                sx={{ borderRadius: 2 }}>
                {plans.map((p) => (
                  <MenuItem key={p.gradeId} value={p.gradeId}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Avatar sx={{ width: 24, height: 24, fontSize: 11, bgcolor: alpha(theme.palette.info.main, 0.1), color: "info.main", fontWeight: 700 }}>
                        {(i18n.language === "en" && p.gradeNameEn ? p.gradeNameEn : p.gradeName)?.charAt(0)}
                      </Avatar>
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 600, lineHeight: 1.2 }}>
                          {i18n.language === "en" && p.gradeNameEn ? p.gradeNameEn : p.gradeName}
                        </Typography>
                        <Typography variant="caption" color="text.disabled" sx={{ fontSize: "0.65rem" }}>
                          {t("accounting.tuition.tuition")}: {p.tuition?.toLocaleString()} ₪
                        </Typography>
                      </Box>
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {selectedGrade && (
              <>
                <TableContainer sx={scrollSx}>
                  <Table size="small" stickyHeader>
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ ...headerSx, width: 100 }}>{t("accounting.tuition.installment")}</TableCell>
                        <TableCell sx={headerSx} align="center">{t("accounting.tuition.percentage")}</TableCell>
                        <TableCell sx={headerSx} align="center">{t("accounting.tuition.day")}</TableCell>
                        <TableCell sx={headerSx} align="center">{t("accounting.tuition.month")}</TableCell>
                        <TableCell sx={{ ...headerSx, width: 90 }} align="center">{t("accounting.tuition.amount")}</TableCell>
                        <TableCell sx={{ ...headerSx, width: 50 }} align="center"></TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {gradeInstallments.map((inst, i) => {
                        const amount = selectedPlan ? Math.round(selectedPlan.tuition * (inst.percentage || 0) / 100) : 0;
                        return (
                          <TableRow key={inst.id} hover sx={rowSx(i)}>
                            <TableCell>
                              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                <Avatar sx={{ width: 26, height: 26, fontSize: 11, bgcolor: alpha(theme.palette.info.main, 0.1), color: "info.main", fontWeight: 700 }}>
                                  {inst.order}
                                </Avatar>
                                <Typography variant="body2" fontWeight={600}>{i18n.language === "en" && inst.labelEn ? inst.labelEn : inst.label}</Typography>
                              </Box>
                            </TableCell>
                            <TableCell align="center">
                              <TextField
                                size="small"
                                type="number"
                                value={inst.percentage}
                                onChange={(e) => handleInstallmentChange(inst.id, "percentage", Number(e.target.value) || 0)}
                                slotProps={{ htmlInput: { min: 0, max: 100, step: 5 } }}
                                sx={{ width: 80, "& input": { textAlign: "center", fontWeight: 600 } }}
                              />
                            </TableCell>
                            <TableCell align="center">
                              <TextField
                                size="small"
                                type="number"
                                value={inst.dueDay}
                                onChange={(e) => handleInstallmentChange(inst.id, "dueDay", Number(e.target.value) || 1)}
                                slotProps={{ htmlInput: { min: 1, max: 31 } }}
                                sx={{ width: 70, "& input": { textAlign: "center", fontWeight: 600 } }}
                              />
                            </TableCell>
                            <TableCell align="center">
                              <FormControl size="small" sx={{ width: 120 }}>
                                <Select
                                  value={inst.dueMonth}
                                  onChange={(e) => handleInstallmentChange(inst.id, "dueMonth", e.target.value)}
                                  sx={{ borderRadius: 1.5, "& .MuiSelect-select": { py: 0.75 } }}
                                >
                                  {MONTHS.map((m) => (
                                    <MenuItem key={m.value} value={m.value}>
                                      {i18n.language === "en" && m.labelEn ? m.labelEn : m.label}
                                    </MenuItem>
                                  ))}
                                </Select>
                              </FormControl>
                            </TableCell>
                            <TableCell align="center">
                              <Typography variant="body2" fontWeight={700} color="primary.main">
                                ₪ {amount.toLocaleString()}
                              </Typography>
                            </TableCell>
                            <TableCell align="center">
                              <Tooltip title={t("accounting.tuition.delete")}>
                                <IconButton size="small" color="error"
                                  onClick={() => handleRemoveInstallment(inst.id)}
                                  sx={{ bgcolor: alpha(theme.palette.error.main, 0.08), "&:hover": { bgcolor: alpha(theme.palette.error.main, 0.2) } }}>
                                  <DeleteIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>

                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mt: 2, flexWrap: "wrap" }}>
                  <Button variant="outlined" color="info" size="small" startIcon={<AddIcon />}
                    onClick={handleAddInstallment}
                    sx={{ borderRadius: 2, fontWeight: 600 }}>
                    {t("accounting.tuition.addInstallment")}
                  </Button>
                  {totalPercentage !== 100 && (
                    <Typography variant="caption" color="error.main" sx={{ fontWeight: 600 }}>
                      {totalPercentage > 100 ? t("accounting.tuition.over100") : t("accounting.tuition.under100")}
                    </Typography>
                  )}
                  <Box sx={{ flexGrow: 1 }} />
                  <Button variant="contained" color="info" startIcon={<SaveIcon />}
                    onClick={handleSaveInstallments} disabled={saving || totalPercentage !== 100}
                    sx={{ borderRadius: 2, fontWeight: 700, px: 3 }}>
                    {saving ? t("accounting.tuition.saving") : t("accounting.tuition.saveSchedule")}
                  </Button>
                </Box>
              </>
            )}

            {!selectedGrade && (
              <Alert severity="info" sx={{ borderRadius: 2 }}>
                {t("accounting.tuition.selectGradeHint")}
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
