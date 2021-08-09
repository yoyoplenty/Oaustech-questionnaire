//Bring in the model
let Students = require('../models/Students');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs')

module.exports = function (passport) {
    passport.use(
        new LocalStrategy({ usernameField: 'matricNo' }, (matricNo, password, done) => {
            //match student
            Students.findOne({ matricNo: matricNo })
                .then(student => {
                    if (!student) {
                        return done(null, false,
                             { message: "That matric number is not registered"
                             });
                    }
                    //match password
                    bcrypt.compare(password, student.password, (err, isMatch) => {
                        if (err) throw err;
                        if (isMatch) {
                            return done(null, student);
                        } else {
                            return done(null, false, { message: 'Password incorrect' })
                        }
                    });
                })
                .catch(err => {
                    console.log(err)
                })
        })
    );
    passport.serializeUser((student, done) => {
        done(null, student.id);
    });

    passport.deserializeUser((id, done) => {
        Students.findById(id, function (err, user) {
            done(err, user);
        });
    });
}