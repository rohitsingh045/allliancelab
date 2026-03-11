import {
  ShieldCheck,
  FlaskConical,
  TrendingUp,
  Lock,
  MapPin,
  Award,
} from "lucide-react";
import { useLang } from "@/context/LanguageContext";

const WhyChooseUs = () => {
  const { t } = useLang();

  const features = [
    {
      icon: ShieldCheck,
      label: t.homeCollection247,
      ring: "border-primary",
      bg: "bg-primary/10",
      iconColor: "text-primary",
    },
    {
      icon: FlaskConical,
      label: t.freeHomeCollection,
      ring: "border-accent",
      bg: "bg-accent/10",
      iconColor: "text-accent",
    },
    {
      icon: Lock,
      label: t.sampleProtection,
      ring: "border-primary",
      bg: "bg-primary/10",
      iconColor: "text-primary",
    },
    {
      icon: TrendingUp,
      label: t.smartReports,
      ring: "border-accent",
      bg: "bg-accent/10",
      iconColor: "text-accent",
    },
    {
      icon: MapPin,
      label: t.phlebotomists,
      ring: "border-primary",
      bg: "bg-primary/10",
      iconColor: "text-primary",
    },
    {
      icon: Award,
      label: t.trustedBrand,
      ring: "border-accent",
      bg: "bg-accent/10",
      iconColor: "text-accent",
    },
  ];

  return (
    <section className="py-14 md:py-20 bg-primary/5">
      <div className="container mx-auto px-4">
        <h2 className="font-heading font-extrabold text-2xl md:text-3xl text-center mb-12 text-foreground">
          {t.whyChooseTitle1} <span className="text-gradient-primary">{t.whyChooseBestInClass}</span> {t.whyChooseTitle2}{" "}
          <span className="text-gradient-primary">{t.whyChooseBrand}</span>
        </h2>

        {/* Desktop connected layout */}
        <div className="hidden md:block relative">
          <div className="absolute top-1/2 left-[8%] right-[8%] h-[2px] bg-border -translate-y-1/2 z-0" />
          <div className="grid grid-cols-6 gap-4 relative z-10">
            {features.map((f, i) => (
              <div key={i} className="flex flex-col items-center text-center gap-3">
                <div
                  className={`w-20 h-20 rounded-full border-[3px] ${f.ring} ${f.bg} flex items-center justify-center bg-card shadow-card`}
                >
                  <f.icon className={`w-9 h-9 ${f.iconColor}`} strokeWidth={1.5} />
                </div>
                <p className="text-sm font-heading font-semibold text-foreground leading-snug max-w-[140px]">
                  {f.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile grid */}
        <div className="md:hidden grid grid-cols-2 gap-5">
          {features.map((f, i) => (
            <div
              key={i}
              className="flex flex-col items-center text-center gap-3 p-5 rounded-2xl bg-card border border-border shadow-card"
            >
              <div
                className={`w-16 h-16 rounded-full border-[3px] ${f.ring} ${f.bg} flex items-center justify-center`}
              >
                <f.icon className={`w-7 h-7 ${f.iconColor}`} strokeWidth={1.5} />
              </div>
              <p className="text-xs font-heading font-semibold text-foreground leading-snug">
                {f.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
