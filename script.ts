// Add this at the top of your TypeScript file
declare var html2pdf: any;

// Get references to the form and display area
const Form = document.getElementById('resume-form') as HTMLFormElement;
const ResumeDisplayElement = document.getElementById('resume-display') as HTMLDivElement;
const ShareableLinkContainer = document.getElementById('shareable-link-container') as HTMLDivElement;
const ShareableLinkElement = document.getElementById('shareable-link') as HTMLAnchorElement;
const DownloadPdfButton = document.getElementById('download-pdf') as HTMLButtonElement;

// Function to generate resume content dynamically
const GenerateResumeContent = (data: any) => {
    return `
        <h2>${data.name}</h2>
        <p><strong>Email:</strong> ${data.email}</p>
        <p><strong>Phone:</strong> ${data.phone}</p>
        <h3>Education</h3>
        <p>${data.education}</p>
        <h3>Experience</h3>
        <p>${data.experience}</p>
        <h3>Skills</h3>
        <p>${data.skills}</p>
    `;
};

// Handle form submission
Form.addEventListener('submit', (event: Event) => {
    event.preventDefault(); // prevent page reload

    // Collect input values
    const username = (document.getElementById('username') as HTMLInputElement).value;
    const name = (document.getElementById('name') as HTMLInputElement).value;
    const email = (document.getElementById('email') as HTMLInputElement).value;
    const phone = (document.getElementById('phone') as HTMLInputElement).value;
    const education = (document.getElementById('education') as HTMLTextAreaElement).value;
    const experience = (document.getElementById('experience') as HTMLTextAreaElement).value;
    const skills = (document.getElementById('skills') as HTMLTextAreaElement).value;

    // Save form data in localStorage with the username as the key
    const resumeData = {
        name,
        email,
        phone,
        education,
        experience,
        skills
    };
    localStorage.setItem(username, JSON.stringify(resumeData)); // Saving the data locally

    // Display the resume content
    ResumeDisplayElement.innerHTML = generateResumeContent(resumeData);

    // Generate a shareable link to the same page with the user query parameter
    const shareableLink = `${window.location.origin}${window.location.pathname}?user=${username}`;
    ShareableLinkElement.href = shareableLink;
    ShareableLinkElement.textContent = shareableLink;
    ShareableLinkContainer.style.display = 'block';

    // Enable the download PDF button
    DownloadPdfButton.disabled = false;
});

// Function to get query parameters
function GetQueryParams(param: string): string | null {
    const params = new URLSearchParams(window.location.search);
    return params.get(param);
}


const UsernameFromQuery = getQueryParams('user');

if (usernameFromQuery) {
    const savedResumeData = localStorage.getItem(usernameFromQuery);
    if (savedResumeData) {
        const resumeData = JSON.parse(savedResumeData);
        ResumeDisplayElement.innerHTML = generateResumeContent(resumeData);
        ShareableLinkContainer.style.display = 'block'; // Show shareable link and download options
    } else {
        alert('No resume found for this user.');
    }
}

// Handle PDF download
DownloadPdfButton.addEventListener('click', () => {
    // Use html2pdf to generate the PDF from the resume display element
    const opt = {
        margin:       1,
        filename:     'resume.pdf',
        image:        { type: 'jpeg', quality: 0.98 },
        html2canvas:  { scale: 2 },
        jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
    };

    html2pdf().from(resumeDisplayElement).set(opt).save();
});