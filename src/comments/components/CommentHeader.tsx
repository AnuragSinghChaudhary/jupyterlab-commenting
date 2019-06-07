import * as React from 'react';

/**
 * React Props interface
 */
interface ICommentHeaderProps {
  /**
   * Text comment to display
   *
   * @type string
   */
  context: string;
  /**
   * State if the comment is edited
   *
   * @type boolean
   */
  edited: boolean;
  /**
   * Tracks the state if the card is expanded
   *
   * @type boolean
   */
  expanded: boolean;
  /**
   * Function to handle the CommentCard expanding
   *
   * @type void
   */
  handleExpand: () => void;
  /**
   * Reverses resolve state
   *
   * @type: void
   */
  handleResolve: () => void;
  /**
   * Handles expanding
   *
   * @type void
   */
  handleShouldExpand: (state: boolean) => void;
  /**
   * Function to handle the CommentCard shrinking
   *
   * @type void
   */
  handleShrink: () => void;
  /**
   * Tracks if cursor is hovering over card
   *
   * @type boolean
   */
  hover: boolean;
  /**
   * State if is editing a comment
   *
   * @param key Type: string - key of what is being edited,
   * for comment header it is the threadID
   */
  isEditing(key: string): boolean;
  /**
   * Person name of comment
   *
   * @type string
   */
  name: string;
  /**
   * URL to Person photo to display
   *
   * @type string
   */
  photo: string;
  /**
   * Updates the comment value of a thread
   */
  putThreadEdit(threadId: string, value: string): void;
  /**
   * Is the card resolved
   *
   * @type boolean
   */
  resolved: boolean;
  /**
   * Handles setting the state of isEditing
   *
   * @param key Type: string - sets the state to the given key (threadId)
   */
  setIsEditing(key: string): void;
  /**
   * Time stamp of comment
   *
   * @type string
   */
  timestamp: string;
  /**
   * Id of the thread
   *
   * @type string
   */
  threadId: string;
}

/**
 * CommentHeader React States
 */
interface ICommentHeaderStates {
  /**
   * State of drop down menu
   */
  moreOptionsOpened: boolean;
  /**
   * Text of the edit box
   */
  editBox: string;
  /**
   * Tracks if the comment was edited when the edit button is clicked
   */
  contextEdited: boolean;
  /**
   * Boolean to track if mouse is hovering over comment
   */
  hover: boolean;
}

/**
 * CommentHeader React Component
 */
export class CommentHeader extends React.Component<
  ICommentHeaderProps,
  ICommentHeaderStates
