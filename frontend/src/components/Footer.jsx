import { Phone, Mail, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-foreground text-background">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-lg bg-gradient-primary flex items-center justify-center">
                <span className="text-primary-foreground font-heading font-extrabold text-lg">A</span>
              </div>
              <span className="font-heading font-extrabold text-lg">Alliance Diagnostic</span>
            </div>
            <p className="text-sm opacity-70 leading-relaxed">
              Accurate Reports. Trusted Care. India's growing network of trusted diagnostic labs.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-heading font-bold text-base mb-4">Quick Links</h4>
            <ul className="space-y-2.5">
              {["About Us", "Health Packages", "Book a Test", "Download Reports", "Knowledge Hub"].map((link) => (
                <li key={link}>
                  <a href="#" className="text-sm opacity-70 hover:opacity-100 transition-opacity">{link}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Tests */}
          <div>
            <h4 className="font-heading font-bold text-base mb-4">Popular Tests</h4>
            <ul className="space-y-2.5">
              {["Complete Blood Count", "Thyroid Profile", "Lipid Profile", "HbA1c", "Vitamin D"].map((test) => (
                <li key={test}>
                  <a href="#" className="text-sm opacity-70 hover:opacity-100 transition-opacity">{test}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-heading font-bold text-base mb-4">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-sm opacity-70">
                <Phone className="w-4 h-4 shrink-0" /> +91 62004 88170
              </li>
              <li className="flex items-center gap-2 text-sm opacity-70">
                <Mail className="w-4 h-4 shrink-0" /> alliancediagnosticlab@gmail.com
              </li>
              <li className="flex items-start gap-2 text-sm opacity-70">
                <MapPin className="w-4 h-4 shrink-0 mt-0.5" /> Vedam Netralaya, O-42 Doctor's Colony Kankarbagh, Patna (800020)
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-background/10 mt-10 pt-6 text-center">
          <p className="text-sm opacity-50">
            © 2026 Alliance Diagnostic. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
