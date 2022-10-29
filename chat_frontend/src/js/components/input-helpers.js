import React from "react";

export class FloatingLabelsInput extends React.Component {
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