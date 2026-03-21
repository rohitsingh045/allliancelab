import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, ShoppingCart, MapPin, Menu, X, ChevronDown, User, LogOut, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import CitySelector from "@/components/CitySelector.jsx";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { useLang } from "@/context/LanguageContext";
import NotificationBell from "@/components/NotificationBell";
import LanguageSelector from "@/components/LanguageSelector";
import logo from "@/assets/logo.png";
import { defaultCentreCity } from "@/lib/centreLocations";

const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [city, setCity] = useState(defaultCentreCity);
  const [cityOpen, setCityOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { user, token, logout } = useAuth();
  const { totalItems } = useCart();
  const { t } = useLang();
  const navigate = useNavigate();

  const navItems = [
    { label: t.homeCollection, type: "navigate", target: "/home-collection" },
    { label: t.centreVisit, type: "navigate", target: "/centre-visit" },
    { label: t.healthPackages, type: "scroll", target: "health-packages" },
    { label: t.healthConditions, type: "scroll", target: "health-conditions" },
    { label: t.comparePackages, type: "navigate", target: "/compare-packages" },
    { label: t.createYourPackage, type: "navigate", target: "/create-package" },
    { label: t.aboutUs, type: "navigate", target: "/about-us" },
    { label: t.knowledgeHub, type: "navigate", target: "/knowledge-hub" },
  ];

  const handleNavClick = (item) => {
    if (item.type === "navigate") {
      navigate(item.target);
    } else {
      if (window.location.pathname !== "/") {
        navigate("/");
        setTimeout(() => {
          document.getElementById(item.target)?.scrollIntoView({ behavior: "smooth" });
        }, 300);
      } else {
        document.getElementById(item.target)?.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-card border-b border-border">
      {/* Top bar */}
      <div className="bg-gradient-primary">
        <div className="container mx-auto px-4 py-2 flex items-center justify-between">
          <p className="text-sm font-medium text-primary-foreground opacity-90">
            {t.tagline}
          </p>
          <div className="hidden md:flex items-center gap-4">
            <LanguageSelector />
            <button
              onClick={() => navigate("/blogs")}
              className="text-sm text-primary-foreground opacity-80 hover:opacity-100 transition-opacity"
            >
              {t.blogs}
            </button>
            {user ? (
              <span className="text-sm text-primary-foreground opacity-90 font-medium">
                {t.hi}, {user.name}
              </span>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                className="text-primary-foreground opacity-90 hover:opacity-100 hover:bg-primary-foreground/10"
                onClick={() => navigate("/login")}
              >
                <User className="w-4 h-4 mr-1" />
                {t.customerLogin}
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Main header */}
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <img src={logo} alt="Alliance Diagnostic - Your Health Our Priority" className="h-10 md:h-12 w-auto" />
          </Link>

          {/* Location selector */}
          <div className="hidden md:flex">
            <button
              onClick={() => setCityOpen(true)}
              className="flex items-center gap-1 px-3 py-2 rounded-lg border border-border bg-secondary text-sm font-medium text-foreground hover:border-primary transition-colors"
            >
              <MapPin className="w-4 h-4 text-primary" />
              {city}
              <ChevronDown className="w-3 h-3 text-muted-foreground" />
            </button>
          </div>

          {/* Search */}
          <div className="hidden md:flex flex-1 max-w-md relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder={t.searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-border bg-secondary text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all text-foreground placeholder:text-muted-foreground"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {user && token && (
              <NotificationBell role="user" token={token} />
            )}
            <Button variant="ghost" size="icon" className="relative text-foreground" onClick={() => navigate("/cart")}>
              <ShoppingCart className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-accent text-accent-foreground text-[10px] font-bold rounded-full flex items-center justify-center">
                {totalItems}
              </span>
            </Button>
            {user?.role === "admin" && (
              <Button
                variant="outline"
                size="sm"
                className="hidden md:flex"
                onClick={() => navigate("/admin/dashboard")}
              >
                <Shield className="w-4 h-4 mr-1" />
                {t.admin}
              </Button>
            )}
            {user ? (
              <Button
                className="hidden md:flex bg-gradient-primary hover:opacity-90 text-primary-foreground font-semibold rounded-full"
                onClick={logout}
              >
                <LogOut className="w-4 h-4 mr-1" />
                {t.logout}
              </Button>
            ) : (
              <Button
                className="hidden md:flex bg-gradient-primary hover:opacity-90 text-primary-foreground font-semibold rounded-full"
                onClick={() => navigate("/login")}
              >
                <User className="w-4 h-4 mr-1" />
                {t.login}
              </Button>
            )}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 text-foreground"
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="hidden md:block border-t border-border">
        <div className="container mx-auto px-4">
          <ul className="flex items-center gap-0 overflow-x-auto scrollbar-hide">
            {navItems.map((item) => (
              <li key={item.label}>
                <button
                  onClick={() => handleNavClick(item)}
                  className="block px-3 lg:px-4 py-3 text-sm font-medium text-muted-foreground hover:text-primary transition-colors whitespace-nowrap"
                >
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-card">
          <div className="p-4 space-y-3">
            {/* Language Selector for mobile */}
            <div className="flex justify-end mb-2">
              <LanguageSelector />
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder={t.searchTestsMobile}
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-border bg-secondary text-sm text-foreground"
              />
            </div>
            <button
              onClick={() => { setCityOpen(true); setMobileOpen(false); }}
              className="flex items-center gap-2 text-sm text-foreground"
            >
              <MapPin className="w-4 h-4 text-primary" />
              {city}
              <ChevronDown className="w-3 h-3 text-muted-foreground" />
            </button>
            <ul className="space-y-1">
              {navItems.map((item) => (
                <li key={item.label}>
                  <button
                    onClick={() => { handleNavClick(item); setMobileOpen(false); }}
                    className="block w-full text-left px-3 py-2.5 text-sm font-medium text-foreground hover:bg-secondary rounded-lg"
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
            {user?.role === "admin" && (
              <Button
                variant="outline"
                className="w-full"
                onClick={() => { navigate("/admin/dashboard"); setMobileOpen(false); }}
              >
                <Shield className="w-4 h-4 mr-1" />
                {t.adminDashboard}
              </Button>
            )}
            {user ? (
              <Button
                className="w-full bg-gradient-primary text-primary-foreground font-semibold"
                onClick={() => { logout(); setMobileOpen(false); }}
              >
                <LogOut className="w-4 h-4 mr-1" />
                {t.logout} ({user.name})
              </Button>
            ) : (
              <Button
                className="w-full bg-gradient-primary text-primary-foreground font-semibold"
                onClick={() => { navigate("/login"); setMobileOpen(false); }}
              >
                {t.customerLogin}
              </Button>
            )}
          </div>
        </div>
      )}

      <CitySelector
        open={cityOpen}
        onClose={() => setCityOpen(false)}
        selectedCity={city}
        onSelectCity={setCity}
      />
    </header>
  );
};

export default Header;
