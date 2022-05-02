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
    name: 'Kategori Adı',
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

  const [categoriesData, setCategories] = useState([]);

  console.log(props.data)
  useEffect(() => {

    const categories = props.data.map(category => {
      return {
        id: category._id,
        title: category.tr.name,
        description: category.tr.description,
        action: <Button.Ripple className='btn-icon' color='flat-success' ><Edit size={17} /></Button.Ripple>,
        remove: <Button.Ripple className='btn-icon' color='flat-danger' ><Trash size={17} /></Button.Ripple>
      }
    });
    console.log(categories)
    setCategories(categories)

  }, [props.data])


  return (
    <Card className='overflow-hidden'>
      <CardHeader>
        <CardTitle tag='h4'> Kategoriler</CardTitle>
        <Link to='/add-category'>
          <Button.Ripple color='primary'>Kategori Ekle</Button.Ripple>
        </Link>
      </CardHeader>
      <div className='react-dataTable'>
        <DataTable
          noHeader
          noDataComponent='Hiç Kategori Bulunamadı ...'
          data={categoriesData.length > 0 && categoriesData}
          columns={columns}
          className='react-dataTable'
          sortIcon={<ChevronDown size={10} />}
          paginationRowsPerPageOptions={[10, 25, 50, 100]}
        />
      </div>
    </Card>
  )
}

export default DataTablesBasic