/** @type {import('@tailwindcss/postcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
  corePlugins: {
    preflight: false, // Diğer stilleri etkilememek için Tailwind'in temel stillerini devre dışı bırakıyoruz
  },
  // Çakışmaları önlemek için tüm Tailwind sınıflarına önek ekliyoruz
  prefix: 'tw-',
} 