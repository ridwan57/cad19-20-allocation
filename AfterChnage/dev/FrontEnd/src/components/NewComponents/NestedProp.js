import React, { useState } from 'react'
import produce from 'immer'
import deepCopy from 'deepcopy'

const baseState = [
  { id: 1, title: 'Learn TypeScript', done: true },
  { id: 2, title: 'Try Immer', done: false }
]

const NestedProp = () => {
  const [user, setUser] = useState({
    name: 'ridwan',
    email: 'ridwan57@gmail.com',

    address2: {
      address: {
        street: '123',
        zip: '888'
      }
    }
  })
  const [state, setState] = useState(baseState)
  const handleTest = (id, name) => {
    console.log('id', id)
    const newState = produce(baseState, draftState => {
      const find = draftState.filter(draft => draft.id === id)
      draftState[0] = find
    })
    setState(newState)
  }

  const handleUpdate = e => {
    // const olduser
    setUser(
      produce(draft => {
        draft.address2.address[e.target.name] = e.target.value
      })
    )
  }
  return (
    <div>
      {JSON.stringify(user)}
      <input name='street' onChange={handleUpdate} />
      <button onClick={() => handleTest(1, 'ridwan')}>Update</button>
    </div>
  )
}

export default NestedProp
