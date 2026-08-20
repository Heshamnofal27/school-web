/**
 * 🛡️ Error Boundary Component
 * ============================
 * التقط الأخطاء في شجرة المكونات - Reliability & Robustness
 *
 * الاستخدام:
 * <ErrorBoundary>
 *   <YourComponent />
 * </ErrorBoundary>
 */

import { Component } from "react";
import { Box, Paper, Typography, Button, Container } from "@mui/material";
import { alpha } from "@mui/material/styles";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("❌ Error Boundary caught:", error, errorInfo);
    this.setState({
      error,
      errorInfo,
    });
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render() {
    if (this.state.hasError) {
      return (
        <Box
          sx={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "background.default",
            padding: 2,
          }}
        >
          <Container maxWidth="sm">
            <Paper
              sx={{
                padding: 4,
                textAlign: "center",
                backgroundColor: "background.paper",
                borderRadius: 2,
              }}
            >
              {/* الأيقونة */}
              <ErrorOutlineIcon
                sx={{
                  fontSize: 60,
                  color: "error.main",
                  marginBottom: 2,
                }}
              />

              {/* العنوان */}
              <Typography
                variant="h5"
                gutterBottom
                sx={{ color: "text.primary" }}
              >
                حدث خطأ ما 😞
              </Typography>

              {/* الوصف */}
              <Typography
                variant="body1"
                color="textSecondary"
                paragraph
                sx={{
                  marginY: 2,
                  minHeight: 50,
                }}
              >
                نعتذر عن المشكلة. يرجى المحاولة مجدداً أو التواصل مع الدعم
                الفني.
              </Typography>

              {/* رسالة الخطأ (فقط في development) */}
              {import.meta.env.DEV && this.state.error && (
                <Paper
                  variant="outlined"
                  sx={{
                    padding: 2,
                    backgroundColor: (t) => alpha(t.palette.warning.main, t.palette.mode === "dark" ? 0.16 : 0.12),
                    borderColor: (t) => alpha(t.palette.warning.main, 0.4),
                    borderRadius: 1,
                    marginY: 2,
                    textAlign: "left",
                    overflow: "auto",
                    maxHeight: 200,
                  }}
                >
                  <Typography
                    variant="caption"
                    sx={{
                      color: (t) => (t.palette.mode === "dark" ? t.palette.warning.light : t.palette.warning.dark),
                      fontFamily: "monospace",
                      whiteSpace: "pre-wrap",
                      wordBreak: "break-word",
                    }}
                  >
                    {this.state.error.toString()}
                    {"\n\n"}
                    {this.state.errorInfo?.componentStack}
                  </Typography>
                </Paper>
              )}

              {/* الأزرار */}
              <Box
                sx={{
                  display: "flex",
                  gap: 2,
                  justifyContent: "center",
                  marginTop: 3,
                }}
              >
                <Button
                  variant="contained"
                  color="primary"
                  onClick={this.handleReset}
                >
                  حاول مجدداً
                </Button>
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={() => (window.location.href = "/")}
                >
                  العودة للرئيسية
                </Button>
              </Box>
            </Paper>
          </Container>
        </Box>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
