/** @type {import('next').NextConfig} */
const config = process.env.STATIC_EXPORT === '1'
  ? { output: 'export', trailingSlash: true, distDir: '.next-static' }
  : {};
export default config;
