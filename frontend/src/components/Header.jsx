import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, ShoppingCart, MapPin, Menu, X, ChevronDown, User, LogOut, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import CitySelector from "@/components/CitySelector.jsx";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import logo from "@/assets/logo.png";

const navItems = [
  { label: "Home Collection", type: "navigate", target: "/home-collection" },
  { label: "Centre Visit", type: "navigate", target: "/centre-visit" },
  { label: "Health Packages", type: "scroll", target: "health-packages" },
  { label: "Health Conditions", type: "scroll", target: "health-conditions" },
  { label: "Compare Packages", type: "navigate", target: "/compare-packages" },
  { label: "Create Your Package", type: "navigate", target: "/create-package" },
  { label: "About Us", type: "navigate", target: "/about-us" },
  { label: "Knowledge Hub", type: "navigate", target: "/knowledge-hub" },
];

const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [city, setCity] = useState("Nagpur");
  const [cityOpen, setCityOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { user, logout } = useAuth();
  const { totalItems } = useCart();
  const navigate = useNavigate();

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
            Accurate Reports. Trusted Care.
          </p>
          <div className="hidden md:flex items-center gap-4">
            <button
              onClick={() => navigate("/blogs")}
              className="text-sm text-primary-foreground opacity-80 hover:opacity-100 transition-opacity"
            >
              Blogs
            </button>
            {user ? (
              <span className="text-sm text-primary-foreground opacity-90 font-medium">
                Hi, {user.name}
              </span>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                className="text-primary-foreground opacity-90 hover:opacity-100 hover:bg-primary-foreground/10"
                onClick={() => navigate("/login")}
              >
                <User className="w-4 h-4 mr-1" />
                Customer Login
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
              placeholder='Search tests like "HbA1c", "CRP"...'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-border bg-secondary text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all text-foreground placeholder:text-muted-foreground"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
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
                Admin
              </Button>
            )}
            {user ? (
              <Button
                className="hidden md:flex bg-gradient-primary hover:opacity-90 text-primary-foreground font-semibold rounded-full"
                onClick={logout}
              >
                <LogOut className="w-4 h-4 mr-1" />
                Logout
              </Button>
            ) : (
              <Button
                className="hidden md:flex bg-gradient-primary hover:opacity-90 text-primary-foreground font-semibold rounded-full"
                onClick={() => navigate("/login")}
              >
                <User className="w-4 h-4 mr-1" />
                Login
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
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search tests..."
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
                Admin Dashboard
              </Button>
            )}
            {user ? (
              <Button
                className="w-full bg-gradient-primary text-primary-foreground font-semibold"
                onClick={() => { logout(); setMobileOpen(false); }}
              >
                <LogOut className="w-4 h-4 mr-1" />
                Logout ({user.name})
              </Button>
            ) : (
              <Button
                className="w-full bg-gradient-primary text-primary-foreground font-semibold"
                onClick={() => { navigate("/login"); setMobileOpen(false); }}
              >
                Customer Login
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
