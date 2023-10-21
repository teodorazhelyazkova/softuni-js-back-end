const Offer = require("../models/Offer");

exports.create = (offerData) => Offer.create(offerData);

exports.getAll = () => Offer.find();

exports.getOne = (offerId) => Offer.findById(offerId).populate("buyingList");

exports.updateOne = (offerId, offerData) => Offer.findByIdAndUpdate(offerId, offerData);

exports.deleteOne = (offerId) => Offer.findByIdAndDelete(offerId);

exports.buyOffer = async (offerId, userId) => {
	const offer = await this.getOne(offerId);
	const haveUserAlreadyBoughtIt = offer.buyingList.some((item) => item?.toString() === userId);

	if (haveUserAlreadyBoughtIt) {
		return;
	}

	offer.buyingList.push(userId);

	return offer.save();
};
