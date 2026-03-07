import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { fetchHealthPackages } from "@/api/client.js";
import { useCart } from "@/context/CartContext";
import { toast } from "sonner";
import { Check, X, ShoppingCart, GitCompareArrows } from "lucide-react";

const ComparePackages = () => {
  const { addItem, isInCart } = useCart();
  const [selected, setSelected] = useState([]);

  const { data: packages = [] } = useQuery({
    queryKey: ["healthPackages"],
    queryFn: fetchHealthPackages,
  });

  const toggleSelect = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : prev.length < 3 ? [...prev, id] : prev
    );
  };

  const selectedPackages = useMemo(
    () => packages.filter((p) => selected.includes(p._id)),
    [packages, selected]
  );

  const handleAddToCart = (pkg) => {
    if (isInCart(pkg._id, "package")) {
      toast.info(`${pkg.name} is already in cart`);
      return;
    }
    addItem({ id: pkg._id, type: "package", name: pkg.name, price: pkg.price, parameters: pkg.parameters, reportTime: pkg.reportTime });
    toast.success(`${pkg.name} added to cart!`);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <section className="bg-gradient-primary py-16 md:py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 mb-6">
            <GitCompareArrows className="w-4 h-4 text-accent" />
            <span className="text-sm font-semibold text-primary-foreground">Compare</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-heading font-extrabold text-primary-foreground mb-4">
            Compare Health Packages
          </h1>
          <p className="text-primary-foreground/80 max-w-2xl mx-auto text-lg">
            Select up to 3 packages to compare their tests, pricing, and features side by side.
          </p>
        </div>
      </section>

      <section className="py-12 bg-background">
        <div className="container mx-auto px-4">
          {/* Selection */}
          <h2 className="text-xl font-heading font-bold text-foreground mb-6">
            Select Packages to Compare ({selected.length}/3)
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-12">
            {packages.map((pkg) => (
              <button
                key={pkg._id}
                onClick={() => toggleSelect(pkg._id)}
                className={`text-left p-4 rounded-xl border-2 transition-all ${
                  selected.includes(pkg._id)
                    ? "border-primary bg-primary/5 shadow-card"
                    : "border-border bg-card hover:border-primary/40"
                }`}
              >
                <div className="flex items-start justify-between">
                  <h3 className="font-heading font-bold text-foreground text-sm flex-1 pr-2">{pkg.name}</h3>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                    selected.includes(pkg._id) ? "border-primary bg-primary" : "border-border"
                  }`}>
                    {selected.includes(pkg._id) && <Check className="w-3 h-3 text-primary-foreground" />}
                  </div>
                </div>
                <p className="text-lg font-heading font-extrabold text-primary mt-2">₹{pkg.price?.toLocaleString("en-IN")}</p>
                <p className="text-xs text-muted-foreground mt-1">{pkg.parameters} Parameters • {pkg.reportTime}</p>
              </button>
            ))}
          </div>

          {/* Comparison Table */}
          {selectedPackages.length >= 2 && (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    <th className="text-left p-4 bg-secondary rounded-tl-xl font-heading font-bold text-foreground">Feature</th>
                    {selectedPackages.map((pkg) => (
                      <th key={pkg._id} className="p-4 bg-secondary font-heading font-bold text-foreground text-center last:rounded-tr-xl">
                        {pkg.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-border">
                    <td className="p-4 text-sm font-medium text-muted-foreground">Price</td>
                    {selectedPackages.map((pkg) => (
                      <td key={pkg._id} className="p-4 text-center font-heading font-extrabold text-foreground">₹{pkg.price?.toLocaleString("en-IN")}</td>
                    ))}
                  </tr>
                  <tr className="border-b border-border bg-secondary/30">
                    <td className="p-4 text-sm font-medium text-muted-foreground">Parameters</td>
                    {selectedPackages.map((pkg) => (
                      <td key={pkg._id} className="p-4 text-center text-sm text-foreground">{pkg.parameters}</td>
                    ))}
                  </tr>
                  <tr className="border-b border-border">
                    <td className="p-4 text-sm font-medium text-muted-foreground">Report Time</td>
                    {selectedPackages.map((pkg) => (
                      <td key={pkg._id} className="p-4 text-center text-sm text-foreground">{pkg.reportTime}</td>
                    ))}
                  </tr>
                  <tr className="border-b border-border bg-secondary/30">
                    <td className="p-4 text-sm font-medium text-muted-foreground">Pre-requisites</td>
                    {selectedPackages.map((pkg) => (
                      <td key={pkg._id} className="p-4 text-center text-sm text-foreground">{pkg.prerequisites || "None"}</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-4"></td>
                    {selectedPackages.map((pkg) => (
                      <td key={pkg._id} className="p-4 text-center">
                        <Button
                          size="sm"
                          onClick={() => handleAddToCart(pkg)}
                          className={`font-semibold rounded-lg px-5 ${
                            isInCart(pkg._id, "package")
                              ? "bg-green-600 hover:bg-green-600 text-white"
                              : "bg-gradient-primary hover:opacity-90 text-primary-foreground"
                          }`}
                        >
                          <ShoppingCart className="w-3.5 h-3.5 mr-1.5" />
                          {isInCart(pkg._id, "package") ? "Added" : "Add to Cart"}
                        </Button>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          )}

          {selectedPackages.length < 2 && selected.length > 0 && (
            <p className="text-center text-muted-foreground py-8">Select at least 2 packages to compare.</p>
          )}
          {selected.length === 0 && (
            <p className="text-center text-muted-foreground py-8">Select packages from above to start comparing.</p>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ComparePackages;
