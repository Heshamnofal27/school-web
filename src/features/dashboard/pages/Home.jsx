import { useEffect, useState, lazy, Suspense, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useTheme, alpha } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import Skeleton from "@mui/material/Skeleton";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import IconButton from "@mui/material/IconButton";
import Divider from "@mui/material/Divider";
import CloseIcon from "@mui/icons-material/Close";
import PeopleIcon from "@mui/icons-material/People";
import SchoolIcon from "@mui/icons-material/School";
import ClassIcon from "@mui/icons-material/Class";
import GroupIcon from "@mui/icons-material/Group";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PendingIcon from "@mui/icons-material/HourglassEmpty";

import { fetchDashboardStats } from "../dashboardAPI";

const ChartSection = lazy(() => import("../components/ChartSection"));

const cardsMeta = [
  { key: "users", icon: PeopleIcon, colorKey: "primary", valueKey: "total" },
  { key: "grades", icon: SchoolIcon, colorKey: "warning" },
  { key: "classes", icon: ClassIcon, colorKey: "info" },
  { key: "supervisors", icon: GroupIcon, colorKey: "secondary", valueKey: "total" },
];

function DetailRow({ icon, label, value, color }) {
  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, py: 0.75 }}>
      <Box sx={{ color, display: "flex", alignItems: "center" }}>{icon}</Box>
      <Typography variant="body2" sx={{ flexGrow: 1 }}>{label}</Typography>
      <Typography variant="body2" sx={{ fontWeight: 700 }}>{value}</Typography>
    </Box>
  );
}

// eslint-disable-next-line no-unused-vars
function StatCard({ icon: Icon, label, value, color, onClick }) {
  const iconGradient = `linear-gradient(135deg, ${color} 0%, ${alpha(color, 0.7)} 100%)`;
  return (
    <Card
      onClick={onClick}
      sx={{
        borderRadius: 3,
        border: (t) => `2px solid ${alpha(t.palette.primary.main, 0.5)}`,
        transition: "all 0.3s ease",
        height: "100%",
        cursor: "pointer",
        position: "relative",
        overflow: "hidden",
        bgcolor: (t) => alpha(t.palette.background.paper, 0.3),
        backdropFilter: "blur(24px)",
        "&:hover": {
          transform: "translateY(-4px)",
          borderColor: color,
          boxShadow: `0 12px 36px ${alpha(color, 0.2)}`,
        },
      }}
    >
      <CardContent sx={{ display: "flex", alignItems: "center", gap: 2.5, p: 3, "&:last-child": { pb: 3 } }}>
        <Box
          sx={{
            width: 56, height: 56, borderRadius: 2.5, display: "flex", alignItems: "center",
            justifyContent: "center", flexShrink: 0,
            background: iconGradient,
            color: "#fff",
            boxShadow: `0 4px 14px ${alpha(color, 0.3)}`,
          }}
        >
          <Icon sx={{ fontSize: 28 }} />
        </Box>
        <Box sx={{ minWidth: 0 }}>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 800, lineHeight: 1.1, fontSize: { xs: "1.5rem", md: "1.75rem" },
              background: iconGradient,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            {value}
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mt: 0.25, fontWeight: 500, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}
          >
            {label}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}

