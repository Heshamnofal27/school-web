import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import { alpha, useTheme } from "@mui/material/styles";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate, Link as RouterLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Avatar from "@mui/material/Avatar";
import SchoolIcon from "@mui/icons-material/School";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";

import { loginSuccess } from "../authSlice";
import { loginWithEmail } from "../authAPI";
import { ROLE_INFO } from "../../../shared/constants/roles";
import LanguageSwitcher from "../../../shared/components/LanguageSwitcher";
import ThemeToggle from "../../../shared/components/ThemeToggle";
import {
  saveRememberedEmail,
  loadRememberedEmail,
  clearRememberedEmail,
} from "../../../shared/utils/storageManager";
import { isValidEmail } from "../../../shared/utils/validation";

const getDashboardPath = (role) => {
  const info = ROLE_INFO[role];
  return info?.dashboardPath || "/";
};

const getLoginErrorMessage = (error) => {
  if (error?.message === "Failed to fetch") {
    return "تعذر الاتصال بالخادم. تأكد أن API يعمل";
  }

  return error?.message || "تعذر تسجيل الدخول";
};

export default function Login() {
  const theme = useTheme();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const authUser = useSelector((state) => state.auth.user);

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      navigate(getDashboardPath(authUser?.role), { replace: true });
      return;
    }

    const savedEmail = loadRememberedEmail();
    if (savedEmail) {
      setFormData((prev) => ({ ...prev, email: savedEmail }));
      setRememberMe(true);
    }
  }, [authUser?.role, isAuthenticated, navigate]);

  const validateForm = () => {
    const newErrors = {};
    const email = formData.email.trim();

    if (!email) {
      newErrors.email = "البريد الإلكتروني مطلوب";
    } else if (!isValidEmail(email)) {
      newErrors.email = "صيغة البريد الإلكتروني غير صحيحة";
    }

    if (!formData.password) {
      newErrors.password = "كلمة المرور مطلوبة";
    } else if (formData.password.length < 6) {
      newErrors.password = "كلمة المرور يجب أن تكون 6 أحرف على الأقل";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    setErrors({});

    try {
      const email = formData.email.trim();
      const authPayload = await loginWithEmail(email, formData.password);

      if (rememberMe) {
        saveRememberedEmail(email);
      } else {
        clearRememberedEmail();
      }

      dispatch(loginSuccess(authPayload));

      const redirectPath =
        location.state?.from || getDashboardPath(authPayload.user?.role);
      navigate(redirectPath, { replace: true });
    } catch (error) {
      setErrors({ password: getLoginErrorMessage(error) });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 2,
        overflow: "hidden",
      }}
    >
      <Container maxWidth="xs">
        <Paper
          elevation={0}
          sx={{
            padding: 3,
            borderRadius: 3.5,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            backgroundColor: alpha(theme.palette.common.white, 0.12),
            backdropFilter: "blur(24px)",
            border: `1px solid ${alpha(theme.palette.common.white, 0.22)}`,
            boxShadow: `0 14px 44px ${alpha(theme.palette.common.black, 0.22)}`,
          }}
        >
          <Box
            sx={{
              alignSelf: "stretch",
              display: "flex",
              justifyContent: "flex-end",
              mb: 0.5,
            }}
          >
            <LanguageSwitcher />
            <ThemeToggle />
          </Box>

          <Avatar
            sx={{
              m: 0.5,
              bgcolor: "primary.main",
              width: 50,
              height: 50,
              boxShadow: (th) =>
                `0px 4px 10px ${alpha(th.palette.common.black, 0.1)}`,
            }}
          >
            <SchoolIcon sx={{ fontSize: "2rem", color: "white" }} />
          </Avatar>

          <Typography
            variant="h5"
            component="h1"
            sx={{ fontWeight: "bold", color: "text.primary", mt: 0.5 }}
          >
            {t("app.name")}
          </Typography>
          <Typography variant="body2" color="textSecondary" sx={{ mb: 2, textAlign: "center" }}>
            {t("auth.loginSubtitle")}
          </Typography>

          <Box
            component="form"
            noValidate
            onSubmit={handleSubmit}
            sx={{ width: "100%" }}
          >
            <TextField
              margin="dense"
              size="small"
              required
              fullWidth
              id="email"
              label={t("auth.academicEmail")}
              name="email"
              autoComplete="email"
              autoFocus
              variant="outlined"
              value={formData.email}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, email: e.target.value }))
              }
              error={!!errors.email}
              helperText={errors.email}
              sx={(th) => ({
                mb: 1,
                "& .MuiOutlinedInput-root": {
                  borderRadius: "10px",
                  backgroundColor: alpha(th.palette.common.white, 0.08),
                  "&:hover": {
                    backgroundColor: alpha(th.palette.common.white, 0.1),
                  },
                  "&.Mui-focused": {
                    backgroundColor: alpha(th.palette.common.white, 0.12),
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: th.palette.primary.main,
                  },
                },
                "& .MuiInputLabel-root.Mui-focused": {
                  color: th.palette.primary.main,
                },
              })}
            />
            <TextField
              margin="dense"
              size="small"
              required
              fullWidth
              name="password"
              label={t("auth.password")}
              type="password"
              id="password"
              autoComplete="current-password"
              value={formData.password}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, password: e.target.value }))
              }
              error={!!errors.password}
              helperText={errors.password}
              sx={(th) => ({
                "& .MuiOutlinedInput-root": {
                  borderRadius: "10px",
                  backgroundColor: alpha(th.palette.common.white, 0.08),
                  "&:hover": {
                    backgroundColor: alpha(th.palette.common.white, 0.1),
                  },
                  "&.Mui-focused": {
                    backgroundColor: alpha(th.palette.common.white, 0.12),
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: th.palette.primary.main,
                  },
                },
                "& .MuiInputLabel-root.Mui-focused": {
                  color: th.palette.primary.main,
                },
              })}
            />

            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mt: 1,
              }}
            >
              <FormControlLabel
                control={
                  <Checkbox
                    size="small"
                    name="remember"
                    color="primary"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    sx={(th) => ({
                      p: 0.5,
                      color: th.palette.primary.main,
                      "&.Mui-checked": { color: th.palette.primary.main },
                    })}
                  />
                }
                label={
                  <Typography variant="body2">
                    {t("auth.rememberMe")}
                  </Typography>
                }
              />
              <Link
                component={RouterLink}
                to="/forgot-password"
                variant="body2"
                sx={(th) => ({
                  cursor: "pointer",
                  fontWeight: "500",
                  color: th.palette.primary.main,
                  textDecoration: "none",
                  "&:hover": {
                    textDecoration: "underline",
                    color: th.palette.primary.dark,
                  },
                })}
              >
                {t("auth.forgotPassword")}
              </Link>
            </Box>

            <Button
              type="submit"
              fullWidth
              disabled={isSubmitting}
              variant="contained"
              sx={(th) => ({
                mt: 2.5,
                mb: 1,
                py: 1.25,
                fontSize: "0.95rem",
                fontWeight: "bold",
                borderRadius: "10px",
                background: `linear-gradient(to right, ${th.palette.primary.light}, ${th.palette.primary.main})`,
                textTransform: "none",
                "&:hover": {
                  background: `linear-gradient(to right, ${alpha(th.palette.primary.main, 0.8)}, ${th.palette.primary.dark})`,
                },
              })}
            >
              {isSubmitting ? (
                <CircularProgress color="inherit" size={22} />
              ) : (
                t("auth.loginButton")
              )}
            </Button>

            <Box sx={{ textAlign: "center", mt: 1 }}>
              <Typography variant="body2" color="textSecondary" component="span">
                {t("auth.noAccountYet")}{" "}
              </Typography>
              <Link
                component={RouterLink}
                to="/register"
                variant="body2"
                sx={(th) => ({
                  cursor: "pointer",
                  fontWeight: "600",
                  color: th.palette.primary.main,
                  textDecoration: "none",
                  "&:hover": {
                    textDecoration: "underline",
                    color: th.palette.primary.dark,
                  },
                })}
              >
                {t("auth.createAccountLink")}
              </Link>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}