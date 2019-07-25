import React, {Component} from 'react';
import {BrowserRouter, Switch, Route} from 'react-router-dom';

import {Protected} from './components/Misc/Protected';

import Home from './components/Home';
import Categories from './components/Categories';
import SubCategories  from './components/Categories/SubCat';
import CategoryProducts   from './components/Categories/Actions/ShowProductsByCategory';

import Profile from './components/Account';
import Logout from './components/Auth/Logout';
import Login from './components/Auth/Login';
import ForgotPassword from './components/Auth/ForgotPassword';
import Products from './components/Products/products';

export default class Router extends Component {
    render() {
        return (
            <BrowserRouter>
                <Switch>
                    <Route exact path="/login" component={Login}/>
                    <Route exact path="/forgot-password" component={ForgotPassword}/>

                    <Route exact path="/" component={Protected(Home)}/>
                    <Route path="/profile" component={Protected(Profile)}/>
                    <Route exact path="/categories" component={Protected(Categories)}/>
                    <Route exact path="/categories/subcat:mainid" component={Protected(SubCategories)} />
                    <Route exact path="/categories/products:id" component={Protected(CategoryProducts)} />
                    
                    <Route path="/products" component={Protected(Products)} />


                    <Route path="/logout" component={Logout}/>
                </Switch>
            </BrowserRouter>
        );
    }
}
