const production = {
  api_host: 'https://api.ripple.hexes.co.uk',
  self_host: 'https://ripple.hexes.co.uk',
  environment: 'production'
}

const development = {
  api_host: 'http://localhost:3000',
  self_host: 'http://localhost:3003',
  environment: 'development'
}

const config = process.env.REACT_APP_ENV === 'production' ? production : development

export default config
