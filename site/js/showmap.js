let marks, mode, lastId, selected, URL, map, markerIcon, markerIcon2, addPointMarker;

URL = "http://192.168.10.238:80/";

function changeMode(){
  let lat, long, marker;
  
  if( mode === "connect" ){
    mode = "add";
    marks.map( el => el.setOpacity( 0.3 ) );
    addPointMarker = DG.marker( map.getCenter(), { draggable : true, icon : markerIcon } );
    addPointMarker.addTo( map );
    addPointMarker.addEventListener( "click", ( e ) => {
      let lat, long;
      
      lat = e.target._latlng.lat;
      long = e.target._latlng.lng;
      
      sendRequest( "POST", URL + "addNewPoint", {
        lat : lat,
        long : long
      }, () => {
        marker = DG.marker( [ lat, long ], { icon : markerIcon } );
        marker.addTo( map );
        marker.id = lastId;
        marker.addEventListener( "click", markSel );
        marks.map( el => el.setOpacity( 1 ) );
        marks.push( marker );
        addPointMarker.removeFrom( map );
        lastId++;
        mode = "connect";
        document.getElementById( "mode" ).value = "connect";
      } );
    } );
  } else {
    mode = "connect";
    marks.map( el => el.setOpacity( 1 ) );
    addPointMarker.removeFrom( map );
  }
  
  this.value = mode;
}

function markSel( e ){
  let fl;
  
  if( e.originalEvent.ctrlKey )
    sendRequest( "POST", "deletePoint", {
      id : e.target.id
    }, () => {
      marks = marks.filter( el => el.id !== e.target.id );
      e.target.removeFrom( map );
    } );
  
  fl = true;
  
  selected.map( el => {
    if( el.id === e.target.id ){
      selected = selected.filter( el => el.id !== e.target.id );
      e.target.setIcon( markerIcon );
      
      fl = false;
      return;
    }
  } );
  
  if( fl ){
    selected.push( e.target );
    e.target.setIcon( markerIcon2 );
  }
}

function showmap(){
  let marker;
  
  marks = [];
  mode = "connect";
  lastId = 0;
  selected = [];
  
  DG.then( () => {
    map = DG.map( "map", {
      center : [ 52.278675, 104.282227 ],
      zoom : 16,
      fullscreenControl : false,
      zoomControl : false
    } );
    
    markerIcon = DG.icon( {
      iconUrl : "img/marker.png",
      iconSize : [ 40, 40 ],
      iconAnchor : [ 15, 40 ]
    } );
    
    markerIcon2 = DG.icon( {
      iconUrl : "img/marker2.png",
      iconSize : [ 40, 40 ],
      iconAnchor : [ 15, 40 ]
    } );
    
    sendRequest( "POST", URL + "getStreetsCoordinates", {}, ( r ) => {
      for( let i = 0; i < r.length; i++ ){
        DG.polyline( [
          [ r[i].p0lat, r[i].p0long ],
          [ r[i].p1lat, r[i].p1long ]
        ], {
          color : "orange"
        } ).addTo( map );
      }
    } );
    
    sendRequest( "POST", URL + "getPoints", {}, ( marks_ ) => {
      for( let i = 0; i < marks_.length; i++ ){
        marker = DG.marker( [ marks_[i].lat, marks_[i].long ], { icon : markerIcon } );
        marker.id = marks_[i].id;
        marker.addTo( map );
        marker.bindLabel( "" + marks_[i].id, { static : true } );
        marker.addEventListener( "click", markSel );
        marks.push( marker );
        
        if( marks_[i].id > lastId ) lastId = marks_[i].id;
      }
      
      lastId++;
    } );
  } );
}