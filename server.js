const express = require("express");
const app = express();
var exphbs = require("express-handlebars");
const Handlebars = require("handlebars");
var methodOverride = require('method-override')
const mongoose = require("mongoose");
const flash = require("connect-flash");
const path = require("path");
const { ensureAuthenticated, forwardAuthenticated } = require('./configure/auth');
const dotenv = require('dotenv')
const morgan = require("morgan"),
	passport = require("passport");
const session = require("express-session"),
	MongoStore = require("connect-mongo");
const {
	allowInsecurePrototypeAccess,
} = require("@handlebars/allow-prototype-access");
//dotenv
dotenv.config()
// Declaring routes
const index = require("./routes/index"),
	admin = require("./routes/admin"),
	course = require("./routes/course"),
	question = require("./routes/questions"),
	student = require("./routes/students"),
	result = require("./routes/result");

//set Database
mongoose.connect(
	"mongodb://localhost:27017/studentquestionniare",
	{
		useUnifiedTopology: true,
		useNewUrlParser: true,
		useCreateIndex: true,
	},
	() => {
		console.log("Database connected");
	}
);

//atlas mongodb
/*
mongoose.connect(process.env.DATABASE_ACCESS, {
	useUnifiedTopology: true,
	useNewUrlParser: true,
	useCreateIndex: true,
}, () => {
	console.log('Database connected')
})
 */
morgan("dev");

//set view engine
var hbs = exphbs.create({
	handlebars: allowInsecurePrototypeAccess(Handlebars),
});
app.engine("handlebars", hbs.engine);
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "/views"));

//middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
//methov override
app.use(methodOverride('_method'));



/* store: MongoStore.create({
	mongoUrl: "mongodb://localhost:27017/studentquestionniare",
	//mongoUrl: process.env.DATABASE_ACCESS,
	saveUninitialized: true,
	resave: false,
	ttl: 1 * 24 * 60 * 60,
	touchAfter: 24 * 3600,
	crypto: {
		secret: "squirrel",
	},
}), */

//initialize session
app.use(
	session({
		secret: "questionear",
		saveUninitialized: true,
		resave: false,
		ttl: 1 * 24 * 60 * 60,
		touchAfter: 24 * 3600,

	})
);

app.use(
	session({
		secret: "secret",
		resave: true,
		saveUninitialized: true,
	})
);

//initialize passport and flash
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

//Global variables
app.use((req, res, next) => {
	res.locals.success = req.flash("success");
	res.locals.error = req.flash("error");
	res.locals.err = req.flash("err");
	next();
});

//Routes
app.use("/", index);
app.use("/admin", admin);
app.use("/course", course);
app.use("/student", student);
app.use("/question", question);
app.use("/result", result);


//ser PORT
let PORT = process.env.PORT || 3030;

app.listen(PORT, () => {
	console.log(`server up and running at port ${PORT}`);
});
