/* ########## Search ########## */
     $("#filter").keyup(function () {
         // Retrieve the input field text and reset the count to zero
         var filter = $(this).val(),
             count = 0;
         // Loop through the comment list
         $('#results .item').each(function () {
             // If the list item does not contain the text phrase fade it out
             if ($(this).text().search(new RegExp(filter, "i")) < 0) {
                 $(this).hide();  // MY CHANGE
                 // Show the list item if the phrase matches and increase the count by 1
             } else {
                 $(this).show(); // MY CHANGE
                 count++;
             }
         });
     });

/* ########## Order ########## */
var order = {};
var cost = 0;
var flag = false;
var cartBtn = $("#cart-btn");
var orderBtn = $("#order-btn");

cartBtn.attr("disabled", true);


$('.minus-btn').on('click', function (e) {
    e.preventDefault();
    var $this = $(this);
    var item_code = $this.attr('id').split("_")[1];
    var price = $this.attr('id').split("_")[2];
    var $input = $this.closest('div').find('input');
    var value = parseInt($input.val());


    if (value > 0) {
        value = value - 1;
        cost -= parseInt(price);

    } else {
        value = 0;
    }
    if (item_code in order) {
        if (value === 0) {
            delete order[item_code];
        } else {
            order[item_code] = value;
        }
    }
    orderBtn.html("Place Order (" + cost + " MMK)");

    if (Object.keys(order).length === 0) {
        if (cartBtn.html() !== "Show All") {
            cartBtn.attr("disabled", true);
            flag = false;
        }
        orderBtn.html("Place Order");
    } else {
        cartBtn.removeAttr("disabled");
    }
    $input.val(value);
});

$('.plus-btn').on('click', function (e) {
    e.preventDefault();
    var $this = $(this);
    var item_code = $this.attr('id').split("_")[1];
    var price = $this.attr('id').split("_")[2];
    var $input = $this.closest('div').find('input');
    var value = parseInt($input.val());

    if (value < 100) {
        value = value + 1;
        cost += parseInt(price);
    } else {
        value = 100;
    }

    orderBtn.html("Place Order (" + cost + " MMK)");
    flag = true;
    cartBtn.html("View Cart");
    cartBtn.removeAttr("disabled");
    order[item_code] = value;
    $input.val(value);
});

orderBtn.on('click', function (e) {
    if (cost === 0) {
        $.notify("Order minimum one item", "error");
        return
    }
    var data = {
        'customer_id': $("#cid").val(),
        'order': order,
    };
    $.ajax({
        type: "POST",
        url: "https://live-v3-api.getalice.ai/chicken/online-order",
        data: JSON.stringify(data),
        success: function (data) {
            MessengerExtensions.requestCloseBrowser(function success() {
                // webview closed
            }, function error(err) {
                // an error occurred
            });
            $.notify("Order placed successfully! Please close the window.", "success");
        }
    });
});
cartBtn.on('click', function () {
    if (flag) {
        $('#results .item').each(function () {
            let item_code = $(this).attr('id').split("_")[1];
            var $p = $(this).parent();
            if (item_code in order) {
                $p.css("max-height=0 px", $p.prop('scrollHeight') + "px");
                $(this).show();
            } else {
                $(this).hide();
            }
        });
        flag = false;
        $(this).html("Show All");
    } else {
        $('#results .item').each(function () {
            var $p = $(this).parent();
            $(this).show();
        });
        flag = true;
        $(this).html("View Cart");
    }
});
$('img[data-enlargable]').addClass('img-enlargable').click(function(){
    var src = $(this).attr('src');
    var modal;
    function removeModal(){ modal.remove(); $('body').off('keyup.modal-close'); }
    modal = $('<div>').css({
        background: 'RGBA(0,0,0,.5) url('+src+') no-repeat center',
        backgroundSize: 'contain',
        width:'100%', height:'100%',
        position:'fixed',
        zIndex:'10000',
        top:'0', left:'0',
        cursor: 'zoom-out'
    }).click(function(){
        removeModal();
    }).appendTo('body');
    //handling ESC
    $('body').on('keyup.modal-close', function(e){
      if(e.key==='Escape'){ removeModal(); }
    });
});
