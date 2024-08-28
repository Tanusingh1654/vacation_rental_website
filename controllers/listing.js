const Listing=require("../models/listing.js");

module.exports.index= async(req,res)=>{
    let listing=await Listing.find({})
    // console.log(listing);
    res.render("listings/index.ejs",{listing});
};

module.exports.renderNewForm=(req,res)=>{
    res.render("listings/newList.ejs");
};

module.exports.showListing= async (req,res)=>{
    let {id}=req.params;
    let list=await Listing.findById(id)
    .populate({path:"reviews",
     populate:{path:"author",
        select: 'username' 
     },
    })
    .populate("owner");
    // console.log(list);
    if(!list){
        
        req.flash("error","listing u are trying to get does not exist");
      return   res.redirect("/listings");
    }
    res.render("listings/list.ejs",{list});
}

module.exports.editListing=async(req,res)=>{
    let {id}=req.params;
    let list=await Listing.findById(id);
    if(!list){
        req.flash("error","listing u are trying to get does not exist");
        res.redirect("/listings");
    }
    
    res.render("listings/edit.ejs",{list});
}

module.exports.saveNewListing=async(req,res,next)=>{
   let url=req.file.path;
   let fileName=req.file.filename;
   
    const newList=new Listing(req.body.listing);
    newList.owner=req.user._id;
    newList.image={url,fileName}; 
    await newList.save();
    req.flash("success","New Listing created");
    res.redirect("/listings");


}

module.exports.editListing= async(req,res)=>{
    let {id}=req.params;
     await Listing.findByIdAndUpdate(id,{...req.body.listing})
     req.flash("success","listing udated");
     res.redirect(`/listings/${id}`);
}

module.exports.destroyListing= async(req,res)=>{
    let {id}=req.params;

     await Listing.findByIdAndDelete(id);
     req.flash("success","listing deleted");
    
    res.redirect("/listings");
}