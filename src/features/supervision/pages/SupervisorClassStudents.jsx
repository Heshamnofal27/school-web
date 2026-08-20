import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { alpha, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import Avatar from "@mui/material/Avatar";
import Chip from "@mui/material/Chip";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import SchoolIcon from "@mui/icons-material/School";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { fetchSupervisorDashboard } from "../supervisionSlice";

export default function SupervisorClassStudents() {
  const theme = useTheme();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { t, i18n } = useTranslation();
  const { supervisor, loading, error } = useSelector((s) => s.supervision);
  const authUser = useSelector((state) => state.auth.user);
  const loc = (item) => item ? (i18n.language === "en" && item.nameEn ? item.nameEn : item.name) : "";
  const [selectedClassId, setSelectedClassId] = useState("");

  useEffect(() => {
    if (authUser?.id) dispatch(fetchSupervisorDashboard(authUser.id));
  }, [dispatch, authUser?.id]);

  const classes = supervisor?.classes || [];

  const glassBox = {
    background: alpha(theme.palette.background.paper, 0.3),
    backdropFilter: "blur(24px)",
    border: "2px solid",
    borderColor: alpha(theme.palette.primary.main, 0.5),
    borderRadius: 3,
  };

  if (loading) return <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}><CircularProgress /></Box>;
  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <Box>
      <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
        <Avatar sx={{ bgcolor: alpha(theme.palette.success.main, 0.12), color: "success.main", width: 48, height: 48 }}>
          <PeopleAltIcon />
        </Avatar>
        <Box>
          <Typography variant="h5" fontWeight="bold">
            {t("supervision.dashboard.classStudentsTitle")}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {t("supervision.dashboard.classStudentsSubtitle")}
          </Typography>
        </Box>
      </Box>

      <Card sx={{ ...glassBox, mb: 3 }}>
        <CardContent sx={{ display: "flex", alignItems: "center", gap: 2, flexWrap: "wrap", py: 2, "&:last-child": { pb: 2 } }}>
          <SchoolIcon color="primary" sx={{ fontSize: 28 }} />
          <FormControl size="small" sx={{ minWidth: { xs: "100%", sm: 300 } }}>
            <InputLabel>{t("supervision.dashboard.selectClass")}</InputLabel>
            <Select
              value={selectedClassId}
              label={t("supervision.dashboard.selectClass")}
              onChange={(e) => setSelectedClassId(e.target.value)}
            >
              {classes.map((cls) => (
                <MenuItem key={cls.id} value={cls.id}>
                  {loc(cls)} — {cls.studentCount} {t("supervision.dashboard.student")}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button
            variant="contained"
            color="success"
            disabled={!selectedClassId}
            onClick={() => navigate(`/supervisor/students/${selectedClassId}`)}
            startIcon={<VisibilityIcon />}
            sx={{ borderRadius: 2, fontWeight: 700, minWidth: 140 }}
          >
            {t("supervision.dashboard.viewList")}
          </Button>
        </CardContent>
      </Card>

      {classes.length > 0 && (
        <Grid container spacing={2}>
          {classes.map((cls) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={cls.id}>
              <Card
                sx={{
                  ...glassBox,
                  cursor: "pointer",
                  transition: "0.2s",
                  "&:hover": { transform: "translateY(-2px)", borderColor: "success.main" },
                }}
                onClick={() => navigate(`/supervisor/students/${cls.id}`)}
              >
                <CardContent sx={{ display: "flex", alignItems: "center", gap: 2, py: 2, "&:last-child": { pb: 2 } }}>
                  <Avatar sx={{ bgcolor: alpha(theme.palette.primary.main, 0.12), color: "primary.main" }}>
                    <SchoolIcon />
                  </Avatar>
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="subtitle2" fontWeight={700}>{loc(cls)}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {cls.studentCount} {t("supervision.dashboard.student")}
                    </Typography>
                  </Box>
                  <Chip label={t("supervision.dashboard.view")} size="small" color="success" variant="outlined" />
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {classes.length === 0 && !loading && (
        <Alert severity="info" sx={{ borderRadius: 2 }}>
          {t("supervision.dashboard.noClassesAssigned")}
        </Alert>
      )}
    </Box>
  );
}
