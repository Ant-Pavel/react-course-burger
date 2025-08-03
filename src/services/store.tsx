import { configureStore } from '@reduxjs/toolkit';

import ingredientsReducer from './ingredients';
import burgerConstructorReducer from './burgerConstructor';
import orderReducer from './order';
import ingredientDetailsReducer from './ingredientDetails';
import authReducer from './auth';

export const store = configureStore({
	reducer: {
		ingredients: ingredientsReducer,
		burgerConstructor: burgerConstructorReducer,
		order: orderReducer,
		ingredientDetails: ingredientDetailsReducer,
		auth: authReducer,
	},
	devTools: process.env.NODE_ENV !== 'production',
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
