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

        //get the question to ensure proper selection of the response 
        let question = await Question.find({})
        let questionLength = question.length

        //this is to ensure a value is selected
        let thearray = Object.values(req.body)

        if (thearray.length < 1) {
            req.flash("error", `Please ensure to select an option`)
            return res.redirect(`/student/question/${course.course}`)
        }

        //ensure user did not exceed the number of question given a response
        let arrays = Object.values(req.body.option)

        if (questionLength != arrays.length || questionLength < arrays.length) {
            req.flash("error", `Please ensure to select your best response, for each questions and respond to all questions`)
            return res.redirect(`/student/question/${course.course}`)
        }

        //this is to ensure a student dont give a response twice
        let courseClicked = await Result.findOne({
            $and: [{ matricNo: student.matricNo }, { course: course.course }],
        });


        if (courseClicked) {
            req.flash("error", `Cannot submit course ${course.course}, You have given a response already`)
            return res.redirect(`/student/question/${course.course}`)
        }


        const result = new Result({
            course: course.course,
            matricNo: student.matricNo,
            program: student.program,
            option: req.body.option
        });

        //save result to database
        result.save()

        if (!result) {
            req.flash("error", `Data did not save`)
            return res.redirect('/student/dashboard')
        }

        req.flash("success", `Answer submitted succesfully, please move to the next course`)
        return res.redirect('/student/dashboard')
        /* res.render('studentdashboard', {
            success: "Answer submitted succesfully, please move to the next course",
            student,
        }) */
    } catch (error) { }

};

exports.getresult = async (req, res) => {
    try {
        //get all courses
        let Course = await Courses.find({})
        let allCourses = Course.slice(0)

        //render the courses based on level
        //to get 100 level course
        let First = allCourses.filter(function (first) {
            return first.courseCode.charAt('0') == 1
        })
        //to get 200 level course
        let Second = allCourses.filter(function (first) {
            return first.courseCode.charAt('0') == 2
        })
        //to get 300 level course
        let Third = allCourses.filter(function (first) {
            return first.courseCode.charAt('0') == 3
        })
        //to get 400 level course
        let Fourth = allCourses.filter(function (first) {
            return first.courseCode.charAt('0') == 4
        })
        //to get 500 level course
        let Fifth = allCourses.filter(function (first) {
            return first.courseCode.charAt('0') == 5
        })
        //Render so they wont be duplicates
        //100 level all department
        let firstArray = First.map(e => e.course)
        let all100 = [...new Set(firstArray)];
        //200 level
        let secondArray = Second.map(e => e.course)
        let all200 = [...new Set(secondArray)];
        //300 level 
        let thirdArray = Third.map(e => e.course)
        let all300 = [...new Set(thirdArray)];
        //400 level
        let fourthArray = Fourth.map(e => e.course)
        let all400 = [...new Set(fourthArray)];
        //500 level
        let fifthArray = Fifth.map(e => e.course)
        let all500 = [...new Set(fifthArray)];

        //Total Number
        let totalNo = all100.length + all200.length + all300.length + all300.length + all500.length

        //Render the Pages

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
        let resultNo = await Result.find({ course: courses.course }).countDocuments();
        let theresult = results.slice(0)


        if (results.length < 1) {
            req.flash("success", `No result yet for course ${req.params.course} `)
            return res.redirect('/result/')
        }


        const Response = [];
        const tmp = results.map(e => e.option);
        tmp.pop().forEach((e, i, _, res = {}) => (
            [e, ...tmp.map(f => f[i])].forEach(g => res[g] ? res[g] += 1 : res[g] = 1),
            Response.push(res))
        )

        //console.log(Response)
        //just to display question as well as result
        let question = await Question.find({})
        question.sort((a, b) => a.sn - b.sn)

        if (courses) {
            return res.render('admin/eachresult', {
                question: question,
                course: courses.course,
                Response,
                resultNo
            })
        }

    } catch (error) { }
}
exports.getallResult = async (req, res) => {
    try {
        let result = await Result.find({})
        // console.log(result)
        let arry = result.map(e => e.course)
        //console.log(arry)
        let uniqueChars = [...new Set(arry)];
        let resultsNo = uniqueChars.length

        res.render('admin/allresults', {
            result: uniqueChars,
            resultsNo
        })

    } catch (error) { }
}
exports.deleteResult = async (req, res) => {
    try {
        console.log(req.params.course)
        let COURSE = req.params.course
        await Result.deleteMany({ course: COURSE })
        req.flash(`success`, `Result was deleted successfully`)
        res.redirect('/result/all')
    } catch (error) { }
};