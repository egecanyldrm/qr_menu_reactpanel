import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import qs from 'qs';
import { unAuthorized } from '../../redux/authentication';
import { Card, CardBody, Spinner, Row, Col, Label, Input, Button, CardFooter, FormFeedback, Form } from 'reactstrap'
import FileUploaderRestrictions from '../../components/FileUploaderRestrictions'
import axios from 'axios';
import { ToastError, ToastSuccess } from '../../extension/toast';
import { useHistory, useParams } from "react-router-dom";
import { useFormik } from 'formik';
import * as Yup from 'yup';

const AddCategory = () => {
  // ** States
  const dispatch = useDispatch();
  const navigate = useHistory()
  const state = useSelector(state => state.auth.user);
  const params = useParams()

  // ** States
  const [image, setImage] = useState(null);
  const [translate, setTranslate] = useState(false)
  const [status, setStatus] = useState(false)

  // ** Side Effects 
  useEffect(async () => {
    try {
      const { data } = await axios.post('/admin/get-category', { categoryId: params.categoryid }).catch(err => { throw err.response.status });
      const { ar, en, tr, fr, ru, de } = data.category;
      formik.setValues({
        categoryName: tr.name,
        arabian: ar.name,
        english: en.name,
        russian: ru.name,
        germany: de.name,
        french: fr.name
      })
    } catch (error) {
      if (error === 401) dispatch(unAuthorized())
    }
  }, [])




  // ** Formik

  const formik = useFormik({
    initialValues: {
      categoryName: '',
      english: '',
      russian: '',
      germany: '',
      french: '',
      arabian: '',
    },
    validationSchema: Yup.object({
      categoryName: Yup.string().required(' Bu alan zorunludur.'),
    }),
    onSubmit: values => handleSubmit(values),
  });



  // ** Handler Functions

  const handleTranslate = async () => {
    if (formik.values.categoryName.length < 1) return ToastError('Kategori ismi giriniz')
    try {
      setTranslate(true)
      const res = await axios.post('/admin/category-translate', { categoryName: formik.values.categoryName }).catch(err => { throw err.response.status });
      const { ar, en, tr, fr, ru, de } = res.data.category;
      formik.setValues({
        categoryName: tr.name,
        arabian: ar.name,
        english: en.name,
        russian: ru.name,
        germany: de.name,
        french: fr.name
      })
      ToastSuccess('Çevir başarılı bir şekilde yapıldı.')
      setTranslate(false)
    } catch (err) {
      if (err === 404) ToastError('Çeviri Başarısız!')
    }
  }

  const handleSubmit = async (values) => {

    const data = {
      tr: { name: values.categoryName },
      en: { name: values.english },
      ru: { name: values.russian },
      ar: { name: values.arabian },
      fr: { name: values.french },
      de: { name: values.germany },
    };

    if (!image) return ToastError('Lütfen Resim Yükleyiniz');

    setStatus(true)
    const formData = new FormData();
    formData.set('category', qs.stringify(data));
    formData.append('image', image, image.name);

    try {
      await axios.post(`/admin/edit-category/${params.categoryid}`, formData).catch(err => { throw err.response.status })
      ToastSuccess('Kategori başarılı bir şekilde kayıt edildi.');
      navigate.push('/categories')

    } catch (err) {
      if (err === 501) ToastError('Kayıt İşlemi Başarısız oldu');
    } finally {
      setStatus(false)
    }

  }
  return (
    <Form onSubmit={formik.handleSubmit}>
      <Card>
        <CardBody>
          <Row>
            <Col md={6} xs={12} className='mb-1' >
              <Label className='form-label' for='categoryName'> Kategori Adı </Label>
              <Input
                id="categoryName"
                name="categoryName"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.categoryName}
                invalid={formik.touched.categoryName && formik.errors.categoryName}

              />
              {formik.touched.categoryName && formik.errors.categoryName ? <FormFeedback>{formik.errors.categoryName}</FormFeedback> : null}
            </Col>
            <Col md={6} xs={12} className='mb-1'>
              <Label className='form-label' for='english'> İngilizce </Label>
              <Input
                id="english"
                name="english"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.english}
                invalid={formik.touched.english && formik.errors.english}

              />
              {formik.touched.english && formik.errors.english ? <FormFeedback>{formik.errors.english}</FormFeedback> : null}
            </Col>
            <Col md={6} xs={12} className='mb-1'>
              <Label className='form-label' for='russian'> Rusça </Label>
              <Input
                id="russian"
                name="russian"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.russian}
                invalid={formik.touched.russian && formik.errors.russian}

              />
              {formik.touched.russian && formik.errors.russian ? <FormFeedback>{formik.errors.russian}</FormFeedback> : null}
            </Col>
            <Col md={6} xs={12} className='mb-1'>
              <Label className='form-label' for='french'> Fransızca </Label>
              <Input
                id="french"
                name="french"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.french}
                invalid={formik.touched.french && formik.errors.french}

              />
              {formik.touched.french && formik.errors.french ? <FormFeedback>{formik.errors.french}</FormFeedback> : null}
            </Col>
            <Col md={6} xs={12} className='mb-1'>
              <Label className='form-label' for='germany'> Almanca </Label>
              <Input
                id="germany"
                name="germany"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.germany}
                invalid={formik.touched.germany && formik.errors.germany}

              />
              {formik.touched.germany && formik.errors.germany ? <FormFeedback>{formik.errors.germany}</FormFeedback> : null}
            </Col>
            <Col md={6} xs={12} className='mb-1'>
              <Label className='form-label' for='arabian'> Arapça </Label>
              <Input
                id="arabian"
                name="arabian"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.arabian}
                invalid={formik.touched.arabian && formik.errors.arabian}

              />
              {formik.touched.arabian && formik.errors.arabian ? <FormFeedback>{formik.errors.arabian}</FormFeedback> : null}
            </Col>

            <FileUploaderRestrictions setImage={setImage} />

          </Row>
        </CardBody>
        <CardFooter>
          <div className='d-flex'>
            {status ?
              <Button color='primary'>
                <Spinner color='white' size='sm' />
                <span className='ms-50'>Yükleniyor...</span>
              </Button>
              :
              <Button type='submit' className='me-1' color='primary'>
                Kaydet
              </Button>
            }
            <div className='ms-2'>
              <Button className='me-1' color='danger' onClick={handleTranslate}>
                {
                  translate ? (
                    <>
                      <Spinner color='white' size='sm' />
                      <span className='ms-50'> Dil Çevirisi Yapılıyor...</span>
                    </>
                  )
                    : 'Otomatik Dil Çevirme'
                }
              </Button>
            </div>
          </div>
        </CardFooter>
      </Card>
    </Form>
  )
}
export default AddCategory

