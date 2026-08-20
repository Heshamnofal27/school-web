import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import { alpha, useTheme } from "@mui/material/styles";
import { useState } from "react";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Avatar from "@mui/material/Avatar";
import LockResetIcon from "@mui/icons-material/LockReset";
import Link from "@mui/material/Link";
import LanguageSwitcher from "../../../shared/components/LanguageSwitcher";
import ThemeToggle from "../../../shared/components/ThemeToggle";

export default function ForgotPassword() {
  const theme = useTheme();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const validateEmail = (emailValue) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(emailValue);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setError("");

    if (!email.trim()) {
      setError(t("auth.emailRequired"));
      return;
    }

    if (!validateEmail(email)) {
      setError(t("auth.invalidEmail"));
      return;
    }

    setLoading(true);

    // محاكاة إرسال البريد
    setTimeout(() => {
      setLoading(false);
      setIsSubmitted(true);
      // محاكاة إعادة تعيين البريد بعد 3 ثوانٍ
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    }, 1500);
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 2,
      }}
    >
      <Container maxWidth="xs">
        <Paper
          elevation={0}
          sx={{
            padding: 4,
            borderRadius: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            backgroundColor: alpha(theme.palette.common.white, 0.12),
            backdropFilter: "blur(24px)",
            border: `1px solid ${alpha(theme.palette.common.white, 0.22)}`,
            boxShadow: `0 16px 50px ${alpha(theme.palette.common.black, 0.25)}`,
          }}
        >
          <Box
            sx={{
              alignSelf: "stretch",
              display: "flex",
              justifyContent: "flex-end",
              mb: 1,
            }}
          >
            <LanguageSwitcher />
            <ThemeToggle />
          </Box>

          {/* --- قسم الأيقونة والعنوان --- */}
          <Avatar
            sx={{
              m: 1,
              bgcolor: "primary.main",
              width: 60,
              height: 60,
              boxShadow: (th) => `0px 4px 12px ${alpha(th.palette.common.black, 0.1)}`,
            }}
          >
            <LockResetIcon sx={{ fontSize: "2.5rem", color: "white" }} />
          </Avatar>

          <Typography
            variant="h4"
            component="h1"
            gutterBottom
            sx={{
              fontWeight: "bold",
              color: "text.primary",
              mt: 1,
              textAlign: "center",
            }}
          >
            {t("auth.forgotPasswordTitle")}
          </Typography>

          <Typography
            variant="body2"
            color="textSecondary"
            sx={{ mb: 3, textAlign: "center" }}
          >
            {t("auth.forgotPasswordSubtitle")}
          </Typography>

          {/* --- رسالة النجاح --- */}
          {isSubmitted && (
            <Alert severity="success" sx={{ width: "100%", mb: 2 }}>
              {t("auth.resetLinkSent")}
            </Alert>
          )}

          {/* --- رسالة الخطأ --- */}
          {error && (
            <Alert severity="error" sx={{ width: "100%", mb: 2 }}>
              {error}
            </Alert>
          )}

          {/* --- نموذج إعادة تعيين كلمة المرور --- */}
          {!isSubmitted ? (
            <Box
              component="form"
              noValidate
              onSubmit={handleSubmit}
              sx={{ mt: 1, width: "100%" }}
            >
              <Typography
                variant="body2"
                sx={{
                  mb: 2,
                  color: "text.secondary",
                  fontSize: "0.95rem",
                  lineHeight: "1.5",
                }}
              >
                {t("auth.forgotPasswordInstructions")}
              </Typography>

              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label={t("auth.academicEmail")}
                name="email"
                autoComplete="email"
                autoFocus
                variant="outlined"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                sx={(th) => ({
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "12px",
                    "&.Mui-focused fieldset": {
                      borderColor: th.palette.primary.main,
                    },
                  },
                  "& .MuiInputLabel-root.Mui-focused": {
                    color: th.palette.primary.main,
                  },
                })}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={loading}
              sx={(th) => ({
                mt: 3,
                mb: 2,
                py: 1.5,
                fontSize: "1rem",
                fontWeight: "bold",
                borderRadius: "12px",
                background: `linear-gradient(to right, ${th.palette.primary.light}, ${th.palette.primary.main})`,
                textTransform: "none",
                "&:hover": {
                  background: `linear-gradient(to right, ${alpha(th.palette.primary.main, 0.8)}, ${th.palette.primary.dark})`,
                },
                "&:disabled": {
                  background: th.palette.action.disabled,
                },
              })}
              >
                {loading ? t("auth.sendingReset") : t("auth.sendReset")}
              </Button>

              {/* --- رابط العودة لصفحة الدخول --- */}
              <Box sx={{ textAlign: "center", mt: 2 }}>
                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                  {t("auth.rememberPassword")}
                  <Link
                    component={RouterLink}
                    to="/login"
                    sx={(th) => ({
                      ml: 1,
                      fontWeight: "500",
                      color: th.palette.primary.main,
                      textDecoration: "none",
                      cursor: "pointer",
                      "&:hover": {
                        textDecoration: "underline",
                        color: th.palette.primary.dark,
                      },
                    })}
                  >
                    {t("auth.backToLogin")}
                  </Link>
                </Typography>
              </Box>
            </Box>
          ) : (
            <Box sx={{ textAlign: "center", width: "100%" }}>
              <Typography variant="body2" sx={{ color: "text.secondary", mb: 2 }}>
                {t("auth.redirectingToLogin")}
              </Typography>
              <Link
                component={RouterLink}
                to="/login"
                sx={(th) => ({
                  fontWeight: "500",
                  color: th.palette.primary.main,
                  textDecoration: "none",
                  cursor: "pointer",
                  "&:hover": {
                    textDecoration: "underline",
                  },
                })}
              >
                {t("auth.clickHereToLogin")}
              </Link>
            </Box>
          )}
        </Paper>
      </Container>
    </Box>
  );
}
