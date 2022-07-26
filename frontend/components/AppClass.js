import axios from "axios";

import React, { useEffect } from "react";

// Suggested initial states
const initialMessage = "";
const initialEmail = "";
const initialSteps = 0;
const initialIndex = 4; // the index the "B" is at

export default class AppClass extends React.Component {
  // THE FOLLOWING HELPERS ARE JUST RECOMMENDATIONS.
  // You can delete them and build your own logic from scratch.
  state = {
    message: initialMessage,
    email: initialEmail,
    index: initialIndex,
    steps: initialSteps,
  };

  getXY = (index) => {
    // It it not necessary to have a state to track the coordinates.
    // It's enough to know what index the "B" is at, to be able to calculate them.
    switch (index) {
      case 0:
        return "(1, 1)";
      case 1:
        return "(2, 1)";
      case 2:
        return "(3, 1)";
      case 3:
        return "(1, 2)";
      case 4:
        return "(2, 2)";
      case 5:
        return "(3, 2)";
      case 6:
        return "(1, 3)";
      case 7:
        return "(2, 3)";
      case 8:
        return "(3, 3)";
    }
  };

  getXYMessage = () => {
    // It it not necessary to have a state to track the "Coordinates (2, 2)" message for the user.
    // You can use the `getXY` helper above to obtain the coordinates, and then `getXYMessage`
    // returns the fully constructed string.
    return `Coordinates ${this.getXY(this.state.index)}`;
  };

  reset = () => {
    this.setState(this.state);
    // Use this helper to reset all states to their initial values.
  };

  getNextIndex = (direction) => {
    if (direction === "left") {
      if (
        this.state.index === 3 ||
        this.state.index === 6 ||
        this.state.index === 0
      ) {
        this.setState({
          ...this.state,
          message: "You can't go left",
        });
      } else {
        this.setState({
          ...this.state,
          message: this.state.message,
          steps: this.state.steps + 1,
          index: this.state.index - 1,
        });
      }
    } else if (direction === "right") {
      if (
        this.state.index === 2 ||
        this.state.index === 5 ||
        this.state.index === 8
      ) {
        this.setState({
          ...this.state,
          message: "You can't go right",
        });
      } else {
        this.setState({
          ...this.state,
          message: this.state.message,
          steps: this.state.steps + 1,
          index: this.state.index + 1,
        });
      }
    }
    if (direction === "up") {
      if (
        this.state.index === 0 ||
        this.state.index === 1 ||
        this.state.index === 2
      ) {
        this.setState({
          ...this.state,
          message: "You can't go up",
        });
      } else {
        this.setState({
          ...this.state,
          message: this.state.message,
          steps: this.state.steps + 1,
          index: this.state.index - 3,
        });
      }
    }
    if (direction === "down") {
      if (
        this.state.index === 6 ||
        this.state.index === 7 ||
        this.state.index === 8
      ) {
        this.setState({
          ...this.state,
          message: "You can't go down",
        });
      } else {
        this.setState({
          ...this.state,
          message: this.state.message,
          steps: this.state.steps + 1,
          index: this.state.index + 3,
        });
      }
    }
    // This helper takes a direction ("left", "up", etc) and calculates what the next index
    // of the "B" would be. If the move is impossible because we are at the edge of the grid,
    // this helper should return the current index unchanged.
  };

  move = (evt) => {
    console.log(evt.target.id);
    // This event handler can use the helper above to obtain a new index for the "B",
    // and change any states accordingly.
    this.getNextIndex(evt.target.id);
    // this.setState({
    //   ...this.state,
    //   index: evt.target,
    // });
  };

  onChange = (evt) => {
    this.setState({
      ...this.state,
      email: evt.target.value,
    });
    // You will need this to update the value of the input.
  };

  onSubmit = (evt) => {
    const split = [...this.getXY(this.state.index)];
    evt.preventDefault();
    axios
      .post("http://localhost:9000/api/result", {
        x: split[1],
        y: split[4],
        steps: this.state.steps,
        email: this.state.email,
      })
      .then((res) => {
        console.log(res);
        this.setState(this.state);
      })
      .catch((err) => {
        this.setState({ message: err.response.data.message });
        console.log("There was an error!", err);
      });
  };
  // Use a POST request to send a payload to the server.

  render() {
    const { className } = this.props;
    return (
      <div id="wrapper" className={className}>
        <div className="info">
          <h3 id="coordinates">{this.getXYMessage()}</h3>
          <h3 id="steps">Steps {this.state.steps}</h3>
        </div>
        <div id="grid">
          {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((idx) => (
            <div
              key={idx}
              className={`square${idx === this.state.index ? " active" : ""}`}
            >
              {idx === this.state.index ? "B" : null}
            </div>
          ))}
        </div>
        <div className="info">
          <h3 id="message">{this.state.message}</h3>
        </div>
        <div id="keypad">
          <button onClick={this.move} id="left">
            LEFT
          </button>
          <button onClick={this.move} id="up">
            UP
          </button>
          <button onClick={this.move} id="right">
            RIGHT
          </button>
          <button onClick={this.move} id="down">
            DOWN
          </button>
          <button onClick={this.move} id="reset">
            reset
          </button>
        </div>
        <form onSubmit={this.onSubmit}>
          <input
            onChange={this.onChange}
            id="email"
            type="email"
            placeholder="type email"
          ></input>
          <input id="submit" type="submit"></input>
        </form>
      </div>
    );
  }
}
