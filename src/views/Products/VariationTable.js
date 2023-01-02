import React from 'react'
import { Trash } from 'react-feather'
import { Button, Table } from 'reactstrap'

const VariationTable = ({ variations, handleRemoveVariant }) => {
    if (!variations) return null
    return (
        <Table hover striped>
            <thead>
                <tr>
                    <th>Varyant Adı</th>
                    <th>Varyant Değeri</th>
                    <th>   </th>
                    <th> Sil </th>
                </tr>
            </thead>
            <tbody>
                {variations?.map((variation, index) => {
                    return (
                        <tr key={index}>
                            <th scope="row">{variation.key} </th>
                            <td>{variation.value}</td>
                            <td>  </td>
                            <td>
                                <Button.Ripple className='btn-icon' color='flat-danger'
                                    onClick={() => { handleRemoveVariant(variation.key) }} >
                                    <Trash size={17} />
                                </Button.Ripple>
                            </td>
                        </tr>
                    )
                })}
            </tbody>
        </Table>
    )
}

export default VariationTable