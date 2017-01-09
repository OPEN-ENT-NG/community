db.pages.find({"hideInPages" : true}).forEach(function(page) {
  var string = JSON.stringify(page);
  var obj = JSON.parse(string.replace(/fr\-wseduc\-pages/g, 'net-atos-entng-community'));
  db.communityPages.save(obj);
});

