import { useEffect, useState, useRef, useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useTheme, alpha } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Chip from "@mui/material/Chip";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import Avatar from "@mui/material/Avatar";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Divider from "@mui/material/Divider";
import Autocomplete from "@mui/material/Autocomplete";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import PrintIcon from "@mui/icons-material/Print";
import SearchIcon from "@mui/icons-material/Search";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CloseIcon from "@mui/icons-material/Close";
import { glassSx } from "../../../shared/utils/glassSx";

import {
  fetchStudentOptions,
  fetchStudentBilling,
  submitPayment,
  clearReceipt,
  clearSuccess,
  clearError,
} from "../accountingSlice";

const statusMeta = (t) => ({
  paid: { color: "success", label: t("accounting.directory.fullyPaidLabel") },
  partial: { color: "warning", label: t("accounting.directory.partialLabel") },
  unpaid: { color: "error", label: t("accounting.directory.unpaidLabel") },
});

function ReceiptDocument({ receipt, onClose, t_, meta_ }) {
  const { t } = useTranslation();
  const theme = useTheme();
  const printRef = useRef();
  const tFn = t_ || t;

  const lbl = meta_?.[receipt.status]?.label ?? receipt.status;
  const col = meta_?.[receipt.status]?.color ?? "default";

  const renderLabels = [
    [tFn("accounting.billing.date"), receipt.date],
    [tFn("accounting.billing.student"), receipt.studentName],
    [tFn("accounting.directory.class"), i18n?.language === "en" && receipt.classNameEn ? receipt.classNameEn : receipt.className],
    [tFn("accounting.billing.paymentMethod"), receipt.method],
  ];

  const handlePrint = () => {
    const statusLabel = lbl;
    const win = window.open("", "_blank");
    win.document.write(`
      <html dir="rtl">
      <head>
        <meta charset="utf-8" />
        <title>${tFn("accounting.billing.receiptTitle")}</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; font-family: "Segoe UI", Arial, sans-serif; }
          body { background: #fff; padding: 40px; display: flex; justify-content: center; }
          .receipt { width: 350px; border: 2px solid #1D4ED8; border-radius: 12px; padding: 24px; }
          .header { text-align: center; border-bottom: 2px dashed #1D4ED8; padding-bottom: 16px; margin-bottom: 16px; }
          .header h2 { color: #1D4ED8; margin-bottom: 4px; }
          .header .id { color: #666; font-size: 13px; letter-spacing: 1px; }
          .school-name { text-align: center; font-size: 18px; font-weight: bold; color: #1D4ED8; margin-bottom: 4px; }
          .row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #eee; font-size: 14px; }
          .row:last-child { border-bottom: none; }
          .label { color: #666; }
          .value { font-weight: 600; }
          .total { display: flex; justify-content: space-between; padding: 12px 0; font-size: 18px; font-weight: 700; color: #1D4ED8; border-top: 2px solid #1D4ED8; margin-top: 8px; }
          .footer { text-align: center; margin-top: 16px; font-size: 11px; color: #999; }
          .status-paid { color: #15803D; font-weight: 700; }
          .status-partial { color: #B45309; font-weight: 700; }
          .status-unpaid { color: #B91C1C; font-weight: 700; }
        </style>
      </head>
      <body>
        <div class="receipt">
          <div class="school-name">${tFn("accounting.billing.schoolName")}</div>
          <div class="header">
            <h2>${tFn("accounting.billing.receiptTitle")}</h2>
            <div class="id">${receipt.receiptId}</div>
          </div>
          <div class="row"><span class="label">${tFn("accounting.billing.date")}</span><span class="value">${receipt.date}</span></div>
          <div class="row"><span class="label">${tFn("accounting.billing.student")}</span><span class="value">${receipt.studentName}</span></div>
          <div class="row"><span class="label">${tFn("accounting.directory.class")}</span><span class="value">${i18n?.language === "en" && receipt.classNameEn ? receipt.classNameEn : receipt.className}</span></div>
          <div class="row"><span class="label">${tFn("accounting.billing.paymentMethod")}</span><span class="value">${receipt.method}</span></div>
          <div class="total"><span>${tFn("accounting.billing.payAmount")}</span><span>${receipt.amount.toLocaleString()} ${tFn("accounting.tuition.tuition").split("(")[1]?.replace(")", "") || "₪"}</span></div>
          <div class="row"><span class="label">${tFn("accounting.billing.totalPaid")}</span><span class="value">${receipt.totalPaid.toLocaleString()} ₪</span></div>
          <div class="row"><span class="label">${tFn("accounting.billing.remainingBalance")}</span><span class="value">${receipt.remaining.toLocaleString()} ₪</span></div>
          <div class="row"><span class="label">${tFn("accounting.billing.statusLabel")}</span><span class="value status-${receipt.status}">${statusLabel}</span></div>
          <div class="footer">${tFn("accounting.billing.thankYou")}</div>
        </div>
      </body>
      </html>
    `);
    win.document.close();
    win.focus();
    win.print();
  };

  return (
    <Dialog open onClose={onClose} maxWidth="sm" fullWidth slotProps={{ backdrop: { sx: { backdropFilter: "blur(4px)" } } }}>
      <DialogTitle sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <CheckCircleIcon color="success" />
        {t("accounting.billing.paymentSuccess")}
        <Box sx={{ flex: 1 }} />
        <IconButton size="small" onClick={onClose}><CloseIcon fontSize="small" /></IconButton>
      </DialogTitle>
      <DialogContent>
        <Box ref={printRef} sx={{ p: 3, border: "2px solid", borderColor: alpha(theme.palette.primary.main, 0.3), borderRadius: 3, bgcolor: "background.paper" }}>
          <Typography variant="h6" align="center" color="primary" sx={{ mb: 0.5 }}>{t("accounting.billing.schoolName")}</Typography>
          <Typography variant="subtitle1" align="center" sx={{ fontWeight: 700, mb: 0.5 }}>{t("accounting.billing.receiptTitle")}</Typography>
          <Typography variant="caption" align="center" display="block" color="text.secondary" sx={{ mb: 2, letterSpacing: 1 }}>
            {receipt.receiptId}
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            {renderLabels.map(([label, value]) => (
              <Box key={label} sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography variant="body2" color="text.secondary">{label}</Typography>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>{value}</Typography>
              </Box>
            ))}
          </Box>
          <Divider sx={{ my: 2 }} />
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
            <Typography variant="h6" color="primary">{t("accounting.billing.payAmount")}</Typography>
            <Typography variant="h6" color="primary">{receipt.amount.toLocaleString()} ₪</Typography>
          </Box>
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
            <Typography variant="body2" color="text.secondary">{t("accounting.billing.totalPaid")}</Typography>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>{receipt.totalPaid.toLocaleString()} ₪</Typography>
          </Box>
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
            <Typography variant="body2" color="text.secondary">{t("accounting.billing.remainingBalance")}</Typography>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>{receipt.remaining.toLocaleString()} ₪</Typography>
          </Box>
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography variant="body2" color="text.secondary">{t("accounting.billing.statusLabel")}</Typography>
            <Chip size="small" label={lbl} color={col} variant="outlined" sx={{ fontWeight: 600 }} />
          </Box>
          <Typography variant="caption" align="center" display="block" color="text.disabled" sx={{ mt: 2 }}>
            {t("accounting.billing.thankYou")}
          </Typography>
        </Box>
      </DialogContent>
      <DialogActions sx={{ justifyContent: "center", gap: 2, pb: 2 }}>
        <Button variant="contained" startIcon={<PrintIcon />} onClick={handlePrint}>
          {t("accounting.billing.printReceipt")}
        </Button>
        <Button variant="outlined" onClick={onClose}>
          {t("accounting.billing.close")}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default function StudentBillingPage() {
  const { t, i18n } = useTranslation();
  const theme = useTheme();
  const dispatch = useDispatch();
  const { studentOptions, billing, receipt, loading, saving, error, success } = useSelector((s) => s.accounting);

  const [selectedStudent, setSelectedStudent] = useState(null);
  const [inputValue, setInputValue] = useState("");
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [payAmount, setPayAmount] = useState("");
  const [payMethod, setPayMethod] = useState("");

  useEffect(() => {
    dispatch(fetchStudentOptions());
  }, [dispatch]);

  useEffect(() => {
    if (success) {
      const t = setTimeout(() => dispatch(clearSuccess()), 3000);
      return () => clearTimeout(t);
    }
  }, [success, dispatch]);

  const handleStudentChange = useCallback((_, val) => {
    setSelectedStudent(val);
    if (val) {
      dispatch(fetchStudentBilling(val.studentId));
    }
  }, [dispatch]);

  const metaMap = useMemo(() => statusMeta(t), [t]);
  const remaining = billing ? billing.invoice.remaining : 0;
  const meta = billing ? metaMap[billing.invoice.status] : null;

  const paymentMethods = [t("accounting.billing.methodCash"), t("accounting.billing.methodCard"), t("accounting.billing.methodTransfer")];

  const handleOpenPayment = () => {
    setPayAmount(remaining > 0 ? String(remaining) : "");
    setPayMethod(t("accounting.billing.methodCash"));
    setPaymentOpen(true);
  };

  const handleConfirmPayment = () => {
    if (!selectedStudent || !payAmount || !payMethod) return;
    dispatch(submitPayment({
      studentId: selectedStudent.studentId,
      amount: Number(payAmount),
      method: payMethod,
    }));
    setPaymentOpen(false);
  };

  const handleCloseReceipt = () => {
    dispatch(clearReceipt?.());
  };

  return (
    <Box>
      {/* ─── Header ─── */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
        <Avatar sx={{ bgcolor: alpha(theme.palette.success.main, 0.12), color: "success.main", width: 48, height: 48 }}>
          <AccountBalanceWalletIcon />
        </Avatar>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 800, mb: 0.25 }}>
            {t("accounting.billing.title")}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {t("accounting.billing.subtitle")}
          </Typography>
        </Box>
      </Box>

      {/* ─── Student Selector ─── */}
      <Paper sx={{ ...glassSx(theme), mb: 3, p: 2 }}>
        <Autocomplete
          value={selectedStudent}
          onChange={handleStudentChange}
          inputValue={inputValue}
          onInputChange={(_, v) => setInputValue(v)}
          options={studentOptions}
          getOptionLabel={(o) => `${o.studentName} (${i18n.language === "en" && o.classNameEn ? o.classNameEn : o.className})`}
          isOptionEqualToValue={(o, v) => o.studentId === v.studentId}
          noOptionsText={t("accounting.billing.noOptions")}
          renderInput={(params) => (
            <TextField
              {...params}
              label={t("accounting.billing.selectStudent")}
              placeholder={t("accounting.billing.searchPlaceholder")}
              slotProps={{
                input: {
                  ...params.InputProps,
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon fontSize="small" />
                    </InputAdornment>
                  ),
                },
              }}
            />
          )}
          sx={{ maxWidth: 400 }}
        />
      </Paper>

      {/* ─── Error / Success ─── */}
      {error && <Alert severity="error" onClose={() => dispatch(clearError())} sx={{ mb: 2, borderRadius: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2, borderRadius: 2 }}>{success}</Alert>}

      {/* ─── Loading ─── */}
      {loading && (
        <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
          <CircularProgress />
        </Box>
      )}

      {/* ─── Billing Content ─── */}
      {billing && !loading && (
        <>
          {/* ‐‐‐ Summary Card ‐‐‐ */}
          <Paper sx={{ ...glassSx(theme), mb: 2.5, p: 2 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, flexWrap: "wrap", justifyContent: "space-between" }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2, flexWrap: "wrap" }}>
                <Box>
                  <Typography variant="body2" color="text.secondary">{t("accounting.billing.student")}</Typography>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>{billing.invoice.studentName}</Typography>
                  <Typography variant="caption" color="text.secondary">{i18n.language === "en" && billing.invoice.classNameEn ? billing.invoice.classNameEn : billing.invoice.className}</Typography>
                </Box>
                <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />
                <Box>
                  <Typography variant="body2" color="text.secondary">{t("accounting.billing.totalFees")}</Typography>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>{billing.invoice.amount.toLocaleString()} ₪</Typography>
                </Box>
                <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />
                <Box>
                  <Typography variant="body2" color="text.secondary">{t("accounting.billing.paid")}</Typography>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: "success.main" }}>{billing.invoice.paid.toLocaleString()} ₪</Typography>
                </Box>
                <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />
                <Box>
                  <Typography variant="body2" color="text.secondary">{t("accounting.billing.remaining")}</Typography>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: remaining > 0 ? "error.main" : "text.secondary" }}>
                    {remaining.toLocaleString()} ₪
                  </Typography>
                </Box>
                <Chip label={meta.label} color={meta.color} variant="outlined" sx={{ fontWeight: 600, height: 32 }} />
              </Box>
              <Button
                variant="contained"
                color="success"
                startIcon={<AddCircleOutlineIcon />}
                onClick={handleOpenPayment}
                disabled={remaining <= 0}
                sx={{ borderRadius: 2, whiteSpace: "nowrap" }}
              >
                {t("accounting.billing.registerPayment")}
              </Button>
            </Box>
          </Paper>

          {/* ‐‐‐ Installment Plan Table ‐‐‐ */}
          <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1 }}>
            {t("accounting.billing.installmentPlan")}
          </Typography>
          <TableContainer component={Paper} sx={{ ...glassSx(theme), mb: 3, overflow: "hidden" }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 700, fontSize: "0.75rem", color: "text.secondary" }}>{t("accounting.billing.installment")}</TableCell>
                  <TableCell sx={{ fontWeight: 700, fontSize: "0.75rem", color: "text.secondary" }} align="center">{t("accounting.billing.percentage")}</TableCell>
                  <TableCell sx={{ fontWeight: 700, fontSize: "0.75rem", color: "text.secondary" }} align="center">{t("accounting.billing.amount")}</TableCell>
                  <TableCell sx={{ fontWeight: 700, fontSize: "0.75rem", color: "text.secondary" }} align="center">{t("accounting.billing.dueDate")}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {billing.installmentPlan.map((ip) => (
                  <TableRow key={ip.id} hover sx={{ "&:last-child td": { borderBottom: "none" } }}>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>{ip.label}</Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Typography variant="body2">{ip.percentage}%</Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>{ip.amount.toLocaleString()}</Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Typography variant="body2">{`${ip.dueDay}/${ip.dueMonth}`}</Typography>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* ‐‐‐ Payment History Table ‐‐‐ */}
          <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1 }}>
            {t("accounting.billing.paymentHistory")}
          </Typography>
          <TableContainer component={Paper} sx={{ ...glassSx(theme), overflow: "hidden" }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 700, fontSize: "0.75rem", color: "text.secondary" }}>{t("accounting.billing.date")}</TableCell>
                  <TableCell sx={{ fontWeight: 700, fontSize: "0.75rem", color: "text.secondary" }} align="center">{t("accounting.billing.amount")}</TableCell>
                  <TableCell sx={{ fontWeight: 700, fontSize: "0.75rem", color: "text.secondary" }} align="center">{t("accounting.billing.paymentMethod")}</TableCell>
                  <TableCell sx={{ fontWeight: 700, fontSize: "0.75rem", color: "text.secondary" }} align="center">{t("accounting.billing.description")}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {billing.transactions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} align="center">
                      <Typography variant="body2" color="text.secondary" sx={{ py: 2 }}>{t("accounting.billing.noPayments")}</Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  billing.transactions.map((tx) => (
                    <TableRow key={tx.id} hover sx={{ "&:last-child td": { borderBottom: "none" } }}>
                      <TableCell>
                        <Typography variant="body2">{tx.date}</Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Typography variant="body2" sx={{ fontWeight: 600, color: "success.main" }}>{tx.amount.toLocaleString()}</Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Typography variant="body2">{tx.method}</Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Typography variant="body2" color="text.secondary">{tx.description}</Typography>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}

      {/* ─── No Selection ─── */}
      {!billing && !loading && selectedStudent && (
        <Alert severity="info" sx={{ borderRadius: 2 }}>{t("accounting.billing.noData")}</Alert>
      )}

      {/* ─── Payment Modal ─── */}
      <Dialog open={paymentOpen} onClose={() => setPaymentOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>{t("accounting.billing.paymentModalTitle")}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5, pt: 1 }}>
            <TextField
              label={t("accounting.billing.payAmount")}
              type="number"
              value={payAmount}
              onChange={(e) => setPayAmount(e.target.value)}
              fullWidth
              inputProps={{ min: 1, max: remaining }}
              helperText={`${t("accounting.billing.remaining")}: ${remaining.toLocaleString()} ₪`}
              slotProps={{
                input: {
                  endAdornment: <InputAdornment position="end">₪</InputAdornment>,
                },
              }}
            />
            <FormControl fullWidth>
              <InputLabel>{t("accounting.billing.payMethod")}</InputLabel>
              <Select value={payMethod} label={t("accounting.billing.payMethod")} onChange={(e) => setPayMethod(e.target.value)}>
                {paymentMethods.map((m) => (
                  <MenuItem key={m} value={m}>{m}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setPaymentOpen(false)} color="inherit">{t("accounting.billing.cancel")}</Button>
          <Button
            variant="contained"
            color="success"
            onClick={handleConfirmPayment}
            disabled={!payAmount || Number(payAmount) <= 0 || Number(payAmount) > remaining || saving}
            startIcon={saving ? <CircularProgress size={18} color="inherit" /> : <CheckCircleIcon />}
          >
            {saving ? t("accounting.billing.saving") : t("accounting.billing.confirm")}
          </Button>
        </DialogActions>
      </Dialog>

      {/* ─── Receipt Dialog ─── */}
      {receipt && <ReceiptDocument receipt={receipt} onClose={handleCloseReceipt} t_={t} meta_={metaMap} />}
    </Box>
  );
}
