import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Spinner from '../layout/Spinner'
import { getPost } from '../../actions/post'
import PostItem from '../posts/PostItem'
import { Link } from 'react-router-dom'

const Post = ({ getPost, post: { post, loading }, match }) => {
    React.useEffect(() => {
        getPost(match.params.id)
    },[getPost,match.params.id])
    return (
        loading || post === null ?
            <Spinner /> :
            <React.Fragment>
                <Link to='/posts' className='btn'>
                    Back to Posts
                </Link>
                <PostItem post={post} showActions={false} />
            </React.Fragment>
    )
}

Post.propTypes = {
    getPost: PropTypes.func.isRequired,
    post: PropTypes.object.isRequired
}

const mapStateToProps = state => {
    return {
        post: state.post
    }
}

export default connect(mapStateToProps, { getPost })(Post)