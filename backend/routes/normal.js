const router = require("express").Router();

// Register basic routes
router.get("/", (req, res) => {
  res.end("HOMEPAGE");
});

module.exports = router;
