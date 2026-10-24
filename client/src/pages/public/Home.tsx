import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import Hero from '../../components/public/Hero';
import HowItWorks from '../../components/public/HowItWorks';
import ServiceCard from '../../components/public/ServiceCard';
import categoryService, { Category } from '../../services/category.service';
import Button from '../../components/ui/Button';

export const Home: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const data = await categoryService.getActiveCategories();
        const list = Array.isArray(data) ? data : [];
        setCategories(list.slice(0, 6));
      } catch (err) {
        console.error('Failed to load categories for homepage:', err);
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. Hero Banner */}
      <Hero />

      {/* 2. Active Civic Services Grid */}
      <section className="py-20 bg-[#F8F7FC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-12">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-[#7C3AED] bg-[#EDE9FE] px-3 py-1 rounded-full border border-[#DDD6FE]">
                Civic Services
              </span>
              <h2 className="text-2xl sm:text-4xl font-heading font-bold text-[#1E293B] mt-3">
                Supported Public Categories
              </h2>
              <p className="text-sm text-[#64748B] mt-1 max-w-xl">
                Certified municipal categories ready for immediate citizen issue reporting and proximity-based contractor assignment.
              </p>
            </div>

            <Link to="/services">
              <Button variant="outline" size="sm" className="flex items-center gap-1.5">
                <span>View All Categories</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-48 rounded-2xl bg-white border border-[#E2E8F0] p-6 animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {(Array.isArray(categories) ? categories : []).map((cat) => (
                <ServiceCard key={cat._id} category={cat} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 3. 4-Step Process Flow */}
      <HowItWorks />

      {/* 4. Municipal Trust & Guarantee Banner */}
      <section className="py-20 bg-gradient-to-r from-[#171A3B] to-[#312E81] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <div className="w-12 h-12 rounded-2xl bg-[#7C3AED] flex items-center justify-center text-white mx-auto mb-4 shadow-lg shadow-[#7C3AED]/30">
              <ShieldCheck className="w-6 h-6" />
            </div>

            <h2 className="text-2xl sm:text-4xl font-heading font-bold mb-4">
              Our Certified Civic Commitment
            </h2>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed mb-8">
              We eliminate non-transparent municipal maintenance delays. Every reported issue receives a binding mathematical fee breakdown, photo proof verification by municipal inspectors, and complete financial accounting.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-[#EDE9FE]">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Zero Hidden Fees</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>50% Escrow Protection</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Before/After Photo Proof</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Certified Local Contractors</span>
              </div>
            </div>

            <div className="mt-10">
              <Link to="/user/report-issue">
                <Button variant="primary" size="lg" className="shadow-lg shadow-[#7C3AED]/40">
                  <span>Report an Issue Today</span>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
