import { Action, Reducer } from 'redux';

export interface ILocale {
	locale: string;
}

interface ILocaleAction {
	type: 'UPDATE_LOCALE';
	payload: string;
}
type LocaleAction = ILocaleAction;

const INITIAL_STATE: ILocale = {
	locale: 'en',
};

export const actionCreators = {
	updateLocale: () => {
		return {
			type: 'UPDATE_LOCALE',
		} as ILocaleAction;
	},
};

export const reducer: any = (state: ILocale = INITIAL_STATE, action: LocaleAction) => {
	switch (action.type) {
		case 'UPDATE_LOCALE':
			return { locale: action.payload };
	}

	return state;
};
