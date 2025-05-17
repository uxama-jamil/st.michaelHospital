import { CCard, CCardBody, CCardHeader } from '@coreui/react'
import './card.scss'

export const Card = ({header, children}) => {
    return (
        <CCard className="questionnaire-card">
            <CCardHeader>{header}</CCardHeader>
            <CCardBody className="card-body">
                {children}
            </CCardBody>
        </CCard>
    )
}