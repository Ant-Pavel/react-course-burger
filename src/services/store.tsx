import { configureStore, combineSlices } from '@reduxjs/toolkit';
import {
	type TypedUseSelectorHook,
	useSelector,
	useDispatch,
} from 'react-redux';

import * as ordersAllSocketActions from './actions/ordersAllSocketActions';
import * as ordersUserSocketActions from './actions/ordersUserSocketActions';

import ingredientsReducer from './ingredients';
import burgerConstructorReducer from './burgerConstructor';
import orderReducer from './order';
import ingredientDetailsReducer from './ingredientDetails';
import authReducer from './auth';
import ordersAll from './ordersAll';
import ordersUser from './ordersUser';
import { socketMiddleware } from './middleware/socket-middleware';

const socketMiddlewareAllOrders = socketMiddleware(
	{
		connect: ordersAllSocketActions.wsConnect,
		disconnect: ordersAllSocketActions.wsDisconnect,
		onOpen: ordersAllSocketActions.onOpen,
		onMessage: ordersAllSocketActions.onMessage,
		onError: ordersAllSocketActions.onError,
		onClose: ordersAllSocketActions.onClose,
	},
	true
);

const socketMiddlewareUserOrders = socketMiddleware(
	{
		connect: ordersUserSocketActions.wsConnect,
		disconnect: ordersUserSocketActions.wsDisconnect,
		onOpen: ordersUserSocketActions.onOpen,
		onMessage: ordersUserSocketActions.onMessage,
		onError: ordersUserSocketActions.onError,
		onClose: ordersUserSocketActions.onClose,
	},
	true
);

const rootReducer = combineSlices(
	ingredientsReducer,
	burgerConstructorReducer,
	orderReducer,
	ingredientDetailsReducer,
	authReducer,
	ordersAll,
	ordersUser
);

export const store = configureStore({
	reducer: rootReducer,
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware().concat(
			socketMiddlewareAllOrders,
			socketMiddlewareUserOrders
		),
	devTools: process.env.NODE_ENV !== 'production',
});

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;

// Typed hooks
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
