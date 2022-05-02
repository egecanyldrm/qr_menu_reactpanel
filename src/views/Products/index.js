// ** React Imports
import { Fragment, useEffect } from 'react'

// ** Reactstrap Imports
import { Card } from 'reactstrap'

// ** Table Import
import Table from './Table'
import { useState } from 'react'
import { Spinner } from 'reactstrap'
import axios from 'axios'
import { useDispatch } from 'react-redux'
import { logOut, unAuthorized } from '../../redux/authentication'
const Permissions = () => {

  const [products, setProducts] = useState([]);
  const [status, setStatus] = useState();
  const dispatch = useDispatch();



  useEffect(async () => {

    try {
      const products = await axios.get('/admin/products').catch(err => { throw err.response.status });
      setStatus(true)
      setProducts(products.data);

    } catch (err) {
      if (err === 404) {
        setStatus(false)
      } else if (err === 401) {
        dispatch(unAuthorized())
      }
    }
  }, [])

  return (
    <Fragment>

      <Card>
        <div className='card-datatable app-user-list table-responsive'>

          <Table data={products} />

        </div>
      </Card>
    </Fragment>
  )
}

export default Permissions