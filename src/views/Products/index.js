// ** React Imports
import { Fragment, useEffect } from 'react'
import Swal from 'sweetalert2'
// ** Reactstrap Imports
import { Card } from 'reactstrap'
import { deleteSwal } from '../../extension/basicalert';
// ** Table Import
import Table from './Table'
import { useState } from 'react'
import axios from 'axios'
import { ToastError, ToastSuccess } from '../../extension/toast';

const Permissions = () => {

  const [products, setProducts] = useState([]);

  useEffect(async () => {
    handleGetProducts()
  }, [])

  const removeProduct = (id) => {
    deleteSwal({ title: 'Ürün' })
      .then((result) => {
        if (result.isConfirmed) {
          axios.post('/admin/delete-product', { productId: id })
            .then(() => {
              handleGetProducts()
              ToastSuccess('Ürün başarıyla silindi.')
            }).catch(err => console.log(err))
        }
      })
  }
  const handleGetProducts = async () => {
    try {
      const products = await axios.get('/admin/products')
      setProducts(products.data);
    } catch (err) {
      ToastError('Ürünler bulunamadı')
    }
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