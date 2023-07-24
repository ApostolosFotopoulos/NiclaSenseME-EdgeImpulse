const envVariables = require("@root/env/envVariables");

let allowedOrigins = ["http://localhost:3000"];

let corsOptions = {
  origin: (origin, callback) => {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
};

if (envVariables.NODE_ENV === "production") {
  // ip or domain name
  allowedOrigins = ["http://3.76.38.238"];

  corsOptions = {
    origin: (origin, callback) => {
      if (allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    optionsSuccessStatus: 200,
  };
}

module.exports = corsOptions;
