import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';
import { SITE_URL } from '../config/site';

export interface SEOProps {
  title?: string;
  description?: string;
  canonical?: string;
  keywords?: string | string[];
  ogType?: 'website' | 'article';
  ogImage?: string;
  twitterCard?: 'summary' | 'summary_large_image';
  robots?: string;
  jsonLd?: Record<string, unknown> | Array<Record<string, unknown>>;
}

const DEFAULT_TITLE = 'Crowd Report — Civic Issue Reporting & Municipal Resolution Platform';
const DEFAULT_DESC =
  'India’s verified civic issue reporting network. Report municipal infrastructure defects, track geotagged photographic remediation proof, and verify milestone contractor resolution across 36 states and union territories.';
export const BASE_URL = SITE_URL;
const DEFAULT_OG_IMAGE = `${BASE_URL}/og-image.jpg`;

export const SEO: React.FC<SEOProps> = ({
  title,
  description = DEFAULT_DESC,
  canonical,
  keywords,
  ogType = 'website',
  ogImage = DEFAULT_OG_IMAGE,
  twitterCard = 'summary_large_image',
  robots = 'index, follow',
  jsonLd,
}) => {
  const location = useLocation();
  const pageTitle = title ? `${title} | Crowd Report` : DEFAULT_TITLE;
  const canonicalUrl = canonical || `${BASE_URL}${location.pathname}`;
  const keywordsString = Array.isArray(keywords) ? keywords.join(', ') : keywords;

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{pageTitle}</title>
      <meta name="title" content={pageTitle} />
      <meta name="description" content={description} />
      <meta name="robots" content={robots} />
      {keywordsString && <meta name="keywords" content={keywordsString} />}
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph / Social Sharing */}
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:type" content="image/jpeg" />
      <meta property="og:site_name" content="Crowd Report" />
      <meta property="og:locale" content="en_IN" />

      {/* Twitter Cards */}
      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:url" content={canonicalUrl} />
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />

      {/* Structured Data (JSON-LD) */}
      {jsonLd && (
        <script type="application/ld+json">
          {JSON.stringify(jsonLd)}
        </script>
      )}
    </Helmet>
  );
};

export default SEO;
