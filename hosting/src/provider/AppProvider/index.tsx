import { ReactNode, createContext, useState, Dispatch, SetStateAction } from 'react';

interface Todolist {
    slice(arg0: number, arg1: number): unknown;
    _id: string;
    todo: string;
    status: string;
    priority: string;
    dueDate: string;
    maker:string;
}

interface ContextProps {
    todolist: Todolist[];
    setTodolist: Dispatch<SetStateAction<Todolist[]>>;
}

interface Props {
    children: ReactNode;
}

const defaultValue: ContextProps = {
    todolist: [],
    setTodolist: () => { }
};

export const AppContext = createContext<ContextProps>(defaultValue);

const AppProvider = ({ children }: Props) => {
    const [todolist, setTodolist] = useState<Todolist[]>([]);

    return (
        <AppContext.Provider value={{ todolist, setTodolist }}>
            {children}
        </AppContext.Provider>
    );
};

export default AppProvider;