import { createServerRenderer, RenderResult } from 'aspnet-prerendering';
import * as fs from 'fs';
import { createMemoryHistory } from 'history';
import * as path from 'path';
import * as React from 'react';
import { renderToString } from 'react-dom/server';
import { addLocaleData, IntlProvider } from 'react-intl';
import { Provider } from 'react-redux';
import { StaticRouter } from 'react-router-dom';
import { replace } from 'react-router-redux';
import configureStore from './configureStore';
import { routes } from './routes';

export default createServerRenderer((params) => {
	return new Promise<RenderResult>((resolve, reject) => {
		// Prepare Redux store with in-memory history, and dispatch a navigation event
		// corresponding to the incoming URL
		const basename = params.baseUrl.substring(0, params.baseUrl.length - 1); // Remove trailing slash
		const urlAfterBasename = params.url.substring(basename.length);
		const store = configureStore(createMemoryHistory());
		store.dispatch(replace(urlAfterBasename));

		// Setup Localization
		const locale: string = (params.data.localeLang || 'en'); // params.data.localeLang is passed from the dotnet server in /Views/Home/Index.cshtml
		const localeBase: string = locale.substring(0, 2);
		const localizedStrings: any = {};
		const localeData: any = {};
		if (fs.existsSync(`./node_modules/react-intl/locale-data/${localeBase}.js`)) {
			localeData[localeBase] = fs.readFileSync(`./node_modules/react-intl/locale-data/${localeBase}.js`).toString();
		}
		localizedStrings[localeBase] = require(`../wwwroot/dist/assets/i18n/${localeBase}.json`);
		store.dispatch({type: 'UPDATE_LOCALE', payload: locale});

		// Prepare an instance of the application and perform an inital render that will
		// cause any async tasks (e.g., data access) to begin
		const routerContext: any = {};
		const app = (
			<IntlProvider locale={locale} messages={localizedStrings[localeBase]}>
				<Provider store={ store }>
					<StaticRouter basename={ basename } context={ routerContext } location={ params.location.path } children={ routes } />
				</Provider>
			</IntlProvider>
		);
		renderToString(app);

		// If there's a redirection, just send this information back to the host application
		if (routerContext.url) {
			resolve({ redirectUrl: routerContext.url });
			return;
		}

		// Once any async tasks are done, we can perform the final render
		// We also send the redux store state, so the client can continue execution where the server left off
		params.domainTasks.then(() => {
			resolve({
				html: renderToString(app),
				globals: { initialReduxState: store.getState() },
			});
		}, reject); // Also propagate any errors back into the host application
	});
});
