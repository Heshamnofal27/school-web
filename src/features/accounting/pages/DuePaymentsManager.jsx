import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Chip from "@mui/material/Chip";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";
import IconButton from "@mui/material/IconButton";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import RefreshIcon from "@mui/icons-material/Refresh";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";

import {
  fetchRealPayments,
  createDuePayment,
  fetchDuePaymentTemplatesByClass,
  fetchMonthlySummary,
  fetchGuardianSummary,
  updateOverduePenalties,
} from "../accountingAPI";

const STATUS_COLOR = { paid: "success", pending: "warning", overdue: "error" };

function TabPanel({ value, index, children }) {
  return value === index ? <Box sx={{ pt: 3 }}>{children}</Box> : null;
}

export default function DuePaymentsManager() {
  const [tab, setTab] = useState(0);
  const [feedback, setFeedback] = useState(null);

  // Payments list
  const [payments, setPayments] = useState([]);
  const [loadingPayments, setLoadingPayments] = useState(true);

  // Create due payment
  const [guardianId, setGuardianId] = useState("");
  const [templateId, setTemplateId] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [creating, setCreating] = useState(false);

  // Templates by class
  const [classRoomId, setClassRoomId] = useState("");
  const [templates, setTemplates] = useState(null);
  const [templatesLoading, setTemplatesLoading] = useState(false);

  // Reports
  const [monthlySummary, setMonthlySummary] = useState(null);
  const [guardianSummary, setGuardianSummary] = useState([]);
  const [reportsLoading, setReportsLoading] = useState(false);
  const [updatingPenalties, setUpdatingPenalties] = useState(false);

  const loadPayments = async () => {
    setLoadingPayments(true);
    const res = await fetchRealPayments();
    if (res.success) setPayments(res.data);
    else setFeedback({ type: "error", message: res.message || "تعذر جلب الدفعات" });
    setLoadingPayments(false);
  };

  useEffect(() => {
    loadPayments();
  }, []);

  const handleCreatePayment = async () => {
    if (!guardianId || !templateId) return;
    setCreating(true);
    const res = await createDuePayment({ guardianId, templateId, dueDate });
    if (res.success) {
      setFeedback({ type: "success", message: res.message });
      setGuardianId("");
      setTemplateId("");
      setDueDate("");
      loadPayments();
    } else {
      setFeedback({ type: "error", message: res.message || "تعذر إضافة الدفعة" });
    }
    setCreating(false);
  };

  const handleLookupTemplates = async () => {
    if (!classRoomId) return;
    setTemplatesLoading(true);
    const res = await fetchDuePaymentTemplatesByClass(classRoomId);
    setTemplatesLoading(false);
    if (res.success) setTemplates(res.data);
    else setFeedback({ type: "error", message: res.message || "تعذر جلب القوالب" });
  };

  const loadReports = async () => {
    setReportsLoading(true);
    const [monthly, guardians] = await Promise.all([fetchMonthlySummary(), fetchGuardianSummary()]);
    if (monthly.success) setMonthlySummary(monthly.data);
    if (guardians.success) setGuardianSummary(guardians.data);
    if (!monthly.success && !guardians.success) {
      setFeedback({ type: "error", message: "تعذر جلب التقارير المالية" });
    }
    setReportsLoading(false);
  };

  useEffect(() => {
    if (tab === 2) loadReports();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab]);

  const handleUpdatePenalties = async () => {
    setUpdatingPenalties(true);
    const res = await updateOverduePenalties();
    setUpdatingPenalties(false);
    if (res.success) {
      setFeedback({ type: "success", message: res.message });
      loadPayments();
    } else {
      setFeedback({ type: "error", message: res.message || "تعذر تحديث الغرامات" });
    }
  };

  const templateList = templates?.templates || templates?.data || [];

  return (
    <Container maxWidth="md" sx={{ py: 2 }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 3 }}>
        <ReceiptLongIcon color="primary" />
        <Box>
          <Typography variant="h5" fontWeight={800}>
            الدفعات المستحقة
          </Typography>
          <Typography variant="body2" color="text.secondary">
            إدارة الدفعات المستحقة على أولياء الأمور والتقارير المالية
          </Typography>
        </Box>
      </Box>

      <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 1 }}>
        <Tab label="الدفعات" />
        <Tab label="إضافة دفعة" />
        <Tab label="التقارير" />
      </Tabs>

      <TabPanel value={tab} index={0}>
        <Paper variant="outlined" sx={{ borderRadius: 3 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", p: 2 }}>
            <Typography variant="subtitle1" fontWeight={700}>
              قائمة الدفعات المستحقة
            </Typography>
            <Box sx={{ display: "flex", gap: 1 }}>
              <Button
                size="small"
                startIcon={<WarningAmberIcon />}
                onClick={handleUpdatePenalties}
                disabled={updatingPenalties}
              >
                {updatingPenalties ? <CircularProgress size={16} /> : "تحديث الغرامات المتأخرة"}
              </Button>
              <IconButton size="small" onClick={loadPayments}>
                <RefreshIcon fontSize="small" />
              </IconButton>
            </Box>
          </Box>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 700 }}>#</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>ولي الأمر</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>المبلغ</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>الغرامة</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>تاريخ الاستحقاق</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>الحالة</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loadingPayments && (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                      <CircularProgress size={28} />
                    </TableCell>
                  </TableRow>
                )}
                {!loadingPayments && payments.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                      <Typography color="text.secondary">لا توجد دفعات مستحقة حالياً</Typography>
                    </TableCell>
                  </TableRow>
                )}
                {!loadingPayments &&
                  payments.map((p) => (
                    <TableRow key={p.id} hover>
                      <TableCell>{p.id}</TableCell>
                      <TableCell>{p.guardianId}</TableCell>
                      <TableCell>{p.amount}</TableCell>
                      <TableCell>{p.penalty || 0}</TableCell>
                      <TableCell>{p.dueDate}</TableCell>
                      <TableCell>
                        <Chip size="small" label={p.status} color={STATUS_COLOR[p.status] || "default"} />
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </TabPanel>

      <TabPanel value={tab} index={1}>
        <Paper variant="outlined" sx={{ p: 3, borderRadius: 3, mb: 3 }}>
          <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 2 }}>
            إضافة دفعة مستحقة جديدة لولي أمر
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="معرّف ولي الأمر (Guardian ID)"
                value={guardianId}
                onChange={(e) => setGuardianId(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="معرّف القالب (Template ID)"
                value={templateId}
                onChange={(e) => setTemplateId(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                type="date"
                label="تاريخ الاستحقاق (اختياري)"
                InputLabelProps={{ shrink: true }}
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                variant="contained"
                onClick={handleCreatePayment}
                disabled={creating || !guardianId || !templateId}
              >
                {creating ? <CircularProgress size={20} /> : "إضافة الدفعة"}
              </Button>
            </Grid>
          </Grid>
        </Paper>

        <Paper variant="outlined" sx={{ p: 3, borderRadius: 3 }}>
          <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 2 }}>
            استعراض قوالب الدفعات لشعبة معيّنة
          </Typography>
          <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
            <TextField
              fullWidth
              label="معرّف الشعبة (Class Room ID)"
              value={classRoomId}
              onChange={(e) => setClassRoomId(e.target.value)}
            />
            <Button variant="outlined" onClick={handleLookupTemplates} disabled={templatesLoading || !classRoomId}>
              {templatesLoading ? <CircularProgress size={20} /> : "بحث"}
            </Button>
          </Box>
          {templateList.length > 0 && (
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>المعرّف</TableCell>
                  <TableCell>الوصف</TableCell>
                  <TableCell>المبلغ</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {templateList.map((t) => (
                  <TableRow key={t.id}>
                    <TableCell>{t.id}</TableCell>
                    <TableCell>{t.description || t.name}</TableCell>
                    <TableCell>{t.amount}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </Paper>
      </TabPanel>

      <TabPanel value={tab} index={2}>
        {reportsLoading && (
          <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
            <CircularProgress size={28} />
          </Box>
        )}
        {!reportsLoading && (
          <Grid container spacing={3}>
            <Grid item xs={12} md={5}>
              <Paper variant="outlined" sx={{ p: 3, borderRadius: 3 }}>
                <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 2 }}>
                  الملخص الشهري
                </Typography>
                {monthlySummary ? (
                  <Box component="pre" sx={{ fontSize: 13, whiteSpace: "pre-wrap", m: 0 }}>
                    {JSON.stringify(monthlySummary, null, 2)}
                  </Box>
                ) : (
                  <Typography color="text.secondary">لا تتوفر بيانات</Typography>
                )}
              </Paper>
            </Grid>
            <Grid item xs={12} md={7}>
              <Paper variant="outlined" sx={{ borderRadius: 3 }}>
                <Typography variant="subtitle1" fontWeight={700} sx={{ p: 2, pb: 0 }}>
                  ملخص أولياء الأمور
                </Typography>
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>ولي الأمر</TableCell>
                        <TableCell>الإجمالي المستحق</TableCell>
                        <TableCell>المدفوع</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {guardianSummary.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={3} align="center">
                            <Typography color="text.secondary" sx={{ py: 2 }}>
                              لا تتوفر بيانات
                            </Typography>
                          </TableCell>
                        </TableRow>
                      )}
                      {guardianSummary.map((g, idx) => (
                        <TableRow key={g.guardian_id || idx}>
                          <TableCell>{g.guardian_name || g.guardian_id}</TableCell>
                          <TableCell>{g.total_due ?? g.total}</TableCell>
                          <TableCell>{g.total_paid ?? g.paid}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>
            </Grid>
          </Grid>
        )}
      </TabPanel>

      <Snackbar
        open={!!feedback}
        autoHideDuration={4000}
        onClose={() => setFeedback(null)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        {feedback && (
          <Alert severity={feedback.type} onClose={() => setFeedback(null)} variant="filled">
            {feedback.message}
          </Alert>
        )}
      </Snackbar>
    </Container>
  );
}
