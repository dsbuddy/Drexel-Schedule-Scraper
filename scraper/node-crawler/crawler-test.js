var supercrawler = require("supercrawler");

// 1. Create a new instance of the Crawler object, providing configuration
// details. Note that configuration cannot be changed after the object is
// created.
var crawler = new supercrawler.Crawler({
  // By default, Supercrawler uses a simple FIFO queue, which doesn't support
  // retries or memory of crawl state. For any non-trivial crawl, you should
  // create a database. Provide your database config to the constructor of
  // DbUrlList.
  // Tme (ms) between requests
  interval: 1000,
  // Maximum number of requests at any one time.
  concurrentRequestsLimit: 5,
  // Time (ms) to cache the results of robots.txt queries.
  robotsCacheTime: 3600000,
  // Query string to use during the crawl.
  userAgent: "Mozilla/5.0 (compatible; supercrawler/1.0; +https://github.com/brendonboshell/supercrawler)",
  // Custom options to be passed to request.
  request: {
    headers: {
      'x-custom-header': 'example'
    }
  }
});

// Get "Sitemaps:" directives from robots.txt
crawler.addHandler(supercrawler.handlers.robotsParser());

// Crawl sitemap files and extract their URLs.
crawler.addHandler(supercrawler.handlers.sitemapsParser());

// Pick up <a href> links from HTML documents
crawler.addHandler("text/html", supercrawler.handlers.htmlLinkParser({
  // Restrict discovered links to the following hostnames.
  hostnames: ["termmasterschedule.drexel.edu"]
}));

// Custom content handler for HTML pages.
crawler.addHandler("text/html", function (context) {
  var sizeKb = Buffer.byteLength(context.body) / 1024;
  logger.info("Processed", context.url, "Size=", sizeKb, "KB");
});

crawler.getUrlList()
  .insertIfNotExists(new supercrawler.Url("https://termmasterschedule.drexel.edu"))
  .then(function () {
    console.log('START')
    return crawler.start();
  });
