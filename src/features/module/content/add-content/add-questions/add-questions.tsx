import { useState } from 'react'
import {
    CFormInput,
    CButton,
    CFormCheck
  } from '@coreui/react'
  import './add-questions.scss'

export const AddQuestions = ({ setVisible, saveQuestions }) => {
    const [question, setQuestion] = useState('');
    const [options, setOptions] = useState(['', '', '', '']);
    const [correctIndex, setCorrectIndex] = useState(0);
    const handleOptionChange = (value, index) => {
        const updated = [...options]
        updated[index] = value
        setOptions(updated)
    }

    const addOption = () => {
        setOptions([...options, ''])
    }

    const deleteOption = (index) => {
        const updated = options.filter((_, i) => i !== index)
        setOptions(updated)
        if (correctIndex === index) setCorrectIndex(0)
        else if (correctIndex > index) setCorrectIndex(correctIndex - 1)
    }
    return (
        <>
            <label className="label">Question <span className="required">*</span></label>
            <CFormInput
            placeholder="Enter your question"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            className="mb-4"
            />

            <label className="label">Quiz Options</label>
            {options.map((opt, idx) => (
            <div className="option-row" key={idx}>
                <CFormCheck
                type="radio"
                name="correctOption"
                checked={correctIndex === idx}
                onChange={() => setCorrectIndex(idx)}
                className="radio"
                />
                <CFormInput
                value={opt}
                onChange={(e) => handleOptionChange(e.target.value, idx)}
                placeholder={`Option ${idx + 1}`}
                className="option-input"
                />
                <div className="option-actions">
                <CButton size="sm" color="light">⋯</CButton>
                <CButton size="sm" color="light" onClick={() => deleteOption(idx)}>🗑️</CButton>
                </div>
            </div>
            ))}

            <div className="add-option">
                <CButton variant="ghost" onClick={addOption}>+ Add Option</CButton>
            </div>

            <div className='footer'>
                <CButton color="light" onClick={() => setVisible(false)}>Cancel</CButton>
                <CButton color="primary" className="save-btn" onClick={() => saveQuestions(options)}>Save</CButton>
            </div>
        </>
    )
}