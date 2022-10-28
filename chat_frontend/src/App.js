import React from "react";
import {BrowserRouter as Router, Link, Route, Redirect, withRouter} from "react-router-dom";
import './App.css';
import { Auth } from "./js/auth";
import { LoginForm, RegisterForm } from "./js/components/auth-forms";

const API_HOST_URL = 'http://localhost:8000'
const WEBSOCKET_HOST_URL = 'ws://localhost:8000'

function represent_datetime(timestamp) {
    let datetime = new Date(timestamp)
    return `${datetime.toLocaleTimeString()} ${datetime.toLocaleDateString()}`
}

class App extends React.Component {
    render() {
        return (
            <div className="d-flex">
                <Router>
                    <Route exact path="/login/">
                        <LoginForm/>
                    </Route>
                    <Route exact path="/register/">
                        <RegisterForm/>
                    </Route>
                    <Route exact path="/">
                        <ChatRoomList/>
                    </Route>
                    <Route path="/chat/:room_uuid/">
                        <ChatBox/>
                    </Route>
                </Router>
            </div>
        );
    }
}

class ChatRoomList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
        console.log(Auth.is_authenticated())
        if (Auth.is_authenticated())
            fetch(`${API_HOST_URL}/api/list_room/`, {
                method: 'GET',
                headers: {
                    'Authorization': `Token ${localStorage.getItem('auth_token')}`,
                }
            })
                .then(response => response.json())
                .then(data => this.setState({'room_list': data}))
    }

    render() {
        if (Auth.is_authenticated())
            return (
                <div className="d-flex flex-nowrap">
                    <div className="d-flex flex-column align-items-stretch flex-shrink-0 bg-white"
                         style={{width: 480}}>
                        <a href="/"
                           className="d-flex align-items-center flex-shrink-0 p-3 link-dark text-decoration-none border-bottom">
                            <span className="fs-2 fw-semibold">ChatsApp</span>
                        </a>
                        <div className="list-group list-group-flush border-bottom scrollarea">
                            {this.state.room_list && this.state.room_list.map(room =>
                                (<ChatRoomListItem room={room} key={room.uuid}/>))}
                        </div>
                    </div>
                </div>
            );
        else return <Redirect to='/login/'/>
    }
}

class ChatRoomListItem extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
        fetch(`${API_HOST_URL}/api/last_message/${this.props.room.uuid}`,
        {
            method: 'GET',
            headers: {
                'Authorization': `Token ${localStorage.getItem('auth_token')}`,
            }
        })
            .then(response => response.json())
            .then(data => this.setState({'last_message': data}))
    }

    render() {
        return (
            <Link to={`/chat/${this.props.room.uuid}/`}
                  className="list-group-item list-group-item-action py-3 lh-tight"> {/* add active to this class name*/}
                <div className="d-flex w-100 align-items-center justify-content-between">
                    <strong className="mb-1 fs-5">{this.props.room.room_name}</strong>
                    <small
                        className="text-muted">{this.state.last_message && represent_datetime(this.state.last_message.timestamp)}</small>
                </div>
                <div className="col-10 mb-1 small">
                    {this.state.last_message &&
                    `${this.state.last_message.author &&
                    this.state.last_message.author.username} : ${this.state.last_message.content}`}
                </div>
            </Link>
        );
    }
}

class ChatBoxHOC extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}
        this.send_message = this.send_message.bind(this)
    }

    componentDidMount() {
        this.connect()
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.match.params.room_uuid !== prevProps.match.params.room_uuid) {
            this.ws.close()
            this.connect()
        }
    }

    connect() {
        this.ws = new WebSocket(`${WEBSOCKET_HOST_URL}/chat/${this.props.match.params.room_uuid}/?token=${Auth.get_token()}`)
        this.ws.onopen = ev => {
            this.ws.send(JSON.stringify({'signal': 'load_messages'}))
        }
        this.ws.onmessage = ev => {
            this.setState({'messages': JSON.parse(ev.data)})
        }
    }

    send_message(event) {
        event.preventDefault()
        let message = document.querySelector("textarea").value
        this.ws.send(JSON.stringify(
            {
                'signal': 'new_message',
                'author': 'admin',
                'content': message
            }
        ))
    }

    render() {
        return (
            <div className="container">
                {this.state.messages && this.state.messages.map((message, index) => <Message message={message}
                                                                                             key={index}/>)}
                <form className="form-inline" onSubmit={this.send_message}>
                    <textarea className="form-control px-1 my-1"
                              placeholder="Type a message"/>
                    <input type="submit" className="btn btn-primary my-1" value="Send"/>
                </form>
            </div>
        );
    }
}

const ChatBox = withRouter(ChatBoxHOC)

class Message extends React.Component {
    render() {
        return (
            <div className="bg-light my-5 message lh-tight">
                <span className="ms-2 fw-bold small">{this.props.message.author.username}</span>
                <p className="p-2">
                    {this.props.message.content}
                    <span className="ms-5 fw-bold small">{represent_datetime(this.props.message.timestamp)}</span>

                </p>
            </div>
        );
    }
}

export default App;
