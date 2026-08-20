import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useTheme, alpha } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import Switch from "@mui/material/Switch";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import Avatar from "@mui/material/Avatar";
import Chip from "@mui/material/Chip";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import SchoolIcon from "@mui/icons-material/School";
import NotificationsIcon from "@mui/icons-material/Notifications";
import SecurityIcon from "@mui/icons-material/Security";
import StorageIcon from "@mui/icons-material/Storage";
import SaveIcon from "@mui/icons-material/Save";
import PersonIcon from "@mui/icons-material/Person";
import PaletteIcon from "@mui/icons-material/Palette";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import PaymentsIcon from "@mui/icons-material/Payments";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import { useThemeMode } from "../../../shared/context/ThemeContext";
import { ROLES } from "../../../shared/constants/roles";

function SettingSection({ icon, title, children }) {
  const theme = useTheme();
  return (
    <Card sx={{
      borderRadius: 3, boxShadow: "none",
      border: (t) => `2px solid ${alpha(t.palette.primary.main, 0.5)}`,
      p: 3, mb: 2.5,
      bgcolor: alpha(theme.palette.background.paper, 0.3),
      backdropFilter: "blur(24px)",
    }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2.5 }}>
        <Avatar sx={{ bgcolor: alpha(theme.palette.primary.main, 0.12), color: theme.palette.primary.main, width: 40, height: 40 }}>
          {icon}
        </Avatar>
        <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>{title}</Typography>
      </Box>
      {children}
    </Card>
  );
}

function SwitchRow({ label, checked, onChange }) {
  return (
    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", py: 0.5 }}>
      <Typography variant="body2">{label}</Typography>
      <Switch checked={checked} onChange={onChange} />
    </Box>
  );
}

const PAYMENT_METHOD_KEYS = {
  cash: "settings.accounting.cash",
  card: "settings.accounting.card",
  transfer: "settings.accounting.transfer",
};
const METHOD_ICONS = {
  cash: <PaymentsIcon />,
  card: <CreditCardIcon />,
  transfer: <AccountBalanceWalletIcon />,
};

const MONTH_KEYS = [
  "january", "february", "march", "april", "may", "june",
  "july", "august", "september", "october", "november", "december",
];

function MethodCard({ icon, label, enabled, onToggle }) {
  const theme = useTheme();
  return (
    <Card
      sx={{
        p: 2, borderRadius: 3, cursor: "pointer",
        border: "2px solid",
        borderColor: enabled ? alpha(theme.palette.success.main, 0.6) : alpha(theme.palette.divider, 0.5),
        bgcolor: enabled ? alpha(theme.palette.success.main, 0.04) : "transparent",
        transition: "all 0.2s",
        "&:hover": { borderColor: theme.palette.primary.main },
        display: "flex", alignItems: "center", gap: 1.5,
      }}
      onClick={onToggle}
    >
      <Box sx={{ color: enabled ? "success.main" : "text.disabled", display: "flex" }}>{icon}</Box>
      <Box sx={{ flex: 1 }}>
        <Typography variant="body2" sx={{ fontWeight: 600 }}>{label}</Typography>
      </Box>
      <Switch checked={enabled} size="small" />
    </Card>
  );
}

