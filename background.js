// Background script
chrome.runtime.onInstalled.addListener(() => {
	console.log('Make Gitlab Great extension installed')
})

// Handle extension reload
chrome.runtime.onStartup.addListener(() => {
	console.log('Extension started')
})

// Handle extension update
chrome.runtime.onUpdateAvailable.addListener(() => {
	console.log('Extension update available')
	chrome.runtime.reload()
})

// Handle extension context invalidation
chrome.runtime.onSuspend.addListener(() => {
	console.log('Extension suspended')
})

// Listen for messages from content script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
	if (message === 'checkExtensionStatus') {
		sendResponse({ status: 'active' })
	}
})
