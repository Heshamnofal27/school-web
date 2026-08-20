import { useEffect, useMemo, useState, lazy, Suspense } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useTheme, alpha } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import Divider from "@mui/material/Divider";
import Avatar from "@mui/material/Avatar";
import Chip from "@mui/material/Chip";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import IconButton from "@mui/material/IconButton";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ReceiptIcon from "@mui/icons-material/Receipt";
import CloseIcon from "@mui/icons-material/Close";
import Skeleton from "@mui/material/Skeleton";
import { glassSx } from "../../../shared/utils/glassSx";
import { fetchFinancialDashboard } from "../accountingSlice";

const Chart = lazy(() => import("react-apexcharts"));

function StatCard({ icon: Icon, label, value, color, prefix = "", onClick }) {
  const theme = useTheme();
  return (
    <Card sx={{ ...glassSx(theme, color), height: "100%", cursor: "pointer", transition: "0.2s", "&:hover": { transform: "translateY(-3px)" } }} onClick={onClick}>
      <CardContent sx={{ display: "flex", alignItems: "center", gap: 2.5, p: 3, "&:last-child": { pb: 3 } }}>
        <Avatar sx={{ bgcolor: alpha(theme.palette[color].main, 0.12), color: `${color}.main`, width: 52, height: 52 }}>
          <Icon />
        </Avatar>
        <Box sx={{ minWidth: 0 }}>
          <Typography variant="h4" sx={{ fontWeight: 800, lineHeight: 1.1 }}>
            {prefix}{typeof value === "number" ? value.toLocaleString() : value}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.25, fontWeight: 500 }}>
            {label}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}