function DetailDialog({ open, onClose, cardKey, title, stats, t, theme }) {
  if (!stats) return null;

  const renderContent = () => {
    switch (cardKey) {
      case "users": {
        const { total, byType } = stats.users;
        return (
          <>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1.5 }}>{t("dashboard.usersByType")}</Typography>
            {Object.entries(byType).map(([type, count]) => (
              <DetailRow key={type} icon={<PeopleIcon fontSize="small" />} label={t(`userTypes.${type}`, type)} value={count} color={theme.palette.primary.main} />
            ))}
            <Divider sx={{ my: 1 }} />
            <DetailRow icon={<CheckCircleIcon fontSize="small" />} label={t("dashboard.activeUsers")} value={total} color={theme.palette.primary.main} />
          </>
        );
      }
      case "grades": {
        const { grades, perGrade } = stats.classes;
        return (
          <>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1.5 }}>{t("dashboard.classesPerGrade")}</Typography>
            {perGrade.map((g) => (
              <DetailRow key={g.gradeName} icon={<SchoolIcon fontSize="small" />} label={t(`dashboard.grades.${g.gradeName}`, g.gradeName)} value={`${g.count} ${t("dashboard.totalClasses")}`} color={theme.palette.warning.main} />
            ))}
            <Divider sx={{ my: 1 }} />
            <DetailRow icon={<SchoolIcon fontSize="small" />} label={t("dashboard.totalGrades")} value={grades} color={theme.palette.warning.main} />
          </>
        );
      }
      case "classes": {
        const { total, perGrade } = stats.classes;
        return (
          <>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1.5 }}>{t("dashboard.classesPerGrade")}</Typography>
            {perGrade.map((g) => (
              <DetailRow key={g.gradeName} icon={<ClassIcon fontSize="small" />} label={t(`dashboard.grades.${g.gradeName}`, g.gradeName)} value={g.count} color={theme.palette.info.main} />
            ))}
            <Divider sx={{ my: 1 }} />
            <DetailRow icon={<ClassIcon fontSize="small" />} label={t("dashboard.totalClasses")} value={total} color={theme.palette.info.main} />
          </>
        );
      }
      case "supervisors": {
        const { total, assigned } = stats.supervisors;
        return (
          <>
            <DetailRow icon={<GroupIcon fontSize="small" />} label={t("dashboard.totalSupervisors")} value={total} color={theme.palette.secondary.main} />
            <Divider sx={{ my: 1 }} />
            <DetailRow icon={<AssignmentIndIcon fontSize="small" />} label={t("dashboard.assignedSupervisors")} value={assigned} color={theme.palette.secondary.main} />
            <DetailRow icon={<PendingIcon fontSize="small" />} label={t("dashboard.unassignedSupervisors")} value={total - assigned} color={theme.palette.error.main} />
          </>
        );
      }
      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth PaperProps={{ sx: (t) => ({ borderRadius: 3, bgcolor: alpha(t.palette.background.paper, 0.3), backdropFilter: "blur(24px)", border: `2px solid ${alpha(t.palette.primary.main, 0.5)}`, boxShadow: `0 16px 50px ${alpha(t.palette.common.black, 0.25)}` }) }}>
      <DialogTitle sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", pb: 1 }}>
        <Typography sx={{ fontWeight: 700 }}>{title || t("dashboard.birdEyeTitle")}</Typography>
        <IconButton size="small" onClick={onClose}><CloseIcon /></IconButton>
      </DialogTitle>
      <Divider />
      <DialogContent sx={{ pt: 2 }}>{renderContent()}</DialogContent>
    </Dialog>
  );
}

export default function Home() {
  const { t } = useTranslation();
  const theme = useTheme();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [detailCard, setDetailCard] = useState(null);

  useEffect(() => {
    let mounted = true;
    setTimeout(() => setLoading(true), 0);
    fetchDashboardStats()
      .then((res) => {
        if (!mounted) return;
        if (res.success) {
          setStats(res.data);
        } else {
          setError(res.message || t("dashboard.loadError"));
        }
      })
      .catch((err) => {
        if (mounted) setError(err.message || t("dashboard.unexpectedError"));
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => { mounted = false; };
  }, [t]);

  const handleCardClick = useCallback((key) => setDetailCard(key), []);
  const handleCloseDetail = useCallback(() => setDetailCard(null), []);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="xl" sx={{ py: 2 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  if (!stats) return null;

  const { users, classes, supervisors } = stats;

  const getValue = (key) => {
    switch (key) {
      case "users": return users.total;
      case "grades": return classes.grades;
      case "classes": return classes.total;
      case "supervisors": return supervisors.total;
      default: return 0;
    }
  };

  const getLabel = (key) => {
    switch (key) {
      case "users": return t("dashboard.activeUsers");
      case "grades": return t("dashboard.totalGrades");
      case "classes": return t("dashboard.totalClasses");
      case "supervisors": return t("dashboard.totalSupervisors");
      default: return "";
    }
  };

  const getColor = (key) => {
    switch (key) {
      case "users": return theme.palette.primary.main;
      case "grades": return theme.palette.warning.main;
      case "classes": return theme.palette.info.main;
      case "supervisors": return theme.palette.secondary.main;
      default: return theme.palette.primary.main;
    }
  };

  return (
    <Container maxWidth="xl" sx={{ py: 2 }}>
      <Typography variant="h5" sx={{ fontWeight: 800, mb: 0.5 }}>
        {t("dashboard.birdEyeTitle")}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        {t("dashboard.birdEyeSubtitle")}
      </Typography>

      <Grid container spacing={2.5}>
        {cardsMeta.map(({ key, icon }) => (
          <Grid key={key} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
            <StatCard
              icon={icon}
              label={getLabel(key)}
              value={getValue(key)}
              color={getColor(key)}
              onClick={() => handleCardClick(key)}
            />
          </Grid>
        ))}
      </Grid>

      <Suspense fallback={<Skeleton variant="rounded" width="100%" height={300} sx={{ mt: 3, borderRadius: 3 }} />}>
        <ChartSection stats={stats} />
      </Suspense>

      <DetailDialog
        open={!!detailCard}
        onClose={handleCloseDetail}
        cardKey={detailCard}
        title={getLabel(detailCard)}
        stats={stats}
        t={t}
        theme={theme}
      />
    </Container>
  );
}
