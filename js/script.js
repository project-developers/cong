<!doctype html>

<html lang="en">

	<head>
		<meta charset="utf-8">
		<title>Cong</title>
        <meta name="description" content="This app helps handle cong records.">
        <meta name="author" content="Project Developers">
        <meta name="theme-color" content="#f5f5f5">
		<meta name="viewport" content="width=device-width,initial-scale=1.0,maximum-scale=1.0,minimum-scale=1.0,user-scalable=no" /> 
        <meta property="og:image" content="icons/icon-512.png">
        <link rel="apple-touch-icon" href="icons/icon-152.png">
        <link rel="shortcut icon" href="favicon.ico">
        <link rel="manifest" href="cong.webmanifest">
        <link rel="icon" type="image/png" href="favicon.ico">
		<link rel="stylesheet" href="https://www.w3schools.com/w3css/4/w3.css">
        <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Raleway">
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css">
        <link rel="stylesheet" href="css/style.css">
        <script type='module' src="pwabuilder-sw-register.js"></script>
		<script type='module' src="pwabuilder-sw.js"></script>
        <script src="js/vue.js"></script>
        <script src="js/jszip.min.js"></script>
        <script src="js/mammoth.browser.min.js"></script>
        <script src="js/pdf-lib.js"></script>
    </head>

    <body class="w3-light-grey">

        <!-- Navbar (sit on top) -->
        <div class="w3-top w3-white" id="navigation"></div>

        <!-- Sidebar on small screens when clicking the menu icon -->
        <nav class="w3-sidebar w3-bar-block w3-light-grey w3-card w3-animate-left w3-hide-medium w3-hide-large"
            style="display:none" id="mySidebar">
        </nav>

        <!-- Header with full-height image -->
        <header class="bgimg-1 w3-display-container w3-grayscale-min" id="home">
            
            <div class="w3-display-left w3-text-white" style="padding:48px">
            </div>
            <!--div class="w3-display-left w3-text-white" style="padding:36px">
            </div-->
            <div class="w3-container w3-light-grey" id="main-holder" style="padding:95px 36px;">
                <h3 class="w3-left" style="padding-right:10px">LOGIN</h3>
                <div id="login-error-msg-holder">
                    <p id="login-error-msg"> Invalid username <span id="error-msg-second-line">and/or password</span></p>
                </div>
                <div>
                    <form id="login-form" style="max-width:25rem">
                        <p><input class="w3-input w3-border" type="text" placeholder="Username" required="" name="username">
                        </p>
                        <p><input class="w3-input w3-border" type="password" placeholder="Password" required=""
                                name="password"></p>
                        <p><input class="w3-input w3-border" type="password" placeholder="Confirm Password" required=""
                                name="confirmPassword"></p>
                        <p>
                            <button class="w3-button w3-black" type="submit" id="login-form-submit">
                                <i class="fa fa-sign-in-alt"></i> LOGIN
                            </button>
                        </p>
                    </form>
                </div>
            </div>
        </header>

        <div class="w3-container" id="congregation" style="padding:48px 16px 16px 16px;display:none"></div>
        <div class="w3-container" id="allPublishers" style="padding:48px 16px 0 16px;display:none"></div>
        <div class="w3-container" id="contactInformation" style="padding:16px 16px 0 16px;display:none"></div>
        <div class="w3-container" id="fieldServiceGroups" style="padding:64px 16px 0 16px; margin-top:-64px;display:none"></div>
        <div class="w3-container" id="monthlyReport" style="padding:16px 16px 0 16px;display:none"></div>
        <div class="w3-container" id="missingReport" style="padding:16px 16px 0 16px;margin-top:-32px;display:none"></div>
        <div class="w3-container" id="attendance" style="padding:0 16px 0 16px;margin-top:-32px;display:none"></div>
        <div class="w3-container" id="branchReport" style="padding:0 16px 0 16px;display:none"></div>
        <div class="w3-container" id="configuration" style="padding:0 16px 0 16px;display:none"></div>

        <script src="js/script.js"></script>
    </body>

</html>
