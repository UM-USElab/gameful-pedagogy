superSearch({
    searchFile: '/feed.xml',
    searchSelector: '#js-super-search', // CSS Selector for search container element.
    inputSelector: '#js-super-search__input', // CSS selector for <input>
    resultsSelector: '#js-super-search__results' // CSS selector for results container
});

// Initialize dropdowns using Materialize
$(".side-nav select").material_select();

// When a dropdown item is clicked, run this function
$(".side-nav .select-wrapper .dropdown-content li").on("click", function() {

  // Get the span text inside the item that identifies the desired page (structure is li > span)
  var selectedPage = $(this).find("span").text();

  // Find the select option (the select is hidden) that contains the name of the desired page
  var $selectedOption = $(".side-nav select option:contains('" + selectedPage + "')");

  // Get the URL of the desired page stored as the "value" atrribute on a select option
  var selectedPageUrl = $selectedOption.attr("value");

  // Redirect to the desired page selected in the dropdown
  $(location).attr("href", selectedPageUrl);
});

  var init = function() {
    var hill_positions = _.shuffle([1,2,3]);
    $('.hill').each(function(i, hill){
      $(hill).addClass("hill-position-" + hill_positions[i]).addClass("popup").removeClass("hidden");
    });
    $('.hill-fill').addClass("swellup").removeClass("hidden");
    var mountain_sizes = _.shuffle([1,2,3,4,5,1,2,3,4,5]);
    $('.mountain').each(function(i, mountain){
      $(mountain).addClass("mountain-size-" + mountain_sizes[i]).addClass("popup").removeClass("hidden");
    });
    var bubble_sizes = _.shuffle([1,2,3,4,5,6,7,8,9,10,11,12,1,2,3,4,5,6,7,8,9,10,11,12,1,2,3,4,5,6,7,8,9,10,11,12])
    $('.cloud-bubble').each(function(i, cloud){
      $(cloud).addClass("cloud-bubble-" + bubble_sizes[i])
    })
  };
  $(init);
