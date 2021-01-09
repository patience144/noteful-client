import React, { Component } from 'react'
import NotefulForm from '../NotefulForm/NotefulForm'
import ApiContext from '../ApiContext'
import config from '../config'
import ValidationError from '../ValidationFolder/ValidationError'
import './AddNote.css'

export default class AddNote extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: {
        value: '',
        touched: false
      },
      content: {
        value: '',
        touched: false
      },
      folder: {
        value: '',
        touched: false
      }
    }
  }

  static defaultProps = {
    history: {
      push: () => { }
    },
  }
  static contextType = ApiContext;

  handleSubmit = e => {
    e.preventDefault()
    const newNote = {
      name: this.state.name.value,
      content: this.state.content.value,
      folderId: this.state.folder.value,
      modified: new Date(),
    }
    console.log(newNote);


    fetch(`${config.API_ENDPOINT}/notes`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify(newNote),
    })
      .then(res => {
        if (!res.ok)
          return res.json().then(e => Promise.reject(e))
        return res.json()
      })
      .then(note => {

        this.context.addNote(note)
        this.props.history.push(`/folder/${newNote.folderId}`)
      })
      .catch(error => {
        console.error({ error })
      })
  }

  updateName(name) {

    this.setState({name:{value: name, touched: true}})
    
  }

  validateName() {
    const name = this.state.name.value.trim();
    if (name.length === 0) {
      return 'Name is required';
    } else if (name.length < 3) {
      return 'Name must be at least 3 characters long';
    }
  }

  updateContent(content) {

    this.setState({content:{value: content}})
  }

  updateFolder(folder) {
    console.log(folder);
    this.setState({folder:{value: folder}})
  }

  render() {
    const { folders=[] } = this.context
    return (
      <section className='AddNote'>
        <h2>Create a note</h2>
        <NotefulForm onSubmit={this.handleSubmit}>
          <div className='field'>
            <label htmlFor='note-name-input'>
              Name
            </label>
            <input type='text' id='note-name-input' name='note-name' onChange={e => this.updateName(e.target.value)}/>
            <ValidationError message={this.validateName()}/>
            

          </div>
          <div className='field'>
            <label htmlFor='note-content-input'>
              Content
            </label>
            <textarea id='note-content-input' name='note-content' onChange={e => this.updateContent(e.target.value)}/>
          </div>
          <div className='field'>
          <label htmlFor='note-folder-select'>
              Folder
            </label>
            <select id='note-folder-select' name='note-folder-id' onChange={e => this.updateFolder(e.target.value)}>
              <option value={null}>...</option>
              {folders.map(folder =>
                <option key={folder.id} value={folder.id}>
                  {folder.name}
                </option>
              )}
            </select>
          </div>
          <div className='buttons'>
            <button type='submit' disabled={this.validateName()}>
              Add note
            </button>
          </div>
        </NotefulForm>
      </section>
    )
  }
}
