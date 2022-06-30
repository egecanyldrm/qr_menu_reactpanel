// ** React Imports
import { Fragment, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify'
import Select from 'react-select'
import qs from 'qs';
import { unAuthorized } from '../../redux/authentication';
// ** Reactstrap Imports
import { TabContent, TabPane, Nav, NavItem, NavLink, Card, CardBody, Spinner, Row, Alert, Col, Label, Input, Button, CardFooter, FormFeedback } from 'reactstrap'
import FileUploaderRestrictions from '../../components/FileUploaderRestrictions'
import Compressor from 'compressorjs';
import axios from 'axios';
import { handleSuccess } from '../../extension/basicalert'
import { ErrorToast } from '../../extension/toast';
import { useHistory } from "react-router-dom";
import { useForm } from 'react-hook-form';

const PillFilled = () => {
  // ** States
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [active, setActive] = useState('1');
  const [translateStatus, setTranslateStatus] = useState(true)
  const dispatch = useDispatch();
  const navigate = useHistory()
  const [status, setstatus] = useState(true)
  const [translateData, setTranslateData] = useState(false);

  const state = useSelector(state => state.auth.user);


  const [compressedFile, setCompressedFile] = useState(null);
  const [imageStatus, setImageStatus] = useState(false);

  const handleCompressedUpload = (file) => {
    const image = file;
    new Compressor(image, {
      quality: 0.6, // 0.6 can also be used, but its not recommended to go below.,
      resize: 'cover',
      width: 1200,
      height: 1200,
      success: (compressedResult) => {
        // compressedResult has the compressed file.
        // Use the compressed file to upload the images to your server.    
        setCompressedFile(compressedResult)
      }
    });
  };


  useEffect(() => {
    if (compressedFile) {
      setImageStatus(true)
    }
  }, [compressedFile])

  const toggle = tab => {
    setActive(tab)
  }

  const Translate = async (data) => {
    try {
      setTranslateStatus(false)
      const res = await axios.post('/admin/category-translate', { categoryName: data.tr.name }).catch(err => { throw err.response.status });
      setTranslateData(res.data)
      handleSuccess({ title: 'Çeviri Başarılı', timer: 1000, message: 'Çevir başarılı bir şekilde yapıldı.' });
      setTranslateStatus(true)
    } catch (err) {
      if (err === 404) {
        toast.error(<ErrorToast message={'Çeviri Başarısız!'} />, { icon: false, hideProgressBar: true })
      } else if (err === 401) {
        dispatch(unAuthorized())
      }
    }
  }

  const onSubmit = async (data) => {
    if ((imageStatus && compressedFile) && (data.tr.name)) {
      setstatus(false)
      const formData = new FormData();

      if (translateData) formData.set('category', qs.stringify(translateData.category))
      else formData.set('category', qs.stringify(data));

      formData.append('image', compressedFile, compressedFile.name);
      try {
        await axios.post('/admin/add-category', formData).catch(err => { throw err.response.status })
        setstatus(true)
        handleSuccess({ title: 'Kayıt Başarılı', timer: 1200, message: 'Kategori başarılı bir şekilde kayıt edildi.' });
        setTimeout(() => {
          navigate.push('/categories')
        }, 1200)
      } catch (err) {
        if (err === 501) {
          toast.error(<ErrorToast message={'Kayıt İşlemi Başarısız oldu'} />, { icon: false, hideProgressBar: true })
          setstatus(true)
        } else if (err === 401) {
          dispatch(unAuthorized())
        }
      }

    } else if (!compressedFile) {
      toast.error(<ErrorToast message={'Lütfen Resim Yükleyiniz'} />, { icon: false, hideProgressBar: true })
    }
  }
  return (
    <Fragment>
      <Card>
        <form onSubmit={() => {
          handleSubmit(onSubmit)(event).catch((error) => {
          })
        }}>
          <CardBody>
            <Nav pills fill>
              {state.package === 'deluxe' &&

                <NavItem>
                  <NavLink
                    active={active === '1'}
                    style={state.language === false ? { maxWidth: '25%' } : {}}
                    onClick={() => {
                      toggle('1')
                    }}
                  >
                    Genel
                  </NavLink>
                </NavItem>
              }

              {state.language === true &&
                <NavItem>
                  <NavLink
                    active={active === '2'}
                    onClick={() => {
                      toggle('2')
                    }}
                  >
                    Dil Bilgileri
                  </NavLink>
                </NavItem>
              }

            </Nav>
            <TabContent className='py-50' activeTab={active}>
              <TabPane tabId='1'>
                <Row>
                  <Col sm='12' className='mb-1'>
                    <Label className='form-label' for='nameVertical'>
                      Kategori Adı
                    </Label>
                    <input className='form-control' placeholder='Kategori Adı'  {...register("tr.name", { required: true })} />
                  </Col>
                </Row>
                <FileUploaderRestrictions clearImage={setCompressedFile} handleCompressedUpload={handleCompressedUpload} />
              </TabPane>
              <TabPane tabId='2'>
                <Row>
                  <Col sm='12' className='mb-1'>
                    <Label className='form-label' for='nameVertical'>   İngilizce </Label>
                    {
                      translateData ?
                        <input className='form-control' placeholder='İngilizce ' defaultValue={translateData.category.en.name}  {...register("en.name")} />
                        :
                        <input className='form-control' placeholder='İngilizce ' {...register("en.name")} />

                    }
                  </Col>
                </Row>
                <Row>
                  <Col sm='12' className='mb-1'>
                    <Label className='form-label' for='nameVertical'> Rusça</Label>
                    {
                      translateData ?
                        <input className='form-control' placeholder='Rusça ' defaultValue={translateData.category.ru.name}  {...register("ru.name")} />
                        :
                        <input className='form-control' placeholder='Rusça ' {...register("ru.name")} />
                    }
                  </Col>
                </Row>

                <Row>
                  <Col sm='12' className='mb-1'>
                    <Label className='form-label' for='nameVertical'> Fransızca</Label>
                    {
                      translateData ?
                        <input className='form-control' placeholder='Fransızca ' defaultValue={translateData.category.fr.name}  {...register("fr.name")} />
                        :
                        <input className='form-control'   placeholder='Fransızca' {...register("fr.name")} />
                    }
                  </Col>
                </Row>
                <Row>
                  <Col sm='12' className='mb-1'>
                    <Label className='form-label' for='nameVertical'> Arapça</Label>
                    {
                      translateData ?
                        <input className='form-control' placeholder='Arapça' defaultValue={translateData.category.ar.name}  {...register("ar.name")} />
                        :
                        <input className='form-control' placeholder='Arapça' {...register("ar.name")} />
                    }
                  </Col>

                </Row>
                <Row>
                  <Col sm='12' className='mb-1'>
                    <Label className='form-label' for='nameVertical'> Almanca</Label>
                    {
                      translateData ?
                        <input className='form-control' placeholder='Almanca' defaultValue={translateData.category.de.name}  {...register("de.name")} />
                        :
                        <input className='form-control'  placeholder='Almanca' {...register("de.name")} />
                    }
                  </Col>
                </Row>
              </TabPane>

            </TabContent>
          </CardBody>
          <CardFooter>
            <div className='d-flex'>
              {status ?

                <Button type='submit' className='me-1' color='primary'>
                  Kaydet
                </Button>
                :
                <Button color='primary'>
                  <Spinner color='white' size='sm' />
                  <span className='ms-50'>Yükleniyor...</span>
                </Button>
              }
              <div className='ms-2'>
                {
                  state.language === true && translateStatus ?
                    <Button onClick={() => handleSubmit(Translate)(event).catch((error) => { })
                    } className='me-1' color='danger'>
                      Otomatik Dil Çevirme
                    </Button>
                    :
                    <Button color='danger'>
                      <Spinner color='white' size='sm' />
                      <span className='ms-50'> Dil Çevirisi Yapılıyor...</span>
                    </Button>
                }

              </div>
            </div>
          </CardFooter>

        </form>

      </Card>

    </Fragment>
  )
}
export default PillFilled

