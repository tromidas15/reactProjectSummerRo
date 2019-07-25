import React, {Component} from 'react';
import Layout from '../Layout/Layout';
import TableDesign from '../Misc/Table';
import http from '../../libs/http';
import CustomModal from "../Misc/CustomModal";
import uniqueId from 'react-html-id';
import {Button, FormGroup, Input, Label} from "reactstrap";
import {AlertMod} from '../Misc/Alert';
import {getCurentPage} from '../../Services/GetCurrentPage';
import {columns} from './ObjectsAttr/tableAttr';
import {validate} from '../../Services/Validator';
export default class SubCategories extends Component {


    constructor(props) {
        super(props);

        uniqueId.enableUniqueIds(this);

        this.state = {
            parentCategories: [],
            categories: [],
            showModal: false,
            category: {
                id: '',
                name: '',
                parent_id: ''
            },

            validateErrors : [],

            reRender: false,
            mode: 'save',
            totalPages : '',
            currentPage : 1,

            next : true,
            prev: false,

            loading : true,

            actionBlock : false,
        };
    };

    _toggle = () => {
        const {showModal} = this.state;

        this.setState({

            showModal: !showModal
            
        });
    };


    async componentDidUpdate(prevProps, prevState, snapshot) {
        

        

        const {reRender} = this.state;

        if (!prevState.reRender && reRender) {

            await this._getCategories();

            this.setState({
                actionBlock: false
            })

        }


    }

    async componentDidMount() {

        await this._getCategories();

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
        })

    }



    _getCategories = async () => {

        const {mainid} = this.props.match.params;

        let res = await http.route(`category/${mainid}`).get({page : this.state.currentPage});

        let all = await http.route('categories').get("GetParrents");

        if (!res.isError) {
            let categories = res.data;

            let parents=all.data;

            let parentCategories = [];

            parents.length > 0 && parents.map((item, k) => {
                if (item.parent_id == 0) {
                    parentCategories.push(item);
                }
            });

            this.setState({
                categories,
                parentCategories,
                reRender: false,
                totalPages:res.pagination.totalPages
            });

        } else {

            AlertMod({title :'A aparut o problema' })

        }
        if(res){
            this.setState({
                loading : false
            })
        }
    };




    _save = async () => {
        const {category} = this.state;
        
        let request = {
            name: category.name
        };
        let validator  = validate(request);

        if(this.state.actionBlock){
            return false
        }

        this.setState({
            actionBlock: true
        })

        if(validator !== true){
            
            this.setState({
                validateErrors : validator,
                actionBlock:false
            });
            return false;
        }

        if (category.parent_id != '' && category.parent_id != 0) {
            request.parent_id = category.parent_id;
        }

        let res = await http.route(`category/${category.id}`).patch(request);
        if(res.isError == false){
            alert("Success!!!");
        }else{
            alert("Something went wrong");
        }

        this.setState({
            showModal: false,
            reRender: true,

        });
    };

    _edit = (item) => {

        this.setState({
            category: item,
            showModal: true,
            mode: 'edit'
        });

    };



    _deleteAllProducts = async (e) => {

        
        let res = await http.route(`product/delall/${e}`).delete();

        if(res.isError == false){

            alert("Success!!!");

            this.setState({
                reRender: true,
            });        

        }else{
            alert("Something went wrong!!!");
        }
    }


    _delete = async(id) => {
        let res = await http.route(`category/${id}`).delete();

         if(res.errorMessage.error){

                AlertMod({
                    title :'This category has products',
                    message :"Do you want to delete all products?" , 
                    id: id ,
                    method : this._deleteAllProducts
                })

            }else{

                alert("Success");

            }

            this.setState({
                reRender: true,
                
            });

    };

    _onChangeCategory = e => {
        const {category} = this.state;
        const {name, value} = e.target;

        this.setState({
            category: {
                ...category,
                [name]: value
            }
        });
    };

    render() {
        const {categories, showModal, category, parentCategories, mode , loading} = this.state;
        console.log(categories.length)
        return ( loading ? <Layout> </Layout> : categories.length !== 0 ? 
        
            <Layout>
                
                    
                    <CustomModal title={mode === 'add' ? 'Add category' : 'Edit category'}
                                toggle={this._toggle}
                                showModal={showModal}
                                actionText="Save"
                                action={this._save}>
                        <FormGroup>
                            <Label for={this.nextUniqueId()}>Name</Label>
                            <Input type="text" name="name" value={category.name} id={this.lastUniqueId()}
                                placeholder="Name..." onChange={this._onChangeCategory}/>
                        </FormGroup>
                        <p className="validate-error">{this.state.validateErrors.name ? this.state.validateErrors.name : ""}</p>
                        <FormGroup>
                            <Label for={this.nextUniqueId()}>Parent category</Label>
                            <Input type="select" name="parent_id" id={this.lastUniqueId()}

                                value={category.parent_id} onChange={this._onChangeCategory}>

                                <option value={0}>Select</option>

                                {parentCategories.length > 0 && parentCategories.map((item, k) => {

                                    if (item.id !== category.id) {

                                        return <option key={k} value={item.id}>{item.name}</option>;

                                    }

                                })}
                            </Input>
                        </FormGroup>
                    </CustomModal>

                    <div className="content-wrapper"> 

                        <TableDesign
                            title = "SubCategories"

                            columns={columns}

                            items={categories}
                            
                            editItem={this._edit}
                            
                            deleteItem={this._delete}
                            
                            totalPages={this.state.totalPages}
                            
                            page ={this._getCurentPage}
                            
                            next = {this.state.next}
                            
                            prev = {this.state.prev}
                        
                        />
                    </div>
            </Layout>
        
        :<Layout>

            <div className="content-wrapper"> 

                <h1>There are no Subcategories!!!</h1>

            </div>

        </Layout>) 

        
    }
}
