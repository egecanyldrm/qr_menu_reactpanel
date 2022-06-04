// ** Icons Import
const Footer = () => {
  return (
    <p className='clearfix mb-0'>
      <span className='float-md-start d-block d-md-inline-block mt-25'>
        {new Date().getFullYear()}{' '}
        <a href={process.env.REACT_APP_COMPANY_WEB_SITE} target='_blank' rel='noopener noreferrer'>
          {process.env.REACT_APP_COMPANY_NAME} {' '}
        </a>
        <span className='d-none d-sm-inline-block'> Tüm Hakları Saklıdır.</span>
      </span>

    </p>
  )
}

export default Footer
