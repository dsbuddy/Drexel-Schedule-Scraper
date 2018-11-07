var Crawler = require("js-crawler");

var crawler = new Crawler().configure({
  depth: 40,
  shouldCrawl: function(url) {
    return url.indexOf("termmasterschedule.drexel.edu") >= 0
  }
});

crawler.crawl({
  url: "https://termmasterschedule.drexel.edu",
  success: function(page) {
    console.log(page.url);
  },
  failure: function(page) {
    console.log(page.status);
  },
  finished: function(crawledUrls) {
    console.log(crawledUrls);
  }
});
