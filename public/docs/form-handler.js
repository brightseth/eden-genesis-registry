/**
 * Registry Form Handler
 * Client-side JavaScript for Registry-integrated forms
 */

// Agent Creation Form Handler
function initializeAgentCreationForm() {
  const form = document.getElementById('agentCreationForm');
  if (!form) return;

  // Auto-format handle field
  const handleInput = document.getElementById('handle');
  if (handleInput) {
    handleInput.addEventListener('input', function(e) {
      e.target.value = e.target.value.toLowerCase().replace(/[^a-z0-9]/g, '');
    });
  }

  form.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const formData = new FormData(this);
    const submitButton = form.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    
    try {
      // Show loading state
      submitButton.disabled = true;
      submitButton.textContent = '🔄 Creating Agent...';
      
      // Collect form data
      const data = {
        handle: formData.get('handle'),
        displayName: formData.get('displayName'),
        role: formData.get('role'),
        tagline: formData.get('tagline'),
        statement: formData.get('statement'),
        dailyGoal: formData.get('dailyGoal'),
        medium: formData.getAll('medium'),
        cohortSlug: 'genesis' // Default cohort
      };

      // Validate required fields
      if (!data.handle || !data.displayName || !data.role || !data.statement || !data.dailyGoal) {
        alert('Please fill in all required fields.');
        return;
      }

      // Submit to Registry
      const response = await fetch('/api/v1/agents', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      });

      const result = await response.json();

      if (response.ok) {
        // Success!
        alert(`🎉 Agent created successfully!\n\n` +
              `Agent: ${result.displayName} (@${result.handle})\n` +
              `Agent Number: ${result.agentNumber || 'Pending'}\n` +
              `Status: ${result.status}\n\n` +
              `Your agent has been registered in the Eden Registry!`);
        
        // Redirect to docs
        window.location.href = '/docs';
      } else {
        // Error handling
        console.error('Registration failed:', result);
        alert(`❌ Agent creation failed:\n\n${result.error || 'Unknown error occurred'}\n\nPlease try again.`);
      }

    } catch (error) {
      console.error('Form submission error:', error);
      alert('❌ Network error occurred. Please check your connection and try again.');
    } finally {
      // Reset button
      submitButton.disabled = false;
      submitButton.textContent = originalText;
    }
  });
}

// Trainer Application Form Handler
function initializeTrainerApplicationForm() {
  const form = document.getElementById('trainerApplicationForm');
  if (!form) return;

  form.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const formData = new FormData(this);
    const submitButton = form.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    
    try {
      // Show loading state
      submitButton.disabled = true;
      submitButton.textContent = '🔄 Submitting Application...';
      
      // Get selected trainee
      const selectedTrainee = formData.get('traineeId');
      if (!selectedTrainee) {
        alert('Please select an agent to train.');
        return;
      }

      // Collect form data
      const data = {
        track: 'TRAINER',
        applicantName: formData.get('trainerName'),
        applicantEmail: formData.get('contactInfo'),
        programName: formData.get('programName'),
        duration: formData.get('duration'),
        methodology: formData.get('methodology'),
        goals: formData.get('goals'),
        experience: formData.get('experience'),
        commitment: formData.get('commitment'),
        background: formData.get('background'),
        traineeId: selectedTrainee,
        customData: {
          type: 'TRAINER_APPLICATION',
          traineeId: selectedTrainee,
          programDetails: {
            name: formData.get('programName'),
            duration: formData.get('duration'),
            methodology: formData.get('methodology'),
            goals: formData.get('goals'),
            timeCommitment: formData.get('commitment')
          },
          trainerInfo: {
            name: formData.get('trainerName'),
            experience: formData.get('experience'),
            background: formData.get('background'),
            contactInfo: formData.get('contactInfo')
          }
        }
      };

      // Validate required fields
      const requiredFields = ['applicantName', 'programName', 'duration', 'methodology', 'goals', 'experience', 'commitment', 'background'];
      const missingFields = requiredFields.filter(field => !data[field]);
      
      if (missingFields.length > 0) {
        alert('Please fill in all required fields.');
        return;
      }

      // Submit to Registry
      const response = await fetch('/api/v1/applications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      });

      const result = await response.json();

      if (response.ok) {
        // Success!
        alert(`🎉 Trainer application submitted successfully!\n\n` +
              `Application ID: ${result.id}\n` +
              `Status: ${result.status}\n` +
              `Program: ${data.programName}\n\n` +
              `You will receive a confirmation email and next steps within 2-3 business days.`);
        
        // Redirect to docs
        window.location.href = '/docs';
      } else {
        // Error handling
        console.error('Application failed:', result);
        alert(`❌ Application submission failed:\n\n${result.error || 'Unknown error occurred'}\n\nPlease try again.`);
      }

    } catch (error) {
      console.error('Form submission error:', error);
      alert('❌ Network error occurred. Please check your connection and try again.');
    } finally {
      // Reset button
      submitButton.disabled = false;
      submitButton.textContent = originalText;
    }
  });
}

// Initialize forms when page loads
document.addEventListener('DOMContentLoaded', function() {
  initializeAgentCreationForm();
  initializeTrainerApplicationForm();
  
  console.log('📝 Registry form handlers initialized');
  console.log('🔗 Connected to Eden Registry:', window.location.origin);
});