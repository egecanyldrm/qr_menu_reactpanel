// ** React Imports
import { Fragment, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify'
import Select from 'react-select'
import qs from 'qs';
import { unAuthorized } from '../../redux/authentication';
// ** Reactstrap Imports
import { TabContent, TabPane, Nav, NavItem, NavLink, Card, CardBody, Form, Row, Col, Label, Spinner, Button, CardFooter } from 'reactstrap'
import FileUploaderRestrictions from '../../components/FileUploaderRestrictions'
import Compressor from 'compressorjs';
import axios from 'axios';
import { handleSuccess } from '../../extension/basicalert'
import { ErrorToast } from '../../extension/toast';
import { useHistory } from "react-router-dom";
import { useForm } from 'react-hook-form';
const PillFilled = () => {
  // ** States
  const [active, setActive] = useState('1');
  const dispatch = useDispatch();
  const navigate = useHistory()
  const { register, handleSubmit, formState: { errors } } = useForm();

  const [rootcategory, setRootCategory] = useState(null);

  const state = useSelector(state => state.auth.user);
  const [status, setstatus] = useState(true)

  const [compressedFile, setCompressedFile] = useState(null);
  const [imageStatus, setImageStatus] = useState(false);
  const [categories, setCategories] = useState([]);

  const handleCompressedUpload = (file) => {
    const image = file;
    new Compressor(image, {
      quality: 0.6, // 0.6 can also be used, but its not recommended to go below.,
      resize: 'cover',
      width: 1200,
      height: 1200,
      success: (compressedResult) => {
        setCompressedFile(compressedResult)
      }
    });
  };

  useEffect(async () => {

    try {
      const categories = await axios.get('/admin/categories').catch(err => { throw err.response.status });
      const selectCategories = categories.data.map(category => { return { label: category.tr.name, value: category._id } })
      setCategories(selectCategories);
    } catch (err) {
      if (err === 404) {
        toast.error(<ErrorToast message={'Bir Hata Oluştu !'} />, { icon: false, hideProgressBar: true })
        navigate.push('/categories');
      } else if (err === 401) {
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


  const onSubmit = async (data) => {
    setstatus(false)
    const formData = new FormData();
    const json = rootcategory ?
      {
        ...data,
        categoryid: rootcategory
      } :
      data;

    if (state.package === 'deluxe' && imageStatus && compressedFile) {
      formData.append('image', compressedFile, compressedFile.name);
    }
    formData.set('product', qs.stringify(json));

    try {
      // Send the compressed image file to server with XMLHttpRequest.
      await axios.post('/admin/add-product', formData).catch(err => { throw err.response.status })
      setstatus(true)
      handleSuccess({ title: 'Kayıt Başarılı', timer: 1200, message: 'Kategori başarılı bir şekilde kayıt edildi.' });
      setTimeout(() => {
        navigate.push('/products')
      }, 1200)
    } catch (err) {
      if (err === 501) {
        toast.error(<ErrorToast message={'Kayıt İşlemi Başarısız oldu'} />, { icon: false, hideProgressBar: true })
        setstatus(true)
      } else if (err === 401) {
        dispatch(unAuthorized())
      }
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
                    <Label className='form-label' for='nameVertical'> Ürün Adı</Label>
                    <input className='form-control' placeholder='Ürün Adı' {...register("tr.name", { required: true })} />
                  </Col>
                  <Col sm='12' className='mb-1'>
                    <Label className='form-label' for='descriptionVertical'>Açıklama</Label>
                    <input className='form-control' placeholder='Açıklama' {...register("tr.description", { required: true })} />
                  </Col>
                  <Col sm='12' className='mb-1'>
                    <Label className='form-label' for='descriptionVertical'>Fiyat</Label>
                    <input className='form-control' placeholder='Fiyat' {...register("price", { required: true })} />
                  </Col>
                  <Col sm='12' className='mb-1'>
                    <Label className='form-label'>Kategori</Label>
                    <Select
                      noOptionsMessage={({ inputValue: string }) => 'Ürün Bulunamadı...'}
                      // theme={selectThemeColors}
                      className='react-select'
                      classNamePrefix='select'
                      // defaultValue={categories[1]}
                      name='clear'
                      options={categories}
                      isClearable
                      singleValue
                      placeholder='Kategori Seç'
                      onChange={(e) => {
                        if (e) {
                          setRootCategory(e.value)
                        } else {
                          setRootCategory(null)
                        }
                      }}
                    />
                  </Col>
                </Row>
                {state.package === 'deluxe' &&
                  <FileUploaderRestrictions clearImage={setCompressedFile} handleCompressedUpload={handleCompressedUpload} />
                }
              </TabPane>
              <TabPane tabId='2'>
                <Row>
                  <Col sm='12' className='mb-1'>
                    <Label className='form-label' for='nameVertical'>Ürün Adı</Label>
                    <input className='form-control' placeholder='Ürün Adı' {...register("en.name", { required: false })} />
                  </Col>
                  <Col sm='12' className='mb-1'>
                    <Label className='form-label' for='descriptionVertical'> Açıklama</Label>
                    <input className='form-control' placeholder='Açıklama' {...register("en.description", { required: false })} />
                  </Col>
                </Row>
              </TabPane>
              <TabPane tabId='3'>
                <Row>
                  <Col sm='12' className='mb-1'>
                    <Label className='form-label' for='nameVertical'>Ürün Adı</Label>
                    <input className='form-control' placeholder='Ürün Adı' {...register("ru.name", { required: false })} />
                  </Col>
                  <Col sm='12' className='mb-1'>
                    <Label className='form-label' for='descriptionVertical'>Açıklama</Label>
                    <input className='form-control' placeholder='Açıklama' {...register("ru.description", { required: false })} />
                  </Col>
                </Row>
              </TabPane>
              <TabPane tabId='4'>
                <Row>
                  <Col sm='12' className='mb-1'>
                    <Label className='form-label' for='nameVertical'>Ürün Adı</Label>
                    <input className='form-control' placeholder='Ürün Adı' {...register("fr.name", { required: false })} />
                  </Col>
                  <Col sm='12' className='mb-1'>
                    <Label className='form-label' for='descriptionVertical'>Açıklama</Label>
                    <input className='form-control' placeholder='Açıklama' {...register("fr.description", { required: false })} />
                  </Col>
                </Row>
              </TabPane>
              <TabPane tabId='5'>
                <Row>
                  <Col sm='12' className='mb-1'>
                    <Label className='form-label' for='nameVertical'>Ürün Adı</Label>
                    <input className='form-control' placeholder='Ürün Adı' {...register("ar.name", { required: false })} />
                  </Col>
                  <Col sm='12' className='mb-1'>
                    <Label className='form-label' for='descriptionVertical'>Açıklama</Label>
                    <input className='form-control' placeholder='Açıklama' {...register("ar.description", { required: false })} />
                  </Col>
                </Row>
              </TabPane>
              <TabPane tabId='6'>
                <Row>
                  <Col sm='12' className='mb-1'>
                    <Label className='form-label' for='nameVertical'>Ürün Adı</Label>
                    <input className='form-control' placeholder='Ürün Adı' {...register("de.name", { required: false })} />
                  </Col>
                  <Col sm='12' className='mb-1'>
                    <Label className='form-label' for='descriptionVertical'>Açıklama</Label>
                    <input className='form-control' placeholder='Açıklama' {...register("de.description", { required: false })} />
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
            </div>
          </CardFooter>
        </form>
      </Card>
    </Fragment>
  )
}
export default PillFilled