<script type="module">
    // !!! IMPORTANT: The actual API Key should be set here.
    // Replace "YOUR_GEMINI_API_KEY_HERE" with the key you were troubleshooting.
    // If you are still troubleshooting, use the temporary unrestricted key for testing.
    const API_KEY = "AIzaSyCmm4K0XzM_E0urMIE5oYTR6vvWVz0yIxA"; 
    const TEXT_MODEL = "gemini-2.5-flash-preview-09-2025";
    
    // --- API ENDPOINT CONFIGURATION ---
    // Note: The base URL remains the same for the Generative Language API
    const API_URL = https://generativelanguage.googleapis.com/v1beta/models/${TEXT_MODEL}:generateContent?key=${API_KEY};

    const MAX_RETRIES = 5;
    const INITIAL_BACKOFF = 1000;

    // --- DOM ELEMENTS ---
    const foodImageInput = document.getElementById('foodImageInput');
    const foodInput = document.getElementById('foodInput');
    const imagePreviewContainer = document.getElementById('imagePreviewContainer');
    const analyzeButton = document.getElementById('analyzeButton');
    const resultContainer = document.getElementById('resultContainer');
    const analysisResult = document.getElementById('analysisResult');
    const loadingIndicator = document.getElementById('loadingIndicator');
    const errorMessage = document.getElementById('errorMessage');

    let base64Image = null;

    // --- UTILITY FUNCTIONS ---

    function displayError(message) {
        errorMessage.textContent = message;
        errorMessage.classList.remove('hidden');
        resultContainer.classList.add('hidden');
    }

    function clearStatus() {
        errorMessage.classList.add('hidden');
        errorMessage.textContent = '';
        loadingIndicator.classList.add('hidden');
    }

    function showLoading(isLoading) {
        if (isLoading) {
            loadingIndicator.classList.remove('hidden');
            analyzeButton.disabled = true;
            analysisResult.innerHTML = '';
            resultContainer.classList.add('hidden');
            clearStatus();
        } else {
            loadingIndicator.classList.add('hidden');
            analyzeButton.disabled = false;
        }
    }

    // Converts a file to a Base64 string
    function fileToBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        });
    }

    // --- EVENT HANDLERS ---

    foodImageInput.addEventListener('change', async (event) => {
        const file = event.target.files[0];
        if (file) {
            // 1. Create Preview
            imagePreviewContainer.innerHTML = <img src="${URL.createObjectURL(file)}" class="max-w-full h-auto rounded-lg shadow-md max-h-48 object-cover" alt="Image preview">;
            
            // 2. Convert to Base64 for API
            const base64String = await fileToBase64(file);
            // Extract the actual base64 data part (remove "data:image/jpeg;base64,")
            base64Image = base64String.split(',')[1];
        } else {
            imagePreviewContainer.innerHTML = '';
            base64Image = null;
        }
    });

    analyzeButton.addEventListener('click', analyzeFood);

    // --- CORE LOGIC: API CALL ---
    
    async function callGeminiApi(payload) {
        let retries = 0;
        let delay = INITIAL_BACKOFF;

        while (retries < MAX_RETRIES) {
            try {
                const response = await fetch(API_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });

                if (!response.ok) {
                    throw new Error(HTTP error! status: ${response.status});
                }
                
                const result = await response.json();
                return result;

            } catch (error) {
                retries++;
                console.error(Attempt ${retries} failed:, error.message);
                if (retries >= MAX_RETRIES) {
                    throw new Error("Maximum retries reached. Failed to connect or process the request.");
                }
                // Exponential backoff
                await new Promise(resolve => setTimeout(resolve, delay));
                delay *= 2;
            }
        }
    }
</script>
</body>
</html>
