import React from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink, ShieldCheck, Sparkles, Image as ImageIcon, ArrowLeft } from 'lucide-react';
import PageHero from '../../components/ui/PageHero';
import SEO from '../../components/SEO';
import { SITE_URL } from '../../config/site';
import { CATEGORY_IMAGE_CREDITS, SUB_ISSUE_IMAGE_CREDITS } from '../../data/imageCredits';
import { getCategoryImage, getSubIssueImage } from '../../lib/civicImage';

export const Credits: React.FC = () => {
  return (
    <div className="bg-canvas min-h-screen">
      <SEO
        title="Civic Image Credits & Licensing Disclosures | Crowd Report"
        description="Public attribution and open licensing register for all civic infrastructure photography and documentary assets across the Crowd Report platform."
        keywords={[
          'image credits',
          'civic photography attribution',
          'open access licenses',
          'CC BY-SA 4.0',
          'CC BY-SA 3.0',
        ]}
        jsonLd={[
          {
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              {
                '@type': 'ListItem',
                position: 1,
                name: 'Home',
                item: `${SITE_URL}/`,
              },
              {
                '@type': 'ListItem',
                position: 2,
                name: 'Image Credits',
                item: `${SITE_URL}/credits`,
              },
            ],
          },
        ]}
      />

      <PageHero
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Image Credits' }]}
        eyebrow="Transparency & Licensing"
        title="Civic Image Credits & Attribution"
        description="Public registry of photographic assets, licensing details, and documentary image generation standards across the 16 municipal service categories."
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-12">
        {/* Compliance Card */}
        <div className="bg-white p-6 sm:p-8 rounded-card border border-border shadow-subtle flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-accent uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4 text-accent" />
              <span>Open Licensing & Creative Commons Policy</span>
            </div>
            <h2 className="font-heading font-bold text-lg sm:text-xl text-ink">
              Permissible Open Licensing Compliance
            </h2>
            <p className="text-xs sm:text-sm text-secondaryText max-w-2xl leading-relaxed">
              Every real photograph utilized across the Crowd Report portal is sourced under verified open-access licenses (including Creative Commons CC BY-SA 4.0, CC BY-SA 3.0, and CC0). All EXIF and GPS metadata are stripped during responsive optimization for user privacy.
            </p>
          </div>
          <Link
            to="/services"
            className="shrink-0 inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:text-accent transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Browse Services</span>
          </Link>
        </div>

        {/* Section 1: Real Photographic Covers & Sub-Issues */}
        <div className="space-y-6">
          <div>
            <h3 className="font-heading font-extrabold text-xl text-ink flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-primary" />
              <span>Real Open-Licensed Photography</span>
            </h3>
            <p className="text-xs sm:text-sm text-secondaryText mt-1">
              Photographic assets requiring author attribution under Creative Commons licenses.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Object.values(CATEGORY_IMAGE_CREDITS)
              .filter((c) => c.source === 'wikimedia-commons')
              .map((credit) => {
                const img = getCategoryImage(credit.slug);
                return (
                  <div
                    key={credit.slug}
                    className="bg-white rounded-xl border border-border p-4 flex flex-col sm:flex-row gap-4 items-start sm:items-center shadow-xs"
                  >
                    <div className="w-full sm:w-24 h-36 sm:h-20 rounded-lg overflow-hidden shrink-0 bg-slate-900">
                      {img ? (
                        <img
                          src={img.cardSrc}
                          alt={credit.name}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full bg-slate-200" />
                      )}
                    </div>
                    <div className="space-y-1 min-w-0">
                      <h4 className="font-heading font-bold text-sm text-ink truncate">
                        {credit.name} (Hero Cover)
                      </h4>
                      <div className="text-xs text-secondaryText">
                        Author:{' '}
                        <a
                          href={credit.authorUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-medium text-primary hover:underline inline-flex items-center gap-0.5"
                        >
                          {credit.author}
                          <ExternalLink className="w-3 h-3 inline" />
                        </a>
                      </div>
                      <div className="text-xs text-muted">
                        License:{' '}
                        <a
                          href={credit.licenseUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-mono text-accent hover:underline"
                        >
                          {credit.license}
                        </a>
                      </div>
                    </div>
                  </div>
                );
              })}

            {/* Sub-issues with real photos */}
            {Object.values(SUB_ISSUE_IMAGE_CREDITS)
              .filter((s) => s.source === 'wikimedia-commons')
              .map((credit) => {
                const img = getSubIssueImage(credit.categorySlug || '', credit.slug);
                return (
                  <div
                    key={`${credit.categorySlug}/${credit.slug}`}
                    className="bg-white rounded-xl border border-border p-4 flex flex-col sm:flex-row gap-4 items-start sm:items-center shadow-xs"
                  >
                    <div className="w-full sm:w-24 h-36 sm:h-20 rounded-lg overflow-hidden shrink-0 bg-slate-900">
                      {img ? (
                        <img
                          src={img.cardSrc}
                          alt={credit.name}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full bg-slate-200" />
                      )}
                    </div>
                    <div className="space-y-1 min-w-0">
                      <h4 className="font-heading font-bold text-sm text-ink truncate">
                        {credit.name}
                      </h4>
                      <div className="text-xs text-secondaryText">
                        Author:{' '}
                        <a
                          href={credit.authorUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-medium text-primary hover:underline inline-flex items-center gap-0.5"
                        >
                          {credit.author}
                          <ExternalLink className="w-3 h-3 inline" />
                        </a>
                      </div>
                      <div className="text-xs text-muted">
                        License:{' '}
                        <a
                          href={credit.licenseUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-mono text-accent hover:underline"
                        >
                          {credit.license}
                        </a>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>

        {/* Section 2: Synthetic Documentary Photography Policy */}
        <div className="bg-slate-900 text-white p-6 sm:p-8 rounded-card space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold text-accent uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-accent" />
            <span>Documentary Photo Synthesis Statement</span>
          </div>
          <h3 className="font-heading font-bold text-lg sm:text-xl text-white">
            Synthetic Municipal Defect Visualizations
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            All remaining sub-issue defect illustrations across the 208 civic categories were synthesized using the Crowd Report documentary generation model (Nano Banana). Sourced and generated strictly in accordance with municipal field guidelines:
          </p>
          <ul className="text-xs sm:text-sm text-slate-300 space-y-1.5 list-disc pl-5">
            <li>Photorealistic documentary style with neutral 35mm optical perspectives.</li>
            <li>Cool navy shadows and warm daylight highlights matching existing platform aesthetics.</li>
            <li>Zero identifiable human faces, zero readable vehicle license plates, and zero proprietary trademarks.</li>
            <li>Sensitive civic issues (animal carcasses, biomedical hazards, sanitary incidents) are strictly depicted via non-graphic municipal perimeter and dispatch framing.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Credits;
