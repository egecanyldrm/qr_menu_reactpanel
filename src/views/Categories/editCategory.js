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



const PillFilled = () => {
  // ** States
  const [active, setActive] = useState('1');
  const dispatch = useDispatch();
  const navigate = useHistory()
  const params = useParams()
  const [status, setstatus] = useState(true)


  const [responseStatus, setResponseStatus] = useState();
  //Name States
  const [trname, setTrName] = useState('');
  const [enname, setEnName] = useState('');
  const [runame, setRuName] = useState('');
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
      setTrName(data.category.tr.name);
      setTrDescription(data.category.tr.description);
      const selectCategories = data.categories.map(category => { return { label: category.tr.name, value: category._id } })
      setCategories(selectCategories)
      if (data.rootcategory) {
        let category = data.rootcategory;
        const defaultRootCategory = { label: category.tr.name, value: category._id }
        setDefaultCategory(defaultRootCategory)
        setRootCategory(defaultRootCategory.value)
      }
      if (data.category.en) {
        setEnName(data.category.en.name);
        setEnDescription(data.category.en.description);
      }
      if (data.category.ru) {
        setRuName(data.category.ru.name);
        setRuDescription(data.category.ru.description);
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
    setTrDescription('')
    setEnDescription('')
    setRuDescription('')
    setCompressedFile(null)
  }

  const submitForm = async () => {
    if ((imageStatus) || (trname && trdescription)) {


      setstatus(false)
      const formData = new FormData();
      const json =
      {
        tr: { name: trname, description: trdescription },
        en: { name: enname, description: endescription },
        ru: { name: runame, description: rudescription },
        rootcategory: rootcategory
      }

      // The third parameter is required for server
      if (compressedFile) {

        formData.append('image', compressedFile, compressedFile.name);
      }
      formData.set('category', qs.stringify(json));

      try {
        // Send the compressed image file to server with XMLHttpRequest.
        await axios.post(`/admin/edit-category/${params.categoryid}`, formData).catch(err => { throw err.response.status })
        setstatus(true)

        handleSuccess({ title: 'Kayıt Başarılı', timer: 1200, message: 'Kategori başarılı bir şekilde kayıt edildi.' });
        setTimeout(() => {
          clearStates();
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
                          Kategori Adı
                        </Label>
                        <Input value={trname} onChange={e => setTrName(e.target.value)} type='text' name='name' id='nameVertical' placeholder='Kategori Adı' />
                      </Col>
                      <Col sm='12' className='mb-1'>
                        <Label className='form-label' for='descriptionVertical'>
                          Açıklama
                        </Label>
                        <Input value={trdescription} onChange={e => setTrDescription(e.target.value)} type='textarea' name='description' id='descriptionVertical' placeholder='Açıklama' />
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
                          Kategori Adı
                        </Label>
                        <Input value={runame} onChange={e => setRuName(e.target.value)} type='text' name='name' id='nameVertical' placeholder='Kategori Adı' />
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

                {status ?

                  <Button className='me-1' color='primary' type='submit' onClick={(e) => {
                    e.preventDefault();
                    submitForm();
                  }}>
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

          </Card> :
          <div></div>
        }

      </Fragment>
    )
  }
}
export default PillFilled


/* 

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
*/