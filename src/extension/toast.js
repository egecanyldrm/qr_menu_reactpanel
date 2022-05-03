// ** React Imports
import { Fragment } from 'react'

import Avatar from '@components/avatar'
import { X, DownloadCloud } from 'react-feather'

// ** Reactstrap Imports

export const ErrorToast = ({ message }) => (
    <Fragment>
        <div className='toastify-header'>
            <div className='title-wrapper'>
                <Avatar size='sm' color='danger' icon={<X size={12} />} />
                <h6 className='toast-title'>Hata!</h6>
            </div>
        </div>
        <div className='toastify-body'>
            <span role='img' aria-label='toast-text'>
                👋 {message}
            </span>
        </div>
    </Fragment>
)
