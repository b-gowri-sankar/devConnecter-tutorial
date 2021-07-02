const express = require('express')
const Post = require('../../models/Posts')
const router = express.Router();
const { check, validationResult } = require('express-validator')
const auth = require('../../middleware/auth')
const Profile = require('../../models/Profile')
const User = require('../../models/Users')

//@route    POST api/Posts
// @desc    Create a Post
//@access   private

router.post('/', [auth, [
    
    check('text', 'text is required')
        .not()
        .isEmpty(),
]], async (req, res) => {
    try {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array()})
        }

        const user = await User.findById(req.user.id).select('-password')

        const newPost = {
            text: req.body.text,
            name: user.name,
            avatar: user.avatar,
            user: req.user.id
        }

        const post = new Post(newPost);

        await post.save();
        return res.json(post)
    }
    catch (err) {
        console.error(err.message);
        return res.send(500).json({msg:'Internal Server Error'})
    }
})

//@route    GET api/Posts
// @desc    Get All Posts
//@access   private


router.get('/', auth, async (req, res) => {
    try {
        
        const posts = await Post.find().sort({ date: -1 });
        res.json(posts)

    } catch (err) {
        console.error(err.message)
        res.status(500).send('Internal Server Error')
    }
})

//@route    GET api/Posts/:id
// @desc    GET Post by ID
//@access   private

router.get('/:id', auth, async (req, res) => {
    try {
        const post = await Post.findOne({ _id: req.params.id })
        if (!post) {
            return res.status(404).json({msg:'Post Not Found'})
        }
        res.json(post)
    }
    catch (err) {
        console.error(err.message)
        if (err.kind === 'ObjectId') {
            return res.status(404).json({msg:"Post Not Found"})
        }
        res.status(500).send('internal Server error')
    }
})

//@route    DELETE api/Posts/:id
// @desc    DELETE Post by ID
//@access   private

router.delete('/:id', auth, async (req, res) => {
    try {
        
        const post = await Post.findById(req.params.id);
        //check user 
        if(!post) return res.status(404).json({msg:"post not found"})

        if (post.user.toString() !== req.user.id) {
            return res.status(401).json({msg:'User not authorized'})
        }

        await post.remove();

        return res.json({msg: 'Post removed'})

    } catch (err) {
        console.error(err.message)
        if (err.kind === 'ObjectId') {
            return res.status(404).json({msg:"Post Not Found"})
        }
        res.status(500).send("internal Server Error")
    }
})

//@route    Put api/Posts/like/:id
// @desc    like a Post
//@access   private

router.put('/like/:id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) return res.status(404).json({ msg: "file not found" })
        

        if (post.likes.filter(like => like.user.toString() === req.user.id).length>0) {
            return res.status(400).json({ msg: 'Post alread liked'})
        }

        post.likes.unshift({ user: req.user.id })
        
        await post.save()

        return res.json(post.likes);
        
    } catch (err) {
        console.error(err.message)
        if(err.kind === 'ObjectId') return res.status(404).json({msg: "file not found"})
        res.status(500).send('Internal server Error')
    }
})

//@route    Unlike api/Posts/like/:id
// @desc    like a Post
//@access   private

router.put('/unlike/:id', auth, async (req, res) => {
    try {
        const post =await Post.findById(req.params.id);

        if (!post) return res.status(404).json({ msg: 'Post Not Found' })
        if (post.likes.filter(like => like.user.toString() === req.user.id).length === 0) {
            return res.status(400).send({msg:' post has not been liked'})
        }
        // console.log('in unlike page')


        //Get Remove Index

        const removeIndex = post.likes.map(like => like.user.toString()).indexOf(req.user.id)
        post.likes.splice(removeIndex, 1)

        await post.save()

        res.send('the post is unliked')

    } catch (err) {
        console.error(err.message)
        if(err.kind === 'ObjectId') return res.status(404).json({msg:'file not found'})
        res.status(500).send('Internal Server Error')    
    }
})

//@route    put api/Posts/comments/:id
// @desc    Post comment to a post
//@access   private

router.put('/comment/:id', [auth,
    [
        check('text', 'text is required')
            .not()
            .isEmpty(),
    ]
], async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array()})
    }

    try {
        const user = await User.findById(req.user.id).select('-password')
        const post = await Post.findById(req.params.id)
        if(!user || !post) return res.status(400).json({ msg:'post not found'})
        const newComment = {
            text: req.body.text,
            user: req.user.id,
            avatar: user.avatar,
            name: user.name
        }
        
        post.comments.unshift(newComment);

        await post.save()

        return res.send(post.comments)

    }
    catch (err) {
        console.error(err.message)
        if(err.kind==='ObjectId') return res.json({ msg: 'file not found'})
        return res.status(500).json({ msg:'Internal Server Error'})
    }
})


module.exports = router;