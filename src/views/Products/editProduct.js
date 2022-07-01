// ** React Imports
import { Fragment, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify'
import Select from 'react-select'
import qs from 'qs';
import { unAuthorized } from '../../redux/authentication';
// ** Reactstrap Imports
import { Trash } from 'react-feather'

import { TabContent, TabPane, Nav, NavItem, NavLink, Card, CardBody, Form, Row, Col, Label, Spinner, Button, CardFooter, Table } from 'reactstrap'
import FileUploaderRestrictions from '../../components/FileUploaderRestrictions'
import Compressor from 'compressorjs';
import axios from 'axios';
import { handleSuccess } from '../../extension/basicalert'
import { ErrorToast } from '../../extension/toast';
import { useHistory, useParams } from "react-router-dom";

import { useForm } from 'react-hook-form';

const PillFilled = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const state = useSelector(state => state.auth.user);

  const [active, setActive] = useState('1');
  const dispatch = useDispatch();
  const navigate = useHistory()
  const params = useParams()
  const [status, setstatus] = useState(true)

  const [data, setData] = useState(null);
  const [resultStatus, setResultStatus] = useState(false);

  // Root Category States 
  const [rootcategory, setRootCategory] = useState();
  const [defaultCategory, setDefaultCategory] = useState();

  const [categories, setCategories] = useState([]);
  const [variations, setVariations] = useState([])
  const [name, setName] = useState('')
  const [value, setValue] = useState('')

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

  const removeVariant = (variantKey) => {
    setVariations(variations.filter(item => item.key !== variantKey))
  }

  const addVariation = () => {
    variations.push({ key: name, value: value })
  }

  useEffect(async () => {
    try {
      const { data } = await axios.post('/admin/get-product', { productId: params.productid }).catch(err => { throw err.response.status });
      setData(data)
      //Kategorilerin Yüklenmesi
      const selectCategories = data.categories.map(category => { return { label: category.tr.name, value: category._id } })
      setCategories(selectCategories)
      //Ürünün kategorisi

      if (data.product.variant) setVariations(data.product.variant)

      if (data.productCategory) {

        let category = data.productCategory;
        const defaultRootCategory = { label: category.tr.name, value: category._id }
        setDefaultCategory(defaultRootCategory);
        setRootCategory(defaultRootCategory.value);
      }
      setResultStatus(true)

    } catch (error) {
      if (error === 404) {
        toast.error(<ErrorToast message={'Kayıt Başarısız'} />, { icon: false, hideProgressBar: true })

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

  const onSubmit = async (data) => {
    if ((imageStatus) || data) {
      setstatus(false)
      const formData = new FormData();

      //Varyasyonlar ekleniyor
      if (variations.length > 0) {
        data.variant = variations
      } else {
        data.variant = false
      }
      // Ana kategori varsa ekleniyor
      if (rootcategory) data.categoryid = rootcategory
      // Eğer resim varsa form datanın içine dahil ediliyor 
      if (compressedFile && imageStatus && state.package === 'deluxe') formData.append('image', compressedFile, compressedFile.name);
      formData.set('product', qs.stringify(data));
      try {
        await axios.post(`/admin/edit-product/${params.productid}`, formData).catch(err => { throw err.response.status })
        setstatus(true)
        handleSuccess({ title: 'Kayıt Başarılı', timer: 1200, message: 'Ürün başarılı bir şekilde kayıt edildi.' });
        setTimeout(() => {
          navigate.push('/products')
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
      toast.error(<ErrorToast message={'Lütfen Zorunlu Alanları Doldurun  Ürün Adı, Açıklama, Fiyat'} />, { icon: false, hideProgressBar: true })
    }
  }
  {
    return (
      <Fragment >
        {resultStatus ?
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
                  <NavItem>
                    <NavLink
                      active={active === '3'}
                      onClick={() => {
                        toggle('3')
                      }}
                    >
                      Varyasyon Bilgileri
                    </NavLink>
                  </NavItem>
                </Nav>
                <TabContent className='py-50' activeTab={active}>
                  <TabPane tabId='1'>
                    <Row>
                      <Col sm='12' className='mb-1'>
                        <Label className='form-label'  >   Ürün Adı </Label>
                        <input className='form-control' defaultValue={data.product.tr.name} placeholder='Ürün Adı' {...register("tr.name", { required: true })} />
                      </Col>
                      <Col sm='12' className='mb-1'>
                        <Label className='form-label'  > Açıklama</Label>
                        <input className='form-control' defaultValue={data.product.tr.description} placeholder='Ürün Açıklaması' {...register("tr.description", { required: false })} />
                      </Col>
                      <Col sm='12' className='mb-1'>
                        <Label className='form-label'  >  Fiyat</Label>
                        <input className='form-control' defaultValue={data.product.price} placeholder='Ürün Fiyatı' {...register("price", { required: true })} />
                      </Col>
                      <Col sm='12' className='mb-1'>
                        <Label className='form-label'>Kategori</Label>
                        <Select
                          noOptionsMessage={({ inputValue: string }) => 'Kategori Bulunamadı...'}
                          className='react-select'
                          classNamePrefix='select'
                          defaultValue={defaultCategory}
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
                          }
                          }
                        />
                      </Col>
                    </Row>
                    {state.package === 'deluxe' &&
                      <FileUploaderRestrictions clearImage={setCompressedFile} handleCompressedUpload={handleCompressedUpload} />
                    }
                  </TabPane>
                  <TabPane tabId='2'>
                    <Row className='mt-2'>
                      <Col sm='12' className='mb-1'>
                        <Label className='form-label'  >İngilizce Ürün Adı</Label>
                        <input className='form-control' defaultValue={data.product.en.name} placeholder='Ürün Adı' {...register("en.name", { required: false })} />
                      </Col>
                      <Col sm='12' className='mb-1'>
                        <Label className='form-label'  >  İngilizce Açıklama</Label>
                        <input className='form-control' defaultValue={data.product.en.description} placeholder='Açıklama' {...register("en.description", { required: false })} />
                      </Col>
                    </Row>
                    <Row className='mt-2'>
                      <Col sm='12' className='mb-1'>
                        <Label className='form-label'  > Rusça Ürün Adı</Label>
                        <input className='form-control' defaultValue={data.product.ru.name} placeholder='Ürün Adı' {...register("ru.name", { required: false })} />
                      </Col>
                      <Col sm='12' className='mb-1'>
                        <Label className='form-label'  > Rusça Açıklama</Label>
                        <input className='form-control' defaultValue={data.product.ru.description} placeholder='Açıklama' {...register("ru.description", { required: false })} />
                      </Col>
                    </Row>
                    <Row className='mt-2'>
                      <Col sm='12' className='mb-1'>
                        <Label className='form-label'  > Fransızca Ürün Adı</Label>
                        <input className='form-control' defaultValue={data.product.fr.name} placeholder='Ürün Adı' {...register("fr.name", { required: false })} />
                      </Col>
                      <Col sm='12' className='mb-1'>
                        <Label className='form-label'  > Fransızca Açıklama</Label>
                        <input className='form-control' defaultValue={data.product.fr.description} placeholder='Açıklama' {...register("fr.description", { required: false })} />
                      </Col>
                    </Row>
                    <Row className='mt-2'>
                      <Col sm='12' className='mb-1'>
                        <Label className='form-label'  > Arapça Ürün Adı</Label>
                        <input className='form-control' defaultValue={data.product.ar.name} placeholder='Ürün Adı' {...register("ar.name", { required: false })} />
                      </Col>
                      <Col sm='12' className='mb-1'>
                        <Label className='form-label'  >Arapça Açıklama</Label>
                        <input className='form-control' defaultValue={data.product.ar.description} placeholder='Açıklama' {...register("ar.description", { required: false })} />
                      </Col>
                    </Row>
                    <Row className='mt-2'>
                      <Col sm='12' className='mb-1'>
                        <Label className='form-label'  >Almanca Ürün Adı</Label>
                        <input className='form-control' defaultValue={data.product.de.name} placeholder='Ürün Adı' {...register("de.name", { required: false })} />
                      </Col>
                      <Col sm='12' className='mb-1'>
                        <Label className='form-label'  >Almanca Açıklama</Label>
                        <input className='form-control' defaultValue={data.product.de.description} placeholder='Açıklama' {...register("de.description", { required: false })} />
                      </Col>
                    </Row>
                  </TabPane>



                  <TabPane tabId='3'>
                    <Row>
                      <Col lg='4' md='4' sm='4' className='mb-1'>
                        <Label className='form-label' > Varyant Adı</Label>
                        <input className='form-control' placeholder='Varyant  Adı' value={name} onChange={e => setName(e.target.value)} />
                      </Col>
                      <Col lg='4' md='4' sm='4' className='mb-1'>
                        <Label className='form-label' >Varyant Değeri </Label>
                        <input className='form-control' placeholder='Varyant  Değeri' value={value} onChange={e => setValue(e.target.value)} />
                      </Col>
                      <Col lg='4' md='4' sm='4'>
                        <Button color='success' className='mt-2' onClick={() => {
                          addVariation();
                          setName('')
                          setValue('')
                        }}>
                          Varyant Ekle
                        </Button>
                      </Col>
                    </Row>
                    <Row className='px-1 mt-2'>
                      <Table
                        hover
                        striped
                      >
                        <thead>
                          <tr>
                            <th>
                              Varyant Adı
                            </th>
                            <th>
                              Varyant Değeri
                            </th>
                            <th>
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {variations.map((variation, key) => {
                            return (
                              <tr key={key}>
                                <th scope="row">
                                  {variation.key}
                                </th>
                                <td>
                                  {variation.value}
                                </td>

                                <td>
                                  <Button.Ripple onClick={() => {
                                    removeVariant(variation.key, variation.value)
                                  }} className='btn-icon' color='flat-danger' ><Trash size={17} /></Button.Ripple>
                                </td>
                              </tr>
                            )
                          })}
                        </tbody>
                      </Table>
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

          </Card> :
          <div></div>
        }

      </Fragment>
    )
  }
}
export default PillFilled