let streets = []

$(document).ready(() => {
  let c, tmp;
  
    sendRequest( "POST", URL + "getStreets", {}, ( r ) => {
      if( r.length !== 0 ){
        c = r[0].inprocess;
        tmp = [];
        
        for( let i = 0; i < r.length; i++ ){
          if( r[i].inprocess !== c ){
            streets.push( tmp );
            tmp = [];
            c++;
          }
          
          tmp.push( r[i].name );
        }
        
        streets.push( tmp );
        createTableStreets()
      }
    } );
    
    $(".close").click(() => {
        $(".streets-info").empty();
        $(".info-adress").css({
            "visibility": "hidden",
            "opacity": "0"
        })
    })
    
    $("#add-street-cansel").on("click", hideAddStreet)
})

function showAddStreet( j, i ){
    $(".add-street-block").css({
        "visibility" : "visible",
        "opacity" : "1"
    })
    
    $("#add-street").on("click", ()=>{
      sendRequest( "POST", URL + "addNewStreet", {
        name : $("#add-street-name").val(),
        startPoint : selected[0].id,
        endPoint : selected[1].id
      }, () => {
        streets[i].splice(j + 1, 0, $("#add-street-name").val());
        $(".streets-info").empty();
        $(".table-info").remove();
        createStreets(i)
        createTableStreets()
        $("#add-street-name").val("")
        hideAddStreet()
      } );
    })
}

function hideAddStreet(){
    $(".add-street-block").css({
        "visibility" : "hidden",
        "opacity" : "0"
    })
    $("#add-street").off("click");
}

function createTableStreets() {
    for (let i = 0; i < streets.length; i++) {
        let line = $("<div/>").addClass("block-line");
        line.append("<div/>", "<button/>");
        line.children().eq(1).text("Подробнее").addClass("more-button")
        let streetInTable = $("<tr/>").addClass("table-info");
        let streetTime = $("<td/>").text(3);
        streetInTable.append($("<td/>"));
        streetInTable.children().eq(0).append(line)
        let streetText = line.children().eq(0);
        if (streets[i].length >= 3)
            max = 3;
        else
            max = streets.length - 1;
        for (let j = 0; j < max; j++) {
            if (j === 0)
                streetText.text(streets[i][j]);
            else
                streetText.text(streetText.text() + " → " + streets[i][j]);
            if (j === max - 1 && max !== streets[i].length)
                streetText.text(streetText.text() + "...")
        }
        streetInTable.append(streetTime);
        $("table").append(streetInTable);

        line.children("button").click(() => {

            createStreets(i)

            $(".info-adress").css({
                "visibility": "visible",
                "opacity": "1"
            })
        })
    }
}

function createStreets(i) {
    if( map === undefined ) showmap();
    
    for (let j = 0; j < streets[i].length; j++) {
        let streetBlock = $("<div/>").addClass("street-name").html(
            "<div class = \"street-name-text\">" +
            streets[i][j] +
            "<button class = \"delete-street\"/>" +
            "</div>" +
            "<div class = \"add-adress\">" +
            "<button class = \"add-adress-button\"/>" +
            "</div>"
        )
        $(streetBlock).hover(function () {
            $(".add-adress").eq(j).addClass("add-adress-active").css("height", addStreetButtonHeight);
            $(".delete-street").eq(j).css({
                "visibility": "visible",
                "opacity": "1"
            })
        }, function () {
            $(".add-adress").eq(j).removeClass("add-adress-active").css("height", "0");
            $(".delete-street").eq(j).css({
                "visibility": "hidden",
                "opacity": "0"
            })
        })

        $(".streets-info").append(streetBlock);
        let addStreetButtonHeight = $(".add-adress").eq(j).height();
        $(".add-adress").eq(j).css("height", "0");
        $(".street-name-text").eq(j).click(() => {

        })
        $(".add-adress-button").eq(j).click(() => {
            showAddStreet( j, i )
        })
        $(".delete-street").eq(j).click(() => {
            strHeight = $(streetBlock).height();
            $(streetBlock).css("height", strHeight);
            setTimeout(() => {
                $(streetBlock).css({
                    "transform" : "scale(0)"
                })
            }, 1)
            setTimeout(() => {
                $(streetBlock).css({
                    "height" : "0"
                })
            }, 300)

            setTimeout(() => {
                streets[i].splice(j, 1);
                $(".streets-info").empty();
                $(".table-info").remove();
                createStreets(i)
                createTableStreets()
            }, 600)

        })
    }
}