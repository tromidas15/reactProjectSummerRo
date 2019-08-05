import React, {Component} from 'react';
import {NavLink , Link} from "react-router-dom";


export default class SideBar extends Component {



    render(){
        return (
          <aside className="main-sidebar">
            <section className="sidebar">
              <ul className="sidebar-menu" data-widget="tree">
              <Link to={"/logout"} className="btn btn-dark" style={{width : "100%"}}>Logout</Link>
                <li className="header">Navigation</li>

                <li className="active treeview menu-open">
                <Link to ='/user'>
                      <i className="fa fa-user" /> <span>My Profile</span>
                      <span className="pull-right-container">

                      </span>
                    </Link>
                  <a href="#">
                    <i className="fa fa-dashboard" /> <span>Dashboard</span>
                    <span className="pull-right-container">
                      <i className="fa fa-angle-left pull-right" />
                    </span>
                  </a>
                  <ul className="treeview-menu">
                    <li><NavLink exact to={'/products'} activeClassName = "active-link" value = 'Products'><i className="fa fa-circle-o" /> Products</NavLink></li>
                    <li><NavLink exact to={'/categories'} activeClassName = "active-link"  value='Categories'><i className="fa fa-circle-o" /> Categories</NavLink></li>
                    <li><NavLink exact to={'/users'} activeClassName = "active-link"  value='Users'><i className="fa fa-circle-o" /> Users List</NavLink></li>
                  </ul>
                </li>
            </ul>
            
            </section>
          </aside>
        )
    }
}