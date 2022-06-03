// ** Third Party Components
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { ThumbsUp, ThumbsDown } from 'react-feather'

// ** Reactstrap Imports'
import { Card, CardHeader, CardBody, CardTitle, Button, CardText } from 'reactstrap'

const MySwal = withReactContent(Swal)


export const handleBasicTitleAlert = (textmessage, icon, titles) => {
  return MySwal.fire({
    icon: icon,
    title: titles,
    text: textmessage,
    focusConfirm: true,
    customClass: {
      confirmButton: 'btn btn-primary',
      confirmButtonText: 'Tamam'
    },
    buttonsStyling: false
  })
}

export const handleSuccess = ({ message, timer, title }) => {
  return MySwal.fire({
    title: title,
    text: message,
    icon: 'success',
    showConfirmButton: false,
    timer: timer
  })
}

export const handleWarning = ({ message, timer, title }) => {
  return MySwal.fire({
    title: title,
    text: message,
    icon: 'warning',
    showConfirmButton: false,
    timer: timer
  })
}

export const deleteSwal = ({ title }) => {
  return MySwal.fire({
    title: `${title} Silinsin mi ?`,
    text: `Silindikten Sonra İşlem Geri Alınamaz !`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Evet',
    cancelButtonText: 'İptal Et'
  })
}


export const askSwal = () => {
  return MySwal.fire({
    title: `Paket Yükseltmek İstiyor musunuz ?`,
    text: `Bu Temayı Etkinleştirmek İçin Deluxe Pakete Sahip Olmalısınız!`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Paket Yükselt',
    cancelButtonText: 'İptal Et'
  })
}