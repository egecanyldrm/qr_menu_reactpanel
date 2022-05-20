// ** React Imports
import { Fragment, useEffect } from 'react'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
// ** Reactstrap Imports
import { Card } from 'reactstrap'
import { deleteSwal } from '../../../extension/basicalert'
// ** Table Import
import Table from './Table'
import { useState } from 'react'
import { Spinner } from 'reactstrap'
import axios from 'axios'
import { useDispatch } from 'react-redux'
import { unAuthorized } from '../../../redux/authentication'

const Permissions = () => {

  const [customers, setCustomers] = useState([]);
  const dispatch = useDispatch();

  useEffect(async () => {

    try {
      const customers = await axios.get('/owner/customers').catch(err => { throw err.response.status });
      setCustomers(customers.data);

    } catch (err) {
      if (err === 404) {
    
      } else if (err === 401) {
        dispatch(unAuthorized())
      }
    }
  }, [])

  const removeCustomer = (id) => {

    deleteSwal({ title: 'Kategori' })
      .then((result) => {
        if (result.isConfirmed) {

          axios.post('/admin/delete-category', { categoryId: id })
            .then(() => {
              const newCategories = categories.filter(category => category._id !== id);
              setCategories(newCategories)
              Swal.fire(
                'Silindi!',
                'Kategori Başarıyla Silindi.',
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
          <Table removeCustomer={removeCustomer} data={customers} />
        </div>
      </Card>
    </Fragment>
  )
}

export default Permissions