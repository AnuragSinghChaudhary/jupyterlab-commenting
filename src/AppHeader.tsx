import * as React from 'react';

/**
 * React Props interface
 */
interface IAppHeaderProps {
  /**
   * Receives a value for a header
   *
   * @type string
   */
  header?: string;
  /**
   * Tracks if card is expanded
   *
   * @type boolean
   */
  expanded?: boolean;
  /**
   * Function to set the state of the current expanded card in "App.tsx"
   *
   * @param cardId - string: Card unique id
   */
  setExpandedCard: (cardId: string) => void;
  /**
   * Recieves the AppHeaderOption componenet for render purposes
   *
   * @type React.ReactNode
   */
  headerOptions: React.ReactNode;
  /**
   * Sets the state of if creating a new thread state is active
   */
  setNewThreadActive: (state: boolean, itemId: string) => void;
}

/**
 * AppHeader React Component
 */
export class AppHeader extends React.Component<IAppHeaderProps> {
  /**
   * Constructor
   *
   * @param props React props
   */
  constructor(props: any) {
    super(props);

    this.renderAppHeader = this.renderAppHeader.bind(this);
    this.getBackButton = this.getBackButton.bind(this);
    this.setShrink = this.setShrink.bind(this);
    this.handleNewThreadButton = this.handleNewThreadButton.bind(this);
  }

  /**
   * React render function
   */
  render() {
    return (
      <div className="card border-0 py-1">
        <div className="row">
          <div className={'col-lg-2'}>
            {this.props.expanded && this.getBackButton()}
          </div>
          <div className={'col-lg-7 text-center px-0'}>
            {this.renderAppHeader(this.props.header)}
          </div>
          <div className={'col-lg-2'}>
            {!this.props.expanded && this.getNewThreadButton()}
          </div>
        </div>
        <div>{this.props.headerOptions}</div>
      </div>
    );
  }

  /**
   * Checks the value of the header prop and returns a React component
   * with a value held by the header prop, or a header placeholder
   *
   * @param header Type: string
   * @return Type: React.ReactNode - App Header with correct string
   */
  renderAppHeader(header: string): React.ReactNode {
    if (this.props.header === undefined) {
      return (
        <h5
          className="card-header text-center border-0"
          style={this.styles.emptyHeader}
        >
          Select a file to view comments
        </h5>
      );
    } else {
      return (
        <div style={this.styles.header}>
          {this.getFileIcon(this.props.header)}
          <label
            className="card-header text-center border-0 py-0"
            style={this.styles.headerLabel}
          >
            {this.props.header}
          </label>
        </div>
      );
    }
  }

  /**
   * Strips the header of the extension ending and compares it to the list of supported extensions
   *
   * @param header Type: string
   * @return Type: React.ReactNode - span with a correct image class
   */
  getFileIcon(header: string): React.ReactNode {
    try {
      let extensionName = header.slice(header.indexOf('.'));
      for (let key = 0; key < this.fileTypes.length; key++) {
        for (
          let value = 0;
          value < this.fileTypes[key].extensions.length;
          value++
        ) {
          if (extensionName === this.fileTypes[key].extensions[value]) {
            return (
              <span
                className={this.fileTypes[key].iconClass}
                style={this.styles.headerIcon}
              />
            );
          }
        }
      }
      return (
        <span
          className={'jp-Icon jp-FileIcon'}
          style={this.styles.headerIcon}
        />
      );
    } catch {
      return <span />;
    }
  }
  /**
   * Renders a back button inside the header
   *
   * @return Type: React.ReactNode -
   *    Input button @type Image
   */
  getBackButton(): React.ReactNode {
    return (
      <input
        type="image"
        style={this.styles.backButton}
        src={'https://i.ibb.co/xg3hwy8/Vector.png'}
        alt="Back"
        onClick={this.setShrink}
      />
    );
  }

  /**
   * Creates the new thread button
   *
   * @return Type: React.ReactNode - new thread button JSX
   */
  getNewThreadButton(): React.ReactNode {
    return (
      <input
        type="image"
        style={this.styles.newCommentButton}
        src={
          'https://material.io/tools/icons/static/icons/baseline-add-24px.svg'
        }
        alt="New"
        onClick={this.handleNewThreadButton}
      />
    );
  }

  /**
   * Handles the state of if new thread box should be open
   */
  handleNewThreadButton(): void {
    this.props.setNewThreadActive(true, this.props.header);
  }

  /**
   * Sets the state expandedCard to ' ' in App.tsx, which will shrink
   */
  setShrink(): void {
    this.props.setExpandedCard(' ');
  }

  /**
   * Stores all the available file extension types
   */
  fileTypes = [
    {
      extensions: ['.md'],
      mimeTypes: ['text/markdown'],
      iconClass: 'jp-Icon jp-MarkdownIcon'
    },
    {
      extensions: ['.py'],
      mimeTypes: ['text/x-python'],
      iconClass: 'jp-Icon jp-PythonIcon'
    },
    {
      extensions: ['.json'],
      mimeTypes: ['application/json'],
      iconClass: 'jp-Icon jp-JSONIcon'
    },
    {
      extensions: ['.csv'],
      mimeTypes: ['text/csv'],
      iconClass: 'jp-Icon jp-SpreadsheetIcon'
    },
    {
      extensions: ['.tsv'],
      mimeTypes: ['text/csv'],
      iconClass: 'jp-Icon jp-SpreadsheetIcon'
    },
    {
      mimeTypes: ['text/x-rsrc'],
      extensions: ['.r'],
      iconClass: 'jp-Icon jp-RKernelIcon'
    },
    {
      mimeTypes: ['text/x-yaml', 'text/yaml'],
      extensions: ['.yaml', '.yml'],
      iconClass: 'jp-Icon jp-YamlIcon'
    },
    {
      mimeTypes: ['image/svg+xml'],
      extensions: ['.svg'],
      iconClass: 'jp-Icon jp-ImageIcon'
    },
    {
      mimeTypes: ['image/tiff'],
      extensions: ['.tif', '.tiff'],
      iconClass: 'jp-Icon jp-ImageIcon'
    },
    {
      mimeTypes: ['image/jpeg'],
      extensions: ['.jpg', '.jpeg'],
      iconClass: 'jp-Icon jp-ImageIcon'
    },
    {
      mimeTypes: ['image/gif'],
      extensions: ['.gif'],
      iconClass: 'jp-Icon jp-ImageIcon'
    },
    {
      mimeTypes: ['image/png'],
      extensions: ['.png'],
      iconClass: 'jp-Icon jp-ImageIcon'
    },
    {
      mimeTypes: ['image/bmp'],
      extensions: ['.bmp'],
      iconClass: 'jp-Icon jp-ImageIcon'
    }
  ];

  /**
   * App header styles
   */
  styles = {
    emptyHeader: { background: 'white', color: '#a3a1a0' },
    header: { display: 'inline-block', alignItems: 'center' },
    headerLabel: {
      paddingLeft: '5px',
      background: 'white',
      paddingTop: '0.5rem',
      paddingBottom: '0.5rem',
      fontSize: '24px'
    },
    headerIcon: {
      minWidth: '28px',
      minHeight: '28px',
      backgroundSize: '28px',
      marginTop: '13px',
      marginBottom: '18px',
      padding: '8px'
    },
    backButton: {
      width: '16px',
      height: '16px',
      marginTop: '20px',
      marginLeft: '15px'
    },
    newCommentButton: {
      width: '20px',
      height: '20px',
      marginTop: '17px',
      marginLeft: '15px'
    }
  };
}
