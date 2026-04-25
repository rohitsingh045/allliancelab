import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle, ChevronLeft, ChevronRight } from "lucide-react";
import { createBooking } from "@/api/client.js";
import { toast } from "sonner";
import { useLang } from "@/context/LanguageContext";
import heroBanner from "@/assets/hero-family.jpg";
import allianceLogo from "@/assets/logo.png";
import { centreCities, defaultCentreCity } from "@/lib/centreLocations";

const AD_IMAGE   = "/ad-hiring.jpeg";
const HERO_H     = "calc(100vh - 120px)"; // nearly full viewport height
const SLIDE_INTERVAL = 4000;       // auto-slide every 4 s

const POSITIONS = ["Front Desk Executive", "Telecaller", "Other"];
const API_BASE  = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export default function HeroSection() {
  const { t } = useLang();

  /* ── slide state ─────────────────────────────────────── */
  const [current,  setCurrent]  = useState(0);
  const [paused,   setPaused]   = useState(false);
  const TOTAL = 2;

  const next = useCallback(() => setCurrent(c => (c + 1) % TOTAL), []);
  const prev = useCallback(() => setCurrent(c => (c - 1 + TOTAL) % TOTAL), []);

  // auto-slide
  useEffect(() => {
    if (paused) return;
    const id = setInterval(next, SLIDE_INTERVAL);
    return () => clearInterval(id);
  }, [paused, next]);

  /* ── booking form ────────────────────────────────────── */
  const [formData,  setFormData]  = useState({ name: "", phone: "", city: defaultCentreCity });
  const [submitted, setSubmitted] = useState(false);
  const [loading,   setLoading]   = useState(false);

  const handleBooking = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.phone.trim()) return;
    setLoading(true);
    try {
      await createBooking(formData);
      setSubmitted(true);
      setFormData({ name: "", phone: "", city: defaultCentreCity });
      toast.success(t.bookingReceivedToast);
      setTimeout(() => setSubmitted(false), 3000);
    } catch { toast.error(t.bookingFailed); }
    finally  { setLoading(false); }
  };

  /* ── job form ────────────────────────────────────────── */
  const [showJob,      setShowJob]      = useState(false);
  const [jobForm,      setJobForm]      = useState({ name: "", phone: "", email: "", position: "", experience: "", message: "" });
  const [jobSending,   setJobSending]   = useState(false);
  const [jobDone,      setJobDone]      = useState(false);
  const [jobErr,       setJobErr]       = useState("");

  const handleJob = async (e) => {
    e.preventDefault();
    setJobErr("");
    if (!jobForm.name.trim())  return setJobErr("Please enter your name.");
    if (!jobForm.phone.trim()) return setJobErr("Please enter your phone.");
    if (!jobForm.position)     return setJobErr("Please select a position.");
    setJobSending(true);
    try {
      const res  = await fetch(`${API_BASE}/job-applications`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(jobForm),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      setJobDone(true);
      setTimeout(() => {
        setShowJob(false); setJobDone(false);
        setJobForm({ name: "", phone: "", email: "", position: "", experience: "", message: "" });
      }, 3000);
    } catch (err) { setJobErr(err.message); }
    finally       { setJobSending(false); }
  };

  /* ── render ──────────────────────────────────────────── */
  return (
    <section
      style={{ height: HERO_H, minHeight: 420, maxHeight: 700, position: "relative", overflow: "hidden" }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* ════ SLIDES TRACK ══════════════════════════════════════ */}
      <div style={{
        display: "flex",
        width: `${TOTAL * 100}%`,
        height: "100%",
        transform: `translateX(-${(current * 100) / TOTAL}%)`,
        transition: "transform 0.6s cubic-bezier(0.77,0,0.18,1)",
      }}>

        {/* ── SLIDE 1 : Hero ────────────────────────────────── */}
        <div style={{ width: `${100 / TOTAL}%`, height: "100%", position: "relative", flexShrink: 0 }}>
          {/* bg */}
          <img src={heroBanner} alt="Alliance Diagnostic" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "top" }} />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, rgba(15,23,42,0.82) 0%, rgba(15,23,42,0.55) 55%, transparent 100%)" }} />

          {/* content */}
          <div style={{ position: "relative", height: "100%", display: "flex", alignItems: "center", padding: "0 5%" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32, width: "100%", maxWidth: 1200, margin: "0 auto" }}>

              {/* left */}
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 16px", borderRadius: 50, background: "rgba(16,185,129,0.2)", border: "1px solid rgba(16,185,129,0.35)", width: "fit-content" }}>
                  <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#10b981" }} />
                  <span style={{ fontSize: "0.8rem", fontWeight: 600, color: "#6ee7b7" }}>{t.trustedDiagnosticLab}</span>
                </div>
                <h2 style={{ fontSize: "clamp(1.5rem,3vw,2.6rem)", fontWeight: 900, color: "#fff", lineHeight: 1.2, margin: 0 }}>
                  {t.heroTitle} <span style={{ color: "#10b981" }}>{t.heroHighlight}</span>
                </h2>
                <div style={{ background: "rgba(255,255,255,0.12)", backdropFilter: "blur(8px)", borderRadius: 12, padding: "10px 18px", border: "1px solid rgba(255,255,255,0.2)", display: "inline-block" }}>
                  <p style={{ color: "#fff", fontWeight: 700, fontSize: "1rem", margin: 0 }}>
                    {t.packagesStartingFrom} <span style={{ color: "#34d399", fontSize: "1.4rem" }}>₹349</span>
                  </p>
                </div>
                <button
                  onClick={() => { const el = document.getElementById("health-packages"); if (el) el.scrollIntoView({ behavior: "smooth" }); }}
                  style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "linear-gradient(135deg,#059669,#10b981)", color: "#fff", fontWeight: 700, fontSize: "0.9rem", padding: "12px 24px", borderRadius: 12, border: "none", cursor: "pointer", width: "fit-content", boxShadow: "0 4px 18px rgba(16,185,129,0.4)" }}
                >
                  {t.explorePackages} <ArrowRight size={18} />
                </button>
              </div>

              {/* booking form */}
              <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center" }}>
                <div style={{ background: "rgba(255,255,255,0.97)", borderRadius: 18, padding: "20px 22px", width: "100%", maxWidth: 320, boxShadow: "0 12px 40px rgba(0,0,0,0.25)" }}>
                  <h3 style={{ fontWeight: 800, fontSize: "1rem", margin: "0 0 2px", color: "#0f172a" }}>{t.bookFreeHomeCollection}</h3>
                  <p style={{ fontSize: "0.75rem", color: "#64748b", margin: "0 0 14px" }}>{t.phlebotomistVisit}</p>
                  {submitted ? (
                    <div style={{ textAlign: "center", padding: "20px 0" }}>
                      <CheckCircle size={40} color="#10b981" style={{ margin: "0 auto 8px" }} />
                      <p style={{ fontWeight: 700, color: "#0f172a" }}>{t.bookingReceived}</p>
                      <p style={{ fontSize: "0.78rem", color: "#64748b" }}>{t.callYouShortly}</p>
                    </div>
                  ) : (
                    <form onSubmit={handleBooking} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                      {[
                        { ph: t.fullName,      key: "name",  type: "text" },
                        { ph: t.contactNumber, key: "phone", type: "tel" },
                      ].map(f => (
                        <input key={f.key} type={f.type} placeholder={f.ph} required value={formData[f.key]}
                          onChange={e => setFormData({ ...formData, [f.key]: f.key === "phone" ? e.target.value.replace(/\D/g,"").slice(0,10) : e.target.value })}
                          style={bInp} />
                      ))}
                      <select value={formData.city} onChange={e => setFormData({ ...formData, city: e.target.value })} style={bInp}>
                        {centreCities.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                      <button type="submit" disabled={loading}
                        style={{ background: "linear-gradient(135deg,#7c3aed,#6d28d9)", color: "#fff", fontWeight: 700, fontSize: "0.88rem", padding: "11px", borderRadius: 10, border: "none", cursor: "pointer" }}>
                        {loading ? t.submitting : t.bookFreeHomeCollection}
                      </button>
                    </form>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── SLIDE 2 : Hiring Ad ────────────────────────────── */}
        <div
          style={{ width: `${100 / TOTAL}%`, height: "100%", flexShrink: 0, position: "relative", cursor: showJob ? "default" : "pointer" }}
          onClick={() => { if (!showJob) setShowJob(true); }}
        >
          {!showJob ? (
            /* full ad image */
            <>
              <img src={AD_IMAGE} alt="Alliance Diagnostic – We Are Hiring!" style={{ width: "100%", height: "100%", objectFit: "contain", objectPosition: "center", display: "block", background: "#ffffff" }} draggable={false} />
              {/* pulsing badge */}
              <div style={{
                position: "absolute", bottom: 24, left: "50%", transform: "translateX(-50%)",
                background: "linear-gradient(135deg,#7c3aed,#4f46e5)", color: "#fff",
                fontWeight: 700, fontSize: "0.9rem", padding: "10px 28px", borderRadius: 50,
                boxShadow: "0 6px 28px rgba(79,70,229,0.55)", border: "2px solid rgba(255,255,255,0.3)",
                whiteSpace: "nowrap", pointerEvents: "none",
                animation: "heroPulse 2s ease-in-out infinite",
              }}>
                🚀 Click to Apply Now!
              </div>
            </>
          ) : (
            /* job application form overlay */
            <div
              style={{ width: "100%", height: "100%", background: "linear-gradient(135deg,#f0fdf4,#dcfce7)", display: "flex", alignItems: "center", justifyContent: "center", padding: "16px", boxSizing: "border-box", overflowY: "auto" }}
              onClick={e => e.stopPropagation()}
            >
              <div style={{ background: "#fff", borderRadius: 18, boxShadow: "0 16px 50px rgba(0,0,0,0.15)", width: "100%", maxWidth: 580, overflow: "hidden" }}>
                {/* header */}
                <div style={{ background: "linear-gradient(135deg,#14532d,#166534)", padding: "14px 20px", display: "flex", flexDirection: "column", alignItems: "center", gap: 8, position: "relative" }}>
                  <div style={{ background: "#fff", borderRadius: 10, padding: "5px 16px", boxShadow: "0 4px 12px rgba(0,0,0,0.15)" }}>
                    <img src={allianceLogo} alt="Alliance Diagnostic" style={{ height: 38, width: "auto", display: "block" }} />
                  </div>
                  <h2 style={{ color: "#fff", fontWeight: 800, fontSize: "0.95rem", margin: 0 }}>Join Alliance Diagnostic</h2>
                  <button onClick={() => setShowJob(false)} style={{ position: "absolute", top: 10, left: 12, color: "rgba(255,255,255,0.7)", background: "none", border: "none", cursor: "pointer", fontSize: "0.72rem", textDecoration: "underline" }}>← Back</button>
                </div>

                {jobDone ? (
                  <div style={{ padding: "30px 20px", textAlign: "center" }}>
                    <div style={{ fontSize: "2.5rem" }}>🎉</div>
                    <p style={{ fontWeight: 800, color: "#14532d", fontSize: "1rem", margin: "8px 0 4px" }}>Application Submitted!</p>
                    <p style={{ color: "#64748b", fontSize: "0.82rem" }}>Thank you <strong>{jobForm.name}</strong>! We'll contact you at <strong>{jobForm.phone}</strong>.</p>
                  </div>
                ) : (
                  <form onSubmit={handleJob} style={{ padding: "14px 18px", display: "flex", flexDirection: "column", gap: 8 }}>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                      <input name="name"     value={jobForm.name}     onChange={e => setJobForm(p=>({...p,name:e.target.value}))}     placeholder="Full Name *"            style={jInp} />
                      <input name="phone"    value={jobForm.phone}    onChange={e => setJobForm(p=>({...p,phone:e.target.value}))}    placeholder="Phone / WhatsApp *"     style={jInp} />
                      <input name="email"    value={jobForm.email}    onChange={e => setJobForm(p=>({...p,email:e.target.value}))}    placeholder="Email (optional)"       style={jInp} type="email" />
                      <select name="position" value={jobForm.position} onChange={e => setJobForm(p=>({...p,position:e.target.value}))} style={jInp}>
                        <option value="">Select Position *</option>
                        {POSITIONS.map(p => <option key={p} value={p}>{p}</option>)}
                      </select>
                    </div>
                    <input name="experience" value={jobForm.experience} onChange={e => setJobForm(p=>({...p,experience:e.target.value}))} placeholder="Experience (optional)" style={jInp} />
                    {jobErr && <p style={{ color: "#e11d48", fontSize: "0.75rem", background: "#fff1f2", border: "1px solid #fecdd3", borderRadius: 8, padding: "6px 10px", margin: 0 }}>⚠️ {jobErr}</p>}
                    <button type="submit" disabled={jobSending}
                      style={{ background: "linear-gradient(135deg,#15803d,#166534)", color: "#fff", fontWeight: 700, fontSize: "0.88rem", padding: "11px", borderRadius: 10, border: "none", cursor: "pointer", boxShadow: "0 4px 14px rgba(21,128,61,0.3)" }}>
                      {jobSending ? "Submitting…" : "🚀 Submit Application"}
                    </button>
                  </form>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── LEFT ARROW ──────────────────────────────────────── */}
      <button onClick={e => { e.stopPropagation(); prev(); }} aria-label="Previous" style={arrowStyle("left")}>
        <ChevronLeft size={20} color="#1e293b" />
      </button>

      {/* ── RIGHT ARROW ─────────────────────────────────────── */}
      <button onClick={e => { e.stopPropagation(); next(); }} aria-label="Next" style={arrowStyle("right")}>
        <ChevronRight size={20} color="#1e293b" />
      </button>

      {/* ── DOT INDICATORS ──────────────────────────────────── */}
      <div style={{ position: "absolute", bottom: 12, left: "50%", transform: "translateX(-50%)", zIndex: 20, display: "flex", gap: 7 }}>
        {[0, 1].map(i => (
          <button key={i} onClick={() => setCurrent(i)} style={{
            width: current === i ? 24 : 10, height: 10, borderRadius: 5, border: "none", padding: 0, cursor: "pointer",
            background: current === i ? "#16a34a" : "rgba(255,255,255,0.65)",
            boxShadow: "0 1px 4px rgba(0,0,0,0.25)", transition: "width 0.35s, background 0.35s",
          }} />
        ))}
      </div>

      <style>{`
        @keyframes heroPulse {
          0%,100% { transform: translateX(-50%) scale(1);    box-shadow: 0 6px 28px rgba(79,70,229,0.5); }
          50%      { transform: translateX(-50%) scale(1.06); box-shadow: 0 8px 36px rgba(79,70,229,0.7); }
        }
      `}</style>
    </section>
  );
}

/* ── shared styles ── */
const bInp = {
  width: "100%", padding: "9px 12px", borderRadius: 10, border: "1.5px solid #e2e8f0",
  fontSize: "0.82rem", color: "#1e293b", outline: "none", boxSizing: "border-box", background: "#f8fafc",
};
const jInp = {
  width: "100%", padding: "8px 11px", borderRadius: 9, border: "1.5px solid #e2e8f0",
  fontSize: "0.81rem", color: "#1e293b", outline: "none", boxSizing: "border-box", background: "#fff",
};
const arrowStyle = (side) => ({
  position: "absolute", [side]: 12, top: "50%", transform: "translateY(-50%)",
  zIndex: 20, width: 38, height: 38, borderRadius: "50%",
  background: "rgba(255,255,255,0.88)", border: "none", cursor: "pointer",
  display: "flex", alignItems: "center", justifyContent: "center",
  boxShadow: "0 2px 10px rgba(0,0,0,0.2)",
});
