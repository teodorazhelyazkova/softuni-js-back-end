const mongoose = require("mongoose");

const offerSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
		minLength: [10, "Name is too short"]
	},
	type: {
		type: String,
		required: true,
		minLength: [2, "Type is too short"]
	},
	damages: {
		type: String,
		required: true,
		minLength: [10, "Damages is too short"]
	},
	image: {
		type: String,
		required: true,
		match: [/^https?:\/\/.+/, "Provide valid image link"]
	},
	description: {
		type: String,
		required: true,
		minLength: [10, "Description is too short"],
		maxLength: [200, "Description is too long"]
	},
	production: {
		type: Number,
		required: true,
		min: [1900, "Production year is too old"],
		max: [2023, "Production years is invalid"]
	},
	exploitation: {
		type: Number,
		required: true,
		min: [0, "Invalid exploitation years"]
	},
	price: {
		type: Number,
		required: true,
		min: [0, "Invalid price"]
	},
	buyingList: [
		{
			type: mongoose.Types.ObjectId,
			ref: "User"
		}
	],
	owner: {
		type: mongoose.Types.ObjectId,
		ref: "User"
	}
});

const Offer = mongoose.model("Offer", offerSchema);

module.exports = Offer;
