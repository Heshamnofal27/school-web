import { useCallback, useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
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
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremium";

import {
  fetchSpecializations,
  createSpecialization,
  updateSpecialization,
  deleteSpecialization,
} from "../adminExtrasAPI";

export default function SpecializationsManager() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    const res = await fetchSpecializations();
    if (res.success) {
      setItems(res.data);
    } else {
      setFeedback({ type: "error", message: res.message || "تعذر جلب التخصصات" });
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const openCreateDialog = () => {
    setEditingItem(null);
    setName("");
    setDialogOpen(true);
  };

  const openEditDialog = (item) => {
    setEditingItem(item);
    setName(item.name);
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!name.trim()) return;
    setSaving(true);
    const res = editingItem
      ? await updateSpecialization(editingItem.id, name.trim())
      : await createSpecialization(name.trim());

    if (res.success) {
      setFeedback({ type: "success", message: res.message || "تم الحفظ بنجاح" });
      setDialogOpen(false);
      loadData();
    } else {
      setFeedback({ type: "error", message: res.message || "تعذر الحفظ" });
    }
    setSaving(false);
  };

  const handleDelete = async (item) => {
    if (!window.confirm(`هل تريد حذف تخصص "${item.name}"؟`)) return;
    const res = await deleteSpecialization(item.id);
    if (res.success) {
      setFeedback({ type: "success", message: res.message || "تم الحذف بنجاح" });
      loadData();
    } else {
      setFeedback({ type: "error", message: res.message || "تعذر الحذف" });
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 2 }}>
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 3 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <WorkspacePremiumIcon color="primary" />
          <Box>
            <Typography variant="h5" fontWeight={800}>
              إدارة التخصصات
            </Typography>
            <Typography variant="body2" color="text.secondary">
              إضافة وتعديل وحذف التخصصات الدراسية المتاحة للطلاب
            </Typography>
          </Box>
        </Box>
        <Button variant="contained" startIcon={<AddIcon />} onClick={openCreateDialog}>
          إضافة تخصص
        </Button>
      </Box>

      <Paper variant="outlined" sx={{ borderRadius: 3 }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 700 }}>#</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>اسم التخصص</TableCell>
                <TableCell sx={{ fontWeight: 700 }} align="center">
                  إجراءات
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading && (
                <TableRow>
                  <TableCell colSpan={3} align="center" sx={{ py: 4 }}>
                    <CircularProgress size={28} />
                  </TableCell>
                </TableRow>
              )}
              {!loading && items.length === 0 && (
                <TableRow>
                  <TableCell colSpan={3} align="center" sx={{ py: 4 }}>
                    <Typography color="text.secondary">لا توجد تخصصات مضافة بعد</Typography>
                  </TableCell>
                </TableRow>
              )}
              {!loading &&
                items.map((item, idx) => (
                  <TableRow key={item.id} hover>
                    <TableCell>{idx + 1}</TableCell>
                    <TableCell>{item.name}</TableCell>
                    <TableCell align="center">
                      <IconButton size="small" onClick={() => openEditDialog(item)}>
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton size="small" color="error" onClick={() => handleDelete(item)}>
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>{editingItem ? "تعديل التخصص" : "إضافة تخصص جديد"}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            fullWidth
            margin="dense"
            label="اسم التخصص"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>إلغاء</Button>
          <Button variant="contained" onClick={handleSave} disabled={saving || !name.trim()}>
            {saving ? <CircularProgress size={20} /> : "حفظ"}
          </Button>
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
