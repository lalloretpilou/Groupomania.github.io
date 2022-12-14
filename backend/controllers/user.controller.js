const User = require('../model/user.model')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


exports.signup = (req, res, next) => {

    User.exists({ email: req.body.email })
        .then((document) => {
            if (!document) {
                if (req.body.password && isValidEmail(req.body.email)) {
                    bcrypt.hash(req.body.password, 10)
                        .then(hash => {
                            const user = new User({
                                email: req.body.email,
                                superUser: false,
                                password: hash
                            });
                            user.save()
                                .then(() => res.status(201).json({
                                    message: 'Votre Profil a été crée', userId: user._id,
                                    token: jwt.sign(
                                        { userId: user._id },
                                        'RANDOM_TOKEN_SECRET',
                                        { expiresIn: '24h' }
                                    )
                                }))
                                .catch(error => {
                                    console.log(error)
                                    res.status(400).json({ message: "email already exists" })
                                });
                        })
                        .catch(error => res.status(500).json({ error }));
                }
                else {
                    res.status(400).json({ message: "Merci de remplir les champs" })
                }
            } else {
                res.status(400).json({ message: "email already exists" })
            }
        }).catch(
            error => res.status(500).json({ error })
        )
};


exports.login = (req, res, next) => {
    // permet de verifier le regex mail et si le password a bien ete saisie
    if (req.body.password && isValidEmail(req.body.email)) {
        User.findOne({ email: req.body.email })
            .then(user => {
                if (!user) {
                    console.error({ email: req.body.email, password: req.body.password }, "Password and/or email are incorrect")
                    return res.status(401).json({ message: 'Erreur de saisie de connexion' });
                }
                bcrypt.compare(req.body.password, user.password)
                    .then(valid => {
                        if (!valid) {
                            console.error({ email: req.body.email, password: req.body.password }, "Password and/or email are incorrect")
                            return res.status(401).json({ message: 'Erreur de saisie de connexion' });
                        }
                        res.status(200).json({
                            userId: user._id,
                            token: jwt.sign(
                                { userId: user._id },
                                'RANDOM_TOKEN_SECRET',
                                { expiresIn: '24h' }
                            )
                        });
                    })
                    .catch(error => res.status(500).json({ error }));
            })
            .catch(error => res.status(500).json({ error }));
    }
    else
    {
        console.error({ email: req.body.email, password: req.body.password }, "one of theese mandatories is missing")
        res.status(400).json({ message: "bad mandatory" })
    }
};


function isValidEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,3}))$/;
    return re.test(String(email).toLowerCase());
}