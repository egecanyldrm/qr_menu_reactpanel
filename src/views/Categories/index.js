// ** React Imports
import { Fragment, useEffect } from 'react'
import { Card } from 'reactstrap'
// ** Table Import
import Table from './Table'
import { useState } from 'react'
import axios from 'axios'
import { ToastError, ToastSuccess } from '../../extension/toast';
import { deleteSwal } from '../../extension/basicalert'

const Permissions = () => {

  const [categories, setCategories] = useState([]);

  useEffect(async () => {
    handleGetCategories();
  }, [])

  const removeCategory = async (id) => {

    try {
      const response = await deleteSwal({ title: 'Kategori' });
      if (!response.isConfirmed) return
      await axios.post('/admin/delete-category', { categoryId: id });
      ToastSuccess('Kategori Başarıyla Silindi');
      handleGetCategories()
    } catch (error) {
      ToastError('Kategori silinemedi')
    }
  }

  const handleGetCategories = async () => {
    try {
      const categories = await axios.get('/admin/categories');
      setCategories(categories.data);
    } catch (err) {
      ToastError('Kategoriler bulunamadı :(')
    }
  }

  return (
    <Fragment>

      <Card>
        <div className='card-datatable app-user-list table-responsive'>
          <Table removeCategory={removeCategory} data={categories} />
        </div>
      </Card>
    </Fragment>
  )
}


export default Permissions