import { getIsAuthChecked, getUser } from '@/services/auth';
import { Navigate, useLocation } from 'react-router-dom';
import { Preloader } from '../preloader/preloader';
import { useAppSelector } from '@/services/store';

interface IProtectedProps {
	onlyAuthedAccess?: boolean;
	component: React.JSX.Element;
}

export const Protected = ({
	onlyAuthedAccess = true,
	component,
}: IProtectedProps): React.JSX.Element => {
	const isAuthChecked = useAppSelector(getIsAuthChecked);
	const user = useAppSelector(getUser);
	const location = useLocation();

	if (!isAuthChecked) {
		return <Preloader />;
	}

	if (onlyAuthedAccess && !user) {
		return <Navigate to='/login' state={{ from: location }} />;
	}

	if (!onlyAuthedAccess && user) {
		const { from } = location.state || { from: { pathname: '/' } };

		return <Navigate to={from.pathname} state={{ from: location }} />;
	}

	return component;
};

export const OnlyAuthed = Protected;
export const OnlyUnauthed = ({
	component,
}: Pick<IProtectedProps, 'component'>): React.JSX.Element => (
	<Protected onlyAuthedAccess={false} component={component} />
);
