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
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";
import IconButton from "@mui/material/IconButton";
import DirectionsBusFilledIcon from "@mui/icons-material/DirectionsBusFilled";
import RefreshIcon from "@mui/icons-material/Refresh";
import VisibilityIcon from "@mui/icons-material/Visibility";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";

import { fetchTrips, createTrip, fetchTripConfirmedStudents } from "../supervisorOpsAPI";

export default function SchoolTripsManager() {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState(null);

  const [form, setForm] = useState({
    title: "",
    description: "",
    tripDate: "",
    location: "",
    classRoomId: "",
  });
  const [creating, setCreating] = useState(false);

  const [confirmedDialog, setConfirmedDialog] = useState(null);
  const [confirmedLoading, setConfirmedLoading] = useState(false);

  const loadTrips = async () => {
    setLoading(true);
    const res = await fetchTrips();
    if (res.success) {
      setTrips(res.data);
    } else {
      setFeedback({ type: "error", message: res.message || "تعذر جلب الرحلات" });
    }
    setLoading(false);
  };

  useEffect(() => {
    loadTrips();
  }, []);

  const updateField = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleCreate = async () => {
    if (!form.title || !form.tripDate || !form.location || !form.classRoomId) return;
    setCreating(true);
    const res = await createTrip(form);
    if (res.success) {
      setFeedback({ type: "success", message: res.message });
      setForm({ title: "", description: "", tripDate: "", location: "", classRoomId: "" });
      loadTrips();
    } else {
      setFeedback({ type: "error", message: res.message || "تعذر إنشاء الرحلة" });
    }
    setCreating(false);
  };

  const openConfirmed = async (trip) => {
    setConfirmedDialog({ trip, students: null });
    setConfirmedLoading(true);
    const res = await fetchTripConfirmedStudents(trip.id);
    setConfirmedLoading(false);
    if (res.success) {
      setConfirmedDialog({ trip, students: res.data });
    } else {
      setFeedback({ type: "error", message: res.message || "تعذر جلب قائمة المؤكدين" });
      setConfirmedDialog(null);
    }
  };

  const confirmedList =
    confirmedDialog?.students?.confirmed_students || confirmedDialog?.students?.data || [];

  return (
    <Container maxWidth="md" sx={{ py: 2 }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 3 }}>
        <DirectionsBusFilledIcon color="primary" />
        <Box>
          <Typography variant="h5" fontWeight={800}>
            الرحلات المدرسية
          </Typography>
          <Typography variant="body2" color="text.secondary">
            إنشاء رحلات مدرسية جديدة ومتابعة الطلاب المؤكدين لكل رحلة
          </Typography>
        </Box>
      </Box>

      <Paper variant="outlined" sx={{ p: 3, borderRadius: 3, mb: 3 }}>
        <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 2 }}>
          إنشاء رحلة جديدة
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label="عنوان الرحلة" value={form.title} onChange={updateField("title")} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label="الموقع / الوجهة" value={form.location} onChange={updateField("location")} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              type="date"
              label="تاريخ الرحلة"
              InputLabelProps={{ shrink: true }}
              value={form.tripDate}
              onChange={updateField("tripDate")}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="معرّف الشعبة (Class Room ID)"
              value={form.classRoomId}
              onChange={updateField("classRoomId")}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              multiline
              minRows={2}
              label="وصف الرحلة (اختياري)"
              value={form.description}
              onChange={updateField("description")}
            />
          </Grid>
          <Grid item xs={12}>
            <Button
              variant="contained"
              onClick={handleCreate}
              disabled={creating || !form.title || !form.tripDate || !form.location || !form.classRoomId}
            >
              {creating ? <CircularProgress size={20} /> : "إنشاء الرحلة"}
            </Button>
          </Grid>
        </Grid>
      </Paper>

      <Paper variant="outlined" sx={{ borderRadius: 3 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", p: 2 }}>
          <Typography variant="subtitle1" fontWeight={700}>
            قائمة الرحلات
          </Typography>
          <IconButton size="small" onClick={loadTrips}>
            <RefreshIcon fontSize="small" />
          </IconButton>
        </Box>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 700 }}>العنوان</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>الوجهة</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>التاريخ</TableCell>
                <TableCell sx={{ fontWeight: 700 }} align="center">
                  المؤكدون
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
              {!loading && trips.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} align="center" sx={{ py: 4 }}>
                    <Typography color="text.secondary">لا توجد رحلات مضافة بعد</Typography>
                  </TableCell>
                </TableRow>
              )}
              {!loading &&
                trips.map((trip) => (
                  <TableRow key={trip.id} hover>
                    <TableCell>{trip.title}</TableCell>
                    <TableCell>{trip.location}</TableCell>
                    <TableCell>{trip.trip_date}</TableCell>
                    <TableCell align="center">
                      <IconButton size="small" onClick={() => openConfirmed(trip)}>
                        <VisibilityIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <Dialog open={!!confirmedDialog} onClose={() => setConfirmedDialog(null)} maxWidth="sm" fullWidth>
        <DialogTitle>الطلاب المؤكدون - {confirmedDialog?.trip?.title}</DialogTitle>
        <DialogContent>
          {confirmedLoading && (
            <Box sx={{ display: "flex", justifyContent: "center", py: 3 }}>
              <CircularProgress size={28} />
            </Box>
          )}
          {!confirmedLoading && confirmedList.length === 0 && (
            <Typography color="text.secondary" sx={{ py: 2 }}>
              لا يوجد طلاب مؤكدون بعد لهذه الرحلة
            </Typography>
          )}
          {!confirmedLoading && confirmedList.length > 0 && (
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>الاسم</TableCell>
                  <TableCell>الشعبة</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {confirmedList.map((s) => (
                  <TableRow key={s.id}>
                    <TableCell>{s.name || s.full_name}</TableCell>
                    <TableCell>{s.class_room || s.class_name || "-"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmedDialog(null)}>إغلاق</Button>
        </DialogActions>
      </Dialog>

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
