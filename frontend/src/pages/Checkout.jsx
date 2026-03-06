import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { CreditCard, Banknote, ArrowLeft, CheckCircle2 } from "lucide-react";
import Header from "@/components/Header.jsx";
import Footer from "@/components/Footer.jsx";
import { toast } from "sonner";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const Checkout = () => {
  const { items, totalPrice, clearCart } = useCart();
  const { user, token } = useAuth();
  const navigate = useNavigate();

  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState(user?.phone || "");
  const [loading, setLoading] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId, setOrderId] = useState("");

  // Redirect to login if not authenticated
  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-bold text-foreground mb-2">Please login first</h1>
          <p className="text-muted-foreground mb-6">You need to be logged in to checkout.</p>
          <Button
            className="bg-gradient-primary text-primary-foreground font-semibold"
            onClick={() => navigate("/login")}
          >
            Go to Login
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  if (items.length === 0 && !orderPlaced) {
    navigate("/cart");
    return null;
  }

  // Order placed success screen
  if (orderPlaced) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-20 text-center">
          <CheckCircle2 className="w-20 h-20 text-green-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-foreground mb-2">Order Placed Successfully!</h1>
          <p className="text-muted-foreground mb-1">Your order ID: <span className="font-semibold text-foreground">{orderId}</span></p>
          <p className="text-muted-foreground mb-6">
            Payment method: <span className="font-semibold text-foreground">{paymentMethod === "cod" ? "Cash on Delivery" : "Online Payment"}</span>
          </p>
          {paymentMethod === "online" && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg inline-block">
              <p className="text-green-700 font-medium">Payment simulated successfully!</p>
            </div>
          )}
          <Button
            className="bg-gradient-primary text-primary-foreground font-semibold"
            onClick={() => navigate("/")}
          >
            Back to Home
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  const handlePlaceOrder = async () => {
    if (!address.trim()) {
      toast.error("Please enter your address");
      return;
    }
    if (!phone.trim()) {
      toast.error("Please enter your phone number");
      return;
    }

    setLoading(true);
    try {
      // Simulate online payment delay
      if (paymentMethod === "online") {
        await new Promise((r) => setTimeout(r, 1500));
      }

      const res = await fetch(`${API_BASE}/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          items: items.map((i) => ({
            itemId: i.id,
            itemType: i.type,
            name: i.name,
            price: i.price,
            quantity: i.quantity,
          })),
          totalPrice,
          paymentMethod,
          paymentStatus: paymentMethod === "online" ? "paid" : "pending",
          address,
          phone,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to place order");

      setOrderId(data.order._id);
      setOrderPlaced(true);
      clearCart();
      toast.success("Order placed successfully!");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <button
          onClick={() => navigate("/cart")}
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Cart
        </button>

        <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-6">Checkout</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left – form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Contact & Address */}
            <div className="bg-card rounded-xl border border-border p-6">
              <h2 className="font-bold text-lg text-foreground mb-4">Delivery Details</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Full Name</label>
                  <input
                    type="text"
                    value={user.name}
                    disabled
                    className="w-full px-4 py-2.5 rounded-lg border border-border bg-secondary/50 text-sm text-foreground"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Email</label>
                  <input
                    type="email"
                    value={user.email}
                    disabled
                    className="w-full px-4 py-2.5 rounded-lg border border-border bg-secondary/50 text-sm text-foreground"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Phone *</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 9876543210"
                    required
                    className="w-full px-4 py-2.5 rounded-lg border border-border bg-secondary text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary text-foreground placeholder:text-muted-foreground"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-foreground mb-1.5">Address *</label>
                  <textarea
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Enter your full address for sample collection"
                    rows={3}
                    required
                    className="w-full px-4 py-2.5 rounded-lg border border-border bg-secondary text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary text-foreground placeholder:text-muted-foreground resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-card rounded-xl border border-border p-6">
              <h2 className="font-bold text-lg text-foreground mb-4">Payment Method</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <button
                  onClick={() => setPaymentMethod("cod")}
                  className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all ${
                    paymentMethod === "cod"
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <Banknote className={`w-6 h-6 ${paymentMethod === "cod" ? "text-primary" : "text-muted-foreground"}`} />
                  <div className="text-left">
                    <p className="font-semibold text-foreground">Cash on Delivery</p>
                    <p className="text-xs text-muted-foreground">Pay when sample is collected</p>
                  </div>
                </button>
                <button
                  onClick={() => setPaymentMethod("online")}
                  className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all ${
                    paymentMethod === "online"
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <CreditCard className={`w-6 h-6 ${paymentMethod === "online" ? "text-primary" : "text-muted-foreground"}`} />
                  <div className="text-left">
                    <p className="font-semibold text-foreground">Online Payment</p>
                    <p className="text-xs text-muted-foreground">Pay now via UPI / Card / Net Banking</p>
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* Right – summary */}
          <div className="lg:col-span-1">
            <div className="bg-card rounded-xl border border-border p-6 sticky top-28">
              <h2 className="font-bold text-lg text-foreground mb-4">Order Summary</h2>
              <div className="space-y-3 mb-4">
                {items.map((item) => (
                  <div key={`${item.type}-${item.id}`} className="flex justify-between text-sm">
                    <span className="text-muted-foreground truncate mr-2">{item.name}</span>
                    <span className="font-medium text-foreground whitespace-nowrap">₹{item.price.toLocaleString("en-IN")}</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-border pt-3 mb-6">
                <div className="flex justify-between text-lg font-bold text-foreground">
                  <span>Total</span>
                  <span>₹{totalPrice.toLocaleString("en-IN")}</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {paymentMethod === "cod" ? "Pay at the time of sample collection" : "Pay online securely"}
                </p>
              </div>
              <Button
                className="w-full bg-gradient-primary hover:opacity-90 text-primary-foreground font-semibold py-3"
                onClick={handlePlaceOrder}
                disabled={loading}
              >
                {loading
                  ? paymentMethod === "online"
                    ? "Processing Payment..."
                    : "Placing Order..."
                  : paymentMethod === "online"
                  ? `Pay ₹${totalPrice.toLocaleString("en-IN")} Now`
                  : "Place Order (COD)"}
              </Button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Checkout;
