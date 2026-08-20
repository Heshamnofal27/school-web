import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { alpha, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Chip from "@mui/material/Chip";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import Avatar from "@mui/material/Avatar";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Link from "@mui/material/Link";
import LinearProgress from "@mui/material/LinearProgress";
import Tooltip from "@mui/material/Tooltip";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import SchoolIcon from "@mui/icons-material/School";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import AssignmentIcon from "@mui/icons-material/Assignment";
import ReportIcon from "@mui/icons-material/Report";
import GradeIcon from "@mui/icons-material/Grade";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import VisibilityIcon from "@mui/icons-material/Visibility";
import PhoneInTalkIcon from "@mui/icons-material/PhoneInTalk";
import { fetchClassOverview } from "../supervisionSlice";

function StatBox({ icon, label, value, color }) {
  const theme = useTheme();
  return (
    <Card sx={{
      background: alpha(theme.palette.background.paper, 0.3),
      backdropFilter: "blur(24px)",
      border: "2px solid",
      borderColor: alpha(theme.palette[color].main, 0.5),
      borderRadius: 3,
    }}>
      <CardContent sx={{ display: "flex", alignItems: "center", gap: 2, py: 2, "&:last-child": { pb: 2 } }}>
        <Avatar sx={{ bgcolor: alpha(theme.palette[color].main, 0.15), color: `${color}.main`, width: 44, height: 44 }}>
          {icon}
        </Avatar>
        <Box>
          <Typography variant="h5" fontWeight="bold">{value}</Typography>
          <Typography variant="caption" color="text.secondary">{label}</Typography>
        </Box>
      </CardContent>
    </Card>
  );
}

function ScoreIndicator({ label, value, max = 100 }) {
  const pct = Math.round((value / max) * 100);
  const color = pct >= 75 ? "success" : pct >= 50 ? "warning" : "error";
  return (
    <Box sx={{ mb: 1.5 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
        <Typography variant="body2">{label}</Typography>
        <Typography variant="body2" fontWeight="bold" color={`${color}.main`}>{value}%</Typography>
      </Box>
      <LinearProgress variant="determinate" value={pct}
        color={color}
        sx={{ height: 8, borderRadius: 4, bgcolor: alpha(theme => theme.palette[color].main, 0.12) }}
      />
    </Box>
  );
}

export default function ClassOverview() {
  const { classId } = useParams();
  const { t } = useTranslation();
  const theme = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { classOverview, loading, error } = useSelector((s) => s.supervision);

  useEffect(() => {
    if (classId) dispatch(fetchClassOverview(classId));
  }, [dispatch, classId]);

  if (loading) return <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}><CircularProgress /></Box>;
  if (error) return <Alert severity="error">{error}</Alert>;
  if (!classOverview) return null;

  const c = classOverview;

  return (
    <Box>
      <Breadcrumbs sx={{ mb: 2 }}>
        <Link underline="hover" color="inherit" sx={{ cursor: "pointer" }} onClick={() => navigate("/supervisor/dashboard")}>
          {t("supervision.dashboard.title")}
        </Link>
        <Typography color="text.primary">{c.name}</Typography>
      </Breadcrumbs>

      {/* ─── Header ─── */}
      <Card sx={{
        background: alpha(theme.palette.background.paper, 0.3),
        backdropFilter: "blur(24px)",
        border: "2px solid", borderColor: alpha(theme.palette.primary.main, 0.5),
        borderRadius: 3, mb: 3,
      }}>
        <CardContent sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 2 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Avatar sx={{ bgcolor: alpha(theme.palette.primary.main, 0.15), color: "primary.main", width: 52, height: 52 }}>
              <SchoolIcon />
            </Avatar>
            <Box>
              <Typography variant="h5" fontWeight="bold">{c.name}</Typography>
              <Typography variant="body2" color="text.secondary">
                {t(`grades.${c.gradeId}`)} — {c.studentCount} {t("supervision.dashboard.student")}
              </Typography>
            </Box>
          </Box>
          <Button variant="contained" startIcon={<VisibilityIcon />}
            onClick={() => navigate(`/supervisor/students/${classId}`)}
            sx={{ borderRadius: 2 }}>
            {t("supervision.overview.viewStudents")}
          </Button>
        </CardContent>
      </Card>

      {/* ─── Stats Row ─── */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={6} sm={3} lg={2}>
          <StatBox icon={<PeopleAltIcon />} label={t("supervision.dashboard.students")} value={c.studentCount} color="primary" />
        </Grid>
        <Grid item xs={6} sm={3} lg={2}>
          <StatBox icon={<WarningAmberIcon />} label={t("supervision.student.negative")} value={c.negativeCount} color="error" />
        </Grid>
        <Grid item xs={6} sm={3} lg={2}>
          <StatBox icon={<CheckCircleIcon />} label={t("supervision.student.positive")} value={c.positiveCount} color="success" />
        </Grid>
        <Grid item xs={6} sm={3} lg={2}>
          <StatBox icon={<AssignmentIcon />} label={t("supervision.dashboard.evaluations")} value={c.evaluationCount} color="warning" />
        </Grid>
        <Grid item xs={6} sm={3} lg={2}>
          <StatBox icon={<PhoneInTalkIcon />} label={t("supervision.overview.contacts")} value={c.contactCount} color="info" />
        </Grid>
        <Grid item xs={6} sm={3} lg={2}>
          <StatBox icon={<ReportIcon />} label={t("supervision.student.penalties")} value={c.penaltyCount} color="error" />
        </Grid>
      </Grid>

      <Grid container spacing={2.5}>
        {/* ─── Academic Performance ─── */}
        <Grid item xs={12} md={6}>
          <Card sx={{
            background: alpha(theme.palette.background.paper, 0.3),
            backdropFilter: "blur(24px)",
            border: "2px solid", borderColor: alpha(theme.palette.primary.main, 0.5),
            borderRadius: 3, height: "100%",
          }}>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                <GradeIcon color="primary" />
                <Typography variant="subtitle1" fontWeight="bold">{t("supervision.overview.academicPerformance")}</Typography>
              </Box>
              <Divider sx={{ mb: 2 }} />
              {c.avgAcademic != null ? (
                <>
                  <ScoreIndicator label={t("supervision.student.academic")} value={c.avgAcademic} />
                  <ScoreIndicator label={t("supervision.student.behavior")} value={c.avgBehavior} />
                  <ScoreIndicator label={t("supervision.student.participation")} value={c.avgParticipation} />
                </>
              ) : (
                <Typography color="text.secondary" variant="body2">{t("supervision.overview.noEvals")}</Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* ─── Behavior Summary ─── */}
        <Grid item xs={12} md={6}>
          <Card sx={{
            background: alpha(theme.palette.background.paper, 0.3),
            backdropFilter: "blur(24px)",
            border: "2px solid", borderColor: alpha(theme.palette.primary.main, 0.5),
            borderRadius: 3, height: "100%",
          }}>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                <WarningAmberIcon color="warning" />
                <Typography variant="subtitle1" fontWeight="bold">{t("supervision.student.behaviors")}</Typography>
              </Box>
              <Divider sx={{ mb: 2 }} />
              <Box sx={{ display: "flex", gap: 2, mb: 2, flexWrap: "wrap" }}>
                <Chip icon={<CheckCircleIcon />} label={`${c.positiveCount} ${t("supervision.student.positive")}`} color="success" />
                <Chip icon={<WarningAmberIcon />} label={`${c.negativeCount} ${t("supervision.student.negative")}`} color="error" />
                <Chip icon={<AssignmentIcon />} label={`${c.warningCount} ${t("supervision.student.warning")}`} color="warning" />
              </Box>
              <Typography variant="subtitle2" gutterBottom sx={{ mt: 1 }}>{t("supervision.overview.recentBehaviors")}</Typography>
              {c.recentBehaviors?.length > 0 ? (
                c.recentBehaviors.map((b) => (
                  <Box key={b.id} sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", py: 0.5 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Chip size="small"
                        color={b.type === "positive" ? "success" : b.type === "negative" ? "error" : "warning"}
                        label={t(`supervision.student.${b.type}`)}
                        sx={{ minWidth: 50 }}
                      />
                      <Typography variant="body2">{b.description}</Typography>
                    </Box>
                    <Typography variant="caption" color="text.secondary">{b.date}</Typography>
                  </Box>
                ))
              ) : (
                <Typography variant="body2" color="text.secondary">{t("supervision.overview.noBehaviors")}</Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* ─── Recent Evaluations ─── */}
        <Grid item xs={12}>
          <Card sx={{
            background: alpha(theme.palette.background.paper, 0.3),
            backdropFilter: "blur(24px)",
            border: "2px solid", borderColor: alpha(theme.palette.primary.main, 0.5),
            borderRadius: 3,
          }}>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                <AssignmentIcon color="warning" />
                <Typography variant="subtitle1" fontWeight="bold">{t("supervision.overview.recentEvals")}</Typography>
              </Box>
              <Divider sx={{ mb: 2 }} />
              {c.recentEvaluations?.length > 0 ? (
                <Grid container spacing={1.5}>
                  {c.recentEvaluations.map((ev) => {
                    const student = c.students?.find((s) => s.id === ev.studentId);
                    return (
                      <Grid item xs={12} sm={6} md={4} key={ev.id}>
                        <Card sx={{
                          bgcolor: alpha(theme.palette.background.paper, 0.2),
                          borderRadius: 2,
                          border: "1px solid", borderColor: alpha(theme.palette.divider, 0.3),
                        }}>
                          <CardContent sx={{ py: 1.5, "&:last-child": { pb: 1.5 } }}>
                            <Typography variant="body2" fontWeight="medium">{student?.name || "—"}</Typography>
                            <Box sx={{ display: "flex", gap: 1, mt: 1, flexWrap: "wrap" }}>
                              <Chip size="small" label={`${t("supervision.student.academic")}: ${ev.academic}`} variant="outlined" />
                              <Chip size="small" label={`${t("supervision.student.behavior")}: ${ev.behavior}`} variant="outlined" />
                              <Chip size="small" label={`${t("supervision.student.participation")}: ${ev.participation}`} variant="outlined" />
                            </Box>
                            {ev.notes && (
                              <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: "block" }}>
                                {ev.notes}
                              </Typography>
                            )}
                            <Typography variant="caption" color="text.disabled">{ev.date}</Typography>
                          </CardContent>
                        </Card>
                      </Grid>
                    );
                  })}
                </Grid>
              ) : (
                <Typography color="text.secondary" variant="body2">{t("supervision.overview.noEvals")}</Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
