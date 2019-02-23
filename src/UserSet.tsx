import * as React from 'react';

/**
 * React Props
 */
interface IUserSetProps {
  /**
   * Sets the users information from github username
   *
   * @param user Type: string - username for github
   */
  setUserInfo: (user: string) => void;
}

/**
 * React States
 */
interface IUserSetStates {
  /**
   * Text in the input box
   *
   * @type string
   */
  inputBox: string;
}

export class UserSet extends React.Component<IUserSetProps, IUserSetStates> {
  /**
   * Constructor
   *
   * @param props React props
   */
  constructor(props: IUserSetProps) {
    super(props);
    this.state = { inputBox: '' };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  /**
   * React render function
   */
  render() {
    return (
      <div className="card" style={this.styles.card}>
        <label style={this.styles.label}>Enter GitHub Username</label>
        <input
          type="text"
          className="form-control form-control-sm"
          style={this.styles.field}
          placeholder="Name"
          onChange={this.handleInputChange}
          onKeyPress={this.handleKeyPress}
        />
        <div style={{ float: 'right' }}>
          <button
            className={'commentCommentButton commentFooterRightButton'}
            style={{ marginLeft: '0px' }}
            type="button"
            onClick={this.handleSubmit}
          >
            Enter
          </button>
        </div>
      </div>
    );
  }

  // TODO: Get correct type
  /**
   * Handles when the comment box changes
   *
   * @param e Type: any - input box event
   */
  handleInputChange(e: any): void {
    this.setState({ inputBox: e.target.value });
  }

  /**
   * Handles key events
   *
   * @param e Type: ? - keyboard event
   */
  handleKeyPress(e: any): void {
    if (e.key === 'Enter' && !e.shiftKey) {
      this.handleSubmit();
    }
  }

  /**
   * Handles submit
   */
  handleSubmit(): void {
    this.props.setUserInfo(this.state.inputBox);
  }

  /**
   * Bootstrap classNames
   */
  bsc = {
    input: 'form-control form-control-sm'
  };

  /**
   * CSS styles
   */
  styles = {
    card: {
      paddinTop: '8px',
      paddingBottom: '4px',
      paddingLeft: '12px',
      paddingRight: '12px',
      fontSize: 'var(--jp-ui-font-size1)',
      fontFamily: 'helvetica',
      border: 'unset'
    },
    field: {
      marginBottom: '5px',
      paddingLeft: '12px',
      paddingRight: '12px'
    },
    label: {
      paddingTop: '5px',
      marginBottom: '5px'
    }
  };
}
