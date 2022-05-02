// ** Third Party Components
import Swal from 'sweetalert2'
import { ThumbsUp, ThumbsDown } from 'react-feather'
import withReactContent from 'sweetalert2-react-content'

// ** Reactstrap Imports'
import { Card, CardHeader, CardBody, CardTitle, Button, CardText } from 'reactstrap'

const MySwal = withReactContent(Swal)


export const handleBasicTitleAlert = (textmessage, icon, titles) => {
  return MySwal.fire({
    icon: icon,
    title: titles,
    text: textmessage,
    footer: '<a href="#">Yardıma mı ihtiyacın var ?</a>',
    focusConfirm: true,
    customClass: {
      confirmButton: 'btn btn-primary',
      confirmButtonText: 'Tamam'
    },
    buttonsStyling: false
  })
}
