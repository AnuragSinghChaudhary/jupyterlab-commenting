import * as React from 'react';

/**
 * React Props interface
 */
interface ICommentFooterProps {
  /**
   * Tracks if card is expanded
   * @type boolean
   */
  expanded: boolean;
  /**
   * Is the card resolved
   * @type boolean
   */
  resolved: boolean;
  /**
   * Tracks if the reply box is active
   * @type boolean
   */
  replyActive: boolean;
  /**
   * Function to call to parent component to handle reply active
   * @type VoidFunction
   */
  handleReplyActive: VoidFunction;
  /**
   * Function to call to parent component to handle expanding and opening the reply box
   * @type VoidFunction
   */
  expandAndReply: VoidFunction;
  /**
   * Passes comment message to putComment in App.tsx
   *
   * @param comment Type: string - comment message
   * @type void function
   */
  getInput: (comment: string) => void;
}

/**
 * React States interface
 */
interface ICommentFooterStates {
  commentBox: string;
}

/**
 * CommentFooter React Component
 */
export class CommentFooter extends React.Component<
  ICommentFooterProps,
  ICommentFooterStates
> {
  /**
   * Constructor
   *
   * @param props React props
   */
  constructor(props: any) {
    super(props);
    this.state = {
      commentBox: ''
    };

    this.handleChangeCommentBox = this.handleChangeCommentBox.bind(this);
    this.handleCommentButton = this.handleCommentButton.bind(this);
  }

  /**
   * React render function
   */
  render() {
    return (
      <div className={this.bsc.buttonArea} style={this.styles.footerArea}>
        <div>
          {this.props.expanded &&
            this.props.replyActive && (
              <textarea
                className={this.bsc.input}
                style={this.styles.replyBox}
                id={'commentBox'}
                value={this.state.commentBox}
                onChange={this.handleChangeCommentBox}
              />
            )}
        </div>
        <div>
          <div style={this.styles.buttonArea}>{this.getButtons()}</div>
        </div>
      </div>
    );
  }

  /**
   * Returns the correct buttons for different state combinations
   *
   * @return Type: React.ReactNode - JSX with buttons
   */
  getButtons(): React.ReactNode {
    if (this.props.expanded && this.props.replyActive && !this.props.resolved) {
      return (
        <div>
          {this.getCommentButton()}
          {this.getCancelButton()}
        </div>
      );
    } else if (
      this.props.expanded &&
      !this.props.replyActive &&
      !this.props.resolved
    ) {
      return <div>{this.getReplyAndExpandButton()}</div>;
    } else if (
      !this.props.expanded &&
      !this.props.replyActive &&
      !this.props.resolved
    ) {
      return (
        <div>
          {this.getReplyAndExpandButton()}
          {this.getResolveButton()}
        </div>
      );
    } else if (
      this.props.expanded &&
      !this.props.replyActive &&
      this.props.resolved
    ) {
      return <div>{this.getReopenButton()}</div>;
    } else if (
      !this.props.expanded &&
      !this.props.replyActive &&
      this.props.resolved
    ) {
      return <div>{this.getReopenButton()}</div>;
    } else if (
      this.props.expanded &&
      this.props.replyActive &&
      this.props.resolved
    ) {
      return (
        <div>
          {this.getCommentButton()}
          {this.getCancelButton()}
        </div>
      );
    } else if (
      !this.props.expanded &&
      this.props.replyActive &&
      !this.props.resolved
    ) {
      return (
        <div>
          {this.getReplyAndExpandButton()}
          {this.getResolveButton()}
        </div>
      );
    }
  }

  // TODO: Get correct type
  /**
   * Handles when the comment box changes
   * @param event Type: any - input box event
   */
  handleChangeCommentBox(event: any): void {
    this.setState({ commentBox: event.target.value });
  }

  /**
   * Handles clicking the comment button
   */
  handleCommentButton(): void {
    this.props.getInput(this.state.commentBox);
  }

  /**
   * Creates and returns a button to handle expanding and replying
   * @return Type: React.ReactNode
   */
  getReplyAndExpandButton(): React.ReactNode {
    return (
      <button
        className={'commentFooterRightButton float-right'}
        type="button"
        onClick={this.props.expandAndReply}
      >
        Reply
      </button>
    );
  }

  /**
   * Creates and returns re-open button
   * @return Type: React.ReactNode
   */
  getReopenButton(): React.ReactNode {
    return (
      <button className={'commentFooterRightButton float-right'} type="button">
        Re-open
      </button>
    );
  }

  /**
   * Creates and returns resolve button
   * @return Type: React.ReactNode
   */
  getResolveButton(): React.ReactNode {
    return (
      <button className="commentFooterLeftButton float-right" type="button">
        Resolve
      </button>
    );
  }

  /**
   * Creates and returns reply button
   * @return Type: React.ReactNode
   */
  getCommentButton(): React.ReactNode {
    return (
      <button
        className="commentCommentButton commentFooterRightButton float-right"
        type="button"
        onClick={this.handleCommentButton}
      >
        Comment
      </button>
    );
  }

  /**
   * Creates and returns cancel button
   * @return Type: React.ReactNode
   */
  getCancelButton(): React.ReactNode {
    return (
      <button
        onClick={this.props.handleReplyActive}
        className="commentCancelButton commentFooterLeftButton float-right"
        type="button"
      >
        Cancel
      </button>
    );
  }

  /**
   * Bootstrap classNames
   */
  bsc = {
    buttonArea: 'col',
    input: 'form-control form-control-sm'
  };

  /**
   * CSS styles
   */
  styles = {
    footerArea: {
      marginBottom: '5px',
      paddingLeft: '5px',
      paddingRight: '5px',
      paddingTop: '0px',
      paddingBottom: '0px',
      background: 'white'
    },
    buttonArea: {
      marginRight: '5px',
      marginTop: '8px'
    },
    replyBox: {
      width: '100%',
      height: '80px',
      lineHeight: 'normal',
      marginTop: '8px'
    }
  };
}
