/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `http://localhost:3000/${process.env.BACK}/api/:path*`,
      },
      {
        source: '/',
        destination: 'http://localhost:3000/index.html',
      },
      {
        source: '/policy/refund',
        destination: 'http://localhost:3000/refunds.html',
      },
      {
        source: '/policy/terms',
        destination: 'http://localhost:3000/terms.html',
      },
      {
        source: '/policy/privacy',
        destination: 'http://localhost:3000/privacy.html',
      },
      {
        source: '/faq',
        destination: 'http://localhost:3000/faq.html',
      },
      {
        source: '/aboutus',
        destination: 'http://localhost:3000/aboutus.html',
      },
    ]
  },
}

module.exports = nextConfig
