import { useState, useEffect } from "react";
import { X, Send, Briefcase, Phone, Mail, User, MessageSquare, ChevronDown, CheckCircle } from "lucide-react";
import allianceLogo from "@/assets/logo.png";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5005/api";

// ── The actual hiring image (base64 embedded so no file-hosting needed) ──────
// Replace the src below with "/ad-hiring.jpg" once you copy your image to /public
const AD_IMAGE_SRC = "/ad-hiring.jpeg";

const POSITIONS = ["Front Desk Executive", "Telecaller", "Other"];

const statusStyle = {
  new: "bg-blue-100 text-blue-800 border border-blue-200",
  reviewed: "bg-yellow-100 text-yellow-800 border border-yellow-200",
  shortlisted: "bg-emerald-100 text-emerald-800 border border-emerald-200",
  rejected: "bg-rose-100 text-rose-800 border border-rose-200",
};

export default function AdPopup() {
  const [visible, setVisible] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    position: "",
    experience: "",
    message: "",
  });

  // Show the popup after a short delay on every page load
  // (uses sessionStorage so it shows once per browser session)
  useEffect(() => {
    const alreadySeen = sessionStorage.getItem("ad_seen");
    if (!alreadySeen) {
      const t = setTimeout(() => setVisible(true), 800);
      return () => clearTimeout(t);
    }
  }, []);

  const handleClose = () => {
    sessionStorage.setItem("ad_seen", "1");
    setVisible(false);
    setShowForm(false);
    setSubmitted(false);
    setError("");
  };

  const handleAdClick = () => {
    setShowForm(true);
  };

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.name.trim()) return setError("Please enter your name.");
    if (!form.phone.trim()) return setError("Please enter your phone number.");
    if (!form.position) return setError("Please select a position.");

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
      setTimeout(handleClose, 3000);
    } catch (err) {
      setError(err.message || "Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!visible) return null;

  return (
    <>
      {/* ── Backdrop ─────────────────────────────────────────────────────── */}
      <div
        className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
        style={{ background: "rgba(0,0,0,0.72)", backdropFilter: "blur(6px)" }}
        onClick={!showForm ? handleClose : undefined}
      >
        {/* ── Modal card ───────────────────────────────────────────────── */}
        <div
          className="relative w-full max-w-2xl rounded-2xl overflow-hidden shadow-2xl animate-fadeInScale"
          onClick={(e) => e.stopPropagation()}
          style={{
            animation: "fadeInScale 0.35s cubic-bezier(.22,1,.36,1) both",
          }}
        >
          {/* ── Close button (always visible) ───────────────────────── */}
          <button
            onClick={handleClose}
            aria-label="Close advertisement"
            className="absolute top-3 right-3 z-20 w-9 h-9 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center transition-all hover:scale-110 shadow-lg border border-white/20"
          >
            <X size={18} strokeWidth={2.5} />
          </button>

          {/* ── AD IMAGE (click → open form) ─────────────────────── */}
          {!showForm && (
            <div className="relative cursor-pointer group" onClick={handleAdClick}>
              <img
                src={AD_IMAGE_SRC}
                alt="Alliance Diagnostic – We Are Hiring!"
                className="w-full object-cover select-none"
                style={{ maxHeight: "520px", objectPosition: "center" }}
                draggable={false}
              />
              {/* Hover overlay hint */}
              <div className="absolute inset-0 bg-green-900/0 group-hover:bg-green-900/20 transition-colors duration-300 flex items-end justify-center pb-5 opacity-0 group-hover:opacity-100">
                <span className="bg-white text-green-800 font-bold px-5 py-2 rounded-full shadow-lg text-sm tracking-wide flex items-center gap-2 border-2 border-green-600">
                  <Briefcase size={15} />
                  Apply Now — Tap to fill Application
                </span>
              </div>
            </div>
          )}

          {/* ── JOB APPLICATION FORM ─────────────────────────────── */}
          {showForm && (
            <div className="bg-white">
              {/* Form header */}
              <div
                className="px-6 py-4 flex items-center gap-3"
                style={{
                  background: "linear-gradient(135deg,#1a6b3c 0%,#2e8b57 60%,#4b0082 100%)",
                }}
              >
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                  <Briefcase size={20} className="text-white" />
                </div>
                <div>
                  <h2 className="text-white font-bold text-lg leading-tight">
                    Join Alliance Diagnostic
                  </h2>
                  <p className="text-green-200 text-xs">
                    Fill in your details — we'll reach out shortly!
                  </p>
                </div>
                <button
                  onClick={() => setShowForm(false)}
                  className="ml-auto text-white/70 hover:text-white text-xs underline"
                >
                  ← Back to Ad
                </button>
              </div>

              {submitted ? (
                /* ── Success state ─────────────────────────────── */
                <div className="flex flex-col items-center justify-center py-14 px-6 gap-4">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center animate-bounce">
                    <CheckCircle size={36} className="text-emerald-500" />
                  </div>
                  <p className="text-slate-800 font-bold text-xl">Application Submitted! 🎉</p>
                  <p className="text-slate-500 text-sm text-center">
                    Thank you <strong>{form.name}</strong>! We will contact you at{" "}
                    <strong>{form.phone}</strong> soon.
                  </p>
                  <p className="text-xs text-slate-400">This popup will close automatically…</p>
                </div>
              ) : (
                /* ── Form fields ───────────────────────────────── */
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    {/* Name */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">
                        Full Name *
                      </label>
                      <div className="relative">
                        <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                          name="name"
                          value={form.name}
                          onChange={handleChange}
                          placeholder="Your full name"
                          className="w-full pl-8 pr-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent"
                        />
                      </div>
                    </div>

                    {/* Phone */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">
                        Phone / WhatsApp *
                      </label>
                      <div className="relative">
                        <Phone size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                          name="phone"
                          value={form.phone}
                          onChange={handleChange}
                          placeholder="10-digit mobile number"
                          className="w-full pl-8 pr-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent"
                        />
                      </div>
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">
                        Email (optional)
                      </label>
                      <div className="relative">
                        <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                          name="email"
                          type="email"
                          value={form.email}
                          onChange={handleChange}
                          placeholder="you@email.com"
                          className="w-full pl-8 pr-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent"
                        />
                      </div>
                    </div>

                    {/* Position */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">
                        Position Applied For *
                      </label>
                      <div className="relative">
                        <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                        <select
                          name="position"
                          value={form.position}
                          onChange={handleChange}
                          className="w-full pl-3 pr-8 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent appearance-none bg-white"
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
                    <label className="block text-xs font-semibold text-slate-600 mb-1">
                      Experience (optional)
                    </label>
                    <input
                      name="experience"
                      value={form.experience}
                      onChange={handleChange}
                      placeholder="e.g. 2 years in customer service"
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent"
                    />
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">
                      Message (optional)
                    </label>
                    <div className="relative">
                      <MessageSquare size={14} className="absolute left-3 top-3 text-slate-400" />
                      <textarea
                        name="message"
                        value={form.message}
                        onChange={handleChange}
                        rows={3}
                        placeholder="Tell us a bit about yourself…"
                        className="w-full pl-8 pr-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent resize-none"
                      />
                    </div>
                  </div>

                  {error && (
                    <p className="text-rose-600 text-xs bg-rose-50 border border-rose-200 rounded-lg px-3 py-2">
                      ⚠️ {error}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-3 rounded-xl font-bold text-white text-sm flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-60"
                    style={{
                      background: "linear-gradient(135deg,#1a6b3c,#2e8b57)",
                      boxShadow: "0 4px 15px rgba(30,111,61,0.35)",
                    }}
                  >
                    {submitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
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

      {/* ── Keyframe animation ─────────────────────────────────────────────── */}
      <style>{`
        @keyframes fadeInScale {
          from { opacity: 0; transform: scale(0.88) translateY(24px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </>
  );
}
