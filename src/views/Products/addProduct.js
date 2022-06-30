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
  const [translateStatus, setTranslateStatus] = useState(true)
  const [translateData, setTranslateData] = useState(false);

  const [rootcategory, setRootCategory] = useState(null);

  const state = useSelector(state => state.auth.user);
  const [status, setstatus] = useState(true)

  const [compressedFile, setCompressedFile] = useState(null);
  const [imageStatus, setImageStatus] = useState(false);
  const [categories, setCategories] = useState([]);

  const Translate = async (data) => {
    try {
      setTranslateStatus(false)
      const res = await axios.post('/admin/product-translate', { productName: data.tr.name, productDescription: data.tr.description }).catch(err => { throw err.response.status });
      setTranslateData(res.data)
      handleSuccess({ title: 'Çeviri Başarılı', timer: 1000, message: 'Çevir başarılı bir şekilde yapıldı.' });
      setTranslateStatus(true)
    } catch (err) {
      if (err === 404) {
        toast.error(<ErrorToast message={'Çeviri Başarısız!'} />, { icon: false, hideProgressBar: true })
      setTranslateStatus(true)

      } else if (err === 401) {
        dispatch(unAuthorized())
      }
    }
  }
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

    // Ürüne ait ana kategori var ise eklenir 
    if (rootcategory) {
      data.categoryid = rootcategory
      if (translateData) {
        translateData.categoryid = rootcategory
      }
    }
    //Resim varsa form dataya eklenir
    if (state.package === 'deluxe' && imageStatus && compressedFile) formData.append('image', compressedFile, compressedFile.name)

    //Çeviri yapılıyorsa çeviri gönderilir
    if (translateData) {
      translateData.price = data.price;
      formData.set('product', qs.stringify(translateData));
    } else {
      formData.set('product', qs.stringify(data));
    }

    try {
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
                    <Label className='form-label'  > Ürün Adı</Label>
                    <input className='form-control' placeholder='Ürün Adı' {...register("tr.name", { required: true })} />
                  </Col>
                  <Col sm='12' className='mb-1'>
                    <Label className='form-label'  >Açıklama</Label>
                    <input className='form-control' placeholder='Açıklama' {...register("tr.description", { required: false })} />
                  </Col>
                  <Col sm='12' className='mb-1'>
                    <Label className='form-label'  >Fiyat</Label>
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
                    <Label className='form-label' > İngilizce Ürün Adı</Label>
                    {
                      translateData ?
                        <input className='form-control' placeholder='İngilizce Ürün Adı' defaultValue={translateData.en.name}  {...register("en.name")} />
                        : <input className='form-control' placeholder='İngilizce Ürün Adı'  {...register("en.name")} />
                    }
                  </Col>
                  <Col sm='12' className='mb-1'>
                    <Label className='form-label' >İngilizce Açıklama</Label>
                    {
                      translateData ?
                        <input className='form-control' placeholder='İngilizce  Adı' defaultValue={translateData.en.description}  {...register("en.description")} />
                        : <input className='form-control' placeholder='İngilizce  Adı' {...register("en.description")} />
                    }
                  </Col>
                </Row>
                <Row className='mt-2'> 
                  <Col sm='12' className='mb-1'>
                    <Label className='form-label' > Rusça Ürün Adı</Label>
                    {
                      translateData ?
                        <input className='form-control' placeholder='Rusça Ürün Adı' defaultValue={translateData.ru.name}  {...register("ru.name")} />
                        : <input className='form-control' placeholder='Rusça Ürün Adı' {...register("ru.name")} />
                    }                  </Col>
                  <Col sm='12' className='mb-1'>
                    <Label className='form-label'  > Rusça Açıklama</Label>
                    {
                      translateData ?
                        <input className='form-control' placeholder='Rusça  Açıklama' defaultValue={translateData.ru.description}  {...register("ru.description")} />
                        : <input className='form-control' placeholder='Rusça  Açıklama'  {...register("ru.description")} />
                    }
                  </Col>
                </Row>
                <Row className='mt-2'>
                  <Col sm='12' className='mb-1'>
                    <Label className='form-label' > Fransızca Ürün Adı</Label>
                    {
                      translateData ?
                        <input className='form-control'  placeholder='Fransızca Ürün Adı' defaultValue={translateData.fr.name}  {...register("fr.name")} />
                        : <input className='form-control'  placeholder='Fransızca Ürün Adı' {...register("fr.name")} />
                    }
                  </Col>
                  <Col sm='12' className='mb-1'>
                    <Label className='form-label' >Fransızca Açıklama</Label>
                    {
                      translateData ?
                        <input className='form-control' placeholder='Fransızca  Açıklama' defaultValue={translateData.fr.description}  {...register("fr.description")} />
                        : <input className='form-control' placeholder='Fransızca  Açıklama'  {...register("fr.description")} />
                    }
                  </Col>
                </Row>
                <Row className='mt-2'>
                  <Col sm='12' className='mb-1'>
                    <Label className='form-label' > Arapça Ürün Adı</Label>
                    {
                      translateData ?
                        <input className='form-control'  placeholder='Arapça Ürün Adı' defaultValue={translateData.ar.name}  {...register("ar.name")} />
                        : <input className='form-control' placeholder='Arapça Ürün Adı'  {...register("ar.name")} />
                    }
                  </Col>
                  <Col sm='12' className='mb-1'>
                    <Label className='form-label' > Arapça Açıklama</Label>
                    {
                      translateData ?
                        <input className='form-control' placeholder='Arapça Açıklama' defaultValue={translateData.ar.description}  {...register("ar.description")} />
                        : <input className='form-control' placeholder='Arapça Açıklama'  {...register("ar.description")} />
                    }
                  </Col>
                </Row>
                <Row className='mt-2'>
                  <Col sm='12' className='mb-1'>
                    <Label className='form-label' > Almanca Ürün Adı</Label>
                    {
                      translateData ?
                        <input className='form-control' placeholder='Almanca Ürün Adı' defaultValue={translateData.de.name}  {...register("de.name")} />
                        : <input className='form-control' placeholder='Almanca Ürün Adı' {...register("de.name")} />
                    }
                  </Col>
                  <Col sm='12' className='mb-1'>
                    <Label className='form-label' > Almanca Açıklama</Label>
                    {
                      translateData ?
                        <input className='form-control' placeholder='Almanca Açıklama' defaultValue={translateData.de.description}  {...register("de.description")} />
                        : <input className='form-control'  placeholder='Almanca Açıklama' {...register("de.description")} />
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