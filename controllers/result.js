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
        let allcourses = await Courses.find({})
        let totalNo = await Courses.find({}).countDocuments()

        //still want to render each courses in bootstrap row based on level
        //dont want it to be hard coded
        console.log(totalNo)
        res.render('admin/allcourse', {
            course: allcourses,
            totalNo
        })

    } catch (error) { }
}
exports.geteachresult = async (req, res) => {
    try {
        let courses = req.params
        //set session to particular course
        req.session.course = courses;
        //get Questions from database
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