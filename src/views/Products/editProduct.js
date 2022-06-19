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
      const { data } = await axios.post('/admin/get-product', { productId: params.productid }).catch(err => { throw err.response.status });
      setData(data)
      //Kategorilerin Yüklenmesi
      const selectCategories = data.categories.map(category => { return { label: category.tr.name, value: category._id } })
      setCategories(selectCategories)

      //Ürünün kategorisi
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
                        TR
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
                        EN
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
                        RU
                      </NavLink>
                    </NavItem>
                  }
                </Nav>
                <TabContent className='py-50' activeTab={active}>
                  <TabPane tabId='1'>
                    <Row>
                      <Col sm='12' className='mb-1'>
                        <Label className='form-label' for='nameVertical'>   Ürün Adı </Label>
                        <input className='form-control' defaultValue={data.product.tr.name} placeholder='Ürün Adı' {...register("tr.name", { required: true })} />
                      </Col>
                      <Col sm='12' className='mb-1'>
                        <Label className='form-label' for='descriptionVertical'> Açıklama</Label>
                        <input className='form-control' defaultValue={data.product.tr.description} placeholder='Ürün Açıklaması' {...register("tr.description", { required: true })} />
                      </Col>
                      <Col sm='12' className='mb-1'>
                        <Label className='form-label' for='descriptionVertical'>  Fiyat</Label>
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
                    <Row>
                      <Col sm='12' className='mb-1'>
                        <Label className='form-label' for='nameVertical'>Kategori Adı</Label>
                        <input className='form-control' defaultValue={data.product.en.name} placeholder='Ürün Adı' {...register("en.name", { required: false })} />
                      </Col>
                      <Col sm='12' className='mb-1'>
                        <Label className='form-label' for='descriptionVertical'> Açıklama</Label>
                        <input className='form-control' defaultValue={data.product.en.description} placeholder='Açıklama' {...register("en.description", { required: false })} />
                      </Col>
                    </Row>
                  </TabPane>
                  <TabPane tabId='3'>
                    <Row>
                      <Col sm='12' className='mb-1'>
                        <Label className='form-label' for='nameVertical'>Kategori Adı</Label>
                        <input className='form-control' defaultValue={data.product.ru.name} placeholder='Ürün Adı' {...register("ru.name", { required: false })} />
                      </Col>
                      <Col sm='12' className='mb-1'>
                        <Label className='form-label' for='descriptionVertical'>Açıklama</Label>
                        <input className='form-control' defaultValue={data.product.ru.description} placeholder='Açıklama' {...register("ru.description", { required: false })} />
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

          </Card> :
          <div></div>
        }

      </Fragment>
    )
  }
}
export default PillFilled