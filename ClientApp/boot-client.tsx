import './css/site.scss';
import 'bootstrap';
import * as fs from 'fs';
import * as path from 'path';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { addLocaleData, IntlProvider } from 'react-intl';
import * as en from 'react-intl/locale-data/en';
import * as fr from 'react-intl/locale-data/fr';
import { AppContainer } from 'react-hot-loader';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'react-router-redux';
import { createBrowserHistory } from 'history';
import configureStore from './configureStore';
import { IApplicationState } from './store';
import * as RoutesModule from './routes';
let routes = RoutesModule.routes;

// Create browser history to use in the Redux store
const baseUrl = document.getElementsByTagName('base')[0].getAttribute('href')!;
const history = createBrowserHistory({ basename: baseUrl });

// Get the application-wide store instance, prepopulating with state from the server where available.
const initialState = (window as any).initialReduxState as IApplicationState;
const store = configureStore(history, initialState);

// Localization
const locale: string = 'fr';
const localeData: any = {};
const messages: any = {};
['en', 'fr'].forEach(
	(iterLocale) => {
		// localeData[locale] = fs.readFileSync(`/node_modules/react-intl/locale-data/${locale}.js`).toString();
		messages[iterLocale] = require(`./assets/i18n/${iterLocale}.json`);
  	}
);
addLocaleData([...en, ...fr]);

function renderApp() {
	// This code starts up the React app when it runs in a browser. It sets up the routing configuration
	// and injects the app into a DOM element.
	ReactDOM.render(
		<AppContainer>
			<IntlProvider locale={ locale } messages={ messages[locale] }>
				<Provider store={ store }>
					<ConnectedRouter history={ history } children={ routes } />
				</Provider>
			</IntlProvider>
		</AppContainer>,
		document.getElementById('react-app')
	);
}

renderApp();

// Allow Hot Module Replacement
if (module.hot) {
	module.hot.accept('./routes', () => {
		routes = require<typeof RoutesModule>('./routes').routes;
		renderApp();
	});
}
