/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

var app =  {
    // Bluemix credentials
    route: "https://pearl.mybluemix.net",
    guid: "1a1ab2e9-4f5a-4db6-9ba3-2da97349a160",

    // Initialize BMSClient
    initialize: function() {
        this.bindEvents();
    },

    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },

    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to use the 'route' and 'guid'
    // variables, we must explicitly call 'app.route' and 'app.guid'
    onDeviceReady: function() {
        BMSClient.initialize(app.route, app.guid);
        MFPAuthorizationManager.initialize("e6aa5588-51e0-47ba-acb1-86ceecb83110");
        app.ping();
    },

    // Ping Bluemix
    //
    // Sends a request to the Bluemix backend
    // The success and failure variables handle the callback response for each case 
    ping: function() {
        //MFPLogger
        var myPckgLogger = MFPLogger.getInstance("bm_connect");
        MFPLogger.setCapture(true);
        MFPLogger.setLevel(MFPLogger.INFO);
        MFPLogger.send();

        // MFPAnalytics
        MFPAnalytics.enable();
        MFPAnalytics.send();

        var request = new MFPRequest(this.route + "/protected", MFPRequest.GET);

        var success = function(successResponse) {
            alert("Connected to Bluemix service");
        };

        var failure = function(failureResponse) {
            alert("Not connected to Bluemix service");
        };

        request.send(success, failure);
    }
};

app.initialize();
