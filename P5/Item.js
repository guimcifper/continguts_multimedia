var Item = function Item(imagen){
	this.image = imagen;
	this.price = 0.00;
    this.name = "JazzPicture";
};

// Get random price in range min, max
Item.prototype.getPrice = function(){
	var min = 5.99;
	var max = 99.99;
	return (Math.random() * (max - min) + min).toFixed(2);
}

exports.Item = Item;
