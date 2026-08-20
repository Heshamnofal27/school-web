import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Chip from "@mui/material/Chip";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import ReportProblemIcon from "@mui/icons-material/ReportProblem";

import { fetchComplaints } from "../adminExtrasAPI";

const STATUS_COLOR = {
  pending: "warning",
  reviewed: "info",
  resolved: "success",
  rejected: "error",
};

export default function ComplaintsView() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const res = await fetchComplaints();
      if (res.success) {
        setComplaints(res.data);
      } else {
        setError(res.message || "تعذر جلب الشكاوى");
      }
      setLoading(false);
    })();
  }, []);

  return (
    <Container maxWidth="md" sx={{ py: 2 }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 3 }}>
        <ReportProblemIcon color="primary" />
        <Box>
          <Typography variant="h5" fontWeight={800}>
            الشكاوى
          </Typography>
          <Typography variant="body2" color="text.secondary">
            عرض الشكاوى المقدّمة من أولياء الأمور والطلاب (للاطلاع فقط)
          </Typography>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Paper variant="outlined" sx={{ borderRadius: 3 }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 700 }}>المحتوى</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>الشعبة</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>مقدم الشكوى</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>الحالة</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>التاريخ</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading && (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                    <CircularProgress size={28} />
                  </TableCell>
                </TableRow>
              )}
              {!loading && complaints.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                    <Typography color="text.secondary">لا توجد شكاوى حالياً</Typography>
                  </TableCell>
                </TableRow>
              )}
              {!loading &&
                complaints.map((c) => (
                  <TableRow key={c.id} hover>
                    <TableCell sx={{ maxWidth: 320 }}>{c.content}</TableCell>
                    <TableCell>{c.class_room || "-"}</TableCell>
                    <TableCell>
                      {c.is_anonymous ? "مجهول" : c.guardian?.name || c.student || "-"}
                    </TableCell>
                    <TableCell>
                      <Chip
                        size="small"
                        label={c.status}
                        color={STATUS_COLOR[c.status] || "default"}
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>{c.created_at}</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Container>
  );
}
