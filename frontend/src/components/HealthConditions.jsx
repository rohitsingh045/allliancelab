import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Bone, Heart, Hand, Droplets, Baby, Ribbon, Brain, Eye, Stethoscope, Activity, Users, Calendar } from "lucide-react";
import { fetchHealthConditions } from "@/api/client.js";

const tabs = [
  { id: "conditions", label: "Health Conditions" },
  { id: "seasonal", label: "Seasonal Packages" },
  { id: "age-gender", label: "Age & Gender Specific Tests" },
];

// Icon map for dynamic rendering from DB data
const iconMap = {
  "Bone Health & Arthritis": Bone,
  "Heart Health": Heart,
  "Allergies": Hand,
  "Diabetes": Droplets,
  "Pregnancy": Baby,
  "Cancer": Ribbon,
  "Neurology": Brain,
  "Eye Health": Eye,
  "General Wellness": Stethoscope,
  "Thyroid Disorders": Activity,
  "Women's Health": Users,
  "Senior Citizen": Calendar,
};

const seasonalData = [
  { icon: Droplets, label: "Monsoon Health", color: "text-primary", slug: "" },
  { icon: Activity, label: "Dengue Panel", color: "text-primary", slug: "" },
  { icon: Stethoscope, label: "Flu Season Check", color: "text-primary", slug: "" },
  { icon: Heart, label: "Winter Heart Care", color: "text-primary", slug: "" },
  { icon: Hand, label: "Summer Allergy", color: "text-primary", slug: "" },
  { icon: Brain, label: "Pollution Health", color: "text-primary", slug: "" },
];

const ageGenderData = [
  { icon: Users, label: "Women (20-40)", color: "text-primary", slug: "" },
  { icon: Users, label: "Men (20-40)", color: "text-primary", slug: "" },
  { icon: Baby, label: "Pediatric Panel", color: "text-primary", slug: "" },
  { icon: Calendar, label: "Senior Men (60+)", color: "text-primary", slug: "" },
  { icon: Calendar, label: "Senior Women (60+)", color: "text-primary", slug: "" },
  { icon: Heart, label: "Pre-Marriage", color: "text-primary", slug: "" },
];

const HealthConditions = () => {
  const [activeTab, setActiveTab] = useState("conditions");
  const navigate = useNavigate();

  const { data: conditionsFromApi = [] } = useQuery({
    queryKey: ["healthConditions"],
    queryFn: fetchHealthConditions,
  });

  // Map API data to display format with icons
  const conditionsData = conditionsFromApi.map((c) => ({
    icon: iconMap[c.label] || Stethoscope,
    label: c.label,
    color: "text-primary",
    slug: c.slug,
  }));

  const dataMap = {
    conditions: conditionsData,
    seasonal: seasonalData,
    "age-gender": ageGenderData,
  };

  const items = dataMap[activeTab] || [];

  return (
    <section id="health-conditions" className="py-14 md:py-20 bg-background">
      <div className="container mx-auto px-4">
        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-10 border-b border-border">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-5 py-3 text-base font-heading font-bold transition-all relative ${
                activeTab === tab.id
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab.label}
              {activeTab === tab.id && (
                <span className="absolute bottom-0 left-0 right-0 h-[3px] bg-gradient-primary rounded-t-full" />
              )}
            </button>
          ))}
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-5">
          {items.map((item, i) => {
            const IconComponent = item.icon;
            return (
              <button
                key={`${activeTab}-${i}`}
                onClick={() => {
                  if (item.slug) {
                    navigate(`/health-conditions/${item.slug}`);
                  }
                }}
                className="group flex flex-col items-center gap-3 p-5 rounded-2xl bg-card border border-border shadow-card hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300 cursor-pointer"
              >
                <div className="w-20 h-20 rounded-2xl bg-secondary flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                  <IconComponent className="w-10 h-10 text-primary" strokeWidth={1.5} />
                </div>
                <span className="text-sm font-heading font-semibold text-foreground text-center leading-snug">
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HealthConditions;
