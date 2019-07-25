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

export default class Products extends Component {


    constructor(props) {
        super(props);

        uniqueId.enableUniqueIds(this);

        this.state = {
            product: [],
            categories: [],
            showModal: false,
            products: {
                id: '',
                name: '',
                description : '',
                quantity : null,
                full_price : "",
                category_id: null, 
            },

            action: true,

            selectedFile : null,

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
            await this._getProducts();

            this.setState({
                actionBlock: false
            })
        }

    }

    async componentDidMount() {
        await this._getProducts();
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
        });

    }

    _getCategories = async() => {

        let res = await http.route('categories').get("GetAll");

        if (!res.isError) {

            this.setState({
                categories : res.data
            })

        }

    }

    _getProducts = async () => {

        let res = await http.route('products').get({page : this.state.currentPage});

        if (!res.isError) {

            let product = res.data;

            this.setState({
                product,
                reRender: false,
                totalPages:res.pagination.totalPages
            });

        } else {

            AlertMod({title :'A aparut o problema'});

        }
    };

    _addProduct = () => {     
            this.setState({  
                        products: {
                            id: '',
                            name: '',
                            quantity: '',
                            description : '',
                            full_price : "",
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

        const {products} = this.state

        var validation = validate(products);

        let request = {
            id: products.id,
            name: products.name,
            description : products.description,
            quantity : products.quantity,
            full_price : products.full_price,
            category_id : products.category_id,
            image :  this.state.selectedFile,
        };

        
        if(validation == true){

            if (products.id !== '') {
            
                let res = await http.route(`product/${products.id}`).patch(request);

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

                let res = await http.route(`product`).post(request);

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
            products: item,
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

        await http.route(`product/${id}`).delete();

            this.setState({
                reRender: true,
            });
        alert("Success!!!");
            
    };

    _onChangeProduct = e => {

        const {products} = this.state;
        const {name, value} = e.target;

        this.setState({
            products: {
                ...products,
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

        const {product, showModal, products, mode , categories} = this.state;

     

        return (
            <Layout>
                <CustomModal title={'Edit Products'}
                             toggle={this._toggle}
                             showModal={showModal}
                             actionText="Save"
                             action={this._save}>
                             
                    <FormGroup>
                        <Label for={this.nextUniqueId()}>Name</Label>
                        <Input type="text" name="name" value={products.name} id={this.lastUniqueId()}
                               placeholder="Name..." onChange={this._onChangeProduct}/>

                               <p className="validate-error">{this.state.validateErrors.name ? this.state.validateErrors.name : ""}</p>

                        <Label for={this.nextUniqueId()}>Description</Label>
                        <textarea type="text" name="description" className="description-area" value={products.description} id={this.lastUniqueId()}
                               placeholder="Description" onChange={this._onChangeProduct}></textarea>

                               <p className="validate-error">{this.state.validateErrors.description ? this.state.validateErrors.description : ""}</p>
                               
                        <Label for={this.nextUniqueId()}>Quantity</Label>
                        <Input type="text" name="quantity" value={products.quantity} id={this.lastUniqueId()}
                               placeholder="Quantity..." onChange={this._onChangeProduct}/>

                               <p className="validate-error">{this.state.validateErrors.quantity ? this.state.validateErrors.quantity : ""}</p>
                        
                        <Label for={this.nextUniqueId()}>Full Price</Label>
                        <Input type="text" name="full_price" value={products.full_price} id={this.lastUniqueId()}
                               placeholder="Full Price..." onChange={this._onChangeProduct}/>

                               <p className="validate-error">{this.state.validateErrors.full_price ? this.state.validateErrors.full_price : ""}</p>

                        <Label for={this.nextUniqueId()}>Parent category</Label>
                        <Input type="select" name="category_id" id={this.lastUniqueId()} onChange={ this._onChangeProduct} >
                                <option value={0}>Select</option>
                                {categories.length > 0 && categories.map((item, k) => {
                                    if(products.category_id !== item.id){
                                        return <option key={k} value={item.id}>{item.name}</option>;
                                    }
                                })}
                            </Input>

                            <p className="validate-error">{this.state.validateErrors.category_id ? this.state.validateErrors.category_id : ""}</p>

                        <Label >Image:</Label>
      
                        <Input type="file" name="photo" value={products.selectedFile}  onChange={this._fileSelector }/> 
                        
                        <p className="validate-error">{this.state.validateErrors.image ? this.state.validateErrors.image : ""}</p>                           
                    </FormGroup>
                </CustomModal>

                <div className="content-wrapper"> 

                <Button onClick={this._addProduct} style={{width: "100%", minHeight: "40px"}}>Add Products</Button>

                    <TableDesign
                        title = "Products"
                        columns={columns}
                        items={product}
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
