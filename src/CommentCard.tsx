import * as React from 'react';

// Components
import { CommentHeader } from './CommentHeader';
import { CommentBody } from './CommentBody';
import { CommentFooter } from './CommentFooter';
import { Comment } from './Comment';

/**
 * React Props interface
 */
interface ICommentCardProps {
  /**
   * Comment thread data
   * @type any
   */
  data?: any;
  /**
   * Unique string to identify a card
   * @type string
   */
  cardId: string;
  /**
   * Function to set the state of the current expanded card in "App.tsx"
   * @param cardId - string: Card unique id
   */
  setExpandedCard: (cardId: string) => void;
  /**
   * Function to check if the given cardID is the current expanded card
   *
   * @param cardId - string: Card unique id
   * @return boolean: true if card is expanded, false if not
   */
  getExpandedCard: (cardId: string) => boolean;
}

/**
 * React States interface
 */
interface ICommentCardStates {
  /**
   * State for if the reply box is active
   *
   * @type boolean
   */
  replyActive?: boolean;
}

/**
 * CommentCard React Component
 */
export class CommentCard extends React.Component<
  ICommentCardProps,
  ICommentCardStates
> {
  /**
   * Constructor
   *
   * @param props React Props
   */
  constructor(props: any) {
    super(props);
    this.state = {
      replyActive: false
    };

    // Functions to bind(this)
    this.handleExpand = this.handleExpand.bind(this);
    this.handleShrink = this.handleShrink.bind(this);
    this.handleReplyActive = this.handleReplyActive.bind(this);
    this.expandAndReply = this.expandAndReply.bind(this);
    this.getAllComments = this.getAllComments.bind(this);
    this.getCommentHeader = this.getCommentHeader.bind(this);
    this.getCommentFooter = this.getCommentFooter.bind(this);
  }

  /**
   * React render function
   */
  render() {
    return (
      <div className={this.bsc.card} style={this.styles.card}>
        <div className={this.bsc.cardHeader} style={this.styles.cardHeading}>
          {this.getCommentHeader()}
        </div>
        <div className={this.bsc.cardBody} style={this.styles.cardBody}>
          <CommentBody comments={this.getAllComments()} />
        </div>
        <div className={this.bsc.cardFooter} style={this.styles.cardFooter}>
          {this.getCommentFooter()}
        </div>
      </div>
    );
  }

  /**
   * Handle a CommentCard expanding
   */
  handleExpand() {
    this.props.setExpandedCard(this.props.cardId);
    if (this.state.replyActive) {
      this.handleReplyActive();
    }
  }

  /**
   * Handles a CommentCard shrinking
   */
  handleShrink() {
    this.props.setExpandedCard(' ');
    if (this.state.replyActive) {
      this.handleReplyActive();
    }
  }

  /**
   * Handles the state of this.state.replyActive.
   * Changes the state to the opposite boolean
   */
  handleReplyActive() {
    this.setState({ replyActive: !this.state.replyActive });
  }

  /**
   * Handles expanding and opening the reply box
   */
  expandAndReply() {
    this.handleReplyActive();
    this.handleExpand();
  }

  /**
   * Creates a Comment component for each comment in the this.props.data
   *
   * @return React.ReactNode[]: List of Comment ReactNodes / Components
   */
  getAllComments(): React.ReactNode[] {
    let comments: React.ReactNode[] = [];
    let allComments: any = this.props.data['allComments'];

    if (this.props.data !== undefined) {
      for (let key in allComments) {
        comments.push(
          <Comment
            name={allComments[key].name}
            context={allComments[key].context}
            timestamp={allComments[key].timestamp}
            photo={allComments[key].photoMain}
            expanded={this.props.getExpandedCard(this.props.cardId)}
          />
        );
      }
    }
    return comments;
  }

  /**
   * Creates and returns the CommentHeader Component.
   * This is the top comment of a thread / card
   *
   * @return React.ReactNode: CommentHeader ReactNode / Component
   */
  getCommentHeader(): React.ReactNode {
    return (
      <CommentHeader
        name={this.props.data['startComment'].name}
        context={this.props.data['startComment'].context}
        timestamp={this.props.data['startComment'].timestamp}
        photo={this.props.data['startComment'].photoMain}
        tag={this.props.data['startComment'].tag}
        expanded={this.props.getExpandedCard(this.props.cardId)}
        handleExpand={this.handleExpand}
        handleShrink={this.handleShrink}
      />
    );
  }

  /**
   * Creates and returns the CommentFooter Component
   * This is the bottom / footer section of a CommentCard
   *
   * @return React.ReactNode: CommentFooter ReactNode / Component
   */
  getCommentFooter(): React.ReactNode {
    return (
      <CommentFooter
        expanded={this.props.getExpandedCard(this.props.cardId)}
        replyActive={this.state.replyActive}
        handleReplyActive={this.handleReplyActive}
        expandAndReply={this.expandAndReply}
      />
    );
  }

  /**
   * Bootstrap style classNames
   */
  bsc = {
    card: 'card',
    cardHeader: 'card-header border-bottom-0',
    cardBody: 'card-body border-bottom-0',
    cardFooter: 'card-footer border-top-0'
  };

  /**
   * CSS styles
   */
  styles = {
    card: {
      marginBottom: '5px',
      background: 'white'
    },
    cardHeading: {
      padding: '0px',
      background: 'white'
    },
    cardBody: {
      padding: '0px',
      background: 'white'
    },
    cardFooter: {
      padding: '0px',
      paddingBottom: '5px',
      background: 'white'
    }
  };
}
