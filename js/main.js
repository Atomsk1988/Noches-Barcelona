$( document ).ready(function() {
	var discos = null;
	var parties = null;
	/*
	AGENT CODE SECTION:
	Check's if there is an agent code in localStorage
	if not, shows agent code pop-up
	*/
	var agent_code = window.localStorage.getItem('agent_id');
	$( "#agent_panel" ).popup({ history: false }); 
	$( "#agent_panel" ).popup();
	

	if(agent_code==null){
		$('#agent_panel').popup("open");
		var elem = $('#agent_id');

	   // Save current value of element
	   elem.data('oldVal', elem.val());

	   // Look for changes in the value
	   elem.bind("propertychange keyup input paste", function(event){
	      // If value has changed...
	      if (elem.data('oldVal') != elem.val()) {
	       // Updated stored value
	       elem.data('oldVal', elem.val());
	       // Do action
	       if(elem.val()==''){
	       		$('#agent_sbmt').val('No tengo codigo');
	       }else{
				$('#agent_sbmt').val('Introducir codigo');
	       }
	     }
	   });
	}

	$('#agent_sbmt').on('click',function(e){
		console.log($('#agent').val());
		 window.localStorage.setItem('agent_id',$('#agent_id').val());
		 $( "#agent_panel" ).popup('close');
		 e.preventDefault();
	});
	//	DISCO LIST POPULATION	
	$.getJSON('admin/scripts/discos.php',function(dataOb,status){
		discos = dataOb;
		for(num=0;num<dataOb.discoteques.length;num++){
			data = dataOb.discoteques[num];
			li = $('#disco_list').append('<li id="disco_'+data.id+'" data-role="collapsible"></li>');
			$('#main_page ul li:last').append('<h2><div class="main-h2"><figure><img src="http://brais.zz.mu/admin/uploads/'+data.image+'" /></figure><p>'+data.name+'</p></div></h2>');
			ul = $('#main_page ul li:last').append('<ul data-role="listview"></ul>');
			ul.trigger('create');
		}
		$('#disco_list').collapsibleset('refresh');						
	});			
	//PARTIES POPULATION
	$.ajax({
	  dataType: "text",
	  url: 'admin/scripts/parties.php',
	  success: function(partiesOb){

		parties = JSON.parse(partiesOb);
		console.log(partiesOb);
		$.each(parties,function(index, value){
			//console.log(JSON.parse(JSON.stringify(value.horarios)));
		  	//console.log(value.horarios.replace("/'/",'"'),value.horarios.replace("/'/",'"'));
			//value.horarios = JSON.parse(value.horarios);
			//console.log(value.horarios);
			value.horarios = JSON.parse(JSON.parse(JSON.stringify(value.horarios)));
			console.log(value.horarios[0])
			/*$.each(value.horarios, function(i,v){
				v = JSON.parse(v);
			})*/
			ul = $('#disco_'+value.discoteque_id+' ul')
			ul.append('<li><a href="#data_page?party-id='+index+'">'+value.date+' '+value.name+'</a></li>');		
			$(ul).listview('refresh');
		});
	  }
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
	p_id = null;
	$('#data_page').on('click','#inscripcion_sbmt', function(){
				id = p_id;
			  	var inscriptions =window.localStorage.getItem('inscriptions');
			  	console.log(inscriptions);
				if(inscriptions.search(p_id)==-1 || inscriptions.length == 0){
					$.ajax({
					  dataType: "text",
					  url: 'admin/scripts/inscripcion.php',
					  method:"post",
					  data: { agent_code: window.localStorage.getItem('agent_id'), name: $('#name').val(), guests:$('#guests').val(), p_id:p_id},
					  success: function(result){
					  	console.log('inscrito!')
						//****************************
					  	//recibo el id inscrito, lo añado a un array de localstorage
					  	//cada vez que cargo nuevas fiestas comparo el localStorage con 
					  	// el json cargado y borro las fiestas caducadas
					  	inscriptions+=p_id+',';
					  	window.localStorage.setItem('inscriptions',inscriptions);
					}
					});
				}else{
					//Mensaje de ya inscrito a esta fiesta
				}
			});
	function showParty(urlObj,options){
		var party_id = urlObj.hash.replace( /.*party-id=/, "" );
		p_id = party_id;
		// Get the object that represents the category we
		// are interested in. 
		d_id= parties[party_id].discoteque_id;
		category = [];
		$.each(discos.discoteques, function(ind,val){
			if(val.id==d_id){
				category = val;
			}
		});
		console.log('Show party',d_id,category);
		
		// The pages we use to display our content are already in
		// the DOM. The id of the page we are going to write our
		// content into is specified in the hash before the '?'.
		pageSelector = urlObj.hash.replace( /\?.*$/, "" );

		if ( category ) {
			// Get the page we are going to dump our content into.
			var $page = $( pageSelector ),

			// Get the header for the page.
			$header = $page.children( ":jqmData(role=header)" );
			//$header.html(discos.discoteques[d_id].name);

			// Get the content area element for the page.
			$content = $page.children( ":jqmData(role=content)" );
			// The markup we are going to inject into the content
			// area of the page.
			//console.log($content);
			//$content.html('');
			//Page content
			$('.flyer img').attr('src', 'http://www.brais.zz.mu/admin/uploads/'+parties[party_id].image);
			//img = '<img class="flyer" src="http://www.brais.zz.mu/admin/uploads/'+parties[party_id].image+'">';
			$('.flyer h2').html(parties[party_id].name);
			//name='<h2>'+parties[party_id].name+'</h2>';
			$('#desc').html(parties[party_id].description);
			//desc='<p>'+parties[party_id].description+'</p><hr/>';

			//horary='<p>';
			horarios = parties[party_id].horarios;
			$('#horario').html('');
			for(key in horarios){
				$('#horario').append('<p><strong>'+horarios[key].name+'</strong></p>');
				//horary +='<p><strong>'+horarios[key].name+'</strong></p>';
				for(block_key in horarios[key].horarios){
					block = horarios[key].horarios[block_key];
					$('#horario').append('<p>'+block.ini_time+' - '+block.fin_time+' '+block.precio+'€ '+block.extra+'</p>');
					//horary+= '<p>'+block.ini_time+' - '+block.fin_time+' '+block.precio+'€ '+block.extra+'</p>';
				}
			}
			//horary += '</p>';
			//extra='<p>Muy importante, ir bien vestido.</p>';
			/*
			form='<hr /><fieldset data-role="fieldcontain">'+
			'<label for="name">Nombre:</label><input type="text" data-mini="true" name="name" id="name"/>'+
			'<label for="range">Acompañantes:</label><input type="range" id="guests" name="range" data-mini="true" min="0" max ="5" value="0"/>'+
			'<input type="button" id="inscripcion_sbmt" value="inscribirse"/>'+
			'</fieldset>';
			*/
			//$content.append(img,name,desc,horary,extra,form);
			
/*
			$('#inscripcion_sbmt').on('click', function(){
				$.ajax({
					dataType: "text",
					url: 'admin/scripts/inscribir_socio.php',
					success: function(partiesOb){

					}
				});
			});
*/
			//console.log(img, name, desc)
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
});
