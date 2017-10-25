import 'bootstrap';
import { fetch } from 'domain-task';
import { createBrowserHistory } from 'history';
import * as path from 'path';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import { addLocaleData, IntlProvider } from 'react-intl';
// import * as en from 'react-intl/locale-data/en';
// import * as fr from 'react-intl/locale-data/fr';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'react-router-redux';
import config from './config/config';
import configureStore from './configureStore';
import * as RoutesModule from './routes';
import { IApplicationState, reducers } from './store';
let routes = RoutesModule.routes;

// Create browser history to use in the Redux store
const baseUrl = document.getElementsByTagName('base')[0].getAttribute('href')!;
const history = createBrowserHistory({ basename: baseUrl });

// Get the application-wide store instance, prepopulating with state from the server where available.
const initialState = (window as any).initialReduxState as IApplicationState;
const store = configureStore(history, initialState);

function renderApp() {
	// This code starts up the React app when it runs in a browser. It sets up the routing configuration
	// and injects the app into a DOM element.

	ReactDOM.render(
		<AppContainer>
			<IntlProvider locale={ locale } messages={ localizedStrings[localeBase] }>
				<Provider store={ store }>
					<ConnectedRouter history={ history } children={ routes } />
				</Provider>
			</IntlProvider>
		</AppContainer>,
		document.getElementById('react-app')
	);
}

// Localization
function getLanguageFromContentLangageMeta(): (string | null) {
	// Note - we could also just return navigator.language but this is sometimes different from what the server places in the Content-Language Header
	let langLocale: (string | null) = navigator.language || null;
	const meta = document.querySelectorAll('meta[http-equiv="Content-Language"]');
	if (meta.length > 0) {
		langLocale = meta[0].getAttribute('content');
		if (langLocale) {
			langLocale = langLocale;
		}
	}
	return langLocale;
}

const locale: string = getLanguageFromContentLangageMeta() || 'en';
const localeBase: string = locale.split('-')[0];
const localeData: any = {};
const localizedStrings: any = {};

const fetchLocaleStrings = fetch(`./dist/assets/i18n/${localeBase}.json`)
							.then((response) => {
								if (response.status >= 400) {
									throw new Error('Bad response from server');
								}

								return response.json();
							})
							.then((localeStrings) => {
								localizedStrings[localeBase] = localeStrings; // Add localized strings to our localizedStrings object
								addLocaleData(require(`react-intl/locale-data/${localeBase}`)); // Fetch locale-data for this locale (pluralization rules, etc)
								// addLocaleData([...en, ...fr]); // TODO - This needs to be dynamic
								renderApp();
							});

// Allow Hot Module Replacement
if (module.hot) {
	module.hot.accept('./routes', () => {
		routes = require<typeof RoutesModule>('./routes').routes;
		renderApp();
	});
}
