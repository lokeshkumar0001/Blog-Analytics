const axios = require('axios')

const API_URL = "https://intent-kit-16.hasura.app/api/rest/blogs";
const ADMIN_SECRET =
  "32qR4KmXOIpsGPQKMqEJHGJS27G5s7HdSKO3gdtQd2kv5e852SiYwWNfxkZOBuQ6";

const config = {
  headers: {
    "x-hasura-admin-secret": ADMIN_SECRET,
  },
};

module.exports = async (req, res, next) => {
  try {
    const response = await axios.get(API_URL, config);

    //if blog not found
    if (response.status !== 200) {
      throw new Error("Failed to fetch blog data");
    }

    req.blogs = response.data;
    next(); 
  } catch (error) {
    console.error("Error fetching blogs:", error);
    res.status(500).json({ error: "An error occurred while fetching blogs." });
  }
};
