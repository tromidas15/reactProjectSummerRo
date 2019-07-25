import React from "react"

export const getCurentPage = ({p , actualPage , totalPages , next , prev}) => {
    p.preventDefault();
    let currentPage=p.target.value;
    
    var pagination = [];
    switch (currentPage){
        case 'next':
            currentPage = actualPage 
            currentPage++
        if(currentPage < totalPages){
            if(currentPage == (totalPages -1)){
                pagination=[{
                    actualPage : currentPage,
                    reRender:true,
                    prev: true,
                    next:false,
                }]
            }else{
                pagination=[{
                    actualPage : currentPage,
                    reRender:true,
                    prev: true,
                }]
            }
        }else{
            pagination=[{
                next: false,
                prev: true,
                actualPage : currentPage,
                reRender:true
            }]
        }
        break;
        case "prev":

            currentPage = actualPage-1

            if(currentPage > 1){
            
                pagination = [{
                    actualPage : currentPage ,
                    next,
                    prev,
                    reRender:true
                }]

                if(currentPage == 1){
                    pagination=[{
                        next: true,
                        prev: false,
                        reRender:true,
                        actualPage : currentPage ,
                    }]
                }
            }else{
                pagination=[{
                    next: true,
                    prev: false,
                    reRender:true,
                    actualPage : currentPage ,
                }]
            }          
        break;  
        default:
            currentPage=p.target.value;
            if(currentPage == 1){
                pagination = [{
                    actualPage : currentPage ,
                    next: true,
                    prev: false,
                    reRender:true               
                }]
            }else if(currentPage == totalPages){
                pagination=[{
                    actualPage : currentPage ,
                    next: false,
                    prev: true ,
                    reRender:true               
                }]
            }else{
                
                pagination=[{
                    actualPage: currentPage ,
                    next: true,
                    prev: true ,
                    reRender:true               
                }]       
            }

    }

    return pagination
}