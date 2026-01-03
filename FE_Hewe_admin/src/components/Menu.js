import React, { Component } from "react";

import onClickOutside from "react-onclickoutside";

class IconMenu extends Component {
  state = {
    show: false,
  };
  componentDidMount() {
    window.addEventListener("scroll", this.handleScroll);
  }
  componentWillUnmount() {
    window.removeEventListener("scroll", this.handleScroll);
  }
  handleScroll = (event) => {
    if (this.state.show) this.setState({ show: false });
  };
  handleClickOutside = (evt) => {
    this.setState({
      show: false,
    });
  };
  render() {
    const { show } = this.state;

    return (
      <li className="user_btns" onClick={() => this.setState({ show: !show })}>
        <div className="user_btn">
          <div className="user_icon">
            {!this.props.userIcon ? (
              <span className="user_prefix">{this.props.name.slice(0, 1)}</span>
            ) : (
              <img src={this.props.userIcon} />
            )}

            <i className="fa fa-chevron-down" aria-hidden="true"></i>
          </div>
        </div>
        {show ? this.props.children : null}
      </li>
    );
  }
}
export default onClickOutside(IconMenu);
