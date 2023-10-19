const router = require("express").Router();
const userServices = require("../services/userService");
const { extractErrorMessages } = require("../utils/errorHandler");
const { isAuth } = require("../middlewares/authMiddleware");

router.get("/register", (req, res) => {
	res.render("user/register");
});

router.post("/register", async (req, res) => {
	const { email, password, repeatPassword } = req.body;

	try {
		const token = await userServices.register({ email, password, repeatPassword });

		res.cookie("token", token, { httpOnly: true });
		res.redirect("/");
	} catch (error) {
		const errorMessages = extractErrorMessages(error);
		res.status(404).render("user/register", { errorMessages });
	}
});

router.get("/login", (req, res) => {
	res.render("user/login");
});

router.post("/login", async (req, res) => {
	const { email, password } = req.body;

	try {
		const token = await userServices.login(email, password);

		res.cookie("token", token, { httpOnly: true });
		res.redirect("/");
	} catch (error) {
		const errorMessages = extractErrorMessages(error);
		res.status(404).render("user/login", { errorMessages });
	}
});

router.get("/logout", isAuth, (req, res) => {
	res.clearCookie("token");
	res.redirect("/");
});

module.exports = router;
