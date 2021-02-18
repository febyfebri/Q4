import React, { Component } from "react";
import PropTypes from "prop-types";
import axios from "axios";

import PopupWindow from "./popup";
import { toQuery } from "./utils";

class GitHubLogin extends Component {
  static propTypes = {
    buttonText: PropTypes.string,
    children: PropTypes.node,
    className: PropTypes.string,
    clientId: PropTypes.string.isRequired,
    onRequest: PropTypes.func,
    onSuccess: PropTypes.func,
    onFailure: PropTypes.func,
    redirectUri: PropTypes.string,
    scope: PropTypes.string,
  };

  static defaultProps = {
    buttonText: "Sign in with GitHub",
    redirectUri: "http://localhost:3000/",
    scope: "user:email",
    onRequest: () => {},
    onSuccess: () => {},
    onFailure: () => {},
  };

  onBtnClick = () => {
    const { clientId, scope, redirectUri } = this.props;
    const search = toQuery({
      client_id: clientId,
      scope,
      redirect_uri: redirectUri,
    });
    const popup = (this.popup = PopupWindow.open(
      "github-oauth-authorize",
      `https://github.com/login/oauth/authorize?${search}`,
      { height: 1000, width: 600 }
    ));

    this.onRequest();
    popup.then(
      (data) => this.onSuccess(data),
      (error) => this.onFailure(error)
    );
  };

  onRequest = () => {
    this.props.onRequest();
  };

  onSuccess = (data) => {
    console.log('data from on succes',data)
    // di ganti menjadi data.code karena yang di butuhkan cuma code
    if (!data.code) {
      return this.onFailure(new Error("'code' not found"));
    }

    this.onGetAccessToken(data.code);
  };

  onFailure = (error) => {
    this.props.onFailure(error);
  };

  onGetAccessToken = (code) => {
    const { clientId, clientSecret } = this.props;
    const body = {
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri:"http://localhost:3000/",
      state: "name",
      code: code,
    };
    console.log("code", code)
    const options = { headers: { accept: "application/json"} };
    axios
    // bypass cors github menggunkaan cors anywhere
      .post(`https://cors-anywhere.herokuapp.com/https://github.com/login/oauth/access_token`, body, options)
      .then((access_token) => {
        console.log(access_token)
        this.onGetProfile(access_token.data.access_token);
      })
      .catch((err) => this.onFailure(err.message));
  };

  onGetProfile = (token) => {
    axios({
      method: "get",
      url: `https://api.github.com/user`,
      headers: {
        Authorization: "token " + token,
      },
    }).then((response) => {
      console.log("responnya : ", response)
      this.props.onSuccess(response.data.name);
    });
  };

  render() {
    const { className, buttonText, children } = this.props;
    const attrs = { onClick: this.onBtnClick };

    if (className) {
      attrs.className = className;
    }

    return <button {...attrs}>{children || buttonText}</button>;
  }
}

export default GitHubLogin;