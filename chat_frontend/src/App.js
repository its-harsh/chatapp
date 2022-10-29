import React from "react";
import {BrowserRouter as Router, Route} from "react-router-dom";
import './App.css';
import { LoginForm, RegisterForm } from "./js/components/auth-forms";
import { ChatBoxHOC, ChatRoomList } from "./js/components/chat-room";

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
                        <ChatBoxHOC/>
                    </Route>
                </Router>
            </div>
        );
    }
}

export default App;
