// Function to safely get extension URL
function getExtensionUrl(path) {
	try {
		return chrome.runtime.getURL(path)
	} catch (error) {
		console.error('Error getting extension URL:', error)
		return null
	}
}

// Create audio elements for the sounds
let approveSound = null
let revokeSound = null
try {
	const approveSoundUrl = getExtensionUrl('assets/confetti-pop-sound.mp3')
	const revokeSoundUrl = getExtensionUrl('assets/revoke-sound.mp3')
	if (approveSoundUrl) {
		approveSound = new Audio(approveSoundUrl)
	}
	if (revokeSoundUrl) {
		revokeSound = new Audio(revokeSoundUrl)
	}
} catch (error) {
	console.error('Error creating audio elements:', error)
}

// Function to create rain animation
function createRainAnimation() {
	const canvas = document.createElement('canvas')
	canvas.style.position = 'fixed'
	canvas.style.top = '0'
	canvas.style.left = '0'
	canvas.style.pointerEvents = 'none'
	canvas.style.width = '100%'
	canvas.style.height = '100%'
	canvas.style.zIndex = '999999'
	canvas.style.opacity = '0' // Start with zero opacity
	document.body.appendChild(canvas)

	const ctx = canvas.getContext('2d')
	canvas.width = window.innerWidth
	canvas.height = window.innerHeight

	const drops = []
	const dropCount = 200
	const rainColor = 'rgba(100, 100, 255, 0.5)'

	// Create rain drops
	for (let i = 0; i < dropCount; i++) {
		drops.push({
			x: Math.random() * canvas.width,
			y: Math.random() * canvas.height,
			length: Math.random() * 20 + 10,
			speed: Math.random() * 5 + 5,
		})
	}

	let animationFrame
	const duration = 5000 // 5 seconds total
	const fadeDuration = 1000 // 1 second for fade in/out
	const startTime = Date.now()

	function animate() {
		const currentTime = Date.now()
		const elapsed = currentTime - startTime

		if (elapsed >= duration) {
			cancelAnimationFrame(animationFrame)
			// Fade out the canvas
			canvas.style.transition = 'opacity 1s ease-out'
			canvas.style.opacity = '0'
			// Remove canvas after fade out
			setTimeout(() => {
				document.body.removeChild(canvas)
			}, 1000)
			return
		}

		// Calculate opacity based on elapsed time
		let opacity = 1
		if (elapsed < fadeDuration) {
			// Fade in
			opacity = elapsed / fadeDuration
		} else if (elapsed > duration - fadeDuration) {
			// Fade out
			opacity = (duration - elapsed) / fadeDuration
		}
		canvas.style.opacity = opacity

		ctx.clearRect(0, 0, canvas.width, canvas.height)
		ctx.strokeStyle = rainColor
		ctx.lineWidth = 2

		drops.forEach(drop => {
			ctx.beginPath()
			ctx.moveTo(drop.x, drop.y)
			ctx.lineTo(drop.x, drop.y + drop.length)
			ctx.stroke()

			drop.y += drop.speed
			if (drop.y > canvas.height) {
				drop.y = -drop.length
				drop.x = Math.random() * canvas.width
			}
		})

		animationFrame = requestAnimationFrame(animate)
	}

	// Start with fade in
	canvas.style.transition = 'opacity 1s ease-in'
	canvas.style.opacity = '1'
	animate()
}

// Function to trigger confetti animation
function triggerConfetti(event) {
	try {
		const button = event.currentTarget
		const buttonText = button.textContent.trim()

		if (buttonText === 'Approve' && typeof window.confetti === 'function') {
			const rect = button.getBoundingClientRect()

			// Calculate the center of the button
			const x = (rect.left + rect.right) / 2 / window.innerWidth
			const y = (rect.top + rect.bottom) / 2 / window.innerHeight

			// Create multiple confetti bursts
			const confettiBursts = [
				{ angle: 60, spread: 60 },
				{ angle: 120, spread: 60 },
				{ angle: 90, spread: 60 },
			]

			confettiBursts.forEach((burst, index) => {
				setTimeout(() => {
					window.confetti({
						particleCount: 80,
						spread: burst.spread,
						origin: { x, y },
						angle: burst.angle,
						ticks: 200,
						gravity: 0.3,
						scalar: 1.1,
						startVelocity: 30,
						decay: 0.9,
					})
				}, index * 100) // Stagger the bursts
			})

			// Play approve sound
			if (approveSound) {
				approveSound.currentTime = 0
				approveSound.play().catch(error => {
					console.error('Error playing approve sound:', error)
				})
			}
		} else if (buttonText === 'Revoke approval') {
			// Play revoke sound
			if (revokeSound) {
				revokeSound.currentTime = 0
				revokeSound.play().catch(error => {
					console.error('Error playing revoke sound:', error)
				})
			}
			// Show rain animation
			createRainAnimation()
		}
	} catch (error) {
		console.error('Error in button click handler:', error)
	}
}

// Function to check for approve button and add click handler
function setupApproveButton() {
	try {
		const approveButton = document.querySelector(
			'button[data-testid="approve-button"]'
		)
		if (approveButton && !approveButton.hasAttribute('data-confetti-added')) {
			approveButton.addEventListener('click', triggerConfetti)
			approveButton.setAttribute('data-confetti-added', 'true')
		}
	} catch (error) {
		console.error('Error setting up approve button:', error)
	}
}

// Function to check for merge button and add click handler
function setupMergeButton() {
	try {
		const mergeButton = document.querySelector(
			'button[data-testid="merge-button"]'
		)
		if (mergeButton && !mergeButton.hasAttribute('data-confetti-added')) {
			mergeButton.addEventListener('click', triggerConfetti)
			mergeButton.setAttribute('data-confetti-added', 'true')
		}
	} catch (error) {
		console.error('Error setting up merge button:', error)
	}
}

// Initial setup
setupApproveButton()
setupMergeButton()

// Watch for dynamic content changes
const observer = new MutationObserver(mutations => {
	try {
		setupApproveButton()
		setupMergeButton()
	} catch (error) {
		console.error('Error in mutation observer:', error)
	}
})

try {
	observer.observe(document.body, {
		childList: true,
		subtree: true,
	})
} catch (error) {
	console.error('Error setting up mutation observer:', error)
}

// Handle extension context invalidation
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
	if (message === 'extensionContextInvalidated') {
		// Reinitialize the extension
		setupApproveButton()
	}
})
