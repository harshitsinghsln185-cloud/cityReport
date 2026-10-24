import React, { useState, useEffect } from 'react';
import { Search, Wrench } from 'lucide-react';
import categoryService, { Category } from '../../services/category.service';
import ServiceCard from '../../components/public/ServiceCard';

export const Services: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const data = await categoryService.getActiveCategories();
        setCategories(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Failed to load civic categories:', err);
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const safeCategories = Array.isArray(categories) ? categories : [];
  const filtered = safeCategories.filter((c) => {
    const query = (searchQuery || '').toLowerCase();
    return (
      (c.name || '').toLowerCase().includes(query) ||
      (c.description && c.description.toLowerCase().includes(query))
    );
  });

  return (
    <div className="py-12 bg-[#F8F7FC] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-3xl mb-10">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#7C3AED] bg-[#EDE9FE] px-3 py-1 rounded-full border border-[#DDD6FE]">
            Directory
          </span>
          <h1 className="text-3xl sm:text-4xl font-heading font-extrabold text-[#1E293B] mt-3 mb-2">
            Civic Services Directory
          </h1>
          <p className="text-sm sm:text-base text-[#64748B]">
            Browse supported civic hazard categories, standard indicative base rates, and estimated resolution turnaround times.
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-md mb-8">
          <div className="relative">
            <Search className="w-4 h-4 text-[#94A3B8] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search services (e.g. Pothole, Streetlight, Water)..."
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#E2E8F0] rounded-xl text-xs sm:text-sm text-[#1E293B] focus:outline-none focus:border-[#7C3AED] focus:ring-1 focus:ring-[#7C3AED] shadow-xs transition-all"
            />
          </div>
        </div>

        {/* Cards Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-52 rounded-2xl bg-white border border-[#E2E8F0] p-6 animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-2xl border border-[#E2E8F0]">
            <Wrench className="w-10 h-10 text-[#94A3B8] mx-auto mb-3" />
            <h3 className="font-heading font-bold text-base text-[#1E293B] mb-1">
              No matching categories found
            </h3>
            <p className="text-xs text-[#64748B]">
              Try searching with different keywords like road, light, pipe, or water.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((cat) => (
              <ServiceCard key={cat._id} category={cat} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Services;
