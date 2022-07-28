import React, { useState } from "react";
import axios from "axios";

// Suggested initial states
const initialMessage = "";
const initialEmail = "";
const initialSteps = 0;
const initialIndex = 4; // the index the "B" is at

export default function AppFunctional(props) {
  const [state, setState] = useState({
    message: initialMessage,
    email: initialEmail,
    index: initialIndex,
    steps: initialSteps,
  });
  // THE FOLLOWING HELPERS ARE JUST RECOMMENDATIONS.
  // You can delete them and build your own logic from scratch.

  function getXY(index) {
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
    // It it not necessary to have a state to track the coordinates.
    // It's enough to know what index the "B" is at, to be able to calculate them.
  }

  function getXYMessage() {
    return `Coordinates ${getXY(state.index)}`;
    // It it not necessary to have a state to track the "Coordinates (2, 2)" message for the user.
    // You can use the `getXY` helper above to obtain the coordinates, and then `getXYMessage`
    // returns the fully constructed string.
  }

  function reset() {
    setState({
      ...state,
      message: "",
      email: "",
      index: 4,
      steps: 0,
    });
    // Use this helper to reset all states to their initial values.
  }

  function getNextIndex(direction) {
    if (direction === "left") {
      if (state.index === 3 || state.index === 6 || state.index === 0) {
        setState({
          ...state,
          message: "You can't go left",
        });
      } else {
        setState({
          ...state,
          message: state.message,
          steps: state.steps + 1,
          index: state.index - 1,
        });
      }
    } else if (direction === "right") {
      if (state.index === 2 || state.index === 5 || state.index === 8) {
        setState({
          ...state,
          message: "You can't go right",
        });
      } else {
        setState({
          ...state,
          message: state.message,
          steps: state.steps + 1,
          index: state.index + 1,
        });
      }
    }
    if (direction === "up") {
      if (state.index === 0 || state.index === 1 || state.index === 2) {
        setState({
          ...state,
          message: "You can't go up",
        });
      } else {
        setState({
          ...state,
          message: state.message,
          steps: state.steps + 1,
          index: state.index - 3,
        });
      }
    }
    if (direction === "down") {
      if (state.index === 6 || state.index === 7 || state.index === 8) {
        setState({
          ...state,
          message: "You can't go down",
        });
      } else {
        setState({
          ...state,
          message: state.message,
          steps: state.steps + 1,
          index: state.index + 3,
        });
      }
    }
    // This helper takes a direction ("left", "up", etc) and calculates what the next index
    // of the "B" would be. If the move is impossible because we are at the edge of the grid,
    // this helper should return the current index unchanged.
  }

  function move(evt) {
    getNextIndex(evt.target.id);
    // This event handler can use the helper above to obtain a new index for the "B",
    // and change any states accordingly.
  }

  function onChange(evt) {
    setState({
      ...state,
      email: evt.target.value,
    });
    // You will need this to update the value of the input.
  }

  function onSubmit(evt) {
    const split = [...getXY(state.index)];
    evt.preventDefault();
    axios
      .post("http://localhost:9000/api/result", {
        x: split[1],
        y: split[4],
        steps: state.steps,
        email: state.email,
      })
      .then((res) => {
        console.log(res);
        setState({
          ...state,
          message: res.data.message,
          email: initialEmail,
        });
      })
      .catch((err) => {
        setState({
          ...state,
          message: err.response.data.message,
        });
      });
    // Use a POST request to send a payload to the server.
  }

  return (
    <div id="wrapper" className={props.className}>
      <div className="info">
        <h3 id="coordinates">{getXYMessage()}</h3>
        <h3 id="steps">
          {state.steps === 1
            ? `You moved ${state.steps} time`
            : `You moved ${state.steps} times`}
        </h3>
      </div>
      <div id="grid">
        {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((idx) => (
          <div
            key={idx}
            className={`square${idx === state.index ? " active" : ""}`}
          >
            {idx === state.index ? "B" : null}
          </div>
        ))}
      </div>
      <div className="info">
        <h3 id="message">{state.message}</h3>
      </div>
      <div id="keypad">
        <button onClick={move} id="left">
          LEFT
        </button>
        <button onClick={move} id="up">
          UP
        </button>
        <button onClick={move} id="right">
          RIGHT
        </button>
        <button onClick={move} id="down">
          DOWN
        </button>
        <button onClick={reset} id="reset">
          reset
        </button>
      </div>
      <form onSubmit={onSubmit}>
        <input
          onChange={onChange}
          value={state.email}
          id="email"
          type="email"
          placeholder="type email"
        ></input>
        <input id="submit" type="submit"></input>
      </form>
    </div>
  );
}
