import React, { Component } from "react";
import "./App.css";
import ripple from "./Ripple-2.5s-200px(Red).svg";

import { Map, TileLayer, Marker, Popup } from "react-leaflet";
import {
  Card,
  Button,
  CardTitle,
  CardText,
  Form,
  FormGroup,
  Label,
  Input
} from "reactstrap";
import Joi from "joi";

import L from "leaflet";

var myIcon = L.icon({
  iconUrl:
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAApCAYAAADAk4LOAAAFgUlEQVR4Aa1XA5BjWRTN2oW17d3YaZtr2962HUzbDNpjszW24mRt28p47v7zq/bXZtrp/lWnXr337j3nPCe85NcypgSFdugCpW5YoDAMRaIMqRi6aKq5E3YqDQO3qAwjVWrD8Ncq/RBpykd8oZUb/kaJutow8r1aP9II0WmLKLIsJyv1w/kqw9Ch2MYdB++12Onxee/QMwvf4/Dk/Lfp/i4nxTXtOoQ4pW5Aj7wpici1A9erdAN2OH64x8OSP9j3Ft3b7aWkTg/Fm91siTra0f9on5sQr9INejH6CUUUpavjFNq1B+Oadhxmnfa8RfEmN8VNAsQhPqF55xHkMzz3jSmChWU6f7/XZKNH+9+hBLOHYozuKQPxyMPUKkrX/K0uWnfFaJGS1QPRtZsOPtr3NsW0uyh6NNCOkU3Yz+bXbT3I8G3xE5EXLXtCXbbqwCO9zPQYPRTZ5vIDXD7U+w7rFDEoUUf7ibHIR4y6bLVPXrz8JVZEql13trxwue/uDivd3fkWRbS6/IA2bID4uk0UpF1N8qLlbBlXs4Ee7HLTfV1j54APvODnSfOWBqtKVvjgLKzF5YdEk5ewRkGlK0i33Eofffc7HT56jD7/6U+qH3Cx7SBLNntH5YIPvODnyfIXZYRVDPqgHtLs5ABHD3YzLuespb7t79FY34DjMwrVrcTuwlT55YMPvOBnRrJ4VXTdNnYug5ucHLBjEpt30701A3Ts+HEa73u6dT3FNWwflY86eMHPk+Yu+i6pzUpRrW7SNDg5JHR4KapmM5Wv2E8Tfcb1HoqqHMHU+uWDD7zg54mz5/2BSnizi9T1Dg4QQXLToGNCkb6tb1NU+QAlGr1++eADrzhn/u8Q2YZhQVlZ5+CAOtqfbhmaUCS1ezNFVm2imDbPmPng5wmz+gwh+oHDce0eUtQ6OGDIyR0uUhUsoO3vfDmmgOezH0mZN59x7MBi++WDL1g/eEiU3avlidO671bkLfwbw5XV2P8Pzo0ydy4t2/0eu33xYSOMOD8hTf4CrBtGMSoXfPLchX+J0ruSePw3LZeK0juPJbYzrhkH0io7B3k164hiGvawhOKMLkrQLyVpZg8rHFW7E2uHOL888IBPlNZ1FPzstSJM694fWr6RwpvcJK60+0HCILTBzZLFNdtAzJaohze60T8qBzyh5ZuOg5e7uwQppofEmf2++DYvmySqGBuKaicF1blQjhuHdvCIMvp8whTTfZzI7RldpwtSzL+F1+wkdZ2TBOW2gIF88PBTzD/gpeREAMEbxnJcaJHNHrpzji0gQCS6hdkEeYt9DF/2qPcEC8RM28Hwmr3sdNyht00byAut2k3gufWNtgtOEOFGUwcXWNDbdNbpgBGxEvKkOQsxivJx33iow0Vw5S6SVTrpVq11ysA2Rp7gTfPfktc6zhtXBBC+adRLshf6sG2RfHPZ5EAc4sVZ83yCN00Fk/4kggu40ZTvIEm5g24qtU4KjBrx/BTTH8ifVASAG7gKrnWxJDcU7x8X6Ecczhm3o6YicvsLXWfh3Ch1W0k8x0nXF+0fFxgt4phz8QvypiwCCFKMqXCnqXExjq10beH+UUA7+nG6mdG/Pu0f3LgFcGrl2s0kNNjpmoJ9o4B29CMO8dMT4Q5ox8uitF6fqsrJOr8qnwNbRzv6hSnG5wP+64C7h9lp30hKNtKdWjtdkbuPA19nJ7Tz3zR/ibgARbhb4AlhavcBebmTHcFl2fvYEnW0ox9xMxKBS8btJ+KiEbq9zA4RthQXDhPa0T9TEe69gWupwc6uBUphquXgf+/FrIjweHQS4/pduMe5ERUMHUd9xv8ZR98CxkS4F2n3EUrUZ10EYNw7BWm9x1GiPssi3GgiGRDKWRYZfXlON+dfNbM+GgIwYdwAAAAASUVORK5CYII",
  iconSize: [25, 41],
  iconAnchor: [12.5, 0],
  popupAnchor: [0, 0]
});

