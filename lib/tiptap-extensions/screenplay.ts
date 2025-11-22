import { Node, mergeAttributes } from '@tiptap/core'

export const ScreenplayCharacter = Node.create({
  name: 'screenplayCharacter',

  group: 'block',

  content: 'inline*',

  parseHTML() {
    return [
      {
        tag: 'div[data-screenplay-type="character"]',
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'div',
      mergeAttributes(HTMLAttributes, {
        'data-screenplay-type': 'character',
        class: 'text-center font-bold uppercase my-4',
      }),
      0,
    ]
  },

  addKeyboardShortcuts() {
    return {
      Enter: ({ editor }) => {
        const { $from } = editor.state.selection
        const currentNode = $from.parent

        if (currentNode.type.name === this.name) {
          // After a character name, insert a dialogue paragraph
          return editor.commands.insertContent({
            type: 'screenplayDialogue',
            content: [],
          })
        }

        return false
      },
    }
  },
})

export const ScreenplayDialogue = Node.create({
  name: 'screenplayDialogue',

  group: 'block',

  content: 'inline*',

  parseHTML() {
    return [
      {
        tag: 'div[data-screenplay-type="dialogue"]',
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'div',
      mergeAttributes(HTMLAttributes, {
        'data-screenplay-type': 'dialogue',
        class: 'ml-24 mr-32 my-2',
      }),
      0,
    ]
  },
})

export const ScreenplaySlugline = Node.create({
  name: 'screenplaySlugline',

  group: 'block',

  content: 'inline*',

  parseHTML() {
    return [
      {
        tag: 'div[data-screenplay-type="slugline"]',
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'div',
      mergeAttributes(HTMLAttributes, {
        'data-screenplay-type': 'slugline',
        class: 'font-bold uppercase my-4',
      }),
      0,
    ]
  },
})

export const ScreenplayAction = Node.create({
  name: 'screenplayAction',

  group: 'block',

  content: 'inline*',

  parseHTML() {
    return [
      {
        tag: 'div[data-screenplay-type="action"]',
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'div',
      mergeAttributes(HTMLAttributes, {
        'data-screenplay-type': 'action',
        class: 'my-2',
      }),
      0,
    ]
  },
})

export const ScreenplayParenthetical = Node.create({
  name: 'screenplayParenthetical',

  group: 'block',

  content: 'inline*',

  parseHTML() {
    return [
      {
        tag: 'div[data-screenplay-type="parenthetical"]',
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'div',
      mergeAttributes(HTMLAttributes, {
        'data-screenplay-type': 'parenthetical',
        class: 'ml-20 mr-40 my-1 italic',
      }),
      0,
    ]
  },
})
