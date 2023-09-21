const fs = require("fs/promises");

fs.readFile("./input.txt", "utf-8")
	.then((data) => {
		console.log(data);
		return fs.writeFile("./output.txt", data, "utf-8");
	})
	.then(() => console.log("File is saved!"))
	.catch((err) => console.log("Error", err));