export default function SettingsPage() {
  const { t } = useTranslation();
  const theme = useTheme();
  const user = useSelector((state) => state.auth.user);
  const { mode } = useThemeMode();
  const [snack, setSnack] = useState({ open: false, message: "" });

  const isAdmin = user?.role === ROLES.ADMIN;
  const isSupervisor = user?.role === ROLES.SUPERVISION;
  const isAccountant = user?.role === ROLES.ACCOUNTING;

  const [settings, setSettings] = useState({
    schoolName: t("app.name"),
    academicYear: "2025-2026",
    sessionTimeout: "30",
    maxLoginAttempts: "5",
    passwordMinLength: "8",
    enableNotifications: true,
    enableEmailAlerts: true,
    enableAutoBackup: false,
    maintenanceMode: false,
    supervisorPhone: user?.phone || "",
    supervisorBio: "",
    enabledMethods: { cash: true, card: true, transfer: true },
    invoicePrefix: "INV",
    defaultPaymentTerms: "30",
    lateFeePercent: "2",
    enableAutoReceipt: true,
    enableVat: false,
    vatPercent: "15",
    fiscalYearStart: "01",
    currencySymbol: "₪",
    enableReceiptPrinting: true,
    enableSmsNotifications: false,
    reminderBeforeDue: "7",
  });

  const handleChange = (key) => (e) => {
    const value = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleToggleMethod = (id) => {
    setSettings((prev) => ({
      ...prev,
      enabledMethods: { ...prev.enabledMethods, [id]: !prev.enabledMethods[id] },
    }));
  };

  const handleSave = () => {
    setSnack({ open: true, message: t("settings.saved") });
  };

  const headerIcon = isAdmin ? <AdminPanelSettingsIcon /> : isSupervisor ? <PersonIcon /> : <AccountBalanceWalletIcon />;
  const headerDesc = isAccountant ? t("settings.accounting.subtitle") : t("settings.subtitle");

  return (
    <Box>
      {/* ─── Header ─── */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
        <Avatar sx={{ bgcolor: alpha(theme.palette.primary.main, 0.12), color: "primary.main", width: 48, height: 48 }}>
          {headerIcon}
        </Avatar>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 800 }}>{t("settings.title")}</Typography>
          <Typography variant="body2" color="text.secondary">{headerDesc}</Typography>
        </Box>
      </Box>

      {/* ─── Admin Settings ─── */}
      {isAdmin && (
        <>
          <SettingSection icon={<SchoolIcon />} title={t("settings.general")}>
            <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 2 }}>
              <TextField label={t("settings.schoolName")} value={settings.schoolName}
                onChange={handleChange("schoolName")} size="small" />
              <TextField label={t("settings.academicYear")} value={settings.academicYear}
                onChange={handleChange("academicYear")} size="small" />
            </Box>
          </SettingSection>

          <SettingSection icon={<SecurityIcon />} title={t("settings.security")}>
            <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 2 }}>
              <TextField label={t("settings.sessionTimeout")} value={settings.sessionTimeout}
                onChange={handleChange("sessionTimeout")} size="small" type="number" />
              <TextField label={t("settings.maxLoginAttempts")} value={settings.maxLoginAttempts}
                onChange={handleChange("maxLoginAttempts")} size="small" type="number" />
              <TextField label={t("settings.passwordMinLength")} value={settings.passwordMinLength}
                onChange={handleChange("passwordMinLength")} size="small" type="number" />
            </Box>
          </SettingSection>

          <SettingSection icon={<StorageIcon />} title={t("settings.system")}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              <SwitchRow label={t("settings.enableAutoBackup")} checked={settings.enableAutoBackup}
                onChange={handleChange("enableAutoBackup")} />
              <Divider />
              <SwitchRow label={t("settings.maintenanceMode")} checked={settings.maintenanceMode}
                onChange={handleChange("maintenanceMode")} />
            </Box>
          </SettingSection>
        </>
      )}

      {/* ─── Supervisor Settings ─── */}
      {isSupervisor && (
        <SettingSection icon={<PersonIcon />} title={t("settings.profile")}>
          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 2 }}>
            <TextField label={t("common.name")} value={user?.name || ""} size="small" slotProps={{ input: { readOnly: true } }} />
            <TextField label={t("common.email")} value={user?.email || ""} size="small" slotProps={{ input: { readOnly: true } }} />
            <TextField label={t("settings.supervisorPhone")} value={settings.supervisorPhone}
              onChange={handleChange("supervisorPhone")} size="small" />
            <TextField label={t("settings.supervisorBio")} value={settings.supervisorBio}
              onChange={handleChange("supervisorBio")} size="small" multiline rows={2} />
          </Box>
        </SettingSection>
      )}

      {/* ─── Accountant Settings ─── */}
      {isAccountant && (
        <>
          {/* Payment Methods */}
          <SettingSection icon={<PaymentsIcon />} title={t("settings.accounting.paymentMethods")}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              {t("settings.accounting.paymentMethodsDesc")}
            </Typography>
            <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr 1fr" }, gap: 1.5 }}>
              {Object.entries(PAYMENT_METHOD_KEYS).map(([id, key]) => (
                <MethodCard
                  key={id}
                  icon={METHOD_ICONS[id]}
                  label={t(key)}
                  enabled={settings.enabledMethods[id]}
                  onToggle={() => handleToggleMethod(id)}
                />
              ))}
            </Box>
            <Box sx={{ mt: 2, display: "flex", gap: 1, flexWrap: "wrap" }}>
              {Object.entries(PAYMENT_METHOD_KEYS).filter(([id]) => settings.enabledMethods[id]).map(([id, key]) => (
                <Chip key={id} icon={METHOD_ICONS[id]} label={t(key)} color="success" size="small" variant="outlined" sx={{ fontWeight: 600 }} />
              ))}
              {Object.entries(PAYMENT_METHOD_KEYS).filter(([id]) => !settings.enabledMethods[id]).map(([id, key]) => (
                <Chip key={id} icon={METHOD_ICONS[id]} label={t(key)} size="small" variant="outlined" disabled sx={{ fontWeight: 600 }} />
              ))}
            </Box>
          </SettingSection>

          {/* Invoice Settings */}
          <SettingSection icon={<ReceiptLongIcon />} title={t("settings.accounting.invoiceSettings")}>
            <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 2 }}>
              <TextField label={t("settings.accounting.invoicePrefix")} value={settings.invoicePrefix}
                onChange={handleChange("invoicePrefix")} size="small"
                helperText={t("settings.accounting.invoicePrefixHint")} />
              <FormControl size="small">
                <InputLabel>{t("settings.accounting.defaultPaymentTerms")}</InputLabel>
                <Select value={settings.defaultPaymentTerms} label={t("settings.accounting.defaultPaymentTerms")}
                  onChange={handleChange("defaultPaymentTerms")}>
                  {[15, 30, 45, 60].map((n) => (
                    <MenuItem key={n} value={String(n)}>{n} {n === 1 ? t("settings.accounting.day") : t("settings.accounting.days")}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField label={t("settings.accounting.lateFeePercent")} value={settings.lateFeePercent}
                onChange={handleChange("lateFeePercent")} size="small" type="number"
                helperText={t("settings.accounting.lateFeeHint")} />
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, alignSelf: "center" }}>
                <Switch checked={settings.enableVat} onChange={handleChange("enableVat")} />
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>{t("settings.accounting.enableVat")}</Typography>
                  <Typography variant="caption" color="text.secondary">{t("settings.accounting.vatHint")}</Typography>
                </Box>
              </Box>
              {settings.enableVat && (
                <TextField label={t("settings.accounting.vatPercent")} value={settings.vatPercent}
                  onChange={handleChange("vatPercent")} size="small" type="number" />
              )}
            </Box>
          </SettingSection>

          {/* Financial Preferences */}
          <SettingSection icon={<AccountBalanceWalletIcon />} title={t("settings.accounting.financialPreferences")}>
            <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 2 }}>
              <TextField label={t("settings.accounting.currencySymbol")} value={settings.currencySymbol}
                onChange={handleChange("currencySymbol")} size="small"
                slotProps={{ input: { startAdornment: <Box component="span" sx={{ ml: 0.5 }}>🪙</Box> } }} />
              <FormControl size="small">
                <InputLabel>{t("settings.accounting.fiscalYearStart")}</InputLabel>
                <Select value={settings.fiscalYearStart} label={t("settings.accounting.fiscalYearStart")}
                  onChange={handleChange("fiscalYearStart")}>
                  {MONTH_KEYS.map((mk, i) => {
                    const v = String(i + 1).padStart(2, "0");
                    return (
                      <MenuItem key={v} value={v}>{t(`settings.accounting.${mk}`)}</MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
            </Box>
            <Divider sx={{ my: 2 }} />
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              <SwitchRow label={t("settings.accounting.autoPrintReceipt")}
                checked={settings.enableReceiptPrinting}
                onChange={handleChange("enableReceiptPrinting")} />
              <Divider />
              <SwitchRow label={t("settings.accounting.enableSms")}
                checked={settings.enableSmsNotifications}
                onChange={handleChange("enableSmsNotifications")} />
              <Divider />
              <Box sx={{ display: "flex", alignItems: "center", gap: 2, py: 0.5 }}>
                <Typography variant="body2">{t("settings.accounting.reminderBefore")}</Typography>
                <FormControl size="small" sx={{ minWidth: 100 }}>
                  <Select value={settings.reminderBeforeDue}
                    onChange={handleChange("reminderBeforeDue")}>
                    <MenuItem value="3">{t("settings.accounting.reminder3")}</MenuItem>
                    <MenuItem value="5">{t("settings.accounting.reminder5")}</MenuItem>
                    <MenuItem value="7">{t("settings.accounting.reminder7")}</MenuItem>
                    <MenuItem value="14">{t("settings.accounting.reminder14")}</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </Box>
          </SettingSection>

          {/* Profile Info */}
          <SettingSection icon={<PersonIcon />} title={t("settings.accounting.userInfo")}>
            <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 2 }}>
              <TextField label={t("common.name")} value={user?.name || ""} size="small" slotProps={{ input: { readOnly: true } }} />
              <TextField label={t("common.email")} value={user?.email || ""} size="small" slotProps={{ input: { readOnly: true } }} />
              <TextField label={t("settings.accounting.phone")} value={user?.phone || ""} size="small" slotProps={{ input: { readOnly: true } }} />
              <TextField label={t("settings.accounting.department")} value={user?.department || ""} size="small" slotProps={{ input: { readOnly: true } }} />
            </Box>
          </SettingSection>
        </>
      )}

      {/* ─── Shared Settings (all roles) ─── */}
      <SettingSection icon={<NotificationsIcon />} title={t("settings.notifications")}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
          <SwitchRow label={t("settings.enableNotifications")} checked={settings.enableNotifications}
            onChange={handleChange("enableNotifications")} />
          <Divider />
          <SwitchRow label={t("settings.enableEmailAlerts")} checked={settings.enableEmailAlerts}
            onChange={handleChange("enableEmailAlerts")} />
        </Box>
      </SettingSection>

      <SettingSection icon={<PaletteIcon />} title={t("settings.appearance")}>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          {t("settings.themeMode")}: {mode === "dark" ? t("theme.dark") : t("theme.light")}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {t("settings.themeSwitchHint")}
        </Typography>
      </SettingSection>

      <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 1 }}>
        <Button variant="contained" startIcon={<SaveIcon />} onClick={handleSave}
          sx={{ borderRadius: 2, px: 4, py: 1 }}>
          {t("common.saveChanges")}
        </Button>
      </Box>

      <Snackbar open={snack.open} autoHideDuration={3000}
        onClose={() => setSnack({ open: false, message: "" })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}>
        <Alert severity="success" variant="filled" sx={{ borderRadius: 2 }}>{snack.message}</Alert>
      </Snackbar>
    </Box>
  );
}
