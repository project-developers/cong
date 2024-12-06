
const loginForm = document.getElementById("login-form");
const loginButton = document.getElementById("login-form-submit");
const defaultLogin = loginButton.innerHTML;
const loginErrorMsg = document.getElementById("login-error-msg");
loginForm.confirmPassword.style.display = 'none';
document.getElementById("securityQuestions").style.display = 'none';
loginErrorMsg.style.opacity = 0;
var logged = false, reportEntry = false;
var hiddenElements = ["congregation", "allParticipants", "allPublishers", "allAssignments", "schedule", "contactInformation", "fieldServiceGroups", "cards", "monthlyReport", "missingReport", "attendance", "branchReport", "territory", "configuration"]
var securityQuestions = [
	{value: "What was the name of your first CO?".replaceAll(' ',''), label: "What was the name of your first CO?"},
	{value: "In which city did you start preaching?".replaceAll(' ',''), label: "In which city did you start preaching?"},
	{value: "What’s your neighbor’s last name?".replaceAll(' ',''), label: "What’s your neighbor’s last name?"},
	{value: "How many pets did you have at 10?".replaceAll(' ',''), label: "How many pets did you have at 10?"},
	{value: "What month did you get married?".replaceAll(' ',''), label: "What month did you get married?"}
]


function createRadioButtons(containerId, options) {
	var container = document.getElementById(containerId);
  
	options.forEach(function(option) {
		var radioBtn = document.createElement("input");
		radioBtn.type = "radio";
		radioBtn.name = "securityGroup"; // All radio buttons with the same name belong to the same group
		radioBtn.value = option.value;
	
		var paragraph = document.createElement("br");
		var label = document.createElement("label");
		radioBtn.style.marginRight = "5px"
		label.appendChild(radioBtn);
		label.appendChild(document.createTextNode(option.label));
		container.appendChild(label)
	
		container.appendChild(paragraph);
	});
	var answerInput = document.createElement("input");
	answerInput.id = 'answer'
	answerInput.type = 'text'
	answerInput.placeholder = 'Enter answer here'
	answerInput.classList = 'w3-input w3-border'
	container.appendChild(answerInput);
}

function getSelectedOption(radioButtons) {

	for (var i = 0; i < radioButtons.length; i++) {
		if (radioButtons[i].checked) {
			var selectedOption = radioButtons[i].value;
			return selectedOption;
		}
	}
  
	console.log("No option selected");
}
  

createRadioButtons("securityQuestions", securityQuestions)

loginButton.addEventListener("click", (e) => {
    e.preventDefault();
    const username = loginForm.username.value.trim();
    const password = loginForm.password.value;

    if (loginButton.value == 'Create Account') {
		if ('' == username || ' ' == username || username.includes(' ') || username.toLowerCase() == 'reporter') {
			loginErrorMsg.innerHTML = 'Please enter a different username.'
			
		} else if ('No option selected' == getSelectedOption(document.getElementsByName("securityGroup")) || '' == document.querySelector('#answer').value.toLowerCase()) {
			loginErrorMsg.innerHTML = 'Please select question and enter answer.'
		} else if (loginForm.password.value !== loginForm.confirmPassword.value) {
			loginErrorMsg.innerHTML = 'Password is not the same.'
		} else if (allUsers.findIndex(elem=>elem.username.toLowerCase() == username.toLowerCase()) !== -1) {
			var existingUser = allUsers.filter(elem=>elem.username.toLowerCase() == username.toLowerCase())[0]
			if (existingUser.accesses.findIndex(str => currentUser.accesses.includes(str)) !== -1) {
				loginErrorMsg.innerHTML = 'User already exists. Please enter a different username.'
			} else if (existingUser.password !== password) {
				loginErrorMsg.innerHTML = 'Invalid password.'
			} else if (existingUser.selectedQuestion !== getSelectedOption(document.getElementsByName("securityGroup")) || existingUser.answer.trim() !== document.querySelector('#answer').value.toLowerCase().trim()) {
				loginErrorMsg.innerHTML = 'Invalid question and/or answer.'
			} else {
				console.log("You have successfully logged in.");
				document.getElementById("securityQuestions").style.display = 'none';
				loginForm.username.value = ''
				loginForm.password.value = ''
				loginForm.confirmPassword.value = ''
				loginForm.confirmPassword.style.display = 'none';
				hiddenElements.forEach(elem=>{
					document.getElementById(`${elem}`).style.display = ''
				})
				logged = true
				existingUser.accesses = existingUser.accesses.concat(currentUser.accesses)
				currentUser = existingUser
				currentUser.loggedIn = true
				
				document.getElementById("home").style.display = 'none'
				DBWorker.postMessage({ storeName: 'settings', action: "save", value: [currentUser]});
				DBWorker.postMessage({ dbName: 'cong-' + currentUser.username.toLowerCase(), action: "init"});
				loginErrorMsg.style.opacity = 0;
			}
		} else {
			currentUser.username = loginForm.username.value
			currentUser.password = loginForm.password.value
			currentUser.selectedQuestion = getSelectedOption(document.getElementsByName("securityGroup"))
			currentUser.answer = document.querySelector('#answer').value.toLowerCase().trim()
			configurationVue.selectedProfile = currentUser.currentProfile
			if (currentUser.currentProfile == 'Service Overseer') {
				console.log("You have successfully logged in.");
				document.getElementById("securityQuestions").style.display = 'none';
				loginForm.username.value = ''
				loginForm.password.value = ''
				loginForm.confirmPassword.value = ''
				loginForm.confirmPassword.style.display = 'none';
				currentUser.name = currentUser.username
				hiddenElements.forEach(elem=>{
					document.getElementById(`${elem}`).style.display = ''
				})
				logged = true
				//reportEntry = true
				currentUser.loggedIn = true

				allUsers.push(currentUser)

				document.getElementById("home").style.display = 'none'
				DBWorker.postMessage({ storeName: 'settings', action: "save", value: [currentUser]});
				DBWorker.postMessage({ dbName: 'cong-' + currentUser.username.toLowerCase(), action: "init"});
				loginErrorMsg.style.opacity = 0;
			}
			if (currentUser.currentProfile == 'Territory Map') {
				console.log("You have successfully logged in.");
				document.getElementById("securityQuestions").style.display = 'none';
				loginForm.username.value = ''
				loginForm.password.value = ''
				loginForm.confirmPassword.value = ''
				loginForm.confirmPassword.style.display = 'none';
				currentUser.name = currentUser.username
				hiddenElements.forEach(elem=>{
					document.getElementById(`${elem}`).style.display = ''
				})
				logged = true
				//reportEntry = true
				currentUser.loggedIn = true

				allUsers.push(currentUser)

				document.getElementById("home").style.display = 'none'
				DBWorker.postMessage({ storeName: 'settings', action: "save", value: [currentUser]});
				DBWorker.postMessage({ dbName: 'cong-' + currentUser.username.toLowerCase(), action: "init"});
				loginErrorMsg.style.opacity = 0;
			}
			if (currentUser.currentProfile == 'Accounts Servant') {
				console.log("You have successfully logged in.");
				document.getElementById("securityQuestions").style.display = 'none';
				loginForm.username.value = ''
				loginForm.password.value = ''
				loginForm.confirmPassword.value = ''
				loginForm.confirmPassword.style.display = 'none';
				currentUser.name = currentUser.username
				hiddenElements.forEach(elem=>{
					document.getElementById(`${elem}`).style.display = ''
				})
				logged = true
				//reportEntry = true
				currentUser.loggedIn = true

				allUsers.push(currentUser)

				document.getElementById("home").style.display = 'none'
				DBWorker.postMessage({ storeName: 'settings', action: "save", value: [currentUser]});
				DBWorker.postMessage({ dbName: 'cong-' + currentUser.username.toLowerCase(), action: "init"});
				loginErrorMsg.style.opacity = 0;
			}
			if (currentUser.currentProfile == 'Territory Servant') {
				console.log("You have successfully logged in.");
				document.getElementById("securityQuestions").style.display = 'none';
				loginForm.username.value = ''
				loginForm.password.value = ''
				loginForm.confirmPassword.value = ''
				loginForm.confirmPassword.style.display = 'none';
				currentUser.name = currentUser.username
				hiddenElements.forEach(elem=>{
					document.getElementById(`${elem}`).style.display = ''
				})
				logged = true
				//reportEntry = true
				currentUser.loggedIn = true

				allUsers.push(currentUser)

				document.getElementById("home").style.display = 'none'
				DBWorker.postMessage({ storeName: 'settings', action: "save", value: [currentUser]});
				DBWorker.postMessage({ dbName: 'cong-' + currentUser.username.toLowerCase(), action: "init"});
				loginErrorMsg.style.opacity = 0;
			}
			if (currentUser.currentProfile == 'Secretary') {
				console.log("You have successfully logged in.");
				document.getElementById("securityQuestions").style.display = 'none';
				loginForm.username.value = ''
				loginForm.password.value = ''
				loginForm.confirmPassword.value = ''
				loginForm.confirmPassword.style.display = 'none';
				currentUser.name = currentUser.username
				hiddenElements.forEach(elem=>{
					document.getElementById(`${elem}`).style.display = ''
				})
				logged = true
				//reportEntry = true
				currentUser.loggedIn = true

				allUsers.push(currentUser)

				document.getElementById("home").style.display = 'none'
				DBWorker.postMessage({ storeName: 'settings', action: "save", value: [currentUser]});
				DBWorker.postMessage({ dbName: 'cong-' + currentUser.username.toLowerCase(), action: "init"});
				loginErrorMsg.style.opacity = 0;
			} else if (currentUser.currentProfile == 'Secretary - Assistant') {
				console.log("You have successfully logged in.");
				document.getElementById("securityQuestions").style.display = 'none';
				loginForm.username.value = ''
				loginForm.password.value = ''
				loginForm.confirmPassword.value = ''
				loginForm.confirmPassword.style.display = 'none';
				currentUser.name = currentUser.username
				hiddenElements.forEach(elem=>{
					document.getElementById(`${elem}`).style.display = ''
				})
				logged = true
				//reportEntry = false
				currentUser.loggedIn = true
				navigationVue.displayDropdown = true

				allUsers.push(currentUser)
				
				document.getElementById("home").style.display = 'none'
				DBWorker.postMessage({ storeName: 'settings', action: "save", value: [currentUser]});
				DBWorker.postMessage({ dbName: 'cong-' + currentUser.username.toLowerCase(), action: "init"});
				loginErrorMsg.style.opacity = 0;
			}
			if (currentUser.currentProfile == 'Life and Ministry Overseer' || currentUser.currentProfile == 'Life and Ministry Assistant') {
				console.log("You have successfully logged in.");
				document.getElementById("securityQuestions").style.display = 'none';
				loginForm.username.value = ''
				loginForm.password.value = ''
				loginForm.confirmPassword.value = ''
				loginForm.confirmPassword.style.display = 'none';
				currentUser.name = currentUser.username
				hiddenElements.forEach(elem=>{
					document.getElementById(`${elem}`).style.display = ''
				})
				logged = true
				//reportEntry = false
				currentUser.loggedIn = true
				navigationVue.displayDropdown = true

				allUsers.push(currentUser)
				
				document.getElementById("home").style.display = 'none'
				DBWorker.postMessage({ storeName: 'settings', action: "save", value: [currentUser]});
				DBWorker.postMessage({ dbName: 'cong-' + currentUser.username.toLowerCase(), action: "init"});
				loginErrorMsg.style.opacity = 0;
			}
		}
	} else if (allUsers.findIndex(elem=>elem.username.toLowerCase() == username.toLowerCase() && elem.password == password) !== -1) {
        console.log("You have successfully logged in.");
		document.getElementById("securityQuestions").style.display = 'none';
		loginForm.username.value = ''
		loginForm.password.value = ''
		currentUser = allUsers.filter(elem=>elem.username.toLowerCase() == username.toLowerCase() && elem.password == password)[0]
		configurationVue.selectedProfile = currentUser.currentProfile
		hiddenElements.forEach(elem=>{
			document.getElementById(`${elem}`).style.display = ''
		})
		if (currentUser.currentProfile == 'Secretary') {
			//reportEntry = true
		} else if (currentUser.currentProfile == 'Secretary - Assistant') {
			//reportEntry = false
		}
		logged = true
		currentUser.loggedIn = true
		document.getElementById("home").style.display = 'none'
		DBWorker.postMessage({ storeName: 'settings', action: "save", value: [currentUser]});
		DBWorker.postMessage({ dbName: 'cong-' + currentUser.username.toLowerCase(), action: "init"});
		loginErrorMsg.style.opacity = 0;
		
    } else if (username.toLowerCase() === "ministry".toLowerCase() && password === "service") {
		navigationVue.buttons = [
			{
				"title": "BACK",
				"function": "missingReportVue"
			}
		]
		loginButton.innerText = 'Create Account'
		document.getElementById("securityQuestions").style.display = '';
        loginErrorMsg.innerHTML = 'You will need to create an account to continue:'
		loginForm.username.value="";
		loginForm.password.value="";
		loginForm.confirmPassword.style.display = '';
		loginForm.username.select()
		loginButton.value = 'Create Account'
		currentUser.accesses = ['so']
		currentUser.currentProfile = 'Service Overseer'
		configurationVue.reportEntry = 'so'
		configurationVue.selectedProfile = 'Service Overseer'
		loginErrorMsg.style.opacity = 1;
		
    } else if (username.toLowerCase() === "territory".toLowerCase() && password === "map") {
		navigationVue.buttons = [
			{
				"title": "BACK",
				"function": "missingReportVue"
			}
		]
		loginButton.innerText = 'Create Account'
		document.getElementById("securityQuestions").style.display = '';
        loginErrorMsg.innerHTML = 'You will need to create an account to continue:'
		loginForm.username.value="";
		loginForm.password.value="";
		loginForm.confirmPassword.style.display = '';
		loginForm.username.select()
		loginButton.value = 'Create Account'
		currentUser.accesses = ['ter']
		currentUser.currentProfile = 'Territory Map'
		configurationVue.reportEntry = 'ter'
		configurationVue.selectedProfile = 'Territory Map'
		loginErrorMsg.style.opacity = 1;
		
    } else if (username.toLowerCase() === "territory".toLowerCase() && password === "servant") {
		navigationVue.buttons = [
			{
				"title": "BACK",
				"function": "missingReportVue"
			}
		]
		loginButton.innerText = 'Create Account'
		document.getElementById("securityQuestions").style.display = '';
        loginErrorMsg.innerHTML = 'You will need to create an account to continue:'
		loginForm.username.value="";
		loginForm.password.value="";
		loginForm.confirmPassword.style.display = '';
		loginForm.username.select()
		loginButton.value = 'Create Account'
		currentUser.accesses = ['terServant']
		currentUser.currentProfile = 'Territory Servant'
		configurationVue.reportEntry = 'terServant'
		configurationVue.selectedProfile = 'Territory Servant'
		loginErrorMsg.style.opacity = 1;
		
    } else if (username.toLowerCase() === "lifeAndMinistry".toLowerCase() && password === "handler") {
		navigationVue.buttons = [
			{
				"title": "BACK",
				"function": "missingReportVue"
			}
		]
		loginButton.innerText = 'Create Account'
		document.getElementById("securityQuestions").style.display = '';
        loginErrorMsg.innerHTML = 'You will need to create an account to continue:'
		loginForm.username.value="";
		loginForm.password.value="";
		loginForm.confirmPassword.style.display = '';
		loginForm.username.select()
		loginButton.value = 'Create Account'
		currentUser.accesses = ['lmo']
		currentUser.currentProfile = 'Life and Ministry Overseer'
		configurationVue.reportEntry = 'lmo'
		configurationVue.selectedProfile = 'Life and Ministry Overseer'
		loginErrorMsg.style.opacity = 1;
		
    } else if (username.toLowerCase() === "accounts".toLowerCase() && password === "record") {
		navigationVue.buttons = [
			{
				"title": "BACK",
				"function": "missingReportVue"
			}
		]
		loginButton.innerText = 'Create Account'
		document.getElementById("securityQuestions").style.display = '';
        loginErrorMsg.innerHTML = 'You will need to create an account to continue:'
		loginForm.username.value="";
		loginForm.password.value="";
		loginForm.confirmPassword.style.display = '';
		loginForm.username.select()
		loginButton.value = 'Create Account'
		currentUser.accesses = ['acct']
		currentUser.currentProfile = 'Accounts Servant'
		configurationVue.reportEntry = 'acct'
		configurationVue.selectedProfile = 'Accounts Servant'
		loginErrorMsg.style.opacity = 1;
		
    } else if (username.toLowerCase() === "lifeAndMinistry".toLowerCase() && password === "assist") {
		navigationVue.buttons = [
			{
				"title": "BACK",
				"function": "missingReportVue"
			}
		]
		loginButton.innerText = 'Create Account'
		document.getElementById("securityQuestions").style.display = '';
        loginErrorMsg.innerHTML = 'You will need to create an account to continue:'
		loginForm.username.value="";
		loginForm.password.value="";
		loginForm.confirmPassword.style.display = '';
		loginForm.username.select()
		loginButton.value = 'Create Account'
		currentUser.accesses = ['lma']
		currentUser.currentProfile = 'Life and Ministry Assistant'
		configurationVue.reportEntry = 'lma'
		configurationVue.selectedProfile = 'Life and Ministry Assistant'
		loginErrorMsg.style.opacity = 1;
		
    } else if (username.toLowerCase() === "reporter".toLowerCase() && password === "reportEntry") {
		navigationVue.buttons = [
			{
				"title": "BACK",
				"function": "missingReportVue"
			}
		]
		loginButton.innerText = 'Create Account'
		document.getElementById("securityQuestions").style.display = '';
        loginErrorMsg.innerHTML = 'You will need to create an account to continue:'
		loginForm.username.value="";
		loginForm.password.value="";
		loginForm.confirmPassword.style.display = '';
		loginForm.username.select()
		loginButton.value = 'Create Account'
		currentUser.accesses = ['sendReport']
		currentUser.currentProfile = 'Secretary - Assistant'
		configurationVue.reportEntry = 'sendReport'
		configurationVue.selectedProfile = 'Secretary - Assistant'
		loginErrorMsg.style.opacity = 1;
		
    } else if (username.toLowerCase() === "reporter".toLowerCase() && password === "sec") {
		navigationVue.buttons = [
			{
				"title": "BACK",
				"function": "missingReportVue"
			}
		]
		loginButton.innerText = 'Create Account'
		document.getElementById("securityQuestions").style.display = '';
        loginErrorMsg.innerHTML = 'You will need to create an account to continue:'
		loginForm.username.value="";
		loginForm.password.value="";
		loginForm.confirmPassword.style.display = '';
		loginForm.username.select()
		loginButton.value = 'Create Account'
		currentUser.accesses = ['secretary']
		currentUser.currentProfile = 'Secretary'
		configurationVue.reportEntry = 'secretary'
		configurationVue.selectedProfile = 'Secretary'
		loginErrorMsg.style.opacity = 1;
		
    } else {
		loginForm.password.value="";
        loginErrorMsg.style.opacity = 1;
    }
})

var currentUser = { "name": "currentUser", "username": null, "password": null, "accesses": [], "selectedQuestion": null, "answer": null }
var allUsers;

var navigationVue, navigationVue2, allPublishersVue, congregationVue, configurationVue, branchReportVue, contactInformationVue, fieldServiceGroupsVue, cardsVue, monthlyReportVue, missingReportVue, allAssignmentsVue, scheduleVue, territoryVue, entryVue, approvalsVue, fileVue, archiveVue;
var allButtons = [
	{"title": "CONG", "function": "congregationVue"}, 
	{"title": "RECORDS", "function": "allPublishersVue"}, 
	{"title": "REQUEST", "function": "allPublishersVue"}, 
	{"title": "TRANSFER", "function": "allPublishersVue"},
	{"title": "MAIL", "function": "allPublishersVue"},
	{"title": "GROUPS", "function": "fieldServiceGroupsVue"}, 
	{"title": "ACTIVE", "function": "fieldServiceGroupsVue"}, 
	{"title": "ALL", "function": "fieldServiceGroupsVue"},
	{"title": "CARDS", "function": "cardsVue"},
	{"title": "CONTACTS", "function": "contactInformationVue"}, 
	{"title": "REPORTS", "function": "missingReportVue"}, 
	{"title": "CURRENT", "function": "monthlyReportVue"}, 
	{"title": "ASSIGNMENTS", "function": "allAssignmentsVue"},
	{"title": "SCHEDULE", "function": "scheduleVue"},
	{"title": "BRANCH", "function": "branchReportVue"}, 
	{"title": "ATTENDANCE", "function": "attendanceVue"},
	{"title": "PARTICIPANTS", "function": "allParticipantsVue"},
	{"title": "TERRITORY", "function": "territoryVue"},
	{"title": "SETTINGS", "function": "configurationVue"},
	{"title": "ENTRY", "function": "entryVue"},
	{"title": "APPROVALS", "function": "approvalsVue"},
	{"title": "FILE", "function": "fileVue"},
	{"title": "ARCHIVE", "function": "archiveVue"}
]
//var CongregationData = JSON.parse(localStorage.getItem('CongregationData'));

function createWorker(script, fn) {
    var blob;
    if (script) {
        blob = new Blob([`importScripts(${script});\n\n`, 'self.onmessage = ', fn.toString()], { type: 'text/javascript' });
    } else {
        blob = new Blob(['self.onmessage = ', fn.toString()], { type: 'text/javascript' });
    }
    var url = URL.createObjectURL(blob);
    return new Worker(url);
}

var DBWorker = new Worker("js/indexedDB.js")

DBWorker.postMessage({ dbName: 'handler', action: "init"});

var configured, reset, resetCount = 0;

var currentMonth = `${new Date().getFullYear()}-${(new Date().getMonth() + 1).toString().padStart(2, '0')}`;

var reportButtons = [{"title": "CURRENT", "function": "monthlyReportVue"}, {"title": "REPORTS", "function": "missingReportVue"}, {"title": "BRANCH", "function": "branchReportVue"}]
var currentMode = 'System';
var mode = 'w3-card w3-white';
var xmlDoc;

var progressBar = document.createElement('div');
progressBar.id = 'progressBar';
progressBar.innerHTML = `<div style="background:#f0f0ef;margin:5px 0;border-radius: 25px;"><div id="myBar" style="background:#155d27;height:4px;width:0%;border-radius: 25px;">
    </div></div>
    <p id="myP"></p>`
var barElem, initialCount = 0, oldRecords = []
progressBar.className = 'w3-center'
var loadPublishers = 0;

const currentDate = new Date()
var currentServiceYear = currentDate.getFullYear()
if (currentDate.getMonth() > 8) {
	currentServiceYear++
}

DBWorker.onmessage = async function (msg) {
    var msgData = msg.data;
    //console.log(msgData)
	if (configurationVue.reset == true){
		//resetCount--
		if (msgData.value) {
			console.log(msgData)
			resetCount--
			if (msgData.value.length !== 0) {
				//resetCount--
				resetCount += msgData.value.length
				msgData.value.forEach(elem=>{
					if (msgData.name == 'lifeAndMinistryAssignments') {
						DBWorker.postMessage({ storeName: msgData.name, action: "deleteItem", value: elem.week});
					} else {
						DBWorker.postMessage({ storeName: msgData.name, action: "deleteItem", value: elem.name});
					}
				})
			}
			if (resetCount === 0) {
				window.indexedDB.deleteDatabase('cong-' + currentUser.username.toLowerCase());
				location.reload()
			}
		} else if (msgData.length == 3) {
			resetCount--
			document.querySelector('#status1').innerHTML = `Deleting items: ${msgData[1]} - ${msgData[2]}.`
			document.querySelector('#status2').innerHTML = `${resetCount} Remaining.`
			document.querySelector('#status3').innerHTML = `Please wait . . .`
			if (resetCount === 0) {
				window.indexedDB.deleteDatabase('cong-' + currentUser.username.toLowerCase());
				location.reload()
			}
		}
		return
	} else {
		switch (msgData.name) {
			case "configuration":
				{
					//console.log(msgData.value)
					if (msgData.value.filter(elem=>elem.name == "Current Profile").length !== 0) {
						currentUser.currentProfile = msgData.value.filter(elem=>elem.name == "Current Profile")[0].value
						configurationVue.selectedProfile = msgData.value.filter(elem=>elem.name == "Current Profile")[0].value
					}
					if (msgData.value.filter(elem=>elem.name == "Congregation").length == 0) {
						configurationVue.display = true
						configured = false
						configurationVue.configuration = defaultConfiguration
						attendanceVue.currentMonth = currentMonthAttendance
						attendanceVue.meetingAttendanceRecord = meetingAttendanceRecord
						
						//configurationVue.configuration = result.configuration
						navigationVue.allGroups = configurationVue.configuration.fieldServiceGroups
						if (currentUser.currentProfile == 'Secretary') {
							navigationVue.buttons = [{"title": "CONTACTS", "function": "contactInformationVue"}, {"title": "RECORDS", "function": "allPublishersVue"}, {"title": "GROUPS", "function": "fieldServiceGroupsVue"}, {"title": "REPORTS", "function": "missingReportVue"}]
							configurationVue.reportEntry = 'secretary'
							//congregationVue.display = true
						} else if (currentUser.currentProfile == 'Secretary - Assistant') {
							configurationVue.reportEntry = 'sendReport'
							navigationVue.buttons = [{"title": "CURRENT", "function": "monthlyReportVue"}, {"title": "ATTENDANCE", "function": "attendanceVue"}, {"title": "BRANCH", "function": "branchReportVue"}]
							navigationVue.displayDropdown = true
							//missingReportVue.display = true
						} else if (currentUser.currentProfile == 'Service Overseer') {
							navigationVue.buttons = [{"title": "TERRITORY", "function": "territoryVue"}, {"title": "CONTACTS", "function": "contactInformationVue"}, {"title": "GROUPS", "function": "fieldServiceGroupsVue"}]
							configurationVue.reportEntry = 'so'
							//congregationVue.display = true
						} else if (currentUser.currentProfile == 'Territory Map') {
							navigationVue.buttons = []
							configurationVue.reportEntry = 'ter'
							//congregationVue.display = true
						} else if (currentUser.currentProfile == 'Territory Servant') {
							navigationVue.buttons = []
							configurationVue.reportEntry = 'terServant'
							//congregationVue.display = true
						} else if (currentUser.currentProfile == 'Life and Ministry Overseer') {
							configurationVue.reportEntry = 'lmo'
							navigationVue.buttons = [{"title": "SCHEDULE", "function": "scheduleVue"}, {"title": "PARTICIPANTS", "function": "allParticipantsVue"}, {"title": "CONTACTS", "function": "contactInformationVue"}]
							//allAssignmentsVue.display = true
						} else if (currentUser.currentProfile == 'Life and Ministry Assistant') {
							configurationVue.reportEntry = 'lma'
							navigationVue.buttons = [{"title": "SCHEDULE", "function": "scheduleVue"}, {"title": "PARTICIPANTS", "function": "allParticipantsVue"}, {"title": "CONTACTS", "function": "contactInformationVue"}]
							//allAssignmentsVue.display = true
						} else if (currentUser.currentProfile == 'Accounts Servant') {
							configurationVue.reportEntry = 'acct'
							navigationVue.buttons = [{"title": "FILE", "function": "currentVue"}, {"title": "APPROVALS", "function": "approvalsVue"}, {"title": "ARCHIVE", "function": "archiveVue"}]//, {"title": "PARTICIPANTS", "function": "allParticipantsVue"}, {"title": "CONTACTS", "function": "contactInformationVue"}]
							//allAssignmentsVue.display = true
						}
					}
					if (msgData.value.filter(elem=>elem.name == "Congregation").length !== 0) {
						if (currentUser.currentProfile == 'Secretary') {
							configurationVue.reportEntry = 'secretary'
							navigationVue.buttons = [{"title": "CONTACTS", "function": "contactInformationVue"}, {"title": "RECORDS", "function": "allPublishersVue"}, {"title": "GROUPS", "function": "fieldServiceGroupsVue"}, {"title": "REPORTS", "function": "missingReportVue"}]
							congregationVue.display = true
						} else if (currentUser.currentProfile == 'Secretary - Assistant') {
							configurationVue.reportEntry = 'sendReport'
							navigationVue.buttons = [{"title": "CURRENT", "function": "monthlyReportVue"}, {"title": "ATTENDANCE", "function": "attendanceVue"}, {"title": "BRANCH", "function": "branchReportVue"}]
							navigationVue.displayDropdown = true
							missingReportVue.display = true
						} else if (currentUser.currentProfile == 'Service Overseer') {
							navigationVue.buttons = [{"title": "TERRITORY", "function": "territoryVue"}, {"title": "CONTACTS", "function": "contactInformationVue"}, {"title": "GROUPS", "function": "fieldServiceGroupsVue"}]
							configurationVue.reportEntry = 'so'
							congregationVue.display = true
						} else if (currentUser.currentProfile == 'Territory Map') {
							navigationVue.buttons = []
							configurationVue.reportEntry = 'ter'
							territoryVue.display = true
							//DBWorker.postMessage({ storeName: 'territory', action: "readAll"});
							//return
						} else if (currentUser.currentProfile == 'Territory Servant') {
							navigationVue.buttons = []
							configurationVue.reportEntry = 'terServant'
							territoryVue.display = true
							//DBWorker.postMessage({ storeName: 'territory', action: "readAll"});
							//return
						} else if (currentUser.currentProfile == 'Life and Ministry Overseer') {
							configurationVue.reportEntry = 'lmo'
							navigationVue.buttons = [{"title": "SCHEDULE", "function": "scheduleVue"}, {"title": "PARTICIPANTS", "function": "allParticipantsVue"}, {"title": "CONTACTS", "function": "contactInformationVue"}]
							allAssignmentsVue.display = true
						} else if (currentUser.currentProfile == 'Life and Ministry Assistant') {
							configurationVue.reportEntry = 'lma'
							navigationVue.buttons = [{"title": "SCHEDULE", "function": "scheduleVue"}, {"title": "PARTICIPANTS", "function": "allParticipantsVue"}, {"title": "CONTACTS", "function": "contactInformationVue"}]
							allAssignmentsVue.display = true
						} else if (currentUser.currentProfile == 'Accounts Servant') {
							configurationVue.reportEntry = 'acct'
							navigationVue.buttons = [{"title": "FILE", "function": "currentVue"}, {"title": "APPROVALS", "function": "approvalsVue"}, {"title": "ARCHIVE", "function": "archiveVue"}]//, {"title": "PARTICIPANTS", "function": "allParticipantsVue"}, {"title": "CONTACTS", "function": "contactInformationVue"}]
							entryVue.display = true
						}

						configured = true
						//navigationVue.buttons = [{"title": "CONG", "function": "congregationVue"}, {"title": "RECORDS", "function": "allPublishersVue"}, {"title": "GROUPS", "function": "fieldServiceGroupsVue"}, {"title": "REPORTS", "function": "missingReportVue"}]
						
						//navigationVue.buttons = [{"title": "RECORDS", "function": "allPublishersVue"}, {"title": "GROUPS", "function": "fieldServiceGroupsVue"}, {"title": "CONTACTS", "function": "contactInformationVue"}, {"title": "REPORTS", "function": "missingReportVue"}, {"title": "ATTENDANCE", "function": "attendanceVue"}, {"title": "SETTINGS", "function": "configurationVue"}]
						configurationVue.configuration = msgData.value.filter(elem=>elem.name == "Congregation")[0]
						navigationVue.allGroups = msgData.value.filter(elem=>elem.name == "Congregation")[0].fieldServiceGroups
						configurationVue.midweekMeetingDay = configurationVue.configuration.midweekMeetingDay
						configurationVue.midweekMeetingTime = configurationVue.configuration.midweekMeetingTime
						configurationVue.fieldServiceGroupDetails = configurationVue.configuration.fieldServiceGroupDetails ? configurationVue.configuration.fieldServiceGroupDetails : []
						DBWorker.postMessage({ storeName: 'account', action: "readAll"});
						DBWorker.postMessage({ storeName: 'data', action: "readAll"});
						DBWorker.postMessage({ storeName: 'attendance', action: "readAll"});
						DBWorker.postMessage({ storeName: 'files', action: "readAll"});
						DBWorker.postMessage({ storeName: 'lifeAndMinistryAssignments', action: "readAll"});
						DBWorker.postMessage({ storeName: 'lifeAndMinistryEnrolments', action: "readAll"});
						DBWorker.postMessage({ storeName: 'territory', action: "readAll"});
					}
					if (msgData.value.filter(elem=>elem.name == "Display").length !== 0) {
						//console.log(msgData.value.filter(elem=>elem.name == "Display"))
						currentMode = msgData.value.filter(elem=>elem.name == "Display")[0].value
						configurationVue.displayMode({"value": currentMode})
					}
				}
				break;
			case "data":
				{
					if (!msgData.value[0].report) {
						allPublishersVue.publishers = msgData.value
						return
					}
					oldRecords = msgData.value.filter(elem=>elem.report.currentServiceYear.year !== currentServiceYear)
					const currentRecords = msgData.value.filter(elem=>elem.report.currentServiceYear.year === currentServiceYear)
					allPublishersVue.publishers = currentRecords
					loadPublishers++
					if (oldRecords.length !== 0 && loadPublishers == 2) {
						const loadingBar = document.createElement('div')
						loadingBar.id = 'loadingBar'
						loadingBar.className = 'w3-center w3-large'
						document.querySelector('div#congregation.w3-container').appendChild(loadingBar)
						document.querySelector('div#congregation.w3-container').appendChild(progressBar)
						loadingBar.innerHTML = 'Updating Service Year'
						initialCount = oldRecords.length
						barElem = document.getElementById("myBar");
						updateServiceYear(oldRecords.shift())
					}
					//console.log(msgData.value, currentDate.getMonth(), currentServiceYear, oldRecords, currentRecords)
				}
				break;
			case "files":
				{
					//myFile = msgData.value
					//console.log(msgData.value)
					//console.log(msgData.value[0])
					myFiles = msgData.value
					if (fileVue.display == true) {
						if (fileVue.allFiles().filter(elem=>elem.name == fileVue.currentFile + ' - ' + fileVue.currentMonth).length !== 0) {
							fileVue.loadFile()
						}
					}
					if (approvalsVue.display == true) {
						if (approvalsVue.allFiles().filter(elem=>elem.name == approvalsVue.currentFile).length !== 0) {
							approvalsVue.loadFile()
						}
					}
					if (cardsVue.display == true) {
						if (cardsVue.allFiles().filter(elem=>elem.name == `${cardsVue.currentCard} Record Card - ${cardsVue.currentPublisher}`).length !== 0) {
							cardsVue.loadFile()
						}
					}
					if (msgData.value.filter(elem=>elem.name == 'S-21').length !== 0) {
						//console.log(msgData.value.filter(elem=>elem.name == 'S-21')[0], oldRecords)
						if (!s21Data) {
							await getFieldByName(msgData.value.filter(elem=>elem.name == 'S-21')[0].value, 'S-21')
							loadPublishers++
							if (oldRecords.length !== 0 && loadPublishers == 2) {
								const loadingBar = document.createElement('div')
								loadingBar.id = 'loadingBar'
								loadingBar.className = 'w3-center w3-large'
								document.querySelector('div#congregation.w3-container').appendChild(loadingBar)
								document.querySelector('div#congregation.w3-container').appendChild(progressBar)
								loadingBar.innerHTML = 'Updating Service Year'
								initialCount = oldRecords.length
								barElem = document.getElementById("myBar");
								updateServiceYear(oldRecords.shift())
							}
						}
					}
					if (msgData.value.filter(elem=>elem.name == 'S-26').length !== 0) {
						//console.log(msgData.value.filter(elem=>elem.name == 'S-21_E.pdf')[0])
						if (!s26Data) {
							await getFieldByName(msgData.value.filter(elem=>elem.name == 'S-26')[0].value, 'S-26')
						}
					}
					if (msgData.value.filter(elem=>elem.name == 'S-30').length !== 0) {
						//console.log(msgData.value.filter(elem=>elem.name == 'S-21_E.pdf')[0])
						if (!s30Data) {
							await getFieldByName(msgData.value.filter(elem=>elem.name == 'S-30')[0].value, 'S-30')
						}
					}
					if (msgData.value.filter(elem=>elem.name == 'TO-62').length !== 0) {
						//console.log(msgData.value.filter(elem=>elem.name == 'S-21_E.pdf')[0])
						if (!to62Data) {
							await getFieldByName(msgData.value.filter(elem=>elem.name == 'TO-62')[0].value, 'TO-62')
						}
					}
					if (msgData.value.filter(elem=>elem.name == 'S-88').length !== 0) {
						//console.log(msgData.value.filter(elem=>elem.name == 'S-21_E.pdf')[0])
						if (!s88Data) {
							await getFieldByName(msgData.value.filter(elem=>elem.name == 'S-88')[0].value, 'S-88')
						}
					}
					if (msgData.value.filter(elem=>elem.name == 'S-89').length !== 0) {
						//console.log(msgData.value.filter(elem=>elem.name == 'S-21_E.pdf')[0])
						if (!s89Data) {
							await getFieldByName(msgData.value.filter(elem=>elem.name == 'S-89')[0].value, 'S-89')
						}
					}
				}
				break;
			case "settings":
				{
					//console.log(msgData.value)
					//if (msgData.value.filter(elem=>elem.name == currentUser.username).length !== 0) {
					allUsers = msgData.value//.filter(elem=>elem.name == currentUser.username)[0]
					//console.log(allUsers.filter(elem=>elem.loggedIn == true))
					const loggedInUser = allUsers.filter(elem=>elem.loggedIn == true)
					if (loggedInUser.length !== 0) {
						loginForm.username.value = loggedInUser[0].username
						loginForm.password.value = loggedInUser[0].password
						loginButton.click()
					}
					//}
				}
				break;
			case "attendance":
				{
					if (msgData.value.filter(elem=>elem.name == "Monthly").length !== 0 && msgData.value.filter(elem=>elem.name == "Monthly")[0].month == currentMonth) {
						//console.log(msgData.value)
						attendanceVue.currentMonth = msgData.value.filter(elem=>elem.name == "Monthly")[0]
					} else {
						attendanceVue.currentMonth = currentMonthAttendance
						DBWorker.postMessage({ storeName: 'attendance', action: "save", value: [attendanceVue.currentMonth]});
					}

					if (msgData.value.filter(elem=>elem.name == "Meeting Attendance Record").length !== 0) {
						var currentAttendance = msgData.value.filter(elem=>elem.name == "Meeting Attendance Record")[0]
						if (currentAttendance.meetings[0].currentServiceYear.year === currentServiceYear) {
							attendanceVue.meetingAttendanceRecord = currentAttendance
						} else {
							currentAttendance.meetings.forEach(meeting=>{
								meeting.lastServiceYear = JSON.parse(JSON.stringify(meeting.currentServiceYear))
								meeting.currentServiceYear = JSON.parse(JSON.stringify(meetingAttendanceRecord.meetings[0].currentServiceYear))
								meeting.currentServiceYear.year = currentServiceYear
							})
							attendanceVue.meetingAttendanceRecord = currentAttendance
							DBWorker.postMessage({ storeName: 'attendance', action: "save", value: [currentAttendance]});
						}
							
					} else {
						attendanceVue.meetingAttendanceRecord = meetingAttendanceRecord
						DBWorker.postMessage({ storeName: 'attendance', action: "save", value: [attendanceVue.meetingAttendanceRecord]});
					}
					
				}
				break;
			case "account":
				{
					//console.log(msgData.value)
					entryVue.allEntries = msgData.value
					//allAssignmentsVue.allAssignments = msgData.value
					
				}
				break;
			case "savings":
				{
					if (monthlyReportVue.saved !== 0) {
						//console.log(msgData)
						monthlyReportVue.saved--
					}
					if (missingReportVue.saved !== 0) {
						//console.log(msgData)
						missingReportVue.saved--
					}
				}
				break;
			case "lifeAndMinistryAssignments":
				{
					//console.log(msgData.value)					
					allAssignmentsVue.allAssignments = msgData.value
					
				}
				break;
			case "lifeAndMinistryEnrolments":
				{
					//console.log(msgData.value)
					allParticipantsVue.enrolments = msgData.value
					
				}
				break;
			case "territory":
				{
					//console.log(msgData.value)
					if (msgData.value.length !== 0) {
						myTerritory = msgData.value
						territoryVue.savedPolygons = msgData.value[0].value
						if (currentUser.currentProfile == 'Territory Map' || currentUser.currentProfile == 'Territory Servant') {
							gotoView('territoryVue')
						}
					}
				}
				break;
			case "done":
				{
					// No code here
				}
				break;
		}
	}
}

var myFiles = [], myTerritory;

async function updateServiceYear(publisher) {
	barElem.style.width = ((initialCount - oldRecords.length) / initialCount) * 100 + '%';
	document.getElementById("myP").innerHTML = `Processing Records for ${publisher.name}. Please wait . . .`;

	//console.log(JSON.parse(JSON.stringify(publisher.report.currentServiceYear)))
	publisher.report.lastServiceYear = JSON.parse(JSON.stringify(publisher.report.currentServiceYear))
	publisher.report.currentServiceYear = JSON.parse(JSON.stringify(newPublisherRecord.report.currentServiceYear))
	publisher.report.currentServiceYear.year = currentServiceYear

	//console.log(publisher)
	await shortWait()
	await shortWait()

	await fillPublisherRecord([publisher, 'lastServiceYear'])

	await shortWait()
	await shortWait()

	await fillPublisherRecord([publisher, 'currentServiceYear'])
	DBWorker.postMessage({ storeName: 'data', action: "save", value: [publisher]});
	allPublishersVue.publishers.push(publisher)

	if (oldRecords.length !== 0) {
		updateServiceYear(oldRecords.shift())
	} else {
		document.getElementById("myP").innerHTML = `Update Completed. Reloading in 1 minute. Please wait . . .`;
		await oneMinuteWait()
		location.reload()
	}
}

// style="padding:16px 0 0 2px; margin-top:1px"  style="margin-top:2px"

document.querySelector('#navigation').innerHTML = `<template>
<div class="w3-bar w3-white w3-card" id="myNavbar">
	<a class="w3-bar-item w3-button w3-wide" @click="openButton($event.target)">{{ buttons[0] ? buttons[0].title : '' }}</a>
	<!-- Right-sided navbar links -->
	<div class="w3-right w3-hide-small">
		<a v-for="(button, count) in buttons.slice(1)" class="w3-bar-item w3-button" @click="openButton($event.target)">{{ button.title }}</a>
		<a v-if="logged() == true && showDownloadButton()" class="w3-bar-item w3-button" @click="downloadContent()"><i title="Download" class="fa fa-download"></i></a>
		<a v-if="logged() == true" class="w3-bar-item w3-button" @click="openSettings()"><i class="fa fa-cog"></i></a>
		<a v-if="logged() == true" class="w3-bar-item w3-button" @click="signOut()"><i class="fa fa-sign-out-alt"></i></a>
		<div v-if="logged() == true && displayDropdown == true">
			
			<input 
				:class="inputMode()"
				v-model="searchTerms" 
				placeholder="Search . . ." 
				type="text" 
			>
			<select style="width:180px;" :class="searchMode()" v-model="fieldServiceGroup">
				<option v-if="allGroups.length > 1" value="All Groups">All Groups</option>
				<option v-for="group in allGroups" :key="group" :value="group">{{ group }}</option>
			</select>
		</div>
	</div>
	<!-- Hide right-floated links on small screens and replace them with a menu icon -->

	<a href="javascript:void(0)" v-if="logged() == true" class="w3-bar-item w3-button w3-right w3-hide-large w3-hide-medium" onclick="w3_open()">
		<i class="fa fa-bars"></i>
	</a>
	<div v-if="logged() == true && displayDropdown == true" class="w3-hide-large w3-hide-medium">
		
		<input 
			:class="inputMode()"
			v-model="searchTerms" 
			placeholder="Search . . ." 
			type="text" 
		>
		<select style="width:150px;" :class="searchMode()" v-model="fieldServiceGroup">
			<option v-if="allGroups.length > 1" value="All Groups">All Groups</option>
			<option v-for="group in allGroups" :key="group" :value="group">{{ group }}</option>
		</select>
	</div>
</div>
</template>`

function processNavigation() {

    navigationVue = new Vue({
        el: document.querySelector('#navigation'),
        data: {
            buttons: [],
            allGroups: [],
            fieldServiceGroup: 'All Groups',
			searchTerms: '',
			display: false,
			displayDropdown: false,
        },
        computed: {
            
        },
        methods: {
			showDownloadButton() {
				return allPublishersVue.display == true ||	fieldServiceGroupsVue.display == true || contactInformationVue.display == true || cardsVue.display == true || (attendanceVue.display == true && currentUser.currentProfile == 'Secretary')
			},
			async downloadContent() {
				if (attendanceVue.display == true) {
					fillAttendanceRecord()
					return
				}
				if (allButtons.filter(elem=>elem.title == currentView)[0].title == 'CARDS') {
					document.querySelector('.fa-download').classList.add('fa-spinner')
					document.querySelector('.fa-download').classList.add('fa-spin')
					recordsToCreate = allPublishersVue.publishers.map(elem=>[elem, 'currentServiceYear'])
					if (document.querySelector('#cardProcessStatus')) {
						document.querySelector('#cardProcessStatus').style.display = ''
						document.querySelector('#cardProcessStatus').innerHTML = `Processing cards. Please Wait . . .
						<br>${recordsToCreate.length} Remaining.`
					}
					await fillPublisherRecord(recordsToCreate.shift())
					return
				}
				console.log(currentView)
				console.log(allButtons.filter(elem=>elem.title == currentView))
				var allGroupsBackup = [].concat(allPublishersVue.allGroups)
				var restoreAllGroups = [].concat(allPublishersVue.allGroups)
				var backupMode = currentMode
				if (backupMode !== 'Light') {
					configurationVue.displayMode({"value": 'Light'})
					await shortWait()
					await shortWait()
					await shortWait()
					await shortWait()
				}

				if (allButtons.filter(elem=>elem.title == currentView)[0].function == "fieldServiceGroupsVue") {
				
					var i = 1
					while (allGroupsBackup.length !== 0) {
						this.allGroups = allGroupsBackup.splice(0, 3)
						await shortWait()
						await shortWait()
						console.log(allGroupsBackup)
						var fileName
						if (fieldServiceGroupsVue.active !== true) {
							fileName = 'Field Service Groups - ' + i
						} else {
							fileName = 'Field Service Groups - ALL - ' + i
						}
						generatePDF(document.getElementById('fieldServiceGroups'), fileName)
						i++
						await shortWait()
						await shortWait()
					}
					
					this.allGroups = restoreAllGroups
					await shortWait()
					await shortWait()
				
				} else if (allButtons.filter(elem=>elem.title == currentView)[0].function == "allPublishersVue") {
				
					await shortWait()
					await shortWait()
					console.log(allGroupsBackup)
					var fileName = 'All Publishers'
					generatePDF(document.getElementById('allPublishers'), fileName)
					await shortWait()
					await shortWait()
					
					await shortWait()
					await shortWait()
				
				} else if (allButtons.filter(elem=>elem.title == currentView)[0].function == "contactInformationVue") {
					var i = 1
					while (allGroupsBackup.length !== 0) {
						this.allGroups = allGroupsBackup.splice(0, 1)
						await shortWait()
						await shortWait()
						console.log(allGroupsBackup)
						var fileName = 'Contact Information - ' + this.allGroups[0]
						generatePDF(document.getElementById('contactInformation'), fileName)
						i++
						await shortWait()
						await shortWait()
					}
					
					this.allGroups = restoreAllGroups
					await shortWait()
					await shortWait()
					
				}

				if (backupMode !== 'Light') {
					configurationVue.displayMode({"value": backupMode})
				}
			},
			inputMode() {
				return 'w3-bar-item w3-search ' + mode.replace('w3-card ','')
			},
			searchMode() {
				return 'w3-bar-item w3-select ' + mode.replace('w3-card ','')
			},
			async openButton(button) {
				if (logged == false) {

					navigationVue.buttons = [
						{
							"title": "",
							"function": "missingReportVue"
						}
					]

					loginButton.innerHTML = defaultLogin
					document.getElementById("securityQuestions").style.display = 'none';
					
					loginErrorMsg.innerHTML = ` Invalid username <span id="error-msg-second-line">and/or password</span>`
					
					loginForm.password.value="";
					loginForm.confirmPassword.value="";
					loginForm.confirmPassword.style.display = 'none';
					loginForm.username.select()
					loginButton.value = ''
					currentUser.accesses = []
					loginErrorMsg.style.opacity = 0;
					
					return 
				}

				currentView = button.innerHTML                
				
				if (allPublishersVue.transfer == true || allPublishersVue.correspondence == true || scheduleVue.display == true || fileVue.display == true) {
					selectedTransferPublishers.length = 0
					var i = 0
					document.querySelectorAll('#publisherRequest select').forEach(elem=>{
						if (elem !== '') {
							selectedTransferPublishers.push(allPublishersVue.publishers.filter(ele=>ele.name == elem.value)[0])
						}
						if (i !== 0) {
							elem.parentNode.remove()
						}
						i++
					})
					document.querySelectorAll('iframe').forEach(elem=>{
						elem.parentNode.remove()
					})
					if (document.querySelector('#content')) {
						document.querySelector('#content').style.display = ''
					}
					if (document.querySelector('.weekSelector')) {
						document.querySelector('.weekSelector').style.display = ''
					}
				}

				configurationVue.display = false

				if (button.innerHTML == "REPORTS") {
					this.displayDropdown = true
					allPublishersVue.request = false
					allPublishersVue.transfer = false
					allPublishersVue.correspondence = false
					this.buttons = [{"title": "CURRENT", "function": "monthlyReportVue"}, {"title": "ATTENDANCE", "function": "attendanceVue"}, {"title": "BRANCH", "function": "branchReportVue"}, {"title": "CONG", "function": "congregationVue"}]
				} else if (button.innerHTML == "CURRENT") {
					this.displayDropdown = true
					allPublishersVue.request = false
					allPublishersVue.transfer = false
					allPublishersVue.correspondence = false
					this.buttons = [{"title": "REPORTS", "function": "missingReportVue"}, {"title": "ATTENDANCE", "function": "attendanceVue"}, {"title": "BRANCH", "function": "branchReportVue"}, {"title": "CONG", "function": "congregationVue"}]
				} else if (button.innerHTML == "ATTENDANCE") {
					this.displayDropdown = false
					allPublishersVue.request = false
					allPublishersVue.transfer = false
					allPublishersVue.correspondence = false
					this.buttons = [{"title": "REPORTS", "function": "missingReportVue"}, {"title": "CURRENT", "function": "monthlyReportVue"}, {"title": "BRANCH", "function": "branchReportVue"}, {"title": "CONG", "function": "congregationVue"}]
				} else if (button.innerHTML == "BRANCH") {
					this.displayDropdown = false
					allPublishersVue.request = false
					allPublishersVue.transfer = false
					allPublishersVue.correspondence = false
					this.buttons = [{"title": "REPORTS", "function": "missingReportVue"}, {"title": "CURRENT", "function": "monthlyReportVue"}, {"title": "ATTENDANCE", "function": "attendanceVue"}, {"title": "CONG", "function": "congregationVue"}]
				} else if (button.innerHTML == "CONG") {
					this.displayDropdown = false
					allPublishersVue.request = false
					allPublishersVue.transfer = false
					allPublishersVue.correspondence = false
					if (currentUser.currentProfile == 'Service Overseer') {
						this.buttons = [{"title": "TERRITORY", "function": "territoryVue"}, {"title": "CONTACTS", "function": "contactInformationVue"}, {"title": "GROUPS", "function": "fieldServiceGroupsVue"}]
					} else {
						this.buttons = [{"title": "CONTACTS", "function": "contactInformationVue"}, {"title": "RECORDS", "function": "allPublishersVue"}, {"title": "GROUPS", "function": "fieldServiceGroupsVue"}, {"title": "REPORTS", "function": "missingReportVue"}]
					}
				} else if (button.innerHTML == "CONTACTS") {
					this.displayDropdown = true
					allPublishersVue.request = false
					allPublishersVue.transfer = false
					allPublishersVue.correspondence = false
					if (currentUser.currentProfile == 'Life and Ministry Overseer' || currentUser.currentProfile == 'Life and Ministry Assistant') {
						this.buttons = [{"title": "ASSIGNMENTS", "function": "allAssignmentsVue"}, {"title": "SCHEDULE", "function": "scheduleVue"}, {"title": "PARTICIPANTS", "function": "allParticipantsVue"}]
					} else {
						this.buttons = [{"title": "CONG", "function": "congregationVue"}, {"title": "RECORDS", "function": "allPublishersVue"}, {"title": "GROUPS", "function": "fieldServiceGroupsVue"}, {"title": "REPORTS", "function": "missingReportVue"}]
					}
				} else if (button.innerHTML == "RECORDS") {
					this.displayDropdown = true
					allPublishersVue.request = false
					allPublishersVue.transfer = false
					allPublishersVue.correspondence = false
					this.buttons = [{"title": "CONG", "function": "congregationVue"}, {"title": "CONTACTS", "function": "contactInformationVue"}, {"title": "REQUEST", "function": "allPublishersVue"}, {"title": "TRANSFER", "function": "allPublishersVue"}, {"title": "MAIL", "function": "allPublishersVue"}, {"title": "GROUPS", "function": "fieldServiceGroupsVue"}, {"title": "REPORTS", "function": "missingReportVue"}]
				} else if (button.innerHTML == "REQUEST") {
					this.displayDropdown = false
					allPublishersVue.request = true
					allPublishersVue.transfer = false
					allPublishersVue.correspondence = false
					this.buttons = [{"title": "CONG", "function": "congregationVue"}, {"title": "CONTACTS", "function": "contactInformationVue"}, {"title": "RECORDS", "function": "allPublishersVue"}, {"title": "TRANSFER", "function": "allPublishersVue"}, {"title": "MAIL", "function": "allPublishersVue"}, {"title": "GROUPS", "function": "fieldServiceGroupsVue"}, {"title": "REPORTS", "function": "missingReportVue"}]
				} else if (button.innerHTML == "TRANSFER") {
					this.displayDropdown = false
					allPublishersVue.request = false
					allPublishersVue.transfer = true
					allPublishersVue.correspondence = false
					this.buttons = [{"title": "CONG", "function": "congregationVue"}, {"title": "CONTACTS", "function": "contactInformationVue"}, {"title": "RECORDS", "function": "allPublishersVue"}, {"title": "REQUEST", "function": "allPublishersVue"}, {"title": "MAIL", "function": "allPublishersVue"}, {"title": "GROUPS", "function": "fieldServiceGroupsVue"}, {"title": "REPORTS", "function": "missingReportVue"}]
				} else if (button.innerHTML == "MAIL") {
					this.displayDropdown = false
					allPublishersVue.request = false
					allPublishersVue.transfer = false
					allPublishersVue.correspondence = true
					this.buttons = [{"title": "CONG", "function": "congregationVue"}, {"title": "CONTACTS", "function": "contactInformationVue"}, {"title": "RECORDS", "function": "allPublishersVue"}, {"title": "REQUEST", "function": "allPublishersVue"}, {"title": "TRANSFER", "function": "allPublishersVue"}, {"title": "GROUPS", "function": "fieldServiceGroupsVue"}, {"title": "REPORTS", "function": "missingReportVue"}]
				} else if (button.innerHTML == "GROUPS") {
					this.displayDropdown = true
					allPublishersVue.request = false
					allPublishersVue.transfer = false
					allPublishersVue.correspondence = false
					this.buttons = [{"title": "CONG", "function": "congregationVue"}, {"title": "CONTACTS", "function": "contactInformationVue"}, {"title": "RECORDS", "function": "allPublishersVue"}, {"title": "ACTIVE", "function": "fieldServiceGroupsVue"}, {"title": "CARDS", "function": "cardsVue"}, {"title": "REPORTS", "function": "missingReportVue"}]
				} else if (button.innerHTML == "ACTIVE") {
					this.displayDropdown = true
					allPublishersVue.request = false
					allPublishersVue.transfer = false
					allPublishersVue.correspondence = false
					this.buttons = [{"title": "CONG", "function": "congregationVue"}, {"title": "CONTACTS", "function": "contactInformationVue"}, {"title": "RECORDS", "function": "allPublishersVue"}, {"title": "ALL", "function": "fieldServiceGroupsVue"}, {"title": "CARDS", "function": "cardsVue"}, {"title": "REPORTS", "function": "missingReportVue"}]
				} else if (button.innerHTML == "ALL") {
					this.displayDropdown = true
					allPublishersVue.request = false
					allPublishersVue.transfer = false
					allPublishersVue.correspondence = false
					this.buttons = [{"title": "CONG", "function": "congregationVue"}, {"title": "CONTACTS", "function": "contactInformationVue"}, {"title": "RECORDS", "function": "allPublishersVue"}, {"title": "ACTIVE", "function": "fieldServiceGroupsVue"}, {"title": "CARDS", "function": "cardsVue"}, {"title": "REPORTS", "function": "missingReportVue"}]
				} else if (button.innerHTML == "CARDS") {
					this.displayDropdown = true
					allPublishersVue.request = false
					allPublishersVue.transfer = false
					allPublishersVue.correspondence = false
					this.buttons = [{"title": "CONG", "function": "congregationVue"}, {"title": "CONTACTS", "function": "contactInformationVue"}, {"title": "RECORDS", "function": "allPublishersVue"}, {"title": "ACTIVE", "function": "fieldServiceGroupsVue"}, {"title": "ALL", "function": "fieldServiceGroupsVue"}, {"title": "REPORTS", "function": "missingReportVue"}]
				} else if (button.innerHTML == "PARTICIPANTS") {
					this.displayDropdown = true
					allPublishersVue.request = false
					allPublishersVue.transfer = false
					allPublishersVue.correspondence = false
					this.buttons = [{"title": "ASSIGNMENTS", "function": "allAssignmentsVue"}, {"title": "SCHEDULE", "function": "scheduleVue"}, {"title": "CONTACTS", "function": "contactInformationVue"}]
				} else if (button.innerHTML == "ASSIGNMENTS") {
					this.displayDropdown = false
					allPublishersVue.request = false
					allPublishersVue.transfer = false
					allPublishersVue.correspondence = false
					this.buttons = [{"title": "SCHEDULE", "function": "scheduleVue"}, {"title": "PARTICIPANTS", "function": "allParticipantsVue"}, {"title": "CONTACTS", "function": "contactInformationVue"}]
				} else if (button.innerHTML == "SCHEDULE") {
					this.displayDropdown = false
					allPublishersVue.request = false
					allPublishersVue.transfer = false
					allPublishersVue.correspondence = false
					this.buttons = [{"title": "ASSIGNMENTS", "function": "allAssignmentsVue"}, {"title": "PARTICIPANTS", "function": "allParticipantsVue"}, {"title": "CONTACTS", "function": "contactInformationVue"}]
				} else if (button.innerHTML == "FILE") {
					this.displayDropdown = false
					allPublishersVue.request = false
					allPublishersVue.transfer = false
					allPublishersVue.correspondence = false
					this.buttons = [{"title": "ENTRY", "function": "entryVue"}, {"title": "APPROVALS", "function": "approvalsVue"}, {"title": "ARCHIVE", "function": "archiveVue"}]
					//fillAccountSheet()
				} else if (button.innerHTML == "ENTRY") {
					this.displayDropdown = false
					allPublishersVue.request = false
					allPublishersVue.transfer = false
					allPublishersVue.correspondence = false
					this.buttons = [{"title": "FILE", "function": "fileVue"}, {"title": "APPROVALS", "function": "approvalsVue"}, {"title": "ARCHIVE", "function": "archiveVue"}]
				} else if (button.innerHTML == "APPROVALS") {
					this.displayDropdown = false
					allPublishersVue.request = false
					allPublishersVue.transfer = false
					allPublishersVue.correspondence = false
					this.buttons = [{"title": "ENTRY", "function": "entryVue"}, {"title": "FILE", "function": "fileVue"}, {"title": "ARCHIVE", "function": "archiveVue"}]
				} else if (button.innerHTML == "ARCHIVE") {
					this.displayDropdown = false
					allPublishersVue.request = false
					allPublishersVue.transfer = false
					allPublishersVue.correspondence = false
					this.buttons = [{"title": "ENTRY", "function": "entryVue"}, {"title": "FILE", "function": "fileVue"}, {"title": "APPROVALS", "function": "approvalsVue"}]
				} else if (button.innerHTML == "TERRITORY") {
					this.displayDropdown = false
					allPublishersVue.request = false
					allPublishersVue.transfer = false
					allPublishersVue.correspondence = false
					if (currentUser.currentProfile == 'Territory Map' || currentUser.currentProfile == 'Territory Servant') {
						this.buttons = []
					} else {
						this.buttons = [{"title": "CONG", "function": "congregationVue"}, {"title": "CONTACTS", "function": "contactInformationVue"}, {"title": "GROUPS", "function": "fieldServiceGroupsVue"}]
					}
				} else {
					this.displayDropdown = false
					allPublishersVue.request = false
					allPublishersVue.transfer = false
					allPublishersVue.correspondence = false
					this.buttons = [{"title": "CONG", "function": "congregationVue"}, {"title": "CONTACTS", "function": "contactInformationVue"}, {"title": "RECORDS", "function": "allPublishersVue"}, {"title": "GROUPS", "function": "fieldServiceGroupsVue"}, {"title": "REPORTS", "function": "missingReportVue"}]
				}

				if (currentUser.currentProfile == 'Service Overseer') {
					this.buttons = this.buttons.filter(elem=>elem.title !== "RECORDS" && elem.title !== "REPORTS")
					if (button.innerHTML !== "TERRITORY" && this.buttons.findIndex(elem=>elem.title == "TERRITORY") == -1) {
						this.buttons.splice(1, 0, {"title": "TERRITORY", "function": "territoryVue"})
					}
				}

				if (currentUser.currentProfile == 'Secretary - Assistant') {
					this.buttons.pop()
				}

				if (button.innerHTML == "REQUEST") {
					//allPublishersVue.request = true
					allPublishersVue.display = false
					await shortWait()
				} else if (button.innerHTML == "TRANSFER") {
					allPublishersVue.preview = false
					allPublishersVue.display = false
					await shortWait()
					auto_grow(document.getElementById("publisherRequest").Address);
					auto_grow(document.getElementById("publisherRequest").LetterOfIntroduction);
					if (selectedTransferPublishers.length !== 0) {
						redoSelection(selectedTransferPublishers.shift())
					}
				} else if (button.innerHTML == "MAIL") {
					allPublishersVue.preview = false
					allPublishersVue.display = false
					await shortWait()
					auto_grow(document.getElementById("publisherRequest").Address);
					auto_grow(document.getElementById("publisherRequest").LetterOfIntroduction);
					auto_grow(document.getElementById("publisherRequest").LetterTitle);
					if (selectedTransferPublishers.length !== 0) {
						redoSelection(selectedTransferPublishers.shift())
					}
				} else if (button.innerHTML == "ALL" || button.innerHTML == "ACTIVE") {
					fieldServiceGroupsVue.inactive()
					if (document.querySelector('.fa-download')) {
						document.querySelector('.fa-download').classList.remove('fa-spin')
						document.querySelector('.fa-download').classList.remove('fa-spinner')
						document.querySelector('.fa-download').classList.remove('fa-play')
					}
				} else {
					gotoView(allButtons.filter(elem=>elem.title == button.innerHTML)[0].function)
				}
			},
			logged() {
                return logged
            },
			openSettings() {
				
				var groupCount = navigationVue.buttons.findIndex(elem=>elem.title == 'ALL' || elem.title == 'ACTIVE' || elem.title == 'CARDS')
				if (groupCount !== -1){
					navigationVue.buttons[groupCount].title = 'GROUPS'
				}

				if (allPublishersVue.transfer == true || allPublishersVue.correspondence == true || scheduleVue.display == true || fileVue.display == true) {
					selectedTransferPublishers.length = 0
					var i = 0
					document.querySelectorAll('#publisherRequest select').forEach(elem=>{
						if (elem !== '') {
							selectedTransferPublishers.push(allPublishersVue.publishers.filter(ele=>ele.name == elem.value)[0])
						}
						if (i !== 0) {
							elem.parentNode.remove()
						}
						i++
					})
					document.querySelectorAll('iframe').forEach(elem=>{
						elem.parentNode.remove()
					})
					if (document.querySelector('#content')) {
						document.querySelector('#content').style.display = ''
					}
					if (document.querySelector('.weekSelector')) {
						document.querySelector('.weekSelector').style.display = ''
					}
				}

				allPublishersVue.request = false
				allPublishersVue.transfer = false
				allPublishersVue.correspondence = false
				navigationVue.displayDropdown = false
				
				if (currentUser.currentProfile == 'Secretary') {
					navigationVue.buttons = [{"title": "CONG", "function": "congregationVue"}, {"title": "CONTACTS", "function": "contactInformationVue"}, {"title": "RECORDS", "function": "allPublishersVue"}, {"title": "GROUPS", "function": "fieldServiceGroupsVue"}, {"title": "REPORTS", "function": "missingReportVue"}]
				} else if (currentUser.currentProfile == 'Secretary - Assistant') {
					navigationVue.buttons = [{"title": "REPORTS", "function": "missingReportVue"}, {"title": "CURRENT", "function": "monthlyReportVue"}, {"title": "ATTENDANCE", "function": "attendanceVue"}, {"title": "BRANCH", "function": "branchReportVue"}]
				} else if (currentUser.currentProfile == 'Life and Ministry Overseer') {
					navigationVue.buttons = [{"title": "ASSIGNMENTS", "function": "allAssignmentsVue"}, {"title": "SCHEDULE", "function": "scheduleVue"}, {"title": "PARTICIPANTS", "function": "allParticipantsVue"}, {"title": "CONTACTS", "function": "contactInformationVue"}]
				} else if (currentUser.currentProfile == 'Life and Ministry Assistant') {
					navigationVue.buttons = [{"title": "ASSIGNMENTS", "function": "allAssignmentsVue"}, {"title": "SCHEDULE", "function": "scheduleVue"}, {"title": "PARTICIPANTS", "function": "allParticipantsVue"}, {"title": "CONTACTS", "function": "contactInformationVue"}]
				} else if (currentUser.currentProfile == 'Service Overseer') {
					navigationVue.buttons = [{"title": "CONG", "function": "congregationVue"}, {"title": "TERRITORY", "function": "territoryVue"}, {"title": "CONTACTS", "function": "contactInformationVue"}, {"title": "GROUPS", "function": "fieldServiceGroupsVue"}]
				} else if (currentUser.currentProfile == 'Territory Map' || currentUser.currentProfile == 'Territory Servant') {
					navigationVue.buttons = [{"title": "TERRITORY", "function": "territoryVue"}]
				} else if (currentUser.currentProfile == 'Accounts Servant') {
					navigationVue.buttons = [{"title": "ENTRY", "function": "entryVue"}, {"title": "FILE", "function": "fileVue"}, {"title": "APPROVALS", "function": "approvalsVue"}, {"title": "ARCHIVE", "function": "archiveVue"}]
				}

				gotoView('configurationVue')
				
			},
			signOut() {
				signOut()		  
			},
			clearFilter() {
				
			},
			boldBox() {
				
			},
			unboldBox() {
				
			}
        }
    })
}

var currentView;

processNavigation()

var selectedTransferPublishers = []

async function redoSelection(selection) {
	if (!selection) { return }
	await shortWait()
	await shortWait()
	document.querySelectorAll('#publisherRequest select')[document.querySelectorAll('.fa-plus').length - 1].value = selection.name
	if (selectedTransferPublishers.length !== 0) {
		await shortWait()
		await shortWait()
		document.querySelectorAll('.fa-plus')[document.querySelectorAll('.fa-plus').length - 1].click()
		
		redoSelection(selectedTransferPublishers.shift())
	}
}

document.querySelector('#mySidebar').innerHTML = `<template>
	<a href="javascript:void(0)" onclick="w3_close()" class="w3-bar-item w3-button w3-large w3-padding-16">Close ×</a>
    <a v-for="(button) in buttons()" v-if="button.title !== 'ACTIVE' && button.title !== 'ALL'  && button.title !== 'CARDS' && button.title !== 'REQUEST' && button.title !== 'TRANSFER' && button.title !== 'MAIL'" @click="openButton($event.target)" class="w3-bar-item w3-button">{{ button.title }}</a>
    <a v-else @click="openButton($event.target)" :class="mode()">{{ button.title }}</a>
	<a v-if="logged() == true && showDownloadButton()" class="w3-bar-item w3-button" @click="downloadContent()"><i title="Download" class="fa fa-download"></i> Download</a>
	<a v-if="logged() == true" class="w3-bar-item w3-button" @click="openSettings()"><i class="fa fa-cog"></i> Settings</a>
	<a v-if="logged() == true" class="w3-bar-item w3-button" @click="signOut()"><i class="fa fa-sign-out-alt"></i> Sign Out</a>
</template>`

function processNavigation2() {

    navigationVue2 = new Vue({
        el: document.querySelector('#mySidebar'),
        data: {
            allGroups: [],
            fieldServiceGroup: 'All Groups',
			searchTerms: '',
			display: false,
        },
        computed: {
            allCharacters() {/*
                return getUniqueElementsByProperty(this.clickedSectionFilter,['ID'])*/
            },
        },
        methods: {
			showDownloadButton() {
				return allPublishersVue.display == true ||	fieldServiceGroupsVue.display == true || contactInformationVue.display == true || cardsVue.display == true || (attendanceVue.display == true && currentUser.currentProfile == 'Secretary')
			},
			async downloadContent() {
				if (attendanceVue.display == true) {
					fillAttendanceRecord()
					return
				}
				if (allButtons.filter(elem=>elem.title == currentView)[0].title == 'CARDS') {
					document.querySelector('.fa-download').classList.add('fa-spinner')
					document.querySelector('.fa-download').classList.add('fa-spin')
					recordsToCreate = allPublishersVue.publishers.map(elem=>[elem, 'currentServiceYear'])
					if (document.querySelector('#cardProcessStatus')) {
						document.querySelector('#cardProcessStatus').style.display = ''
						document.querySelector('#cardProcessStatus').innerHTML = `Processing cards. Please Wait . . .
						<br>${recordsToCreate.length} Remaining.`
					}
					await fillPublisherRecord(recordsToCreate.shift())
					return
				}
				console.log(currentView)
				console.log(allButtons.filter(elem=>elem.title == currentView))
				var allGroupsBackup = [].concat(allPublishersVue.allGroups)
				var restoreAllGroups = [].concat(allPublishersVue.allGroups)
				var backupMode = currentMode
				if (backupMode !== 'Light') {
					configurationVue.displayMode({"value": 'Light'})
					await shortWait()
					await shortWait()
					await shortWait()
					await shortWait()
				}

				if (allButtons.filter(elem=>elem.title == currentView)[0].function == "fieldServiceGroupsVue") {
				
					var i = 1
					while (allGroupsBackup.length !== 0) {
						this.allGroups = allGroupsBackup.splice(0, 3)
						await shortWait()
						await shortWait()
						console.log(allGroupsBackup)
						var fileName
						if (fieldServiceGroupsVue.active !== true) {
							fileName = 'Field Service Groups - ' + i
						} else {
							fileName = 'Field Service Groups - ALL - ' + i
						}
						generatePDF(document.getElementById('fieldServiceGroups'), fileName)
						i++
						await shortWait()
						await shortWait()
					}
					
					this.allGroups = restoreAllGroups
					await shortWait()
					await shortWait()
				
				} else if (allButtons.filter(elem=>elem.title == currentView)[0].function == "allPublishersVue") {
				
					await shortWait()
					await shortWait()
					console.log(allGroupsBackup)
					var fileName = 'All Publishers'
					generatePDF(document.getElementById('allPublishers'), fileName)
					await shortWait()
					await shortWait()
					
					await shortWait()
					await shortWait()
				
				} else if (allButtons.filter(elem=>elem.title == currentView)[0].function == "contactInformationVue") {
					var i = 1
					while (allGroupsBackup.length !== 0) {
						this.allGroups = allGroupsBackup.splice(0, 1)
						await shortWait()
						await shortWait()
						console.log(allGroupsBackup)
						var fileName = 'Contact Information - ' + this.allGroups[0]
						generatePDF(document.getElementById('contactInformation'), fileName)
						i++
						await shortWait()
						await shortWait()
					}
					
					this.allGroups = restoreAllGroups
					await shortWait()
					await shortWait()
					
				}

				if (backupMode !== 'Light') {
					configurationVue.displayMode({"value": backupMode})
				}
			},
			mode() {
				return 'w3-bar-item w3-button ' + mode.replace('w3-card ','')
			},
			async openButton(button) {
                //console.log(button)
				currentView = button.innerHTML
				w3_close()
				if (allPublishersVue.transfer == true || allPublishersVue.correspondence == true || scheduleVue.display == true || fileVue.display == true) {
					selectedTransferPublishers.length = 0
					var i = 0
					document.querySelectorAll('#publisherRequest select').forEach(elem=>{
						if (elem !== '') {
							selectedTransferPublishers.push(allPublishersVue.publishers.filter(ele=>ele.name == elem.value)[0])
						}
						if (i !== 0) {
							elem.parentNode.remove()
						}
						i++
					})
					document.querySelectorAll('iframe').forEach(elem=>{
						elem.parentNode.remove()
					})
					if (document.querySelector('#content')) {
						document.querySelector('#content').style.display = ''
					}
					if (document.querySelector('.weekSelector')) {
						document.querySelector('.weekSelector').style.display = ''
					}
				}

				configurationVue.display = false
				
				if (button.innerHTML == "REPORTS") {
					navigationVue.displayDropdown = true
					allPublishersVue.request = false
					allPublishersVue.transfer = false
					allPublishersVue.correspondence = false
					navigationVue.buttons = [{"title": "CURRENT", "function": "monthlyReportVue"}, {"title": "ATTENDANCE", "function": "attendanceVue"}, {"title": "BRANCH", "function": "branchReportVue"}, {"title": "CONG", "function": "congregationVue"}]
				} else if (button.innerHTML == "CURRENT") {
					navigationVue.displayDropdown = true
					allPublishersVue.request = false
					allPublishersVue.transfer = false
					allPublishersVue.correspondence = false
					navigationVue.buttons = [{"title": "REPORTS", "function": "missingReportVue"}, {"title": "ATTENDANCE", "function": "attendanceVue"}, {"title": "BRANCH", "function": "branchReportVue"}, {"title": "CONG", "function": "congregationVue"}]
				} else if (button.innerHTML == "ATTENDANCE") {
					navigationVue.displayDropdown = false
					allPublishersVue.request = false
					allPublishersVue.transfer = false
					allPublishersVue.correspondence = false
					navigationVue.buttons = [{"title": "REPORTS", "function": "missingReportVue"}, {"title": "CURRENT", "function": "monthlyReportVue"}, {"title": "BRANCH", "function": "branchReportVue"}, {"title": "CONG", "function": "congregationVue"}]
				} else if (button.innerHTML == "BRANCH") {
					navigationVue.displayDropdown = false
					allPublishersVue.request = false
					allPublishersVue.transfer = false
					allPublishersVue.correspondence = false
					navigationVue.buttons = [{"title": "REPORTS", "function": "missingReportVue"}, {"title": "CURRENT", "function": "monthlyReportVue"}, {"title": "ATTENDANCE", "function": "attendanceVue"}, {"title": "CONG", "function": "congregationVue"}]
				} else if (button.innerHTML == "CONG") {
					navigationVue.displayDropdown = false
					allPublishersVue.request = false
					allPublishersVue.transfer = false
					allPublishersVue.correspondence = false
					if (currentUser.currentProfile == 'Service Overseer') {
						navigationVue.buttons = [{"title": "TERRITORY", "function": "territoryVue"}, {"title": "CONTACTS", "function": "contactInformationVue"}, {"title": "GROUPS", "function": "fieldServiceGroupsVue"}]
					} else {
						navigationVue.buttons = [{"title": "CONTACTS", "function": "contactInformationVue"}, {"title": "RECORDS", "function": "allPublishersVue"}, {"title": "GROUPS", "function": "fieldServiceGroupsVue"}, {"title": "REPORTS", "function": "missingReportVue"}]
					}
				} else if (button.innerHTML == "CONTACTS") {
					navigationVue.displayDropdown = true
					allPublishersVue.request = false
					allPublishersVue.transfer = false
					allPublishersVue.correspondence = false
					if (currentUser.currentProfile == 'Life and Ministry Overseer' || currentUser.currentProfile == 'Life and Ministry Assistant') {
						navigationVue.buttons = [{"title": "ASSIGNMENTS", "function": "allAssignmentsVue"}, {"title": "SCHEDULE", "function": "scheduleVue"}, {"title": "PARTICIPANTS", "function": "allParticipantsVue"}]
					} else {
						navigationVue.buttons = [{"title": "CONG", "function": "congregationVue"}, {"title": "RECORDS", "function": "allPublishersVue"}, {"title": "GROUPS", "function": "fieldServiceGroupsVue"}, {"title": "REPORTS", "function": "missingReportVue"}]
					}
				} else if (button.innerHTML == "RECORDS") {
					navigationVue.displayDropdown = true
					allPublishersVue.request = false
					allPublishersVue.transfer = false
					allPublishersVue.correspondence = false
					navigationVue.buttons = [{"title": "CONG", "function": "congregationVue"}, {"title": "CONTACTS", "function": "contactInformationVue"}, {"title": "REQUEST", "function": "allPublishersVue"}, {"title": "TRANSFER", "function": "allPublishersVue"}, {"title": "MAIL", "function": "allPublishersVue"}, {"title": "GROUPS", "function": "fieldServiceGroupsVue"}, {"title": "REPORTS", "function": "missingReportVue"}]
				} else if (button.innerHTML == "REQUEST") {
					navigationVue.displayDropdown = false
					allPublishersVue.request = true
					allPublishersVue.transfer = false
					allPublishersVue.correspondence = false
					navigationVue.buttons = [{"title": "CONG", "function": "congregationVue"}, {"title": "CONTACTS", "function": "contactInformationVue"}, {"title": "RECORDS", "function": "allPublishersVue"}, {"title": "TRANSFER", "function": "allPublishersVue"}, {"title": "MAIL", "function": "allPublishersVue"}, {"title": "GROUPS", "function": "fieldServiceGroupsVue"}, {"title": "REPORTS", "function": "missingReportVue"}]
				} else if (button.innerHTML == "TRANSFER") {
					navigationVue.displayDropdown = false
					allPublishersVue.request = false
					allPublishersVue.transfer = true
					allPublishersVue.correspondence = false
					navigationVue.buttons = [{"title": "CONG", "function": "congregationVue"}, {"title": "CONTACTS", "function": "contactInformationVue"}, {"title": "RECORDS", "function": "allPublishersVue"}, {"title": "REQUEST", "function": "allPublishersVue"}, {"title": "MAIL", "function": "allPublishersVue"}, {"title": "GROUPS", "function": "fieldServiceGroupsVue"}, {"title": "REPORTS", "function": "missingReportVue"}]
				} else if (button.innerHTML == "MAIL") {
					navigationVue.displayDropdown = false
					allPublishersVue.request = false
					allPublishersVue.transfer = false
					allPublishersVue.correspondence = true
					navigationVue.buttons = [{"title": "CONG", "function": "congregationVue"}, {"title": "CONTACTS", "function": "contactInformationVue"}, {"title": "RECORDS", "function": "allPublishersVue"}, {"title": "REQUEST", "function": "allPublishersVue"}, {"title": "TRANSFER", "function": "allPublishersVue"}, {"title": "GROUPS", "function": "fieldServiceGroupsVue"}, {"title": "REPORTS", "function": "missingReportVue"}]
				} else if (button.innerHTML == "GROUPS") {
					navigationVue.displayDropdown = true
					allPublishersVue.request = false
					allPublishersVue.transfer = false
					allPublishersVue.correspondence = false
					navigationVue.buttons = [{"title": "CONG", "function": "congregationVue"}, {"title": "CONTACTS", "function": "contactInformationVue"}, {"title": "RECORDS", "function": "allPublishersVue"}, {"title": "ACTIVE", "function": "fieldServiceGroupsVue"}, {"title": "CARDS", "function": "cardsVue"}, {"title": "REPORTS", "function": "missingReportVue"}]
				} else if (button.innerHTML == "ACTIVE") {
					navigationVue.displayDropdown = true
					allPublishersVue.request = false
					allPublishersVue.transfer = false
					allPublishersVue.correspondence = false
					navigationVue.buttons = [{"title": "CONG", "function": "congregationVue"}, {"title": "CONTACTS", "function": "contactInformationVue"}, {"title": "RECORDS", "function": "allPublishersVue"}, {"title": "ALL", "function": "fieldServiceGroupsVue"}, {"title": "CARDS", "function": "cardsVue"}, {"title": "REPORTS", "function": "missingReportVue"}]
				} else if (button.innerHTML == "ALL") {
					navigationVue.displayDropdown = true
					allPublishersVue.request = false
					allPublishersVue.transfer = false
					allPublishersVue.correspondence = false
					navigationVue.buttons = [{"title": "CONG", "function": "congregationVue"}, {"title": "CONTACTS", "function": "contactInformationVue"}, {"title": "RECORDS", "function": "allPublishersVue"}, {"title": "ACTIVE", "function": "fieldServiceGroupsVue"}, {"title": "CARDS", "function": "cardsVue"}, {"title": "REPORTS", "function": "missingReportVue"}]
				} else if (button.innerHTML == "CARDS") {
					navigationVue.displayDropdown = true
					allPublishersVue.request = false
					allPublishersVue.transfer = false
					allPublishersVue.correspondence = false
					navigationVue.buttons = [{"title": "CONG", "function": "congregationVue"}, {"title": "CONTACTS", "function": "contactInformationVue"}, {"title": "RECORDS", "function": "allPublishersVue"}, {"title": "ACTIVE", "function": "fieldServiceGroupsVue"}, {"title": "ALL", "function": "fieldServiceGroupsVue"}, {"title": "REPORTS", "function": "missingReportVue"}]
				} else if (button.innerHTML == "PARTICIPANTS") {
					navigationVue.displayDropdown = true
					allPublishersVue.request = false
					allPublishersVue.transfer = false
					allPublishersVue.correspondence = false
					navigationVue.buttons = [{"title": "ASSIGNMENTS", "function": "allAssignmentsVue"}, {"title": "SCHEDULE", "function": "scheduleVue"}, {"title": "CONTACTS", "function": "contactInformationVue"}]
				} else if (button.innerHTML == "ASSIGNMENTS") {
					navigationVue.displayDropdown = false
					allPublishersVue.request = false
					allPublishersVue.transfer = false
					allPublishersVue.correspondence = false
					navigationVue.buttons = [{"title": "SCHEDULE", "function": "scheduleVue"}, {"title": "PARTICIPANTS", "function": "allParticipantsVue"}, {"title": "CONTACTS", "function": "contactInformationVue"}]
				} else if (button.innerHTML == "SCHEDULE") {
					navigationVue.displayDropdown = false
					allPublishersVue.request = false
					allPublishersVue.transfer = false
					allPublishersVue.correspondence = false
					navigationVue.buttons = [{"title": "ASSIGNMENTS", "function": "allAssignmentsVue"}, {"title": "PARTICIPANTS", "function": "allParticipantsVue"}, {"title": "CONTACTS", "function": "contactInformationVue"}]
				} else if (button.innerHTML == "FILE") {
					navigationVue.displayDropdown = false
					allPublishersVue.request = false
					allPublishersVue.transfer = false
					allPublishersVue.correspondence = false
					navigationVue.buttons = [{"title": "ENTRY", "function": "entryVue"}, {"title": "APPROVALS", "function": "approvalsVue"}, {"title": "ARCHIVE", "function": "archiveVue"}]
					//fillAccountSheet()
				} else if (button.innerHTML == "ENTRY") {
					navigationVue.displayDropdown = false
					allPublishersVue.request = false
					allPublishersVue.transfer = false
					allPublishersVue.correspondence = false
					navigationVue.buttons = [{"title": "FILE", "function": "fileVue"}, {"title": "APPROVALS", "function": "approvalsVue"}, {"title": "ARCHIVE", "function": "archiveVue"}]
				} else if (button.innerHTML == "APPROVALS") {
					navigationVue.displayDropdown = false
					allPublishersVue.request = false
					allPublishersVue.transfer = false
					allPublishersVue.correspondence = false
					navigationVue.buttons = [{"title": "ENTRY", "function": "entryVue"}, {"title": "FILE", "function": "fileVue"}, {"title": "ARCHIVE", "function": "archiveVue"}]
				} else if (button.innerHTML == "ARCHIVE") {
					navigationVue.displayDropdown = false
					allPublishersVue.request = false
					allPublishersVue.transfer = false
					allPublishersVue.correspondence = false
					navigationVue.buttons = [{"title": "ENTRY", "function": "entryVue"}, {"title": "FILE", "function": "fileVue"}, {"title": "APPROVALS", "function": "approvalsVue"}]
				} else if (button.innerHTML == "TERRITORY") {
					navigationVue.displayDropdown = false
					allPublishersVue.request = false
					allPublishersVue.transfer = false
					allPublishersVue.correspondence = false
					if (currentUser.currentProfile == 'Territory Map' || currentUser.currentProfile == 'Territory Servant') {
						navigationVue.buttons = []
					} else {
						navigationVue.buttons = [{"title": "CONG", "function": "congregationVue"}, {"title": "CONTACTS", "function": "contactInformationVue"}, {"title": "GROUPS", "function": "fieldServiceGroupsVue"}]
					}
				} else {
					navigationVue.displayDropdown = false
					allPublishersVue.request = false
					allPublishersVue.transfer = false
					allPublishersVue.correspondence = false
					navigationVue.buttons = [{"title": "CONG", "function": "congregationVue"}, {"title": "CONTACTS", "function": "contactInformationVue"}, {"title": "RECORDS", "function": "allPublishersVue"}, {"title": "GROUPS", "function": "fieldServiceGroupsVue"}, {"title": "REPORTS", "function": "missingReportVue"}]
				}

				if (currentUser.currentProfile == 'Service Overseer') {
					navigationVue.buttons = navigationVue.buttons.filter(elem=>elem.title !== "RECORDS" && elem.title !== "REPORTS")
					if (button.innerHTML !== "TERRITORY" && navigationVue.buttons.findIndex(elem=>elem.title == "TERRITORY") == -1) {
						navigationVue.buttons.splice(1, 0, {"title": "TERRITORY", "function": "territoryVue"})
					}
				}

				if (currentUser.currentProfile == 'Secretary - Assistant') {
					navigationVue.buttons.pop()
				}

				if (button.innerHTML == "REQUEST") {
					//allPublishersVue.request = true
					allPublishersVue.display = false
					await shortWait()
				} else if (button.innerHTML == "TRANSFER") {
					allPublishersVue.preview = false
					allPublishersVue.display = false
					await shortWait()
					auto_grow(document.getElementById("publisherRequest").Address);
					auto_grow(document.getElementById("publisherRequest").LetterOfIntroduction);
					if (selectedTransferPublishers.length !== 0) {
						redoSelection(selectedTransferPublishers.shift())
					}
				} else if (button.innerHTML == "MAIL") {
					allPublishersVue.preview = false
					allPublishersVue.display = false
					await shortWait()
					auto_grow(document.getElementById("publisherRequest").Address);
					auto_grow(document.getElementById("publisherRequest").LetterOfIntroduction);
					auto_grow(document.getElementById("publisherRequest").LetterTitle);
					if (selectedTransferPublishers.length !== 0) {
						redoSelection(selectedTransferPublishers.shift())
					}
				} else if (button.innerHTML == "ALL" || button.innerHTML == "ACTIVE") {
					fieldServiceGroupsVue.inactive()
					if (document.querySelector('.fa-download')) {
						document.querySelector('.fa-download').classList.remove('fa-spin')
						document.querySelector('.fa-download').classList.remove('fa-spinner')
						document.querySelector('.fa-download').classList.remove('fa-play')
					}
				} else {
					gotoView(allButtons.filter(elem=>elem.title == button.innerHTML)[0].function)
					
				}
			},
			buttons() {
                return navigationVue.buttons
            },
			displayDropdown() {
				return navigationVue.displayDropdown
			},
			openSettings() {
				
				w3_close()
				var groupCount = navigationVue.buttons.findIndex(elem=>elem.title == 'ALL' || elem.title == 'ACTIVE' || elem.title == 'CARDS')
				if (groupCount !== -1){
					navigationVue.buttons[groupCount].title = 'GROUPS'
				}

				if (allPublishersVue.transfer == true || allPublishersVue.correspondence == true || scheduleVue.display == true || fileVue.display == true) {
					selectedTransferPublishers.length = 0
					var i = 0
					document.querySelectorAll('#publisherRequest select').forEach(elem=>{
						if (elem !== '') {
							selectedTransferPublishers.push(allPublishersVue.publishers.filter(ele=>ele.name == elem.value)[0])
						}
						if (i !== 0) {
							elem.parentNode.remove()
						}
						i++
					})
					document.querySelectorAll('iframe').forEach(elem=>{
						elem.parentNode.remove()
					})
					if (document.querySelector('#content')) {
						document.querySelector('#content').style.display = ''
					}
					if (document.querySelector('.weekSelector')) {
						document.querySelector('.weekSelector').style.display = ''
					}
				}

				allPublishersVue.request = false
				allPublishersVue.transfer = false
				allPublishersVue.correspondence = false
				navigationVue.displayDropdown = false
				
				if (currentUser.currentProfile == 'Secretary') {
					navigationVue.buttons = [{"title": "CONG", "function": "congregationVue"}, {"title": "CONTACTS", "function": "contactInformationVue"}, {"title": "RECORDS", "function": "allPublishersVue"}, {"title": "GROUPS", "function": "fieldServiceGroupsVue"}, {"title": "REPORTS", "function": "missingReportVue"}]
				} else if (currentUser.currentProfile == 'Secretary - Assistant') {
					navigationVue.buttons = [{"title": "REPORTS", "function": "missingReportVue"}, {"title": "CURRENT", "function": "monthlyReportVue"}, {"title": "ATTENDANCE", "function": "attendanceVue"}, {"title": "BRANCH", "function": "branchReportVue"}]
				} else if (currentUser.currentProfile == 'Life and Ministry Overseer') {
					navigationVue.buttons = [{"title": "ASSIGNMENTS", "function": "allAssignmentsVue"}, {"title": "SCHEDULE", "function": "scheduleVue"}, {"title": "PARTICIPANTS", "function": "allParticipantsVue"}, {"title": "CONTACTS", "function": "contactInformationVue"}]
				} else if (currentUser.currentProfile == 'Life and Ministry Assistant') {
					navigationVue.buttons = [{"title": "ASSIGNMENTS", "function": "allAssignmentsVue"}, {"title": "SCHEDULE", "function": "scheduleVue"}, {"title": "PARTICIPANTS", "function": "allParticipantsVue"}, {"title": "CONTACTS", "function": "contactInformationVue"}]
				} else if (currentUser.currentProfile == 'Service Overseer') {
					navigationVue.buttons = [{"title": "CONG", "function": "congregationVue"}, {"title": "TERRITORY", "function": "territoryVue"}, {"title": "CONTACTS", "function": "contactInformationVue"}, {"title": "GROUPS", "function": "fieldServiceGroupsVue"}]
				} else if (currentUser.currentProfile == 'Territory Map' || currentUser.currentProfile == 'Territory Servant') {
					navigationVue.buttons = [{"title": "TERRITORY", "function": "territoryVue"}]
				} else if (currentUser.currentProfile == 'Accounts Servant') {
					navigationVue.buttons = [{"title": "ENTRY", "function": "entryVue"}, {"title": "FILE", "function": "fileVue"}, {"title": "APPROVALS", "function": "approvalsVue"}, {"title": "ARCHIVE", "function": "archiveVue"}]
				}

				gotoView('configurationVue')
			},
			signOut() {
				w3_close()
				signOut()			  
			},
			logged() {
                return logged
            },
			clearFilter() {
				
			},
			boldBox() {
				
			},
			unboldBox() {
				
			}
        }
    })
}

function auto_grow(element) {
    element.style.height = "5px";
    element.style.height = (element.scrollHeight) + "px";
}

processNavigation2()

// Modal Image Gallery
function onClick(element) {
	document.getElementById("img01").src = element.src;
	document.getElementById("modal01").style.display = "block";
	var captionText = document.getElementById("caption");
	captionText.innerHTML = element.alt;
}


// Toggle between showing and hiding the sidebar when clicking the menu icon
//var mySidebar = document.getElementById("mySidebar");

function w3_open() {
	var mySidebar = document.getElementById("mySidebar");
	if (mySidebar.style.display === 'block') {
		mySidebar.style.display = 'none';
	} else {
		mySidebar.style.display = 'block';
	}
}

// Close the sidebar with the close button
function w3_close() {
	var mySidebar = document.getElementById("mySidebar");
	mySidebar.style.display = "none";
}

var draw; // Declare draw globally
var vectorSource
var vectorLayer
var drawnFeatures = [];
var savedFeaturesSource
var savedPolygons = []; // Array to store saved polygons
var modify;
var select;
var annotationOverlay; // Overlay for annotations
var pinLayer; // Layer for dropping pins
var removeVertex = false;
var removePolygon = false;
var geolocationLayer; // Layer for showing user's location and direction
var geolocation;
var selectedFeature
var selectedPolygon

function stopDraw() {
	if (draw) {
		draw.setActive(false);
	}
}

var initialCoordinatesCopy;

function setDrawType(drawType) {
	// Remove the existing draw interaction
	if (draw) {
		map.removeInteraction(draw);
	}
	
	// Clear existing features on the map
	map.getLayers().forEach(function (layer) {
		if (layer instanceof ol.layer.Vector) {
		layer.getSource().clear();
		}
	});

	// Create a new draw interaction with the specified type
	draw = new ol.interaction.Draw({
		source: vectorSource,
		type: drawType
	});

	// Function to handle the end of drawing
    draw.on('drawend', function (event) {
		var feature = event.feature;
		selectedFeature = event.feature;
		var geometry = feature.getGeometry();
		var coordinates = geometry.getCoordinates();
		selectedPolygon = territoryVue.savedPolygons.length
		focusOnPolygon(feature);
		
		territoryVue.savedPolygons.push({
			type: 'Polygon',
			coordinates: coordinates,
			annotation: '', // Default annotation is an empty string,
			locality: '',
			number: '',
			assignedTo: '',
			dateAssigned: '',
			dateCompleted: '',
			lastDateCompleted: '',
		});
		DBWorker.postMessage({ storeName: 'territory', action: "save", value: [{"name": "FeatureCollection", "value": territoryVue.savedPolygons}]});
		document.querySelectorAll('.custom-control button')[0].outerHTML = '<button style="margin:0;padding:0 3px"><i class="fas fa-pen"></i></button>'
		stopDraw()
	});

	map.addInteraction(draw);

	// Create a Modify interaction for editing polygons
	modify = new ol.interaction.Modify({
        source: vectorSource,
        deleteCondition: function (event) {
			initialCoordinatesCopy = event
			return  removeVertex &&
                 ol.events.condition.singleClick(event);
        }
	});

	map.addInteraction(modify);

	// Add a listener for the modifyend event
	modify.on("modifyend", function (event) {
		//selectedFeature = event
        // This event is triggered when the modification is complete
        // You can handle the modified geometry here
        const modifiedGeometry = event.features.getArray()[0].getGeometry();
        //console.log("Modified Geometry:", modifiedGeometry.getCoordinates());
		territoryVue.savedPolygons[selectedPolygon].coordinates = modifiedGeometry.getCoordinates()
		DBWorker.postMessage({ storeName: 'territory', action: "save", value: [{"name": "FeatureCollection", "value": territoryVue.savedPolygons}]});
    });

	/*
	// Event listener for click events to enable modification
	map.on("click", function (event) {
        const clickedFeature = map.forEachFeatureAtPixel(
          event.pixel,
          function (feature) {
            return feature;
          }
        );

        if (clickedFeature && clickedFeature.getGeometry().getType() === "Polygon") {
          // Enable modification for the selected polygon
          modify.setActive(true);
        } else {
          // Disable modification if no polygon is selected
          modify.setActive(false);
        }
    });*/

	// Create a Select interaction for selecting polygons to delete
	select = new ol.interaction.Select({
        layers: [vectorLayer],
        style: new ol.style.Style({
			fill: new ol.style.Fill({
				color: '#76aaf14d'
			}),
			stroke: new ol.style.Stroke({
				color: '#76aaf1',
				width: 2
			}),
			image: new ol.style.Circle({
				radius: 7,
				fill: new ol.style.Fill({
					color: '#76aaf1'
				})
			})
		})
    });

    map.addInteraction(select);

      // Handle the selection change event
    select.on('select', function (event) {
		if (event.selected.length > 0) {
			selectedFeature = event.selected[0];
			/*if (removePolygon == true) {
				deletePolygon(selectedFeature);
			}*/
        }
    });

	// Initialize the annotation overlay
	annotationOverlay = createAnnotationOverlay();
	map.addOverlay(annotationOverlay);

	// Initialize the layer for dropping pins
	pinLayer = new ol.layer.Vector({
        source: new ol.source.Vector()
    });
    map.addLayer(pinLayer);
	
    // Initialize the layer for showing user's location and direction
	geolocationLayer = new ol.layer.Vector({
		source: new ol.source.Vector()
	});
	map.addLayer(geolocationLayer);
	
}

// Function to redraw saved polygons
function redrawPolygons(polygons) {
	// Clear existing features on the map
	map.getLayers().forEach(function (layer) {
	  if (layer instanceof ol.layer.Vector) {
		layer.getSource().clear();
	  }
	});

	// Iterate over saved polygons and add them to the map
	polygons.forEach(function (polygon) {
	  var polygonFeature = new ol.Feature({
		geometry: new ol.geom.Polygon(polygon.coordinates)
	  });

	  // Add style if needed
	  polygonFeature.setStyle(new ol.style.Style({
			fill: new ol.style.Fill({
				color: '#76aaf14d'
			}),
			stroke: new ol.style.Stroke({
				color: '#76aaf1',
				width: 2
			})
	  }));

	  // Add the feature to the vector source
	  map.getLayers().item(1).getSource().addFeature(polygonFeature);
	});
}

/*
drawnLayers.forEach(function (layer) {
	// Convert Leaflet layer to GeoJSON format
	var geoJsonFeature = layer.toGeoJSON();
	territoryVue.geoJsonData.features.push(geoJsonFeature);
	DBWorker.postMessage({ storeName: 'territory', action: "save", value: [{"name": "FeatureCollection", "value": territoryVue.geoJsonData.features}]});
  });*/

function clearDrawnFeatures() {
	// Clear the vector source
	vectorSource.clear();
}

function saveDrawnFeatures() {
	// Add the drawn features to the saved features source
	savedFeaturesSource.addFeatures(drawnFeatures);
	drawnFeatures = []; // Clear the drawn features array
}

function redrawSavedFeatures() {
	// Clear the existing saved features source
	savedFeaturesSource.clear();

	// Add the saved features back to the saved features source
	savedFeaturesSource.addFeatures(drawnFeatures);
}

function convertFeaturesToArray() {
	// Convert saved features to a simple array representation
	var featuresArray = drawnFeatures.map(function (feature) {
		var geometry = feature.getGeometry();
		var coordinates = geometry.getCoordinates();
		return {
			type: geometry.getType(),
			coordinates: coordinates
		};
	});

	territoryVue.geoJsonData.features.push(featuresArray);
	
	// Output the array to the console (you can modify this part)
	console.log('Features Array:', featuresArray);
}

/*
// Function to delete a selected polygon
function deleteSelectedPolygon() {
	var selectedFeatures = select.getFeatures();
	if (selectedFeatures.getLength() > 0) {
		selectedFeatures.forEach(function (feature) {
			deletePolygon(feature);
		});
		selectedFeatures.clear();
	}
}*/

// Function to delete a polygon feature
function deletePolygon(feature) {
	if (confirm('Are you sure you want to Delete Selected Region?\nPress "Yes" to Delete')) {
		var source = map.getLayers().item(1).getSource();
		source.removeFeature(feature);

		territoryVue.savedPolygons.splice(territoryVue.savedPolygons.findIndex(elem=>JSON.stringify(elem.coordinates) == JSON.stringify(feature.getGeometry().getCoordinates())), 1)
		DBWorker.postMessage({ storeName: 'territory', action: "save", value: [{"name": "FeatureCollection", "value": territoryVue.savedPolygons}]});
	}
	console.log(territoryVue.savedPolygons)
}

 // Function to show an annotation popup for a drawn polygon
 function showAnnotationPopup(feature) {
	var geometry = feature.getGeometry();
	var coordinates = geometry.getInteriorPoint().getCoordinates(); // Use interior point for annotation placement
	var annotation = prompt('Enter annotation for the polygon:', ''); // Get annotation from user

	if (annotation !== null) { // Check if the user clicked Cancel
		// Update the territoryVue.savedPolygons array with the annotation
		territoryVue.savedPolygons[territoryVue.savedPolygons.length - 1].annotation = annotation;

		// Update the annotation overlay content and position
		var content = annotationOverlay.getElement();
		content.innerHTML = '<p>' + annotation + '</p>';
		annotationOverlay.setPosition(coordinates);

		// Show the annotation overlay
		annotationOverlay.setElement(content);
	}
}

  // Function to create the annotation overlay
function createAnnotationOverlay() {
	return new ol.Overlay({
		element: document.createElement('div'),
		positioning: 'bottom-center',
		stopEvent: false
	});
}

// Function to go to a specific location on the map
function goToLocation(center, zoom) {
	map.getView().setCenter(ol.proj.fromLonLat(center));
	map.getView().setZoom(zoom);
}

// Function to focus on a selected polygon with a margin
function focusOnPolygon(feature, margin) {
	margin = margin || 50; // Default margin size

	var geometry = feature.getGeometry();
	var extent = geometry.getExtent();

	// Add margin to the extent
	extent[0] -= margin;
	extent[1] -= margin;
	extent[2] += margin;
	extent[3] += margin;

	map.getView().fit(extent, map.getSize());
}

// Function to focus on a specific polygon with known coordinates
function focusOnSpecificPolygon(coordinates) {
	var polygonFeature = new ol.Feature({
	  	geometry: new ol.geom.Polygon([coordinates])
	});

	// Add style if needed
	polygonFeature.setStyle(new ol.style.Style({
		fill: new ol.style.Fill({
			color: '#76aaf14d'
		}),
		stroke: new ol.style.Stroke({
			color: '#76aaf1',
			width: 2
		})
	}));

	// Add the feature to the vector source
	map.getLayers().item(1).getSource().clear(); // Clear existing features
	map.getLayers().item(1).getSource().addFeature(polygonFeature);

	// Focus on the polygon with a margin
	focusOnPolygon(polygonFeature);
}

// Function to drop a pin at a specific location
function dropPin(coordinates) {
	var pinFeature = new ol.Feature({
	  geometry: new ol.geom.Point(ol.proj.fromLonLat(coordinates))
	});

	// Style for the pin
	pinFeature.setStyle(new ol.style.Style({
	  image: new ol.style.Icon({
		anchor: [0.5, 1],
		src: 'https://openlayers.org/en/latest/examples/data/icon.png'
	  })
	}));

	pinLayer.getSource().clear(); // Clear existing pins
	pinLayer.getSource().addFeature(pinFeature);
}

// Function to go to the current geolocation position
function goToCurrentPosition() {
	const view = new ol.View({
		center: [0, 0],
		zoom: 2,
	  });
    const coordinates = geolocation.getPosition();
    if (coordinates) {
      view.animate({
        center: ol.proj.fromLonLat(coordinates),
        duration: 1000,
        zoom: 15,
      });
    }
  }

  // Function to go to a random position on the map
  function goToRandomPosition() {
	const view = new ol.View({
		center: [0, 0],
		zoom: 2,
	  });
    const randomLon = Math.random() * 360 - 180;
    const randomLat = Math.random() * 180 - 90;
    view.animate({
      center: ol.proj.fromLonLat([randomLon, randomLat]),
      duration: 1000,
      zoom: 10,
    });
  }

// Function to show user's location and direction
async function showLocation() {
	if (!draw) {
		setDrawType('Polygon')
		await shortWait()
		await shortWait()
		await shortWait()
		stopDraw()
	}
    if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
        function (position) {
            var coordinates = [position.coords.longitude, position.coords.latitude];

            // Clear existing features
            geolocationLayer.getSource().clear();

            // Add a point feature for the user's location
            var locationFeature = new ol.Feature({
                geometry: new ol.geom.Point(ol.proj.fromLonLat(coordinates))
            });
            var markerFeature = new ol.Feature({
                geometry: new ol.geom.Point(ol.proj.fromLonLat(coordinates))
            });

            // Style for the location marker
            markerFeature.setStyle(new ol.style.Style({
                image: new ol.style.Circle({
                radius: 12,
                fill: new ol.style.Fill({
                    color: '#4285f454'
                }),
                })
            }));

            // Add a rotation feature for the direction
            var rotationFeature = new ol.Feature({
                geometry: new ol.geom.Point(ol.proj.fromLonLat(coordinates))
            });

            rotationFeature.setStyle(new ol.style.Style({
				image: new ol.style.Icon({
					anchor: [-0.35, 0.5],
					src: 'arrow.png',
					rotateWithView: true,
					rotation: position.coords.heading
				})
            }));

            
            geolocationLayer.getSource().addFeature(rotationFeature);
    
            // Glow effect for the location marker
            var glowFeature = new ol.Feature({
                geometry: new ol.geom.Point(ol.proj.fromLonLat(coordinates))
            });
    
            // Style for the glowing effect
            glowFeature.setStyle(new ol.style.Style({
            image: new ol.style.Circle({
                radius: 6,
                fill: new ol.style.Fill({
                color: '#4285f4'
                }),
                stroke: new ol.style.Stroke({
                color: 'white',
                width: 1.5
                })
            })
            }));

            // Add the location marker feature to the vector source
            geolocationLayer.getSource().addFeature(glowFeature);
            geolocationLayer.getSource().addFeature(markerFeature);
          

            // Center the map on the user's location
            map.getView().setCenter(ol.proj.fromLonLat(coordinates));
            map.getView().setZoom(18); // Adjust zoom level as needed
        },
        function (error) {
            console.error('Error getting location:', error);
        }
        );
    } else {
        alert('Geolocation is not supported by your browser');
    }
}

async function getRouteToPolygon(startPoint, endPoint) {
    // Example start and end points (longitude, latitude)
    //const startPoint = [8.681495, 49.41461]; // Frankfurt, Germany
    //const endPoint = [2.352222, 48.856613]; // Paris, France
/*
    // Create a vector source and layer for the route
    const vectorSource = new ol.source.Vector();
    const vectorLayer = new ol.layer.Vector({
      source: vectorSource,
    });

    map.addLayer(vectorLayer);*/

    // Add start and end point markers
    const startMarker = new ol.Feature({
      geometry: new ol.geom.Point(ol.proj.fromLonLat(startPoint)),
    });

    const endMarker = new ol.Feature({
      geometry: new ol.geom.Point(ol.proj.fromLonLat(endPoint)),
    });

    vectorSource.addFeature(startMarker);
    vectorSource.addFeature(endMarker);

    // Create a route using OpenRouteService
    const apiKey = '5b3ce3597851110001cf6248ae9629e18d1a42559a4ce52e63be67fc'; // Replace with your API key
    const routeUrl = `https://api.openrouteservice.org/v2/directions/driving-car?api_key=${apiKey}&start=${startPoint[0]},${startPoint[1]}&end=${endPoint[0]},${endPoint[1]}`;

    fetch(routeUrl)
      .then((response) => response.json())
      .then((data) => {
        const routeCoordinates = data.features[0].geometry.coordinates;

        // Create a line string geometry for the route
        const routeGeometry = new ol.geom.LineString(
          routeCoordinates.map((coord) => ol.proj.fromLonLat(coord))
        );

        // Create a feature for the route
        const routeFeature = new ol.Feature({
          geometry: routeGeometry,
        });

		// Style for the route
        const routeStyle = new ol.style.Style({
			stroke: new ol.style.Stroke({
			  color: '#0f53ff',
			  width: 4,
			}),
		});
		routeFeature.setStyle(routeStyle);
  

        vectorSource.addFeature(routeFeature);

        // Fit the map to the extent of the route
        map.getView().fit(routeGeometry.getExtent(), map.getSize());
      })
      .catch((error) => console.error('Error fetching route:', error));
}

// Function to download the map as an image
function downloadMap(fileName) {
    // Get the map's canvas element
    const mapCanvas = document.getElementById('map').getElementsByTagName('canvas')[0];

    // Create a new canvas to avoid modifying the original map canvas
    const downloadCanvas = document.createElement('canvas');
    downloadCanvas.width = mapCanvas.width;
    downloadCanvas.height = mapCanvas.height;
    const downloadContext = downloadCanvas.getContext('2d');

    // Draw the map canvas onto the download canvas
    downloadContext.drawImage(mapCanvas, 0, 0);

    // Create a data URL from the download canvas
    const dataUrl = downloadCanvas.toDataURL('image/png');

    // Create a temporary anchor element to trigger the download
    const downloadLink = document.createElement('a');
    downloadLink.href = dataUrl;
    downloadLink.download = fileName + '.png';

    // Trigger a click on the anchor element to initiate the download
    downloadLink.click();
}

async function gotoView(button) {
	congregationVue.display = false
	allPublishersVue.display = false
	territoryVue.display = false
	allParticipantsVue.display = false
	fieldServiceGroupsVue.display = false
    configurationVue.display = false
	monthlyReportVue.display = false
	missingReportVue.display = false
	attendanceVue.display = false
	allAssignmentsVue.display = false
	scheduleVue.display = false
	contactInformationVue.display = false
	branchReportVue.display = false
	entryVue.display = false
	fileVue.display = false
	approvalsVue.display = false
	archiveVue.display = false
	cardsVue.display = false
	if (button == "congregationVue" || button == "configurationVue") {
		navigationVue.display = false
	} else {
		navigationVue.display = true
	}
	window[`${button}`].display = true
	await shortWait()
	//await shortWait()
	if (button == "cardsVue") {
		document.querySelector('.fa-download').classList.add('fa-play')
	} else {
		if (document.querySelector('.fa-download')) {
			document.querySelector('.fa-download').classList.remove('fa-spin')
			document.querySelector('.fa-download').classList.remove('fa-spinner')
			document.querySelector('.fa-download').classList.remove('fa-play')
		}
	}
	if (button == 'territoryVue') {
		await shortWait()
		await shortWait()
		await shortWait()
 
		
		map = new ol.Map({
			target: 'map',
			layers: [
				new ol.layer.Tile({
					source: new ol.source.OSM()
				})
			],
            controls: [
                new ol.control.Zoom(),
                //new ol.control.ZoomSlider(),
                new ol.control.ZoomToExtent({
                    extent: [-1476201.3874956707, 944145.5873182358, -1471968.5385173948, 947437.0717492434],
                }),
                new ol.control.ScaleLine(),
                new ol.control.FullScreen(),
				new ol.control.Rotate(),
            ],/*
            view: new ol.View({
				center: ol.proj.fromLonLat([-13.239936, 8.468872]),
				zoom: 14
			})*/
		});

		await shortWait()
		await shortWait()
		await shortWait()
		// Create a vector source and layer for drawing
		vectorSource = new ol.source.Vector();
		vectorLayer = new ol.layer.Vector({
			source: vectorSource,
			style: new ol.style.Style({
				fill: new ol.style.Fill({
					color: '#76aaf14d'
				}),
				stroke: new ol.style.Stroke({
					color: '#76aaf1',
					width: 2
				}),
				image: new ol.style.Circle({
					radius: 7,
					fill: new ol.style.Fill({
						color: '#76aaf1'
					})
				})
			})
		});

		map.addLayer(vectorLayer);

		savedFeaturesSource = new ol.source.Vector();

		territoryVue.savedPolygons.sort((a, b) => collator.compare(a.number, b.number))

		await shortWait()
		await shortWait()
		await shortWait()

		const view = new ol.View({
			center: [0, 0],
			zoom: 2,
		  });

		geolocation = new ol.Geolocation({
			trackingOptions: {
			  enableHighAccuracy: true,
			},
			projection: view.getProjection(),
		  });
		
		  function el(id) {
			return document.getElementById(id);
		  }
		
		  el('track').addEventListener('change', function () {
			geolocation.setTracking(this.checked);
		  });
		
		  geolocation.on('change', function () {
			/*
			el('accuracy').innerText = geolocation.getAccuracy() + ' [m]';
			el('altitude').innerText = geolocation.getAltitude() + ' [m]';
			el('altitudeAccuracy').innerText = geolocation.getAltitudeAccuracy() + ' [m]';
			el('heading').innerText = geolocation.getHeading() + ' [rad]';
			el('speed').innerText = geolocation.getSpeed() + ' [m/s]';*/
		  });
		
		  geolocation.on('error', function (error) {
			const info = document.getElementById('info');
			info.innerHTML = error.message;
			info.style.display = '';
		  });
		
		  const accuracyFeature = new ol.Feature();
		  geolocation.on('change:accuracyGeometry', function () {
			accuracyFeature.setGeometry(geolocation.getAccuracyGeometry());
		  });
		  
		const iconStyle = new ol.style.Style({
			image: new ol.style.Icon({
				anchor: [-0.35, 0.5],
				src: 'arrow.png',
				rotateWithView: true,
				rotation: geolocation.getHeading() || 0,
			}),
		})
		
		const positionFeature = new ol.Feature();
		positionFeature.setStyle([
			new ol.style.Style({
				image: new ol.style.Circle({
					radius: 6,
					fill: new ol.style.Fill({
					  color: '#3399CC',
					}),
					stroke: new ol.style.Stroke({
					  color: '#fff',
					  width: 2,
					}),
				}),
			}),
			iconStyle,
		]);
		
		  geolocation.on('change:position', function () {
			const coordinates = geolocation.getPosition();
			positionFeature.setGeometry(coordinates ? new ol.geom.Point(coordinates) : null);
			const rotation = geolocation.getHeading() || 0;
			iconStyle.getImage().setRotation(rotation);
		  });
		
		  new ol.layer.Vector({
			map: map,
			source: new ol.source.Vector({
			  features: [accuracyFeature, positionFeature],
			}),
		  });
/*
		const north = document.createElement("div");
		north.innerHTML = `<div class="custom-control ol-control" style="pointer-events: auto;position: relative;margin-top: 10rem;margin-left: 8px;font-size: 14px;font-weight: 900;padding-top: 1px;width: 22px;height:24px"><button style="margin:1px;padding:1px;width: 20px;height:20px">N</button></div>`
		document.querySelectorAll('.ol-control')[0].insertAdjacentElement('afterend',north)
		north.addEventListener("click", () => {
			map.getView().setRotation(0)
		});*/

		const draw = document.createElement("div");
		draw.innerHTML = `<div class="custom-control ol-control" style="pointer-events: auto;position: relative;margin-top: 140px;margin-left: 8px;font-size: 12px;padding-top: 1px;width: 22px;height:21px;"><button style="width: 20px;height:19px;margin:1px;padding:1px"><i class="fas fa-pen"></i></button></div>`
		document.querySelectorAll('.ol-control')[0].insertAdjacentElement('afterend',draw)
		draw.addEventListener("click", () => {
			
			if (document.querySelectorAll('.custom-control button')[0].innerHTML == '<i class="fas fa-pen"></i>') {
				document.querySelectorAll('.custom-control button')[0].outerHTML = '<button style="width: 20px;height:18px;margin:1px;padding:1px"><i class="fas fa-mouse-pointer"></i></button>'
				document.querySelectorAll('.custom-control')[1].style.display = ''
				document.querySelectorAll('.custom-control')[2].style.display = ''
				
				setDrawType('Polygon');
				removePolygon = false
				document.querySelectorAll('.custom-control button')[2].style.color = ''
			} else {
				document.querySelectorAll('.custom-control button')[0].outerHTML = '<button style="width: 20px;height:19px;margin:1px;padding:1px"><i class="fas fa-pen"></i></button>'
				stopDraw()
			}
		});

		

		const vertex = document.createElement("div");
		vertex.innerHTML = `<div class="custom-control ol-control" style="pointer-events: auto;position: relative;margin-top: 0px;margin-left: 8px;font-size: 12px;padding: 0px;width: 22px;height: 20px;display:none"><button style="width: 20px;height: 20px;margin: 1px;padding: 1px;"><i class="fas fa-times"></i></button></div>`
		draw.insertAdjacentElement('afterend',vertex)
		vertex.addEventListener("click", () => {
			if (!draw) {
				setDrawType('Polygon')
			}
			removeVertex = !removeVertex
			if (removeVertex == true) {
				document.querySelectorAll('.custom-control button')[1].style.color = 'brown'
				document.querySelectorAll('.custom-control button')[2].style.color = ''
				removePolygon = false
			} else {
				document.querySelectorAll('.custom-control button')[1].style.color = ''
			}
		});

		
		const trash = document.createElement("div");
		trash.innerHTML = `<div class="custom-control ol-control" style="pointer-events: auto;position: relative;margin-top: 0px;margin-left: 8px;font-size: 12px;padding: 0px;width: 22px;height: 22px;display:none"><button style="width: 20px;height: 20px;margin:1px;padding:1px"><i class="fas fa-trash"></i></button></div>`
		vertex.insertAdjacentElement('afterend',trash)
		trash.addEventListener("click", () => {
			if (!draw) {
				setDrawType('Polygon')
			}
			removePolygon = !removePolygon
			if (removePolygon == true) {
				document.querySelectorAll('.custom-control button')[2].style.color = 'brown'
				document.querySelectorAll('.custom-control button')[1].style.color = ''
				document.querySelectorAll('.custom-control button')[0].outerHTML = '<button style="width: 20px;height:19px;margin:1px;padding:1px"><i class="fas fa-pen"></i></button>'
				stopDraw()
				removeVertex = false
				deletePolygon(selectedFeature);
			
				document.querySelectorAll('.custom-control button')[2].style.color = ''
				removePolygon = !removePolygon
				// Clear existing features on the map
				map.getLayers().forEach(function (layer) {
					if (layer instanceof ol.layer.Vector) {
					layer.getSource().clear();
					}
				});
			}
		});

		
		const currentLocation = document.createElement("div");
		currentLocation.innerHTML = `<div class="custom-control ol-control" style="pointer-events: auto;position: relative;margin-top: 50px;margin-left: 8px;font-size: 12px;padding: 0;width: 22px;height: 22px;"><button style="width: 20px;height: 20px;margin: 1px;padding: 1px;x"><i class="fas fa-crosshairs"></i></button></div>`
		trash.insertAdjacentElement('afterend',currentLocation)
		currentLocation.addEventListener("click", () => {
			showLocation()
		});

		if (currentUser.currentProfile == 'Territory Map') {
			draw.style.display = 'none'
			currentLocation.querySelector('div').style.marginTop = '150px'			
		}


		focusOnSpecificPolygon(territoryVue.savedPolygons[0].coordinates[0])
	}
}

document.querySelector('#congregation').innerHTML = `<template>
	<h3 v-if="display == true" style="padding:128px 16px 0 16px" class="w3-center">{{ congregation.congregationName }}</h3>
	<p v-if="display == true" class="w3-center w3-large">{{ congregation.address }}</p>
	<div v-if="display == true" class="w3-row-padding w3-center" style="margin-top:64px">
		
	</div>
</template>`

function processCongregation() {

    congregationVue = new Vue({
        el: document.querySelector('#congregation'),
        data: {
            //congregation: {"name": "New England Congregation", "address": "14 Hannesson Street, New England Ville.", "email": "cong574356@jwpub.org"},
            display: false,
        },
        computed: {
            publishersCount() {
                return allPublishersVue.publishers.length
            },
            congregation() {
				if (configurationVue.configuration) {
					return configurationVue.configuration
				} else {
					return { "congregationName": null, "address": null }
				}
            },
        },
        methods: {
			mode() {
				return mode
			},
			
        }
    })
}

var map, mymap, drawControl, drawnLayers = [], drawnFeaturesLayer, marker

document.querySelector('#territory').innerHTML = `<template>
	<div v-if="display == true" class="w3-row-padding" style="margin-top:64px">
		<h2 class="w3-center">TERRITORY</h2>	
		<section>
			<div id="map"></div>
			
			<div style="display:flex;">
				<select v-if="currentProfile() !== 'Territory Map'" v-model="selectedView" @change="redrawPolygons()" :class="inputMode('view w3-input')" style="width:150px;margin:15px 5px">
					<option v-for="view in views" :value="view">{{ view }}</option>
				</select>
				<select v-if="currentProfile() !== 'Territory Map'" v-model="selectedLocality" @change="redrawPolygons()" :class="inputMode('locality w3-input')" style="width:250px;margin:15px 5px">
					<option v-for="locality in localities()" :value="locality">{{ locality }}</option>
				</select>
				<label><input type="checkbox" style="margin:15px 5px" id="track"> Track</label>
				<div style="display: none;">
				
				<div id="info" style="display: none;"></div>
				<div>Accuracy: <span id="accuracy"></span></div>
				<div>Altitude: <span id="altitude"></span></div>
				<div>Altitude Accuracy: <span id="altitudeAccuracy"></span></div>
				<div>Heading: <span id="heading"></span></div>
				<div>Speed: <span id="speed"></span></div>
				</div>
			</div>
			<div style="margin-top:20px">
				<div class="w3-row-padding w3-grayscale" style="margin-top:4px">
					<div v-for="(territory, count) in displayPolygons()" :key="territory + '|' + count" v-if="territory.locality == selectedLocality || selectedLocality == 'All Localities'" style="cursor:pointer" class="w3-col l2 m4 w3-margin-bottom">
						<div :class="mode()">
							<div style="display:flex; justify-content:space-between" @click="territoryDetail($event.target, territory, count)">
								<h5 style="padding:10px 15px;margin:0">{{ count + 1 }} | {{ territory.number }}</h5>
								<p style="text-align: right;margin:20px;padding:0">
									<i class="fas fa-route" style="text-align: right;margin:5px" title="Route To"></i>
									<i class="fas fa-paper-plane" style="text-align: right;margin:5px" title="Send"></i>
									<i class="fas fa-image" style="text-align: right;margin:5px" title="Download Picture"></i>
									<i v-if="currentProfile() !== 'Territory Map'" class="fas fa-pencil-alt" title="Edit"></i>
								</p>
							</div>
							
							<div class="w3-container main" style="padding:0 15px 10px 15px">
								<p style="margin:0" v-if="territory.locality !== ''" title="Locality"><i class="fas fa-map-marker"></i> {{ territory.locality }}</p>
								<p style="margin:0" v-if="territory.lastDateCompleted !== ''" title="Last Date Completed"><i class="fas fa-calendar-alt"></i> {{ territory.lastDateCompleted }}</p>
								<p style="margin:0" v-if="territory.assignedTo !== ''" title="Assigned To"><i class="fas fa-user"></i> {{ territory.assignedTo }}</p>
								<p style="margin:0" v-if="territory.dateAssigned !== ''" title="Date Assigned"><i class="fas fa-calendar-plus"></i> {{ territory.dateAssigned }}</p>
								<p style="margin:0" v-if="territory.dateCompleted !== ''" title="Date Completed"><i class="fas fa-check-circle"></i> {{ territory.dateCompleted }}</p>
							</div>
							<div class="detail" style="display:none; padding:0 15px 15px 15px">
								<p><label>Number:<input :class="inputMode('number w3-input')" type="text" :value="territory.number" @change="handleInputChange($event.target, territory, 'number')"></label></p>
								<p><label>Locality:<input :class="inputMode('locality w3-input')" type="text" :value="territory.locality" @change="handleInputChange($event.target, territory, 'locality')"></label></p>
								<p><label>Last Date Completed:<input :class="inputMode('lastDateCompleted w3-input')" type="date" :value="territory.lastDateCompleted" @change="handleInputChange($event.target, territory, 'lastDateCompleted')"></label></p>
								<p><label>Assigned To:<input :class="inputMode('assignedTo w3-input')" type="text" :value="territory.assignedTo" @change="handleInputChange($event.target, territory, 'assignedTo')"></label></p>
								<p><label>Date Assigned:<input :class="inputMode('dateAssigned w3-input')" type="date" :value="territory.dateAssigned" @change="handleInputChange($event.target, territory, 'dateAssigned')"></label></p>
								<p><label>Date Completed:<input :class="inputMode('dateCompleted w3-input')" type="date" :value="territory.dateCompleted" @change="handleInputChange($event.target, territory, 'dateCompleted')"></label></p>
							</div>
						</div>
					</div>
				</div>
				
			</div>
		</section>
		
	</div>
</template>`

function processTerritory() {

    territoryVue = new Vue({
        el: document.querySelector('#territory'),
        data: {
            //congregation: {"name": "New England Congregation", "address": "14 Hannesson Street, New England Ville.", "email": "cong574356@jwpub.org"},
            display: false,
			geoJsonData: {type: 'FeatureCollection', features: []},
			savedPolygons: [],
			selectedView: 'All',
			selectedLocality: 'All Localities',
			views: ['Congregation', 'All', 'Assigned', 'Unassigned', 'Overlay'],
        },
        computed: {
            publishersCount() {
                return allPublishersVue.publishers.length
            },
            congregation() {
				if (configurationVue.configuration) {
					return configurationVue.configuration
				} else {
					return { "congregationName": null, "address": null }
				}
            },
        },
        methods: {
			async territoryDetail(item, territory, count) {
				if (item.className == 'fas fa-route') {
					navigator.geolocation.getCurrentPosition(
						function (position) {
							var coordinates = [position.coords.longitude, position.coords.latitude];
							getRouteToPolygon(coordinates, 
								territory.coordinates[0].map(coord =>
									ol.proj.toLonLat(coord).map(val => parseFloat(val.toFixed(6)))
								)[0]
							)
						}
					)
					return
				}
				focusOnSpecificPolygon(territory.coordinates[0])
				selectedPolygon = count
				//console.log(item.className)
				if (item.className == 'fas fa-pencil-alt') {
					item.parentNode.parentNode.parentNode.querySelector('.main').style.display = 'none'
					item.parentNode.parentNode.parentNode.querySelector('.detail').style.display = ''
					item.className = 'fas fa-times'
					item.title = 'Close'
				} else if (item.className == 'fas fa-times') {
					item.parentNode.parentNode.parentNode.querySelector('.main').style.display = ''
					item.parentNode.parentNode.parentNode.querySelector('.detail').style.display = 'none'
					item.className = 'fas fa-pencil-alt'
					item.title = 'Edit'
				} else if (item.className == 'fas fa-paper-plane') {
					if (territory.assignedTo == '') {
						alert('Please enter name of Publisher Assigned')
						return
					}
					//console.log('Send Message')

					var a = document.createElement("a");
					var file;

					await shortWait()
					await shortWait()
					const options = { year: 'numeric', month: 'long', day: 'numeric' };
					territory.dateAssigned = new Date().toLocaleDateString('en-US', options);

					file = new Blob([JSON.stringify({"exportType":"territoryMap", "territory":[territory]})], {type: 'text/plain'});
					
					await shortWait()
					await shortWait()

					//a.href = URL.createObjectURL(file);
				
					//a.download = 'Territory-' + territory.number + '-' + territory.locality + '.txt';
					//a.click();
					configurationVue.downloadZip(file, 'Territory-' + territory.number + '-' + territory.locality + '.txt', "territoryMap")

					DBWorker.postMessage({ storeName: 'territory', action: "save", value: [{"name": "FeatureCollection", "value": territoryVue.savedPolygons}]});

				} else if (item.className == 'fas fa-image') {
					if (territory.assignedTo == '') {
						alert('Please enter name of Publisher Assigned')
						return
					}
					
					const options = { year: 'numeric', month: 'long', day: 'numeric' };
					territory.dateAssigned = new Date().toLocaleDateString('en-US', options);

					downloadMap('Territory-' + territory.number + '-' + territory.locality)

					DBWorker.postMessage({ storeName: 'territory', action: "save", value: [{"name": "FeatureCollection", "value": territoryVue.savedPolygons}]});
					
				}

				if (modify) {
					modify.setActive(true);
				}
			},
			localities() {
				return ['All Localities'].concat(getUniqueElementsByProperty(this.savedPolygons, ['locality']).map(elem=>elem.locality))
			},
			handleInputChange(event, territory, property) {
				if (property == 'coordinates') {
					console.log(event, territory, property)
					return
				}
				territory[`${property}`] = event.value
				//console.log(territory)
				DBWorker.postMessage({ storeName: 'territory', action: "save", value: [{"name": "FeatureCollection", "value": territoryVue.savedPolygons}]});
			},
			inputMode(currentClass) {
				return currentClass + ' ' + mode.replace('w3-card ','')
			},
			mode() {
				return mode// + ' w3-input w3-border'
			},
			redrawPolygons() {
				if (this.selectedView == 'All') {
					redrawPolygons(this.savedPolygons.slice(1))
				} else if (this.selectedView == 'Assigned') {
					redrawPolygons(this.savedPolygons.slice(1).filter(elem=>elem.assignedTo !== ''))
				} else if (this.selectedView == 'Unassigned') {
					redrawPolygons(this.savedPolygons.slice(1).filter(elem=>elem.assignedTo == ''))
				} else if (this.selectedView == 'Congregation') {
					redrawPolygons(this.savedPolygons.slice(0, 1))
				} else if (this.selectedView == 'Overlay') {
					redrawPolygons(this.savedPolygons)
				}
				if (modify) {
					modify.setActive(false);
				}
			},
			displayPolygons() {
				if (this.selectedView == 'All') {
					return this.savedPolygons.slice(1)
				} else if (this.selectedView == 'Assigned') {
					return this.savedPolygons.slice(1).filter(elem=>elem.assignedTo !== '')
				} else if (this.selectedView == 'Unassigned') {
					return this.savedPolygons.slice(1).filter(elem=>elem.assignedTo == '')
				} else if (this.selectedView == 'Congregation') {
					return this.savedPolygons.slice(0, 1)
				} else if (this.selectedView == 'Overlay') {
					return this.savedPolygons
				}
			},
			updateDrawnFeaturesLayer() {
				if (drawnFeaturesLayer) {
				  mymap.removeLayer(drawnFeaturesLayer);
				}
			  
				// Convert drawnLayers to GeoJSON format
				/*var geoJsonData = {
				  type: 'FeatureCollection',
				  features: []
				};*/
			
				drawnLayers.forEach(function (layer) {
				  // Convert Leaflet layer to GeoJSON format
				  var geoJsonFeature = layer.toGeoJSON();
				  territoryVue.geoJsonData.features.push(geoJsonFeature);
				  DBWorker.postMessage({ storeName: 'territory', action: "save", value: [{"name": "FeatureCollection", "value": territoryVue.geoJsonData.features}]});
				});
			  
				// Create a new GeoJSON layer and add it to the map
				drawnFeaturesLayer = L.geoJSON(territoryVue.geoJsonData).addTo(mymap);
			},
			currentProfile() {
				return configurationVue.currentProfile()
			}		
        }
    })
}

processTerritory()

document.querySelector('#allPublishers').innerHTML = `<template>
	<div v-if="display == true">
		<h2 class="w3-center">ALL PUBLISHERS</h2>
		<div v-for="(category) in regularPioneers">
			<h2 class="w3-center">{{ category.name }}</h2>
			<div class="w3-row-padding w3-grayscale" style="margin-top:4px">
				<div v-for="(publisher, count) in category.value" :key="publisher + '|' + count" v-if="(publisher.fieldServiceGroup == selectedGroup || selectedGroup == 'All Groups') && publisher.name.toLowerCase().includes(searchTerms.toLowerCase())" class="w3-col l2 m4 w3-margin-bottom">
					<div :class="mode()">
						<div class="w3-container main">
							<h5 @click="publisherDetail(publisher, $event.target)">{{ publisher.name }}</h5>
						</div>
						<div class="detail" style="display:none; padding:15px">
							<div style="display:flex; justify-content:space-between">
								<i @click="publisherDetail(publisher, $event.target)" class="fas fa-chevron-left"></i>
								<i @click="removePublisher(count, publisher.name, $event.target)" class="fas fa-trash-alt"></i>
							</div>
							<h2 contenteditable="true" class="name">{{ publisher.name }}</h2>
							<p>
								<label>Date of Birth: <input v-if="publisher.dateOfBirth == null" type="date" :class="inputMode('dateOfBirth w3-input')"><input v-if="publisher.dateOfBirth !== null" type="date" :class="inputMode('dateOfBirth w3-input')" :value="cleanDate(publisher.dateOfBirth)"></label>
								<div style="display: flex;">
									<input :class="inputMode('birthDate w3-input')" type="number" min="1" max="31" style="width: 50px;">
									<select :class="inputMode('birthMonth w3-input')" style="width: 68px;">
										<option v-for="month in orderedMonths" :value="month.fullName">{{ month.abbr.toUpperCase() }}</option>
									</select>
									<input :class="inputMode('birthYear w3-input')" type="number" min="1900" max="2999" style="width: 68px;">
								</div>
								<div>
									<span title="Set Date" class="w3-button w3-black" style="height: 40px; padding: 0px;"><i @click="setDate('birth', $event.target, publisher)" class="fas fa-check" style="color: rgb(43, 101, 73); padding: 13px;"></i></span>
								</div>
								<select :class="inputMode('gender w3-input')" :v-model="publisher.gender">
									<option v-if="publisher.gender !== 'Male' && publisher.gender !== 'Female'" value="">Select Gender</option>
									<option v-if="publisher.gender == 'Male' || publisher.gender == 'Female'" :value="publisher.gender">{{ publisher.gender }}</option>
									<option v-for="gender in ['Male', 'Female'].filter(elem=>elem !== publisher.gender)" :value="gender">{{ gender }}</option>
								</select>
							</p>
							<p>
								<label>Date of Baptism: <input v-if="publisher.dateOfBaptism == null" type="date" :class="inputMode('dateOfBaptism w3-input')"><input v-if="publisher.dateOfBaptism !== null" type="date" :class="inputMode('dateOfBaptism w3-input')" :value="cleanDate(publisher.dateOfBaptism)"></label>
								<div style="display: flex;">
									<input :class="inputMode('baptismDate w3-input')" type="number" min="1" max="31" style="width: 50px;">
									<select :class="inputMode('baptismMonth w3-input')" style="width: 68px;">
										<option v-for="month in orderedMonths" :value="month.fullName">{{ month.abbr.toUpperCase() }}</option>
									</select>
									<input :class="inputMode('baptismYear w3-input')" type="number" min="1900" max="2999" style="width: 68px;">
								</div>
								<div>
									<span title="Set Date" class="w3-button w3-black" style="height: 40px; padding: 0px;"><i @click="setDate('baptism', $event.target, publisher)" class="fas fa-check" style="color: rgb(43, 101, 73); padding: 13px;"></i></span>
								</div>
								<select :class="inputMode('hope w3-input')" :v-model="publisher.hope">
									<option :value="publisher.hope">{{ publisher.hope }}</option>
									<option v-for="hope in hopes.filter(elem=>elem !== publisher.hope)" :value="hope">{{ hope }}</option>
								</select>
							</p>
							<label v-for="(privilege, index) in privileges" :key="index" :class="inputMode('w3-input')"><input type="checkbox" :name="privilege" :class="inputMode('privileges')" :checked=publisher.privilege.includes(privilege)> {{ privilege }}</label>
							<p>
								<label>Field Service Group: 
								<select :class="inputMode('fieldServiceGroup w3-input')" :v-model="publisher.fieldServiceGroup">
									<option v-if="!allGroups.includes(publisher.fieldServiceGroup)" value="">Select Group</option>
									<option v-if="allGroups.includes(publisher.fieldServiceGroup)" :value="publisher.fieldServiceGroup">{{ publisher.fieldServiceGroup }}</option>
									<option v-for="group in allGroups.filter(elem=>elem !== publisher.fieldServiceGroup)" :value="group">{{ group }}</option>
								</select></label>
							</p>
							<div style="overflow-x: scroll;">
								<table>
									<thead>
									<tr>
										<th>Service Year {{ publisher.report.currentServiceYear.year }}</th>
										<th>Shared in Ministry</th>
										<th>Bible Studies</th>
										<th>Auxiliary Pioneer</th>
										<th>Hours (If pioneer or ﬁeld missionary)</th>
										<th>Remarks</th>
									</tr>
									</thead>
									<tbody>
									<tr v-for="(month, index) in months" :key="month.abbr" :class="month.abbr">
										<td>{{ month.fullName }}</td>
										<td><input class="sharedInMinistry" type="checkbox" :checked="publisher.report.currentServiceYear[month.abbr].sharedInMinistry !== null"></td>
										<td class="bibleStudies" contenteditable="true">{{ publisher.report.currentServiceYear[month.abbr].bibleStudies }}</td>
										<td><input class="auxiliaryPioneer" type="checkbox" :checked="publisher.report.currentServiceYear[month.abbr].auxiliaryPioneer !== null"></td>
										<td class="hours" contenteditable="true">{{ publisher.report.currentServiceYear[month.abbr].hours }}</td>
										<td class="remarks" contenteditable="true">{{ publisher.report.currentServiceYear[month.abbr].remarks }}</td>
									</tr>
									<tr>
										<td></td>
										<td></td>
										<td></td>
										<td>Total</td>
										<td>{{ publisher.report.currentServiceYear.totalHours }}</td>
										<td contenteditable="true">{{ publisher.report.currentServiceYear.totalRemarks }}</td>
									</tr>
									</tbody>
								</table>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
		<div v-for="(group) in allGroups">
			<h2 class="w3-center">{{ group }}</h2>
			<div class="w3-row-padding w3-grayscale" style="margin-top:4px">
				<div v-for="(publisher, count) in activePublishers" v-if="publisher.fieldServiceGroup == group && (group == selectedGroup || selectedGroup == 'All Groups') && publisher.name.toLowerCase().includes(searchTerms.toLowerCase())" :key="publisher + '|' + count" class="w3-col l2 m4 w3-margin-bottom">
					<div :class="mode()">
						<div class="w3-container main">
							<h5 @click="publisherDetail(publisher, $event.target)">{{ publisher.name }}</h5>
						</div>
						<div class="detail" style="display:none; padding:15px">
							<div style="display:flex; justify-content:space-between">
								<i @click="publisherDetail(publisher, $event.target)" class="fas fa-chevron-left"></i>
								<i @click="removePublisher(count, publisher.name, $event.target)" class="fas fa-trash-alt"></i>
							</div>
							<h2 contenteditable="true" class="name">{{ publisher.name }}</h2>
							<p>
								<label>Date of Birth: <input v-if="publisher.dateOfBirth == null" type="date" :class="inputMode('dateOfBirth w3-input')"><input v-if="publisher.dateOfBirth !== null" type="date" :class="inputMode('dateOfBirth w3-input')" :value="cleanDate(publisher.dateOfBirth)"></label>
								<div style="display: flex;">
									<input :class="inputMode('birthDate w3-input')" type="number" min="1" max="31" style="width: 50px;">
									<select :class="inputMode('birthMonth w3-input')" style="width: 68px;">
										<option v-for="month in orderedMonths" :value="month.fullName">{{ month.abbr.toUpperCase() }}</option>
									</select>
									<input :class="inputMode('birthYear w3-input')" type="number" min="1900" max="2999" style="width: 68px;">
								</div>
								<div>
									<span title="Set Date" class="w3-button w3-black" style="height: 40px; padding: 0px;"><i @click="setDate('birth', $event.target, publisher)" class="fas fa-check" style="color: rgb(43, 101, 73); padding: 13px;"></i></span>
								</div>
								<select :class="inputMode('gender w3-input')" :v-model="publisher.gender">
									<option v-if="publisher.gender !== 'Male' && publisher.gender !== 'Female'" value="">Select Gender</option>
									<option v-if="publisher.gender == 'Male' || publisher.gender == 'Female'" :value="publisher.gender">{{ publisher.gender }}</option>
									<option v-for="gender in ['Male', 'Female'].filter(elem=>elem !== publisher.gender)" :value="gender">{{ gender }}</option>
								</select>
							</p>
							<p>
								<label>Date of Baptism: <input v-if="publisher.dateOfBaptism == null" type="date" :class="inputMode('dateOfBaptism w3-input')"><input v-if="publisher.dateOfBaptism !== null" type="date" :class="inputMode('dateOfBaptism w3-input')" :value="cleanDate(publisher.dateOfBaptism)"></label>
								<div style="display: flex;">
									<input :class="inputMode('baptismDate w3-input')" type="number" min="1" max="31" style="width: 50px;">
									<select :class="inputMode('baptismMonth w3-input')" style="width: 68px;">
										<option v-for="month in orderedMonths" :value="month.fullName">{{ month.abbr.toUpperCase() }}</option>
									</select>
									<input :class="inputMode('baptismYear w3-input')" type="number" min="1900" max="2999" style="width: 68px;">
								</div>
								<div>
									<span title="Set Date" class="w3-button w3-black" style="height: 40px; padding: 0px;"><i @click="setDate('baptism', $event.target, publisher)" class="fas fa-check" style="color: rgb(43, 101, 73); padding: 13px;"></i></span>
								</div>
								<select :class="inputMode('hope w3-input')" :v-model="publisher.hope">
									<option :value="publisher.hope">{{ publisher.hope }}</option>
									<option v-for="hope in hopes.filter(elem=>elem !== publisher.hope)" :value="hope">{{ hope }}</option>
								</select>
							</p>
							<label v-for="(privilege, index) in privileges" :key="index" :class="inputMode('w3-input')"><input type="checkbox" :name="privilege" :class="inputMode('privileges')" :checked=publisher.privilege.includes(privilege)> {{ privilege }}</label>
							<p>
								<label>Field Service Group: 
								<select :class="inputMode('fieldServiceGroup w3-input')" :v-model="publisher.fieldServiceGroup">
									<option v-if="!allGroups.includes(publisher.fieldServiceGroup)" value="">Select Group</option>
									<option v-if="allGroups.includes(publisher.fieldServiceGroup)" :value="publisher.fieldServiceGroup">{{ publisher.fieldServiceGroup }}</option>
									<option v-for="group in allGroups.filter(elem=>elem !== publisher.fieldServiceGroup)" :value="group">{{ group }}</option>
								</select></label>
							</p>
							<div style="overflow-x: scroll;">
								<table>
									<thead>
									<tr>
										<th>Service Year {{ publisher.report.currentServiceYear.year }}</th>
										<th>Shared in Ministry</th>
										<th>Bible Studies</th>
										<th>Auxiliary Pioneer</th>
										<th>Hours (If pioneer or ﬁeld missionary)</th>
										<th>Remarks</th>
									</tr>
									</thead>
									<tbody>
									<tr v-for="(month, index) in months" :key="month.abbr" :class="month.abbr">
										<td>{{ month.fullName }}</td>
										<td><input class="sharedInMinistry" type="checkbox" :checked="publisher.report.currentServiceYear[month.abbr].sharedInMinistry !== null"></td>
										<td class="bibleStudies" contenteditable="true">{{ publisher.report.currentServiceYear[month.abbr].bibleStudies }}</td>
										<td><input class="auxiliaryPioneer" type="checkbox" :checked="publisher.report.currentServiceYear[month.abbr].auxiliaryPioneer !== null"></td>
										<td class="hours" contenteditable="true">{{ publisher.report.currentServiceYear[month.abbr].hours }}</td>
										<td class="remarks" contenteditable="true">{{ publisher.report.currentServiceYear[month.abbr].remarks }}</td>
									</tr>
									<tr>
										<td></td>
										<td></td>
										<td></td>
										<td>Total</td>
										<td>{{ publisher.report.currentServiceYear.totalHours }}</td>
										<td contenteditable="true">{{ publisher.report.currentServiceYear.totalRemarks }}</td>
									</tr>
									</tbody>
								</table>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
		<h2 class="w3-center">Inactive Publishers</h2>
		<div class="w3-row-padding w3-grayscale" style="margin-top:4px">
			<div v-for="(publisher, count) in inactivePublishers" :key="publisher + '|' + count" v-if="(publisher.fieldServiceGroup == selectedGroup || selectedGroup == 'All Groups') && publisher.name.toLowerCase().includes(searchTerms.toLowerCase())" class="w3-col l2 m4 w3-margin-bottom">
				<div :class="mode()">
					<div class="w3-container main">
						<h5 @click="publisherDetail(publisher, $event.target)">{{ publisher.name }}</h5>
					</div>
					<div class="detail" style="display:none; padding:15px">
						<div style="display:flex; justify-content:space-between">
							<i @click="publisherDetail(publisher, $event.target)" class="fas fa-chevron-left"></i>
							<i @click="removePublisher(count, publisher.name, $event.target)" class="fas fa-trash-alt"></i>
						</div>
						<h2 contenteditable="true" class="name">{{ publisher.name }}</h2>
						<p>
						<label :class="inputMode('w3-input')"><input type="checkbox" name="reactivated" :class="inputMode('reactivated')" :checked=publisher.reactivated> Reactivated</label>
							<label>Date of Birth: <input v-if="publisher.dateOfBirth == null" type="date" :class="inputMode('dateOfBirth w3-input')"><input v-if="publisher.dateOfBirth !== null" type="date" :class="inputMode('dateOfBirth w3-input')" :value="cleanDate(publisher.dateOfBirth)"></label>
							<div style="display: flex;">
								<input :class="inputMode('birthDate w3-input')" type="number" min="1" max="31" style="width: 50px;">
								<select :class="inputMode('birthMonth w3-input')" style="width: 68px;">
									<option v-for="month in orderedMonths" :value="month.fullName">{{ month.abbr.toUpperCase() }}</option>
								</select>
								<input :class="inputMode('birthYear w3-input')" type="number" min="1900" max="2999" style="width: 68px;">
							</div>
							<div>
								<span title="Set Date" class="w3-button w3-black" style="height: 40px; padding: 0px;"><i @click="setDate('birth', $event.target, publisher)" class="fas fa-check" style="color: rgb(43, 101, 73); padding: 13px;"></i></span>
							</div>
							<select :class="inputMode('gender w3-input')" :v-model="publisher.gender">
								<option v-if="publisher.gender !== 'Male' && publisher.gender !== 'Female'" value="">Select Gender</option>
								<option v-if="publisher.gender == 'Male' || publisher.gender == 'Female'" :value="publisher.gender">{{ publisher.gender }}</option>
								<option v-for="gender in ['Male', 'Female'].filter(elem=>elem !== publisher.gender)" :value="gender">{{ gender }}</option>
							</select>
						</p>
						<p>
							<label>Date of Baptism: <input v-if="publisher.dateOfBaptism == null" type="date" :class="inputMode('dateOfBaptism w3-input')"><input v-if="publisher.dateOfBaptism !== null" type="date" :class="inputMode('dateOfBaptism w3-input')" :value="cleanDate(publisher.dateOfBaptism)"></label>
							<div style="display: flex;">
								<input :class="inputMode('baptismDate w3-input')" type="number" min="1" max="31" style="width: 50px;">
								<select :class="inputMode('baptismMonth w3-input')" style="width: 68px;">
									<option v-for="month in orderedMonths" :value="month.fullName">{{ month.abbr.toUpperCase() }}</option>
								</select>
								<input :class="inputMode('baptismYear w3-input')" type="number" min="1900" max="2999" style="width: 68px;">
							</div>
							<div>
								<span title="Set Date" class="w3-button w3-black" style="height: 40px; padding: 0px;"><i @click="setDate('baptism', $event.target, publisher)" class="fas fa-check" style="color: rgb(43, 101, 73); padding: 13px;"></i></span>
							</div>
							<select :class="inputMode('hope w3-input')" :v-model="publisher.hope">
								<option :value="publisher.hope">{{ publisher.hope }}</option>
								<option v-for="hope in hopes.filter(elem=>elem !== publisher.hope)" :value="hope">{{ hope }}</option>
							</select>
						</p>
						<label v-for="(privilege, index) in privileges" :key="index" :class="inputMode('w3-input')"><input type="checkbox" :name="privilege" :class="inputMode('privileges')" :checked=publisher.privilege.includes(privilege)> {{ privilege }}</label>
						<p>
							<label>Field Service Group: 
							<select :class="inputMode('fieldServiceGroup w3-input')" :v-model="publisher.fieldServiceGroup">
								<option v-if="!allGroups.includes(publisher.fieldServiceGroup)" value="">Select Group</option>
								<option v-if="allGroups.includes(publisher.fieldServiceGroup)" :value="publisher.fieldServiceGroup">{{ publisher.fieldServiceGroup }}</option>
								<option v-for="group in allGroups.filter(elem=>elem !== publisher.fieldServiceGroup)" :value="group">{{ group }}</option>
							</select></label>
						</p>
						<div style="overflow-x: scroll;">
							<table>
								<thead>
								<tr>
									<th>Service Year {{ publisher.report.currentServiceYear.year }}</th>
									<th>Shared in Ministry</th>
									<th>Bible Studies</th>
									<th>Auxiliary Pioneer</th>
									<th>Hours (If pioneer or ﬁeld missionary)</th>
									<th>Remarks</th>
								</tr>
								</thead>
								<tbody>
								<tr v-for="(month, index) in months" :key="month.abbr" :class="month.abbr">
									<td>{{ month.fullName }}</td>
									<td><input class="sharedInMinistry" type="checkbox" :checked="publisher.report.currentServiceYear[month.abbr].sharedInMinistry !== null"></td>
									<td class="bibleStudies" contenteditable="true">{{ publisher.report.currentServiceYear[month.abbr].bibleStudies }}</td>
									<td><input class="auxiliaryPioneer" type="checkbox" :checked="publisher.report.currentServiceYear[month.abbr].auxiliaryPioneer !== null"></td>
									<td class="hours" contenteditable="true">{{ publisher.report.currentServiceYear[month.abbr].hours }}</td>
									<td class="remarks" contenteditable="true">{{ publisher.report.currentServiceYear[month.abbr].remarks }}</td>
								</tr>
								<tr>
									<td></td>
									<td></td>
									<td></td>
									<td>Total</td>
									<td>{{ publisher.report.currentServiceYear.totalHours }}</td>
									<td contenteditable="true">{{ publisher.report.currentServiceYear.totalRemarks }}</td>
								</tr>
								</tbody>
							</table>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
	<div v-if="request == true">
		<h2 class="w3-center">REQUEST RECORD</h2>
		<form action="javascript:void(0)" id="publisherRequest">
			<p><input v-model="publisherName" :class="inputMode('w3-input w3-border')" type="text" placeholder="Publisher Name" required name="Name"></p>
			<p><input :class="inputMode('w3-input w3-border')" type="text" placeholder="Congregation Email" required name="Email"></p>
			<!--p><textarea :class="inputMode('w3-input w3-border')" @keyup="auto_grow" placeholder="Subject" required name="Subject" :value="subject()"></textarea></p>
			<p><textarea :class="inputMode('w3-input w3-border')" @keyup="auto_grow" placeholder="Message" required name="Message" :value="message()"></textarea></p-->
			<p>
				<button @click="sendMessage()" class="w3-button w3-black" type="submit">
					<i class="fa fa-paper-plane"></i> SEND MESSAGE
				</button>
			</p>
		</form>
    </div>
	<div v-if="transfer == true">
		<h2 class="w3-center">TRANSFER RECORD</h2>
		<form action="javascript:void(0)" id="publisherRequest">
			<p>
				<select v-model="publisherName" @change="auto_grow" style="height:40px;" :class="searchMode()">
					<option value="">Select Publisher</option>
					<option v-for="publisher in publishers" :key="publisher.name" :value="publisher.name">{{ publisher.name }}</option>
				</select>
				<span style="height:40px;padding:0" title="Add Publisher" class="w3-button w3-black">
					<i style="color:#2b6549;padding:13px" onclick="addRecord(this)" class="fa fa-plus"></i>
				</span>
			</p>
			<p><input :class="inputMode('w3-input w3-border')" v-model="email" type="text" placeholder="Congregation Email" required name="Email"></p>
			<p><textarea :class="inputMode('w3-input w3-border')" v-model="congregationAddress" type="text" placeholder="Congregation Address" required name="Address"></textarea></p>
			<p><textarea :class="inputMode('w3-input w3-border')" v-model="letterOfIntroduction" placeholder="Letter of Introduction body" required name="LetterOfIntroduction"></textarea></p>
			<p>
				<button @click="previewRecord()" class="w3-button w3-black" type="submit">
					PREVIEW
				</button>
				<button @click="transferRecord()" class="w3-button w3-black" type="submit">
					<i class="fa fa-paper-plane"></i> TRANSFER
				</button>
				<button @click="cancelTransfer()" class="w3-button w3-black" type="submit">
					CANCEL
				</button>
			</p>
		</form>
		<div v-if="preview == true" class="zoom-container" id="zoomContainer">
			<div class="zoom-content" id="zoomContent">
				<div id="content">
					<h1 align="center">{{ congregation.congregationName.toUpperCase() }} CONGREGATION</h1>
					<h3 align="center">{{ congregation.address.toUpperCase() }} {{ congregation.email.toUpperCase() }}</h3>
					<p align="right">{{ formatDateToFull() }}</p>

					<p contenteditable="true" id="address" class="edit-content"></p>
										
					<p>Dear Brothers,</p>
					<p align="center" class="edit-content letterTitle" contenteditable="true">INTRODUCTION OF {{ publisherNameValue().toUpperCase() }}</p>
					
					<p class="closing">Your brothers,</p>
					
					<div class="container" style="margin-top:30px">
						<p class="element" align="center">{{ congregation.cboe }}</p>
						<p class="element" align="center">{{ congregation.sec }}</p>
						<p class="element" align="center">{{ congregation.so }}</p>
					</div>

					<div class="container" style="margin-top:0">
						<p class="element" align="center">CBOE</p>
						<p class="element" align="center">Secretary</p>
						<p class="element" align="center">Service overseer</p>
					</div>    

				</div>
			</div>
		</div>
		
    </div>
	<div v-if="correspondence == true">
		<h2 class="w3-center">MAIL</h2>
		<form action="javascript:void(0)" id="publisherRequest">
			<p><input :class="inputMode('w3-input w3-border')" v-model="email" type="text" placeholder="Congregation Email" required name="Email"></p>
			<p><textarea :class="inputMode('w3-input w3-border')" v-model="congregationAddress" type="text" placeholder="Congregation Address" required name="Address"></textarea></p>
			<p><textarea :class="inputMode('w3-input w3-border')" v-model="letterTitle" placeholder="Title of Letter" required name="LetterTitle"></textarea></p>
			<p><textarea :class="inputMode('w3-input w3-border')" v-model="letterOfIntroduction" placeholder="Letter of Introduction body" required name="LetterOfIntroduction"></textarea></p>
			<p><input :class="inputMode('w3-input w3-border')" v-model="closing" type="text" placeholder="Closing" name="Closing"></p>
			<p><input :class="inputMode('w3-input w3-border')" v-model="closing1" type="text" placeholder="Closing 1" name="Closing1"></p>
			<p><input :class="inputMode('w3-input w3-border')" v-model="closing1Value" type="text" placeholder="Closing 1 Value" name="Closing1Value"></p>
			<p><input :class="inputMode('w3-input w3-border')" v-model="closing2" type="text" placeholder="Closing 2" name="Closing2"></p>
			<p><input :class="inputMode('w3-input w3-border')" v-model="closing2Value" type="text" placeholder="Closing 2 Value" name="Closing2Value"></p>
			<p><input :class="inputMode('w3-input w3-border')" v-model="closing3" type="text" placeholder="Closing 3" name="Closing3"></p>
			<p><input :class="inputMode('w3-input w3-border')" v-model="closing3Value" type="text" placeholder="Closing 3 Value" name="Closing3Value"></p>
			<p><textarea :class="inputMode('w3-input w3-border')" v-model="mailSubject" @keyup="auto_grow" placeholder="Subject" required name="Subject"></textarea></p>
			<p>
				<button @click="previewRecord()" class="w3-button w3-black" type="submit">
					PREVIEW
				</button>
				<button @click="sendMail()" class="w3-button w3-black" type="submit">
					<i class="fa fa-paper-plane"></i> SEND
				</button>
				<button @click="cancelMail()" class="w3-button w3-black" type="submit">
					CANCEL
				</button>
			</p>
		</form>
		<div v-if="preview == true" class="zoom-container" id="zoomContainer">
			<div class="zoom-content" id="zoomContent">
				<div id="content">
					<h1 align="center">{{ congregation.congregationName.toUpperCase() }} CONGREGATION</h1>
					<h3 align="center">{{ congregation.address.toUpperCase() }} {{ congregation.email.toUpperCase() }}</h3>
					<p align="right">{{ formatDateToFull() }}</p>

					<p contenteditable="true" id="address" class="edit-content"></p>
										
					<!--p>Dear Brothers,</p-->
					<p align="center" class="edit-content letterTitle" contenteditable="true">{{ letterTitle.toUpperCase() }}</p>
					
					<p class="closing"></p>
					
					<div class="container" style="margin-top:30px">
						<p class="element" align="center">{{ closing1Value }}</p>
						<p class="element" align="center">{{ closing2Value }}</p>
						<p class="element" align="center">{{ closing3Value }}</p>
					</div>

					<div class="container" style="margin-top:0">
						<p class="element" align="center">{{ closing1 }}</p>
						<p class="element" align="center">{{ closing2 }}</p>
						<p class="element" align="center">{{ closing3 }}</p>
					</div>    

				</div>
			</div>
		</div>
		
    </div>
</template>`
//(group == 'Pioneers' && publisher.privilege.some(item => privileges.slice(-3).includes(item)))
function processAllPublishers() {

    allPublishersVue = new Vue({
        el: document.querySelector('#allPublishers'),
        data: {
			publishers: [],
            status: ["Active", "Inactive"],
            display: false,
			selectedPublisher: {},
			pdfFile: '',
            request: false,
            transfer: false,
            correspondence: false,
            preview: false,
            publisherName: '',
			congregationAddress: '',
			email: '',
			letterTitle: '',
			letterOfIntroduction: '',
			closing: '',
			closing1: '',
			closing1Value: '',
            closing2: '',
			closing2Value: '',
            closing3: '',
			closing3Value: '',
			mailSubject: '',
            categories: [],
            hopes: ['Anointed', 'Other Sheep', 'Unbaptized Publisher'],
            privileges: ['Elder', 'Ministerial Servant', 'Regular Pioneer', 'Special Pioneer', 'Field Missionary'],
            months: [{"abbr": "sept", "fullName": "September"}, {"abbr": "oct", "fullName": "October"}, {"abbr": "nov", "fullName": "November"}, {"abbr": "dec", "fullName": "December"}, {"abbr": "jan", "fullName": "January"}, {"abbr": "feb", "fullName": "February"}, {"abbr": "mar", "fullName": "March"}, {"abbr": "apr", "fullName": "April"}, {"abbr": "may", "fullName": "May"}, {"abbr": "jun", "fullName": "June"}, {"abbr": "jul", "fullName": "July"}, {"abbr": "aug", "fullName": "August"} ],
        },
        computed: {
			congregation() {
				if (configurationVue.configuration) {
					return configurationVue.configuration
				} else {
					return { "congregationName": null, "address": null, "email": null }
				}
            },
			searchTerms() {
                return navigationVue.searchTerms
            },
			selectedGroup() {
                return navigationVue.fieldServiceGroup
            },
			allGroups() {
				this.publishers.forEach(elem=>{
					if (this.checkStatus(elem.report) == 'Active') {
						elem.active = true
						if (elem.reactivated) {
							delete elem.reactivated
						}
					} else {
						if (!elem.reactivated) {
							elem.active = false
						}
					}
				})
                return navigationVue.allGroups
            },
			regularPioneers() {
				var categories = [{"name": "Pioneers","value": this.publishers.filter(elem=>elem.privilege.includes("Regular Pioneer"))}]
				return categories
			},
			activePublishers() {
				return this.publishers.filter(elem=>!elem.privilege.includes("Regular Pioneer") && elem.active == true)
			},
			inactivePublishers() {
				return this.publishers.filter(elem=>elem.active !== true)
			},
			orderedMonths() {
				return this.months.slice(4).concat(this.months.slice(0, 4))
			},
        },
		watch: {
			//publisherName: 'addPublisher',
			congregationAddress: 'updateAddress',
			letterOfIntroduction: 'updateLetterBody',
			letterTitle: 'updateLetterBody'
		},
        methods: {
			setDate(type, element, publisher) {
				var selectedPublisher = element.parentNode.parentNode.parentNode
				var selectedDate = selectedPublisher.querySelector(`.${type}Date`).value
				var selectedMonth = selectedPublisher.querySelector(`.${type}Month`).value
				var selectedYear = selectedPublisher.querySelector(`.${type}Year`).value
				var selectedFullDate = `${selectedYear}-${(this.orderedMonths.findIndex(elem=>elem.fullName == selectedMonth) + 1).toString().padStart(2, '0')}-${selectedDate.toString().padStart(2, '0')}`
				if (new Date(selectedFullDate)) {
					if (type == 'birth') {
						publisher.dateOfBirth = selectedFullDate
					} else {
						publisher.dateOfBaptism = selectedFullDate
					}
				}
			},
			async previewRecord() {
				if (this.publisherName == '' && this.correspondence == false) { return }
				downloadsArray = []
				this.preview = true
				await shortWait()
				document.querySelector('#content').style.display = ''
				await shortWait()
				await shortWait()
				document.querySelector('#address').innerText = document.getElementById("publisherRequest").Address.value
				document.querySelector('#address').innerText += '\n'
				document.querySelector('#address').innerText += document.getElementById("publisherRequest").Email.value
				document.getElementById("publisherRequest").LetterOfIntroduction.value.replaceAll('\n\n','\n').split('\n').reverse().forEach(elem=>{
					document.querySelector('.letterTitle').insertAdjacentHTML('afterend', `<p class="indented-paragraph edit-content letterBody" contenteditable="true">${elem}</p>`);
				})
				if (this.closing == '') {
					this.closing = this.congregation.congregationName + ' Congregation'
				}
				document.querySelector('.closing').innerText += '\n'
				document.querySelector('.closing').innerText += this.closing
				await shortWait()
				await shortWait()
				await shortWait()
				convertToImage(document.querySelector('#content'))
			},
			updateLetterBody(event) {
				this.auto_grow()				
			},
			updateAddress(event) {
				this.auto_grow()
			},
			async cancelTransfer() {
				console.log('Cancel')
				document.querySelectorAll('iframe').forEach(elem=>{
					elem.parentNode.remove()
				})
				await shortWait()
				await shortWait()
				this.transfer = false
				this.publisherName = ''
				this.congregationAddress = ''
				this.email = ''
				this.letterOfIntroduction = ''
				await shortWait()
				await shortWait()
				this.transfer = true
				await shortWait()
				await shortWait()
				document.querySelector('#content').innerHTML = ''
				document.querySelector('#content').style.display = 'none'
			},
			async cancelMail() {
				console.log('Cancel')
				document.querySelectorAll('iframe').forEach(elem=>{
					elem.parentNode.remove()
				})
				await shortWait()
				await shortWait()
				this.transfer = false
				this.congregationAddress = ''
				this.email = ''
				this.letterOfIntroduction = ''
				this.letterTitle = ''
				await shortWait()
				await shortWait()
				this.transfer = true
				await shortWait()
				await shortWait()
				document.querySelector('#content').innerHTML = ''
				document.querySelector('#content').style.display = 'none'
			},
			async previewLetter(file) {
				const reader = new FileReader();

				reader.onload = async function (e) {
					const pdfData = new Uint8Array(e.target.result);

					// Using pdf-lib to load the PDF document
					const pdfBytes = await PDFLib.PDFDocument.load(pdfData);
					// Create a Blob from the modified PDF bytes
					const blob = new Blob([pdfBytes], { type: 'application/pdf' });

					// Create a data URL from the Blob
					const dataUrl = URL.createObjectURL(blob);

					// Set the new data URL as the source for the iframe
					document.getElementById('letter').src = dataUrl;

				};

				reader.readAsArrayBuffer(file);

			},
			buttonMode(currentClass) {
				return currentClass + ' ' + mode.replace('w3-card ','').replace('white','light-grey').replace('black','dark-grey')
			},
			searchMode() {
				return mode.replace('w3-card','w3-border')
			},
			auto_grow() {
				auto_grow(document.getElementById("publisherRequest").Address);
				auto_grow(document.getElementById("publisherRequest").LetterOfIntroduction);
				if (document.getElementById("publisherRequest").LetterTitle) {
					auto_grow(document.getElementById("publisherRequest").LetterTitle);
				}
			},
			async sendMessage() {
				console.log('Message')
				if (this.publisherName == '') { return }
				const messageContent = document.getElementById("publisherRequest")
				var recipient = messageContent.Email.value;
				//var subject = messageContent.Subject.value;
				//var body = messageContent.Message.value;
				var mailtoLink = 'mailto:' + encodeURIComponent(recipient) +
								'?cc=' + encodeURIComponent(congregationVue.congregation.email) +
								'&subject=' + encodeURIComponent(this.subject()) +
								'&body=' + encodeURIComponent(this.message());

				await shortWait()

				document.getElementById("publisherRequest").Name.value = ''
				document.getElementById("publisherRequest").Email.value = ''
				allPublishersVue.publisherName = ''

				await shortWait()

				//this.auto_grow()

				window.location.href = mailtoLink;
			},
			async transferRecord() {
				if (this.publisherName == '') { return }
				//console.log('Message')
				/*downloadsArray.forEach(async (elem)=>{
					await downloadPreparedFiles(elem)
				})*/
				
				var mailtoLink = 'mailto:' + encodeURIComponent(document.getElementById("publisherRequest").Email.value) +
								'?cc=' + encodeURIComponent(congregationVue.congregation.email) +
								'&subject=' + encodeURIComponent(this.subject()) +
								'&body=' + encodeURIComponent(this.transferMessage());

				await shortWait()

				//document.getElementById("publisherRequest").Name.value = ''
				//document.getElementById("publisherRequest").Email.value = ''
				//allPublishersVue.publisherName = ''

				await shortWait()

				this.auto_grow()

				window.location.href = mailtoLink;
			},
			async sendMail() {
				if (this.mailSubject == '') { 
					alert('Please enter a Subject for the mail')
					return 
				}
				
				var mailtoLink = 'mailto:' + encodeURIComponent(document.getElementById("publisherRequest").Email.value) +
								'?cc=' + encodeURIComponent(congregationVue.congregation.email) +
								'&subject=' + encodeURIComponent(this.mailSubject) +
								'&body=' + encodeURIComponent(this.mailMessage());

				await shortWait()

				await shortWait()

				this.auto_grow()

				window.location.href = mailtoLink;
			},
			message() {
				return `Dear Brothers,

Please we would like to request the Congregation Publisher record as well as a letter of introduction for [Publisher], who is now residing within our congregation territory and is associating with our congregation.

Your brothers,
${congregationVue.congregation.congregationName} Congregation


`.replace('[Publisher]',this.publisherName)
			},
			transferMessage() {
				var publisher = ''
				var found = allPublishersVue.publishers.filter(elem=>elem.name == this.publisherName)
				if (found.length !== 0) {
					var gender = ''
					if (found[0].gender == 'Male') {
						gender = 'Brother'
					} else {
						gender = 'Sister'
					}
					this.selectedPublisher = found[0]
					publisher = `${gender} ${this.publisherName.split(' ').slice(1).concat([toTitleCase(this.publisherName.split(' ')[0])]).join(' ')}`
				} else {
					publisher = this.publisherName
				}
				return `Dear Brothers,

Please find attached letter of introduction and Congregation Publisher Record card for [Publisher], who is now residing within your congregation territory.

Your brothers,
${congregationVue.congregation.congregationName} Congregation


`.replace('[Publisher]', publisher)
			},
			mailMessage() {
				return `Dear Brothers,

Please find attached letter regarding ${this.letterTitle}.

Your brothers,
${this.closing}


`
			},
			publisherNameValue() {
				//var publisher
				var found = allPublishersVue.publishers.filter(elem=>elem.name == this.publisherName)
				var gender = ''
				if (found.length !== 0) {
					if (found[0].gender == 'Male') {
						gender = 'Brother '
					} else {
						gender = 'Sister '
					}
					this.selectedPublisher = found[0]
					var surfix = '';
					if (this.publisherName.includes(' Jnr')) {
						surfix = ' Jnr'
					} else if (this.publisherName.includes(' Snr')) {
						surfix = ' Snr'
					}
					return `${gender}${this.publisherName.replace(' Jnr', '').replace(' Snr', '').split(' ').slice(1).concat([toTitleCase(this.publisherName.replace(' Jnr', '').replace(' Snr', '').split(' ')[0])]).join(' ')}${surfix}`
				} else {
					return this.publisherName
				}
			},
			subject() {
				
				if (this.publisherName == '') {
					return `Letter of Introduction and Publisher Record for 
`
				} else {
					if (document.getElementById("publisherRequest").Name) {
						return 'Letter of Introduction and Publisher Record for ' + this.publisherName
					} else {
						var publisher = ''
						var found = allPublishersVue.publishers.filter(elem=>elem.name == this.publisherName)
						if (found.length !== 0) {
							var gender = ''
							if (found[0].gender == 'Male') {
								gender = 'Brother '
							} else {
								gender = 'Sister '
							}
							this.selectedPublisher = found[0]
							var surfix = '';
							if (this.publisherName.includes(' Jnr')) {
								surfix = ' Jnr'
							} else if (this.publisherName.includes(' Snr')) {
								surfix = ' Snr'
							}
							publisher = `${gender}${this.publisherName.replace(' Jnr', '').replace(' Snr', '').split(' ').slice(1).concat([toTitleCase(this.publisherName.replace(' Jnr', '').replace(' Snr', '').split(' ')[0])]).join(' ')}${surfix}`
						} else {
							publisher = this.publisherName
						}
						return 'Letter of Introduction and Publisher Record for ' + publisher
					}
				}
			},
			inputMode(currentClass) {
				return currentClass + ' ' + mode.replace('w3-card ','')
			},
			mode() {
				return mode
			},
			checkStatus(report) {
				var lastServiceYearMonths = monthlyReportVue.months.map((element) => ({
                    ...element,
                    serviceYear: 'lastServiceYear',
                }));
				var currentServiceYearMonths = monthlyReportVue.months.map((element) => ({
                    ...element,
                    serviceYear: 'currentServiceYear',
                }));
				var lastSixMonths = lastServiceYearMonths.concat(currentServiceYearMonths.slice(0, currentServiceYearMonths.findIndex(elem=>elem.abbr == monthlyReportVue.month.abbr) + 1)).slice(-6)
				var activeMonths = []
				lastSixMonths.forEach(elem=>{
					activeMonths.push(report[`${elem.serviceYear}`][`${elem.abbr}`].sharedInMinistry)
				})
				if (activeMonths.findIndex(elem=>elem == true) == -1) {
					return "Inactive"
				} else {
					return "Active"
				}
			},
            publisherDetail(publisher, item) {
                if (item.parentNode.classList.value.includes('main')) {
                    item.parentNode.parentNode.querySelector('.main').style.display = 'none'
                    item.parentNode.parentNode.querySelector('.detail').style.display = ''
                } else {
					if (item.parentNode.parentNode.querySelector('.name').innerHTML.trim() == '' || item.parentNode.parentNode.querySelector('.name').innerHTML.trim().replaceAll('&nbsp;','').replaceAll('nbsp;','').replaceAll('&amp;','').replaceAll(' ','') == '') {
						alert("Please enter Publisher Name")
						return
					}
					if (publisher.name !== item.parentNode.parentNode.querySelector('.name').innerHTML) {
						DBWorker.postMessage({ storeName: 'data', action: "deleteItem", value: publisher.name});
					}
                    publisher.name = item.parentNode.parentNode.querySelector('.name').innerHTML
                    if (item.parentNode.parentNode.querySelector('.dateOfBirth').value) {
                        publisher.dateOfBirth = item.parentNode.parentNode.querySelector('.dateOfBirth').value
                    }
                    if (item.parentNode.parentNode.querySelector('.dateOfBaptism').value) {
                        publisher.dateOfBaptism = item.parentNode.parentNode.querySelector('.dateOfBaptism').value
                    }
                    publisher.gender = item.parentNode.parentNode.querySelector('.gender').value
                    publisher.hope = item.parentNode.parentNode.querySelector('.hope').value
                    publisher.fieldServiceGroup = item.parentNode.parentNode.querySelector('.fieldServiceGroup').value
                    
                    var allPrivileges = []

                    item.parentNode.parentNode.parentNode.querySelectorAll('.privileges').forEach(elem=>{
                        if (elem.checked) {
                            allPrivileges.push(elem.name)
                        }
                    })

                    allPrivileges.sort()

                    publisher.privilege = allPrivileges
					if (item.parentNode.parentNode.parentNode.querySelector('.reactivated')) {
						if (item.parentNode.parentNode.parentNode.querySelector('.reactivated').checked) {
                            publisher.reactivated = true
                        } else {
							publisher.reactivated = false
							delete publisher.reactivated
						}
					}

                    this.months.forEach(elem=>{
                        const currentItem = item.parentNode.parentNode.querySelector(`.${elem.abbr}`)
                        if (currentItem.querySelector('.hours').innerHTML !== '') {
                            publisher.report.currentServiceYear[elem.abbr].hours = Number(currentItem.querySelector('.hours').innerHTML)
                        } else {
                            publisher.report.currentServiceYear[elem.abbr].hours = null
                        }
                        if (currentItem.querySelector('.bibleStudies').innerHTML !== '') {
                            publisher.report.currentServiceYear[elem.abbr].bibleStudies = Number(currentItem.querySelector('.bibleStudies').innerHTML)
                        } else {
                            publisher.report.currentServiceYear[elem.abbr].bibleStudies = null
                        }
                        if (currentItem.querySelector('.remarks').innerHTML !== '') {
                            publisher.report.currentServiceYear[elem.abbr].remarks = Number(currentItem.querySelector('.remarks').innerHTML)
                        } else {
                            publisher.report.currentServiceYear[elem.abbr].remarks = null
                        }
                        if (currentItem.querySelector('.sharedInMinistry').checked) {
                            publisher.report.currentServiceYear[elem.abbr].sharedInMinistry = currentItem.querySelector('.sharedInMinistry').checked
                        } else {
                            publisher.report.currentServiceYear[elem.abbr].sharedInMinistry = null
                        }
                        if (currentItem.querySelector('.auxiliaryPioneer').checked) {
                            publisher.report.currentServiceYear[elem.abbr].auxiliaryPioneer = currentItem.querySelector('.auxiliaryPioneer').checked
                        } else {
                            publisher.report.currentServiceYear[elem.abbr].auxiliaryPioneer = null
                        }
                        //console.log(currentItem.querySelector('.sharedInMinistry').checked)
                        //console.log(currentItem.querySelector('.hours'))
                    })

                    //console.log(publisher)
                    
                    item.parentNode.parentNode.parentNode.querySelector('.detail').style.display = 'none'
                    item.parentNode.parentNode.parentNode.querySelector('.main').style.display = ''
                    DBWorker.postMessage({ storeName: 'data', action: "save", value: [publisher]});
                }
			},          
			cleanDate(date) {
                const currentDate = new Date(date);

                const formattedDate = `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1).toString().padStart(2, '0')}-${currentDate.getDate().toString().padStart(2, '0')}`;
				
                return formattedDate
            },
			formatDateToFull() {
				const options = { year: 'numeric', month: 'long', day: 'numeric' };
				const formattedDate = new Date().toLocaleDateString('en-US', options);
				return formattedDate
            },
            async removePublisher(count, name, item) {
                if (confirm('Are you sure you want to delete "' + name + '" records?\nPress "OK" to Delete')) {
					item.parentNode.parentNode.parentNode.querySelector('.detail').style.display = 'none'
					item.parentNode.parentNode.parentNode.querySelector('.main').style.display = ''
					//this.publishers.splice(count, 1)
					DBWorker.postMessage({ storeName: 'data', action: "deleteItem", value: name});
					await shortWait()
					await shortWait()
					DBWorker.postMessage({ storeName: 'data', action: "readAll"});
				}
            },
            sumHours(publisher) {
                var totalHours = 0
                this.months.forEach(elem=>{
                    const value = publisher.report.currentServiceYear[elem.abbr].hours
                    if (value !== null) {
                        totalHours = totalHours + value
                    }
                })
                return totalHours
            }
        }
    })
}

function toTitleCase(str) {
	return str.toLowerCase().replace(/(?:^|\s)\w/g, function(match) {
	  	return match.toUpperCase();
	});
}

function addRecord(event) {
	var element = event.parentNode.parentNode
	var clonedElement = element.cloneNode(true);

	if (!element.querySelector('.fa-minus')) {
		if (element.querySelector('.fieldServiceGroups')) {
			clonedElement.insertAdjacentHTML('beforeend', `<span style="margin-left:2px;height:40px;;padding:0" title="Remove Group" class="w3-button w3-black">
	<i style="color:#b02c07;padding:13px" onclick="removeRecord(this)" class="fa fa-minus"></i>
</span>`);
		} else {
			clonedElement.insertAdjacentHTML('beforeend', `<span style="margin-left:2px;height:40px;;padding:0" title="Remove Publisher" class="w3-button w3-black">
	<i style="color:#b02c07;padding:13px" onclick="removeRecord(this)" class="fa fa-minus"></i>
</span>`);
		}
	}

	if (element.querySelector('.fieldServiceGroups')) {
		saveConfiguration()
	}

	element.insertAdjacentElement('afterend', clonedElement);
}

function removeRecord(event) {
	event.parentNode.parentNode.remove()
	if (document.querySelector('.fieldServiceGroups')) {
		saveConfiguration()
	}
}


document.querySelector('#allParticipants').innerHTML = `<template>
	<div v-if="display == true">
		<h2 class="w3-center">ALL PARTICIPANTS</h2>
		<div v-for="(category) in regularPioneers">
			<h2 class="w3-center">{{ category.name }}</h2>
			<div class="w3-row-padding w3-grayscale" style="margin-top:4px">
				<div v-for="(publisher, count) in category.value" :key="publisher + '|' + count" v-if="(publisher.fieldServiceGroup == selectedGroup || selectedGroup == 'All Groups') && publisher.name.toLowerCase().includes(searchTerms.toLowerCase())" class="w3-col l2 m4 w3-margin-bottom">
					<div :class="mode()">
						<div class="w3-container main">
							<h5 @click="publisherDetail(publisher, $event.target)">{{ publisher.name }}</h5>
						</div>
						<div class="detail" style="display:none; padding:15px">
							<div style="display:flex; justify-content:space-between">
								<i @click="publisherDetail(publisher, $event.target)" class="fas fa-chevron-left"></i>
							</div>
							<h2 class="name">{{ publisher.name }}</h2>
							<label v-if="!publisher.privilege.includes('Elder') && !publisher.privilege.includes('Ministerial Servant')" :class="inputMode('w3-input')"><input type="checkbox" name="exemplary" :class="inputMode('exemplary')" :checked=publisher.exemplary> Exemplary</label>
							<label>{{ publisher.gender }}</label>
								
							<p>{{ publisher.hope }}</p>
								
							<label v-for="(privilege, index) in publisher.privilege" :key="index" :class="inputMode('w3-input')">{{ privilege }}</label>
							<p>
								<label>Field Service Group:</label>
								<label :class="inputMode('w3-input')">{{ publisher.fieldServiceGroup }}</label>
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>
		<div v-for="(group) in allGroups">
			<h2 class="w3-center">{{ group }}</h2>
			<div class="w3-row-padding w3-grayscale" style="margin-top:4px">
				<div v-for="(publisher, count) in activePublishers" v-if="publisher.fieldServiceGroup == group && (group == selectedGroup || selectedGroup == 'All Groups') && publisher.name.toLowerCase().includes(searchTerms.toLowerCase())" :key="publisher + '|' + count" class="w3-col l2 m4 w3-margin-bottom">
					<div :class="mode()">
						<div class="w3-container main">
							<h5 @click="publisherDetail(publisher, $event.target)">{{ publisher.name }}</h5>
						</div>
						<div class="detail" style="display:none; padding:15px">
							<div style="display:flex; justify-content:space-between">
								<i @click="publisherDetail(publisher, $event.target)" class="fas fa-chevron-left"></i>
							</div>
							<h2 class="name">{{ publisher.name }}</h2>
							<label v-if="!publisher.privilege.includes('Elder') && !publisher.privilege.includes('Ministerial Servant')" :class="inputMode('w3-input')"><input type="checkbox" name="exemplary" :class="inputMode('exemplary')" :checked=publisher.exemplary> Exemplary</label>
							<label>{{ publisher.gender }}</label>
								
							<p>{{ publisher.hope }}</p>
								
							<label v-for="(privilege, index) in publisher.privilege" :key="index" :class="inputMode('w3-input')">{{ privilege }}</label>
							<p>
								<label>Field Service Group:</label>
								<label :class="inputMode('w3-input')">{{ publisher.fieldServiceGroup }}</label>
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>
		<h2 class="w3-center">Enrolments</h2>
		<div class="w3-row-padding w3-grayscale" style="margin-top:4px">
			<div v-for="(publisher, count) in enrolments" :key="publisher + '|' + count" v-if="publisher.name.toLowerCase().includes(searchTerms.toLowerCase())" class="w3-col l2 m4 w3-margin-bottom">
				<div :class="mode()">
					<div class="w3-container main">
						<h5 @click="publisherDetail(publisher, $event.target)">{{ publisher.name }}</h5>
					</div>
					<div class="detail" style="display:none; padding:15px">
						<div style="display:flex; justify-content:space-between">
							<i @click="publisherDetail(publisher, $event.target)" class="fas fa-chevron-left"></i>
							<i @click="removePublisher(count, publisher.name, $event.target)" class="fas fa-trash-alt"></i>
						</div>
						<h2 contenteditable="true" class="name">{{ publisher.name }}</h2>
						<p>
							<select :class="inputMode('gender w3-input')" :v-model="publisher.gender">
								<option v-if="publisher.gender !== 'Male' && publisher.gender !== 'Female'" value="">Select Gender</option>
								<option v-if="publisher.gender == 'Male' || publisher.gender == 'Female'" :value="publisher.gender">{{ publisher.gender }}</option>
								<option v-for="gender in ['Male', 'Female'].filter(elem=>elem !== publisher.gender)" :value="gender">{{ gender }}</option>
							</select>
						</p>
					</div>
				</div>
			</div>
		</div>
	</div>
    </div>
</template>`
//(group == 'Pioneers' && publisher.privilege.some(item => privileges.slice(-3).includes(item)))
function processAllParticipants() {

    allParticipantsVue = new Vue({
        el: document.querySelector('#allParticipants'),
        data: {
			display: false,
			pdfFile: '',
            categories: [],
			enrolments: [],
        },
        computed: {
			publishers() {
                return allPublishersVue.publishers.filter(elem=>elem.active == true)
            },/*
			enrolments() {
                return allParticipantsVue.lifeAndMinistry.enrolments
            },*/
			searchTerms() {
                return navigationVue.searchTerms
            },
			selectedGroup() {
                return navigationVue.fieldServiceGroup
            },
			allGroups() {
				return navigationVue.allGroups
            },
			regularPioneers() {
				var categories = [{"name": "Pioneers","value": this.publishers.filter(elem=>elem.privilege.includes("Regular Pioneer"))}]
				return categories
			},
			activePublishers() {
				return this.publishers.filter(elem=>!elem.privilege.includes("Regular Pioneer") && elem.active == true)
			},
			inactivePublishers() {
				return this.publishers.filter(elem=>elem.active !== true)
			},
        },
        methods: {
			currentProfile() {
				return configurationVue.reportEntry
			},
			buttonMode(currentClass) {
				return currentClass + ' ' + mode.replace('w3-card ','').replace('white','light-grey').replace('black','dark-grey')
			},
			searchMode() {
				return mode.replace('w3-card','w3-border')
			},
			inputMode(currentClass) {
				return currentClass + ' ' + mode.replace('w3-card ','')
			},
			mode() {
				return mode
			},
            publisherDetail(publisher, item) {
				//console.log(publisher, item)
				if (item.parentNode.classList.value.includes('main')) {
                    item.parentNode.parentNode.querySelector('.main').style.display = 'none'
                    item.parentNode.parentNode.querySelector('.detail').style.display = ''
                } else {
					if (item.parentNode.parentNode.querySelector('.name').innerHTML.trim() == '' || item.parentNode.parentNode.querySelector('.name').innerHTML.trim().replaceAll('&nbsp;','').replaceAll('nbsp;','').replaceAll('&amp;','').replaceAll(' ','') == '') {
						alert("Please enter Name")
						return
					}

					if (publisher.active) {
						if (item.parentNode.parentNode.parentNode.querySelector('.exemplary')) {
							if (item.parentNode.parentNode.parentNode.querySelector('.exemplary').checked) {
								publisher.exemplary = true
							} else {
								publisher.exemplary = false
								delete publisher.exemplary
							}
						}
						DBWorker.postMessage({ storeName: 'data', action: "save", value: [publisher]});
						item.parentNode.parentNode.parentNode.querySelector('.detail').style.display = 'none'
                    	item.parentNode.parentNode.parentNode.querySelector('.main').style.display = ''
						return
					}
					
                    if (publisher.name !== item.parentNode.parentNode.querySelector('.name').innerHTML) {
						DBWorker.postMessage({ storeName: 'lifeAndMinistryEnrolments', action: "deleteItem", value: publisher.name});
					}
                    publisher.name = item.parentNode.parentNode.querySelector('.name').innerHTML
                    publisher.gender = item.parentNode.parentNode.querySelector('.gender').value
					
                    item.parentNode.parentNode.parentNode.querySelector('.detail').style.display = 'none'
                    item.parentNode.parentNode.parentNode.querySelector('.main').style.display = ''
                    DBWorker.postMessage({ storeName: 'lifeAndMinistryEnrolments', action: "save", value: allParticipantsVue.enrolments});
                }
			},          
			cleanDate(date) {
                const currentDate = new Date(date);

                const formattedDate = `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1).toString().padStart(2, '0')}-${currentDate.getDate().toString().padStart(2, '0')}`;
				
                return formattedDate
            },
			formatDateToFull() {
				const options = { year: 'numeric', month: 'long', day: 'numeric' };
				const formattedDate = new Date().toLocaleDateString('en-US', options);
				return formattedDate
            },
            removePublisher(count, name, item) {
                if (confirm('Are you sure you want to delete "' + name + '" records?\nPress "OK" to Delete')) {
					item.parentNode.parentNode.parentNode.querySelector('.detail').style.display = 'none'
					item.parentNode.parentNode.parentNode.querySelector('.main').style.display = ''
					this.enrolments.splice(count, 1)
					DBWorker.postMessage({ storeName: 'lifeAndMinistryEnrolments', action: "deleteItem", value: name});
				}
            }
        }
    })
}


document.querySelector('#fieldServiceGroups').innerHTML = `<template>
	<div v-if="display == true" :class="mode()">
		<h2 class="w3-center">FIELD SERVICE GROUPS {{ active !== true ? '' : '(ALL)'}}</h2>		
		<div style="display:flex;flex-wrap:wrap">
			<div v-for="(group) in allGroups" :key="group" class="element" align="center" style="padding: 10px;margin: 5px;border: 1px solid gray">
				<h3 class="w3-center" style="margin:0;">{{ group }}</h3>
				<table>
					<thead>
						<tr>
							<th>S/No</th>
							<th>Publishers</th>
						</tr>
					</thead>
					<tbody>
						<tr v-for="(publisher, count) in groupPublishers(group)" :key="publisher + '|' + count" style="cursor:pointer" v-if="(publisher.fieldServiceGroup == selectedGroup || selectedGroup == 'All Groups') && publisher.name.toLowerCase().includes(searchTerms.toLowerCase())">
							<td>{{ count + 1 }}</td>
							<td>{{ publisher.name }}</td>
						</tr>
					</tbody>	
				<table>
			</div>
		</div>
	</div>
</template>`

function processFieldServiceGroups() {

    fieldServiceGroupsVue = new Vue({
        el: document.querySelector('#fieldServiceGroups'),
        data: {
            publishers: [],
            display: false,
            pdfFile: "",
            active: true,
			selectedPublisher: {},
        },
        computed: {
            searchTerms() {
                return navigationVue.searchTerms
            },
			allGroups() {
                return allPublishersVue.allGroups
            },
			selectedGroup() {
                return navigationVue.fieldServiceGroup
            },
        },
        methods: {
			mode() {
				return mode.replace('w3-card ','')
			},
			groupPublishers(group) {
                return allPublishersVue.publishers.filter(elem=>elem.fieldServiceGroup == group && (elem.active == true || this.active == true))
            },
			publisherDetail(publisher) {
				this.selectedPublisher = publisher
                //fillPublisherRecord(publisher)
			},
            inactive() {
				this.active = !this.active;
			},
        }
    })
}

document.querySelector('#cards').innerHTML = `<template>
	<div v-if="display == true" :class="mode()">
		<h2 class="w3-center">CARDS</h2>
		<p style="margin:5px;display:flex;flex-wrap:wrap">
			<select v-model="currentCard" class="w3-input" style="width:150px; margin-right:10px; margin-bottom:10px" @change="loadFile()">
				<option v-for="(period, count) in ['Current', 'Last']" :value="period">{{ period }}</option>
			</select>
			<select v-model="currentPublisher" class="w3-input" style="width:240px; margin-right:10px; margin-bottom:10px" @change="loadFile()">
				<option v-for="(publisher, count) in allPublishers()" :value="publisher.name">{{ publisher.name }}</option>
			</select>
			<div style="margin:5px;display:none" id="cardProcessStatus"></div>
		</p>
		<div style="margin:0 5px 10px;">
			<button v-if="allFiles().filter(elem=>elem.name == currentCard + ' Record Card - ' + currentPublisher).length !== 0" class="w3-button w3-black download-button" style="margin: 10px 2px;">
				<a :href="currentPath" style="text-decoration:none" :download="currentCard + ' Record Card - ' + currentPublisher">
					<i class="fas fa-download"></i>
				</a>
			</button>
			<button v-if="currentPublisher !== '' && currentCard !== '' && allFiles().filter(elem=>elem.name == currentCard + ' Record Card - ' + currentPublisher).length == 0" @click="uploadRecord()" class="w3-button w3-black download-button" style="margin:10px 2px;transform: rotate(180deg)" id="upload">
				<i class="fas fa-download"></i>
			</button>
			<button v-if="currentPublisher !== '' && currentCard !== '' && allFiles().filter(elem=>elem.name == currentCard + ' Record Card - ' + currentPublisher).length !== 0" @click="uploadRecord()" class="w3-button w3-black download-button" style="margin:10px 2px;" id="update">
				<i class="fas fa-sync"></i>
			</button>
			<!--button v-if="(Number(currentCard.split('-')[1]) - 1 == 1 || Number(currentCard.split('-')[1]) - 1 == 4 || Number(currentCard.split('-')[1]) - 1 == 7 || Number(currentCard.split('-')[1]) - 1 == 10)" @click="downloadZip()" class="w3-button w3-black download-button" style="margin:10px 2px;" id="download">
				<i class="fas fa-paper-plane"></i>
			</button-->
			<iframe v-if="allFiles().filter(elem=>elem.name == currentCard + ' Record Card - ' + currentPublisher).length !== 0 && allFiles().filter(elem=>elem.name == currentCard + ' Record Card - ' + currentPublisher)[0].value.type.toLowerCase().endsWith('/pdf')" height="600px" width="100%" :src="currentPath" class="fileViewer"></iframe>
			<img v-if="allFiles().filter(elem=>elem.name == currentCard + ' Record Card - ' + currentPublisher).length !== 0 && !allFiles().filter(elem=>elem.name == currentCard + ' Record Card - ' + currentPublisher)[0].value.type.toLowerCase().endsWith('/pdf')" width="100%" :src="currentPath" class="fileViewer">
		</div>
		<input @change="saveFile()" type="file" id="pdfFile" accept=".pdf,.jpg,.jpeg,.png" style="display:none">
	</div>
</template>`

function processCards() {

    cardsVue = new Vue({
        el: document.querySelector('#cards'),
        data: {
            publishers: [],
            display: false,
            pdfFile: "",
            currentCard: "",
            currentPublisher: "",
            currentPath: "",
			active: true,
			card: false,
			selectedPublisher: {},
        },
        computed: {
            searchTerms() {
                return navigationVue.searchTerms
            },
			allGroups() {
                return allPublishersVue.allGroups
            },
			selectedGroup() {
                return navigationVue.fieldServiceGroup
            },
        },
        methods: {
			mode() {
				return mode.replace('w3-card ','')
			},
			allPublishers() {
				return allPublishersVue.publishers.filter(elem=>(elem.fieldServiceGroup == this.selectedGroup || this.selectedGroup == 'All Groups') && elem.name.toLowerCase().includes(this.searchTerms.toLowerCase()))
			},
			groupPublishers(group) {
                return allPublishersVue.publishers.filter(elem=>elem.fieldServiceGroup == group && (elem.active == true || this.active == true))
            },
			publisherDetail(publisher) {
				this.selectedPublisher = publisher
                //fillPublisherRecord(publisher)
			},
            inactive() {
				this.active = !this.active;
			},
			loadFile() {
				const currentFile = this.allFiles().filter(elem=>elem.name == `${this.currentCard} Record Card - ${this.currentPublisher}`)
				if (currentFile.length !== 0) {
					this.currentPath = URL.createObjectURL(currentFile[0].value);
				}
			},
			allFiles() {
				return myFiles.filter(elem=>elem.name.includes('Record Card - ')).map(obj => ({
					...obj,
					file: obj.name.split(' - ')[0],
					month: obj.name.split(' - ')[1]
				})
				)
			},
			uploadRecord() {
				document.querySelector('#pdfFile').click()
			},
			async saveFile() {
				if (document.getElementById('pdfFile').files[0]) {
					if (document.getElementById('pdfFile').files[0].type !== "application/pdf") {
						await convertImageToPdf(`${this.currentCard} Record Card - ${this.currentPublisher}`)
					} else {
						DBWorker.postMessage({ storeName: 'files', action: "save", value: [{name: `${this.currentCard} Record Card - ${this.currentPublisher}`, value: document.getElementById('pdfFile').files[0]}]});
						await shortWait()
						await shortWait()
						DBWorker.postMessage({ storeName: 'files', action: "readAll"});
					}
				}
			},
        }
    })
}

document.querySelector('#entry').innerHTML = `<template>
	<div v-if="display == true">
		<h2 class="w3-center">ENTRY</h2>
		<p style="margin:5px 2px;">
			<div v-for="(action, count) in allActions" :class="modeButton()" style="margin:5px 2px" @click="newTransaction(action.code, action.description)">{{ action.name }}</div>
		</p>
		
		<div :class="mode()" style="margin:5px 0; width: 100%; max-width: 360px; padding:10px 0">
			<div class="w3-container main">
				<input type="date" v-model="currentDate"><input v-model="transactionCode" style="margin:5px; width: 60px;" placeholder="Code">
				<span style="display:none" @click="deleteItem()" class="w3-button w3-light-grey" id="delete"><i class="fas fa-trash-alt"></i></span>
				<textarea type="text" style="width: 300px; margin-top:5px" placeholder="Transaction Description" v-model="transactionDescription"></textarea>
				<select v-if="showAccount" v-model="account" class="w3-input" style="margin-buttom:10px;">
					<option value="RECEIPTS">RECEIPTS</option>
					<option value="PRIMARY ACCOUNT">PRIMARY ACCOUNT</option>
					<option value="SECONDARY ACCOUNT">SECONDARY ACCOUNT</option>
				</select>
				<div style="margin-top:10px;display:flex">
					<input type="number" style="width: 150px;margin-right:10px" placeholder="Amount" v-model="amount" class="w3-input">
					<span @click="addTransaction($event.target)" class="w3-button w3-light-grey" id="add"><i class="fas fa-save"></i></span>
					<span style="margin-right:5px;display:none" @click="saveEdit($event.target)" class="w3-button w3-light-grey" id="save"><i class="fas fa-save"></i></span>
					<span style="display:none" @click="cancelEdit()" class="w3-button w3-light-grey" id="cancel"><i class="fas fa-times"></i></span>
				</div>
			</div>
		</div>

		<h2 class="w3-center">DETAILS</h2>
		<p style="margin:10px 0; width:250px;display:flex">
			<select v-model="currentMonth" class="w3-input" style="width:150px">
				<option v-for="(entry, count) in monthlyRecords()" :value="entry.month">{{ cleanMonth(entry.month) }}</option>
			</select>
		</p>
		<button v-if="currentMonth !== ''" class="w3-button w3-black" style="margin: 10px 0;" @click="fileRecord()" id="file">
			<i class="fas fa-save"></i>
		</button>

		<div v-if="currentMonth !== ''" :class="mode()" style="margin:5px 0; width: 100%; padding:10px 0">
			<div class="w3-container main">
				<div style="overflow-x: scroll;">
					<table style="margin-bottom:0;margin-top:0">
						<tr>
							<th style="text-align:center" rowspan="2">DATE</th>
							<th style="text-align:center" rowspan="2">TRANSACTION DESCRIPTION</th>
							<th style="text-align:center" rowspan="2">TC</th>
							<th style="text-align:center" colspan="2">RECEIPTS</th>						
							<th style="text-align:center" colspan="2">PRIMARY ACCOUNT</th>
							<th style="text-align:center" colspan="2">SECONDARY ACCOUNT</th>
						</tr>
						<tr>
							<th style="text-align:center">IN</th>
							<th style="text-align:center">OUT</th>				
							<th style="text-align:center">IN</th>
							<th style="text-align:center">OUT</th>				
							<th style="text-align:center">IN</th>
							<th style="text-align:center">OUT</th>			
						</tr>
						<tr v-for="transaction in monthlyRecords().filter(elem=>elem.month == currentMonth)[0].entries.filter(elem=>elem.transactionCode !== 'BF' && elem.transactionCode !== 'BS' && elem.transactionCode !== 'PD' && elem.transactionCode !== 'PC' && elem.transactionCode !== 'KH' && elem.transactionCode !== 'RW' && elem.transactionCode !== 'TF' && elem.transactionCode !== 'TD')" @dblclick="editTransaction(transaction)">
							<td style="text-align:center">{{ transaction.date.split('-')[2] }}</td>
							<td>{{ transaction.transactionDescription }}</td>				
							<td style="text-align:center">{{ transaction.transactionCode }}</td>						
							<td style="text-align:right">{{ transaction.transactionCode == 'C' || transaction.transactionCode == 'W' ? (transaction.amount).toLocaleString().split('.')[0] + '.' + (transaction.amount).toFixed(2).split('.')[1] : ''}}</td>						
							<td style="text-align:right">{{ transaction.transactionCode == 'D' || (transaction.transactionCode == 'E' && transaction.account == 'RECEIPTS') ? (transaction.amount).toLocaleString().split('.')[0] + '.' + (transaction.amount).toFixed(2).split('.')[1] : ''}}</td>						
							<td style="text-align:right">{{ transaction.transactionCode == 'D' ? (transaction.amount).toLocaleString().split('.')[0] + '.' + (transaction.amount).toFixed(2).split('.')[1] : ''}}</td>						
							<td style="text-align:right">{{ transaction.transactionCode == 'E' && transaction.account == 'PRIMARY ACCOUNT' ? (transaction.amount).toLocaleString().split('.')[0] + '.' + (transaction.amount).toFixed(2).split('.')[1] : ''}}</td>						
							<td style="text-align:right">{{ transaction.transactionCode !== 'E' && transaction.account == 'SECONDARY ACCOUNT' ? (transaction.amount).toLocaleString().split('.')[0] + '.' + (transaction.amount).toFixed(2).split('.')[1] : ''}}</td>						
							<td style="text-align:right">{{ transaction.transactionCode == 'E' && transaction.account == 'SECONDARY ACCOUNT' ? (transaction.amount).toLocaleString().split('.')[0] + '.' + (transaction.amount).toFixed(2).split('.')[1] : ''}}</td>				
						</tr>
						<tr @dblclick="editTransaction(monthlyRecords().filter(elem=>elem.month == currentMonth)[0].entries.filter(elem=>elem.transactionCode == 'TD')[0])">
							<td style="text-align:center">{{ lastDay(currentMonth).split(' ')[1].replace(',','') }}</td>
							<td>To Branch Office - ({{ singleAmount('TD') }})</td>				
							<td style="text-align:center"></td>						
							<td style="text-align:right"></td>						
							<td style="text-align:right"></td>
							<td style="text-align:right"></td>						
							<td style="text-align:right">{{ endingBalance(totalContributions('W'), singleAmount('RW'), 0, true) }}</td>
							<td style="text-align:right"></td>						
							<td style="text-align:right"></td>
						</tr>
						<tr v-if="totalContributions('W') !== ''">
							<td style="text-align:center"></td>
							<td>WW (from box) [{{ totalContributions('W') }}]</td>				
							<td style="text-align:center"></td>						
							<td style="text-align:right"></td>						
							<td style="text-align:right"></td>
							<td style="text-align:right"></td>						
							<td style="text-align:right"></td>
							<td style="text-align:right"></td>						
							<td style="text-align:right"></td>
						</tr>
						<tr v-for="transaction in monthlyRecords().filter(elem=>elem.month == currentMonth)[0].entries.filter(elem=>elem.transactionCode == 'RW')" @dblclick="editTransaction(transaction)">
							<td style="text-align:center"></td>
							<td>WW (resolution) [{{ (transaction.amount).toLocaleString().split('.')[0] + '.' + (transaction.amount).toFixed(2).split('.')[1] }}]</td>				
							<td style="text-align:center"></td>
							<td style="text-align:right"></td>
							<td style="text-align:right"></td>
							<td style="text-align:right"></td>						
							<td style="text-align:right"></td>
							<td style="text-align:right"></td>						
							<td style="text-align:right"></td>
						</tr>
						<tr>
							<th style="text-align:center" colspan="3">TOTALS OF ALL COLUMNS</th>
							<th style="text-align:right">{{ receiptInTotal() }}</th>				
							<th style="text-align:right">{{ receiptOutTotal() }}</th>
							<th style="text-align:right">{{ primaryInTotal() }}</th>				
							<th style="text-align:right">{{ primaryOutTotal() }}</th>
							<th style="text-align:right">{{ secondaryInTotal() }}</th>			
							<th style="text-align:right">{{ secondaryOutTotal() }}</th>			
						</tr>
					</table>
				</div>
			</div>
		</div>
		<div v-if="currentMonth !== ''" :class="mode()" style="margin:5px 0; width: 100%; padding:10px 0">
			<div class="w3-container main">
				<h4 style="text-align:center">PRIMARY ACCOUNT RECONCILIATION</h4>
				<h5 style="text-align:center">Date Completed: {{ lastDay(currentMonth) }}</h5>
				<div style="display:flex;flex-wrap:wrap">
					<div style="min-width: 300px">
						<h5 style="text-align:center"><strong>Bank Account</strong></h5>
						<p style="text-align:center">(Use ONLY if an account with a bank or similar<br>
							institution is used as the primary account.)</p>
						<table style="margin-bottom:0;margin-top:0">
							<tr @dblclick="editTransaction(monthlyRecords().filter(elem=>elem.month == currentMonth)[0].entries.filter(elem=>elem.transactionCode == 'BS')[0])">
								<td style="border:none">1.</td>
								<td style="border:none" colspan="3">Ending balance shown on bank statement:</td>
								<td style="border:none; border-bottom: 1px solid brown; text-align:right">{{ singleAmount('BS') }}</td>
							</tr>
							<tr @dblclick="editTransaction(monthlyRecords().filter(elem=>elem.month == currentMonth)[0].entries.filter(elem=>elem.transactionCode == 'PD')[0])">
								<td style="border:none">2.</td>
								<td style="border:none" colspan="3">All deposits recorded on Accounts Sheet but not <br>shown on statement:</td>
								<td style="border:none; border-bottom: 1px solid brown; text-align:right">{{ singleAmount('PD') }}</td>
							</tr>
							<tr @dblclick="editTransaction(monthlyRecords().filter(elem=>elem.month == currentMonth)[0].entries.filter(elem=>elem.transactionCode == 'PC')[0])">
								<td style="border:none">3.</td>
								<td style="border:none" colspan="3">Any bank charges not recorded on Accounts Sheet:</td>
								<td style="border:none; border-bottom: 1px solid brown; text-align:right">{{ singleAmount('PC') }}</td>
							</tr>
							<tr>
								<td style="border:none">4.</td>
								<td style="border:none" colspan="3">Total of lines 1 through 3:</td>
								<td style="border:none; border-bottom: 2px solid brown; text-align:right">{{ bankAccountSum() }}</td>
							</tr>
							<tr>
								<td style="border:none">5.</td>
								<td style="border:none" colspan="3">All checks/electronic transfers recorded on <br>Accounts Sheet not yet paid by bank:</td>
							</tr>
							<tr>
								<td style="border:none"></td>
								<td style="border:none; border-bottom: 1px solid brown;">Check/Confirmation No.</td>
								<td style="border:none"></td>
								<td style="border:none; border-bottom: 1px solid brown; text-align:center">Amount</td>
							</tr>
							<tr v-if="!remittanceMonth(lastDay(currentMonth), singleAmount('TD'))">
								<td style="border:none"></td>
								<td style="border:none; border-bottom: 1px solid brown;">To Branch Office - ({{ singleAmount('TD') }})</td>
								<td style="border:none"></td>
								<td style="border:none; border-bottom: 1px solid brown; text-align:center">{{ endingBalance(totalContributions('W'), singleAmount('RW'), 0, true) }}</td>
							</tr>
							<tr>
								<td style="border:none">6.</td>
								<td style="border:none;" colspan="3">Total of checks/electronic transfers not yet paid by <br>bank [Sum of amounts entered for line 5]:</td>
								<td v-if="!remittanceMonth(lastDay(currentMonth), singleAmount('TD'))" style="border:none; border-bottom: 1px solid brown; text-align:right">{{ endingBalance(totalContributions('W'), singleAmount('RW'), 0, true) }}</td>
							</tr>
							<tr>
								<td style="border:none">7.</td>
								<td style="border:none" colspan="3">Any bank interest not recorded on Accounts Sheet:</td>
								<td style="border:none; border-bottom: 1px solid brown; text-align:right"></td>
							</tr>
							<tr>
								<td style="border:none">8.</td>
								<td style="border:none" colspan="3">All electronic contributions not recorded on <br>Accounts Sheet:</td>
								<td style="border:none; border-bottom: 1px solid brown; text-align:right"></td>
							</tr>
							<tr>
								<td style="border:none">9.</td>
								<td style="border:none" colspan="3">Reconciled bank balance [Subtract lines 6 through 8 <br>from line 4]: </td>
								<td style="border:none; border-bottom: 2px solid brown; text-align:right">{{ bankAccountReconcile(lastDay(currentMonth), singleAmount('TD')) }}</td>
							</tr>
						</table>
						<p style="font-size:80%">(The amount on line 9 should equal the “Primary Account/Ending Balance”<br>figure in the “Accounts Sheet Summary” box.)<p>
					</div>
					<div style="min-width: 300px">
						<h5 style="text-align:center"><strong>Cashbox</strong></h5>
						<p style="text-align:center">(Use ONLY if a cashbox is used as<br>
							the primary account.)</p>
					</div>
				</div>
				<div style="display:flex;flex-wrap:wrap">
					<div style="min-width: 300px; border: 1px solid brown; margin:5px; padding:5px">
						<h5 style="text-align:center"><strong>ACCOUNTS SHEET SUMMARY</strong></h5>
						<p style="text-align:center">For Month Ending: {{ lastDay(currentMonth) }}</p>
						<table style="margin-bottom:0;margin-top:0">
							<tr>
								<th style="border:none" colspan="6">RECEIPTS:</th>
							</tr>
							<tr @dblclick="editTransaction(monthlyRecords().filter(elem=>elem.month == currentMonth)[0].entries.filter(elem=>elem.transactionCode == 'BF' && elem.account == 'RECEIPTS')[0])">
								<td style="border:none"></td>
								<td style="border:none" colspan="2">Balance Forward</td>
								<td style="border:none"></td>
								<td style="border:none; border-bottom: 1px solid brown; text-align:right">{{ openingBalance('RECEIPTS') == '0' ? '0.00' : openingBalance('RECEIPTS') }}</td>
							</tr>
							<tr>
								<td style="border:none"></td>
								<td style="border:none"></td>
								<td style="border:none">IN</td>
								<td style="border:none"></td>
								<td style="border:none; border-bottom: 1px solid brown; text-align:right">{{ receiptInTotal('RECEIPTS') == '0' ? '0.00' : receiptInTotal() }}</td>
							</tr>
							<tr>
								<td style="border:none"></td>
								<td style="border:none"></td>
								<td style="border:none">OUT</td>
								<td style="border:none"></td>
								<td style="border:none; border-bottom: 1px solid brown; text-align:right">{{ receiptOutTotal() }}</td>
							</tr>
							<tr>
								<td style="border:none"></td>
								<td style="border:none"></td>
								<td style="border:none">Ending Balance</td>
								<td style="border:none"></td>
								<td style="border:none"></td>
								<td style="border:none; border-bottom: 1px solid brown; text-align:right">{{ receiptEndingBalance() }}</td>
							</tr>
							<tr>
								<th style="border:none" colspan="6">PRIMARY ACCOUNT:</th>
							</tr>
							<tr @dblclick="editTransaction(monthlyRecords().filter(elem=>elem.month == currentMonth)[0].entries.filter(elem=>elem.transactionCode == 'BF' && elem.account == 'PRIMARY ACCOUNT')[0])">
								<td style="border:none"></td>
								<td style="border:none" colspan="2">Balance Forward</td>
								<td style="border:none"></td>
								<td style="border:none; border-bottom: 1px solid brown; text-align:right">{{ openingBalance('PRIMARY ACCOUNT') == '0' ? '0.00' : openingBalance('PRIMARY ACCOUNT') }}</td>
							</tr>
							<tr>
								<td style="border:none"></td>
								<td style="border:none"></td>
								<td style="border:none">IN</td>
								<td style="border:none"></td>
								<td style="border:none; border-bottom: 1px solid brown; text-align:right">{{ primaryInTotal() }}</td>
							</tr>
							<tr>
								<td style="border:none"></td>
								<td style="border:none"></td>
								<td style="border:none">OUT</td>
								<td style="border:none"></td>
								<td style="border:none; border-bottom: 1px solid brown; text-align:right">{{ primaryOutTotal() }}</td>
							</tr>
							<tr>
								<td style="border:none"></td>
								<td style="border:none"></td>
								<td style="border:none">Ending Balance</td>
								<td style="border:none"></td>
								<td style="border:none"></td>
								<td style="border:none; border-bottom: 1px solid brown; text-align:right">{{ primaryEndingBalance() }}</td>
							</tr>
							<tr>
								<th style="border:none" colspan="6">SECONDARY ACCOUNT:</th>
							</tr>
							<tr @dblclick="editTransaction(monthlyRecords().filter(elem=>elem.month == currentMonth)[0].entries.filter(elem=>elem.transactionCode == 'BF' && elem.account == 'SECONDARY ACCOUNT')[0])">
								<td style="border:none"></td>
								<td style="border:none" colspan="2">Balance Forward</td>
								<td style="border:none"></td>
								<td style="border:none; border-bottom: 1px solid brown; text-align:right">{{ openingBalance('SECONDARY ACCOUNT') }}</td>
							</tr>
							<tr>
								<td style="border:none"></td>
								<td style="border:none"></td>
								<td style="border:none">IN</td>
								<td style="border:none"></td>
								<td style="border:none; border-bottom: 1px solid brown; text-align:right">{{ secondaryInTotal() }}</td>
							</tr>
							<tr>
								<td style="border:none"></td>
								<td style="border:none"></td>
								<td style="border:none">OUT</td>
								<td style="border:none"></td>
								<td style="border:none; border-bottom: 1px solid brown; text-align:right">{{ secondaryOutTotal() }}</td>
							</tr>
							<tr>
								<td style="border:none"></td>
								<td style="border:none"></td>
								<td style="border:none">Ending Balance</td>
								<td style="border:none"></td>
								<td style="border:none"></td>
								<td style="border:none; border-bottom: 1px solid brown; text-align:right">{{ secondaryEndingBalance() }}</td>
							</tr>
							<tr>
								<th style="border:none" colspan="5">TOTAL FUNDS ON HAND <br>AT END OF MONTH</th>
								<td style="border:none; border-bottom: 4px double brown; text-align:right">{{ totalFundsOnHand() }}</td>
							</tr>
						</table>
					</div>
					<div style="min-width: 300px; border: 1px solid brown; margin:5px; padding:5px">
						<h5 style="text-align:center"><strong>SECONDARY ACCOUNT RECONCILIATION</strong></h5>
						<p style="text-align:center">Date Completed:</p>
					</div>
				</div>
			</div>
		</div>

		<div v-if="currentMonth !== ''" :class="mode()" style="margin:5px 0; width: 100%; padding:10px 0">
			<div class="w3-container main">
				<h5 style="text-align:center"><strong>ACCOUNTS REPORT</strong></h5>
				<p style="text-align:center">Month/Year: {{ cleanMonth(currentMonth) }}</p>
				<div>
					<table style="margin-bottom:0;margin-top:0;">
						<tr @dblclick="editTransaction(monthlyRecords().filter(elem=>elem.month == currentMonth)[0].entries.filter(elem=>elem.transactionCode == 'TF')[0])">
							<td style="border:none" colspan="5">Total Funds at Beginning of Month (Bring forward from Figure [i] of preceding month’s report.)</td>
							<td style="border:none; border-bottom: 1px solid brown; text-align:right">{{ singleAmount('TF') }}</td>
						</tr>
						<tr>
							<th style="border:none" colspan="6"><strong>ALL RECEIPTS</strong></th>
						</tr>
						<tr>
							<td style="border:none"></td>
							<th style="border:none" colspan="5">CONGREGATION RECEIPTS</th>
						</tr>
						<tr>
							<td style="border:none"></td>
							<td style="border:none"></td>
							<td style="border:none">Contributions for local congregation (from boxes)</td>
							<td style="border:none; border-bottom: 1px solid brown; text-align:right">{{ totalContributions('C') }}</td>
						</tr>
						<tr>
							<td style="border:none"></td>
							<td style="border:none"></td>
							<td style="border:none">Contributions for local congregation (electronic transfers)</td>
							<td style="border:none; border-bottom: 1px solid brown; text-align:right">{{ totalContributions('CE') }}</td>
						</tr>
						<tr>
							<td style="border:none"></td>
							<td style="border:none"></td>
							<td style="border:none">Total Congregation Receipts</td>
							<td style="border:none"></td>
							<td style="border:none; border-bottom: 1px solid brown; text-align:right">{{ endingBalance(totalContributions('C'), totalContributions('CE'), 0, true) }}</td>
						</tr>
						<tr>
							<td style="border:none"></td>
							<th style="border:none" colspan="5">OTHER RECEIPTS</th>
						</tr>
						<tr>
							<td style="border:none"></td>
							<td style="border:none"></td>
							<td style="border:none">Contributions for worldwide work (from boxes)</td>
							<td style="border:none; border-bottom: 1px solid brown; text-align:right">{{ totalContributions('W') }}</td>
						</tr>
						<tr>
							<td style="border:none"></td>
							<td style="border:none"></td>
							<td style="border:none">Total Other Receipts</td>
							<td style="border:none"></td>
							<td style="border:none; border-bottom: 1px solid brown; text-align:right">{{ totalContributions('W') }}</td>
						</tr>
						<tr>
							<td style="border:none"></td>
							<th style="border:none" colspan="4"><strong>Total Receipts</strong> [(b) + (c)]</th>
							<td style="border:none; border-bottom: 1px solid brown; text-align:right">{{ endingBalance(totalContributions('C'), totalContributions('CE'), totalContributions('W'), true) }}</td>
						</tr>
						<tr>
							<th style="border:none" colspan="6"><strong>ALL DISBURSEMENTS</strong></th>
						</tr>
						<tr>
							<td style="border:none"></td>
							<th style="border:none" colspan="5">CONGREGATION EXPENDITURES</th>
						</tr>
						<tr>
							<td style="border:none"></td>
							<td style="border:none"></td>
							<td style="border:none">Kingdom Hall operating expenses</td>
							<td style="border:none; border-bottom: 1px solid brown; text-align:right">{{ totalContributions('E') }}</td>
						</tr>
						<tr>
							<td style="border:none"></td>
							<td style="border:none"></td>
							<td style="border:none">Resolved monthly donation to worldwide work</td>
							<td style="border:none; border-bottom: 1px solid brown; text-align:right">{{ singleAmount('RW') }}</td>
						</tr>
						<tr>
							<td style="border:none"></td>
							<td style="border:none"></td>
							<td style="border:none">Bank service charge</td>
							<td style="border:none; border-bottom: 1px solid brown; text-align:right">{{ bankCharge() }}</td>
						</tr>
						<tr>
							<td style="border:none"></td>
							<td style="border:none"></td>
							<td style="border:none">Total Congregation Expenditures</td>
							<td style="border:none"></td>
							<td style="border:none; border-bottom: 1px solid brown; text-align:right">{{ endingBalance(totalContributions('E'), singleAmount('RW'), bankCharge(), true) }}</td>
						</tr>
						<tr>
							<td style="border:none"></td>
							<th style="border:none" colspan="5">OTHER DISBURSEMENTS</th>
						</tr>
						<tr>
							<td style="border:none"></td>
							<td style="border:none"></td>
							<td style="border:none">Contributions for worldwide work (from boxes)</td>
							<td style="border:none; border-bottom: 1px solid brown; text-align:right">{{ totalContributions('W') }}</td>
						</tr>
						<tr>
							<td style="border:none"></td>
							<td style="border:none"></td>
							<td style="border:none">Total Other Disbursements </td>
							<td style="border:none"></td>
							<td style="border:none; border-bottom: 1px solid brown; text-align:right">{{ totalContributions('W') }}</td>
						</tr>
						<tr>
							<td style="border:none"></td>
							<th style="border:none" colspan="4"><strong>Total Disbursements</strong> [(e) + (f)]</th>
							<td style="border:none; border-bottom: 1px solid brown; text-align:right">{{ endingBalance(endingBalance(totalContributions('E'), singleAmount('RW'), bankCharge(), true), totalContributions('W'), 0, true) }}</td>
						</tr>
						<tr>
							<td style="border:none" colspan="5">Surplus (Deficit) [(d) – (g)]</td>
							<td style="border:none; border-bottom: 1px solid brown; text-align:right">{{ endingBalance(0, endingBalance(totalContributions('C'), totalContributions('CE'), totalContributions('W'), true), endingBalance(endingBalance(totalContributions('E'), singleAmount('RW'), bankCharge(), true), totalContributions('W'), 0, true)) }}</td>
						</tr>
						<tr>
							<td style="border:none" colspan="5">Total Funds at End of Month [(a) + (h)] (Carry forward to Figure [a] of the next month’s report.)</td>
							<td style="border:none; border-bottom: 1px solid brown; text-align:right">{{ endOfMonth() }}</td>
						</tr>
						<tr>
							<td style="border:none" colspan="5"><strong>AVAILABLE CONGREGATION FUNDS AT END OF MONTH</strong> [(i) – (j)] </td>
							<td style="border:none; border-bottom: 1px solid brown; text-align:right">{{ endOfMonth() }}</td>
						</tr>
					</table>
				</div>
			</div>
		</div>
		<div v-if="currentMonth !== ''" :class="mode()" style="margin:5px 0; width: 100%; padding:10px 0">
			<div class="w3-container main">
				<h5 style="text-align:center"><strong>ACCOUNTS ANNOUNCEMENT</strong></h5>
				<p>A copy of the Monthly Congregation Accounts Report for the month of {{ cleanMonth(currentMonth) }} will 
				be posted on the information board. In summary, the congregation received a total of {{ endingBalance(totalContributions('C'), totalContributions('CE'), 0, true) == '' ? '0,00' : endingBalance(totalContributions('C'), totalContributions('CE'), 0, true) }}.
				Congregation expenditures for the month totaled {{ endingBalance(totalContributions('E'), singleAmount('RW'), bankCharge(), true) }}. The congregation had a month-end
				balance of {{ endOfMonth2() }}. The congregation also forwarded donations from contribution boxes to the
				branch oﬃce in the amount of {{ totalContributions('W') }} for the worldwide work.</p>
			</div>
		</div>
		<div v-if="currentMonth !== ''" :class="mode()" style="margin:5px 0; width: 100%; padding:10px 0">
			<div class="w3-container main">
				<h5 style="text-align:center"><strong>FUNDS TRANSFER</strong></h5>
				<table style="margin-bottom:0;margin-top:0;">
					<tr>
						<th style="border:none" colspan="5"><strong>Donations and Payments</strong></th>
					</tr>
					<tr>
						<td style="border:none"></td>
						<td style="border:none" colspan="3">Worldwide Work (From contribution boxes)</td>
						<td style="border:none; border-bottom: 1px solid brown; text-align:right">{{ totalContributions('W') }}</td>
					</tr>
					<tr>
						<td style="border:none"></td>
						<td style="border:none" colspan="3">Worldwide Work (Resolution)</td>
						<td style="border:none; border-bottom: 1px solid brown; text-align:right">{{ singleAmount('RW') }}</td>
					</tr>
					<tr>
						<td style="border:none"></td>
						<td style="border:none" colspan="3"><strong>Total Donations and Payments:</strong></td>
						<td style="border:none; border-bottom: 1px solid brown; text-align:right">{{ endingBalance(singleAmount('RW'), totalContributions('W'), 0, true) }}</td>
					</tr>
					<tr>
						<td style="border:none"></td>
						<td style="border:none"></td>
						<td style="border:none"></td>
						<td style="border:none"><strong>TOTAL FUNDS BEING SENT:</strong></td>
						<td style="border:none; border-bottom: 1px solid brown; text-align:right">{{ endingBalance(singleAmount('RW'), totalContributions('W'), 0, true) }}</td>
					</tr>
					
				</table>
			</div>
		</div>
				
	</div>
</template>`

function processEntry() {

    entryVue = new Vue({
        el: document.querySelector('#entry'),
        data: {
            publishers: [],
            display: false,
            transactionCode: "",
			transactionDescription: "",
			currentName: "",
			amount: "",
			account: "RECEIPTS",
			showAccount: false,
			editing: false,
			allEntries: [],
			allActions: [
				{"name": "W", "code": "W", "description": "Contribution - Worldwide Work"},
				{"name": "C", "code": "C", "description": "Contribution - Congregation"},
				{"name": "Drinking Water", "code": "E", "description": "Purchase of Drinking Water"},
				{"name": "Internet", "code": "E", "description": "Purchase of Internet Data"},
				{"name": "Tank Water", "code": "E", "description": "Purchase of Water for the Tank"},
				{"name": "Electricity", "code": "E", "description": "Electricity Units"},
				{"name": "Fuel", "code": "E", "description": "Purchase of Fuel for Generator"},
				{"name": "D", "code": "D", "description": "Deposite to Primary Account"},
				{"name": "Balance Forward", "code": "BF", "description": "Balance Forward"},
				{"name": "I", "code": "I", "description": "Interest from Bank Account"},
				{"name": "KH Expences", "code": "KH", "description": "Kingdom Hall operating expenses"},
				{"name": "E", "code": "E", "description": "Local Congregation Expences"},
				{"name": "W - Resolution", "code": "RW", "description": "Resolved monthly donation to worldwide work"},
				{"name": "Transportation", "code": "E", "description": "Transportation to Sussex for Cleaning"},
				{"name": "CE", "code": "CE", "description": "Contribution - Congregation (Electronic)"},
				{"name": "Balance Shown", "code": "BS", "description": "Ending balance shown on bank statement"},
				{"name": "Transfer Date", "code": "TD", "description": "Transfer Date"},
				{"name": "Total Funds", "code": "TF", "description": "Total Funds at Beginning of Month"},
				{"name": "S", "code": "S", "description": "Funds Reserved for Special Purpose"},
				{"name": "Pending Deposits", "code": "PD", "description": "All deposits recorded on Accounts Sheet but not shown on statement"},
				{"name": "Pending Charges", "code": "PC", "description": "Any bank charges not recorded on Accounts Sheet"},
				{"name": "COT", "code": "E", "description": "COT"},
				{"name": "GST on COT", "code": "E", "description": "GST on COT"},
				{"name": "Statement", "code": "E", "description": "Account Statement Fee"},
				{"name": "GST on Statement", "code": "E", "description": "GST on Account Statement"},
			],
			currentMonth: "",
			currentDate: monthlyReportVue.cleanDate(new Date()),
        },
        computed: {/*
            searchTerms() {
                return navigationVue.searchTerms
            },
			allGroups() {
                return allPublishersVue.allGroups
            },
			selectedGroup() {
                return navigationVue.fieldServiceGroup
            },*/
        },
        methods: {
			mode() {
				return mode.replace('w3-card ','')
			},
			modeButton() {
				return mode.replace('w3-card ','w3-button ')
			},
			date() {
                return monthlyReportVue.cleanDate(new Date())
            },
			remittanceMonth(lastDay, remittanceDate) {
				return (
					new Date(lastDay).getFullYear() === new Date(remittanceDate).getFullYear() &&
					new Date(lastDay).getMonth() === new Date(remittanceDate).getMonth()
				);
			},
			endingBalance(forwardAmount, inAmount, outAmount, balance) {
				//console.log(forwardAmount, inAmount, outAmount, balance)
				if (forwardAmount == '') {
					forwardAmount = 0
				} else if (forwardAmount.toString().startsWith('(')) {
					forwardAmount = `-${forwardAmount.toString().replace('(','').replace(')','')}`
				}
				if (inAmount == '') {
					inAmount = 0
				} else if (inAmount.toString().startsWith('(')) {
					inAmount = `-${inAmount.toString().replace('(','').replace(')','')}`
				}
				if (outAmount == '') {
					outAmount = 0
				} else if (outAmount.toString().startsWith('(')) {
					outAmount = `-${outAmount.toString().replace('(','').replace(')','')}`
				}
				var sum
				if (!balance) {
					sum = Number(forwardAmount.toString().replaceAll(',', '')) + Number(inAmount.toString().replaceAll(',', '')) - Number(outAmount.toString().replaceAll(',', ''))
				} else {
					sum = Number(forwardAmount.toString().replaceAll(',', '')) + Number(inAmount.toString().replaceAll(',', '')) + Number(outAmount.toString().replaceAll(',', ''))
				}
				if (sum == 0) {
					return ''
				} else if (sum < 0) {
					return `(${(sum * -1).toLocaleString().split('.')[0]}.${(sum * -1).toFixed(2).split('.')[1]})`
				} else {
					return `${(sum).toLocaleString().split('.')[0]}.${(sum).toFixed(2).split('.')[1]}`
				}
				
			},
			lastDay(value) {
				var lastDay = new Date(`${Number(value.split('-')[1]) == 12 ? allMonths[0] : allMonths[Number(value.split('-')[1])]} 1, ${Number(value.split('-')[1]) == 12 ? Number(value.split('-')[0]) + 1 : value.split('-')[0]}`);

				lastDay.setDate(lastDay.getDate() - 1);
				const options = { year: 'numeric', month: 'long', day: 'numeric' };
				return new Date(lastDay).toLocaleDateString('en-US', options);
			},
			cleanMonth(value) {
				return `${allMonths[Number(value.split('-')[1]) - 1]} ${value.split('-')[0]}`
			},
			allRecords() {
                return this.allEntries.map(obj => ({
					...obj,
					month: obj.date.split('-').slice(0, 2).join('-')
				})
				)
            },
			monthlyRecords() {
                return getUniqueElementsByProperty(this.allRecords(), ['month']).map(obj => ({
					...obj,
					entries: this.allRecords().filter(elem=>elem.month == obj.month)
				})
				)
            },
			columnTotal(value) {
				if (value.length == 0) {
					return ''
				}
				return (value.reduce((accumulator, currentValue) => accumulator + currentValue, 0)).toLocaleString().split('.')[0] + '.' + (value.reduce((accumulator, currentValue) => accumulator + currentValue, 0)).toFixed(2).split('.')[1]
			},
			openingBalance(account) {
				return undefined !== this.monthlyRecords().filter(elem=>elem.month == this.currentMonth)[0].entries.filter(elem=>elem.transactionCode == 'BF' && elem.account == account)[0] ? this.endingBalance(this.monthlyRecords().filter(elem=>elem.month == this.currentMonth)[0].entries.filter(elem=>elem.transactionCode == 'BF' && elem.account == account)[0].amount, 0, 0, true) : ''
			},
			receiptInTotal() {
				return this.columnTotal(this.monthlyRecords().filter(elem=>elem.month == this.currentMonth)[0].entries.filter(elem=>elem.transactionCode == 'C' || elem.transactionCode == 'W').map(elem=>elem.amount))
			},
			receiptOutTotal() {
				return this.columnTotal(this.monthlyRecords().filter(elem=>elem.month == this.currentMonth)[0].entries.filter(elem=>elem.transactionCode == 'D' || (elem.transactionCode == 'E' && elem.account == 'RECEIPTS')).map(elem=>elem.amount))
			},
			receiptEndingBalance() {
				return this.endingBalance(this.openingBalance('RECEIPTS'), this.receiptInTotal(), this.receiptOutTotal())
			},
			primaryInTotal() {
				return this.columnTotal(this.monthlyRecords().filter(elem=>elem.month == this.currentMonth)[0].entries.filter(elem=>elem.transactionCode == 'D').map(elem=>elem.amount))
			},
			primaryOutTotal() {
				return this.endingBalance(Number(this.columnTotal(this.monthlyRecords().filter(elem=>elem.month == this.currentMonth)[0].entries.filter(elem=>elem.transactionCode == 'E' && elem.account == 'PRIMARY ACCOUNT').map(elem=>elem.amount)).toString().replaceAll(',','')) + Number(this.endingBalance(this.totalContributions('W'), this.singleAmount('RW'), 0, true).toString().replaceAll(',','')), 0, 0)
			},
			primaryEndingBalance() {
				return this.endingBalance(this.openingBalance('PRIMARY ACCOUNT'), this.primaryInTotal(), this.primaryOutTotal())
			},
			secondaryInTotal() {
				return this.columnTotal(this.monthlyRecords().filter(elem=>elem.month == this.currentMonth)[0].entries.filter(elem=>elem.transactionCode !== 'E' && elem.account == 'SECONDARY ACCOUNT').map(elem=>elem.amount))
			},
			secondaryOutTotal() {
				return this.columnTotal(this.monthlyRecords().filter(elem=>elem.month == this.currentMonth)[0].entries.filter(elem=>elem.transactionCode == 'E' && elem.account == 'SECONDARY ACCOUNT').map(elem=>elem.amount))
			},
			secondaryEndingBalance() {
				return this.endingBalance(this.openingBalance('SECONDARY ACCOUNT'), this.secondaryInTotal(), this.secondaryOutTotal())
			},
			totalFundsOnHand() {
				var receipt = this.receiptEndingBalance()
				var primary = this.primaryEndingBalance()
				var secondary = this.secondaryEndingBalance()
				const value = this.endingBalance(receipt, primary, secondary, true)
				const nextMonth = getNextMonthFromDate(new Date(this.currentMonth))
				//console.log(getNextMonthFromDate(new Date(this.currentMonth)), value, receipt, primary, secondary)
				if (receipt !== '') {
					if (receipt.toString().startsWith('(')) {
						receipt = `-${receipt.toString().replace('(','').replace(')','')}`
					}
					DBWorker.postMessage({ storeName: 'account', action: "save", value: [{"name":`${nextMonth}_${'BF'}_${'Balance Forward-RECEIPTS'}`, "date": nextMonth, "transactionCode": 'BF', "transactionDescription": "Balance Forward-RECEIPTS", "amount": Number(receipt.toString().replaceAll(',', '')), "account": 'RECEIPTS'}]});
				}

				if (primary !== '') {
					if (primary.toString().startsWith('(')) {
						primary = `-${primary.toString().replace('(','').replace(')','')}`
					}
					DBWorker.postMessage({ storeName: 'account', action: "save", value: [{"name":`${nextMonth}_${'BF'}_${'Balance Forward-PRIMARY ACCOUNT'}`, "date": nextMonth, "transactionCode": 'BF', "transactionDescription": "Balance Forward-PRIMARY ACCOUNT", "amount": Number(primary.toString().replaceAll(',', '')), "account": 'PRIMARY ACCOUNT'}]});
				}

				if (secondary !== '') {
					if (secondary.toString().startsWith('(')) {
						secondary = `-${secondary.toString().replace('(','').replace(')','')}`
					}
					DBWorker.postMessage({ storeName: 'account', action: "save", value: [{"name":`${nextMonth}_${'BF'}_${'Balance Forward-SECONDARY ACCOUNT'}`, "date": nextMonth, "transactionCode": 'BF', "transactionDescription": "Balance Forward-SECONDARY ACCOUNT", "amount": Number(secondary.toString().replaceAll(',', '')), "account": 'SECONDARY ACCOUNT'}]});
				}
				
				return value
			},
			bankAccountSum() {
				return this.endingBalance(this.singleAmount('BS'), this.singleAmount('PD'), this.singleAmount('PC'), true)
			},
			bankAccountReconcile(lastDay, remittanceDate) {
				if (this.remittanceMonth(lastDay, remittanceDate)) {
					return this.endingBalance(0, this.bankAccountSum(), 0)
				}
				return this.endingBalance(0, this.bankAccountSum(), this.endingBalance(this.totalContributions('W'), this.singleAmount('RW'), 0, true))
			},
			totalContributions(code) {
				if (code == 'E') {
					return this.endingBalance(Number(this.columnTotal(this.monthlyRecords().filter(elem=>elem.month == this.currentMonth)[0].entries.filter(elem=>elem.transactionCode == code).map(elem=>elem.amount)).toString().replaceAll(',','')) - Number(this.bankCharge().toString().replaceAll(',','')), 0, 0)
				}
				return this.columnTotal(this.monthlyRecords().filter(elem=>elem.month == this.currentMonth)[0].entries.filter(elem=>elem.transactionCode == code).map(elem=>elem.amount))
			},
			bankCharge() {
				return this.columnTotal(this.monthlyRecords().filter(elem=>elem.month == this.currentMonth)[0].entries.filter(elem=>elem.transactionDescription.includes('COT') || elem.transactionDescription.includes('Account Statement')).map(elem=>elem.amount))
			},
			endOfMonth() {
				return this.endingBalance(this.singleAmount('TF'), this.endingBalance(0, this.endingBalance(this.totalContributions('C'), this.totalContributions('CE'), this.totalContributions('W'), true), this.endingBalance(this.endingBalance(this.totalContributions('E'), this.singleAmount('RW'), this.bankCharge(), true), this.totalContributions('W'), 0, true)), 0)
			},
			endOfMonth2() {
				var value = this.endingBalance(this.singleAmount('TF'), this.endingBalance(0, this.endingBalance(this.totalContributions('C'), this.totalContributions('CE'), this.totalContributions('W'), true), this.endingBalance(this.endingBalance(this.totalContributions('E'), this.singleAmount('RW'), this.bankCharge(), true), this.totalContributions('W'), 0, true)), 0)
				const nextMonth = getNextMonthFromDate(new Date(this.currentMonth))
				if (value !== '') {
					if (value.toString().startsWith('(')) {
						value = `-${value.toString().replace('(','').replace(')','')}`
					}
					DBWorker.postMessage({ storeName: 'account', action: "save", value: [{"name":`${nextMonth}_${'TF'}_${'Total Funds at Beginning of Month'}`, "date": nextMonth, "transactionCode": 'TF', "transactionDescription": "Total Funds at Beginning of Month", "amount": Number(value.toString().replaceAll(',', '')), "account": 'RECEIPTS'}]});
				}
				return value
			},
			singleAmount(code) {
				if (code == 'TD') {
					return this.monthlyRecords().filter(elem=>elem.month == this.currentMonth)[0].entries.filter(elem=>elem.transactionCode == code)[0] ? this.monthlyRecords().filter(elem=>elem.month == this.currentMonth)[0].entries.filter(elem=>elem.transactionCode == code)[0].amount : ''
				}
				return this.monthlyRecords().filter(elem=>elem.month == this.currentMonth)[0].entries.filter(elem=>elem.transactionCode == code)[0] ? this.endingBalance(this.monthlyRecords().filter(elem=>elem.month == this.currentMonth)[0].entries.filter(elem=>elem.transactionCode == code)[0].amount, 0, 0, true) : ''
			},
			newTransaction(code, description) {
				//console.log(code)
				this.transactionCode = code
				this.showAccount = false
				this.amount = ''
				this.transactionDescription = description
				if (code == 'E' || code == 'BF') {
					this.showAccount = true
				}
				if (description == 'COT' || description == 'GST on COT' || description == 'Account Statement Fee' || description == 'GST on Account Statement') {
					this.account = 'PRIMARY ACCOUNT'
				} else {
					this.account = 'RECEIPTS'
				}
			},
			editTransaction(value) {
				console.log(value)
				if (undefined == value) { return }
				document.querySelector('span#add').style.display = 'none'
				document.querySelector('span#save').style.display = ''
				document.querySelector('span#cancel').style.display = ''
				document.querySelector('span#delete').style.display = ''
				document.documentElement.scrollTop = 0;
				
				this.transactionCode = value.transactionCode
				this.transactionDescription = value.transactionDescription
				if (value.transactionCode !== 'TD') {
					this.amount = value.amount
				}
				this.currentName = value.name
				if (value.date == value.month) {
					this.currentDate = value.date + '-01'
				} else {
					this.currentDate = value.date
				}
				if (value.transactionCode == 'E' || value.transactionCode == 'BF') {
					this.showAccount = true
					this.account = value.account
				} else {
					this.showAccount = false
				}
			},
            async addTransaction(element) {
				if (this.transactionCode == '') {
					alert('Please enter a Transaction Code')
					return
				} else if (this.transactionDescription == '') {
					alert('Please enter a Transaction Description')
					return
				} else if (this.amount == '' && this.transactionCode !== 'TD') {
					alert('Please enter an Amount')
					return
				} else if (this.currentDate == '') {
					alert('Please enter a Date')
					return
				}
				document.querySelector('span#add').innerHTML = `<i class="fas fa-check"></i>`
				var account = this.account
				this.account = "RECEIPTS"
				var transactionDate = this.currentDate
				var description = this.transactionDescription
				if (this.transactionCode == 'BF' || this.transactionCode == 'RW' || this.transactionCode == 'TF' || this.transactionCode == 'TD') {
					transactionDate = this.currentDate.split('-').slice(0, 2).join('-')
				} else if (this.transactionCode == 'BS' || this.transactionCode == 'PD' || this.transactionCode == 'PC') {
					transactionDate = this.currentDate.split('-').slice(0, 2).join('-')
					account = "Bank Account"
				}
				var amount = Number(this.amount)
				if (this.transactionCode == 'TD') {
					amount = this.transactionDescription
				}
				if (this.transactionCode == 'BF') {
					description = this.transactionDescription + '-' + account
				}
				DBWorker.postMessage({ storeName: 'account', action: "save", value: [{"name":`${transactionDate}_${this.transactionCode}_${description}`, "date": transactionDate, "transactionCode": this.transactionCode, "transactionDescription": this.transactionDescription, "amount": amount, "account": account}]});
				await shortWait()
				await shortWait()
				//await shortWait()
				document.querySelector('span#add').innerHTML = `<i class="fas fa-save"></i>`
				await shortWait()
				await shortWait()
				DBWorker.postMessage({ storeName: 'account', action: "readAll"});
			},
            async saveEdit(element) {
				document.querySelector('span#add').style.display = ''
				document.querySelector('span#save').style.display = 'none'
				document.querySelector('span#cancel').style.display = 'none'
				document.querySelector('span#delete').style.display = 'none'

				if (this.transactionCode == '') {
					alert('Please enter a Transaction Code')
					return
				} else if (this.transactionDescription == '') {
					alert('Please enter a Transaction Description')
					return
				} else if (this.amount == '' && this.transactionCode !== 'TD') {
					alert('Please enter an Amount')
					return
				} else if (this.currentDate == '') {
					alert('Please enter a Date')
					return
				}
				document.querySelector('span#add').innerHTML = `<i class="fas fa-check"></i>`
				var account = this.account
				this.account = "RECEIPTS"
				var transactionDate = this.currentDate
				var description = this.transactionDescription
				if (this.transactionCode == 'BF' || this.transactionCode == 'RW' || this.transactionCode == 'TF' || this.transactionCode == 'TD') {
					transactionDate = this.currentDate.split('-').slice(0, 2).join('-')
				} else if (this.transactionCode == 'BS' || this.transactionCode == 'PD' || this.transactionCode == 'PC') {
					transactionDate = this.currentDate.split('-').slice(0, 2).join('-')
					account = "Bank Account"
				}
				var amount = Number(this.amount)
				if (this.transactionCode == 'TD') {
					amount = this.transactionDescription
				}
				if (this.transactionCode == 'BF') {
					description = this.transactionDescription + '-' + account
				}
				if (entryVue.currentName !== `${transactionDate}_${this.transactionCode}_${description}`) {
					DBWorker.postMessage({ storeName: 'account', action: "deleteItem", value: entryVue.currentName});
					await shortWait()
					await shortWait()
				}
				DBWorker.postMessage({ storeName: 'account', action: "save", value: [{"name":`${transactionDate}_${this.transactionCode}_${description}`, "date": transactionDate, "transactionCode": this.transactionCode, "transactionDescription": this.transactionDescription, "amount": amount, "account": account}]});
				await shortWait()
				await shortWait()
				//await shortWait()
				document.querySelector('span#add').innerHTML = `<i class="fas fa-save"></i>`
				await shortWait()
				await shortWait()
				DBWorker.postMessage({ storeName: 'account', action: "readAll"});
				entryVue.currentName = ''
			},
            cancelEdit() {
				document.querySelector('span#add').style.display = ''
				document.querySelector('span#save').style.display = 'none'
				document.querySelector('span#cancel').style.display = 'none'
				document.querySelector('span#delete').style.display = 'none'
				entryVue.currentName = ''
			},
			async deleteItem() {
				DBWorker.postMessage({ storeName: 'account', action: "deleteItem", value: entryVue.currentName});
				await shortWait()
				await shortWait()
				DBWorker.postMessage({ storeName: 'account', action: "readAll"});
				this.cancelEdit()
			},
			async fileRecord() {
				console.log('Shelf Record')
				await fillAccountSheet()
			}
        }
    })
}

// Function to get the next month from a given date
function getNextMonthFromDate(date) {
	// Get the month of the given date (0-indexed, so January is 0)
	var currentMonth = date.getMonth();

	// Increment the month by 1 to get the next month
	var nextMonth = (currentMonth + 1) % 12; // Using modulo operator to handle December (12 % 12 = 0)

	// Get the year of the given date
	var currentYear = date.getFullYear();

	// If next month is January, increment the year
	if (nextMonth === 0) {
		currentYear++;
	}

	// Create a new date object for the next month
	var nextMonthDate = new Date(currentYear, nextMonth);
	
	return `${currentYear}-${(nextMonth + 1).toString().padStart(2, '0')}`;
}

document.querySelector('#file').innerHTML = `<template>
	<div v-if="display == true">
		<h2 class="w3-center">CURRENT FILE</h2>
		<p style="margin:5px;display:flex;flex-wrap:wrap">
			<select v-model="currentMonth" class="w3-input" style="width:150px; margin-right:10px; margin-bottom:10px" @change="loadFile()">
				<option v-for="(entry, count) in months()" :value="cleanMonth(entry)">{{ entry }}</option>
			</select>
			<select v-model="currentFile" class="w3-input" style="width:240px; margin-right:10px; margin-bottom:10px" @change="loadFile()">
				<option v-for="(entry, count) in individualFiles()" :value="entry">{{ entry }}</option>
			</select>			
		</p>
		<div style="margin:0 5px 10px;">
			<button v-if="allFiles().filter(elem=>elem.name == currentFile + ' - ' + currentMonth).length !== 0" class="w3-button w3-black download-button" style="margin: 10px 2px;">
				<a :href="currentPath" style="text-decoration:none" :download="currentFile + ' - ' + currentMonth">
					<i class="fas fa-download"></i>
				</a>
			</button>
			<button v-if="currentFile !== '' && currentMonth !== '' && allFiles().filter(elem=>elem.name == currentFile + ' - ' + currentMonth).length == 0" @click="uploadRecord()" class="w3-button w3-black download-button" style="margin:10px 2px;transform: rotate(180deg)" id="upload">
				<i class="fas fa-download"></i>
			</button>
			<button v-if="currentFile !== '' && currentMonth !== '' && allFiles().filter(elem=>elem.name == currentFile + ' - ' + currentMonth).length !== 0" @click="uploadRecord()" class="w3-button w3-black download-button" style="margin:10px 2px;" id="update">
				<i class="fas fa-sync"></i>
			</button>
			<button v-if="(Number(currentMonth.split('-')[1]) - 1 == 1 || Number(currentMonth.split('-')[1]) - 1 == 4 || Number(currentMonth.split('-')[1]) - 1 == 7 || Number(currentMonth.split('-')[1]) - 1 == 10)" @click="downloadZip()" class="w3-button w3-black download-button" style="margin:10px 2px;" id="download">
				<i class="fas fa-paper-plane"></i>
			</button>
			<iframe v-if="allFiles().filter(elem=>elem.name == currentFile + ' - ' + currentMonth).length !== 0 && allFiles().filter(elem=>elem.name == currentFile + ' - ' + currentMonth)[0].value.type.toLowerCase().endsWith('/pdf')" height="600px" width="100%" :src="currentPath" class="fileViewer"></iframe>
			<img v-if="allFiles().filter(elem=>elem.name == currentFile + ' - ' + currentMonth).length !== 0 && !allFiles().filter(elem=>elem.name == currentFile + ' - ' + currentMonth)[0].value.type.toLowerCase().endsWith('/pdf')" width="100%" :src="currentPath" class="fileViewer">
		</div>
		<input @change="saveFile()" type="file" id="pdfFile" accept=".pdf,.jpg,.jpeg,.png" style="display:none">		
	</div>
</template>`

function processFile() {

    fileVue = new Vue({
        el: document.querySelector('#file'),
        data: {
            publishers: [],
            display: false,
            transactionCode: "",
			period: "",
			currentMonth: "",
			currentFile: "",
			currentPath: "",
			transactionDescription: "",
			downloadName: "",
			downloadPath: "",
			showAccount: false,
        },
        computed: {
            allMonths() {
                return allMonths
            },
        },
        methods: {
			mode() {
				return mode.replace('w3-card ','')
			},
			modeButton() {
				return mode.replace('w3-card ','w3-button ')
			},
			date() {
                return monthlyReportVue.cleanDate(new Date())
            },
			individualFiles() {
				var files = ['Accounts Sheet', 'Funds Transfer', 'Remittance', 'Donation Acknowledgments', 'Accounts Report']
				if (Number(this.currentMonth.split('-')[1]) - 1 == 1 || 
					Number(this.currentMonth.split('-')[1]) - 1 == 4 || 
					Number(this.currentMonth.split('-')[1]) - 1 == 7 || 
					Number(this.currentMonth.split('-')[1]) - 1 == 10) {
						files.push('Audit Report')
					}
                return files
            },
			allFiles() {
				return myFiles.filter(elem=>elem.name.split(' - ').length > 1 && !elem.name.includes('Record Card - ')).map(obj => ({
					...obj,
					file: obj.name.split(' - ')[0],
					month: obj.name.split(' - ')[1]
				})
				)
			},
			cleanMonth(value) {
				return `${value.split(' ')[1]}-${(Number(allMonths.indexOf(value.split(' ')[0])) + 1).toString().padStart(2, '0')}`
			},
			loadFile() {
				const currentFile = this.allFiles().filter(elem=>elem.name == `${this.currentFile} - ${this.currentMonth}`)
				if (currentFile.length !== 0) {
					this.currentPath = URL.createObjectURL(currentFile[0].value);
				} else {
					if (this.currentFile == 'Audit Report' &&
						Number(this.currentMonth.split('-')[1]) - 1 !== 1 && 
						Number(this.currentMonth.split('-')[1]) - 1 !== 4 && 
						Number(this.currentMonth.split('-')[1]) - 1 !== 7 && 
						Number(this.currentMonth.split('-')[1]) - 1 !== 10) {
							this.currentFile = ''
					}
				}
				
			},
			months() {
				var months = allMonths.map(elem=>`${elem} ${new Date().getFullYear() - 1}`).concat(allMonths.slice(0, new Date().getMonth()).map(elem=>`${elem} ${new Date().getFullYear()}`), `${allMonths[new Date().getMonth()]} ${new Date().getFullYear()}`).slice(-6)
				while (allMonths.indexOf(months[0].split(' ')[0]) !== 2 && 
					allMonths.indexOf(months[0].split(' ')[0]) !== 5 && 
					allMonths.indexOf(months[0].split(' ')[0]) !== 8 && 
					allMonths.indexOf(months[0].split(' ')[0]) != 11) {
						months.shift()
				}
				return months
			},
			uploadRecord() {
				document.querySelector('#pdfFile').click()
			},
			async saveFile() {
				if (document.getElementById('pdfFile').files[0]) {
					if (document.getElementById('pdfFile').files[0].type !== "application/pdf") {
						await convertImageToPdf(`${this.currentFile} - ${this.currentMonth}`)
					} else {
						DBWorker.postMessage({ storeName: 'files', action: "save", value: [{name: `${this.currentFile} - ${this.currentMonth}`, value: document.getElementById('pdfFile').files[0]}]});
						await shortWait()
						await shortWait()
						DBWorker.postMessage({ storeName: 'files', action: "readAll"});
					}
				}
			},
			downloadZip() {
				//console.log('Download')
				// Create a new instance of JSZip
				var zip = new JSZip();

				const auditFiles = this.allFiles().filter((elem) => {
					return this.months().slice(0, 3).findIndex(ele=>elem.name.endsWith(this.cleanMonth(ele))) !== -1
				});

				auditFiles.forEach(elem=>{
					// Add Blobs to the zip folder
					zip.file(`${entryVue.cleanMonth(elem.month)}/${elem.name}.${elem.value.name ? elem.value.name.split('.')[1] : 'pdf'}`, elem.value);
				})

				// Generate the zip file asynchronously
				zip.generateAsync({ type: "blob" }).then(function (content) {
					downloadPreparedFiles([URL.createObjectURL(content), `Audit Files ${fileVue.months().slice(0, 3)[0]} - ${fileVue.months().slice(0, 3)[2]}`])
				});
			}
        }
    })
}

document.querySelector('#approvals').innerHTML = `<template>
	<div v-if="display == true">
		<h2 class="w3-center">APPROVALS</h2>

		<p style="margin:5px;display:flex;flex-wrap:wrap">
			<select v-model="currentFile" class="w3-input" style="width:250px; margin-right:10px; margin-bottom:10px" @change="loadFile()">
				<option v-for="(entry, count) in individualFiles()" :value="entry">{{ entry }}</option>
			</select>			
		</p>
		<div style="margin: 5px;">
			<button v-if="allFiles().filter(elem=>elem.name == currentFile).length !== 0" class="w3-button w3-black download-button" style="margin: 10px 2px;">
				<a :href="currentPath" style="text-decoration:none" :download="currentFile">
					<i class="fas fa-download"></i>
				</a>
			</button>
			<button v-if="currentFile !== '' && allFiles().filter(elem=>elem.name == currentFile).length == 0" @click="uploadRecord()" class="w3-button w3-black download-button" style="margin:10px 2px;transform: rotate(180deg)" id="upload">
				<i class="fas fa-download"></i>
			</button>
			<button v-if="currentFile !== '' && allFiles().filter(elem=>elem.name == currentFile).length !== 0" @click="uploadRecord()" class="w3-button w3-black download-button" style="margin:10px 2px;" id="update">
				<i class="fas fa-sync"></i>
			</button>
			<iframe v-if="allFiles().filter(elem=>elem.name == currentFile).length !== 0 && allFiles().filter(elem=>elem.name == currentFile)[0].value.type.toLowerCase().endsWith('/pdf')" height="600px" width="100%" :src="currentPath" class="fileViewer"></iframe>
			<img v-if="allFiles().filter(elem=>elem.name == currentFile).length !== 0 && !allFiles().filter(elem=>elem.name == currentFile)[0].value.type.toLowerCase().endsWith('/pdf')" width="100%" :src="currentPath" class="fileViewer">
		</div>
		<input @change="saveFile()" type="file" id="pdfFile" accept=".pdf,.jpg,.jpeg,.png" style="display:none">		
	</div>
</template>`

function processApprovals() {

    approvalsVue = new Vue({
        el: document.querySelector('#approvals'),
        data: {
            publishers: [],
            display: false,
            transactionCode: "",
			period: "",
			currentMonth: "",
			currentFile: "",
			currentPath: "",
			transactionDescription: "",
			downloadName: "",
			downloadPath: "",
			showAccount: false,
        },
        computed: {
            allMonths() {
                return allMonths
            },
        },
        methods: {
			mode() {
				return mode.replace('w3-card ','')
			},
			modeButton() {
				return mode.replace('w3-card ','w3-button ')
			},
			date() {
                return monthlyReportVue.cleanDate(new Date())
            },
			individualFiles() {
				var files = ['Payments', 'Balance', 'Approval', 'Resolution']
				
                return files
            },
			allFiles() {
				return myFiles.filter(elem=>['Payments', 'Balance', 'Approval', 'Resolution'].includes(elem.name) && !elem.name.includes('Record Card - '))
			},
			cleanMonth(value) {
				return `${value.split(' ')[1]}-${(Number(allMonths.indexOf(value.split(' ')[0])) + 1).toString().padStart(2, '0')}`
			},
			loadFile() {
				const currentFile = this.allFiles().filter(elem=>elem.name == `${this.currentFile}`)
				if (currentFile.length !== 0) {
					this.currentPath = URL.createObjectURL(currentFile[0].value);
				}				
			},
			months() {
				var months = allMonths.map(elem=>`${elem} ${new Date().getFullYear() - 1}`).concat(allMonths.slice(0, new Date().getMonth()).map(elem=>`${elem} ${new Date().getFullYear()}`), `${allMonths[new Date().getMonth()]} ${new Date().getFullYear()}`).slice(-6)
				while (allMonths.indexOf(months[0].split(' ')[0]) !== 2 && 
					allMonths.indexOf(months[0].split(' ')[0]) !== 5 && 
					allMonths.indexOf(months[0].split(' ')[0]) !== 8 && 
					allMonths.indexOf(months[0].split(' ')[0]) != 11) {
						months.shift()
				}
				return months
			},
			uploadRecord() {
				document.querySelector('#pdfFile').click()
			},
			updateRecord() {
				document.querySelector('#pdfFile').click()
			},
			async saveFile() {
				if (document.getElementById('pdfFile').files[0]) {
					if (document.getElementById('pdfFile').files[0].type !== "application/pdf") {
						await convertImageToPdf(`${this.currentFile}`)
					} else {
						DBWorker.postMessage({ storeName: 'files', action: "save", value: [{name: `${this.currentFile}`, value: document.getElementById('pdfFile').files[0]}]});
						await shortWait()
						await shortWait()
						DBWorker.postMessage({ storeName: 'files', action: "readAll"});
					}
				}
			},
        }
    })
}

document.querySelector('#archive').innerHTML = `<template>
	<div v-if="display == true">
		<h2 class="w3-center">ARCHIVE</h2>

		<p style="margin:5px;display:flex;flex-wrap:wrap">
			<select v-model="currentMonth" class="w3-input" style="width:200px; margin-right:10px; margin-bottom:10px" @change="loadFile()">
				<option v-for="(entry, count) in months()" :value="cleanMonth(entry)">{{ entry }}</option>
			</select>
			<select v-model="currentFile" class="w3-input" style="width:240px; margin-right:10px; margin-bottom:10px" @change="loadFile()">
				<option v-for="(entry, count) in individualFiles()" :value="entry">{{ entry }}</option>
			</select>			
		</p>
		<p style="margin:5px;display:flex;flex-wrap:wrap">
			<select v-model="selectedMonth" class="w3-input" style="width:150px; margin-right:10px; margin-bottom:10px">
				<option v-for="(month, count) in allMonths" :value="(count + 1).toString().padStart(2, '0')">{{ month }}</option>
			</select>
			<select v-model="selectedYear" class="w3-input" style="width:90px; margin-right:10px; margin-bottom:10px">
				<option v-for="(year, count) in currentYears" :value="year">{{ year }}</option>
			</select>	
			<select v-model="selectedFile" class="w3-input" style="width:300px; margin-right:10px; margin-bottom:10px">
				<option v-for="(entry, count) in allFileTypes()" :value="entry">{{ entry }}</option>
			</select>			
		</p>
		<div style="margin:0 5px 10px;">
			<button v-if="allFiles().filter(elem=>elem.name == currentFile + ' - ' + currentMonth).length !== 0" class="w3-button w3-black download-button" style="margin: 10px 2px;">
				<a :href="currentPath" style="text-decoration:none" :download="currentFile + ' - ' + currentMonth">
					<i class="fas fa-download"></i>
				</a>
			</button>
			<button v-if="selectedMonth !== '' && selectedYear !== '' && selectedFile !== ''" @click="uploadRecord()" class="w3-button w3-black download-button" style="margin:10px 2px;transform: rotate(180deg)" id="upload">
				<i class="fas fa-download"></i>
			</button>
			<button v-if="currentFile !== '' && currentMonth !== '' && allFiles().filter(elem=>elem.name == currentFile + ' - ' + currentMonth).length !== 0" @click="uploadRecord()" class="w3-button w3-black download-button" style="margin:10px 2px;" id="update">
				<i class="fas fa-sync"></i>
			</button>
			<iframe v-if="allFiles().filter(elem=>elem.name == currentFile + ' - ' + currentMonth).length !== 0 && allFiles().filter(elem=>elem.name == currentFile + ' - ' + currentMonth)[0].value.type.toLowerCase().endsWith('/pdf')" height="600px" width="100%" :src="currentPath" class="fileViewer"></iframe>
			<img v-if="allFiles().filter(elem=>elem.name == currentFile + ' - ' + currentMonth).length !== 0 && !allFiles().filter(elem=>elem.name == currentFile + ' - ' + currentMonth)[0].value.type.toLowerCase().endsWith('/pdf')" width="100%" :src="currentPath" class="fileViewer">
		</div>
		<input @change="saveFile()" type="file" id="pdfFile" accept=".pdf,.jpg,.jpeg,.png" style="display:none">
	</div>
</template>`

function processArchive() {

    archiveVue = new Vue({
        el: document.querySelector('#archive'),
        data: {
            publishers: [],
            display: false,
            transactionCode: "",
			period: "",
			currentDate: "",
			currentMonth: "",
			selectedMonth: "",
			selectedYear: "",
			selectedFile: "",
			currentFile: "",
			currentPath: "",
			transactionDescription: "",
			downloadName: "",
			downloadPath: "",
			showAccount: false,
        },
        computed: {
            allMonths() {
				return allMonths
            },
			currentYears() {
				var thisYear = new Date().getFullYear()
				this.selectedYear = thisYear
				this.selectedMonth = (Number(new Date().getMonth()) + 1).toString().padStart(2, '0')
				var theseYears = []
				var i = 0
				while (i < 5) {
					theseYears.push(thisYear)
					thisYear--
					i++
				}
				return theseYears
            },
        },
        methods: {
			mode() {
				return mode.replace('w3-card ','')
			},
			modeButton() {
				return mode.replace('w3-card ','w3-button ')
			},
			date() {
                return monthlyReportVue.cleanDate(new Date())
            },
			individualFiles() {
				return getUniqueElementsByProperty(this.allFiles(), ['file']).map(elem=>elem.file)
            },
			allFiles() {
				const combinedFiles = myFiles.filter(elem=>elem.name.split(' - ').length > 1 && !elem.name.includes('Record Card - ')).map(obj => ({
					...obj,
					file: obj.name.split(' - ')[0],
					month: obj.name.split(' - ')[1]
				})
				)
				return combinedFiles.filter((elem) => {
					return fileVue.months().findIndex(ele=>elem.name.endsWith(archiveVue.cleanMonth(ele))) == -1
				});
			},
			allFileTypes() {
				if (Number(fileVue.months()[0].split(' ')[1] + (allMonths.indexOf(fileVue.months()[0].split(' ')[0]) + 1).toString().padStart(2, '0')) <= Number(archiveVue.selectedYear + archiveVue.selectedMonth)) {
					return ['Payments', 'Balance', 'Approval', 'Resolution']
				} else {
					return ['Accounts Sheet', 'Funds Transfer', 'Remittance', 'Donation Acknowledgments', 'Accounts Report', 'Payments', 'Balance', 'Approval', 'Resolution']
				}
			},
			cleanMonth(value) {
				return `${value.split(' ')[1]}-${(Number(allMonths.indexOf(value.split(' ')[0])) + 1).toString().padStart(2, '0')}`
			},
			loadFile() {
				const currentFile = this.allFiles().filter(elem=>elem.name == `${this.currentFile} - ${this.currentMonth}`)
				if (currentFile.length !== 0) {
					this.currentPath = URL.createObjectURL(currentFile[0].value);
				}				
			},
			months() {
				return getUniqueElementsByProperty(this.allFiles(), ['month']).map(elem=>entryVue.cleanMonth(elem.month))
			},
			uploadRecord() {
				if (this.selectedFile == '') {
					alert('Please select a file type')
				} 
				if (this.selectedYear == '') {
					alert('Please select a year')
				}
				if (this.selectedMonth == '') {
					alert('Please select a month')
				}
				document.querySelector('#pdfFile').click()
			},
			updateRecord() {
				document.querySelector('#pdfFile').click()
			},
			async saveFile() {
				if (document.getElementById('pdfFile').files[0]) {
					if (document.getElementById('pdfFile').files[0].type !== "application/pdf") {
						await convertImageToPdf(`${this.selectedFile} - ${this.selectedYear}-${this.selectedMonth}`)
					} else {
						DBWorker.postMessage({ storeName: 'files', action: "save", value: [{name: `${this.selectedFile} - ${this.selectedYear}-${this.selectedMonth}`, value: document.getElementById('pdfFile').files[0]}]});
						await shortWait()
						await shortWait()
						DBWorker.postMessage({ storeName: 'files', action: "readAll"});
					}
				}
			},
			downloadZip() {
				//console.log('Download')
				// Create a new instance of JSZip
				var zip = new JSZip();

				const auditFiles = this.allFiles().filter((elem) => {
					return this.months().slice(0, 3).findIndex(ele=>elem.name.endsWith(this.cleanMonth(ele))) !== -1
				});

				auditFiles.forEach(elem=>{
					// Add Blobs to the zip folder
					zip.file(`${entryVue.cleanMonth(elem.month)}/${elem.name}.${elem.value.name ? elem.value.name.split('.')[1] : 'pdf'}`, elem.value);
				})

				// Generate the zip file asynchronously
				zip.generateAsync({ type: "blob" }).then(function (content) {
					downloadPreparedFiles([URL.createObjectURL(content), `Audit Files ${fileVue.months().slice(0, 3)[0]} - ${fileVue.months().slice(0, 3)[2]}`])
				});
			},
        }
    })
}

document.querySelector('#contactInformation').innerHTML = `<template>
	<div v-if="display == true">
		<h2 class="w3-center">CONTACTS</h2>
		<div v-for="(group) in allGroups" :key="group" v-if="(selectedGroup == group || selectedGroup == 'All Groups') && groupPublishers(group).filter(elem=>elem.name.toLowerCase().includes(searchTerms.toLowerCase())).length !== 0">
			<h2 class="w3-center">{{ group }}</h2>
			<div class="w3-row-padding w3-grayscale" style="margin-top:4px">
				<div v-for="(publisher, count) in groupPublishers(group)" :key="publisher + '|' + count" style="cursor:pointer" v-if="publisher.fieldServiceGroup == group && (publisher.name.toLowerCase().includes(searchTerms.toLowerCase()))" class="w3-col l2 m4 w3-margin-bottom">
					<div :class="mode()">
						<h5 @click="publisherDetail($event.target, publisher)" style="padding:10px 15px;margin:0">{{ publisher.name }}</h5>
						<div class="w3-container main" style="padding:0 15px 10px 15px">
							<p style="margin:0" v-if="publisher.contactInformation.phoneNumber !== null" v-for="(number) in getEachNumber(publisher.contactInformation.phoneNumber)" @click="call(number)" title="Call Number"><i class="fas fa-phone"></i> {{ number }}</p>
							<p style="margin:0" v-if="publisher.contactInformation.address !== null" title="Address"><i class="fas fa-home"></i> {{ publisher.contactInformation.address }}</p>
							<p style="margin:0" v-if="publisher.contactInformation.email" title="Address"><i class="fas fa-envelope"></i> {{ publisher.contactInformation.email }}</p>
							<p style="margin:0" v-if="publisher.emergencyContactInformation && publisher.emergencyContactInformation.name !== null" title="Emergency Contact"><i class="fas fa-user"></i> {{ publisher.emergencyContactInformation.name }}</p>
							<p style="margin:0" v-if="publisher.emergencyContactInformation && publisher.emergencyContactInformation.phoneNumber !== null" v-for="(number) in getEachNumber(publisher.emergencyContactInformation.phoneNumber)" @click="call(number)" title="Call Emergency Number"><i class="fas fa-address-book"></i> {{ number }}</p>
						</div>
						<div class="detail" style="display:none; padding:0 15px 15px 15px">
							<p><label>Phone Number: <input :class="inputMode('contactInformation w3-input')" type="tel" :value="publisher.contactInformation.phoneNumber" @change="handleInputChange($event.target, publisher, 'phoneNumber')"></label></p>
							<p><label>Address:<input :class="inputMode('contactInformation w3-input')" type="text" :value="publisher.contactInformation.address" @change="handleInputChange($event.target, publisher, 'address')"></label></p>
							<p><label>Email:<input :class="inputMode('contactInformation w3-input')" type="text" :value="publisher.contactInformation.email" @change="handleInputChange($event.target, publisher, 'email')"></label></p>
							<p v-if="publisher.emergencyContactInformation"><label>Emergency Contact: <input :class="inputMode('emergencyContactInformation w3-input')" type="text" :value="publisher.emergencyContactInformation.name" @change="handleInputChange($event.target, publisher, 'name')"></label></p>
							<p v-if="publisher.emergencyContactInformation"><label>Contact Number: <input :class="inputMode('emergencyContactInformation w3-input')" type="tel" :value="publisher.emergencyContactInformation.phoneNumber" @change="handleInputChange($event.target, publisher, 'phoneNumber')"></label></p>
						</div>
					</div>
				</div>
			</div>
		</div>
		<h2 v-if="displayEnrolments == true" class="w3-center">Enrolments</h2>
		<div v-if="displayEnrolments == true" class="w3-row-padding w3-grayscale" style="margin-top:4px">
			<div v-for="(publisher, count) in enrolments()" :key="publisher + '|' + count" style="cursor:pointer" v-if="publisher.name.toLowerCase().includes(searchTerms.toLowerCase())" class="w3-col l2 m4 w3-margin-bottom">
				<div :class="mode()">
					<h5 @click="publisherDetail($event.target, publisher)" style="padding:10px 15px;margin:0">{{ publisher.name }}</h5>
					<div class="w3-container main" style="padding:0 15px 10px 15px">
						<p style="margin:0" v-if="publisher.phoneNumber !== null" v-for="(number) in getEachNumber(publisher.phoneNumber)" @click="call(number)" title="Call Number"><i class="fas fa-phone"></i> {{ number }}</p>
						<p style="margin:0" v-if="publisher.address !== null" title="Address"><i class="fas fa-home"></i> {{ publisher.address }}</p>
					</div>
					<div class="detail" style="display:none; padding:0 15px 15px 15px">
						<p><label>Phone Number: <input :class="inputMode('contactInformation w3-input')" type="tel" :value="publisher.phoneNumber" @change="handleInputChange($event.target, publisher, 'phoneNumber')"></label></p>
						<p><label>Address:<input :class="inputMode('contactInformation w3-input')" type="text" :value="publisher.address" @change="handleInputChange($event.target, publisher, 'address')"></label></p>
					</div>
				</div>
			</div>
		</div>
    </div>
</template>`

function contactInformation() {

    contactInformationVue = new Vue({
        el: document.querySelector('#contactInformation'),
        data: {
            editing: false,
            display: false,
            pdfFile: "",
			selectedPublisher: {},
        },
        computed: {
            publishers() {
                return allPublishersVue.publishers
            },
			displayEnrolments() {
				return configurationVue.reportEntry == 'lmo' || configurationVue.reportEntry == 'lma'
			},
			searchTerms() {
                return navigationVue.searchTerms
            },
			allGroups() {
                return navigationVue.allGroups
            },
			selectedGroup() {
                return navigationVue.fieldServiceGroup
            },
        },
        methods: {
			enrolments() {
                return allParticipantsVue.enrolments
            },
			inputMode(currentClass) {
				return currentClass + ' ' + mode.replace('w3-card ','')
			},
			searchMode() {
				return mode.replace('w3-card ','')
			},
			mode() {
				return mode
			},
			getEachNumber(number) {
				if (number == null) {
					return []
				} else {
					return number.split('; ')
				}
			},
			groupPublishers(group) {
				if (currentUser.currentProfile == 'Life and Ministry Overseer' || currentUser.currentProfile == 'Life and Ministry Assistant') {
					return allPublishersVue.publishers.filter(elem=>elem.fieldServiceGroup == group && elem.active)
				} else {
					return allPublishersVue.publishers.filter(elem=>elem.fieldServiceGroup == group)
				}
            },
			publisherDetail(item, publisher) {
				//console.log(item, publisher)
				//return
				if (item.parentNode.querySelector('.main').style.display == '') {
                    item.parentNode.querySelector('.main').style.display = 'none'
                    item.parentNode.querySelector('.detail').style.display = ''
                } else {
					item.parentNode.querySelector('.main').style.display = ''
                    item.parentNode.querySelector('.detail').style.display = 'none'
				}
			},
            handleInputChange(event, publisher, property) {
				if (configurationVue.reportEntry == 'lmo' || configurationVue.reportEntry == 'lma') {
					if (event.value == '') {
						publisher[`${property}`] = null
					} else {
						publisher[`${property}`] = event.value
					}
					DBWorker.postMessage({ storeName: 'lifeAndMinistryEnrolments', action: "save", value: allParticipantsVue.enrolments});
					return
				}

				const type = event.classList[0]
				if (event.value == '') {
					publisher[`${type}`][`${property}`] = null
				} else {
					publisher[`${type}`][`${property}`] = event.value
				}

				DBWorker.postMessage({ storeName: 'data', action: "save", value: [publisher]});
			},
			edit(event) {
				console.log(event)
				//this.editing = !this.editing;
			},
			call(number) {
				window.location.href = "tel:" + number;
			},
        }
    })
}


document.querySelector('#monthlyReport').innerHTML = `<template>
	<div v-if="display == true">
		<h2 class="w3-center">MONTHLY</h2>
		<h3 class="w3-center">{{ month.fullName }} {{ year }}</h3>
		<div class="w3-row-padding w3-grayscale">
			<div v-for="(publisher, count) in publishers" :key="count" v-if="(publisher.active == true || (publisher.active == false && publisher.reactivated)) && (publisher.fieldServiceGroup == selectedGroup || selectedGroup == 'All Groups') && (publisher.name.toLowerCase().includes(searchTerms.toLowerCase()))" class="w3-col l3 m6 w3-margin-bottom">
				<div :class="mode()">
					<div class="w3-container" style="padding-bottom:15px">
						<h3>{{ publisher.name }}</h3>
						<hr style="margin:0;padding:5px">
						<p style="margin:0"><label>Shared in Ministry: <input style="margin-left:8px" :class="inputMode('sharedInMinistry')" type="checkbox" :checked = "publisher.report.currentServiceYear[month.abbr].sharedInMinistry !== null" @change="handleCheckboxChange(publisher.report.currentServiceYear[month.abbr], $event.target, publisher)"></label></p>
						<p style="margin:0"><label>Bible Studies: <input :class="inputMode('bibleStudies w3-input')" type="number" min="0" max="999" style="width: 64px;" :value="publisher.report.currentServiceYear[month.abbr].bibleStudies" @change="handleInputChange(publisher.report.currentServiceYear[month.abbr], $event.target, publisher)"></label></p>
						<p style="margin:0"><label>Auxiliary Pioneer: <input style="margin-left:8px" :class="inputMode('auxiliaryPioneer')" type="checkbox" :checked = "publisher.report.currentServiceYear[month.abbr].auxiliaryPioneer !== null" @change="handleCheckboxChange(publisher.report.currentServiceYear[month.abbr], $event.target, publisher)"></label></p>
						<p style="margin:0"><label>Hours (If pioneer or ﬁeld missionary): <input :class="inputMode('hours w3-input')" type="number" min="0" max="999" style="width: 64px;" :value="publisher.report.currentServiceYear[month.abbr].hours" @change="handleInputChange(publisher.report.currentServiceYear[month.abbr], $event.target, publisher)"></label></p>
						<p style="margin:0"><label>Remarks: <input :class="inputMode('remarks w3-input')" type="text" style="width: 95%" :value="publisher.report.currentServiceYear[month.abbr].remarks" @change="handleInputChange(publisher.report.currentServiceYear[month.abbr], $event.target, publisher)"></label></p>
					</div>
				</div>
			</div>
		</div>
		<h3 class="w3-center">Late Reports</h3>
		<div class="w3-row-padding w3-grayscale">
			<div v-for="(publisher, count) in lateReports" :key="count" v-if="(publisher.publisher.active == true || (publisher.publisher.active == false && publisher.publisher.reactivated)) && (publisher.fieldServiceGroup == selectedGroup || selectedGroup == 'All Groups') && (publisher.name.toLowerCase().includes(searchTerms.toLowerCase()))" class="w3-col l3 m6 w3-margin-bottom">
				<div :class="mode()">
					<div class="w3-container" style="padding-bottom:15px">
						<h3>{{ publisher.name }}</h3>
						<h3>{{ publisher.month.fullName }}</h3>
						<hr style="margin:0;padding:5px">
						<p style="margin:0"><label>Shared in Ministry: <input style="margin-left:8px" :class="inputMode('sharedInMinistry')" type="checkbox" :checked = "publisher.report.sharedInMinistry !== null" @change="handleCheckboxChange2($event.target, publisher.publisher, publisher.month)"></label></p>
						<p style="margin:0"><label>Bible Studies: <input :class="inputMode('bibleStudies w3-input')" type="number" min="0" max="999" style="width: 64px;" :value="publisher.report.bibleStudies" @change="handleInputChange2($event.target, publisher.publisher, publisher.month)"></label></p>
						<p style="margin:0"><label>Auxiliary Pioneer: <input style="margin-left:8px" :class="inputMode('auxiliaryPioneer')" type="checkbox" :checked = "publisher.report.auxiliaryPioneer !== null" @change="handleCheckboxChange2($event.target, publisher.publisher, publisher.month)"></label></p>
						<p style="margin:0"><label>Hours (If pioneer or ﬁeld missionary): <input :class="inputMode('hours w3-input')" type="number" min="0" max="999" style="width: 64px;" :value="publisher.report.hours" @change="handleInputChange2($event.target, publisher.publisher, publisher.month)"></label></p>
						<p style="margin:0"><label>Remarks: <input :class="inputMode('remarks w3-input')" type="text" style="width: 95%" :value="publisher.report.remarks" @change="handleInputChange2($event.target, publisher.publisher, publisher.month)"></label></p>
					</div>
				</div>
			</div>
		</div>
    </div>
</template>`

function processMonthlyReport() {

    monthlyReportVue = new Vue({
        el: document.querySelector('#monthlyReport'),
        data: {
            saved: 0,
            display: false,
            hopes: ['Anointed', 'Other Sheep', 'Unbaptized Publisher'],
            privileges: ['Elder', 'Ministerial Servant', 'Regular Pioneer', 'Special Pioneer', 'Field Missionary'],
            months: [{"abbr": "sept", "fullName": "September"}, {"abbr": "oct", "fullName": "October"}, {"abbr": "nov", "fullName": "November"}, {"abbr": "dec", "fullName": "December"}, {"abbr": "jan", "fullName": "January"}, {"abbr": "feb", "fullName": "February"}, {"abbr": "mar", "fullName": "March"}, {"abbr": "apr", "fullName": "April"}, {"abbr": "may", "fullName": "May"}, {"abbr": "jun", "fullName": "June"}, {"abbr": "jul", "fullName": "July"}, {"abbr": "aug", "fullName": "August"} ],
        },
        computed: {
            allCharacters() {/*
                return getUniqueElementsByProperty(this.clickedSectionFilter,['ID'])*/
            },
            publishers() {
				if (!allPublishersVue.publishers[0]) {
					return 0
				} else if (!allPublishersVue.publishers[0].active) {
					allPublishersVue.publishers.forEach(elem=>{
						if (allPublishersVue.checkStatus(elem.report) == 'Active') {
							elem.active = true
							if (elem.reactivated) {
								delete elem.reactivated
							}
						} else {
							if (!elem.reactivated) {
								elem.active = false
							}
						}
					})
				}
                return allPublishersVue.publishers
            },
			lateReports() {
				var publisherRecords = []
				allPublishersVue.publishers.forEach(publisher=>{
					monthlyReportVue.months.slice(0, monthlyReportVue.months.findIndex(elem=>elem.abbr == monthlyReportVue.month.abbr)).forEach(elem=>{
						if (publisher.report.currentServiceYear[`${elem.abbr}`].created == null || publisher.report.currentServiceYear[`${elem.abbr}`].created.split('-').slice(0, 2).join('-') == this.cleanDate(new Date()).split('-').slice(0, 2).join('-')) {
							publisherRecords.push({'publisher': publisher, 'name': publisher.name, 'month': elem, 'fieldServiceGroup': publisher.fieldServiceGroup, 'contactInformation': publisher.contactInformation, 'dateOfBirth': publisher.dateOfBirth, 'report':publisher.report.currentServiceYear[`${elem.abbr}`]})
						}
					})
				})
				
				return publisherRecords
                //return allPublishersVue.publishers
            },
            searchTerms() {
                return navigationVue.searchTerms
            },
			selectedGroup() {
                return navigationVue.fieldServiceGroup
            },
			allGroups() {
                return allPublishersVue.allGroups
            },
			month() {
				return monthlyReportVue.months.slice(3).concat(monthlyReportVue.months.slice(0,3))[new Date().getMonth()]
                ///return this.months[0].abbr
            },
			year() {
				var currentYear;
				if (new Date().getMonth() == 0) {
					currentYear = new Date().getFullYear() - 1
				} else {
					currentYear = new Date().getFullYear()
				}
				return currentYear
            },
        },
        methods: {
			inputMode(currentClass) {
				return currentClass + ' ' + mode.replace('w3-card ','')
			},
			mode() {
				return mode
			},
			publisherDetail(publisher, item) {
                if (item.parentNode.className.split(' ')[0] == 'main') {
                    item.parentNode.parentNode.querySelector('.main').style.display = 'none'
                    item.parentNode.parentNode.querySelector('.detail').style.display = ''
                } else {
                    publisher.name = item.parentNode.querySelector('.name').innerHTML
                    if (item.parentNode.querySelector('.dateOfBirth').value) {
                        publisher.dateOfBirth = item.parentNode.querySelector('.dateOfBirth').value
                    }
                    if (item.parentNode.querySelector('.dateOfBaptism')) {
                        publisher.dateOfBaptism = item.parentNode.querySelector('.dateOfBaptism').value
                    }
                    publisher.gender = item.parentNode.querySelector('.gender').value
                    publisher.hope = item.parentNode.querySelector('.hope').value
                    publisher.fieldServiceGroup = item.parentNode.querySelector('.fieldServiceGroup').value
                    
                    var allPrivileges = []

                    item.parentNode.parentNode.querySelectorAll('.privileges').forEach(elem=>{
                        if (elem.checked) {
                            allPrivileges.push(elem.name)
                        }
                    })

                    allPrivileges.sort()

                    publisher.privilege = allPrivileges

                    publisher.contactInformation.address = item.parentNode.querySelector('.contactAddress').innerHTML
                    publisher.contactInformation.phoneNumber = item.parentNode.querySelector('.contactPhoneNumber').innerHTML
                    publisher.emergencyContactInformation.name = item.parentNode.querySelector('.emergencyContactName').innerHTML
                    publisher.emergencyContactInformation.phoneNumber = item.parentNode.querySelector('.emergencyContactPhoneNumber').innerHTML
                    this.months.forEach(elem=>{
                        const currentItem = item.parentNode.querySelector(`.${elem.abbr}`)
                        if (currentItem.querySelector('.hours').innerHTML !== '') {
                            publisher.report.currentServiceYear[elem.abbr].hours = Number(currentItem.querySelector('.hours').innerHTML)
                        } else {
                            publisher.report.currentServiceYear[elem.abbr].hours = null
                        }
                        if (currentItem.querySelector('.bibleStudies').innerHTML !== '') {
                            publisher.report.currentServiceYear[elem.abbr].bibleStudies = Number(currentItem.querySelector('.bibleStudies').innerHTML)
                        } else {
                            publisher.report.currentServiceYear[elem.abbr].bibleStudies = null
                        }
                        if (currentItem.querySelector('.remarks').innerHTML !== '') {
                            publisher.report.currentServiceYear[elem.abbr].remarks = Number(currentItem.querySelector('.remarks').innerHTML)
                        } else {
                            publisher.report.currentServiceYear[elem.abbr].remarks = null
                        }
                        if (currentItem.querySelector('.sharedInMinistry').checked) {
                            publisher.report.currentServiceYear[elem.abbr].sharedInMinistry = currentItem.querySelector('.sharedInMinistry').checked
                        } else {
                            publisher.report.currentServiceYear[elem.abbr].sharedInMinistry = null
                        }
                        if (currentItem.querySelector('.auxiliaryPioneer').checked) {
                            publisher.report.currentServiceYear[elem.abbr].auxiliaryPioneer = currentItem.querySelector('.auxiliaryPioneer').checked
                        } else {
                            publisher.report.currentServiceYear[elem.abbr].auxiliaryPioneer = null
                        }
                        //console.log(currentItem.querySelector('.sharedInMinistry').checked)
                        //console.log(currentItem.querySelector('.hours'))
                    })

                    //console.log(publisher)
                    
                    item.parentNode.parentNode.querySelector('.detail').style.display = 'none'
                    item.parentNode.parentNode.querySelector('.main').style.display = ''
                    DBWorker.postMessage({ storeName: 'data', action: "save", value: [publisher]});
                }
			},          
			cleanDate(date) {
                const currentDate = new Date(date);

                const formattedDate = `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1).toString().padStart(2, '0')}-${currentDate.getDate().toString().padStart(2, '0')}`;
				
                return formattedDate
            },
            handleCheckboxChange(record, event, publisher) {
				this.saved++
				if (!record.created) {
					record.created = this.cleanDate(new Date())
					record.modified = this.cleanDate(new Date())
				} else {
					record.modified = this.cleanDate(new Date())
				}
				if (event.checked) {
					record[`${event.className.split(' ')[0]}`] = true
				} else {
					record[`${event.className.split(' ')[0]}`] = null
				}
				DBWorker.postMessage({ storeName: 'data', action: "save", value: [publisher]});
				//console.log(publisher, event, event.checked, publisher[`${event.className.split(' ')[0]}`])
			},
			handleInputChange(record, event, publisher) {
				this.saved++
				if (!record.created) {
					record.created = this.cleanDate(new Date())
					record.modified = this.cleanDate(new Date())
				} else {
					record.modified = this.cleanDate(new Date())
				}
				//console.log(event.value)
				if (event.value !== '') {
					//event.innerHTML = ''
					if (event.className.split(' ')[0] !== 'remarks') {
						event.value == '0' ? record[`${event.className.split(' ')[0]}`] = null : record[`${event.className.split(' ')[0]}`] = Number(event.value)
					} else {
						record[`${event.className.split(' ')[0]}`] = event.value
					}
				} else {
					record[`${event.className.split(' ')[0]}`] = null
				}
				//console.log(record, publisher)
				DBWorker.postMessage({ storeName: 'data', action: "save", value: [publisher]});
				//console.log(publisher, event, event.checked, publisher[`${event.className.split(' ')[0]}`])
			},
			handleCheckboxChange2(event, publisher, month) {
				this.saved++
				if (!publisher.report.currentServiceYear[`${month.abbr}`].created) {
					publisher.report.currentServiceYear[`${month.abbr}`].created = this.cleanDate(new Date())
					publisher.report.currentServiceYear[`${month.abbr}`].modified = this.cleanDate(new Date())
				} else {
					publisher.report.currentServiceYear[`${month.abbr}`].modified = this.cleanDate(new Date())
				}
				if (event.checked) {
					if (!publisher.report.currentServiceYear[`${month.abbr}`].created) {
						publisher.report.currentServiceYear[`${month.abbr}`].created = this.cleanDate(new Date())
						publisher.report.currentServiceYear[`${month.abbr}`].modified = this.cleanDate(new Date())
					} else {
						publisher.report.currentServiceYear[`${month.abbr}`].modified = this.cleanDate(new Date())
					}
					publisher.report.currentServiceYear[`${month.abbr}`][`${event.className.split(' ')[0]}`] = true
				} else {
					publisher.report.currentServiceYear[`${month.abbr}`][`${event.className.split(' ')[0]}`] = null
				}
				DBWorker.postMessage({ storeName: 'data', action: "save", value: [publisher]});
				//console.log(publisher, event, event.checked, publisher[`${event.className.split(' ')[0]}`])
			},
			handleInputChange2(event, publisher, month) {
				this.saved++
				if (!publisher.report.currentServiceYear[`${month.abbr}`].created) {
					publisher.report.currentServiceYear[`${month.abbr}`].created = this.cleanDate(new Date())
					publisher.report.currentServiceYear[`${month.abbr}`].modified = this.cleanDate(new Date())
				} else {
					publisher.report.currentServiceYear[`${month.abbr}`].modified = this.cleanDate(new Date())
				}
				if (event.value !== '') {
					//event.innerHTML = ''
					if (event.className.split(' ')[0] !== 'remarks') {
						event.value == '0' ? publisher.report.currentServiceYear[`${month.abbr}`][`${event.className.split(' ')[0]}`] = null : publisher.report.currentServiceYear[`${month.abbr}`][`${event.className.split(' ')[0]}`] = Number(event.value)
					} else {
						publisher.report.currentServiceYear[`${month.abbr}`][`${event.className.split(' ')[0]}`] = event.value
					}
				} else {
					publisher.report.currentServiceYear[`${month.abbr}`][`${event.className.split(' ')[0]}`] = null
				}
				//console.log(record, publisher)
				DBWorker.postMessage({ storeName: 'data', action: "save", value: [publisher]});
				//console.log(publisher, event, event.checked, publisher[`${event.className.split(' ')[0]}`])
			},
            sumHours(publisher) {
                var totalHours = 0
                this.months.forEach(elem=>{
                    const value = publisher.report.currentServiceYear[elem.abbr].hours
                    if (value !== null) {
                        totalHours = totalHours + value
                    }
                })
                return totalHours
            }
        }
    })
}


document.querySelector('#missingReport').innerHTML = `<template>
	<div v-if="display == true" style="display:block">
		<h2 class="w3-center">MISSING</h2>
		<div class="w3-row-padding w3-grayscale" style="margin-top:4px">
			<div v-for="(group) in allGroups" :key="group" v-if="(selectedGroup == group || selectedGroup == 'All Groups') && (groupPublishers(group).filter(elem=>elem.name.toLowerCase().includes(searchTerms.toLowerCase()) && missingRecord(elem).length !== 0).length !== 0)" class="w3-col l3 m6 w3-margin-bottom">
				<div style="padding-bottom:10px" :class="mode()">
					<div class="w3-container">
						<div style="display:flex; justify-content:space-between">
							<h3 style="margin-right:4px">{{ group }}</h3>
							<h3 style="text-align: right;" @click="message($event.target, group)" title="Send Message"><i class="fas fa-envelope"></i></h3>
						</div>
						<div class="main" v-for="(publisher, count) in groupPublishers(group)" :key="publisher + '|' + count" style="cursor:pointer" v-if="missingRecord(publisher) !== '' && publisher.fieldServiceGroup == group && (publisher.name.toLowerCase().includes(searchTerms.toLowerCase()))">
							<hr style="margin:0; padding:0">
							<h5 @click="publisherDetail(publisher, $event.target)" style="margin:2px 0"><i class="fa fa-caret-right w3-margin-right"></i>{{ publisher.name }}</h5>
							<p style="margin:0">{{ missingRecord(publisher) }}</p>
							<div v-for="(lateReport) in missingRecord(publisher).split('; ')" class="w3-container detail" style="display:none">
								<h5 style="margin:0">{{ lateReport }}</h5>
								<p style="margin:0"><label>Shared in Ministry: <input style="margin-left:8px" :class="inputMode('sharedInMinistry')" type="checkbox"></label></p>
								<p style="margin:0"><label>Bible Studies: <input :class="inputMode('bibleStudies w3-input')" type="number" min="0" max="999" style="width: 64px;"></label></p>
								<p style="margin:0"><label>Auxiliary Pioneer: <input style="margin-left:8px" :class="inputMode('auxiliaryPioneer')" :checked = "checkAuxiliaryPioneer(publisher, lateReport)" type="checkbox"></label></p>
								<p style="margin:0"><label>Hours (If pioneer or ﬁeld missionary): <input :class="inputMode('hours w3-input')" type="number" min="0" max="999" style="width: 64px;"></label></p>
								<p style="margin:0"><label>Remarks: <input :class="inputMode('remarks w3-input')" type="text" style="width: 200px"></label></p>
								<hr style="margin:0; padding:0">
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
    </div>
</template>`

function processMissingReport() {

    missingReportVue = new Vue({
        el: document.querySelector('#missingReport'),
        data: {
            //processedGroups: [],
            display: false,
            pdfFile: "",
			selectedPublisher: {},
        },
        computed: {
            publishers() {
                return allPublishersVue.publishers
            },
			searchTerms() {
                return navigationVue.searchTerms
            },
			allGroups() {
                return allPublishersVue.allGroups
            },
			selectedGroup() {
                return navigationVue.fieldServiceGroup
            },
        },
        methods: {
			inputMode(currentClass) {
				return currentClass + ' ' + mode.replace('w3-card ','')
			},
			mode() {
				return mode
			},
			groupPublishers(group) {
                return allPublishersVue.publishers.filter(elem=>elem.fieldServiceGroup == group && (elem.active == true || (elem.active == false && elem.reactivated)))
            },
			checkAuxiliaryPioneer(publisher, lateReport) {
				return publisher.report.currentServiceYear[attendanceVue.months.filter(elem=>elem.fullName == lateReport)[0].abbr].auxiliaryPioneer == true
			},
			publisherDetail(publisher, event) {
				//console.log(publisher, event, event.parentNode.querySelector('p'))
				if (!event.parentNode.querySelector('.detail')) {
					event = event.parentNode
				}
				if (event.parentNode.querySelector('.detail').style.display !== '') {
					event.parentNode.querySelector('p').style.display = 'none'
					event.parentNode.querySelector('.fa-caret-right').classList.value = 'fa fa-caret-down w3-margin-right'
					event.parentNode.querySelectorAll('.detail').forEach(elem=>{
						elem.style.display = ''
					})
				} else {
					event.parentNode.querySelector('p').style.display = ''
					event.parentNode.querySelector('.fa-caret-down').classList.value = 'fa fa-caret-right w3-margin-right'
					event.parentNode.querySelectorAll('.detail').forEach(elem=>{
						//publisher.report.currentServiceYear[month.abbr].bibleStudies
						const currentMonth = configurationVue.months.filter(ele=>ele.fullName == elem.querySelector('h5').innerHTML)[0].abbr
						//console.log(elem.querySelector('h5').innerHTML)
						//console.log(currentMonth)
						if (elem.querySelector('.sharedInMinistry').checked) {
							publisher.report.currentServiceYear[`${currentMonth}`].sharedInMinistry = true
							if (!publisher.report.currentServiceYear[`${currentMonth}`].created) {
								publisher.report.currentServiceYear[`${currentMonth}`].created = this.cleanDate(new Date())
								publisher.report.currentServiceYear[`${currentMonth}`].modified = this.cleanDate(new Date())
							} else {
								publisher.report.currentServiceYear[`${currentMonth}`].modified = this.cleanDate(new Date())
							}
						} else {
							publisher.report.currentServiceYear[`${currentMonth}`].sharedInMinistry = null
							if (!publisher.report.currentServiceYear[`${currentMonth}`].created) {
								publisher.report.currentServiceYear[`${currentMonth}`].created = null
								publisher.report.currentServiceYear[`${currentMonth}`].modified = null
							}
						}
						//console.log(elem.querySelector('.sharedInMinistry').checked)
						elem.querySelector('.bibleStudies').value !== '' ? publisher.report.currentServiceYear[`${currentMonth}`].bibleStudies = elem.querySelector('.bibleStudies').value : publisher.report.currentServiceYear[`${currentMonth}`].bibleStudies = null
						elem.querySelector('.auxiliaryPioneer').checked ? publisher.report.currentServiceYear[`${currentMonth}`].auxiliaryPioneer = true : publisher.report.currentServiceYear[`${currentMonth}`].auxiliaryPioneer = null
						elem.querySelector('.hours').value !== '' ? publisher.report.currentServiceYear[`${currentMonth}`].hours = elem.querySelector('.hours').value : publisher.report.currentServiceYear[`${currentMonth}`].hours = null
						elem.querySelector('.remarks').value !== '' ? publisher.report.currentServiceYear[`${currentMonth}`].remarks = elem.querySelector('.remarks').value : publisher.report.currentServiceYear[`${currentMonth}`].remarks = null
						//publisher.report.currentServiceYear[month.abbr].sharedInMinistry
						elem.style.display = 'none'
					})
					DBWorker.postMessage({ storeName: 'data', action: "save", value: [publisher]});
				}
				//this.selectedPublisher = publisher
                //fillPublisherRecord(publisher)
			},
			cleanDate(date) {
                const currentDate = new Date(date);

                const formattedDate = `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1).toString().padStart(2, '0')}-${currentDate.getDate().toString().padStart(2, '0')}`;
				
                return formattedDate
            },
            missingRecord(publisher) {
				var publisherRecords = ''
				monthlyReportVue.months.slice(0, monthlyReportVue.months.findIndex(elem=>elem.abbr == monthlyReportVue.month.abbr) + 1).reverse().forEach(elem=>{
					if (publisher.report.currentServiceYear[`${elem.abbr}`].sharedInMinistry !== true) {
						publisherRecords += '; ' + elem.fullName
					}
				})
				
				return publisherRecords.replace('; ','')
			},
            message(event, group) {

				var reportDetails = ``

				event.parentNode.parentNode.parentNode.querySelectorAll('.main').forEach(elem=>{
					reportDetails += elem.querySelector('h5').innerText
					reportDetails += `
`
					reportDetails += elem.querySelector('p').innerText
					reportDetails += `

`
				})
				//return

				var elementToCopy = event.parentNode.parentNode.parentNode;//document.getElementById('elementToCopy');
				//var elementToCopy = document.getElementsByTagName('table')[0];//document.getElementById('elementToCopy');
				

				// Create a range to select the content of the element
				var range = document.createRange();
				range.selectNode(elementToCopy);

				// Clear the existing clipboard content
				window.getSelection().removeAllRanges();

				// Add the range to the clipboard
				window.getSelection().addRange(range);

				// Copy the selected content to the clipboard
				document.execCommand('copy');

				// Clear the selection
				window.getSelection().removeAllRanges();

				const groupDetail = configurationVue.fieldServiceGroupDetails.filter(elem=>elem.name == group)[0]

				var recipient = allPublishersVue.publishers.filter(elem=>elem.name == groupDetail.overseer)[0].contactInformation.email;
				var cc = allPublishersVue.publishers.filter(elem=>elem.name == configurationVue.configuration.sec)[0].contactInformation.email + (allPublishersVue.publishers.filter(elem=>elem.name == groupDetail.assistant)[0].contactInformation.email ? ';' + allPublishersVue.publishers.filter(elem=>elem.name == groupDetail.assistant)[0].contactInformation.email : '');
				var subject = 'MISSING REPORTS - ' + group + ' - ' + attendanceVue.cleanDate(new Date());
				var body = `Dear Brother ${toTitleCase(groupDetail.overseer.split(' ')[0])},
Please these are the reports still missing for your field service group.
__________________
${group.toUpperCase()}
__________________

${reportDetails}
Thanks,
${configurationVue.selectedProfile == 'Secretary' ? toTitleCase(configurationVue.configuration.sec.split(' ')[0]) : toTitleCase(configurationVue.configuration.assistantSec.split(' ')[0])}


`
				
				var mailtoLink = 'mailto:' + encodeURIComponent(recipient) +
								'?cc=' + encodeURIComponent(cc) +
								'&subject=' + encodeURIComponent(subject) +
								'&body=' + encodeURIComponent(body);

				window.location.href = mailtoLink;
			},
        }
    })
}

var newAssignments = []

function convertClipboardToHTML() {
	allAssignmentsVue.currentWeek = ''
	newAssignments = []
	// Get the content from the clipboard as plain text
	navigator.clipboard.readText()
		.then(async (clipboardText) => {
			// Convert plain text to HTML (in this case, preserving line breaks)
			const htmlContent = clipboardText.replace(/\n/g, '<br>');

			// Display the HTML content in the result div
			document.getElementById('result').innerHTML = htmlContent;

			//console.log(htmlContent)
			await shortWait()
			await shortWait()
			allAssignmentsVue.assignDetails = document.getElementById('result').innerText.split('\n')
			allAssignmentsVue.currentSection = allAssignmentsVue.assignDetails[3].trim()
			allAssignmentsVue.currentWeek = allAssignmentsVue.assignDetails.shift().trim()
			//allParticipantsVue.lifeAndMinistry.assignments.push({ "week": allAssignmentsVue.currentWeek, "meetingPart": allAssignmentsVue.assignDetails.shift().trim(), "section": allAssignmentsVue.currentSection })
			newAssignments.push({ "meetingPart": allAssignmentsVue.assignDetails.shift().trim(), "section": allAssignmentsVue.currentSection, "assignTo": "chairman" })
			const firstAssignment = allAssignmentsVue.assignDetails.shift().trim()
			await shortWait()
			await shortWait()
			//console.log(firstAssignment)
			//console.log(allAssignmentsVue.assignDetails)
			//return

			//allParticipantsVue.lifeAndMinistry.assignments.push({ "week": allAssignmentsVue.currentWeek, "meetingPart": firstAssignment, "section": allAssignmentsVue.currentSection })
			newAssignments.push({ "meetingPart": firstAssignment, "section": allAssignmentsVue.currentSection, "assignTo": "exemplary" })
			const song = allAssignmentsVue.assignDetails.findIndex(elem=>elem.trim().split(' ')[0] == firstAssignment.split(' ')[0])
			//console.log(allAssignmentsVue.assignDetails[found])
			//console.log(song)
			await shortWait()
			await shortWait()
			//allParticipantsVue.lifeAndMinistry.assignments.push({ "week": allAssignmentsVue.currentWeek, "meetingPart": allAssignmentsVue.assignDetails.splice(song, 1)[0].trim(), "section": allAssignmentsVue.assignDetails[song - 1].trim() })
			const secondSong = allAssignmentsVue.assignDetails.splice(song, 1)[0].trim()
			//console.log(secondSong)
			await shortWait()
			await shortWait()
			//allParticipantsVue.lifeAndMinistry.assignments.push({ "week": allAssignmentsVue.currentWeek, "meetingPart": allAssignmentsVue.assignDetails.pop().trim(), "section": allAssignmentsVue.currentSection })
			const closing = allAssignmentsVue.assignDetails.pop().trim()

			var i = 1, j = 0, assignTo
			while (j < allAssignmentsVue.assignDetails.length) {
				//console.log(i, j)
				const found = allAssignmentsVue.assignDetails.findIndex(elem=>elem.trim().startsWith(i + '. '))
				
				if (found !== -1) {
					const newPart = `${allAssignmentsVue.assignDetails[found]} ${allAssignmentsVue.assignDetails[found + 1]}`
					if (i < 3) {
						assignTo = "appointed"
					} else if (i == 3) {
						assignTo = "male"
					} else if (i == 4) {
						assignTo = "all"
						allAssignmentsVue.currentSection = allAssignmentsVue.assignDetails[found - 1].trim()
					} else if (found == song) {
						newAssignments.push({ "meetingPart": secondSong, "section": allAssignmentsVue.assignDetails[song - 1].trim() })
						assignTo = "appointed"
						allAssignmentsVue.currentSection = allAssignmentsVue.assignDetails[song - 1].trim()
					} else if (`${newPart.split('min.)')[0]}min.)`.trim().includes('(30 min.)')) {
						assignTo = "cbs"
					} else if (assignTo == "cbs") {
						assignTo = "exemplary"
					}

					//allParticipantsVue.lifeAndMinistry.assignments.push({ "week": allAssignmentsVue.currentWeek, "meetingPart": `${newPart.split('min.)')[0]}min.)`.trim(), "section": allAssignmentsVue.currentSection })
					newAssignments.push({ "meetingPart": `${newPart.split('min.)')[0]}min.)`.trim(), "section": allAssignmentsVue.currentSection, "assignTo": assignTo })
					i++
				}
				
				if (found > j) {
					j = found
				}
				j++			
				
			}

			newAssignments.push({ "meetingPart": closing, "section": allAssignmentsVue.currentSection, "assignTo": "exemplary" })

			const index = allAssignmentsVue.allAssignments.findIndex(elem=>elem.week == allAssignmentsVue.currentWeek)
			if (index !== -1) {
				allAssignmentsVue.allAssignments.parts = newAssignments
			} else {
				allAssignmentsVue.allAssignments.push({"week": allAssignmentsVue.currentWeek, "parts": newAssignments, "count": allAssignmentsVue.currentCount})
			}
			
			await shortWait()
			await shortWait()

			DBWorker.postMessage({ storeName: 'lifeAndMinistryAssignments', action: "save", value: [{"week": allAssignmentsVue.currentWeek, "parts": newAssignments, "count": allAssignmentsVue.currentCount}]});
		})
		.catch(error => {
			console.error('Error reading clipboard text:', error);
		});
}

var collator = new Intl.Collator(undefined, { numeric: true, sensitivity: 'base' });


document.querySelector('#allAssignments').innerHTML = `<template>
	<div v-if="display == true" style="display:block">
		<h2 class="w3-center">ASSIGNMENTS</h2>
		<div id="result" style="display:none; margin-top: 20px; border: 1px solid #ccc; padding: 10px;" contenteditable="true">
			Result will appear here...
		</div>
		<div style="display:flex; flex-wrap:wrap">
			<button class="w3-button w3-black" style="margin:5px 5px 10px 20px" onclick="convertClipboardToHTML()"><i class="fas fa-file-import"></i> Import</button>
			<select v-model="selectedWeek" style="margin:5px; width:200px" :class="inputMode('week w3-input')">
				<option value="All Assignments">All Assignments</option>
				<option v-for="week in allAssignments" :value="week.week">{{ week.week }}</option>
			</select>
			<select v-model="selectedAssignTo" style="margin:5px; width:150px" :class="inputMode('assignTo w3-input')">
				<option value="All Assign To">All Assign To</option>
				<option v-for="week in allAssignTo()" :value="week.assignTo">{{ toTitleCase(week.assignTo.replace('cbs','Bible Study')) }}</option>
			</select>
			<button class="w3-button w3-black filterBtn" style="margin:5px 5px 10px 5px" @click="filterAssignment($event.target)">All</button>
			<button class="w3-button w3-black filterBtn" style="margin:5px 5px 10px 5px" @click="filterAssignment($event.target)">Assigned</button>
			<button class="w3-button w3-black filterBtn" style="margin:5px 5px 10px 5px; display:none" @click="filterAssignment($event.target)">Unassigned</button>
		</div>

		<div class="w3-row-padding w3-grayscale" style="margin-top:5px">
			<div v-for="(week, count) in assignments" :key="week.week + '|' + count" v-if="selectedWeek == week.week || selectedWeek == 'All Assignments'" class="w3-col l3 m6 w3-margin-bottom">
				<div style="padding-bottom:10px" :class="mode()">
					<div class="w3-container">
						<div style="display:flex; justify-content:space-between">
							<h3 style="margin-right:4px">{{ displayMeetingDay(week.week) }}</h3>
							<p style="text-align: right;"><i style="padding:5px;margin:2px" v-if="count > 0" @click="moveLeft(week, count)" title="Move Up" class="fas fa-chevron-left"></i><i style="padding:5px;margin:2px" v-if="count < assignments.length - 1" @click="moveRight(week, count)" title="Move Down" class="fas fa-chevron-right"></i><i style="padding:5px;margin:2px" @click="deleteAssignment(week)" title="Delete Assignment" class="fas fa-trash"></i></p>
						</div>
						<div class="main" v-for="(part, count) in week.parts.filter(elem=>elem.assignTo)" v-for="(week, count) in assignments" :key="week.week + '|' + count" v-if="(selectedAssignTo.startsWith(part.assignTo) || selectedAssignTo == part.assignTo || selectedAssignTo == 'All Assign To') && (currentView == 'All' || (currentView == 'Assigned' && part.assignedTo) || (currentView == 'Unassigned' && !part.assignedTo)) && (selectedProfile == 'Life and Ministry Overseer' || (selectedProfile == 'Life and Ministry Assistant' && (part.assignTo == 'male' || part.assignTo == 'all')))" style="cursor:pointer">
							<hr style="margin:0; padding:0">
							<h5 @click="publisherDetail($event.target, part, week)" style="margin:2px 0"><i class="fa fa-caret-right w3-margin-right"></i>{{ part.meetingPart }}</h5>
							<p style="margin:0">{{ part.assignedTo }}{{ part.assistant ? ' / ' + part.assistant : '' }}</p>
							<div class="w3-container detail" style="display:none">
								<h5 style="margin:0"><select v-model="part.assignedTo" :class="inputMode('assignedTo w3-input')">
									<option value="">Select Person</option>
									<option v-for="publisher in selection(part)[0]" :value="publisher.name">{{ publisher.name }}</option>
								</select></h5>
								<h5 v-if="part.assignTo == 'all' || part.assignTo == 'cbs'" style="margin:0"><select v-model="part.assistant" :class="inputMode('assistant w3-input')">
									<option value="">Select Person</option>
									<option v-for="publisher in selection(part)[1]" :value="publisher.name">{{ publisher.name }}</option>
								</select></h5>
								<hr style="margin:0; padding:0">
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
    </div>
</template>`
//.filter(elem=>elem.name !== week.assignedTo)
function processAllAssignments() {

    allAssignmentsVue = new Vue({
        el: document.querySelector('#allAssignments'),
        data: {
            assignDetails: '',
            selectedWeek: 'All Assignments',
            selectedAssignTo: 'All Assign To',
			currentWeek: '',
			currentAssignment: '',
			currentSection: '',
			currentView: 'Unassigned',
            display: false,
            pdfFile: "",
			selectedPublisher: {},
			allAssignments: [],
			//assignments: [],
        },
        computed: {
            publishers() {
                return allPublishersVue.publishers.filter(elem=>elem.active == true).concat(allParticipantsVue.enrolments)
            },
			assignments() {
				return this.allAssignments.sort((a, b) => collator.compare(a.count, b.count))
            },
			selectedProfile() {
                return configurationVue.selectedProfile
            },
			searchTerms() {
                return navigationVue.searchTerms
            },
			currentCount() {
				return this.allAssignments.length
			},
			selectedGroup() {
                return navigationVue.fieldServiceGroup
            },
        },
        methods: {
			moveRight(week) {
				//if (week.count > this.allAssignments.length - 1) {return}
				/*var currentAssignment = week.count
				var nextAssignment = this.allAssignments.findIndex(elem=>elem.count == (week.count + 1))
				if (nextAssignment !== -1) {
					this.allAssignments[nextAssignment].count = week.count
					DBWorker.postMessage({ storeName: 'lifeAndMinistryAssignments', action: "save", value: [this.allAssignments[nextAssignment]]});
				}*/
				week.count = week.count + 1
				DBWorker.postMessage({ storeName: 'lifeAndMinistryAssignments', action: "save", value: [week]});
			},
			moveLeft(week) {
				if (week.count == 0) {return}
				/*var currentAssignment = week.count
				var previousAssignment = this.allAssignments.findIndex(elem=>elem.count == (week.count - 1))
				if (previousAssignment !== -1) {
					this.allAssignments[previousAssignment].count = week.count
					DBWorker.postMessage({ storeName: 'lifeAndMinistryAssignments', action: "save", value: [this.allAssignments[previousAssignment]]});
				}
				this.allAssignments[currentAssignment].count = week.count - 1*/
				week.count = week.count - 1
				DBWorker.postMessage({ storeName: 'lifeAndMinistryAssignments', action: "save", value: [week]});
			},
			displayMeetingDay(value) {
				var date;
				if (value.split('–').length == 1) {
					return `${value.split(' ')[0]} ${Number(value.split('-')[0].split(' ')[1]) + configurationVue.weekdays.indexOf(configurationVue.midweekMeetingDay)}`
				} else {
					date = Number(value.split('–')[1].split(' ')[1]) - (6 - configurationVue.weekdays.indexOf(configurationVue.midweekMeetingDay))
					if (date < 1) {
						return `${value.split(' ')[0]} ${Number(value.split('–')[0].split(' ')[1]) + configurationVue.weekdays.indexOf(configurationVue.midweekMeetingDay)}`
					} else {
						return `${value.split('–')[1].split(' ')[0]} ${date}`
					}
				}
			},
			filterAssignment(event) {
				this.currentView = event.innerHTML
				document.querySelectorAll('.filterBtn').forEach(elem=>{
					elem.style.display = ''
				})
				event.style.display = 'none'
			},
			selection(assignment) {
				//console.log(assignment)
				//var ministry = this.assignments.filter(elem=>elem.week == assignment.week && elem.meetingPart.startsWith('4.'))[0].section
				//console.log(ministry)
				//return []
				if (assignment.assignTo == 'chairman' || assignment.assignTo == 'cbs') {
					const assignees = this.publishers.filter(elem=>elem.privilege && elem.privilege.includes('Elder'))
					const assistant = this.publishers.filter(elem=>elem.privilege && (elem.privilege.includes('Elder') || elem.privilege.includes('Ministerial Servant') || elem.exemplary))
					//console.log(assignees)
					return [assignees, assistant]
				} else if (assignment.assignTo == 'appointed') {
					const assignees = this.publishers.filter(elem=>elem.privilege && (elem.privilege.includes('Elder') || elem.privilege.includes('Ministerial Servant')))
					//console.log(assignees)
					return [assignees]
				} else if (assignment.assignTo == 'exemplary') {
					const assignees = this.publishers.filter(elem=>elem.privilege && (elem.privilege.includes('Elder') || elem.privilege.includes('Ministerial Servant') || elem.exemplary))
					//console.log(assignees)
					return [assignees]
				} else if (assignment.assignTo == 'male') {
					const assignees = this.publishers.filter(elem=>elem.gender && elem.gender == 'Male')
					//console.log(assignees)
					return [assignees]
				} else {
					return [this.publishers, this.publishers]
				}
				
			},
			toTitleCase(value) {
				return toTitleCase(value)
			},
			allWeeks() {
				//var filteredWeeks = 
				//scheduleVue.allWeeks
				return getUniqueElementsByProperty(this.assignments,['week'])
            },
			allAssignTo() {
				return getUniqueElementsByProperty(this.assignments.map(elem=>elem.parts).reduce((result, currentArray) => result.concat(currentArray), []).filter(elem=>elem.assignTo),['assignTo'])
            },
			async deleteAssignment(week) {
				if (confirm('Are you sure you want to Delete Assignment?\nPress "Yes" to Delete')) {
					//this.allAssignments.splice(this.allAssignments.findIndex(elem=>elem.count == week.count), 1)
					DBWorker.postMessage({ storeName: 'lifeAndMinistryAssignments', action: "deleteItem", value: week.week});
					await shortWait()
					await shortWait()
					DBWorker.postMessage({ storeName: 'lifeAndMinistryAssignments', action: "readAll"});
				}
			},
			addAssignment() {
				//console.log("New Assignment")
				if (this.currentWeek == '') {
					this.currentWeek = this.currentAssignment
					this.currentAssignment = ''
					return
				}
				//allAssignmentsVue.assignments.push({ "week": this.currentWeek, "meetingPart": this.currentAssignment, "section": this.currentSection })
				//this.currentAssignment = ''
				//DBWorker.postMessage({ storeName: 'lifeAndMinistryAssignments', action: "save", value: allParticipantsVue.allAssignments});
			},
			inputMode(currentClass) {
				return currentClass + ' ' + mode.replace('w3-card ','')
			},
			mode() {
				return mode
			},
			groupPublishers(group) {
                return allPublishersVue.publishers.filter(elem=>elem.fieldServiceGroup == group && (elem.active == true || (elem.active == false && elem.reactivated)))
            },
			publisherDetail(event, part, week) {
				//console.log(event, part, week, event.parentNode.querySelector('p'))
				if (!event.parentNode.querySelector('.detail')) {
					event = event.parentNode
				}

				if (event.parentNode.querySelector('.detail').style.display !== '') {
					event.parentNode.querySelector('p').style.display = 'none'
					event.parentNode.querySelector('.fa-caret-right').classList.value = 'fa fa-caret-down w3-margin-right'
					event.parentNode.querySelectorAll('.detail').forEach(elem=>{
						elem.style.display = ''
					})
				} else {
					event.parentNode.querySelector('p').style.display = ''
					event.parentNode.querySelector('.fa-caret-down').classList.value = 'fa fa-caret-right w3-margin-right'
					event.parentNode.querySelectorAll('.detail').forEach(elem=>{
						elem.style.display = 'none'
					})
					//console.log(event.parentNode.querySelector('.assignedTo').value)
					if (event.parentNode.querySelector('.assignedTo').value !== '') {
						part.assignedTo = event.parentNode.querySelector('.assignedTo').value
					} else {
						part.assignedTo = null
					}

					if (event.parentNode.querySelector('.assistant') && event.parentNode.querySelector('.assistant').value !== '') {
						part.assistant = event.parentNode.querySelector('.assistant').value
					} else {
						part.assistant = null
					}
					//console.log(event)
					DBWorker.postMessage({ storeName: 'lifeAndMinistryAssignments', action: "save", value: [week]});
				}
				//this.selectedPublisher = publisher
                //fillPublisherRecord(publisher)
			},
            missingRecord(publisher) {
				var publisherRecords = ''
				monthlyReportVue.months.slice(0, monthlyReportVue.months.findIndex(elem=>elem.abbr == monthlyReportVue.month.abbr) + 1).forEach(elem=>{
					if (publisher.report.currentServiceYear[`${elem.abbr}`].sharedInMinistry !== true) {
						publisherRecords += '; ' + elem.fullName
					}
				})
				
				return publisherRecords.replace('; ','')
			},
        }
    })
}

// Function to change the index of an element
function changeIndex(array, oldIndex, newIndex) {
	// Ensure the old index is within bounds
	if (oldIndex < 0 || oldIndex >= array.length || newIndex < 0 || newIndex >= array.length) {
		console.error('Invalid index');
		return;
	}
  
	// Remove the element from the old index
	var element = array.splice(oldIndex, 1)[0];
  
	// Insert the element at the new index
	array.splice(newIndex, 0, element);
}

document.querySelector('#schedule').innerHTML = `<template>
	<div v-if="display == true" style="display:block">
		<h2 class="w3-center">SCHEDULE</h2>
		<div style="display:flex;" class="weekSelector">
			<select v-model="selectedWeek" style="margin:5px; width:200px" :class="inputMode('week w3-input')">
				<option value="All Assignments">All Assignments</option>
				<option v-for="week in assignments" :value="week.week">{{ week.week }}</option>
			</select>
			<button class="w3-button w3-black" style="margin:5px 5px 10px 5px" @click="previewRecord()">Preview</button>
		</div>

		<div class="zoom-container1" id="zoomContainer1">
			<div class="zoom-content1" id="zoomContent1">
				<div id="content" class="schedulePreview">
				<!--h2>Male Members of the Congregation</h2>
				<table>
					<thead>
						<tr>
							<th>S/No</th>
							<th>Name</th>
							<th>Field Service Group</th>
							<th>Status</th>
						</tr>
					</thead>
					<tbody>
						<tr v-for="(member, count) in allPublishers.slice(-31)">
							<td>{{ count + 32 }}</td>
							<td>{{ member.name }}</td>
							<td>{{ member.fieldServiceGroup ? member.fieldServiceGroup : '' }}</td>
							<td>{{ !member.privilege ? 'Enroled' : member.privilege.includes('Elder') ? 'Elder' : member.privilege.includes('Ministerial Servant') ? 'Ministerial Servant' : member.exemplary == true ? 'Exemplary' : member.active == true ? 'Active' : 'Inactive' }}</td>
						</tr>
					</tbody>	
				<table-->
					<table style="margin-top:-40px">
						<tr class="boldText">
							<td style="padding:0 4px;font-size:120%;border-bottom: 1px solid #000;" colspan="2">NYU INGLAND</td>
							<td style="padding:0 4px;font-size:180%;border-bottom: 1px solid #000; font-family: 'Cambria','Helvetica Roman','Arial', sans-serif;text-align:right" colspan="3">Pat dɛn fɔ Mitin dɛn Insay di Wik</td>
						</tr>
					</table>
					<div v-for="(week, count) in assignments" :key="week.week + '|' + count" v-if="selectedWeek == week.week || selectedWeek == 'All Assignments'">
					<table style="margin-bottom:0;margin-top:0">
							<tr>
								<td colspan="3" class="boldText">{{ displayMeetingDay(week.week.toUpperCase()) }} | {{ week.parts[0].meetingPart }}</td>
								<td style="text-align:right" class="guideText">Chiaman:</td>				
								<td>{{ week.parts[0].assignedTo }}</td>						
							</tr>
						</table>
						<table style="margin-bottom:0;margin-top:0">
							<tr>
								<td class="guideText">{{ startTime(0) }}</td>
								<td colspan="2">{{ week.parts[1].meetingPart.split('|')[0].trim() }}</td>
								<td style="text-align:right" class="guideText">Prea:</td>						
								<td>{{ week.parts[1].assignedTo }}</td>						
							</tr>
							<tr>
								<td class="guideText">{{ startTime(1) }}</td>
								<td colspan="2">{{ week.parts[1].meetingPart.split('|')[1].trim() }}</td>				
							</tr>
						</table>
						<table style="margin-bottom:0;margin-top:0">
							<tr>
								<td colspan="3" class="boldText" style="background: #587d84;color: white;">{{ week.parts[1].section }}</td>
								<td class="guideText">Sɛkɔn Ɔl</td>						
								<td class="guideText">Men Ɔl</td>						
							</tr>
							<tr v-for="(part, count) in week.parts.filter(elem=>elem.section == week.parts[1].section).slice(2)">
								<td class="guideText">{{ startTime(count + 2)}}</td>
								<td v-if="part.assignTo !== 'male'" colspan="3">{{ part.meetingPart }}</td>
								<td v-if="part.assignTo == 'male'">{{ part.meetingPart }}</td>
								<td v-if="part.assignTo == 'male'" class="guideText">Studɛnt:</td>
								<td v-if="part.assignTo == 'male'"></td>
								<td>{{ part.assignedTo }}</td>						
							</tr>
						</table>
						<table style="margin-bottom:0;margin-top:0">
							<tr>
								<td colspan="3" class="boldText" style="background: #ac7300;color: white;">{{ week.parts[5].section }}</td>
								<td class="guideText">Sɛkɔn Ɔl</td>						
								<td class="guideText">Men Ɔl</td>						
							</tr>
							<tr v-for="(part, count) in week.parts.filter(elem=>elem.section == week.parts[5].section)">
								<td class="guideText">{{ startTime(count + 5, part, week.parts.filter(elem=>elem.section == week.parts[5].section))}}</td>
								<td>{{ part.meetingPart }}</td>
								<td v-if="part.assistant" style="text-align:right" class="guideText">Studɛnt/Pɔsin we de ɛp:</td>
								<td v-if="!part.assistant" style="text-align:right" class="guideText">Studɛnt:</td>
								<td></td>
								<td>{{ part.assignedTo }}{{ part.assistant ? ' / ' + part.assistant : '' }}</td>						
							</tr>
						</table>
						<table style="margin-bottom:10px">
							<tr>
								<td colspan="2" class="boldText" style="background: #7e0024;color: white;">{{ week.parts.filter(elem=>!elem.assignTo)[0].section }}</td>	
								<td colspan="2"></td>
							</tr>
							<tr>
								<td class="guideText">{{ startTime(6) }}</td>
								<td>{{ week.parts.filter(elem=>!elem.assignTo)[0].meetingPart }}</td>				
							</tr>
							<tr v-for="(part, count) in week.parts.slice(week.parts.findIndex(elem=>!elem.assignTo) + 1).slice(0, -1)">
								<td class="guideText">{{ startTime(count + 7, part, week.parts.slice(week.parts.findIndex(elem=>!elem.assignTo) + 1).slice(0, -1))}}</td>
								<td v-if="part.assignTo == 'cbs'">{{ part.meetingPart }}</td>
								<td v-if="part.assignTo !== 'cbs'" colspan="2">{{ part.meetingPart }}</td>
								<td v-if="part.assignTo == 'cbs'" style="text-align:right" class="guideText">Kɔndɔktɔ/Rida:</td>
								<td>{{ part.assignedTo }}{{ part.assistant ? ' / ' + part.assistant : '' }}</td>				
							</tr>
							<tr>
								<td class="guideText">{{ startTime(7) }}</td>
								<td colspan="2">{{ week.parts.slice(week.parts.findIndex(elem=>!elem.assignTo) + 1).slice(-1)[0].meetingPart.split('|')[0].trim() }}</td>
								<td></td>						
							</tr>
							<tr>
								<td class="guideText">{{ startTime(8) }}</td>
								<td>{{ week.parts.slice(week.parts.findIndex(elem=>!elem.assignTo) + 1).slice(-1)[0].meetingPart.split('|')[1].trim() }}</td>
								<td style="text-align:right" class="guideText">Prea:</td>
								<td>{{ week.parts.slice(week.parts.findIndex(elem=>!elem.assignTo) + 1).slice(-1)[0].assignedTo }}</td>				
							</tr>
						</table>
					</div>
				</div>
			</div>
		</div>
    </div>
</template>`

var assignmentsToSend = []

function processSchedule() {

    scheduleVue = new Vue({
        el: document.querySelector('#schedule'),
        data: {
            assignDetails: '',
            selectedWeek: 'All Assignments',
            selectedAssignTo: 'All Assign To',
			currentWeek: '',
			currentAssignment: '',
			currentSection: '',
			currentView: 'Unassigned',
            display: false,
            pdfFile: "",
			selectedPublisher: {},
			allWeeks: [],
        },
        computed: {
            publishers() {
                return allPublishersVue.publishers.filter(elem=>elem.active == true).concat(allParticipantsVue.enrolments).sort((a, b) => collator.compare(a.name, b.name))
            },
			assignments() {
				return allAssignmentsVue.allAssignments.sort((a, b) => collator.compare(a.count, b.count))
            },
			searchTerms() {
                return navigationVue.searchTerms
            },
			selectedGroup() {
                return navigationVue.fieldServiceGroup
            },
			allPublishers() {
                return allPublishersVue.publishers.concat(allParticipantsVue.enrolments).filter(elem=>elem.gender == 'Male').sort((a, b) => collator.compare(a.name, b.name))
            },
        },
        methods: {
			async previewRecord() {
				downloadsArray = []
				var allMonths = ['September', 'October', 'November', 'December', 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August']
				var vernacularMonths = ['Sɛptɛmba', 'Ɔktoba', 'Novɛmba', 'Disɛmba', 'Janwari', 'Fɛbwari', 'Mach', 'Epril', 'Me', 'Jun', 'Julay', 'Ɔgɔst']
				var initialAssignments = [].concat(allAssignmentsVue.assignments.map(elem=>elem.parts.filter(ele=>ele.assignTo == 'male' || ele.assignTo == 'all').concat(scheduleVue.displayMeetingDay(elem.week))))
				assignmentsToSend = initialAssignments.map(elem => (
					elem.slice(0, -1).map(obj => ({
						...obj,
						week: elem.slice(-1)[0].replace(vernacularMonths[vernacularMonths.findIndex(val=>elem.slice(-1)[0].includes(val))], allMonths[vernacularMonths.findIndex(val=>elem.slice(-1)[0].includes(val))])
					})
				)
				)).reduce((result, currentArray) => result.concat(currentArray), [])
				var tempAssignments = [].concat(allAssignmentsVue.allAssignments)
				var restoreAssignments = [].concat(allAssignmentsVue.allAssignments)
				await shortWait()
				
				while (tempAssignments.length !== 0) {
					allAssignmentsVue.allAssignments = tempAssignments.splice(0, 2)
					await shortWait()
					await shortWait()
					await shortWait()
					await convertToImage(document.querySelector('#content'))
					await shortWait()
					await shortWait()
				}
				await shortWait()
				await shortWait()
				await shortWait()
				await shortWait()
				allAssignmentsVue.allAssignments = restoreAssignments
				await shortWait()
				await shortWait()
				await shortWait()
				await shortWait()
				document.querySelector('#content').style.display = 'none'
				document.querySelector('.weekSelector').style.display = 'none'

				assignmentSlip(assignmentsToSend.splice(0, 4))
			},
			startTime(count, part, assignments) {
				// Parse the input value
				const [hours, minutes] = configurationVue.midweekMeetingTime.split(':').map(Number);

				// Convert to 12-hour format without AM/PM
				const formattedHours = hours % 12 || 12;

				if (count == 0) {
					
					// Construct the formatted time
					return `${formattedHours}:${String(minutes).padStart(2, '0')}`;
				} else if (count == 1) {
					return this.convertMinutes((formattedHours * 60 ) + minutes + 5)
				} else if (count == 2) {
					return this.convertMinutes((formattedHours * 60 ) + minutes + 6)
				} else if (count == 3) {
					return this.convertMinutes((formattedHours * 60 ) + minutes + 16)
				} else if (count == 4) {
					return this.convertMinutes((formattedHours * 60 ) + minutes + 26)
				} else if (count == 5) {
					return this.convertMinutes((formattedHours * 60 ) + minutes + 31)
				} else if (count > 5 && part && part.assignTo == 'all') {
					return this.extractNumbersFromString(assignments[count - 6].meetingPart) > 5 ? this.convertMinutes((formattedHours * 60 ) + minutes + 31 + this.sumArray(assignments.slice(0, count - 5).map(elem=>this.extractNumbersFromString(elem.meetingPart)))) : this.convertMinutes((formattedHours * 60 ) + minutes + 31 + this.sumArray(assignments.slice(0, count - 5).map(elem=>this.extractNumbersFromString(elem.meetingPart) + 1)))
				} else if (count == 6) {
					return this.convertMinutes((formattedHours * 60 ) + minutes + 45)
				} else if (count > 6 && part && (part.assignTo == 'appointed' || part.assignTo == 'cbs')) {
					return this.convertMinutes((formattedHours * 60 ) + minutes + 51 + this.sumArray(assignments.slice(0, count - 7).map(elem=>this.extractNumbersFromString(elem.meetingPart))))
				} else if (count == 7) {
					return this.convertMinutes((formattedHours * 60 ) + minutes + 96)
				} else if (count == 8) {
					return this.convertMinutes((formattedHours * 60 ) + minutes + 99)
				} else {
					return ''
				}
			},
			convertMinutes(minutes) {
				const hours = Math.floor(minutes / 60);
				const remainingMinutes = minutes % 60;
			  
				// Display the result
				return `${hours}:${String(remainingMinutes).padStart(2, '0')}`;
			},
			extractNumbersFromString(text) {
				// Use a regular expression to match numbers in the text
				const numbers = text.match(/\d+/g);
			  
				// Convert matched numbers from strings to integers
				const numericValues = numbers ? numbers.map(Number) : [];
			  
				return numericValues.slice(-1)[0];
			},
			sumArray(numbers) {
				// Use the reduce method to calculate the sum
				const total = numbers.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
			  
				return total;
			},		  
			displayMeetingDay(value) {
				var date;
				if (value.split('–').length == 1) {
					return `${value.split(' ')[0]} ${Number(value.split('-')[0].split(' ')[1]) + configurationVue.weekdays.indexOf(configurationVue.midweekMeetingDay)}`
				} else {
					date = Number(value.split('–')[1].split(' ')[1]) - (6 - configurationVue.weekdays.indexOf(configurationVue.midweekMeetingDay))
					if (date < 1) {
						return `${value.split(' ')[0]} ${Number(value.split('–')[0].split(' ')[1]) + configurationVue.weekdays.indexOf(configurationVue.midweekMeetingDay)}`
					} else {
						return `${value.split('–')[1].split(' ')[0]} ${date}`
					}
				}
			},
			filterAssignment(event) {
				this.currentView = event.innerHTML
				document.querySelectorAll('.filterBtn').forEach(elem=>{
					elem.style.display = ''
				})
				event.style.display = 'none'
			},
			selection(assignment) {
				//console.log(assignment)
				//var ministry = this.assignments.filter(elem=>elem.week == assignment.week && elem.meetingPart.startsWith('4.'))[0].section
				//console.log(ministry)
				//return []
				if (assignment.assignTo == 'chairman' || assignment.assignTo == 'cbs') {
					const assignees = this.publishers.filter(elem=>elem.privilege && elem.privilege.includes('Elder'))
					const assistant = this.publishers.filter(elem=>elem.privilege && (elem.privilege.includes('Elder') || elem.privilege.includes('Ministerial Servant') || elem.exemplary))
					//console.log(assignees)
					return [assignees, assistant]
				} else if (assignment.assignTo == 'appointed') {
					const assignees = this.publishers.filter(elem=>elem.privilege && (elem.privilege.includes('Elder') || elem.privilege.includes('Ministerial Servant')))
					//console.log(assignees)
					return [assignees]
				} else if (assignment.assignTo == 'exemplary') {
					const assignees = this.publishers.filter(elem=>elem.privilege && (elem.privilege.includes('Elder') || elem.privilege.includes('Ministerial Servant') || elem.exemplary))
					//console.log(assignees)
					return [assignees]
				} else if (assignment.assignTo == 'male') {
					const assignees = this.publishers.filter(elem=>elem.gender && elem.gender == 'Male')
					//console.log(assignees)
					return [assignees]
				} else {
					return [this.publishers, this.publishers]
				}
				
			},
			toTitleCase(value) {
				return toTitleCase(value)
			},
			allAssignTo() {
				return getUniqueElementsByProperty(this.assignments.filter(elem=>elem.assignTo),['assignTo'])
            },
			addAssignment() {
				if (this.currentWeek == '') {
					this.currentWeek = this.currentAssignment
					this.currentAssignment = ''
					return
				}
			},
			inputMode(currentClass) {
				return currentClass + ' ' + mode.replace('w3-card ','')
			},
			mode() {
				return mode
			},
			groupPublishers(group) {
                return allPublishersVue.publishers.filter(elem=>elem.fieldServiceGroup == group && (elem.active == true || (elem.active == false && elem.reactivated)))
            },
			publisherDetail(event, week) {
				if (!event.parentNode.querySelector('.detail')) {
					event = event.parentNode
				}

				if (event.parentNode.querySelector('.detail').style.display !== '') {
					event.parentNode.querySelector('p').style.display = 'none'
					event.parentNode.querySelector('.fa-caret-right').classList.value = 'fa fa-caret-down w3-margin-right'
					event.parentNode.querySelectorAll('.detail').forEach(elem=>{
						elem.style.display = ''
					})
				} else {
					event.parentNode.querySelector('p').style.display = ''
					event.parentNode.querySelector('.fa-caret-down').classList.value = 'fa fa-caret-right w3-margin-right'
					event.parentNode.querySelectorAll('.detail').forEach(elem=>{
						elem.style.display = 'none'
					})
					if (event.parentNode.querySelector('.assignedTo').value !== '') {
						week.assignedTo = event.parentNode.querySelector('.assignedTo').value
					} else {
						week.assignedTo = null
					}

					if (event.parentNode.querySelector('.assistant') && event.parentNode.querySelector('.assistant').value !== '') {
						week.assistant = event.parentNode.querySelector('.assistant').value
					} else {
						week.assistant = null
					}
				}
			},
            missingRecord(publisher) {
				var publisherRecords = ''
				monthlyReportVue.months.slice(0, monthlyReportVue.months.findIndex(elem=>elem.abbr == monthlyReportVue.month.abbr) + 1).forEach(elem=>{
					if (publisher.report.currentServiceYear[`${elem.abbr}`].sharedInMinistry !== true) {
						publisherRecords += '; ' + elem.fullName
					}
				})
				
				return publisherRecords.replace('; ','')
			},
        }
    })
}

document.querySelector('#attendance').innerHTML = `<template>
	<div v-if="display == true">
		<h2 class="w3-center">MONTHLY ATTENDANCE</h2>
		<h3>{{ month.fullName }} {{ year }}</h3>
		<div class="w3-row-padding w3-grayscale" style="margin-top:4px">
			<div v-for="(meeting, count) in currentMonth.meetings" :key="count" class="w3-col l3 m6 w3-margin-bottom">
				<div style="padding-bottom:10px" :class="mode()">
					<div class="w3-container main">
						<h3>{{ meeting.name }} Meeting</h3>
						<p v-for="(attendance) in meeting.attendance">{{ attendance.name.replace('Week', ' Week') }}: <input :class="inputMode(attendance.name)" type="number" min="0" max="9999" style="width: 60px;" :value="attendance.count" @change="handleInputChange(attendance, $event.target)"></p>
						<hr style="margin:0; padding:0">
						<h5>Total Attendance: <strong>{{ totalAttendance(meeting) }}</strong></h5>
						<h5>Average Attendance: <strong>{{ averageAttendance(meeting) }}</strong></h5>
					</div>
				</div>
			</div>
		</div>
		<h2 v-if="reportEntry() == true" class="w3-center">ATTENDANCE RECORD</h2>
		<div v-if="reportEntry() == true" v-for="(meeting, count) in meetingAttendanceRecord.meetings" :key="meeting.name + '|' + count" class="w3-row-padding w3-grayscale">
			<h3>{{ meeting.name }}</h3>
			<div v-for="(serviceYear, count) in serviceYears" :key="serviceYear + '|' + count">
				<div :class="mode()" style="display:flex; flex-wrap:wrap; padding:10px;margin-bottom:15px">
					<div style="overflow-x: scroll;">
						<table>
							<thead>
								<tr>
									<th>Service Year {{ meeting[serviceYear].year }}</th>
									<th>Number of Meetings</th>
									<th>Total Attendance</th>
									<th>Average Attendance Each Week</th>
								</tr>
							</thead>
							<tbody>
								<tr v-for="(month, count) in months" :key="month.abbr + '|' + count + '|' + serviceYear">
									<td>{{ month.fullName }}</td>
									<td><input :class="inputMode('numberOfMeetings')" type="number" min="0" max="5" style="width: 30px;" :value="meeting[serviceYear][month.abbr].numberOfMeetings" @change="handleRecordInputChange(meeting[serviceYear][month.abbr], $event.target)"></td>
									<td><input :class="inputMode('totalAttendance')" type="number" min="0" max="9999" style="width: 60px;" :value="meeting[serviceYear][month.abbr].totalAttendance" @change="handleRecordInputChange(meeting[serviceYear][month.abbr], $event.target)"></td>
									<td><input :class="inputMode('averageAttendanceEachWeek')" type="number" min="0" max="9999" style="width: 60px;" :value="meeting[serviceYear][month.abbr].averageAttendanceEachWeek" @change="handleRecordInputChange(meeting[serviceYear][month.abbr], $event.target)"></td>
								</tr>
							</tbody>
						</table>
					</div>
				</div>
			</div>
		</div>
    </div>
</template>`


function processAttendance() {

    attendanceVue = new Vue({
        el: document.querySelector('#attendance'),
        data: {
            saved: 0,
            display: false,
			currentMonth: {},
			meetingAttendanceRecord: {},
			serviceYears: ["currentServiceYear", "lastServiceYear"],
            weeks: ['1st week', '2nd week', '3rd week', '4th week', '5th week'],
            meetings: ['Midweek Meeting', 'Weekend Meeting'],
            months: [{"abbr": "sept", "fullName": "September"}, {"abbr": "oct", "fullName": "October"}, {"abbr": "nov", "fullName": "November"}, {"abbr": "dec", "fullName": "December"}, {"abbr": "jan", "fullName": "January"}, {"abbr": "feb", "fullName": "February"}, {"abbr": "mar", "fullName": "March"}, {"abbr": "apr", "fullName": "April"}, {"abbr": "may", "fullName": "May"}, {"abbr": "jun", "fullName": "June"}, {"abbr": "jul", "fullName": "July"}, {"abbr": "aug", "fullName": "August"} ],

        },
        computed: {
            congregationName() {
                return congregationVue.congregation.congregationName
            },
            searchTerms() {
                return navigationVue.searchTerms
            },
			selectedGroup() {
                return navigationVue.fieldServiceGroup
            },
			allGroups() {
                return allPublishersVue.allGroups
            },
			month() {
				return monthlyReportVue.months.slice(3).concat(monthlyReportVue.months.slice(0,3))[new Date().getMonth()]
            },
			year() {
				var currentYear;
				if (new Date().getMonth() == 0) {
					currentYear = new Date().getFullYear() - 1
				} else {
					currentYear = new Date().getFullYear()
				}

				if (attendanceVue.months.findIndex(elem=>elem.abbr == this.month.abbr) < 4) {
					this.meetingAttendanceRecord.meetings[0].currentServiceYear.year = currentYear + 1
					this.meetingAttendanceRecord.meetings[1].currentServiceYear.year = currentYear + 1
					this.meetingAttendanceRecord.meetings[0].lastServiceYear.year = currentYear
					this.meetingAttendanceRecord.meetings[1].lastServiceYear.year = currentYear
				} else {
					this.meetingAttendanceRecord.meetings[0].currentServiceYear.year = currentYear
					this.meetingAttendanceRecord.meetings[1].currentServiceYear.year = currentYear
					this.meetingAttendanceRecord.meetings[0].lastServiceYear.year = currentYear - 1
					this.meetingAttendanceRecord.meetings[1].lastServiceYear.year = currentYear - 1
				}

				return currentYear
            },
        },
        methods: {
			reportEntry() {
                return currentUser.currentProfile == 'Secretary'
            },
			inputMode(currentClass) {
				return currentClass + ' ' + mode.replace('w3-card ','')
			},
			mode() {
				return mode
			},
			cleanDate(date) {
                const currentDate = new Date(date);

                const formattedDate = `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1).toString().padStart(2, '0')}-${currentDate.getDate().toString().padStart(2, '0')}`;
				
                return formattedDate
            },
			averageMonthlyAttendance(meeting, serviceYear, month) {
				var total = meeting[`${serviceYear}`][`${month}`].totalAttendance,
				count = meeting[`${serviceYear}`][`${month}`].numberOfMeetings
				if (total == null || count == null) {
					return
				} else {
					return Number((total / count).toFixed(2))
				}
			},
			averageAttendance(attendance) {
				const numbersArray = attendance.attendance.filter(elem=>elem.count !== null)
				if (numbersArray.length === 0) {
					this.meetingAttendanceRecord.meetings.filter(elem=>elem.name.startsWith(attendance.name))[0].currentServiceYear[`${this.month.abbr}`].numberOfMeetings = null
					this.meetingAttendanceRecord.meetings.filter(elem=>elem.name.startsWith(attendance.name))[0].currentServiceYear[`${this.month.abbr}`].totalAttendance = null
					this.meetingAttendanceRecord.meetings.filter(elem=>elem.name.startsWith(attendance.name))[0].currentServiceYear[`${this.month.abbr}`].averageAttendanceEachWeek = null
					return null; // Return 0 for an empty array (avoid division by zero)
				}
				
				const sum = numbersArray.reduce((accumulator, currentValue) => {
					return accumulator + currentValue.count;
				}, 0);
				
				var average = Number((sum / numbersArray.length).toFixed(2));

				this.meetingAttendanceRecord.meetings.filter(elem=>elem.name.startsWith(attendance.name))[0].currentServiceYear[`${this.month.abbr}`].numberOfMeetings = numbersArray.length 
				this.meetingAttendanceRecord.meetings.filter(elem=>elem.name.startsWith(attendance.name))[0].currentServiceYear[`${this.month.abbr}`].totalAttendance = sum
				this.meetingAttendanceRecord.meetings.filter(elem=>elem.name.startsWith(attendance.name))[0].currentServiceYear[`${this.month.abbr}`].averageAttendanceEachWeek = average
				
				return average;
			  },
			totalAttendance(attendance) {
				const numbersArray = attendance.attendance.filter(elem=>elem.count !== null)
				if (numbersArray.length === 0) {
					return null; // Return 0 for an empty array (avoid division by zero)
				}
				
				return numbersArray.reduce((accumulator, currentValue) => {
					return accumulator + currentValue.count;
				}, 0);
			},
			handleRecordInputChange(attendance, event) {
				if (event.value == '' || event.value == '0') {
					attendance[`${event.className.split(' ')[0]}`] = null
				} else {
					attendance[`${event.className.split(' ')[0]}`] = Number(event.value)
				}
				DBWorker.postMessage({ storeName: 'attendance', action: "save", value: [this.meetingAttendanceRecord]});
			},
            handleInputChange(attendance, event) {
				if (event.value == '' || event.value == '0') {
					attendance.count = null
				} else {
					attendance.count = Number(event.value)
				}
				DBWorker.postMessage({ storeName: 'attendance', action: "save", value: [this.currentMonth]});
			},
			sumHours(publisher) {
                var totalHours = 0
                this.months.forEach(elem=>{
                    const value = publisher.report.currentServiceYear[elem.abbr].hours
                    if (value !== null) {
                        totalHours = totalHours + value
                    }
                })
                return totalHours
            }
        }
    })
}


document.querySelector('#branchReport').innerHTML = `<template>
	<div v-if="display == true">
		<h5 class="w3-center">Field Service and Meeting Attendance (S-1)</h5>
		<h2 class="w3-center">{{ month.fullName }} {{ year }}</h2>
		<div class="w3-row-padding w3-grayscale" style="margin-top:4px">
			<div class="w3-col l3 m6 w3-margin-bottom">
				<div :class="mode()">
					<div class="w3-container main">
						<h4>Active Publishers</h4>
						<h3><span>{{ activePublishers() }}</span><i style="margin-left:10px" @click="copy($event.target)" title="Copy" class="fas fa-copy"></i></h3>
						<h4>Average Weekend Meeting Attendance</h4>
						<h3><span>{{ averageAttendance() }}</span><i style="margin-left:10px" @click="copy($event.target)" title="Copy" class="fas fa-copy"></i></h3>
					</div>
				</div>
			</div>
			<div class="w3-col l3 m6 w3-margin-bottom">
				<div :class="mode()">
					<div class="w3-container main">
						<h3>Publishers</h3>
						<h4>Number of Reports</h4>
						<h3><span>{{ publisherNumberOfReports() }}</span><i style="margin-left:10px" @click="copy($event.target)" title="Copy" class="fas fa-copy"></i></h3>
						<h4>Bible Studies</h4>
						<h3><span>{{ publisherBibleStudies() }}</span><i style="margin-left:10px" @click="copy($event.target)" title="Copy" class="fas fa-copy"></i></h3>
					</div>
				</div>
			</div>
			<div class="w3-col l3 m6 w3-margin-bottom">
				<div :class="mode()">
					<div class="w3-container main">
						<h3>Auxiliary Pioneers</h3>
						<h4>Number of Reports</h4>
						<h3><span>{{ auxiliaryPioneerNumberOfReports() }}</span><i style="margin-left:10px" @click="copy($event.target)" title="Copy" class="fas fa-copy"></i></h3>
						<h4>Hours</h4>
						<h3><span>{{ auxiliaryPioneerHours() }}</span><i style="margin-left:10px" @click="copy($event.target)" title="Copy" class="fas fa-copy"></i></h3>
						<h4>Bible Studies</h4>
						<h3><span>{{ auxiliaryPioneerBibleStudies() }}</span><i style="margin-left:10px" @click="copy($event.target)" title="Copy" class="fas fa-copy"></i></h3>
					</div>
				</div>
			</div>
			<div class="w3-col l3 m6 w3-margin-bottom">
				<div :class="mode()">
					<div class="w3-container main">
						<h3>Regular Pioneers</h3>
						<h4>Number of Reports</h4>
						<h3><span>{{ regularPioneerNumberOfReports() }}</span><i style="margin-left:10px" @click="copy($event.target)" title="Copy" class="fas fa-copy"></i></h3>
						<h4>Hours</h4>
						<h3><span>{{ regularPioneerHours() }}</span><i style="margin-left:10px" @click="copy($event.target)" title="Copy" class="fas fa-copy"></i></h3>
						<h4>Bible Studies</h4>
						<h3><span>{{ regularPioneerBibleStudies() }}</span><i style="margin-left:10px" @click="copy($event.target)" title="Copy" class="fas fa-copy"></i></h3>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>`

function branchReportDetails() {

    branchReportVue = new Vue({
        el: document.querySelector('#branchReport'),
        data: {
            display: false,
            pdfFile: "",
			selectedPublisher: {},
        },
        computed: {
			month() {
				return monthlyReportVue.months.slice(3).concat(monthlyReportVue.months.slice(0,3))[new Date().getMonth()]
            },
			year() {
				var currentYear;
				if (new Date().getMonth() == 0) {
					currentYear = new Date().getFullYear() - 1
				} else {
					currentYear = new Date().getFullYear()
				}
				return currentYear
            },
        },
        methods: {
			inputMode(currentClass) {
				return currentClass + ' ' + mode.replace('w3-card ','')
			},
			mode() {
				return mode
			},
			activePublishers() {
				if (!allPublishersVue.publishers[0]) {
					return 0
				} else if (!allPublishersVue.publishers[0].active) {
					allPublishersVue.publishers.forEach(elem=>{
						if (allPublishersVue.checkStatus(elem.report) == 'Active') {
							elem.active = true
							if (elem.reactivated) {
								delete elem.reactivated
							}
						} else {
							if (!elem.reactivated) {
								elem.active = false
							}
						}
					})
				}
				return allPublishersVue.publishers.filter(elem=>elem.active == true).length
			},
			averageAttendance() {
                return attendanceVue.averageAttendance(attendanceVue.currentMonth.meetings[1]) ? attendanceVue.averageAttendance(attendanceVue.currentMonth.meetings[1]) : 0
            },
			publisherNumberOfReports() {
				return monthlyReportVue.lateReports.filter(elem=>elem.report.sharedInMinistry).length + monthlyReportVue.publishers.filter(elem=>elem.report.currentServiceYear[`${monthlyReportVue.month.abbr}`].sharedInMinistry !== null && elem.report.currentServiceYear[`${monthlyReportVue.month.abbr}`].auxiliaryPioneer !== true && !elem.privilege.includes("Regular Pioneer")).length
			},
			auxiliaryPioneerNumberOfReports() {
				return monthlyReportVue.lateReports.filter(elem=>elem.report.sharedInMinistry && elem.report.auxiliaryPioneer == true).length + monthlyReportVue.publishers.filter(elem=>elem.report.currentServiceYear[`${monthlyReportVue.month.abbr}`].sharedInMinistry !== null && elem.report.currentServiceYear[`${monthlyReportVue.month.abbr}`].auxiliaryPioneer == true).length
			},
			regularPioneerNumberOfReports() {
				return monthlyReportVue.lateReports.filter(elem=>elem.report.sharedInMinistry && elem.publisher.privilege.includes("Regular Pioneer")).length + monthlyReportVue.publishers.filter(elem=>elem.report.currentServiceYear[`${monthlyReportVue.month.abbr}`].sharedInMinistry !== null && elem.privilege.includes('Regular Pioneer')).length
			},
			publisherBibleStudies() {
				var totalBibleStudies = monthlyReportVue.lateReports.filter(elem=>elem.report.sharedInMinistry).map(elem=>elem.report.bibleStudies ? elem.report.bibleStudies : 0).concat(monthlyReportVue.publishers.filter(elem=>elem.report.currentServiceYear[`${monthlyReportVue.month.abbr}`].sharedInMinistry !== null).map(elem=>elem.report.currentServiceYear[`${monthlyReportVue.month.abbr}`].bibleStudies ? elem.report.currentServiceYear[`${monthlyReportVue.month.abbr}`].bibleStudies : 0))
				return totalBibleStudies.reduce((accumulator, currentValue) => Number(accumulator) + Number(currentValue), 0);
			},
			auxiliaryPioneerBibleStudies() {
				var totalBibleStudies = monthlyReportVue.lateReports.filter(elem=>elem.report.sharedInMinistry && elem.report.auxiliaryPioneer == true).map(elem=>elem.report.bibleStudies ? elem.report.bibleStudies : 0).concat(monthlyReportVue.publishers.filter(elem=>elem.report.currentServiceYear[`${monthlyReportVue.month.abbr}`].sharedInMinistry !== null && elem.report.currentServiceYear[`${monthlyReportVue.month.abbr}`].auxiliaryPioneer == true).map(elem=>elem.report.currentServiceYear[`${monthlyReportVue.month.abbr}`].bibleStudies ? elem.report.currentServiceYear[`${monthlyReportVue.month.abbr}`].bibleStudies : 0))
				return totalBibleStudies.reduce((accumulator, currentValue) => Number(accumulator) + Number(currentValue), 0);
			},
			regularPioneerBibleStudies() {
				var totalBibleStudies = monthlyReportVue.lateReports.filter(elem=>elem.report.sharedInMinistry && elem.publisher.privilege.includes("Regular Pioneer")).map(elem=>elem.report.bibleStudies ? elem.report.bibleStudies : 0).concat(monthlyReportVue.publishers.filter(elem=>elem.report.currentServiceYear[`${monthlyReportVue.month.abbr}`].sharedInMinistry !== null && elem.privilege.includes('Regular Pioneer')).map(elem=>elem.report.currentServiceYear[`${monthlyReportVue.month.abbr}`].bibleStudies ? elem.report.currentServiceYear[`${monthlyReportVue.month.abbr}`].bibleStudies : 0))
				return totalBibleStudies.reduce((accumulator, currentValue) => Number(accumulator) + Number(currentValue), 0);
			},
			auxiliaryPioneerHours() {
				var totalHours = monthlyReportVue.lateReports.filter(elem=>elem.report.sharedInMinistry && elem.report.auxiliaryPioneer == true).map(elem=>elem.report.hours ? elem.report.hours : 0).concat(monthlyReportVue.publishers.filter(elem=>elem.report.currentServiceYear[`${monthlyReportVue.month.abbr}`].sharedInMinistry !== null && elem.report.currentServiceYear[`${monthlyReportVue.month.abbr}`].auxiliaryPioneer == true).map(elem=>elem.report.currentServiceYear[`${monthlyReportVue.month.abbr}`].hours ? elem.report.currentServiceYear[`${monthlyReportVue.month.abbr}`].hours : 0))
				return totalHours.reduce((accumulator, currentValue) => Number(accumulator) + Number(currentValue), 0);
			},
			regularPioneerHours() {
				var totalHours = monthlyReportVue.lateReports.filter(elem=>elem.report.sharedInMinistry && elem.publisher.privilege.includes("Regular Pioneer")).map(elem=>elem.report.hours ? elem.report.hours : 0).concat(monthlyReportVue.publishers.filter(elem=>elem.report.currentServiceYear[`${monthlyReportVue.month.abbr}`].sharedInMinistry !== null && elem.privilege.includes('Regular Pioneer')).map(elem=>elem.report.currentServiceYear[`${monthlyReportVue.month.abbr}`].hours ? elem.report.currentServiceYear[`${monthlyReportVue.month.abbr}`].hours : 0))
				return totalHours.reduce((accumulator, currentValue) => Number(accumulator) + Number(currentValue), 0);
			},
			async copy(event) {
				//console.log(event.className)
				event.className = "fas fa-check"
				await shortWait()
				// Get the HTML content of the element
				var elementToCopy = event.parentNode.querySelector('span');
				var htmlContent = elementToCopy.innerHTML;
			
				// Create a temporary textarea element to hold the HTML content
				var tempTextArea = document.createElement('textarea');
				tempTextArea.value = htmlContent;
			
				// Append the textarea to the document (it doesn't have to be visible)
				document.body.appendChild(tempTextArea);
			
				// Select and copy the content
				tempTextArea.select();
				document.execCommand('copy');
			
				// Remove the temporary textarea
				document.body.removeChild(tempTextArea);
				await shortWait()
				event.className = "fas fa-copy"
			}
        }
    })
}

async function shortWait() {
    await new Promise((e) => setTimeout(e, 50));
}

async function oneMinuteWait() {
    await new Promise((e) => setTimeout(e, 60000));
}

function saveConfiguration() {
	configurationVue.saveConfiguration()
}

document.querySelector("#configuration").innerHTML = `<template>
    <div v-if="display == true">
		<h2 class="w3-center">SETTINGS</h2>
		<div class="w3-row-padding w3-grayscale">
			<div class="w3-margin-bottom">
				<div :class="mode()">
					<div class="w3-container">
						
						<p v-if="reportEntry == 'secretary' && reset !== true" style="margin-top:15px"><label>Congregation Name: </label></p>
						<p v-if="reportEntry == 'secretary' && reset !== true"><input :class="inputMode('name w3-input')" type="text" :value="configuration.congregationName" @change="saveConfiguration()"></p>
						<!--p v-if="reportEntry == 'acct' && reset !== true" style="margin-top:15px"><label>Congregation or circuit: </label></p>
						<p v-if="reportEntry == 'acct' && reset !== true"><input :class="inputMode('name w3-input')" type="text" :value="configuration.congregationName" @change="saveConfiguration()"></p-->
						<p v-if="reportEntry == 'secretary' && reset !== true" style="margin-top:15px"><label>City: </label></p>
						<p v-if="reportEntry == 'secretary' && reset !== true"><input :class="inputMode('city w3-input')" type="text" :value="configuration.city" @change="saveConfiguration()"></p>
						<p v-if="reportEntry == 'secretary' && reset !== true" style="margin-top:15px"><label>Province or state: </label></p>
						<p v-if="reportEntry == 'secretary' && reset !== true"><input :class="inputMode('province w3-input')" type="text" :value="configuration.province" @change="saveConfiguration()"></p>
						<p v-if="reportEntry == 'secretary' && reset !== true"><label>Congregation Address: </label></p>
						<p v-if="reportEntry == 'secretary' && reset !== true"><input :class="inputMode('address w3-input')" type="text" :value="configuration.address" @change="saveConfiguration()"></p>
						<p v-if="reportEntry == 'secretary' && reset !== true"><label>Congregation Email: </label></p>
						<p v-if="reportEntry == 'secretary' && reset !== true"><input :class="inputMode('email w3-input')" type="text" :value="configuration.email" @change="saveConfiguration()"></p>
						
						<p v-if="reportEntry == 'secretary' && reset !== true"><label>Field Service Groups:</label></p>
						<p v-if="reportEntry == 'secretary' && reset !== true" v-for="(group, count) in configuration.fieldServiceGroups" :key="group">
							<input :class="inputMode('fieldServiceGroups w3-input')" type="text" :value="group" onchange="saveConfiguration()">
							<span style="height:40px;padding:0" title="Add Group" class="w3-button w3-black">
								<i style="color:#2b6549;padding:13px" onclick="addRecord(this)" class="fa fa-plus"></i>
							</span>
							<span v-if="count !== 0" style="margin-left:2px;height:40px;;padding:0" title="Remove Group" class="w3-button w3-black">
								<i style="color:#b02c07;padding:13px" onclick="removeRecord(this)" class="fa fa-minus"></i>
							</span>
						</p>
						<p v-if="reportEntry == 'secretary' && reset !== true" v-for="(group, count) in configuration.fieldServiceGroups" :key="group + '|' + count">
							<label>{{ group.toUpperCase() }}</label>
							<br>
							<label>Overseer:</label>
							<select @change="saveConfiguration()" :class="inputMode('overseer w3-input')">
								<option v-if="!appointed().includes(currentGroup(group).overseer)" value="">Select Overseer</option>
								<option v-if="appointed().includes(currentGroup(group).overseer)" :value="currentGroup(group).overseer">{{ currentGroup(group).overseer }}</option>
								<option v-for="elder in appointed().filter(elem=>elem !== currentGroup(group).overseer)" :value="elder">{{ elder }}</option>
							</select>
							<label>Assistant:</label>
							<select @change="saveConfiguration()" :class="inputMode('assistant w3-input')">
								<option v-if="!appointed().includes(currentGroup(group).assistant)" value="">Select Assistant</option>
								<option v-if="appointed().includes(currentGroup(group).assistant)" :value="currentGroup(group).assistant">{{ currentGroup(group).assistant }}</option>
								<option v-for="elder in appointed().filter(elem=>elem !== currentGroup(group).assistant)" :value="elder">{{ elder }}</option>
							</select>
						</p>
						<p v-if="reportEntry == 'secretary' && reset !== true"><label>Coordinator:</label></p>
						<p v-if="reportEntry == 'secretary' && reset !== true && elders().length !== 0">
							<select @change="saveConfiguration()" :class="inputMode('cboe w3-input')" :value="configuration.cboe">
								<option v-if="!elders().includes(configuration.cboe)" value="">Select Coordinator</option>
								<option v-if="elders().includes(configuration.cboe)" :value="configuration.cboe">{{ configuration.cboe }}</option>
								<option v-for="elder in elders().filter(elem=>elem !== configuration.cboe)" :value="elder">{{ elder }}</option>
							</select>
						</p>
						<p v-if="reportEntry == 'secretary' && reset !== true"><label>Secretary:</label></p>
						<p v-if="reportEntry == 'secretary' && reset !== true && elders().length !== 0">
							<select @change="saveConfiguration()" :class="inputMode('sec w3-input')">
								<option v-if="!elders().includes(configuration.sec)" value="">Select Secretary</option>
								<option v-if="elders().includes(configuration.sec)" :value="configuration.sec">{{ configuration.sec }}</option>
								<option v-for="elder in elders().filter(elem=>elem !== configuration.sec)" :value="elder">{{ elder }}</option>
							</select>
						</p>
						<p v-if="reportEntry == 'secretary' && reset !== true"><label>Assistant Secretary:</label></p>
						<p v-if="reportEntry == 'secretary' && reset !== true && appointed().length !== 0">
							<select @change="saveConfiguration()" :class="inputMode('assistantSec w3-input')">
								<option v-if="!appointed().includes(configuration.assistantSec)" value="">Select Assistant Secretary</option>
								<option v-if="appointed().includes(configuration.assistantSec)" :value="configuration.assistantSec">{{ configuration.assistantSec }}</option>
								<option v-for="elder in appointed().filter(elem=>elem !== configuration.assistantSec)" :value="elder">{{ elder }}</option>
							</select>
						</p>
						<p v-if="reportEntry == 'secretary' && reset !== true"><label>Account Servant:</label></p>
						<p v-if="reportEntry == 'secretary' && reset !== true && appointed().length !== 0">
							<select @change="saveConfiguration()" :class="inputMode('acct w3-input')">
								<option v-if="!appointed().includes(configuration.acct)" value="">Select Account Servant</option>
								<option v-if="appointed().includes(configuration.acct)" :value="configuration.acct">{{ configuration.acct }}</option>
								<option v-for="elder in appointed().filter(elem=>elem !== configuration.acct)" :value="elder">{{ elder }}</option>
							</select>
						</p>
						<p v-if="reportEntry == 'secretary' && reset !== true"><label>Service Overseer:</label></p>
						<p v-if="reportEntry == 'secretary' && reset !== true && elders().length !== 0">
							<select @change="saveConfiguration()" :class="inputMode('so w3-input')">
								<option v-if="!elders().includes(configuration.so)" value="">Select Service Overseer</option>
								<option v-if="elders().includes(configuration.so)" :value="configuration.so">{{ configuration.so }}</option>
								<option v-for="elder in elders().filter(elem=>elem !== configuration.so)" :value="elder">{{ elder }}</option>
							</select>
						</p>

						<h4 id="status1"></h4>
						<h4 id="status2"></h4>
						<h4 id="status3"></h4>
						
						<div v-if="reportEntry == 'secretary' || reportEntry == 'lmo'" id="midweekMeetingDay">
							<label>Midweek Meeting Day: 
							<select v-model="midweekMeetingDay" @change="setMeetingDay()" :class="inputMode('appearance w3-input')">
								<option v-for="day in weekdays" :value="day">{{ day }}</option>
							</select></label>
						</div>
						<div v-if="reportEntry == 'secretary' || reportEntry == 'lmo'" id="midweekMeetingTime">
							<label>Midweek Meeting Time: 
							<input v-model="midweekMeetingTime" @change="setMeetingTime()" type="time" :class="inputMode('appearance w3-input')"></label>
						</div>
						<div v-if="profiles().length > 1" id="profile">
							<label>Profile: 
							<select v-model="selectedProfile" @change="setProfile($event.target)" :class="inputMode('appearance w3-input')">
								<option v-for="profile in profiles()" :value="profile">{{ profile }}</option>
							</select></label>
						</div>
						<label>Appearance: 
						<select @change="displayMode($event.target)" :class="inputMode('appearance w3-input')">
							<option :value="currentMode()">{{ currentMode() }}</option>
							<option v-for="mode in ['System', 'Light', 'Dark'].filter(elem=>elem !== currentMode())" :value="mode">{{ mode }}</option>
						</select></label>
						<p v-if="reportEntry == 'secretary' || reportEntry == 'lmo' || reportEntry == 'acct'">
							<input type="file" id="pdfFile" accept=".pdf,.jpg,.jpeg,.png">
							<p v-if="reportEntry == 'secretary' || reportEntry == 'lmo' || reportEntry == 'acct'"><input :class="inputMode('fileName w3-input')" type="text" placeholder="File Name" @click="fileName($event.target)"></p>
							<button :class="buttonMode('w3-button w3-dark-grey')" @click="saveFile()" v-if="reportEntry == 'secretary' || reportEntry == 'lmo' || reportEntry == 'acct'"><i class="fas fa-save"> </i> Save File</button>
						</p>
						<div>
							<div class="main">
								<button v-if="reportEntry == 'secretary'" :class="buttonMode('w3-button w3-dark-grey')" @click="publisherDetail($event.target)">New Publisher</button>
								<button v-if="reportEntry == 'lmo'" :class="buttonMode('w3-button w3-dark-grey')" @click="publisherDetail($event.target)">New Enrolment</button>
								<button v-if="reportEntry !== 'ter'" :class="buttonMode('w3-button w3-dark-grey')" @click="backupData($event.target)">Backup</button>
								<button :class="buttonMode('w3-button w3-dark-grey')" @click="resetConfiguration($event.target)">Reset</button>
							</div>
							<div v-if="reportEntry == 'secretary'" class="detail" style="display:none; border: 1px solid gray; padding:5px">
								<button :class="buttonMode('w3-button w3-dark-grey')" @click="publisherDetail($event.target)">Save</button>
								<button :class="buttonMode('w3-button w3-dark-grey')" @click="cancel($event.target)">Cancel</button>
								<h3 contenteditable="true" class="name">Publisher Name</h3>
								<p>
									<label>Date of Birth: <input v-if="publisher.dateOfBirth == null" type="date" :class="inputMode('dateOfBirth w3-input')"><input v-if="publisher.dateOfBirth !== null" type="date" :class="inputMode('dateOfBirth w3-input')"></label>
									<select :class="inputMode('gender w3-input')">
										<option v-for="gender in ['Select Gender', 'Male', 'Female']" :value="gender">{{ gender }}</option>
									</select>
								</p>
								
								<p>
									<label>Date of Baptism: <input v-if="publisher.dateOfBaptism == null" type="date" :class="inputMode('dateOfBaptism w3-input')"><input v-if="publisher.dateOfBaptism !== null" type="date" :class="inputMode('dateOfBaptism w3-input')" :value="cleanDate(publisher.dateOfBaptism)"></label>
									<select :class="inputMode('hope w3-input')">
										<option v-for="hope in hopes" :value="hope">{{ hope }}</option>
									</select>
								</p>
								<label v-for="(privilege, index) in privileges" :key="index" class="w3-input"><input type="checkbox" :name="privilege" class="privileges" :checked=publisher.privilege.includes(privilege)> {{ privilege }}</label>
								<p>
									<label>Field Service Group: 
									<select :class="inputMode('fieldServiceGroup w3-input')">
										<option value="">Select Group</option>
										<option v-for="group in allGroups" :value="group">{{ group }}</option>
									</select></label>
								</p>
								<div class="detail" style="padding:0 15px 15px 15px">
									<p><label>Phone Number: <input :class="inputMode('contactPhoneNumber w3-input')" type="tel" :value="publisher.contactInformation.phoneNumber"></label></p>
									<p><label>Address:<input :class="inputMode('contactAddress w3-input')" type="text" :value="publisher.contactInformation.address"></label></p>
									<p><label>Emergency Contact: <input :class="inputMode('emergencyContactName w3-input')" type="text" :value="publisher.emergencyContactInformation.name"></label></p>
									<p><label>Contact Number: <input :class="inputMode('emergencyContactPhoneNumber w3-input')" type="tel" :value="publisher.emergencyContactInformation.phoneNumber"></label></p>
								</div>
								<div style="overflow-x: scroll;">
									<table>
										<thead>
										<tr>
											<th>Service Year {{ publisher.report.currentServiceYear.year }}</th>
											<th>Shared in Ministry</th>
											<th>Bible Studies</th>
											<th>Auxiliary Pioneer</th>
											<th>Hours (If pioneer or ﬁeld missionary)</th>
											<th>Remarks</th>
										</tr>
										</thead>
										<tbody>
										<tr v-for="(month, index) in months" :key="month.abbr" :class="month.abbr">
											<td>{{ month.fullName }}</td>
											<td><input class="sharedInMinistry" type="checkbox" :checked="publisher.report.currentServiceYear[month.abbr].sharedInMinistry !== null"></td>
											<td class="bibleStudies" contenteditable="true">{{ publisher.report.currentServiceYear[month.abbr].bibleStudies }}</td>
											<td><input class="auxiliaryPioneer" type="checkbox" :checked="publisher.report.currentServiceYear[month.abbr].auxiliaryPioneer !== null"></td>
											<td class="hours" contenteditable="true">{{ publisher.report.currentServiceYear[month.abbr].hours }}</td>
											<td class="remarks" contenteditable="true">{{ publisher.report.currentServiceYear[month.abbr].remarks }}</td>
										</tr>
										<tr>
											<td></td>
											<td></td>
											<td></td>
											<td>Total</td>
											<td>{{ publisher.report.currentServiceYear.totalHours }}</td>
											<td contenteditable="true">{{ publisher.report.currentServiceYear.totalRemarks }}</td>
										</tr>
										</tbody>
									</table>
								</div>
							</div>
							<div v-if="reportEntry == 'lmo'" class="detail" style="display:none; border: 1px solid gray; padding:5px">
								<button :class="buttonMode('w3-button w3-dark-grey')" @click="publisherDetail($event.target)">Save</button>
								<button :class="buttonMode('w3-button w3-dark-grey')" @click="cancel($event.target)">Cancel</button>
								<h3 contenteditable="true" class="name">Name</h3>
								<p>
									<select :class="inputMode('gender w3-input')">
										<option v-for="gender in ['Select Gender', 'Male', 'Female']" :value="gender">{{ gender }}</option>
									</select>
								</p>
								<div class="detail" style="padding:0 15px 15px 15px">
									<p><label>Phone Number: <input :class="inputMode('contactPhoneNumber w3-input')" type="tel" :value="publisher.contactInformation.phoneNumber"></label></p>
									<p><label>Address:<input :class="inputMode('contactAddress w3-input')" type="text" :value="publisher.contactInformation.address"></label></p>
								</div>
							</div>
						</div>
						<p>
							<div v-if="reportEntry == 'secretary' || reportEntry == 'lmo' || reportEntry == 'so'" id="export">
								<label><input type="radio" name="exportGroup" value="all" style="margin-right: 5px;" checked>All</label>
								<br v-if="reportEntry == 'secretary'">
								<label v-if="reportEntry == 'secretary'"><input type="radio" name="exportGroup" value="accounts" style="margin-right: 5px;">Accounts</label>
								<br v-if="reportEntry == 'secretary'">
								<label v-if="reportEntry == 'secretary'"><input type="radio" name="exportGroup" value="reportEntry" style="margin-right: 5px;">Report Entry</label>
								<br v-if="reportEntry == 'secretary'">
								<label v-if="reportEntry == 'secretary'"><input type="radio" name="exportGroup" value="lifeAndMinistry" style="margin-right: 5px;">Life and Ministry</label>
								<br v-if="reportEntry == 'lmo'">
								<label v-if="reportEntry == 'lmo'"><input type="radio" name="exportGroup" value="lifeAndMinistryAssistant" style="margin-right: 5px;">Life and Ministry</label>
								<br v-if="reportEntry == 'secretary'">
								<label v-if="reportEntry == 'secretary'"><input type="radio" name="exportGroup" value="serviceOverseer" style="margin-right: 5px;">Service Overseer</label>
								<br v-if="reportEntry == 'so'">
								<label v-if="reportEntry == 'so'"><input type="radio" name="exportGroup" value="territoryServant" style="margin-right: 5px;">Territory Servant</label>
							</div>
							<button v-if="reportEntry !== 'ter'" :class="buttonMode('w3-button w3-dark-grey')" @click="exportData()">Export</button>
							<button :class="buttonMode('w3-button w3-dark-grey')" @click="importData()">Import</button>
							<button :class="buttonMode('w3-button w3-dark-grey')" @click="reloadPage()"><i class="fas fa-sync"></i> Reload</button>
							<hr>
							<input type="file" id="dataFile" accept=".txt, .zip">
						</p>
						<!--div>
							<p style="padding: 5px">{{ currentUser.selectedQuestion }}</p>
							<p style="padding: 5px">{{ currentUser.answer }}</p>
						</div-->
					</div>
				</div>
			</div>
		</div>
	</div>
</template>`;

function processConfiguration() {

    configurationVue = new Vue({
        el: document.querySelector('#configuration'),
        data: {
            configuration: {},
            display: false,
            reset: false,
			reportEntry: false,
			publisher: {},
			selectedProfile: '',
			midweekMeetingDay: '',
			midweekMeetingTime: '',
			fieldServiceGroupDetails: [],
			weekdays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
			hopes: ['Unbaptized Publisher', 'Other Sheep', 'Anointed'],
			privileges: ['Elder', 'Ministerial Servant', 'Regular Pioneer', 'Special Pioneer', 'Field Missionary'],
            months: [{"abbr": "sept", "fullName": "September"}, {"abbr": "oct", "fullName": "October"}, {"abbr": "nov", "fullName": "November"}, {"abbr": "dec", "fullName": "December"}, {"abbr": "jan", "fullName": "January"}, {"abbr": "feb", "fullName": "February"}, {"abbr": "mar", "fullName": "March"}, {"abbr": "apr", "fullName": "April"}, {"abbr": "may", "fullName": "May"}, {"abbr": "jun", "fullName": "June"}, {"abbr": "jul", "fullName": "July"}, {"abbr": "aug", "fullName": "August"} ],
        },
        computed: {
            publishersCount() {
                return allPublishersVue.publishers.length
            },
			selectedGroup() {
                return navigationVue.fieldServiceGroup
            },
			allGroups() {
                return navigationVue.allGroups
            },
			currentUser() {
				return currentUser
			}
        },
        methods: {
			setMeetingDay() {
				this.configuration.midweekMeetingDay = this.midweekMeetingDay
				DBWorker.postMessage({ storeName: 'configuration', action: "save", value: [this.configuration]});
			},
			setMeetingTime() {
				this.configuration.midweekMeetingTime = this.midweekMeetingTime
				DBWorker.postMessage({ storeName: 'configuration', action: "save", value: [this.configuration]});
			},
			currentProfile() {
				return currentUser.currentProfile
			},
			currentGroup(group) {
				var detail = this.fieldServiceGroupDetails.filter(elem=>elem.name == group)
				if (detail.length !== 0) {
					return detail[0]
				} else {
					return {}
				}
			},
			fileName(event) {
				if (document.querySelector('#pdfFile') && document.querySelector('#pdfFile').files[0]) {
					event.value = document.querySelector('#pdfFile').files[0].name.split('.')[0]
				} else {
					event.value = ''
				}
			},
			setProfile(event) {
				currentUser.currentProfile = event.value
				DBWorker.postMessage({ storeName: 'configuration', action: "save", value: [{"name": "Current Profile", "value": event.value}]});
				if (currentUser.currentProfile == 'Secretary') {
					navigationVue.buttons = [{"title": "CONG", "function": "congregationVue"}, {"title": "CONTACTS", "function": "contactInformationVue"}, {"title": "RECORDS", "function": "allPublishersVue"}, {"title": "GROUPS", "function": "fieldServiceGroupsVue"}, {"title": "REPORTS", "function": "missingReportVue"}]
					this.reportEntry = 'secretary'
				} else if (currentUser.currentProfile == 'Secretary - Assistant') {
					navigationVue.buttons = [{"title": "REPORTS", "function": "missingReportVue"}, {"title": "CURRENT", "function": "monthlyReportVue"}, {"title": "ATTENDANCE", "function": "attendanceVue"}, {"title": "BRANCH", "function": "branchReportVue"}]
					this.reportEntry = 'reportEntry'
				} else if (currentUser.currentProfile == 'Life and Ministry Overseer') {
					navigationVue.buttons = [{"title": "ASSIGNMENTS", "function": "allAssignmentsVue"}, {"title": "SCHEDULE", "function": "scheduleVue"}, {"title": "PARTICIPANTS", "function": "allParticipantsVue"}, {"title": "CONTACTS", "function": "contactInformationVue"}]
					this.reportEntry = 'lmo'
				} else if (currentUser.currentProfile == 'Life and Ministry Assistant') {
					navigationVue.buttons = [{"title": "ASSIGNMENTS", "function": "allAssignmentsVue"}, {"title": "SCHEDULE", "function": "scheduleVue"}, {"title": "PARTICIPANTS", "function": "allParticipantsVue"}, {"title": "CONTACTS", "function": "contactInformationVue"}]
					this.reportEntry = 'lma'
				} else if (currentUser.currentProfile == 'Service Overseer') {
					navigationVue.buttons = [{"title": "CONG", "function": "congregationVue"}, {"title": "TERRITORY", "function": "territoryVue"}, {"title": "CONTACTS", "function": "contactInformationVue"}, {"title": "GROUPS", "function": "fieldServiceGroupsVue"}]
					this.reportEntry = 'so'
				} else if (currentUser.currentProfile == 'Territory Map' || currentUser.currentProfile == 'Territory Servant') {
					navigationVue.buttons = [{"title": "TERRITORY", "function": "territoryVue"}]
					this.reportEntry = 'ter'
				} else if (currentUser.currentProfile == 'Territory Servant') {
					navigationVue.buttons = [{"title": "TERRITORY", "function": "territoryVue"}]
					this.reportEntry = 'terServant'
				} else if (currentUser.currentProfile == 'Accounts Servant') {
					navigationVue.buttons = [{"title": "ENTRY", "function": "entryVue"}, {"title": "FILE", "function": "fileVue"}, {"title": "APPROVALS", "function": "approvalsVue"}, {"title": "ARCHIVE", "function": "archiveVue"}]
					this.reportEntry = 'acct'
				}
			},
			profiles() {
				return currentUser.accesses.map(elem=>elem.replace('secretary','Secretary').replace('sendReport','Secretary - Assistant').replace('lmo','Life and Ministry Overseer').replace('lma','Life and Ministry Assistant').replace('so','Service Overseer').replace('terServant','Territory Servant').replace('ter','Territory Map').replace('acct','Accounts Servant')).sort()
			},
			elders() {
				return allPublishersVue.publishers.filter(elem=>elem.privilege.includes('Elder')).map(elem=>elem.name)
			},
			appointed() {
				return allPublishersVue.publishers.filter(elem=>elem.privilege.includes('Elder') || elem.privilege.includes('Ministerial Servant')).map(elem=>elem.name)
			},
			inputMode(currentClass) {
				return currentClass + ' ' + mode.replace('w3-card ','')
			},
			buttonMode(currentClass) {
				return currentClass + ' ' + mode.replace('w3-card ','').replace('white','light-grey').replace('black','dark-grey')
			},
			displayMode(event) {
				var selectedMode
				if (event.value !== 'System') {
					selectedMode = event.value
				} else {
					if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
						selectedMode = 'Dark'
					} else {
						selectedMode = 'Light'
					}
				}

				currentMode = event.value

				if (logged) {
					DBWorker.postMessage({ storeName: 'configuration', action: "save", value: [{"name": "Display", "value": currentMode}]});
				}
			
				if ((mode == 'w3-card w3-black' && selectedMode == 'Dark') || (mode == 'w3-card w3-white' && selectedMode == 'Light')) {
					return
				} else if (mode == 'w3-card w3-black') {
					mode = 'w3-card w3-white'
				} else {
					mode = 'w3-card w3-black'
				}

				document.body.querySelectorAll('.w3-white').forEach(elem=>{
					elem.classList.toggle("w3-white");
					elem.classList.toggle("w3-yellow");
				})
				document.body.querySelectorAll('.w3-black').forEach(elem=>{
					elem.classList.toggle("w3-black");
					elem.classList.toggle("w3-blue");
				})
				document.body.querySelectorAll('.w3-yellow').forEach(elem=>{
					elem.classList.toggle("w3-black");
					elem.classList.toggle("w3-yellow");
				})
				document.body.querySelectorAll('.w3-blue').forEach(elem=>{
					elem.classList.toggle("w3-blue");
					elem.classList.toggle("w3-white");
				})
				document.body.querySelectorAll('.w3-light-grey').forEach(elem=>{
					elem.classList.toggle("w3-green");
					elem.classList.toggle("w3-light-grey");
				})
				document.body.querySelectorAll('.w3-dark-grey').forEach(elem=>{
					elem.classList.toggle("w3-red");
					elem.classList.toggle("w3-light-grey");
				})
				document.body.querySelectorAll('.w3-green').forEach(elem=>{
					elem.classList.toggle("w3-dark-grey");
					elem.classList.toggle("w3-green");
				})
				document.body.querySelectorAll('.w3-red').forEach(elem=>{
					elem.classList.toggle("w3-dark-grey");
					elem.classList.toggle("w3-red");
				})
				document.body.classList.toggle("w3-dark-grey");
				document.body.classList.toggle("w3-light-grey");
			},
			mode() {
				return mode
			},
			currentMode() {
				return currentMode
			},
			reloadPage() {
				location.reload()
			},
			signOut() {
				signOut()
		  
							
			},
			async backupData() {
				await this.exportData()
				var recipient = ''
				var subject = 'Congregation Data Backup - ' + new Date();
				var body = `Dear Brothers:
Please find attached Congregation Data Backup.
Backup date: ${new Date()}.
Thanks a lot

`
				
				var mailtoLink = 'mailto:' + encodeURIComponent(recipient) +
								'?subject=' + encodeURIComponent(subject) +
								'&body=' + encodeURIComponent(body);

				window.location.href = mailtoLink;
			},
            async exportData() {
                var a = document.createElement("a");
				var file;
				const options = { year: 'numeric', month: 'long', day: 'numeric' };
				const access = getSelectedOption(document.getElementsByName("exportGroup")) || 'update'

				if (access == 'all') {
					file = new Blob([JSON.stringify({"exportType":"all", "configuration":configurationVue.configuration, "data":allPublishersVue.publishers, "territory":territoryVue.savedPolygons, "lifeAndMinistryEnrolments":allParticipantsVue.enrolments, "lifeAndMinistryAssignments":allAssignmentsVue.allAssignments, "attendance": [attendanceVue.currentMonth, attendanceVue.meetingAttendanceRecord], "account": entryVue.allEntries})], {type: 'text/plain'});
					await shortWait()
					await shortWait()
				} else if (access == 'reportEntry') {
					var currentConfiguration = JSON.parse(JSON.stringify(configurationVue.configuration))
					await shortWait()
					await shortWait()

					delete currentConfiguration.address
					delete currentConfiguration.email
					delete currentConfiguration.cboe
					delete currentConfiguration.so
					var currentData = JSON.parse(JSON.stringify(allPublishersVue.publishers.filter(elem=>elem.active == true || elem.reactivated == true)))
					await shortWait()
					await shortWait()

					currentData.forEach(elem=>{
						delete elem.hope
						delete elem.contactInformation.address
						delete elem.contactInformation.phoneNumber
						delete elem.dateOfBaptism
						delete elem.dateOfBirth
						delete elem.emergencyContactInformation
					})
					await shortWait()
					await shortWait()
					await shortWait()
					await shortWait()

					file = new Blob([JSON.stringify({"exportType":"reportEntry", "configuration":currentConfiguration, "data":currentData, "attendance": [attendanceVue.currentMonth, attendanceVue.meetingAttendanceRecord]})], {type: 'text/plain'});

				} else if (access == 'accounts') {
					var currentConfiguration = JSON.parse(JSON.stringify(configurationVue.configuration))
					await shortWait()
					await shortWait()

					delete currentConfiguration.address
					delete currentConfiguration.email
					delete currentConfiguration.cboe
					delete currentConfiguration.assistantSec
					delete currentConfiguration.so

					await shortWait()
					await shortWait()

					file = new Blob([JSON.stringify({"exportType":"account", "configuration":currentConfiguration, "account": entryVue.allEntries})], {type: 'text/plain'});
				} else if (access == 'lifeAndMinistry') {
					var currentConfiguration = JSON.parse(JSON.stringify(configurationVue.configuration))
					await shortWait()
					await shortWait()

					delete currentConfiguration.address
					delete currentConfiguration.email
					delete currentConfiguration.cboe
					delete currentConfiguration.sec
					delete currentConfiguration.assistantSec
					delete currentConfiguration.so
					var currentData = JSON.parse(JSON.stringify(allPublishersVue.publishers.filter(elem=>elem.active == true)))
					await shortWait()
					await shortWait()

					var currentEnrolments = JSON.parse(JSON.stringify(allParticipantsVue.enrolments))

					var currentAssignments = JSON.parse(JSON.stringify(allAssignmentsVue.allAssignments))

					currentData.forEach(elem=>{
						delete elem.hope
						delete elem.report
						delete elem.dateOfBaptism
						delete elem.dateOfBirth
						delete elem.emergencyContactInformation
					})
					await shortWait()
					await shortWait()
					await shortWait()
					await shortWait()

					file = new Blob([JSON.stringify({"exportType":"lifeAndMinistry", "configuration":currentConfiguration, "data":currentData, "lifeAndMinistryEnrolments":currentEnrolments, "lifeAndMinistryAssignments":currentAssignments})], {type: 'text/plain'});
				} else if (access == 'lifeAndMinistryAssistant') {
					var currentConfiguration = JSON.parse(JSON.stringify(configurationVue.configuration))
					await shortWait()
					await shortWait()

					delete currentConfiguration.address
					delete currentConfiguration.email
					delete currentConfiguration.cboe
					delete currentConfiguration.sec
					delete currentConfiguration.assistantSec
					delete currentConfiguration.so
					var currentData = JSON.parse(JSON.stringify(allPublishersVue.publishers.filter(elem=>elem.active == true)))
					await shortWait()
					await shortWait()

					var currentEnrolments = JSON.parse(JSON.stringify(allParticipantsVue.enrolments))

					var currentAssignments = JSON.parse(JSON.stringify(allAssignmentsVue.allAssignments))

					currentData.forEach(elem=>{
						delete elem.hope
						delete elem.report
						delete elem.dateOfBaptism
						delete elem.dateOfBirth
						delete elem.emergencyContactInformation
					})
					await shortWait()
					await shortWait()
					await shortWait()
					await shortWait()

					file = new Blob([JSON.stringify({"exportType":"lifeAndMinistryAssistant", "configuration":currentConfiguration, "data":currentData, "lifeAndMinistryEnrolments":currentEnrolments, "lifeAndMinistryAssignments":currentAssignments})], {type: 'text/plain'});
				} else if (access == 'serviceOverseer') {
					var currentConfiguration = JSON.parse(JSON.stringify(configurationVue.configuration))
					await shortWait()
					await shortWait()

					delete currentConfiguration.assistantSec
					var currentData = JSON.parse(JSON.stringify(allPublishersVue.publishers.filter(elem=>elem.active == true)))
					await shortWait()
					await shortWait()

					currentData.forEach(elem=>{
						delete elem.hope
						delete elem.report
						delete elem.dateOfBaptism
						delete elem.dateOfBirth
						delete elem.emergencyContactInformation
					})
					await shortWait()
					await shortWait()
					await shortWait()
					await shortWait()

					file = new Blob([JSON.stringify({"exportType":"serviceOverseer", "configuration":currentConfiguration, "data":currentData})], {type: 'text/plain'});
				} else if (access == 'territoryServant') {
					var currentConfiguration = JSON.parse(JSON.stringify(configurationVue.configuration))
					await shortWait()
					await shortWait()

					delete currentConfiguration.address
					delete currentConfiguration.email
					delete currentConfiguration.cboe
					delete currentConfiguration.sec
					delete currentConfiguration.assistantSec
					var currentData = JSON.parse(JSON.stringify(allPublishersVue.publishers.filter(elem=>elem.active == true)))
					await shortWait()
					await shortWait()

					currentData.forEach(elem=>{
						delete elem.hope
						delete elem.report
						delete elem.dateOfBaptism
						delete elem.dateOfBirth
						delete elem.emergencyContactInformation
					})
					await shortWait()
					await shortWait()
					await shortWait()
					await shortWait()

					file = new Blob([JSON.stringify({"exportType":"territoryServant", "configuration":currentConfiguration, "data":currentData})], {type: 'text/plain'});
				} else {
					file = new Blob([JSON.stringify({"exportType":"update", "configuration":configurationVue.configuration, "data":allPublishersVue.publishers, "lifeAndMinistryEnrolments":allParticipantsVue.enrolments, "lifeAndMinistryAssignments":allAssignmentsVue.allAssignments, "attendance": [attendanceVue.currentMonth, attendanceVue.meetingAttendanceRecord], "account": entryVue.allEntries})], {type: 'text/plain'});
					await shortWait()
					await shortWait()
				}

				this.downloadZip(file, access.replace('update','congData') + '-' + new Date().toLocaleDateString('en-US', options) + '.txt', access)

            },
			async downloadZip(file, name, access) {
				// Create a new instance of JSZip
				var zip = new JSZip();

				//console.log(file, name, access)

				if (access == 'accounts' || (access == 'update' && currentUser.accesses.includes('acct')) || (access == 'all' && currentUser.currentProfile == 'Secretary')) {
					const currentFiles = fileVue.allFiles().filter((elem) => {
						return fileVue.months().findIndex(ele=>elem.name.endsWith(fileVue.cleanMonth(ele))) !== -1
					});
	
					currentFiles.forEach(elem=>{
						// Add Blobs to the zip folder
						zip.file(`Current/${elem.month.split('-')[0]}/${entryVue.cleanMonth(elem.month)}/${elem.name}.${elem.value.name ? elem.value.name.split('.')[1] : 'pdf'}`, elem.value);
					})
	
					approvalsVue.allFiles().forEach(elem=>{
						// Add Blobs to the zip folder
						zip.file(`Standing Approvals/${elem.name}.${elem.value.name ? elem.value.name.split('.')[1] : 'pdf'}`, elem.value);
					})
					
					const archiveFiles = fileVue.allFiles().filter((elem) => {
						return fileVue.months().findIndex(ele=>elem.name.endsWith(fileVue.cleanMonth(ele))) == -1
					});
	
					archiveFiles.forEach(elem=>{
						// Add Blobs to the zip folder
						zip.file(`Archive/${elem.month.split('-')[0]}/${entryVue.cleanMonth(elem.month)}/${elem.name}.${elem.value.name ? elem.value.name.split('.')[1] : 'pdf'}`, elem.value);
					})

					const forms = myFiles.filter(elem => elem.name == "S-26" || elem.name == "S-30" || elem.name == "TO-62");
	
					forms.forEach(elem=>{
						// Add Blobs to the zip folder
						zip.file(`Forms/${elem.name}.${elem.value.name ? elem.value.name.split('.')[1] : 'pdf'}`, elem.value);
					})
					await shortWait()
					await shortWait()
				}

				if (access == 'all' && currentUser.currentProfile == 'Secretary') {
					const pioneerFiles = cardsVue.allFiles().filter((elem) => {
						return allPublishersVue.regularPioneers[0].value.findIndex(ele=>elem.name.includes(ele.name)) !== -1
					});
	
					pioneerFiles.forEach(elem=>{
						// Add Blobs to the zip folder
						zip.file(`Regular Pioneers/${elem.name}.${elem.value.name ? elem.value.name.split('.')[1] : 'pdf'}`, elem.value);
					})
	
					allPublishersVue.allGroups.forEach(group=>{
						const currentGroup = cardsVue.allFiles().filter((elem) => {
							return allPublishersVue.activePublishers.findIndex(ele=>elem.name.includes(ele.name) && ele.fieldServiceGroup == group) !== -1
						});
						currentGroup.forEach(elem=>{
							// Add Blobs to the zip folder
							zip.file(`${group}/${elem.name}.${elem.value.name ? elem.value.name.split('.')[1] : 'pdf'}`, elem.value);
						})
					})

					const inactiveFiles = cardsVue.allFiles().filter((elem) => {
						return allPublishersVue.inactivePublishers.findIndex(ele=>elem.name.includes(ele.name)) !== -1
					});
	
					inactiveFiles.forEach(elem=>{
						// Add Blobs to the zip folder
						zip.file(`Inactive/${elem.name}.${elem.value.name ? elem.value.name.split('.')[1] : 'pdf'}`, elem.value);
					})
					const forms = myFiles.filter(elem => elem.name == "S-21" || elem.name == "S-88");
	
					forms.forEach(elem=>{
						// Add Blobs to the zip folder
						zip.file(`Forms/${elem.name}.${elem.value.name ? elem.value.name.split('.')[1] : 'pdf'}`, elem.value);
					})
					await shortWait()
					await shortWait()
				}

				if ((access == 'update' && currentUser.accesses.includes('lmo')) || (access == 'all' && currentUser.currentProfile == 'Secretary')) {
					const forms = myFiles.filter(elem => elem.name == "S-89");
	
					forms.forEach(elem=>{
						// Add Blobs to the zip folder
						zip.file(`Forms/${elem.name}.${elem.value.name ? elem.value.name.split('.')[1] : 'pdf'}`, elem.value);
					})
					await shortWait()
					await shortWait()
				}

				zip.file(`${name}`, file);
				await shortWait()
				await shortWait()

				// Generate the zip file asynchronously
				zip.generateAsync({ type: "blob" }).then(function (content) {
					downloadPreparedFiles([URL.createObjectURL(content), `${name.replace('.txt', '.zip')}`])
				});
			},
			importData() {
				if (!document.querySelector('#dataFile').files[0]) {
					alert('Please select file to import')
					return
				}
				var file = document.querySelector('#dataFile').files[0];
		
				// Check if file is a zip file
				if (file && file.name.endsWith('.zip')) {
					var zip = new JSZip();
		
					// Read the zip file asynchronously
					zip.loadAsync(file).then(function (contents) {
						// Iterate over each file in the zip folder
						contents.forEach(function (relativePath, file) {
							// Read the file content as ArrayBuffer
							if (file.name.endsWith('.txt')) {
								file.async("text").then(function (content) {
									var result = JSON.parse(content)

									var exportType = result.exportType
									configurationVue.handleDataInput(exportType, result)
								});
							} else if (file.name.includes('.')) {
								file.async("arraybuffer").then(async function (content) {
									var extension = file.name.split('.').pop().toLowerCase();
							
									// Map file extensions to MIME types
									var mimeTypes = {
										'txt': 'text/plain',
										'html': 'text/html',
										'css': 'text/css',
										'js': 'application/javascript',
										'json': 'application/json',
										'jpg': 'image/jpeg',
										'jpeg': 'image/jpeg',
										'png': 'image/png',
										'gif': 'image/gif',
										'pdf': 'application/pdf',
										// Add more mappings as needed
									};
									// Create a Blob object from the file content
									var blob = new Blob([content], { type: mimeTypes[extension] || 'application/octet-stream' });
									
									// Do something with the Blob object
									// For example, you can upload it, display it, or save it
									//console.log("File name: " + file.name.split('/').pop());
									//console.log("Blob object:", blob);
									DBWorker.postMessage({ storeName: 'files', action: "save", value: [{name: file.name.split('/').pop().split('.')[0], value: blob}]});
								});
							}
								
						});
					});
				} else {
					console.error("Please select a valid zip file.");
				}
			},
			async handleDataInput(exportType, result) {
				
				console.log(exportType, result)

				if (result.configuration.acct) {
					configurationVue.configuration.acct = result.configuration.acct
				}
				if (result.configuration.address) {
					configurationVue.configuration.address = result.configuration.address
				}
				if (result.configuration.assistantSec) {
					configurationVue.configuration.assistantSec = result.configuration.assistantSec
				}
				if (result.configuration.cboe) {
					configurationVue.configuration.cboe = result.configuration.cboe
				}
				if (result.configuration.city) {
					configurationVue.configuration.city = result.configuration.city
				}
				if (result.configuration.congregationName) {
					configurationVue.configuration.congregationName = result.configuration.congregationName
				}
				if (result.configuration.currentProfile) {
					configurationVue.configuration.currentProfile = result.configuration.currentProfile
				}
				if (result.configuration.email) {
					configurationVue.configuration.email = result.configuration.email
				}
				if (result.configuration.fieldServiceGroupDetails) {
					configurationVue.configuration.fieldServiceGroupDetails = result.configuration.fieldServiceGroupDetails
				}
				if (result.configuration.fieldServiceGroups) {
					configurationVue.configuration.fieldServiceGroups = result.configuration.fieldServiceGroups
				}
				if (result.configuration.midweekMeetingDay) {
					configurationVue.configuration.midweekMeetingDay = result.configuration.midweekMeetingDay
				}
				if (result.configuration.midweekMeetingTime) {
					configurationVue.configuration.midweekMeetingTime = result.configuration.midweekMeetingTime
				}
				if (result.configuration.name) {
					configurationVue.configuration.name = result.configuration.name
				}
				if (result.configuration.province) {
					configurationVue.configuration.province = result.configuration.province
				}
				if (result.configuration.sec) {
					configurationVue.configuration.sec = result.configuration.sec
				}
				if (result.configuration.so) {
					configurationVue.configuration.so = result.configuration.so
				}

				if (exportType == 'all') {
					var cleanupPublishersDataBase = allPublishersVue.publishers.filter((elem) => {
						return result.data.findIndex(ele=>ele.name === elem.name) == -1
					});

					var cleanupEnrolmentsDataBase = allParticipantsVue.enrolments.filter((elem) => {
						return result.lifeAndMinistryEnrolments.findIndex(ele=>ele.name === elem.name) == -1
					});

					var cleanupAssignmentsDataBase = allAssignmentsVue.allAssignments.filter((elem) => {
						return result.lifeAndMinistryAssignments.findIndex(ele=>ele.week === elem.week) == -1
					});

					await shortWait()
					await shortWait()

					navigationVue.allGroups = result.configuration.fieldServiceGroups
					allPublishersVue.publishers = result.data
					allParticipantsVue.enrolments = result.lifeAndMinistryEnrolments
					allAssignmentsVue.allAssignments = result.lifeAndMinistryAssignments
					territoryVue.savedPolygons = result.territory
					entryVue.allEntries = result.account

					await shortWait()
					await shortWait()

					attendanceVue.currentMonth = result.attendance[0]
					attendanceVue.meetingAttendanceRecord = result.attendance[1]

					DBWorker.postMessage({ storeName: 'configuration', action: "save", value: [configurationVue.configuration]});
					DBWorker.postMessage({ storeName: 'data', action: "save", value: result.data});
					DBWorker.postMessage({ storeName: 'attendance', action: "save", value: result.attendance});
					DBWorker.postMessage({ storeName: 'lifeAndMinistryEnrolments', action: "save", value: result.lifeAndMinistryEnrolments});
					DBWorker.postMessage({ storeName: 'lifeAndMinistryAssignments', action: "save", value: result.lifeAndMinistryAssignments});
					DBWorker.postMessage({ storeName: 'territory', action: "save", value: [{"name": "FeatureCollection", "value": result.territory}]});
					DBWorker.postMessage({ storeName: 'account', action: "save", value: result.account});


					await shortWait()
					await shortWait()
					await shortWait()
					await shortWait()


					cleanupPublishersDataBase.forEach(item=>{
						DBWorker.postMessage({ storeName: 'data', action: "deleteItem", value: item.name});
					})

					cleanupEnrolmentsDataBase.forEach(item=>{
						DBWorker.postMessage({ storeName: 'lifeAndMinistryEnrolments', action: "deleteItem", value: item.name});
					})

					cleanupAssignmentsDataBase.forEach(item=>{
						DBWorker.postMessage({ storeName: 'lifeAndMinistryAssignments', action: "deleteItem", value: item.name});
					})

					configured = true
					gotoView('congregationVue')

				} else if (exportType == 'reportEntry') {

					var cleanupPublishersDataBase = allPublishersVue.publishers.filter((elem) => {
						return result.data.findIndex(ele=>ele.name === elem.name) == -1
					});

					await shortWait()
					await shortWait()

					navigationVue.allGroups = result.configuration.fieldServiceGroups
					allPublishersVue.publishers = result.data
					
					await shortWait()
					await shortWait()

					await shortWait()
					await shortWait()

					attendanceVue.currentMonth = result.attendance[0]
					attendanceVue.meetingAttendanceRecord = result.attendance[1]

					DBWorker.postMessage({ storeName: 'configuration', action: "save", value: [configurationVue.configuration]});
					DBWorker.postMessage({ storeName: 'data', action: "save", value: result.data});
					DBWorker.postMessage({ storeName: 'attendance', action: "save", value: result.attendance});

					await shortWait()
					await shortWait()
					await shortWait()
					await shortWait()


					cleanupPublishersDataBase.forEach(item=>{
						DBWorker.postMessage({ storeName: 'data', action: "deleteItem", value: item.name});
					})

					configured = true
					
					gotoView('missingReportVue')

				} else if (exportType == 'account') {
					
					var cleanupAccountDataBase = entryVue.allEntries.filter((elem) => {
						return result.account.findIndex(ele=>ele.name === elem.name) == -1
					});

					await shortWait()
					await shortWait()
					
					entryVue.allEntries = result.account
					
					await shortWait()
					await shortWait()

					DBWorker.postMessage({ storeName: 'account', action: "save", value: result.account});
					DBWorker.postMessage({ storeName: 'configuration', action: "save", value: [configurationVue.configuration]});

					await shortWait()
					await shortWait()
					await shortWait()

					cleanupAccountDataBase.forEach(item=>{
						DBWorker.postMessage({ storeName: 'account', action: "deleteItem", value: item.name});
					})
						
					configured = true
					
					gotoView('entryVue')

				} else if (exportType == 'lifeAndMinistry') {
					var cleanupPublishersDataBase = allPublishersVue.publishers.filter((elem) => {
						return result.data.findIndex(ele=>ele.name === elem.name) == -1
					});

					var cleanupEnrolmentsDataBase = allParticipantsVue.enrolments.filter((elem) => {
						return result.lifeAndMinistryEnrolments.findIndex(ele=>ele.name === elem.name) == -1
					});

					var cleanupAssignmentsDataBase = allAssignmentsVue.allAssignments.filter((elem) => {
						return result.lifeAndMinistryAssignments.findIndex(ele=>ele.week === elem.week) == -1
					});

					await shortWait()
					await shortWait()

					navigationVue.allGroups = result.configuration.fieldServiceGroups
					allPublishersVue.publishers = result.data
					allParticipantsVue.enrolments = result.lifeAndMinistryEnrolments
					allAssignmentsVue.allAssignments = result.lifeAndMinistryAssignments

					await shortWait()
					await shortWait()

					DBWorker.postMessage({ storeName: 'configuration', action: "save", value: [configurationVue.configuration]});
					DBWorker.postMessage({ storeName: 'data', action: "save", value: result.data});
					DBWorker.postMessage({ storeName: 'lifeAndMinistryEnrolments', action: "save", value: result.lifeAndMinistryEnrolments});
					DBWorker.postMessage({ storeName: 'lifeAndMinistryAssignments', action: "save", value: result.lifeAndMinistryAssignments});

					await shortWait()
					await shortWait()
					await shortWait()
					await shortWait()


					cleanupPublishersDataBase.forEach(item=>{
						DBWorker.postMessage({ storeName: 'data', action: "deleteItem", value: item.name});
					})

					cleanupEnrolmentsDataBase.forEach(item=>{
						DBWorker.postMessage({ storeName: 'lifeAndMinistryEnrolments', action: "deleteItem", value: item.name});
					})

					cleanupAssignmentsDataBase.forEach(item=>{
						DBWorker.postMessage({ storeName: 'lifeAndMinistryAssignments', action: "deleteItem", value: item.name});
					})

					configured = true
					gotoView('allAssignmentsVue')
				} else if (exportType == 'lifeAndMinistryAssistant') {
					var cleanupPublishersDataBase = allPublishersVue.publishers.filter((elem) => {
						return result.data.findIndex(ele=>ele.name === elem.name) == -1
					});

					var cleanupEnrolmentsDataBase = allParticipantsVue.enrolments.filter((elem) => {
						return result.lifeAndMinistryEnrolments.findIndex(ele=>ele.name === elem.name) == -1
					});

					var cleanupAssignmentsDataBase = allAssignmentsVue.allAssignments.filter((elem) => {
						return result.lifeAndMinistryAssignments.findIndex(ele=>ele.week === elem.week) == -1
					});

					await shortWait()
					await shortWait()

					navigationVue.allGroups = result.configuration.fieldServiceGroups
					allPublishersVue.publishers = result.data
					allParticipantsVue.enrolments = result.lifeAndMinistryEnrolments
					allAssignmentsVue.allAssignments = result.lifeAndMinistryAssignments

					await shortWait()
					await shortWait()

					DBWorker.postMessage({ storeName: 'configuration', action: "save", value: [configurationVue.configuration]});
					DBWorker.postMessage({ storeName: 'data', action: "save", value: result.data});
					DBWorker.postMessage({ storeName: 'lifeAndMinistryEnrolments', action: "save", value: result.lifeAndMinistryEnrolments});
					DBWorker.postMessage({ storeName: 'lifeAndMinistryAssignments', action: "save", value: result.lifeAndMinistryAssignments});

					await shortWait()
					await shortWait()
					await shortWait()
					await shortWait()


					cleanupPublishersDataBase.forEach(item=>{
						DBWorker.postMessage({ storeName: 'data', action: "deleteItem", value: item.name});
					})

					cleanupEnrolmentsDataBase.forEach(item=>{
						DBWorker.postMessage({ storeName: 'lifeAndMinistryEnrolments', action: "deleteItem", value: item.name});
					})

					cleanupAssignmentsDataBase.forEach(item=>{
						DBWorker.postMessage({ storeName: 'lifeAndMinistryAssignments', action: "deleteItem", value: item.name});
					})

					configured = true
					gotoView('allAssignmentsVue')
				} else if (exportType == 'serviceOverseer') {
					var cleanupPublishersDataBase = allPublishersVue.publishers.filter((elem) => {
						return result.data.findIndex(ele=>ele.name === elem.name) == -1
					});

					territoryVue.savedPolygons = result.territory
					navigationVue.allGroups = result.configuration.fieldServiceGroups
					allPublishersVue.publishers = result.data
					console.log(result.territory)
					
					await shortWait()
					await shortWait()

					DBWorker.postMessage({ storeName: 'configuration', action: "save", value: [configurationVue.configuration]});
					DBWorker.postMessage({ storeName: 'data', action: "save", value: result.data});
					DBWorker.postMessage({ storeName: 'territory', action: "save", value: [{"name": "FeatureCollection", "value": territoryVue.savedPolygons}]});

					await shortWait()
					await shortWait()

					cleanupPublishersDataBase.forEach(item=>{
						DBWorker.postMessage({ storeName: 'data', action: "deleteItem", value: item.name});
					})
						
					configured = true
					
					gotoView('territoryVue')

				} else if (exportType == 'territoryServant') {
					var cleanupPublishersDataBase = allPublishersVue.publishers.filter((elem) => {
						return result.data.findIndex(ele=>ele.name === elem.name) == -1
					});

					territoryVue.savedPolygons = result.territory
					allPublishersVue.publishers = result.data
					console.log(result.territory)
					
					await shortWait()
					await shortWait()

					DBWorker.postMessage({ storeName: 'configuration', action: "save", value: [configurationVue.configuration]});		
					DBWorker.postMessage({ storeName: 'data', action: "save", value: result.data});				
					DBWorker.postMessage({ storeName: 'territory', action: "save", value: [{"name": "FeatureCollection", "value": territoryVue.savedPolygons}]});

					await shortWait()
					await shortWait()

					cleanupPublishersDataBase.forEach(item=>{
						DBWorker.postMessage({ storeName: 'data', action: "deleteItem", value: item.name});
					})
						
					configured = true
					
					gotoView('territoryVue')

				} else if (exportType == 'territoryMap') {

					const found = territoryVue.savedPolygons.findIndex(elem=>elem.number == result.territory[0].number && elem.locality == result.territory[0].locality)
					if (found !== -1) {
						territoryVue.savedPolygons[found] = result.territory[0].locality
					} else {
						territoryVue.savedPolygons.push(result.territory[0].locality)
					}
					
					console.log(result.territory)
					
					await shortWait()
					await shortWait()

					if (!configurationVue.configuration.name) {
						configurationVue.configuration = {"name":"Congregation","congregationName":"","address":""}
					}
					DBWorker.postMessage({ storeName: 'configuration', action: "save", value: [configurationVue.configuration]});						
					DBWorker.postMessage({ storeName: 'territory', action: "save", value: [{"name": "FeatureCollection", "value": territoryVue.savedPolygons}]});

					await shortWait()
					await shortWait()
						
					configured = true
					
					gotoView('territoryVue')

				} else if (exportType == 'update') {

					if (result.attendance) {
						if (result.attendance[0]) {
							attendanceVue.currentMonth = result.attendance[0]
						}
						if (result.attendance[1]) {
							attendanceVue.meetingAttendanceRecord = result.attendance[1]
						}
						await shortWait()
						await shortWait()
						DBWorker.postMessage({ storeName: 'attendance', action: "save", value: [attendanceVue.currentMonth, attendanceVue.meetingAttendanceRecord]});	
					}
					
					if (result.data) {
						allPublishersVue.publishers.forEach(elem=>{
							const currentReport = result.data.filter(ele=>ele.name === elem.name)
							if (currentReport.length !== 0) {
								elem.report = currentReport[0].report
							}
						})
						await shortWait()
						await shortWait()
						await shortWait()
						await shortWait()
						DBWorker.postMessage({ storeName: 'data', action: "save", value: allPublishersVue.publishers});
					}

					if (result.lifeAndMinistryEnrolments) {
						allParticipantsVue.enrolments = result.lifeAndMinistryEnrolments
						await shortWait()
						await shortWait()
						DBWorker.postMessage({ storeName: 'lifeAndMinistryEnrolments', action: "save", value: result.lifeAndMinistryEnrolments});
					}

					if (result.lifeAndMinistryAssignments) {
						allAssignmentsVue.allAssignments = result.lifeAndMinistryAssignments
						await shortWait()
						await shortWait()
						DBWorker.postMessage({ storeName: 'lifeAndMinistryAssignments', action: "save", value: result.lifeAndMinistryAssignments});
					}
					
					if (result.account) {
						entryVue.allEntries = result.account
						await shortWait()
						await shortWait()
						DBWorker.postMessage({ storeName: 'account', action: "save", value: result.account});
					}

					await shortWait()
					await shortWait()
	
					configured = true
					gotoView(navigationVue.buttons[0].function)
					
				}
				
            },
			saveConfiguration() {
                
                var allGroups = []
                document.querySelectorAll('.fieldServiceGroups').forEach(elem=>{
                    allGroups.push(elem.value)
                })

                allGroups.sort()

				var overseers = []
				document.querySelectorAll('.overseer').forEach(elem=>{
					overseers.push(elem.value)
				})

				var assistants = []
				document.querySelectorAll('.assistant').forEach(elem=>{
					assistants.push(elem.value)
				})

				for (let i = 0; i < this.configuration.fieldServiceGroups.length; i++) {
					this.fieldServiceGroupDetails[i] = {name: this.configuration.fieldServiceGroups[i], overseer: overseers[i], assistant: assistants[i]}
				}

				var currentConfiguration = {}

				currentConfiguration = { "name": "Congregation", "congregationName": document.querySelector('.name').value, "address": document.querySelector('.address').value, "city": document.querySelector('.city').value, "province": document.querySelector('.province').value, "email": document.querySelector('.email').value, "fieldServiceGroups": allGroups, "fieldServiceGroupDetails": this.fieldServiceGroupDetails, "cboe": document.querySelector('.cboe') ? document.querySelector('.cboe').value : '', "sec": document.querySelector('.sec') ? document.querySelector('.sec').value : '', "assistantSec": document.querySelector('.assistantSec') ? document.querySelector('.assistantSec').value : '', "so":  document.querySelector('.so') ? document.querySelector('.so').value : '', "acct":  document.querySelector('.acct') ? document.querySelector('.acct').value : '', "currentProfile": currentUser.currentProfile }

                DBWorker.postMessage({ storeName: 'configuration', action: "save", value: [currentConfiguration]});
                configured = true
            },
            async resetConfiguration() {
				var confirmReset = prompt('Are you sure you want to Reset records?\nType "Reset" to Reset')
                if (confirmReset !== null && confirmReset.toLowerCase() == 'reset') {
					this.reset = true
					resetCount = 8
					DBWorker.postMessage({ storeName: 'data', action: "readAll"});
                    DBWorker.postMessage({ storeName: 'configuration', action: "readAll"});
                    DBWorker.postMessage({ storeName: 'attendance', action: "readAll"});
                    DBWorker.postMessage({ storeName: 'files', action: "readAll"});
                    DBWorker.postMessage({ storeName: 'lifeAndMinistryEnrolments', action: "readAll"});
                    DBWorker.postMessage({ storeName: 'lifeAndMinistryAssignments', action: "readAll"});
                    DBWorker.postMessage({ storeName: 'territory', action: "readAll"});
                    DBWorker.postMessage({ storeName: 'account', action: "account"});
				}
            },
            addGroup() {
                const count = configurationVue.configuration.fieldServiceGroups.filter(elem=>elem.startsWith("Group ")).map(elem=>Number(elem.split(' ')[1])).sort().slice(-1)[0]
                this.configuration.fieldServiceGroups.push("Group " + (count ? count : 0 + 1))
            },
            removeGroup() {
                this.configuration.fieldServiceGroups.pop()
            },
			cancel(item) {
				item.parentNode.querySelector('.gender').value = 'Select Gender'
				item.parentNode.querySelector('.contactAddress').value = ''
				item.parentNode.querySelector('.contactPhoneNumber').value = ''
				if (currentUser.currentProfile == 'Life and Ministry Overseer' || currentUser.currentProfile == 'Life and Ministry Assistant') {
					item.parentNode.querySelector('.name').innerHTML = 'Name'
					item.parentNode.parentNode.querySelector('.detail').style.display = 'none'
					item.parentNode.parentNode.querySelector('.main').style.display = ''
					return
				}
				item.parentNode.querySelector('.name').innerHTML = 'Publisher Name'
				item.parentNode.querySelector('.dateOfBirth').value = ''
				item.parentNode.querySelector('.dateOfBaptism').value = ''
                item.parentNode.querySelector('.hope').value = 'Unbaptized Publisher'
                item.parentNode.querySelector('.fieldServiceGroup').value = ''
				item.parentNode.parentNode.querySelectorAll('.privileges').forEach(elem=>{
					elem.checked = false
				})
                item.parentNode.querySelector('.emergencyContactName').value = ''
                item.parentNode.querySelector('.emergencyContactPhoneNumber').value = ''
				this.months.forEach(elem=>{
					const currentItem = item.parentNode.querySelector(`.${elem.abbr}`)
					currentItem.querySelector('.hours').innerHTML = ''
					currentItem.querySelector('.bibleStudies').innerHTML = ''
					currentItem.querySelector('.remarks').innerHTML = ''
					currentItem.querySelector('.sharedInMinistry').checked = false
					currentItem.querySelector('.auxiliaryPioneer').checked = false
				})
				item.parentNode.parentNode.querySelector('.detail').style.display = 'none'
                item.parentNode.parentNode.querySelector('.main').style.display = ''
			},
			publisherDetail(item) {
				var publisher = JSON.parse(JSON.stringify(newPublisherRecord))
                if (item.parentNode.className.split(' ')[0] == 'main') {
                    item.parentNode.parentNode.querySelector('.main').style.display = 'none'
                    item.parentNode.parentNode.querySelector('.detail').style.display = ''
                } else {
                    if (item.parentNode.querySelector('.name').innerHTML) {
                        publisher.name = item.parentNode.querySelector('.name').innerHTML
                    } else {
						if (currentUser.currentProfile == 'Life and Ministry Overseer' || currentUser.currentProfile == 'Life and Ministry Assistant') {
							alert('Please enter Name')
						} else {
							alert('Please enter Publisher Name')
						}
						return
					}
					publisher.gender = item.parentNode.querySelector('.gender').value
					publisher.contactInformation.address = item.parentNode.querySelector('.contactAddress').value
                    publisher.contactInformation.phoneNumber = item.parentNode.querySelector('.contactPhoneNumber').value

                    if (currentUser.currentProfile == 'Life and Ministry Overseer' || currentUser.currentProfile == 'Life and Ministry Assistant') {
						allParticipantsVue.enrolments.push({name: publisher.name, gender: publisher.gender, phoneNumber: publisher.contactInformation.phoneNumber == '' ? null : publisher.contactInformation.phoneNumber, address: publisher.contactInformation.address == '' ? null : publisher.contactInformation.address })
						DBWorker.postMessage({ storeName: 'lifeAndMinistryEnrolments', action: "save", value: allParticipantsVue.enrolments});
						this.cancel(item)
						return
					}

					if (item.parentNode.querySelector('.dateOfBirth').value) {
                        publisher.dateOfBirth = item.parentNode.querySelector('.dateOfBirth').value
                    }
                    if (item.parentNode.querySelector('.dateOfBaptism')) {
                        publisher.dateOfBaptism = item.parentNode.querySelector('.dateOfBaptism').value
                    }
                    
                    publisher.hope = item.parentNode.querySelector('.hope').value
                    publisher.fieldServiceGroup = item.parentNode.querySelector('.fieldServiceGroup').value
                    
                    var allPrivileges = []

                    item.parentNode.parentNode.querySelectorAll('.privileges').forEach(elem=>{
                        if (elem.checked) {
                            allPrivileges.push(elem.name)
                        }
                    })

                    allPrivileges.sort()

                    publisher.privilege = allPrivileges

                    publisher.emergencyContactInformation.name = item.parentNode.querySelector('.emergencyContactName').value
                    publisher.emergencyContactInformation.phoneNumber = item.parentNode.querySelector('.emergencyContactPhoneNumber').value
                    this.months.forEach(elem=>{
                        const currentItem = item.parentNode.querySelector(`.${elem.abbr}`)
                        if (currentItem.querySelector('.hours').innerHTML !== '') {
                            publisher.report.currentServiceYear[elem.abbr].hours = Number(currentItem.querySelector('.hours').innerHTML)
                        } else {
                            publisher.report.currentServiceYear[elem.abbr].hours = null
                        }
                        if (currentItem.querySelector('.bibleStudies').innerHTML !== '') {
                            publisher.report.currentServiceYear[elem.abbr].bibleStudies = Number(currentItem.querySelector('.bibleStudies').innerHTML)
                        } else {
                            publisher.report.currentServiceYear[elem.abbr].bibleStudies = null
                        }
                        if (currentItem.querySelector('.remarks').innerHTML !== '') {
                            publisher.report.currentServiceYear[elem.abbr].remarks = Number(currentItem.querySelector('.remarks').innerHTML)
                        } else {
                            publisher.report.currentServiceYear[elem.abbr].remarks = null
                        }
                        if (currentItem.querySelector('.sharedInMinistry').checked) {
                            publisher.report.currentServiceYear[elem.abbr].sharedInMinistry = currentItem.querySelector('.sharedInMinistry').checked
                        } else {
                            publisher.report.currentServiceYear[elem.abbr].sharedInMinistry = null
                        }
                        if (currentItem.querySelector('.auxiliaryPioneer').checked) {
                            publisher.report.currentServiceYear[elem.abbr].auxiliaryPioneer = currentItem.querySelector('.auxiliaryPioneer').checked
                        } else {
                            publisher.report.currentServiceYear[elem.abbr].auxiliaryPioneer = null
                        }
                    })

					allPublishersVue.publishers.push(publisher)

                    
                    DBWorker.postMessage({ storeName: 'data', action: "save", value: [publisher]});
					this.cancel(item)
                }
			},
			async saveFile() {
				if (document.getElementById('pdfFile').files[0]) {
					if (document.getElementById('pdfFile').files[0].type !== "application/pdf") {
						await convertImageToPdf(document.querySelector('.fileName').value)
					} else {
						DBWorker.postMessage({ storeName: 'files', action: "save", value: [{name: document.querySelector('.fileName').value, value: document.getElementById('pdfFile').files[0]}]});
						await shortWait()
						await shortWait()
						DBWorker.postMessage({ storeName: 'files', action: "readAll"});
					}
				}
			}
        }
    })
}

processAllPublishers()
processAllParticipants()
processConfiguration()
processCongregation()

processFieldServiceGroups()
processCards()
processMonthlyReport()
processMissingReport()
processAllAssignments()
processSchedule()
processAttendance()
contactInformation()
branchReportDetails()
processEntry()
processFile()
processApprovals()
processArchive()

function signOut() {
	// Open or create a database
	const dbName = "handler";
	
	const request = indexedDB.open(dbName);

	// Open a connection to the database
	
	request.onsuccess = function(event) {
	var db = event.target.result;
	
	// Start a transaction
	var transaction = db.transaction(['settings'], 'readwrite');
	var objectStore = transaction.objectStore('settings');
	
	// Get the object you want to update
	var getRequest = objectStore.get(currentUser.name);
	
	getRequest.onsuccess = function(event) {
		var data = event.target.result;
		
		// Update the data
		data.loggedIn = false;
		
		// Put the updated data back into the object store
		var putRequest = objectStore.put(data);
		
		putRequest.onsuccess = function(event) {
			console.log('Data updated successfully');
			location.reload()
		};
		
		putRequest.onerror = function(event) {
			console.error('Error updating data');
		};
	};
	
	getRequest.onerror = function(event) {
		console.error('Error getting data');
	};
	};

	request.onerror = function(event) {
		console.error('Error opening database');
	};

}


configurationVue.displayMode({"value": "System"})

var defaultConfiguration = { "congregationName": "", "name": "Congregation", "address": "", "city": "", "province": "", "email": "", "fieldServiceGroups": ["Group 1"], "cboe": "", "sec": "", "assistantSec": "", "so": "", "acct": "" }

var currentMonthAttendance = {
	"name": "Monthly",
	"month": currentMonth,
	"meetings": [
		{
			"name": "Midweek",
			"attendance": [
				{ "name": "1stWeek", "count": null },
				{ "name": "2ndWeek", "count": null },
				{ "name": "3rdWeek", "count": null },
				{ "name": "4thWeek", "count": null },
				{ "name": "5thWeek", "count": null }
			]
		},
		{
			"name": "Weekend",
			"attendance": [
				{ "name": "1stWeek", "count": null },
				{ "name": "2ndWeek", "count": null },
				{ "name": "3rdWeek", "count": null },
				{ "name": "4thWeek", "count": null },
				{ "name": "5thWeek", "count": null }
			]
		}
	]
}

var meetingAttendanceRecord = {
	"name": "Meeting Attendance Record",
	"meetings" : [
		{
			"name": "Midweek Meeting",
			"currentServiceYear": {
				"year": null,
				"jan": {
					"numberOfMeetings": null,
					"totalAttendance": null,
					"averageAttendanceEachWeek": null
				},
				"feb": {
					"numberOfMeetings": null,
					"totalAttendance": null,
					"averageAttendanceEachWeek": null
				},
				"mar": {
					"numberOfMeetings": null,
					"totalAttendance": null,
					"averageAttendanceEachWeek": null
				},
				"apr": {
					"numberOfMeetings": null,
					"totalAttendance": null,
					"averageAttendanceEachWeek": null
				},
				"may": {
					"numberOfMeetings": null,
					"totalAttendance": null,
					"averageAttendanceEachWeek": null
				},
				"jun": {
					"numberOfMeetings": null,
					"totalAttendance": null,
					"averageAttendanceEachWeek": null
				},
				"jul": {
					"numberOfMeetings": null,
					"totalAttendance": null,
					"averageAttendanceEachWeek": null
				},
				"aug": {
					"numberOfMeetings": null,
					"totalAttendance": null,
					"averageAttendanceEachWeek": null
				},
				"sept": {
					"numberOfMeetings": null,
					"totalAttendance": null,
					"averageAttendanceEachWeek": null
				},
				"oct": {
					"numberOfMeetings": null,
					"totalAttendance": null,
					"averageAttendanceEachWeek": null
				},
				"nov": {
					"numberOfMeetings": null,
					"totalAttendance": null,
					"averageAttendanceEachWeek": null
				},
				"dec": {
					"numberOfMeetings": null,
					"totalAttendance": null,
					"averageAttendanceEachWeek": null
				},
				"averageAttendanceEachMonth": null
			},
			"lastServiceYear": {
				"year": null,
				"jan": {
					"numberOfMeetings": null,
					"totalAttendance": null,
					"averageAttendanceEachWeek": null
				},
				"feb": {
					"numberOfMeetings": null,
					"totalAttendance": null,
					"averageAttendanceEachWeek": null
				},
				"mar": {
					"numberOfMeetings": null,
					"totalAttendance": null,
					"averageAttendanceEachWeek": null
				},
				"apr": {
					"numberOfMeetings": null,
					"totalAttendance": null,
					"averageAttendanceEachWeek": null
				},
				"may": {
					"numberOfMeetings": null,
					"totalAttendance": null,
					"averageAttendanceEachWeek": null
				},
				"jun": {
					"numberOfMeetings": null,
					"totalAttendance": null,
					"averageAttendanceEachWeek": null
				},
				"jul": {
					"numberOfMeetings": null,
					"totalAttendance": null,
					"averageAttendanceEachWeek": null
				},
				"aug": {
					"numberOfMeetings": null,
					"totalAttendance": null,
					"averageAttendanceEachWeek": null
				},
				"sept": {
					"numberOfMeetings": null,
					"totalAttendance": null,
					"averageAttendanceEachWeek": null
				},
				"oct": {
					"numberOfMeetings": null,
					"totalAttendance": null,
					"averageAttendanceEachWeek": null
				},
				"nov": {
					"numberOfMeetings": null,
					"totalAttendance": null,
					"averageAttendanceEachWeek": null
				},
				"dec": {
					"numberOfMeetings": null,
					"totalAttendance": null,
					"averageAttendanceEachWeek": null
				},
				"averageAttendanceEachMonth": null
			}
		},
		{
			"name": "Weekend Meeting",
			"currentServiceYear": {
				"year": null,
				"jan": {
					"numberOfMeetings": null,
					"totalAttendance": null,
					"averageAttendanceEachWeek": null
				},
				"feb": {
					"numberOfMeetings": null,
					"totalAttendance": null,
					"averageAttendanceEachWeek": null
				},
				"mar": {
					"numberOfMeetings": null,
					"totalAttendance": null,
					"averageAttendanceEachWeek": null
				},
				"apr": {
					"numberOfMeetings": null,
					"totalAttendance": null,
					"averageAttendanceEachWeek": null
				},
				"may": {
					"numberOfMeetings": null,
					"totalAttendance": null,
					"averageAttendanceEachWeek": null
				},
				"jun": {
					"numberOfMeetings": null,
					"totalAttendance": null,
					"averageAttendanceEachWeek": null
				},
				"jul": {
					"numberOfMeetings": null,
					"totalAttendance": null,
					"averageAttendanceEachWeek": null
				},
				"aug": {
					"numberOfMeetings": null,
					"totalAttendance": null,
					"averageAttendanceEachWeek": null
				},
				"sept": {
					"numberOfMeetings": null,
					"totalAttendance": null,
					"averageAttendanceEachWeek": null
				},
				"oct": {
					"numberOfMeetings": null,
					"totalAttendance": null,
					"averageAttendanceEachWeek": null
				},
				"nov": {
					"numberOfMeetings": null,
					"totalAttendance": null,
					"averageAttendanceEachWeek": null
				},
				"dec": {
					"numberOfMeetings": null,
					"totalAttendance": null,
					"averageAttendanceEachWeek": null
				},
				"averageAttendanceEachMonth": null
			},
			"lastServiceYear": {
				"year": null,
				"jan": {
					"numberOfMeetings": null,
					"totalAttendance": null,
					"averageAttendanceEachWeek": null
				},
				"feb": {
					"numberOfMeetings": null,
					"totalAttendance": null,
					"averageAttendanceEachWeek": null
				},
				"mar": {
					"numberOfMeetings": null,
					"totalAttendance": null,
					"averageAttendanceEachWeek": null
				},
				"apr": {
					"numberOfMeetings": null,
					"totalAttendance": null,
					"averageAttendanceEachWeek": null
				},
				"may": {
					"numberOfMeetings": null,
					"totalAttendance": null,
					"averageAttendanceEachWeek": null
				},
				"jun": {
					"numberOfMeetings": null,
					"totalAttendance": null,
					"averageAttendanceEachWeek": null
				},
				"jul": {
					"numberOfMeetings": null,
					"totalAttendance": null,
					"averageAttendanceEachWeek": null
				},
				"aug": {
					"numberOfMeetings": null,
					"totalAttendance": null,
					"averageAttendanceEachWeek": null
				},
				"sept": {
					"numberOfMeetings": null,
					"totalAttendance": null,
					"averageAttendanceEachWeek": null
				},
				"oct": {
					"numberOfMeetings": null,
					"totalAttendance": null,
					"averageAttendanceEachWeek": null
				},
				"nov": {
					"numberOfMeetings": null,
					"totalAttendance": null,
					"averageAttendanceEachWeek": null
				},
				"dec": {
					"numberOfMeetings": null,
					"totalAttendance": null,
					"averageAttendanceEachWeek": null
				},
				"averageAttendanceEachMonth": null
			}
		}
	]
}

var newPublisherRecord = {
    "name": null,
    "dateOfBirth": null,
    "gender": null,
    "hope": null,
    "privilege": [],
    "contactInformation": {
        "address": null,
        "phoneNumber": null
    },
    "fieldServiceGroup": null,
    "report": {
        "currentServiceYear": {
            "year": null,
            "jan": {
                "sharedInMinistry": null,
                "bibleStudies": null,
                "auxiliaryPioneer": null,
                "hours": null,
                "remarks": null,
                "modified": null,
                "created": null
            },
            "feb": {
                "sharedInMinistry": null,
                "bibleStudies": null,
                "auxiliaryPioneer": null,
                "hours": null,
                "remarks": null,
                "modified": null,
                "created": null
            },
            "mar": {
                "sharedInMinistry": null,
                "bibleStudies": null,
                "auxiliaryPioneer": null,
                "hours": null,
                "remarks": null,
                "modified": null,
                "created": null
            },
            "apr": {
                "sharedInMinistry": null,
                "bibleStudies": null,
                "auxiliaryPioneer": null,
                "hours": null,
                "remarks": null,
                "modified": null,
                "created": null
            },
            "may": {
                "sharedInMinistry": null,
                "bibleStudies": null,
                "auxiliaryPioneer": null,
                "hours": null,
                "remarks": null,
                "modified": null,
                "created": null
            },
            "jun": {
                "sharedInMinistry": null,
                "bibleStudies": null,
                "auxiliaryPioneer": null,
                "hours": null,
                "remarks": null,
                "modified": null,
                "created": null
            },
            "jul": {
                "sharedInMinistry": null,
                "bibleStudies": null,
                "auxiliaryPioneer": null,
                "hours": null,
                "remarks": null,
                "modified": null,
                "created": null
            },
            "aug": {
                "sharedInMinistry": null,
                "bibleStudies": null,
                "auxiliaryPioneer": null,
                "hours": null,
                "remarks": null,
                "modified": null,
                "created": null
            },
            "sept": {
                "sharedInMinistry": null,
                "bibleStudies": null,
                "auxiliaryPioneer": null,
                "hours": null,
                "remarks": null,
                "modified": null,
                "created": null
            },
            "oct": {
                "sharedInMinistry": null,
                "bibleStudies": null,
                "auxiliaryPioneer": null,
                "hours": null,
                "remarks": null,
                "modified": null,
                "created": null
            },
            "nov": {
                "sharedInMinistry": null,
                "bibleStudies": null,
                "auxiliaryPioneer": null,
                "hours": null,
                "remarks": null,
                "modified": null,
                "created": null
            },
            "dec": {
                "sharedInMinistry": null,
                "bibleStudies": null,
                "auxiliaryPioneer": null,
                "hours": null,
                "remarks": null,
                "modified": null,
                "created": null
            },
            "totalHours": null,
            "totalRemarks": null
        },
        "lastServiceYear": {
            "year": null,
            "jan": {
                "sharedInMinistry": null,
                "bibleStudies": null,
                "auxiliaryPioneer": null,
                "hours": null,
                "remarks": null,
                "modified": null,
                "created": null
            },
            "feb": {
                "sharedInMinistry": null,
                "bibleStudies": null,
                "auxiliaryPioneer": null,
                "hours": null,
                "remarks": null,
                "modified": null,
                "created": null
            },
            "mar": {
                "sharedInMinistry": null,
                "bibleStudies": null,
                "auxiliaryPioneer": null,
                "hours": null,
                "remarks": null,
                "modified": null,
                "created": null
            },
            "apr": {
                "sharedInMinistry": null,
                "bibleStudies": null,
                "auxiliaryPioneer": null,
                "hours": null,
                "remarks": null,
                "modified": null,
                "created": null
            },
            "may": {
                "sharedInMinistry": null,
                "bibleStudies": null,
                "auxiliaryPioneer": null,
                "hours": null,
                "remarks": null,
                "modified": null,
                "created": null
            },
            "jun": {
                "sharedInMinistry": null,
                "bibleStudies": null,
                "auxiliaryPioneer": null,
                "hours": null,
                "remarks": null,
                "modified": null,
                "created": null
            },
            "jul": {
                "sharedInMinistry": null,
                "bibleStudies": null,
                "auxiliaryPioneer": null,
                "hours": null,
                "remarks": null,
                "modified": null,
                "created": null
            },
            "aug": {
                "sharedInMinistry": null,
                "bibleStudies": null,
                "auxiliaryPioneer": null,
                "hours": null,
                "remarks": null,
                "modified": null,
                "created": null
            },
            "sept": {
                "sharedInMinistry": null,
                "bibleStudies": null,
                "auxiliaryPioneer": null,
                "hours": null,
                "remarks": null,
                "modified": null,
                "created": null
            },
            "oct": {
                "sharedInMinistry": null,
                "bibleStudies": null,
                "auxiliaryPioneer": null,
                "hours": null,
                "remarks": null,
                "modified": null,
                "created": null
            },
            "nov": {
                "sharedInMinistry": null,
                "bibleStudies": null,
                "auxiliaryPioneer": null,
                "hours": null,
                "remarks": null,
                "modified": null,
                "created": null
            },
            "dec": {
                "sharedInMinistry": null,
                "bibleStudies": null,
                "auxiliaryPioneer": null,
                "hours": null,
                "remarks": null,
                "modified": null,
                "created": null
            },
            "totalHours": null,
            "totalRemarks": null
        }
    },
    "dateOfBaptism": null,
    "emergencyContactInformation": {
        "name": null,
        "phoneNumber": null
    }
}

configurationVue.publisher = newPublisherRecord

function getUniqueElementsByProperty(arr, propNames) {
    const uniqueSet = new Set();
    
    return arr.filter(obj => {
        const key = propNames.map(prop => obj[prop]).join('|');
        if (!uniqueSet.has(key)) {
            uniqueSet.add(key);
            return true;
        }
        return false;
    });
}

async function fillPublisherRecord(data) {
	var s21 = await PDFLib.PDFDocument.load(s21Data);
	const publisher = data[0]
	const period = data[1]
    // Get the form field by name
    const name = s21.getForm().getTextField('900_1_Text_SanSerif');
    const dateOfBirth = s21.getForm().getTextField('900_2_Text_SanSerif');
    const dateOfBaptism = s21.getForm().getTextField('900_5_Text_SanSerif');
    const male = s21.getForm().getCheckBox('900_3_CheckBox');
    const female = s21.getForm().getCheckBox('900_4_CheckBox');
    const otherSheep = s21.getForm().getCheckBox('900_6_CheckBox');
    const anointed = s21.getForm().getCheckBox('900_7_CheckBox');
    const elder = s21.getForm().getCheckBox('900_8_CheckBox');
    const ministerialServant = s21.getForm().getCheckBox('900_9_CheckBox');
    const regularPioneer = s21.getForm().getCheckBox('900_10_CheckBox');
    const specialPioneer = s21.getForm().getCheckBox('900_11_CheckBox');
    const fieldMissionary = s21.getForm().getCheckBox('900_12_CheckBox');
    const serviceYear = s21.getForm().getTextField('900_13_Text_C_SanSerif');
    const septPreached = s21.getForm().getCheckBox('901_20_CheckBox');
    const octPreached = s21.getForm().getCheckBox('901_21_CheckBox');
    const novPreached = s21.getForm().getCheckBox('901_22_CheckBox');
    const decPreached = s21.getForm().getCheckBox('901_23_CheckBox');
    const janPreached = s21.getForm().getCheckBox('901_24_CheckBox');
    const febPreached = s21.getForm().getCheckBox('901_25_CheckBox');
    const marPreached = s21.getForm().getCheckBox('901_26_CheckBox');
    const aprPreached = s21.getForm().getCheckBox('901_27_CheckBox');
    const mayPreached = s21.getForm().getCheckBox('901_28_CheckBox');
    const junPreached = s21.getForm().getCheckBox('901_29_CheckBox');
    const julPreached = s21.getForm().getCheckBox('901_30_CheckBox');
    const augPreached = s21.getForm().getCheckBox('901_31_CheckBox');
    const septAux = s21.getForm().getCheckBox('903_20_CheckBox');
    const octAux = s21.getForm().getCheckBox('903_21_CheckBox');
    const novAux = s21.getForm().getCheckBox('903_22_CheckBox');
    const decAux = s21.getForm().getCheckBox('903_23_CheckBox');
    const janAux = s21.getForm().getCheckBox('903_24_CheckBox');
    const febAux = s21.getForm().getCheckBox('903_25_CheckBox');
    const marAux = s21.getForm().getCheckBox('903_26_CheckBox');
    const aprAux = s21.getForm().getCheckBox('903_27_CheckBox');
    const mayAux = s21.getForm().getCheckBox('903_28_CheckBox');
    const junAux = s21.getForm().getCheckBox('903_29_CheckBox');
    const julAux = s21.getForm().getCheckBox('903_30_CheckBox');
    const augAux = s21.getForm().getCheckBox('903_31_CheckBox');
    const septBs = s21.getForm().getTextField('902_20_Text_C_SanSerif');
    const octBs = s21.getForm().getTextField('902_21_Text_C_SanSerif');
    const novBs = s21.getForm().getTextField('902_22_Text_C_SanSerif');
    const decBs = s21.getForm().getTextField('902_23_Text_C_SanSerif');
    const janBs = s21.getForm().getTextField('902_24_Text_C_SanSerif');
    const febBs = s21.getForm().getTextField('902_25_Text_C_SanSerif');
    const marBs = s21.getForm().getTextField('902_26_Text_C_SanSerif');
    const aprBs = s21.getForm().getTextField('902_27_Text_C_SanSerif');
    const mayBs = s21.getForm().getTextField('902_28_Text_C_SanSerif');
    const junBs = s21.getForm().getTextField('902_29_Text_C_SanSerif');
    const julBs = s21.getForm().getTextField('902_30_Text_C_SanSerif');
    const augBs = s21.getForm().getTextField('902_31_Text_C_SanSerif');
	const septHr = s21.getForm().getField('904_20_S21_Value');
    const octHr = s21.getForm().getField('904_21_S21_Value');
    const novHr = s21.getForm().getField('904_22_S21_Value');
    const decHr = s21.getForm().getField('904_23_S21_Value');
    const janHr = s21.getForm().getField('904_24_S21_Value');
    const febHr = s21.getForm().getField('904_25_S21_Value');
    const marHr = s21.getForm().getField('904_26_S21_Value');
    const aprHr = s21.getForm().getField('904_27_S21_Value');
    const mayHr = s21.getForm().getField('904_28_S21_Value');
    const junHr = s21.getForm().getField('904_29_S21_Value');
    const julHr = s21.getForm().getField('904_30_S21_Value');
    const augHr = s21.getForm().getField('904_31_S21_Value');
	const septRem = s21.getForm().getTextField('905_20_Text_SanSerif');
    const octRem = s21.getForm().getTextField('905_21_Text_SanSerif');
    const novRem = s21.getForm().getTextField('905_22_Text_SanSerif');
    const decRem = s21.getForm().getTextField('905_23_Text_SanSerif');
    const janRem = s21.getForm().getTextField('905_24_Text_SanSerif');
    const febRem = s21.getForm().getTextField('905_25_Text_SanSerif');
    const marRem = s21.getForm().getTextField('905_26_Text_SanSerif');
    const aprRem = s21.getForm().getTextField('905_27_Text_SanSerif');
    const mayRem = s21.getForm().getTextField('905_28_Text_SanSerif');
    const junRem = s21.getForm().getTextField('905_29_Text_SanSerif');
    const julRem = s21.getForm().getTextField('905_30_Text_SanSerif');
    const augRem = s21.getForm().getTextField('905_31_Text_SanSerif');

	name.setText(`${publisher.name == null ? '' : publisher.name}`)
	dateOfBirth.setText(`${publisher.dateOfBirth == null ? '' : publisher.dateOfBirth}`)
	dateOfBaptism.setText(`${publisher.dateOfBaptism == null ? '' : publisher.dateOfBaptism}`)

/*
    name.setText(publisher.name)
    dateOfBirth.setText(publisher.dateOfBirth)
    dateOfBaptism.setText(publisher.dateOfBaptism)
	*/
    if (publisher.gender == "Male") {
        male.check()
        female.uncheck()
    } else if (publisher.gender == "Female") {
        male.uncheck()
        female.check()
    }

	if (publisher.hope == "Other Sheep") {
        otherSheep.check()
        anointed.uncheck()
    } else if (publisher.gender == "Anointed") {
        otherSheep.uncheck()
        anointed.check()
    }

	if (publisher.privilege.includes("Elder")) {
        elder.check()
    } else {
		elder.uncheck()
	}

	if (publisher.privilege.includes("Ministerial Servant")) {
        ministerialServant.check()
    } else {
		ministerialServant.uncheck()
	}

	if (publisher.privilege.includes("Regular Pioneer")) {
        regularPioneer.check()
    } else {
		regularPioneer.uncheck()
	}

	if (publisher.privilege.includes("Special Pioneer")) {
        specialPioneer.check()
    } else {
		specialPioneer.uncheck()
	}

	if (publisher.privilege.includes("Field Missionary")) {
        fieldMissionary.check()
    } else {
		fieldMissionary.uncheck()
	}

	//console.log(publisher.report[`${period}`])

	serviceYear.setText(`${publisher.report[`${period}`].year}`)

	if (publisher.report[`${period}`].sept.sharedInMinistry !== null) {
        septPreached.check()
    } else {
		septPreached.uncheck()
	}

	if (publisher.report[`${period}`].oct.sharedInMinistry !== null) {
        octPreached.check()
    } else {
		octPreached.uncheck()
	}

	if (publisher.report[`${period}`].nov.sharedInMinistry !== null) {
        novPreached.check()
    } else {
		novPreached.uncheck()
	}

	if (publisher.report[`${period}`].dec.sharedInMinistry !== null) {
        decPreached.check()
    } else {
		decPreached.uncheck()
	}
	
	if (publisher.report[`${period}`].jan.sharedInMinistry !== null) {
        janPreached.check()
    } else {
		janPreached.uncheck()
	}
	
	if (publisher.report[`${period}`].feb.sharedInMinistry !== null) {
        febPreached.check()
    } else {
		febPreached.uncheck()
	}
	
	if (publisher.report[`${period}`].mar.sharedInMinistry !== null) {
        marPreached.check()
    } else {
		marPreached.uncheck()
	}
	
	if (publisher.report[`${period}`].apr.sharedInMinistry !== null) {
        aprPreached.check()
    } else {
		aprPreached.uncheck()
	}
	
	if (publisher.report[`${period}`].may.sharedInMinistry !== null) {
        mayPreached.check()
    } else {
		mayPreached.uncheck()
	}
	
	if (publisher.report[`${period}`].jun.sharedInMinistry !== null) {
        junPreached.check()
    } else {
		junPreached.uncheck()
	}
	
	if (publisher.report[`${period}`].jul.sharedInMinistry !== null) {
        julPreached.check()
    } else {
		julPreached.uncheck()
	}
	
	if (publisher.report[`${period}`].aug.sharedInMinistry !== null) {
        augPreached.check()
    } else {
		augPreached.uncheck()
	}

	if (publisher.report[`${period}`].sept.auxiliaryPioneer !== null) {
        septAux.check()
    } else {
		septAux.uncheck()
	}

	if (publisher.report[`${period}`].oct.auxiliaryPioneer !== null) {
        octAux.check()
    } else {
		octAux.uncheck()
	}

	if (publisher.report[`${period}`].nov.auxiliaryPioneer !== null) {
        novAux.check()
    } else {
		novAux.uncheck()
	}

	if (publisher.report[`${period}`].dec.auxiliaryPioneer !== null) {
        decAux.check()
    } else {
		decAux.uncheck()
	}
	
	if (publisher.report[`${period}`].jan.auxiliaryPioneer !== null) {
        janAux.check()
    } else {
		janAux.uncheck()
	}
	
	if (publisher.report[`${period}`].feb.auxiliaryPioneer !== null) {
        febAux.check()
    } else {
		febAux.uncheck()
	}
	
	if (publisher.report[`${period}`].mar.auxiliaryPioneer !== null) {
        marAux.check()
    } else {
		marAux.uncheck()
	}
	
	if (publisher.report[`${period}`].apr.auxiliaryPioneer !== null) {
        aprAux.check()
    } else {
		aprAux.uncheck()
	}
	
	if (publisher.report[`${period}`].may.auxiliaryPioneer !== null) {
        mayAux.check()
    } else {
		mayAux.uncheck()
	}
	
	if (publisher.report[`${period}`].jun.auxiliaryPioneer !== null) {
        junAux.check()
    } else {
		junAux.uncheck()
	}
	
	if (publisher.report[`${period}`].jul.auxiliaryPioneer !== null) {
        julAux.check()
    } else {
		julAux.uncheck()
	}
	
	if (publisher.report[`${period}`].aug.auxiliaryPioneer !== null) {
        augAux.check()
    } else {
		augAux.uncheck()
	}

	septBs.setText(`${publisher.report[`${period}`].sept.bibleStudies == null ? '' : publisher.report[`${period}`].sept.bibleStudies}`)
	octBs.setText(`${publisher.report[`${period}`].oct.bibleStudies == null ? '' : publisher.report[`${period}`].oct.bibleStudies}`)
	novBs.setText(`${publisher.report[`${period}`].nov.bibleStudies == null ? '' : publisher.report[`${period}`].nov.bibleStudies}`)
	decBs.setText(`${publisher.report[`${period}`].dec.bibleStudies == null ? '' : publisher.report[`${period}`].dec.bibleStudies}`)
	janBs.setText(`${publisher.report[`${period}`].jan.bibleStudies == null ? '' : publisher.report[`${period}`].jan.bibleStudies}`)
	febBs.setText(`${publisher.report[`${period}`].feb.bibleStudies == null ? '' : publisher.report[`${period}`].feb.bibleStudies}`)
	marBs.setText(`${publisher.report[`${period}`].mar.bibleStudies == null ? '' : publisher.report[`${period}`].mar.bibleStudies}`)
	aprBs.setText(`${publisher.report[`${period}`].apr.bibleStudies == null ? '' : publisher.report[`${period}`].apr.bibleStudies}`)
	mayBs.setText(`${publisher.report[`${period}`].may.bibleStudies == null ? '' : publisher.report[`${period}`].may.bibleStudies}`)
	junBs.setText(`${publisher.report[`${period}`].jun.bibleStudies == null ? '' : publisher.report[`${period}`].jun.bibleStudies}`)
	julBs.setText(`${publisher.report[`${period}`].jul.bibleStudies == null ? '' : publisher.report[`${period}`].jul.bibleStudies}`)
	augBs.setText(`${publisher.report[`${period}`].aug.bibleStudies == null ? '' : publisher.report[`${period}`].aug.bibleStudies}`)

	septRem.setText(`${publisher.report[`${period}`].sept.remarks == null ? '' : publisher.report[`${period}`].sept.remarks}`)
	octRem.setText(`${publisher.report[`${period}`].oct.remarks == null ? '' : publisher.report[`${period}`].oct.remarks}`)
	novRem.setText(`${publisher.report[`${period}`].nov.remarks == null ? '' : publisher.report[`${period}`].nov.remarks}`)
	decRem.setText(`${publisher.report[`${period}`].dec.remarks == null ? '' : publisher.report[`${period}`].dec.remarks}`)
	janRem.setText(`${publisher.report[`${period}`].jan.remarks == null ? '' : publisher.report[`${period}`].jan.remarks}`)
	febRem.setText(`${publisher.report[`${period}`].feb.remarks == null ? '' : publisher.report[`${period}`].feb.remarks}`)
	marRem.setText(`${publisher.report[`${period}`].mar.remarks == null ? '' : publisher.report[`${period}`].mar.remarks}`)
	aprRem.setText(`${publisher.report[`${period}`].apr.remarks == null ? '' : publisher.report[`${period}`].apr.remarks}`)
	mayRem.setText(`${publisher.report[`${period}`].may.remarks == null ? '' : publisher.report[`${period}`].may.remarks}`)
	junRem.setText(`${publisher.report[`${period}`].jun.remarks == null ? '' : publisher.report[`${period}`].jun.remarks}`)
	julRem.setText(`${publisher.report[`${period}`].jul.remarks == null ? '' : publisher.report[`${period}`].jul.remarks}`)
	augRem.setText(`${publisher.report[`${period}`].aug.remarks == null ? '' : publisher.report[`${period}`].aug.remarks}`)

	septHr.setText(`${publisher.report[`${period}`].sept.hours == null ? '' : publisher.report[`${period}`].sept.hours}`)
	octHr.setText(`${publisher.report[`${period}`].oct.hours == null ? '' : publisher.report[`${period}`].oct.hours}`)
	novHr.setText(`${publisher.report[`${period}`].nov.hours == null ? '' : publisher.report[`${period}`].nov.hours}`)
	decHr.setText(`${publisher.report[`${period}`].dec.hours == null ? '' : publisher.report[`${period}`].dec.hours}`)
	janHr.setText(`${publisher.report[`${period}`].jan.hours == null ? '' : publisher.report[`${period}`].jan.hours}`)
	febHr.setText(`${publisher.report[`${period}`].feb.hours == null ? '' : publisher.report[`${period}`].feb.hours}`)
	marHr.setText(`${publisher.report[`${period}`].mar.hours == null ? '' : publisher.report[`${period}`].mar.hours}`)
	aprHr.setText(`${publisher.report[`${period}`].apr.hours == null ? '' : publisher.report[`${period}`].apr.hours}`)
	mayHr.setText(`${publisher.report[`${period}`].may.hours == null ? '' : publisher.report[`${period}`].may.hours}`)
	junHr.setText(`${publisher.report[`${period}`].jun.hours == null ? '' : publisher.report[`${period}`].jun.hours}`)
	julHr.setText(`${publisher.report[`${period}`].jul.hours == null ? '' : publisher.report[`${period}`].jul.hours}`)
	augHr.setText(`${publisher.report[`${period}`].aug.hours == null ? '' : publisher.report[`${period}`].aug.hours}`)
/*
    var newPdfholder = document.createElement('div')
	var newPdfbutton = document.createElement('button')
	var newPdfViewer = document.createElement('iframe')
	newPdfViewer.height = '600px'
	newPdfViewer.width = '100%'
	newPdfViewer.src = URL.createObjectURL(new Blob([await s21.save()], { type: 'application/pdf' }));
	newPdfbutton.innerHTML = `<a href="${newPdfViewer.src}" style="text-decoration:none" download="${toTitleCase(period.replace('ServiceYear', ''))} Record Card - ${publisher.name}"><i class="fas fa-download"></i></a>`
	newPdfbutton.classList.value = "w3-button w3-black download-button"
	newPdfholder.style.margin = "15px"
	newPdfbutton.style.margin = "10px 0"
	newPdfholder.appendChild(newPdfbutton)
	newPdfholder.appendChild(newPdfViewer)
	document.getElementById("pdfViewer").appendChild(newPdfholder)

	downloadsArray.push([newPdfViewer.src, `${toTitleCase(period.replace('ServiceYear', ''))} Record Card - ${publisher.name}`])
*/
	const recordcard = new Blob([await s21.save()], { type: 'application/pdf' })
	DBWorker.postMessage({ storeName: 'files', action: "save", value: [{name: `${toTitleCase(period.replace('ServiceYear', ''))} Record Card - ${publisher.name}`, value: recordcard }]});

	if (recordsToCreate.length !== 0) {
		if (document.querySelector('#cardProcessStatus')) {
			document.querySelector('#cardProcessStatus').style.display = ''
			document.querySelector('#cardProcessStatus').innerHTML = `Processing cards. Please Wait . . .
			<br>${recordsToCreate.length} Remaining.`
		}
		await fillPublisherRecord(recordsToCreate.shift())
	} else {
		if (document.querySelector('.fa-download')) {
			document.querySelector('.fa-download').classList.remove('fa-spin')
			document.querySelector('.fa-download').classList.remove('fa-spinner')
		}
		if (document.querySelector('#cardProcessStatus')) {
			document.querySelector('#cardProcessStatus').style.display = 'none'
		}
		await shortWait()
		await shortWait()
		DBWorker.postMessage({ storeName: 'files', action: "readAll"});
	}

}

async function fillAttendanceRecord() {
	var s88 = await PDFLib.PDFDocument.load(s88Data);
	// Get the form field by name
	var i = 0, j = 2;
	attendanceVue.meetingAttendanceRecord.meetings.forEach(meeting=>{
		Object.entries(meeting).forEach(([key, value]) => {
			if (key == 'name') return;
			Object.entries(value).forEach(([key2, value2]) => {
				if (i == 0) {
					s88.getForm().getTextField(`Service Year_${j}`).setText(`${value2}`)
				} else if (i == 13 && value2) {
					s88.getForm().getTextField(`${j}-Average_Total`).setText(`${value2}`)
				} else if (value2 && value2.numberOfMeetings) {
					s88.getForm().getTextField(`${j}-Meeting_${i}`).setText(`${value2.numberOfMeetings}`)
					s88.getForm().getTextField(`${j}-Attendance_${i}`).setText(`${value2.totalAttendance}`)
					s88.getForm().getTextField(`${j}-Average_${i}`).setText(`${value2.averageAttendanceEachWeek}`)
				};
				if (i == 0) {
					i = 5
				} else if (i == 12) {
					i = 1
				} else if (i == 4) {
					i = 13
				} else {
					i++
				}
			});
			
			i = 0;
			if (j == 2) {
				j = 1
			} else if (j == 1) {
				j = 4
			} else if (j == 4) {
				j = 3
			}
		});
		
	})
	const attendanceRecord = new Blob([await s88.save()], { type: 'application/pdf' })
	DBWorker.postMessage({ storeName: 'files', action: "save", value: [{name: "Attendance Record", value: attendanceRecord }]});
	const a = document.createElement('a');
	a.href = URL.createObjectURL(attendanceRecord);
	a.download = "Attendance Record";
	a.click();
	await shortWait()
	await shortWait()
	await shortWait()
}

async function assignmentSlip(data, count) {
	if (!count) {
		count = 1
	}
	if (!data[0]) {
		data[0] = {"assignedTo": "", "assistant": "", "week": "", "meetingPart": ""}
	}
	if (!data[1]) {
		data[1] = {"assignedTo": "", "assistant": "", "week": "", "meetingPart": ""}
	}
	if (!data[2]) {
		data[2] = {"assignedTo": "", "assistant": "", "week": "", "meetingPart": ""}
	}
	if (!data[3]) {
		data[3] = {"assignedTo": "", "assistant": "", "week": "", "meetingPart": ""}
	}
	const student1 = data[0].assignedTo
	const assist1 = data[0].assistant
	const week1 = data[0].week
	const no1 = data[0].meetingPart.split(' ')[0].replace('.', '')
	const student2 = data[1].assignedTo
	const assist2 = data[1].assistant
	const week2 = data[1].week
	const no2 = data[1].meetingPart.split(' ')[0].replace('.', '')
	const student3 = data[2].assignedTo
	const assist3 = data[2].assistant
	const week3 = data[2].week
	const no3 = data[2].meetingPart.split(' ')[0].replace('.', '')
	const student4 = data[3].assignedTo
	const assist4 = data[3].assistant
	const week4 = data[3].week
	const no4 = data[3].meetingPart.split(' ')[0].replace('.', '')
	var s89 = await PDFLib.PDFDocument.load(s89Data);
    // Get the form field by name
    //const fieldName = fieldNameInput.value;
    const name1 = s89.getForm().getTextField('900_1_Text_SanSerif');
    const assistant1 = s89.getForm().getTextField('900_2_Text_SanSerif');
    const date1 = s89.getForm().getTextField('900_3_Text_SanSerif');
    const partNo1 = s89.getForm().getTextField('900_4_Text_SanSerif');
    const mainHall1 = s89.getForm().getCheckBox('900_5_CheckBox');
    const auxClass11 = s89.getForm().getCheckBox('900_6_CheckBox');
    const auxClass89 = s89.getForm().getCheckBox('900_7_CheckBox');
    const name2 = s89.getForm().getTextField('900_8_Text_SanSerif');
    const assistant2 = s89.getForm().getTextField('900_9_Text_SanSerif');
    const date2 = s89.getForm().getTextField('900_10_Text_SanSerif');
    const partNo2 = s89.getForm().getTextField('900_11_Text_SanSerif');
    const mainHall2 = s89.getForm().getCheckBox('900_12_CheckBox');
    const auxClass12 = s89.getForm().getCheckBox('900_13_CheckBox');
    const auxClass22 = s89.getForm().getCheckBox('900_14_CheckBox');
	const name3 = s89.getForm().getTextField('900_15_Text_SanSerif');
    const assistant3 = s89.getForm().getTextField('900_16_Text_SanSerif');
    const date3 = s89.getForm().getTextField('900_17_Text_SanSerif');
    const partNo3 = s89.getForm().getTextField('900_18_Text_SanSerif');
    const mainHall3 = s89.getForm().getCheckBox('900_19_CheckBox');
    const auxClass13 = s89.getForm().getCheckBox('900_20_CheckBox');
    const auxClass23 = s89.getForm().getCheckBox('900_21_CheckBox');
	const name4 = s89.getForm().getTextField('900_22_Text_SanSerif');
    const assistant4 = s89.getForm().getTextField('900_23_Text_SanSerif');
    const date4 = s89.getForm().getTextField('900_24_Text_SanSerif');
    const partNo4 = s89.getForm().getTextField('900_25_Text_SanSerif');
    const mainHall4 = s89.getForm().getCheckBox('900_26_CheckBox');
    const auxClass14 = s89.getForm().getCheckBox('900_27_CheckBox');
    const auxClass24 = s89.getForm().getCheckBox('900_28_CheckBox');

	name1.setText(`${student1 == null ? '' : student1}`)
	assistant1.setText(`${assist1 == null ? '' : assist1}`)
	date1.setText(`${week1 == null ? '' : week1}`)
	partNo1.setText(`${no1 == null ? '' : no1}`)

	name2.setText(`${student2 == null ? '' : student2}`)
	assistant2.setText(`${assist2 == null ? '' : assist2}`)
	date2.setText(`${week2 == null ? '' : week2}`)
	partNo2.setText(`${no2 == null ? '' : no2}`)

	name3.setText(`${student3 == null ? '' : student3}`)
	assistant3.setText(`${assist3 == null ? '' : assist3}`)
	date3.setText(`${week3 == null ? '' : week3}`)
	partNo3.setText(`${no3 == null ? '' : no3}`)

	name4.setText(`${student4 == null ? '' : student4}`)
	assistant4.setText(`${assist4 == null ? '' : assist4}`)
	date4.setText(`${week4 == null ? '' : week4}`)
	partNo4.setText(`${no4 == null ? '' : no4}`)
	
	mainHall1.check()
	mainHall2.check()
	mainHall3.check()
	mainHall4.check()

	await shortWait()
	await shortWait()
	await shortWait()

	var newPdfholder = document.createElement('div')
	var newPdfbutton = document.createElement('button')
	var newPdfViewer = document.createElement('iframe')
	newPdfViewer.height = '600px'
	newPdfViewer.width = '100%'
	newPdfViewer.src = URL.createObjectURL(new Blob([await s89.save()], { type: 'application/pdf' }));
	newPdfbutton.innerHTML = `<a href="${newPdfViewer.src}" style="text-decoration:none" download="Assignment Slips - ${count}"><i class="fas fa-download"></i></a>`
	newPdfbutton.classList.value = "w3-button w3-black download-button"
	newPdfholder.style.margin = "15px"
	newPdfbutton.style.margin = "10px 0"
	newPdfholder.appendChild(newPdfbutton)
	newPdfholder.appendChild(newPdfViewer)
	document.getElementById("pdfViewer").appendChild(newPdfholder)

	await shortWait()
	await shortWait()
	await shortWait()


	downloadsArray.push([newPdfViewer.src, `Assignment Slips - ${count}`])

	if (assignmentsToSend.length !== 0) {
		count++
		await shortWait()
		await shortWait()
		await shortWait()

		assignmentSlip(assignmentsToSend.splice(0, 4), count)
	}
}

var allMonths = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

async function fillAccountSheet() {
	var s26 = await PDFLib.PDFDocument.load(s26Data);
	// Get the form field by name
	s26.getForm().getTextField('900_1_Text_C').setText(configurationVue.configuration.congregationName)
    s26.getForm().getTextField('900_2_Text_C').setText(configurationVue.configuration.city)
    s26.getForm().getTextField('900_3_Text_C').setText(configurationVue.configuration.province)
    s26.getForm().getTextField('900_4_Text_C').setText(allMonths[Number(entryVue.currentMonth.split('-')[1]) - 1])
    s26.getForm().getTextField('900_5_Text_C').setText(entryVue.currentMonth.split('-')[0])

	var i = 0
	var receiptIn = 0, receiptOut = 0, primaryIn = 0, primaryOut = 0
	entryVue.monthlyRecords().filter(elem=>elem.month == entryVue.currentMonth)[0].entries.filter(elem=>elem.transactionCode !== 'BF' && elem.transactionCode !== 'BS' && elem.transactionCode !== 'PD' && elem.transactionCode !== 'PC' && elem.transactionCode !== 'KH' && elem.transactionCode !== 'RW' && elem.transactionCode !== 'TF' && elem.transactionCode !== 'TD').forEach(elem=>{
		s26.getForm().getTextField(`900_${i + 7}_Text_C`).setText(elem.date.split('-')[2])
		s26.getForm().getTextField(`900_${i + 59}_Text`).setText(elem.transactionDescription)
		s26.getForm().getTextField(`900_${i + 111}_Text_C`).setText(elem.transactionCode)
		if (elem.transactionCode == 'C' || elem.transactionCode == 'W') {
			s26.getForm().getTextField(`901_${i + 1}_S26Value`).setText(`${(elem.amount).toLocaleString().split('.')[0]}.${(elem.amount).toFixed(2).split('.')[1]}`)
		}
		if (elem.transactionCode == 'D' || (elem.transactionCode == 'E' && elem.account == 'RECEIPTS')) {
			s26.getForm().getTextField(`901_${i + 54}_S26Value`).setText(`${(elem.amount).toLocaleString().split('.')[0]}.${(elem.amount).toFixed(2).split('.')[1]}`)
		}
		if (elem.transactionCode == 'D') {
			s26.getForm().getTextField(`902_${i + 1}_S26Value`).setText(`${(elem.amount).toLocaleString().split('.')[0]}.${(elem.amount).toFixed(2).split('.')[1]}`)
		}
		if ((elem.transactionCode == 'E' && elem.account == 'PRIMARY ACCOUNT')) {
			s26.getForm().getTextField(`902_${i + 54}_S26Value`).setText(`${(elem.amount).toLocaleString().split('.')[0]}.${(elem.amount).toFixed(2).split('.')[1]}`)
		}
		if ((elem.transactionCode !== 'E' && elem.account == 'SECONDARY ACCOUNT')) {
			s26.getForm().getTextField(`903_${i + 1}_S26Value`).setText(`${(elem.amount).toLocaleString().split('.')[0]}.${(elem.amount).toFixed(2).split('.')[1]}`)
		}
		if ((elem.transactionCode == 'E' && elem.account == 'SECONDARY ACCOUNT')) {
			s26.getForm().getTextField(`903_${i + 54}_S26Value`).setText(`${(elem.amount).toLocaleString().split('.')[0]}.${(elem.amount).toFixed(2).split('.')[1]}`)
		}
		
		i++
	})

	s26.getForm().getTextField(`900_${i + 7}_Text_C`).setText(entryVue.lastDay(entryVue.currentMonth).split(' ')[1].replace(',',''))
	
	s26.getForm().getTextField(`900_${i + 59}_Text`).setText(`To Branch Office - (${entryVue.singleAmount('TD')})`)
	s26.getForm().getTextField(`902_${i + 54}_S26Value`).setText(`${entryVue.endingBalance(entryVue.totalContributions('W'), entryVue.singleAmount('RW'), 0, true)}`)
	
	i++

	if (entryVue.totalContributions('W') !== '') {
		s26.getForm().getTextField(`900_${i + 59}_Text`).setText(`WW (from box) [${ entryVue.totalContributions('W') }]`)
		i++
	}
	if (entryVue.monthlyRecords().filter(elem=>elem.month == entryVue.currentMonth)[0].entries.filter(elem=>elem.transactionCode == 'RW').length !== 0) {
		s26.getForm().getTextField(`900_${i + 59}_Text`).setText(`WW (resolution) [${(entryVue.monthlyRecords().filter(elem=>elem.month == entryVue.currentMonth)[0].entries.filter(elem=>elem.transactionCode == 'RW')[0].amount).toLocaleString().split('.')[0] + '.' + (entryVue.monthlyRecords().filter(elem=>elem.month == entryVue.currentMonth)[0].entries.filter(elem=>elem.transactionCode == 'RW')[0].amount).toFixed(2).split('.')[1] }]`)
		i++
	}

	s26.getForm().getTextField(`901_53_S26TotalValue`).setText(`${entryVue.receiptInTotal()}`)
	s26.getForm().getTextField(`904_30_S26TotalAmount`).setText(`${entryVue.receiptInTotal()}`)

	s26.getForm().getTextField(`901_106_S26TotalValue`).setText(`${entryVue.receiptOutTotal()}`)
	s26.getForm().getTextField(`904_31_S26TotalAmount`).setText(`${entryVue.receiptOutTotal()}`)

	s26.getForm().getTextField(`902_53_S26TotalValue`).setText(`${entryVue.primaryInTotal()}`)
	s26.getForm().getTextField(`904_34_S26TotalAmount`).setText(`${entryVue.primaryInTotal()}`)

	s26.getForm().getTextField(`902_106_S26TotalValue`).setText(`${entryVue.primaryOutTotal()}`)
	s26.getForm().getTextField(`904_35_S26TotalAmount`).setText(`${entryVue.primaryOutTotal()}`)

	s26.getForm().getTextField(`903_53_S26TotalValue`).setText(`${entryVue.secondaryInTotal()}`)
	s26.getForm().getTextField(`904_39_S26TotalAmount`).setText(`${entryVue.secondaryInTotal()}`)

	s26.getForm().getTextField(`903_106_S26TotalValue`).setText(`${entryVue.secondaryOutTotal()}`)
	s26.getForm().getTextField(`904_40_S26TotalAmount`).setText(`${entryVue.secondaryOutTotal()}`)

	s26.getForm().getTextField(`904_1_Text_C`).setText(`${entryVue.lastDay(entryVue.currentMonth)}`)
	s26.getForm().getTextField(`904_2_S26Amount`).setText(`${entryVue.singleAmount('BS')}`)
	s26.getForm().getTextField(`904_3_S26Amount`).setText(`${entryVue.singleAmount('PD')}`)
	s26.getForm().getTextField(`904_4_S26Amount`).setText(`${entryVue.singleAmount('PC')}`)
	s26.getForm().getTextField(`904_5_S26TotalAmount`).setText(`${entryVue.bankAccountSum()}`)
	if (!entryVue.remittanceMonth(entryVue.lastDay(entryVue.currentMonth), entryVue.singleAmount('TD'))) {
		s26.getForm().getTextField(`904_6_Text`).setText(`To Branch Office - (${entryVue.singleAmount('TD')})`)
		s26.getForm().getTextField(`904_7_S26Amount`).setText(`${entryVue.endingBalance(entryVue.totalContributions('W'), entryVue.singleAmount('RW'), 0, true)}`)
		s26.getForm().getTextField(`904_20_S26TotalAmount`).setText(`${entryVue.endingBalance(entryVue.totalContributions('W'), entryVue.singleAmount('RW'), 0, true)}`)
	}
	s26.getForm().getTextField(`904_23_S26TotalAmount`).setText(`${entryVue.bankAccountReconcile(entryVue.lastDay(entryVue.currentMonth), entryVue.singleAmount('TD'))}`)
	s26.getForm().getTextField(`904_28_Text_C`).setText(`${entryVue.lastDay(entryVue.currentMonth)}`)
	
	s26.getForm().getTextField(`904_29_S26Amount`).setText(`${entryVue.openingBalance('RECEIPTS')}`)
	s26.getForm().getTextField(`904_32_S26TotalAmount`).setText(`${entryVue.receiptEndingBalance()}`)

	s26.getForm().getTextField(`904_33_S26Amount`).setText(`${entryVue.openingBalance('PRIMARY ACCOUNT')}`)
	s26.getForm().getTextField(`904_36_S26TotalAmount`).setText(`${entryVue.primaryEndingBalance()}`)

	s26.getForm().getTextField(`904_38_S26Amount`).setText(`${entryVue.openingBalance('SECONDARY ACCOUNT')}`)
	s26.getForm().getTextField(`904_41_S26TotalAmount`).setText(`${entryVue.secondaryEndingBalance()}`)

	s26.getForm().getTextField(`904_42_S26TotalAmount`).setText(`${entryVue.totalFundsOnHand()}`)
	

	const accountSheet = new Blob([await s26.save()], { type: 'application/pdf' })
	DBWorker.postMessage({ storeName: 'files', action: "save", value: [{name: `Accounts Sheet - ${entryVue.currentMonth}`, value: accountSheet }]});

	await fillAccountsReport()
}

async function fillAccountsReport() {
	var s30 = await PDFLib.PDFDocument.load(s30Data);
	// Get the form field by name
	s30.getForm().getTextField('900_1_Text').setText(configurationVue.configuration.congregationName)
    s30.getForm().getTextField('900_2_Text').setText(`${entryVue.cleanMonth(entryVue.currentMonth)}`)
	
    s30.getForm().getTextField('901_1_S30_Value').setText(entryVue.singleAmount('TF'))
    s30.getForm().getTextField('901_2_S30_Value').setText(entryVue.totalContributions('C'))
    s30.getForm().getTextField('901_3_S30_Value').setText(entryVue.totalContributions('CE'))
    s30.getForm().getTextField('901_6_S30_Total').setText(entryVue.endingBalance(entryVue.totalContributions('C'), entryVue.totalContributions('CE'), 0, true))
    s30.getForm().getTextField('901_7_S30_Value').setText(entryVue.totalContributions('W'))
    s30.getForm().getTextField('901_10_S30_Total').setText(entryVue.totalContributions('W'))
    s30.getForm().getTextField('901_11_S30_Total').setText(entryVue.endingBalance(entryVue.totalContributions('C'), entryVue.totalContributions('CE'), entryVue.totalContributions('W'), true))
    s30.getForm().getTextField('901_12_S30_Value').setText(entryVue.totalContributions('E'))
    s30.getForm().getTextField('901_13_S30_Value').setText(entryVue.singleAmount('RW'))
    s30.getForm().getTextField('900_7_Text').setText('Bank service charge')
    s30.getForm().getTextField('901_14_S30_Value').setText(entryVue.bankCharge())
    s30.getForm().getTextField('901_19_S30_Total').setText(entryVue.endingBalance(entryVue.totalContributions('E'), entryVue.singleAmount('RW'), entryVue.bankCharge(), true))
    s30.getForm().getTextField('901_20_S30_Value').setText(entryVue.totalContributions('W'))
    s30.getForm().getTextField('901_23_S30_Total').setText(entryVue.totalContributions('W'))
    s30.getForm().getTextField('901_24_S30_Total').setText(entryVue.endingBalance(entryVue.endingBalance(entryVue.totalContributions('E'), entryVue.singleAmount('RW'), entryVue.bankCharge(), true), entryVue.totalContributions('W'), 0, true))
    s30.getForm().getTextField('901_25_S30_Total').setText(entryVue.endingBalance(0, entryVue.endingBalance(entryVue.totalContributions('C'), entryVue.totalContributions('CE'), entryVue.totalContributions('W'), true), entryVue.endingBalance(entryVue.endingBalance(entryVue.totalContributions('E'), entryVue.singleAmount('RW'), entryVue.bankCharge(), true), entryVue.totalContributions('W'), 0, true)))
    s30.getForm().getTextField('901_26_S30_Total').setText(entryVue.endOfMonth())
    s30.getForm().getTextField('901_30_S30_Total').setText(entryVue.endOfMonth())

	s30.getForm().getTextField('900_16_Text_C').setText(configurationVue.configuration.acct)

    s30.getForm().getTextField('900_17_Text_C').setText(`${entryVue.cleanMonth(entryVue.currentMonth)}`)
    s30.getForm().getTextField('901_31_S30_Total').setText(entryVue.endingBalance(entryVue.totalContributions('C'), entryVue.totalContributions('CE'), 0, true))
    s30.getForm().getTextField('901_32_S30_Total').setText(entryVue.endingBalance(entryVue.totalContributions('E'), entryVue.singleAmount('RW'), entryVue.bankCharge(), true))
    s30.getForm().getTextField('901_33_S30_Total').setText(entryVue.endOfMonth())
    s30.getForm().getTextField('901_34_S30_Total').setText(entryVue.totalContributions('W'))

	const accountReport = new Blob([await s30.save()], { type: 'application/pdf' })
	DBWorker.postMessage({ storeName: 'files', action: "save", value: [{name: `Accounts Report - ${entryVue.currentMonth}`, value: accountReport }]});

	await fillFundTransfer()
}

async function fillFundTransfer() {
	var to62 = await PDFLib.PDFDocument.load(to62Data);
	// Get the form field by name
    to62.getForm().getCheckBox('900_1_CheckBox').check()
	to62.getForm().getTextField('900_3_Text').setText(configurationVue.configuration.congregationName)
	to62.getForm().getCheckBox('900_5_CheckBox').check()

	to62.getForm().getTextField('901_1_TO62Donate').setText(entryVue.totalContributions('W'))
	to62.getForm().getTextField('901_2_TO62Donate').setText(entryVue.singleAmount('RW'))
	to62.getForm().getTextField('901_9_TO62TotalDonate').setText(entryVue.endingBalance(entryVue.singleAmount('RW'), entryVue.totalContributions('W'), 0, true) )
	to62.getForm().getTextField('901_11_TO62TotalFunds').setText(entryVue.endingBalance(entryVue.singleAmount('RW'), entryVue.totalContributions('W'), 0, true) )
	to62.getForm().getTextField('900_13_Text').setText(entryVue.singleAmount('TD'))
	to62.getForm().getTextField('900_16_Text_C').setText(configurationVue.configuration.acct)

	const fundTransfer = new Blob([await to62.save()], { type: 'application/pdf' })
	DBWorker.postMessage({ storeName: 'files', action: "save", value: [{name: `Funds Transfer - ${entryVue.currentMonth}`, value: fundTransfer }]});
	await shortWait()
	await shortWait()
	DBWorker.postMessage({ storeName: 'files', action: "readAll"});
}

var s21Data, s88Data, s89Data, s26Data, s30Data, to62Data;

async function getFieldByName(file, variable) {

    if (file) {
        const reader = new FileReader();

        reader.onload = async function (e) {
            const pdfData = new Uint8Array(e.target.result);

            // Using pdf-lib to load the PDF document
			if (variable == 'S-21') {
				s21Data = new Uint8Array(e.target.result);
			} else if (variable == 'S-26') {
				s26Data = new Uint8Array(e.target.result);
			} else if (variable == 'S-30') {
				s30Data = new Uint8Array(e.target.result);
			} else if (variable == 'TO-62') {
				to62Data = new Uint8Array(e.target.result);
			} else if (variable == 'S-88') {
				s88Data = new Uint8Array(e.target.result);
			} else if (variable == 'S-89') {
				s89Data = new Uint8Array(e.target.result);
			}
        };

        reader.readAsArrayBuffer(file);
    }
}

function generatePDF(element, fileName, orientation) {
	// Get the HTML element to be saved as PDF
	//const element = document.getElementById('content');

	// Configure the options for pdf generation
	const options = {
	  margin: 10,
	  filename: fileName + '.pdf',
	  image: { type: 'jpeg', quality: 0.98 },
	  html2canvas: { scale: 2 },
	  jsPDF: { unit: 'mm', format: 'a4', orientation: orientation ? orientation : 'portrait' }
	};

	// Use html2pdf library to generate PDF
	html2pdf().from(element).set(options).save();
}

var myImage;

async function convertToImage(content) {
	//const content = document.getElementById('content');

	// Use html2canvas with options
	html2canvas(content, {
	  scale: 2, // Increase scale for higher resolution
	  logging: true, // Enable logging for debugging (optional)
	  width: content.offsetWidth, // Set the width explicitly
	  height: content.offsetHeight, // Set the height explicitly
	  useCORS: true // Use CORS to load external images (optional, may be needed for some content)
	}).then(async function(canvas) {
	  // Convert the canvas to a data URL representing a PNG image
	  const imageData = canvas.toDataURL('image/png');

	  // Create an Image element with the generated image
	  const image = new Image();
	  //myImage = new Image();
	  image.src = imageData;
	  //myImage.src = imageData;
	  await convertToPdf(image)

	  //return image

	  // Append the image to the body or any desired location
	});
}

var downloadsArray = []

async function convertToPdf(element) {
	// Get the PNG image element from the page
	const pngImageElement = element//document.getElementById('pngImage');

	// Create a PDF document
	const pdfDoc = await PDFLib.PDFDocument.create();
	const page = pdfDoc.addPage();
	const { width, height } = page.getSize();

	// Convert the PNG image to an ArrayBuffer
	const pngImageBlob = await fetch(pngImageElement.src).then(response => response.blob());
	const pngImageArrayBuffer = await new Response(pngImageBlob).arrayBuffer();

	// Embed the PNG image in the PDF
	const pngImage = await pdfDoc.embedPng(pngImageArrayBuffer);
	const pngDims = pngImage.scale(0.375);

	// Draw the image on the PDF page
	page.drawImage(pngImage, {
	  x: 0,
	  y: 0,
	  width: pngDims.width,
	  height: pngDims.height,
	});

	// Save the PDF

	if (scheduleVue.display !== true) {
		document.querySelector('#content').innerHTML = ''
		document.querySelector('#content').style.display = 'none'
	}
	
	var newPdfholder = document.createElement('div')
	var newPdfbutton = document.createElement('button')
	var downloadAllbutton = document.createElement('button')
	var newPdfViewer = document.createElement('iframe')
	newPdfViewer.height = '600px'
	newPdfViewer.width = '100%'
	newPdfViewer.src = URL.createObjectURL(new Blob([await pdfDoc.save()], { type: 'application/pdf' }));

	if (scheduleVue.display == true) {
		newPdfbutton.innerHTML = `<a href="${newPdfViewer.src}" style="text-decoration:none" download="Life and Ministry Meeting Schedule - ${document.querySelectorAll('.createdPDF').length + 1}"><i class="fas fa-download"></i></a>`
	} else if (scheduleVue.display !== true) {
		newPdfbutton.innerHTML = `<a href="${newPdfViewer.src}" style="text-decoration:none" download="Letter of Introduction - ${allPublishersVue.selectedPublisher.name}"><i class="fas fa-download"></i></a>`
	}

	downloadAllbutton.innerHTML = `<span onclick="downloadAll()">Download All</span>`
	newPdfbutton.classList.value = "w3-button w3-black download-button createdPDF"
	newPdfholder.style.margin = "15px"
	newPdfbutton.style.margin = "10px 0"
	downloadAllbutton.classList.value = "w3-button w3-black"
	downloadAllbutton.style.margin = "10px 5px"
	
	newPdfholder.appendChild(newPdfbutton)
	
	if (scheduleVue.display !== true) {
		newPdfholder.appendChild(downloadAllbutton)
	} else if (scheduleVue.display == true) {
		if (document.querySelectorAll('.download-button').length == 0) {
			newPdfholder.appendChild(downloadAllbutton)
		}
	}
	
	newPdfholder.appendChild(newPdfViewer)
	document.getElementById("pdfViewer").appendChild(newPdfholder)

	downloadsArray.push([newPdfViewer.src, `Letter of Introduction - ${allPublishersVue.selectedPublisher.name}`])
	
	document.querySelectorAll('#publisherRequest select').forEach(elem=>{
		if (elem !== '') {
			recordsToCreate.push([allPublishersVue.publishers.filter(ele=>ele.name == elem.value)[0], 'currentServiceYear'])
			//recordsToCreate.push([allPublishersVue.publishers.filter(ele=>ele.name == elem.value)[0], 'lastServiceYear'])
		}
	})

	await shortWait()
	await shortWait()
	await shortWait()

	if (recordsToCreate.length !== 0) {
		await fillPublisherRecord(recordsToCreate.shift())
	}
}

async function convertImageToPdf(fileName) {
    const fileInput = document.getElementById('pdfFile');
    const file = fileInput.files[0];

    if (file) {
        const reader = new FileReader();
        reader.onload = async function(event) {
            const img = new Image();
            img.onload = async function() {
                const pdfDoc = await PDFLib.PDFDocument.create();
                const page = pdfDoc.addPage([img.width, img.height]); // Set PDF page size to match image size
              
                // Embed the image in the PDF
                const uint8Array = new Uint8Array(event.target.result);
                let embeddedImage;
                if (file.type === 'image/png') {
                    embeddedImage = await pdfDoc.embedPng(uint8Array);
                } else if (file.type === 'image/jpeg') {
                    embeddedImage = await pdfDoc.embedJpg(uint8Array);
                }

                // Draw the image on the PDF page
                page.drawImage(embeddedImage, {
                    x: 0,
                    y: 0,
                    width: img.width,
                    height: img.height,
                });

                // Save the PDF
                const pdfBytes = await pdfDoc.save();
                
                // Create a Blob object from the PDF bytes
                const pdfBlob = new Blob([pdfBytes], { type: 'application/pdf' });
				//console.log(pdfBlob)
				DBWorker.postMessage({ storeName: 'files', action: "save", value: [{name: fileName, value: pdfBlob}]});
				await shortWait()
				await shortWait()
				DBWorker.postMessage({ storeName: 'files', action: "readAll"});
            };
            img.src = URL.createObjectURL(file);
        };
        reader.readAsArrayBuffer(file);
    }
}


async function downloadAll() {
	document.querySelectorAll('.download-button a').forEach(async (elem)=>{
		await shortWait()
		await shortWait()
		elem.click()
		await shortWait()
		await shortWait()
		await shortWait()
	})
}

var recordsToCreate = []

async function downloadPreparedFiles(data) {
	const a = document.createElement('a');
	a.href = data[0];
	a.download = data[1];
	a.click();
	await shortWait()
	await shortWait()
	await shortWait()
}

// Function to create a PDF
async function createPDF(content) {
	// Create a new PDF document
	const pdfDoc = await PDFLib.PDFDocument.create();

	// Add a new page to the document
	const page = pdfDoc.addPage();

	// Add a title to the page
	const { width, height } = page.getSize();
	const titleText = content.title;

	page.drawText(titleText, {
		x: 50,
		y: height - 100,
		//font: font,
		fontSize: '24px',
		//color: rgb(0, 0, 0), // Black color
	});

	// Add content to the page

	const contentText = content.content;
	page.drawText(contentText, {
		x: 50,
		y: height - 200,
		//font: font,
		fontSize: '12px',
	});

	// Save the PDF to a Uint8Array
	const pdfBytes = await pdfDoc.save();

	// Convert Uint8Array to Blob
	const pdfBlob = new Blob([pdfBytes], { type: 'application/pdf' });
	// Create a data URL from the Blob
	const dataUrl = URL.createObjectURL(pdfBlob);

	// Set the new data URL as the source for the iframe
	document.getElementById('letter').src = dataUrl;
}
