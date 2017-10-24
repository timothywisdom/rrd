import { Action, Reducer } from 'redux';
import * as Counter from './Counter';
import * as Locale from './Locale';
import * as WeatherForecasts from './WeatherForecasts';

// The top-level state object
export interface IApplicationState {
	counter: Counter.ICounterState;
	locale: Locale.ILocale; // The country locale of the user (eg. 'en-US')
	weatherForecasts: WeatherForecasts.IWeatherForecastsState;
}

// Whenever an action is dispatched, Redux will update each top-level application state property using
// the reducer with the matching name. It's important that the names match exactly, and that the reducer
// acts on the corresponding ApplicationState property type.
export const reducers = {
	counter: Counter.reducer,
	locale: Locale.reducer,
	weatherForecasts: WeatherForecasts.reducer,
};

// This type can be used as a hint on action creators so that its 'dispatch' and 'getState' params are
// correctly typed to match your store.
export type IAppThunkAction<TAction> = (dispatch: (action: TAction) => void, getState: () => IApplicationState) => void;
