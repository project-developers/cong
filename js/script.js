
const loginForm = document.getElementById("login-form");
const loginButton = document.getElementById("login-form-submit");
const defaultLogin = loginButton.innerHTML;
const loginErrorMsg = document.getElementById("login-error-msg");
loginForm.confirmPassword.style.display = 'none';
document.getElementById("securityQuestions").style.display = 'none';
loginErrorMsg.style.opacity = 0;
var logged = false, reportEntry = false;
var hiddenElements = ["congregation", "allPublishers", "contactInformation", "fieldServiceGroups", "monthlyReport", "missingReport", "attendance", "branchReport", "configuration"]
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

function getSelectedOption() {
	var radioButtons = document.getElementsByName("securityGroup");

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
			
		} else if ('No option selected' == getSelectedOption() || '' == document.querySelector('#answer').value.toLowerCase()) {
			loginErrorMsg.innerHTML = 'Please select question and enter answer.'
		} else if (loginForm.password.value !== loginForm.confirmPassword.value) {
			loginErrorMsg.innerHTML = 'Password is not the same.'
		} else if (allUsers.findIndex(elem=>elem.username.toLowerCase() == username.toLowerCase()) !== -1) {
			var existingUser = allUsers.filter(elem=>elem.username.toLowerCase() == username.toLowerCase())[0]
			console.log(existingUser)
			console.log(existingUser.accesses.findIndex(str => currentUser.accesses.includes(str)) !== -1)
			if (existingUser.accesses.findIndex(str => currentUser.accesses.includes(str)) !== -1) {
				loginErrorMsg.innerHTML = 'User already exists. Please enter a different username.'
			} else if (existingUser.password !== password) {
				loginErrorMsg.innerHTML = 'Invalid password.'
			} else if (existingUser.selectedQuestion !== getSelectedOption() || existingUser.answer.trim() !== document.querySelector('#answer').value.toLowerCase().trim()) {
				loginErrorMsg.innerHTML = 'Invalid question and/or answer.'
			} else {
				if (currentUser.accesses.includes('secretary')) {
					reportEntry = true
				} else if (currentUser.accesses.includes('sendReport')) {
					reportEntry = false
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
				DBWorker.postMessage({ dbName: 'cong-' + currentUser.username, action: "init"});
				loginErrorMsg.style.opacity = 0;
			}
		} else {
			currentUser.username = loginForm.username.value
			currentUser.password = loginForm.password.value
			currentUser.selectedQuestion = getSelectedOption()
			currentUser.answer = document.querySelector('#answer').value.toLowerCase().trim()
			if (currentUser.accesses.includes('secretary')) {
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
				reportEntry = true

				allUsers.push(currentUser)

				document.getElementById("home").style.display = 'none'
				DBWorker.postMessage({ storeName: 'settings', action: "save", value: [currentUser]});
				DBWorker.postMessage({ dbName: 'cong-' + currentUser.username, action: "init"});
				loginErrorMsg.style.opacity = 0;
			} else if (currentUser.accesses.includes('sendReport')) {
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
				reportEntry = false
				navigationVue.displayDropdown = true

				allUsers.push(currentUser)
				
				document.getElementById("home").style.display = 'none'
				DBWorker.postMessage({ storeName: 'settings', action: "save", value: [currentUser]});
				DBWorker.postMessage({ dbName: 'cong-' + currentUser.username, action: "init"});
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
		if (currentUser.accesses.includes('secretary')) {
			reportEntry = true
		} else if (currentUser.accesses.includes('sendReport')) {
			reportEntry = false
		}
		logged = true
		document.getElementById("home").style.display = 'none'
		DBWorker.postMessage({ dbName: 'cong-' + currentUser.username, action: "init"});
		loginErrorMsg.style.opacity = 0;
		
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
		loginErrorMsg.style.opacity = 1;
		
    } else {
		loginForm.password.value="";
        loginErrorMsg.style.opacity = 1;
    }
})

var currentUser = { "name": "currentUser", "username": null, "password": null, "accesses": [], "selectedQuestion": null, "answer": null }
var allUsers;

