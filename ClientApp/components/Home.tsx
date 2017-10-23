import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import { IApplicationState } from '../store';
import * as CounterStore from '../store/Counter';
import { FormattedMessage } from 'react-intl';

interface IHome {
	locale: string;
}

type HomeProps = IHome & RouteComponentProps<{}>;

// class Home extends React.Component<RouteComponentProps<{}>, {}> {
class Home extends React.Component<HomeProps, {}> {
	public render() {
		return (
			<div>
				<h1>Hello, world!</h1>
				<p>Welcome to your new single-page application, built with:</p>
				<ul>
					<li><a href='https://get.asp.net/'>ASP.NET Core</a> and <a href='https://msdn.microsoft.com/en-us/library/67ef8sbd.aspx'>C#</a> for cross-platform server-side code</li>
					<li><a href='https://facebook.github.io/react/'>React</a>, <a href='http://redux.js.org'>Redux</a>, and <a href='http://www.typescriptlang.org/'>TypeScript</a> for client-side code</li>
					<li><a href='https://webpack.github.io/'>Webpack</a> for building and bundling client-side resources</li>
					<li><a href='http://getbootstrap.com/'>Bootstrap</a> for layout and styling</li>
				</ul>
				<p>To help you get started, we've also set up:</p>
				<ul>
					<li><strong>Client-side navigation</strong>. For example, click <em>Counter</em> then <em>Back</em> to return here.</li>
					<li><strong>Webpack dev middleware</strong>. In development mode, there's no need to run the <code>webpack</code> build tool. Your client-side resources are dynamically built on demand. Updates are available as soon as you modify any file.</li>
					<li><strong>Hot module replacement</strong>. In development mode, you don't even need to reload the page after making most changes. Within seconds of saving changes to files, rebuilt React components will be injected directly into your running application, preserving its live state.</li>
					<li><strong>Efficient production builds</strong>. In production mode, development-time features are disabled, and the <code>webpack</code> build tool produces minified static CSS and JavaScript files.</li>
					<li><strong>Server-side prerendering</strong>. To optimize startup time, your React application is first rendered on the server. The initial HTML and state is then transferred to the browser, where client-side code picks up where the server left off.</li>
				</ul>
				<br />
				<br />
				The following text is localized to your current locale: &quot;{this.props.locale}&quot;<br />
				<FormattedMessage id='app.hello_world' defaultMessage='Hello World Default Message!' description='Hello world header greeting' />
			</div>
		);
	}
}

const mapStateToProps = ( state: IApplicationState ) => {
	return {
	  locale : state.locale,
	};
};

const mapDispatchToProps = ( dispatch: any ) => {
	return {};
};

// Wire up the React component to the Redux store
export default connect(
	// (state: IApplicationState) => state.locale,  // Selects which state properties are merged into the component's props
	mapStateToProps,								// Selects which state properties are merged into the component's props
	// CounterStore.actionCreators                  // Selects which action creators are merged into the component's props
	mapDispatchToProps 								// Selects which action creators are merged into the component's props
)(Home) as typeof Home;
