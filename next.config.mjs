import withPWA from 'next-pwa';

const isProd = process.env.NODE_ENV === 'production';

const pwaConfig = {
  dest: 'public',
  disable: !isProd,
  register: true,
  skipWaiting: true
};

const nextConfig = {};

export default withPWA(pwaConfig)(nextConfig);
