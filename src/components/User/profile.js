import React, {Component} from 'react';
import Layout from '../Layout/Layout';
import http from '../../libs/http';
import uniqueId from 'react-html-id';
import {AlertMod} from '../Misc/Alert';
import {validate} from '../../Services/Validator';
import {columns} from './ObjectsAttr/table';
import { Card, Button, CardBody, CardTitle, CardText, CardImg } from 'reactstrap';
export default class Profile extends Component {

    constructor(props){
        super(props)
    }

render() {
    const {name , type , email, picture} =this.props.user;


    return(
        <Layout>
            <div className="content-wrapper"> 
            <Card>
                <CardImg style={{width : "20%" , heigth: "20%"}} src={`http://roweb.com/storage/${picture}`} alt="Card image cap" />
                <CardBody>
                <CardTitle>User : {name}</CardTitle>
                <CardText>Email : {email}</CardText>
                <CardText>
                    Type : {type == 1 ? "Admin" : "Normal" }
                </CardText>
                </CardBody>
            </Card>
            </div> 
        </Layout>
    )
}
 
}
