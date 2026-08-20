import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";
import Divider from "@mui/material/Divider";
import SchoolIcon from "@mui/icons-material/School";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { alpha } from "@mui/material/styles";

import { loginSuccess } from "../authSlice";
import { checkEmailForRegistration, completeRegistration } from "../authAPI";
import { ROLE_INFO } from "../../../shared/constants/roles";

const getDashboardPath = (role) => {
  const info = ROLE_INFO[role];
  return info?.dashboardPath || "/";
};

export default function Register() {
  const { t } = useTranslation();
  const theme = useTheme();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [step, setStep] = useState("email");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [userType, setUserType] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // 🔑 خطوة 1: التحقق من البريد عبر الباك-إند الحقيقي
  // (POST /register/check-email — راجع AuthController::checkEmail)
  const handleValidateEmail = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const trimmedEmail = email.trim();
      const result = await checkEmailForRegistration(trimmedEmail);

      setUserType(result.role || "");
      setStep("confirm");
    } catch (err) {
      setError(err.message || t("register.validationError"));
    } finally {
      setLoading(false);
    }
  };

  // 🔑 خطوة 2: إكمال التسجيل عبر الباك-إند الحقيقي
  // (POST /register — راجع AuthController::register)
  // عند النجاح الباك-إند يُعيد token مباشرة (تسجيل دخول تلقائي)، لذا
  // نُخزّن الحالة في Redux تماماً كما يفعل تسجيل الدخول العادي بدل إعادة
  // توجيه المستخدم لصفحة /login ليُدخل نفس البيانات مرة أخرى.
  const handleRegister = async (e) => {
    e.preventDefault();
    setError(null);

    if (password.length < 6) {
      setError(t("register.passwordMinLength"));
      return;
    }

    if (password !== confirmPassword) {
      setError(t("register.passwordMismatch"));
      return;
    }

    setLoading(true);

    try {
      const authPayload = await completeRegistration({
        email: email.trim(),
        password,
        password_confirmation: confirmPassword,
        name: name.trim() || undefined,
      });

      dispatch(loginSuccess(authPayload));
      setSuccess(t("register.successMessage"));

      setTimeout(() => {
        navigate(getDashboardPath(authPayload.user?.role), { replace: true });
      }, 1200);
    } catch (err) {
      setError(err.message || t("register.registrationError"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", p: 2 }}>
      <Container maxWidth="xs">
        <Paper
          elevation={0}
          sx={{
            p: 4,
            borderRadius: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            backgroundColor: alpha(theme.palette.common.white, 0.25),
            backdropFilter: "blur(16px)",
            border: `1px solid ${alpha(theme.palette.common.white, 0.22)}`,
            boxShadow: `0 16px 50px ${alpha(theme.palette.common.black, 0.25)}`,
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: theme.palette.primary.main, width: 60, height: 60 }}>
            <PersonAddIcon sx={{ fontSize: "2rem" }} />
          </Avatar>

          <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: "bold", color: theme.palette.text.primary, mt: 1 }}>
            {t("register.title")}
          </Typography>
          <Typography variant="body2" color="textSecondary" sx={{ mb: 3, textAlign: "center" }}>
            {step === "email" ? t("register.subtitle") : t("register.confirmSubtitle")}
          </Typography>

          {error && <Alert severity="error" sx={{ width: "100%", mb: 2 }}>{error}</Alert>}
          {success && <Alert severity="success" sx={{ width: "100%", mb: 2 }}>{success}</Alert>}

          {step === "email" ? (
            <Box component="form" onSubmit={handleValidateEmail} sx={{ width: "100%" }}>
              <TextField
                margin="normal"
                required
                fullWidth
                label={t("auth.academicEmail")}
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                sx={{
                  "& .MuiOutlinedInput-root": { borderRadius: "12px" },
                }}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={loading}
                sx={{ mt: 2, mb: 2, py: 1.5, borderRadius: "12px", fontWeight: 600, fontSize: "1rem" }}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : t("register.checkEmail")}
              </Button>

              <Divider sx={{ my: 1.5 }} />

              <Box sx={{ textAlign: "center" }}>
                <Typography variant="body2" color="textSecondary">
                  {t("register.haveAccount")}{" "}
                  <Link to="/login" style={{ color: theme.palette.primary.main, fontWeight: 600 }}>
                    {t("auth.loginButton")}
                  </Link>
                </Typography>
              </Box>
            </Box>
          ) : (
            <Box component="form" onSubmit={handleRegister} sx={{ width: "100%" }}>
              <Alert severity="info" sx={{ width: "100%", mb: 2, textAlign: "center" }}>
                {t("register.emailAuthorized")}<br />
                <strong>{email}</strong>
                {userType && <> — {t(`register.userTypeLabel`)}: {userType}</>}
              </Alert>

              <TextField
                margin="normal"
                fullWidth
                label={t("register.fullName")}
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={loading}
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
              />

              <TextField
                margin="normal"
                required
                fullWidth
                label={t("register.password")}
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
              />

              <TextField
                margin="normal"
                required
                fullWidth
                label={t("register.confirmPassword")}
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={loading}
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={loading}
                sx={{ mt: 2, mb: 1, py: 1.5, borderRadius: "12px", fontWeight: 600, fontSize: "1rem" }}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : t("register.createAccount")}
              </Button>

              <Button
                fullWidth
                variant="text"
                startIcon={<ArrowBackIcon />}
                onClick={() => { setStep("email"); setError(null); }}
                disabled={loading}
                sx={{ py: 1, borderRadius: "12px" }}
              >
                {t("register.back")}
              </Button>
            </Box>
          )}
        </Paper>
      </Container>
    </Box>
  );
}
