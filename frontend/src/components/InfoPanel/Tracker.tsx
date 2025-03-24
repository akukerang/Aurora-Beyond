import { useState } from 'react';
import EditableStat from '../EditableStat';
import EditableText from '../EditableText';
const Tracker = () => {
    const [stat1Name, setStat1Name] = useState('Stat1');
    const [stat2Name, setStat2Name] = useState('Stat2');
    const [stat3Name, setStat3Name] = useState('Stat3');

    const [stat1, setStat1] = useState(0);
    const [stat1Max, setStat1Max] = useState(0);
    const [stat2, setStat2] = useState(0);
    const [stat2Max, setStat2Max] = useState(0);
    const [stat3, setStat3] = useState(0);
    const [stat3Max, setStat3Max] = useState(0);
    return (
        <div className='p-4 h-1/2 bg-gray-700 rounded-lg text-center'>
            <div className='flex justify-between '>
                <div className="w-1/3 text-xl"><EditableText value={stat1Name} onChange={setStat1Name}/></div>
                <div className="w-1/3 text-xl"><EditableText value={stat2Name} onChange={setStat2Name}/></div>
                <div className="w-1/3 text-xl"><EditableText value={stat3Name} onChange={setStat3Name}/></div>
            </div>
            <div className="flex justify-between text-center">
                <div className="w-1/3 flex justify-center items-center gap-x-1">
                    <EditableStat value={stat1} onChange={setStat1} />
                    <span>/</span>
                    <EditableStat value={stat1Max} onChange={setStat1Max} />
                </div>
                <div className="w-1/3 flex justify-center items-center gap-x-1">
                    <EditableStat value={stat2} onChange={setStat2} />
                    <span>/</span>
                    <EditableStat value={stat2Max} onChange={setStat2Max} />
                </div>
                <div className="w-1/3 flex justify-center items-center gap-x-1">
                    <EditableStat value={stat3} onChange={setStat3} />
                    <span>/</span>
                    <EditableStat value={stat3Max} onChange={setStat3Max} />
                </div>
            </div>

        </div>
    )
}

export default Tracker