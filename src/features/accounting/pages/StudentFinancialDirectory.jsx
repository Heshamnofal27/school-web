import { useEffect, useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useTheme, alpha } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import Avatar from "@mui/material/Avatar";
import InputAdornment from "@mui/material/InputAdornment";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TablePagination from "@mui/material/TablePagination";
import SearchIcon from "@mui/icons-material/Search";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import FilterListIcon from "@mui/icons-material/FilterList";
import { glassSx } from "../../../shared/utils/glassSx";
import { paymentStatusMeta } from "../../../shared/constants/statusMeta";
import { fetchStudentFinancialRecords } from "../accountingSlice";

export default function StudentFinancialDirectory() {
  const { t, i18n } = useTranslation();
  const theme = useTheme();
  const dispatch = useDispatch();
  
  const { studentRecords = [], loading, error } = useSelector((s) => s.accounting);

  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    dispatch(fetchStudentFinancialRecords());
  }, [dispatch]);

  // تحويل البيانات القادمة لـ camelCase آمن
  const records = useMemo(() => {
    const data = Array.isArray(studentRecords) ? studentRecords : (studentRecords?.data || []);
    return data.map((r) => {
      const amount = Number(r.amount ?? r.total_amount ?? 0);
      const paid = Number(r.paid ?? r.paid_amount ?? 0);
      const remaining = r.remaining !== undefined ? Number(r.remaining) : (amount - paid);

      return {
        id: r.id,
        studentName: r.studentName || r.student_name || r.student?.name || "طالب غير محدد",
        className: r.className || r.class_name || r.classroom?.name || "-",
        classNameEn: r.classNameEn || r.class_name_en || "-",
        amount,
        paid,
        remaining,
        status: r.status || (remaining <= 0 ? "paid" : paid > 0 ? "partial" : "unpaid"),
        dueDate: r.dueDate || r.due_date || "-",
      };
    });
  }, [studentRecords]);

  const filtered = useMemo(() => {
    let data = records;
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      data = data.filter((r) => r.studentName.toLowerCase().includes(q));
    }
    if (filterStatus !== "all") {
      data = data.filter((r) => r.status === filterStatus);
    }
    return data;
  }, [records, search, filterStatus]);

  const paginated = useMemo(
    () => filtered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [filtered, page, rowsPerPage]
  );

  const meta = useMemo(() => paymentStatusMeta(t), [t]);

  const stats = useMemo(() => {
    const total = records.length;
    const paid = records.filter((r) => r.status === "paid").length;
    const partial = records.filter((r) => r.status === "partial").length;
    const unpaid = records.filter((r) => r.status === "unpaid").length;
    const totalRemaining = records.reduce((s, r) => s + r.remaining, 0);
    return { total, paid, partial, unpaid, totalRemaining };
  }, [records]);

  if (loading && records.length === 0) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error && records.length === 0) {
    return <Alert severity="error">{error}</Alert>;
  }

  return (
    <Box>
      {/* ─── Header ─── */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
        <Avatar sx={{ bgcolor: alpha(theme.palette.info.main, 0.12), color: "info.main", width: 48, height: 48 }}>
          <ReceiptLongIcon />
        </Avatar>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 800, mb: 0.25 }}>
            {t("accounting.directory.title")}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {t("accounting.directory.subtitle")}
          </Typography>
        </Box>
      </Box>

      {/* ─── Stats Chips ─── */}
      <Box sx={{ display: "flex", gap: 1.5, mb: 2.5, flexWrap: "wrap" }}>
        <Chip label={`${t("accounting.directory.total")} ${stats.total}`} color="primary" variant="outlined" sx={{ fontWeight: 600 }} />
        <Chip label={`${t("accounting.directory.fullyPaid")} ${stats.paid}`} color="success" variant="outlined" sx={{ fontWeight: 600 }} />
        <Chip label={`${t("accounting.directory.partial")} ${stats.partial}`} color="warning" variant="outlined" sx={{ fontWeight: 600 }} />
        <Chip label={`${t("accounting.directory.unpaid")} ${stats.unpaid}`} color="error" variant="outlined" sx={{ fontWeight: 600 }} />
        <Chip label={`${t("accounting.directory.remaining")} ${stats.totalRemaining.toLocaleString()} ₪`} color="error" variant="filled" sx={{ fontWeight: 700 }} />
      </Box>

      {/* ─── Search & Filter ─── */}
      <Paper sx={{ ...glassSx(theme), mb: 2.5, p: 2 }}>
        <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", alignItems: "center" }}>
          <TextField
            size="small"
            placeholder={t("accounting.directory.searchPlaceholder")}
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(0); }}
            sx={{ minWidth: { xs: "100%", sm: 280 } }}
            slotProps={{
              input: {
                startAdornment: <InputAdornment position="start"><SearchIcon fontSize="small" /></InputAdornment>,
              },
            }}
          />
          <FormControl size="small" sx={{ minWidth: 180 }}>
            <InputLabel>{t("accounting.directory.status")}</InputLabel>
            <Select
              value={filterStatus}
              label={t("accounting.directory.status")}
              onChange={(e) => { setFilterStatus(e.target.value); setPage(0); }}
            >
              <MenuItem value="all">{t("accounting.directory.all")}</MenuItem>
              <MenuItem value="paid">{t("accounting.directory.fullyPaidLabel")}</MenuItem>
              <MenuItem value="partial">{t("accounting.directory.partialLabel")}</MenuItem>
              <MenuItem value="unpaid">{t("accounting.directory.unpaidLabel")}</MenuItem>
            </Select>
          </FormControl>
          {(search || filterStatus !== "all") && (
            <Chip
              icon={<FilterListIcon />}
              label={`${t("accounting.directory.results")} ${filtered.length}`}
              color="primary"
              size="small"
              onDelete={() => { setSearch(""); setFilterStatus("all"); }}
              sx={{ fontWeight: 600 }}
            />
          )}
        </Box>
      </Paper>

      {/* ─── Table ─── */}
      <TableContainer component={Paper} sx={{ ...glassSx(theme), overflow: "hidden" }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 700, fontSize: "0.8rem", color: "text.secondary" }}>{t("accounting.directory.student")}</TableCell>
              <TableCell sx={{ fontWeight: 700, fontSize: "0.8rem", color: "text.secondary" }}>{t("accounting.directory.class")}</TableCell>
              <TableCell sx={{ fontWeight: 700, fontSize: "0.8rem", color: "text.secondary" }} align="center">{t("accounting.directory.totalFees")}</TableCell>
              <TableCell sx={{ fontWeight: 700, fontSize: "0.8rem", color: "text.secondary" }} align="center">{t("accounting.directory.paid")}</TableCell>
              <TableCell sx={{ fontWeight: 700, fontSize: "0.8rem", color: "text.secondary" }} align="center">{t("accounting.directory.remainingLabel")}</TableCell>
              <TableCell sx={{ fontWeight: 700, fontSize: "0.8rem", color: "text.secondary" }} align="center">{t("accounting.directory.statusLabel")}</TableCell>
              <TableCell sx={{ fontWeight: 700, fontSize: "0.8rem", color: "text.secondary" }} align="center">{t("accounting.directory.dueDate")}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginated.map((row) => {
              const m = meta[row.status] || { label: row.status, color: "default" };
              return (
                <TableRow key={row.id} hover sx={{ "&:last-child td": { borderBottom: "none" } }}>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>{row.studentName}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{i18n.language === "en" && row.classNameEn ? row.classNameEn : row.className}</Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>{row.amount.toLocaleString()}</Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Typography variant="body2" sx={{ fontWeight: 600, color: "success.main" }}>
                      {row.paid.toLocaleString()}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: 700,
                        color: row.remaining > 0 ? "error.main" : "text.secondary",
                      }}
                    >
                      {row.remaining.toLocaleString()}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Chip
                      size="small"
                      label={m.label}
                      color={m.color}
                      variant="outlined"
                      sx={{ fontWeight: 600, minWidth: 90 }}
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Typography variant="caption" color="text.secondary">{row.dueDate}</Typography>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
        <Divider />
        <TablePagination
          component="div"
          count={filtered.length}
          page={page}
          onPageChange={(_, p) => setPage(p)}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(e) => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0); }}
          labelRowsPerPage={t("accounting.directory.rowsPerPage")}
          sx={{ "& .MuiTablePagination-toolbar": { minHeight: 52 } }}
        />
      </TableContainer>

      {filtered.length === 0 && !loading && (
        <Alert severity="info" sx={{ borderRadius: 2, mt: 2 }}>
          {t("accounting.directory.noResults")}
        </Alert>
      )}
    </Box>
  );
}