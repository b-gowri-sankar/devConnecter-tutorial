import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Moment from 'react-moment';
import { deleteExperience} from '../../actions/profile'

const Experience = ({experience, deleteExperience}) => {

    const experiences = experience.map(exp => (
        <tr key={exp._id}>
            <td style={{padding:'10px'}}>{exp.company}</td>
            <td className='hide-sm' style={{padding:'10px'}}>{exp.title}</td>
            <td style={{padding:'10px'}}><Moment format='YYYY/MM/DD'>
                {exp.from}
            </Moment> - { exp.to === null ? ('Now') : (<Moment format='YYYY/MM/DD'>
                {exp.to}
            </Moment>)}
            </td>
            <td style={{padding:'10px'}}>
                <button className='btn btn-danger' onClick={e=> deleteExperience(exp._id)}>Delete</button>
            </td>
        </tr>
    ))

    return (
        <React.Fragment>
            <h2 className="my-2">
                Experience Credentails
            </h2>
            <table>
                <thead>
                    <tr>
                        <th >Company</th>
                        <th className="hide-sm">Title</th>
                        <th className="hide-sm">Years</th>
                        <th />

                    </tr>
                </thead>
                <tbody>
                    {experiences}
                </tbody>
            </table>
        </React.Fragment>
    )
}

Experience.propTypes = {
    experience: PropTypes.array.isRequired,
    deleteExperience: PropTypes.func.isRequired
}

export default connect(null,{ deleteExperience})(Experience)
