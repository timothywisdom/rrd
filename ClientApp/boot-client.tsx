import 'bootstrap';
import { fetch } from 'domain-task';
import { createBrowserHistory } from 'history';
import * as path from 'path';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import { addLocaleData, IntlProvider } from 'react-intl';
import * as en from 'react-intl/locale-data/en';
import * as fr from 'react-intl/locale-data/fr';
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
			<IntlProvider locale={ localeLanguageBase } messages={ messages[localeLanguageBase] }>
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
	let langLocale: (string | null) = null;
	const meta = document.querySelectorAll('meta[http-equiv="Content-Language"]');
	if (meta.length > 0) {
		langLocale = meta[0].getAttribute('content');
		if (langLocale) {
			langLocale = langLocale;
		}
	}
	console.log('getLanguageFromContentLangageMeta', langLocale);
	return langLocale;
}

const locale: string = getLanguageFromContentLangageMeta() || 'en';
const localeLanguageBase: string = locale.substring(0, 2);
const localeData: any = {};
const messages: any = {};

const fetchLanguageData = fetch(`./dist/assets/i18n/${localeLanguageBase}.json`)
							.then((response) => {
								if (response.status >= 400) {
								throw new Error('Bad response from server');
								}

								const responseJSON = response.json();
								console.log("Got back lang", responseJSON);
								messages[localeLanguageBase] = responseJSON;

								return responseJSON;
							})
							.then((localData) => {
								addLocaleData([...en, ...fr]); // TODO - This needs to be dynamic
								renderApp();
							});

// config.supported_languages.forEach(
// 	(iterLocale) => {
// 		// console.log("foo");
// 		// console.log("fs", fs);
// 		// const localeFilepath = path.resolve(__dirname, `/node_modules/react-intl/locale-data/${locale}.js`);
// 		// console.log("localeFilepath", localeFilepath);
// 		// localeData[locale] = fs.readFileSync(localeFilepath);

// 		const languageFilepath = `./assets/i18n/${iterLocale}.json`;
// 		// if (fs.existsSync(languageFilepath)) {
// 		if (iterLocale === "en" || iterLocale === "fr") {
// 			console.log("requring ", languageFilepath);
// 			messages[iterLocale] = require(languageFilepath);
// 		}
//   	}
// );
// addLocaleData([...en, ...fr]);

// renderApp();

// store.dispatch( {
// 	type: 'UPDATE_LOCALE',
// 	payload: locale,
// } );

// Allow Hot Module Replacement
if (module.hot) {
	module.hot.accept('./routes', () => {
		routes = require<typeof RoutesModule>('./routes').routes;
		renderApp();
	});
}
