export const validate = (n)=>{

    const {name , category_id , description , full_price , quantity } = n;

    var errors = []


    if(name == ""){

        errors.name = "Name Required";

    }

    if(category_id == 0)
    {
        errors.category_id = "You must select a category";
    }

    if(description == "")
    {
        errors.description = "Description Required";
    }

    if(quantity == "")
    {
        errors.quantity = "Quantity Required";
    }

    if(full_price == "")
    {
        errors.full_price = "Price Required";
    }



    if(errors.name || errors.category || errors.description || errors.quantity || errors.sales_price)
    {

        return errors

    }else{

        return true

    }


}