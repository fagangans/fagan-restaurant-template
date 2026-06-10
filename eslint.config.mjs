import nextConfig from 'eslint-config-next'

const config = [
  ...nextConfig,
  {
    rules: {
      '@next/next/no-img-element': 'warn',
    },
  },
]

export default config
