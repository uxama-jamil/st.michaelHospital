import {
  CModal,
  CModalBody
} from '@coreui/react'
import './dialogbox.scss'

const DialogBox = ({ visible, setVisible, children }) => {
  return (
    <CModal visible={visible} onClose={() => setVisible(false)} alignment="center" size="lg">
      <CModalBody className="quiz-dialog">
        {children}
      </CModalBody>
    </CModal>
  )
}

export default DialogBox
