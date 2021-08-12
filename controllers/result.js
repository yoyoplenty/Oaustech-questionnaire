const Result = require("../models/Results"),
    Student = require("../models/Students"),
    Courses = require("../models/courses"),
    Question = require("../models/question")


exports.createresult = async (req, res) => {
    try {
        //get student that posted
        let student = req.session.user;
        //get the course the student posted
        let course = req.session.course

        console.log(req.body)
        // i will still implement it that once a student with that matric no and same with course is found he wont be able to create the course, since he has submitted as well
        let courseClicked = await Result.findOne({
            $and: [{ matricNo: student.matricNo }, { course: course.course }],
        });

        if (courseClicked) {
            return res.render('studentdashboard', {
                error: `Cannot submit course ${course.course}, You have given a response already`,
                student
            })
        }

        const result = new Result({
            course: course.course,
            matricNo: student.matricNo,
            program: student.program,
            option: req.body.option
        });
        //this is to ensure the value selected does not exceed no of question
        let objectLength = Object.keys(req.body.option).length
        console.log(objectLength)
        //save result to database
        result.save()

        if (!result) {
            return res.send('data did not save')
        }

        res.render('studentdashboard', {
            success: "Answer submitted succesfully, please move to the next course",
            student
        })
    } catch (error) { }

};

exports.getresult = async (req, res) => {
    try {
        //get all courses
        let Course = await Courses.find({})
        let totalNo = await Courses.find({}).countDocuments()
        let allCourses = Course.slice(0)

        //render the courses based on level

        //to get 100 level course
        let all100 = allCourses.filter(function (first) {
            return first.courseCode.charAt('0') == 1
        })
        //to get 200 level course
        let all200 = allCourses.filter(function (first) {
            return first.courseCode.charAt('0') == 2
        })
        //to get 300 level course
        let all300 = allCourses.filter(function (first) {
            return first.courseCode.charAt('0') == 3
        })
        //to get 400 level course
        let all400 = allCourses.filter(function (first) {
            return first.courseCode.charAt('0') == 4
        })
        //to get 500 level course
        let all500 = allCourses.filter(function (first) {
            return first.courseCode.charAt('0') == 5
        })

        //still want to render each courses in bootstrap row based on level
        //dont want it to be hard coded
        console.log(totalNo)
        res.render('admin/allcourse', {
            all100,
            all200,
            all300,
            all400,
            all500,
            totalNo
        })

    } catch (error) { }
}
exports.geteachresult = async (req, res) => {
    try {
        let courses = req.params
        //set session to particular course
        req.session.course = courses;
        //get all results from database
        let result = await Result.find({})
        //get result that matches the course clicked
        let results = await Result.find({ course: courses.course })

        if (results.length < 1) {
            req.flash("success", `No result yet for course ${req.params.course} `)
            return res.redirect('/result/')
        }

        let theresult = results.slice(0)
        console.log(theresult)

        //just to display question as well as result
        let question = await Question.find({})


        if (courses) {
            return res.render('admin/eachresult', {
                question: question,
                course: courses.course
            })
        }

    } catch (error) { }
}