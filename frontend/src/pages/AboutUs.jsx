import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Shield, Award, Users, Heart, Target, FlaskConical, MapPin, Phone, Mail } from "lucide-react";

const stats = [
  { value: "20+", label: "Cities Covered" },
  { value: "900+", label: "Phlebotomists" },
  { value: "500+", label: "Tests Available" },
  { value: "30K+", label: "Happy Patients" },
];

const values = [
  { icon: Target, title: "Accuracy", desc: "99.9% accuracy in all test results with international quality standards." },
  { icon: Heart, title: "Patient First", desc: "Every decision we make puts patient care and comfort at the centre." },
  { icon: Shield, title: "Trust & Transparency", desc: "Clear pricing with no hidden charges. Your reports belong to you." },
  { icon: FlaskConical, title: "Innovation", desc: "State-of-the-art equipment and latest methodologies for precise results." },
];

const team = [
  { name: "Mr. Lokesh Kumar", role: "Founder & CEO, Alliance Group", initials: "LK" },
  { name: "Dr. Neha Singh", role: "M.B.B.S (MD), Pathologist", initials: "NS" },
  { name: "Mr. Rohit Kumar", role: "IT Head & Media", initials: "RK" },
  { name: "Mr. Raman Kumar", role: "Marketing Head", initials: "RK" },
];

const AboutUs = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero */}
      <section className="bg-gradient-primary py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-5xl font-heading font-extrabold text-primary-foreground mb-4">
            About Alliance Diagnostic
          </h1>
          <p className="text-primary-foreground/80 max-w-2xl mx-auto text-lg">
            Your Health, Our Priority. We are India's growing network of trusted diagnostic labs delivering accurate and affordable healthcare.
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
          <h2 className="text-2xl md:text-3xl font-heading font-extrabold text-foreground mb-6 text-center">Our Story</h2>
          <div className="space-y-4 text-muted-foreground leading-relaxed">
            <p>
              Alliance Diagnostic was founded with a simple yet powerful mission — to make quality diagnostic healthcare accessible and affordable for every Indian family. What started as a single lab in Nagpur has grown into a trusted network serving 50+ cities.
            </p>
            <p>
              We believe that accurate diagnosis is the foundation of effective treatment. That's why we invest in cutting-edge technology, rigorous quality controls, and continuous training for our team of 900+ phlebotomists and lab technicians.
            </p>
            <p>
              Every sample that enters our labs goes through multiple quality checkpoints. Our commitment to international standards of excellence ensures the highest accuracy in every report.
            </p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 bg-secondary/30">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-heading font-extrabold text-center text-foreground mb-12">Our Values</h2>
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
          <h2 className="text-2xl md:text-3xl font-heading font-extrabold text-center text-foreground mb-12">Our Leadership Team</h2>
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
          <h2 className="text-2xl md:text-3xl font-heading font-extrabold text-foreground mb-8">Certifications & Accreditations</h2>
          <div className="flex flex-wrap justify-center gap-6">
            {[
              { icon: Award, label: "Quality Certified" },
              { icon: Shield, label: "International Standards" },
              { icon: FlaskConical, label: "Advanced Technology" },
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
          <h2 className="text-2xl md:text-3xl font-heading font-extrabold text-foreground mb-8">Get in Touch</h2>
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
              <span>42 Healthcare Avenue, Dharampeth, Nagpur 440010</span>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default AboutUs;
