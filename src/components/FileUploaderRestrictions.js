// ** React Imports
import { useState, Fragment } from 'react'

// ** Reactstrap Imports
import { Card, CardHeader, CardTitle, CardBody, Button, ListGroup, ListGroupItem } from 'reactstrap'

// ** Custom Components
import Avatar from '@components/avatar'

// ** Third Party Imports
import { toast } from 'react-toastify'
import { useDropzone } from 'react-dropzone'
import { X, DownloadCloud } from 'react-feather'

const ErrorToast = () => (
    <Fragment>
        <div className='toastify-header'>
            <div className='title-wrapper'>
                <Avatar size='sm' color='danger' icon={<X size={12} />} />
                <h6 className='toast-title'>Error!</h6>
            </div>
            <small className='text-muted'>a second ago</small>
        </div>
        <div className='toastify-body'>
            <span role='img' aria-label='toast-text'>
                👋 Sadece Resim Yükleyebilirsiniz
            </span>
        </div>
    </Fragment>
)

const FileUploaderRestrictions = (props) => {
    // ** State
    const [files, setFiles] = useState([])

    const { getRootProps, getInputProps } = useDropzone({
        multiple: false,
        accept: 'image/*',
        onDrop: (acceptedFiles, rejectedFiles) => {
            if (rejectedFiles.length) {
                toast.error(<ErrorToast />, { icon: false, hideProgressBar: true })
            } else {
                setFiles([...files, ...acceptedFiles.map(file => Object.assign(file))])
                props.handleCompressedUpload(acceptedFiles[0])
            }
        }
    })

    const handleRemoveFile = file => {
        const uploadedFiles = files
        const filtered = uploadedFiles.filter(i => i.name !== file.name)
        setFiles([...filtered])
    }

    const renderFileSize = size => {
        if (Math.round(size / 100) / 10 > 1000) {
            return `${(Math.round(size / 100) / 10000).toFixed(1)} mb`
        } else {
            return `${(Math.round(size / 100) / 10).toFixed(1)} kb`
        }
    }

    const fileList = files.map((file, index) => (
        <ListGroupItem key={`${file.name}-${index}`} className='d-flex align-items-center justify-content-between'>
            <div className='file-details d-flex align-items-center'>
                <div className='file-preview me-1'>
                    <img className='rounded' alt={file.name} src={URL.createObjectURL(file)} height='30' width='30' />
                </div>
                <div>
                    <p className='file-name mb-0'>{file.name}</p>
                    <p className='file-size mb-0'>{renderFileSize(file.size)}</p>
                </div>
            </div>
            <Button color='danger' outline size='sm' className='btn-icon' onClick={() => {
                handleRemoveFile(file);
                props.clearImage(null);
            }
            }>

                <X size={14} />
            </Button>
        </ListGroupItem>
    ))

    const handleRemoveAllFiles = () => {
        setFiles([])
        props.clearImage(null)
    }


    return (
        <Card >
            <CardHeader>
                <CardTitle tag='h4'> Resmi Yükleme Alanı</CardTitle>
            </CardHeader>
            <CardBody >
                <div {...getRootProps({ className: 'dropzone' })}  >
                    {!(files.length > 0) &&
                        <input  {...getInputProps()} />
                    }
                    <div className='d-flex align-items-center justify-content-center flex-column'>
                        <DownloadCloud size={64} />
                        <h5>Resim Yüklemek İçin Tıklayınız</h5>
                        <p className='text-secondary'>
                            Sürükle Bırak Özelliği İle Bilgisayarınızdan Yükleyebilirsiniz
                        </p>
                    </div>
                </div>
                {files.length ? (
                    <Fragment>
                        <ListGroup className='my-2'>{fileList}</ListGroup>
                        <div className='d-flex justify-content-end'>
                            <Button className='me-1' color='danger' outline onClick={handleRemoveAllFiles}>
                                Hepsini Temizle
                            </Button>
                        </div>
                    </Fragment>
                ) : null}
            </CardBody>
        </Card>
    )
}

export default FileUploaderRestrictions