import { useState } from "react";
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
import DirectionsBusIcon from "@mui/icons-material/DirectionsBus";

import { createBus, fetchBusStudents } from "../adminExtrasAPI";

export default function BusesManager() {
  const [name, setName] = useState("");
  const [plate, setPlate] = useState("");
  const [creating, setCreating] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const [busId, setBusId] = useState("");
  const [lookupLoading, setLookupLoading] = useState(false);
  const [busResult, setBusResult] = useState(null);

  const handleCreateBus = async () => {
    if (!name.trim()) return;
    setCreating(true);
    const res = await createBus({ name: name.trim(), licensePlate: plate.trim() });
    if (res.success) {
      setFeedback({ type: "success", message: res.message || "تم إضافة الحافلة بنجاح" });
      setName("");
      setPlate("");
    } else {
      setFeedback({ type: "error", message: res.message || "تعذر إضافة الحافلة" });
    }
    setCreating(false);
  };

  const handleLookup = async () => {
    if (!busId) return;
    setLookupLoading(true);
    setBusResult(null);
    const res = await fetchBusStudents(busId);
    if (res.success) {
      setBusResult(res.data);
    } else {
      setFeedback({ type: "error", message: res.message || "تعذر جلب بيانات الحافلة" });
    }
    setLookupLoading(false);
  };

  const classesAndStudents = busResult?.classes_and_students || [];

  return (
    <Container maxWidth="md" sx={{ py: 2 }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 3 }}>
        <DirectionsBusIcon color="primary" />
        <Box>
          <Typography variant="h5" fontWeight={800}>
            إدارة الحافلات
          </Typography>
          <Typography variant="body2" color="text.secondary">
            إضافة حافلة جديدة، أو استعراض الطلاب المرتبطين بحافلة معيّنة
          </Typography>
        </Box>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper variant="outlined" sx={{ p: 3, borderRadius: 3, height: "100%" }}>
            <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 2 }}>
              إضافة حافلة جديدة
            </Typography>
            <TextField
              fullWidth
              label="اسم الحافلة"
              value={name}
              onChange={(e) => setName(e.target.value)}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="رقم اللوحة (اختياري)"
              value={plate}
              onChange={(e) => setPlate(e.target.value)}
              sx={{ mb: 2 }}
            />
            <Button
              variant="contained"
              fullWidth
              onClick={handleCreateBus}
              disabled={creating || !name.trim()}
            >
              {creating ? <CircularProgress size={20} /> : "إضافة الحافلة"}
            </Button>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper variant="outlined" sx={{ p: 3, borderRadius: 3, height: "100%" }}>
            <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 2 }}>
              استعراض طلاب حافلة
            </Typography>
            <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
              <TextField
                fullWidth
                label="معرّف الحافلة (ID)"
                value={busId}
                onChange={(e) => setBusId(e.target.value)}
              />
              <Button variant="outlined" onClick={handleLookup} disabled={lookupLoading || !busId}>
                {lookupLoading ? <CircularProgress size={20} /> : "بحث"}
              </Button>
            </Box>

            {busResult && (
              <Box>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  الحافلة: <strong>{busResult.bus}</strong>
                </Typography>
                {classesAndStudents.map((c) => (
                  <Box key={c.class_room_id} sx={{ mb: 2 }}>
                    <Typography variant="body2" fontWeight={700}>
                      {c.class_room_name}
                    </Typography>
                    <TableContainer>
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell>الاسم</TableCell>
                            <TableCell>البريد الإلكتروني</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {(c.students || []).map((s) => (
                            <TableRow key={s.id}>
                              <TableCell>{s.full_name}</TableCell>
                              <TableCell>{s.email}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Box>
                ))}
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>

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
