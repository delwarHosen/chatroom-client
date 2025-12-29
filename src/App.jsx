import { useState } from 'react'
import ChatRoom from './components/ChatRoom';


function App() {
  const [username, setUsername] = useState("");
  const [room, setRoom] = useState("");
  const [joined, setJoined] = useState(false);

  const joinRoom = () => {
    if (username && room) {
      setJoined(true)
    }
  }

  return (
    <div className='min-h-screen bg-gray-100 flex justify-center items-center p-4'>
      {
        !joined ?
          (
            <div className='w-full max-w-md p-6 rounded bg-white shadow-lg '>
              <h1 className='text-2xl font-semibold text-blue-400 mb-3 uppercase'>Joined chatroom</h1>
              <input type="text"
                className='w-full rounded mb-3 p-2 border '
                placeholder='UserName'
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />

              <input type="text"
                className='w-full rounded mb-3 p-2 border '
                placeholder='Room Id'
                value={room}
                onChange={(e) => setRoom(e.target.value)}
              />
              <button
                className='w-full text-center bg-blue-500 text-white p-3 rounded mb-3'
                onClick={joinRoom}>Join Room</button>
            </div>
          )
          :
          (
            <ChatRoom username={username} room={room} />
          )
      }
    </div>
  )
}

export default App
