// script.js (Content Block Functionality for EDS)

document.addEventListener('DOMContentLoaded', () => {
  // Get references to the HTML elements where content will be injected.
  // These IDs (blockTitle, blockDescription, blockButton) must match the IDs
  // that your EDS component template outputs in the HTML.
  const blockTitleElement = document.getElementById('blockTitle');
  const blockDescriptionElement = document.getElementById('blockDescription');
  const blockButtonElement = document.getElementById('blockButton');

  /**
   * Renders the Content Block with the provided data. This function
   * takes the structured content and injects it into the appropriate
   * HTML elements.
   * @param {object} data - An object containing the content for the block.
   * @param {string} data.title - The title text for the block.
   * @param {string} data.description - The main descriptive text.
   * @param {string} [data.buttonText] - Optional text for the call-to-action button.
   * @param {string} [data.buttonLink] - Optional URL for the button's action.
   */
  function renderContentBlock(data) {
      // Update the title if the element exists and data is provided
      if (blockTitleElement && data.title) {
          blockTitleElement.textContent = data.title;
      } else {
          console.warn("Content Block: Title element or content data.title not found. Using default.");
          if (blockTitleElement) blockTitleElement.textContent = "Default Component Title";
      }

      // Update the description if the element exists and data is provided
      if (blockDescriptionElement && data.description) {
          blockDescriptionElement.textContent = data.description;
      } else {
          console.warn("Content Block: Description element or content data.description not found. Using default.");
          if (blockDescriptionElement) blockDescriptionElement.textContent = "Default description text for the component.";
      }

      // Handle the button: show/hide and attach click event
      if (blockButtonElement) {
          if (data.buttonText) {
              blockButtonElement.textContent = data.buttonText;
              blockButtonElement.style.display = 'block'; // Ensure button is visible

              // IMPORTANT: Re-clone the button to safely remove any previously attached
              // event listeners before adding a new one. This prevents duplicate event
              // handlers if renderContentBlock is called multiple times (e.g., during authoring previews).
              const newButton = blockButtonElement.cloneNode(true);
              blockButtonElement.parentNode.replaceChild(newButton, blockButtonElement);

              newButton.addEventListener('click', () => {
                  if (data.buttonLink) {
                      console.log('Content Block: Navigating to:', data.buttonLink);
                      // In a production environment, you would typically use:
                      // window.location.href = data.buttonLink; // Navigate to the specified link
                  }
                  // Provide user feedback without using alert()
                  showTemporaryMessage(`Action: "${data.buttonText}" clicked!`);
              });
          } else {
              blockButtonElement.style.display = 'none'; // Hide button if no text is provided in content
          }
      }
  }

  /**
   * Displays a temporary, non-blocking message box on the screen.
   * This function serves as a user-friendly alternative to `alert()`,
   * which is often blocked or disruptive in EDS environments.
   * @param {string} message - The message to display.
   */
  function showTemporaryMessage(message) {
      const messageBox = document.createElement('div');
      messageBox.style.cssText = `
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background-color: #4CAF50; /* A pleasant green */
          color: white;
          padding: 15px 25px;
          border-radius: 8px;
          box-shadow: 0 4px 8px rgba(0,0,0,0.2);
          z-index: 1000; /* Ensure it's above other content */
          opacity: 0; /* Start hidden for fade-in effect */
          transition: opacity 0.3s ease-in-out; /* Smooth fade effect */
          font-family: 'Inter', sans-serif;
          text-align: center;
      `;
      messageBox.textContent = message;
      document.body.appendChild(messageBox);

      // Trigger fade-in after a slight delay to allow CSS transition to apply
      setTimeout(() => {
          messageBox.style.opacity = 1;
      }, 10);

      // Fade out and remove the message box after a set duration
      setTimeout(() => {
          messageBox.style.opacity = 0;
          // Remove element from DOM after fade-out transition completes
          messageBox.addEventListener('transitionend', () => messageBox.remove());
      }, 2000); // Message displayed for 2 seconds
  }

  /**
   * Simulates fetching "raw content" for a specific Content Block instance.
   *
   * In a real Adobe EDS project:
   * - This `fetch` call would target an API endpoint provided by your CMS
   * (e.g., AEM, Contentful, etc.) that delivers content authored in Google Docs
   * or a similar content platform.
   * - The `blockId` would be a unique identifier for that specific instance
   * of the component on the page, often passed via a data attribute on the
   * main component HTML element (e.g., `<div id="edsContentBlock" data-block-id="my-unique-block">`).
   * - The `blockId` would be used by the API to retrieve the correct content.
   *
   * @param {string} blockId - A unique identifier for this content block instance.
   * @returns {Promise<object>} A promise that resolves with the content data.
   */
  async function fetchContentForBlock(blockId) {
      console.log(`Content Block: Simulating content fetch for block ID: "${blockId}"`);

      // --- MOCK DATA FOR DEMONSTRATION ---
      // This object simulates the JSON data structure that your actual
      // EDS content API would return, derived from content authored in Google Docs.
      const mockContentData = {
          'homepage-hero-block': {
              title: "Accelerate Your Digital Experience",
              description: "Leverage Adobe EDS components for rapid development and consistent brand presence across all your digital touchpoints. From design to deployment, streamline your workflow.",
              buttonText: "Discover Our Components",
              buttonLink: "/components"
          },
          'about-us-intro-block': {
              title: "Our Story: Innovation at Core",
              description: "Learn about our journey in pioneering digital solutions that empower businesses worldwide. We believe in crafting exceptional user experiences and solutions.",
              buttonText: "Meet the Team",
              buttonLink: "/about"
          },
          'contact-promo-block': {
              title: "Ready to Transform?",
              description: "Connect with our experts to discuss how our EDS can elevate your digital strategy. We're here to help you succeed, every step of the way.",
              buttonText: "Contact Us Today",
              buttonLink: "/contact"
          },
          'no-button-info-block': {
              title: "Important Update",
              description: "This content block provides vital updates and does not require a call-to-action button, focusing purely on conveying information."
              // Note: No 'buttonText' or 'buttonLink' means the button will be hidden by renderContentBlock.
          }
      };

      return new Promise(resolve => {
          // Simulate a network request delay
          setTimeout(() => {
              // Resolve with the mock data matching the blockId, or a fallback if not found.
              const data = mockContentData[blockId] || {
                  title: "Content Not Found (ID: " + blockId + ")",
                  description: "The content for this specific block could not be loaded. Please verify the block ID and content source configuration.",
                  buttonText: null
              };
              resolve(data);
          }, 500); // 500ms delay to simulate API call
      });
  }

  // --- Component Initialization Logic ---
  // The main container for the content block.
  // In an EDS context, this 'edsContentBlock' element would be rendered by the CMS.
  const mainContentBlockContainer = document.getElementById('edsContentBlock');

  if (mainContentBlockContainer) {
      // Attempt to get the unique block ID from a data attribute on the HTML element.
      // Example HTML: <div id="edsContentBlock" data-block-id="homepage-hero-block">...</div>
      // If no data-block-id is present, a default is used for demonstration/fallback.
      const blockId = mainContentBlockContainer.dataset.blockId || 'homepage-hero-block';

      // Fetch and render the content when the DOM is ready.
      fetchContentForBlock(blockId)
          .then(contentData => {
              renderContentBlock(contentData);
          })
          .catch(error => {
              console.error("Content Block: Failed to load content for block:", blockId, error);
              // Render with an error message if fetching fails
              renderContentBlock({
                  title: "Error Loading Content",
                  description: "An unexpected error occurred while fetching the content for this block. Please contact support.",
                  buttonText: null
              });
          });
  } else {
      console.error("Content Block: Main container element with ID 'edsContentBlock' not found. Ensure your EDS template renders this element.");
  }
});