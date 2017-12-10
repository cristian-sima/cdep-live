// @flow


type CaptchaPropTypes = {
  type: string;
  id: string;
  input: any;
  label: string;
  autoFocus?: boolean;
  meta: {
    touched: boolean;
    error?: any;
    submitting: boolean;
  }
};

type InfoIconStateTypes = {
  showTooltip: boolean;
};


import React from "react";
import { Tooltip } from "reactstrap";
import classnames from "classnames";

class InfoIcon extends React.Component<InfoIconStateTypes> {

  state: InfoIconStateTypes;

  toggle: () => void;

  constructor (props) {
    super(props);

    this.state = {
      showTooltip: false,
    };

    this.toggle = () => {
      this.setState((prevState : InfoIconStateTypes) => ({
        showTooltip: !prevState.showTooltip,
      }));
    };
  }


  render () {
    return (
      <div className="d-inline float-right">
        <i
          className="fa fa-info-circle fa-2x text-info pull-right"
          id="TooltipExample"
        />
        <Tooltip
          isOpen={this.state.showTooltip}
          placement="right"
          target="TooltipExample"
          toggle={this.toggle}>
          {`Scopul acestei verificări este de a deosebi o personă de un robot.
          De obicei, acest cod apare atunci cand se fololește excesiv
          o functionalitate din aplicație`}
        </Tooltip>
      </div>
    );
  }
}

const Captcha = (props : CaptchaPropTypes) => {
  const {
    autoFocus,
    id,
    input,
    label,
    meta: { touched, error, submitting },
    type,
  } = props;

  if (id === "") {
    return null;
  }

  return (
    <div className={classnames("form-group text-left row", {
      "has-warning": touched && error,
    })}>
      <hr />
      <label
        className="col-md-4 text-md-right form-control-label"
        htmlFor={input.name}>
        {"Verificare "}
        <InfoIcon />
      </label>
      <div className="col-md-8">
        <div className="custom-class">
          <span className="custom-control-description text-muted">
            {"Tastează numere din imaginea de mai jos"}
          </span>
          <div className="text-center my-1">
            <img
              alt="Captcha"
              src={`/captcha/${id}.png`}
            />
          </div>
        </div>
        <input
          {...input}
          aria-label={label}
          autoFocus={autoFocus}
          className={classnames("form-control", {
            "form-control-warning": touched && error,
          })}
          disabled={submitting}
          id={input.name}
          placeholder="Tastează numerele"
          type={type}
        />
        <div className="form-control-feedback">
          {
            touched && error ? (
              <span>{error}</span>
            ) : null
          }
        </div>
      </div>
    </div>
  );
};


export default Captcha;
