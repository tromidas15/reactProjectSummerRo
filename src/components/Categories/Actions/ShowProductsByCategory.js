import React, {Component} from 'react';
import Layout from '../../Layout/Layout';
import TableDesign from '../../Misc/Table';
import http from '../../../libs/http';
import uniqueId from 'react-html-id';
import {AlertMod} from '../../Misc/Alert';
import {getCurentPage} from '../../../Services/GetCurrentPage';
import {columns} from '../ObjectsAttr/table';

export default class CategoryProducts extends Component {


    constructor(props) {
        super(props);

        uniqueId.enableUniqueIds(this);

        this.state = {
            product: [],

            reRender: false,
            totalPages : '',
            currentPage : 1,

            next : true,
            prev: false,

            loading : true,
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
        }

    }

    async componentDidMount() {
        await this._getProducts();
        this.setState({
            loading : false,
        })

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


    _getProducts = async () => {

        const {id} = this.props.match.params;

        let res = await http.route(`product/${id}`).get({page : this.state.currentPage});

        if (!res.isError) {

            let product = res.data;

            this.setState({
                product,
                reRender: false,
                totalPages:res.pagination.totalPages
            });

        } else {

           alert("Something went wrong!!!")

        }
    };



    _edit = () => {



    };

    _delete = () => {


    };

    render(){ 

        const {product , loading} = this.state;

     

        return (
            
        loading ? 

        <Layout></Layout> : product.length == 0 ? 



            <Layout>
                <div>
                    <h1 style={{marginLeft: "40%"}}>There are no products</h1>
                </div>
            </Layout> 

        :

            <Layout>
                <div className="content-wrapper"> 
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
