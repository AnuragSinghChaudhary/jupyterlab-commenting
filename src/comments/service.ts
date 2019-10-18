import { ICommentingServiceConnection } from './service_connection';

/**
 * CommentsService
 *
 * Handles all the interactions with writing comments to commenting.json
 */
export class CommentsService {
  constructor(service: ICommentingServiceConnection) {
    this._service = service;

    // Stores comments in memory
    this._commentsStore = {};

    // Next comment id
    this._nextCommentId = 0;

    this.loadComments();
  }

  /**
   * Creates a new thread in the comments store and writes to commenting.json file
   *
   * @param target Type: string - path of file thread relates to
   * @param value Type: string - initial value of the top comment in the thread
   * @param creator Type: IPerson - object of the creator of the thread
   */
  createThread(
    target: string,
    value: string,
    creator: IPerson,
    indicator?: CommentIndicator
  ): void {
    // Create a new key value pair for the target if it is undefined
    if (!this._commentsStore[target]) {
      this._commentsStore[target] = [];
    }

    let created = new Date().toISOString();

    this._commentsStore[target].push({
      id: 'anno/' + this._nextCommentId,
      total: 1,
      resolved: false,
      indicator: indicator || undefined,
      body: [
        {
          value: value,
          created: created,
          creator: creator,
          edited: false
        }
      ]
    });

    this._nextCommentId++;
  }

  /**
   * Creates a new comment on a thread and writes it to the comments.json file
   *
   * @param target Type: string - path of file thread relates to
   * @param threadId Type: string - unique id of thread comment relates to
   * @param value Type: string - initial value of the top comment in the thread
   * @param creator Type: IPerson - object of the creator of the thread
   */
  createComment(
    target: string,
    threadId: string,
    value: string,
    creator: IPerson
  ): void {
    let thread = this.getThread(target, threadId);
    let created = new Date().toISOString();

    thread.body.push({
      value: value,
      created: created,
      creator: creator,
      edited: false
    });

    thread.total++;
  }

  /**
   * Deletes a comment in a thread
   *
   * @param target Type: string - path of file thread relates to
   * @param threadId Type: string - unique id of thread comment relates to
   * @param index Type: number - index of comment in the thread
   */
  deleteComment(target: string, threadId: string, index: number): void {
    let thread = this.getThread(target, threadId);

    thread.body.splice(index, 1);
    thread.total--;
  }

  /**
   * Sets comment to a new value and saves comments.json
   *
   * @param target Type: string - path of file thread relates to
   * @param threadId Type: string - unique id of thread comment relates to
   * @param value Type: string - new value of comment
   * @param index Type: number - index of comment in the thread
   */
  editComment(
    target: string,
    threadId: string,
    value: string,
    index: number
  ): void {
    let thread = this.getThread(target, threadId);
    let commentBody = thread.body[index];
    let created = new Date().toISOString();

    commentBody.value = value;
    commentBody.edited = true;
    commentBody.created = created;
  }

  /**
   * Sets initial thread comment to a new value and writes to comments.json
   *
   * @param target Type: string - path of file thread relates to
   * @param threadId Type: string - unique id of thread to edit
   * @param value Type: string - initial value of the top comment in the thread
   */
  editThread(target: string, threadId: string, value: string): void {
    let thread = this.getThread(target, threadId);
    let threadBody = thread.body[0];
    let created = new Date().toISOString();

    threadBody.value = value;
    threadBody.edited = true;
    threadBody.created = created;
  }

  /**
   * Sets the resolve state of a thread to the given state and saves the results to comments.json
   *
   * @param target Type: string - path of file thread relates to
   * @param threadId Type: string - unique id of thread to resolve
   * @param state
   */
  setResolvedValue(target: string, threadId: string, state: boolean): void {
    let thread = this.getThread(target, threadId);

    thread.resolved = state;
  }

  /**
   * Returns all indicator values in a key value pair.
   * key: threadId, value CommentIndicator
   *
   * @param target Type: string - path of file indicators relate to
   */
  getAllIndicatorValues(target: string): { [key: string]: CommentIndicator } {
    let threads = this._commentsStore[target];
    let indicators: { [key: string]: CommentIndicator } = {};

    if (threads) {
      threads.forEach(thread => {
        if (thread.indicator && !thread.resolved) {
          indicators[thread.id] = thread.indicator;
        }
      });
    }

    return indicators;
  }

