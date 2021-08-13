exports.find_element = async (query,model) => {
    let element;
    try{
       element = await model.findOne(query);
    }catch(err){
       
        return false;
    }
    return element;
    
}