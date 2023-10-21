const router = require("express").Router();
const homeController = require("./controllers/homeController");
const userController = require("./controllers/userController");
const offerController = require("./controllers/offerController");

router.use(homeController);
router.use("/user", userController);
router.use("/offer", offerController);

router.get("*", (req, res) => {
	res.redirect("/404");
});

module.exports = router;
