import { Helmet } from "react-helmet-async";

/**
 * DynamicHead Component
 * Manages dynamic SEO metadata for car listings and marketplace pages.
 */
export function DynamicHead({ 
  title = "Jaybesin Autos | Premium Car Marketplace From China to Ghana", 
  description = "Buy or import premium cars from China to Ghana with Jaybesin Autos. Transparent shipping, inspection, and clearing services.", 
  image = "https://jaybesinautos.web.app/og-image.png",
  url = "https://jaybesinautos.web.app",
  type = "website" 
}) {
  const siteTitle = "Jaybesin Autos";
  const fullTitle = title.includes(siteTitle) ? title : `${title} | ${siteTitle}`;

  return (
    <Helmet>
      {/* Standard Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={url} />
      <meta property="twitter:title" content={fullTitle} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={image} />
    </Helmet>
  );
}
