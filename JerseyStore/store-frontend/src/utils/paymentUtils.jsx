export const handleStripeCheckout = async (apiClient, cartId) => {
    try {
        // Path: /api/payment/ (singular) + create-checkout-session
        const res = await apiClient.post('/api/payment/create-checkout-session/', { 
            cart_id: cartId 
        });
        
        if (res.data.url) {
            window.location.href = res.data.url;
        }
    } catch (error) {
        console.error("Stripe Checkout Error:", error);
        alert(error.response?.data?.error || "Stripe checkout failed");
    }
};

export const handleEsewaCheckout = async (apiClient, cartId) => {
    try {
        /**
         * FIX: ACTION NAME MATCHING
         * Changed 'create-esewa-session' to 'process-esewa' to match 
         * the url_path defined in Django's PaymentView.
         */
        const res = await apiClient.post('/api/payment/process-esewa/', { 
            cart_id: cartId 
        });
        const data = res.data;

        // Persist cartId so the Success page can verify the order later
        localStorage.setItem('active_cart_id', cartId);

        // Create the auto-submitting form for eSewa redirection
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = data.esewa_url; // URL provided by backend (Sandbox or Live)

        Object.keys(data).forEach(key => {
            // Include all signed fields and signature, exclude the URL itself
            if (key !== 'esewa_url') {
                const input = document.createElement('input');
                input.type = 'hidden';
                input.name = key;
                input.value = data[key];
                form.appendChild(input);
            }
        });

        document.body.appendChild(form);
        form.submit();
    } catch (error) {
        console.error("eSewa Checkout Error:", error);
        const msg = error.response?.data?.error || "eSewa payment initiation failed";
        alert(msg);
    }
};