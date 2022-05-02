// ** Table Columns


// ** Third Party Components
import { ChevronDown, Edit, Trash } from 'react-feather'
import DataTable from 'react-data-table-component'

// ** Reactstrap Imports
import { Card, CardHeader, CardTitle, Button } from 'reactstrap'
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';


const columns = [
  {
    name: 'Ürün Adı',
    selector: row => row.title,
    sortable: true
  },
  {
    name: 'Açıklama',
    selector: row => row.description
  },
  {
    name: '',
    selector: row => row.space
  },
  {
    name: 'Düzenle',
    selector: row => row.action
  },
  {
    name: 'Kaldır',
    selector: row => row.remove
  }
];


const DataTablesBasic = (props) => {

  const [productsData, setProductsData] = useState([]);

  console.log(props.data)
  useEffect(() => {
    const products = props.data.map(product => {
      return {
        id: product._id,
        title: product.tr.name,
        description: product.tr.description,
        action: <Button.Ripple className='btn-icon' color='flat-success' ><Edit size={17} /></Button.Ripple>,
        remove: <Button.Ripple className='btn-icon' color='flat-danger' ><Trash size={17} /></Button.Ripple>
      }
    });
    setProductsData(products)
  }, [props.data])


  return (
    <Card className='overflow-hidden'>
      <CardHeader>
        <CardTitle tag='h4'> Ürünler</CardTitle>
        <Link to='/add-product'>
          <Button.Ripple color='primary'>Ürün Ekle</Button.Ripple>
        </Link>
      </CardHeader>
      <div className='react-dataTable'>
        <DataTable
          noHeader
          data={productsData}
          columns={columns}
          noDataComponent='Hiç Ürün Bulunamadı ...'

          className='react-dataTable'
          sortIcon={<ChevronDown size={10} />}
          paginationRowsPerPageOptions={[10, 25, 50, 100]}
        />
      </div>
    </Card>
  )
}

export default DataTablesBasic