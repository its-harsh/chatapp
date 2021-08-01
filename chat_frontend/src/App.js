import React from "react";
import {BrowserRouter as Router, Link, Route, Redirect, withRouter} from "react-router-dom";
import './App.css';

const API_HOST_URL = 'http://localhost:8000'
const WEBSOCKET_HOST_URL = 'ws://localhost:8000'

function represent_datetime(timestamp) {
    let datetime = new Date(timestamp)
    return `${datetime.toLocaleTimeString()} ${datetime.toLocaleDateString()}`
}

class AuthUtils {
    static get_auth_tokens(user_credentials) {
        return fetch(`${API_HOST_URL}/auth/login/`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(user_credentials)
        })
            .then(response => response.json())
    }

    static refresh_access_token() {
        return fetch(`${API_HOST_URL}/auth/login/refresh/`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({'refresh': localStorage.getItem('refresh_token')})
        })
            .then(response => response.json())
    }

    static is_authenticated() {
        return localStorage.getItem('access_token') && localStorage.getItem('refresh_token')
    }
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
        if (AuthUtils.is_authenticated())
            fetch(`${API_HOST_URL}/api/list_room/`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
                }
            })
                .then(response => response.json())
                .then(data => this.setState({'room_list': data}))
    }

    render() {
        if (AuthUtils.is_authenticated())
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
        fetch(`${API_HOST_URL}/api/last_message/${this.props.room.uuid}`)
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
        this.ws = new WebSocket(`${WEBSOCKET_HOST_URL}/chat/${this.props.match.params.room_uuid}/`)
        this.ws.onopen = ev => {
            this.ws.send(JSON.stringify({'action': 'load_messages'}))
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
                'action': 'new_message', 'data': {
                    'author': 'admin',
                    'content': message
                }
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

class FloatingLabelsInput extends React.Component {
    render() {
        return (
            <div className="form-floating">
                <input type={this.props.type} className="form-control" id={this.props.field_id}
                       placeholder={this.props.label}/>
                <label htmlFor="{this.props.field_id}">{this.props.label}</label>
            </div>
        )
    }
}

class LoginForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {'success': false}
        this.login_request = this.login_request.bind(this)
    }

    login_request(event) {
        event.preventDefault()
        AuthUtils.get_auth_tokens({
            username: document.querySelector('#username').value,
            password: document.querySelector('#password').value
        })
            .then((json_data) => {
                if (json_data.access && json_data.refresh) {
                    localStorage.setItem('access_token', json_data.access)
                    localStorage.setItem('refresh_token', json_data.refresh)
                    this.setState({'success': true})
                }
            })
            .catch()
    }

    render() {
        if (this.state.success || AuthUtils.is_authenticated())
            return <Redirect to="/"/>
        else return (
            <main className="form-auth">
                <form onSubmit={this.login_request}>
                    <h1 className="h3 mb-3 fw-normal">Please Sign In</h1>
                    <FloatingLabelsInput type='text' field_id='username' label='Username'/>
                    <FloatingLabelsInput type='password' field_id='password' label='Password'/>
                    <p>Don't have an account <Link to='/register/'>Register Here</Link></p>
                    <button className="w-100 btn btn-lg btn-primary" type="submit">Sign in</button>
                </form>
            </main>
        )
    }
}

class RegisterForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {'success': false}
        this.signup_request = this.signup_request.bind(this)
    }

    signup_request(event) {
        event.preventDefault()
        let username = document.querySelector('#username').value
        let password = document.querySelector('#password').value
        let confirm_password = document.querySelector('#confirm_password').value
        if (password === confirm_password)
            fetch(`${API_HOST_URL}/auth/register/`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    username: username,
                    email: document.querySelector('#email').value,
                    password: password
                })
            })
                .then(response => response.json())
                .then(json_data => {
                    if (json_data.username && json_data.email) {
                        this.setState({'success': true})
                    }
                })
                .catch()
    }

    render() {
        if (this.state.success)
            return <Redirect to="/login/"/>
        else if (AuthUtils.is_authenticated())
            return <Redirect to="/"/>
        else return (
                <main className="form-auth">
                    <form onSubmit={this.signup_request}>
                        <h1 className="h3 mb-3 fw-normal">Please Sign Up</h1>
                        <FloatingLabelsInput type='text' field_id='username' label='Username'/>
                        <FloatingLabelsInput type='email' field_id='email' label='Email'/>
                        <FloatingLabelsInput type='password' field_id='password' label='Password'/>
                        <FloatingLabelsInput type='password' field_id='confirm_password' label='Confirm Password'/>
                        <p>Already have an account <Link to='/login/'>Login Here</Link></p>
                        <button className="w-100 btn btn-lg btn-primary" type="submit">Sign Up</button>
                    </form>
                </main>
            )
    }
}

export default App;
