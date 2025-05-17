import {  CFormSwitch } from '@coreui/react'
import './questions.scss'
import { Empty } from '@components/empty/empty'
import { useState } from 'react'
import DialogBox from '@components/dialogbox/dialogbox'
import { AddQuestions } from '../add-questions/add-questions'

export const Questions = () => {
  const [dialogVisible, setDialogVisible] = useState(false)

  const addQuestions = () => {
    setDialogVisible(true)
  }

  const saveQuestions = (e) => {
    console.log(e)
  }
    return (
        <div className="questionnaire-card">
          <CFormSwitch label="Enable" defaultChecked />
          <div className="divider" />
          <Empty 
          heading={'No question added yet'} 
          message={'Start managing your question by adding your first one.'}
          buttonText={'Add New Question'}
          onClick={addQuestions}/>

          <DialogBox visible={dialogVisible} setVisible={setDialogVisible}>
            <AddQuestions setVisible={setDialogVisible} saveQuestions={saveQuestions}/>
          </DialogBox>

      </div>
    )
}