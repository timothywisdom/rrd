import * as React from 'React';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { IApplicationState } from '../store';
import * as WeatherForecastsState from '../store/WeatherForecasts';

// At runtime, Redux will merge together...
type WeatherForecastProps =
	WeatherForecastsState.IWeatherForecastsState       // ... state we've requested from the Redux store
	& typeof WeatherForecastsState.actionCreators      // ... plus action creators we've requested
	& RouteComponentProps<{ startDateIndex: string }>; // ... plus incoming routing parameters

class FetchData extends React.Component<WeatherForecastProps, {}> {
	public componentWillMount() {
		// This method runs when the component is first added to the page
		const startDateIndex = parseInt(this.props.match.params.startDateIndex, 10) || 0;
		this.props.requestWeatherForecasts(startDateIndex);
	}

	public componentWillReceiveProps(nextProps: WeatherForecastProps) {
		// This method runs when incoming props (e.g., route params) change
		const startDateIndex = parseInt(nextProps.match.params.startDateIndex, 10) || 0;
		this.props.requestWeatherForecasts(startDateIndex);
	}

	public render() {
		return (
			<div>
				<h1>Weather forecast</h1>
				<p>This component demonstrates fetching data from the server and working with URL parameters.</p>
				{ this.renderForecastsTable() }
				{ this.renderPagination() }
			</div>
		);
	}

	private renderForecastsTable() {
		return (
			<table className='table'>
				<thead>
					<tr>
						<th>Date</th>
						<th>Temp. (C)</th>
						<th>Temp. (F)</th>
						<th>Summary</th>
					</tr>
				</thead>
				<tbody>
				{this.props.forecasts.map((forecast) =>
					<tr key={ forecast.dateFormatted }>
						<td>{ forecast.dateFormatted }</td>
						<td>{ forecast.temperatureC }</td>
						<td>{ forecast.temperatureF }</td>
						<td>{ forecast.summary }</td>
					</tr>
				)}
				</tbody>
			</table>
		);
	}

	private renderPagination() {
		const prevStartDateIndex = (this.props.startDateIndex || 0) - 5;
		const nextStartDateIndex = (this.props.startDateIndex || 0) + 5;

		return <p className='clearfix text-center'>
			<Link className='btn btn-default pull-left' to={ `/fetchdata/${ prevStartDateIndex }` }>Previous</Link>
			<Link className='btn btn-default pull-right' to={ `/fetchdata/${ nextStartDateIndex }` }>Next</Link>
			{ this.props.isLoading ? <span>Loading...</span> : [] }
		</p>;
	}
}

export default connect(
	(state: IApplicationState) => state.weatherForecasts, // Selects which state properties are merged into the component's props
	WeatherForecastsState.actionCreators                  // Selects which action creators are merged into the component's props
)(FetchData) as typeof FetchData;
