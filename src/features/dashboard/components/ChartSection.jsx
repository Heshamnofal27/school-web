import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useTheme, alpha } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import Skeleton from "@mui/material/Skeleton";
// ⚠️ إصلاح تعطّل ApexCharts (Cannot read properties of null (reading 'node')):
// السبب الجذري كان "lazy loading مزدوج" — Home.jsx يحمّل ChartSection.jsx بشكل
// كسول (lazy) عبر Suspense، وكان ChartSection.jsx نفسه يعيد تحميل مكتبة
// react-apexcharts بشكل كسول مرة أخرى مع Suspense داخلي منفصل. هذا التداخل بين
// حدّي Suspense كان يجعل React يُبدّل الرسم البياني (Chart) بين حالة
// التحميل/الجاهزية بشكل متكرر أثناء إعادة الرسم الأولى، فتُطلق ApexCharts رسمة
// (animateDraw/runMaskReveal) عبر requestAnimationFrame تشير إلى عنصر DOM تمّت
// إزالته بالفعل قبل اكتمال الرسم → استثناء "Cannot read properties of null".
// الحل: استيراد المكتبة مباشرة هنا (بدون lazy/Suspense داخلي إضافي) — التحميل
// الكسول يبقى مطبّقاً مرة واحدة فقط على مستوى ChartSection من Home.jsx، وتعطيل
// الأنيميشن الأولي للرسوم البيانية (animations.enabled:false) لتفادي أي سباق
// مشابه محتمل بين requestAnimationFrame وعملية إلغاء تركيب المكوّن (unmount).
import Chart from "react-apexcharts";

