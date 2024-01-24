
const loginForm = document.getElementById("login-form");
const loginButton = document.getElementById("login-form-submit");
const defaultLogin = loginButton.innerHTML;
const loginErrorMsg = document.getElementById("login-error-msg");
loginForm.confirmPassword.style.display = 'none';
document.getElementById("securityQuestions").style.display = 'none';
loginErrorMsg.style.opacity = 0;
var logged = false, reportEntry = false;
var hiddenElements = ["congregation", "allParticipants", "allPublishers", "allAssignments", "contactInformation", "fieldServiceGroups", "monthlyReport", "missingReport", "attendance", "branchReport", "configuration"]
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
	//var radioButtons = document.getElementsByName("securityGroup");

	for (var i = 0; i < radioButtons.length; i++) {
		if (radioButtons[i].checked) {
			var selectedOption = radioButtons[i].value;
			//console.log("Selected Option: " + selectedOption);
			return selectedOption;
		}
	}
  
	console.log("No option selected");
}
  

createRadioButtons("securityQuestions", securityQuestions)

loginButton.addEventListener("click", (e) => {
    e.preventDefault();
    const username = loginForm.username.value;
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
			//console.log(existingUser)
			//console.log(existingUser.accesses.findIndex(str => currentUser.accesses.includes(str)) !== -1)
			if (existingUser.accesses.findIndex(str => currentUser.accesses.includes(str)) !== -1) {
				loginErrorMsg.innerHTML = 'User already exists. Please enter a different username.'
			} else if (existingUser.password !== password) {
				loginErrorMsg.innerHTML = 'Invalid password.'
			} else if (existingUser.selectedQuestion !== getSelectedOption(document.getElementsByName("securityGroup")) || existingUser.answer.trim() !== document.querySelector('#answer').value.toLowerCase().trim()) {
				loginErrorMsg.innerHTML = 'Invalid question and/or answer.'
			} else {
				if (currentUser.currentProfile == 'Secretary') {
					//reportEntry = true
				} else if (currentUser.currentProfile == 'Secretary - Assistant') {
					//reportEntry = false
				}
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

				allUsers.push(currentUser)

				document.getElementById("home").style.display = 'none'
				DBWorker.postMessage({ storeName: 'settings', action: "save", value: [currentUser]});
				DBWorker.postMessage({ dbName: 'cong-' + currentUser.username.toLowerCase(), action: "init"});
				loginErrorMsg.style.opacity = 0;
			} else if (currentUser.currentProfile == 'Secretary') {
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
				navigationVue.displayDropdown = true

				allUsers.push(currentUser)
				
				document.getElementById("home").style.display = 'none'
				DBWorker.postMessage({ storeName: 'settings', action: "save", value: [currentUser]});
				DBWorker.postMessage({ dbName: 'cong-' + currentUser.username.toLowerCase(), action: "init"});
				loginErrorMsg.style.opacity = 0;
			}
			if (currentUser.currentProfile == 'Life and Ministry Overseer') {
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
		hiddenElements.forEach(elem=>{
			document.getElementById(`${elem}`).style.display = ''
		})
		if (currentUser.currentProfile == 'Secretary') {
			//reportEntry = true
		} else if (currentUser.currentProfile == 'Secretary - Assistant') {
			//reportEntry = false
		}
		logged = true
		document.getElementById("home").style.display = 'none'
		DBWorker.postMessage({ dbName: 'cong-' + currentUser.username.toLowerCase(), action: "init"});
		loginErrorMsg.style.opacity = 0;
		
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
		
    } else if (username.toLowerCase() === "reporter".toLowerCase() && password === "super") {
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

var navigationVue, navigationVue2, allPublishersVue, congregationVue, configurationVue, branchReportVue, contactInformationVue, fieldServiceGroupsVue, monthlyReportVue, missingReportVue, allAssignmentsVue;
var allButtons = [
	{"title": "CONG", "function": "congregationVue"}, 
	{"title": "RECORDS", "function": "allPublishersVue"}, 
	{"title": "REQUEST", "function": "allPublishersVue"}, 
	{"title": "TRANSFER", "function": "allPublishersVue"}, 
	{"title": "GROUPS", "function": "fieldServiceGroupsVue"}, 
	{"title": "ACTIVE", "function": "fieldServiceGroupsVue"}, 
	{"title": "ALL", "function": "fieldServiceGroupsVue"}, 
	{"title": "CONTACTS", "function": "contactInformationVue"}, 
	{"title": "REPORTS", "function": "missingReportVue"}, 
	{"title": "CURRENT", "function": "monthlyReportVue"}, 
	{"title": "ASSIGNMENTS", "function": "allAssignmentsVue"}, 
	{"title": "BRANCH", "function": "branchReportVue"}, 
	{"title": "ATTENDANCE", "function": "attendanceVue"},
	{"title": "PARTICIPANTS", "function": "allParticipantsVue"},
	{"title": "SETTINGS", "function": "configurationVue"}
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
					DBWorker.postMessage({ storeName: msgData.name, action: "deleteItem", value: elem.name});
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
					if (msgData.value.filter(elem=>elem.name == "Life and Ministry").length !== 0) {
						if (!msgData.value.filter(elem=>elem.name == "Life and Ministry")[0].enrolments) {
							msgData.value.filter(elem=>elem.name == "Life and Ministry")[0].enrolments = []
						}
						if (!msgData.value.filter(elem=>elem.name == "Life and Ministry")[0].assignments) {
							msgData.value.filter(elem=>elem.name == "Life and Ministry")[0].assignments = []
						}
						allParticipantsVue.lifeAndMinistry = msgData.value.filter(elem=>elem.name == "Life and Ministry")[0]
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
							congregationVue.display = true
						} else if (currentUser.currentProfile == 'Secretary - Assistant') {
							configurationVue.reportEntry = 'sendReport'
							navigationVue.buttons = [{"title": "CURRENT", "function": "monthlyReportVue"}, {"title": "ATTENDANCE", "function": "attendanceVue"}, {"title": "BRANCH", "function": "branchReportVue"}]
							navigationVue.displayDropdown = true
							missingReportVue.display = true
						} else if (currentUser.currentProfile == 'Life and Ministry Overseer') {
							configurationVue.reportEntry = 'lmo'
							navigationVue.buttons = [{"title": "SCHEDULE", "function": "contactInformationVue"}, {"title": "PARTICIPANTS", "function": "allParticipantsVue"}, {"title": "CONTACTS", "function": "contactInformationVue"}]
							allAssignmentsVue.display = true
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
						} else if (currentUser.currentProfile == 'Life and Ministry Overseer') {
							configurationVue.reportEntry = 'lmo'
							navigationVue.buttons = [{"title": "SCHEDULE", "function": "contactInformationVue"}, {"title": "PARTICIPANTS", "function": "allParticipantsVue"}, {"title": "CONTACTS", "function": "contactInformationVue"}]
							allAssignmentsVue.display = true
						}

						configured = true
						//navigationVue.buttons = [{"title": "CONG", "function": "congregationVue"}, {"title": "RECORDS", "function": "allPublishersVue"}, {"title": "GROUPS", "function": "fieldServiceGroupsVue"}, {"title": "REPORTS", "function": "missingReportVue"}]
						
						//navigationVue.buttons = [{"title": "RECORDS", "function": "allPublishersVue"}, {"title": "GROUPS", "function": "fieldServiceGroupsVue"}, {"title": "CONTACTS", "function": "contactInformationVue"}, {"title": "REPORTS", "function": "missingReportVue"}, {"title": "ATTENDANCE", "function": "attendanceVue"}, {"title": "SETTINGS", "function": "configurationVue"}]
						configurationVue.configuration = msgData.value.filter(elem=>elem.name == "Congregation")[0]
						navigationVue.allGroups = msgData.value.filter(elem=>elem.name == "Congregation")[0].fieldServiceGroups
						DBWorker.postMessage({ storeName: 'data', action: "readAll"});
						DBWorker.postMessage({ storeName: 'attendance', action: "readAll"});
						DBWorker.postMessage({ storeName: 'files', action: "readAll"});
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
					allPublishersVue.publishers = msgData.value
					/*
					var publisherRecords = []
					allPublishersVue.publishers.forEach(publisher=>{
						monthlyReportVue.months.slice(0, monthlyReportVue.months.findIndex(elem=>elem.abbr == monthlyReportVue.month.abbr)).forEach(elem=>{
							if (publisher.report.currentServiceYear[`${elem.abbr}`].sharedInMinistry == null) {
								publisherRecords.push({'publisher': publisher, 'name': publisher.name, 'month': elem, 'fieldServiceGroup': publisher.fieldServiceGroup, 'contactInformation': publisher.contactInformation, 'dateOfBirth': publisher.dateOfBirth, 'report':publisher.report.currentServiceYear[`${elem.abbr}`]})
							}
						})
					})

					const currentDate = new Date();
					const formattedDate = `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1).toString().padStart(2, '0')}`;

					DBWorker.postMessage({ storeName: 'configuration', action: "save", value: [{"name": "Late Reports", "month": formattedDate, "value": publisherRecords}]});
					
					console.log(publisherRecords)*/
				}
				break;
			case "files":
				{
					//myFile = msgData.value
					console.log(msgData.value)
					//console.log(msgData.value[0])
					if (msgData.value.filter(elem=>elem.name == 'S-21_E.pdf').length !== 0) {
						//console.log(msgData.value.filter(elem=>elem.name == 'S-21_E.pdf')[0])
						if (!s21current) {
							await getFieldByName(msgData.value.filter(elem=>elem.name == 'S-21_E.pdf')[0])
						}
					}

				}
				break;
			case "settings":
				{
					console.log(msgData.value)
					//if (msgData.value.filter(elem=>elem.name == currentUser.username).length !== 0) {
						allUsers = msgData.value//.filter(elem=>elem.name == currentUser.username)[0]
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
						//console.log(msgData.value)
						attendanceVue.meetingAttendanceRecord = msgData.value.filter(elem=>elem.name == "Meeting Attendance Record")[0]
					} else {
						attendanceVue.meetingAttendanceRecord = meetingAttendanceRecord
						DBWorker.postMessage({ storeName: 'attendance', action: "save", value: [attendanceVue.meetingAttendanceRecord]});
					}
					
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
			case "done":
				{
					// No code here
				}
				break;
		}
	}
}

