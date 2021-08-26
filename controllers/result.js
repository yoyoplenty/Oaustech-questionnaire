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

        res.render('studentdashboard', {
            success: "Answer submitted succesfully, please move to the next course",
            student,
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
        let resultNo = await Result.find({ course: courses.course }).countDocuments();
        let theresult = results.slice(0)


        if (results.length < 1) {
            req.flash("success", `No result yet for course ${req.params.course} `)
            return res.redirect('/result/')
        }
        /*   //just to test the solution from stack overflow
           const obj = [{
               _id: "61180e1 c02ceb02dcc5d3173",
               course: 'GST201',
               matricNo: 190409005,
               program: 'stat',
               option: [
                   'StronglyAgree',
                   'agree',
                   'agree',
                   'agree',
                   'StronglyAgree',
                   'StronglyAgree'
               ],
               createdAt: "2021 - 08 - 14 T18: 40: 28.492 Z",
               updatedAt: "2021 - 08 - 14 T18: 40: 28.492 Z",
               __v: 0
           },
           {
               _id: "61180e4 a02ceb02dcc5d317c",
               course: 'GST201',
               matricNo: 180409004,
               program: 'csc',
               option: [
                   'StronglyAgree',
                   'agree',
                   'StronglyAgree',
                   'agree',
                   'StronglyAgree',
                   'agree'
               ],
               createdAt: "2021 - 08 - 14 T18: 41: 14.609 Z",
               updatedAt: "2021 - 08 - 14 T18: 41: 14.609 Z",
               __v: 0
           },
           ];
   
   
           console.log(
               obj.map(e => e.option).map(e => {
                   console.log(e)
                   const l = {};
                   e.forEach(x => l[x] != null ? l[x]++ : l[x] = 1);
                   return Object.entries(l).map(e => `${e[0]}(${e[1]})`)
               })
           ); */

        //test stack overflow solution



        const obj = [{
            _id: "61180e1 c02ceb02dcc5d3173",
            course: 'GST201',
            matricNo: 190409005,
            program: 'stat',
            option: [
                'StronglyAgree',
                'agree',
                'agree',
                'agree',
                'StronglyAgree',
                'StronglyAgree'
            ],
            createdAt: "2021 - 08 - 14 T18: 40: 28.492 Z",
            updatedAt: "2021 - 08 - 14 T18: 40: 28.492 Z",
            __v: 0
        },
        {
            _id: "61180e1 c02ceb02dcc5d3173",
            course: 'GST201',
            matricNo: 190409005,
            program: 'stat',
            option: [
                'agree',
                'agree',
                'disAgree',
                'agree',
                'StronglyAgree',
                'StronglyAgree'
            ],
            createdAt: "2021 - 08 - 14 T18: 40: 28.492 Z",
            updatedAt: "2021 - 08 - 14 T18: 40: 28.492 Z",
            __v: 0
        },
        {
            _id: "61180e4 a02ceb02dcc5d317c",
            course: 'GST201',
            matricNo: 180409004,
            program: 'csc',
            option: [
                'StronglyAgree',
                'agree',
                'StronglyAgree',
                'agree',
                'StronglyAgree',
                'agree'
            ],
            createdAt: "2021 - 08 - 14 T18: 41: 14.609 Z",
            updatedAt: "2021 - 08 - 14 T18: 41: 14.609 Z",
            __v: 0
        },
        {
            _id: "61180e4 a02ceb02dcc5d317c",
            course: 'GST201',
            matricNo: 180409004,
            program: 'csc',
            option: [
                'agree',
                'agree',
                'StronglyAgree',
                'agree',
                'StronglyAgree',
                'disAgree'
            ],
            createdAt: "2021 - 08 - 14 T18: 41: 14.609 Z",
            updatedAt: "2021 - 08 - 14 T18: 41: 14.609 Z",
            __v: 0
        }
        ];

        const Response = [];
        const tmp = obj.map(e => e.option);
        tmp.pop().forEach((e, i, _, res = {}) => (
            [e, ...tmp.map(f => f[i])].forEach(g => res[g] ? res[g] += 1 : res[g] = 1),
            Response.push(res))
        )


        console.log(Response)



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