  /**
   * Saves all the given text indicators into the correct place in comments.json file
   *
   * @param target Type: string - path of file indicators are being saved for
   * @param indicators Type: { [key: string]: CommentIndicator } - key value pair of indicators to save
   */
  setAllIndicatorValues(
    target: string,
    indicators: { [key: string]: CommentIndicator }
  ): void {
    Object.keys(indicators).forEach(key => {
      let thread = this.getThread(target, key);
      if (thread.indicator) {
        thread.indicator = indicators[key];
      } else {
        thread['indicator'] = indicators[key];
      }
    });
  }

  /**
   * Returns an array of all threads for the given target
   *
   * @param target Type: string - path of file to get threads for
   * @param sortBy Type:
   */
  getThreadsByTarget(
    target: string,
    sortBy?: string,
    threadIdList?: string[]
  ): Array<ICommentThread> {
    let threads = this._commentsStore[target];

    if (!threads) {
      return [];
    }

    switch (sortBy) {
      case 'latest':
        return this.sortByLatestReply(threads, target);
      case 'date':
        return this.sortByDateCreated(threads, target);
      case 'mostReplies':
        return this.sortByMostReplies(threads, target);
      case 'idList':
        return this.sortByIdList(threads, target, threadIdList);
      default:
        return this.sortByLatestReply(threads, target);
    }
  }

  sortByIdList(
    threads: Array<ICommentThread>,
    target: string,
    threadIdList: Array<string>
  ): Array<ICommentThread> {
    let sorted = new Array<ICommentThread>();
    threads.forEach(thread => {
      threadIdList.forEach(id => {
        if (thread.id === id) {
          sorted.push(thread);
        }
      });
    });
    console.error(sorted, threadIdList, target);
    return sorted;
  }

  /**
   * Returns an array of comment threads sorted by latest reply
   *
   * @param threads Type: Array<ICommentThreads> - comment threads to sort
   * @param target Type: string - path of file threads relate to
   */
  sortByLatestReply(
    threads: Array<ICommentThread>,
    target: string
  ): Array<ICommentThread> {
    let sorted = new Array<ICommentThread>();
    let latestPair: { [key: string]: string } = {};
    let dates: { [key: string]: Array<string> } = {};

    /**
     * Creates an object that has the threadId as the key and an
     * Array of all the dates in a thread as strings.
     */
    threads.forEach(thread => {
      dates[thread.id] = [];
      thread.body.forEach(item => {
        dates[thread.id].push(item.created);
      });
    });

    /**
     * Sorts the array of dates in the 'dates' object and creates
     * the 'latestPair' object which holds the newest date as the key
     * and the related threadId as the value.
     */
    Object.keys(dates).forEach(key => {
      dates[key].sort((a, b) => {
        return new Date(a).getTime() - new Date(b).getTime();
      });
      let latest = dates[key][dates[key].length - 1];
      latestPair[latest] = key;
    });

    /**
     * Sorts the keys of 'latestPair' which is an array of the newest date
     * of each thread. Once the array is sorted by date, the value of 'latestPair'
     * which is the threadId is used to get the thread to add to the return object
     * 'sorted'.
     */
    Object.keys(latestPair)
      .sort((a, b) => {
        return new Date(a).getTime() - new Date(b).getTime();
      })
      .forEach(date => {
        sorted.push(this.getThread(target, latestPair[date]));
      });

    return sorted;
  }

  /**
   * Returns an array of comment threads sorted by initial date the thread was created
   *
   * @param threads Type: Array<ICommentThreads> - comment threads to sort
   * @param target Type: string - path of file threads relate to
   */
  sortByDateCreated(
    threads: Array<ICommentThread>,
    target: string
  ): Array<ICommentThread> {
    let sorted = new Array<ICommentThread>();
    let dateIdPair: { [key: string]: string } = {};

    /**
     * Creates a key value pair of the key as the date the thread was created,
     * and the related value as the threadId.
     */
    threads.forEach(thread => {
      dateIdPair[thread.body[0].created] = thread.id;
    });

    /**
     * Sorts the array of keys, which are dates, and then gets threads by using
     * the sorted array of dates as keys to get the id of the thread which is used to
     * get the thread from the comments store.
     */
    Object.keys(dateIdPair)
      .sort((a, b) => {
        return new Date(a).getTime() - new Date(b).getTime();
      })
      .forEach(date => {
        sorted.push(this.getThread(target, dateIdPair[date]));
      });

    return sorted;
  }

