// ** React Imports
import { Fragment, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify'
import Select from 'react-select'
import qs from 'qs';
import { unAuthorized } from '../../redux/authentication';
// ** Reactstrap Imports
import { TabContent, TabPane, Nav, NavItem, NavLink, Card, CardBody, Form, Row, Alert, Col, Label, Input, Button, CardFooter, FormFeedback } from 'reactstrap'
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
  const [rootcategory, setRootCategory] = useState(null);
  const [active, setActive] = useState('1');
  const dispatch = useDispatch();
  const navigate = useHistory()

  const state = useSelector(state => state.auth.user);


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
        // compressedResult has the compressed file.
        // Use the compressed file to upload the images to your server.    
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
    if ((imageStatus && compressedFile) && (data.tr.description && data.tr.name)) {
      const formData = new FormData();
      const json = rootcategory ?
        {
          ...data,
          rootcategory: rootcategory
        } : data;

      formData.append('image', compressedFile, compressedFile.name);
      formData.set('category', qs.stringify(json));

      try {
        await axios.post('/admin/add-category', formData).catch(err => { throw err.response.status })
        handleSuccess({ title: 'Kayıt Başarılı', timer: 1200, message: 'Kategori başarılı bir şekilde kayıt edildi.' });
        setTimeout(() => {
          navigate.push('/categories')
        }, 1200)
      } catch (err) {
        if (err === 501) {
          toast.error(<ErrorToast message={'Kayıt İşlemi Başarısız oldu'} />, { icon: false, hideProgressBar: true })
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
                <Row>
                  <Col sm='12' className='mb-1'>
                    <Label className='form-label' for='nameVertical'>
                      Kategori Adı
                    </Label>
                    <input className='form-control' placeholder='Kategori Adı'  {...register("tr.name", { required: true })} />
                  </Col>
                  <Col sm='12' className='mb-1'>
                    <Label className='form-label' for='descriptionVertical'>
                      Açıklama
                    </Label>
                    <input className='form-control' placeholder='Açıklama' {...register("tr.description", { required: true })} />
                  </Col>
                  <Col sm='12' className='mb-1'>
                    <Label className='form-label'>Kategori</Label>

                    <Select
                      noOptionsMessage={({ inputValue: string }) => 'Kategori Bulunamadı...'}
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
                <FileUploaderRestrictions clearImage={setCompressedFile} handleCompressedUpload={handleCompressedUpload} />

              </TabPane>
              <TabPane tabId='2'>
                <Row>
                  <Col sm='12' className='mb-1'>
                    <Label className='form-label' for='nameVertical'>   Kategori Adı  </Label>
                    <input className='form-control'  {...register("en.name")} />
                  </Col>
                  <Col sm='12' className='mb-1'>
                    <Label className='form-label' for='descriptionVertical'>
                      Açıklama
                    </Label>
                    <input className='form-control'  {...register("en.description")} />
                  </Col>
                </Row>
              </TabPane>
              <TabPane tabId='3'>
                <Row>
                  <Col sm='12' className='mb-1'>
                    <Label className='form-label' for='nameVertical'> Kategori Adı</Label>
                    <input className='form-control'  {...register("ru.name", { required: false })} />
                  </Col>
                  <Col sm='12' className='mb-1'>
                    <Label className='form-label' for='descriptionVertical'> Açıklama</Label>
                    <input className='form-control'  {...register("ru.description", { required: false })} />
                  </Col>
                </Row>
              </TabPane>
            </TabContent>
          </CardBody>
          <CardFooter>
            <div className='d-flex'>
              <Button className='me-1' color='primary' type='submit' >
                Kaydet
              </Button>
            </div>
          </CardFooter>
        </form>

      </Card>

    </Fragment>
  )
}
export default PillFilled