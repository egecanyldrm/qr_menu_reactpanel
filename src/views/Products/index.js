// ** React Imports
import { Fragment, useEffect } from 'react'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
// ** Reactstrap Imports
import { Card } from 'reactstrap'
import { deleteSwal } from '../../extension/basicalert';
// ** Table Import
import Table from './Table'
import { useState } from 'react'
import axios from 'axios'
import { useDispatch } from 'react-redux'
import { unAuthorized } from '../../redux/authentication'

const Permissions = () => {

  const [products, setProducts] = useState([]);
  const dispatch = useDispatch();

  useEffect(async () => {
    try {
      const products = await axios.get('/admin/products').catch(err => { throw err.response.status });
      setProducts(products.data);
    } catch (err) {
      if (err === 404) {
        console.log(err)
      } else if (err === 401) {
        dispatch(unAuthorized())
      }
    }
  }, [])

  const removeProduct = (id) => {

    deleteSwal({ title: 'Ürün' })
      .then((result) => {
        if (result.isConfirmed) {

          axios.post('/admin/delete-product', { productId: id })
            .then(() => {
              const newProducts = products.filter(product => product._id !== id);
              setProducts(newProducts)
              Swal.fire(
                'Silindi!',
                'Ürün Başarıyla Silindi.',
                'success'
              )
            }).catch(err => console.log(err))
        }
      })
  }

  return (
    <Fragment>
      <Card>
        <div className='card-datatable app-user-list table-responsive'>
          <Table removeProduct={removeProduct} data={products} />
        </div>
      </Card>
    </Fragment>
  )
}

export default Permissions