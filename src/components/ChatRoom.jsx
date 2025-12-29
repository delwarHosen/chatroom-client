import { useState, useEffect, useRef } from "react"
import io from 'socket.io-client';
import PropType from "prop-types"


// const socket = io.connect('http://localhost:3001')
const socket = io.connect('https://chatroom-server-five.vercel.app')

export default function ChatRoom({ username, room }) {
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);
    const [typeMessage, setTypeMessage] = useState("");
    const messageEndRef = useRef(null);


    // useEffect(() => {
    //     socket.emit("join_room", room);

    //     socket.on("receive_message", (data) => {
    //         setMessages((prev) => [...prev, data])
    //     });

    //     socket.on("user_typing", (user) => {
    //         setTypeMessage(`${user} is typing`);
    //         setTimeout(() => setTypeMessage(""), 2000)
    //     });

    //     return () => {
    //         socket.off("receive_message");
    //         socket.off("user_typing");
    //     };
    // }, [room])

    useEffect(() => {
        // Ensure we only emit if the socket is actually connected
        if (socket.connected) {
            socket.emit("join_room", room);
        } else {
            socket.on("connect", () => {
                socket.emit("join_room", room);
            });
        }

        socket.on("receive_message", (data) => {
            setMessages((prev) => [...prev, data]);
        });

        // ... rest of your listeners
        return () => {
            socket.off("receive_message");
            socket.off("user_typing");
        };
    }, [room]);


    const sendMessage = () => {
        if (message.trim()) {
            const messageData = {
                room,
                author: username,
                message,
                time: new Date().toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                }),
                id: crypto.randomUUID(),
            };

            socket.emit("send_message", messageData);
            setMessages((prev) => [...prev, messageData]);
            setMessage("");
        }

    }

    useEffect(() => {
        messageEndRef.current?.scrollIntoView({
            behavior: "smooth"
        });
    }, [messages]);

    const handleTyping = () => {
        socket.emit("typing", { username, room })
    }

    return (
        <div className='w-full max-w-2xl bg-white p-4 rounded shadow'>
            <h1 className="text-xl font-bold mb-2 text-blue-500">{room}({username})</h1>
            <div className="h-64 min-w-2/3 overflow-y-auto border border-gray-400 p-2 mb-2 rounded shadow bg-gray-50">
                {
                    messages.map((msg, index) => (
                        <div key={index} className={`mb-1 p-3 ${msg.author === username ? "text-right" : "text-left"}`}>
                            <span className="font-bold text-gray-800">{msg.author}: </span> {msg.message}
                            <div className="text-gray-400 text-xs">{msg.time}</div>
                        </div>
                    ))
                }
                <div ref={messageEndRef} />
            </div>
            <p className="text-sm italic text-gray-400">{typeMessage}</p>
            <div className="flex space-x-2">
                <input
                    className='w-full rounded p-3 border-2 border-gray-200 shadow'
                    type="text"
                    placeholder="Type your message....."
                    value={message}
                    onChange={(e) => {
                        setMessage(e.target.value);
                        handleTyping()
                    }}
                    onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                />
                <button
                    className="bg-green-500 text-white font-bold rounded px-3"
                    onClick={sendMessage}>Send</button>
            </div>
        </div>
    )
}

// ChatRoom.propType = {
//     username: PropType.string.isRequired,
//     room: PropType.string.isRequired
// }

ChatRoom.propTypes = {
    username: PropType.string.isRequired,
    room: PropType.string.isRequired
};
