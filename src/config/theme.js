import { createTheme, alpha } from "@mui/material/styles";

/**
 * ============================================================================
 * Centralized MUI Theme
 * ----------------------------------------------------------------------------
 * - Two visually distinct, WCAG AA compliant palettes (light / dark)
 * - All component defaults customized in one place via `components`
 * - Consumed through `createAppTheme(direction, mode)` — see
 *   src/app/providers/AppProviders.jsx
 * ============================================================================
 */

// ---------------------------------------------------------------------------
// Palettes
// ---------------------------------------------------------------------------
// Every "main" shade below was chosen (and where needed, darkened from the
// familiar Tailwind/Material reference shade) so that white text placed on
// top of it clears a 4.5:1 contrast ratio — the WCAG AA threshold for normal
// text. Where a lighter, more vivid shade was kept (e.g. warning), an explicit
// dark `contrastText` is supplied instead of relying on MUI's automatic
// (looser) contrast heuristic.

const lightPalette = {
  mode: "light",
  primary: {
    main: "#1D4ED8",
    light: "#3B82F6",
    dark: "#1E3A8A",
    contrastText: "#FFFFFF",
  },
  secondary: {
    main: "#0F766E",
    light: "#14B8A6",
    dark: "#134E4A",
    contrastText: "#FFFFFF",
  },
  success: {
    main: "#15803D",
    light: "#22C55E",
    dark: "#14532D",
    contrastText: "#FFFFFF",
  },
  error: {
    main: "#B91C1C",
    light: "#EF4444",
    dark: "#7F1D1D",
    contrastText: "#FFFFFF",
  },
  warning: {
    main: "#B45309",
    light: "#F59E0B",
    dark: "#78350F",
    contrastText: "#FFFFFF",
  },
  info: {
    main: "#0369A1",
    light: "#38BDF8",
    dark: "#0C4A6E",
    contrastText: "#FFFFFF",
  },
  background: {
    default: "#F8FAFC",
    paper: "#FFFFFF",
  },
  text: {
    primary: "#0F172A",
    secondary: "#475569",
    disabled: "#94A3B8",
  },
  divider: "#E2E8F0",
  action: {
    hover: alpha("#0F172A", 0.04),
    selected: alpha("#1D4ED8", 0.08),
    focus: alpha("#1D4ED8", 0.18),
    disabled: alpha("#0F172A", 0.32),
    disabledBackground: alpha("#0F172A", 0.08),
  },
  custom: {
    border: "#E2E8F0",
    borderStrong: "#CBD5E1",
    surfaceSubtle: "#F1F5F9",
    scrollbarThumb: "#CBD5E1",
    scrollbarTrack: "transparent",
  },
};

const darkPalette = {
  mode: "dark",
  primary: {
    main: "#60A5FA",
    light: "#93C5FD",
    dark: "#3B82F6",
    contrastText: "#0B1120",
  },
  secondary: {
    main: "#2DD4BF",
    light: "#5EEAD4",
    dark: "#14B8A6",
    contrastText: "#052E29",
  },
  success: {
    main: "#4ADE80",
    light: "#86EFAC",
    dark: "#22C55E",
    contrastText: "#052E13",
  },
  error: {
    main: "#F87171",
    light: "#FCA5A5",
    dark: "#EF4444",
    contrastText: "#2B0A0A",
  },
  warning: {
    main: "#FBBF24",
    light: "#FCD34D",
    dark: "#F59E0B",
    contrastText: "#2B1900",
  },
  info: {
    main: "#38BDF8",
    light: "#7DD3FC",
    dark: "#0EA5E9",
    contrastText: "#06202B",
  },
  background: {
    default: "#0B1220",
    paper: "#161F32",
  },
  text: {
    primary: "#F1F5F9",
    secondary: "#94A3B8",
    disabled: "#64748B",
  },
  divider: "rgba(148, 163, 184, 0.16)",
  action: {
    hover: alpha("#F1F5F9", 0.06),
    selected: alpha("#60A5FA", 0.16),
    focus: alpha("#60A5FA", 0.24),
    disabled: alpha("#F1F5F9", 0.3),
    disabledBackground: alpha("#F1F5F9", 0.08),
  },
  custom: {
    border: "rgba(148, 163, 184, 0.16)",
    borderStrong: "rgba(148, 163, 184, 0.28)",
    surfaceSubtle: "#1E293B",
    scrollbarThumb: "#334155",
    scrollbarTrack: "transparent",
  },
};

