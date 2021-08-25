const express = require("express");
const Question = require("./models/question");
const mongoose = require("mongoose");

a = async () => {
	try {
		console.log("a");
		const i = await Question.findOne({});
		console.log("S");
		console.log("list === ", list);
	} catch (error) {}
};

a();
