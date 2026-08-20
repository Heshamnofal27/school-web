import { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Container,
  Paper,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Alert,
  CircularProgress,
  Grid,
  Card,
  CardContent,
  Typography,
  IconButton,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Chip,
} from "@mui/material";
import {
  Delete as DeleteIcon,
  Add as AddIcon,
  Search as SearchIcon,
  Refresh as RefreshIcon,
  Email as EmailIcon,
  SupervisorAccount as SupervisorIcon,
} from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import { alpha, useTheme } from "@mui/material/styles";
import {
  fetchAccountants,
  addSupervisorAccount,
  addAccountantAccount,
  deleteAccountantAccount,
  deleteSupervisorAccount,
  clearError,
  clearSuccess,
} from "../createAccountsSlice";

// قائمة بجميع أنواع المستخدمين التي يمكن للأدمن إضافتها
const ACCOUNT_TYPES = ["supervisor", "accountant", "teacher", "student", "parent"];

// ألوان شارات الأدوار المختلفة
const BADGE_COLORS = {
  supervisor: "secondary",
  accountant: "warning",
  teacher: "info",
  student: "success",
  parent: "primary",
};

export default function CreateAccounts() {
  const { t } = useTranslation();
  const theme = useTheme();
  const dispatch = useDispatch();
  const { accountants, supervisorsAddedThisSession, loading, error, success } = useSelector(
    (state) => state.createAccounts,
  );

  const [form, setForm] = useState({ email: "", name: "", accountType: "supervisor" });
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    dispatch(fetchAccountants());
  }, [dispatch]);

  const allRows = useMemo(() => {
    const accountantRows = (accountants || []).map((a) => ({
      id: a.id,
      email: a.email,
      name: a.name,
      _type: a.role || "accountant",
    }));
    const supervisorRows = (supervisorsAddedThisSession || []).map((s) => ({
      id: s.id ?? s.email,
      email: s.email,
      name: s.name,
      _type: s.role || "supervisor",
    }));
    return [...accountantRows, ...supervisorRows];
  }, [accountants, supervisorsAddedThisSession]);

  const filteredRows = useMemo(() => {
    if (!searchTerm.trim()) return allRows;
    const q = searchTerm.toLowerCase();
    return allRows.filter(
      (e) => e.email?.toLowerCase().includes(q) || (e.name && e.name.toLowerCase().includes(q)),
    );
  }, [allRows, searchTerm]);

  const handleAddEmail = async () => {
    if (!form.email.trim()) return;

    try {
      if (form.accountType === "supervisor") {
        if (!form.name.trim()) return;
        await dispatch(
          addSupervisorAccount({ email: form.email.trim(), name: form.name.trim() })
        ).unwrap();
      } else {
        await dispatch(
          addAccountantAccount({ email: form.email.trim(), role: form.accountType })
        ).unwrap();
      }

      dispatch(fetchAccountants());
      setForm({ email: "", name: "", accountType: form.accountType });
    } catch (err) {
      console.error("Failed to add account:", err);
    }
  };

  const handleDelete = async (row) => {
    if (!window.confirm(t("createAccounts.deleteEmailConfirm"))) return;

    try {
      if (row._type === "supervisor") {
        await dispatch(deleteSupervisorAccount({ email: row.email })).unwrap();
      } else {
        await dispatch(deleteAccountantAccount({ id: row.id })).unwrap();
      }

      dispatch(fetchAccountants());
    } catch (err) {
      console.error("Failed to delete account:", err);
    }
  };

  const TypeBadge = ({ type }) => (
    <Chip
      label={t(`createAccounts.types.${type}`, type)}
      color={BADGE_COLORS[type] || "default"}
      size="small"
      variant="outlined"
    />
  );

  return (
    <Box sx={{ minHeight: "100vh", py: 3 }}>
      <Container maxWidth="xl">
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
          {t("createAccounts.title")}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          {t("createAccounts.scopeNotice", "شاشة إدارة واستدعاء جميع أنواع الحسابات المستهدفة للنظام.")}
        </Typography>

        {error && (
          <Alert severity="error" onClose={() => dispatch(clearError())} sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        {success && (
          <Alert severity="success" onClose={() => dispatch(clearSuccess())} sx={{ mb: 2 }}>
            {success}
          </Alert>
        )}

        {/* كروت الإحصائيات */}
        <Grid container spacing={2.5} sx={{ mb: 3, width: "100%" }}>
          <Grid item xs={12} sm={4}>
            <Card sx={{ borderRadius: 3, border: (th) => `2px solid ${alpha(th.palette.primary.main, 0.5)}` }}>
              <CardContent sx={{ display: "flex", alignItems: "center", gap: 2.5, p: 3 }}>
                <Box sx={{ width: 48, height: 48, borderRadius: 2.5, display: "flex", alignItems: "center", justifyContent: "center", bgcolor: theme.palette.primary.main, color: "#fff" }}>
                  <EmailIcon sx={{ fontSize: 24 }} />
                </Box>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 800 }}>{allRows.length}</Typography>
                  <Typography variant="body2" color="text.secondary">{t("createAccounts.statTotal")}</Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={4}>
            <Card sx={{ borderRadius: 3, border: (th) => `2px solid ${alpha(th.palette.secondary.main, 0.5)}` }}>
              <CardContent sx={{ display: "flex", alignItems: "center", gap: 2.5, p: 3 }}>
                <Box sx={{ width: 48, height: 48, borderRadius: 2.5, display: "flex", alignItems: "center", justifyContent: "center", bgcolor: theme.palette.secondary.main, color: "#fff" }}>
                  <SupervisorIcon sx={{ fontSize: 24 }} />
                </Box>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 800 }}>{supervisorsAddedThisSession.length}</Typography>
                  <Typography variant="body2" color="text.secondary">{t("createAccounts.types.supervisor")}</Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={4}>
            <Card sx={{ borderRadius: 3, border: (th) => `2px solid ${alpha(th.palette.warning.main, 0.5)}` }}>
              <CardContent sx={{ display: "flex", alignItems: "center", gap: 2.5, p: 3 }}>
                <Box sx={{ width: 48, height: 48, borderRadius: 2.5, display: "flex", alignItems: "center", justifyContent: "center", bgcolor: theme.palette.warning.main, color: "#fff" }}>
                  <EmailIcon sx={{ fontSize: 24 }} />
                </Box>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 800 }}>{accountants.length}</Typography>
                  <Typography variant="body2" color="text.secondary">{t("createAccounts.types.accountant")}</Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* نموذج الإضافة مع توسيع خيار نوع المستخدم */}
        <Paper elevation={0} sx={(th) => ({ p: 3, mb: 3, borderRadius: 3, border: `2px solid ${alpha(th.palette.primary.main, 0.5)}`, bgcolor: alpha(th.palette.background.paper, 0.3), backdropFilter: "blur(24px)" })}>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 3, display: "flex", alignItems: "center", gap: 1 }}>
            <AddIcon fontSize="small" color="primary" />
            {t("createAccounts.addEmailTitle")}
          </Typography>
          <Grid container spacing={2} alignItems="flex-end">
            <Grid item xs={12} sm={form.accountType === "supervisor" ? 3.5 : 4.5}>
              <TextField fullWidth size="small" label={t("common.email")} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} variant="outlined" />
            </Grid>
            
            {form.accountType === "supervisor" && (
              <Grid item xs={12} sm={2.5}>
                <TextField fullWidth size="small" required label={t("common.name")} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} variant="outlined" />
              </Grid>
            )}

            {/* تم تكبير مساحة الخيار وتنسيقه ليتسع للنصوص دون قطعها */}
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth size="small">
                <InputLabel id="user-type-label">{t("common.userType", "نوع المستخدم")}</InputLabel>
                <Select
                  labelId="user-type-label"
                  value={form.accountType}
                  label={t("common.userType", "نوع المستخدم")}
                  onChange={(e) => setForm({ ...form, accountType: e.target.value, name: "" })}
                  sx={{ minWidth: 200 }}
                >
                  {ACCOUNT_TYPES.map((type) => (
                    <MenuItem key={type} value={type}>
                      {t(`createAccounts.types.${type}`, type)}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={form.accountType === "supervisor" ? 2 : 3.5}>
              <Button variant="contained" startIcon={<AddIcon />} onClick={handleAddEmail} size="medium" fullWidth sx={{ py: 1.2 }}>
                {t("common.add")}
              </Button>
            </Grid>
          </Grid>
        </Paper>

        <Paper elevation={0} sx={(th) => ({ borderRadius: 3, border: `2px solid ${alpha(th.palette.primary.main, 0.5)}`, overflow: "hidden", bgcolor: alpha(th.palette.background.paper, 0.3), backdropFilter: "blur(24px)" })}>
          <Box sx={{ px: 2.5, py: 1.5, display: "flex", alignItems: "center", gap: 2, flexWrap: "wrap", borderBottom: "1px solid rgba(0,0,0,0.06)", bgcolor:"transparent"}}>
            <TextField size="small" placeholder={t("common.search")} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} variant="outlined" sx={{ minWidth: 260 }}
              InputProps={{ startAdornment: <SearchIcon sx={{ mr: 1, color: "text.disabled", fontSize: 20 }} /> }}
            />
            <Box sx={{ flex: 1 }} />
            <Typography variant="caption" color="textSecondary" sx={{ whiteSpace: "nowrap" }}>
              {filteredRows.length} {t("common.of")} {allRows.length}
            </Typography>
            <Button size="small" startIcon={<RefreshIcon />} variant="outlined" sx={{ borderRadius: 2 }} onClick={() => dispatch(fetchAccountants())}>{t("common.refresh")}</Button>
          </Box>

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ "& th": { bgcolor: "transparent", fontWeight: 600, fontSize: "0.8rem", color: "text.primary", borderBottom: "2px solid rgba(0,0,0,0.06)" } }}>
                  <TableCell>{t("common.email")}</TableCell>
                  <TableCell>{t("common.name")}</TableCell>
                  <TableCell>{t("common.userType")}</TableCell>
                  <TableCell align="center">{t("common.actions")}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredRows.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} align="center" sx={{ py: 6 }}>
                      <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 1 }}>
                        <EmailIcon sx={{ fontSize: 48, color: "text.disabled", opacity: 0.4 }} />
                        <Typography color="textSecondary" variant="body2">{t("createAccounts.noAuthorizedEmails")}</Typography>
                      </Box>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredRows.map((row) => (
                    <TableRow key={`${row._type}-${row.id}`} hover sx={{ "&:last-child td": { borderBottom: 0 } }}>
                      <TableCell><Typography variant="body2" sx={{ fontWeight: 500 }}>{row.email}</Typography></TableCell>
                      <TableCell><Typography variant="body2">{row.name || "—"}</Typography></TableCell>
                      <TableCell><TypeBadge type={row._type} /></TableCell>
                      <TableCell align="center">
                        <IconButton size="small" color="error" onClick={() => handleDelete(row)} sx={{ bgcolor: "rgba(244,67,54,0.08)", "&:hover": { bgcolor: "rgba(244,67,54,0.15)" } }}>
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>

        {loading && (
          <Box sx={{ position: "fixed", inset: 0, display: "flex", justifyContent: "center", alignItems: "center", bgcolor: "rgba(0,0,0,0.1)", zIndex: 1300 }}>
            <CircularProgress />
          </Box>
        )}
      </Container>
    </Box>
  );
}