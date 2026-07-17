import { Helmet } from 'react-helmet-async';

export default function SEO({
  title = 'Sukma. | UI/UX Designer Portfolio',
  description = 'Portfolio personal Rr Sukma Ayu Dwi Wulandari — UI/UX Designer yang menciptakan pengalaman digital elegan dan bermakna.',
  path = '/',
}) {
  const fullTitle = title.includes('Sukma') ? title : `${title} | Sukma.`;
  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
      <link rel="canonical" href={path} />
    </Helmet>
  );
}
