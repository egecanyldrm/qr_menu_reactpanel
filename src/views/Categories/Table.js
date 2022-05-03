// ** Table Columns

// ** Third Party Components

// ** Third Party Components
import { ChevronDown, Edit, Trash } from 'react-feather'
import DataTable from 'react-data-table-component'

// ** Reactstrap Imports
import { Card, CardHeader, CardTitle, Button, Col, Label, Input } from 'reactstrap'
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
  const [searchValue, setSearchValue] = useState('')
  const [filteredData, setFilteredData] = useState([])

  useEffect(() => {

    const categories = props.data.map(category => {
      return {
        id: category._id,
        title: category.tr.name,
        description: category.tr.description,
        action: <Button.Ripple className='btn-icon' color='flat-success' ><Edit size={17} /></Button.Ripple>,
        remove: <Button.Ripple onClick={() => { props.removeCategory(category._id) }} className='btn-icon' color='flat-danger' ><Trash size={17} /></Button.Ripple>
      }
    });
    setCategories(categories)

  }, [props.data])


  //Data Filtreleme - Search Bard
  const handleFilter = e => {
    const value = e.target.value
    let updatedData = []
    setSearchValue(value)
    if (value.length) {
      updatedData = categoriesData.filter(item => {
        const startsWith = item.title.toLowerCase().startsWith(value.toLowerCase())

        const includes = item.title.toLowerCase().includes(value.toLowerCase())

        if (startsWith) {
          return startsWith
        } else if (!startsWith && includes) {
          return includes
        } else return null
      })
      setFilteredData(updatedData)
      setSearchValue(value)
    }
  }

 

  return (
    <Card className='overflow-hidden'>
      <CardHeader>
        <Col>
          <CardTitle tag='h4'> Kategoriler</CardTitle>
        </Col>
        <Col className='d-flex align-items-center justify-content-end mt-1' md='4' sm='12'>
          <Label className='me-1' for='search-input-1'>
            Arama
          </Label>
          <Input
            className='dataTable-filter mb-50'
            type='text'
            bsSize='sm'
            id='search-input-1'
            value={searchValue}
            onChange={handleFilter}
          />
        </Col>
        <Col md='4' sm='12' className='d-flex justify-content-end'>
          <Link to='/add-category'>
            <Button.Ripple color='primary'>Kategori Ekle</Button.Ripple>
          </Link>
        </Col>
      </CardHeader>
      <div className='react-dataTable'>
        <DataTable
          noHeader
          paginationPerPage={7}
          paginationRowsPerPageOptions={[10, 25, 50, 100]}

          noDataComponent='Hiç Kategori Bulunamadı ...'
          data={searchValue.length ? filteredData : (categoriesData.length > 0 && categoriesData)}
          columns={columns}
          className='react-dataTable'
          sortIcon={<ChevronDown size={10} />}
        />
      </div>
    </Card >
  )
}

export default DataTablesBasic