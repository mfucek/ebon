import {
	FC,
	PropsWithChildren,
	createContext,
	useContext,
	useState
} from 'react';

export interface Interface {
	id: string;
	name: string;
}

export const InterfaceContext = createContext<Interface | null>(null);

export const useInterface = () => {
	const context = useContext(InterfaceContext);
	if (!context) {
		throw new Error('useUserContext must be used within a UserProvider');
	}

	return context;
};

export const InterfaceProvider: FC<PropsWithChildren> = ({ children }) => {
	const [int, setInt] = useState<Interface | null>(null);

	return (
		<InterfaceContext.Provider value={int}>
			{children}
		</InterfaceContext.Provider>
	);
};
