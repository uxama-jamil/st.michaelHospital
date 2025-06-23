import React from 'react';
import { Empty } from 'antd';
import NoDataIcon from '@/assets/images/no-data.svg';
import { Button } from '@/components/ui';

type NoDataProps = {
    title?: string;
    description?: string;
    buttonText?: string;
    onButtonClick?: () => void;
    icon?: React.ReactNode; // optional custom SVG or icon
};

function NoData(props: NoDataProps) {
    const {
        title = 'No Data',
        description,
        buttonText,
        onButtonClick,
        icon,
    } = props;

    return (
        <Empty
            image={icon ? icon : NoDataIcon}
            description={
                <>
                    <h2>{title}</h2>
                    {description && <p>{description}</p>}
                </>
            }
        >
            {buttonText && onButtonClick && (
                <Button type="primary" size='small' onClick={onButtonClick}>
                    {buttonText}
                </Button>
            )}
        </Empty>
    );
}

export default NoData;