> {
  /**
   * Constructor
   *
   * @param props React props
   */
  constructor(props: ICommentHeaderProps) {
    super(props);

    this.state = {
      moreOptionsOpened: false,
      editBox: '',
      hover: false,
      contextEdited: false
    };

    this.handleChangeEditBox = this.handleChangeEditBox.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.handleEditCancelButton = this.handleEditCancelButton.bind(this);
    this.handleEditSaveButton = this.handleEditSaveButton.bind(this);
  }

  /**
   * React render function
   */
  render(): React.ReactNode {
    return this.props.resolved ? (
      <div style={this.styles['jp-commenting-thread-header-resolved']}>
        <div
          style={this.styles['jp-commenting-thread-header-upper-area-resolved']}
        >
          <div style={this.styles['jp-commenting-thread-header-photo-area']}>
            <img
              style={this.styles['jp-commenting-thread-header-photo-resolved']}
              src={this.props.photo}
            />
          </div>
          <div style={this.styles['jp-commenting-thread-header-info-area']}>
            <div style={this.styles['jp-commenting-thread-header-name-area']}>
              <h1
                style={this.styles['jp-commenting-thread-header-name-resolved']}
              >
                {this.props.name}
              </h1>
            </div>
            <div
              style={this.styles['jp-commenting-thread-header-timestamp-area']}
            >
              <p
                style={
                  this.styles['jp-commenting-thread-header-timestamp-resolved']
                }
              >
                {(this.props.edited &&
                  'Edited on: ' + this.getStyledTimeStamp()) ||
                  this.getStyledTimeStamp()}
              </p>
            </div>
          </div>
          {this.getCornerButton()}
        </div>
        <div style={this.styles['jp-commenting-annotation-area-resolved']}>
          <p style={this.styles['jp-commenting-annotation-resolved']}>
            {this.props.context.length >= 125 && !this.props.expanded
              ? this.props.context.slice(0, 125) + '...'
              : this.props.context}
          </p>
        </div>
      </div>
    ) : (
      <div
        style={this.styles['jp-commenting-thread-header']}
        onMouseOver={() => this.handleMouseOver()}
        onMouseLeave={() => this.handleMouseLeave()}
      >
        <div style={this.styles['jp-commenting-thread-header-upper-area']}>
          <div style={this.styles['jp-commenting-thread-header-photo-area']}>
            <img
              style={this.styles['jp-commenting-thread-header-photo']}
              src={this.props.photo}
            />
          </div>
          <div style={this.styles['jp-commenting-thread-header-info-area']}>
            <div style={this.styles['jp-commenting-thread-header-name-area']}>
              <h1 style={this.styles['jp-commenting-thread-header-name']}>
                {this.props.name}
              </h1>
            </div>
            <div
              style={this.styles['jp-commenting-thread-header-timestamp-area']}
            >
              <p style={this.styles['jp-commenting-thread-header-timestamp']}>
                {(this.props.edited &&
                  'Edited on: ' + this.getStyledTimeStamp()) ||
                  this.getStyledTimeStamp()}
              </p>
              {this.state.hover &&
                !this.props.isEditing(this.props.threadId) &&
                this.props.expanded && (
                  <div
                    style={this.styles['jp-commenting-annotation-more-area']}
                  >
                    <p style={this.styles['jp-commenting-annotation-more']}>
                      •
                    </p>
                    <a
                      style={this.styles['jp-commenting-annotation-more']}
                      className={'jp-commenting-clickable-text'}
                      onClick={() => {
                        this.setState({ editBox: '' });
                        this.props.setIsEditing(this.props.threadId);
                      }}
                    >
                      Edit
                    </a>
                  </div>
                )}
            </div>
          </div>
          {this.getCornerButton()}
        </div>
        <div style={this.styles['jp-commenting-annotation-area']}>
          {this.props.isEditing(this.props.threadId) && this.props.expanded ? (
            <textarea
              className="jp-commenting-text-area"
              id="editBox"
              value={
                this.state.editBox.trim() === ''
                  ? this.state.contextEdited
                    ? this.state.editBox
                    : this.props.context
                  : this.state.editBox
              }
              onChange={this.handleChangeEditBox}
              onKeyPress={this.handleKeyPress}
            />
          ) : (
            <p style={this.styles['jp-commenting-annotation']}>
              {this.props.context.length >= 125 && !this.props.expanded
                ? this.props.context.slice(0, 125) + '...'
                : this.props.context}
            </p>
          )}
          {this.getEditButtons()}
        </div>
      </div>
    );
  }

  /**
   * Creates and returns resolve button
   *
   * @return Type: React.ReactNode
   */
  getResolveButton(): React.ReactNode {
    return (
      <button
        className="jp-commenting-button-blue"
        type="button"
        onClick={this.props.handleResolve}
        onMouseEnter={() => this.props.handleShouldExpand(false)}
        onMouseLeave={() => this.props.handleShouldExpand(true)}
      >
        Resolve
      </button>
    );
  }

  /**
   * Creates and returns re-open button
   *
   * @type Type: React.ReactNode
   */
  getReopenButton(): React.ReactNode {
    return (
      <button
        className="jp-commenting-button-blue jp-commenting-button-resolved"
        type="button"
        onClick={this.props.handleResolve}
        onMouseEnter={() => this.props.handleShouldExpand(false)}
        onMouseLeave={() => this.props.handleShouldExpand(true)}
      >
        Re-open
      </button>
    );
  }

  /**
   * Handles key events
   *
   * @param e Type: React.KeyboardEvent - keyboard event
   */
  handleKeyPress(e: React.KeyboardEvent): void {
    // Enables pressing enter key to save a comment
    if (this.state.editBox.trim() !== '' && e.key === 'Enter' && !e.shiftKey) {
      this.handleEditSaveButton();
      document.getElementById('commentBox').blur();
    }
  }

  /**
   * Handles when the edit box changes
   *
   * @param e Type: React.ChangeEvent<HTMLTextAreaElement> - input box event
   */
  handleChangeEditBox(e: React.ChangeEvent<HTMLTextAreaElement>): void {
    this.setState({ editBox: e.target.value, contextEdited: true });
  }

  /**
   * Handles clicking the save button
   */
  handleEditSaveButton(): void {
    this.props.putThreadEdit(this.props.threadId, this.state.editBox);
    this.setState({ editBox: '', contextEdited: false });
    this.props.setIsEditing('');
  }

  /**
   * Handles states when cancel is pressed
   */
  handleEditCancelButton(): void {
    this.setState({ editBox: '', contextEdited: false });
    this.props.setIsEditing('');
  }

  /**
   * Returns the correct buttons for different state combinations
   *
   * @return Type: React.ReactNode - JSX with buttons
   */
  getEditButtons(): React.ReactNode {
    if (this.props.isEditing(this.props.threadId) && this.props.expanded) {
      let element = document.getElementById('editBox') as HTMLTextAreaElement;
      if (element !== null) {
        // Focus editbox and set cursor to the end
        element.focus();
        element.setSelectionRange(element.value.length, element.value.length);
      }
      return (
        <div
          style={this.styles['jp-commenting-thread-header-edit-buttons-area']}
        >
          {this.getEditSaveButton()}
          {this.getEditCancelButton()}
        </div>
      );
    }
  }

  /**
   * Creates and returns save button
   *
   * @return Type: React.ReactNode
   */
  getEditSaveButton(): React.ReactNode {
    return (
      <button
        onClick={this.handleEditSaveButton}
        className="jp-commenting-button-blue"
        type="button"
        disabled={this.state.editBox.trim() === ''}
      >
        Save
      </button>
    );
  }

  /**
   * Creates and returns cancel button
   *
   * @return Type: React.ReactNode
   */
  getEditCancelButton(): React.ReactNode {
    return (
      <button
        onClick={this.handleEditCancelButton}
        className="jp-commenting-button-red"
        type="button"
      >
        Cancel
      </button>
    );
  }

  /**
   * Handles hover state when mouse is over comment header
   */
  handleMouseOver(): void {
    this.setState({ hover: true });
  }

  /**
   * Handles hover state when mouse leaves comment header
   */
  handleMouseLeave(): void {
    this.setState({ hover: false });
  }

  /**
   * Creates and returns the resolve or re-open button based on states
   *
   * @type React.ReactNode
   */
  getCornerButton(): React.ReactNode {
    if (this.props.hover && !this.props.expanded) {
      return (
        <div style={this.styles['jp-commenting-thread-header-button-area']}>
          <div
            style={
              this.styles[
                'jp-commenting-thread-header-resolve-reopen-button-area'
              ]
            }
          >
            {!this.props.resolved
              ? this.getResolveButton()
              : this.getReopenButton()}
          </div>
        </div>
      );
    } else if (this.props.expanded) {
      return (
        <div style={this.styles['jp-commenting-thread-header-button-area']}>
          <div
            style={
              this.styles[
                'jp-commenting-thread-header-resolve-reopen-button-area'
              ]
            }
          >
            {!this.props.resolved
              ? this.getResolveButton()
              : this.getReopenButton()}
          </div>
        </div>
      );
    } else {
      return;
    }
  }

  /**
   * Styles and returns timestamp
   *
   * @type string
   */
  getStyledTimeStamp(): string {
    let serverTimeStamp = new Date(this.props.timestamp);
    let localTimeStamp = serverTimeStamp.toLocaleString();
    let fullDate = localTimeStamp.split(',')[0].split('/');
    let fullTime = localTimeStamp.split(',')[1].split(':');
    let timeIdentifier = fullTime[2].slice(3).toLowerCase();

    let month: { [key: string]: String } = {
      '1': 'Jan',
      '2': 'Feb',
      '3': 'Mar',
      '4': 'Apr',
      '5': 'May',
      '6': 'Jun',
      '7': 'Jul',
      '8': 'Aug',
      '9': 'Sep',
      '10': 'Oct',
      '11': 'Nov',
      '12': 'Dec'
    };
    let timestamp =
      month[fullDate[0]] +
      ' ' +
      fullDate[1] +
      fullTime[0] +
      ':' +
      fullTime[1] +
      timeIdentifier;
    return timestamp;
  }

  /**
   * CSS styles
   */
  styles = {
    'jp-commenting-thread-header': {
      background: 'var(--jp-layout-color1)'
    },
    'jp-commenting-thread-header-resolved': {
      background: 'var(--jp-layout-color2)'
    },
    'jp-commenting-thread-header-upper-area': {
      display: 'flex',
      flexDirection: 'row' as 'row',
      boxSizing: 'border-box' as 'border-box',
      padding: '4px',
      background: 'var(--jp-layout-color1)'
    },
    'jp-commenting-thread-header-upper-area-resolved': {
      display: 'flex',
      flexDirection: 'row' as 'row',
      boxSizing: 'border-box' as 'border-box',
      padding: '4px',
      background: 'var(--jp-layout-color2)'
    },
    'jp-commenting-thread-header-info-area': {
      display: 'flex',
      flexDirection: 'column' as 'column',
      flexShrink: 1,
      minWidth: '32px',
      width: '100%',
      paddingLeft: '4px',
      boxSizing: 'border-box' as 'border-box'
    },
    'jp-commenting-thread-header-photo-area': {
      display: 'flex'
    },
    'jp-commenting-thread-header-photo': {
      height: '36px',
      width: '36px',
      borderRadius: 'var(--jp-border-radius)'
    },
    'jp-commenting-thread-header-photo-resolved': {
      height: '36px',
      width: '36px',
      opacity: 0.5,
      borderRadius: 'var(--jp-border-radius)'
    },
    'jp-commenting-thread-header-name-area': {
      display: 'flex',
      flexShrink: 1,
      minWidth: '32px',
      boxSizing: 'border-box' as 'border-box'
    },
    'jp-commenting-thread-header-name': {
      fontSize: '13px',
      color: 'var(--jp-ui-font-color1)',
      fontWeight: 'bold' as 'bold',
      whiteSpace: 'nowrap' as 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      margin: '0px'
    },
    'jp-commenting-thread-header-edit-buttons-area': {
      display: 'flex',
      padding: '4px'
    },
    'jp-commenting-thread-header-name-resolved': {
      fontSize: '13px',
      color: 'var(--jp-ui-font-color2)',
      fontWeight: 'bold' as 'bold',
      whiteSpace: 'nowrap' as 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      margin: '0px'
    },
    'jp-commenting-thread-header-timestamp-area': {
      display: 'flex',
      minWidth: '32px',
      flexShrink: 1,
      boxSizing: 'border-box' as 'border-box'
    },
    'jp-commenting-thread-header-timestamp': {
      fontSize: 'var(--jp-ui-font-size0)',
      color: 'var(--jp-ui-font-color1)',
      whiteSpace: 'nowrap' as 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis'
    },
    'jp-commenting-annotation-more-area': {
      display: 'flex',
      flexDirection: 'row' as 'row',
      minWidth: '64px',
      flexShrink: 1,
      boxSizing: 'border-box' as 'border-box'
    },
    'jp-commenting-annotation-more': {
      display: 'flex',
      fontSize: 'var(--jp-ui-font-size0)',
      paddingLeft: '4px',
      color: 'var(--jp-ui-font-color1)'
    },
    'jp-commenting-thread-header-timestamp-resolved': {
      fontSize: 'var(--jp-ui-font-size0)',
      color: 'var(--jp-ui-font-color2)',
      whiteSpace: 'nowrap' as 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis'
    },
    'jp-commenting-annotation-area': {
      display: 'flex',
      flexDirection: 'column' as 'column',
      maxHeight: '100%',
      maxWidth: '350px',
      boxSizing: 'border-box' as 'border-box',
      paddingBottom: '4px',
      paddingLeft: '4px',
      paddingRight: '4px',
      background: 'var(--jp-layout-color1)'
    },
    'jp-commenting-annotation': {
      fontSize: 'var(--jp-content-font-size0)',
      color: 'var(--jp-ui-font-color1)',
      lineHeight: 'normal'
    },
    'jp-commenting-annotation-area-resolved': {
      display: 'flex',
      maxHeight: '100%',
      maxWidth: '350px',
      boxSizing: 'border-box' as 'border-box',
      paddingBottom: '4px',
      paddingLeft: '4px',
      paddingRight: '4px',
      background: 'var(--jp-layout-color2)'
    },
    'jp-commenting-annotation-resolved': {
      fontSize: 'var(--jp-content-font-size0)',
      color: 'var(--jp-ui-font-color2)',
      lineHeight: 'normal'
    },
    'jp-commenting-thread-header-more-icon-area': {
      display: 'flex',
      paddingRight: '4px',
      paddingLeft: '4px',
      boxSizing: 'border-box' as 'border-box'
    },
    'jp-commenting-annotation-more-icon': {
      backgroundSize: '16px',
      margin: '0px',
      minWidth: '16px',
      minHeight: '16px',
      boxSizing: 'border-box' as 'border-box'
    },
    'jp-commenting-thread-header-resolve-reopen-button-area': {
      display: 'flex'
    },
    'jp-commenting-thread-header-button-area': {
      display: 'flex',
      minWidth: '72px',
      maxHeight: '18px',
      paddingRight: '4px',
      paddingLeft: '4px',
      boxSizing: 'border-box' as 'border-box'
    }
  };
}
