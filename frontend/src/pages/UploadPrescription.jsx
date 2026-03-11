import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Upload, FileImage, User, Phone, Mail, MapPin, StickyNote, ArrowLeft, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { useLang } from "@/context/LanguageContext";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const UploadPrescription = () => {
  const navigate = useNavigate();
  const { user, token } = useAuth();
  const { t } = useLang();
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [preview, setPreview] = useState(null);

  const [form, setForm] = useState({
    patientName: user?.name || "",
    age: "",
    gender: "",
    phone: user?.phone || "",
    email: user?.email || "",
    address: "",
    notes: "",
    prescriptionImage: "",
    fileName: "",
  });

  if (!user || !token) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="max-w-lg mx-auto px-4 py-20 text-center">
          <Upload className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">{t.loginRequired}</h2>
          <p className="text-muted-foreground mb-6">{t.loginToUpload}</p>
          <Button onClick={() => navigate("/login")} className="bg-gradient-primary text-white px-8">
            {t.goToLogin}
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error(t.fileTooLarge);
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setForm({ ...form, prescriptionImage: reader.result, fileName: file.name });
      setPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.patientName || !form.age || !form.gender || !form.phone || !form.prescriptionImage) {
      toast.error(t.fillAllFields);
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(`${API_BASE}/prescriptions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Upload failed");
      }

      setSubmitted(true);
      toast.success(t.prescriptionUploadedToast);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="max-w-lg mx-auto px-4 py-20 text-center">
          <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-5">
            <CheckCircle2 className="w-10 h-10 text-emerald-600" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2">{t.prescriptionUploaded}</h2>
          <p className="text-muted-foreground mb-8">
            {t.prescriptionUploadedDesc}
          </p>
          <div className="flex gap-3 justify-center">
            <Button variant="outline" onClick={() => navigate("/")} className="gap-2">
              <ArrowLeft className="w-4 h-4" /> {t.backToHome}
            </Button>
            <Button
              onClick={() => { setSubmitted(false); setPreview(null); setForm({ ...form, prescriptionImage: "", fileName: "", notes: "" }); }}
              className="bg-gradient-primary text-white gap-2"
            >
              <Upload className="w-4 h-4" /> {t.uploadAnother}
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="max-w-2xl mx-auto px-4 py-10">
        {/* Back */}
        <button onClick={() => navigate("/")} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" /> {t.backToHome}
        </button>

        {/* Title */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-xl bg-gradient-accent flex items-center justify-center">
            <Upload className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">{t.uploadPrescriptionTitle}</h1>
            <p className="text-sm text-muted-foreground">{t.uploadPrescriptionSubtitle}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Patient Details */}
          <div className="bg-card rounded-2xl border border-border p-6 shadow-sm">
            <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
              <User className="w-4 h-4 text-primary" /> {t.patientDetails}
            </h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-1 block">
                  Patient Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="patientName"
                  value={form.patientName}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2.5 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                  placeholder={t.fullName}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium text-foreground mb-1 block">
                    {t.age} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="age"
                    value={form.age}
                    onChange={handleChange}
                    required
                    min="1"
                    max="150"
                    className="w-full px-3 py-2.5 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                    placeholder={t.age}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-1 block">
                    {t.gender} <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="gender"
                    value={form.gender}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2.5 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                  >
                    <option value="">{t.select}</option>
                    <option value="male">{t.male}</option>
                    <option value="female">{t.female}</option>
                    <option value="other">{t.other}</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Details */}
          <div className="bg-card rounded-2xl border border-border p-6 shadow-sm">
            <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
              <Phone className="w-4 h-4 text-primary" /> {t.contactDetails}
            </h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-1 block">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="tel"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    required
                    className="w-full pl-10 pr-3 py-2.5 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                    placeholder={t.phoneNumber}
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1 block">{t.emailLabel}</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    className="w-full pl-10 pr-3 py-2.5 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                    placeholder={t.emailLabel}
                  />
                </div>
              </div>
              <div className="sm:col-span-2">
                <label className="text-sm font-medium text-foreground mb-1 block">{t.addressLabel}</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                  <textarea
                    name="address"
                    value={form.address}
                    onChange={handleChange}
                    rows={2}
                    className="w-full pl-10 pr-3 py-2.5 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary resize-none"
                    placeholder={t.homeCollectionAddress}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Upload Prescription */}
          <div className="bg-card rounded-2xl border border-border p-6 shadow-sm">
            <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
              <FileImage className="w-4 h-4 text-primary" /> {t.prescriptionUpload} <span className="text-red-500">*</span>
            </h3>

            {!preview ? (
              <label className="block border-2 border-dashed border-border rounded-xl p-8 text-center cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-colors">
                <Upload className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                <p className="font-medium text-foreground mb-1">{t.clickToUpload}</p>
                <p className="text-xs text-muted-foreground">{t.fileFormats}</p>
                <input
                  type="file"
                  accept="image/*,.pdf"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            ) : (
              <div className="relative">
                <div className="rounded-xl overflow-hidden border border-border bg-muted/30">
                  {form.prescriptionImage.startsWith("data:image") ? (
                    <img src={preview} alt="Prescription" className="w-full max-h-64 object-contain" />
                  ) : (
                    <div className="flex items-center gap-3 p-4">
                      <FileImage className="w-8 h-8 text-primary" />
                      <span className="text-sm font-medium">{form.fileName}</span>
                    </div>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => { setPreview(null); setForm({ ...form, prescriptionImage: "", fileName: "" }); }}
                  className="mt-2 text-sm text-red-500 hover:text-red-600 font-medium"
                >
                  {t.removeUpload}
                </button>
              </div>
            )}
          </div>

          {/* Notes */}
          <div className="bg-card rounded-2xl border border-border p-6 shadow-sm">
            <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
              <StickyNote className="w-4 h-4 text-primary" /> {t.additionalNotes}
            </h3>
            <textarea
              name="notes"
              value={form.notes}
              onChange={handleChange}
              rows={3}
              className="w-full px-3 py-2.5 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary resize-none"
              placeholder={t.notesPlaceholder}
            />
          </div>

          {/* Submit */}
          <Button
            type="submit"
            disabled={submitting}
            className="w-full bg-gradient-accent hover:opacity-90 text-white py-6 text-base font-semibold rounded-xl shadow-md"
          >
            {submitting ? t.submittingPrescription : t.submitPrescription}
          </Button>
        </form>
      </div>

      <Footer />
    </div>
  );
};

export default UploadPrescription;
