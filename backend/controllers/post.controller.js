const Post = require('../model/post.model')
const fs = require('fs');

exports.createPost = (req, res) => {

    const postObject = req.file ? {
        userId: req.body.userId,
        name: req.body.name,
        description: req.body.description,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
        likes: 0,
        usersLiked: [],
        createdAt: new Date().getTime()
    } : {
        userId: req.body.userId,
        name: req.body.name,
        description: req.body.description,
        imageUrl: "",
        likes: 0,
        usersLiked: [],
        createdAt: new Date().getTime()
    };
    //console.log(postObject)

    const post = new Post({
        ...postObject,
    });

    console.log()
    post.save()
        .then((post) => res.status(201).json({ post }))
        .catch(error => {
            console.log(error)
            res.status(400).json({ error })
        });
};

exports.getAllPost = (req, res) => {
    Post.find()
        .then(post => {
            res.status(200).json(post);
        })
        .catch(error => {
            res.status(404).json({ error })
        });
};

exports.getOnePost = (req, res) => {
    Post.findOne({ _id: req.params.id })
        .then(post => {
            res.status(200).json(post);
        })
        .catch(error => res.status(404).json({ error }));
};

exports.updatePost = (req, res) => {

    // création d'un objet post, afin de remplacer le contenu des variables du body.
    const postObject = req.file ? {
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };

    delete postObject._userId;
    Post.findOne({ _id: req.params.id })
        .then((post) => {
            if (post.userId != req.auth.userId
                && req.auth.userId != `${process.env.SUPERUSER}`) {
                res.status(401).json({ message: 'Vous n êtes pas autorisée' });
            } else {
                Post.updateOne({ _id: req.params.id }, { ...postObject, _id: req.params.id })
                    .then((result) => {
                        console.log(result)
                        res.status(200).json({ message: 'Le post a bien été mise à jour' })
                        })
                    .catch(error => res.status(401).json({ error }));
            }
        })
        .catch((error) => {
            res.status(400).json({ error });
        });

};

exports.deletePost = (req, res) => {
    Post.findOne({ _id: req.params.id })
        .then((post) => {
            if (post) {
                if (post.userId != req.auth.userId
                    && req.auth.userId != `${process.env.SUPERUSER}`) {
                    res.status(401).json({ message: 'Vous n êtes pas autorisée' });
                }
                else {
                    if (post.imageUrl)
                    {
                    const filename = post.imageUrl.split('/images/')[1];
                    fs.unlink(`images/${filename}`, () => {
                        Post.deleteOne({ _id: req.params.id })
                            .then(() => { res.status(200).json({ message: 'Le post a été supprimé' }) })
                            .catch(error => {
                                console.error(error)
                                res.status(401).json({ error })
                            });
                    });
                } else {
                    Post.deleteOne({ _id: req.params.id })
                    .then(() => { res.status(200).json({ message: 'Le post a été supprimé' }) })
                    .catch(error => {
                        console.error(error)
                        res.status(401).json({ error })
                    });
                }
                }
            }
        })
        .catch(error => {
            console.error(error)
            res.status(500).json({ error })
        });
};


exports.likePost = (req, res) => {
    if (req.body.like == true) {
        Post.findOne({ _id: req.params.id })
            .then((post) => {
                if (!post.usersLiked.includes(req.body.userId)) {
                    Post.updateOne(
                        { _id: req.params.id },
                        {
                            $inc: {
                                likes: 1
                            },
                            $push: { usersLiked: req.body.userId }
                        }
                    )
                        .then(() => res.status(201).json({ message: 'Vous aimé le post' }))
                        .catch((error) => res.status(400).json({ error }));
                }
            })
            .catch((error) => res.status(400).json({ error }));
    }

    if (req.body.like == false) {
        Post.findOne({ _id: req.params.id })
            .then((post) => {
                if (post.usersLiked.includes(req.body.userId)) {
                    Post.updateOne(
                        { _id: req.params.id },
                        {
                            $inc: {
                                likes: -1
                            },
                            $pull: { usersLiked: req.body.userId }
                        }
                    )
                        .then(() => res.status(201).json({ message: 'Votre vote a ete mis a jour' }))
                        .catch((error) => res.status(400).json({ error }));
                }
            })
    }
};