import {
  ShieldCheck,
  FlaskConical,
  TrendingUp,
  Lock,
  MapPin,
  Award,
} from "lucide-react";

const features = [
  {
    icon: ShieldCheck,
    label: "24*7 Home Collection",
    ring: "border-primary",
    bg: "bg-primary/10",
    iconColor: "text-primary",
  },
  {
    icon: FlaskConical,
    label: "Free Home Collection",
    ring: "border-accent",
    bg: "bg-accent/10",
    iconColor: "text-accent",
  },
  {
    icon: Lock,
    label: "100% Sample Protection",
    ring: "border-primary",
    bg: "bg-primary/10",
    iconColor: "text-primary",
  },
  {
    icon: TrendingUp,
    label: "Smart + Trend Analysis Reports",
    ring: "border-accent",
    bg: "bg-accent/10",
    iconColor: "text-accent",
  },
  {
    icon: MapPin,
    label: "900+ Phlebotomists with Real Time Tracking",
    ring: "border-primary",
    bg: "bg-primary/10",
    iconColor: "text-primary",
  },
  {
    icon: Award,
    label: "A Brand Trusted By Healthcare Professionals",
    ring: "border-accent",
    bg: "bg-accent/10",
    iconColor: "text-accent",
  },
];

const WhyChooseUs = () => {
  return (
    <section className="py-14 md:py-20 bg-primary/5">
      <div className="container mx-auto px-4">
        <h2 className="font-heading font-extrabold text-2xl md:text-3xl text-center mb-12 text-foreground">
          You choose <span className="text-gradient-primary">best-in-class</span> Diagnostic experience with{" "}
          <span className="text-gradient-primary">Alliance Diagnostic</span>
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
