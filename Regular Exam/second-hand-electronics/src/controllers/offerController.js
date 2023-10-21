const router = require("express").Router();
const offerService = require("../services/offerService");
const { isAuth } = require("../middlewares/authMiddleware");
const { extractErrorMessages } = require("../utils/errorHandler");

router.get("/catalog", async (req, res) => {
	const offers = await offerService.getAll().lean();

	res.render("offer/catalog", { offers });
});

router.get("/create", isAuth, (req, res) => {
	res.render("offer/create");
});

router.post("/create", isAuth, async (req, res) => {
	const { name, type, production, exploitation, damages, image, price, description } = req.body;
	const payload = { name, type, production, exploitation, damages, image, price, description, owner: req.user };

	try {
		await offerService.create(payload);
		res.redirect("/offer/catalog");
	} catch (error) {
		const errorMessages = extractErrorMessages(error);
		res.status(404).render("offer/create", { errorMessages });
	}
});

router.get("/search", isAuth, async (req, res) => {
	const offers = await offerService.getAll().lean();

	res.render("offer/search", { offers });
});

router.post("/search", isAuth, async (req, res) => {
	const { searchByName, searchByType } = req.body;
	const offers = await offerService.getAll().lean();
	const isSearch = !!searchByName || !!searchByType;

	let offersResult;

	if (searchByName && searchByType) {
		offersResult = offers.filter(
			(offer) => offer.name.toLowerCase().includes(searchByName.toLowerCase()) && offer.type.toLowerCase().includes(searchByType.toLowerCase())
		);
	} else if (searchByName) {
		offersResult = offers.filter((offer) => offer.name.toLowerCase().includes(searchByName.toLowerCase()));
	} else {
		offersResult = offers.filter((offer) => offer.type.toLowerCase().includes(searchByType.toLowerCase()));
	}

	res.render("offer/search", { isSearch, offersResult });
});

router.get("/:offerId/details", async (req, res) => {
	const { offerId } = req.params;
	const { user } = req;

	const offer = await offerService.getOne(offerId).lean();
	const isOwner = offer.owner.toString() === user?._id;
	const hasBought = offer.buyingList?.some((item) => item?._id.toString() === user?._id);

	res.render("offer/details", {
		offer,
		isOwner,
		hasBought
	});
});

router.get("/:offerId/edit", isAuth, async (req, res) => {
	const { offerId } = req.params;

	const offer = await offerService.getOne(offerId).lean();

	res.render("offer/edit", { offer });
});

router.post("/:offerId/edit", isAuth, async (req, res) => {
	const { offerId } = req.params;
	const { name, type, production, exploitation, damages, image, price, description } = req.body;

	const payload = { name, type, production, exploitation, damages, image, price, description, owner: req.user };

	await offerService.updateOne(offerId, payload);

	res.redirect(`/offer/${offerId}/details`);
});

router.get("/:offerId/delete", isAuth, async (req, res) => {
	const { offerId } = req.params;

	await offerService.deleteOne(offerId);

	res.redirect("/offer/catalog");
});

router.get("/:offerId/buy", isAuth, async (req, res) => {
	const { offerId } = req.params;
	const { _id } = req.user;

	await offerService.buyOffer(offerId, _id);

	res.redirect(`/offer/${offerId}/details`);
});

module.exports = router;
