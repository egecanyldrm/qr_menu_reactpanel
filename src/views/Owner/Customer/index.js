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

    deleteSwal({ title: 'Müşteri' })
      .then((result) => {
        if (result.isConfirmed) {

          axios.post('/owner/delete-customer', { customerId: id })
            .then(() => {
              const newCustomers = customers.filter(customer => customer._id !== id);
              setCustomers(newCustomers)
              Swal.fire(
                'Silindi!',
                'Müşteri Başarıyla Silindi.',
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