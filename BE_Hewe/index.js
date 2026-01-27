require("dotenv").config();
const port = process.env.PORT || 3000;

const express = require("express");
const socketIo = require("socket.io");
const app = express();
const server = require("http").Server(app);
const io = socketIo(server);
const { setupSocket } = require("./socket/socket");
// const socketXT = require("./module/socketXT");
setupSocket(io);

const cors = require("cors");
const path = require("path");
const bodyParser = require("body-parser");
const fileuploads = require("express-fileupload");
const { connectToDatabase } = require("./database/db");

// cron job
const cron = require("node-cron");
const { getEventContract, getBlockss } = require("./controller/blockchain");
const { cronChart, cronChart2 } = require("./controller/chart");
const { cronBlockAddress } = require("./module/amchainapi");
const { initGetCurrentBlockBEP20 } = require("./controller/blockchain");

// redis
const client = require("./database/redis");

app.use(express.json());
// app.use(fileuploads());

// cors
const corsOption = {
  origin: true,
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
  exposedHeaders: ["x-auth-token"],
};
app.use(cors(corsOption));

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(bodyParser.json());

const apiRoute = require("./route/index");
app.use("/api", apiRoute);

app.use(express.static(path.join(__dirname, "public/build")));
app.use(express.static(path.join(__dirname, 'public/build1')));

// Serve images directory as static files (production-ready)
// This handles all /images/* requests automatically
app.use('/images', express.static(path.join(__dirname, 'images'), {
  maxAge: process.env.NODE_ENV === 'production' ? '1d' : 0,
  fallthrough: true, // Continue to next middleware if file not found
}));

app.get('/images/blog/:images', function (req, res) {
  // Handle the full path: /images/blog/filename.png
  // Images are stored in BE_Hewe/images/blog/
  const filename = req.params.images;
  const requestedPath = path.normalize(path.join(__dirname, 'images/blog/', filename));
  const imagesDir = path.resolve(__dirname, 'images/blog/');

  // Security check: ensure requested path is within images directory
  if (!requestedPath.startsWith(imagesDir)) {
    return res.status(400).send('Invalid path');
  }

  // Send the file
  res.sendFile(requestedPath, (err) => {
    if (err) {
      console.error('Error sending file:', err);
      res.status(404).send('Image not found');
    }
  });
});
app.get('/adminPanel', function (req, res) {
  res.sendFile(path.join(__dirname, 'public/build1', 'index.html'));
});
app.get('/adminPanel/*', function (req, res) {
  res.sendFile(path.join(__dirname, 'public/build1', 'index.html'));
});
app.get("/*", function (req, res) {
  res.sendFile(path.join(__dirname, "public/build", "index.html"));
});

const RandomIntervalJob = require("./module/customCron");
require("./controller/cronjob");

init = async function () {
  try {
    server.listen(port);
    console.log(`App is running on port: ${port}`);
    await connectToDatabase();
    await client.connect();

    await initGetCurrentBlockBEP20();

    // TEMPORARILY DISABLED: Comment out blockchain cron jobs due to RPC connection issues
    // Uncomment when RPC endpoint is working properly

    /*
    cron.schedule("* /5 * * * * *", async function () {
      try {
        await getEventContract();
        await getBlockss();
      } catch (error) {
        console.log(error, "getEventContract");
      }
    });
    
    cron.schedule("* /2 * * * * *", async function () {
      try {
        await cronBlockAddress();
      } catch (error) {
        console.log(error, "cronBlockAddress");
      }
    });
    
    const job = new RandomIntervalJob({
      minMinutes: 45,
      maxMinutes: 80,
      task: async () => {
        await cronChart2();
      },
    });
    job.start();
    */

    console.log('✅ Server started successfully (blockchain cron jobs disabled)');
  } catch (error) {
    console.log(error);
  }
};

init();
