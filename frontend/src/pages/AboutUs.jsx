import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Shield, Award, Users, Heart, Target, FlaskConical, MapPin, Phone, Mail, X, Star } from "lucide-react";
import { useLang } from "@/context/LanguageContext";

const AboutUs = () => {
  const { t } = useLang();
  const [selectedMember, setSelectedMember] = useState(null);

  const stats = [
    { value: "20+", label: t.citiesCovered },
    { value: "900+", label: t.phlebotomistsCount },
    { value: "500+", label: t.testsAvailable },
    { value: "30K+", label: t.happyPatients },
  ];

  const values = [
    { icon: Target, title: t.accuracy, desc: t.accuracyDesc },
    { icon: Heart, title: t.patientFirst, desc: t.patientFirstDesc },
    { icon: Shield, title: t.trustTransparency, desc: t.trustTransparencyDesc },
    { icon: FlaskConical, title: t.innovation, desc: t.innovationDesc },
  ];

  const team = [
    {
      name: "Mr. Lokesh Kumar",
      role: "Founder & CEO, Alliance Group",
      initials: "LK",
      focus: ["Healthcare strategy", "Service expansion", "Patient-first operations"],
      bio: "Mr. Lokesh Kumar leads Alliance Group with a mission to make quality diagnostics accessible and affordable. Under his leadership, the organization expanded from one center to a multi-city network while maintaining trusted clinical standards.",
      achievements: ["Built strong city-level diagnostic network", "Introduced affordable preventive packages", "Enabled faster report delivery systems"],
      email: "leadership@alliancediagnostic.com",
      phone: "+91 62004 88170",
    },
    {
      name: "Dr. Neha Singh",
      role: "M.B.B.S (MD), Pathologist",
      initials: "NS",
      focus: ["Clinical pathology", "Quality control", "Diagnostic accuracy"],
      bio: "Dr. Neha Singh oversees pathology quality and report reliability. She drives process excellence across labs and ensures each report follows strict clinical review protocols.",
      achievements: ["Standardized pathology quality checks", "Improved report consistency across centers", "Mentored diagnostics and lab teams"],
      email: "pathology@alliancediagnostic.com",
      phone: "+91 62004 88170",
    },
    {
      name: "Mr. Rohit Kumar",
      role: "Software Developer",
      initials: "RK",
      focus: ["Web development", "Mobile app development", "Technology operations"],
      bio: "Mr. Rohit Kumar is a software developer at Alliance Diagnostic. He focuses on building reliable digital products, improving patient journeys, and supporting day-to-day technology operations.",
      achievements: ["Enhanced online booking experience", "Improved digital communication workflows", "Strengthened IT support for multi-city operations"],
      email: "rohitkumar40805@gmail.com",
      phone: "8340178854",
    },
    {
      name: "Mr. Raman Kumar",
      role: "Marketing Head",
      initials: "RK",
      focus: ["Brand growth", "Patient outreach", "Campaign strategy"],
      bio: "Mr. Raman Kumar leads brand and outreach strategy, helping Alliance connect with families across regions. He drives localized campaigns and awareness initiatives focused on preventive healthcare.",
      achievements: ["Expanded regional brand awareness", "Launched focused health awareness campaigns", "Improved patient engagement channels"],
      email: "marketing@alliancediagnostic.com",
      phone: "+91 62004 88170",
    },
  ];
  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero */}
      <section className="bg-gradient-primary py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-5xl font-heading font-extrabold text-primary-foreground mb-4">
            {t.aboutAllianceDiagnostic}
          </h1>
          <p className="text-primary-foreground/80 max-w-2xl mx-auto text-lg">
            {t.aboutSubtitle}
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((s) => (
              <div key={s.label} className="text-center">
                <p className="text-3xl md:text-4xl font-heading font-extrabold text-gradient-primary">{s.value}</p>
                <p className="text-sm text-muted-foreground mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="text-2xl md:text-3xl font-heading font-extrabold text-foreground mb-6 text-center">{t.ourStory}</h2>
          <div className="space-y-4 text-muted-foreground leading-relaxed">
            <p>{t.ourStoryP1}</p>
            <p>{t.ourStoryP2}</p>
            <p>{t.ourStoryP3}</p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 bg-secondary/30">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-heading font-extrabold text-center text-foreground mb-12">{t.ourValues}</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v) => (
              <div key={v.title} className="bg-card rounded-2xl border border-border p-6 shadow-card text-center">
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <v.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="font-heading font-bold text-foreground mb-2">{v.title}</h3>
                <p className="text-sm text-muted-foreground">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-heading font-extrabold text-center text-foreground mb-12">{t.ourLeadershipTeam}</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((m) => (
              <button
                key={m.name}
                type="button"
                onClick={() => setSelectedMember(m)}
                className="bg-card rounded-2xl border border-border p-6 shadow-card text-center hover:shadow-card-hover transition-all hover:-translate-y-0.5"
              >
                <div className="w-20 h-20 rounded-full bg-gradient-primary flex items-center justify-center mx-auto mb-4">
                  <span className="text-primary-foreground font-heading font-extrabold text-xl">{m.initials}</span>
                </div>
                <h3 className="font-heading font-bold text-foreground">{m.name}</h3>
                <p className="text-sm text-muted-foreground mt-1">{m.role}</p>
                <p className="text-xs text-primary mt-3 font-semibold">Click to view details</p>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Certifications */}
      <section className="py-16 bg-secondary/30">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-heading font-extrabold text-foreground mb-8">{t.certifications}</h2>
          <div className="flex flex-wrap justify-center gap-6">
            {[
              { icon: Award, label: t.qualityCertified },
              { icon: Shield, label: t.internationalStandards },
              { icon: FlaskConical, label: t.advancedTechnology },
            ].map((cert) => (
              <div key={cert.label} className="flex items-center gap-3 bg-card rounded-xl border border-border px-6 py-4 shadow-card">
                <cert.icon className="w-8 h-8 text-accent" />
                <span className="font-heading font-bold text-foreground">{cert.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 max-w-2xl text-center">
          <h2 className="text-2xl md:text-3xl font-heading font-extrabold text-foreground mb-8">{t.getInTouch}</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-center gap-3 text-muted-foreground">
              <Phone className="w-5 h-5 text-primary" />
              <span>+91 62004 88170</span>
            </div>
            <div className="flex items-center justify-center gap-3 text-muted-foreground">
              <Mail className="w-5 h-5 text-primary" />
              <span>alliancediagnosticlab@gmail.com</span>
            </div>
            <div className="flex items-center justify-center gap-3 text-muted-foreground">
              <MapPin className="w-5 h-5 text-primary" />
              <span>Vedam Netralaya, O-42 Doctor's Colony Kankarbagh, Patna (800020)</span>
            </div>
          </div>
        </div>
      </section>

      {selectedMember && (
        <div
          className="fixed inset-0 z-[120] bg-black/50 flex items-center justify-center p-4"
          onClick={() => setSelectedMember(null)}
        >
          <div
            className="w-full max-w-2xl bg-card rounded-2xl border border-border shadow-elevated max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between p-5 border-b border-border">
              <div>
                <h3 className="text-2xl font-heading font-extrabold text-foreground">{selectedMember.name}</h3>
                <p className="text-primary font-semibold mt-1">{selectedMember.role}</p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedMember(null)}
                className="p-1 text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-5 space-y-6">
              <div className="flex flex-wrap gap-3 text-sm">
                <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/10 text-accent font-semibold">
                  <Users className="w-4 h-4" />
                  Leadership Team
                </span>
              </div>

              <div>
                <h4 className="font-heading font-bold text-foreground mb-2">About</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">{selectedMember.bio}</p>
              </div>

              <div>
                <h4 className="font-heading font-bold text-foreground mb-2">Core Focus Areas</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedMember.focus.map((item) => (
                    <span key={item} className="px-3 py-1.5 rounded-full border border-border text-sm text-foreground">
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-heading font-bold text-foreground mb-2">Key Highlights</h4>
                <ul className="space-y-2">
                  {selectedMember.achievements.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <Star className="w-4 h-4 text-accent mt-0.5 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="grid sm:grid-cols-2 gap-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground border border-border rounded-xl p-3">
                  <Mail className="w-4 h-4 text-primary" />
                  <span>{selectedMember.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground border border-border rounded-xl p-3">
                  <Phone className="w-4 h-4 text-primary" />
                  <span>{selectedMember.phone}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default AboutUs;
