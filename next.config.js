/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `https://front-end-ashy-alpha.vercel.app/${process.env.BACK}/api/:path*`,
      },
      {
        source: '/',
        destination: 'https://front-end-ashy-alpha.vercel.app/index.html',
      },
      {
        source: '/policy/refund',
        destination: 'https://front-end-ashy-alpha.vercel.app/refunds.html',
      },
      {
        source: '/policy/terms',
        destination: 'https://front-end-ashy-alpha.vercel.app/terms.html',
      },
      {
        source: '/policy/privacy',
        destination: 'https://front-end-ashy-alpha.vercel.app/privacy.html',
      },
      {
        source: '/faq',
        destination: 'https://front-end-ashy-alpha.vercel.app/faq.html',
      },
      {
        source: '/aboutus',
        destination: 'https://front-end-ashy-alpha.vercel.app/aboutus.html',
      },
    ]
  },
}

module.exports = nextConfig
