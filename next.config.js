/** @type {import('next').NextConfig} */

const path = require("path")

const nextConfig = {
  images: {
    domains: ['novatoons.sfo3.digitaloceanspaces.com'],
  },
  reactStrictMode: true,
  env: {
    REACT_APP_APIKEY:"AIzaSyC2-YScPwefjYPWp99UBkvzaB27weWKhCc",
    REACT_APP_AUTHDOMAIN:"novatoons-6c6b7.firebaseapp.com",
    REACT_APP_PROJECTID:"novatoons-6c6b7",
    REACT_APP_STORAGEBUCKET:"novatoons-6c6b7.appspot.com",
    REACT_APP_MESSAGESENDERID:"917674942665",
    REACT_APP_APPID:"1:917674942665:web:2bcf9bbd2778ccee1cad18",
    REACT_APP_MEASUREMENTID:"G-QD9JRYHLC9",
    REACT_APP_CLIENT_ID:"917674942665-69eh6msf4vv8sjdir86crum9kc8s7d3f.apps.googleusercontent.com",
    REACT_APP_RECAPTCHAKEY:"6Lecc7gfAAAAABIQHn6thjTqauocDMLzsV0b9z1K",
    REACT_APP_FACEBOOK_KEY:"581709483091892",
    REACT_APP_FACEBOOK_SECRET:"12596f905941fc189eddd9b985bf742b",
    REACT_APP_PAYPAL_CLIENT_KEY:"581709483091892",
    REACT_APP_STRIPE_KEY:"pk_test_51L3EcWHcgbNBtyjrJUBGt07SFmibnkwcbnvODRtHG7IZHFiZF1GhCkE61yruyr6gBPbcdv3YRNRn5NoFxzuBN8nS00VfeTkgby",
    REACT_APP_DEVELOPMENT_PREFIX:"",
    REACT_APP_PRODUCTION_MODE:true,
    REACT_APP_SOCKET_SERVER_URL:"https://dev.novatoons.com:4041/",
    REACT_APP_BASE_URL:"https://dev.novatoons.com:4041/api"
  },
  sassOptions: {
    includePaths: [path.join(__dirname, 'assets/css')],
  },
}

module.exports = nextConfig
