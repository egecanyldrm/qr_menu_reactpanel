// ** React Imports
import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux';
import ReactSelect from 'react-select'
import { unAuthorized } from '../../redux/authentication';
import { Nav, NavItem, NavLink, Card, CardBody, Form, Row, Col, Label, Spinner, Button, CardHeader, Input, FormFeedback, CardTitle, TabPane, TabContent, UncontrolledTooltip } from 'reactstrap'
import FileUploaderRestrictions from '../../components/FileUploaderRestrictions'
import axios from 'axios';
import { ToastError, ToastSuccess } from '../../extension/toast';
import { useHistory, useParams } from "react-router-dom";
import { useFormik } from 'formik';
import * as Yup from 'yup';
import classNames from 'classnames';
import VariationTable from './VariationTable';
import qs from 'qs';

const AddProduct = () => {
  // ** States
  const navigate = useHistory()
  const params = useParams()

  // ** States
  const [active, setActive] = useState('1');
  const [variantKey, setVariantKey] = useState('');
  const [variantValue, setVariantValue] = useState('');
  const [image, setImage] = useState(null);
  const [translate, setTranslate] = useState(false)
  const [status, setStatus] = useState(false)
  const [categories, setCategories] = useState([])

  // ** Formik
  const formik = useFormik({
    initialValues: {
      price: '',
      rootCategory: null,
      variant: [],
      trName: '',
      trDesc: '',
      enName: '',
      enDesc: '',
      ruName: '',
      ruDesc: '',
      deName: '',
      deDesc: '',
      frName: '',
      frDesc: '',
      arName: '',
      arDesc: '',
    },
    validationSchema: Yup.object({
      trName: Yup.string().required(' Bu alan zorunludur.'),
      price: Yup.string().required(' Bu alan zorunludur.'),
      rootCategory: Yup.object().required(' Bu alan zorunludur.'),
    }),
    onSubmit: values => handleSubmit(values),
  });

  // ** Side Effects
  useEffect(async () => {
    handleGetProduct()
  }, [])

  // ** Handler Functions 

  const handleGetProduct = async () => {
    try {
      const { data } = await axios.post('/admin/get-product', { productId: params.productid })
      const product = data.product;
      setCategories(data.categories.map(category => ({ label: category.tr.name, value: category._id })));
      formik.setValues({
        price: product.price,
        variant: product.variant,
        rootCategory: { label: data.productCategory.tr.name, value: data.productCategory._id },
        trName: product.tr.name,
        trDesc: product.tr.description,
        enName: product.en.name,
        enDesc: product.en.description,
        ruName: product.ru.name,
        ruDesc: product.ru.description,
        deName: product.de.name,
        deDesc: product.de.description,
        frName: product.fr.name,
        frDesc: product.fr.description,
        arName: product.ar.name,
        arDesc: product.ar.description,
      })
    } catch (err) {
      ToastError('Bir Hata Oluştu !')
    }
  }
  const handleSubmit = async (values) => {
    if (translate) return ToastError('Dil çevirme işlemi devam ediyor ');
    const data = {
      categoryid: values.rootCategory.value,
      price: values.price,
      variant: values.variant,
      tr: { name: values.trName, description: values.trDesc },
      en: { name: values.enName, description: values.enDesc },
      ru: { name: values.ruName, description: values.ruDesc },
      ar: { name: values.arName, description: values.arDesc },
      fr: { name: values.frName, description: values.frDesc },
      de: { name: values.deName, description: values.deDesc },
    }

    const formdata = new FormData();
    if (image) formdata.append('image', image, image.name);
    formdata.set('product', JSON.stringify(data));

    try {
      setStatus(true)
      const response = await axios.post(`/admin/edit-product/${params.productid}`, formdata)
      if (!response) throw new Error('Error')
      ToastSuccess('Ürün başarılı bir şekilde kaydedildi.')
      navigate.push('/products')
    } catch (err) {
      console.log(err)
      ToastError('Kayıt işlemi başarısız oldu.')
    } finally {
      setStatus(false);
    }

  }



  const handleAddVariant = () => {
    if (variantKey.length < 1 || variantValue.length < 1) return ToastError('Varyasyon değerleri giriniz')
    const arr = formik.values.variant;
    formik.setFieldValue('variant', [...arr, { key: variantKey, value: variantValue }]);
    setVariantKey('');
    setVariantValue('');

  }
  const handleRemoveVariant = (key) => {
    const arr = formik.values.variant.filter(variant => variant.key !== key)
    formik.setFieldValue('variant', [...arr]);
  }

  const handleTranslate = async () => {
    if (formik.values.trName.length < 1) return ToastError('Ürün ismi giriniz')
    try {
      setTranslate(true)
      const { data } = await axios.post('/admin/product-translate', { productName: formik.values.trName, productDescription: formik.values.trDesc })
      if (!data) throw new Error('Error')

      const { ar, en, tr, fr, ru, de } = data;

      formik.setFieldValue('trName', tr.name);
      formik.setFieldValue('trDesc', tr.description);

      formik.setFieldValue('enName', en.name);
      formik.setFieldValue('enDesc', en.description);

      formik.setFieldValue('frName', fr.name);
      formik.setFieldValue('frDesc', fr.description);

      formik.setFieldValue('ruName', ru.name);
      formik.setFieldValue('ruDesc', ru.description);

      formik.setFieldValue('deName', de.name);
      formik.setFieldValue('deDesc', de.description);

      formik.setFieldValue('arName', ar.name);
      formik.setFieldValue('arDesc', ar.description);

      ToastSuccess('Çevir başarılı bir şekilde yapıldı.')
    } catch (err) {
      ToastError('Çeviri Başarısız!')
    } finally {
      setTranslate(false);
    }
  }


  const toggle = tab => setActive(tab);

  return (
    <Form onSubmit={formik.handleSubmit}>
      <Card>
        <CardHeader className='row ' >
          <Col xs={6}>
            <Nav pills fill >
              <NavItem>
                <NavLink active={active === '1'} onClick={() => { toggle('1') }}>Genel</NavLink>
              </NavItem>
              <NavItem>
                <NavLink active={active === '2'} onClick={() => { toggle('2') }}>Dil Bilgileri</NavLink>
              </NavItem>
              <NavItem>
                <NavLink active={active === '3'} onClick={() => { toggle('3') }}>Varyasyon Bilgileri</NavLink>
              </NavItem>
            </Nav>
          </Col>
          <Col xs={6} className='d-flex justify-content-end'>
            <Button color='success' type='submit'>
              {status ? <><Spinner color='white' size='sm' /><span className='ms-50'>Yükleniyor...</span></> : 'Kaydet'}
            </Button>

            <Button className='mx-1' color='danger' onClick={handleTranslate} disabled={formik?.values?.trName?.length > 1 ? false : true}>
              {translate ? (<><Spinner color='white' size='sm' /><span className='ms-50'> Dil Çevirisi Yapılıyor...</span></>) : 'Otomatik Dil Çevirme'}
            </Button>
          </Col>
        </CardHeader>
        <CardBody>
          <TabContent className='py-50' activeTab={active}>

            <TabPane tabId='1'>
              <CardTitle>Ürün bilgileri</CardTitle>
              <Row>
                <Col md={6} xs={12} className='mb-1' >
                  <Label className='form-label' for='trName'> Ürün Adı  <span className='text-danger'> *</span></Label>
                  <Input
                    id="trName"
                    name="trName"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.trName}
                    invalid={formik.touched.trName && formik.errors.trName}
                  />
                  {formik.touched.trName && formik.errors.trName ? <FormFeedback>{formik.errors.trName}</FormFeedback> : null}
                </Col>
                <Col md={6} xs={12} className='mb-1' >
                  <Label className='form-label' for='trDesc'> Ürün Açıklaması </Label>
                  <Input
                    id="trDesc"
                    name="trDesc"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.trDesc}
                    invalid={formik.touched.trDesc && formik.errors.trDesc}

                  />
                  {formik.touched.trDesc && formik.errors.trDesc ? <FormFeedback>{formik.errors.trDesc}</FormFeedback> : null}
                </Col>
                <Col md={6} xs={12} className='mb-1' >
                  <Label className='form-label' for='price'> Fiyat <span className='text-danger'> *</span> </Label>
                  <Input
                    id="price"
                    name="price"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.price}
                    invalid={formik.touched.price && formik.errors.price}

                  />
                  {formik.touched.price && formik.errors.price ? <FormFeedback>{formik.errors.price}</FormFeedback> : null}
                </Col>
                <Col md={6} xs={12} className='mb-1' >
                  <Label className='form-label' for='rootCategory'> Kategori  <span className='text-danger'> *</span> </Label>
                  <ReactSelect
                    id="rootCategory"
                    name="rootCategory"
                    options={categories}
                    onChange={(e) => formik.setFieldValue('rootCategory', e)}
                    onBlur={formik.handleBlur}
                    value={formik.values.rootCategory}
                    invalid={formik.touched.rootCategory && formik.errors.rootCategory}
                    className={classNames({ 'border border-danger rounded': formik.touched.rootCategory && formik.errors.rootCategory })}
                  />
                  {formik.touched.rootCategory && formik.errors.rootCategory ? <span className='text-danger'>Bu alan zorunludur</span> : null}
                </Col>
                <Col xs={12} >
                  <FileUploaderRestrictions setImage={setImage} />
                </Col>
              </Row>
            </TabPane>
            <TabPane tabId='2'>
              <CardTitle className='my-2'>Dil bilgileri </CardTitle>
              <Row>
                <Col md={6} xs={12} className='mb-1' >
                  <Label className='form-label' for='enName'> İngilizce Adı </Label>
                  <Input
                    id="enName"
                    name="enName"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.enName}
                    invalid={formik.touched.enName && formik.errors.enName}

                  />
                </Col>
                <Col md={6} xs={12} className='mb-1' >
                  <Label className='form-label' for='enDesc'> İngilizce Açıklama </Label>
                  <Input
                    id="enDesc"
                    name="enDesc"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.enDesc}
                    invalid={formik.touched.enDesc && formik.errors.enDesc}
                  />
                </Col>
                <Col md={6} xs={12} className='mb-1' >
                  <Label className='form-label' for='ruName'> Rusça Adı </Label>
                  <Input
                    id="ruName"
                    name="ruName"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.ruName}
                    invalid={formik.touched.ruName && formik.errors.ruName}

                  />
                </Col>
                <Col md={6} xs={12} className='mb-1' >
                  <Label className='form-label' for='ruDesc'> Rusça Açıklama </Label>
                  <Input
                    id="ruDesc"
                    name="ruDesc"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.ruDesc}
                    invalid={formik.touched.ruDesc && formik.errors.ruDesc}
                  />
                </Col>
                <Col md={6} xs={12} className='mb-1' >
                  <Label className='form-label' for='frName'> Fransızca Adı </Label>
                  <Input
                    id="frName"
                    name="frName"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.frName}
                    invalid={formik.touched.frName && formik.errors.frName}

                  />
                </Col>
                <Col md={6} xs={12} className='mb-1' >
                  <Label className='form-label' for='frDesc'> Fransızca Açıklama </Label>
                  <Input
                    id="frDesc"
                    name="frDesc"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.frDesc}
                    invalid={formik.touched.frDesc && formik.errors.frDesc}
                  />
                </Col>
                <Col md={6} xs={12} className='mb-1' >
                  <Label className='form-label' for='arName'> Arapça Adı </Label>
                  <Input
                    id="arName"
                    name="arName"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.arName}
                    invalid={formik.touched.arName && formik.errors.arName}

                  />
                </Col>
                <Col md={6} xs={12} className='mb-1' >
                  <Label className='form-label' for='arDesc'> Arapça Açıklama </Label>
                  <Input
                    id="arDesc"
                    name="arDesc"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.arDesc}
                    invalid={formik.touched.arDesc && formik.errors.arDesc}
                  />
                </Col>
              </Row>

            </TabPane>

            <TabPane tabId='3'>
              <Row>
                <CardTitle className='my-2'>Varyasyon Bilgileri</CardTitle>
                <Col xs={12} className=' row  align-items-center'>
                  <Col xs={4}>
                    <Label > Varyant Adı</Label>
                    <Input value={variantKey} onChange={e => setVariantKey(e.target.value)} />
                  </Col>
                  <Col xs={4} className='row'>
                    <Label > Varyant Değeri</Label>
                    <Input value={variantValue} onChange={e => setVariantValue(e.target.value)} />
                  </Col>
                  <Col xs={4} className='h-100  d-flex align-items-end justify-content-start'>
                    <Button color="success" size="md" type='button' onClick={handleAddVariant}> Ekle </Button>
                  </Col>
                </Col>
              </Row>

              <Col xs={12} className='mt-1'>
                <VariationTable variations={formik.values.variant} handleRemoveVariant={handleRemoveVariant} />
              </Col>
            </TabPane>
          </TabContent>

        </CardBody>
      </Card>
    </Form >
  )
}
export default AddProduct