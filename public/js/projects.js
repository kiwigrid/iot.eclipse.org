/*!
 * community.js by Christopher Guindon - @chrisguindon
 * Copyright 2013 Eclipse Foundation
 * http://www.eclipse.org/org/documents/epl-v10.php
 */


var projectsAssociation = {
    'Standards': {
        'iot.paho': true,
        'iot.paho.incubator': true,
        'iot.californium': true,
        'iot.om2m': true,
        'iot.mosquitto': true,
        'iot.moquette': true,
        'iot.wakaama': true,
        'iot.leshan': true,
        'iot.concierge': true,
        'iot.risev2g': true,
        'iot.4diac': true,
        'iot.tiaki': true,
        'iot.tinydtls': true,
        'iot.milo': true
    },

    'Devices': {
        'iot.concierge': true,
        'iot.paho': true,
        'iot.edje': true,
        'iot.wakaama': true,
    },

    'Gateways': {
        'iot.concierge': true,
        'iot.kura': true,
        'iot.smarthome': true,
        'iot.leshan': true
    },

    'Cloud': {
        'iot.hono': true,
        'iot.kapua': true,
        'iot.mosquitto': true,
        'iot.hawkbit': true,
        'iot.leshan': true,
        'iot.ponte': true
    },

    'Tools': {
        'iot.eclipsescada': true
    },

    'Ontologies': {
        'iot.vorto': true,
        'iot.unide': true,
        'iot.whiskers': true
    },

    'Security': {
        'iot.tinydtls': true,
        'iot.tiaki': true,
        'iot.californium': true,
        'iot.leshan': true
    },


    // rest is 'others' (Ignite, ...)
};


var projectAliases = {
    'iot.californium': 'Eclipse Californium',
    'iot.4diac': 'Eclipse 4DIAC'
};

var releases = {
  "iot.paho": "1.2.0 (Neon)",
  "iot.eclipsescada": "0.3.0",
  "iot.concierge": "5.0",
  "iot.mosquitto": "1.4",
  "iot.smarthome": "0.8.0",
  "iot.kura": "2.1.0",
  "iot.om2m": "1.0.0",
  "iot.californium": "1.0.0"
};
var download_urls = {
  "iot.paho": "https://www.eclipse.org/paho/downloads.php",
  "iot.eclipsescada": "http://download.eclipse.org/eclipsescada/",
  "iot.ponte": "http://eclipse.org/ponte",
  "iot.concierge": "http://projects.eclipse.org/projects/iot.concierge/downloads",
  "iot.mosquitto": "https://www.eclipse.org/mosquitto/download/",
  "iot.smarthome": "https://www.eclipse.org/smarthome/documentation/community/downloads.html",
  "iot.kura": "https://www.eclipse.org/kura/downloads.php",
  "iot.krikkit": "http://projects.eclipse.org/projects/iot.krikkit",
  "iot.om2m": "https://wiki.eclipse.org/OM2M/Download",
  "iot.californium": "http://projects.eclipse.org/projects/iot.californium/downloads",
  "iot.wakaama": "http://projects.eclipse.org/projects/iot.wakaama",
  "iot.paho.incubator": "http://projects.eclipse.org/projects/iot.paho.incubator",
  "iot.vorto": "https://www.eclipse.org/vorto/downloads/index.html",
  "iot.leshan": "https://github.com/eclipse/leshan#test-leshan-locally",
  "iot.4diac": "http://www.eclipse.org/4diac/en_dow.php",
  "iot.risev2g": "https://github.com/eclipse/risev2g",
  "iot.tinydtls": "http://projects.eclipse.org/projects/iot.tinydtls",
  "iot.tiaki": "http://projects.eclipse.org/projects/iot.tiaki/downloads",
  "iot.hawkbit": "http://projects.eclipse.org/projects/iot.hawkbit",
  "iot.hono": "http://projects.eclipse.org/projects/iot.hono",
  "iot.edje": "http://projects.eclipse.org/projects/iot.edje",
  "iot.whiskers": "http://projects.eclipse.org/projects/iot.whiskers",
  "iot.milo": "http://projects.eclipse.org/projects/iot.milo",
  "iot.kapua": "http://projects.eclipse.org/projects/iot.kapua",
  "iot.ignite": "http://projects.eclipse.org/projects/iot.ignite",
  "iot.unide": "http://www.eclipse.org/unide",
  "iot.iofog": "http://projects.eclipse.org/projects/iot.iofog",
  "iot.agail": "http://projects.eclipse.org/projects/iot.agail"
};
var download_stats = {
  "iot.hawkbit": 1174,
  "iot.leshan": 2220,
  "iot.californium": 4086,
  "iot.paho": 17500,
  "iot.om2m": 131,
  "iot.mosquitto": 13994,
  "iot.smarthome": 6073,
  "iot.eclipsescada": 614,
  "iot.kura": 608,
  "iot.ponte": 508
};


