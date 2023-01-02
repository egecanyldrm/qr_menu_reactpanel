// ** React Imports
import { useState, Fragment } from 'react'

// ** Reactstrap Imports
import { Card, CardHeader, CardTitle, CardBody, Button, ListGroup, ListGroupItem } from 'reactstrap'

import { useDropzone } from 'react-dropzone'
import { X, DownloadCloud } from 'react-feather'
import { ToastError } from '../extension/toast'
import Compressor from 'compressorjs';



const FileUploaderRestrictions = (props) => {
    const { setImage } = props;
    // ** State
    const [file, setFile] = useState(null)

    const { getRootProps, getInputProps } = useDropzone({
        multiple: false,
        accept: 'image/*',
        onDrop: (acceptedFiles, rejectedFiles) => {
            if (rejectedFiles.length) ToastError('Sadece Resim Yükleyebilirsiniz')
            // there is a image 
            else handleCompressedUpload(acceptedFiles[0])
        }
    })

    // ** Handler Functions 
    const handleCompressedUpload = (file) => {
        new Compressor(file, {
            quality: 0.6, // 0.6 can also be used, but its not recommended to go below.,
            resize: 'cover',
            width: 1200,
            height: 1200,
            success: (compressedResult) => {
                setImage(compressedResult)
                setFile(Object.assign(compressedResult, { puresize: file.size }))
            }
        });
    };
    const handleRemoveFile = () => setFile(null)

    const renderFileSize = size => {
        if (Math.round(size / 100) / 10 > 1000) {
            return `${(Math.round(size / 100) / 10000).toFixed(1)} mb`
        } else {
            return `${(Math.round(size / 100) / 10).toFixed(1)} kb`
        }
    }

    return (
        <Card >
            <CardHeader>
                <CardTitle tag='h4'> Resmi Yükleme Alanı</CardTitle>
            </CardHeader>
            <CardBody >

                {file ? (
                    <ListGroup className='my-2'>
                        <ListGroupItem className='d-flex align-items-center justify-content-between'>
                            <div className='file-details d-flex align-items-center'>
                                <div className='file-preview me-1'>
                                    <img className='rounded' alt={file.name} src={URL.createObjectURL(file)} height='100' width='100' />
                                </div>
                                <div>
                                    <p className='file-name mb-0'>{file.name}</p>
                                    <p className='file-size mb-0'> Orjinal Boyut : {renderFileSize(file.puresize)}</p>
                                    <p className='file-size mb-0'> Yeni Boyut :  {renderFileSize(file.size)}</p>
                                </div>
                            </div>
                            <Button color='danger' outline size='md' className='btn-icon' onClick={handleRemoveFile}> Temizle   </Button>
                        </ListGroupItem>
                    </ListGroup>
                ) :
                    <div {...getRootProps({ className: 'dropzone' })}  >
                        {!file ? <input  {...getInputProps()} /> : null}
                        <div className='d-flex align-items-center justify-content-center flex-column'>
                            <DownloadCloud size={64} />
                            <h5>Resim Yüklemek İçin Tıklayınız</h5>
                            <p className='text-secondary'>
                                Sürükle Bırak Özelliği İle Bilgisayarınızdan Yükleyebilirsiniz
                            </p>
                        </div>
                    </div>
                }
            </CardBody>
        </Card>
    )
}

export default FileUploaderRestrictions