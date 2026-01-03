const express = require("express");
const router = express.Router();

router.use("/user", require("./userRoute"));
router.use("/admin", require("./adminRoute"));
router.use("/user/v2", require("./userRouteV2"));

module.exports = router;
