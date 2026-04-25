import { useState, useEffect } from "react";
import {
  X, Send, Briefcase, Phone, Mail, User,
  MessageSquare, ChevronDown, CheckCircle, Sparkles,
} from "lucide-react";
import allianceLogo from "@/assets/logo.png";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// Ad image served from /public/ad-hiring.png
const AD_IMAGE_SRC = "/ad-hiring.jpeg";

const POSITIONS = ["Front Desk Executive", "Telecaller", "Other"];

export default function AdPopup() {
  const [visible, setVisible]     = useState(false);
  const [showForm, setShowForm]   = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError]         = useState("");
  const [form, setForm] = useState({
    name: "", phone: "", email: "", position: "", experience: "", message: "",
  });

  // Show popup on every page load after a short delay
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 600);
    return () => clearTimeout(t);
  }, []);

  const handleClose = () => {
    setVisible(false);
    setShowForm(false);
    setSubmitted(false);
    setError("");
    setForm({ name: "", phone: "", email: "", position: "", experience: "", message: "" });
  };

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.name.trim())  return setError("Please enter your name.");
    if (!form.phone.trim()) return setError("Please enter your phone number.");
    if (!form.position)     return setError("Please select a position.");

    setSubmitting(true);
    try {
      const res = await fetch(`${API_BASE}/job-applications`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Submission failed");
      setSubmitted(true);
      setTimeout(handleClose, 3500);
    } catch (err) {
      setError(err.message || "Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!visible) return null;

  return (
    <>
      {/* ── Backdrop ─────────────────────────────────────────────────── */}
      <div
        className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-6"
        style={{ background: "rgba(0,0,0,0.78)", backdropFilter: "blur(8px)" }}
        onClick={!showForm ? handleClose : undefined}
      >
        {/* ── Modal Card ───────────────────────────────────────────── */}
        <div
          className="relative w-full max-w-2xl rounded-2xl overflow-hidden shadow-[0_25px_60px_rgba(0,0,0,0.6)] ad-popup-enter"
          onClick={(e) => e.stopPropagation()}
        >
          {/* ── Close Button (always visible, top-right) ──────────── */}
          <button
            id="ad-popup-close"
            onClick={handleClose}
            aria-label="Close advertisement"
            title="Close"
            style={{
              position: "absolute",
              top: "10px",
              right: "10px",
              zIndex: 30,
              width: "38px",
              height: "38px",
              borderRadius: "50%",
              background: "rgba(220,38,38,0.92)",
              border: "2px solid rgba(255,255,255,0.6)",
              color: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              boxShadow: "0 4px 16px rgba(0,0,0,0.4)",
              transition: "transform 0.15s, background 0.15s",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = "scale(1.15)"; e.currentTarget.style.background = "rgba(185,28,28,1)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.background = "rgba(220,38,38,0.92)"; }}
          >
            <X size={18} strokeWidth={3} />
          </button>

          {/* ── AD IMAGE ─────────────────────────────────────────── */}
          {!showForm && (
            <div
              id="ad-popup-image"
              className="relative cursor-pointer group"
              onClick={() => setShowForm(true)}
            >
              <img
                src={AD_IMAGE_SRC}
                alt="Alliance Diagnostic – We Are Hiring!"
                className="w-full select-none block"
                style={{ width: "100%", height: "auto", display: "block" }}
                draggable={false}
              />

              {/* Gradient overlay at bottom */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: "linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 55%)",
                  display: "flex",
                  alignItems: "flex-end",
                  justifyContent: "center",
                  paddingBottom: "20px",
                  opacity: 0,
                  transition: "opacity 0.25s",
                }}
                className="group-hover:!opacity-100"
              >
                <span
                  style={{
                    background: "linear-gradient(135deg,#16a34a,#15803d)",
                    color: "#fff",
                    fontWeight: 700,
                    fontSize: "0.9rem",
                    padding: "10px 22px",
                    borderRadius: "50px",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.35)",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    letterSpacing: "0.02em",
                    border: "1.5px solid rgba(255,255,255,0.3)",
                  }}
                >
                  <Sparkles size={16} />
                  Tap to Apply Now!
                </span>
              </div>

              {/* "Click to Apply" badge - always visible */}
              <div
                style={{
                  position: "absolute",
                  bottom: "14px",
                  left: "50%",
                  transform: "translateX(-50%)",
                  background: "linear-gradient(135deg,#7c3aed,#4f46e5)",
                  color: "#fff",
                  fontWeight: 700,
                  fontSize: "0.78rem",
                  padding: "7px 18px",
                  borderRadius: "50px",
                  boxShadow: "0 4px 20px rgba(79,70,229,0.45)",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  whiteSpace: "nowrap",
                  border: "1.5px solid rgba(255,255,255,0.25)",
                  animation: "pulseBadge 2s ease-in-out infinite",
                }}
              >
                <Briefcase size={13} />
                Click here to Apply
              </div>
            </div>
          )}

          {/* ── JOB APPLICATION FORM ─────────────────────────────── */}
          {showForm && (
            <div style={{ background: "#fff" }}>
              {/* ── Logo Banner ── */}
              <div
                style={{
                  background: "linear-gradient(135deg,#14532d 0%,#166534 60%,#15803d 100%)",
                  padding: "18px 24px 14px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "10px",
                  borderBottom: "3px solid rgba(255,255,255,0.15)",
                }}
              >
                {/* Alliance Logo */}
                <div
                  style={{
                    background: "#fff",
                    borderRadius: "14px",
                    padding: "8px 20px",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.25)",
                    border: "2px solid rgba(255,255,255,0.4)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <img
                    src={allianceLogo}
                    alt="Alliance Diagnostic Logo"
                    style={{ height: "52px", width: "auto", display: "block" }}
                  />
                </div>

                {/* Title + subtitle */}
                <div style={{ textAlign: "center" }}>
                  <h2 style={{ color: "#fff", fontWeight: 800, fontSize: "1.05rem", margin: 0, lineHeight: 1.3, letterSpacing: "0.01em" }}>
                    Join Alliance Diagnostic
                  </h2>
                  <p style={{ color: "rgba(255,255,255,0.72)", fontSize: "0.73rem", margin: "3px 0 0" }}>
                    Fill in your details — we'll reach out shortly!
                  </p>
                </div>

                {/* Back to Ad link */}
                <button
                  onClick={() => setShowForm(false)}
                  style={{
                    position: "absolute",
                    top: "10px",
                    left: "12px",
                    color: "rgba(255,255,255,0.65)",
                    fontSize: "0.72rem",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    textDecoration: "underline",
                    padding: "4px",
                  }}
                >
                  ← Back
                </button>
              </div>

              {submitted ? (
                /* Success State */
                <div style={{ padding: "48px 24px", textAlign: "center" }}>
                  <div style={{ width: 72, height: 72, borderRadius: "50%", background: "#dcfce7", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", animation: "bounceOnce 0.6s ease" }}>
                    <CheckCircle size={40} color="#16a34a" />
                  </div>
                  <p style={{ fontSize: "1.2rem", fontWeight: 800, color: "#1e293b", margin: "0 0 8px" }}>
                    Application Submitted! 🎉
                  </p>
                  <p style={{ color: "#64748b", fontSize: "0.9rem", margin: "0 0 6px" }}>
                    Thank you <strong>{form.name}</strong>! We will contact you at <strong>{form.phone}</strong> soon.
                  </p>
                  <p style={{ color: "#94a3b8", fontSize: "0.78rem" }}>
                    This popup will close automatically…
                  </p>
                </div>
              ) : (
                /* Form Fields */
                <form onSubmit={handleSubmit} style={{ padding: "20px 24px", display: "flex", flexDirection: "column", gap: "14px" }}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                    {/* Name */}
                    <div>
                      <label style={labelStyle}>Full Name *</label>
                      <div style={{ position: "relative" }}>
                        <User size={13} style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }} />
                        <input
                          name="name"
                          value={form.name}
                          onChange={handleChange}
                          placeholder="Your full name"
                          style={{ ...inputStyle, paddingLeft: 30 }}
                        />
                      </div>
                    </div>

                    {/* Phone */}
                    <div>
                      <label style={labelStyle}>Phone / WhatsApp *</label>
                      <div style={{ position: "relative" }}>
                        <Phone size={13} style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }} />
                        <input
                          name="phone"
                          value={form.phone}
                          onChange={handleChange}
                          placeholder="10-digit mobile number"
                          style={{ ...inputStyle, paddingLeft: 30 }}
                        />
                      </div>
                    </div>

                    {/* Email */}
                    <div>
                      <label style={labelStyle}>Email (optional)</label>
                      <div style={{ position: "relative" }}>
                        <Mail size={13} style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }} />
                        <input
                          name="email"
                          type="email"
                          value={form.email}
                          onChange={handleChange}
                          placeholder="you@email.com"
                          style={{ ...inputStyle, paddingLeft: 30 }}
                        />
                      </div>
                    </div>

                    {/* Position */}
                    <div>
                      <label style={labelStyle}>Position Applied For *</label>
                      <div style={{ position: "relative" }}>
                        <ChevronDown size={13} style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", color: "#94a3b8", pointerEvents: "none" }} />
                        <select
                          name="position"
                          value={form.position}
                          onChange={handleChange}
                          style={{ ...inputStyle, paddingRight: 28, appearance: "none", background: "#fff" }}
                        >
                          <option value="">Select position…</option>
                          {POSITIONS.map((p) => (
                            <option key={p} value={p}>{p}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Experience */}
                  <div>
                    <label style={labelStyle}>Experience (optional)</label>
                    <input
                      name="experience"
                      value={form.experience}
                      onChange={handleChange}
                      placeholder="e.g. 2 years in customer service"
                      style={inputStyle}
                    />
                  </div>

                  {/* Message */}
                  <div>
                    <label style={labelStyle}>Message (optional)</label>
                    <div style={{ position: "relative" }}>
                      <MessageSquare size={13} style={{ position: "absolute", left: 10, top: 11, color: "#94a3b8" }} />
                      <textarea
                        name="message"
                        value={form.message}
                        onChange={handleChange}
                        rows={2}
                        placeholder="Tell us a bit about yourself…"
                        style={{ ...inputStyle, paddingLeft: 30, resize: "none" }}
                      />
                    </div>
                  </div>

                  {error && (
                    <p style={{ color: "#e11d48", fontSize: "0.78rem", background: "#fff1f2", border: "1px solid #fecdd3", borderRadius: 8, padding: "8px 12px", margin: 0 }}>
                      ⚠️ {error}
                    </p>
                  )}

                  <button
                    id="ad-popup-submit"
                    type="submit"
                    disabled={submitting}
                    style={{
                      background: submitting ? "#86efac" : "linear-gradient(135deg,#15803d,#166534)",
                      color: "#fff",
                      fontWeight: 700,
                      fontSize: "0.9rem",
                      padding: "12px",
                      borderRadius: 12,
                      border: "none",
                      cursor: submitting ? "not-allowed" : "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 8,
                      boxShadow: "0 4px 18px rgba(21,128,61,0.35)",
                      transition: "transform 0.15s, box-shadow 0.15s",
                    }}
                    onMouseEnter={(e) => { if (!submitting) e.currentTarget.style.transform = "translateY(-1px)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; }}
                  >
                    {submitting ? (
                      <>
                        <div style={{ width: 16, height: 16, border: "2.5px solid rgba(255,255,255,0.4)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />
                        Submitting…
                      </>
                    ) : (
                      <>
                        <Send size={15} />
                        Submit Application
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ── Global styles / keyframes ────────────────────────────────── */}
      <style>{`
        .ad-popup-enter {
          animation: adPopupIn 0.4s cubic-bezier(0.22, 1, 0.36, 1) both;
        }
        @keyframes adPopupIn {
          from { opacity: 0; transform: scale(0.85) translateY(30px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes pulseBadge {
          0%, 100% { transform: translateX(-50%) scale(1); box-shadow: 0 4px 20px rgba(79,70,229,0.45); }
          50%       { transform: translateX(-50%) scale(1.05); box-shadow: 0 6px 28px rgba(79,70,229,0.65); }
        }
        @keyframes bounceOnce {
          0%   { transform: scale(0.6); opacity: 0; }
          60%  { transform: scale(1.15); opacity: 1; }
          100% { transform: scale(1); }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </>
  );
}

/* ── Shared inline styles ──────────────────────────────────────────── */
const labelStyle = {
  display: "block",
  fontSize: "0.72rem",
  fontWeight: 600,
  color: "#475569",
  marginBottom: "4px",
  textTransform: "uppercase",
  letterSpacing: "0.04em",
};

const inputStyle = {
  width: "100%",
  padding: "9px 12px",
  borderRadius: "10px",
  border: "1.5px solid #e2e8f0",
  fontSize: "0.85rem",
  color: "#1e293b",
  outline: "none",
  transition: "border-color 0.15s, box-shadow 0.15s",
  boxSizing: "border-box",
};
