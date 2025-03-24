import { FC, useState, useContext, createContext, ReactNode } from 'react';


type Log = {
    msg: string;
    rolls: string;
}

type LogContextType = {
    log: Log[];
    addLog: (log: Log) => void;
    removeLog: (index: number) => void;
};

const LogContext = createContext<LogContextType | undefined>(undefined);

interface LogProviderProps {
    children: ReactNode;
}

export const LogProvider: FC<LogProviderProps> = ({children}) => {
    const [log, setLog] = useState<Log[]>([]);

    const addLog = (newLog: Log) => { // adds notification to log
        setLog((prevLogs) => [...prevLogs, newLog]);
    };

    const removeLog = (index: number) => { // removes notification from log, index
        const newLog = [...log];
        newLog.splice(index, 1);
        setLog(newLog);
    };

    return (
        <LogContext.Provider value={{log, addLog, removeLog}}>
            {children}
        </LogContext.Provider>
    );
}

export const useLog = () => {
    const context = useContext(LogContext);
    if (!context) {
        throw new Error('useLog must be used within a LogProvider');
    }
    return context;

};