  /**
   * Returns an array of comment threads sorted by most replies in a thread
   *
   * @param threads Type: Array<ICommentThreads> - comment threads to sort
   * @param target Type: string - path of file threads relate to
   */
  sortByMostReplies(
    threads: Array<ICommentThread>,
    target: string
  ): Array<ICommentThread> {
    let sorted = new Array<ICommentThread>();

    /**
     * Creates an Array of threads sorted by their total amount of comments
     */
    sorted = threads.sort((a, b) => {
      return a.total - b.total;
    });

    return sorted;
  }

  saveComments(target: string): void {
    if (!this._commentsStore[target]) {
      return;
    }

    let comments = JSON.stringify({ comments: this._commentsStore[target] });

    this._service
      .query('saveComments/?comments=' + comments + '&target=' + target)
      .catch();
  }

  /**
   * Loads the contents of comments.json into memory
   */
  loadComments(): void {
    console.log('Loading comments...');

    this._service
      .query('getAllComments/')
      .then(response => response.json())
      .then(comments => {
        Object.keys(comments['comments']).forEach(target => {
          comments.comments[target].forEach(thread => {
            // Parse body json string into json object
            thread['body'] = JSON.parse(thread['body']);

            // If there is an indicator parse json string into json object
            if (thread['indicator']) {
              thread['indicator'] = JSON.parse(thread['indicator']);
            }
          });
        });
        this._commentsStore = comments.comments;

        Object.keys(this._commentsStore).forEach(key => {
          this._nextCommentId += this._commentsStore[key].length;
        });
      })
      .catch(e => console.error('error loading comments', e));
  }

  /**
   * @returns Type: string - returns the id of the newest comment thread
   */
  getLatestCommentId(): string {
    return 'anno/' + this._nextCommentId;
  }

  /**
   * Returns thread based on target and threadId
   *
   * @param target Type: string - path of file thread relates to
   * @param threadId Type: string - unique id of thread to get
   */
  private getThread(target: string, threadId: string): ICommentThread {
    let threads = this._commentsStore[target];

    for (let i = 0; i < threads.length; i++) {
      if (threads[i].id === threadId) {
        return threads[i];
      }
    }
  }

  private _commentsStore: ICommentsStore;
  private _service: ICommentingServiceConnection;
  private _nextCommentId: number;
  private readonly _storePath = 'comments.json';
}

/**
 * Comment store type
 */
export interface ICommentsStore {
  [target: string]: Array<ICommentThread>;
}

/**
 * Comment thread type
 */
export interface ICommentThread {
  /**
   * Unique id of comment thread
   */
  id: string;
  /**
   * Total amount of comments in thread
   */
  total: number;
  /**
   * Thread resolve state
   */
  resolved: boolean;
  /**
   * Thread indicator
   */
  indicator?: CommentIndicator;
  /**
   * Array of all comments
   */
  body: Array<ICommentBody>;
}

/**
 * Body of thread
 */
export interface ICommentBody {
  /**
   * Value of comment
   */
  value: string;
  /**
   * Time comment was created
   */
  created: string;
  /**
   * Creator of thread
   */
  creator: IPerson;
  /**
   * State of if thread was edited
   */
  edited: boolean;
}

/**
 * Person object
 */
export interface IPerson {
  /**
   * Name of person
   */
  name: string;
  /**
   * Person image URL
   */
  image: string;
  /**
   * GitHub username
   */
  user: string;
}

export type CommentIndicator = ITextIndicator | INotebookIndicator;

export interface ITextIndicator {
  /**
   * Initial value, the very first indicator values and context
   */
  initial: {
    end: {
      line: number;
      column: number;
    };
    start: {
      line: number;
      column: number;
    };
    context: string;
  };

  /**
   * The most recent positioning and context of the indicator
   */
  current: {
    end: {
      line: number;
      column: number;
    };
    start: {
      line: number;
      column: number;
    };
    context: string;
  };
}

export type INotebookIndicator =
  | INotebookCellIndicator
  | INotebookTextIndicator;

export interface INotebookTextIndicator {
  /**
   * Initial value, the very first indicator values and context
   */
  initial: {
    end: {
      line: number;
      column: number;
    };
    start: {
      line: number;
      column: number;
    };
    context: string;
  };

  /**
   * The most recent positioning and context of the indicator
   */
  current: {
    end: {
      line: number;
      column: number;
    };
    start: {
      line: number;
      column: number;
    };
    context: string;
  };
}

export interface INotebookCellIndicator {
  index: string;
  type: 'input' | 'output';
}