(function($, window, document) {
    $(function() {

        // $(window).resize(function() {
        //     resize();
        // });

        // $(document).on('click', '.itembox, .news-list li', function() {
        //     var link = $(this).find('.readmore').attr('href');
        //     $(location).attr('href', link);
        //     return false;
        // });

        $.ajax({
            type: "GET",
            //            url: "//projects.eclipse.org/jsonp/technology/Internet%20of%20Things",
            //            dataType: "jsonp",
            url: "/projects.json",
            dataType: "json",
            cache: true,
            success: function(data) {

                var projectBoxes = {};
                var projectInfos = [];

                var val = 20;
                $('.progress-bar').css('width', val + '%').attr('aria-valuenow', val);

                var i = 0;

                $.each(data, function(key, value) {
                    i++;
                    var val = 20 + (i / Object.keys(data).length) * 80;

                    $('.progress-bar').css('width', val + '%').attr('aria-valuenow', val);


                    // Clean up and remove HTML.
                    if (value.id in projectAliases) {
                        value.name = projectAliases[value.id];
                    }

                    var title = stringJanitor(value.name);
                    var id = stringJanitor(value.id);
                    var link = value.website;
                    if (!validateUrl(link)) {
                        link = "http://projects.eclipse.org/projects/" + id;
                    }
                    var desc = stringJanitor(value.description, {
                        "cut": true,
                        "ellipsis": ' [&hellip;] <br><a href="' + link + '"> Read more&hellip;</a>'
                    });

                    var logo = value.logo;
                    var style = "";
                    var showlogo = true;

                    if (id == 'rt.ecf' || id == 'tools.mtj' || id == "technology.koneki" || id == "tools.titan" || id == "iot.tiaki" )
                        return true;

                    projectInfo = {};
                    projectInfo.link = value.website;
                    if (!validateUrl(projectInfo.link)) {
                        projectInfo.link = "http://projects.eclipse.org/projects/" + id;
                    }
                    projectInfo.logo = value.logo || 'http://fakeimg.pl/400x200/f5f5f5/000/?text=' + title //; || 'https://placeholdit.imgix.net/~text?txtsize=42&txt=' + title + '&w=200&h=80&bg=f5f5f5&txtclr=000000' ; //|| 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=';
                    projectInfo.id = id;
                    projectInfo.name = title;
                    projectInfo.labels = '';
                    for (var k in projectsAssociation) {
                        if (projectsAssociation[k][value.id]) {
                            projectInfo.labels += ' ' + ' <span class="label label-warning">' + k + '</span>'
                        }
                    }

                    projectInfo.description = desc;
                    projectInfo.fullDescription = stringJanitor(value.description);
                    var downloads = download_stats[value.id] || 0;
                    projectInfo.downloads = downloads;
                    projectInfo.downloadsHuman = (downloads == 0) ? 'N/A' : numeral(downloads).format('0.[0] a');
                    projectInfo.version = releases[value.id] || 'none';
                    projectInfo.downloadUrl = download_urls[value.id];

                    projectInfos.push(projectInfo);

                    i++;
                });


                // Insert html and resize the boxes.
                //$("#update-project").append('</div>' + output);
                //resize();

                var options = {
                    item: '<li class="col-md-12"><div class="media">\
                              <div class="media-left media-middle">\
                                <a href="#" class="link">\
                                  <img class="media-object img-responsive logo img-thumbnailXXX">\
                                </a>\
                              </div>\
                              <div class="media-body">\
                                 <h4 class="media-heading name"> </h4><span class="labels"></span>\
                                   <div class="row">\
                                    <p class="fullDescription" style="display:none;"></p>\
                                    <p class="description col-md-8"></p>\
                                    <div class="col-md-4 details">\
                                        <p class="downloads" style="display:none;"></p>\
                                        <div class="col-md-12">Monthly downloads: <span class="badge downloadsHuman">50K+</span></a></div>\
                                        <div class="col-md-12">Latest release: <span class="badge version">1.4</span></a></div>\
                                        <div class="col-md-12"><a class="btn btn-sm btn-info downloadUrl" href="#">Download</a></div>\
                                    </div>\
                                </div>\
                              </div>\
                            </div><hr></li>',
                    valueNames: ['name', 'description', 'fullDescription', {
                            name: 'logo',
                            attr: 'src'
                        }, 'downloads', 'downloadsHuman', 'version', {
                            name: 'link',
                            attr: 'href'
                        }, {
                            name: 'downloadUrl', attr:'href'
                        },
                        'labels'
                    ]
                };

                var list = new List('project-list', options, projectInfos);

                list.sort('downloads', {
                    order: "desc"
                });

                for (var i in list.visibleItems) {
                    var elem = list.visibleItems[i].elm;
                    var logoElem = $("img.logo", elem);

                    if (logoElem.attr('src').includes('fakeimg')) {
                        logoElem.addClass('has-placeholder-logo');
                    }
                }

                $("#update-project").empty();
                $("#update-project").removeClass("loading");

                

                $('.btn-filter-project').on('click', function() {    setTimeout(function() {
                    list.filter();
                    list.filter(computeFilterFunction());
                    }, 10) ; });

                //    setTimeout(1000, rez;


            },
        });

    });

    var computeFilterFunction = function() {
        console.log("recompute filter");
        return function(item) {
            var filter = [];

            $('.btn-filter-project').each( function(index, elem) {
                console.log($(elem));
                if ($(elem).hasClass('active')) 
                    filter.push($(elem).text());
            });

            console.log(filter);

            if(filter.length == 0) return true;

            var found = false;

            for (var i = 0; i < filter.length; i++) {
                var element = filter[i]
                if(item.values().labels.indexOf(element) !== -1) {
                    found = true;
                    continue;
                }
                found = false;
                break;
            }

            return found;
        }

    }

    // Validate URL.
    var validateUrl = function validateUrl(str) {
        return (/^(http|https|ftp):\/\/[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/i).test(str);
    };

    // Set same height to all .itembox in a row.
    var resize = function() {
        $('li').css({
            "height": "auto"
        });
        $('ul').each(function() {
            var highestBox = 0;
            $('li', this).each(function() {
                if ($(this).height() > highestBox) {
                    highestBox = $(this).outerHeight();
                }
            });
            $('li', this).height(highestBox);
        });
    };

    // Remove html, add ellipsis and cut strings.
    var stringJanitor = function(str, options) {
        var settings = $.extend({
            // These are the defaults.
            start: 0,
            end: 250,
            html: false,
            ellipsis: "",
            cut: false,
        }, options);
        var text = "";
        // Remove HTML.
        if (!settings.html) {
            text = str.replace(/<\/?\w(?:[^"'>]|"[^"]*"|'[^']*')*>/g, "");
        }

        // Shorten the string.
        if (settings.cut) {
            if (text.length < settings.end) {
                return text;
            } else {
                var cutat = text.lastIndexOf(' ', settings.end);
                if (cutat !== -1) {
                    text = text.substring(settings.start, cutat) + settings.ellipsis;
                }
            }
        }
        return text;
    };

}(window.jQuery, window, document));
// The global jQuery object is passed as a parameter