import React, { Component } from "react";
import DatePicker from "react-datepicker";
import { dashboardService } from "../Service/index"
import Select from "react-select";
import Chart from "react-apexcharts";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cityOptions: [],
      selectedCity: null,
      options: {
        chart: {
          id: "basic-bar",
          width: '10%'
        },

        xaxis: {
          // categories: [1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998]
          categories: [moment(new Date()).format("DD-MM-YYYY")]
        },
        tooltip: {
          shared: true,
          intersect: false,
        },
        colors: ["#9b5", "#e94"],
      },
      series: [],
      chartKey: 1,
      selectedDate: ''
    };
  }

  componentDidMount() {
    this.getCityData();
  }
  getPolutiondata = () => {
    try {
      let defaultDate = this.state.selectedDate == "" ? moment(new Date()).format("YYYY-MM-DD") : moment(this.state.selectedDate).format("YYYY-MM-DD")
      console.log(defaultDate)
      dashboardService.getPolutionData(this.state.selectedCity?.value, defaultDate).subscribe(
        (response) => {
          try {
            if (response) {
              if (
                Array.isArray(response.results) &&
                response.results?.length > 0
              ) {
                const date = [moment(response.results[0].date.local).format("DD-MM-YYYY")]
                const value = [response.results[0].value]
                const parm = response.results[0].parameter
                this.setState((prevState) => {
                  let temp = {
                    ...prevState,
                    options: { ...prevState.options },
                    series: [...prevState.series],
                  }
                  // change title "Soldier of fortune" to "Child in time"
                  temp.options.xaxis.categories = date;
                  temp.series.push({
                    name: parm,
                    data: value
                  });
                  return temp
                },
                  () => {
                    this.refreshTab()
                    console.log(this.state.options, this.state.series, "options")
                  }

                )
                // this.state.options.xaxis.categories= response.results[0].date.local;
                // let data=this.state.optionss.xaxis.categories
                // data.push( response.results[0].date.local)
                // data.series[0].data.push(response.results[0].value)
                //  this.setState({
                //   options:{...data}
                //  })
              }
            }
          } catch (error) {
            console.log(error.message);
          }
        },
        (error) => {
          console.log(error);
        }
      );
    } catch (error) {
      console.log(error?.message);
    }
  }
  refreshTab = () => {
    this.setState({ chartKey: this.state.chartKey + 1 });
  };
  getCityData = () => {
    try {
      dashboardService.getAllCityList().subscribe(
        (response) => {
          try {
            if (response) {
              if (
                Array.isArray(response.results) &&
                response.results?.length > 0
              ) {
                let rowData = response.results?.map((element) => ({
                  label: element.city,
                  value: element.city,
                }));
                this.setState({ cityOptions: rowData });
              }
            }
          } catch (error) {
            console.log(error.message);
          }
        },
        (error) => {
          console.log(error);
        }
      );
    } catch (error) {
      console.log(error?.message);
    }

  }
  // city: "Delhi"
  // coordinates: {latitude: 28.5512005, longitude: 77.2735737}
  // country: "IN"
  // date: {utc: "2021-06-20T20:30:00+00:00", local: "2021-06-21T02:00:00+05:30"}
  // local: "2021-06-21T02:00:00+05:30"
  // utc: "2021-06-20T20:30:00+00:00"
  // entity: "government"
  // isAnalysis: false
  // isMobile: false
  // location: "CRRI Mathura Road, Delhi - IMD"
  // locationId: 5627
  // parameter: "pm25"
  // sensorType: "reference grade"
  // unit: "µg/m³"
  // value: 12.31
  handleChange = selectedCity => {
    this.setState({ selectedCity, series: [] }, () => {
      this.getPolutiondata()
    });
    console.log(`Option selected:`, selectedCity);
  };
  onDateChange = (selectedDate) => {
    this.setState({ selectedDate, series: [] }, () => {
      this.getPolutiondata()
    });
  };


  render() {
    const {
      state: { selectedCity, cityOptions, selectedDate },
      onDateChange,
      deleteCount
    } = this;
    return (<>

      <header id="header" className="d-flex align-items-center">
        <div className="container d-flex align-items-center">
          <div className="logo me-auto">
            <h1>
              Pollution graph
            </h1>
          </div>
        </div>
      </header>
      <div className="container">
        <div className="row no-gutters mt-5 mb-5">
          <div className="col-lg-4 col-md-12">
            <div className="form-group">
              <label className="form-label label-font">
                Please select city to show graph
                <label className="specialcharacter-required">*</label>
              </label>
            </div>
            <Select
              placeholder="Select City"
              value={selectedCity}
              onChange={this.handleChange}
              options={cityOptions}
              classNamePrefix="Select"
              isClearable={true}

            />
          </div>
          <div className="col-lg-4 col-md-12">
            <div className="form-group">
              <label className="form-label label-font">
                Filter data by selecting date
              </label>
            </div>
            <DatePicker
              dateFormat="dd/MM/yyyy"
              onChange={onDateChange}
              name="selectedDate"
              selected={selectedDate}
              placeholderText="Select Date "
              maxDate={new Date()}
              className="form-control "

            />
          </div>
        </div>
        <div >
          <div className="col-lg-6 col-md-12">
            <h3> Pollution  Graph</h3>
          </div>
        </div>
        <div className="row no-gutters ">
          <div className="col-lg-1 value-alignment">
            <p className="date-align label-font"> Value PM25</p>
          </div>

          <div className="col-lg-9 col-md-12">

            <Chart
              key={this.state.chartKey}
              options={this.state.options}
              series={this.state.series}
              type="bar"
              width="80%"
            />
          </div>
        </div>

      </div>
      <div className="col-lg-10 col-md-12">
        <p className="date-align label-font"> Date</p>
      </div>
    </>
    );
  }
}

export default Dashboard;
