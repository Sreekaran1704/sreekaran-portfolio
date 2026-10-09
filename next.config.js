const { PHASE_DEVELOPMENT_SERVER } = require('next/constants');

module.exports = (phase) => ({
  // Keep production build checks from overwriting the running dev server.
  distDir: phase === PHASE_DEVELOPMENT_SERVER ? '.next-dev' : '.next',
  reactStrictMode: true,
  // The empty package-lock.json one folder up is not this app's workspace root.
  turbopack: { root: __dirname },
  images: { formats: ['image/avif', 'image/webp'] },
  async redirects() {
    return ['about', 'projects', 'experience', 'articles', 'skills', 'contact'].map((section) => ({
      source: `/${section}`,
      destination: `/#${section}`,
      permanent: false,
    }));
  },
});
