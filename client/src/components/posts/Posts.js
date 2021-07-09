import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { getPosts } from '../../actions/post'
import Spinner from '../layout/Spinner'
import PostItem from './PostItem'

const Posts = ({ getPosts, post: {
    posts,
    loading
} }) => {
    React.useEffect(() => {
        getPosts()
    },[getPosts])
    return loading ? <Spinner /> : (
        <React.Fragment>
            <h1 className='large text-primary'>
                Posts
            </h1>
            <p className='lead'>
                <i className='fas fa-user'></i> Welcome to the Community
            </p>
            {/* post form */}
            {posts.map(post => (
                <PostItem key={post._id} post={post} />
            ))}
        </React.Fragment>
    )
}

Posts.propTypes = {
    getPosts: PropTypes.func.isRequired,
    post: PropTypes.object.isRequired,
}
const mapStateToProps = state => (
    {
        post: state.post
    }
)



export default connect(mapStateToProps, { getPosts })(Posts)
