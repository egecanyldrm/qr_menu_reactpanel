// ** React Imports
import { Fragment, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify'
import Select from 'react-select'
import qs from 'qs';
import { unAuthorized } from '../../redux/authentication';
// ** Reactstrap Imports
import { TabContent, TabPane, Nav, NavItem, NavLink, Card, CardBody, Form, Row, Col, Label, Input, Button, CardFooter } from 'reactstrap'
import FileUploaderRestrictions from '../../components/FileUploaderRestrictions'
import Compressor from 'compressorjs';
import axios from 'axios';
import { handleSuccess } from '../../extension/basicalert'
import { ErrorToast } from '../../extension/toast';
import { useHistory, useParams } from "react-router-dom";



const PillFilled = () => {
  // ** States
  const [active, setActive] = useState('1');
  const dispatch = useDispatch();
  const navigate = useHistory()
  const params = useParams()
  const [responseStatus, setResponseStatus] = useState();
  //Name States
  const [trname, setTrName] = useState('');
  const [enname, setEnName] = useState('');
  const [runame, setRuName] = useState('');

  const [price, setPrice] = useState('');

  // Root Category States 
  const [rootcategory, setRootCategory] = useState();
  const [defaultCategory, setDefaultCategory] = useState();

  const [categories, setCategories] = useState([]);
  //Description States
  const [trdescription, setTrDescription] = useState('');
  const [endescription, setEnDescription] = useState('');
  const [rudescription, setRuDescription] = useState('');
  const state = useSelector(state => state.auth.user);


  const [compressedFile, setCompressedFile] = useState(null);
  const [imageStatus, setImageStatus] = useState(false);

  const handleCompressedUpload = (file) => {
    const image = file;
    new Compressor(image, {
      quality: 0.8, // 0.6 can also be used, but its not recommended to go below.,
      resize: 'cover',
      width: 1000,
      height: 1000,
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
      const { data } = await axios.post('/admin/get-product', { productId: params.productid }).catch(err => { throw err.response.status });

      setTrName(data.product.tr.name);
      setTrDescription(data.product.tr.description);

      //Kategorilerin Yüklenmesi
      const selectCategories = data.categories.map(category => { return { label: category.tr.name, value: category._id } })
      setCategories(selectCategories)

      //Ürünün kategorisi
      let category = data.product.categoryid;
      const defaultRootCategory = { label: category.tr.name, value: category._id }
      setDefaultCategory(defaultRootCategory);
      setRootCategory(defaultRootCategory.value);

      setPrice(data.product.price)

      if (data.product.en) {
        setEnName(data.product.en.name);
        setEnDescription(data.product.en.description);
      }
      if (data.product.ru) {
        setRuName(data.product.ru.name);
        setRuDescription(data.product.ru.description);
      }
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

  const clearStates = () => {
    setTrName('');
    setEnName('');
    setRuName('');
    setPrice('')
    setTrDescription('')
    setEnDescription('')
    setRuDescription('')
    setCompressedFile(null)
  }

  const submitForm = async () => {
    if ((imageStatus) || (trname && trdescription && price && rootcategory ) ) {


      const formData = new FormData();
      const json =
      {
        tr: { name: trname, description: trdescription },
        en: { name: enname, description: endescription },
        ru: { name: runame, description: rudescription },
        price: price,
        categoryid: rootcategory
      }
      // Eğer resim varsa form datanın içine dahil ediliyor 
      if (compressedFile) {
        formData.append('image', compressedFile, compressedFile.name);
      }
      formData.set('product', qs.stringify(json));

      try {
        // Send the compressed image file to server with XMLHttpRequest.
        await axios.post(`/admin/edit-product/${params.productid}`, formData).catch(err => { throw err.response.status })
        handleSuccess({ title: 'Kayıt Başarılı', timer: 1200, message: 'Ürün başarılı bir şekilde kayıt edildi.' });
        setTimeout(() => {
          clearStates();
          navigate.push('/products')
        }, 1200)
      } catch (err) {
        if (err === 404) {
          toast.error(<ErrorToast message={'Kayıt İşlemi Başarısız oldu'} />, { icon: false, hideProgressBar: true })

        } else if (err === 401) {
          dispatch(unAuthorized())
        }
      }

    } else {
      toast.error(<ErrorToast message={'Lütfen Zorunlu Alanları Doldurun  Ürün Adı, Açıklama, Fiyat, Kategori '} />, { icon: false, hideProgressBar: true })
    }
  }
  {
    return (

      < Fragment >
        {responseStatus ?
          <Card>
            <CardBody>
              <Nav pills fill>
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
                  <Form>
                    <Row>
                      <Col sm='12' className='mb-1'>
                        <Label className='form-label' for='nameVertical'>
                          Ürün Adı
                        </Label>
                        <Input value={trname} onChange={e => setTrName(e.target.value)} type='text' name='name' id='nameVertical' placeholder='Ürün Adı' />
                      </Col>
                      <Col sm='12' className='mb-1'>
                        <Label className='form-label' for='descriptionVertical'>
                          Açıklama
                        </Label>
                        <Input value={trdescription} onChange={e => setTrDescription(e.target.value)} type='textarea' name='description' id='descriptionVertical' placeholder='Açıklama' />
                      </Col>
                      <Col sm='12' className='mb-1'>
                        <Label className='form-label' for='descriptionVertical'>
                          Fiyat
                        </Label>
                        <Input value={price} onChange={e => setPrice(e.target.value)} type='text' name='price' id='descriptionVertical' placeholder='Ürün Fiyatı' />
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
                  </Form>
                  <FileUploaderRestrictions clearImage={setCompressedFile} handleCompressedUpload={handleCompressedUpload} />

                </TabPane>
                <TabPane tabId='2'>
                  <Form>
                    <Row>
                      <Col sm='12' className='mb-1'>
                        <Label className='form-label' for='nameVertical'>
                          Kategori Adı
                        </Label>
                        <Input value={enname} onChange={e => setEnName(e.target.value)} type='text' name='name' id='nameVertical' placeholder='Kategori Adı' />
                      </Col>
                      <Col sm='12' className='mb-1'>
                        <Label className='form-label' for='descriptionVertical'>
                          Açıklama
                        </Label>
                        <Input value={endescription} onChange={e => setEnDescription(e.target.value)} type='textarea' name='description' id='descriptionVertical' placeholder='Açıklama' />
                      </Col>

                    </Row>
                  </Form>
                </TabPane>
                <TabPane tabId='3'>
                  <Form>
                    <Row>
                      <Col sm='12' className='mb-1'>
                        <Label className='form-label' for='nameVertical'>
                          Ürün Adı
                        </Label>
                        <Input value={runame} onChange={e => setRuName(e.target.value)} type='text' name='name' id='nameVertical' placeholder='Ürün Adı' />
                      </Col>
                      <Col sm='12' className='mb-1'>
                        <Label className='form-label' for='descriptionVertical'>
                          Açıklama
                        </Label>
                        <Input value={rudescription} onChange={e => setRuDescription(e.target.value)} type='textarea' name='description' id='descriptionVertical' placeholder='Açıklama' />
                      </Col>
                    </Row>
                  </Form>
                </TabPane>
              </TabContent>
            </CardBody>
            <CardFooter>
              <div className='d-flex'>
                <Button className='me-1' color='primary' type='submit' onClick={(e) => {
                  e.preventDefault();
                  submitForm();
                }}>
                  Kaydet
                </Button>
              </div>
            </CardFooter>

          </Card> :
          <div></div>
        }

      </Fragment >
    )
  }
}
export default PillFilled