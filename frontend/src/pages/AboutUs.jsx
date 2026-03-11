import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Shield, Award, Users, Heart, Target, FlaskConical, MapPin, Phone, Mail } from "lucide-react";
import { useLang } from "@/context/LanguageContext";

const AboutUs = () => {
  const { t } = useLang();

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
    { name: "Mr. Lokesh Kumar", role: "Founder & CEO, Alliance Group", initials: "LK" },
    { name: "Dr. Neha Singh", role: "M.B.B.S (MD), Pathologist", initials: "NS" },
    { name: "Mr. Rohit Kumar", role: "IT Head & Media", initials: "RK" },
    { name: "Mr. Raman Kumar", role: "Marketing Head", initials: "RK" },
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
              <div key={m.name} className="bg-card rounded-2xl border border-border p-6 shadow-card text-center">
                <div className="w-20 h-20 rounded-full bg-gradient-primary flex items-center justify-center mx-auto mb-4">
                  <span className="text-primary-foreground font-heading font-extrabold text-xl">{m.initials}</span>
                </div>
                <h3 className="font-heading font-bold text-foreground">{m.name}</h3>
                <p className="text-sm text-muted-foreground mt-1">{m.role}</p>
              </div>
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

      <Footer />
    </div>
  );
};

export default AboutUs;
