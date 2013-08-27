discos = null;
parties = null;
$.getJSON('discoteques.json',function(dataOb,status){
	discos = dataOb;
	for(num=0;num<dataOb.discoteques.length;num++){
		data = dataOb.discoteques[num];
		li = $('#disco_list').append('<li id="disco_'+data.id+'" data-role="collapsible"></li>');
		$('#main_page ul li:last').append('<h2><div class="main-h2"><figure><img src="img/'+data.image+'" /></figure><p>'+data.name+'</p></div></h2>');
		ul = $('#main_page ul li:last').append('<ul data-role="listview"></ul>');
		ul.trigger('create');
	}
	$('#disco_list').collapsibleset('refresh');						
});			

$.getJSON('parties.json',function(partiesOb,status){
	parties = partiesOb;
	$.each(partiesOb,function(index, value){
		ul = $('#disco_'+value.discoteque_id+' ul')
		ul.append('<li><a href="#data_page?party-id='+index+'">'+value.date+' '+value.name+'</a></li>');		
		$(ul).listview('refresh');
	});
});

// Listen for any attempts to call changePage().
$(document).bind( "pagebeforechange", function( e, data ) {
	// We only want to handle changePage() calls where the caller is
	// asking us to load a page by URL.
	if ( typeof data.toPage === "string" ) {
		// We are being asked to load a page by URL, but we only
		// want to handle URLs that request the data for a specific
		// category.
		var u = $.mobile.path.parseUrl( data.toPage ),
			re = /^#data_page/;

		if ( u.hash.search(re) !== -1 ) {

			// We're being asked to display the items for a specific category.
			// Call our internal method that builds the content for the category
			// on the fly based on our in-memory category data structure.
			showParty( u, data.options );

			// Make sure to tell changePage() we've handled this call so it doesn't
			// have to do anything.
			e.preventDefault();
		}
	}
});

function showParty(urlObj,options){
	var party_id = urlObj.hash.replace( /.*party-id=/, "" ),

	// Get the object that represents the category we
	// are interested in. 
	category = discos.discoteques[party_id],

	// The pages we use to display our content are already in
	// the DOM. The id of the page we are going to write our
	// content into is specified in the hash before the '?'.
	pageSelector = urlObj.hash.replace( /\?.*$/, "" );

	
	if ( category ) {
		// Get the page we are going to dump our content into.
		var $page = $( pageSelector ),

		// Get the header for the page.
		$header = $page.children( ":jqmData(role=header)" ),

		// Get the content area element for the page.
		$content = $page.children( ":jqmData(role=content)" );
		// The markup we are going to inject into the content
		// area of the page.

		$content.html('');
		//Page content
		img = '<img class="flyer" src="img/'+parties[party_id].image+'">';
		name='<h2>'+parties[party_id].name+'</h2>';
		desc='<p>'+parties[party_id].description+'</p>';
		horary='<p>***</p>';
		extra='<p>Muy importante, ir bien vestido.</p>';
		form='<fieldset data-role="fieldcontain">'+
		'<label for="name">Nombre:</label><input type="text" id="name"/>'+
		'<hr />'+
		'<label for="range">Nº de acompañantes:</label><input type="range" min="0" max ="5" value="0"/>'+
		'<input type="button" value="Apuntarse en la lista"/>'+
		'</fieldset>';
		$content.append(img,name,desc,horary,extra,form);
		console.log(img, name, desc)
		// Pages are lazily enhanced. We call page() on the page
		// element to make sure it is always enhanced before we
		// attempt to enhance the listview markup we just injected.
		$page.page();

		// We don't want the data-url of the page we just modified
		// to be the url that shows up in the browser's location field,
		// so set the dataUrl option to the URL for the category
		// we just loaded.
		options.dataUrl = urlObj.href;

		// Now call changePage() and tell it to switch to
		// the page we just modified.
		console.log($page, options);
		$.mobile.changePage( $page, options );
	}
}