/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle, Mail, MapPin, Search, ShieldCheck } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import PublicHeader from "../components/PublicHeader";
import { usePublicStore } from "../store/publicStore";
import RiskHeatmap from "./RiskHeatMap";

export default function Home() {
  const {
    jobs,
    verification,
    // selectedCompany,
    loading,
    fetchJobs,
    verifyCompany,
    getCompanyById,
  } = usePublicStore();

  const [cacRc, setCacRc] = useState("");
  const [searchTerm, _setSearchTerm] = useState("");
  const [jobModal, setJobModal] = useState<any>(null);
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [showCompanyModal, setShowCompanyModal] = useState(false);

  // Contact Form
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [sending, setSending] = useState(false);

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleVerify = async () => {
    if (!cacRc.trim()) return;
    await verifyCompany(cacRc.trim().toUpperCase());
  };

  const openJobModal = (job: any) => setJobModal(job);

  // const openCompanyProfile = (companyId: string) => {
  //   getCompanyById(companyId);
  //   setShowCompanyModal(true);
  // };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);

    try {
      const response = await fetch("http://localhost:8000/api/public/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(contactForm),
      });

      const result = await response.json();

      if (!response.ok) throw new Error(result.error || "Failed to send");

      toast.success("Message sent successfully!");
      setContactForm({ name: "", email: "", subject: "", message: "" });
    } catch (error: any) {
      toast.error(error.message || "Failed to send message");
    } finally {
      setSending(false);
    }
  };

  const filteredJobs = jobs.filter(
    (job) =>
      job.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company?.name?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <PublicHeader />

      {/* Hero */}
      <section className="bg-gradient-to-br from-orange-600 to-amber-600 text-white py-20">
        <div className="max-w-4xl mx-auto text-center px-6">
          <h1 className="text-6xl font-bold tracking-tight mb-6">
            Know Before You Go
          </h1>
          <p className="text-xl opacity-90">
            Verify companies instantly. Only trust verified job opportunities.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Jobs Section */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-4xl font-bold">Verified Jobs</h2>

          <Dialog open={showVerifyModal} onOpenChange={setShowVerifyModal}>
            {/* Removed asChild */}
            <DialogTrigger>
              <Button size="lg" className="bg-orange-600 hover:bg-orange-700">
                <Search className="mr-2 h-5 w-5" />
                Verify Company
              </Button>
            </DialogTrigger>
            {/* Verify Modal Content */}
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Verify a Company</DialogTitle>
              </DialogHeader>
              <div className="space-y-6 py-4">
                <Input
                  value={cacRc}
                  onChange={(e) => setCacRc(e.target.value.toUpperCase())}
                  placeholder="RC123456"
                  className="h-14 text-lg"
                />
                <Button
                  onClick={handleVerify}
                  disabled={loading}
                  className="w-full h-14"
                >
                  {loading ? "Verifying..." : "Verify"}
                </Button>

                {verification && (
                  <div
                    className={`p-6 rounded-2xl ${verification.isVerifiedRegistry ? "bg-green-50" : "bg-red-50"}`}
                  >
                    {verification.isVerifiedRegistry && verification.company ? (
                      <div className="space-y-4">
                        <div className="flex items-center gap-4">
                          <CheckCircle className="h-10 w-10 text-green-600" />
                          <div>
                            <h3 className="text-2xl font-bold">
                              {verification.company.name}
                            </h3>
                            <p className="text-green-700">
                              CAC: {verification.company.cacRc}
                            </p>
                          </div>
                        </div>
                        {verification.company.address && (
                          <p>
                            <MapPin className="inline" />{" "}
                            {verification.company.address}
                          </p>
                        )}
                        {verification.company.email && (
                          <p>
                            <Mail className="inline" />{" "}
                            {verification.company.email}
                          </p>
                        )}
                      </div>
                    ) : (
                      <p className="text-red-700">{verification.message}</p>
                    )}
                  </div>
                )}
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Jobs Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {filteredJobs.length > 0 ? (
            filteredJobs.map((job: any) => (
              <Card
                key={job.id}
                className="hover:shadow-xl transition-all cursor-pointer"
                onClick={() => openJobModal(job)}
              >
                <CardContent className="p-6">
                  <h3 className="font-semibold text-xl">{job.title}</h3>
                  <p className="text-orange-600 font-medium mt-1">
                    {job.company?.name}
                  </p>
                  <p className="text-gray-600 mt-4 flex items-center gap-2">
                    <MapPin className="h-4 w-4" /> {job.location}
                  </p>
                  {job.salary && (
                    <p className="font-medium text-lg mt-3">₦{job.salary}</p>
                  )}
                </CardContent>
              </Card>
            ))
          ) : (
            <p className="col-span-full text-center py-20 text-gray-500">
              No jobs found
            </p>
          )}
        </div>

        {/* Risk Heatmap Section */}
        <div className="mt-16">
          <RiskHeatmap />
        </div>

        {/* About Section */}
        <div className="bg-white rounded-3xl p-12 mb-5 shadow">
          <div className="max-w-3xl mx-auto text-center">
            <ShieldCheck className="mx-auto h-16 w-16 text-orange-600 mb-6" />
            <h2 className="text-4xl font-bold mb-6">Why SafeHire?</h2>
            <p className="text-xl text-gray-600 leading-relaxed">
              We verify every company using official CAC records. Our goal is to
              eliminate scam job postings and build trust in Nigeria's hiring
              ecosystem.
            </p>
          </div>
        </div>

        {/* Contact Section */}
        <div className="bg-white rounded-3xl p-12 shadow mt-12">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-4xl font-bold text-center mb-10">
              Get In Touch
            </h2>

            <form onSubmit={handleContactSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm mb-2 font-medium">
                    Your Name
                  </label>
                  <Input
                    value={contactForm.name}
                    onChange={(e) =>
                      setContactForm({ ...contactForm, name: e.target.value })
                    }
                    placeholder="John Doe"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm mb-2 font-medium">
                    Email Address
                  </label>
                  <Input
                    type="email"
                    value={contactForm.email}
                    onChange={(e) =>
                      setContactForm({ ...contactForm, email: e.target.value })
                    }
                    placeholder="you@email.com"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm mb-2 font-medium">
                  Subject
                </label>
                <Input
                  value={contactForm.subject}
                  onChange={(e) =>
                    setContactForm({ ...contactForm, subject: e.target.value })
                  }
                  placeholder="Inquiry about verification"
                  required
                />
              </div>

              <div>
                <label className="block text-sm mb-2 font-medium">
                  Message
                </label>
                <Textarea
                  rows={6}
                  value={contactForm.message}
                  onChange={(e) =>
                    setContactForm({ ...contactForm, message: e.target.value })
                  }
                  placeholder="How can we help you?"
                  required
                />
              </div>

              <Button
                type="submit"
                disabled={sending}
                className="w-full h-14 text-lg bg-orange-600"
              >
                {sending ? "Sending Message..." : "Send Message"}
              </Button>
            </form>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-10">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <ShieldCheck className="h-8 w-8 text-orange-500" />
              <span className="text-2xl font-bold text-white">SafeHire</span>
            </div>
            <p>Building trust in Nigeria's job market.</p>
          </div>

          <div>
            <h4 className="text-white font-medium mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <a href="#jobs" className="hover:text-white">
                  Browse Jobs
                </a>
              </li>
              <li>
                <a href="#verify" className="hover:text-white">
                  Verify Company
                </a>
              </li>
              <li>
                <a href="#about" className="hover:text-white">
                  About Us
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-medium mb-4">Contact</h4>
            <p>support@safehire.ng</p>
            <p className="text-sm mt-4">
              © 2026 SafeHire. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
      {/* Job Detail Modal */}
      <Dialog open={!!jobModal} onOpenChange={() => setJobModal(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-3xl">{jobModal?.title}</DialogTitle>
          </DialogHeader>
          {/* ... same as before */}
        </DialogContent>
      </Dialog>

      {/* Company Profile Modal */}
      <Dialog open={showCompanyModal} onOpenChange={setShowCompanyModal}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Company Profile</DialogTitle>
          </DialogHeader>
          {/* ... same as before */}
        </DialogContent>
      </Dialog>
    </div>
  );
}
