import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import { usePublicData } from "../hooks/usePublicData";
import {
  Accessibility,
  BadgePercent,
  Bot,
  Building2,
  CalendarClock,
  CreditCard,
  Droplets,
  FileCog,
  Languages,
  Route,
  Scale,
  Sun,
  Type,
  Wind,
} from "lucide-react";

const AttractScreen = () => {
  const navigate = useNavigate();
  const { t, language, changeLanguage } = useLanguage();
  const [now, setNow] = useState(() => new Date());
  const [schemeIndex, setSchemeIndex] = useState(0);
  const [isAccessibilityPanelOpen, setAccessibilityPanelOpen] = useState(false);
  const [textScale, setTextScale] = useState("default");

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const fallbackSchemes = useMemo(
    () => [
      { title: t("pmKusum"), detail: t("pmKusumDetail") },
      { title: t("digitalIndia"), detail: t("digitalIndiaDetail") },
      { title: t("jalJeevan"), detail: t("jalJeevanDetail") },
      { title: t("ayushmanBharat"), detail: t("ayushmanBharatDetail") },
    ],
    [language, t],
  );

  const { schemes, loading: schemesLoading } = usePublicData();
  const displaySchemes = useMemo(() => {
    if (Array.isArray(schemes) && schemes.length) {
      return schemes.map((s) => ({ title: s.title, detail: s.description }));
    }
    return fallbackSchemes;
  }, [schemes, fallbackSchemes]);

  useEffect(() => {
    const interval = setInterval(() => {
      setSchemeIndex((prev) => (prev + 1) % displaySchemes.length);
    }, 60000);
    return () => clearInterval(interval);
  }, [displaySchemes.length]);

  const startSession = () => navigate("/language");
  const goToAccessibility = () => navigate("/accessibility");

  const handleTileSelect = (tileKey) => {
    if (tileKey === "accessibility") {
      goToAccessibility();
      return;
    }
    startSession();
  };

  const stats = [
    {
      label: t("currentTime"),
      primary: now.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      secondary: `${t("todayLabel")} · ${now.toLocaleDateString([], {
        weekday: "long",
        day: "numeric",
        month: "long",
      })}`,
      icon: CalendarClock,
    },
  ];

  const serviceTiles = [
    {
      key: "accessibility",
      label: t("accessibilitySuite"),
      description: t("accessibilityDetail"),
      icon: Accessibility,
      accent: "from-secondary to-secondary/70",
    },
    {
      key: "ai-mode",
      label: t("aiMode"),
      description: t("aiModeDetail"),
      icon: Bot,
      accent: "from-primary to-primary-hover",
    },
    {
      key: "schemes",
      label: t("govSchemeHighlight"),
      description: t("govSchemeDetailShort"),
      icon: BadgePercent,
      accent: "from-accent to-orange-400",
    },
    {
      key: "bills",
      label: t("billPayment"),
      description: t("billPaymentsDetail"),
      icon: CreditCard,
      accent: "from-sky-500 to-blue-500",
    },
    {
      key: "service-requests",
      label: t("services"),
      description: t("serviceRequestsDetail"),
      icon: FileCog,
      accent: "from-emerald-500 to-green-500",
    },
    {
      key: "tracking",
      label: t("trackingAndComplaints"),
      description: t("trackingAndComplaintsDetail"),
      icon: Route,
      accent: "from-cyan-500 to-blue-600",
    },
    {
      key: "tariff",
      label: t("tariffPolicy"),
      description: t("tariffPolicyDetail"),
      icon: Scale,
      accent: "from-purple-600 to-indigo-600",
    },
    {
      key: "new-connection",
      label: t("newConnection"),
      description: t("newConnectionDetail"),
      icon: Building2,
      accent: "from-pink-500 to-rose-500",
    },
  ];

  const forecast = [
    { label: t("forecastMorning"), temp: "31°C", meta: t("uvIndexModerate") },
    {
      label: t("forecastAfternoon"),
      temp: "34°C",
      meta: `${t("windSpeedLabel")}: 12 km/h`,
    },
    {
      label: t("forecastEvening"),
      temp: "29°C",
      meta: `${t("humidity")}: 48%`,
    },
  ];

  const currentScheme = displaySchemes[schemeIndex];
  const textScaleClasses = {
    default: "text-base",
    large: "text-lg",
    xlarge: "text-xl",
  };
  const resolvedTextScaleClass =
    textScaleClasses[textScale] ?? textScaleClasses.default;
  const textScaleMultipliers = {
    default: 1,
    large: 1.15,
    xlarge: 1.3,
  };
  const getScaledFontSize = (baseRem) =>
    `${(baseRem ?? 1) * textScaleMultipliers[textScale]}rem`;

  const languageShortcuts = [
    { code: "en", label: "English" },
    { code: "hi", label: "हिन्दी" },
    { code: "ta", label: "தமிழ்" },
    { code: "te", label: "తెలుగు" },
    { code: "pa", label: "ਪੰਜਾਬੀ" },
    { code: "bn", label: "বাংলা" },
  ];

  const textScaleOptions = [
    { key: "default", label: t("defaultTextSize") },
    { key: "large", label: t("largeTextSize") },
    { key: "xlarge", label: t("extraLargeTextSize") },
  ];

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`relative h-screen w-full overflow-hidden text-white ${resolvedTextScaleClass}`}
    >
      <div className="absolute inset-0">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1526404079166-0b9da4054862?auto=format&fit=crop&w=1600&q=80')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-primary/80 to-primary-hover/80" />
      </div>

      <div className="relative z-10 mx-auto flex h-full w-full max-w-7xl flex-col gap-5 px-5 py-6 md:px-10">
        <div className="grid flex-1 gap-5 overflow-hidden xl:grid-cols-[0.32fr_0.68fr]">
          <section className="flex flex-col gap-4 rounded-[28px] border border-white/10 bg-white/10 p-4 shadow-2xl backdrop-blur">
            <div className="grid gap-4">
              {stats.map((stat) => {
                const Icon = stat.icon;
                return (
                  <div
                    key={stat.label}
                    className="rounded-2xl border border-white/10 bg-black/15 p-4"
                  >
                    <div className="flex items-start gap-3">
                      <div className="rounded-2xl bg-white/10 p-3">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <p
                          className="text-xs uppercase tracking-wide text-white/70"
                          style={{ fontSize: getScaledFontSize(0.75) }}
                        >
                          {stat.label}
                        </p>
                        <p
                          className="text-3xl font-semibold text-white"
                          style={{ fontSize: getScaledFontSize(1.875) }}
                        >
                          {stat.primary}
                        </p>
                        <p
                          className="text-sm text-white/70"
                          style={{ fontSize: getScaledFontSize(0.875) }}
                        >
                          {stat.secondary}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
              <div className="flex items-center gap-3">
                <Sun className="h-5 w-5 text-amber-300" />
                <p
                  className="text-sm font-semibold uppercase tracking-wide text-white"
                  style={{ fontSize: getScaledFontSize(0.875) }}
                >
                  {t("cityWeather")}
                </p>
              </div>
              <p
                className="mt-3 text-4xl font-bold"
                style={{ fontSize: getScaledFontSize(2.25) }}
              >
                32°C
              </p>
              <p
                className="text-white/80"
                style={{ fontSize: getScaledFontSize(0.875) }}
              >
                {t("weatherConditionClear")}
              </p>
              <div className="mt-4 flex flex-wrap gap-4 text-sm text-white/80">
                <span
                  className="flex items-center gap-2"
                  style={{ fontSize: getScaledFontSize(0.875) }}
                >
                  <Droplets className="h-4 w-4" /> {t("humidity")}: 46%
                </span>
                <span
                  className="flex items-center gap-2"
                  style={{ fontSize: getScaledFontSize(0.875) }}
                >
                  <Wind className="h-4 w-4" /> {t("airQuality")}: AQI 42
                </span>
              </div>
              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                {forecast.map((slot) => (
                  <div
                    key={slot.label}
                    className="rounded-xl border border-white/10 bg-white/5 p-3 text-sm"
                  >
                    <p
                      className="text-xs uppercase tracking-wide text-white/70"
                      style={{ fontSize: getScaledFontSize(0.75) }}
                    >
                      {slot.label}
                    </p>
                    <p
                      className="text-xl font-semibold"
                      style={{ fontSize: getScaledFontSize(1.25) }}
                    >
                      {slot.temp}
                    </p>
                    <p
                      className="text-white/70"
                      style={{ fontSize: getScaledFontSize(0.75) }}
                    >
                      {slot.meta}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[24px] border border-white/15 bg-white/10 p-5 shadow-2xl backdrop-blur">
              <div className="flex items-center gap-3">
                <BadgePercent className="h-8 w-8 text-accent" />
                <div>
                  <p
                    className="text-sm uppercase tracking-wide text-white/70"
                    style={{ fontSize: getScaledFontSize(0.875) }}
                  >
                    {t("govSchemeHighlight")}
                  </p>
                  <p
                    className="text-xl font-bold text-white"
                    style={{ fontSize: getScaledFontSize(1.25) }}
                  >
                    {t("govSchemeDetail")}
                  </p>
                </div>
              </div>
              <p
                className="mt-4 text-xl font-semibold text-white"
                style={{ fontSize: getScaledFontSize(1.25) }}
              >
                {currentScheme.title}
              </p>
              <p
                className="mt-2 text-white/85"
                style={{ fontSize: getScaledFontSize(0.875) }}
              >
                {currentScheme.detail}
              </p>
              <p
                className="mt-4 text-xs uppercase tracking-[0.3em] text-white/60"
                style={{ fontSize: getScaledFontSize(0.75) }}
              >
                {t("featuredSchemes")}
              </p>
            </div>
          </section>

          <section className="flex flex-col rounded-[28px] border border-white/10 bg-white/10 p-4 shadow-2xl backdrop-blur">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p
                  className="text-base font-semibold uppercase tracking-[0.45em] text-white/80"
                  style={{ fontSize: getScaledFontSize(1) }}
                >
                  {t("serviceGridTitle")}
                </p>
                <h2
                  className="text-3xl font-bold text-white"
                  style={{ fontSize: getScaledFontSize(1.875) }}
                >
                  {t("smartCityCivicServices")}
                </h2>
              </div>
              <button
                type="button"
                onClick={startSession}
                className="inline-flex items-center justify-center rounded-full border border-white/25 bg-white/20 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-white/30 shadow-lg"
              >
                {t("touchToStart")}
              </button>
            </div>

            <div className="mt-2 rounded-2xl border border-white/10 bg-black/20 p-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p
                    className="text-xs uppercase tracking-[0.4em] text-white/70"
                    style={{ fontSize: getScaledFontSize(0.75) }}
                  >
                    {t("languageShortcutTitle")}
                  </p>
                  <p
                    className="text-sm text-white/70"
                    style={{ fontSize: getScaledFontSize(0.875) }}
                  >
                    {t("languageShortcutHelper")}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {languageShortcuts.map((option) => (
                    <button
                      type="button"
                      key={option.code}
                      onClick={() => changeLanguage(option.code)}
                      className={`rounded-full border px-3 py-1 text-xs font-semibold transition ${
                        language === option.code
                          ? "border-white bg-white/30 text-gray-900"
                          : "border-white/40 bg-white/10 text-white"
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-5 grid flex-1 grid-cols-2 gap-4 xl:grid-cols-2">
              {serviceTiles.map((tile) => {
                const Icon = tile.icon;
                return (
                  <button
                    type="button"
                    key={tile.key}
                    onClick={() => handleTileSelect(tile.key)}
                    className="group flex h-full min-h-[150px] flex-col rounded-3xl border border-white/10 bg-black/25 p-4 text-left transition hover:border-white/40 hover:-translate-y-0.5"
                  >
                    <div
                      className={`inline-flex rounded-2xl bg-gradient-to-br ${tile.accent} p-3 text-white shadow-lg`}
                    >
                      <Icon className="h-6 w-6" />
                    </div>
                    <p
                      className="mt-3 text-lg font-semibold text-white"
                      style={{ fontSize: getScaledFontSize(1.1) }}
                    >
                      {tile.label}
                    </p>
                    <p
                      className="mt-1 text-sm text-white/75"
                      style={{ fontSize: getScaledFontSize(0.9) }}
                    >
                      {tile.description}
                    </p>
                  </button>
                );
              })}
            </div>
          </section>
        </div>
      </div>

      <button
        type="button"
        onClick={() => setAccessibilityPanelOpen(true)}
        className="fixed bottom-6 right-6 z-20 inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/15 px-5 py-3 text-sm font-semibold text-white shadow-lg backdrop-blur transition hover:bg-white/30"
        aria-label={t("accessibilitySuite")}
      >
        <Accessibility className="h-5 w-5" />
        <span>{t("accessibilitySuite")}</span>
      </button>

      <AnimatePresence>
        {isAccessibilityPanelOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-30 flex items-center justify-center bg-black/60 p-4"
            role="dialog"
            aria-modal="true"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-md rounded-3xl bg-white p-6 text-gray-900 shadow-2xl"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm uppercase tracking-[0.4em] text-gray-500">
                    {t("accessibilitySuite")}
                  </p>
                  <h3 className="text-2xl font-semibold text-gray-900">
                    {t("accessibilityFeatureLanguage")}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setAccessibilityPanelOpen(false)}
                  className="rounded-full border border-gray-200 px-3 py-1 text-sm font-semibold text-gray-600"
                >
                  {t("close")}
                </button>
              </div>

              <div className="mt-5 space-y-5">
                <section>
                  <div className="flex items-center gap-2">
                    <Type className="h-5 w-5 text-gray-500" />
                    <p className="text-sm font-semibold text-gray-700">
                      {t("textSizeLabel")}
                    </p>
                  </div>
                  <div className="mt-3 grid grid-cols-3 gap-2">
                    {textScaleOptions.map((option) => (
                      <button
                        type="button"
                        key={option.key}
                        onClick={() => setTextScale(option.key)}
                        className={`rounded-2xl border px-3 py-2 text-sm font-semibold transition ${
                          textScale === option.key
                            ? "border-primary bg-primary/10 text-primary"
                            : "border-gray-200 text-gray-600"
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </section>

                <section>
                  <div className="flex items-center gap-2">
                    <Languages className="h-5 w-5 text-gray-500" />
                    <p className="text-sm font-semibold text-gray-700">
                      {t("languageShortcutTitle")}
                    </p>
                  </div>
                  <p className="text-xs text-gray-500">
                    {t("languageShortcutHelper")}
                  </p>
                  <div className="mt-3 grid grid-cols-3 gap-2">
                    {languageShortcuts.map((option) => (
                      <button
                        type="button"
                        key={option.code}
                        onClick={() => changeLanguage(option.code)}
                        className={`rounded-xl border px-3 py-2 text-sm font-semibold transition ${
                          language === option.code
                            ? "border-primary bg-primary/10 text-primary"
                            : "border-gray-200 text-gray-600"
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </section>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.main>
  );
};

export default AttractScreen;
