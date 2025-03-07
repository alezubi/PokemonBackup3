$("#search-form").on("submit", function (event) {
    event.preventDefault();
    $("#card-container").empty();

    var nameSearch = $("#search").val().trim();
    var typeFilter = $("#type-filter").val();

    var queryParams = [];
    if (nameSearch !== "") queryParams.push(`name:${nameSearch}`);
    if (typeFilter !== "") queryParams.push(`types:${typeFilter}`);

    if (queryParams.length === 0) {
        $("#card-container").html("<p>Please enter a search term or select at least one filter.</p>");
        return;
    }

    var queryString = queryParams.join(" ");

    $.ajax({
        method: "GET",
        url: "https://api.pokemontcg.io/v2/cards?q=" + encodeURIComponent(queryString),
    }).then(function (response) {
        if (response.data && response.data.length > 0) {
            response.data.forEach(function (card) {
                var imageUrl = card.images ? card.images.large : card.images.small;

                var cardElement = $("<div>")
    .addClass("col-md-3 mb-3")
    .append(
        $("<div>")
            .addClass("card h-100")
            .css({
                "overflow": "hidden",  // Prevents unwanted cropping
                "display": "flex",
                "align-items": "center",
                "justify-content": "center"
            })
            .append(
                $("<img>")
                    .addClass("card-img-top pkmn-card")
                    .attr("src", imageUrl)
                    .attr("alt", card.name)
                    .css({
                        "width": "100%",      // Ensures full width
                        "height": "auto",     // Maintains aspect ratio
                        "object-fit": "contain"  // Ensures the full image is displayed
                    })
            )
    )
    .css("cursor", "pointer");


    cardElement.on("click", function () {
        var detailHtml = `
        <div class="d-flex align-items-start">
            <img src="${imageUrl}" class="img-fluid mb-3" style="max-width: 300px; margin-right: 20px;">
            <div>
                <h3>${card.name}</h3>
                <p><strong>HP:</strong> ${card.hp || "N/A"}</p>
                <p><strong>Types:</strong> ${card.types ? card.types.join(", ") : "N/A"}</p>
        `;
    
        if (card.evolvesTo) {
            detailHtml += `<p><strong>Evolves To:</strong> ${card.evolvesTo.join(", ")}</p>`;
        }
    
        if (card.rules) {
            detailHtml += `<h5>Rules:</h5>`;
            card.rules.forEach(function (rule) {
                detailHtml += `<p>${rule}</p>`;
            });
        }
    
        if (card.attacks) {
            detailHtml += `<h5>Attacks:</h5>`;
            card.attacks.forEach(function (attack) {
                detailHtml += `<p><strong>${attack.name}</strong> - ${attack.damage}</p>`;
                detailHtml += `<p><em>${attack.text}</em></p>`; // Showing attack description text
            });
        }
    
        if (card.weaknesses) {
            detailHtml += `<h5>Weaknesses:</h5>`;
            card.weaknesses.forEach(function (weakness) {
                detailHtml += `<p><strong>${weakness.type}</strong> - ${weakness.value}</p>`;
            });
        }
    
        if (card.retreatCost) {
            detailHtml += `<p><strong>Retreat Cost:</strong> ${card.retreatCost.join(", ")}</p>`;
        }
    
        if (card.set) {
            detailHtml += `<p><strong>Set:</strong> ${card.set.name} (${card.set.id})</p>`;
        }
    
        if (card.artist) {
            detailHtml += `<p><strong>Artist:</strong> ${card.artist}</p>`;
        }
    
        if (card.tcgplayer && card.tcgplayer.prices) {
            detailHtml += `<h5>TCGPlayer Prices:</h5>`;
            for (var priceType in card.tcgplayer.prices) {
                var priceData = card.tcgplayer.prices[priceType];
                detailHtml += `<p>${priceType}: Low: $${priceData.low}, Market: $${priceData.market}</p>`;
            }
        }
    
        detailHtml += `</div></div>`;  // Close the flex container
    
        $("#card-details").html(detailHtml);
        $("#cardDetailModal").modal("show");
    });
    

                $("#card-container").append(cardElement);
            });
        } else {
            $("#card-container").html("<p>No cards found.</p>");
        }
    });
});
