const express = require('express')
const router = express.Router()
const gravatar = require('gravatar')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const keys = require('../Config/keys')
const passport = require('passport')
//load user model
const User = require('../models/User');


// router.get('/users/test', (req,res) => res.json({msg: 'Users Works'}));

router.get('/users', function (req, res) {
    User.find()
        .then(users => res.json(users))
        .catch(err => res.status(500).json({ error: err }))
})

router.post('/users/register', (req, res) => {
    User.findOne({ email: req.body.email })
        .then(user => {
            if (user) {
                return res.status(400).json({ email: "Email or password is invalid" })
            } else {
                const avatar = gravatar.url(req.body.email, {
                    s: '200',//size
                    r: 'pg', // rating
                    d: 'mm' //default
                });

                const newUser = new User({
                    name: req.body.name,
                    email: req.body.email,
                    avatar,
                    password: req.body.password,
                });
                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(newUser.password, salt, (err, hash) => {
                        if (err) throw err;
                        newUser.password = hash;
                        newUser.save()
                            .then(user => res.json(user))
                            .catch(err => console.error(err));
                    })
                })
            }
        })
});
//  api/users/login
router.post('/users/login', (req, res) => {
    const email = req.body.email;
    const password = req.body.password
    User.findOne({ email })
        .then(user => {
            if (!user) {
                return res.status(400).json({ email: 'User not found' });
            }

            //check pass
            bcrypt.compare(password, user.password)
                .then(isMatch => {
                    if (isMatch) {
                        //user match
                        const payload = { id: user.id, name: user.name, avatar: user.avatar }; // create payload jwt
                        //sign token
                        jwt.sign(payload, keys.secretOrKey, { expiresIn: 3600 }, (err, token) => {
                            res.json({ success: true,
                                token: 'Bearer ' + token })
                        });

                    } else {
                        return res.status(400).json({ password: 'Password Incorrect' })
                    }
                })


        })
});

//  api/users/current private
router.get('/users/current', passport.authenticate('jwt', { session: false }), (req,res)=>{
    res.json({
        id: req.user.id,
        name: req.user.name,
        email: req.user.email,
    })
    });


module.exports = router