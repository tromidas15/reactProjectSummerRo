import React, {Component} from 'react';
import Layout from '../Layout/Layout';
import TableDesign from '../Misc/Table';
import http from '../../libs/http';
import CustomModal from "../Misc/CustomModal";
import uniqueId from 'react-html-id';
import {Button, FormGroup, Input, Label , Alert } from "reactstrap";
import {AlertMod} from '../Misc/Alert';
import {validate} from '../../Services/Validator';
import {getCurentPage} from '../../Services/GetCurrentPage';
import {columns} from './ObjectsAttr/table';

export default class Users extends Component {


    constructor(props) {
        super(props);

        uniqueId.enableUniqueIds(this);

        this.state = {
            users: [],

            showModal: false,
            user: {
                id: '',
                name: '',
                password : '',
                email:"",
                type:"0",
            },

            selectedFile : '',

            action: true,

            reRender: false,
            mode: 'add',
            totalPages : '',
            currentPage : 1,

            next : true,
            prev: false,

            validateErrors : [],

            actionBlock : false,

        };
    };

    _toggle = () => {
        const {showModal} = this.state;

        this.setState({
            showModal: !showModal
        });
    };

    async componentDidUpdate( prevState) {
        const {reRender} = this.state;

        if (!prevState.reRender && reRender) {
            await this._getUser();

            this.setState({
                actionBlock: false
            })
        }

    }

    async componentDidMount() {
        await this._getUser();
    }

    _getCurentPage=(p)=>{
        var currentPage = getCurentPage({
            p,
            actualPage : this.state.currentPage,
            totalPages : this.state.totalPages,
            next : this.state.next,
            prev : this.state.prev
        });

        currentPage = currentPage[0];

        const {next , prev, actualPage , reRender} = currentPage;

        this.setState({
            next ,
            prev,
            currentPage : actualPage,
            reRender,
        });

    }


    _getUser = async () => {

        let res = await http.route('user/getAll').get({page : this.state.currentPage});

        if (!res.isError) {

            let users = res.data;

            this.setState({
                users,
                reRender: false,
                totalPages:res.pagination.totalPages
            });

        } else {

            if(res.errorMessage.error == "AccesDenied"){
                alert("You do not have permissions")
                this.props.history.push("/");
            }

        }
    };

    _addUser = () => {     
            this.setState({  
                        user: {
                            id: '',
                            name: '',
                            email : "",
                            password: '',
                            type : '0',
                        },
                        mode: 'add',
                        showModal: true,
                        validateErrors: [],
                    });

    };



    _save = async () => {

        if(this.state.actionBlock)
        {
            return false;
        }

        this.setState({
            actionBlock : true
        })

        const {user} = this.state

        var validation = validate(user);

        let request = {
            id: user.id,
            name: user.name,
            email : user.email,
            password : user.password,
            type : user.type,
            image : this.state.selectedFile,
        };

        
        if(validation == true){

            if (user.id !== '') {
                let res = await http.route(`/user/update/${user.id}`).patch(request);

                if(res.errorMessage.error =="Image source not readable"){
                    alert(res.errorMessage.error);
                    return false;
                }

                if(res.isError == false){

                    alert("Success!!!");

                    this.setState({
                        showModal : false,
                        reRender : true,
                    })     

                }else{

                    this.setState({
                        validateErrors : res.errorMessage,
                        reRender : true,
                    })

                }
                
            }else{

                let res = await http.route(`user/create`).post(request);

                if(res.errorMessage.error =="Image source not readable"){
                    alert(res.errorMessage.error);
                    return false;
                }

                

                if(res.isError == false){

                    alert("Success!!!");

                    this.setState({
                        showModal : false,
                        reRender : true,
                    });

                }else{
                    alert("Something went wrong");

                    this.setState({
                        validateErrors : res.errorMessage,
                        reRender : true,
                    })

                }
            }
        }else{

            this.setState({
                validateErrors : validation,
                actionBlock : false,
            })

        }
    }

