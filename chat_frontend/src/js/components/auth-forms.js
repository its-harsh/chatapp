import React from "react";
import {Link, Redirect} from "react-router-dom";
import { Auth } from "../auth";
import { FloatingLabelsInput } from "./input-helpers";

export class LoginForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {'success': false};
        this.login_request = this.login_request.bind(this);
    }

    async login_request(event) {
        event.preventDefault();
        let login_request_success = await Auth.login(document.querySelector('#username').value,document.querySelector('#password').value)
        this.setState({'success': login_request_success});
    }

    render() {
        if (this.state.success || Auth.is_authenticated()) {
            return <Redirect to="/"/>
        }
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

export class RegisterForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {'success': false}
        this.signup_request = this.signup_request.bind(this)
    }

    async signup_request(event) {
        event.preventDefault()
        let username = document.querySelector('#username').value;
        let email = document.querySelector('#email').value;
        let password = document.querySelector('#password').value;
        let confirm_password = document.querySelector('#confirm_password').value;
        if (password === confirm_password) {
            let register_state_success = await Auth.register(username, email, password);
            this.setState({success : register_state_success});
        }
    }

    render() {
        if (this.state.success)
            return <Redirect to="/login/"/>
        else if (Auth.is_authenticated())
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