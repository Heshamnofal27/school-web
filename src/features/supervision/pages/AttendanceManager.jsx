import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Chip from "@mui/material/Chip";
import IconButton from "@mui/material/IconButton";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import DeleteIcon from "@mui/icons-material/Delete";
import RefreshIcon from "@mui/icons-material/Refresh";

import { takeAttendance, cancelAttendance, fetchAttendanceReport } from "../supervisorOpsAPI";

const STATUS_OPTIONS = [
  { value: "present", label: "حاضر", color: "success" },
  { value: "absent", label: "غائب", color: "error" },
  { value: "late", label: "متأخر", color: "warning" },
];

const todayISO = () => new Date().toISOString().slice(0, 10);

export default function AttendanceManager() {
  const [studentId, setStudentId] = useState("");
  const [date, setDate] = useState(todayISO());
  const [status, setStatus] = useState("present");
  const [submitting, setSubmitting] = useState(false);

  const [report, setReport] = useState([]);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState(null);

  const loadReport = async () => {
    setLoading(true);
    const res = await fetchAttendanceReport();
    if (res.success) {
      setReport(res.data);
    } else {
      setFeedback({ type: "error", message: res.message || "تعذر جلب تقرير الحضور" });
    }
    setLoading(false);
  };

  useEffect(() => {
    loadReport();
  }, []);

  const handleSubmit = async () => {
    if (!studentId || !date) return;
    setSubmitting(true);
    const res = await takeAttendance({ studentId, date, status });
    if (res.success) {
      setFeedback({ type: "success", message: res.message });
      setStudentId("");
      loadReport();
    } else {
      setFeedback({ type: "error", message: res.message || "تعذر تسجيل الحضور" });
    }
    setSubmitting(false);
  };

  const handleCancel = async (row) => {
    const res = await cancelAttendance({ studentId: row.student?.id, date: row.date });
    if (res.success) {
      setFeedback({ type: "success", message: res.message });
      loadReport();
    } else {
      setFeedback({ type: "error", message: res.message || "تعذر إلغاء السجل" });
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 2 }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 3 }}>
        <EventAvailableIcon color="primary" />
        <Box>
          <Typography variant="h5" fontWeight={800}>
            تسجيل الحضور والغياب
          </Typography>
          <Typography variant="body2" color="text.secondary">
            تسجيل حضور/غياب/تأخر الطلاب في الصفوف الخاضعة لإشرافك
          </Typography>
        </Box>
      </Box>

      <Paper variant="outlined" sx={{ p: 3, borderRadius: 3, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={3}>
            <TextField
              fullWidth
              label="معرّف الطالب (ID)"
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField
              fullWidth
              type="date"
              label="التاريخ"
              InputLabelProps={{ shrink: true }}
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField fullWidth select label="الحالة" value={status} onChange={(e) => setStatus(e.target.value)}>
              {STATUS_OPTIONS.map((opt) => (
                <MenuItem key={opt.value} value={opt.value}>
                  {opt.label}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={3}>
            <Button
              fullWidth
              variant="contained"
              onClick={handleSubmit}
              disabled={submitting || !studentId || !date}
            >
              {submitting ? <CircularProgress size={20} /> : "تسجيل"}
            </Button>
          </Grid>
        </Grid>
      </Paper>

      <Paper variant="outlined" sx={{ borderRadius: 3 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", p: 2 }}>
          <Typography variant="subtitle1" fontWeight={700}>
            سجل الحضور
          </Typography>
          <IconButton size="small" onClick={loadReport}>
            <RefreshIcon fontSize="small" />
          </IconButton>
        </Box>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 700 }}>الطالب</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>التاريخ</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>الحالة</TableCell>
                <TableCell sx={{ fontWeight: 700 }} align="center">
                  إجراءات
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading && (
                <TableRow>
                  <TableCell colSpan={4} align="center" sx={{ py: 4 }}>
                    <CircularProgress size={28} />
                  </TableCell>
                </TableRow>
              )}
              {!loading && report.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} align="center" sx={{ py: 4 }}>
                    <Typography color="text.secondary">لا توجد سجلات حضور بعد</Typography>
                  </TableCell>
                </TableRow>
              )}
              {!loading &&
                report.map((row) => {
                  const opt = STATUS_OPTIONS.find((o) => o.value === row.status);
                  return (
                    <TableRow key={row.attendance_id} hover>
                      <TableCell>{row.student?.name}</TableCell>
                      <TableCell>{row.date}</TableCell>
                      <TableCell>
                        <Chip size="small" label={opt?.label || row.status} color={opt?.color || "default"} />
                      </TableCell>
                      <TableCell align="center">
                        <IconButton size="small" color="error" onClick={() => handleCancel(row)}>
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

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