    _edit = (item) => {

        this.setState({
            user:{
                ...this.state.user,
                email : item.email,
                name : item.name,
                type : item.type,
                id: item.id
            },
            showModal: true,
            mode: 'edit',
            validateErrors: []
        });


    };


    _delete = async(id) => {

        if(this.state.actionBlock)
        {
            return false;
        }

        this.setState({
            actionBlock : true
        })

        await http.route(`/user/delete/${id}`).delete();

            this.setState({
                reRender: true,
            });
        alert("Success!!!");
            
    };

    _onChangeUser = e => {

        const {user} = this.state;
        const {name, value} = e.target;

        this.setState({
            user: {
                ...user,
                [name]: value
            }
        });


    };

    _fileCreator(file){

        let reader = new FileReader();

        reader.onload = (e) => {
          this.setState({
            selectedFile: e.target.result
          })
        };

        reader.readAsDataURL(file);
    }

    _fileSelector = e =>{

        let files = e.target.files || e.dataTransfer.files;

        if (!files.length)
              return;

        this._fileCreator(files[0]);
    }

        triggerInputFile = (e) => {
            this.fileInput.click()
        }



    render(){ 

        const {users, showModal, user, mode } = this.state;

     

        return (
            <Layout>
                <CustomModal title={mode}
                             toggle={this._toggle}
                             showModal={showModal}
                             actionText="Save"
                             action={this._save}>
                             
                    <FormGroup>
                        <Label for={this.nextUniqueId()}>Username:</Label>
                        <Input type="text" name="name" value={user.name} id={this.lastUniqueId()}
                               placeholder="Name..." onChange={this._onChangeUser}/>

                               <p className="validate-error">{this.state.validateErrors.name ? this.state.validateErrors.name : ""}</p>

                        <Label for={this.nextUniqueId()}>Email :</Label>
                        <Input type="email" name="email" value={user.email} id={this.lastUniqueId()}
                               placeholder="Email..." onChange={this._onChangeUser} />

                               <p className="validate-error">{this.state.validateErrors.email? this.state.validateErrors.email : ""}</p>

                        <Label for={this.nextUniqueId()}>Password:</Label>
                        <Input type="password" name="password" value={user.password} id={this.lastUniqueId()}
                               placeholder="password..." onChange={this._onChangeUser} />

                               <p className="validate-error">{this.state.validateErrors.password ? this.state.validateErrors.password : ""}</p>

                        <FormGroup>
                            <Label for={this.nextUniqueId()}>Select</Label>
                            <Input type="select" name="type"  onChange={this._onChangeUser} value={this.state.user.type}  id={this.lastUniqueId()}>
                                    {this.state.user.type == "0" ?    <React.Fragment> <option value="0">Normal User</option>
                                    <option value="1">Admin</option> </React.Fragment> :<React.Fragment>  <option value="1">Admin</option>
                                    <option value="0">Normal User</option></React.Fragment> }
                            </Input>
                        </FormGroup>

                        <Label >Image:</Label>
      
                        <Input type="file" name="photo" value={user.selectedFile}  onChange={this._fileSelector }/> 
                        
                        <p className="validate-error">{this.state.validateErrors.image ? this.state.validateErrors.image : ""}</p>                           
                    </FormGroup>
                </CustomModal>

                <div className="content-wrapper"> 

                <Button onClick={this._addUser} style={{width: "100%", minHeight: "40px"}}>Add User</Button>

                    <TableDesign
                        title = "Users"
                        columns={columns}
                        items={users}
                        editItem={this._edit}
                        deleteItem={this._delete}
                        totalPages={this.state.totalPages}
                        page ={this._getCurentPage}
                        next = {this.state.next}
                        prev = {this.state.prev}
                    />

                </div>
            </Layout>
        );
    }
}
