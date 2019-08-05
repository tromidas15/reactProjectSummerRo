import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { Table , Pagination, PaginationItem, PaginationLink } from 'reactstrap';
import {Link} from 'react-router-dom';
export default class TableDesign extends Component {
    static propTypes = {
        columns: PropTypes.array.isRequired,
        items: PropTypes.array.isRequired,
        editItem: PropTypes.func.isRequired,
        deleteItem: PropTypes.func.isRequired
    };


    render() {
        const {columns, items, editItem, deleteItem , totalPages , page , next , prev , title , showdetailsLink , showProducts} = this.props;
        const listpages = []
        var count = 1
        if(totalPages <= 1){

        }else{
            listpages.push(
                <PaginationItem key={count+"a"}  disabled = {!prev}>
                    <PaginationLink  value={"prev"} onClick ={(e) => page(e)} >Prev</PaginationLink>
                </PaginationItem>        
                )
        for (let index = 0; index < totalPages; index++) {
            
          listpages.push(
        <PaginationItem key={index} >
            <PaginationLink  value={count} onClick ={(e) => page(e)}>
                {count}
            </PaginationLink>
        </PaginationItem>)
        count ++
        }
        listpages.push(
            <PaginationItem key = {count+'b'} disabled = {!next} >
                <PaginationLink  value={"next"}  onClick ={(e) => page(e)} >Next </PaginationLink>
            </PaginationItem>
        )
        }

        return (
               
    <div className="row">
        <div className="col-md-12">
          <div className="box">
            <div className="box-header with-border">
              <h3 className="box-title">{title}</h3>
            </div>
            <div className="box-body">
            <Table hover responsive>
                <thead>
                    <tr>
                        {columns.map((value, key) => {
                            return <th key={key}>{value.name}</th>;
                        })}
                    </tr>
                </thead>
                <tbody>
                {items.map((item, k) => {

                        return <tr key={k} >
                            {columns.map((value, key) => {

                                if (value.property === 'actions') {
                                    return <td key={key}>
                                        <span className="btn btn-primary" onClick={() => editItem(item)}>Edit</span>

                                        <span className="btn btn-danger" onClick={() => deleteItem(item.id)}  style={{marginLeft: "3px"}}>Delete</span>

                                        {showProducts ? <span className="btn btn-info"   style={{marginLeft: "3px"}}><Link to={ showProducts.Link+item.id} style={{color:"white"}}> {showProducts.Title}</Link></span> : "" }

                                        {showdetailsLink ? item.parent_id == 0 ?  <span className="btn btn-secondary"   style={{marginLeft: "3px"}}><Link to={ showdetailsLink.Link+item.id} style={{color:"white"}} target = "_blank"> {showdetailsLink.Title}</Link></span> : "" : "" }
                                       
                                    </td>;
                                }

                                    

                                if(value.property !== "photo" && value.property !== "picture"){
                                    if(value.property == "type"){
                                       return item[value.property]== 0 ? <td className="table-item" key={key}>Normal User</td> : <td className="table-item" key={key}>Admin</td>
                                    }
                                    return <td className="table-item" key={key}>{item[value.property]}</td>;
                                }else{
                                    let image = item[value.property] ? item[value.property] : "noimage.jpg";
                                    return <td className="table-item" key={key}><img src ={`http://roweb.com/storage/${image}`}  width="80px" height="60px"/></td>;
                                }
                                
                            })}
                        </tr>;
                    })}
                </tbody>
            </Table>
            </div>
            <div className="box-footer clearfix">
            <div style={{float: "right"}}>
            <Pagination aria-label="Page navigation example" >

                    {listpages}

            </Pagination>
                </div>
                </div>
        </div>
        </div>
        </div>
        );
    }
}