export default function ChartSection({ stats }) {
  const { t } = useTranslation();
  const theme = useTheme();

  const isDark = theme.palette.mode === "dark";
  const textColor = theme.palette.text.secondary;
  const gridColor = theme.palette.divider;

  const base = useMemo(() => ({
    chart: {
      toolbar: { show: false },
      zoom: { enabled: false },
      fontFamily: theme.typography.fontFamily,
      foreColor: textColor,
      background: "transparent",
    },
    grid: { borderColor: gridColor, strokeDashArray: 4, padding: { left: 0, right: 0 } },
    tooltip: { theme: isDark ? "dark" : "light", style: { fontSize: "13px" } },
    dataLabels: { enabled: false },
    states: {
      hover: { filter: { type: "darken", value: 0.1 } },
      active: { filter: { type: "none" } },
    },
    animations: {
      // مُعطّلة عمداً لتفادي عطل ApexCharts عند تبديل/إزالة المكوّن أثناء الرسم (راجع التعليق أعلى الملف)
      enabled: false,
    },
  }), [theme, textColor, gridColor, isDark]);

  const donutCommon = useMemo(() => {
    const merged = {
      ...base,
      chart: { ...base.chart, type: "donut" },
      plotOptions: {
        pie: {
          donut: {
            size: "68%",
            labels: {
              show: true,
              total: {
                show: true,
                label: t("dashboard.totalUsersChart"),
                fontSize: "14px",
                fontWeight: 600,
                color: textColor,
              },
            },
          },
        },
      },
      dataLabels: {
        enabled: true,
        style: { fontSize: "12px", fontWeight: 600 },
        dropShadow: { enabled: false },
      },
      legend: {
        position: "bottom",
        fontSize: "13px",
        fontWeight: 500,
        itemMargin: { horizontal: 12, vertical: 4 },
      },
      stroke: { show: false },
      fill: {
        type: "gradient",
        gradient: {
          shade: "light",
          type: "vertical",
          shadeIntensity: 0.2,
          opacityFrom: 0.95,
          opacityTo: 0.75,
        },
      },
      responsive: [{
        breakpoint: 480,
        options: {
          legend: { position: "bottom", fontSize: "11px" },
          dataLabels: { enabled: false },
        },
      }],
    };
    return merged;
  }, [base, textColor, t]);

  const usersByType = useMemo(() => {
    if (!stats?.users?.byType) return null;
    const entries = Object.entries(stats.users.byType);
    return {
      categories: entries.map(([k]) => t(`userTypes.${k}`, k)),
      data: entries.map(([, v]) => v),
    };
  }, [stats, t]);

  const emailPieSeries = useMemo(() => {
    if (!stats?.emails) return [];
    return [stats.emails.pending, stats.emails.used];
  }, [stats]);

  const emailPieLabels = useMemo(() => {
    return [t("dashboard.emailStatusPending"), t("dashboard.emailStatusUsed")];
  }, [t]);

  const userDonutSeries = useMemo(() => {
    if (!usersByType) return [];
    return usersByType.data;
  }, [usersByType]);

  const userDonutLabels = useMemo(() => {
    if (!usersByType) return [];
    return usersByType.categories;
  }, [usersByType]);

  const emailDonutOptions = useMemo(() => ({
    ...donutCommon,
    colors: [theme.palette.primary.main, theme.palette.success.main, theme.palette.error.main],
    labels: emailPieLabels,
    plotOptions: {
      pie: {
        donut: {
          ...donutCommon.plotOptions.pie.donut,
          labels: {
            ...donutCommon.plotOptions.pie.donut.labels,
            total: { ...donutCommon.plotOptions.pie.donut.labels.total, label: t("dashboard.emailStatus") },
          },
        },
      },
    },
  }), [donutCommon, theme, emailPieLabels, t]);



  const userDonutOptions = useMemo(() => {
    const p = [
      theme.palette.primary.main,
      theme.palette.secondary.main,
      theme.palette.success.main,
      theme.palette.warning.main,
      theme.palette.error.main,
    ];
    return {
      ...donutCommon,
      colors: p,
      labels: userDonutLabels,
      plotOptions: {
        pie: {
          donut: {
            ...donutCommon.plotOptions.pie.donut,
            labels: {
              ...donutCommon.plotOptions.pie.donut.labels,
              total: { ...donutCommon.plotOptions.pie.donut.labels.total, label: t("dashboard.totalUsersChart") },
            },
          },
        },
      },
    };
  }, [donutCommon, userDonutLabels, t, theme]);

  const growthCategories = useMemo(() => {
    if (!stats?.studentGrowth) return [];
    return stats.studentGrowth.map((g) => t(`dashboard.months.${g.month}`, g.month));
  }, [stats, t]);

  const growthSeries = useMemo(() => {
    if (!stats?.studentGrowth) return [];
    return [{
      name: t("dashboard.studentGrowthLabel"),
      data: stats.studentGrowth.map((g) => g.count),
    }];
  }, [stats, t]);

  const areaOptions = useMemo(() => ({
    chart: {
      type: "area",
      toolbar: { show: false },
      zoom: { enabled: false },
      fontFamily: theme.typography.fontFamily,
      foreColor: textColor,
      background: "transparent",
    },
    grid: { borderColor: gridColor, strokeDashArray: 4, padding: { left: 0, right: 0 } },
    tooltip: { theme: isDark ? "dark" : "light", style: { fontSize: "13px" } },
    dataLabels: { enabled: false },
    xaxis: {
      categories: growthCategories,
      labels: { style: { colors: textColor, fontSize: "12px" } },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      labels: { style: { colors: textColor, fontSize: "12px" } },
    },
    stroke: { curve: "smooth", width: 2 },
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 0.4,
        opacityFrom: 0.7,
        opacityTo: 0.1,
        stops: [0, 90, 100],
      },
    },
    colors: [theme.palette.primary.main],
    markers: { size: 4, hover: { size: 6 } },
    legend: { show: false },
    animations: {
      // مُعطّلة عمداً لتفادي عطل ApexCharts عند تبديل/إزالة المكوّن أثناء الرسم (راجع التعليق أعلى الملف)
      enabled: false,
    },
  }), [theme, textColor, gridColor, isDark, growthCategories]);

  const evalAxes = useMemo(() => {
    if (!stats?.evaluation) return [];
    return stats.evaluation.axes.map((a) => t(`dashboard.evalAxes.${a}`, a));
  }, [stats, t]);

  const evalSeries = useMemo(() => {
    if (!stats?.evaluation) return [];
    return [
      { name: t("dashboard.evalParents"), data: stats.evaluation.parents },
      { name: t("dashboard.evalStudents"), data: stats.evaluation.students },
    ];
  }, [stats, t]);

  const radarOptions = useMemo(() => ({
    chart: {
      type: "radar",
      toolbar: { show: false },
      fontFamily: theme.typography.fontFamily,
      foreColor: textColor,
      background: "transparent",
    },
    xaxis: {
      categories: evalAxes,
      labels: { style: { colors: textColor, fontSize: "12px", fontWeight: 500 } },
    },
    yaxis: {
      labels: { style: { colors: textColor, fontSize: "11px" } },
      min: 0,
      max: 100,
      tickAmount: 5,
    },
    stroke: { width: 2 },
    fill: { opacity: 0.15 },
    markers: { size: 4 },
    colors: [theme.palette.primary.main, theme.palette.secondary.main],
    legend: {
      position: "bottom",
      fontSize: "13px",
      fontWeight: 500,
      itemMargin: { horizontal: 16 },
    },
    tooltip: { theme: isDark ? "dark" : "light", style: { fontSize: "13px" } },
    plotOptions: {
      radar: {
        polygons: {
          strokeColor: gridColor,
          fill: { colors: ["transparent", "transparent"] },
          connectorColors: gridColor,
        },
      },
    },
    animations: {
      // مُعطّلة عمداً لتفادي عطل ApexCharts عند تبديل/إزالة المكوّن أثناء الرسم (راجع التعليق أعلى الملف)
      enabled: false,
    },
  }), [theme, textColor, gridColor, isDark, evalAxes]);

  // حارس إضافي: لا داعٍ لمحاولة رسم أي شيء قبل اكتمال جلب الإحصائيات أصلاً
  if (!stats) {
    return (
      <Box sx={{ mt: 3 }}>
        <Skeleton variant="rounded" width="100%" height={300} sx={{ borderRadius: 3, mb: 2.5 }} />
        <Skeleton variant="rounded" width="100%" height={320} sx={{ borderRadius: 3 }} />
      </Box>
    );
  }

  return (
    <Box sx={{ mt: 3 }}>
      <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2 }}>
        {t("dashboard.chartsTitle")}
      </Typography>
      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" }, gap: 2.5, mb: 2.5 }}>
        <Card sx={(th) => ({ borderRadius: 3, boxShadow: "none", border: `2px solid ${alpha(th.palette.primary.main, 0.5)}`, p: 2, bgcolor: alpha(th.palette.background.paper, 0.3), backdropFilter: "blur(24px)" })}>
          <Typography variant="body2" sx={{ fontWeight: 600, mb: 1.5 }}>
            {t("dashboard.emailStatus")}
          </Typography>
          {emailPieSeries.length > 0 ? (
            <Chart options={emailDonutOptions} series={emailPieSeries} type="donut" height={300} />
          ) : (
            <Skeleton variant="rounded" width="100%" height={300} sx={{ borderRadius: 2 }} />
          )}
        </Card>

        <Card sx={(th) => ({ borderRadius: 3, boxShadow: "none", border: `2px solid ${alpha(th.palette.primary.main, 0.5)}`, p: 2, bgcolor: alpha(th.palette.background.paper, 0.3), backdropFilter: "blur(24px)" })}>
          <Typography variant="body2" sx={{ fontWeight: 600, mb: 1.5 }}>
            {t("dashboard.totalUsersChart")}
          </Typography>
          {userDonutSeries.length > 0 ? (
            <Chart options={userDonutOptions} series={userDonutSeries} type="donut" height={300} />
          ) : (
            <Skeleton variant="rounded" width="100%" height={300} sx={{ borderRadius: 2 }} />
          )}
        </Card>
      </Box>

      <Card sx={(th) => ({ borderRadius: 3, boxShadow: "none", border: `2px solid ${alpha(th.palette.primary.main, 0.5)}`, p: 2, mb: 2.5, bgcolor: alpha(th.palette.background.paper, 0.55), backdropFilter: "blur(14px)" })}>
        <Typography variant="body2" sx={{ fontWeight: 600, mb: 1.5 }}>
          {t("dashboard.studentGrowth")}
        </Typography>
        {growthSeries.length > 0 ? (
          <Chart options={areaOptions} series={growthSeries} type="area" height={320} />
        ) : (
          <Skeleton variant="rounded" width="100%" height={320} sx={{ borderRadius: 2 }} />
        )}
      </Card>

      <Card sx={(th) => ({ borderRadius: 3, boxShadow: "none", border: `2px solid ${alpha(th.palette.primary.main, 0.5)}`, p: 2, bgcolor: alpha(th.palette.background.paper, 0.3), backdropFilter: "blur(24px)" })}>
        <Typography variant="body2" sx={{ fontWeight: 600, mb: 1.5 }}>
          {t("dashboard.schoolEvaluation")}
        </Typography>
        {evalSeries.length > 0 ? (
          <Chart options={radarOptions} series={evalSeries} type="radar" height={350} />
        ) : (
          <Skeleton variant="rounded" width="100%" height={350} sx={{ borderRadius: 2 }} />
        )}
      </Card>
    </Box>
  );
}