// ---------------------------------------------------------------------------
// Shared design tokens
// ---------------------------------------------------------------------------
const radius = {
  sm: 8,
  md: 10,
  lg: 14,
  xl: 20,
};

const fontFamily = [
  "Alexandria",
  "system-ui",
  '"Segoe UI"',
  "Roboto",
  "sans-serif",
].join(",");

export const createAppTheme = (direction = "rtl", mode = "light") => {
  const isDark = mode === "dark";
  const colors = isDark ? darkPalette : lightPalette;

  const theme = createTheme({
    direction,
    palette: colors,
    shape: { borderRadius: radius.md },
    typography: {
      fontFamily,
      h1: { fontWeight: 800, letterSpacing: -0.5 },
      h2: { fontWeight: 800, letterSpacing: -0.5 },
      h3: { fontWeight: 700, letterSpacing: -0.25 },
      h4: { fontWeight: 700 },
      h5: { fontWeight: 700 },
      h6: { fontWeight: 700 },
      subtitle1: { fontWeight: 600 },
      subtitle2: { fontWeight: 600 },
      button: { fontWeight: 600, textTransform: "none" },
    },
    // Slightly softer elevation scale than MUI's default so cards/menus read
    // as "modern flat" rather than heavily drop-shadowed.
    shadows: [
      "none",
      isDark
        ? "0 1px 2px rgba(0,0,0,0.4)"
        : "0 1px 2px rgba(15,23,42,0.06)",
      isDark
        ? "0 2px 6px rgba(0,0,0,0.4)"
        : "0 2px 6px rgba(15,23,42,0.07)",
      isDark
        ? "0 4px 10px rgba(0,0,0,0.42)"
        : "0 4px 10px rgba(15,23,42,0.08)",
      ...Array(21).fill(
        isDark
          ? "0 12px 32px rgba(0,0,0,0.45)"
          : "0 12px 32px rgba(15,23,42,0.10)",
      ),
    ],
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          "*:focus-visible": {
            outline: `2px solid ${colors.primary.main}`,
            outlineOffset: 2,
            borderRadius: 4,
          },
          "::selection": {
            backgroundColor: alpha(colors.primary.main, 0.25),
          },
          "*": {
            scrollbarWidth: "thin",
            scrollbarColor: `${colors.custom.scrollbarThumb} ${colors.custom.scrollbarTrack}`,
          },
          "*::-webkit-scrollbar": {
            width: 10,
            height: 10,
          },
          "*::-webkit-scrollbar-track": {
            background: "transparent",
          },
          "*::-webkit-scrollbar-thumb": {
            backgroundColor: colors.custom.scrollbarThumb,
            borderRadius: 999,
            border: "2px solid transparent",
            backgroundClip: "content-box",
          },
        },
      },
      MuiContainer: {
        defaultProps: { maxWidth: "xl" },
      },
      MuiPaper: {
        defaultProps: { elevation: 0 },
        styleOverrides: {
          root: {
            backgroundImage: "none",
            border: `1px solid ${colors.custom.border}`,
          },
          rounded: {
            borderRadius: radius.lg,
          },
          outlined: {
            borderColor: colors.custom.border,
          },
        },
      },
      MuiCard: {
        defaultProps: { elevation: 0 },
        styleOverrides: {
          root: {
            borderRadius: radius.lg,
            border: `1px solid ${colors.custom.border}`,
            backgroundImage: "none",
            transition: "box-shadow 0.2s ease, border-color 0.2s ease, transform 0.2s ease",
          },
        },
      },
      MuiCardContent: {
        styleOverrides: {
          root: {
            padding: 20,
            "&:last-child": { paddingBottom: 20 },
          },
        },
      },
      MuiCardHeader: {
        styleOverrides: {
          title: { fontWeight: 700 },
        },
      },
      MuiAppBar: {
        defaultProps: { elevation: 0 },
        styleOverrides: {
          root: {
            backgroundColor: colors.background.paper,
            color: colors.text.primary,
            backgroundImage: "none",
          },
        },
      },
      MuiToolbar: {
        styleOverrides: {
          root: { minHeight: 64 },
        },
      },
      MuiDrawer: {
        styleOverrides: {
          paper: {
            backgroundColor: colors.background.paper,
            backgroundImage: "none",
            borderColor: colors.custom.border,
          },
        },
      },
      MuiButton: {
        defaultProps: { disableElevation: true },
        styleOverrides: {
          root: {
            textTransform: "none",
            fontWeight: 600,
            borderRadius: radius.md,
            paddingInline: 18,
            paddingBlock: 9,
            boxShadow: "none",
            transition: "background-color 0.15s ease, border-color 0.15s ease, box-shadow 0.15s ease, transform 0.1s ease",
            "&:hover": { boxShadow: "none" },
            "&:active": { transform: "translateY(1px)" },
          },
          sizeSmall: { paddingInline: 12, paddingBlock: 6, borderRadius: radius.sm },
          sizeLarge: { paddingInline: 24, paddingBlock: 12, borderRadius: radius.lg },
          containedPrimary: {
            "&:hover": { backgroundColor: colors.primary.dark },
          },
          outlined: {
            borderWidth: 1.5,
            "&:hover": { borderWidth: 1.5 },
          },
        },
      },
      MuiIconButton: {
        styleOverrides: {
          root: {
            borderRadius: radius.md,
            transition: "background-color 0.15s ease",
          },
        },
      },
      MuiToggleButton: {
        styleOverrides: {
          root: {
            textTransform: "none",
            fontWeight: 700,
            borderRadius: radius.sm,
            borderColor: colors.custom.border,
            "&.Mui-selected": {
              backgroundColor: alpha(colors.primary.main, isDark ? 0.24 : 0.12),
              color: colors.primary.main,
              "&:hover": {
                backgroundColor: alpha(colors.primary.main, isDark ? 0.3 : 0.18),
              },
            },
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            borderRadius: radius.sm,
            fontWeight: 600,
          },
          outlined: {
            borderColor: colors.custom.border,
          },
        },
      },
      MuiTextField: {
        defaultProps: { variant: "outlined" },
      },
      MuiInputLabel: {
        styleOverrides: {
          root: {
            color: colors.text.secondary,
            "&.Mui-focused": { color: colors.primary.main },
          },
        },
      },
      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            borderRadius: radius.md,
            backgroundColor: isDark ? alpha("#FFFFFF", 0.02) : colors.background.paper,
            transition: "box-shadow 0.15s ease, border-color 0.15s ease",
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: colors.custom.border,
            },
            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: colors.custom.borderStrong,
            },
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderColor: colors.primary.main,
              borderWidth: 2,
            },
            "&.Mui-focused": {
              boxShadow: `0 0 0 4px ${alpha(colors.primary.main, isDark ? 0.28 : 0.14)}`,
            },
            "&.Mui-error.Mui-focused": {
              boxShadow: `0 0 0 4px ${alpha(colors.error.main, isDark ? 0.3 : 0.15)}`,
            },
            "&.Mui-disabled": {
              backgroundColor: colors.action.disabledBackground,
            },
          },
          input: {
            "&::placeholder": {
              color: colors.text.secondary,
              opacity: 1,
            },
          },
        },
      },
      MuiFormHelperText: {
        styleOverrides: {
          root: { marginInlineStart: 4, marginInlineEnd: 4 },
        },
      },
      MuiSelect: {
        styleOverrides: {
          icon: { color: colors.text.secondary },
        },
      },
      MuiTable: {
        styleOverrides: {
          root: { borderCollapse: "separate", borderSpacing: 0 },
        },
      },
      MuiTableContainer: {
        styleOverrides: {
          root: {
            borderRadius: radius.lg,
            border: `1px solid ${colors.custom.border}`,
          },
        },
      },
      MuiTableHead: {
        styleOverrides: {
          root: {
            backgroundColor: colors.custom.surfaceSubtle,
          },
        },
      },
      MuiTableCell: {
        styleOverrides: {
          root: {
            borderBottom: `1px solid ${colors.custom.border}`,
            padding: "12px 16px",
            color: colors.text.primary,
          },
          head: {
            fontWeight: 700,
            fontSize: "0.8125rem",
            textTransform: "uppercase",
            letterSpacing: 0.4,
            color: colors.text.secondary,
            backgroundColor: colors.custom.surfaceSubtle,
          },
        },
      },
      MuiTableRow: {
        styleOverrides: {
          root: {
            "&:last-child td": { borderBottom: 0 },
            "&:hover": {
              backgroundColor: colors.action.hover,
            },
          },
        },
      },
      MuiTablePagination: {
        styleOverrides: {
          root: { color: colors.text.secondary },
        },
      },
      MuiTabs: {
        styleOverrides: {
          indicator: {
            height: 3,
            borderRadius: 3,
            backgroundColor: colors.primary.main,
          },
        },
      },
      MuiTab: {
        styleOverrides: {
          root: {
            textTransform: "none",
            fontWeight: 600,
            color: colors.text.secondary,
            "&.Mui-selected": { color: colors.primary.main },
          },
        },
      },
      MuiDialog: {
        styleOverrides: {
          paper: {
            borderRadius: radius.xl,
            border: `1px solid ${colors.custom.border}`,
            backgroundImage: "none",
          },
        },
      },
      MuiDialogTitle: {
        styleOverrides: {
          root: { fontWeight: 800, fontSize: "1.15rem" },
        },
      },
      MuiTooltip: {
        styleOverrides: {
          tooltip: {
            backgroundColor: isDark ? "#334155" : "#0F172A",
            color: "#F8FAFC",
            fontSize: "0.75rem",
            borderRadius: radius.sm,
            padding: "6px 10px",
          },
          arrow: {
            color: isDark ? "#334155" : "#0F172A",
          },
        },
      },
      MuiAlert: {
        styleOverrides: {
          root: { borderRadius: radius.md, alignItems: "center" },
          standardSuccess: {
            backgroundColor: alpha(colors.success.main, isDark ? 0.16 : 0.1),
            color: isDark ? colors.success.light : colors.success.dark,
          },
          standardError: {
            backgroundColor: alpha(colors.error.main, isDark ? 0.16 : 0.1),
            color: isDark ? colors.error.light : colors.error.dark,
          },
          standardWarning: {
            backgroundColor: alpha(colors.warning.main, isDark ? 0.16 : 0.12),
            color: isDark ? colors.warning.light : colors.warning.dark,
          },
          standardInfo: {
            backgroundColor: alpha(colors.info.main, isDark ? 0.16 : 0.1),
            color: isDark ? colors.info.light : colors.info.dark,
          },
        },
      },
      MuiDivider: {
        styleOverrides: {
          root: { borderColor: colors.custom.border },
        },
      },
      MuiListItemButton: {
        styleOverrides: {
          root: {
            borderRadius: radius.md,
            "&.Mui-selected": {
              backgroundColor: colors.action.selected,
              "&:hover": { backgroundColor: colors.action.selected },
            },
          },
        },
      },
      MuiAvatar: {
        styleOverrides: {
          root: { fontWeight: 700 },
        },
      },
      MuiSwitch: {
        styleOverrides: {
          switchBase: {
            "&.Mui-checked": { color: colors.primary.main },
            "&.Mui-checked + .MuiSwitch-track": {
              backgroundColor: colors.primary.main,
              opacity: 0.5,
            },
          },
        },
      },
      MuiCheckbox: {
        styleOverrides: {
          root: {
            color: colors.text.secondary,
            "&.Mui-checked": { color: colors.primary.main },
          },
        },
      },
      MuiRadio: {
        styleOverrides: {
          root: {
            color: colors.text.secondary,
            "&.Mui-checked": { color: colors.primary.main },
          },
        },
      },
      MuiLink: {
        styleOverrides: {
          root: {
            color: colors.primary.main,
            fontWeight: 600,
            textDecorationColor: alpha(colors.primary.main, 0.4),
          },
        },
      },
      MuiSkeleton: {
        styleOverrides: {
          root: {
            backgroundColor: isDark ? alpha("#FFFFFF", 0.08) : alpha("#0F172A", 0.08),
          },
        },
      },
      MuiPopover: {
        styleOverrides: {
          paper: {
            border: `1px solid ${colors.custom.border}`,
            borderRadius: radius.md,
            backgroundImage: "none",
          },
        },
      },
      MuiMenu: {
        styleOverrides: {
          paper: {
            border: `1px solid ${colors.custom.border}`,
            borderRadius: radius.md,
            backgroundImage: "none",
          },
        },
      },
    },
  });

  return theme;
};

export default createAppTheme;
