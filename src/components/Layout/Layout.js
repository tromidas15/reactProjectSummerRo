import React, {Component} from 'react';

import {connect} from 'react-redux';

import Header from "./Header";
import SlideBar from "./SlideBar";

@connect(
    store => ({
        error: store.error
    }),
    dispatch => ({})
)
export default class Layout extends Component {
    render() {
        const {error} = this.props;

        return (
            <div >
                {error && <div>{error}</div>}
                <Header/>
                <SlideBar/>
                    {this.props.children}
            </div>
        );
    }
}