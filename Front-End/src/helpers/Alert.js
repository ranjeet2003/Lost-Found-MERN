import React, { Component } from "react";
import SweetAlert from "react-bootstrap-sweetalert";

export default class HelloWorld extends Component {
  constructor(props) {
    super(props);

    this.state = {
      alert: null,
    };
  }

  deleteThisGoal() {
    const getAlert = () => (
      <SweetAlert success title="Woot!" onConfirm={() => this.hideAlert()}>
        Hello world!
      </SweetAlert>
    );

    this.setState({
      alert: getAlert(),
    });
  }

  hideAlert() {
    console.log("Hiding alert...");
    this.setState({
      alert: null,
    });
  }

  render() {
    return (
      <div style={{ padding: "20px" }}>
        <a onClick={() => this.deleteThisGoal()} className="btn btn-danger">
          <i className="fa fa-trash" aria-hidden="true"></i> Delete Goal
        </a>
        {this.state.alert}
      </div>
    );
  }
}
