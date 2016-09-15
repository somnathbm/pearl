var packageVersion = require('./../package.json').version;
console.log("packageVersion :: " + packageVersion);

var loopback = require('loopback');
var boot = require('loopback-boot');

/* -------- for IBM IOT --------------- */
var Client = require('ibmiotf');

var app = module.exports = loopback();

// ------------ Protecting mobile backend with Mobile Client Access start -----------------

// Load passport (http://passportjs.org)
var passport = require('passport');

// Get the MCA passport strategy to use
var MCABackendStrategy = require('bms-mca-token-validation-strategy').MCABackendStrategy;

// Tell passport to use the MCA strategy
passport.use(new MCABackendStrategy())

// Tell application to use passport
app.use(passport.initialize());

// Protect DELETE endpoint so it can only be accessed by HelloTodo mobile samples
app.delete('/api/Items/:id', passport.authenticate('mca-backend-strategy', {session: false}));

// Protect /protected endpoint which is used in Getting Started with Bluemix Mobile Services tutorials
app.get('/protected', passport.authenticate('mca-backend-strategy', {session: false}), function(req, res){
	res.send("Hello, this is a protected resouce of the mobile backend application!");
});

app.post('/lights', passport.authenticate('mca-backend-strategy', {session: false}), function(req, res){
	var response = req.body.L;
        console.log(response);
        res.send("request received & processed");

        //demo data to send
        //var myData = { 'name': 'somnath', 'role':  'architect' };
        //appClient.publishDeviceCommand("pi_mate", "homePi", "status", "json", myData);
    });

//connect to IBM IOT

//IBM Watson IoT appclient config
var appClientConfig = {
    "org": "66jjfx",
    "id": "1a1ab2e9-4f5a-4db6-9ba3-2da97349a160",
    "domain": "internetofthings.ibmcloud.com",
    "auth-method": "apikey",
    "type": "shared",
    "auth-key": "a-66jjfx-6kmtipcl3p",
    "auth-token": "E30s(JzN@ct&yj3RKr"
};

var appClient = new Client.IotfApplication(appClientConfig);
appClient.connect();

appClient.on("connect", function(){
	console.log("app-to-iot connected");
	// subscribe to device events
    //appClient.subscribeToDeviceEvents("pi_mate");
    // subscribe to device status
    //appClient.subscribeToDeviceStatus("pi_mate");
});

appClient.on("error", function(){
	console.log("app-to-iot NOT connected");
});

// ------------ Protecting backend APIs with Mobile Client Access end -----------------

app.start = function () {
	// start the web server
	return app.listen(function () {
		app.emit('started');
		var baseUrl = app.get('url').replace(/\/$/, '');
		console.log('Web server listening at: %s', baseUrl);
		var componentExplorer = app.get('loopback-component-explorer');
		if (componentExplorer) {
			console.log('Browse your REST API at %s%s', baseUrl, componentExplorer.mountPath);
		}
	});
};

// Bootstrap the application, configure models, datasources and middleware.
// Sub-apps like REST API are mounted via boot scripts.
boot(app, __dirname, function (err) {
	if (err) throw err;
	if (require.main === module)
		app.start();
});

