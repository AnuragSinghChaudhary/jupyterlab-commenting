import { JupyterFrontEnd, ILabShell } from '@jupyterlab/application';

import { IEditorTracker } from '@jupyterlab/fileeditor';

import { CodeMirrorEditor } from '@jupyterlab/codemirror';

import { CodeEditor } from '@jupyterlab/codeeditor';

import { JSONValue } from '@phosphor/coreutils';

import { Widget } from '@phosphor/widgets';

import { Message } from '@phosphor/messaging';

import { ITextIndicator } from '../types';
import { commentingUI } from '../index';
import { CommentingDataProvider } from './provider';
import { IndicatorWidget } from './indicator';
import { CommentingDataReceiver } from './receiver';
import { TextMarker } from 'codemirror';

/**
 * Indicator widget for the text editor viewer / widget
 */
export class TextEditorIndicator extends Widget implements IndicatorWidget {
  private _app: JupyterFrontEnd;
  private _labShell: ILabShell;
  private _tracker: IEditorTracker;

  // Commenting Data receiver
  private _receiver: CommentingDataReceiver;

  // Commenting Data provider
  private _provider: CommentingDataProvider;

  // setInterval for querying new indicators
  // private _periodicUpdate: number;

  private _indicators: { [key: string]: TextMarker };

  constructor(
    app: JupyterFrontEnd,
    labShell: ILabShell,
    tracker: IEditorTracker,
    provider: CommentingDataProvider,
    receiver: CommentingDataReceiver
  ) {
    super();
    this._app = app;
    this._labShell = labShell;
    this._tracker = tracker;
    this._provider = provider;
    this._receiver = receiver;

    this._indicators = {};

    this.putIndicators = this.putIndicators.bind(this);
  }

  /**
   * Called when the activate message is sent to the widget
   *
   * @param msg Type: Message - activate message
   */
  protected onActivateRequest(msg: Message): void {
    if (!this._app.commands.hasCommand('jupyterlab-commenting:createComment')) {
      this.createContextMenu();
    }

    this.putIndicators();
    // this._periodicUpdate = setInterval(this.putIndicators, 1000);

    // Handles indicator when a new thread is created or canceled
    // TODO: add disconnect signal when widget is closed / disposed
    commentingUI.newThreadCreated.connect((sender, args) => {
      let latestIndicator: ITextIndicator = (this._provider.getState(
        'latestIndicatorInfo'
      ) as object) as ITextIndicator;

      if (!latestIndicator) {
        return;
      }

      let position = {
        column: latestIndicator.start.column,
        line: latestIndicator.start.line
      } as CodeEditor.IPosition;

      if (args) {
        this.createIndicator(
          (this._provider.getState(
            'latestIndicatorInfo'
          ) as object) as ITextIndicator,
          this.getAnnotationFromPosition(position),
          'clear'
        );
        this._receiver.setState({ latestIndicatorInfo: '' });
      } else {
        this.createIndicator(
          (this._provider.getState(
            'latestIndicatorInfo'
          ) as object) as ITextIndicator,
          this.getAnnotationFromPosition(position),
          'clear'
        );
      }
    });
  }

  /**
   * Called when the close message is sent to the widget
   */
  protected onCloseRequest(msg: Message): void {
    // clearInterval(this._periodicUpdate);
    this.clearAllIndicators();
  }

  /**
   * Sets the commentingUI widget to show and expands the right area
   */
  openCommenting(): void {
    commentingUI.show();
    this._labShell.expandRight();
  }

  /**
   * Opens the new thread card of the commentingUI widget
   */
  openNewThread(): void {
    if (!commentingUI.isVisible) {
      this.openCommenting();
    }
    commentingUI.setNewThreadActive(true);
  }

  /**
   * Focus a thread based on the id
   *
   * @param threadId Type: string - threadID of thread to expand
   */
  focusThread(threadId: string): void {
    if (this._provider.getState('expandedCard') !== threadId) {
      commentingUI.setExpandedCard(threadId);
    }
  }

  /**
   * Adds all indicators to the current widget
   */
  putIndicators(): void {
    console.log('PUT INDICATOR');
    let response = this._provider.getState('response') as any;
    let expandedCard = this._provider.getState('expandedCard') as string;

    let annotations = response.data.annotationsByTarget;

    let widget = this._tracker.currentWidget;
    let editor = widget.content.editor as CodeMirrorEditor;

    if (!this._provider.getState('newThreadActive')) {
      editor.doc.getAllMarks().forEach(mark => {
        mark.clear();
      });
    }

    for (let index in annotations) {
      let indicator = annotations[index].indicator;
      let resolved = annotations[index].resolved;
      let id = annotations[index].id;

      if (id !== expandedCard && !resolved) {
        this.createIndicator(indicator, id, 'highlight');
      } else if (id !== expandedCard && resolved) {
        this.createIndicator(indicator, id, 'clear');
      } else if (id === expandedCard) {
        this.createIndicator(indicator, id, 'highlight', 'orange');
      }
    }
  }

