// ** React Imports
import { Fragment, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify'
import Select from 'react-select'
import qs from 'qs';
import { unAuthorized } from '../../redux/authentication';
// ** Reactstrap Imports
import { TabContent, TabPane, Nav, NavItem, Spinner, NavLink, Card, CardBody, Form, Row, Col, Label, Input, Button, CardFooter } from 'reactstrap'
import FileUploaderRestrictions from '../../components/FileUploaderRestrictions'
import Compressor from 'compressorjs';
import axios from 'axios';
import { handleSuccess } from '../../extension/basicalert'
import { ErrorToast } from '../../extension/toast';
import { useHistory, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";


const PillFilled = () => {
  // ** States
  const [active, setActive] = useState('1');
  const dispatch = useDispatch();
  const navigate = useHistory()
  const state = useSelector(state => state.auth.user);
  const params = useParams()
  const [status, setstatus] = useState(true)

  const [data, setData] = useState(null);

  const [responseStatus, setResponseStatus] = useState();
  const { register, handleSubmit, formState: { errors } } = useForm();



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


  useEffect(async () => {
    try {
      setResponseStatus(false);
      const { data } = await axios.post('/admin/get-category', { categoryId: params.categoryid }).catch(err => { throw err.response.status });
      setData(data)
      setResponseStatus(true);
    } catch (error) {
      if (error === 404) {
        setStatus(false)
      } else if (error === 401) {
        dispatch(unAuthorized())
      }
    }
  }, [])

  useEffect(() => {
    if (compressedFile) {
      setImageStatus(true)
    }
  }, [compressedFile])

  const toggle = tab => {
    setActive(tab)
  }


  const submitForm = async (data) => {
    if ((imageStatus) || (data.tr.name )) {
      setstatus(false)
      const formData = new FormData();

      if (compressedFile) formData.append('image', compressedFile, compressedFile.name);
      formData.set('category', qs.stringify(data));

      try {
        await axios.post(`/admin/edit-category/${params.categoryid}`, formData).catch(err => { throw err.response.status })
        setstatus(true)

        handleSuccess({ title: 'Kayıt Başarılı', timer: 1200, message: 'Kategori başarılı bir şekilde kayıt edildi.' });
        setTimeout(() => {
          navigate.push('/categories')
        }, 1200)
      } catch (err) {
        if (err === 404) {
          toast.error(<ErrorToast message={'Kayıt İşlemi Başarısız oldu'} />, { icon: false, hideProgressBar: true })
          setstatus(true)
        } else if (err === 401) {
          dispatch(unAuthorized())
        }
      }
    } else {
      toast.error(<ErrorToast message={'Lütfen Zorunlu Alanları Doldurun : TR '} />, { icon: false, hideProgressBar: true })
    }
  }
  {
    return (
      <Fragment>
        {responseStatus ?
          <Card>
            <form onSubmit={() => {
              handleSubmit(submitForm)(event).catch((error) => {

              })
            }}>
              <CardBody>
                <Nav pills fill>
                  {
                    state.package === 'deluxe' &&
                    <NavItem>
                      <NavLink
                        active={active === '1'}
                        style={state.language === false ? { maxWidth: '25%' } : {}}

                        onClick={() => {
                          toggle('1')
                        }}
                      >
                        Türkçe
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
                        İngilizce
                      </NavLink>
                    </NavItem>
                  }
                  {state.language === true &&

                    <NavItem>
                      <NavLink
                        active={active === '3'}
                        onClick={() => {
                          toggle('3')
                        }}
                      >
                        Rusça
                      </NavLink>
                    </NavItem>
                  }
                  {
                    state.language === true &&

                    <NavItem>
                      <NavLink
                        active={active === '4'}
                        onClick={() => {
                          toggle('4')
                        }}
                      >
                        Fransızca
                      </NavLink>
                    </NavItem>
                  }
                  {
                    state.language === true &&

                    <NavItem>
                      <NavLink
                        active={active === '5'}
                        onClick={() => {
                          toggle('5')
                        }}
                      >
                        Arapça
                      </NavLink>
                    </NavItem>
                  }
                  {
                    state.language === true &&

                    <NavItem>
                      <NavLink
                        active={active === '6'}
                        onClick={() => {
                          toggle('6')
                        }}
                      >
                        Almanca
                      </NavLink>
                    </NavItem>
                  }
                </Nav>
                <TabContent className='py-50' activeTab={active}>
                  <TabPane tabId='1'>
                    <Row>
                      <Col sm='12' className='mb-1'>
                        <Label className='form-label' for='nameVertical'>Kategori Adı </Label>
                        <input className='form-control' defaultValue={data.category.tr.name} placeholder='Kategori Adı' {...register("tr.name", { required: true })} />
                      </Col>
                      
                    </Row>
                    <FileUploaderRestrictions clearImage={setCompressedFile} handleCompressedUpload={handleCompressedUpload} />

                  </TabPane>
                  <TabPane tabId='2'>
                    <Row>
                      <Col sm='12' className='mb-1'>
                        <Label className='form-label' for='nameVertical'>Kategori Adı </Label>
                        <input className='form-control' defaultValue={data.category.en.name} placeholder='Kategori Adı' {...register("en.name")} />
                      </Col>
                   
                    </Row>
                  </TabPane>
                  <TabPane tabId='3'>
                    <Row>
                      <Col sm='12' className='mb-1'>
                        <Label className='form-label' for='nameVertical'>Kategori Adı </Label>
                        <input className='form-control' defaultValue={data.category.ru.name} placeholder='Kategori Adı' {...register("ru.name")} />
                      </Col>
                    </Row>
                  </TabPane>
                  <TabPane tabId='4'>
                    <Row>
                      <Col sm='12' className='mb-1'>
                        <Label className='form-label' for='nameVertical'>Kategori Adı </Label>
                        <input className='form-control' defaultValue={data.category.fr.name} placeholder='Kategori Adı' {...register("fr.name")} />
                      </Col>
                    </Row>
                  </TabPane>
                  <TabPane tabId='5'>
                    <Row>
                      <Col sm='12' className='mb-1'>
                        <Label className='form-label' for='nameVertical'>Kategori Adı </Label>
                        <input className='form-control' defaultValue={data.category.ar.name} placeholder='Kategori Adı' {...register("ar.name")} />
                      </Col>
                    </Row>
                  </TabPane>
                  <TabPane tabId='6'>
                    <Row>
                      <Col sm='12' className='mb-1'>
                        <Label className='form-label' for='nameVertical'>Kategori Adı </Label>
                        <input className='form-control' defaultValue={data.category.de.name} placeholder='Kategori Adı' {...register("de.name")} />
                      </Col>
                    </Row>
                  </TabPane>
                </TabContent>
              </CardBody>
              <CardFooter>
                <div className='d-flex'>

                  {status ?

                    <Button className='me-1' color='primary' type='submit' >
                      Kaydet
                    </Button>
                    :
                    <Button color='primary'>
                      <Spinner color='white' size='sm' />
                      <span className='ms-50'>Yükleniyor...</span>
                    </Button>
                  }
                </div>
              </CardFooter>
            </form>
          </Card> :
          <div></div>
        }

      </Fragment>
    )
  }
}
export default PillFilled