//var myFile;

// style="padding:16px 0 0 2px; margin-top:1px"  style="margin-top:2px"

document.querySelector('#navigation').innerHTML = `<template>
<div class="w3-bar w3-white w3-card" id="myNavbar">
	<a class="w3-bar-item w3-button w3-wide" @click="openButton($event.target)">{{ buttons[0] ? buttons[0].title : '' }}</a>
	<!-- Right-sided navbar links -->
	<div class="w3-right w3-hide-small">
		<a v-for="(button, count) in buttons.slice(1)" class="w3-bar-item w3-button" @click="openButton($event.target)">{{ button.title }}</a>
		<a v-if="logged() == true && displayDropdown == true && showDownloadButton()" class="w3-bar-item w3-button" @click="downloadContent()"><i title="Download" class="fa fa-download"></i></a>
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
				return allPublishersVue.display == true ||	fieldServiceGroupsVue.display == true || contactInformationVue.display == true
			},
			async downloadContent() {
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
				
				if (allPublishersVue.transfer == true) {
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
				}

				configurationVue.display = false

				if (button.innerHTML == "REPORTS") {
					this.displayDropdown = true
					allPublishersVue.request = false
					allPublishersVue.transfer = false
					this.buttons = [{"title": "CURRENT", "function": "monthlyReportVue"}, {"title": "ATTENDANCE", "function": "attendanceVue"}, {"title": "BRANCH", "function": "branchReportVue"}, {"title": "CONG", "function": "congregationVue"}]
				} else if (button.innerHTML == "CURRENT") {
					this.displayDropdown = true
					allPublishersVue.request = false
					allPublishersVue.transfer = false
					this.buttons = [{"title": "REPORTS", "function": "missingReportVue"}, {"title": "ATTENDANCE", "function": "attendanceVue"}, {"title": "BRANCH", "function": "branchReportVue"}, {"title": "CONG", "function": "congregationVue"}]
				} else if (button.innerHTML == "ATTENDANCE") {
					this.displayDropdown = false
					allPublishersVue.request = false
					allPublishersVue.transfer = false
					this.buttons = [{"title": "REPORTS", "function": "missingReportVue"}, {"title": "CURRENT", "function": "monthlyReportVue"}, {"title": "BRANCH", "function": "branchReportVue"}, {"title": "CONG", "function": "congregationVue"}]
				} else if (button.innerHTML == "BRANCH") {
					this.displayDropdown = false
					allPublishersVue.request = false
					allPublishersVue.transfer = false
					this.buttons = [{"title": "REPORTS", "function": "missingReportVue"}, {"title": "CURRENT", "function": "monthlyReportVue"}, {"title": "ATTENDANCE", "function": "attendanceVue"}, {"title": "CONG", "function": "congregationVue"}]
				} else if (button.innerHTML == "CONG") {
					this.displayDropdown = false
					allPublishersVue.request = false
					allPublishersVue.transfer = false
					this.buttons = [{"title": "CONTACTS", "function": "contactInformationVue"}, {"title": "RECORDS", "function": "allPublishersVue"}, {"title": "GROUPS", "function": "fieldServiceGroupsVue"}, {"title": "REPORTS", "function": "missingReportVue"}]
				} else if (button.innerHTML == "CONTACTS") {
					this.displayDropdown = true
					allPublishersVue.request = false
					allPublishersVue.transfer = false
					if (currentUser.currentProfile == 'Life and Ministry Overseer') {
						this.buttons = [{"title": "ASSIGNMENTS", "function": "allAssignmentsVue"}, {"title": "SCHEDULE", "function": "contactInformationVue"}, {"title": "PARTICIPANTS", "function": "allParticipantsVue"}]
					} else {
						this.buttons = [{"title": "CONG", "function": "congregationVue"}, {"title": "RECORDS", "function": "allPublishersVue"}, {"title": "GROUPS", "function": "fieldServiceGroupsVue"}, {"title": "REPORTS", "function": "missingReportVue"}]
					}
				} else if (button.innerHTML == "RECORDS") {
					this.displayDropdown = true
					allPublishersVue.request = false
					allPublishersVue.transfer = false
					this.buttons = [{"title": "CONG", "function": "congregationVue"}, {"title": "CONTACTS", "function": "contactInformationVue"}, {"title": "REQUEST", "function": "allPublishersVue"}, {"title": "TRANSFER", "function": "allPublishersVue"}, {"title": "GROUPS", "function": "fieldServiceGroupsVue"}, {"title": "REPORTS", "function": "missingReportVue"}]
				} else if (button.innerHTML == "REQUEST") {
					this.displayDropdown = false
					allPublishersVue.request = true
					allPublishersVue.transfer = false
					this.buttons = [{"title": "CONG", "function": "congregationVue"}, {"title": "CONTACTS", "function": "contactInformationVue"}, {"title": "RECORDS", "function": "allPublishersVue"}, {"title": "TRANSFER", "function": "allPublishersVue"}, {"title": "GROUPS", "function": "fieldServiceGroupsVue"}, {"title": "REPORTS", "function": "missingReportVue"}]
				} else if (button.innerHTML == "TRANSFER") {
					this.displayDropdown = false
					allPublishersVue.request = false
					allPublishersVue.transfer = true
					this.buttons = [{"title": "CONG", "function": "congregationVue"}, {"title": "CONTACTS", "function": "contactInformationVue"}, {"title": "RECORDS", "function": "allPublishersVue"}, {"title": "REQUEST", "function": "allPublishersVue"}, {"title": "GROUPS", "function": "fieldServiceGroupsVue"}, {"title": "REPORTS", "function": "missingReportVue"}]
				} else if (button.innerHTML == "GROUPS") {
					this.displayDropdown = true
					allPublishersVue.request = false
					allPublishersVue.transfer = false
					this.buttons = [{"title": "CONG", "function": "congregationVue"}, {"title": "CONTACTS", "function": "contactInformationVue"}, {"title": "RECORDS", "function": "allPublishersVue"}, {"title": "ACTIVE", "function": "fieldServiceGroupsVue"}, {"title": "REPORTS", "function": "missingReportVue"}]
				} else if (button.innerHTML == "ACTIVE") {
					this.displayDropdown = true
					allPublishersVue.request = false
					allPublishersVue.transfer = false
					this.buttons = [{"title": "CONG", "function": "congregationVue"}, {"title": "CONTACTS", "function": "contactInformationVue"}, {"title": "RECORDS", "function": "allPublishersVue"}, {"title": "ALL", "function": "fieldServiceGroupsVue"}, {"title": "REPORTS", "function": "missingReportVue"}]
				} else if (button.innerHTML == "ALL") {
					this.displayDropdown = true
					allPublishersVue.request = false
					allPublishersVue.transfer = false
					this.buttons = [{"title": "CONG", "function": "congregationVue"}, {"title": "CONTACTS", "function": "contactInformationVue"}, {"title": "RECORDS", "function": "allPublishersVue"}, {"title": "ACTIVE", "function": "fieldServiceGroupsVue"}, {"title": "REPORTS", "function": "missingReportVue"}]
				} else if (button.innerHTML == "PARTICIPANTS") {
					this.displayDropdown = true
					allPublishersVue.request = false
					allPublishersVue.transfer = false
					this.buttons = [{"title": "ASSIGNMENTS", "function": "allAssignmentsVue"}, {"title": "SCHEDULE", "function": "contactInformationVue"}, {"title": "CONTACTS", "function": "contactInformationVue"}]
				} else if (button.innerHTML == "ASSIGNMENTS") {
					this.displayDropdown = true
					allPublishersVue.request = false
					allPublishersVue.transfer = false
					this.buttons = [{"title": "SCHEDULE", "function": "contactInformationVue"}, {"title": "PARTICIPANTS", "function": "allParticipantsVue"}, {"title": "CONTACTS", "function": "contactInformationVue"}]
				} else {
					this.displayDropdown = false
					allPublishersVue.request = false
					allPublishersVue.transfer = false
					this.buttons = [{"title": "CONG", "function": "congregationVue"}, {"title": "CONTACTS", "function": "contactInformationVue"}, {"title": "RECORDS", "function": "allPublishersVue"}, {"title": "GROUPS", "function": "fieldServiceGroupsVue"}, {"title": "REPORTS", "function": "missingReportVue"}]
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
				} else if (button.innerHTML == "ALL" || button.innerHTML == "ACTIVE") {
					fieldServiceGroupsVue.inactive()
				} else {
					gotoView(allButtons.filter(elem=>elem.title == button.innerHTML)[0].function)
					
				}
				
			},
			logged() {
                return logged
            },
			openSettings() {
				var groupCount = navigationVue.buttons.findIndex(elem=>elem.title == 'ALL' || elem.title == 'ACTIVE')
				if (groupCount !== -1){
					navigationVue.buttons[groupCount].title = 'GROUPS'
				}

				if (allPublishersVue.transfer == true) {
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
				}

				allPublishersVue.request = false
				allPublishersVue.transfer = false
				navigationVue.displayDropdown = false
				gotoView('configurationVue')
			},
			signOut() {
				location.reload()
				return
				navigationVue.buttons = []
				congregationVue.display = false
				allPublishersVue.display = false
				fieldServiceGroupsVue.display = false
				configurationVue.display = false
				monthlyReportVue.display = false
				missingReportVue.display = false
				attendanceVue.display = false
				contactInformationVue.display = false
				branchReportVue.display = false
				logged = false
				navigationVue.displayDropdown = false
				document.getElementById("home").style.display = ''//v-if="button.title == 'ACTIVE' || button.title == 'ALL' || button.title == 'REQUEST'" //v-for="(button) in buttons().filter(elem=>elem.title == 'ACTIVE' || elem.title == 'ALL' || elem.title == 'REQUEST' || elem.title == 'TRANSFER')"
				//location.href = "/cong/"
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
    <a v-for="(button) in buttons()" v-if="button.title !== 'ACTIVE' && button.title !== 'ALL' && button.title !== 'REQUEST' && button.title !== 'TRANSFER'" @click="openButton($event.target)" class="w3-bar-item w3-button">{{ button.title }}</a>
    <a v-else @click="openButton($event.target)" :class="mode()">{{ button.title }}</a>
	<a v-if="logged() == true && displayDropdown == true && showDownloadButton()" class="w3-bar-item w3-button" @click="downloadContent()"><i title="Download" class="fa fa-download"></i> Download</a>
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
				return allPublishersVue.display == true ||	fieldServiceGroupsVue.display == true || contactInformationVue.display == true
			},
			async downloadContent() {
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
				if (allPublishersVue.transfer == true) {
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
				}

				configurationVue.display = false
				
				if (button.innerHTML == "REPORTS") {
					navigationVue.displayDropdown = true
					allPublishersVue.request = false
					allPublishersVue.transfer = false
					navigationVue.buttons = [{"title": "CURRENT", "function": "monthlyReportVue"}, {"title": "ATTENDANCE", "function": "attendanceVue"}, {"title": "BRANCH", "function": "branchReportVue"}, {"title": "CONG", "function": "congregationVue"}]
				} else if (button.innerHTML == "CURRENT") {
					navigationVue.displayDropdown = true
					allPublishersVue.request = false
					allPublishersVue.transfer = false
					navigationVue.buttons = [{"title": "REPORTS", "function": "missingReportVue"}, {"title": "ATTENDANCE", "function": "attendanceVue"}, {"title": "BRANCH", "function": "branchReportVue"}, {"title": "CONG", "function": "congregationVue"}]
				} else if (button.innerHTML == "ATTENDANCE") {
					navigationVue.displayDropdown = false
					allPublishersVue.request = false
					allPublishersVue.transfer = false
					navigationVue.buttons = [{"title": "REPORTS", "function": "missingReportVue"}, {"title": "CURRENT", "function": "monthlyReportVue"}, {"title": "BRANCH", "function": "branchReportVue"}, {"title": "CONG", "function": "congregationVue"}]
				} else if (button.innerHTML == "BRANCH") {
					navigationVue.displayDropdown = false
					allPublishersVue.request = false
					allPublishersVue.transfer = false
					navigationVue.buttons = [{"title": "REPORTS", "function": "missingReportVue"}, {"title": "CURRENT", "function": "monthlyReportVue"}, {"title": "ATTENDANCE", "function": "attendanceVue"}, {"title": "CONG", "function": "congregationVue"}]
				} else if (button.innerHTML == "CONG") {
					navigationVue.displayDropdown = false
					allPublishersVue.request = false
					allPublishersVue.transfer = false
					navigationVue.buttons = [{"title": "CONTACTS", "function": "contactInformationVue"}, {"title": "RECORDS", "function": "allPublishersVue"}, {"title": "GROUPS", "function": "fieldServiceGroupsVue"}, {"title": "REPORTS", "function": "missingReportVue"}]
				} else if (button.innerHTML == "CONTACTS") {
					navigationVue.displayDropdown = true
					allPublishersVue.request = false
					allPublishersVue.transfer = false
					if (currentUser.currentProfile == 'Life and Ministry Overseer') {
						navigationVue.buttons = [{"title": "ASSIGNMENTS", "function": "allAssignmentsVue"}, {"title": "SCHEDULE", "function": "contactInformationVue"}, {"title": "PARTICIPANTS", "function": "allParticipantsVue"}]
					} else {
						navigationVue.buttons = [{"title": "CONG", "function": "congregationVue"}, {"title": "RECORDS", "function": "allPublishersVue"}, {"title": "GROUPS", "function": "fieldServiceGroupsVue"}, {"title": "REPORTS", "function": "missingReportVue"}]
					}
				} else if (button.innerHTML == "RECORDS") {
					navigationVue.displayDropdown = true
					allPublishersVue.request = false
					allPublishersVue.transfer = false
					navigationVue.buttons = [{"title": "CONG", "function": "congregationVue"}, {"title": "CONTACTS", "function": "contactInformationVue"}, {"title": "REQUEST", "function": "allPublishersVue"}, {"title": "TRANSFER", "function": "allPublishersVue"}, {"title": "GROUPS", "function": "fieldServiceGroupsVue"}, {"title": "REPORTS", "function": "missingReportVue"}]
				} else if (button.innerHTML == "REQUEST") {
					navigationVue.displayDropdown = false
					allPublishersVue.request = true
					allPublishersVue.transfer = false
					navigationVue.buttons = [{"title": "CONG", "function": "congregationVue"}, {"title": "CONTACTS", "function": "contactInformationVue"}, {"title": "RECORDS", "function": "allPublishersVue"}, {"title": "TRANSFER", "function": "allPublishersVue"}, {"title": "GROUPS", "function": "fieldServiceGroupsVue"}, {"title": "REPORTS", "function": "missingReportVue"}]
				} else if (button.innerHTML == "TRANSFER") {
					navigationVue.displayDropdown = false
					allPublishersVue.request = false
					allPublishersVue.transfer = true
					navigationVue.buttons = [{"title": "CONG", "function": "congregationVue"}, {"title": "CONTACTS", "function": "contactInformationVue"}, {"title": "RECORDS", "function": "allPublishersVue"}, {"title": "REQUEST", "function": "allPublishersVue"}, {"title": "GROUPS", "function": "fieldServiceGroupsVue"}, {"title": "REPORTS", "function": "missingReportVue"}]
				} else if (button.innerHTML == "GROUPS") {
					navigationVue.displayDropdown = true
					allPublishersVue.request = false
					allPublishersVue.transfer = false
					navigationVue.buttons = [{"title": "CONG", "function": "congregationVue"}, {"title": "CONTACTS", "function": "contactInformationVue"}, {"title": "RECORDS", "function": "allPublishersVue"}, {"title": "ACTIVE", "function": "fieldServiceGroupsVue"}, {"title": "REPORTS", "function": "missingReportVue"}]
				} else if (button.innerHTML == "ACTIVE") {
					navigationVue.displayDropdown = true
					allPublishersVue.request = false
					allPublishersVue.transfer = false
					navigationVue.buttons = [{"title": "CONG", "function": "congregationVue"}, {"title": "CONTACTS", "function": "contactInformationVue"}, {"title": "RECORDS", "function": "allPublishersVue"}, {"title": "ALL", "function": "fieldServiceGroupsVue"}, {"title": "REPORTS", "function": "missingReportVue"}]
				} else if (button.innerHTML == "ALL") {
					navigationVue.displayDropdown = true
					allPublishersVue.request = false
					allPublishersVue.transfer = false
					navigationVue.buttons = [{"title": "CONG", "function": "congregationVue"}, {"title": "CONTACTS", "function": "contactInformationVue"}, {"title": "RECORDS", "function": "allPublishersVue"}, {"title": "ACTIVE", "function": "fieldServiceGroupsVue"}, {"title": "REPORTS", "function": "missingReportVue"}]
				} else if (button.innerHTML == "PARTICIPANTS") {
					navigationVue.displayDropdown = true
					allPublishersVue.request = false
					allPublishersVue.transfer = false
					navigationVue.buttons = [{"title": "ASSIGNMENTS", "function": "allAssignmentsVue"}, {"title": "SCHEDULE", "function": "contactInformationVue"}, {"title": "CONTACTS", "function": "contactInformationVue"}]
				} else {
					navigationVue.displayDropdown = false
					allPublishersVue.request = false
					allPublishersVue.transfer = false
					navigationVue.buttons = [{"title": "CONG", "function": "congregationVue"}, {"title": "CONTACTS", "function": "contactInformationVue"}, {"title": "RECORDS", "function": "allPublishersVue"}, {"title": "GROUPS", "function": "fieldServiceGroupsVue"}, {"title": "REPORTS", "function": "missingReportVue"}]
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
				} else if (button.innerHTML == "ALL" || button.innerHTML == "ACTIVE") {
					fieldServiceGroupsVue.inactive()
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
				var groupCount = navigationVue.buttons.findIndex(elem=>elem.title == 'ALL' || elem.title == 'ACTIVE')
				if (groupCount !== -1){
					navigationVue.buttons[groupCount].title = 'GROUPS'
				}

				if (allPublishersVue.transfer == true) {
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
				}

				allPublishersVue.request = false
				allPublishersVue.transfer = false
				navigationVue.displayDropdown = false
				gotoView('configurationVue')
			},
			signOut() {
				w3_close()
				location.reload()
				return
				navigationVue.buttons = []
				congregationVue.display = false
				allPublishersVue.display = false
				fieldServiceGroupsVue.display = false
				configurationVue.display = false
				monthlyReportVue.display = false
				missingReportVue.display = false
				attendanceVue.display = false
				contactInformationVue.display = false
				branchReportVue.display = false
				logged = false
				navigationVue.displayDropdown = false
				document.getElementById("home").style.display = ''
				//location.href = "/cong/"
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

function gotoView(button) {
	congregationVue.display = false
	allPublishersVue.display = false
	allParticipantsVue.display = false
	fieldServiceGroupsVue.display = false
    configurationVue.display = false
	monthlyReportVue.display = false
	missingReportVue.display = false
	attendanceVue.display = false
	allAssignmentsVue.display = false
	contactInformationVue.display = false
	branchReportVue.display = false
	if (button == "congregationVue" || button == "configurationVue") {
		navigationVue.display = false
	} else {
		navigationVue.display = true
	}
	window[`${button}`].display = true
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
								<select :class="inputMode('gender w3-input')" :v-model="publisher.gender">
									<option v-if="publisher.gender !== 'Male' && publisher.gender !== 'Female'" value="">Select Gender</option>
									<option v-if="publisher.gender == 'Male' || publisher.gender == 'Female'" :value="publisher.gender">{{ publisher.gender }}</option>
									<option v-for="gender in ['Male', 'Female'].filter(elem=>elem !== publisher.gender)" :value="gender">{{ gender }}</option>
								</select>
							</p>
							<p>
								<label>Date of Baptism: <input v-if="publisher.dateOfBaptism == null" type="date" :class="inputMode('dateOfBaptism w3-input')"><input v-if="publisher.dateOfBaptism !== null" type="date" :class="inputMode('dateOfBaptism w3-input')" :value="cleanDate(publisher.dateOfBaptism)"></label>
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
										<th>Service Year 2024</th>
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
								<select :class="inputMode('gender w3-input')" :v-model="publisher.gender">
									<option v-if="publisher.gender !== 'Male' && publisher.gender !== 'Female'" value="">Select Gender</option>
									<option v-if="publisher.gender == 'Male' || publisher.gender == 'Female'" :value="publisher.gender">{{ publisher.gender }}</option>
									<option v-for="gender in ['Male', 'Female'].filter(elem=>elem !== publisher.gender)" :value="gender">{{ gender }}</option>
								</select>
							</p>
							<p>
								<label>Date of Baptism: <input v-if="publisher.dateOfBaptism == null" type="date" :class="inputMode('dateOfBaptism w3-input')"><input v-if="publisher.dateOfBaptism !== null" type="date" :class="inputMode('dateOfBaptism w3-input')" :value="cleanDate(publisher.dateOfBaptism)"></label>
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
										<th>Service Year 2024</th>
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
							<select :class="inputMode('gender w3-input')" :v-model="publisher.gender">
								<option v-if="publisher.gender !== 'Male' && publisher.gender !== 'Female'" value="">Select Gender</option>
								<option v-if="publisher.gender == 'Male' || publisher.gender == 'Female'" :value="publisher.gender">{{ publisher.gender }}</option>
								<option v-for="gender in ['Male', 'Female'].filter(elem=>elem !== publisher.gender)" :value="gender">{{ gender }}</option>
							</select>
						</p>
						<p>
							<label>Date of Baptism: <input v-if="publisher.dateOfBaptism == null" type="date" :class="inputMode('dateOfBaptism w3-input')"><input v-if="publisher.dateOfBaptism !== null" type="date" :class="inputMode('dateOfBaptism w3-input')" :value="cleanDate(publisher.dateOfBaptism)"></label>
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
									<th>Service Year 2024</th>
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
            preview: false,
            publisherName: '',
			congregationAddress: '',
			email: '',
			letterOfIntroduction: '',
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
        },
		watch: {
			//publisherName: 'addPublisher',
			congregationAddress: 'updateAddress',
			letterOfIntroduction: 'updateLetterBody'
		},
        methods: {
			/*addPublisher(event) {
				if (event !== '') {
					this.selectedTransferPublishers.push(event)
				}
			},*/
			async previewRecord() {
				if (this.publisherName == '') { return }
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
				document.querySelector('.closing').innerText += '\n'
				document.querySelector('.closing').innerText += this.congregation.congregationName
				document.querySelector('.closing').innerText += ' Congregation'
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
            removePublisher(count, name, item) {
                if (confirm('Are you sure you want to delete "' + name + '" records?\nPress "OK" to Delete')) {
					item.parentNode.parentNode.parentNode.querySelector('.detail').style.display = 'none'
					item.parentNode.parentNode.parentNode.querySelector('.main').style.display = ''
					this.publishers.splice(count, 1)
					DBWorker.postMessage({ storeName: 'data', action: "deleteItem", value: name});
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
			lifeAndMinistry: {},
        },
        computed: {
			publishers() {
                return allPublishersVue.publishers.filter(elem=>elem.active == true)
            },
			enrolments() {
                return allParticipantsVue.lifeAndMinistry.enrolments
            },
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
				if (item.parentNode.classList.value.includes('main')) {
                    item.parentNode.parentNode.querySelector('.main').style.display = 'none'
                    item.parentNode.parentNode.querySelector('.detail').style.display = ''
                } else {
					if (item.parentNode.parentNode.querySelector('.name').innerHTML.trim() == '' || item.parentNode.parentNode.querySelector('.name').innerHTML.trim().replaceAll('&nbsp;','').replaceAll('nbsp;','').replaceAll('&amp;','').replaceAll(' ','') == '') {
						alert("Please enter Name")
						return
					}

					if (publisher.hope) {
						item.parentNode.parentNode.parentNode.querySelector('.detail').style.display = 'none'
                    	item.parentNode.parentNode.parentNode.querySelector('.main').style.display = ''
						return
					}
                    publisher.name = item.parentNode.parentNode.querySelector('.name').innerHTML
                    publisher.gender = item.parentNode.parentNode.querySelector('.gender').value
                    item.parentNode.parentNode.parentNode.querySelector('.detail').style.display = 'none'
                    item.parentNode.parentNode.parentNode.querySelector('.main').style.display = ''
                    DBWorker.postMessage({ storeName: 'configuration', action: "save", value: [{"name": "Life and Ministry", "enrolments": allParticipantsVue.enrolments}]});
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
					DBWorker.postMessage({ storeName: 'configuration', action: "save", value: [{"name": "Life and Ministry", "enrolments": allParticipantsVue.enrolments}]});
				}
            }
        }
    })
}


document.querySelector('#fieldServiceGroups').innerHTML = `<template>
	<div v-if="display == true">
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
				return mode
			},
			groupPublishers(group) {
                return allPublishersVue.publishers.filter(elem=>elem.fieldServiceGroup == group && (elem.active == true || this.active == true))
            },
			publisherDetail(publisher) {
				this.selectedPublisher = publisher
                //fillPublisherRecord(publisher)
			},
            updateRecord(publisher) {
				updatePublisherRecord(publisher)
			},
			inactive() {
				this.active = !this.active;
			}
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
							<p style="margin:0" v-if="publisher.emergencyContactInformation && publisher.emergencyContactInformation.name !== null" title="Emergency Contact"><i class="fas fa-user"></i> {{ publisher.emergencyContactInformation.name }}</p>
							<p style="margin:0" v-if="publisher.emergencyContactInformation && publisher.emergencyContactInformation.phoneNumber !== null" v-for="(number) in getEachNumber(publisher.emergencyContactInformation.phoneNumber)" @click="call(number)" title="Call Emergency Number"><i class="fas fa-address-book"></i> {{ number }}</p>
						</div>
						<div class="detail" style="display:none; padding:0 15px 15px 15px">
							<p><label>Phone Number: <input :class="inputMode('contactInformation w3-input')" type="tel" :value="publisher.contactInformation.phoneNumber" @change="handleInputChange($event.target, publisher, 'phoneNumber')"></label></p>
							<p><label>Address:<input :class="inputMode('contactInformation w3-input')" type="text" :value="publisher.contactInformation.address" @change="handleInputChange($event.target, publisher, 'address')"></label></p>
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
				if (currentUser.currentProfile == 'Life and Ministry Overseer') {
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
            updateRecord(publisher) {
				updatePublisherRecord(publisher)
			},
            handleInputChange(event, publisher, property) {
				if (configurationVue.reportEntry == 'lmo' || configurationVue.reportEntry == 'lma') {
					if (event.value == '') {
						publisher[`${property}`] = null
					} else {
						publisher[`${property}`] = event.value
					}
					DBWorker.postMessage({ storeName: 'configuration', action: "save", value: [{"name": "Life and Ministry", "enrolments": allParticipantsVue.enrolments}]});
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
								<p style="margin:0"><label>Auxiliary Pioneer: <input style="margin-left:8px" :class="inputMode('auxiliaryPioneer')" type="checkbox"></label></p>
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
						elem.querySelector('.sharedInMinistry').checked ? publisher.report.currentServiceYear[`${currentMonth}`].sharedInMinistry = true : publisher.report.currentServiceYear[`${currentMonth}`].sharedInMinistry = null
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
            updateRecord(publisher) {
				updatePublisherRecord(publisher)
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
            message(event, group) {

				console.log(event.parentNode.parentNode.parentNode, group)
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

				var recipient = ''//group.OverseerMail//'someone@example.com';
				var subject = 'MISSING - ' + group + ' - ' + attendanceVue.cleanDate(new Date());
				var body = `Dear Brother :
Please these are the reports still missing for your field service group.
Thanks,


`
				
				var mailtoLink = 'mailto:' + encodeURIComponent(recipient) +
								'?subject=' + encodeURIComponent(subject) +
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
			await shortWait()
			await shortWait()
			allAssignmentsVue.assignDetails = document.getElementById('result').innerText.split('\n')
			allAssignmentsVue.currentSection = allAssignmentsVue.assignDetails[3].trim()
			allAssignmentsVue.currentWeek = allAssignmentsVue.assignDetails.shift().trim()
			//allParticipantsVue.lifeAndMinistry.assignments.push({ "week": allAssignmentsVue.currentWeek, "meetingPart": allAssignmentsVue.assignDetails.shift().trim(), "section": allAssignmentsVue.currentSection })
			newAssignments.push({ "week": allAssignmentsVue.currentWeek, "meetingPart": allAssignmentsVue.assignDetails.shift().trim(), "section": allAssignmentsVue.currentSection, "assignTo": "elder" })
			const firstAssignment = allAssignmentsVue.assignDetails.shift().trim()
			await shortWait()
			await shortWait()
			//console.log(allAssignmentsVue.assignDetails)
			//return

			//allParticipantsVue.lifeAndMinistry.assignments.push({ "week": allAssignmentsVue.currentWeek, "meetingPart": firstAssignment, "section": allAssignmentsVue.currentSection })
			newAssignments.push({ "week": allAssignmentsVue.currentWeek, "meetingPart": firstAssignment, "section": allAssignmentsVue.currentSection, "assignTo": "exemplary" })
			const song = allAssignmentsVue.assignDetails.findIndex(elem=>elem.trim().split(' ')[0] == firstAssignment.split(' ')[0])
			//console.log(allAssignmentsVue.assignDetails[found])
			await shortWait()
			await shortWait()
			//allParticipantsVue.lifeAndMinistry.assignments.push({ "week": allAssignmentsVue.currentWeek, "meetingPart": allAssignmentsVue.assignDetails.splice(song, 1)[0].trim(), "section": allAssignmentsVue.assignDetails[song - 1].trim() })
			newAssignments.push({ "week": allAssignmentsVue.currentWeek, "meetingPart": allAssignmentsVue.assignDetails.splice(song, 1)[0].trim(), "section": allAssignmentsVue.assignDetails[song - 1].trim() })
			await shortWait()
			await shortWait()
			//allParticipantsVue.lifeAndMinistry.assignments.push({ "week": allAssignmentsVue.currentWeek, "meetingPart": allAssignmentsVue.assignDetails.pop().trim(), "section": allAssignmentsVue.currentSection })
			newAssignments.push({ "week": allAssignmentsVue.currentWeek, "meetingPart": allAssignmentsVue.assignDetails.pop().trim(), "section": allAssignmentsVue.currentSection, "assignTo": "exemplary" })

			var i = 1, j = 0, assignTo
			while (j < allAssignmentsVue.assignDetails.length) {
				//console.log(i, j)
				const found = allAssignmentsVue.assignDetails.findIndex(elem=>elem.startsWith(i + '. '))
				
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
						assignTo = "appointed"
						allAssignmentsVue.currentSection = allAssignmentsVue.assignDetails[song - 1].trim()
					} else if (`${newPart.split('min.)')[0]}min.)`.trim().includes('(30 min.)')) {
						assignTo = "elder"
					} else if (assignTo == "elder") {
						assignTo = "exemplary"
					}
					

					//allParticipantsVue.lifeAndMinistry.assignments.push({ "week": allAssignmentsVue.currentWeek, "meetingPart": `${newPart.split('min.)')[0]}min.)`.trim(), "section": allAssignmentsVue.currentSection })
					newAssignments.push({ "week": allAssignmentsVue.currentWeek, "meetingPart": `${newPart.split('min.)')[0]}min.)`.trim(), "section": allAssignmentsVue.currentSection, "assignTo": assignTo })
					i++
				}
				
				if (found > j) {
					j = found
				}
				j++
				newAssignments.forEach(elem=>{
					const found = allParticipantsVue.lifeAndMinistry.assignments.findIndex(ele=>ele.week == elem.week && ele.meetingPart == elem.meetingPart && ele.section == elem.section)
					if (found !== -1) {
						allParticipantsVue.lifeAndMinistry.assignments[found] = elem
					} else {
						allParticipantsVue.lifeAndMinistry.assignments.push(elem)
					}
				})
			}
			
			await shortWait()
			await shortWait()

			DBWorker.postMessage({ storeName: 'configuration', action: "save", value: [allParticipantsVue.lifeAndMinistry]});
		})
		.catch(error => {
			console.error('Error reading clipboard text:', error);
		});
}