  /**
   * Adds indicators to text editor
   *
   * @param selection - Type: ITextIndicator - selection to highlight
   * @param type - Type: string - type of indicator
   * @param color - Type: string - color of indicator, any CSS color
   */
  createIndicator(
    selection: ITextIndicator,
    threadId: string,
    type: 'highlight' | 'underline' | 'clear',
    color?: string
  ): void {
    if (selection === null || !selection) {
      return;
    }

    if (!color) {
      color = 'yellow';
    }

    let widget = this._tracker.currentWidget;
    let editor = widget.content.editor as CodeMirrorEditor;

    /**
     * Handles setting start and end ranges based on how the user selects.
     *
     * Makes the start line and col the lowest values, and the end line and col
     * the end values.
     */
    let startLine =
      selection.start.line <= selection.end.line
        ? selection.start.line
        : selection.end.line;
    let endLine =
      selection.end.line >= selection.start.line
        ? selection.end.line
        : selection.start.line;
    let startCol =
      selection.start.column < selection.end.column
        ? selection.start.column
        : selection.end.column;
    let endCol =
      selection.end.column > selection.start.column
        ? selection.end.column
        : selection.start.column;

    switch (type) {
      case 'highlight':
        this._indicators[threadId] = editor.doc.markText(
          { line: startLine, ch: startCol },
          { line: endLine, ch: endCol },
          { css: `background-color: ${color};` }
        );

        this._indicators[threadId].on('beforeCursorEnter', () => {
          let widget = this._tracker.currentWidget;
          let editor = widget.content.editor as CodeMirrorEditor;

          let annotation = this.getAnnotationFromPosition(
            editor.getCursorPosition()
          );

          if (
            !annotation ||
            annotation === this._provider.getState('expandedCard')
          ) {
            return;
          }

          this.focusThread(annotation);
        });

        break;
      case 'underline':
        this._indicators[threadId] = editor.doc.markText(
          { line: startLine, ch: startCol },
          { line: endLine, ch: endCol },
          {
            css: `border-bottom: 2px solid ${color};`
          }
        );
        break;
      case 'clear':
        this._indicators[threadId] = editor.doc.markText(
          { line: startLine, ch: startCol },
          { line: endLine, ch: endCol },
          { css: 'background-color: transparent; border-bottom: 0;' }
        );

        this._indicators[threadId].on('beforeCursorEnter', () => {
          return;
        });

        this._indicators[threadId].clear();
        break;
      default:
        break;
    }
  }

  /**
   * Handles clearing all the indicators from the current widget
   */
  clearAllIndicators(): void {
    let response = this._provider.getState('response') as any;

    let annotations = response.data.annotationsByTarget;

    for (let index in response.data.annotationsByTarget) {
      this.createIndicator(
        annotations[index].indicator,
        annotations[index].id,
        'clear'
      );
    }

    let widget = this._tracker.currentWidget;
    let editor = widget.content.editor as CodeMirrorEditor;

    editor.doc.getAllMarks().forEach(mark => {
      mark.clear();
    });

    this._indicators = {};
  }

  /**
   * Returns the threadId of an annotation based on a position.
   * Checks if the given positions is in the range of any indicator
   * and returns the corresponding thread.
   *
   * @param position Type: CodeEditor.IPosition
   *
   * @return String - threadId of indicator | undefined if not found
   */
  getAnnotationFromPosition(
    position: CodeEditor.IPosition
  ): string | undefined {
    for (let key in this._indicators) {
      let curIndicator: TextMarker = this._indicators[key];

      let selection = curIndicator.find();

      if (
        position.line >= selection.from.line &&
        position.line <= selection.to.line &&
        position.column >= selection.from.ch &&
        position.column <= selection.to.ch
      ) {
        return key;
      }
    }
    return undefined;
  }

  /**
   * Creates the context menu button "Comment"
   */
  createContextMenu(): void {
    this._app.commands.addCommand('jupyterlab-commenting:createComment', {
      label: 'Comment',
      isVisible: () => {
        let doc = this._provider.getState('curDocType') as string;
        return doc.indexOf('text') > -1;
      },
      execute: () => {
        let response = this._provider.getState('response') as any;

        let length: number = response.data.annotationsByTarget.length + 1;

        this.createIndicator(
          this.getSelection(),
          'anno/' + length,
          'underline',
          'orange'
        );
        this.openNewThread();
      }
    });

    this._app.contextMenu.addItem({
      command: 'jupyterlab-commenting:createComment',
      selector: 'body',
      rank: Infinity
    });
  }

  /**
   * Gets the current selection range from the codemirror editor.
   * If the selection range start and end values are the same,
   * it returns the range of the entire line
   *
   * @return Type: ITextIndicator
   */
  getSelection(): ITextIndicator {
    let widget = this._tracker.currentWidget;
    let editor = widget.content.editor as CodeMirrorEditor;

    let selection = editor.getSelection();
    let curSelected: ITextIndicator;

    if (
      selection.start.line === selection.end.line &&
      selection.start.column === selection.end.column
    ) {
      curSelected = {
        end: {
          line: selection.end.line,
          column: editor.getLine(selection.start.line).length
        },
        start: { line: selection.start.line, column: 0 }
      };
    } else {
      curSelected = {
        end: {
          line: selection.end.line,
          column: selection.end.column
        },
        start: {
          line: selection.start.line,
          column: selection.start.column
        }
      };
    }
    this._receiver.setState({
      latestIndicatorInfo: (curSelected as object) as JSONValue
    });
    return curSelected;
  }
}
