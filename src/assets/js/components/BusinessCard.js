var BusinessCard = function(){
    var edit_, data_, dis, ol, callback, elt, oRef
    var init = function(){}

    var renderCard = function(htmlel, _d, _e, cb, _ref){
        edit_ = _e;
        dis = "disabled"
        data_ = _d;
        callback = cb;
        ol = {};
        elt = htmlel
        oRef = _ref;


        
        if(edit_){

//             $("#modalinsidelable").html('<h5 class="modal-title" id="modalinsidelable">Business Card </h5>')
// <div class="modal-header">
// <h5 class="modal-title" id="modalinsidelable">Your Business Card </h5>
// <div class="titleHdng">SHARE YOUR BUSINESS CARD TO NILAY PRAN (THE TIMES OF INDIA - BUSINESS HEAD)</div>
// <button class="close" aria-label="Close" id="modalinsideclose">
// <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11.002" viewBox="0 0 11 11.002">
// <path d="M18.089,16.79l3.929-3.931a.921.921,0,1,0-1.3-1.3l-3.929,3.931-3.929-3.931a.921.921,0,1,0-1.3,1.3l3.929,3.931L11.556,20.72a.921.921,0,0,0,1.3,1.3l3.929-3.931,3.929,3.931a.921.921,0,1,0,1.3-1.3Z" transform="translate(-11.285 -11.289)"></path></svg>
// </button>
// </div>


            var user = EventStore.getUserProfile();
            ol.name = user.firstname + " " + user.lastname
            ol.email = user.email
            ol.phone = user.phone === "" ? "+91-9999999999" : user.phone
            ol.jobtitle = user.jobtitle
            ol.companyname = user.companyname
        }else{
            ol.name = data_.name
            ol.email = data_.email
            ol.phone = data_.phone === "" ? "+91-9999999999" : data_.phone
            ol.jobtitle = data_.jobtitle
            ol.companyname = data_.companyname
        }


        htmlel.html(cartUI(ol));
         if(edit_){ 
           bindEvent();
        }
    }

    var bindEvent = function(){
        $("#modalinsidebody button").off("click").on("click", function(){
            var i = this.id;
            if(i == "edit"){
                callback()
            }else{
                var n = $("#modalinsidebody [name=name]");
                var e = $("#modalinsidebody [name=email]");
                var c = $("#modalinsidebody [name=company]");
                var j = $("#modalinsidebody [name=job]")
                var p = $("#modalinsidebody [name=phone]")
                var o = {};

                o.name = n.val() === "" ? n.attr("placeholder") : n.val();
                o.mail = e.val() === "" ? e.attr("placeholder") : e.val();
                o.company = c.val() === "" ? c.attr("placeholder") : c.val();
                o.job = j.val() === "" ? j.attr("placeholder") : j.val();
                o.phone = p.val() === "" ? p.attr("placeholder") : p.val();

                //POST DATA
                //"f5i9uoz999"
                var fd = new FormData();
                fd.append("resourceid", data_.uuid) 
                Utility.loader({url: "businesscard/share.json", data : fd, type :"POST", cb:function(_d){
                    console.log("done")
                      $(oRef).addClass("disableIcon")
                    //debugger
                }});
                $("#modalinsideclose").click();
            }

        })

    }

    var cartUI = function(_o){
        console.log(_o)
        var str = '<div class="business-card">'
        str += '<div class="row m0">'
        str += '<div class="card-lhs">'
        str += '<div class="card-image">'
        //data_.image !== "" ? str += '<img src="'+data_.image+'">' : 
        str += '<img src="images/card-avatar.svg">'
       // edit_ ? str += '<div class="imageUpload btn btn-primary btn-sm"><i class="material-icons f16">edit</i><input type="file" id="avatar" name="avatar" accept="image/png, image/jpeg"></div>' : ""
        
        str += '</div>'
        str += '<div class="card-name">'
        str += '<div class="form-group m0">'
        str += '<input type="text" class="form-control userName" data-type="edt" name="name" value="'+_o.name+'" disabled>'
        str += '</div>'
        str += '<div class="form-group m0">'
        str += '<input type="text" class="form-control compnay" data-type="edt" name="company" value="'+_o.companyname+'" disabled>'
        str += '</div>'
        str += '<div class="form-group m0">'
        str += '<input type="text" class="form-control designation" data-type="edt" name="job" value="'+_o.jobtitle+'" disabled>'
        str += '</div>'
        str += '</div>'
        str += '</div>'


        str += '<div class="card-rhs">'
        str += '<div class="row mb-2"><i class="material-icons">phone</i>'
        str += '<div class="form-group m0">'
        str += '<input type="text" class="form-control phoneNo" data-type="edt" name="phone"  placeholder="'+_o.phone+'" disabled>'
        str += '</div>'
        str += '</div>'
        str += '<div class="row"><i class="material-icons">email</i>'
        str += '<div class="form-group m0">'
        str += '<input type="email" class="form-control emailId" name="email" placeholder="'+_o.email+'" disabled>'
        str += '</div>'
        str += '</div>'
        str += '</div>'
        str += '</div>'
        str += '</div>'

        if(edit_){
            str += '<div class="modal-footer">'
            str += '<button type="button" id="edit" class="btn btn-secondary btn-sm">Edit <i class="material-icons f16">edit</i></button>'
            //str += '<button type="button" id="shard" class="btn btn-secondary btn-sm">Share <i class="material-icons f16">edit</i></button>'
            
            str += '<button type="button" id="shard" class="btn btn-secondary btn-sm">Share <svg xmlns="http://www.w3.org/2000/svg" width="18.041" height="15.031" viewBox="0 0 18.041 15.031"><path d="M22.383,13.063l-6.628-6.2a.339.339,0,0,0-.263-.113c-.207.009-.47.155-.47.376v3.11a.2.2,0,0,1-.169.193C8.263,11.438,5.487,16.37,4.505,21.49c-.038.2.235.39.362.23a11.979,11.979,0,0,1,9.958-5.045.232.232,0,0,1,.2.225v3.053a.4.4,0,0,0,.681.249l6.675-6.308a.519.519,0,0,0,.164-.395A.629.629,0,0,0,22.383,13.063Z" transform="translate(-4.502 -6.749)"/></svg></button>'
            str += '</div>';
        }
        return str
    }

    var updateCard = function(_d){
        elt.html(cartUI(_d));
        //cartUI(_d);
        bindEvent();
       // debugger
    }

    return {
        init:init,
        renderCard:renderCard,
        updateCard:updateCard
    }

}

