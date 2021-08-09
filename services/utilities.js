const bcrypt = require("bcryptjs");

exports.hashPassword = async (password) => {
	const salt = bcrypt.genSalt(10),
		hash = bcrypt.hash(password, salt);

	return hash;
};

exports.checkPassword = async (password, hashedPassword) => {
	return (result = bcrypt.compare(password, hashedPassword));
};
