import React from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  Award,
  Lock,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';

export const About: React.FC = () => {
  return (
    <div className="py-14 bg-[#F8F7FC] min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#7C3AED] bg-[#EDE9FE] px-3 py-1 rounded-full border border-[#DDD6FE]">
            About Crowd Report
          </span>
          <h1 className="text-3xl sm:text-5xl font-heading font-extrabold text-[#1E293B] mt-4 mb-4">
            Transforming Municipal Maintenance Through Collective Governance
          </h1>
          <p className="text-base text-[#64748B] leading-relaxed">
            Crowd Report bridges the gap between active citizens experiencing neighborhood hazards and certified local tradespeople under strict municipal oversight.
          </p>
        </div>

        {/* Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <Card className="border-[#E2E8F0]">
            <div className="w-10 h-10 rounded-xl bg-[#EDE9FE] text-[#7C3AED] flex items-center justify-center mb-4">
              <Award className="w-5 h-5" />
            </div>
            <h3 className="font-heading font-bold text-base text-[#1E293B] mb-2">
              Certified Resolvers
            </h3>
            <p className="text-xs text-[#64748B] leading-relaxed">
              Every contractor must submit government identity credentials, verify operational trade skills, and pass administrative review before accepting assignments.
            </p>
          </Card>

          <Card className="border-[#E2E8F0]">
            <div className="w-10 h-10 rounded-xl bg-[#EDE9FE] text-[#7C3AED] flex items-center justify-center mb-4">
              <Lock className="w-5 h-5" />
            </div>
            <h3 className="font-heading font-bold text-base text-[#1E293B] mb-2">
              Escrow Protection
            </h3>
            <p className="text-xs text-[#64748B] leading-relaxed">
              Citizen advance payments are secured in municipal escrow. Contractor payouts are released only after Before/After photo proof is verified by city administrators.
            </p>
          </Card>

          <Card className="border-[#E2E8F0]">
            <div className="w-10 h-10 rounded-xl bg-[#EDE9FE] text-[#7C3AED] flex items-center justify-center mb-4">
              <Users className="w-5 h-5" />
            </div>
            <h3 className="font-heading font-bold text-base text-[#1E293B] mb-2">
              Transparent Pricing
            </h3>
            <p className="text-xs text-[#64748B] leading-relaxed">
              Quotes are calculated using deterministic formulas: base rate, distance rate, and AI severity analysis. Zero surprise fees, zero cash under the table.
            </p>
          </Card>
        </div>

        {/* Detailed Narrative */}
        <div className="bg-white rounded-2xl p-8 sm:p-10 border border-[#E2E8F0] shadow-xs mb-14 space-y-6 text-sm text-[#475569] leading-relaxed">
          <h2 className="font-heading font-bold text-2xl text-[#1E293B]">
            Our Mission & Governance Standards
          </h2>
          <p>
            Traditional civic problem reporting often ends in bureaucratic dead-ends: unacknowledged tickets, unclear repair schedules, and zero photographic confirmation of work done. Crowd Report was built to modernize this civic workflow.
          </p>
          <p>
            By linking geographic coordinates (2dsphere geospatial indexing) with nearby approved resolvers, our platform empowers certified electricians, plumbers, masons, and road workers with fair livelihood opportunities while ensuring public roads and infrastructure are restored within 24–48 hours.
          </p>
          <div className="p-4 rounded-xl bg-[#F8F7FC] border border-[#E2E8F0] flex items-start gap-3 text-xs text-[#1E293B]">
            <Sparkles className="w-5 h-5 text-[#7C3AED] shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Automated Integrity System:</span> Every critical transition triggers immutable timeline stamps, cryptographically formatted PDF invoices, and exponential-backoff email delivery logs.
            </div>
          </div>
        </div>

        {/* Contact CTA */}
        <div className="text-center p-8 rounded-2xl bg-gradient-to-r from-[#171A3B] to-[#312E81] text-white">
          <h3 className="text-xl font-heading font-bold mb-2">Have Questions or Municipal Inquiries?</h3>
          <p className="text-xs text-slate-300 mb-6 max-w-lg mx-auto">
            Our support administration is available Monday to Saturday. Send us a direct inquiry.
          </p>
          <Link to="/query">
            <Button variant="primary" size="sm" className="shadow-sm">
              <span>Write a Query</span>
              <ArrowRight className="w-4 h-4 ml-1.5" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default About;
