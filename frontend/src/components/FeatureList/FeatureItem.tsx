import { FC } from 'react';

type Props = {
    name: string,
    description: string
};
const FeatureItem: FC<Props> = ({name, description}) => {
    return (
        <div className='mb-2'>
            <h2 className='text-lg font-bold'>{name}</h2>    
            <p className='text-sm'>{description}</p>
        </div>
    );
};
export default FeatureItem;