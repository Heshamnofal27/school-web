import { useEffect, useCallback, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { alpha } from "@mui/material/styles";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import Chip from "@mui/material/Chip";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import CircularProgress from "@mui/material/CircularProgress";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import SchoolIcon from "@mui/icons-material/School";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";

import {
  fetchClasses,
  fetchSupervisors,
  fetchAssignments,
  fetchGrades,
  assignSupervisor,
  unassignSupervisor,
  moveSupervisor,
  clearError,
  clearSuccess,
} from "../supervisorsSlice";
import DraggableSupervisor from "../components/DraggableSupervisor";
import ClassDropZone from "../components/ClassDropZone";

export default function SupervisorAssignment() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { classes, grades, supervisors, assignments, loading, error, success } =
    useSelector((state) => state.supervisors);

  const [activeId, setActiveId] = useState(null);
  const [expandedGrade, setExpandedGrade] = useState(null);
  const [selectedClassId, setSelectedClassId] = useState("");

  const activeSupervisor = useMemo(
    () => supervisors.find((s) => String(s.id) === String(activeId)),
    [activeId, supervisors]
  );

  // جلب كافة البيانات المطلوبة من الباك أند عند تحميل الصفحة
  useEffect(() => {
    dispatch(fetchClasses());
    dispatch(fetchSupervisors());
    dispatch(fetchAssignments());
    dispatch(fetchGrades());
  }, [dispatch]);

  // فتح المرحلة الدراسية الأولى تلقائياً عند اكتمال جلب البيانات
  useEffect(() => {
    if (grades.length > 0 && expandedGrade === null) {
      setExpandedGrade(grades[0].id);
    }
  }, [grades, expandedGrade]);

  // حسّاس السحب لمنع تداخله مع النقر البسيط
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    })
  );

  const handleDragStart = useCallback((event) => {
    setActiveId(event.active.id);
  }, []);

  const handleDragEnd = useCallback(
    (event) => {
      const { active, over } = event;

      setActiveId(null);

      if (!over || !active) return;

      const supervisorId = active.id;
      const classId = over.id;

      const existingAssignment = assignments.find(
        (a) => String(a.supervisorId || a.supervisor_id) === String(supervisorId)
      );

      if (existingAssignment) {
        const currentClassId = existingAssignment.classId || existingAssignment.class_id;
        if (String(currentClassId) === String(classId)) return;
        
        dispatch(
          moveSupervisor({
            assignmentId: existingAssignment.id,
            toClassId: classId,
            class_id: classId,
          })
        );
      } else {
        // إرسال البيانات بالتسميتين لتفادي مشاكل Snake / Camel case مع الباك أند
        dispatch(
          assignSupervisor({
            classId,
            supervisorId,
            class_id: classId,
            supervisor_id: supervisorId,
          })
        );
      }
    },
    [assignments, dispatch]
  );

  const handleRemove = useCallback(
    (assignmentId) => {
      dispatch(unassignSupervisor(assignmentId));
    },
    [dispatch]
  );

  const classesByGrade = useMemo(() => {
    const map = {};
    grades.forEach((g) => {
      map[g.id] = {
        grade: g,
        classes: classes.filter(
          (c) => String(c.gradeId || c.grade_id) === String(g.id)
        ),
      };
    });
    return map;
  }, [grades, classes]);

  const assignedIds = useMemo(
    () =>
      new Set(
        assignments.map((a) => String(a.supervisorId || a.supervisor_id))
      ),
    [assignments]
  );

  const availableSupervisors = useMemo(
    () => supervisors.filter((s) => !assignedIds.has(String(s.id))),
    [supervisors, assignedIds]
  );

  return (
    <Container maxWidth="xl" sx={{ py: 2 }}>
      {/* إشعار النجاح أو الخطأ */}
      <Snackbar
        open={!!error || !!success}
        autoHideDuration={3000}
        onClose={(event, reason) => {
          if (reason === "clickaway") return;
          dispatch(clearError());
          dispatch(clearSuccess());
        }}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          severity={error ? "error" : "success"}
          onClose={() => {
            dispatch(clearError());
            dispatch(clearSuccess());
          }}
          variant="filled"
          sx={{ width: "100%", fontWeight: 600 }}
        >
          {error || success}
        </Alert>
      </Snackbar>

      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 800, mb: 0.5 }}>
          تعيين المشرفين
        </Typography>
        <Typography variant="body2" color="text.secondary">
          اسحب المشرف من القائمة وأفلته على الصف المطلوب
        </Typography>
      </Box>

      {loading && (
        <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
          <CircularProgress />
        </Box>
      )}

      {!loading && (
        <DndContext
          sensors={sensors}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onDragCancel={() => setActiveId(null)}
        >
          <Grid container spacing={3}>
            {/* القائمة الجانبية */}
            <Grid size={{ xs: 12, md: 3 }}>
              <Box
                sx={{
                  position: { md: "sticky" },
                  top: 90,
                  display: "flex",
                  flexDirection: "column",
                  gap: 2,
                  zIndex: 10,
                }}
              >
                {/* صندوق المشرفين المتاحين */}
                <Box
                  sx={{
                    borderRadius: 2,
                    border: (t) =>
                      `2px solid ${alpha(t.palette.primary.main, 0.5)}`,
                    p: 2,
                    bgcolor: (t) => alpha(t.palette.background.paper, 0.4),
                    backdropFilter: "blur(24px)",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      mb: 2,
                    }}
                  >
                    <AssignmentIndIcon color="primary" />
                    <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                      المشرفون المتاحون
                    </Typography>
                    <Chip
                      label={availableSupervisors.length}
                      size="small"
                      color="primary"
                      sx={{ fontWeight: 700 }}
                    />
                  </Box>

                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 1,
                    }}
                  >
                    {availableSupervisors.length === 0 && (
                      <Typography
                        variant="caption"
                        color="text.disabled"
                        sx={{ textAlign: "center", py: 2 }}
                      >
                        تم تعيين جميع المشرفين
                      </Typography>
                    )}
                    {availableSupervisors.map((sup) => (
                      <DraggableSupervisor key={sup.id} supervisor={sup} />
                    ))}
                  </Box>
                </Box>

                {/* صندوق التقييمات والطلاب */}
                <Box
                  sx={{
                    borderRadius: 2,
                    border: (t) =>
                      `2px solid ${alpha(t.palette.success.main, 0.5)}`,
                    p: 2,
                    bgcolor: (t) => alpha(t.palette.background.paper, 0.4),
                    backdropFilter: "blur(24px)",
                  }}
                >
                  <Box
                    sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}
                  >
                    <PeopleAltIcon color="success" />
                    <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                      قائمة طلاب الصف والتقييمات
                    </Typography>
                  </Box>
                  <FormControl size="small" fullWidth sx={{ mb: 1.5 }}>
                    <InputLabel>اختر الصف</InputLabel>
                    <Select
                      value={selectedClassId}
                      label="اختر الصف"
                      onChange={(e) => setSelectedClassId(e.target.value)}
                    >
                      {classes.map((cls) => (
                        <MenuItem key={cls.id} value={cls.id}>
                          {cls.name} — {cls.gradeName || cls.grade?.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <Button
                    variant="contained"
                    color="success"
                    fullWidth
                    disabled={!selectedClassId}
                    onClick={() =>
                      navigate(`/admin/class-students/${selectedClassId}`)
                    }
                    startIcon={<PeopleAltIcon />}
                    sx={{ borderRadius: 2, fontWeight: 700 }}
                  >
                    عرض القائمة
                  </Button>
                </Box>
              </Box>
            </Grid>

            {/* الصفوف الدراسية */}
            <Grid size={{ xs: 12, md: 9 }}>
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}
              >
                <SchoolIcon color="primary" />
                <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                  الصفوف الدراسية
                </Typography>
              </Box>
              {grades.map((grade) => {
                const gradeClasses = classesByGrade[grade.id]?.classes || [];
                if (gradeClasses.length === 0) return null;
                return (
                  <Accordion
                    key={grade.id}
                    expanded={expandedGrade === grade.id}
                    onChange={() =>
                      setExpandedGrade(
                        expandedGrade === grade.id ? null : grade.id
                      )
                    }
                    sx={{
                      mb: 1.5,
                      borderRadius: 2,
                      "&:before": { display: "none" },
                      boxShadow: "none",
                      border: (t) =>
                        `2px solid ${alpha(t.palette.primary.main, 0.5)}`,
                      bgcolor: (t) => alpha(t.palette.background.paper, 0.3),
                      backdropFilter: "blur(24px)",
                    }}
                  >
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <Typography sx={{ fontWeight: 600 }}>
                        {grade.name}
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Grid container spacing={2}>
                        {gradeClasses.map((cls) => (
                          <Grid size={{ xs: 12, sm: 6, lg: 4 }} key={cls.id}>
                            <ClassDropZone
                              classItem={cls}
                              assignments={assignments}
                              supervisors={supervisors}
                              onRemove={handleRemove}
                              onSetPrimary={() => {}}
                            />
                          </Grid>
                        ))}
                      </Grid>
                    </AccordionDetails>
                  </Accordion>
                );
              })}
            </Grid>
          </Grid>

          {/* طبقة العرض المؤقت أثناء السحب */}
          <DragOverlay dropAnimation={null}>
            {activeSupervisor ? (
              <Box
                sx={{
                  px: 2,
                  py: 1.5,
                  borderRadius: 2,
                  bgcolor: (t) => alpha(t.palette.background.paper, 0.95),
                  backdropFilter: "blur(12px)",
                  boxShadow: (t) =>
                    `0 12px 28px ${alpha(t.palette.common.black, 0.25)}`,
                  border: (t) => `2px solid ${t.palette.primary.main}`,
                  fontWeight: 700,
                  fontSize: "0.875rem",
                  cursor: "grabbing",
                  display: "inline-block",
                  pointerEvents: "none",
                }}
              >
                {activeSupervisor.name}
              </Box>
            ) : null}
          </DragOverlay>
        </DndContext>
      )}
    </Container>
  );
}