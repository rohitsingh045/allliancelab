import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { fetchTests } from "@/api/client.js";
import { useCart } from "@/context/CartContext";
import { toast } from "sonner";
import { Plus, X, ShoppingCart, Package, Trash2 } from "lucide-react";

const CreatePackage = () => {
  const { addItem } = useCart();
  const [selectedTests, setSelectedTests] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const { data: tests = [] } = useQuery({
    queryKey: ["tests"],
    queryFn: () => fetchTests(),
  });

  const filteredTests = useMemo(
    () => tests.filter((t) => t.name.toLowerCase().includes(searchQuery.toLowerCase())),
    [tests, searchQuery]
  );

  const toggleTest = (test) => {
    setSelectedTests((prev) =>
      prev.find((t) => t._id === test._id)
        ? prev.filter((t) => t._id !== test._id)
        : [...prev, test]
    );
  };

  const totalPrice = selectedTests.reduce((sum, t) => sum + (t.price || 0), 0);
  const totalParams = selectedTests.reduce((sum, t) => sum + (t.parameters || 0), 0);

  const handleAddAllToCart = () => {
    if (selectedTests.length === 0) return;
    selectedTests.forEach((test) => {
      addItem({ id: test._id, type: "test", name: test.name, price: test.price, parameters: test.parameters, reportTime: test.reportTime });
    });
    toast.success(`${selectedTests.length} tests added to cart!`);
    setSelectedTests([]);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <section className="bg-gradient-primary py-16 md:py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 mb-6">
            <Package className="w-4 h-4 text-accent" />
            <span className="text-sm font-semibold text-primary-foreground">Custom Package</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-heading font-extrabold text-primary-foreground mb-4">
            Create Your Own Package
          </h1>
          <p className="text-primary-foreground/80 max-w-2xl mx-auto text-lg">
            Pick individual tests and build a custom health package tailored to your needs.
          </p>
        </div>
      </section>

      <section className="py-12 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Test selection */}
            <div className="lg:col-span-2">
              <div className="mb-6">
                <input
                  type="text"
                  placeholder="Search tests..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 text-foreground placeholder:text-muted-foreground"
                />
              </div>
              <div className="grid sm:grid-cols-2 gap-3">
                {filteredTests.map((test) => {
                  const isSelected = selectedTests.find((t) => t._id === test._id);
                  return (
                    <button
                      key={test._id}
                      onClick={() => toggleTest(test)}
                      className={`text-left p-4 rounded-xl border-2 transition-all ${
                        isSelected
                          ? "border-primary bg-primary/5"
                          : "border-border bg-card hover:border-primary/40"
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1 pr-2">
                          <h3 className="font-heading font-bold text-foreground text-sm">{test.name}</h3>
                          <p className="text-xs text-muted-foreground mt-1">{test.parameters} params • {test.reportTime}</p>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <span className="font-heading font-bold text-foreground text-sm">₹{test.price}</span>
                          {isSelected ? (
                            <X className="w-4 h-4 text-destructive" />
                          ) : (
                            <Plus className="w-4 h-4 text-primary" />
                          )}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
              {filteredTests.length === 0 && (
                <p className="text-center text-muted-foreground py-8">No tests found.</p>
              )}
            </div>

            {/* Summary sidebar */}
            <div>
              <div className="sticky top-40 bg-card rounded-2xl border border-border p-6 shadow-card">
                <h3 className="font-heading font-bold text-foreground text-lg mb-4">
                  Your Custom Package
                </h3>
                {selectedTests.length === 0 ? (
                  <p className="text-sm text-muted-foreground py-4">No tests selected yet. Click on tests to add them.</p>
                ) : (
                  <>
                    <ul className="space-y-2 mb-6 max-h-64 overflow-y-auto">
                      {selectedTests.map((test) => (
                        <li key={test._id} className="flex items-center justify-between text-sm">
                          <span className="text-foreground flex-1 pr-2">{test.name}</span>
                          <div className="flex items-center gap-2 shrink-0">
                            <span className="text-muted-foreground">₹{test.price}</span>
                            <button onClick={() => toggleTest(test)}>
                              <Trash2 className="w-3.5 h-3.5 text-destructive" />
                            </button>
                          </div>
                        </li>
                      ))}
                    </ul>
                    <div className="border-t border-border pt-4 mb-4 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Tests</span>
                        <span className="font-medium text-foreground">{selectedTests.length}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Total Parameters</span>
                        <span className="font-medium text-foreground">{totalParams}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-heading font-bold text-foreground">Total</span>
                        <span className="font-heading font-extrabold text-xl text-foreground">₹{totalPrice.toLocaleString("en-IN")}</span>
                      </div>
                    </div>
                    <Button
                      onClick={handleAddAllToCart}
                      className="w-full bg-gradient-primary hover:opacity-90 text-primary-foreground font-bold py-5 rounded-xl"
                    >
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Add All to Cart
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default CreatePackage;