export default function FinancialDashboard() {
  const { t, i18n } = useTranslation();
  const theme = useTheme();
  const dispatch = useDispatch();
  const { stats, cashFlow, recentTransactions, invoices, loading, error } = useSelector((s) => s.accounting);
  const [collectedDialog, setCollectedDialog] = useState(false);
  const [remainingDialog, setRemainingDialog] = useState(false);
  const [paidDialog, setPaidDialog] = useState(false);
  const [studentsDialog, setStudentsDialog] = useState(false);

  useEffect(() => {
    dispatch(fetchFinancialDashboard());
  }, [dispatch]);

  const isDark = theme.palette.mode === "dark";
  const textColor = theme.palette.text.secondary;
  const gridColor = theme.palette.divider;

  const chartOptions = useMemo(() => ({
    chart: {
      type: "area",
      toolbar: { show: false },
      zoom: { enabled: false },
      fontFamily: theme.typography.fontFamily,
      foreColor: textColor,
      background: "transparent",
    },
    grid: { borderColor: gridColor, strokeDashArray: 4, padding: { left: 0, right: 0 } },
    tooltip: { theme: isDark ? "dark" : "light", style: { fontSize: "13px" } },
    dataLabels: { enabled: false },
    stroke: { curve: "smooth", width: [3, 3, 2] },
    colors: [theme.palette.success.main, theme.palette.error.main, theme.palette.warning.main],
    xaxis: {
      categories: cashFlow.map((m) => i18n.language === "en" && m.monthEn ? m.monthEn : m.month),
      axisBorder: { show: false },
      axisTicks: { show: false },
      labels: { style: { colors: textColor, fontSize: "12px" } },
    },
    yaxis: {
      labels: {
        formatter: (val) => `${(val / 1000).toFixed(0)}k`,
        style: { colors: textColor, fontSize: "12px" },
      },
    },
    legend: {
      position: "top",
      horizontalAlign: "left",
      labels: { colors: textColor },
      markers: { width: 10, height: 10, radius: 2 },
    },
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 0.3,
        opacityFrom: 0.4,
        opacityTo: 0.05,
        stops: [0, 100],
      },
    },
    animations: {
      // مُعطّلة عمداً لتفادي عطل ApexCharts المعروف عند إزالة/تبديل المكوّن
      // أثناء تشغيل رسمة الأنيميشن (raf) — نفس السبب الموثّق في ChartSection.jsx
      enabled: false,
    },
  }), [theme, cashFlow, isDark, textColor, gridColor, i18n.language]);

  const chartSeries = useMemo(() => [
    { name: t("accounting.dashboard.collected"), data: cashFlow.map((m) => m.collected) },
    { name: t("accounting.dashboard.expenses"), data: cashFlow.map((m) => m.expenses) },
    { name: t("accounting.dashboard.pendingSeries"), data: cashFlow.map((m) => m.pending) },
  ], [cashFlow, t]);

  const formatDate = (d) => {
    if (!d) return "—";
    return d;
  };

  if (loading && !stats) {
    return <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}><CircularProgress /></Box>;
  }

  if (error && !stats) {
    return <Alert severity="error">{error}</Alert>;
  }

  return (
    <Box>
      {/* ─── Header ─── */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
        <Avatar sx={{ bgcolor: alpha(theme.palette.success.main, 0.12), color: "success.main", width: 48, height: 48 }}>
          <AccountBalanceWalletIcon />
        </Avatar>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 800, mb: 0.25 }}>
            {t("accounting.dashboard.title")}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {t("accounting.dashboard.subtitle")}
          </Typography>
        </Box>
      </Box>

      {/* ─── Stats Cards ─── */}
      <Grid container spacing={2.5} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }} sx={{ display: "flex" }}>
          <StatCard
            icon={AccountBalanceWalletIcon}
            label={t("accounting.dashboard.monthlyCollected")}
            value={stats?.monthlyCollected || 0}
            color="success"
            prefix="₪ "
            onClick={() => setCollectedDialog(true)}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }} sx={{ display: "flex" }}>
          <StatCard
            icon={TrendingDownIcon}
            label={t("accounting.dashboard.totalRemaining")}
            value={stats?.totalRemaining || 0}
            color="error"
            prefix="₪ "
            onClick={() => setRemainingDialog(true)}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }} sx={{ display: "flex" }}>
          <StatCard
            icon={CheckCircleIcon}
            label={t("accounting.dashboard.fullyPaid")}
            value={stats?.fullyPaid || 0}
            color="info"
            onClick={() => setPaidDialog(true)}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }} sx={{ display: "flex" }}>
          <StatCard
            icon={ReceiptIcon}
            label={t("accounting.dashboard.totalStudents")}
            value={stats?.totalStudents || 0}
            color="primary"
            onClick={() => setStudentsDialog(true)}
          />
        </Grid>
      </Grid>

      {/* ─── Chart + Recent Transactions ─── */}
      <Grid container spacing={2.5}>
        {/* ─── Cash Flow Chart ─── */}
        <Grid size={{ xs: 12, md: 7 }} sx={{ display: "flex" }}>
          <Paper sx={{ ...glassSx(theme), p: 2.5, flexGrow: 1, display: "flex", flexDirection: "column" }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
              <Avatar sx={{ bgcolor: alpha(theme.palette.success.main, 0.1), color: "success.main", width: 32, height: 32 }}>
                <AccountBalanceWalletIcon sx={{ fontSize: 18 }} />
              </Avatar>
              <Typography variant="subtitle1" fontWeight="bold">{t("accounting.dashboard.cashFlow")}</Typography>
            </Box>
            <Divider sx={{ mb: 2 }} />
            {cashFlow.length > 0 ? (
              <Box sx={{ "& .apexcharts-canvas": { direction: "ltr" }, flexGrow: 1 }}>
                <Suspense fallback={<Skeleton variant="rounded" width="100%" height={340} sx={{ borderRadius: 2 }} />}>
                  <Chart options={chartOptions} series={chartSeries} type="area" height={340} />
                </Suspense>
              </Box>
            ) : (
              <Typography color="text.secondary" sx={{ textAlign: "center", py: 6 }}>{t("accounting.dashboard.noData")}</Typography>
            )}
          </Paper>
        </Grid>

        {/* ─── Recent Transactions ─── */}
        <Grid size={{ xs: 12, md: 5 }} sx={{ display: "flex" }}>
          <Paper sx={{ ...glassSx(theme), p: 2.5, flexGrow: 1, display: "flex", flexDirection: "column" }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
              <Avatar sx={{ bgcolor: alpha(theme.palette.primary.main, 0.1), color: "primary.main", width: 32, height: 32 }}>
                <ReceiptIcon sx={{ fontSize: 18 }} />
              </Avatar>
              <Typography variant="subtitle1" fontWeight="bold" sx={{ flexGrow: 1 }}>
                {t("accounting.dashboard.recentTransactions")}
              </Typography>
              <Chip label={recentTransactions.length} size="small" color="primary" />
            </Box>
            <Divider sx={{ mb: 2 }} />
            <TableContainer sx={{ flexGrow: 1, maxHeight: 380, "&::-webkit-scrollbar": { width: 4 }, "&::-webkit-scrollbar-thumb": { bgcolor: alpha(theme.palette.divider, 0.5), borderRadius: 2 } }}>
              <Table size="small" stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 700, fontSize: "0.75rem", color: "text.secondary", bgcolor: alpha(theme.palette.background.paper, 0.95), borderBottom: `2px solid ${alpha(theme.palette.divider, 0.5)}` }}>{t("accounting.dashboard.student")}</TableCell>
                    <TableCell sx={{ fontWeight: 700, fontSize: "0.75rem", color: "text.secondary", bgcolor: alpha(theme.palette.background.paper, 0.95), borderBottom: `2px solid ${alpha(theme.palette.divider, 0.5)}` }} align="center">{t("accounting.dashboard.amount")}</TableCell>
                    <TableCell sx={{ fontWeight: 700, fontSize: "0.75rem", color: "text.secondary", bgcolor: alpha(theme.palette.background.paper, 0.95), borderBottom: `2px solid ${alpha(theme.palette.divider, 0.5)}` }} align="center">{t("accounting.dashboard.type")}</TableCell>
                    <TableCell sx={{ fontWeight: 700, fontSize: "0.75rem", color: "text.secondary", bgcolor: alpha(theme.palette.background.paper, 0.95), borderBottom: `2px solid ${alpha(theme.palette.divider, 0.5)}` }} align="center">{t("accounting.dashboard.date")}</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {recentTransactions.length > 0 ? recentTransactions.map((tx, i) => (
                    <TableRow key={tx.id} hover
                      sx={{
                        "&:last-child td": { borderBottom: "none" },
                        bgcolor: i % 2 !== 0 ? alpha(theme.palette.action.hover, 0.15) : "transparent",
                        transition: "0.15s",
                      }}>
                      <TableCell>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          <Avatar sx={{ width: 28, height: 28, fontSize: 11, bgcolor: alpha(tx.type === "payment" ? theme.palette.success.main : theme.palette.error.main, 0.1), color: tx.type === "payment" ? "success.main" : "error.main", fontWeight: 700 }}>
                            {tx.studentName?.charAt(0)}
                          </Avatar>
                          <Box>
                            <Typography variant="body2" sx={{ fontWeight: 600, fontSize: "0.8rem", lineHeight: 1.2 }}>
                              {tx.studentName}
                            </Typography>
                            <Typography variant="caption" color="text.disabled" sx={{ fontSize: "0.65rem" }}>
                              {i18n.language === "en" && tx.classNameEn ? tx.classNameEn : tx.className}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell align="center">
                        <Typography variant="body2"
                          sx={{ fontWeight: 700, fontSize: "0.8rem", color: tx.type === "payment" ? "success.main" : "error.main" }}>
                          {tx.type === "payment" ? "+" : "-"}{tx.amount.toLocaleString()}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Chip size="small"
                          label={tx.type === "payment" ? t("accounting.dashboard.payment") : t("accounting.dashboard.expense")}
                          color={tx.type === "payment" ? "success" : "error"} variant="outlined"
                          sx={{ fontSize: "0.65rem", fontWeight: 600 }} />
                      </TableCell>
                      <TableCell align="center">
                        <Typography variant="caption" color="text.secondary" sx={{ fontSize: "0.7rem" }}>
                          {formatDate(tx.date)}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )) : (
                    <TableRow>
                      <TableCell colSpan={4} align="center">
                        <Typography color="text.secondary" sx={{ py: 3 }}>{t("accounting.dashboard.noData")}</Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>

      {/* ─── Monthly Collected Dialog ─── */}
      <Dialog open={collectedDialog} onClose={() => setCollectedDialog(false)} maxWidth="sm" fullWidth
        PaperProps={{ sx: { borderRadius: 3, background: alpha(theme.palette.background.paper, 0.95), backdropFilter: "blur(24px)" } }}>
        <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <AccountBalanceWalletIcon color="success" />
            {t("accounting.dashboard.monthlyCollected")}
          </Box>
          <IconButton onClick={() => setCollectedDialog(false)} size="small"><CloseIcon /></IconButton>
        </DialogTitle>
        <DialogContent>
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600 }}>{t("accounting.dashboard.date")}</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 600 }}>{t("accounting.dashboard.collected")}</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 600 }}>{t("accounting.dashboard.expenses")}</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 600 }}>{t("accounting.dashboard.pendingSeries")}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {cashFlow.map((m, i) => (
                  <TableRow key={i} hover>
                    <TableCell>{i18n.language === "en" && m.monthEn ? m.monthEn : m.month}</TableCell>
                    <TableCell align="center"><Chip label={`₪ ${m.collected.toLocaleString()}`} size="small" color="success" variant="outlined" /></TableCell>
                    <TableCell align="center"><Chip label={`₪ ${m.expenses.toLocaleString()}`} size="small" color="error" variant="outlined" /></TableCell>
                    <TableCell align="center"><Chip label={`₪ ${m.pending.toLocaleString()}`} size="small" color="warning" variant="outlined" /></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
      </Dialog>

      {/* ─── Remaining Students Dialog ─── */}
      <Dialog open={remainingDialog} onClose={() => setRemainingDialog(false)} maxWidth="sm" fullWidth
        PaperProps={{ sx: { borderRadius: 3, background: alpha(theme.palette.background.paper, 0.95), backdropFilter: "blur(24px)" } }}>
        <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <TrendingDownIcon color="error" />
            {t("accounting.dashboard.totalRemaining")} — ₪ {(stats?.totalRemaining || 0).toLocaleString()}
          </Box>
          <IconButton onClick={() => setRemainingDialog(false)} size="small"><CloseIcon /></IconButton>
        </DialogTitle>
        <DialogContent>
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600 }}>{t("accounting.dashboard.student")}</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>{t("accounting.dashboard.date")}</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 600 }}>{t("accounting.dashboard.amount")}</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 600 }}>{t("common.status")}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {(invoices || []).filter((inv) => inv.status !== "paid").map((inv) => (
                  <TableRow key={inv.id} hover>
                    <TableCell>
                      <Typography variant="body2" fontWeight={600}>{inv.studentName}</Typography>
                      <Typography variant="caption" color="text.disabled">{i18n.language === "en" && inv.classNameEn ? inv.classNameEn : inv.className}</Typography>
                    </TableCell>
                    <TableCell><Typography variant="caption">{inv.dueDate}</Typography></TableCell>
                    <TableCell align="center">
                      <Typography variant="body2" fontWeight={700} color="error.main">
                        ₪ {(inv.amount - inv.paid).toLocaleString()}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Chip size="small"
                        label={inv.status === "partial" ? t("accounting.directory.partialLabel") : t("accounting.directory.unpaid")}
                        color={inv.status === "partial" ? "warning" : "error"} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
      </Dialog>

      {/* ─── Fully Paid Dialog ─── */}
      <Dialog open={paidDialog} onClose={() => setPaidDialog(false)} maxWidth="sm" fullWidth
        PaperProps={{ sx: { borderRadius: 3, background: alpha(theme.palette.background.paper, 0.95), backdropFilter: "blur(24px)" } }}>
        <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <CheckCircleIcon color="info" />
            {t("accounting.dashboard.fullyPaid")} — {stats?.fullyPaid || 0}
          </Box>
          <IconButton onClick={() => setPaidDialog(false)} size="small"><CloseIcon /></IconButton>
        </DialogTitle>
        <DialogContent>
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600 }}>{t("accounting.dashboard.student")}</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>{t("accounting.dashboard.date")}</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 600 }}>{t("accounting.dashboard.amount")}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {(invoices || []).filter((inv) => inv.status === "paid").map((inv) => (
                  <TableRow key={inv.id} hover>
                    <TableCell>
                      <Typography variant="body2" fontWeight={600}>{inv.studentName}</Typography>
                      <Typography variant="caption" color="text.disabled">{i18n.language === "en" && inv.classNameEn ? inv.classNameEn : inv.className}</Typography>
                    </TableCell>
                    <TableCell><Typography variant="caption">{inv.paidDate || inv.dueDate}</Typography></TableCell>
                    <TableCell align="center">
                      <Typography variant="body2" fontWeight={700} color="success.main">
                        ₪ {inv.amount.toLocaleString()}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
      </Dialog>

      {/* ─── All Students Dialog ─── */}
      <Dialog open={studentsDialog} onClose={() => setStudentsDialog(false)} maxWidth="sm" fullWidth
        PaperProps={{ sx: { borderRadius: 3, background: alpha(theme.palette.background.paper, 0.95), backdropFilter: "blur(24px)" } }}>
        <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <ReceiptIcon color="primary" />
            {t("accounting.dashboard.totalStudents")} — {stats?.totalStudents || 0}
          </Box>
          <IconButton onClick={() => setStudentsDialog(false)} size="small"><CloseIcon /></IconButton>
        </DialogTitle>
        <DialogContent>
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600 }}>{t("accounting.dashboard.student")}</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>{t("accounting.dashboard.date")}</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 600 }}>{t("accounting.dashboard.amount")}</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 600 }}>{t("accounting.dashboard.type")}</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 600 }}>{t("common.status")}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {(invoices || []).map((inv) => (
                  <TableRow key={inv.id} hover>
                    <TableCell>
                      <Typography variant="body2" fontWeight={600}>{inv.studentName}</Typography>
                      <Typography variant="caption" color="text.disabled">{i18n.language === "en" && inv.classNameEn ? inv.classNameEn : inv.className}</Typography>
                    </TableCell>
                    <TableCell><Typography variant="caption">{inv.dueDate}</Typography></TableCell>
                    <TableCell align="center">
                      <Typography variant="body2" fontWeight={700}>
                        ₪ {inv.amount.toLocaleString()}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Typography variant="body2" fontWeight={600}
                        color={inv.status === "paid" ? "success.main" : inv.status === "partial" ? "warning.main" : "error.main"}>
                        ₪ {inv.paid.toLocaleString()} / ₪ {(inv.amount - inv.paid).toLocaleString()}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Chip size="small"
                        label={inv.status === "paid" ? t("accounting.directory.fullyPaidLabel") : inv.status === "partial" ? t("accounting.directory.partialLabel") : t("accounting.directory.unpaid")}
                        color={inv.status === "paid" ? "success" : inv.status === "partial" ? "warning" : "error"} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
      </Dialog>
    </Box>
  );
}
