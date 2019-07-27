$(document).ready(() => {
    let streets = [["Марата", "Марата/Байкальская", "Байкальская", "Марата", "Марата/Байкальская", "Байкальская", "Марата", "Марата/Байкальская", "Байкальская"], ["kek", "2/lol", "arbidol"], ["loh", "2/ti", "blya"]]
    for (let i = 0; i < streets.length; i++) {
        let line = $("<div/>").addClass("block-line");
        line.append("<div/>", "<button/>");
        line.children().eq(1).text("Подробнее").addClass("more-button")
        let streetInTable = $("<tr/>").addClass("table-info");
        let streetTime = $("<td/>").text(3);
        streetInTable.append($("<td/>"));
        streetInTable.children().eq(0).append(line)
        let streetText = line.children().eq(0);
        if (streets[i].length > 3)
            max = 3;
        else
            max = streets.length;
        for (let j = 0; j < max; j++) {
            if (j === 0)
                streetText.text(streets[i][j]);
            else
                streetText.text(streetText.text() + " => " + streets[i][j]);
            if (j === max - 1 && max !== streets[i].length)
                streetText.text(streetText.text() + "...")
        }
        streetInTable.append(streetTime);
        $("table").append(streetInTable);

        line.children("button").click(() => {
            for (let j = 0; j < streets[i].length; j++) {
                let streetBlock = $("<div/>").addClass("street-name").html(
                    "<div class = \"street-name-text\">" +
                        streets[i][j] + 
                    "</div>" +
                    "<div class = \"add-adress\">" + 
                        "<button class = \"add-adress-button\"/>" +
                    "</div>"
                )
                $(streetBlock).hover(function(){
                    $(".add-adress").eq(j).addClass("add-adress-active").css("height", addStreetButtonHeight);
                }, function(){
                    $(".add-adress").eq(j).removeClass("add-adress-active").css("height", "0");
                })
                
                $(".streets-info").append(streetBlock);
                let addStreetButtonHeight = $(".add-adress").eq(j).height();
                $(".add-adress").eq(j).css("height", "0");
                $(".street-name-text").eq(j).click(() => {
                    console.log(1)
                })
                $(".add-adress-button").eq(j).click(() => {
                    console.log(2)
                })
            }

            $(".info-adress").css({
                "visibility": "visible",
                "opacity": "1"
            })
        })
    }
    $(".close").click(() => {
        $(".streets-info").empty();
        $(".info-adress").css({
            "visibility": "hidden",
            "opacity": "0"
        })
    })
})