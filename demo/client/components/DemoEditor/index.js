import React, { Component } from 'react';
import Editor from 'draft-js-plugins-editor';
import createMentionPlugin, { defaultSuggestionsFilter } from 'draft-js-mention-plugin';
import 'draft-js-mention-plugin/lib/plugin.css';
import createMarkdownShortcutsPlugin from 'draft-js-markdown-shortcuts-plugin'; // eslint-disable-line
import Draft, {
  convertToRaw,
  // convertFromRaw,
  ContentState,
  EditorState,
} from 'draft-js';
import styles from './styles.css';
import prismPlugin from '../../plugins/prism';
import mentions from './mentions';

window.Draft = Draft;

const mentionPlugin = createMentionPlugin();
const { MentionSuggestions } = mentionPlugin;

const contentState = ContentState.createFromText('');
const initialEditorState = EditorState.createWithContent(contentState);

export default class DemoEditor extends Component {
  constructor(...args) {
    super(...args);
    this.plugins = [
      prismPlugin,
      createMarkdownShortcutsPlugin({
        beforeHandleReturn: this.beforeHandleReturn
      }),
      mentionPlugin
    ];
  }

  state = {
    editorState: initialEditorState,
    suggestions: mentions,
    isSuggestionsOpened: false
  };

  componentDidMount = () => {
    const { editor } = this;
    if (editor) {
      setTimeout(editor.focus.bind(editor), 1000);
    }
  }

  onChange = (editorState) => {
    window.editorState = editorState;
    window.rawContent = convertToRaw(editorState.getCurrentContent());

    this.setState({
      editorState,
    });
  };

  onSearchChange = ({ value }) => {
    this.setState({
      suggestions: defaultSuggestionsFilter(value, mentions),
    });
  };

  onAddMention = () => {
    // get the mention object selected
  }

  onCloseSuggestions = () => {
    this.setState({
      isSuggestionsOpened: false
    });
  }

  onOpenSuggestions = () => {
    this.setState({
      isSuggestionsOpened: true
    });
  }

  beforeHandleReturn = () => {
    if (this.state.isSuggestionsOpened) {
      return 'handled';
    }
    return 'not-handled';
  }

  focus = () => {
    this.editor.focus();
  };

  render() {
    const { editorState } = this.state;
    const placeholder = editorState.getCurrentContent().hasText() ? null : <div className={styles.placeholder}>Write something here...</div>;
    return (
      <div className={styles.root}>
        {placeholder}
        <div className={styles.editor} onClick={this.focus}>
          <Editor
            editorState={editorState}
            onChange={this.onChange}
            plugins={this.plugins}
            spellCheck
            ref={(element) => { this.editor = element; }}
          />
          <MentionSuggestions
            onSearchChange={this.onSearchChange}
            suggestions={this.state.suggestions}
            onAddMention={this.onAddMention}
            onClose={this.onCloseSuggestions}
            onOpen={this.onOpenSuggestions}
          />
        </div>
      </div>
    );
  }
}
