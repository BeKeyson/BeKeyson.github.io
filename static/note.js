notesContainer = document.getElementById('note_app')
addNoteBtn = document.getElementById('add_note')
addNoteBtn.addEventListener('click', () => { addNote() })
tf_global = 15;

getNotes().forEach(note => {
  const noteElement = createNoteElement(note.id, note.content)
  notesContainer.insertBefore(noteElement, addNoteBtn)
})

function getNotes() {
  return JSON.parse(localStorage.getItem('notes') || '[]')
}

function saveNotes(notes) {
  localStorage.setItem('notes', JSON.stringify(notes))
}

function createNoteElement(id, content) {
  const element = document.createElement('textarea')

  note_ticker = get_ticker(content.split('\n')[0])
  if (note_ticker && note_ticker != '') {
    draw_msg(element, note_ticker)
  }

  element.rows = content.split('\n').length
  element.classList.add('note')
  element.value = content
  element.placeholder = 'Empty'

  element.addEventListener('change', () => {
    updateNote(id, element.value)
  })

  element.addEventListener('contextmenu', e => {
    e.preventDefault()
    deleteNote(id, element)
  })

  return element
}

function addNote() {
  const notes = getNotes()
  const note_obj = {
    id: Math.floor(Math.random() * 100000),
    content: ''
  }
  const note_element = createNoteElement(note_obj.id, note_obj.content)
  notesContainer.insertBefore(note_element, addNoteBtn)

  notes.push(note_obj)
  saveNotes(notes)
}

function updateNote(id, new_content) {
  const notes = getNotes()
  const target_note = notes.filter(note => note.id == id)[0]

  target_note.content = new_content
  saveNotes(notes)

  document.querySelectorAll('.note').forEach(note => {
    if (note.id != 'add_note') {
      note.remove()
    }
  })

  getNotes().forEach(note => {
    const noteElement = createNoteElement(note.id, note.content)
    notesContainer.insertBefore(noteElement, addNoteBtn)
  })

}

function deleteNote(id, element) {
  const notes = getNotes().filter(note => note.id != id)
  saveNotes(notes)
  notesContainer.removeChild(element)
}
