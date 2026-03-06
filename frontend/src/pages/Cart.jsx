import { Link, useNavigate } from "react-router-dom";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { Trash2, ShoppingCart, ArrowLeft, ArrowRight } from "lucide-react";
import Header from "@/components/Header.jsx";
import Footer from "@/components/Footer.jsx";

const Cart = () => {
  const { items, removeItem, clearCart, totalPrice, totalItems } = useCart();
  const navigate = useNavigate();

  if (totalItems === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-20 text-center">
          <ShoppingCart className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-foreground mb-2">Your cart is empty</h1>
          <p className="text-muted-foreground mb-6">Add tests or health packages to get started.</p>
          <Link to="/">
            <Button className="bg-gradient-primary text-primary-foreground font-semibold">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Browse Tests
            </Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-6">Your Cart ({totalItems} items)</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div
                key={`${item.type}-${item.id}`}
                className="bg-card rounded-xl border border-border p-5 flex items-center justify-between gap-4"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-semibold text-primary border border-primary/30 bg-primary/5 px-2 py-0.5 rounded-full uppercase">
                      {item.type}
                    </span>
                  </div>
                  <h3 className="font-bold text-foreground text-lg">{item.name}</h3>
                  {item.parameters && (
                    <p className="text-sm text-muted-foreground">{item.parameters} parameters</p>
                  )}
                  {item.reportTime && (
                    <p className="text-sm text-muted-foreground">Report: {item.reportTime}</p>
                  )}
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-xl font-bold text-foreground whitespace-nowrap">
                    ₹{item.price.toLocaleString("en-IN")}
                  </span>
                  <button
                    onClick={() => removeItem(item.id, item.type)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}

            <button
              onClick={clearCart}
              className="text-sm text-red-500 hover:underline font-medium"
            >
              Clear Cart
            </button>
          </div>

          {/* Order Summary */}
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
              </div>
              <Button
                className="w-full bg-gradient-primary hover:opacity-90 text-primary-foreground font-semibold py-3"
                onClick={() => navigate("/checkout")}
              >
                Proceed to Checkout
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              <Link to="/" className="block text-center text-sm text-primary hover:underline mt-3">
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Cart;
