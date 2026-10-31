import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Send,
  CheckCircle2,
  AlertCircle,
  Clock,
  Phone,
  Mail,
  HelpCircle,
  ShieldCheck,
  Building,
} from 'lucide-react';
import publicService from '../../services/public.service';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Textarea from '../../components/ui/Textarea';
import Reveal from '../../components/ui/Reveal';
import SEO from '../../components/SEO';
import PageHero from '../../components/ui/PageHero';

export const WriteQuery: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    category: 'General Governance',
    subject: '',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successInfo, setSuccessInfo] = useState<{ queryId: string } | null>(null);

  const queryCategories = [
    'General Governance',
    'Billing & Payment Questions',
    'Contractor Accreditation & Verification',
    'Ward Jurisdiction Clarification',
    'Dispute & Rework Audit',
    'Technical App Support',
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!formData.name.trim() || formData.name.trim().length < 2) {
      setErrorMessage('Please enter your full name (minimum 2 characters).');
      return;
    }

    if (!formData.email.trim() || !formData.email.includes('@')) {
      setErrorMessage('Please provide a valid email address so we can reply.');
      return;
    }

    if (!formData.subject.trim() || formData.subject.trim().length < 3) {
      setErrorMessage('Subject must be at least 3 characters.');
      return;
    }

    if (!formData.message.trim() || formData.message.trim().length < 10) {
      setErrorMessage('Message must be at least 10 characters.');
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await publicService.submitQuery({
        name: formData.name.trim(),
        email: formData.email.trim(),
        subject: `[${formData.category}] ${formData.subject.trim()}`,
        message: formData.phone ? `Phone: ${formData.phone}\n\n${formData.message.trim()}` : formData.message.trim(),
      });
      setSuccessInfo(res);
      setFormData({ name: '', email: '', phone: '', category: 'General Governance', subject: '', message: '' });
    } catch (err: any) {
      setErrorMessage(
        err?.response?.data?.message || 'Failed to submit inquiry. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-canvas min-h-screen">
      <SEO
        title="Citizen Inquiries & Civic Help Desk"
        description="Direct administrative liaison desk for citizen questions regarding municipal ward coverage, contractor accreditation, milestone payments, and formal tax receipts."
        keywords={[
          'civic help desk',
          'municipal inquiries',
          'contact municipal administration',
          'citizen query form',
        ]}
      />

      {/* Institutional Split Page Hero */}
      <PageHero
        variant="split"
        theme="navy"
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Help Desk & Inquiries' }]}
        eyebrow="Official Civic Liaison Office"
        eyebrowIcon={<Mail className="w-3.5 h-3.5" />}
        title="Direct Inquiries to Municipal Secretariat"
        description="Submit formal inquiries regarding ward jurisdiction coverage, contractor accreditation standards, fee tariffs, or commercial tax invoices with guaranteed 24-48h response SLA."
        visual={
          <div className="w-full max-w-sm rounded-[20px] bg-white/5 border border-white/15 p-6 backdrop-blur-md shadow-2xl text-white space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <span className="text-xs uppercase tracking-wider font-semibold text-gold">Liaison Office Contacts</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-400/20 text-emerald-300 font-bold">24-48h SLA</span>
            </div>
            <div className="space-y-3 text-xs text-slate-300">
              <div className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-gold shrink-0" />
                <span>Working Hours: Mon – Sat, 9:00 AM – 6:00 PM IST</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Building className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Secretariat: Central Civic Infrastructure Registry</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-blue-400 shrink-0" />
                <span>Inquiry SLA: Reference ID issued upon submission</span>
              </div>
            </div>
          </div>
        }
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Form & Success State (7 cols) */}
          <div className="lg:col-span-7">
            {successInfo ? (
              <Reveal>
                <Card variant="base" className="border-emerald-200 bg-emerald-50/40 p-8 sm:p-10 text-center shadow-subtle">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4 shadow-xs">
                    <CheckCircle2 className="w-9 h-9" />
                  </div>
                  <h3 className="font-heading font-extrabold text-2xl text-emerald-950 mb-2 tracking-tight">
                    Inquiry Received Successfully!
                  </h3>
                  <p className="text-xs sm:text-sm text-emerald-800 max-w-md mx-auto mb-4 leading-relaxed">
                    Your inquiry has been cataloged under administrative reference ID:
                  </p>
                  <div className="inline-block bg-white px-4 py-2 rounded-xl border border-emerald-300 font-mono font-bold text-emerald-900 text-base mb-6 shadow-xs">
                    {successInfo.queryId}
                  </div>
                  <div className="flex items-center justify-center gap-2 text-xs font-medium text-emerald-900 mb-8">
                    <Clock className="w-4 h-4 text-emerald-700" />
                    <span>Official Response SLA: 24 to 48 business hours via email</span>
                  </div>
                  <div>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => setSuccessInfo(null)}
                    >
                      Send Another Inquiry
                    </Button>
                  </div>
                </Card>
              </Reveal>
            ) : (
              <Reveal delay={0.1}>
                <Card variant="base" className="p-6 sm:p-8 bg-white border-border shadow-subtle">
                  {errorMessage && (
                    <div className="mb-6 p-3.5 rounded-card bg-red-50 border border-red-200 text-red-800 text-xs flex items-center gap-2.5">
                      <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                      <span>{errorMessage}</span>
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Input
                        label="Full Name *"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g. Radhika Sharma"
                        required
                      />

                      <Input
                        label="Email Address *"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="e.g. radhika@example.com"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Input
                        label="Contact Telephone (Optional)"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+91 98765 43210"
                      />

                      <Select
                        label="Query Department / Category"
                        required
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        options={queryCategories.map((c) => ({ value: c, label: c }))}
                      />
                    </div>

                    <Input
                      label="Subject Summary"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      placeholder="Brief topic of your inquiry"
                      required
                    />

                    <div>
                      <Textarea
                        label="Detailed Message / Context"
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        rows={5}
                        placeholder="Provide relevant ward details, reference numbers, or municipal documentation questions..."
                        maxLength={2000}
                        required
                        helperText={`${formData.message.length} / 2000 characters`}
                      />
                    </div>

                    <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <p className="text-xs text-slate-500 flex items-center gap-1.5 font-normal">
                        <Clock className="w-3.5 h-3.5 text-primary" />
                        <span>Signed administrative response within 24–48 hours</span>
                      </p>

                      <Button
                        type="submit"
                        variant="primary"
                        disabled={isSubmitting}
                        isLoading={isSubmitting}
                        leftIcon={<Send className="w-4 h-4" />}
                        className="h-12 px-6 rounded-xl font-bold text-sm sm:text-base shadow-md shadow-primary/20 hover:shadow-lg transition-all"
                      >
                        Submit Query
                      </Button>
                    </div>
                  </form>
                </Card>
              </Reveal>
            )}
          </div>

          {/* Right Column: Office Location, Helplines & FAQ Quick Links (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <Reveal delay={0.15}>
              <Card variant="base" className="p-6 bg-white border-border shadow-subtle space-y-6">
                <div>
                  <h3 className="font-heading font-extrabold text-base text-ink mb-1 tracking-tight">
                    Central Civic Secretariat
                  </h3>
                  <p className="text-xs text-muted">
                    National Operations & Escalations Office
                  </p>
                </div>

                <div className="space-y-4 text-xs">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-lavender text-primary flex items-center justify-center shrink-0 mt-0.5">
                      <Building className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-semibold text-ink">Physical Headquarters</p>
                      <p className="text-secondaryText leading-relaxed">
                        Crowd Report Civic Coordination Secretariat<br />
                        4th Floor, Vikas Soudha, Dr. Ambedkar Veedhi<br />
                        Bengaluru, Karnataka 560001
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                      <Clock className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-semibold text-ink">Operating Working Hours</p>
                      <p className="text-secondaryText leading-relaxed">
                        Monday – Saturday: 09:00 AM – 06:30 PM (IST)<br />
                        Closed on Gazetted National Public Holidays
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gold/10 text-gold flex items-center justify-center shrink-0 mt-0.5">
                      <Phone className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-semibold text-ink">Emergency Public Helplines</p>
                      <p className="text-secondaryText leading-relaxed">
                        Toll-Free Civic Desk: <strong className="text-ink">1800-CIVIC-REP</strong> (1800-248-4273)<br />
                        Emergency Escalations: <span className="font-mono">+91 80 2200 4800</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-indigo/10 text-indigo flex items-center justify-center shrink-0 mt-0.5">
                      <Mail className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-semibold text-ink">Official Email Channels</p>
                      <p className="text-secondaryText leading-relaxed">
                        General Inquiries: <a href="mailto:grievances@crowdreport.gov.in" className="text-primary hover:underline">grievances@crowdreport.gov.in</a><br />
                        Contractor Audits: <a href="mailto:contractors@crowdreport.gov.in" className="text-primary hover:underline">contractors@crowdreport.gov.in</a>
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-border">
                  <div className="p-3 rounded-lg bg-canvas text-xs text-secondaryText flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Compliant with Indian Public Grievance Redressal Standards</span>
                  </div>
                </div>
              </Card>
            </Reveal>

            {/* Quick Self-Serve FAQs */}
            <Reveal delay={0.2}>
              <Card variant="base" className="p-6 bg-white border-border shadow-subtle">
                <div className="flex items-center gap-2 mb-3">
                  <HelpCircle className="w-4 h-4 text-primary" />
                  <h4 className="font-heading font-bold text-sm text-ink tracking-tight">
                    Need Immediate Answers?
                  </h4>
                </div>
                <p className="text-xs text-muted mb-4">
                  Check our self-service guides before submitting an inquiry:
                </p>
                <ul className="space-y-2 text-xs">
                  <li>
                    <Link to="/about" className="text-primary hover:underline flex items-center justify-between">
                      <span>How Do the 50% Milestone Payments Work?</span>
                      <span>&rarr;</span>
                    </Link>
                  </li>
                  <li>
                    <Link to="/services" className="text-primary hover:underline flex items-center justify-between">
                      <span>Schedule of Rates & Base Tariffs</span>
                      <span>&rarr;</span>
                    </Link>
                  </li>
                  <li>
                    <Link to="/states" className="text-primary hover:underline flex items-center justify-between">
                      <span>State-Specific Ward Coverage</span>
                      <span>&rarr;</span>
                    </Link>
                  </li>
                  <li>
                    <Link to="/register-resolver" className="text-primary hover:underline flex items-center justify-between">
                      <span>Resolver Registration Criteria</span>
                      <span>&rarr;</span>
                    </Link>
                  </li>
                </ul>
              </Card>
            </Reveal>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WriteQuery;
