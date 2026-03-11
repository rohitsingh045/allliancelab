import { useNavigate } from "react-router-dom";
import { TestTube, Package, Download, Upload } from "lucide-react";
import { useLang } from "@/context/LanguageContext";

const QuickActions = () => {
  const navigate = useNavigate();
  const { t } = useLang();

  const actions = [
    {
      icon: TestTube,
      title: t.bookATest,
      description: t.bookATestDesc,
      gradient: "bg-gradient-primary",
      action: "scroll",
      target: "tests-section",
    },
    {
      icon: Package,
      title: t.healthPackagesAction,
      description: t.healthPackagesDesc,
      gradient: "bg-gradient-accent",
      action: "scroll",
      target: "health-packages",
    },
    {
      icon: Download,
      title: t.downloadReport,
      description: t.downloadReportDesc,
      gradient: "bg-gradient-primary",
      action: "navigate",
      target: "/download-report",
    },
    {
      icon: Upload,
      title: t.uploadPrescription,
      description: t.uploadPrescriptionDesc,
      gradient: "bg-gradient-accent",
      action: "navigate",
      target: "/upload-prescription",
    },
  ];

  const handleClick = (item) => {
    if (item.action === "navigate") {
      navigate(item.target);
    } else {
      const el = document.getElementById(item.target);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="py-12 md:py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {actions.map((action, index) => (
            <button
              key={action.title}
              onClick={() => handleClick(action)}
              className="group bg-card rounded-2xl p-6 border border-border shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1 text-left"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className={`w-14 h-14 rounded-xl ${action.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                <action.icon className="w-7 h-7 text-primary-foreground" />
              </div>
              <h3 className="font-heading font-bold text-foreground text-base mb-1">
                {action.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {action.description}
              </p>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default QuickActions;
