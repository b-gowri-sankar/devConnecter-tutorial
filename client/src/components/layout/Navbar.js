import React,{ Fragment} from 'react'
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { logout } from '../../actions/auth';

const Navbar = ({ logout, auth: { isAuthenticated, loading } }) => {
    
    const authLinks = (
        <ul>
            <li><Link to="/profiles">Profiles</Link></li>
            <li><Link to='/posts'>Posts</Link></li>
            <li><Link to="/Dashboard"><i className="fa fa-user" />{' '}<span className='hide-sm'>Dashboard</span></Link></li>
            <li><Link to="#!" onClick={logout}>
                <i className="fas fa-sign-out-alt"></i>{' '}
                <span className='hide-sm'>Logout</span></Link></li>
        </ul>
    );
    const guestLinks = (
        <ul>
            <li><Link to="/profiles">Profiles</Link></li>
                    <li><Link to="/">Developers</Link></li>
                    <li><Link to="/register">Register</Link></li>
            <li><Link to="/login">Login</Link></li>
            </ul>
    );

    return (
        <div>
            <nav className="navbar bg-dark">
                <h1>
                    <Link to="/"><i className="fas fa-code"></i> DevConnector</Link>
                </h1>
                {!loading && (<Fragment>{ isAuthenticated ? authLinks: guestLinks}</Fragment>)}
            </nav>
        </div>
    )
}

const mapStateToProps = state => ({
    auth:state.auth
})

Navbar.propTypes = {
    logout: PropTypes.func.isRequired,
    auth:PropTypes.object.isRequired,
}

export default connect(mapStateToProps,{ logout })(Navbar)
