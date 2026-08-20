import { useMemo, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { alpha, useTheme } from "@mui/material/styles";
import { useTranslation } from "react-i18next";

import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import ListItemIcon from "@mui/material/ListItemIcon";
import Tooltip from "@mui/material/Tooltip";
import Avatar from "@mui/material/Avatar";
import Divider from "@mui/material/Divider";

import MenuIcon from "@mui/icons-material/Menu";
import MenuOpenIcon from "@mui/icons-material/MenuOpen";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import SupervisedUserCircleIcon from "@mui/icons-material/SupervisedUserCircle";
import ClassIcon from "@mui/icons-material/Class";
import SchoolIcon from "@mui/icons-material/School";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import LogoutIcon from "@mui/icons-material/Logout";
import SettingsIcon from "@mui/icons-material/Settings";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremium";
import ReportProblemIcon from "@mui/icons-material/ReportProblem";
import DirectionsBusIcon from "@mui/icons-material/DirectionsBus";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import RequestQuoteIcon from "@mui/icons-material/RequestQuote";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import CampaignIcon from "@mui/icons-material/Campaign";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import RateReviewIcon from "@mui/icons-material/RateReview";

import { logout } from "../features/auth/authSlice";
import { logout as logoutFromServer } from "../features/auth/authAPI";
import LanguageSwitcher from "../shared/components/LanguageSwitcher";
import ThemeToggle from "../shared/components/ThemeToggle";
import { ROLES } from "../shared/constants/roles";
import { getDirection } from "../shared/utils/i18nLabels";

const drawerCollapsed = 64;
const drawerExpanded = 240;
const appBarHeight = 64;
const drawerGap = 6;
const gapBetween = 10;

export default function AppLayout() {
  const theme = useTheme();
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const user = useSelector((state) => state.auth.user);

  const [mobileOpen, setMobileOpen] = useState(false);
  const [sidebarHovered, setSidebarHovered] = useState(false);
  const [sidebarPinned, setSidebarPinned] = useState(false);

  const sidebarOpen = sidebarPinned || sidebarHovered;
  const direction = getDirection(i18n.resolvedLanguage || i18n.language);
  const drawerAnchor = direction === "rtl" ? "right" : "left";

  const { role } = user || {};

  const dashboardLabelKey = useMemo(() => {
    if (role === ROLES.SUPERVISION) return "nav.supervisorDashboard";
    if (role === ROLES.ACCOUNTING) return "nav.accountingDashboard";
    return "nav.dashboard";
  }, [role]);

  const dashboardPath = useMemo(() => {
    if (role === ROLES.ADMIN) return "/admin/dashboard";
    if (role === ROLES.SUPERVISION) return "/supervisor/dashboard";
    if (role === ROLES.ACCOUNTING) return "/accounting/dashboard";
    return "/";
  }, [role]);

  // إعادة بناء عناصر القائمة بناءً على أدوار العرض التقديمي (Presentation)
  const navItems = useMemo(() => {
    const items = [
      { label: t(dashboardLabelKey), path: dashboardPath, icon: DashboardIcon },
    ];

    // ================= 1. صلاحيات الأدمن (Admin) =================
    if (role === ROLES.ADMIN) {
      items.push({
        label: "الحسابات المعتمدة والإنشاء",
        path: "/admin/authorized-emails",
        icon: PersonAddIcon,
      });
      items.push({
        label: "إدارة الصفوف والشعب",
        path: "/admin/manage-classes",
        icon: ClassIcon,
      });
      items.push({
        label: "تعيين المشرفين",
        path: "/admin/assign-supervisors",
        icon: SupervisedUserCircleIcon,
      });
      items.push({
        label: "الموافقة على الإعلانات",
        path: "/admin/announcements-approval",
        icon: CampaignIcon,
      });
      items.push({
        label: "إدارة الأساتذة",
        path: "/admin/teachers",
        icon: SchoolIcon,
      });
      items.push({
        label: "الشكاوى والتقييمات",
        path: "/admin/complaints",
        icon: ReportProblemIcon,
      });
    }

    // ================= 2. صلاحيات المشرف (Supervisor) =================
    if (role === ROLES.SUPERVISION) {
      items.push({
        label: "طلاب الشعب الموكلة",
        path: "/supervisor/class-students",
        icon: PeopleAltIcon,
      });
      items.push({
        label: "الحضور والغياب",
        path: "/supervisor/attendance",
        icon: EventAvailableIcon,
      });
      items.push({
        label: "الملاحظات والتقارير السلوكية",
        path: "/supervisor/behavioral-notes",
        icon: AssignmentIndIcon,
      });
      items.push({
        label: "الرحلات المدرسية",
        path: "/supervisor/trips",
        icon: DirectionsBusIcon,
      });
      items.push({
        label: "الاجتماعات والأنشطة",
        path: "/supervisor/meetings",
        icon: GroupAddIcon,
      });
    }

    // ================= 3. صلاحيات المحاسب (Accountant) =================
    if (role === ROLES.ACCOUNTING) {
      items.push({
        label: "سجل فواتير الطلاب",
        path: "/accounting/student-directory",
        icon: ReceiptLongIcon,
      });
      items.push({
        label: "إدارة الأقساط المدرسية",
        path: "/accounting/tuition-settings",
        icon: MonetizationOnIcon,
      });
      items.push({
        label: "تأكيد الدفعات المستحقة",
        path: "/accounting/due-payments",
        icon: RequestQuoteIcon,
      });
      items.push({
        label: "الحسابات المالية للطلاب",
        path: "/accounting/student-billing",
        icon: AccountBalanceWalletIcon,
      });
    }

    return items;
  }, [t, dashboardPath, dashboardLabelKey, role]);

  const sharedPaper = {
    backgroundColor: alpha(theme.palette.background.paper, 0.4),
    backdropFilter: "blur(24px)",
  };

  const handleLogout = () => {
    logoutFromServer().finally(() => {
      dispatch(logout());
      navigate("/login", { replace: true });
    });
  };

  const handleToggleMobile = () => setMobileOpen((v) => !v);
  const handleNavClick = (path) => {
    navigate(path);
    setMobileOpen(false);
  };

  const handleTogglePin = () => {
    setSidebarPinned((prev) => !prev);
    setSidebarHovered(false);
  };

  const renderNavList = (isMobile = false) => {
    const isExpanded = isMobile || sidebarOpen;

    return (
      <List sx={{ flexGrow: 1, px: 1, py: 1, display: "flex", flexDirection: "column", overflowX: "hidden" }}>
        <Box sx={{ flexGrow: 1 }}>
          {navItems.map((item) => {
            const selected = location.pathname === item.path;
            const IconComponent = item.icon;
            return (
              <Tooltip
                key={item.path}
                title={!isExpanded ? item.label : ""}
                placement={drawerAnchor === "right" ? "left" : "right"}
                disableHoverListener={isExpanded}
              >
                <ListItemButton
                  selected={selected}
                  aria-current={selected ? "page" : undefined}
                  onClick={() => handleNavClick(item.path)}
                  sx={{
                    minHeight: 48,
                    borderRadius: 2,
                    mb: 0.5,
                    px: 1.5,
                    justifyContent: isExpanded ? "flex-start" : "center",
                    transition: theme.transitions.create(["background-color", "padding"], {
                      duration: theme.transitions.duration.shorter,
                    }),
                    "&.Mui-selected": {
                      backgroundColor: alpha(theme.palette.primary.main, theme.palette.mode === "dark" ? 0.24 : 0.12),
                      color: theme.palette.primary.main,
                    },
                    "&.Mui-selected:hover": {
                      backgroundColor: alpha(theme.palette.primary.main, theme.palette.mode === "dark" ? 0.3 : 0.18),
                    },
                  }}
                >
                  <ListItemIcon sx={{ color: "inherit", minWidth: 36, justifyContent: "center" }}>
                    <IconComponent fontSize="small" />
                  </ListItemIcon>

                  <ListItemText
                    primary={item.label}
                    primaryTypographyProps={{
                      noWrap: true,
                      fontSize: "0.875rem",
                      fontWeight: selected ? 600 : 400,
                    }}
                    sx={{
                      ml: 1,
                      my: 0,
                      opacity: isExpanded ? 1 : 0,
                      maxHeight: isExpanded ? "100%" : 0,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      transition: theme.transitions.create(["opacity"], {
                        duration: theme.transitions.duration.shorter,
                      }),
                    }}
                  />
                </ListItemButton>
              </Tooltip>
            );
          })}
        </Box>

        <Box sx={{ mt: "auto" }}>
          <Divider sx={{ my: 1, borderColor: alpha(theme.palette.divider, 0.5) }} />

          <Tooltip title={!isExpanded ? t("nav.settings") : ""} placement={drawerAnchor === "right" ? "left" : "right"} disableHoverListener={isExpanded}>
            <ListItemButton
              onClick={() => handleNavClick("/settings")}
              selected={location.pathname === "/settings"}
              aria-current={location.pathname === "/settings" ? "page" : undefined}
              sx={{
                minHeight: 48,
                borderRadius: 2,
                mb: 0.5,
                px: 1.5,
                justifyContent: isExpanded ? "flex-start" : "center",
                "&.Mui-selected": {
                  backgroundColor: alpha(theme.palette.primary.main, theme.palette.mode === "dark" ? 0.24 : 0.12),
                  color: theme.palette.primary.main,
                },
              }}
            >
              <ListItemIcon sx={{ color: "inherit", minWidth: 36, justifyContent: "center" }}>
                <SettingsIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText
                primary={t("nav.settings")}
                primaryTypographyProps={{ noWrap: true, fontSize: "0.875rem" }}
                sx={{
                  ml: 1,
                  my: 0,
                  opacity: isExpanded ? 1 : 0,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  transition: theme.transitions.create(["opacity"], {
                    duration: theme.transitions.duration.shorter,
                  }),
                }}
              />
            </ListItemButton>
          </Tooltip>

          <Tooltip title={!isExpanded ? t("app.logout") : ""} placement={drawerAnchor === "right" ? "left" : "right"} disableHoverListener={isExpanded}>
            <ListItemButton
              onClick={handleLogout}
              sx={{
                minHeight: 48,
                borderRadius: 2,
                px: 1.5,
                justifyContent: isExpanded ? "flex-start" : "center",
              }}
            >
              <ListItemIcon sx={{ color: theme.palette.error.main, minWidth: 36, justifyContent: "center" }}>
                <LogoutIcon fontSize="small" sx={{ transform: direction === "ltr" ? "scaleX(-1)" : "none" }} />
              </ListItemIcon>
              <ListItemText
                primary={t("app.logout")}
                primaryTypographyProps={{ noWrap: true, fontSize: "0.875rem" }}
                sx={{
                  ml: 1,
                  my: 0,
                  color: theme.palette.error.main,
                  opacity: isExpanded ? 1 : 0,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  transition: theme.transitions.create(["opacity"], {
                    duration: theme.transitions.duration.shorter,
                  }),
                }}
              />
            </ListItemButton>
          </Tooltip>
        </Box>
      </List>
    );
  };

  const drawerContent = (isMobile) => (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%", overflow: "hidden" }}>
      {isMobile && <Box sx={{ height: appBarHeight + drawerGap + gapBetween }} />}

      {!isMobile && (
        <Box sx={{ display: "flex", justifyContent: sidebarOpen ? "flex-end" : "center", px: 1, pt: 1, pb: 0.5 }}>
          <Tooltip title={sidebarPinned ? t("nav.collapseSidebar", "Collapse menu") : t("nav.expandSidebar", "Expand menu")}>
            <IconButton
              size="small"
              onClick={handleTogglePin}
              aria-pressed={sidebarPinned}
              aria-label={sidebarPinned ? t("nav.collapseSidebar", "Collapse menu") : t("nav.expandSidebar", "Expand menu")}
            >
              {sidebarPinned ? (
                <MenuOpenIcon fontSize="small" sx={{ transform: direction === "rtl" ? "scaleX(-1)" : "none" }} />
              ) : (
                <MenuIcon fontSize="small" />
              )}
            </IconButton>
          </Tooltip>
        </Box>
      )}

      {renderNavList(isMobile)}
    </Box>
  );

  return (
    <Box sx={{ display: "flex", minHeight: "100svh" }}>
      {/* AppBar */}
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          ...sharedPaper,
          border: `2px solid ${alpha(theme.palette.primary.main, 0.5)}`,
          borderRadius: 2,
          color: theme.palette.text.primary,
          zIndex: (t) => t.zIndex.drawer + 1,
          boxShadow: `0 4px 24px ${alpha(theme.palette.common.black, 0.08)}`,
          top: drawerGap,
          left: drawerGap,
          right: drawerGap,
          width: "auto",
        }}
      >
        <Toolbar sx={{ gap: 1 }}>
          <IconButton
            edge="start"
            color="inherit"
            aria-label={t("app.openMenu")}
            onClick={handleToggleMobile}
            sx={{ display: { xs: "inline-flex", md: "none" } }}
          >
            <MenuIcon />
          </IconButton>

          <Typography sx={{ fontWeight: 900, fontSize: "1.1rem", flexGrow: 1, textAlign: "start" }}>
            {t("app.name")}
          </Typography>

          <LanguageSwitcher />
          <ThemeToggle />

          {user && (
            <Tooltip title={user.email || ""}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Avatar
                  src={user.avatar}
                  sx={{ width: 32, height: 32, fontSize: 14, bgcolor: (t) => t.palette.primary.main }}
                >
                  {(user.name || user.email || "?").charAt(0).toUpperCase()}
                </Avatar>
                <Typography variant="body2" sx={{ opacity: 0.9, display: { xs: "none", sm: "block" } }}>
                  {user.name || user.email}
                </Typography>
              </Box>
            </Tooltip>
          )}
        </Toolbar>
      </AppBar>

      {/* Desktop Permanent Drawer */}
      <Drawer
        variant="permanent"
        anchor={drawerAnchor}
        onMouseEnter={() => setSidebarHovered(true)}
        onMouseLeave={() => setSidebarHovered(false)}
        sx={{
          width: sidebarOpen ? drawerExpanded : drawerCollapsed + drawerGap,
          flexShrink: 0,
          display: { xs: "none", md: "block" },
          whiteSpace: "nowrap",
          boxSizing: "border-box",
          [`& .MuiDrawer-paper`]: {
            position: "fixed",
            boxSizing: "border-box",
            ...sharedPaper,
            top: appBarHeight + drawerGap + gapBetween,
            height: `calc(100% - ${appBarHeight + drawerGap * 2 + gapBetween}px)`,
            overflowX: "hidden",
            width: sidebarOpen ? drawerExpanded : drawerCollapsed,
            left: drawerAnchor === "left" ? drawerGap : "auto",
            right: drawerAnchor === "right" ? drawerGap : "auto",
            borderRadius: sidebarOpen ? 3 : 2.5,
            boxShadow: `0 4px 24px ${alpha(theme.palette.common.black, 0.08)}`,
            border: `2px solid ${alpha(theme.palette.primary.main, 0.5)}`,
            transition: theme.transitions.create(["width", "left", "right", "border-radius"], {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.standard,
            }),
          },
        }}
      >
        {drawerContent(false)}
      </Drawer>

      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        anchor={drawerAnchor}
        open={mobileOpen}
        onClose={handleToggleMobile}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: "block", md: "none" },
          [`& .MuiDrawer-paper`]: {
            width: drawerExpanded,
            boxSizing: "border-box",
            ...sharedPaper,
            border: `2px solid ${alpha(theme.palette.primary.main, 0.5)}`,
            borderRadius: 2.5,
          },
        }}
      >
        {drawerContent(true)}
      </Drawer>

      {/* Main Content View */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          px: { xs: 2, md: 3 },
          py: 3,
          transition: theme.transitions.create(["margin", "width"], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.standard,
          }),
        }}
      >
        <Box sx={{ height: appBarHeight + drawerGap }} />
        <Box
          sx={{
            ...sharedPaper,
            border: (t) => `2px solid ${alpha(t.palette.primary.main, 0.5)}`,
            borderRadius: 4,
            p: { xs: 2, md: 3 },
            minHeight: `calc(100svh - ${appBarHeight + drawerGap + 48}px)`,
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}