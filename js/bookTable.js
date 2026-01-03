document.addEventListener('DOMContentLoaded', function() {
    const bookingForm = document.querySelector('.booking-form');
    
    if (bookingForm) {
        bookingForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const fullName = document.getElementById('fullName').value.trim();
            const phone = document.getElementById('phone').value.trim();
            const guests = document.getElementById('guests').value;
            const date = document.getElementById('date').value;
            const time = document.getElementById('time').value;
            
            // Validate all fields
            if (!fullName || !phone || !guests || !date || !time) {
                showMessage('Please fill in all fields', 'error');
                highlightEmptyFields();
                return;
            }
            
            // Validate phone number (Moroccan format)
            const phoneRegex = /^(?:(?:\+|00)212|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/;
            if (!phoneRegex.test(phone)) {
                showMessage('Please enter a valid Moroccan phone number', 'error');
                document.getElementById('phone').focus();
                return;
            }
            
            // Validate date (not in the past)
            const selectedDate = new Date(date);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            
            if (selectedDate < today) {
                showMessage('Please select a future date', 'error');
                document.getElementById('date').focus();
                return;
            }
            
            // If all validations pass, send to WhatsApp
            sendWhatsAppReservation(fullName, phone, guests, date, time);
        });
        
        // Remove error highlights when user starts typing
        const formInputs = bookingForm.querySelectorAll('.form-input, .form-select');
        formInputs.forEach(input => {
            input.addEventListener('input', function() {
                this.style.borderColor = '#e0e0e0';
                this.style.boxShadow = 'none';
            });
        });
    }
    
    function highlightEmptyFields() {
        const requiredFields = ['fullName', 'phone', 'guests', 'date', 'time'];
        
        requiredFields.forEach(fieldId => {
            const field = document.getElementById(fieldId);
            if (!field.value.trim() && fieldId !== 'guests' && fieldId !== 'time') {
                field.style.borderColor = '#ff4757';
                field.style.boxShadow = '0 0 0 3px rgba(255, 71, 87, 0.1)';
            } else if ((fieldId === 'guests' || fieldId === 'time') && !field.value) {
                field.style.borderColor = '#ff4757';
                field.style.boxShadow = '0 0 0 3px rgba(255, 71, 87, 0.1)';
            }
        });
    }
    
    function sendWhatsAppReservation(fullName, phone, guests, date, time) {
        // Format date for display
        const formattedDate = new Date(date).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        
        // Format the message
        const message = `📋 *NEW TABLE RESERVATION* 📋
        
👤 *Customer Details:*
• Name: ${fullName}
• Phone: ${phone}

🪑 *Reservation Details:*
• Guests: ${guests} ${guests === '1' ? 'Person' : 'People'}
• Date: ${formattedDate}
• Time: ${time.charAt(0).toUpperCase() + time.slice(1)}

⏰ *Submitted:* ${new Date().toLocaleString()}`;
        
        // Encode the message for URL
        const encodedMessage = encodeURIComponent(message);
        const whatsappNumber = '0633908104';
        
        // Create WhatsApp URL
        const whatsappURL = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
        
        // Show loading state
        const submitBtn = document.querySelector('.submit-btn');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending...';
        submitBtn.disabled = true;
        
        // Open WhatsApp in new tab after a short delay for UX
        setTimeout(() => {
            // Reset button
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
            
            // Open WhatsApp
            window.open(whatsappURL, '_blank');
            
            // Show success message
            showMessage('Reservation sent successfully! Check your WhatsApp to complete the booking.', 'success');
            
            // Reset form
            bookingForm.reset();
            
            // Reset all input borders
            const formInputs = bookingForm.querySelectorAll('.form-input, .form-select');
            formInputs.forEach(input => {
                input.style.borderColor = '#e0e0e0';
                input.style.boxShadow = 'none';
            });
        }, 1500);
    }
    
    function showMessage(message, type) {
        // Remove any existing messages
        const existingMessage = document.querySelector('.form-message');
        if (existingMessage) {
            existingMessage.remove();
        }
        
        // Create message element
        const messageElement = document.createElement('div');
        messageElement.className = `form-message form-message-${type}`;
        
        // Add icon based on type
        let icon = '';
        if (type === 'success') {
            icon = '<i class="fa-solid fa-circle-check"></i>';
            messageElement.style.backgroundColor = 'rgba(6, 146, 62, 0.1)';
            messageElement.style.border = '1px solid var(--primary-green)';
            messageElement.style.color = 'var(--primary-green)';
        } else {
            icon = '<i class="fa-solid fa-circle-exclamation"></i>';
            messageElement.style.backgroundColor = 'rgba(255, 71, 87, 0.1)';
            messageElement.style.border = '1px solid #ff4757';
            messageElement.style.color = '#ff4757';
        }
        
        messageElement.innerHTML = `${icon} <span>${message}</span>`;
        
        // Style the message
        messageElement.style.padding = '15px 20px';
        messageElement.style.borderRadius = '12px';
        messageElement.style.margin = '20px 0';
        messageElement.style.display = 'flex';
        messageElement.style.alignItems = 'center';
        messageElement.style.gap = '10px';
        messageElement.style.fontSize = '0.95rem';
        messageElement.style.fontWeight = '500';
        messageElement.style.animation = 'fadeInUp 0.3s ease forwards';
        messageElement.style.opacity = '0';
        
        // Add to form (before submit button)
        const submitButton = bookingForm.querySelector('.confirm-booking-table');
        bookingForm.insertBefore(messageElement, submitButton);
        
        // Trigger animation
        setTimeout(() => {
            messageElement.style.opacity = '1';
        }, 10);
        
        // Auto-remove success messages after 5 seconds
        if (type === 'success') {
            setTimeout(() => {
                if (messageElement.parentNode) {
                    messageElement.style.opacity = '0';
                    setTimeout(() => {
                        if (messageElement.parentNode) {
                            messageElement.remove();
                        }
                    }, 300);
                }
            }, 5000);
        }
    }
    
    // Add animation for message
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(10px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        .form-message {
            transition: opacity 0.3s ease;
        }
        
        .submit-btn:disabled {
            opacity: 0.7;
            cursor: not-allowed;
        }
        
        .fa-spinner {
            animation: spin 1s linear infinite;
        }
        
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        
        /* Phone number formatting */
        #phone {
            font-family: monospace;
            letter-spacing: 1px;
        }
    `;
    document.head.appendChild(style);
    
    // Optional: Phone number formatting
    const phoneInput = document.getElementById('phone');
    if (phoneInput) {
        phoneInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            
            // Format Moroccan phone number: 06 55 88 99 10 45
            if (value.length > 0) {
                if (value.startsWith('0')) {
                    value = value.substring(0, 2) + ' ' + value.substring(2);
                }
                if (value.length > 5) {
                    value = value.substring(0, 5) + ' ' + value.substring(5);
                }
                if (value.length > 8) {
                    value = value.substring(0, 8) + ' ' + value.substring(8);
                }
                if (value.length > 11) {
                    value = value.substring(0, 11) + ' ' + value.substring(11);
                }
                if (value.length > 14) {
                    value = value.substring(0, 14) + ' ' + value.substring(14);
                }
            }
            
            e.target.value = value;
        });
    }
});