import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Moment from 'react-moment';
import { deleteEducation } from '../../actions/profile'

const Education = ({ education, deleteEducation }) => {

    const educations = education.map(edu => (
        <tr key={edu._id}>
            <td style={{padding:'10px'}}>{edu.school}</td>
            <td className='hide-sm' style={{padding:'10px'}}>{edu.degree}</td>
            <td style={{padding:'10px'}}><Moment format='YYYY/MM/DD'>
                {edu.from}
            </Moment> - { edu.to === null ? ('Now') : (<Moment format='YYYY/MM/DD'>
                {edu.to}
            </Moment>)}
            </td>
            <td style={{padding:'10px'}}>
                <button className='btn btn-danger' onClick={()=>deleteEducation(edu._id)}>Delete</button>
            </td>
        </tr>
    ))

    return (
        <React.Fragment>
            <h2 className="my-2">
                Education Credentails
            </h2>
            <table>
                <thead>
                    <tr>
                        <th >School</th>
                        <th className="hide-sm">Degree</th>
                        <th className="hide-sm">Years</th>
                        <th />

                    </tr>
                </thead>
                <tbody>
                    {educations}
                </tbody>
            </table>
        </React.Fragment>
    )
}

Education.propTypes = {
    education: PropTypes.array.isRequired,
    deleteEducation: PropTypes.func.isRequired
}

export default connect(null, { deleteEducation })(Education);
