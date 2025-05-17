import './empty.scss'

import emptyImage from '@assets/svg/empty.svg'
import Button from '../button/button'

export const Empty = ({heading, message, buttonText, onClick}) => {
    return ( 
          <div className="empty-state">
            <img src={emptyImage} alt="No Question" />
            <h5>{heading}</h5>
            <p>{message}</p>
            <Button className={'button-css'} onClick={onClick}>
              {buttonText }
            </Button>
          </div>
    )
}