import { Action, Reducer } from 'redux';
import * as WeatherForecasts from './WeatherForecasts';
import * as Counter from './Counter';

// The top-level state object
export interface IApplicationState {
	counter: Counter.ICounterState;
	locale: string; // The country locale of the user (eg. 'en-US')
	weatherForecasts: WeatherForecasts.IWeatherForecastsState;
}

// --- Locale ---
export interface ILocale {
	locale: string;
}

interface ILocaleAction {
	type: 'UPDATE_LOCALE';
	payload: string;
}
type LocaleAction = ILocaleAction & Action;

const localeReducer: Reducer<ILocale> = (state: ILocale, action: LocaleAction) => {
	switch (action.type) {
		case 'UPDATE_LOCALE':
			return { locale: action.payload };
	}

	return state || { locale: 'en' };
};
console.log('typeof localeReducer', typeof localeReducer);
// --- Locale ---

// Whenever an action is dispatched, Redux will update each top-level application state property using
// the reducer with the matching name. It's important that the names match exactly, and that the reducer
// acts on the corresponding ApplicationState property type.
export const reducers = {
	counter: Counter.reducer,
	locale: localeReducer,
	weatherForecasts: WeatherForecasts.reducer,
};

// This type can be used as a hint on action creators so that its 'dispatch' and 'getState' params are
// correctly typed to match your store.
export type IAppThunkAction<TAction> = (dispatch: (action: TAction) => void, getState: () => IApplicationState) => void;