const schema = Joi.object().keys({
  name: Joi.string()
    .min(3)
    .max(100)
    .required(),
  suitability: Joi.string()
    .min(3)
    .max(100)
    .required()
});

const API_URL =
  window.location.hostname === "localhost"
    ? "http://localhost:5000/api/v1/slipways"
    : "production-url-here";

class App extends Component {
  state = {
    location: {
      lat: 50,
      lng: -90
    },
    haveUsersLocation: false,
    zoom: 3,
    newSlipway: {
      name: "",
      suitability: ""
    },
    sendingMessage: false,
    sentMessage: false
  };

  componentDidMount() {
    navigator.geolocation.getCurrentPosition(
      position => {
        this.setState({
          location: {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          },
          haveUsersLocation: true,
          zoom: 13
        });
      },
      () => {
        fetch("https://ipapi.co/json")
          .then(res => res.json())
          .then(location => {
            this.setState({
              location: {
                lat: location.latitude,
                lng: location.longitude
              },
              zoom: 5
            });
          });
      }
    );
  }

  formIsValid = () => {
    const slipway = {
      name: this.state.newSlipway.name,
      suitability: this.state.newSlipway.suitability
    };
    const result = Joi.validate(slipway, schema);

    console.log(result);

    return !result.error && this.state.haveUsersLocation;
  };

  formSubmitted = event => {
    event.preventDefault();
    console.log("this.state.newSlipway", this.state.newSlipway);

    const userSlipway = {
      name: this.state.newSlipway.name,
      suitability: this.state.newSlipway.suitability,
      latitude: this.state.location.lat,
      longitude: this.state.location.lng
    };

    console.log("userSlipway", userSlipway);

    if (this.formIsValid()) {
      this.setState({
        sendingMessage: true
      });
      fetch(API_URL, {
        method: "POST",
        headers: {
          "content-type": "application/json"
        },
        body: JSON.stringify(userSlipway)
      })
        .then(res => res.json())
        .then(message => {
          setTimeout(() => {
            this.setState({
              sendingMessage: false,
              sentMessage: true
            });
          }, 2000);
        });
    }
  };

  valueChanged = event => {
    const { name, value } = event.target;

    this.setState(prevState => ({
      newSlipway: {
        ...prevState.newSlipway,
        [name]: value
      }
    }));
  };

  render() {
    const position = [this.state.location.lat, this.state.location.lng];
    return (
      <div className="map">
        <Map className="map" center={position} zoom={this.state.zoom}>
          <TileLayer
            attribution="&amp;copy <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {this.state.haveUsersLocation ? (
            <Marker position={position} icon={myIcon}>
              <Popup>
                A pretty CSS3 popup. <br /> Easily customizable.
              </Popup>
            </Marker>
          ) : (
            ""
          )}
        </Map>
        <div className="message-form">
          <Card body>
            <CardTitle>Welcome To BoatLaunch</CardTitle>
            <CardText>Add a slipway at your location.</CardText>
            {!this.state.sendingMessage && !this.sentMessage ? (
              <Form onSubmit={this.formSubmitted}>
                <FormGroup>
                  <Label for="name">Slipway Name</Label>
                  <Input
                    type="text"
                    name="name"
                    id="name"
                    placeholder="Add Slipway Name Here"
                    onChange={this.valueChanged}
                  />
                </FormGroup>
                <FormGroup>
                  <Label for="exampleSelect">Select Suitability</Label>
                  <Input
                    type="select"
                    name="suitability"
                    id="suitability"
                    onChange={this.valueChanged}
                  >
                    <option value="unknown">Unkown</option>
                    <option value="portable">Portable Only</option>
                    <option value="small">Small trailer can be pushed</option>
                    <option value="large">Large trailer needs a car</option>
                  </Input>
                </FormGroup>
                <Button
                  type="submit"
                  color="info"
                  disabled={!this.formIsValid()}
                >
                  Submit
                </Button>
              </Form>
            ) : (
              <img src={ripple} alt="logo" />
            )}
          </Card>
        </div>
      </div>
    );
  }
}

export default App;