document.querySelector('#allAssignments').innerHTML = `<template>
	<div v-if="display == true" style="display:block">
		<h2 class="w3-center">ASSIGNMENTS</h2>
		<div id="result" style="display:none; margin-top: 20px; border: 1px solid #ccc; padding: 10px;" contenteditable="true">
			Result will appear here...
		</div>
		<div style="display:flex; flex-wrap:wrap">
			<button class="w3-button w3-black" style="margin:5px 0 10px 20px" onclick="convertClipboardToHTML()"><i class="fas fa-file-import"></i> Import</button>
			<select v-model="selectedWeek" style="margin:5px 20px; width:250px" :class="inputMode('week w3-input')">
				<option value="All Assignments">All Assignments</option>
				<option v-for="week in allWeeks()" :value="week.week">{{ week.week }}</option>
			</select>
			<select v-model="selectedAssignTo" style="margin:5px 20px; width:250px" :class="inputMode('assignTo w3-input')">
				<option value="All Assign To">All Assign To</option>
				<option v-for="week in allAssignTo()" :value="week.assignTo">{{ toTitleCase(week.assignTo) }}</option>
			</select>
		</div>

		<div class="w3-row-padding w3-grayscale" style="margin-top:5px">
			<div v-for="(week, count) in assignments" :key="week.week + '|' + count" v-if="(selectedWeek == week.week || selectedWeek == 'All Assignments') && (selectedAssignTo == week.assignTo || selectedAssignTo == 'All Assign To')" class="w3-col l3 m6 w3-margin-bottom">
				<div style="padding-bottom:10px" :class="mode()">
					<div class="w3-container">
						<div style="display:flex; justify-content:space-between">
							<h3 style="margin-right:4px">{{ week.week }}</h3>
							<h4 style="text-align: right;" @click="deleteAssignment(count)" title="Delete Assignment"><i class="fas fa-trash"></i></h4>
						</div>
						<div class="main" style="cursor:pointer">
							<hr style="margin:0; padding:0">
							<h5 @click="publisherDetail($event.target)" style="margin:2px 0"><i class="fa fa-caret-right w3-margin-right"></i>{{ week.meetingPart }}</h5>
							<p style="margin:0">{{ week.assignedTo }}</p>
							<div class="w3-container detail" style="display:none">
								<h5 style="margin:0"><select :class="inputMode('assignedTo w3-input')">
									<option v-for="publisher in selection(week)" :value="publisher.name">{{ publisher.name }}</option>
								</select></h5>
								<h5 v-if="week.meetingPart.startsWith('4.')" style="margin:0"><select :class="inputMode('assistant w3-input')">
									<option v-for="publisher in publishers" :value="publisher.name">{{ publisher.name }}</option>
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
            display: false,
            pdfFile: "",
			selectedPublisher: {},
        },
        computed: {
            publishers() {
                return allPublishersVue.publishers.concat(allParticipantsVue.enrolments)
            },
			assignments() {
                return allParticipantsVue.lifeAndMinistry.assignments
            },
			searchTerms() {
                return navigationVue.searchTerms
            },
			selectedGroup() {
                return navigationVue.fieldServiceGroup
            },
        },
        methods: {
			selection(assignment) {
				//console.log(assignment)
				var ministry = this.assignments.filter(elem=>elem.week == assignment.week && elem.meetingPart.startsWith('4.'))[0].section
				//console.log(ministry)
				//return []
				if (assignment.section !== ministry && !assignment.meetingPart.startsWith('3. ')) {
					const assignees = this.publishers.filter(elem=>elem.privilege && (elem.privilege.includes('Elder') || elem.privilege.includes('Ministerial Servant')))
					//console.log(assignees)
					return assignees
				} else {
					return this.publishers
				}
				
			},
			toTitleCase(value) {
				return toTitleCase(value)
			},
			allWeeks() {
				return getUniqueElementsByProperty(this.assignments,['week'])
            },
			allAssignTo() {
				return getUniqueElementsByProperty(this.assignments.filter(elem=>elem.assignTo),['assignTo'])
            },
			deleteAssignment(count) {
				if (confirm('Are you sure you want to Delete Assignment?\nPress "Yes" to Delete')) {
					allParticipantsVue.lifeAndMinistry.assignments.splice(count, 1)
					DBWorker.postMessage({ storeName: 'configuration', action: "save", value: [allParticipantsVue.lifeAndMinistry]});
				}
			},
			addAssignment() {
				//console.log("New Assignment")
				if (this.currentWeek == '') {
					this.currentWeek = this.currentAssignment
					this.currentAssignment = ''
					return
				}
				allParticipantsVue.lifeAndMinistry.assignments.push({ "week": this.currentWeek, "meetingPart": this.currentAssignment, "section": this.currentSection })
				this.currentAssignment = ''
				DBWorker.postMessage({ storeName: 'configuration', action: "save", value: [allParticipantsVue.lifeAndMinistry]});
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
			publisherDetail(event) {
				//console.log(event, event.parentNode.querySelector('p'))
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
					//DBWorker.postMessage({ storeName: 'data', action: "save", value: [publisher]});
				}
				//this.selectedPublisher = publisher
                //fillPublisherRecord(publisher)
			},
            updateRecord(publisher) {
				updatePublisherRecord(publisher)
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
                ///return this.months[0].abbr
            },
			year() {
				var currentYear;
				if (new Date().getMonth() == 0) {
					currentYear = new Date().getFullYear() - 1
				} else {
					currentYear = new Date().getFullYear()
				}

				//console.log(this.month)

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
				//var average = meeting[`${serviceYear}`][`${month}`].totalAttendance / meeting[`${serviceYear}`][`${month}`].numberOfMeetings
				//return average == 0 || average == undefined || average == Infinity ? '' : average
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
            //processedGroups: [],
            display: false,
            pdfFile: "",
			selectedPublisher: {},
        },
        computed: {
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
				//console.log(event.parentNode.querySelector('span').innerHTML)
				event.className = "fas fa-copy"
			}
        }
    })
}

async function shortWait() {
    await new Promise((e) => setTimeout(e, 50));
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
						<p v-if="reportEntry == 'secretary' && reset !== true"><label>Coordinator:</label></p>
						<p v-if="reportEntry == 'secretary' && reset !== true && elders().length !== 0">
							<select @change="saveConfiguration()" :class="inputMode('cboe w3-input')" value="MACFOY Ernest">
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
						<div v-if="profiles().length > 1" @change="setProfile($event.target)" id="profile">
							<label>Profile: </label>
							<p style="margin:0" v-for="profile in profiles()"><label><input type="radio" v-model="selectedProfile" name="profileGroup" :value="profile" style="margin-right: 5px;">{{ profile }}</label></p>
						</div>
						<label>Appearance: 
						<select @change="displayMode($event.target)" :class="inputMode('appearance w3-input')">
							<option :value="currentMode()">{{ currentMode() }}</option>
							<option v-for="mode in ['System', 'Light', 'Dark'].filter(elem=>elem !== currentMode())" :value="mode">{{ mode }}</option>
						</select></label>
						<p v-if="reportEntry == 'secretary' || reportEntry == 'lmo'">
							<button :class="buttonMode('w3-button w3-dark-grey')" @click="saveFile()"><i class="fas fa-save"> </i> Save File</button>
							<input type="file" id="pdfFile" accept=".pdf">
						</p>
						<div>
							<div class="main">
								<button v-if="reportEntry == 'secretary'" :class="buttonMode('w3-button w3-dark-grey')" @click="publisherDetail($event.target)">New Publisher</button>
								<button v-if="reportEntry == 'lmo'" :class="buttonMode('w3-button w3-dark-grey')" @click="publisherDetail($event.target)">New Enrolment</button>
								<button :class="buttonMode('w3-button w3-dark-grey')" @click="backupData($event.target)">Backup</button>
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
											<th>Service Year 2024</th>
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
							<div v-if="reportEntry == 'secretary' || reportEntry == 'lmo'" id="export">
								<label><input type="radio" name="exportGroup" value="all" style="margin-right: 5px;" checked>All</label>
								<br>
								<label><input type="radio" name="exportGroup" value="reportEntry" style="margin-right: 5px;">Report Entry</label>
								<br>
								<label><input type="radio" name="exportGroup" value="lifeAndMinistry" style="margin-right: 5px;">Life and Ministry</label>
							</div>
							<button :class="buttonMode('w3-button w3-dark-grey')" @click="exportData()">Export</button>
							<button :class="buttonMode('w3-button w3-dark-grey')" @click="importData()">Import</button>
							<button :class="buttonMode('w3-button w3-dark-grey')" @click="reloadPage()"><i class="fas fa-sync"></i> Reload</button>
							<hr>
							<input type="file" id="dataFile" accept=".txt">
						</p>
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
            }
        },
        methods: {
			currentProfile() {
				return currentUser.currentProfile
			},
			setProfile(event) {
				currentUser.currentProfile = event.value
				this.selectedProfile = event.value
				DBWorker.postMessage({ storeName: 'configuration', action: "save", value: [{"name": "Current Profile", "value": event.value}]});
				if (currentUser.currentProfile == 'Secretary') {
					navigationVue.buttons = [{"title": "CONG", "function": "congregationVue"}, {"title": "CONTACTS", "function": "contactInformationVue"}, {"title": "RECORDS", "function": "allPublishersVue"}, {"title": "GROUPS", "function": "fieldServiceGroupsVue"}, {"title": "REPORTS", "function": "missingReportVue"}]
					this.reportEntry = 'secretary'
				} else if (currentUser.currentProfile == 'Secretary - Assistant') {
					navigationVue.buttons = [{"title": "REPORTS", "function": "missingReportVue"}, {"title": "CURRENT", "function": "monthlyReportVue"}, {"title": "ATTENDANCE", "function": "attendanceVue"}, {"title": "BRANCH", "function": "branchReportVue"}]
					this.reportEntry = 'reportEntry'
				} else if (currentUser.currentProfile == 'Life and Ministry Overseer') {
					navigationVue.buttons = [{"title": "ASSIGNMENTS", "function": "allAssignmentsVue"}, {"title": "SCHEDULE", "function": "contactInformationVue"}, {"title": "PARTICIPANTS", "function": "allParticipantsVue"}, {"title": "CONTACTS", "function": "contactInformationVue"}]
					this.reportEntry = 'lmo'
				}
			},
			profiles() {
				return currentUser.accesses.map(elem=>elem.replace('secretary','Secretary').replace('sendReport','Secretary - Assistant').replace('lmo','Life and Ministry Overseer').replace('lma','Life and Ministry Assistant')).sort()
			},
			elders() {
				return allPublishersVue.publishers.filter(elem=>elem.privilege.includes('Elder')).map(elem=>elem.name)
			},
			inputMode(currentClass) {
				return currentClass + ' ' + mode.replace('w3-card ','')
			},
			buttonMode(currentClass) {
				return currentClass + ' ' + mode.replace('w3-card ','').replace('white','light-grey').replace('black','dark-grey')
			},
			displayMode(event) {
				//console.log(event.value)
				var selectedMode
				if (event.value !== 'System') {
					selectedMode = event.value
					//console.log(selectedMode)
				} else {
					if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
						selectedMode = 'Dark'
					} else {
						selectedMode = 'Light'
					}
					//console.log(selectedMode)
				}

				currentMode = event.value

				if (logged) {
					DBWorker.postMessage({ storeName: 'configuration', action: "save", value: [{"name": "Display", "value": currentMode}]});
				}
			
				//console.log(selectedMode)

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
				location.reload()
				return
				location.href = '/cong/'
			},
			backupData() {
				this.exportData()
				var recipient = ''//group.OverseerMail//'someone@example.com';
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
				if (getSelectedOption(document.getElementsByName("exportGroup")) == 'all') {
					file = new Blob([JSON.stringify({"configuration":configurationVue.configuration, "data":allPublishersVue.publishers, "lifeAndMinistry":allParticipantsVue.lifeAndMinistry, "attendance": [attendanceVue.currentMonth, attendanceVue.meetingAttendanceRecord]})], {type: 'text/plain'});
					await shortWait()
					await shortWait()
				} else if (getSelectedOption(document.getElementsByName("exportGroup")) == 'reportEntry') {
					var currentConfiguration = JSON.parse(JSON.stringify(configurationVue.configuration))
					await shortWait()
					await shortWait()

					delete currentConfiguration.address
					delete currentConfiguration.email
					var currentData = JSON.parse(JSON.stringify(allPublishersVue.publishers))
					await shortWait()
					await shortWait()

					currentData.forEach(elem=>{
						delete elem.hope
						delete elem.contactInformation
						delete elem.dateOfBaptism
						delete elem.dateOfBirth
						delete elem.emergencyContactInformation
					})
					await shortWait()
					await shortWait()
					await shortWait()
					await shortWait()

					file = new Blob([JSON.stringify({"configuration":currentConfiguration, "data":currentData, "attendance": [attendanceVue.currentMonth, attendanceVue.meetingAttendanceRecord]})], {type: 'text/plain'});
				} else if (getSelectedOption(document.getElementsByName("exportGroup")) == 'lifeAndMinistry') {
					var currentConfiguration = JSON.parse(JSON.stringify(configurationVue.configuration))
					await shortWait()
					await shortWait()

					delete currentConfiguration.address
					delete currentConfiguration.email
					var currentData = JSON.parse(JSON.stringify(allPublishersVue.publishers))
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

					file = new Blob([JSON.stringify({"configuration":currentConfiguration, "data":currentData, "attendance": [attendanceVue.currentMonth, attendanceVue.meetingAttendanceRecord]})], {type: 'text/plain'});
				}

				await shortWait()
				await shortWait()

				a.href = URL.createObjectURL(file);
				
				a.download = 'congData-' + new Date() + '.txt';
				a.click();
				//window.indexedDB.deleteDatabase('congRec');
            },
            async importData() {
				if (!document.querySelector('#dataFile').files[0]) {
					alert('Please select file to import')
					return
				}
                var reader = new FileReader();

				// When the FileReader has loaded the file...
				reader.onload = async function() {
					var result = JSON.parse(this.result)
					
					var cleanupDataBase = allPublishersVue.publishers.filter((elem) => {
						return result.data.findIndex(ele=>ele.name === elem.name) == -1
					});

					await shortWait()
					await shortWait()


					if (!result.data[0].contactInformation) {
						allPublishersVue.publishers.forEach(elem=>{
							elem.report = result.data.filter(ele=>ele.name === elem.name)[0].report
						})
						await shortWait()
						await shortWait()

					} else {
						configurationVue.configuration = result.configuration
						navigationVue.allGroups = result.configuration.fieldServiceGroups
						allPublishersVue.publishers = result.data
						allParticipantsVue.lifeAndMinistry = result.lifeAndMinistry
					}

					await shortWait()
					await shortWait()


					attendanceVue.currentMonth = result.attendance[0]
					attendanceVue.meetingAttendanceRecord = result.attendance[1]

					DBWorker.postMessage({ storeName: 'configuration', action: "save", value: [result.configuration]});
					DBWorker.postMessage({ storeName: 'data', action: "save", value: result.data});
					DBWorker.postMessage({ storeName: 'attendance', action: "save", value: result.attendance});
					DBWorker.postMessage({ storeName: 'configuration', action: "save", value: [result.lifeAndMinistry]});

					await shortWait()
					await shortWait()
					await shortWait()
					await shortWait()


					console.log(cleanupDataBase)
					cleanupDataBase.forEach(item=>{
						DBWorker.postMessage({ storeName: 'data', action: "deleteItem", value: item.name});
					})

					configured = true
					if (currentUser.currentProfile == 'Secretary') {
						gotoView('congregationVue')
					} else if (currentUser.currentProfile == 'Secretary - Assistant') {
						gotoView('missingReportVue')
					}
				}
				
				// Read the file content as a single string
				reader.readAsText(document.querySelector('#dataFile').files[0]);
            },
			saveConfiguration() {
                /*if (configured = true) {
                    DBWorker.postMessage({ storeName: 'configuration', action: "deleteItem", value: this.configuration.name});
                }*/
                
                var allGroups = []
                document.querySelectorAll('.fieldServiceGroups').forEach(elem=>{
                    allGroups.push(elem.value)
                })

                allGroups.sort()

				var currentConfiguration = { "name": "Congregation", "congregationName": document.querySelector('.name').value, "address": document.querySelector('.address').value, "email": document.querySelector('.email').value, "fieldServiceGroups": allGroups, "cboe": document.querySelector('.cboe').value, "sec": document.querySelector('.sec').value, "so":  document.querySelector('.so').value, "currentProfile": currentUser.currentProfile }
                DBWorker.postMessage({ storeName: 'configuration', action: "save", value: [currentConfiguration]});
                configured = true
            },
            async resetConfiguration() {
				var confirmReset = prompt('Are you sure you want to Reset records?\nType "Reset" to Reset')
                if (confirmReset !== null && confirmReset.toLowerCase() == 'reset') {
					this.reset = true
					resetCount = 4
					DBWorker.postMessage({ storeName: 'data', action: "readAll"});
                    DBWorker.postMessage({ storeName: 'configuration', action: "readAll"});
                    DBWorker.postMessage({ storeName: 'attendance', action: "readAll"});
                    DBWorker.postMessage({ storeName: 'files', action: "readAll"});

					// Open a connection to the database
					/*var request = indexedDB.open('congRec');

					// Handle the success event
					request.onsuccess = function(event) {
						var db = event.target.result;
						console.log('Database deleted successfully');

						// Close the database connection before deleting it
						db.close();

						// Delete the database
						var deleteRequest = indexedDB.deleteDatabase('congRec');
						console.log('Database deleted successfully');
						alert('Reset completed')
						//location.reload()

						// Handle the success event for deleting the database
						deleteRequest.onsuccess = function() {
							console.log('Database deleted successfully');
							
						};

						// Handle the error event for deleting the database
						deleteRequest.onerror = function(event) {
							console.error('Error deleting database:', event.target.error);
						};
					};

					// Handle the error event for opening the database
					request.onerror = function(event) {
						console.error('Error opening database:', event.target.error);
					};*/
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
				if (currentUser.currentProfile == 'Life and Ministry Overseer') {
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
						if (currentUser.currentProfile == 'Life and Ministry Overseer') {
							alert('Please enter Name')
						} else {
							alert('Please enter Publisher Name')
						}
						return
					}
					publisher.gender = item.parentNode.querySelector('.gender').value
					publisher.contactInformation.address = item.parentNode.querySelector('.contactAddress').value
                    publisher.contactInformation.phoneNumber = item.parentNode.querySelector('.contactPhoneNumber').value

                    if (currentUser.currentProfile == 'Life and Ministry Overseer') {
						allParticipantsVue.enrolments.push({name: publisher.name, gender: publisher.gender, phoneNumber: publisher.contactInformation.phoneNumber == '' ? null : publisher.contactInformation.phoneNumber, address: publisher.contactInformation.address == '' ? null : publisher.contactInformation.address })
						DBWorker.postMessage({ storeName: 'configuration', action: "save", value: [{"name": "Life and Ministry", "enrolments": allParticipantsVue.enrolments}]});
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
                        //console.log(currentItem.querySelector('.sharedInMinistry').checked)
                        //console.log(currentItem.querySelector('.hours'))
                    })

					allPublishersVue.publishers.push(publisher)

                    console.log(publisher)
                    
                    DBWorker.postMessage({ storeName: 'data', action: "save", value: [publisher]});
					this.cancel(item)
                }
			},
			saveFile() {
				DBWorker.postMessage({ storeName: 'files', action: "save", value: [document.getElementById('pdfFile').files[0]]});
			}
        }
    })
}

processAllPublishers()
processAllParticipants()
processConfiguration()
processCongregation()

processFieldServiceGroups()
processMonthlyReport()
processMissingReport()
processAllAssignments()
processAttendance()
contactInformation()
branchReportDetails()

configurationVue.displayMode({"value": "System"})

var defaultConfiguration = { "congregationName": "", "name": "Congregation", "address": "", "email": "", "fieldServiceGroups": ["Group 1"], "cboe": "", "sec": "", "so": "" }

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

function download(content, fileName, contentType) {
    var a = document.createElement("a");
    var file = new Blob([content], {type: contentType});
    allPublishersVue.pdfFile = URL.createObjectURL(file);
    /*a.href = URL.createObjectURL(file);
    
    //a.download = fileName;
    //a.click();*/
};




async function fillPublisherRecord(data) {
	const publisher = data[0]
	const period = data[1]
    // Get the form field by name
    //const fieldName = fieldNameInput.value;
    const name = s21current.getForm().getTextField('900_1_Text_SanSerif');
    const dateOfBirth = s21current.getForm().getTextField('900_2_Text_SanSerif');
    const dateOfBaptism = s21current.getForm().getTextField('900_5_Text_SanSerif');
    const male = s21current.getForm().getCheckBox('900_3_CheckBox');
    const female = s21current.getForm().getCheckBox('900_4_CheckBox');
    const otherSheep = s21current.getForm().getCheckBox('900_6_CheckBox');
    const anointed = s21current.getForm().getCheckBox('900_7_CheckBox');
    const elder = s21current.getForm().getCheckBox('900_8_CheckBox');
    const ministerialServant = s21current.getForm().getCheckBox('900_9_CheckBox');
    const regularPioneer = s21current.getForm().getCheckBox('900_10_CheckBox');
    const specialPioneer = s21current.getForm().getCheckBox('900_11_CheckBox');
    const fieldMissionary = s21current.getForm().getCheckBox('900_12_CheckBox');
    const serviceYear = s21current.getForm().getTextField('900_13_Text_C_SanSerif');
    const septPreached = s21current.getForm().getCheckBox('901_20_CheckBox');
    const octPreached = s21current.getForm().getCheckBox('901_21_CheckBox');
    const novPreached = s21current.getForm().getCheckBox('901_22_CheckBox');
    const decPreached = s21current.getForm().getCheckBox('901_23_CheckBox');
    const janPreached = s21current.getForm().getCheckBox('901_24_CheckBox');
    const febPreached = s21current.getForm().getCheckBox('901_25_CheckBox');
    const marPreached = s21current.getForm().getCheckBox('901_26_CheckBox');
    const aprPreached = s21current.getForm().getCheckBox('901_27_CheckBox');
    const mayPreached = s21current.getForm().getCheckBox('901_28_CheckBox');
    const junPreached = s21current.getForm().getCheckBox('901_29_CheckBox');
    const julPreached = s21current.getForm().getCheckBox('901_30_CheckBox');
    const augPreached = s21current.getForm().getCheckBox('901_31_CheckBox');
    const septAux = s21current.getForm().getCheckBox('903_20_CheckBox');
    const octAux = s21current.getForm().getCheckBox('903_21_CheckBox');
    const novAux = s21current.getForm().getCheckBox('903_22_CheckBox');
    const decAux = s21current.getForm().getCheckBox('903_23_CheckBox');
    const janAux = s21current.getForm().getCheckBox('903_24_CheckBox');
    const febAux = s21current.getForm().getCheckBox('903_25_CheckBox');
    const marAux = s21current.getForm().getCheckBox('903_26_CheckBox');
    const aprAux = s21current.getForm().getCheckBox('903_27_CheckBox');
    const mayAux = s21current.getForm().getCheckBox('903_28_CheckBox');
    const junAux = s21current.getForm().getCheckBox('903_29_CheckBox');
    const julAux = s21current.getForm().getCheckBox('903_30_CheckBox');
    const augAux = s21current.getForm().getCheckBox('903_31_CheckBox');
    const septBs = s21current.getForm().getTextField('902_20_Text_C_SanSerif');
    const octBs = s21current.getForm().getTextField('902_21_Text_C_SanSerif');
    const novBs = s21current.getForm().getTextField('902_22_Text_C_SanSerif');
    const decBs = s21current.getForm().getTextField('902_23_Text_C_SanSerif');
    const janBs = s21current.getForm().getTextField('902_24_Text_C_SanSerif');
    const febBs = s21current.getForm().getTextField('902_25_Text_C_SanSerif');
    const marBs = s21current.getForm().getTextField('902_26_Text_C_SanSerif');
    const aprBs = s21current.getForm().getTextField('902_27_Text_C_SanSerif');
    const mayBs = s21current.getForm().getTextField('902_28_Text_C_SanSerif');
    const junBs = s21current.getForm().getTextField('902_29_Text_C_SanSerif');
    const julBs = s21current.getForm().getTextField('902_30_Text_C_SanSerif');
    const augBs = s21current.getForm().getTextField('902_31_Text_C_SanSerif');
	const septHr = s21current.getForm().getField('904_20_S21_Value');
    const octHr = s21current.getForm().getField('904_21_S21_Value');
    const novHr = s21current.getForm().getField('904_22_S21_Value');
    const decHr = s21current.getForm().getField('904_23_S21_Value');
    const janHr = s21current.getForm().getField('904_24_S21_Value');
    const febHr = s21current.getForm().getField('904_25_S21_Value');
    const marHr = s21current.getForm().getField('904_26_S21_Value');
    const aprHr = s21current.getForm().getField('904_27_S21_Value');
    const mayHr = s21current.getForm().getField('904_28_S21_Value');
    const junHr = s21current.getForm().getField('904_29_S21_Value');
    const julHr = s21current.getForm().getField('904_30_S21_Value');
    const augHr = s21current.getForm().getField('904_31_S21_Value');
	const septRem = s21current.getForm().getTextField('905_20_Text_SanSerif');
    const octRem = s21current.getForm().getTextField('905_21_Text_SanSerif');
    const novRem = s21current.getForm().getTextField('905_22_Text_SanSerif');
    const decRem = s21current.getForm().getTextField('905_23_Text_SanSerif');
    const janRem = s21current.getForm().getTextField('905_24_Text_SanSerif');
    const febRem = s21current.getForm().getTextField('905_25_Text_SanSerif');
    const marRem = s21current.getForm().getTextField('905_26_Text_SanSerif');
    const aprRem = s21current.getForm().getTextField('905_27_Text_SanSerif');
    const mayRem = s21current.getForm().getTextField('905_28_Text_SanSerif');
    const junRem = s21current.getForm().getTextField('905_29_Text_SanSerif');
    const julRem = s21current.getForm().getTextField('905_30_Text_SanSerif');
    const augRem = s21current.getForm().getTextField('905_31_Text_SanSerif');

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

    //name.setText(publisher.name)
    //name.setText(publisher.name)
    // Save the modified PDF
    //const modifiedPdfBytes = await s21.save();
	var newPdfholder = document.createElement('div')
	var newPdfbutton = document.createElement('button')
	var newPdfViewer = document.createElement('iframe')
	newPdfViewer.height = '600px'
	newPdfViewer.width = '100%'
	newPdfViewer.src = URL.createObjectURL(new Blob([await s21current.save()], { type: 'application/pdf' }));
	newPdfbutton.innerHTML = `<a href="${newPdfViewer.src}" style="text-decoration:none" download="${toTitleCase(period.replace('ServiceYear', ''))} Record Card - ${publisher.name}"><i class="fas fa-download"></i></a>`
	newPdfbutton.classList.value = "w3-button w3-black download-button"
	newPdfholder.style.margin = "15px"
	newPdfbutton.style.margin = "10px 0"
	newPdfholder.appendChild(newPdfbutton)
	newPdfholder.appendChild(newPdfViewer)
	document.getElementById("pdfViewer").appendChild(newPdfholder)

	downloadsArray.push([newPdfViewer.src, `${toTitleCase(period.replace('ServiceYear', ''))} Record Card - ${publisher.name}`])

	if (recordsToCreate.length !== 0) {
		fillPublisherRecord(recordsToCreate.shift())
	}

    //download(modifiedPdfBytes, publisher.name + ".pdf", "application/pdf");
}

/**
 * // Save the modified PDF
const modifiedPdfBytes = await pdfDoc.save();

// Create a Blob from the modified PDF bytes
const blob = new Blob([modifiedPdfBytes], { type: 'application/pdf' });

// Create a data URL from the Blob
const dataUrl = URL.createObjectURL(blob);

// Set the new data URL as the source for the iframe
iframe.src = dataUrl;
 */

function updatePublisherRecord(publisher) {
    publisher.gender = "Male"
    

    const name = s21current.getForm().getTextField('900_1_Text_SanSerif');
    const dateOfBirth = s21current.getForm().getTextField('900_2_Text_SanSerif');
    const dateOfBaptism = s21current.getForm().getTextField('900_5_Text_SanSerif');
    const male = s21current.getForm().getCheckBox('900_3_CheckBox');
    const female = s21current.getForm().getCheckBox('900_4_CheckBox');

    console.log(name.getText(), dateOfBirth.getText(), dateOfBaptism.getText(), male.isChecked(), female.isChecked())
return
    

    publisher.name = name.getText()
    publisher.dateOfBirth = dateOfBirth.getText()
    publisher.dateOfBaptism = dateOfBaptism.getText()
    if (male.isChecked()) {
        publisher.gender = "Male"
    } else if (female.isChecked()) {
        publisher.gender = "Female"
    }
    console.log(publisher)
}

// 900_1_Text_SanSerif

var s21current, s21past;

async function getFieldByName(file) {
    //const fileInput = document.getElementById('pdfFile');
    //const file = fileInput.files[0];

    if (file) {
        const reader = new FileReader();

        reader.onload = async function (e) {
            const pdfData = new Uint8Array(e.target.result);

            // Using pdf-lib to load the PDF document
            s21current = await PDFLib.PDFDocument.load(pdfData);
            //s21past = await PDFLib.PDFDocument.load(pdfData);
        };

        reader.readAsArrayBuffer(file);
    } else {
		const fileInput = document.getElementById('pdfFile');
    	const file = fileInput.files[0];
		
		const reader = new FileReader();

        reader.onload = async function (e) {
            const pdfData = new Uint8Array(e.target.result);

            // Using pdf-lib to load the PDF document
            s21current = await PDFLib.PDFDocument.load(pdfData);
            //s21past = await PDFLib.PDFDocument.load(pdfData);
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

function convertToImage(content) {
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
	  //document.body.appendChild(image);
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
	//const pdfBytes = await pdfDoc.save();
	//const pdfBytes = await response.arrayBuffer();

    // Load the PDF with pdf-lib
    //const pdfDoc = await PDFLib.PDFDocument.load(pdfBytes);

	document.querySelector('#content').innerHTML = ''
	document.querySelector('#content').style.display = 'none'

	var newPdfholder = document.createElement('div')
	var newPdfbutton = document.createElement('button')
	var downloadAllbutton = document.createElement('button')
	var newPdfViewer = document.createElement('iframe')
	newPdfViewer.height = '600px'
	newPdfViewer.width = '100%'
	newPdfViewer.src = URL.createObjectURL(new Blob([await pdfDoc.save()], { type: 'application/pdf' }));
	newPdfbutton.innerHTML = `<a href="${newPdfViewer.src}" style="text-decoration:none" download="Letter of Introduction - ${allPublishersVue.selectedPublisher.name}"><i class="fas fa-download"></i></a>`
	downloadAllbutton.innerHTML = `<span onclick="downloadAll()">Download All</span>`
	newPdfbutton.classList.value = "w3-button w3-black download-button"
	newPdfholder.style.margin = "15px"
	newPdfbutton.style.margin = "10px 0"
	downloadAllbutton.classList.value = "w3-button w3-black"
	downloadAllbutton.style.margin = "10px 5px"
	
	newPdfholder.appendChild(newPdfbutton)
	newPdfholder.appendChild(downloadAllbutton)
	newPdfholder.appendChild(newPdfViewer)
	document.getElementById("pdfViewer").appendChild(newPdfholder)

	downloadsArray.push([newPdfViewer.src, `Letter of Introduction - ${allPublishersVue.selectedPublisher.name}`])
	
	document.querySelectorAll('#publisherRequest select').forEach(elem=>{
		if (elem !== '') {
			recordsToCreate.push([allPublishersVue.publishers.filter(ele=>ele.name == elem.value)[0], 'currentServiceYear'])
			recordsToCreate.push([allPublishersVue.publishers.filter(ele=>ele.name == elem.value)[0], 'lastServiceYear'])
		}
	})

	await shortWait()
	await shortWait()
	await shortWait()

	if (recordsToCreate.length !== 0) {
		fillPublisherRecord(recordsToCreate.shift())
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

	//const fontBytes = await fetch('fonts/Helvetica Roman.ttf').then(response => response.arrayBuffer());
    //const titleFont = await pdfDoc.embedFont(fontBytes);
	//const font = await pdfDoc.embedFont(PDFLib.PDFDocument.Font['Courier']);

	page.drawText(titleText, {
		x: 50,
		y: height - 100,
		//font: font,
		fontSize: '24px',
		//color: rgb(0, 0, 0), // Black color
	});

	// Add content to the page

	// Embed font for the content
	//const contentFont = await pdfDoc.embedFont(fontBytes);

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
	//await allPublishersVue.previewLetter(pdfBlob)

	// Create a download link and trigger download
	//const link = document.createElement('a');
	//link.href = URL.createObjectURL(pdfBlob);
	//link.download = 'sample.pdf';
	//link.click();
}
