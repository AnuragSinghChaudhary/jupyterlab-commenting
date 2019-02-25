import * as React from 'react';

interface INewThreadCardProps {
  /**
   * Function to put comment back to server
   *
   * @param comment Type: string -  the comment to be added
   * @param tag Type: string - category tag / label for thread
   *
   * @type void function
   */
  putThread: (comment?: string) => void;
  /**
   * Sets the state if a new thread is to be created
   *
   * @param state Type: boolean - state to set to
   *
   * @type void function
   */
  setNewThreadActive: (state: boolean) => void;
  creator: any;
}

interface INewThreadCardStates {
  /**
   * Text in the input box
   *
   * @type string
   */
  inputBox: string;
}

export class NewThreadCard extends React.Component<
  INewThreadCardProps,
  INewThreadCardStates
> {
  /**
   * Constructor
   *
   * @param props React props
   */
  constructor(props: INewThreadCardProps) {
    super(props);
    this.state = { inputBox: '' };

    this.handleChangeCommentBox = this.handleChangeCommentBox.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.createNewThread = this.createNewThread.bind(this);
    this.cancelThread = this.cancelThread.bind(this);
  }

  /**
   * React render function
   */
  render() {
    return (
      <div className="threadCreateCard" style={this.styles.card}>
        <label style={this.styles.name}>{this.props.creator.name}</label>
        <textarea
          style={this.styles.inputBox}
          id={'commentBox'}
          value={
            this.state.inputBox.trim() === ''
              ? this.state.inputBox.trim()
              : this.state.inputBox
          }
          onChange={this.handleChangeCommentBox}
          onKeyPress={this.handleKeyPress}
        />
        <div style={this.styles.buttons}>
          {this.getCommentButton()}
          {this.getCancelButton()}
        </div>
      </div>
    );
  }

  componentDidMount() {
    document.getElementById('commentBox').focus();
  }

  getCommentButton(): React.ReactNode {
    return (
      <button
        className={'commentCommentButton commentFooterRightButton float-right'}
        type="button"
        onClick={this.createNewThread}
        disabled={this.state.inputBox.trim() === ''}
      >
        Comment
      </button>
    );
  }

  getCancelButton(): React.ReactNode {
    return (
      <button
        className="commentCancelButton commentFooterLeftButton float-right"
        type="button"
        onClick={this.cancelThread}
      >
        Cancel
      </button>
    );
  }

  // TODO: Get correct type
  /**
   * Handles when the comment box changes
   *
   * @param e Type: any - input box event
   */
  handleChangeCommentBox(e: any): void {
    this.setState({ inputBox: e.target.value });
  }

  createNewThread(): void {
    this.props.setNewThreadActive(false);
    this.props.putThread(this.state.inputBox);
  }

  cancelThread(): void {
    this.setState({ inputBox: '' });
    this.props.setNewThreadActive(false);
  }

  /**
   * Handles key events
   *
   * @param e Type: ? - keyboard event
   */
  handleKeyPress(e: any): void {
    if (this.state.inputBox.trim() !== '' && e.key === 'Enter' && !e.shiftKey) {
      this.createNewThread();
    }
  }

  /**
   * CSS styles
   */
  styles = {
    card: {
      padding: '5px',
      marginTop: '5px'
    },
    field: {
      marginBottom: '5px'
    },
    inputBox: {
      width: '100%',
      height: '80px',
      lineHeight: 'normal'
    },
    name: {
      fontSize: '16px',
      fontWeight: 'bold' as 'bold',
      marginTop: '6px',
      marginBottom: '6px',
      marginLeft: '3px'
    },
    buttons: {
      marginTop: '5px',
      marginRight: '10px'
    }
  };
}
