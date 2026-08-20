import { useCallback, useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { alpha } from "@mui/material/styles";
import { useTranslation } from "react-i18next";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Paper from "@mui/material/Paper";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import CircularProgress from "@mui/material/CircularProgress";
import Chip from "@mui/material/Chip";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SchoolIcon from "@mui/icons-material/School";
import GroupIcon from "@mui/icons-material/Group";
import ClassIcon from "@mui/icons-material/Class";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import { useSearchParams } from "react-router-dom";
import TransferStudents from "../../students/pages/TransferStudents";

import {
  fetchAllClasses,
  fetchAllGrades,
  createClass,
  updateClass,
  deleteClass,
  clearError,
  clearSuccess,
} from "../classesSlice";

export default function ManageClasses() {
  const { t, i18n } = useTranslation();
  const loc = (item) => item ? (i18n.language === "en" && item.nameEn ? item.nameEn : item.name) : "";
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const { classes, grades, loading, error, success } = useSelector(
    (state) => state.classes || { classes: [], grades: [], loading: false, error: null, success: null },
  );

  const [expandedGrade, setExpandedGrade] = useState(undefined);
  const [addDialog, setAddDialog] = useState({ open: false, gradeId: "", gradeName: "" });
  const [editDialog, setEditDialog] = useState({ open: false, classItem: null });
  const [deleteDialog, setDeleteDialog] = useState({ open: false, classItem: null });

  const [formName, setFormName] = useState("");
  const [formCount, setFormCount] = useState("");
  const activeTab = searchParams.get("tab") === "transfer" ? "transfer" : "sections";

  const formatClassMessage = useCallback((message) => {
    const messageKeys = {
      "تم إضافة الشعبة بنجاح": "classes.addSuccess",
      "تم تعديل الشعبة بنجاح": "classes.editSuccess",
      "تم حذف الشعبة بنجاح": "classes.deleteSuccess",
      "الشعبة غير موجودة": "classes.notFound",
    };

    return t(messageKeys[message], { defaultValue: message });
  }, [t]);

  useEffect(() => {
    dispatch(fetchAllClasses());
    dispatch(fetchAllGrades());
  }, [dispatch]);

  const classesByGrade = useMemo(() => {
    const map = {};
    grades.forEach((g) => {
      map[g.id] = { grade: g, classes: classes.filter((c) => c.gradeId === g.id) };
    });
    return map;
  }, [grades, classes]);

  const getGradeLabel = (gradeName) => {
    const grade = grades.find((g) => g.name === gradeName);
    return grade ? loc(grade) : gradeName;
  };

  const activeExpandedGrade =
    expandedGrade === undefined ? grades[0]?.id || null : expandedGrade;
  const notice = error
    ? { message: formatClassMessage(error), severity: "error" }
    : success
      ? { message: formatClassMessage(success), severity: "success" }
      : null;

  const handleCloseNotice = () => {
    if (error) dispatch(clearError());
    if (success) dispatch(clearSuccess());
  };

  const handleOpenAdd = (gradeId, gradeName) => {
    setAddDialog({ open: true, gradeId, gradeName });
    setFormName("");
    setFormCount("");
  };

  const handleCloseAdd = () => {
    setAddDialog({ open: false, gradeId: "", gradeName: "" });
  };

  const handleAdd = () => {
    if (!formName.trim()) return;
    const data = {
      name: formName.trim(),
      gradeId: addDialog.gradeId,
      gradeName: addDialog.gradeName,
      studentCount: Number(formCount) || 0,
    };
    dispatch(createClass(data));
    handleCloseAdd();
  };

  const handleOpenEdit = (cls) => {
    setEditDialog({ open: true, classItem: cls });
    setFormName(cls.name);
    setFormCount(String(cls.studentCount || ""));
  };

  const handleCloseEdit = () => {
    setEditDialog({ open: false, classItem: null });
  };

  const handleEdit = () => {
    if (!formName.trim()) return;
    const data = { id: editDialog.classItem.id, name: formName.trim(), studentCount: Number(formCount) || 0 };
    dispatch(updateClass(data));
    handleCloseEdit();
  };

  const handleOpenDelete = (cls) => {
    setDeleteDialog({ open: true, classItem: cls });
  };

  const handleCloseDelete = () => {
    setDeleteDialog({ open: false, classItem: null });
  };

  const handleDelete = () => {
    dispatch(deleteClass(deleteDialog.classItem.id));
    handleCloseDelete();
  };

  const renderFormFields = () => (
    <>
      <TextField
        autoFocus
        label={t("classes.sectionName")}
        value={formName}
        onChange={(e) => setFormName(e.target.value)}
        fullWidth
        required
        placeholder={t("classes.sectionNamePlaceholder")}
        sx={{ mb: 2 }}
      />
      <TextField
        label={t("classes.studentCount")}
        type="number"
        value={formCount}
        onChange={(e) => setFormCount(e.target.value)}
        fullWidth
        placeholder={t("classes.optional")}
      />
    </>
  );

  const totalClasses = classes.length;
  const totalStudents = classes.reduce(
    (sum, classItem) => sum + Number(classItem.studentCount || 0),
    0,
  );

  const handleTabChange = (_, nextTab) => {
    setSearchParams(nextTab === "transfer" ? { tab: "transfer" } : {});
  };

  return (
    <Container maxWidth="xl" sx={{ py: 2 }}>
      <Snackbar
        open={Boolean(notice)}
        autoHideDuration={3000}
        onClose={handleCloseNotice}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          severity={notice?.severity || "success"}
          onClose={handleCloseNotice}
          variant="filled"
        >
          {notice?.message}
        </Alert>
      </Snackbar>

      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
          <SchoolIcon color="primary" />
          <Typography variant="h5" sx={{ fontWeight: 800 }}>
            {t("classes.title")}
          </Typography>
        </Box>
        <Typography variant="body2" color="text.secondary">
          {t("classes.subtitle")}
        </Typography>
      </Box>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, sm: 4 }}>
          <Card
            sx={{
              borderRadius: 3,
              boxShadow: "none",
              border: (t) => `2px solid ${alpha(t.palette.primary.main, 0.5)}`,
              bgcolor: (t) => alpha(t.palette.background.paper, 0.3),
              backdropFilter: "blur(24px)",
            }}
          >
            <CardContent sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <ClassIcon color="primary" />
              <Box>
                <Typography variant="h5" sx={{ fontWeight: 800 }}>
                  {totalClasses}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {t("classes.totalSections")}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <Card
            sx={{
              borderRadius: 3,
              boxShadow: "none",
              border: (t) => `2px solid ${alpha(t.palette.primary.main, 0.5)}`,
              bgcolor: (t) => alpha(t.palette.background.paper, 0.3),
              backdropFilter: "blur(24px)",
            }}
          >
            <CardContent sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <SchoolIcon color="primary" />
              <Box>
                <Typography variant="h5" sx={{ fontWeight: 800 }}>
                  {grades.length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {t("classes.totalGrades")}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <Card
            sx={{
              borderRadius: 3,
              boxShadow: "none",
              border: (t) => `2px solid ${alpha(t.palette.primary.main, 0.5)}`,
              bgcolor: (t) => alpha(t.palette.background.paper, 0.3),
              backdropFilter: "blur(24px)",
            }}
          >
            <CardContent sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <GroupIcon color="primary" />
              <Box>
                <Typography variant="h5" sx={{ fontWeight: 800 }}>
                  {totalStudents}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {t("classes.totalStudents")}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Paper
        elevation={0}
        sx={{
          mb: 3,
          borderRadius: 3,
          border: (t) => `2px solid ${alpha(t.palette.primary.main, 0.5)}`,
          bgcolor: (t) => alpha(t.palette.background.paper, 0.3),
          backdropFilter: "blur(24px)",
        }}
      >
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          variant="fullWidth"
          sx={{
            minHeight: 56,
            px: 1,
            width: "100%",
            "& .MuiTab-root": {
              flex: 1,
              maxWidth: "none",
              minHeight: 56,
              fontWeight: 700,
              textTransform: "none",
            },
          }}
        >
          <Tab
            icon={<ClassIcon fontSize="small" />}
            iconPosition="start"
            label={t("classes.tabs.sections")}
            value="sections"
          />
          <Tab
            icon={<SwapHorizIcon fontSize="small" />}
            iconPosition="start"
            label={t("classes.tabs.transfer")}
            value="transfer"
          />
        </Tabs>
      </Paper>

      {activeTab === "sections" && (
        <>
          {loading && (
            <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
              <CircularProgress />
            </Box>
          )}

          {!loading && grades.map((grade) => {
            const gradeClasses = classesByGrade[grade.id]?.classes || [];
            return (
              <Accordion
                key={grade.id}
                expanded={activeExpandedGrade === grade.id}
                onChange={() =>
                  setExpandedGrade(activeExpandedGrade === grade.id ? null : grade.id)
                }
                sx={{
                  mb: 1,
                  borderRadius: 2,
                  "&:before": { display: "none" },
                  boxShadow: "none",
                  border: (t) => `2px solid ${alpha(t.palette.primary.main, 0.5)}`,
                  bgcolor: (t) => alpha(t.palette.background.paper, 0.3),
                  backdropFilter: "blur(24px)",
                }}
              >
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1, width: "100%", ml: -1 }}>
                    <Typography sx={{ fontWeight: 600 }}>
                      {loc(grade)}
                    </Typography>
                    <Chip label={gradeClasses.length} size="small" color="primary" sx={{ fontWeight: 700 }} />
                    <Box sx={{ flexGrow: 1 }} />
                    <Button
                      size="small"
                      variant="outlined"
                      startIcon={<AddIcon />}
                      onClick={(e) => { e.stopPropagation(); handleOpenAdd(grade.id, grade.name); }}
                      sx={{ minWidth: 0, whiteSpace: "nowrap" }}
                    >
                      {t("classes.addSection")}
                    </Button>
                  </Box>
                </AccordionSummary>
                <AccordionDetails>
                  {gradeClasses.length === 0 && (
                    <Typography variant="body2" color="text.disabled" sx={{ textAlign: "center", py: 2 }}>
                      {t("classes.noSectionsInGrade")}
                    </Typography>
                  )}
                  <Grid container spacing={2}>
                    {gradeClasses.map((cls) => (
                      <Grid size={{ xs: 12, sm: 6, lg: 4 }} key={cls.id}>
                        <Card
                          sx={{
                            borderRadius: 2,
                            border: (t) => `2px solid ${alpha(t.palette.primary.main, 0.5)}`,
                            boxShadow: "none",
                            bgcolor: (t) => alpha(t.palette.background.paper, 0.3),
                            backdropFilter: "blur(24px)",
                            transition: "box-shadow 0.2s",
                            "&:hover": { boxShadow: (t) => `0 4px 20px ${alpha(t.palette.common.black, 0.12)}` },
                          }}
                        >
                          <CardContent sx={{ pb: 1 }}>
                            <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                              {loc(cls)}
                            </Typography>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mt: 0.5 }}>
                              <GroupIcon fontSize="small" color="action" />
                              <Typography variant="body2" color="text.secondary">
                                {t("classes.studentsCountLabel", {
                                  count: cls.studentCount ?? 0,
                                })}
                              </Typography>
                            </Box>
                          </CardContent>
                          <CardActions sx={{ justifyContent: "flex-start", pt: 0 }}>
                            <Tooltip title={t("common.edit")}>
                              <IconButton size="small" color="primary" onClick={() => handleOpenEdit(cls)}>
                                <EditIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title={t("common.delete")}>
                              <IconButton size="small" color="error" onClick={() => handleOpenDelete(cls)}>
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </CardActions>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                </AccordionDetails>
              </Accordion>
            );
          })}
        </>
      )}

      {activeTab === "transfer" && <TransferStudents embedded />}

      <Dialog open={addDialog.open} onClose={handleCloseAdd} maxWidth="sm" fullWidth PaperProps={{ sx: (t) => ({ borderRadius: 3, bgcolor: alpha(t.palette.background.paper, 0.3), backdropFilter: "blur(24px)", border: `2px solid ${alpha(t.palette.primary.main, 0.5)}` }) }}>
        <DialogTitle>
          {t("classes.addDialogTitle", {
            grade: getGradeLabel(addDialog.gradeName),
          })}
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          {renderFormFields()}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAdd}>{t("common.cancel")}</Button>
          <Button variant="contained" onClick={handleAdd} disabled={!formName.trim()}>{t("common.add")}</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={editDialog.open} onClose={handleCloseEdit} maxWidth="sm" fullWidth PaperProps={{ sx: (t) => ({ borderRadius: 3, bgcolor: alpha(t.palette.background.paper, 0.3), backdropFilter: "blur(24px)", border: `2px solid ${alpha(t.palette.primary.main, 0.5)}` }) }}>
        <DialogTitle>{t("classes.editDialogTitle")}</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          {editDialog.classItem && renderFormFields()}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEdit}>{t("common.cancel")}</Button>
          <Button variant="contained" onClick={handleEdit} disabled={!formName.trim()}>{t("common.saveChanges")}</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={deleteDialog.open} onClose={handleCloseDelete} PaperProps={{ sx: (t) => ({ borderRadius: 3, bgcolor: alpha(t.palette.background.paper, 0.3), backdropFilter: "blur(24px)", border: `2px solid ${alpha(t.palette.primary.main, 0.5)}` }) }}>
        <DialogTitle>{t("classes.deleteDialogTitle")}</DialogTitle>
        <DialogContent>
          <Typography>
            {t("classes.deleteQuestion", {
              section: loc(deleteDialog.classItem),
              grade: getGradeLabel(deleteDialog.classItem?.gradeName),
            })}
          </Typography>
          <Typography variant="caption" color="error" sx={{ mt: 1, display: "block" }}>
            {t("classes.deleteWarning")}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDelete}>{t("common.cancel")}</Button>
          <Button variant="contained" color="error" onClick={handleDelete}>{t("common.delete")}</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
