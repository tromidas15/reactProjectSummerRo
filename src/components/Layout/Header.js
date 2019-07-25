import React, {Component} from 'react';
export default class Header extends Component {

    render() {
        return (
          <header className="main-header">
          <a href="#" className="logo" style={{heigth: '60px !important'}}>

              <span className="logo-mini"><b>A</b>LT</span>
              <span className="logo-lg"><b>Admin</b>LTE</span>
          </a>
          <nav className="navbar navbar-static-top">
              <a className="sidebar-toggle" data-toggle="push-menu" role="button">
                  <span className="sr-only">Toggle navigation</span>
              </a>
                    
          </nav>
      </header>
        );
    }
}