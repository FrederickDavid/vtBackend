const cloudinary = require("cloudinary").v2;
const dotenv = require("dotenv")
dotenv.config({path: './config.env'})
cloudinary.config({ 
  cloud_name: 'onevoteapps', 
  api_key: '355485247664412', 
  api_secret: '2-YqgFFMq--uHJeKqR0cJdbiRFk' 
});

  module.exports = cloudinary