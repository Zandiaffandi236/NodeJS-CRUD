var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
    req.getConnection(function(err, connection) {
        var query = connection.query('SELECT * FROM item', function(err, rows) {
            if (err)
                var errornya = ('Error Selecting : %s', err);
                req.flash('msg_error', errornya);
                res.render('item/list-item', {title: 'Customers', data:rows});
        });
    });
});

router.get('/addItem', function(req, res, next) {
    res.render(	'item/add-item', 
    { 
        title: 'Add New Item',
        itemcode: '',
        name: '',
        brand: '',
        unit:'',
        total:'',
        price:'',
    });
});

router.post('/addItem', function(req, res, next) {
    req.assert('itemcode', 'Please fill the item code').notEmpty();
    req.assert('name', 'Please fill the name').notEmpty();
    req.assert('brand', 'Please fill the brand').notEmpty();
    req.assert('unit', 'Please fill the unit').notEmpty();
    req.assert('total', 'Please fill the total').notEmpty();
    req.assert('price', 'Please fill the price').notEmpty();
    var errors = req.validationErrors();
    if (!errors) {

        v_itemcode = req.sanitize( 'itemcode' ).escape().trim(); 
        v_name = req.sanitize( 'name' ).escape().trim(); 
        v_brand = req.sanitize( 'brand' ).escape().trim();
        v_unit = req.sanitize( 'unit' ).escape().trim();
        v_total = req.sanitize( 'total' ).escape();
        v_price = req.sanitize( 'price' ).escape();

        var item = {
            itemcode: v_itemcode,
            name: v_name,
            brand: v_brand,
            unit: v_unit,
            total: v_total,
            price : v_price
        }

        var insert_sql = 'INSERT INTO item SET ?';
        req.getConnection(function(err,connection){
            var query = connection.query(insert_sql, item, function(err, result){
                if(err)
                {
                    var errors_detail  = ("Error Insert : %s ",err );   
                    req.flash('msg_error', errors_detail); 
                    res.render('item/add-item', 
                    { 
                        itemcode: req.param('itemcode'), 
                        name: req.param('name'), 
                        brand: req.param('brand'),
                        unit: req.param('unit'),
                        total: req.param('total'),
                        price: req.param('price'),
                    });
                }else{
                    req.flash('msg_info', 'Create Item success'); 
                    res.redirect('/item');
                }		
            });
        });
    }else{
        console.log(errors);
        errors_detail = "Sory there are error <ul>";
        for (i in errors) 
        { 
            error = errors[i]; 
            errors_detail += '<li>'+error.msg+'</li>'; 
        } 
        errors_detail += "</ul>"; 
        req.flash('msg_error', errors_detail); 
        res.render('item/add-item', 
        { 
            itemcode: req.param('itemcode'),
            name: req.param('name'), 
        });
    }

});

router.get('/editItem/(:id)', function(req,res,next){
    req.getConnection(function(err,connection){
        var query = connection.query('SELECT * FROM item where id='+req.params.id,function(err,rows)
        {
            if(err)
            {
                var errornya  = ("Error Selecting : %s ",err );  
                req.flash('msg_error', errors_detail); 
                res.redirect('/item'); 
            }else
            {
                if(rows.length <=0)
                {
                    req.flash('msg_error', "Customer can't be find!"); 
                    res.redirect('/item');
                }
                else
                {	
                    console.log(rows);
                    res.render('item/edit-item',{title:"Edit ",data:rows[0]});

                }
            }

        });
    });
});

router.put('/editItem/(:id)', function(req,res,next){
    req.assert('itemcode', 'Please fill the item code').notEmpty();
    req.assert('name', 'Please fill the name').notEmpty();
    req.assert('brand', 'Please fill the brand').notEmpty();
    req.assert('unit', 'Please fill the unit').notEmpty();
    req.assert('total', 'Please fill the total').notEmpty();
    req.assert('price', 'Please fill the price').notEmpty();
    var errors = req.validationErrors();
    if (!errors) {
        v_itemcode = req.sanitize( 'itemcode' ).escape().trim(); 
        v_name = req.sanitize( 'name' ).escape().trim(); 
        v_brand = req.sanitize( 'brand' ).escape().trim();
        v_unit = req.sanitize( 'unit' ).escape().trim();
        v_total = req.sanitize( 'total' ).escape();
        v_price = req.sanitize( 'price' ).escape();

        var item = {
            itemcode: v_itemcode,
            name: v_name,
            brand: v_brand,
            unit: v_unit,
            total: v_total,
            price : v_price
        }

        var update_sql = 'update item SET ? where id = '+req.params.id;
        req.getConnection(function(err,connection){
            var query = connection.query(update_sql, item, function(err, result){
                if(err)
                {
                    var errors_detail  = ("Error Update : %s ",err );   
                    req.flash('msg_error', errors_detail); 
                    res.render('item/editItem', 
                    { 
                        itemcode: req.param('itemcode'), 
                        name: req.param('name'), 
                        brand: req.param('brand'),
                        unit: req.param('unit'),
                        total: req.param('total'),
                        price: req.param('price'),
                    });
                }else{
                    req.flash('msg_info', 'Update Item success'); 
                    res.redirect('/item'); 
                }		
            });
        });
    }else{

        console.log(errors);
        errors_detail = "Sory there are error <ul>";
        for (i in errors) 
        { 
            error = errors[i]; 
            errors_detail += '<li>'+error.msg+'</li>'; 
        } 
        errors_detail += "</ul>"; 
        req.flash('msg_error', errors_detail); 
        res.render('item/add-item', 
        { 
            name: req.param('name'), 
            address: req.param('address')
        });
    }
});

router.delete('/deleteItem/(:id)', function(req, res, next) {
	req.getConnection(function(err,connection){
		var item = {
			id: req.params.id,
		}
		
		var delete_sql = 'delete from item where ?';
		req.getConnection(function(err,connection){
			var query = connection.query(delete_sql, item, function(err, result){
				if(err)
				{
					var errors_detail  = ("Error Delete : %s ",err);
					req.flash('msg_error', errors_detail); 
					res.redirect('/item');
				}
				else{
					req.flash('msg_info', 'Delete Item Success'); 
					res.redirect('/item');
				}
			});
		});
	});
});

module.exports = router; 