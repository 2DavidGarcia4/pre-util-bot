require('dotenv').config()

const token = process.env.TOKEN
const mongoUrl = process.env.MONGO_URL

module.exports = {
  token, 
  mongoUrl
}