var navigationVue, navigationVue2, allPublishersVue, congregationVue, configurationVue, branchReportVue, contactInformationVue, fieldServiceGroupsVue, monthlyReportVue, missingReportVue;
var allButtons = [{"title": "CONG", "function": "congregationVue"}, {"title": "RECORDS", "function": "allPublishersVue"}, {"title": "GROUPS", "function": "fieldServiceGroupsVue"}, {"title": "CONTACTS", "function": "contactInformationVue"}, {"title": "REPORTS", "function": "missingReportVue"}, {"title": "CURRENT", "function": "monthlyReportVue"}, {"title": "REPORTS", "function": "missingReportVue"}, {"title": "BRANCH", "function": "branchReportVue"}, {"title": "ATTENDANCE", "function": "attendanceVue"}, {"title": "SETTINGS", "function": "configurationVue"}]

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
/*
if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
	mode = 'w3-card w3-black'
} else {
	mode = 'w3-card w3-white'
}*/
/*
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
	elem.classList.toggle("w3-dark-grey");
	elem.classList.toggle("w3-light-grey");
})
document.body.classList.toggle("w3-dark-grey");
document.body.classList.toggle("w3-light-grey");*/

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
				window.indexedDB.deleteDatabase('cong-' + currentUser.username);
				location.reload()
			}
		} else if (msgData.length == 3) {
			resetCount--
			document.querySelector('#status1').innerHTML = `Deleting items: ${msgData[1]} - ${msgData[2]}.`
			document.querySelector('#status2').innerHTML = `${resetCount} Remaining.`
			document.querySelector('#status3').innerHTML = `Please wait . . .`
			if (resetCount === 0) {
				window.indexedDB.deleteDatabase('cong-' + currentUser.username);
				location.reload()
				/*
				document.querySelector('#status1').innerHTML = ``
				document.querySelector('#status2').innerHTML = ``
				document.querySelector('#status3').innerHTML = `Completed`*/
				//configurationVue.configuration = defaultConfiguration
			}
		}
		return
	} else {
		switch (msgData.name) {
			case "configuration":
				{
					//console.log(msgData.value)
					if (msgData.value.filter(elem=>elem.name == "Congregation").length == 0) {
						configurationVue.display = true
						configured = false
						configurationVue.configuration = defaultConfiguration
						attendanceVue.currentMonth = currentMonthAttendance
						attendanceVue.meetingAttendanceRecord = meetingAttendanceRecord
						
						//configurationVue.configuration = result.configuration
						navigationVue.allGroups = configurationVue.configuration.fieldServiceGroups
						if (currentUser.accesses.includes('secretary')) {
							//congregationVue.display = true
							navigationVue.buttons = [{"title": "CONTACTS", "function": "contactInformationVue"}, {"title": "RECORDS", "function": "allPublishersVue"}, {"title": "GROUPS", "function": "fieldServiceGroupsVue"}, {"title": "REPORTS", "function": "missingReportVue"}]
						} else if (currentUser.accesses.includes('sendReport')) {
							navigationVue.buttons = [{"title": "CURRENT", "function": "monthlyReportVue"}, {"title": "ATTENDANCE", "function": "attendanceVue"}, {"title": "BRANCH", "function": "branchReportVue"}]
							//navigationVue.displayDropdown = true
							//missingReportVue.display = true
						}
					}
					if (msgData.value.filter(elem=>elem.name == "Congregation").length !== 0) {
						if (currentUser.accesses.includes('secretary')) {
							congregationVue.display = true
							navigationVue.buttons = [{"title": "CONTACTS", "function": "contactInformationVue"}, {"title": "RECORDS", "function": "allPublishersVue"}, {"title": "GROUPS", "function": "fieldServiceGroupsVue"}, {"title": "REPORTS", "function": "missingReportVue"}]
						} else if (currentUser.accesses.includes('sendReport')) {
							navigationVue.buttons = [{"title": "CURRENT", "function": "monthlyReportVue"}, {"title": "ATTENDANCE", "function": "attendanceVue"}, {"title": "BRANCH", "function": "branchReportVue"}]
							navigationVue.displayDropdown = true
							missingReportVue.display = true
						}

						configured = true
						//navigationVue.buttons = [{"title": "CONG", "function": "congregationVue"}, {"title": "RECORDS", "function": "allPublishersVue"}, {"title": "GROUPS", "function": "fieldServiceGroupsVue"}, {"title": "REPORTS", "function": "missingReportVue"}]
						
						//navigationVue.buttons = [{"title": "RECORDS", "function": "allPublishersVue"}, {"title": "GROUPS", "function": "fieldServiceGroupsVue"}, {"title": "CONTACTS", "function": "contactInformationVue"}, {"title": "REPORTS", "function": "missingReportVue"}, {"title": "ATTENDANCE", "function": "attendanceVue"}, {"title": "SETTINGS", "function": "configurationVue"}]
						configurationVue.configuration = msgData.value.filter(elem=>elem.name == "Congregation")[0]
						navigationVue.allGroups = msgData.value.filter(elem=>elem.name == "Congregation")[0].fieldServiceGroups
						DBWorker.postMessage({ storeName: 'data', action: "readAll"});
						DBWorker.postMessage({ storeName: 'attendance', action: "readAll"});
					}
					if (msgData.value.filter(elem=>elem.name == "Display").length !== 0) {
						console.log(msgData.value.filter(elem=>elem.name == "Display"))
						currentMode = msgData.value.filter(elem=>elem.name == "Display")[0].value
						/*
						if (msgData.value.filter(elem=>elem.name == "Display")[0].value !== 'System') {
							currentMode = msgData.value.filter(elem=>elem.name == "Display")[0].value
						} else {
							if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
								currentMode = 'Dark'
							} else {
								currentMode = 'Light'
							}
						}*/
		/*
						if ((mode == 'w3-card w3-black' && currentMode == 'Dark') || (mode == 'w3-card w3-white' && currentMode == 'Light')) {
							return
						} else if (mode == 'w3-card w3-black') {
							mode = 'w3-card w3-white'
						} else {
							mode = 'w3-card w3-black'
						}*/
						//mode = msgData.value.filter(elem=>elem.name == "Display")[0].value
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

// style="padding:16px 0 0 2px; margin-top:1px"  style="margin-top:2px"

document.querySelector('#navigation').innerHTML = `<template>
<div class="w3-bar w3-white w3-card" id="myNavbar">
	<a class="w3-bar-item w3-button w3-wide" @click="openButton($event.target)">{{ buttons[0] ? buttons[0].title : '' }}</a>
	<!-- Right-sided navbar links -->
	<div class="w3-right w3-hide-small">
		<a v-for="(button, count) in buttons.slice(1)" class="w3-bar-item w3-button" @click="openButton($event.target)">{{ button.title }}</a>
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
                //console.log(button)

				if (button.innerHTML == "REPORTS") {
					this.displayDropdown = true
					allPublishersVue.request = false
					this.buttons = [{"title": "CURRENT", "function": "monthlyReportVue"}, {"title": "ATTENDANCE", "function": "attendanceVue"}, {"title": "BRANCH", "function": "branchReportVue"}, {"title": "CONG", "function": "congregationVue"}]
				} else if (button.innerHTML == "CURRENT") {
					this.displayDropdown = true
					allPublishersVue.request = false
					this.buttons = [{"title": "REPORTS", "function": "missingReportVue"}, {"title": "ATTENDANCE", "function": "attendanceVue"}, {"title": "BRANCH", "function": "branchReportVue"}, {"title": "CONG", "function": "congregationVue"}]
				} else if (button.innerHTML == "ATTENDANCE") {
					this.displayDropdown = false
					allPublishersVue.request = false
					this.buttons = [{"title": "REPORTS", "function": "missingReportVue"}, {"title": "CURRENT", "function": "monthlyReportVue"}, {"title": "BRANCH", "function": "branchReportVue"}, {"title": "CONG", "function": "congregationVue"}]
				} else if (button.innerHTML == "BRANCH") {
					this.displayDropdown = false
					allPublishersVue.request = false
					this.buttons = [{"title": "REPORTS", "function": "missingReportVue"}, {"title": "CURRENT", "function": "monthlyReportVue"}, {"title": "ATTENDANCE", "function": "attendanceVue"}, {"title": "CONG", "function": "congregationVue"}]
				} else if (button.innerHTML == "CONG") {
					this.displayDropdown = false
					allPublishersVue.request = false
					this.buttons = [{"title": "CONTACTS", "function": "contactInformationVue"}, {"title": "RECORDS", "function": "allPublishersVue"}, {"title": "GROUPS", "function": "fieldServiceGroupsVue"}, {"title": "REPORTS", "function": "missingReportVue"}]
				} else if (button.innerHTML == "CONTACTS") {
					this.displayDropdown = true
					allPublishersVue.request = false
					this.buttons = [{"title": "CONG", "function": "congregationVue"}, {"title": "RECORDS", "function": "allPublishersVue"}, {"title": "GROUPS", "function": "fieldServiceGroupsVue"}, {"title": "REPORTS", "function": "missingReportVue"}]
				} else if (button.innerHTML == "RECORDS") {
					this.displayDropdown = true
					allPublishersVue.request = false
					this.buttons = [{"title": "CONG", "function": "congregationVue"}, {"title": "CONTACTS", "function": "contactInformationVue"}, {"title": "REQUEST", "function": "allPublishersVue"}, {"title": "GROUPS", "function": "fieldServiceGroupsVue"}, {"title": "REPORTS", "function": "missingReportVue"}]
				} else if (button.innerHTML == "REQUEST") {
					this.displayDropdown = false
					allPublishersVue.request = true
					this.buttons = [{"title": "CONG", "function": "congregationVue"}, {"title": "CONTACTS", "function": "contactInformationVue"}, {"title": "RECORDS", "function": "allPublishersVue"}, {"title": "GROUPS", "function": "fieldServiceGroupsVue"}, {"title": "REPORTS", "function": "missingReportVue"}]
				} else if (button.innerHTML == "GROUPS") {
					this.displayDropdown = true
					allPublishersVue.request = false
					this.buttons = [{"title": "CONG", "function": "congregationVue"}, {"title": "CONTACTS", "function": "contactInformationVue"}, {"title": "RECORDS", "function": "allPublishersVue"}, {"title": "ACTIVE", "function": "fieldServiceGroupsVue"}, {"title": "REPORTS", "function": "missingReportVue"}]
				} else if (button.innerHTML == "ACTIVE") {
					this.displayDropdown = true
					allPublishersVue.request = false
					this.buttons = [{"title": "CONG", "function": "congregationVue"}, {"title": "CONTACTS", "function": "contactInformationVue"}, {"title": "RECORDS", "function": "allPublishersVue"}, {"title": "ALL", "function": "fieldServiceGroupsVue"}, {"title": "REPORTS", "function": "missingReportVue"}]
				} else if (button.innerHTML == "ALL") {
					this.displayDropdown = true
					allPublishersVue.request = false
					this.buttons = [{"title": "CONG", "function": "congregationVue"}, {"title": "CONTACTS", "function": "contactInformationVue"}, {"title": "RECORDS", "function": "allPublishersVue"}, {"title": "ACTIVE", "function": "fieldServiceGroupsVue"}, {"title": "REPORTS", "function": "missingReportVue"}]
				} else {
					this.displayDropdown = false
					allPublishersVue.request = false
					this.buttons = [{"title": "CONG", "function": "congregationVue"}, {"title": "CONTACTS", "function": "contactInformationVue"}, {"title": "RECORDS", "function": "allPublishersVue"}, {"title": "GROUPS", "function": "fieldServiceGroupsVue"}, {"title": "REPORTS", "function": "missingReportVue"}]
				}

				if (currentUser.accesses.includes('secretary')) {

				} else if (currentUser.accesses.includes('sendReport')) {
					this.buttons.pop()
				}

				if (button.innerHTML == "REQUEST") {
					//allPublishersVue.subject = 'Letter of Introduction and Publisher Record for ' 
					
					await shortWait()
					auto_grow(document.getElementById("publisherRequest").Subject);
					auto_grow(document.getElementById("publisherRequest").Message);
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

				allPublishersVue.request = false
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
				document.getElementById("home").style.display = ''//v-if="button.title == 'ACTIVE' || button.title == 'ALL' || button.title == 'REQUEST'"
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

processNavigation()


document.querySelector('#mySidebar').innerHTML = `<template>
	<a href="javascript:void(0)" onclick="w3_close()" class="w3-bar-item w3-button w3-large w3-padding-16">Close ×</a>
    <a v-for="(button) in buttons()" v-if="button.title !== 'ACTIVE' && button.title !== 'ALL' && button.title !== 'REQUEST'" @click="openButton($event.target)" class="w3-bar-item w3-button">{{ button.title }}</a>
    <a v-for="(button) in buttons().filter(elem=>elem.title == 'ACTIVE' || elem.title == 'ALL' || elem.title == 'REQUEST')" v-else @click="openButton($event.target)" :class="mode()">{{ button.title }}</a>
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
			mode() {
				return 'w3-bar-item w3-button ' + mode.replace('w3-card ','')
			},
			async openButton(button) {
                //console.log(button)
				
				w3_close()

				
				if (button.innerHTML == "REPORTS") {
					navigationVue.displayDropdown = true
					allPublishersVue.request = false
					navigationVue.buttons = [{"title": "CURRENT", "function": "monthlyReportVue"}, {"title": "ATTENDANCE", "function": "attendanceVue"}, {"title": "BRANCH", "function": "branchReportVue"}, {"title": "CONG", "function": "congregationVue"}]
				} else if (button.innerHTML == "CURRENT") {
					navigationVue.displayDropdown = true
					allPublishersVue.request = false
					navigationVue.buttons = [{"title": "REPORTS", "function": "missingReportVue"}, {"title": "ATTENDANCE", "function": "attendanceVue"}, {"title": "BRANCH", "function": "branchReportVue"}, {"title": "CONG", "function": "congregationVue"}]
				} else if (button.innerHTML == "ATTENDANCE") {
					navigationVue.displayDropdown = false
					allPublishersVue.request = false
					navigationVue.buttons = [{"title": "REPORTS", "function": "missingReportVue"}, {"title": "CURRENT", "function": "monthlyReportVue"}, {"title": "BRANCH", "function": "branchReportVue"}, {"title": "CONG", "function": "congregationVue"}]
				} else if (button.innerHTML == "BRANCH") {
					navigationVue.displayDropdown = false
					allPublishersVue.request = false
					navigationVue.buttons = [{"title": "REPORTS", "function": "missingReportVue"}, {"title": "CURRENT", "function": "monthlyReportVue"}, {"title": "ATTENDANCE", "function": "attendanceVue"}, {"title": "CONG", "function": "congregationVue"}]
				} else if (button.innerHTML == "CONG") {
					navigationVue.displayDropdown = false
					allPublishersVue.request = false
					navigationVue.buttons = [{"title": "CONTACTS", "function": "contactInformationVue"}, {"title": "RECORDS", "function": "allPublishersVue"}, {"title": "GROUPS", "function": "fieldServiceGroupsVue"}, {"title": "REPORTS", "function": "missingReportVue"}]
				} else if (button.innerHTML == "CONTACTS") {
					navigationVue.displayDropdown = true
					allPublishersVue.request = false
					navigationVue.buttons = [{"title": "CONG", "function": "congregationVue"}, {"title": "RECORDS", "function": "allPublishersVue"}, {"title": "GROUPS", "function": "fieldServiceGroupsVue"}, {"title": "REPORTS", "function": "missingReportVue"}]
				} else if (button.innerHTML == "RECORDS") {
					navigationVue.displayDropdown = true
					allPublishersVue.request = false
					navigationVue.buttons = [{"title": "CONG", "function": "congregationVue"}, {"title": "CONTACTS", "function": "contactInformationVue"}, {"title": "REQUEST", "function": "allPublishersVue"}, {"title": "GROUPS", "function": "fieldServiceGroupsVue"}, {"title": "REPORTS", "function": "missingReportVue"}]
				} else if (button.innerHTML == "REQUEST") {
					navigationVue.displayDropdown = false
					allPublishersVue.request = true
					navigationVue.buttons = [{"title": "CONG", "function": "congregationVue"}, {"title": "CONTACTS", "function": "contactInformationVue"}, {"title": "RECORDS", "function": "allPublishersVue"}, {"title": "GROUPS", "function": "fieldServiceGroupsVue"}, {"title": "REPORTS", "function": "missingReportVue"}]
				} else if (button.innerHTML == "GROUPS") {
					navigationVue.displayDropdown = true
					allPublishersVue.request = false
					navigationVue.buttons = [{"title": "CONG", "function": "congregationVue"}, {"title": "CONTACTS", "function": "contactInformationVue"}, {"title": "RECORDS", "function": "allPublishersVue"}, {"title": "ACTIVE", "function": "fieldServiceGroupsVue"}, {"title": "REPORTS", "function": "missingReportVue"}]
				} else if (button.innerHTML == "ACTIVE") {
					navigationVue.displayDropdown = true
					allPublishersVue.request = false
					navigationVue.buttons = [{"title": "CONG", "function": "congregationVue"}, {"title": "CONTACTS", "function": "contactInformationVue"}, {"title": "RECORDS", "function": "allPublishersVue"}, {"title": "ALL", "function": "fieldServiceGroupsVue"}, {"title": "REPORTS", "function": "missingReportVue"}]
				} else if (button.innerHTML == "ALL") {
					navigationVue.displayDropdown = true
					allPublishersVue.request = false
					navigationVue.buttons = [{"title": "CONG", "function": "congregationVue"}, {"title": "CONTACTS", "function": "contactInformationVue"}, {"title": "RECORDS", "function": "allPublishersVue"}, {"title": "ACTIVE", "function": "fieldServiceGroupsVue"}, {"title": "REPORTS", "function": "missingReportVue"}]
				} else {
					navigationVue.displayDropdown = false
					allPublishersVue.request = false
					navigationVue.buttons = [{"title": "CONG", "function": "congregationVue"}, {"title": "CONTACTS", "function": "contactInformationVue"}, {"title": "RECORDS", "function": "allPublishersVue"}, {"title": "GROUPS", "function": "fieldServiceGroupsVue"}, {"title": "REPORTS", "function": "missingReportVue"}]
				}

				if (currentUser.accesses.includes('secretary')) {

				} else if (currentUser.accesses.includes('sendReport')) {
					navigationVue.buttons.pop()
				}

				if (button.innerHTML == "REQUEST") {
					allPublishersVue.request = true
					allPublishersVue.display = false
					//allPublishersVue.subject = 'Letter of Introduction and Publisher Record for ' 
					/*allPublishersVue.message = `Dear Brothers,
Please we would like to request the Congregation Publisher record as well as a letter of introduction for [Publisher], who is now residing within our congregation territory and is associating with our congregation.
Your brothers,
${congregationVue.congregation.congregationName} Congregation`*/
					await shortWait()
					auto_grow(document.getElementById("publisherRequest").Subject);
					auto_grow(document.getElementById("publisherRequest").Message);
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

				allPublishersVue.request = false
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
	fieldServiceGroupsVue.display = false
    configurationVue.display = false
	monthlyReportVue.display = false
	missingReportVue.display = false
	attendanceVue.display = false
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
				<div v-for="(publisher, count) in category.value" :key="publisher + '|' + count" v-if="(publisher.fieldServiceGroup == selectedGroup || selectedGroup == 'All Groups') && publisher.name.toLowerCase().includes(searchTerms.toLowerCase())" class="w3-col l3 m6 w3-margin-bottom">
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
				<div v-for="(publisher, count) in activePublishers" v-if="publisher.fieldServiceGroup == group && (group == selectedGroup || selectedGroup == 'All Groups') && publisher.name.toLowerCase().includes(searchTerms.toLowerCase())" :key="publisher + '|' + count" class="w3-col l3 m6 w3-margin-bottom">
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
			<div v-for="(publisher, count) in inactivePublishers" :key="publisher + '|' + count" v-if="(publisher.fieldServiceGroup == selectedGroup || selectedGroup == 'All Groups') && publisher.name.toLowerCase().includes(searchTerms.toLowerCase())" class="w3-col l3 m6 w3-margin-bottom">
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
	<div v-if="request == true">
		<h2 class="w3-center">REQUEST RECORD</h2>
		<form action="javascript:void(0)" id="publisherRequest">
			<p><input v-model="publisherName" class="w3-input w3-border" type="text" placeholder="Publisher Name" required name="Name"></p>
			<p><input class="w3-input w3-border" type="text" placeholder="Congregation Email" required name="Email"></p>
			<p><textarea class="w3-input w3-border" type="text" placeholder="Subject" required name="Subject" :value="subject()"></textarea></p>
			<p><textarea class="w3-input w3-border" placeholder="Message" required name="Message" :value="message()"></textarea></p>
			<p>
				<button @click="sendMessage()" class="w3-button w3-black" type="submit">
					<i class="fa fa-paper-plane"></i> SEND MESSAGE
				</button>
			</p>
		</form>
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
            request: false,
            publisherName: '',
            categories: [],
            hopes: ['Anointed', 'Other Sheep', 'Unbaptized Publisher'],
            privileges: ['Elder', 'Ministerial Servant', 'Regular Pioneer', 'Special Pioneer', 'Field Missionary'],
            months: [{"abbr": "sept", "fullName": "September"}, {"abbr": "oct", "fullName": "October"}, {"abbr": "nov", "fullName": "November"}, {"abbr": "dec", "fullName": "December"}, {"abbr": "jan", "fullName": "January"}, {"abbr": "feb", "fullName": "February"}, {"abbr": "mar", "fullName": "March"}, {"abbr": "apr", "fullName": "April"}, {"abbr": "may", "fullName": "May"}, {"abbr": "jun", "fullName": "June"}, {"abbr": "jul", "fullName": "July"}, {"abbr": "aug", "fullName": "August"} ],
        },
        computed: {
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
				/*this.allGroups.forEach(elem=>{
					const groupPublishers = this.publishers.filter(elem=>elem.fieldServiceGroup == elem)
					console.log(groupPublishers,elem,this.publishers)
					categories.push({"name": elem,"value": groupPublishers})
				})*/
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
			publisherName: 'auto_grow'
		},
        methods: {
			auto_grow() {
				auto_grow(document.getElementById("publisherRequest").Subject);
				auto_grow(document.getElementById("publisherRequest").Message);
			},
			async sendMessage() {
				console.log('Message')
				const messageContent = document.getElementById("publisherRequest")
				var recipient = messageContent.Email.value;
				var subject = messageContent.Subject.value;
				var body = messageContent.Message.value;
				var mailtoLink = 'mailto:' + encodeURIComponent(recipient) +
								'?cc=' + encodeURIComponent(congregationVue.congregation.email) +
								'&subject=' + encodeURIComponent(subject) +
								'&body=' + encodeURIComponent(body);

				await shortWait()

				document.getElementById("publisherRequest").Name.value = ''
				document.getElementById("publisherRequest").Email.value = ''
				allPublishersVue.publisherName = ''

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
			subject() {
				return 'Letter of Introduction and Publisher Record for ' + this.publisherName
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


document.querySelector('#fieldServiceGroups').innerHTML = `<template>
	<div v-if="display == true">
		<h2 class="w3-center">FIELD SERVICE GROUPS</h2>
		<div class="w3-row-padding w3-grayscale" style="margin-top:4px">
			<div v-for="(group) in allGroups" :key="group" class="w3-col l3 m6 w3-margin-bottom">
				<div :class="mode()">
					<div class="w3-container main">
						<h3 class="w3-center">{{ group }}</h3>
						<hr>
						<h5 v-for="(publisher, count) in groupPublishers(group)" :key="publisher + '|' + count" style="cursor:pointer" v-if="(publisher.fieldServiceGroup == selectedGroup || selectedGroup == 'All Groups') && publisher.name.toLowerCase().includes(searchTerms.toLowerCase())">{{ count + 1 }} | {{ publisher.name }}</h5>
					</div>
				</div>
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
				<div v-for="(publisher, count) in groupPublishers(group)" :key="publisher + '|' + count" style="cursor:pointer" v-if="publisher.fieldServiceGroup == group && (publisher.name.toLowerCase().includes(searchTerms.toLowerCase()))" class="w3-col l3 m6 w3-margin-bottom">
					<div :class="mode()">
						<h5 @click="publisherDetail($event.target, publisher)" style="padding:10px 15px;margin:0">{{ publisher.name }}</h5>
						<div class="w3-container main" style="padding:0 15px">
							<p v-if="publisher.contactInformation.phoneNumber !== null" v-for="(number) in getEachNumber(publisher.contactInformation.phoneNumber)" @click="call(number)" title="Call Number"><i class="fas fa-phone"></i> {{ number }}</p>
							<p v-if="publisher.contactInformation.address !== null" title="Address"><i class="fas fa-home"></i> {{ publisher.contactInformation.address }}</p>
							<p v-if="publisher.emergencyContactInformation.name !== null" title="Emergency Contact"><i class="fas fa-user"></i> {{ publisher.emergencyContactInformation.name }}</p>
							<p v-if="publisher.emergencyContactInformation.phoneNumber !== null" v-for="(number) in getEachNumber(publisher.emergencyContactInformation.phoneNumber)" @click="call(number)" title="Call Emergency Number"><i class="fas fa-address-book"></i> {{ number }}</p>
						</div>
						<div class="detail" style="display:none; padding:0 15px 15px 15px">
							<p><label>Phone Number: <input :class="inputMode('contactInformation w3-input')" type="tel" :value="publisher.contactInformation.phoneNumber" @change="handleInputChange($event.target, publisher, 'phoneNumber')"></label></p>
							<p><label>Address:<input :class="inputMode('contactInformation w3-input')" type="text" :value="publisher.contactInformation.address" @change="handleInputChange($event.target, publisher, 'address')"></label></p>
							<p><label>Emergency Contact: <input :class="inputMode('emergencyContactInformation w3-input')" type="text" :value="publisher.emergencyContactInformation.name" @change="handleInputChange($event.target, publisher, 'name')"></label></p>
							<p><label>Contact Number: <input :class="inputMode('emergencyContactInformation w3-input')" type="tel" :value="publisher.emergencyContactInformation.phoneNumber" @change="handleInputChange($event.target, publisher, 'phoneNumber')"></label></p>
						</div>
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
                return allPublishersVue.publishers.filter(elem=>elem.fieldServiceGroup == group)
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
                if (item.parentNode.className == 'main') {
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
					record[`${event.className}`] = true
				} else {
					record[`${event.className}`] = null
				}
				DBWorker.postMessage({ storeName: 'data', action: "save", value: [publisher]});
				//console.log(publisher, event, event.checked, publisher[`${event.className}`])
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
					if (event.className !== 'remarks') {
						event.value == '0' ? record[`${event.className}`] = null : record[`${event.className}`] = Number(event.value)
					} else {
						record[`${event.className}`] = event.value
					}
				} else {
					record[`${event.className}`] = null
				}
				//console.log(record, publisher)
				DBWorker.postMessage({ storeName: 'data', action: "save", value: [publisher]});
				//console.log(publisher, event, event.checked, publisher[`${event.className}`])
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
					publisher.report.currentServiceYear[`${month.abbr}`][`${event.className}`] = true
				} else {
					publisher.report.currentServiceYear[`${month.abbr}`][`${event.className}`] = null
				}
				DBWorker.postMessage({ storeName: 'data', action: "save", value: [publisher]});
				//console.log(publisher, event, event.checked, publisher[`${event.className}`])
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
					if (event.className !== 'remarks') {
						event.value == '0' ? publisher.report.currentServiceYear[`${month.abbr}`][`${event.className}`] = null : publisher.report.currentServiceYear[`${month.abbr}`][`${event.className}`] = Number(event.value)
					} else {
						publisher.report.currentServiceYear[`${month.abbr}`][`${event.className}`] = event.value
					}
				} else {
					publisher.report.currentServiceYear[`${month.abbr}`][`${event.className}`] = null
				}
				//console.log(record, publisher)
				DBWorker.postMessage({ storeName: 'data', action: "save", value: [publisher]});
				//console.log(publisher, event, event.checked, publisher[`${event.className}`])
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
		<h2 v-if="reportEntry == true" class="w3-center">ATTENDANCE RECORD</h2>
		<div v-if="reportEntry == true" v-for="(meeting, count) in meetingAttendanceRecord.meetings" :key="meeting.name + '|' + count" class="w3-row-padding w3-grayscale">
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
            reportEntry() {
                return reportEntry
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
					attendance[`${event.className}`] = null
				} else {
					attendance[`${event.className}`] = Number(event.value)
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

document.querySelector('#configuration').innerHTML = `<template>
    <div v-if="display == true">
		<h2 class="w3-center">SETTINGS</h2>
		<div class="w3-row-padding w3-grayscale">
			<div class="w3-margin-bottom">
				<div :class="mode()">
					<div class="w3-container">
						<h3 v-if="reportEntry() && reset !== true" contenteditable="true" class="name">{{ configuration.congregationName }}</h3>
						<h4 v-if="reportEntry() && reset !== true" contenteditable="true" class="address">{{ configuration.address }}</h4>
						<h4 v-if="reportEntry() && reset !== true" contenteditable="true" class="email">{{ configuration.email }}</h4>
						<h4 v-if="reportEntry() && reset !== true" v-for="group in configuration.fieldServiceGroups" :key="group" contenteditable="true" class="fieldServiceGroups">{{ group }}</h>
						<h4 id="status1"></h4>
						<h4 id="status2"></h4>
						<h4 id="status3"></h4>
						<p v-if="reportEntry()">
							<button :class="buttonMode('w3-button w3-dark-grey')" @click="addGroup($event.target)" title="Add Field Service Group">Add Group</button>
							<button :class="buttonMode('w3-button w3-dark-grey')" @click="removeGroup($event.target)" title="Remove Field Service Group">Remove Group</button>
						</p>
						<label>Appearance: 
						<select @change="displayMode($event.target)" :class="inputMode('appearance w3-input')">
							<option :value="currentMode()">{{ currentMode() }}</option>
							<option v-for="mode in ['System', 'Light', 'Dark'].filter(elem=>elem !== currentMode())" :value="mode">{{ mode }}</option>
						</select></label>
						<p>
							<button v-if="reportEntry()" :class="buttonMode('w3-button w3-dark-grey')" @click="saveConfiguration($event.target)"><i class="fas fa-save"> </i> Save</button>
							<button :class="buttonMode('w3-button w3-dark-grey')" @click="resetConfiguration($event.target)">Reset</button>
							<button :class="buttonMode('w3-button w3-dark-grey')" @click="backupData($event.target)">Backup</button>
						</p>
						<p v-if="reportEntry()">
							<button :class="buttonMode('w3-button w3-dark-grey')" @click="saveFile()"><i class="fas fa-save"> </i> Save File</button>
							<input type="file" id="pdfFile" accept=".pdf">
						</p>
						<div>
							<div class="main">
								<button v-if="reportEntry()" :class="buttonMode('w3-button w3-dark-grey')" @click="publisherDetail($event.target)">New Publisher</button>
								<button :class="buttonMode('w3-button w3-dark-grey')" @click="reloadPage()">Reload</button>
							</div>
							<div v-if="reportEntry()" class="detail" style="display:none; border: 1px solid gray; padding:5px">
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
						</div>
						<p>
							<label v-if="reportEntry()"><input class="export" type="checkbox" checked="true"> All</label>
							<button :class="buttonMode('w3-button w3-dark-grey')" @click="exportData()">Export</button>
							<button :class="buttonMode('w3-button w3-dark-grey')" @click="importData()">Import</button>
							<hr>
							<input type="file" id="dataFile" accept=".txt">
						</p>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>`

function processConfiguration() {

    configurationVue = new Vue({
        el: document.querySelector('#configuration'),
        data: {
            configuration: {},
            display: false,
            reset: false,
			publisher: {},
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
			reportEntry() {
				return reportEntry
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
            exportData() {
                var a = document.createElement("a");
				var file;
				if (document.querySelector('.export').checked)  {
					file = new Blob([JSON.stringify({"configuration":configurationVue.configuration, "data":allPublishersVue.publishers, "attendance": [attendanceVue.currentMonth, attendanceVue.meetingAttendanceRecord]})], {type: 'text/plain'});
				} else {
					var currentConfiguration = JSON.parse(JSON.stringify(configurationVue.configuration))
					delete currentConfiguration.address
					delete currentConfiguration.email
					var currentData = JSON.parse(JSON.stringify(allPublishersVue.publishers))
					currentData.forEach(elem=>{
						delete elem.contactInformation
						delete elem.dateOfBaptism
						delete elem.dateOfBirth
						delete elem.emergencyContactInformation
					})
					file = new Blob([JSON.stringify({"configuration":currentConfiguration, "data":currentData, "attendance": [attendanceVue.currentMonth, attendanceVue.meetingAttendanceRecord]})], {type: 'text/plain'});
				}
				a.href = URL.createObjectURL(file);
				
				a.download = 'congData-' + new Date() + '.txt';
				a.click();
				//window.indexedDB.deleteDatabase('congRec');
            },
            importData() {
				if (!document.querySelector('#dataFile').files[0]) {
					alert('Please select file to import')
					return
				}
                var reader = new FileReader();

				// When the FileReader has loaded the file...
				reader.onload = function() {
					var result = JSON.parse(this.result)
					configurationVue.configuration = result.configuration
					navigationVue.allGroups = result.configuration.fieldServiceGroups
					allPublishersVue.publishers = result.data
					attendanceVue.currentMonth = result.attendance[0]
					attendanceVue.meetingAttendanceRecord = result.attendance[1]

					DBWorker.postMessage({ storeName: 'configuration', action: "save", value: [result.configuration]});
					DBWorker.postMessage({ storeName: 'data', action: "save", value: result.data});
					DBWorker.postMessage({ storeName: 'attendance', action: "save", value: result.attendance});
                	configured = true
					if (currentUser.accesses.includes('secretary')) {
						gotoView('congregationVue')
					} else if (currentUser.accesses.includes('sendReport')) {
						gotoView('missingReportVue')
					}
				}
				
				// Read the file content as a single string
				reader.readAsText(document.querySelector('#dataFile').files[0]);
            },
			saveConfiguration(element) {
                /*if (configured = true) {
                    DBWorker.postMessage({ storeName: 'configuration', action: "deleteItem", value: this.configuration.name});
                }*/
                
                var allGroups = []
                element.parentNode.querySelectorAll('.fieldServiceGroups').forEach(elem=>{
                    allGroups.push(elem.innerHTML)
                })

                allGroups.sort()

                this.configuration = {"name": "Congregation", "congregationName": element.parentNode.querySelector('.name').innerHTML, "address": element.parentNode.querySelector('.address').innerHTML, "email": element.parentNode.querySelector('.email').innerHTML, "fieldServiceGroups": allGroups}
                DBWorker.postMessage({ storeName: 'configuration', action: "save", value: [this.configuration]});
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
				item.parentNode.querySelector('.name').innerHTML = 'Publisher Name'
				item.parentNode.querySelector('.dateOfBirth').value = ''
				item.parentNode.querySelector('.dateOfBaptism').value = ''
				item.parentNode.querySelector('.gender').value = 'Select Gender'
                item.parentNode.querySelector('.hope').value = 'Unbaptized Publisher'
                item.parentNode.querySelector('.fieldServiceGroup').value = ''
				item.parentNode.parentNode.querySelectorAll('.privileges').forEach(elem=>{
					elem.checked = false
				})
                item.parentNode.querySelector('.contactAddress').value = ''
                item.parentNode.querySelector('.contactPhoneNumber').value = ''
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
                if (item.parentNode.className == 'main') {
                    item.parentNode.parentNode.querySelector('.main').style.display = 'none'
                    item.parentNode.parentNode.querySelector('.detail').style.display = ''
                } else {
                    if (item.parentNode.querySelector('.name').innerHTML) {
                        publisher.name = item.parentNode.querySelector('.name').innerHTML
                    } else {
						alert('Please enter Publisher Name')
						return
					}
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

                    publisher.contactInformation.address = item.parentNode.querySelector('.contactAddress').value
                    publisher.contactInformation.phoneNumber = item.parentNode.querySelector('.contactPhoneNumber').value
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
processConfiguration()
processCongregation()

processFieldServiceGroups()
processMonthlyReport()
processMissingReport()
processAttendance()
contactInformation()
branchReportDetails()
configurationVue.displayMode({"value": "System"})

var defaultConfiguration = {"congregationName": "Congregation Name", "name": "Congregation", "address": "Congregation Address", "email": "Congregation Email", "fieldServiceGroups": ["Group 1", "Group 2", "Group 3"]}

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
    fieldServiceGroupsVue.pdfFile = URL.createObjectURL(file);
    /*a.href = URL.createObjectURL(file);
    
    //a.download = fileName;
    //a.click();*/
};

async function fillPublisherRecord(publisher) {
    // Get the form field by name
    //const fieldName = fieldNameInput.value;
    const name = s21.getForm().getTextField('900_1_Text_SanSerif');
    const dateOfBirth = s21.getForm().getTextField('900_2_Text_SanSerif');
    const dateOfBaptism = s21.getForm().getTextField('900_5_Text_SanSerif');
    const male = s21.getForm().getCheckBox('900_3_CheckBox');
    const female = s21.getForm().getCheckBox('900_4_CheckBox');

    name.setText(publisher.name)
    dateOfBirth.setText(publisher.dateOfBirth)
    dateOfBaptism.setText(publisher.dateOfBaptism)
    if (publisher.gender == "Male") {
        male.check()
        female.uncheck()
    } else if (publisher.gender == "Female") {
        male.uncheck()
        female.check()
    }
    //name.setText(publisher.name)
    //name.setText(publisher.name)
    // Save the modified PDF
    const modifiedPdfBytes = await s21.save();
    download(modifiedPdfBytes, publisher.name + ".pdf", "application/pdf");
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
    

    const name = s21.getForm().getTextField('900_1_Text_SanSerif');
    const dateOfBirth = s21.getForm().getTextField('900_2_Text_SanSerif');
    const dateOfBaptism = s21.getForm().getTextField('900_5_Text_SanSerif');
    const male = s21.getForm().getCheckBox('900_3_CheckBox');
    const female = s21.getForm().getCheckBox('900_4_CheckBox');

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

var s21, s21form;

async function getFieldByName() {
    const fileInput = document.getElementById('pdfFile');
    const file = fileInput.files[0];

    if (file) {
        const reader = new FileReader();

        reader.onload = async function (e) {
            const pdfData = new Uint8Array(e.target.result);

            // Using pdf-lib to load the PDF document
            s21 = await PDFLib.PDFDocument.load(pdfData);
        };

        reader.readAsArrayBuffer(file);
    }
}
